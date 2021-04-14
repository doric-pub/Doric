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
#import "DoricListNode.h"
#import "DoricExtensions.h"
#import "DoricListItemNode.h"
#import "DoricRefreshableNode.h"
#import "DoricJSDispatcher.h"

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
@property(nonatomic, assign) NSUInteger itemCount;
@property(nonatomic, assign) NSUInteger batchCount;
@property(nonatomic, copy) NSString *onLoadMoreFuncId;
@property(nonatomic, copy) NSString *renderItemFuncId;
@property(nonatomic, copy) NSString *loadMoreViewId;
@property(nonatomic, assign) BOOL loadMore;
@property(nonatomic, assign) NSUInteger loadAnchor;
@property(nonatomic, strong) NSMutableSet <DoricDidScrollBlock> *didScrollBlocks;
@property(nonatomic, copy) NSString *onScrollFuncId;
@property(nonatomic, copy) NSString *onScrollEndFuncId;
@property(nonatomic, strong) DoricJSDispatcher *jsDispatcher;
@end

@implementation DoricListNode
- (instancetype)initWithContext:(DoricContext *)doricContext {
    if (self = [super initWithContext:doricContext]) {
        _itemViewIds = [NSMutableDictionary new];
        _itemHeights = [NSMutableDictionary new];
        _batchCount = 15;
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
    }];
}

- (void)blendView:(UITableView *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([@"itemCount" isEqualToString:name]) {
        self.itemCount = [prop unsignedIntegerValue];
        [self.view reloadData];
    } else if ([@"renderItem" isEqualToString:name]) {
        if (![self.renderItemFuncId isEqualToString:prop]) {
            self.renderItemFuncId = prop;
            [self.itemViewIds.allValues forEach:^(NSString *obj) {
                [self removeSubModel:obj];
            }];
            [self.itemViewIds removeAllObjects];
            [self.view reloadData];
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
    } else if ([@"scrolledPosition" isEqualToString:name]) {
        dispatch_async(dispatch_get_main_queue(), ^{
            [view scrollToRowAtIndexPath:[NSIndexPath indexPathForRow:[prop unsignedIntegerValue] inSection:0] atScrollPosition:UITableViewScrollPositionTop animated:NO];
        });
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (void)blend:(NSDictionary *)props {
    [super blend:props];
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return self.itemCount + (self.loadMore ? 1 : 0);
}

- (void)callLoadMore {
    if (self.itemCount != self.loadAnchor) {
        self.loadAnchor = self.itemCount;
        [self callJSResponse:self.onLoadMoreFuncId, nil];
    }
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    NSUInteger position = (NSUInteger) indexPath.row;
    NSDictionary *model = [self itemModelAt:position];
    NSDictionary *props = model[@"props"];
    NSString *reuseId = props[@"identifier"];
    if (position > 0 && position >= self.itemCount && self.onLoadMoreFuncId) {
        reuseId = @"doricLoadMoreCell";
        [self callLoadMore];
    }
    DoricTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:reuseId ?: @"doriccell"];
    if (!cell) {
        cell = [[DoricTableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:reuseId ?: @"doriccell"];
        DoricListItemNode *listItemNode = [[DoricListItemNode alloc] initWithContext:self.doricContext];
        [listItemNode initWithSuperNode:self];
        cell.doricListItemNode = listItemNode;
        cell.backgroundColor = [UIColor clearColor];
        listItemNode.view.width = tableView.width;
        [cell.contentView addSubview:listItemNode.view];
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

- (NSDictionary *)itemModelAt:(NSUInteger)position {
    if (position >= self.itemCount) {
        return [self subModelOf:self.loadMoreViewId];
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
        NSString *viewId = self.itemViewIds[@(position)];
        if (viewId && viewId.length > 0) {
            return [self subModelOf:viewId];
        } else {
            return nil;
        }
    }
}

- (void)blendSubNode:(NSDictionary *)subModel {
    ///Here async blend sub node because the item count need to be applied first.
    NSUInteger currentCount = self.itemCount + (self.loadMore ? 1 : 0);
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
                [UIView performWithoutAnimation:^{
                    NSUInteger itemCount = self.itemCount + (self.loadMore ? 1 : 0);
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
    NSUInteger currentCount = self.itemCount + (self.loadMore ? 1 : 0);
    self.itemHeights[@(position)] = @(height);
    if (@available(iOS 10.0, *)) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (self.view.doricLayout.heightSpec == DoricLayoutFit) {
                DoricSuperNode *node = self.superNode;
                while (node.superNode != nil) {
                    node = node.superNode;
                }
                [node requestLayout];
            }
            [UIView performWithoutAnimation:^{
                NSUInteger itemCount = self.itemCount + (self.loadMore ? 1 : 0);
                if (itemCount <= position || currentCount != itemCount) {
                    [self.view reloadData];
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
    [self.view scrollToRowAtIndexPath:[NSIndexPath indexPathForRow:scrolledPosition inSection:0] atScrollPosition:UITableViewScrollPositionNone animated:animated];
}

@end
