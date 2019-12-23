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
//  DoricJSEngine.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/26.
//

#import "DoricJSEngine.h"
#import "DoricJSExecutorProtocol.h"
#import "DoricJSCoreExecutor.h"
#import "DoricJSRemoteExecutor.h"
#import "DoricConstant.h"
#import "DoricUtil.h"
#import "DoricBridgeExtension.h"

@interface DoricJSEngine ()
@property(nonatomic, strong) id <DoricJSExecutorProtocol> jsExecutor;
@property(nonatomic, strong) NSMutableDictionary *timers;
@property(nonatomic, strong) DoricBridgeExtension *bridgeExtension;
@end

@implementation DoricJSEngine

- (instancetype)init {
    if (self = [super init]) {
        _jsQueue = dispatch_queue_create("doric.jsengine", DISPATCH_QUEUE_SERIAL);
        _bridgeExtension = [[DoricBridgeExtension alloc] init];
        dispatch_async(_jsQueue, ^() {
            self.timers = [[NSMutableDictionary alloc] init];
            // Debug: 切换
            // self.jsExecutor = [[DoricJSRemoteExecutor alloc] init];
            self.jsExecutor = [DoricJSCoreExecutor new];
            self.registry = [[DoricRegistry alloc] init];
            [self initJSExecutor];
            [self initDoricEnvironment];
        });
    }
    return self;
}

- (void)initJSExecutor {
    __weak typeof(self) _self = self;
    NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
    [self.jsExecutor injectGlobalJSObject:INJECT_ENVIRONMENT obj:@{
            @"platform": @"iOS",
            @"platformVersion": [[UIDevice currentDevice] systemVersion],
            @"appName": infoDictionary[@"CFBundleName"],
            @"appVersion": infoDictionary[@"CFBundleShortVersionString"],
            @"screenWidth": @([[UIScreen mainScreen] bounds].size.width),
            @"screenHeight": @([[UIScreen mainScreen] bounds].size.height),
    }];
    [self.jsExecutor injectGlobalJSObject:INJECT_LOG obj:^(NSString *type, NSString *message) {
        DoricLog(@"JS:%@", message);
    }];
    [self.jsExecutor injectGlobalJSObject:INJECT_EMPTY obj:^() {

    }];
    [self.jsExecutor injectGlobalJSObject:INJECT_REQUIRE obj:^(NSString *name) {
        __strong typeof(_self) self = _self;
        if (!self) return NO;
        NSString *content = [self.registry acquireJSBundle:name];
        if (!content) {
            DoricLog(@"require js bundle:%@ is empty", name);
            return NO;
        }
        @try {
            [self.jsExecutor loadJSScript:[self packageModuleScript:name content:content]
                                   source:[@"Module://" stringByAppendingString:name]];
        } @catch (NSException *e) {
            DoricLog(@"require js bundle:%@ error,for %@", name, e.reason);
        }
        return YES;
    }];
    [self.jsExecutor injectGlobalJSObject:INJECT_TIMER_SET
                                      obj:^(NSNumber *timerId, NSNumber *interval, NSNumber *isInterval) {
                                          __strong typeof(_self) self = _self;
                                          NSString *timerId_str = [timerId stringValue];
                                          BOOL repeat = [isInterval boolValue];
                                          NSTimer *timer = [NSTimer timerWithTimeInterval:[interval doubleValue] / 1000 target:self selector:@selector(callbackTimer:) userInfo:@{@"timerId": timerId, @"repeat": isInterval} repeats:repeat];
                                          [self.timers setValue:timer forKey:timerId_str];
                                          dispatch_async(dispatch_get_main_queue(), ^() {
                                              [[NSRunLoop currentRunLoop] addTimer:timer forMode:NSRunLoopCommonModes];
                                          });
                                      }];

    [self.jsExecutor injectGlobalJSObject:INJECT_TIMER_CLEAR
                                      obj:^(NSString *timerId) {
                                          __strong typeof(_self) self = _self;
                                          NSTimer *timer = [self.timers valueForKey:timerId];
                                          if (timer) {
                                              [timer invalidate];
                                              [self.timers removeObjectForKey:timerId];
                                          }
                                      }];

    [self.jsExecutor injectGlobalJSObject:INJECT_BRIDGE obj:^(NSString *contextId, NSString *module, NSString *method, NSString *callbackId, id argument) {
        return [self.bridgeExtension callNativeWithContextId:contextId module:module method:method callbackId:callbackId argument:argument];
    }];
}

- (void)initDoricEnvironment {
    [self loadBuiltinJS:DORIC_BUNDLE_SANDBOX];
    NSString *path = [DoricBundle() pathForResource:DORIC_BUNDLE_LIB ofType:@"js"];
    NSString *jsContent = [NSString stringWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
    [self.jsExecutor loadJSScript:[self packageModuleScript:DORIC_MODULE_LIB content:jsContent]
                           source:[@"Module://" stringByAppendingString:DORIC_MODULE_LIB]];
}

- (void)loadBuiltinJS:(NSString *)fileName {
    NSString *path = [DoricBundle() pathForResource:DORIC_BUNDLE_SANDBOX ofType:@"js"];
    NSString *jsContent = [NSString stringWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
    [self.jsExecutor loadJSScript:jsContent source:[@"Assets://" stringByAppendingString:fileName]];
}

- (JSValue *)invokeDoricMethod:(NSString *)method, ... {
    va_list args;
    va_start(args, method);
    JSValue *ret = [self invokeDoricMethod:method arguments:args];
    va_end(args);
    return ret;
}

- (JSValue *)invokeDoricMethod:(NSString *)method arguments:(va_list)args {
    NSMutableArray *array = [[NSMutableArray alloc] init];
    id arg = va_arg(args, id);
    while (arg != nil) {
        [array addObject:arg];
        arg = va_arg(args, JSValue *);
    }
    return [self.jsExecutor invokeObject:GLOBAL_DORIC method:method args:array];
}

- (JSValue *)invokeDoricMethod:(NSString *)method argumentsArray:(NSArray *)args {
    return [self.jsExecutor invokeObject:GLOBAL_DORIC method:method args:args];
}

- (NSString *)packageContextScript:(NSString *)contextId content:(NSString *)content {
    NSString *ret = [NSString stringWithFormat:TEMPLATE_CONTEXT_CREATE, content, contextId, contextId, contextId];
    return ret;
}

- (NSString *)packageModuleScript:(NSString *)moduleName content:(NSString *)content {
    NSString *ret = [NSString stringWithFormat:TEMPLATE_MODULE, moduleName, content];
    return ret;
}

- (void)prepareContext:(NSString *)contextId script:(NSString *)script source:(NSString *)source {
    [self.jsExecutor loadJSScript:[self packageContextScript:contextId content:script]
                           source:[@"Context://" stringByAppendingString:source]];
}

- (void)destroyContext:(NSString *)contextId {
    [self.jsExecutor loadJSScript:[NSString stringWithFormat:TEMPLATE_CONTEXT_DESTROY, contextId]
                           source:[@"_Context://" stringByAppendingString:contextId]];
}

- (void)callbackTimer:(NSTimer *)timer {
    NSDictionary *userInfo = timer.userInfo;
    NSNumber *timerId = [userInfo valueForKey:@"timerId"];
    NSNumber *repeat = [userInfo valueForKey:@"repeat"];
    __weak typeof(self) _self = self;
    dispatch_async(self.jsQueue, ^() {
        __strong typeof(_self) self = _self;
        @try {
            [self invokeDoricMethod:DORIC_TIMER_CALLBACK, timerId, nil];
        } @catch (NSException *exception) {
            DoricLog(@"Timer Callback error:%@", exception.reason);
        }
        if (![repeat boolValue]) {
            [self.timers removeObjectForKey:[timerId stringValue]];
        }
    });
}
@end
