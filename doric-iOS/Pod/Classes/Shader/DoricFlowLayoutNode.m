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

#import <DoricCore/Doric.h>
#import "DoricFlowLayoutNode.h"
#import "DoricFlowLayoutItemNode.h"
#import "DoricExtensions.h"
#import <JavaScriptCore/JavaScriptCore.h>
#import "DoricJSDispatcher.h"

@protocol DoricFlowLayoutDelegate
- (CGFloat)doricFlowLayoutItemHeightAtIndexPath:(NSIndexPath *)indexPath;

- (CGFloat)doricFlowLayoutItemWidthAtIndexPath:(NSIndexPath *)indexPath;

- (BOOL)doricFlowLayoutItemFullSpan:(NSIndexPath *)indexPath;

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
@property(nonatomic, copy) NSArray<UICollectionViewLayoutAttributes*> *layoutAttributes;
@property(nonatomic, copy) NSArray<NSValue*> *unionRects;
@property(nonatomic, strong) NSArray *swapDisabled;
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
    NSMutableArray *array = [NSMutableArray array];
    NSInteger count = [self.collectionView numberOfItemsInSection:0];
    
    NSNumber *minYOfColumn = @(0);
    NSArray<NSNumber *> *keys = self.columnHeightInfo.allKeys;
    NSArray<NSNumber *> *sortedKeys = [keys sortedArrayUsingComparator:^NSComparisonResult(NSNumber *obj1, NSNumber *obj2) {
        return ([obj1 intValue] <= [obj2 intValue] ? NSOrderedAscending : NSOrderedDescending);
    }];
    
    for (int i = 0; i < count; i++) {
        minYOfColumn = @(0);
        NSIndexPath *indexPath = [NSIndexPath indexPathForRow:i inSection:0] ;
        
        UICollectionViewLayoutAttributes *attrs = [UICollectionViewLayoutAttributes layoutAttributesForCellWithIndexPath:indexPath];
        
        for (NSNumber *key in sortedKeys) {
            if ([self.columnHeightInfo[key] floatValue] < [self.columnHeightInfo[minYOfColumn] floatValue]) {
                minYOfColumn = key;
            }
        }
        
        CGFloat width = [self.delegate doricFlowLayoutItemWidthAtIndexPath:indexPath];
        CGFloat height = [self.delegate doricFlowLayoutItemHeightAtIndexPath:indexPath];
        CGFloat x = 0;
        CGFloat y = [self.columnHeightInfo[minYOfColumn] floatValue];
        if (y > 0) {
            y += self.rowSpace;
        }

        if ([self.delegate doricFlowLayoutItemFullSpan:indexPath]) {
            NSNumber *maxYColumn = @(0);
            for (NSNumber *key in sortedKeys) {
                if ([self.columnHeightInfo[key] floatValue] > [self.columnHeightInfo[maxYColumn] floatValue]) {
                    maxYColumn = key;
                }
            }
            CGFloat maxY = [self.columnHeightInfo[maxYColumn] floatValue];
            y = maxY + self.rowSpace;
            for (NSNumber *key in self.columnHeightInfo.allKeys) {
                self.columnHeightInfo[key] = @(y + height);
            }
        } else {
            CGFloat columnWidth = (self.collectionView.width - (self.columnCount - 1) * self.columnSpace) / self.columnCount;
            x = (columnWidth + self.columnSpace) * [minYOfColumn integerValue];
            self.columnHeightInfo[minYOfColumn] = @(y + height);
        }
        attrs.frame = CGRectMake(x, y, width, height);
        
        [array addObject:attrs];
    }
    self.layoutAttributes = array;
    
    NSMutableArray *mutableCopy = [NSMutableArray array];
    long idx = 0;
    NSInteger itemCounts = count;
    while(idx < itemCounts){
        CGRect rect1 = self.layoutAttributes[idx].frame;
        idx = MIN(idx + count, itemCounts) - 1;
        CGRect rect2 = self.layoutAttributes[idx].frame;
        [mutableCopy addObject:[NSValue valueWithCGRect:CGRectUnion(rect1, rect2)]];
        idx += 1;
    }
    self.unionRects = mutableCopy;
}

- (NSArray *)layoutAttributesForElementsInRect:(CGRect)rect {
    NSInteger begin = 0;
    NSInteger end = self.unionRects.count;
    NSMutableArray<UICollectionViewLayoutAttributes*> *attrs = [NSMutableArray array];
    
    for (int i = 0; i < end; i++) {
        if (CGRectIntersectsRect(rect, [self.unionRects[i] CGRectValue])) {
            begin = i * self.layoutAttributes.count;
            break;
        }
    }
    
    for (long i = self.unionRects.count - 1; i >= 0; i--) {
        if (CGRectIntersectsRect(rect, [self.unionRects[i] CGRectValue])) {
            end = MIN((i + 1) * self.layoutAttributes.count, self.layoutAttributes.count);
            break;
        }
    }
    
    for (NSInteger i = begin; i < end; i++) {
        UICollectionViewLayoutAttributes *attr = self.layoutAttributes[i];
        if (CGRectIntersectsRect(rect, attr.frame)) {
            [attrs addObject:attr];
        }
    }
    
    return attrs;
}

- (UICollectionViewLayoutAttributes *)layoutAttributesForItemAtIndexPath:(NSIndexPath *)indexPath {
    return self.layoutAttributes[indexPath.row];
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
@property(nonatomic, assign) NSInteger loadAnchor;

@property(nonatomic, strong) UILongPressGestureRecognizer *longPress;
@property(nonatomic, strong) NSIndexPath *currentDragIndexPath;
@property(nonatomic, copy) NSString *itemCanDragFuncId;
@property(nonatomic, copy) NSString *beforeDraggingFuncId;
@property(nonatomic, copy) NSString *onDraggingFuncId;
@property(nonatomic, copy) NSString *onDraggedFuncId;
@property(nonatomic, strong) NSArray *swapDisabled;
@end

@implementation DoricFlowLayoutNode
- (instancetype)initWithContext:(DoricContext *)doricContext {
    if (self = [super initWithContext:doricContext]) {
        _itemViewIds = [NSMutableDictionary new];
        _itemSizeInfo = [NSMutableDictionary new];
        _batchCount = 15;
        _columnCount = 2;
        _loadAnchor = -1;
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
                it.pagingEnabled = NO;
                it.delegate = self;
                it.dataSource = self;
                it.showsVerticalScrollIndicator = NO;
                it.showsHorizontalScrollIndicator = NO;
                if (@available(iOS 11, *)) {
                    it.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
                }
        
                self.longPress = [[UILongPressGestureRecognizer alloc] initWithTarget:self action:@selector(longPressAction:)];
                [it addGestureRecognizer:self.longPress];
                [self.longPress setEnabled:NO];
            }];
}

- (void)longPressAction:(UILongPressGestureRecognizer *)sender {
    CGPoint locationInView = [sender locationInView:self.view];
    NSIndexPath *indexPath = [self.view indexPathForItemAtPoint:locationInView];
    if (sender.state == UIGestureRecognizerStateBegan) {
        if (indexPath != nil) {
            [self.view beginInteractiveMovementForItemAtIndexPath:indexPath];
            
            self.currentDragIndexPath = indexPath;
            
            if (self.beforeDraggingFuncId != nil) {
                DoricAsyncResult *asyncResult = [self callJSResponse:self.beforeDraggingFuncId, @(indexPath.row), nil];
                JSValue *model = [asyncResult waitUntilResult];
                if (model.isArray) {
                    self.swapDisabled = [model toArray];
                }
            }
        }
    } else if (sender.state == UIGestureRecognizerStateChanged) {
        [self.view updateInteractiveMovementTargetPosition:[sender locationInView:self.view]];
        if ((indexPath != nil) && (indexPath != self.currentDragIndexPath)) {
            if (self.onDraggingFuncId != nil) {
                [self callJSResponse:self.onDraggingFuncId, @(self.currentDragIndexPath.row), @(indexPath.row), nil];
            }
        }
    } else if (sender.state == UIGestureRecognizerStateEnded) {
        [self.view endInteractiveMovement];
    } else {
        [self.view cancelInteractiveMovement];
    }
}

- (void)blendView:(UICollectionView *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([@"scrollable" isEqualToString:name]) {
        self.view.scrollEnabled = [prop boolValue];
    } else if ([@"bounces" isEqualToString:name]) {
        self.view.bounces = [prop boolValue];
    } else if ([@"columnSpace" isEqualToString:name]) {
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
            self.loadAnchor = -1;
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
        BOOL loadMore = [prop boolValue];
        if (loadMore != self.loadMore) {
            self.loadMore = loadMore;
            [self.view reloadData];
        }
    } else if ([@"onScroll" isEqualToString:name]) {
        self.onScrollFuncId = prop;
    } else if ([@"onScrollEnd" isEqualToString:name]) {
        self.onScrollEndFuncId = prop;
    } else if ([@"canDrag" isEqualToString:name]) {
        bool canDrag = [prop boolValue];
        [self.longPress setEnabled:canDrag];
    } else if ([@"itemCanDrag" isEqualToString:name]) {
        self.itemCanDragFuncId = prop;
    } else if ([@"beforeDragging" isEqualToString:name]) {
        self.beforeDraggingFuncId = prop;
    } else if ([@"onDragging" isEqualToString:name]) {
        self.onDraggingFuncId = prop;
    } else if ([@"onDragged" isEqualToString:name]) {
        self.onDraggedFuncId = prop;
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (NSDictionary *)itemModelAt:(NSUInteger)position {
    if (self.loadMore && position >= self.itemCount) {
        if (self.loadMoreViewId && self.loadMoreViewId.length > 0) {
            return [self subModelOf:self.loadMoreViewId];
        } else {
            return nil;
        }
    }
    NSString *viewId = self.itemViewIds[@(position)];
    if (viewId && viewId.length > 0) {
        return [self subModelOf:viewId];
    } else {
        DoricAsyncResult *result = [self pureCallJSResponse:@"renderBunchedItems", @(position), @(self.batchCount), nil];
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
    NSString *viewId = subModel[@"id"];
    DoricViewNode *viewNode = [self subNodeWithViewId:viewId];
    BOOL skipReload = NO;
    if (viewNode) {
        CGSize originSize = viewNode.view.frame.size;
        [viewNode blend:subModel[@"props"]];
        [viewNode.view.doricLayout apply];
        [viewNode requestLayout];
        if (CGSizeEqualToSize(originSize, viewNode.view.frame.size)) {
            skipReload = YES;
        }
    } else {
        NSMutableDictionary *model = [[self subModelOf:viewId] mutableCopy];
        [self recursiveMixin:subModel to:model];
        [self setSubModel:model in:viewId];
    }
    if (skipReload) {
        return;
    }
    dispatch_async(dispatch_get_main_queue(), ^{
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
    NSString *identifier = props[@"identifier"] ?: @"doricCell";
    if (self.loadMore
            && position >= self.itemCount
            && self.onLoadMoreFuncId) {
        identifier = @"doricLoadMoreCell";
        [self callLoadMore];
    }
    [collectionView registerClass:[DoricFlowLayoutViewCell class] forCellWithReuseIdentifier:identifier];
    DoricFlowLayoutViewCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:identifier forIndexPath:indexPath];
    if (!cell.viewNode) {
        DoricFlowLayoutItemNode *itemNode = (DoricFlowLayoutItemNode *) [DoricViewNode create:self.doricContext withType:@"FlowLayoutItem"];
        [itemNode initWithSuperNode:self];
        cell.viewNode = itemNode;
        [cell.contentView addSubview:itemNode.view];
    } else {
        [cell.viewNode reset];
    }

    DoricFlowLayoutItemNode *node = cell.viewNode;
    node.viewId = model[@"id"];
    [node blend:props];

    BOOL fullSpan = self.loadMore && position >= self.itemCount;
    if (props[@"fullSpan"]) {
        fullSpan = [props[@"fullSpan"] boolValue];
    }
    if (fullSpan) {
        node.view.width = collectionView.width;
    } else {
        node.view.width = (collectionView.width - (self.columnCount - 1) * self.columnSpace) / self.columnCount;
    }
    [node.view.doricLayout apply];
    [node requestLayout];
    [self callItem:position size:node.view.frame.size];
    return cell;
}

- (NSIndexPath *)collectionView:(UICollectionView *)collectionView targetIndexPathForMoveFromItemAtIndexPath:(NSIndexPath *)currentIndexPath toProposedIndexPath:(NSIndexPath *)proposedIndexPath {
    if (self.swapDisabled != nil) {
        for (int i = 0; i != self.swapDisabled.count; i++) {
            if (proposedIndexPath.row == [self.swapDisabled[i] intValue]) {
                return currentIndexPath;
            }
        }
    }
    return proposedIndexPath;
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

- (BOOL)doricFlowLayoutItemFullSpan:(NSIndexPath *)indexPath {
    NSUInteger position = (NSUInteger) indexPath.row;
    BOOL fullSpan = self.loadMore && position >= self.itemCount;
    NSDictionary *model = [self itemModelAt:position];
    if (model[@"props"][@"fullSpan"]) {
        fullSpan = [model[@"props"][@"fullSpan"] boolValue];
    }
    return fullSpan;
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

- (NSArray *)findVisibleItems {
    return [[self.view.indexPathsForVisibleItems map:^id(NSIndexPath *obj) {
        return @(obj.row);
    }] sortedArrayUsingComparator:^NSComparisonResult(NSNumber *obj1, NSNumber *obj2) {
        if (obj1.unsignedIntegerValue > obj2.unsignedIntegerValue) {
            return NSOrderedDescending;
        } else if (obj1.unsignedIntegerValue < obj2.unsignedIntegerValue) {
            return NSOrderedAscending;
        } else {
            return NSOrderedSame;
        }

    }];
}

- (NSArray *)findCompletelyVisibleItems {
    NSArray<__kindof UICollectionViewCell *> *items = [self.view.visibleCells filter:^BOOL(__kindof UICollectionViewCell *obj) {
        return CGRectContainsRect(self.view.bounds, obj.frame);
    }];
    return [[items map:^id(__kindof UICollectionViewCell *obj) {
        return @([self.view indexPathForCell:obj].row);
    }] sortedArrayUsingComparator:^NSComparisonResult(NSNumber *obj1, NSNumber *obj2) {
        if (obj1.unsignedIntegerValue > obj2.unsignedIntegerValue) {
            return NSOrderedDescending;
        } else if (obj1.unsignedIntegerValue < obj2.unsignedIntegerValue) {
            return NSOrderedAscending;
        } else {
            return NSOrderedSame;
        }

    }];
}

- (void)reset {
    [super reset];
    self.view.scrollEnabled = YES;
    self.renderItemFuncId = nil;
    self.onLoadMoreFuncId = nil;
    self.loadMoreViewId = nil;
    self.onScrollFuncId = nil;
    self.onScrollEndFuncId = nil;
    self.itemCanDragFuncId = nil;
    self.beforeDraggingFuncId = nil;
    self.onDraggingFuncId = nil;
    self.onDraggedFuncId = nil;
    self.loadMore = NO;
}

- (void)subNodeContentChanged:(DoricViewNode *)subNode {
    [subNode.view.doricLayout apply];
    [super subNodeContentChanged:subNode];
}

- (void)reload {
    self.loadAnchor = -1;
    [self.itemViewIds.allValues forEach:^(NSString *obj) {
        [self removeSubModel:obj];
    }];
    [self.itemViewIds removeAllObjects];
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.view reloadData];
    });
}

- (BOOL)collectionView:(UICollectionView *)collectionView canMoveItemAtIndexPath:(NSIndexPath *)indexPath {
    if (self.itemCanDragFuncId != nil) {
        DoricAsyncResult *asyncResult = [self callJSResponse:self.itemCanDragFuncId, @(indexPath.row), nil];
        JSValue *model = [asyncResult waitUntilResult];
        if (model.isBoolean) {
            return [model toBool];
        }
    }
    return true;
}

- (void)collectionView:(UICollectionView *)collectionView moveItemAtIndexPath:(NSIndexPath *)sourceIndexPath toIndexPath:(NSIndexPath *)destinationIndexPath {
    NSString *fromValue = self.itemViewIds[@(sourceIndexPath.row)];
    NSString *toValue = self.itemViewIds[@(destinationIndexPath.row)];
    self.itemViewIds[@(sourceIndexPath.row)] = toValue;
    self.itemViewIds[@(destinationIndexPath.row)] = fromValue;
    if (self.onDraggedFuncId != nil) {
        [self callJSResponse:self.onDraggedFuncId, @(sourceIndexPath.row), @(destinationIndexPath.row), nil];
    }
}
@end
