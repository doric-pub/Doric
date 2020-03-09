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
//  DoricDebugDriver.m
//  Doric
//
//  Created by jingpeng.wang on 2020/2/25.
//

#import "DoricDebugDriver.h"
#import "DoricDebugJSEngine.h"
#import "DoricConstant.h"
#import "DoricContextManager.h"

@interface DoricDebugDriver ()
@property(nonatomic, strong) DoricJSEngine *jsExecutor;
@end

@implementation DoricDebugDriver

@dynamic registry;

- (instancetype)init {
    if (self = [super init]) {
        _jsExecutor = [[DoricDebugJSEngine alloc] init];
    }
    return self;
}

- (DoricRegistry *)registry {
    return self.jsExecutor.registry;
}

- (DoricAsyncResult<JSValue *> *)invokeDoricMethod:(NSString *)method, ... {
    va_list args;
    va_start(args, method);
    DoricAsyncResult *ret = [self invokeDoricMethod:method arguments:args];
    va_end(args);
    return ret;
}

- (DoricAsyncResult<JSValue *> *)invokeDoricMethod:(NSString *)method arguments:(va_list)args {
    DoricAsyncResult *ret = [[DoricAsyncResult alloc] init];
    NSMutableArray *array = [[NSMutableArray alloc] init];
    id arg;
    while ((arg = va_arg(args, id)) != nil) {
        [array addObject:arg];
    }
    __weak typeof(self) _self = self;
    dispatch_async(self.jsExecutor.jsQueue, ^() {
        __strong typeof(_self) self = _self;
        if (!self) return;
        @try {
            JSValue *jsValue = [self.jsExecutor invokeDoricMethod:method argumentsArray:array];
            [ret setupResult:jsValue];
        } @catch (NSException *exception) {
            [ret setupError:exception];
        }
    });
    return ret;
}

- (DoricAsyncResult<JSValue *> *)invokeContextEntity:(NSString *)contextId method:(NSString *)method, ... {
    va_list args;
    va_start(args, method);
    DoricAsyncResult *ret = [self invokeContextEntity:contextId method:method arguments:args];
    va_end(args);
    return ret;
}

- (DoricAsyncResult *)invokeContextEntity:(NSString *)contextId method:(NSString *)method arguments:(va_list)args {
    DoricAsyncResult *ret = [[DoricAsyncResult alloc] init];
    NSMutableArray *array = [[NSMutableArray alloc] init];
    [array addObject:contextId];
    [array addObject:method];
    id arg = va_arg(args, id);
    while (arg != nil) {
        [array addObject:arg];
        arg = va_arg(args, JSValue *);
    }
    __weak typeof(self) _self = self;
    dispatch_async(self.jsExecutor.jsQueue, ^() {
        __strong typeof(_self) self = _self;
        if (!self) return;
        @try {
            JSValue *jsValue = [self.jsExecutor invokeDoricMethod:DORIC_CONTEXT_INVOKE argumentsArray:array];
            [ret setupResult:jsValue];
        } @catch (NSException *exception) {
            [ret setupError:exception];
        }
    });
    return ret;
}

- (DoricAsyncResult *)invokeContextEntity:(NSString *)contextId method:(NSString *)method argumentsArray:(NSArray *)args {
    DoricAsyncResult *ret = [[DoricAsyncResult alloc] init];
    NSMutableArray *array = [[NSMutableArray alloc] init];
    [array addObject:contextId];
    [array addObject:method];
    for (id arg in args) {
        [array addObject:arg];
    }
    __weak typeof(self) _self = self;
    dispatch_async(self.jsExecutor.jsQueue, ^() {
        __strong typeof(_self) self = _self;
        if (!self) return;
        @try {
            JSValue *jsValue = [self.jsExecutor invokeDoricMethod:DORIC_CONTEXT_INVOKE argumentsArray:array];
            [ret setupResult:jsValue];
        } @catch (NSException *exception) {
            [ret setupError:exception];
        }
    });
    return ret;
}

- (DoricAsyncResult *)createContext:(NSString *)contextId script:(NSString *)script source:(NSString *)source {
    DoricAsyncResult *ret = [[DoricAsyncResult alloc] init];
    __weak typeof(self) _self = self;
    dispatch_async(self.jsExecutor.jsQueue, ^() {
        __strong typeof(_self) self = _self;
        if (!self) return;
        @try {
            [self.jsExecutor prepareContext:contextId script:script source:source];
            [ret setupResult:@YES];
        } @catch (NSException *exception) {
            [ret setupError:exception];
        }
    });
    return ret;
}

- (DoricAsyncResult *)destroyContext:(NSString *)contextId {
    DoricAsyncResult *ret = [[DoricAsyncResult alloc] init];
    __weak typeof(self) _self = self;
    dispatch_async(self.jsExecutor.jsQueue, ^() {
        __strong typeof(_self) self = _self;
        if (!self) return;
        @try {
            [self.jsExecutor destroyContext:contextId];
            [ret setupResult:@YES];
        } @catch (NSException *exception) {
            [ret setupError:exception];
        }
    });
    return ret;
}

- (void)ensureSyncInMainQueue:(dispatch_block_t)block {
    if (strcmp(dispatch_queue_get_label(DISPATCH_CURRENT_QUEUE_LABEL), dispatch_queue_get_label(dispatch_get_main_queue())) == 0) {
        block();
    } else {
        dispatch_async(dispatch_get_main_queue(), block);
    }
}
@end
