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
//  DoricNativeDriver.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/26.
//

#import "DoricNativeDriver.h"
#import "DoricJSEngine.h"
#import "DoricConstant.h"
#import "DoricContextManager.h"
#import "DoricPerformanceProfile.h"
#import "DoricSingleton.h"

@interface DoricNativeDriver ()
@property(nonatomic, strong) DoricJSEngine *jsExecutor;
@end

@implementation DoricNativeDriver

@dynamic registry;

+ (instancetype)instance {
    return DoricSingleton.instance.nativeDriver;
}

- (instancetype)init {
    if (self = [super init]) {
        _jsExecutor = [[DoricJSEngine alloc] init];
    }
    return self;
}

- (DoricRegistry *)registry {
    return self.jsExecutor.registry;
}

- (DoricAsyncResult *)invokeDoricMethod:(NSString *)method argumentsArray:(NSArray *)args {
    id contextId = args.count > 0 ? args[0] : nil;
    DoricPerformanceProfile *profile = nil;
    if ([contextId isKindOfClass:NSString.class]) {
        profile = [DoricContextManager.instance getContext:contextId].performanceProfile;
    }
    NSMutableArray *printedArgs = [[NSMutableArray alloc] init];
    for (id arg in args) {
        if (arg == contextId) {
            continue;
        }
        [printedArgs addObject:arg];
    }
    NSString *anchorName = [NSString stringWithFormat:@"Call:%@", [printedArgs componentsJoinedByString:@","]];
    [profile prepare:anchorName];
    DoricAsyncResult *ret = [[DoricAsyncResult alloc] init];
    __weak typeof(self) _self = self;
    [self.jsExecutor ensureRunOnJSThread:^{
        __strong typeof(_self) self = _self;
        if (!self) return;
        @try {
            [profile start:anchorName];
            JSValue *jsValue = [self.jsExecutor invokeDoricMethod:method argumentsArray:args];
            [profile end:anchorName];
            [ret setupResult:jsValue];
        } @catch (NSException *exception) {
            [ret setupError:exception];
        }
    }];
    return ret;
}

- (DoricAsyncResult<JSValue *> *)invokeDoricMethod:(NSString *)method, ... {
    va_list args;
    va_start(args, method);
    DoricAsyncResult *ret = [self invokeDoricMethod:method arguments:args];
    va_end(args);
    return ret;
}

- (DoricAsyncResult<JSValue *> *)invokeDoricMethod:(NSString *)method arguments:(va_list)args {
    NSMutableArray *array = [[NSMutableArray alloc] init];
    id arg;
    while ((arg = va_arg(args, id)) != nil) {
        [array addObject:arg];
    }
    return [self invokeDoricMethod:method argumentsArray:array];
}

- (DoricAsyncResult<JSValue *> *)invokeContextEntity:(NSString *)contextId method:(NSString *)method, ... {
    va_list args;
    va_start(args, method);
    DoricAsyncResult *ret = [self invokeContextEntity:contextId method:method arguments:args];
    va_end(args);
    return ret;
}

- (DoricAsyncResult *)invokeContextEntity:(NSString *)contextId method:(NSString *)method arguments:(va_list)args {
    NSMutableArray *array = [[NSMutableArray alloc] init];
    [array addObject:contextId];
    [array addObject:method];
    id arg = va_arg(args, id);
    while (arg != nil) {
        [array addObject:arg];
        arg = va_arg(args, JSValue *);
    }
    return [self invokeContextEntity:contextId method:method argumentsArray:array];
}

- (DoricAsyncResult *)invokeContextEntity:(NSString *)contextId method:(NSString *)method argumentsArray:(NSArray *)args {
    DoricAsyncResult *ret = [[DoricAsyncResult alloc] init];
    NSMutableArray *array = [[NSMutableArray alloc] init];
    [array addObject:contextId];
    [array addObject:method];
    [array addObjectsFromArray:args];
    DoricAsyncResult *result = [self invokeDoricMethod:DORIC_CONTEXT_INVOKE argumentsArray:array];
    result.resultCallback = ^(id result) {
        [ret setupResult:result];
    };
    result.exceptionCallback = ^(NSException *e) {
        [ret setupError:e];
        [self.jsExecutor.registry onException:e inContext:[[DoricContextManager instance] getContext:contextId]];
    };
    return ret;
}

- (DoricAsyncResult *)createContext:(NSString *)contextId script:(NSString *)script source:(NSString *)source {
    DoricAsyncResult *ret = [[DoricAsyncResult alloc] init];
    DoricPerformanceProfile *performanceProfile = [DoricContextManager.instance getContext:contextId].performanceProfile
            ?: [[DoricPerformanceProfile alloc] initWithName:contextId];
    [performanceProfile prepare:@"Create"];
    __weak typeof(self) _self = self;
    [self.jsExecutor ensureRunOnJSThread:^{
        __strong typeof(_self) self = _self;
        if (!self) return;
        @try {
            [performanceProfile start:@"Create"];
            [self.jsExecutor prepareContext:contextId script:script source:source];
            [ret setupResult:@YES];
            [performanceProfile end:@"Create"];
        } @catch (NSException *exception) {
            [ret setupError:exception];
            [self.registry onException:exception inContext:[[DoricContextManager instance] getContext:contextId]];
        }
    }];
    return ret;
}

- (DoricAsyncResult *)destroyContext:(NSString *)contextId {
    DoricAsyncResult *ret = [[DoricAsyncResult alloc] init];
    DoricPerformanceProfile *performanceProfile = [DoricContextManager.instance getContext:contextId].performanceProfile
            ?: [[DoricPerformanceProfile alloc] initWithName:contextId];
    [performanceProfile prepare:@"Destroy"];
    __weak typeof(self) _self = self;
    [self.jsExecutor ensureRunOnJSThread:^{
        __strong typeof(_self) self = _self;
        if (!self) return;
        @try {
            [performanceProfile start:@"Destroy"];
            [self.jsExecutor destroyContext:contextId];
            [ret setupResult:@YES];
            [performanceProfile end:@"Destroy"];
        } @catch (NSException *exception) {
            [ret setupError:exception];
            [self.jsExecutor.registry onException:exception inContext:[[DoricContextManager instance] getContext:contextId]];
        }
    }];
    return ret;
}

- (void)ensureSyncInMainQueue:(dispatch_block_t)block {
    if (strcmp(dispatch_queue_get_label(DISPATCH_CURRENT_QUEUE_LABEL), dispatch_queue_get_label(dispatch_get_main_queue())) == 0) {
        block();
    } else {
        dispatch_async(dispatch_get_main_queue(), block);
    }
}

- (void)dealloc {
    [self.jsExecutor teardown];
}
@end
