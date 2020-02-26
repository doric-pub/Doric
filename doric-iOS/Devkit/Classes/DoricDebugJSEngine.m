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
//  DoricDebugJSEngine.m
//  Doric
//
//  Created by jingpeng.wang on 2020/2/25.
//

#import "DoricDebugJSEngine.h"
#import "DoricJSRemoteExecutor.h"

@interface DoricDebugJSEngine ()
@end

@implementation DoricDebugJSEngine

- (instancetype)init {
    if (self = [super init]) {
    }
    return self;
}

- (void)initJSEngine {
    self.jsExecutor = [[DoricJSRemoteExecutor alloc] init];
}

@end
