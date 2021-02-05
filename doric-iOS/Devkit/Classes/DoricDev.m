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
#import <DoricCore/DoricContextManager.h>
#import <DoricCore/DoricNativeDriver.h>
#import <DoricCore/DoricConstant.h>

#import "DoricDev.h"
#import "DoricWSClient.h"
#import "DoricDebugDriver.h"
#import "DoricDevViewController.h"
#import "DoricDevMonitor.h"

@interface DoricDevLibrary : DoricLibrary
@end

@implementation DoricDevLibrary
- (void)load:(DoricRegistry *)registry {

}
@end

@interface DoricDev ()
@property(nonatomic, strong) DoricWSClient *wsclient;
@property(nonatomic, strong) DoricContext *context;
@property(nonatomic, strong) DoricDebugDriver *driver;
@end

@implementation DoricDev

- (instancetype)init {
    if (self = [super init]) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onOpenEvent) name:@"OpenEvent" object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onEOFEvent) name:@"EOFEvent" object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onConnectExceptionEvent) name:@"ConnectExceptionEvent" object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onStartDebugEvent:) name:@"StartDebugEvent" object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onEnterDebugEvent) name:@"EnterDebugEvent" object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onStopDebugEvent) name:@"StopDebugEvent" object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onDebuggerReadyEvent) name:@"DebuggerReadyEvent" object:nil];
        [Doric registerLibrary:[DoricDevLibrary new]];
        NSValue *value = DoricContextManager.instance.aliveContexts.firstObject;
        if (value) {
            DoricContext *context = value.nonretainedObjectValue;
            [context.driver.registry registerMonitor:[DoricDevMonitor new]];
        }
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

- (void)closeDevMode {
    if (self.wsclient) {
        [self.wsclient close];
        self.wsclient = nil;
    }
}

- (BOOL)isInDevMode {
    return self.wsclient != nil;
}

- (void)connectDevKit:(NSString *)url {
    if (self.wsclient) {
        [self.wsclient close];
    }
    self.wsclient = [[DoricWSClient alloc] initWithUrl:url];
}

- (void)sendDevCommand:(NSString *)command {
    [self.wsclient send:command];
}

- (void)onOpenEvent {
    ShowToast(@"dev kit connected", DoricGravityBottom);
}

- (void)onEOFEvent {
    ShowToast(@"dev kit eof exception", DoricGravityBottom);
}

- (void)onConnectExceptionEvent {
    ShowToast(@"dev kit connection exception", DoricGravityBottom);
}

- (void)onStartDebugEvent:(NSNotification *)notification {
    NSString *contextId = notification.object;
    ShowToast(contextId, DoricGravityBottom);
    for (NSValue *value in  [[DoricContextManager instance] aliveContexts]) {
        DoricContext *context = value.nonretainedObjectValue;
        BOOL result = [context.contextId compare:contextId] == NSOrderedSame;
        if (result) {
            _context = context;
        }
    }
}

- (void)onEnterDebugEvent {
    _driver = [DoricDebugDriver new];
}

- (void)onStopDebugEvent {
    _context.driver = [DoricNativeDriver instance];
    _context.rootNode.viewId = nil;
    [_context callEntity:DORIC_ENTITY_INIT, _context.extra, nil];
    [_context callEntity:DORIC_ENTITY_CREATE, nil];
    [_context callEntity:DORIC_ENTITY_BUILD withArgumentsArray:@[_context.initialParams]];
}

- (void)onDebuggerReadyEvent {
    _context.driver = _driver;
    _context.rootNode.viewId = nil;
    [_context callEntity:DORIC_ENTITY_INIT, _context.extra, nil];
    [_context callEntity:DORIC_ENTITY_CREATE, nil];
    [_context callEntity:DORIC_ENTITY_BUILD withArgumentsArray:@[_context.initialParams]];
}
@end
