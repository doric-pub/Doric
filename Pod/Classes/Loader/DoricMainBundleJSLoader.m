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

#import "DoricMainBundleJSLoader.h"


@implementation DoricMainBundleJSLoader
- (BOOL)filter:(NSString *)scheme {
    return [scheme hasPrefix:@"assets"];
}

- (DoricAsyncResult <NSString *> *)request:(NSString *)scheme {
    DoricAsyncResult <NSString *> *ret = [DoricAsyncResult new];
    NSString *path = [[NSBundle mainBundle] bundlePath];
    NSString *fullPath = [path stringByAppendingPathComponent:[scheme substringFromIndex:@"assets://".length]];
    NSError *error;
    NSString *jsContent = [NSString stringWithContentsOfFile:fullPath encoding:NSUTF8StringEncoding error:&error];
    if (error) {
        [ret setupError:[NSException new]];
    } else {
        [ret setupResult:jsContent];
    }
    return ret;
}

@end