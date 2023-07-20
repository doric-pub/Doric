/*
 * Copyright [2022] [Doric.Pub]
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
// Created by jingpeng.wang on 2022/8/23.
//

#import <JavaScriptCore/JavaScriptCore.h>
#import <DoricCore/Doric.h>
#import "DoricHorizontalListNode.h"
#import "DoricExtensions.h"
#import "DoricHorizontalListItemNode.h"
#import "DoricRefreshableNode.h"
#import "DoricJSDispatcher.h"
#import "DoricUtil.h"
#import "DoricExtensions.h"

@interface DoricHorizontalTableViewCell : UICollectionViewCell
@property(nonatomic, strong) DoricHorizontalListItemNode *doricHorizontalListItemNode;
@end

@implementation DoricHorizontalTableViewCell
@end

@interface DoricHorizontalTableView : UICollectionView
@end

@implementation DoricHorizontalTableView
- (CGSize)sizeThatFits:(CGSize)size {
    if (self.doricLayout.widthSpec == DoricLayoutFit
            || self.doricLayout.heightSpec == DoricLayoutFit) {
        CGFloat width = size.width;
        CGFloat height = size.height;
        if (self.doricLayout.widthSpec == DoricLayoutFit && self.contentSize.width > 0) {
            width = self.contentSize.width;
        }
        if (self.doricLayout.heightSpec == DoricLayoutFit && self.contentSize.height > 0) {
            height = self.contentSize.height;
        }
        return CGSizeMake(width, height);
    }
    return [super sizeThatFits:size];
}
@end

@interface DoricHorizontalListNode () <UICollectionViewDataSource, UICollectionViewDelegate, UICollectionViewDelegateFlowLayout>
@property(nonatomic, strong) NSMutableDictionary <NSNumber *, NSString *> *itemViewIds;
@property(nonatomic, strong) NSMutableDictionary <NSNumber *, NSNumber *> *itemWidths;
@property(nonatomic, strong) NSMutableDictionary <NSNumber *, NSArray *> *itemActions;
@property(nonatomic, assign) NSUInteger itemCount;
@property(nonatomic, assign) NSUInteger batchCount;
@property(nonatomic, copy) NSString *onLoadMoreFuncId;
@property(nonatomic, copy) NSString *renderItemFuncId;
@property(nonatomic, copy) NSString *loadMoreViewId;
@property(nonatomic, assign) BOOL loadMore;
@property(nonatomic, assign) NSInteger loadAnchor;
@property(nonatomic, strong) NSMutableSet <DoricDidScrollBlock> *didScrollBlocks;
@property(nonatomic, copy) NSString *onScrollFuncId;
@property(nonatomic, copy) NSString *onScrollEndFuncId;
@property(nonatomic, strong) DoricJSDispatcher *jsDispatcher;

@property(nonatomic, strong) UILongPressGestureRecognizer *longPress;
@property(nonatomic, strong) NSIndexPath *currentDragIndexPath;
@property(nonatomic, copy) NSString *itemCanDragFuncId;
@property(nonatomic, copy) NSString *beforeDraggingFuncId;
@property(nonatomic, copy) NSString *onDraggingFuncId;
@property(nonatomic, copy) NSString *onDraggedFuncId;
@property(nonatomic, strong) NSArray *swapDisabled;

@property(nonatomic, assign) NSUInteger rowCount;
@property(nonatomic, assign) BOOL needReload;
@end

@implementation DoricHorizontalListNode
- (instancetype)initWithContext:(DoricContext *)doricContext {
    if (self = [super initWithContext:doricContext]) {
        _itemViewIds = [NSMutableDictionary new];
        _itemWidths = [NSMutableDictionary new];
        _itemActions = [NSMutableDictionary new];
        _batchCount = 15;
        _loadAnchor = -1;
    }
    return self;
}

- (void)initWithSuperNode:(DoricSuperNode *)superNode {
    [super initWithSuperNode:superNode];
    if ([superNode isKindOfClass:[DoricRefreshableNode class]]) {
        self.view.bounces = NO;
    }
}

- (UICollectionView *)build {
    UICollectionViewFlowLayout *collectionViewFlowLayout = [[UICollectionViewFlowLayout alloc] init];
    [collectionViewFlowLayout setMinimumInteritemSpacing:0];
    [collectionViewFlowLayout setMinimumLineSpacing:0];
    [collectionViewFlowLayout setScrollDirection:UICollectionViewScrollDirectionHorizontal];
    return [[[DoricHorizontalTableView alloc] initWithFrame:CGRectZero
                                       collectionViewLayout:collectionViewFlowLayout] also:^(UICollectionView *it) {
        it.dataSource = self;
        it.delegate = self;
        it.allowsSelection = NO;
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
            self.currentDragIndexPath = indexPath;
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
    } else if ([@"scrollsToTop" isEqualToString:name]) {
        self.view.scrollsToTop = [prop boolValue];
    } else if ([@"itemCount" isEqualToString:name]) {
        self.itemCount = [prop unsignedIntegerValue];
        self.needReload = true;
    } else if ([@"renderItem" isEqualToString:name]) {
        if (![self.renderItemFuncId isEqualToString:prop]) {
            self.loadAnchor = -1;
            self.renderItemFuncId = prop;
            [self.itemViewIds.allValues forEach:^(NSString *obj) {
                [self removeSubModel:obj];
            }];
            [self.itemViewIds removeAllObjects];
            self.needReload = true;
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
            self.needReload = true;
        }
    } else if ([@"onScroll" isEqualToString:name]) {
        self.onScrollFuncId = prop;
    } else if ([@"onScrollEnd" isEqualToString:name]) {
        self.onScrollEndFuncId = prop;
    } else if ([@"scrolledPosition" isEqualToString:name]) {
        dispatch_async(dispatch_get_main_queue(), ^{
            NSUInteger pos = [prop unsignedIntegerValue];
            if (pos < self.rowCount && pos >= 0) {
                [view scrollToItemAtIndexPath:[NSIndexPath indexPathForRow:pos inSection:0] atScrollPosition:UICollectionViewScrollPositionLeft animated:NO];
            }
        });
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

- (void)blend:(NSDictionary *)props {
    self.needReload = false;
    [super blend:props];
    if (self.needReload) {
        dispatch_async(dispatch_get_main_queue(), ^{
            self.rowCount = self.itemCount + (self.loadMore ? 1 : 0);
            [self.view reloadData];
            if ((self.view.width == 0 && self.view.doricLayout.widthSpec == DoricLayoutFit)
                    || (self.view.height == 0 && self.view.doricLayout.heightSpec == DoricLayoutFit)) {
                DoricSuperNode *node = self.superNode;
                while (node.superNode != nil) {
                    node = node.superNode;
                }
                [node requestLayout];
            }
        });
    }
    self.needReload = false;
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    return self.rowCount;
}

- (void)callLoadMore {
    if (self.rowCount - 1 != self.loadAnchor) {
        self.loadAnchor = self.rowCount - 1;
        [self callJSResponse:self.onLoadMoreFuncId, nil];
    }
}

- (__kindof UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath {
    @try {
        NSUInteger position = (NSUInteger) indexPath.row;
        NSDictionary *model = [self itemModelAt:position];
        NSDictionary *props = model[@"props"];
        NSString *identifier = props[@"identifier"] ?: @"doricCell";
        self.itemActions[@(position)] = props[@"actions"];
        if (self.loadMore
                && position >= self.rowCount - 1
                && self.onLoadMoreFuncId) {
            identifier = @"doricLoadMoreCell";
            [self callLoadMore];
        }
        [collectionView registerClass:[DoricHorizontalTableViewCell class] forCellWithReuseIdentifier:identifier];
        DoricHorizontalTableViewCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:identifier forIndexPath:indexPath];
        if (!cell.doricHorizontalListItemNode) {
            DoricHorizontalListItemNode *itemNode = (DoricHorizontalListItemNode *) [DoricViewNode create:self.doricContext withType:@"HorizontalListItem"];
            [itemNode initWithSuperNode:self];
            cell.doricHorizontalListItemNode = itemNode;
            cell.backgroundColor = [UIColor clearColor];
            itemNode.view.height = collectionView.height;
            [cell.contentView addSubview:itemNode.view];
        } else {
            [cell.doricHorizontalListItemNode reset];
        }
        DoricHorizontalListItemNode *node = cell.doricHorizontalListItemNode;
        node.viewId = model[@"id"];
        [node blend:props];
        CGFloat width = node.view.doricLayout.widthSpec == DoricLayoutFit ? CGFLOAT_MAX : collectionView.width;
        [node.view.doricLayout apply:CGSizeMake(width, collectionView.height)];
        [node requestLayout];
        [self callItem:position width:node.view.width];
        return cell;
    } @catch (NSException *exception) {
        [self.doricContext.driver.registry onException:exception inContext:self.doricContext];
        return nil;
    }
}

- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout minimumInteritemSpacingForSectionAtIndex:(NSInteger)section {
    return 0;
}

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath {
    NSUInteger position = (NSUInteger) indexPath.row;
    NSNumber *widthNumber = self.itemWidths[@(position)];

    float width = 44.f;
    if (widthNumber) {
        width = [widthNumber floatValue];
    }

    return CGSizeMake(width, collectionView.height);
}

- (BOOL)collectionView:(UICollectionView *)collectionView canEditItemAtIndexPath:(NSIndexPath *)indexPath {
    NSArray *actions = self.itemActions[@(indexPath.row)];
    return actions.count > 0;
}

- (NSDictionary *)itemModelAt:(NSUInteger)position {
    if (self.loadMore && position >= self.rowCount - 1) {
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
        NSInteger batchCount = self.batchCount;
        NSInteger start = position;
        while (start > 0 && self.itemViewIds[@(start - 1)] == nil) {
            start--;
            batchCount++;
        }
        DoricAsyncResult *result = [self pureCallJSResponse:@"renderBunchedItems", @(start), @(batchCount), nil];
        NSArray *array = [result waitUntilResult:^(JSValue *models) {
            return [models toArray];
        }];
        [array enumerateObjectsUsingBlock:^(NSDictionary *obj, NSUInteger idx, BOOL *stop) {
            NSString *thisViewId = obj[@"id"];
            [self setSubModel:obj in:thisViewId];
            NSUInteger pos = start + idx;
            self.itemViewIds[@(pos)] = thisViewId;
        }];
        viewId = self.itemViewIds[@(position)];
        if (viewId && viewId.length > 0) {
            return [self subModelOf:viewId];
        } else {
            return nil;
        }
    }
}

- (void)blendSubNode:(NSDictionary *)subModel {
    ///Here async blend sub node because the item count need to be applied first.
    NSUInteger currentCount = self.rowCount;
    NSString *viewId = subModel[@"id"];
    DoricViewNode *viewNode = [self subNodeWithViewId:viewId];
    BOOL skipReload = NO;

    NSMutableDictionary *model = [[self subModelOf:viewId] mutableCopy];
    [self recursiveMixin:subModel to:model];
    [self setSubModel:model in:viewId];

    if (viewNode) {
        CGSize originSize = viewNode.view.frame.size;
        [viewNode blend:subModel[@"props"]];
        [viewNode.view.doricLayout apply:CGSizeMake(self.view.width, self.view.height)];
        [viewNode requestLayout];
        if (CGSizeEqualToSize(originSize, viewNode.view.frame.size)) {
            skipReload = YES;
        }
    }

    if (skipReload) {
        return;
    }
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.itemViewIds enumerateKeysAndObjectsUsingBlock:^(NSNumber *_Nonnull key, NSString *_Nonnull obj, BOOL *_Nonnull stop) {
            if ([viewId isEqualToString:obj]) {
                *stop = YES;
                [UIView performWithoutAnimation:^{
                    NSUInteger itemCount = self.rowCount;
                    if (itemCount <= [key integerValue] || currentCount != itemCount) {
                        [self.view reloadData];
                        return;
                    }
                    NSIndexPath *indexPath = [NSIndexPath indexPathForRow:[key integerValue] inSection:0];
                    @try {
                        [self.view reloadItemsAtIndexPaths:@[indexPath]];
                    }
                    @catch (id exception) {
                        [self.doricContext.driver.registry onException:exception inContext:self.doricContext];
                    }
                }];
            }
        }];
    });

}

- (void)callItem:(NSUInteger)position width:(CGFloat)width {
    NSNumber *old = self.itemWidths[@(position)];
    if (old && [old isEqualToNumber:@(width)]) {
        return;
    }
    NSUInteger currentCount = self.rowCount;
    self.itemWidths[@(position)] = @(width);
    if (@available(iOS 12.0, *)) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (self.view.doricLayout.widthSpec == DoricLayoutFit
                    || self.view.doricLayout.heightSpec == DoricLayoutFit) {
                DoricSuperNode *node = self.superNode;
                while (node.superNode != nil) {
                    node = node.superNode;
                }
                [node requestLayout];
                if (self.view.doricLayout.heightSpec == DoricLayoutFit) {
                    CGFloat height = 0;
                    for (UICollectionViewCell *tableViewCell in self.view.visibleCells) {
                        if ([tableViewCell isKindOfClass:[DoricHorizontalTableViewCell class]]) {
                            DoricHorizontalListItemNode *node = ((DoricHorizontalTableViewCell *) tableViewCell)
                                    .doricHorizontalListItemNode;
                            height = MAX(height, node.view.height);
                        }
                    }
                    self.view.height = height;
                }
                if (self.view.doricLayout.widthSpec == DoricLayoutFit) {
                    self.view.width = self.view.contentSize.width;
                }
            }
            [UIView performWithoutAnimation:^{
                NSUInteger itemCount = self.rowCount;
                if (itemCount <= position || currentCount != itemCount) {
                    return;
                }
                NSIndexPath *indexPath = [NSIndexPath indexPathForRow:position inSection:0];
                @try {
                    [self.view reloadItemsAtIndexPaths:@[indexPath]];
                }
                @catch (id exception) {
                    [self.doricContext.driver.registry onException:exception inContext:self.doricContext];
                }
            }];
        });
    } else {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (self.view.doricLayout.heightSpec == DoricLayoutFit) {
                DoricSuperNode *node = self.superNode;
                while (node.superNode != nil) {
                    node = node.superNode;
                }
                [node requestLayout];
            }
            [self.view reloadData];
        });
    }
}

- (DoricViewNode *)subNodeWithViewId:(NSString *)viewId {
    __block DoricViewNode *ret = nil;
    [self.doricContext.driver ensureSyncInMainQueue:^{
        for (UICollectionViewCell *collectionViewCell in self.view.visibleCells) {
            if ([collectionViewCell isKindOfClass:[DoricHorizontalTableViewCell class]]) {
                DoricHorizontalListItemNode *node = ((DoricHorizontalTableViewCell *) collectionViewCell).doricHorizontalListItemNode;
                if ([viewId isEqualToString:node.viewId]) {
                    ret = node;
                    break;
                }
            }
        }
    }];
    return ret;
}

- (void)scrollViewDidScroll:(UIScrollView *)scrollView {
    for (DoricDidScrollBlock block in self.didScrollBlocks) {
        block(scrollView);
    }
    if (self.onScrollFuncId) {
        if (!self.jsDispatcher) {
            self.jsDispatcher = [DoricJSDispatcher new];
        }
        
        NSDictionary *offset = @{
            @"x": @(self.view.contentOffset.x),
            @"y": @(self.view.contentOffset.y),
        };
        
        __weak typeof(self) __self = self;
        [self.jsDispatcher dispatch:^DoricAsyncResult * {
            __strong typeof(__self) self = __self;
            return [self callJSResponse:self.onScrollFuncId, offset, nil];
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

- (void)scrollToItem:(NSDictionary *)params {
    BOOL animated = [params[@"animated"] boolValue];
    NSUInteger scrolledPosition = [params[@"index"] unsignedIntegerValue];

    if (scrolledPosition < self.rowCount && scrolledPosition >= 0) {
        for (int i = 0; i <= scrolledPosition; i++) {
            [self collectionView:self.view cellForItemAtIndexPath:[NSIndexPath indexPathForRow:i inSection:0]];
        }

        dispatch_async(dispatch_get_main_queue(), ^{
            [self.view scrollToItemAtIndexPath:[NSIndexPath indexPathForRow:scrolledPosition inSection:0] atScrollPosition:UICollectionViewScrollPositionNone animated:animated];
        });
    } else {
        [self.doricContext.driver.registry onLog:DoricLogTypeError
                                         message:[NSString stringWithFormat:@"scrollToItem Error:%@", @"scrolledPosition range error"]];
    }
}

- (NSArray *)findVisibleItems {
    return [self.view.indexPathsForVisibleItems map:^id(NSIndexPath *obj) {
        return @(obj.row);
    }];
}

- (NSArray *)findCompletelyVisibleItems {
    NSArray<__kindof UICollectionViewCell *> *items = [self.view.visibleCells filter:^BOOL(__kindof UICollectionViewCell *obj) {
        return CGRectContainsRect(self.view.bounds, obj.frame);
    }];
    return [items map:^id(__kindof UICollectionViewCell *obj) {
        return @([self.view indexPathForCell:obj].row);
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
        self.rowCount = self.itemCount + (self.loadMore ? 1 : 0);
        [self.view reloadData];
    });
}
@end
