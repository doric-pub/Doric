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
// Created by pengfei.zhou on 2019/11/26.
//

#import "DoricRefreshableNode.h"
#import "Doric.h"

@interface DoricRefreshableNode () <DoricSwipePullingDelegate>
@property(nonatomic, strong) DoricViewNode *contentNode;
@property(nonatomic, copy) NSString *contentViewId;
@property(nonatomic, strong) DoricViewNode *headerNode;
@property(nonatomic, copy) NSString *headerViewId;
@end

@implementation DoricRefreshableNode
- (DoricSwipeRefreshLayout *)build {
    return [[DoricSwipeRefreshLayout new] also:^(DoricSwipeRefreshLayout *it) {
        it.swipePullingDelegate = self;
    }];
}

- (void)blendView:(DoricSwipeRefreshLayout *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([@"content" isEqualToString:name]) {
        self.contentViewId = prop;
    } else if ([@"header" isEqualToString:name]) {
        self.headerViewId = prop;
    } else if ([@"onRefresh" isEqualToString:name]) {
        __weak typeof(self) _self = self;
        NSString *funcId = prop;
        self.view.onRefreshBlock = ^{
            __strong  typeof(_self) self = _self;
            [self callJSResponse:funcId, nil];
        };
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (DoricViewNode *)subNodeWithViewId:(NSString *)viewId {
    if ([viewId isEqualToString:self.contentViewId]) {
        return self.contentNode;
    } else if ([viewId isEqualToString:self.headerViewId]) {
        return self.headerNode;
    } else {
        return nil;
    }
}

- (void)afterBlended:(NSDictionary *)props {
    [self blendContent];
    [self blendHeader];
}

- (void)blendContent {
    NSDictionary *contentModel = [self subModelOf:self.contentViewId];
    if (!contentModel) {
        return;
    }
    NSString *viewId = contentModel[@"id"];
    NSString *type = contentModel[@"type"];
    NSDictionary *childProps = contentModel[@"props"];
    if (self.contentNode) {
        if ([self.contentNode.viewId isEqualToString:viewId]) {
            //skip
        } else {
            if (self.reusable && [type isEqualToString:self.contentNode.type]) {
                [self.contentNode also:^(DoricViewNode *it) {
                    it.viewId = viewId;
                    [it blend:childProps];
                }];
            } else {
                self.contentNode = [[DoricViewNode create:self.doricContext withType:type] also:^(DoricViewNode *it) {
                    it.viewId = viewId;
                    [it initWithSuperNode:self];
                    [it blend:childProps];
                    self.view.contentView = it.view;
                }];
            }
        }
    } else {
        self.contentNode = [[DoricViewNode create:self.doricContext withType:type] also:^(DoricViewNode *it) {
            it.viewId = viewId;
            [it initWithSuperNode:self];
            [it blend:childProps];
            self.view.contentView = it.view;
        }];
    }
}

- (void)blendHeader {
    NSDictionary *headerModel = [self subModelOf:self.headerViewId];
    if (!headerModel) {
        return;
    }
    NSString *viewId = headerModel[@"id"];
    NSString *type = headerModel[@"type"];
    NSDictionary *childProps = headerModel[@"props"];
    if (self.headerNode) {
        if ([self.headerNode.viewId isEqualToString:viewId]) {
            //skip
        } else {
            if (self.reusable && [type isEqualToString:self.headerNode.type]) {
                [self.headerNode also:^(DoricViewNode *it) {
                    it.viewId = viewId;
                    [it blend:childProps];
                }];
            } else {
                self.headerNode = [[DoricViewNode create:self.doricContext withType:type] also:^(DoricViewNode *it) {
                    it.viewId = viewId;
                    [it initWithSuperNode:self];
                    [it blend:childProps];
                    self.view.headerView = it.view;
                }];
            }
        }
    } else {
        self.headerNode = [[DoricViewNode create:self.doricContext withType:type] also:^(DoricViewNode *it) {
            it.viewId = viewId;
            [it initWithSuperNode:self];
            [it blend:childProps];
            self.view.headerView = it.view;
        }];
    }
}

- (void)requestLayout {
    [self.contentNode requestLayout];
    [self.view.headerView.doricLayout apply:self.view.frame.size];
    self.view.headerView.bottom = 0;
    self.view.headerView.centerX = self.view.width / 2;
    [self.view.contentView.doricLayout apply:self.view.frame.size];
    [super requestLayout];
}

- (void)blendSubNode:(NSDictionary *)subModel {
    [[self subNodeWithViewId:subModel[@"id"]] blend:subModel[@"props"]];
}

- (void)startAnimation {
    [self.headerNode callJSResponse:@"startAnimation", nil];
}

- (void)stopAnimation {
    [self.headerNode callJSResponse:@"stopAnimation", nil];
}

- (void)setPullingDistance:(CGFloat)distance {
    [self.headerNode callJSResponse:@"setPullingDistance", @(distance), nil];
}

- (void)setRefreshing:(NSNumber *)refreshable withPromise:(DoricPromise *)promise {
    self.view.refreshing = [refreshable boolValue];
    [promise resolve:nil];
}

- (void)setRefreshable:(NSNumber *)refreshing withPromise:(DoricPromise *)promise {
    self.view.refreshable = [refreshing boolValue];
    [promise resolve:nil];
}

- (NSNumber *)isRefreshing {
    return @(self.view.refreshing);
}

- (NSNumber *)isRefreshable {
    return @(self.view.refreshable);
}
@end
