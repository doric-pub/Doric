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
    dispatch_async(dispatch_get_main_queue(), ^{
        BOOL animated = YES;
        if (params[@"animated"]) {
            animated = [params[@"animated"] boolValue];
        }
        [self.doricContext.navigator doric_navigator_push:params[@"scheme"] alias:params[@"alias"] animated:animated];
    });
}

- (void)pop:(NSDictionary *)params {
    dispatch_async(dispatch_get_main_queue(), ^{
        BOOL animated = YES;
        if (params[@"animated"]) {
            animated = [params[@"animated"] boolValue];
        }
        [self.doricContext.navigator doric_navigator_pop:animated];
    });
}
@end