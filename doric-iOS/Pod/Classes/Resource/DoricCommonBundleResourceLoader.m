/*
 * Copyright [2021] [Doric.Pub]
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
// Created by pengfei.zhou on 2021/10/25.
//

#import "DoricCommonBundleResourceLoader.h"
#import "DoricBundleResource.h"
#import "DoricExtensions.h"

@implementation DoricCommonBundleResourceLoader
- (NSString *)resourceType {
    return @"bundle";
}

- (__kindof DoricResource *)load:(NSString *)identifier withContext:(DoricContext *)context {
    NSArray<NSString *> *ret = [identifier componentsSeparatedByString:@"://"];
    NSString *bundleName = ret.firstObject;
    NSString *fileName = ret.lastObject;
    NSBundle *mainBundle = [NSBundle mainBundle];
    NSString *bundlePath = [mainBundle pathForResource:bundleName ofType:@"bundle"];
    NSBundle *bundle = [NSBundle bundleWithPath:bundlePath];
    return [[[DoricBundleResource alloc] initWithContext:context identifier:fileName]
            also:^(DoricBundleResource *it) {
                it.bundle = bundle;
            }];
}
@end