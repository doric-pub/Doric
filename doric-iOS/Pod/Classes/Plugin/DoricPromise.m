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
//  DoricPromise.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/29.
//

#import "DoricPromise.h"
#import "DoricConstant.h"

@interface DoricPromise ()
@property(nonatomic, weak) DoricContext *context;
@property(nonatomic, strong) NSString *callbackId;

@end

@implementation DoricPromise

- (instancetype)initWithContext:(DoricContext *)context callbackId:(NSString *)callbackId {
    if (self = [super init]) {
        _context = context;
        _callbackId = callbackId;
    }
    return self;
}

- (void)resolve:(id)result {
    __weak typeof(self) __self = self;
    if (self.context == nil) {
        return;
    }
    [[self.context.driver invokeDoricMethod:DORIC_BRIDGE_RESOLVE
                             argumentsArray:result
                                     ? @[self.context.contextId, self.callbackId, result]
                                     : @[self.context.contextId, self.callbackId]]
            setExceptionCallback:^(NSException *e) {
                __strong typeof(__self) self = __self;
                [self.context.driver.registry
                        onException:e
                          inContext:self.context];
            }];
}

- (void)reject:(id)result {
    __weak typeof(self) __self = self;
    if (self.context == nil) {
        return;
    }
    [[self.context.driver invokeDoricMethod:DORIC_BRIDGE_REJECT
                             argumentsArray:result
                                     ? @[self.context.contextId, self.callbackId, result]
                                     : @[self.context.contextId, self.callbackId]]
            setExceptionCallback:^(NSException *e) {
                __strong typeof(__self) self = __self;
                [self.context.driver.registry
                        onException:e
                          inContext:self.context];
            }];
}
@end
