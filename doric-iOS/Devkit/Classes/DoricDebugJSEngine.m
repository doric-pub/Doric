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

#import "DoricContext.h"
#import "DoricDebugJSEngine.h"
#import "DoricRemoteJSExecutor.h"
#import "DoricDevMonitor.h"

@interface DoricDebugJSEngine ()
@property(nonatomic, weak) DoricWSClient *wsClient;
@end

@implementation DoricDebugJSEngine

- (instancetype)initWithWSClient:(DoricWSClient *)wsClient {
    if (self = [super init]) {
        _wsClient = wsClient;
        [self.registry registerMonitor:[DoricDevMonitor new]];
    }
    return self;
}

- (void)initJSEngine {
    self.jsExecutor = [[DoricRemoteJSExecutor alloc] initWithWSClient:self.wsClient];
}

- (void)teardown {
    [super teardown];
    if ([self.jsExecutor isKindOfClass:DoricRemoteJSExecutor.class]) {
        [((DoricRemoteJSExecutor *) (self.jsExecutor)) teardown];
    }
}

- (void)ensureRunOnJSThread:(dispatch_block_t)block {
    if ([self.jsExecutor isKindOfClass:DoricRemoteJSExecutor.class]
            && ((DoricRemoteJSExecutor *) (self.jsExecutor)).invokingMethod) {
        NSThread *thread = [[NSThread alloc] initWithBlock:block];
        [thread start];
    } else {
        [super ensureRunOnJSThread:block];
    }
}
@end
