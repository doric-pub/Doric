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
// Created by jingpeng.wang on 2022/1/10.
//

#import <DoricCore/Doric.h>
#import "DoricResourceLoaderPlugin.h"
#import "DoricExtensions.h"

@implementation DoricResourceLoaderPlugin
- (void)load:(NSDictionary *)resource withPromise:(DoricPromise *)promise {
    DoricResource *doricResource = [self.doricContext.driver.registry.loaderManager load:resource withContext:self.doricContext];
    if (doricResource != nil) {
        DoricAsyncResult *asyncResult = [doricResource fetch];
        [asyncResult setResultCallback:^(id  _Nonnull result) {
            [promise resolve:result];
        }];
        [asyncResult setExceptionCallback:^(NSException * _Nonnull e) {
            DoricLog(@"Cannot load resource %s, %s", resource.description, e.description);
        }];
    } else {
        DoricLog(@"Cannot find loader for resource %s", resource.description);
        [promise reject:@"Load error"];
    }
}
@end
