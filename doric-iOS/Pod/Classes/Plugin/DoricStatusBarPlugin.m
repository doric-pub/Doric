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
// Created by jingpeng.wang on 2020/01/11.
//

#import "DoricStatusBarPlugin.h"
#import "DoricUtil.h"
#import "DoricExtensions.h"
#import "DoricViewController.h"

@implementation DoricStatusBarPlugin

- (void)setHidden:(NSDictionary *)param withPromise:(DoricPromise *)promise {
    __weak typeof(self) _self = self;
    [self.doricContext dispatchToMainQueue:^{
        __strong typeof(_self) self = _self;
        if (self.doricContext.statusBar) {
            [self.doricContext.statusBar doric_statusBar_setHidden:[param optBool:@"hidden"]];
        }
    }];
}

- (void)setMode:(NSDictionary *)param withPromise:(DoricPromise *)promise {
    __weak typeof(self) _self = self;
    [self.doricContext dispatchToMainQueue:^{
        __strong typeof(_self) self = _self;
        if (self.doricContext.statusBar) {
            [self.doricContext.statusBar doric_statusBar_setMode:[[param optNumber:@"mode"] intValue]];
        }
    }];
}

- (void)setColor:(NSDictionary *)param withPromise:(DoricPromise *)promise {
    __weak typeof(self) _self = self;
    [self.doricContext dispatchToMainQueue:^{
        __strong typeof(_self) self = _self;
        if (self.doricContext.navBar) {
            UIColor *color = DoricColor([param optNumber:@"color"]);
            [self.doricContext.navBar doric_navBar_setBackgroundColor:color];
        }
    }];
}

@end
