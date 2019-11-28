//
// Created by pengfei.zhou on 2019/11/28.
//

#import "DoricFlowLayoutNode.h"
#import "DoricFlowLayoutItemNode.h"
#import "DoricExtensions.h"
#import <JavaScriptCore/JavaScriptCore.h>

@interface DoricFlowLayoutViewCell : UICollectionViewCell
@property(nonatomic, strong) DoricFlowLayoutItemNode *viewNode;
@end

@implementation DoricFlowLayoutViewCell
@end

@interface DoricFlowLayoutView : UICollectionView
@end

@implementation DoricFlowLayoutView
- (CGSize)sizeThatFits:(CGSize)size {
    if (self.subviews.count > 0) {
        CGFloat width = size.width;
        CGFloat height = size.height;
        for (UIView *child in self.subviews) {
            CGSize childSize = [child measureSize:size];
            width = MAX(childSize.width, width);
            height = MAX(childSize.height, height);
        }
        return CGSizeMake(width, height);
    }
    return size;
}

- (void)layoutSelf:(CGSize)targetSize {
    [super layoutSelf:targetSize];
    [self reloadData];
}
@end

@interface DoricFlowLayoutNode () <UICollectionViewDataSource, UICollectionViewDelegateFlowLayout>
@property(nonatomic, strong) NSMutableDictionary <NSNumber *, NSString *> *itemViewIds;
@property(nonatomic, strong) NSMutableDictionary <NSNumber *, NSValue *> *itemSizeInfo;
@property(nonatomic, assign) NSUInteger itemCount;
@property(nonatomic, assign) NSUInteger batchCount;
@end

@implementation DoricFlowLayoutNode
- (instancetype)initWithContext:(DoricContext *)doricContext {
    if (self = [super initWithContext:doricContext]) {
        _itemViewIds = [NSMutableDictionary new];
        _itemSizeInfo = [NSMutableDictionary new];
        _batchCount = 15;
    }
    return self;
}

- (UICollectionView *)build {
    UICollectionViewFlowLayout *flowLayout = [[UICollectionViewFlowLayout alloc] init];
    [flowLayout setScrollDirection:UICollectionViewScrollDirectionVertical];

    return [[[DoricFlowLayoutView alloc] initWithFrame:CGRectZero
                                  collectionViewLayout:flowLayout]
            also:^(UICollectionView *it) {
                it.backgroundColor = [UIColor whiteColor];
                it.pagingEnabled = YES;
                it.delegate = self;
                it.dataSource = self;
                [it registerClass:[DoricFlowLayoutViewCell class] forCellWithReuseIdentifier:@"doricCell"];
            }];
}

- (void)blendView:(UICollectionView *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([@"itemCount" isEqualToString:name]) {
        self.itemCount = [prop unsignedIntegerValue];
        [self.view reloadData];
    } else if ([@"renderItem" isEqualToString:name]) {
        [self.itemViewIds removeAllObjects];
        [self clearSubModel];
        [self.view reloadData];
    } else if ([@"batchCount" isEqualToString:name]) {
        self.batchCount = [prop unsignedIntegerValue];
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (NSDictionary *)itemModelAt:(NSUInteger)position {
    NSString *viewId = self.itemViewIds[@(position)];
    if (viewId && viewId.length > 0) {
        return [self subModelOf:viewId];
    } else {
        DoricAsyncResult *result = [self callJSResponse:@"renderBunchedItems", @(position), @(self.batchCount), nil];
        JSValue *models = [result waitUntilResult];
        NSArray *array = [models toArray];
        [array enumerateObjectsUsingBlock:^(NSDictionary *obj, NSUInteger idx, BOOL *stop) {
            NSString *thisViewId = obj[@"id"];
            [self setSubModel:obj in:thisViewId];
            NSUInteger pos = position + idx;
            self.itemViewIds[@(pos)] = thisViewId;
        }];
        return array[0];
    }
}

- (DoricViewNode *)subNodeWithViewId:(NSString *)viewId {
    __block DoricViewNode *ret = nil;
    [self.doricContext.driver ensureSyncInMainQueue:^{
        for (UICollectionViewCell *collectionViewCell in self.view.visibleCells) {
            if ([collectionViewCell isKindOfClass:[DoricFlowLayoutViewCell class]]) {
                DoricFlowLayoutItemNode *node = ((DoricFlowLayoutViewCell *) collectionViewCell).viewNode;
                if ([viewId isEqualToString:node.viewId]) {
                    ret = node;
                    break;
                }
            }
        }
    }];
    return ret;
}

- (void)blendSubNode:(NSDictionary *)subModel {
    NSString *viewId = subModel[@"id"];
    DoricViewNode *viewNode = [self subNodeWithViewId:viewId];
    if (viewNode) {
        [viewNode blend:subModel[@"props"]];
    } else {
        NSMutableDictionary *model = [[self subModelOf:viewId] mutableCopy];
        [self recursiveMixin:subModel to:model];
        [self setSubModel:model in:viewId];
    }
    [self.itemViewIds enumerateKeysAndObjectsUsingBlock:^(NSNumber *_Nonnull key, NSString *_Nonnull obj, BOOL *_Nonnull stop) {
        if ([viewId isEqualToString:obj]) {
            *stop = YES;
            NSIndexPath *indexPath = [NSIndexPath indexPathForRow:[key integerValue] inSection:0];
            [UIView performWithoutAnimation:^{
                [self.view reloadItemsAtIndexPaths:@[indexPath]];
            }];
        }
    }];
}

- (void)callItem:(NSUInteger)position size:(CGSize)size {
    NSValue *old = self.itemSizeInfo[@(position)];
    if (old && CGSizeEqualToSize([old CGSizeValue], size)) {
        return;
    }
    self.itemSizeInfo[@(position)] = [NSValue valueWithCGSize:size];
    NSIndexPath *indexPath = [NSIndexPath indexPathForRow:position inSection:0];
    [UIView performWithoutAnimation:^{
        [self.view reloadItemsAtIndexPaths:@[indexPath]];
    }];
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    return self.itemCount;
}

- (__kindof UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath {
    NSUInteger position = (NSUInteger) indexPath.row;
    NSDictionary *model = [self itemModelAt:position];
    NSDictionary *props = model[@"props"];
    DoricFlowLayoutViewCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"doricCell" forIndexPath:indexPath];
    if (!cell.viewNode) {
        DoricFlowLayoutItemNode *itemNode = [[DoricFlowLayoutItemNode alloc] initWithContext:self.doricContext];
        [itemNode initWithSuperNode:self];
        cell.viewNode = itemNode;
        [cell.contentView addSubview:itemNode.view];
    }
    DoricFlowLayoutItemNode *node = cell.viewNode;
    node.viewId = model[@"id"];
    [node blend:props];
    CGSize size = [node.view measureSize:CGSizeMake(collectionView.width, collectionView.height)];
    [node.view layoutSelf:size];
    [self callItem:position size:size];
    return cell;
}

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath {
    NSUInteger position = (NSUInteger) indexPath.row;
    NSValue *value = self.itemSizeInfo[@(position)];
    if (value) {
        return [value CGSizeValue];
    } else {
        return CGSizeMake(100, 100);
    }
}

- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout minimumInteritemSpacingForSectionAtIndex:(NSInteger)section {
    return 0;
}

- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout minimumLineSpacingForSectionAtIndex:(NSInteger)section {
    return 0;
}
@end
