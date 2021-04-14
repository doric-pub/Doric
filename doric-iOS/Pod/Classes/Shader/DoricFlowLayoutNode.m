/*
 * Copyright [2019] [Doric.Pub]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//
// Created by pengfei.zhou on 2019/11/28.
//

#import "DoricFlowLayoutNode.h"
#import "DoricFlowLayoutItemNode.h"
#import "DoricExtensions.h"
#import <JavaScriptCore/JavaScriptCore.h>
#import "DoricJSDispatcher.h"

@protocol DoricFlowLayoutDelegate
- (CGFloat)doricFlowLayoutItemHeightAtIndexPath:(NSIndexPath *)indexPath;

- (CGFloat)doricFlowLayoutItemWidthAtIndexPath:(NSIndexPath *)indexPath;

- (CGFloat)doricFlowLayoutColumnSpace;

- (CGFloat)doricFlowLayoutRowSpace;

- (NSInteger)doricFlowLayoutColumnCount;

@end

@interface DoricFlowLayout : UICollectionViewLayout
@property(nonatomic, readonly) NSInteger columnCount;
@property(nonatomic, readonly) CGFloat columnSpace;
@property(nonatomic, readonly) CGFloat rowSpace;
@property(nonatomic, strong) NSMutableDictionary <NSNumber *, NSNumber *> *columnHeightInfo;
@property(nonatomic, weak) id <DoricFlowLayoutDelegate> delegate;
@end

@implementation DoricFlowLayout
- (instancetype)init {
    if (self = [super init]) {
        _columnHeightInfo = [NSMutableDictionary new];
    }
    return self;
}

- (NSInteger)columnCount {
    return self.delegate.doricFlowLayoutColumnCount ?: 2;
}

- (CGFloat)columnSpace {
    return self.delegate.doricFlowLayoutColumnSpace ?: 0;
}

- (CGFloat)rowSpace {
    return self.delegate.doricFlowLayoutRowSpace ?: 0;
}

- (BOOL)shouldInvalidateLayoutForBoundsChange:(CGRect)newBounds {
    return YES;
}

- (void)prepareLayout {
    [super prepareLayout];
    for (int i = 0; i < self.columnCount; i++) {
        self.columnHeightInfo[@(i)] = @(0);
    }
}

- (NSArray *)layoutAttributesForElementsInRect:(CGRect)rect {
    for (int i = 0; i < self.columnCount; i++) {
        self.columnHeightInfo[@(i)] = @(0);
    }
    NSMutableArray *array = [NSMutableArray array];
    NSInteger count = [self.collectionView numberOfItemsInSection:0];
    for (int i = 0; i < count; i++) {
        UICollectionViewLayoutAttributes *attrs = [self layoutAttributesForItemAtIndexPath:[NSIndexPath indexPathForItem:i inSection:0]];
        [array addObject:attrs];
    }
    return array;
}

- (UICollectionViewLayoutAttributes *)layoutAttributesForItemAtIndexPath:(NSIndexPath *)indexPath {
    NSNumber *minYOfColumn = @(0);
    for (NSNumber *key in self.columnHeightInfo.allKeys) {
        if ([self.columnHeightInfo[key] floatValue] < [self.columnHeightInfo[minYOfColumn] floatValue]) {
            minYOfColumn = key;
        }
    }

    CGFloat width = [self.delegate doricFlowLayoutItemWidthAtIndexPath:indexPath];
    CGFloat height = [self.delegate doricFlowLayoutItemHeightAtIndexPath:indexPath];
    CGFloat x = (width + self.columnSpace) * [minYOfColumn integerValue];
    CGFloat y = [self.columnHeightInfo[minYOfColumn] floatValue];
    if (y > 0) {
        y += self.rowSpace;
    }

    if (width == self.collectionView.width) {
        CGFloat maxY = 0;
        for (NSNumber *column in self.columnHeightInfo.allValues) {
            maxY = MAX(maxY, [column floatValue]);
        }
        y = maxY + self.rowSpace;
    } else {
        self.columnHeightInfo[minYOfColumn] = @(y + height);
    }
    UICollectionViewLayoutAttributes *attrs = [UICollectionViewLayoutAttributes layoutAttributesForCellWithIndexPath:indexPath];
    attrs.frame = CGRectMake(x, y, width, height);
    return attrs;
}

- (CGSize)collectionViewContentSize {
    CGFloat width = self.collectionView.width;
    CGFloat height = 0;
    for (NSNumber *column in self.columnHeightInfo.allValues) {
        height = MAX(height, [column floatValue]);
    }
    return CGSizeMake(width, height);
}
@end

@interface DoricFlowLayoutViewCell : UICollectionViewCell
@property(nonatomic, strong) DoricFlowLayoutItemNode *viewNode;
@end

@implementation DoricFlowLayoutViewCell
@end

@interface DoricFlowLayoutView : UICollectionView
@end

@implementation DoricFlowLayoutView
@end

@interface DoricFlowLayoutNode () <UICollectionViewDataSource, UICollectionViewDelegate, DoricFlowLayoutDelegate>
@property(nonatomic, strong) NSMutableDictionary <NSNumber *, NSString *> *itemViewIds;
@property(nonatomic, strong) NSMutableDictionary <NSNumber *, NSValue *> *itemSizeInfo;
@property(nonatomic, assign) NSUInteger itemCount;
@property(nonatomic, assign) NSUInteger batchCount;
@property(nonatomic, assign) NSUInteger columnCount;
@property(nonatomic, assign) CGFloat columnSpace;
@property(nonatomic, assign) CGFloat rowSpace;
@property(nonatomic, copy) NSString *renderItemFuncId;

@property(nonatomic, copy) NSString *onLoadMoreFuncId;
@property(nonatomic, copy) NSString *loadMoreViewId;
@property(nonatomic, assign) BOOL loadMore;
@property(nonatomic, strong) NSMutableSet <DoricDidScrollBlock> *didScrollBlocks;
@property(nonatomic, copy) NSString *onScrollFuncId;
@property(nonatomic, copy) NSString *onScrollEndFuncId;
@property(nonatomic, strong) DoricJSDispatcher *jsDispatcher;
@property(nonatomic, assign) NSUInteger loadAnchor;
@end

@implementation DoricFlowLayoutNode
- (instancetype)initWithContext:(DoricContext *)doricContext {
    if (self = [super initWithContext:doricContext]) {
        _itemViewIds = [NSMutableDictionary new];
        _itemSizeInfo = [NSMutableDictionary new];
        _batchCount = 15;
        _columnCount = 2;
    }
    return self;
}

- (UICollectionView *)build {
    DoricFlowLayout *flowLayout = [[DoricFlowLayout alloc] init];
    flowLayout.delegate = self;
    return [[[DoricFlowLayoutView alloc] initWithFrame:CGRectZero
                                  collectionViewLayout:flowLayout]
            also:^(UICollectionView *it) {
                it.backgroundColor = [UIColor whiteColor];
                it.pagingEnabled = YES;
                it.delegate = self;
                it.dataSource = self;
                [it registerClass:[DoricFlowLayoutViewCell class] forCellWithReuseIdentifier:@"doricCell"];
                if (@available(iOS 11, *)) {
                    it.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
                }
            }];
}

- (void)blendView:(UICollectionView *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([@"columnSpace" isEqualToString:name]) {
        self.columnSpace = [prop floatValue];
        [self.view.collectionViewLayout invalidateLayout];
    } else if ([@"rowSpace" isEqualToString:name]) {
        self.rowSpace = [prop floatValue];
        [self.view.collectionViewLayout invalidateLayout];
    } else if ([@"columnCount" isEqualToString:name]) {
        self.columnCount = [prop unsignedIntegerValue];
        [self.view reloadData];
        [self.view.collectionViewLayout invalidateLayout];
    } else if ([@"itemCount" isEqualToString:name]) {
        self.itemCount = [prop unsignedIntegerValue];
        [self.view reloadData];
    } else if ([@"renderItem" isEqualToString:name]) {
        if ([self.renderItemFuncId isEqualToString:prop]) {
        } else {
            [self.itemViewIds removeAllObjects];
            [self clearSubModel];
            [self.view reloadData];
            self.renderItemFuncId = prop;
        }

    } else if ([@"batchCount" isEqualToString:name]) {
        self.batchCount = [prop unsignedIntegerValue];
    } else if ([@"onLoadMore" isEqualToString:name]) {
        self.onLoadMoreFuncId = prop;
    } else if ([@"loadMoreView" isEqualToString:name]) {
        self.loadMoreViewId = prop;
    } else if ([@"loadMore" isEqualToString:name]) {
        self.loadMore = [prop boolValue];
    } else if ([@"onScroll" isEqualToString:name]) {
        self.onScrollFuncId = prop;
    } else if ([@"onScrollEnd" isEqualToString:name]) {
        self.onScrollEndFuncId = prop;
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (NSDictionary *)itemModelAt:(NSUInteger)position {
    if (position >= self.itemCount) {
        return [self subModelOf:self.loadMoreViewId];
    }
    NSString *viewId = self.itemViewIds[@(position)];
    if (viewId && viewId.length > 0) {
        return [self subModelOf:viewId];
    } else {
        DoricAsyncResult *result = [self callJSResponse:@"renderBunchedItems", @(position), @(self.batchCount), nil];
        NSArray *array = [result waitUntilResult:^(JSValue *models) {
            return [models toArray];
        }];
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
    dispatch_async(dispatch_get_main_queue(), ^{
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
    });
}

- (void)callItem:(NSUInteger)position size:(CGSize)size {
    NSValue *old = self.itemSizeInfo[@(position)];
    if (old && CGSizeEqualToSize([old CGSizeValue], size)) {
        return;
    }
    self.itemSizeInfo[@(position)] = [NSValue valueWithCGSize:size];
    if (self.view.doricLayout.widthSpec == DoricLayoutFit || self.view.doricLayout.heightSpec == DoricLayoutFit) {
        DoricSuperNode *node = self.superNode;
        while (node.superNode != nil) {
            node = node.superNode;
        }
        [node requestLayout];
    }
    [self.view.collectionViewLayout invalidateLayout];
}


- (void)callLoadMore {
    if (self.itemCount != self.loadAnchor) {
        self.loadAnchor = self.itemCount;
        [self callJSResponse:self.onLoadMoreFuncId, nil];
    }
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    return self.itemCount + (self.loadMore ? 1 : 0);
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
    node.view.width = (collectionView.width - (self.columnCount - 1) * self.columnSpace) / self.columnCount;
    if (position > 0 && position >= self.itemCount && self.onLoadMoreFuncId) {
        [self callLoadMore];
    }
    [node.view.doricLayout apply];
    [node requestLayout];
    [self callItem:position size:node.view.frame.size];
    return cell;
}

- (CGFloat)doricFlowLayoutItemHeightAtIndexPath:(NSIndexPath *)indexPath {
    NSUInteger position = (NSUInteger) indexPath.row;
    NSValue *value = self.itemSizeInfo[@(position)];
    if (value) {
        return [value CGSizeValue].height;
    } else {
        return 100;
    }
}

- (CGFloat)doricFlowLayoutItemWidthAtIndexPath:(NSIndexPath *)indexPath {
    NSUInteger position = (NSUInteger) indexPath.row;
    NSValue *value = self.itemSizeInfo[@(position)];
    if (value) {
        return [value CGSizeValue].width;
    } else {
        return 100;
    }
}


- (CGFloat)doricFlowLayoutColumnSpace {
    return self.columnSpace;
}

- (CGFloat)doricFlowLayoutRowSpace {
    return self.rowSpace;
}

- (NSInteger)doricFlowLayoutColumnCount {
    return self.columnCount;
}

- (void)scrollViewDidScroll:(UIScrollView *)scrollView {
    for (DoricDidScrollBlock block in self.didScrollBlocks) {
        block(scrollView);
    }
    if (self.onScrollFuncId) {
        if (!self.jsDispatcher) {
            self.jsDispatcher = [DoricJSDispatcher new];
        }
        __weak typeof(self) __self = self;
        [self.jsDispatcher dispatch:^DoricAsyncResult * {
            __strong typeof(__self) self = __self;
            return [self callJSResponse:self.onScrollFuncId,
                                        @{
                                                @"x": @(self.view.contentOffset.x),
                                                @"y": @(self.view.contentOffset.y),
                                        },
                            nil];
        }];
    }
}

- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView {
    if (self.onScrollEndFuncId) {
        [self callJSResponse:self.onScrollEndFuncId,
                             @{
                                     @"x": @(self.view.contentOffset.x),
                                     @"y": @(self.view.contentOffset.y),
                             },
                        nil];
    }
}

- (void)scrollViewDidEndDragging:(UIScrollView *)scrollView willDecelerate:(BOOL)decelerate {
    if (!decelerate) {
        if (self.onScrollEndFuncId) {
            [self callJSResponse:self.onScrollEndFuncId,
                                 @{
                                         @"x": @(self.view.contentOffset.x),
                                         @"y": @(self.view.contentOffset.y),
                                 },
                            nil];
        }
    }
}

- (NSMutableSet<DoricDidScrollBlock> *)didScrollBlocks {
    if (!_didScrollBlocks) {
        _didScrollBlocks = [NSMutableSet new];
    }
    return _didScrollBlocks;
}

- (void)addDidScrollBlock:(__nonnull DoricDidScrollBlock)didScrollListener {
    [self.didScrollBlocks addObject:didScrollListener];
}

- (void)removeDidScrollBlock:(__nonnull DoricDidScrollBlock)didScrollListener {
    [self.didScrollBlocks removeObject:didScrollListener];
}
@end
