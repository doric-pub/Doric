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
// Created by pengfei.zhou on 2019/11/15.
//

#import <JavaScriptCore/JavaScriptCore.h>
#import <DoricCore/Doric.h>
#import "DoricListNode.h"
#import "DoricExtensions.h"
#import "DoricListItemNode.h"
#import "DoricRefreshableNode.h"
#import "DoricJSDispatcher.h"
#import "DoricUtil.h"
#import "DoricExtensions.h"

@interface DoricTableViewCell : UITableViewCell
@property(nonatomic, strong) DoricListItemNode *doricListItemNode;
@end

@implementation DoricTableViewCell
@end

@interface DoricTableView : UITableView
@end

@implementation DoricTableView
- (CGSize)sizeThatFits:(CGSize)size {
    return [super sizeThatFits:size];
}
@end


@interface DoricListNode () <UITableViewDataSource, UITableViewDelegate>
@property(nonatomic, strong) NSMutableDictionary <NSNumber *, NSString *> *itemViewIds;
@property(nonatomic, strong) NSMutableDictionary <NSNumber *, NSNumber *> *itemHeights;
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
@property(nonatomic, strong) NSIndexPath *initialDragIndexPath;
@property(nonatomic, strong) NSIndexPath *currentDragIndexPath;
@property(nonatomic, copy) NSString *beforeDraggingFuncId;
@property(nonatomic, copy) NSString *onDraggingFuncId;
@property(nonatomic, copy) NSString *onDraggedFuncId;

@property(nonatomic, assign) NSUInteger rowCount;
@property(nonatomic, assign) BOOL needReload;
@end

@implementation DoricListNode
- (instancetype)initWithContext:(DoricContext *)doricContext {
    if (self = [super initWithContext:doricContext]) {
        _itemViewIds = [NSMutableDictionary new];
        _itemHeights = [NSMutableDictionary new];
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

- (UITableView *)build {
    return [[DoricTableView new] also:^(UITableView *it) {
        it.dataSource = self;
        it.delegate = self;
        it.separatorStyle = UITableViewCellSeparatorStyleNone;
        it.allowsSelection = NO;
        it.estimatedRowHeight = 0; // avoid reload data blink
        it.showsVerticalScrollIndicator = NO;
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
    NSIndexPath *indexPath = [self.view indexPathForRowAtPoint:locationInView];
    if (sender.state == UIGestureRecognizerStateBegan) {
        if (indexPath != nil) {
            self.initialDragIndexPath = indexPath;
            self.currentDragIndexPath = indexPath;
            if (self.beforeDraggingFuncId != nil) {
                [self callJSResponse:self.beforeDraggingFuncId, @(indexPath.row), nil];
            }
        }
    } else if (sender.state == UIGestureRecognizerStateChanged) {
        if ((indexPath != nil) && (indexPath != self.currentDragIndexPath)) {
            NSString *fromValue = self.itemViewIds[@(self.currentDragIndexPath.row)];
            NSString *toValue = self.itemViewIds[@(indexPath.row)];
            self.itemViewIds[@(self.currentDragIndexPath.row)] = toValue;
            self.itemViewIds[@(indexPath.row)] = fromValue;

            [self.view moveRowAtIndexPath:self.currentDragIndexPath toIndexPath:indexPath];
            if (self.onDraggingFuncId != nil) {
                [self callJSResponse:self.onDraggingFuncId, @(self.currentDragIndexPath.row), @(indexPath.row), nil];
            }
            self.currentDragIndexPath = indexPath;
        }
    } else if (sender.state == UIGestureRecognizerStateEnded) {
        if (self.onDraggedFuncId != nil) {
            [self callJSResponse:self.onDraggedFuncId, @(self.initialDragIndexPath.row), @(self.currentDragIndexPath.row), nil];
        }
    }
}

- (void)blendView:(UITableView *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([@"scrollable" isEqualToString:name]) {
        self.view.scrollEnabled = [prop boolValue];
    } else if ([@"bounces" isEqualToString:name]) {
        self.view.bounces = [prop boolValue];
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
            [view scrollToRowAtIndexPath:[NSIndexPath indexPathForRow:[prop unsignedIntegerValue] inSection:0] atScrollPosition:UITableViewScrollPositionTop animated:NO];
        });
    } else if ([@"canDrag" isEqualToString:name]) {
        bool canDrag = [prop boolValue];
        [self.longPress setEnabled:canDrag];
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
        });
    }
    self.needReload = false;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return self.rowCount;
}

- (void)callLoadMore {
    if (self.rowCount - 1 != self.loadAnchor) {
        self.loadAnchor = self.rowCount - 1;
        [self callJSResponse:self.onLoadMoreFuncId, nil];
    }
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    NSUInteger position = (NSUInteger) indexPath.row;
    NSDictionary *model = [self itemModelAt:position];
    NSDictionary *props = model[@"props"];
    NSString *reuseId = props[@"identifier"];
    self.itemActions[@(position)] = props[@"actions"];
    if (self.loadMore
            && position >= self.rowCount - 1
            && self.onLoadMoreFuncId) {
        reuseId = @"doricLoadMoreCell";
        [self callLoadMore];
    }
    DoricTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:reuseId ?: @"doricCell"];
    if (!cell) {
        cell = [[DoricTableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:reuseId ?: @"doricCell"];
        DoricListItemNode *listItemNode = (DoricListItemNode *) [DoricViewNode create:self.doricContext withType:@"ListItem"];
        [listItemNode initWithSuperNode:self];
        cell.doricListItemNode = listItemNode;
        cell.backgroundColor = [UIColor clearColor];
        listItemNode.view.width = tableView.width;
        [cell.contentView addSubview:listItemNode.view];
    } else {
        [cell.doricListItemNode reset];
    }
    DoricListItemNode *node = cell.doricListItemNode;
    node.viewId = model[@"id"];
    [node blend:props];
    [node.view.doricLayout apply:CGSizeMake(tableView.width, tableView.height)];
    [node requestLayout];
    [self callItem:position height:node.view.height];
    return cell;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
    NSUInteger position = (NSUInteger) indexPath.row;
    NSNumber *heightNumber = self.itemHeights[@(position)];
    if (heightNumber) {
        return [heightNumber floatValue];
    } else {
        return 44.f;
    }
}

- (BOOL)tableView:(UITableView *)tableView canEditRowAtIndexPath:(NSIndexPath *)indexPath {
    NSArray *actions = self.itemActions[@(indexPath.row)];
    return actions.count > 0;
}

- (nullable NSArray<UITableViewRowAction *> *)tableView:(UITableView *)tableView editActionsForRowAtIndexPath:(NSIndexPath *)indexPath {
    NSArray *actions = self.itemActions[@(indexPath.row)];
    NSMutableArray <UITableViewRowAction *> *array = [NSMutableArray new];
    for (NSDictionary *action in actions) {
        UITableViewRowAction *tableViewRowAction = [UITableViewRowAction
                rowActionWithStyle:UITableViewRowActionStyleNormal
                             title:action[@"title"]
                           handler:^(UITableViewRowAction *tableViewRowAction, NSIndexPath *indexPath) {
                               UITableViewCell *cell = [tableView cellForRowAtIndexPath:indexPath];
                               if ([cell isKindOfClass:DoricTableViewCell.class]) {
                                   [((DoricTableViewCell *) cell).doricListItemNode callJSResponse:action[@"callback"], nil];
                               } else {
                                   DoricLog(@"Cannot find table cell");
                               }
                           }];
        [action[@"backgroundColor"] let:^(id it) {
            tableViewRowAction.backgroundColor = DoricColor(it);
        }];
        [array addObject:tableViewRowAction];
    }
    return array;
}

- (nullable UISwipeActionsConfiguration *)tableView:(UITableView *)tableView trailingSwipeActionsConfigurationForRowAtIndexPath:(NSIndexPath *)indexPath  API_AVAILABLE(ios(11.0)) {
    NSArray *actions = self.itemActions[@(indexPath.row)];
    NSMutableArray<UIContextualAction *> *array = [NSMutableArray new];
    for (NSDictionary *action in actions) {
        UIContextualAction *contextualAction = [UIContextualAction
                contextualActionWithStyle:UIContextualActionStyleNormal
                                    title:action[@"title"]
                                  handler:^(UIContextualAction *_Nonnull contextualAction, __kindof UIView *_Nonnull sourceView, void (^_Nonnull completionHandler)(BOOL)) {
                                      UITableViewCell *cell = [tableView cellForRowAtIndexPath:indexPath];
                                      if ([cell isKindOfClass:DoricTableViewCell.class]) {
                                          [((DoricTableViewCell *) cell).doricListItemNode callJSResponse:action[@"callback"], nil];
                                      } else {
                                          DoricLog(@"Cannot find table cell");
                                      }
                                  }];
        [action[@"backgroundColor"] let:^(id it) {
            contextualAction.backgroundColor = DoricColor(it);
        }];
        [array addObject:contextualAction];
    }
    UISwipeActionsConfiguration *configuration = [UISwipeActionsConfiguration configurationWithActions:array];
    configuration.performsFirstActionWithFullSwipe = NO;
    return configuration;
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
    if (viewNode) {
        CGSize originSize = viewNode.view.frame.size;
        [viewNode blend:subModel[@"props"]];
        [viewNode.view.doricLayout apply:CGSizeMake(self.view.width, self.view.height)];
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
                [UIView performWithoutAnimation:^{
                    NSUInteger itemCount = self.rowCount;
                    if (itemCount <= [key integerValue] || currentCount != itemCount) {
                        [self.view reloadData];
                        return;
                    }
                    NSIndexPath *indexPath = [NSIndexPath indexPathForRow:[key integerValue] inSection:0];
                    @try {
                        [self.view reloadRowsAtIndexPaths:@[indexPath] withRowAnimation:UITableViewRowAnimationNone];
                    }
                    @catch (id exception) {
                        [self.doricContext.driver.registry onException:exception inContext:self.doricContext];
                    }
                }];
            }
        }];
    });

}

- (void)callItem:(NSUInteger)position height:(CGFloat)height {
    NSNumber *old = self.itemHeights[@(position)];
    if (old && [old isEqualToNumber:@(height)]) {
        return;
    }
    NSUInteger currentCount = self.rowCount;
    self.itemHeights[@(position)] = @(height);
    if (@available(iOS 12.0, *)) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (self.view.doricLayout.heightSpec == DoricLayoutFit) {
                DoricSuperNode *node = self.superNode;
                while (node.superNode != nil) {
                    node = node.superNode;
                }
                [node requestLayout];
            }
            [UIView performWithoutAnimation:^{
                NSUInteger itemCount = self.rowCount;
                if (itemCount <= position || currentCount != itemCount) {
                    return;
                }
                NSIndexPath *indexPath = [NSIndexPath indexPathForRow:position inSection:0];
                @try {
                    [self.view reloadRowsAtIndexPaths:@[indexPath] withRowAnimation:UITableViewRowAnimationNone];
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
        for (UITableViewCell *tableViewCell in self.view.visibleCells) {
            if ([tableViewCell isKindOfClass:[DoricTableViewCell class]]) {
                DoricListItemNode *node = ((DoricTableViewCell *) tableViewCell).doricListItemNode;
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

- (void)scrollToItem:(NSDictionary *)params {
    BOOL animated = [params[@"animated"] boolValue];
    NSUInteger scrolledPosition = [params[@"index"] unsignedIntegerValue];

    if (scrolledPosition < self.rowCount && scrolledPosition >= 0) {
        for (int i = 0; i <= scrolledPosition; i++) {
            [self tableView:self.view cellForRowAtIndexPath:[NSIndexPath indexPathForRow:i inSection:0]];
        }

        dispatch_async(dispatch_get_main_queue(), ^{
            [self.view scrollToRowAtIndexPath:[NSIndexPath indexPathForRow:scrolledPosition inSection:0] atScrollPosition:UITableViewScrollPositionNone animated:animated];
        });
    } else {
        [self.doricContext.driver.registry onLog:DoricLogTypeError
                                         message:[NSString stringWithFormat:@"scrollToItem Error:%@", @"scrolledPosition range error"]];
    }
}

- (NSArray *)findVisibleItems {
    return [self.view.indexPathsForVisibleRows map:^id(NSIndexPath *obj) {
        return @(obj.row);
    }];
}

- (NSArray *)findCompletelyVisibleItems {
    NSArray<__kindof UITableViewCell *> *items = [self.view.visibleCells filter:^BOOL(__kindof UITableViewCell *obj) {
        return CGRectContainsRect(self.view.bounds, obj.frame);
    }];
    return [items map:^id(__kindof UITableViewCell *obj) {
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
    self.beforeDraggingFuncId = nil;
    self.onDraggingFuncId = nil;
    self.onDraggedFuncId = nil;
    self.loadMore = NO;
}

- (void)subNodeContentChanged:(DoricViewNode *)subNode {
    [subNode.view.doricLayout apply];
    [super subNodeContentChanged:subNode];
}
@end
