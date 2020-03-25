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
//  DoricShaderPlugin.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/29.
//

#import "DoricShaderPlugin.h"
#import "DoricRootNode.h"
#import "DoricUtil.h"

#import <objc/runtime.h>

@implementation DoricShaderPlugin

- (void)render:(NSDictionary *)argument withPromise:(DoricPromise *)promise {
    if (!argument) {
        return;
    }
    __weak typeof(self) _self = self;
    dispatch_async(dispatch_get_main_queue(), ^{
        __strong typeof(_self) self = _self;

        NSString *viewId = argument[@"id"];

        if (self.doricContext.rootNode.viewId == nil) {
            self.doricContext.rootNode.viewId = viewId;
            [self.doricContext.rootNode blend:argument[@"props"]];
        } else {
            DoricViewNode *viewNode = [self.doricContext targetViewNode:viewId];
            [viewNode blend:argument[@"props"]];
        }
        [promise resolve:nil];
    });
}

- (void)command:(NSDictionary *)argument withPromise:(DoricPromise *)promise {
    dispatch_async(dispatch_get_main_queue(), ^{
        NSArray *viewIds = argument[@"viewIds"];
        id args = argument[@"args"];
        NSString *name = argument[@"name"];
        DoricViewNode *viewNode = nil;
        for (NSString *viewId in viewIds) {
            if (!viewNode) {
                viewNode = [self.doricContext targetViewNode:viewId];
            } else {
                if ([viewNode isKindOfClass:[DoricSuperNode class]]) {
                    viewNode = [((DoricSuperNode *) viewNode) subNodeWithViewId:viewId];
                }
            }
        }
        if (!viewNode) {
            [promise reject:@"Cannot find opposite view"];
        } else {
            [self findClass:[viewNode class] target:viewNode method:name promise:promise argument:args];
        }
    });
}

- (id)createParamWithMethodName:(NSString *)method promise:(DoricPromise *)promise argument:(id)argument {
    if ([method isEqualToString:@"withPromise"]) {
        return promise;
    }
    return argument;
}

- (void)findClass:(Class)clz target:(id)target method:(NSString *)name promise:(DoricPromise *)promise argument:(id)argument {
    unsigned int count;
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
                    invocation.selector = selector;
                    invocation.target = target;
                    void *retValue;
                    @try {
                        NSMutableArray *tempArray = [NSMutableArray new];

                        for (NSUInteger idx = 2; idx < methodSignature.numberOfArguments; idx++) {
                            if (idx - 2 > [array count]) {
                                break;
                            }
                            id param = [self createParamWithMethodName:array[idx - 2] promise:promise argument:argument];
                            if (param) {
                                [tempArray addObject:param];
                            }
                            [invocation setArgument:&param atIndex:idx];
                        }
                        [invocation invoke];
                    } @catch (NSException *exception) {
                        DoricLog(@"CallNative Error:%@", exception.reason);
                        [self.doricContext.driver.registry onException:exception inContext:self.doricContext];
                    }
                    const char *retType = methodSignature.methodReturnType;
                    if (!strcmp(retType, @encode(void))) {
                    } else {
                        [invocation getReturnValue:&retValue];
                        id returnValue = (__bridge id) retValue;
                        [promise resolve:returnValue];
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
            [self findClass:superclass target:target method:name promise:promise argument:argument];
        }
    }
}

@end
