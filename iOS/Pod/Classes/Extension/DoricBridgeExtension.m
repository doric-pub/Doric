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
    DoricContext *context = [[DoricContextManager instance] getContext:contextId];
    DoricRegistry *registry = context.driver.registry;
    Class pluginClass = [registry acquireNativePlugin:module];
    DoricNativePlugin *nativePlugin = context.pluginInstanceMap[module];
    if (nativePlugin == nil) {
        nativePlugin = [(DoricNativePlugin *) [pluginClass alloc] initWithContext:context];
        context.pluginInstanceMap[module] = nativePlugin;
    }
    unsigned int count;
    id ret = nil;
    Method *methods = class_copyMethodList(pluginClass, &count);
    for (int i = 0; i < count; i++) {
        NSString *methodName = [NSString stringWithCString:sel_getName(method_getName(methods[i])) encoding:NSUTF8StringEncoding];
        NSArray *array = [methodName componentsSeparatedByString:@":"];
        if (array && [array count] > 0) {
            if ([array[0] isEqualToString:method]) {
                SEL selector = NSSelectorFromString(methodName);
                NSMethodSignature *methodSignature = [nativePlugin methodSignatureForSelector:selector];
                if (methodSignature) {
                    NSInvocation *invocation = [NSInvocation invocationWithMethodSignature:methodSignature];
                    invocation.selector = selector;
                    invocation.target = nativePlugin;
                    __weak __typeof__(self) _self = self;
                    dispatch_block_t block = ^() {
                        __strong __typeof__(_self) self = _self;
                        @try {
                            for (NSUInteger idx = 2; idx < methodSignature.numberOfArguments; idx++) {
                                if (idx - 2 > [array count]) {
                                    break;
                                }
                                id args = [self createParamWithMethodName:array[idx - 2] context:context callbackId:callbackId argument:argument];
                                [invocation setArgument:&args atIndex:idx];
                            }
                            [invocation invoke];
                        } @catch (NSException *exception) {
                            DoricLog(@"CallNative Error:%@", exception.reason);
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
    return ret;
}

- (id)createParamWithMethodName:(NSString *)method context:(DoricContext *)context callbackId:(NSString *)callbackId argument:(id)argument {
    if ([method isEqualToString:@"withPromise"]) {
        return [[DoricPromise alloc] initWithContext:context callbackId:callbackId];
    }
    return argument;
}

@end
