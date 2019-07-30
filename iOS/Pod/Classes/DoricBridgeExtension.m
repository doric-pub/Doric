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
#import "DoricPromise.h"
#import "DoricUtil.h"

#import <JavaScriptCore/JavaScriptCore.h>

#import <objc/runtime.h>

@implementation DoricBridgeExtension

- (id)callNativeWithContextId:(NSString *)contextId module:(NSString *)module method:(NSString *)method callbackId:(NSString *)callbackId argument:(id)argument {
    DoricContext *context = [[DoricContextManager instance] getContext:contextId];
    DoricRegistry *registry = context.driver.registry;
    Class pluginClass = [registry acquireNativePlugin:module];
    DoricNativePlugin *nativePlugin = [context.pluginInstanceMap objectForKey:module];
    if(nativePlugin == nil) {
        nativePlugin = [[pluginClass alloc] initWithContext:context];
        [context.pluginInstanceMap setObject:nativePlugin forKey:module];
    }
    unsigned int count;
    id ret = nil;
    Method *methods = class_copyMethodList(pluginClass, &count);
    for (int i=0; i < count; i++) {
        NSString *methodName = [NSString stringWithCString:sel_getName(method_getName(methods[i])) encoding:NSUTF8StringEncoding];
        NSArray *array = [methodName componentsSeparatedByString:@":"];
        if(array && [array count]>0) {
            if([array[0] isEqualToString:method]) {
                SEL selector = NSSelectorFromString(methodName);
                NSMethodSignature *methodSignature = [nativePlugin methodSignatureForSelector:selector];
                if (methodSignature) {
                    NSInvocation *invocation = [NSInvocation invocationWithMethodSignature:methodSignature];
                    invocation.selector = selector;
                    invocation.target = nativePlugin;
                    __weak __typeof__ (self) _self = self;
                    void(^block)(void) = ^(){
                        __strong __typeof__ (_self) self = _self;
                        @try {
                            for(int i = 2;i < methodSignature.numberOfArguments;i++) {
                                if(i-2 > [array count]) {
                                    break;
                                }
                                id args = [self createParamWithMethodName:array[i-2] context:context callbackId:callbackId argument:argument];
                                [invocation setArgument:&args atIndex:i];
                            }
                            [invocation invoke];
                        } @catch (NSException *exception) {
                            DoricLog(@"CallNative Error:%@", exception.reason);
                        }
                    };
                    
                    const char *retType = methodSignature.methodReturnType;
                    if (!strcmp(retType, @encode(void))) {
                        ret = nil;
                        dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT,0), block);
                    } else if (!strcmp(retType, @encode(id))) {
                        void *retValue;
                        block();
                        [invocation getReturnValue:&retValue];
                        id returnValue = (__bridge id)retValue;
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

- (id) createParamWithMethodName:(NSString *)method context:(DoricContext *)context callbackId:(NSString *)callbackId argument:(id)argument {
    if([method isEqualToString:@"withPromise"]){
        return [[DoricPromise alloc] initWithContext:context callbackId:callbackId];
    }
    return argument;
}

@end
