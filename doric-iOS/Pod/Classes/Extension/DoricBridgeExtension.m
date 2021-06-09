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
//  DoricBridgeExtension.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/29.
//

#import "DoricBridgeExtension.h"
#import "DoricRegistry.h"
#import "DoricContextManager.h"
#import "DoricNativePlugin.h"
#import "DoricUtil.h"

#import <JavaScriptCore/JavaScriptCore.h>

#import <objc/runtime.h>

@implementation DoricBridgeExtension

- (id)callNativeWithContextId:(NSString *)contextId module:(NSString *)module method:(NSString *)method callbackId:(NSString *)callbackId argument:(id)argument {
    __strong DoricContext *context = [[DoricContextManager instance] getContext:contextId];
    if (!context || context.destroyed) {
        return nil;
    }
    Class pluginClass = [self.registry acquireNativePlugin:module];
    DoricNativePlugin *nativePlugin = context.pluginInstanceMap[module];
    if (nativePlugin == nil) {
        nativePlugin = [(DoricNativePlugin *) [pluginClass alloc] initWithContext:context];
        context.pluginInstanceMap[module] = nativePlugin;
    }

    return [self findClass:pluginClass target:nativePlugin context:context method:method callbackId:callbackId argument:argument];
}

- (id)createParamWithMethodName:(NSString *)method context:(DoricContext *)context callbackId:(NSString *)callbackId argument:(id)argument {
    if ([method isEqualToString:@"withPromise"]) {
        return [[DoricPromise alloc] initWithContext:context callbackId:callbackId];
    }
    return argument;
}

- (id)findClass:(Class)clz target:(id)target context:(DoricContext *)context method:(NSString *)name callbackId:(NSString *)callbackId argument:(id)argument {
    __strong DoricContext *strongContext = context;

    unsigned int count;
    id ret = nil;
    Method *methods = class_copyMethodList(clz, &count);
    BOOL isFound = NO;
    for (int i = 0; i < count; i++) {
        NSString *methodName = [NSString stringWithCString:sel_getName(method_getName(methods[i])) encoding:NSUTF8StringEncoding];
        NSArray *array = [methodName componentsSeparatedByString:@":"];
        if (array && [array count] > 0) {
            if ([array[0] isEqualToString:name]) {
                isFound = YES;
                SEL selector = NSSelectorFromString(methodName);
                NSMethodSignature *methodSignature = [target methodSignatureForSelector:selector];
                if (methodSignature) {
                    NSInvocation *invocation = [NSInvocation invocationWithMethodSignature:methodSignature];
                    [invocation retainArguments];
                    invocation.selector = selector;
                    invocation.target = target;
                    __weak __typeof__(self) _self = self;
                    dispatch_block_t block = ^() {
                        __strong __typeof__(_self) self = _self;
                        @try {
                            NSMutableArray *tempArray = [NSMutableArray new];
                            for (NSUInteger idx = 2; idx < methodSignature.numberOfArguments; idx++) {
                                if (idx - 2 > [array count]) {
                                    break;
                                }
                                id args = [self createParamWithMethodName:array[idx - 2] context:strongContext callbackId:callbackId argument:argument];
                                if (args) {
                                    [tempArray addObject:args];
                                }
                                [invocation setArgument:&args atIndex:idx];
                            }
                            if (!context || context.destroyed) {
                                return;
                            }
                            [invocation invoke];
                        } @catch (NSException *exception) {
                            DoricLog(@"CallNative Error:%@", exception.reason);
                            [strongContext.driver.registry onException:exception inContext:strongContext];
                        }
                    };

                    const char *retType = methodSignature.methodReturnType;
                    if (!strcmp(retType, @encode(void))) {
                        ret = nil;
                        dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), block);
                    } else if (!strcmp(retType, @encode(id))) {
                        void *retValue;
                        block();
                        [invocation getReturnValue:&retValue];
                        id returnValue = (__bridge id) retValue;
                        ret = [JSValue valueWithObject:[returnValue copy] inContext:[JSContext currentContext]];
                    } else {
                        DoricLog(@"CallNative Error:%@", @"Must return object type");
                        [strongContext.driver.registry onLog:DoricLogTypeError
                                                     message:[NSString stringWithFormat:@"CallNative Error:%@", @"Must return object type"]];
                        ret = nil;
                    }
                }
                break;
            }
        }
    }
    if (methods) {
        free(methods);
    }
    if (!isFound) {
        Class superclass = class_getSuperclass(clz);
        if (superclass && superclass != [NSObject class]) {
            return [self findClass:superclass target:target context:strongContext method:name callbackId:callbackId argument:argument];
        }
    }
    return ret;

}
@end
