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
//  DoricDev.m
//  Doric
//
//  Created by jingpeng.wang on 2020/2/25.
//
#import <DoricCore/Doric.h>
#import <DoricCore/DoricSingleton.h>
#import <DoricCore/DoricNativeDriver.h>
#import <DoricCore/DoricContextManager.h>

#import "DoricDev.h"
#import "DoricDebugDriver.h"
#import "DoricDevViewController.h"
#import "DoricDevMonitor.h"
#import "DoricDevPerformanceAnchorHook.h"
#import "DoricDevkitPlugin.h"
#import "DoricDevAssetsLoader.h"

@interface DoricContextDebuggable : NSObject
@property(nonatomic, weak) DoricContext *doricContext;
@property(nonatomic, weak) id <DoricDriverProtocol> nativeDriver;
@property(nonatomic, weak) DoricWSClient *wsClient;
@property(nonatomic, weak) DoricDebugDriver *debugDriver;

@end

@implementation DoricContextDebuggable
- (instancetype)initWithWSClient:(DoricWSClient *)client context:(DoricContext *)context {
    if (self = [super init]) {
        _wsClient = client;
        _doricContext = context;
        _nativeDriver = context.driver;
    }
    return self;
}

- (void)startDebug {
    [self.doricContext setDriver:[[DoricDebugDriver alloc] initWithWSClient:self.wsClient]];
    self.debugDriver = self.doricContext.driver;
    [self.doricContext reload:self.doricContext.script];
}

- (void)stopDebug:(BOOL)resume {
    [self.debugDriver teardown];
    self.doricContext.driver = self.nativeDriver;
    if (resume) {
        [self.doricContext reload:self.doricContext.script];
    }
}
@end


@interface DoricDev ()
@property(nonatomic, strong, nullable) DoricWSClient *wsClient;
@property(nonatomic, strong) DoricContextDebuggable *debuggable;
@property(nonatomic, strong) NSHashTable <id <DoricDevStatusCallback>> *callbacks;
@property(nonatomic, strong) NSHashTable <DoricContext *> *reloadingContexts;
@property(nonatomic, assign) BOOL devKitConnected;
@property(nonatomic, copy) NSString *url;
@end

@implementation DoricDev

- (instancetype)init {
    if (self = [super init]) {
        _callbacks = [NSHashTable hashTableWithOptions:NSPointerFunctionsWeakMemory];
        _reloadingContexts = [NSHashTable hashTableWithOptions:NSPointerFunctionsWeakMemory];
        [DoricSingleton.instance.nativeDriver.registry registerMonitor:[DoricDevMonitor new]];
        DoricSingleton.instance.nativeDriver.registry.globalPerformanceAnchorHook = [DoricDevPerformanceAnchorHook new];
        [DoricSingleton.instance.nativeDriver.registry registerNativePlugin:DoricDevkitPlugin.class withName:@"devkit"];
        [DoricSingleton.instance.nativeDriver.registry.loaderManager registerLoader:[DoricDevAssetsLoader new]];
    }
    return self;
}

+ (instancetype)instance {
    static DoricDev *_instance;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _instance = [[DoricDev alloc] init];
    });
    return _instance;
}

- (void)openDevMode {
    DoricDevViewController *devViewController = [DoricDevViewController new];

    UIViewController *viewController = [UIApplication sharedApplication].delegate.window.rootViewController;
    UINavigationController *navigationController;
    if ([viewController isKindOfClass:[UINavigationController class]]) {
        navigationController = (UINavigationController *) viewController;
    } else {
        navigationController = viewController.navigationController;
    }
    [navigationController pushViewController:devViewController animated:NO];
}

- (void)openDevMode:(UIViewController *)vc {
    DoricDevViewController *devViewController = [DoricDevViewController new];

    UIViewController *viewController = findBestViewController(vc);
    UINavigationController *navigationController;
    if ([viewController isKindOfClass:[UINavigationController class]]) {
        navigationController = (UINavigationController *) viewController;
    } else {
        navigationController = viewController.navigationController;
    }
    [navigationController pushViewController:devViewController animated:NO];
}

- (void)closeDevMode {
    [self stopDebugging:YES];
    if (self.wsClient) {
        [self.wsClient close];
        self.wsClient = nil;
    }
}

- (BOOL)isInDevMode {
    return self.devKitConnected;
}

- (void)connectDevKit:(NSString *)url {
    if (self.wsClient) {
        [self.wsClient close];
    }
    self.devKitConnected = NO;
    self.wsClient = [[DoricWSClient alloc] initWithUrl:url];
    self.url = url;
}

- (void)onOpen {
    self.devKitConnected = YES;
    dispatch_async(dispatch_get_main_queue(), ^{
        for (id <DoricDevStatusCallback> callback in self.callbacks) {
            [callback onOpen:self.url];
        }
    });
}

- (void)onClose {
    self.devKitConnected = NO;
    [self stopDebugging:YES];
    dispatch_async(dispatch_get_main_queue(), ^{
        for (id <DoricDevStatusCallback> callback in self.callbacks) {
            [callback onClose:self.url];
        }
    });
}

- (void)onFailure:(NSError *)error {
    self.devKitConnected = NO;
    [self stopDebugging:YES];
    dispatch_async(dispatch_get_main_queue(), ^{
        for (id <DoricDevStatusCallback> callback in self.callbacks) {
            [callback onFailure:error];
        }
    });
}

- (BOOL)isReloadingContext:(DoricContext *)context {
    return [self.reloadingContexts containsObject:context];
}


- (NSArray<DoricContext *> *)matchAllContexts:(NSString *)source {
    NSMutableArray <DoricContext *> *array = [NSMutableArray new];
    source = [[source stringByReplacingOccurrencesOfString:@".js"
                                                withString:@""]
            stringByReplacingOccurrencesOfString:@".ts"
                                      withString:@""
    ];
    for (DoricContext *context in [DoricContextManager.instance aliveContexts]) {
        NSString *contextSource = [[context.source stringByReplacingOccurrencesOfString:@".js"
                                                                             withString:@""]
                stringByReplacingOccurrencesOfString:@".ts"
                                          withString:@""
        ];
        if ([source isEqualToString:contextSource] || [contextSource isEqualToString:@"__dev__"]) {
            [array addObject:context];
        }
    }
    return array;
}

- (void)reload:(NSString *)source script:(NSString *)script {
    NSArray<DoricContext *> *contexts = [self matchAllContexts:source];
    if (contexts.count <= 0) {
        DoricLog(@"Cannot find context source %@ for reload", source);
    } else {
        [contexts forEach:^(DoricContext *context) {
            if ([context.driver isKindOfClass:DoricDebugDriver.class]) {
                DoricLog(@"Context source %@ in debugging,skip reload", source);
            } else {
                DoricLog(@"Context reload :id %@,source %@", context.contextId, source);
                dispatch_async(dispatch_get_main_queue(), ^{
                    [context reload:script];
                    [self.reloadingContexts addObject:context];
                    for (id <DoricDevStatusCallback> callback in self.callbacks) {
                        [callback onReload:context script:script];
                    }
                });
            }
        }];
    }
}

- (void)startDebugging:(NSString *)source {
    [self.debuggable stopDebug:YES];
    NSArray<DoricContext *> *contexts = [self matchAllContexts:source];
    if (contexts.count <= 0) {
        DoricLog(@"Cannot find context source %@ for debugging", source);
        [self.wsClient sendToDebugger:@"DEBUG_STOP" payload:@{
                @"msg": @"Cannot find suitable alive context for debugging"
        }];
    } else {
        DoricContext *context = contexts.lastObject;
        [self.wsClient sendToDebugger:@"DEBUG_RES" payload:@{
                @"contextId": context.contextId
        }];
        dispatch_async(dispatch_get_main_queue(), ^{
            self.debuggable = [[DoricContextDebuggable alloc] initWithWSClient:self.wsClient context:context];
            [self.debuggable startDebug];
            for (id <DoricDevStatusCallback> callback in self.callbacks) {
                [callback onStartDebugging:context];
            }
        });
    }
};

- (void)stopDebugging:(BOOL)resume {
    [self.wsClient sendToDebugger:@"DEBUG_STOP" payload:@{
            @"msg": @"Stop debugging"
    }];
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.debuggable stopDebug:resume];
        self.debuggable = nil;
        for (id <DoricDevStatusCallback> callback in self.callbacks) {
            [callback onStopDebugging];
        }
    });
}

- (void)requestDebugging:(DoricContext *)context {
    [self.wsClient sendToServer:@"DEBUG" payload:@{
            @"source": context.source,
            @"script": context.script,
    }];
}

- (void)sendDevCommand:(NSString *)command payload:(NSDictionary *)payload {
    [self.wsClient sendToServer:command payload:payload];
}

- (void)addStatusCallback:(id)callback {
    [self.callbacks addObject:callback];
}

- (void)removeStatusCallback:(id)callback {
    [self.callbacks removeObject:callback];
}

- (NSString *)ip {
    return [[self.url stringByReplacingOccurrencesOfString:@"ws://"
                                                withString:@""]
            stringByReplacingOccurrencesOfString:@":7777"
                                      withString:@""];
}

UIViewController *_Nonnull findBestViewController(UIViewController *_Nonnull vc) {
    if (vc.presentedViewController && ![vc.presentedViewController isKindOfClass:[UIAlertController class]]) {
        // Return presented view controller
        return findBestViewController(vc.presentedViewController);
    } else if ([vc isKindOfClass:[UISplitViewController class]]) {
        // Return right hand side
        UISplitViewController *svc = (UISplitViewController *) vc;
        if (svc.viewControllers.count > 0)
            return findBestViewController(svc.viewControllers.lastObject);
        else
            return vc;
    } else if ([vc isKindOfClass:[UINavigationController class]]) {
        // Return top view
        UINavigationController *svc = (UINavigationController *) vc;
        if (svc.viewControllers.count > 0)
            return findBestViewController(svc.topViewController);
        else
            return vc;
    } else if ([vc isKindOfClass:[UITabBarController class]]) {
        // Return visible view
        UITabBarController *svc = (UITabBarController *) vc;
        if (svc.viewControllers.count > 0)
            return findBestViewController(svc.selectedViewController);
        else
            return vc;
    } else {
        // Unknown view controller type, return last child view controller
        return vc;
    }
}

@end
