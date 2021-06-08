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
// Created by pengfei.zhou on 2019/11/23.
//

#import <DoricCore/Doric.h>
#import "DoricNavigatorPlugin.h"
#import "DoricExtensions.h"

@implementation DoricNavigatorPlugin
- (void)push:(NSDictionary *)params withPromise:(DoricPromise *)promise {
    __weak typeof(self) _self = self;
    [self.doricContext dispatchToMainQueue:^{
        __strong typeof(_self) self = _self;
        BOOL animated = YES;
        NSString *source = [params optString:@"source"];
        NSString *alias = source;
        NSDictionary *config = [params optObject:@"config"];
        if (config) {
            animated = [config optBool:@"animated" defaultValue:animated];
            alias = [config optString:@"alias" defaultValue:source];
        }
        [self.doricContext.navigator doric_navigator_push:source alias:alias animated:animated extra:config[@"extra"]];
        [promise resolve:nil];
    }];
}

- (void)pop:(NSDictionary *)params withPromise:(DoricPromise *)promise {
    __weak typeof(self) _self = self;
    [self.doricContext dispatchToMainQueue:^{
        __strong typeof(_self) self = _self;
        BOOL animated = [params optBool:@"animated" defaultValue:YES];
        [self.doricContext.navigator doric_navigator_pop:animated];
        [promise resolve:nil];
    }];
}

- (void)popSelf:(NSDictionary *)params withPromise:(DoricPromise *)promise {
    __weak typeof(self) _self = self;
    [self.doricContext dispatchToMainQueue:^{
        __strong typeof(_self) self = _self;
        BOOL animated = [params optBool:@"animated" defaultValue:YES];
        [self.doricContext.navigator doric_navigator_popSelf:animated];
        [promise resolve:nil];
    }];
}

- (void)popToRoot:(NSDictionary *)params withPromise:(DoricPromise *)promise {
    __weak typeof(self) _self = self;
    [self.doricContext dispatchToMainQueue:^{
        __strong typeof(_self) self = _self;
        BOOL animated = [params optBool:@"animated" defaultValue:YES];
        [self.doricContext.navigator doric_navigator_popToRoot:animated];
        [promise resolve:nil];
    }];
}

- (void)openUrl:(NSString *)urlString withPromise:(DoricPromise *)promise {
    [self.doricContext dispatchToMainQueue:^{
        NSURL *url = [NSURL URLWithString:urlString];
        [UIApplication.sharedApplication openURL:url options:@{} completionHandler:^(BOOL success) {
            if (success) {
                [promise resolve:nil];
            } else {
                [promise reject:@"Cannot open"];
            }
        }];
    }];
}
@end
