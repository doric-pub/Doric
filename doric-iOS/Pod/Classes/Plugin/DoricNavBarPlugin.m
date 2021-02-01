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
// Created by pengfei.zhou on 2019/11/25.
//

#import "DoricNavBarPlugin.h"
#import "DoricUtil.h"
#import "DoricViewNode.h"
#import "DoricExtensions.h"

@implementation DoricNavBarPlugin

static NSString *TYPE_LEFT = @"navbar_left";
static NSString *TYPE_RIGHT = @"navbar_right";
static NSString *TYPE_CENTER = @"navbar_center";

- (void)isHidden:(NSDictionary *)param withPromise:(DoricPromise *)promise {
    if (self.doricContext.navBar) {
        __weak typeof(self) _self = self;
        [self.doricContext dispatchToMainQueue:^{
            __strong typeof(_self) self = _self;
            [promise resolve:@([self.doricContext.navBar doric_navBar_isHidden])];
        }];
    } else {
        [promise reject:@"Not implement NavBar"];
    }
}

- (void)setHidden:(NSDictionary *)param withPromise:(DoricPromise *)promise {
    if (self.doricContext.navBar) {
        __weak typeof(self) _self = self;
        [self.doricContext dispatchToMainQueue:^{
            __strong typeof(_self) self = _self;
            [self.doricContext.navBar doric_navBar_setHidden:[param optBool:@"hidden"]];
            [promise resolve:nil];
        }];
    } else {
        [promise reject:@"Not implement NavBar"];
    }
}

- (void)setTitle:(NSDictionary *)param withPromise:(DoricPromise *)promise {
    if (self.doricContext.navBar) {
        __weak typeof(self) _self = self;
        [self.doricContext dispatchToMainQueue:^{
            __strong typeof(_self) self = _self;
            [self.doricContext.navBar doric_navBar_setTitle:[param optString:@"title"]];
            [promise resolve:nil];
        }];
    } else {
        [promise reject:@"Not implement NavBar"];
    }
}

- (void)setBgColor:(NSDictionary *)param withPromise:(DoricPromise *)promise {
    if (self.doricContext.navBar) {
        __weak typeof(self) _self = self;
        [self.doricContext dispatchToMainQueue:^{
            __strong typeof(_self) self = _self;
            UIColor *color = DoricColor([param optNumber:@"color"]);
            [self.doricContext.navBar doric_navBar_setBackgroundColor:color];
            [promise resolve:nil];
        }];
    } else {
        [promise reject:@"Not implement NavBar"];
    }
}

- (void)setLeft:(NSDictionary *)params withPromise:(DoricPromise *)promise {
    if (self.doricContext.navBar) {
        __weak typeof(self) _self = self;
        [self.doricContext dispatchToMainQueue:^{
            __strong typeof(_self) self = _self;
            NSString *viewId = [params optString:@"id"];
            NSString *type = [params optString:@"type"];
            DoricViewNode *viewNode = [self.doricContext targetViewNode:viewId];
            if (!viewNode) {
                viewNode = [[DoricViewNode create:self.doricContext withType:type] also:^(DoricViewNode *it) {
                    it.viewId = viewId;
                    [it initWithSuperNode:nil];

                    NSMutableDictionary <NSString *, DoricViewNode *> *map = self.doricContext.headNodes[TYPE_LEFT];
                    if (map != nil) {
                        self.doricContext.headNodes[TYPE_LEFT][viewId] = it;
                    } else {
                        map = [[NSMutableDictionary alloc] init];
                        map[viewId] = it;
                        self.doricContext.headNodes[TYPE_LEFT] = map;
                    }
                }];
            }
            [viewNode blend:[params optObject:@"props"]];
            [self.doricContext.navBar doric_navBar_setLeft:viewNode.view];
            [promise resolve:nil];
        }];
    } else {
        [promise reject:@"Not implement NavBar"];
    }
}

- (void)setRight:(NSDictionary *)params withPromise:(DoricPromise *)promise {
    if (self.doricContext.navBar) {
        __weak typeof(self) _self = self;
        [self.doricContext dispatchToMainQueue:^{
            __strong typeof(_self) self = _self;
            NSString *viewId = [params optString:@"id"];
            NSString *type = [params optString:@"type"];
            DoricViewNode *viewNode = [self.doricContext targetViewNode:viewId];
            if (!viewNode) {
                viewNode = [[DoricViewNode create:self.doricContext withType:type] also:^(DoricViewNode *it) {
                    it.viewId = viewId;
                    [it initWithSuperNode:nil];

                    NSMutableDictionary <NSString *, DoricViewNode *> *map = self.doricContext.headNodes[TYPE_RIGHT];
                    if (map != nil) {
                        self.doricContext.headNodes[TYPE_RIGHT][viewId] = it;
                    } else {
                        map = [[NSMutableDictionary alloc] init];
                        map[viewId] = it;
                        self.doricContext.headNodes[TYPE_RIGHT] = map;
                    }
                }];
            }
            [viewNode blend:[params optObject:@"props"]];
            [self.doricContext.navBar doric_navBar_setRight:viewNode.view];
            [promise resolve:nil];
        }];
    } else {
        [promise reject:@"Not implement NavBar"];
    }
}

- (void)setCenter:(NSDictionary *)params withPromise:(DoricPromise *)promise {
    if (self.doricContext.navBar) {
        __weak typeof(self) _self = self;
        [self.doricContext dispatchToMainQueue:^{
            __strong typeof(_self) self = _self;
            NSString *viewId = [params optString:@"id"];
            NSString *type = [params optString:@"type"];
            DoricViewNode *viewNode = [self.doricContext targetViewNode:viewId];
            if (!viewNode) {
                viewNode = [[DoricViewNode create:self.doricContext withType:type] also:^(DoricViewNode *it) {
                    it.viewId = viewId;
                    [it initWithSuperNode:nil];

                    NSMutableDictionary <NSString *, DoricViewNode *> *map = self.doricContext.headNodes[TYPE_CENTER];
                    if (map != nil) {
                        self.doricContext.headNodes[TYPE_CENTER][viewId] = it;
                    } else {
                        map = [[NSMutableDictionary alloc] init];
                        map[viewId] = it;
                        self.doricContext.headNodes[TYPE_CENTER] = map;
                    }
                }];
            }
            [viewNode blend:[params optObject:@"props"]];
            [self.doricContext.navBar doric_navBar_setCenter:viewNode.view];
            [promise resolve:nil];
        }];
    } else {
        [promise reject:@"Not implement NavBar"];
    }
}

@end
