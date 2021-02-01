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
// Created by jingpeng.wang on 2020/03/19.
//

#import "DoricNotchPlugin.h"

@interface DoricNotchPlugin ()
@end

@implementation DoricNotchPlugin
- (instancetype)initWithContext:(DoricContext *)doricContext {
    if (self = [super initWithContext:doricContext]) {
    }
    return self;
}

- (void)inset:(NSDictionary *)argument withPromise:(DoricPromise *)promise {
    __weak typeof(self) _self = self;
    [self.doricContext dispatchToMainQueue:^{
        __strong typeof(_self) self = _self;
        if (@available(iOS 11.0, *)) {
            UIView *superView;
            if (self.doricContext.vc) {
                superView = self.doricContext.vc.view.window;
            } else {
                superView = [UIApplication sharedApplication].windows.lastObject;
            }

            CGFloat top = superView.safeAreaInsets.top;
            CGFloat left = superView.safeAreaInsets.left;
            CGFloat bottom = superView.safeAreaInsets.bottom;
            CGFloat right = superView.safeAreaInsets.right;
            [promise resolve:@{
                    @"top": @(top),
                    @"left": @(left),
                    @"bottom": @(bottom),
                    @"right": @(right),
            }];
        } else {
            [promise resolve:@{
                    @"top": @(0),
                    @"left": @(0),
                    @"bottom": @(0),
                    @"right": @(0),
            }];
        }
    }];
}
@end
