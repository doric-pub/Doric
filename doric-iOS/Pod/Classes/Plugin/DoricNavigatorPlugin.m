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

#import "DoricNavigatorPlugin.h"


@implementation DoricNavigatorPlugin
- (void)push:(NSDictionary *)params {
    __weak typeof(self) _self = self;
    [self.doricContext dispatchToMainQueue:^{
        __strong typeof(_self) self = _self;
        BOOL animated = YES;
        NSString *source = params[@"source"];
        NSString *alias = source;
        NSDictionary *config = params[@"config"];
        if (config) {
            if (config[@"animated"]) {
                animated = [config[@"animated"] boolValue];
            }

            if (config[@"alias"]) {
                alias = config[@"alias"];
            }
        }
        [self.doricContext.navigator doric_navigator_push:source alias:alias animated:animated extra:config[@"extra"]];
    }];
}

- (void)pop:(NSDictionary *)params {
    __weak typeof(self) _self = self;
    [self.doricContext dispatchToMainQueue:^{
        __strong typeof(_self) self = _self;
        BOOL animated = YES;
        if (params[@"animated"]) {
            animated = [params[@"animated"] boolValue];
        }
        [self.doricContext.navigator doric_navigator_pop:animated];
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
