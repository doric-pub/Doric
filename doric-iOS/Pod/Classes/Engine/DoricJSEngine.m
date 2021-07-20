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
#import "DoricJSCoreExecutor.h"
#import "DoricConstant.h"
#import "DoricUtil.h"
#import "DoricBridgeExtension.h"
#import <sys/utsname.h>
#import "DoricContext.h"
#import "DoricContextManager.h"
#import "DoricPerformanceProfile.h"

@interface DoricDefaultMonitor : NSObject <DoricMonitorProtocol>
@end

@implementation DoricDefaultMonitor
- (void)onException:(NSException *)exception inContext:(DoricContext *)context {
    DoricLog(@"DefaultMonitor - source: %@-  onException - %@", context.source, exception.reason);
}

- (void)onLog:(DoricLogType)type message:(NSString *)message {
    DoricLog(message);
}
@end

@interface DoricJSEngine ()
@property(nonatomic, strong) NSMutableDictionary <NSNumber *, NSTimer *> *timers;
@property(nonatomic, strong) DoricBridgeExtension *bridgeExtension;
@property(nonatomic, strong) NSMutableDictionary *environmentDictionary;
@property(nonatomic, strong) NSThread *jsThread;
@property(nonatomic, assign) BOOL destroyed;
@property(nonatomic, assign) BOOL initialized;
@property(nonatomic, strong) DoricPerformanceProfile *profile;
@end

@implementation DoricJSEngine

- (instancetype)init {
    if (self = [super init]) {
        _initialized = NO;
        _registry = [[DoricRegistry alloc] initWithJSEngine:self];
        _profile = [[DoricPerformanceProfile alloc] initWithName:@"JSEngine"];
        if (_registry.globalPerformanceAnchorHook) {
            [_profile addAnchorHook:_registry.globalPerformanceAnchorHook];
        }
        [_profile prepare:@"Init"];
        _jsThread = [[NSThread alloc] initWithTarget:self selector:@selector(threadRun) object:nil];
        [_jsThread start];
        NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
        struct utsname systemInfo;
        uname(&systemInfo);
        NSString *platform = [NSString stringWithCString:systemInfo.machine encoding:NSASCIIStringEncoding];
        if (TARGET_OS_SIMULATOR == 1) {
            platform = [NSProcessInfo new].environment[@"SIMULATOR_MODEL_IDENTIFIER"];
        }

        UIInterfaceOrientation orientation = [UIApplication sharedApplication].statusBarOrientation;
        CGFloat screenWidth;
        CGFloat screenHeight;
        if (orientation == UIInterfaceOrientationPortrait || orientation == UIInterfaceOrientationPortraitUpsideDown) {
            screenWidth = [[UIScreen mainScreen] bounds].size.width;
            screenHeight = [[UIScreen mainScreen] bounds].size.height;
        } else {
            screenWidth = [[UIScreen mainScreen] bounds].size.height;
            screenHeight = [[UIScreen mainScreen] bounds].size.width;
        }
        _environmentDictionary = @{
                @"platform": @"iOS",
                @"platformVersion": [[UIDevice currentDevice] systemVersion],
                @"appName": infoDictionary[@"CFBundleName"],
                @"appVersion": infoDictionary[@"CFBundleShortVersionString"],
                @"screenWidth": @(screenWidth),
                @"screenHeight": @(screenHeight),
                @"screenScale": @([[UIScreen mainScreen] scale]),
                @"statusBarHeight": @([[UIApplication sharedApplication] statusBarFrame].size.height),
                @"hasNotch": @(hasNotch()),
                @"deviceBrand": @"Apple",
                @"deviceModel": platform,
                @"localeLanguage": [[NSLocale currentLocale] objectForKey:NSLocaleLanguageCode] ?: @"",
                @"localeCountry": [[NSLocale currentLocale] objectForKey:NSLocaleCountryCode] ?: @"",
        }.mutableCopy;
        [self ensureRunOnJSThread:^() {
            [self.profile start:@"Init"];
            self.timers = [[NSMutableDictionary alloc] init];
            self.bridgeExtension = [DoricBridgeExtension new];
            self.bridgeExtension.registry = self.registry;
            [self initJSEngine];
            [self initJSExecutor];
            [self initDoricEnvironment];
            self.initialized = YES;
            [self.profile end:@"Init"];
        }];
        [self.registry registerMonitor:[DoricDefaultMonitor new]];
    }
    return self;
}

- (void)setEnvironmentValue:(NSDictionary *)value {
    [self ensureRunOnJSThread:^{
        [self.environmentDictionary addEntriesFromDictionary:value];
        if (self.initialized) {
            [self.jsExecutor injectGlobalJSObject:INJECT_ENVIRONMENT obj:[self.environmentDictionary copy]];
            for (DoricContext *doricContext in DoricContextManager.instance.aliveContexts) {
                [doricContext onEnvChanged];
            }
        }
    }];
}

- (void)teardown {
    _destroyed = YES;
    //To ensure runloop continue.
    [self ensureRunOnJSThread:^{
    }];
}

- (void)ensureRunOnJSThread:(dispatch_block_t)block {
    if (NSThread.currentThread == _jsThread) {
        block();
    } else {
        [self performSelector:@selector(ensureRunOnJSThread:)
                     onThread:_jsThread
                   withObject:[block copy]
                waitUntilDone:NO];
    }
}

- (void)threadRun {
    [[NSRunLoop currentRunLoop] addPort:[NSMachPort port] forMode:NSDefaultRunLoopMode];
    [NSThread currentThread].name = @"doric.js.engine";
    while (!_destroyed) {
        @autoreleasepool {
            [[NSRunLoop currentRunLoop] runMode:NSDefaultRunLoopMode beforeDate:[NSDate distantFuture]];
        }
    }
}

- (void)initJSEngine {
    self.jsExecutor = [DoricJSCoreExecutor new];
}

- (void)initJSExecutor {
    __weak typeof(self) _self = self;
    [self.jsExecutor injectGlobalJSObject:INJECT_ENVIRONMENT obj:[self.environmentDictionary copy]];
    [self.jsExecutor injectGlobalJSObject:INJECT_LOG obj:^(NSString *type, NSString *message) {
        if ([type isEqualToString:@"e"]) {
            [self.registry onLog:DoricLogTypeError message:message];
        } else if ([type isEqualToString:@"w"]) {
            [self.registry onLog:DoricLogTypeWarning message:message];
        } else {
            [self.registry onLog:DoricLogTypeDebug message:message];
        }
    }];
    [self.jsExecutor injectGlobalJSObject:INJECT_EMPTY obj:^() {

    }];
    [self.jsExecutor injectGlobalJSObject:INJECT_REQUIRE obj:^(NSString *name) {
        __strong typeof(_self) self = _self;
        if (!self) return NO;
        NSString *content = [self.registry acquireJSBundle:name];
        if (!content) {
            [self.registry onLog:DoricLogTypeError message:[NSString stringWithFormat:@"require js bundle:%@ is empty", name]];
            return NO;
        }
        @try {
            [self.jsExecutor loadJSScript:[self packageModuleScript:name content:content]
                                   source:[@"Module://" stringByAppendingString:name]];
        } @catch (NSException *e) {
            [self.registry onLog:DoricLogTypeError
                         message:[NSString stringWithFormat:@"require js bundle:%@ error,for %@", name, e.reason]];
        }
        return YES;
    }];
    [self.jsExecutor injectGlobalJSObject:INJECT_TIMER_SET
                                      obj:^(NSNumber *timerId, NSNumber *interval, NSNumber *isInterval) {
                                          __strong typeof(_self) self = _self;
                                          BOOL repeat = [isInterval boolValue];
                                          NSTimer *timer = [NSTimer timerWithTimeInterval:[interval doubleValue] / 1000 target:self selector:@selector(callbackTimer:) userInfo:@{@"timerId": timerId, @"repeat": isInterval} repeats:repeat];
                                          self.timers[timerId] = timer;
                                          dispatch_async(dispatch_get_main_queue(), ^() {
                                              [[NSRunLoop currentRunLoop] addTimer:timer forMode:NSRunLoopCommonModes];
                                          });
                                      }];

    [self.jsExecutor injectGlobalJSObject:INJECT_TIMER_CLEAR
                                      obj:^(NSNumber *timerId) {
                                          __strong typeof(_self) self = _self;
                                          NSTimer *timer = self.timers[timerId];
                                          if (timer) {
                                              [self.timers removeObjectForKey:timerId];
                                              dispatch_async(dispatch_get_main_queue(), ^{
                                                  [timer invalidate];
                                              });
                                          }
                                      }];

    [self.jsExecutor injectGlobalJSObject:INJECT_BRIDGE obj:^(NSString *contextId, NSString *module, NSString *method, NSString *callbackId, id argument) {
        return [self.bridgeExtension callNativeWithContextId:contextId module:module method:method callbackId:callbackId argument:argument];
    }];
}

- (void)initDoricEnvironment {
    @try {
        [self loadBuiltinJS:DORIC_BUNDLE_SANDBOX];
        NSString *path;
        if (@available(iOS 10.0, *)) {
            path = [DoricBundle() pathForResource:DORIC_BUNDLE_LIB ofType:@"js"];
        } else {
            path = [DoricBundle() pathForResource:[NSString stringWithFormat:@"%@.es5", DORIC_BUNDLE_LIB] ofType:@"js"];
        }
        NSString *jsContent = [NSString stringWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
        [self.jsExecutor loadJSScript:[self packageModuleScript:DORIC_MODULE_LIB content:jsContent]
                               source:[@"Module://" stringByAppendingString:DORIC_MODULE_LIB]];
    } @catch (NSException *exception) {
        [self.registry onException:exception inContext:nil];
    }
}

- (void)loadBuiltinJS:(NSString *)fileName {
    NSString *path;
    if (@available(iOS 10.0, *)) {
        path = [DoricBundle() pathForResource:DORIC_BUNDLE_SANDBOX ofType:@"js"];
    } else {
        path = [DoricBundle() pathForResource:[NSString stringWithFormat:@"%@.es5", DORIC_BUNDLE_SANDBOX] ofType:@"js"];
    }
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
    NSString *ret = [NSString stringWithFormat:TEMPLATE_CONTEXT_CREATE, content, contextId, contextId];
    return ret;
}

- (NSString *)packageModuleScript:(NSString *)moduleName content:(NSString *)content {
    NSString *ret = [NSString stringWithFormat:TEMPLATE_MODULE, moduleName, content];
    return ret;
}

- (void)prepareContext:(NSString *)contextId script:(NSString *)script source:(NSString *)source {
    [self.jsExecutor loadJSScript:[self packageContextScript:contextId content:script]
                           source:[@"Context://" stringByAppendingString:source ?: contextId]];
}

- (void)destroyContext:(NSString *)contextId {
    [self.jsExecutor loadJSScript:[NSString stringWithFormat:TEMPLATE_CONTEXT_DESTROY, contextId]
                           source:[@"_Context://" stringByAppendingString:contextId]];
}

- (void)callbackTimer:(NSTimer *)timer {
    __weak typeof(self) _self = self;
    if (!timer.isValid) {
        return;
    }
    NSDictionary *userInfo = timer.userInfo;
    NSNumber *timerId = [userInfo valueForKey:@"timerId"];
    NSNumber *repeat = [userInfo valueForKey:@"repeat"];
    [self ensureRunOnJSThread:^{
        __strong typeof(_self) self = _self;
        @try {
            [self invokeDoricMethod:DORIC_TIMER_CALLBACK, timerId, nil];
        } @catch (NSException *exception) {
            [self.registry onException:exception inContext:nil];
            [self.registry onLog:DoricLogTypeError
                         message:[NSString stringWithFormat:@"Timer Callback error:%@", exception.reason]];
        }
        if (![repeat boolValue]) {
            [self.timers removeObjectForKey:timerId];
        }
    }];
}
@end
