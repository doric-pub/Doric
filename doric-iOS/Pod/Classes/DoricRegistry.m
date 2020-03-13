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
//  DoricRegistry.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/27.
//

#import "DoricRegistry.h"
#import "DoricModalPlugin.h"
#import "DoricNetworkPlugin.h"
#import "DoricShaderPlugin.h"
#import "DoricStackNode.h"
#import "DoricVLayoutNode.h"
#import "DoricHLayoutNode.h"
#import "DoricTextNode.h"
#import "DoricImageNode.h"
#import "DoricListNode.h"
#import "DoricListItemNode.h"
#import "DoricScrollerNode.h"
#import "DoricSliderNode.h"
#import "DoricSlideItemNode.h"
#import "DoricStoragePlugin.h"
#import "DoricNavigatorPlugin.h"
#import "DoricNavBarPlugin.h"
#import "DoricRefreshableNode.h"
#import "DoricFlowLayoutItemNode.h"
#import "DoricFlowLayoutNode.h"
#import "DoricPopoverPlugin.h"
#import "DoricAnimatePlugin.h"
#import "DoricNestedSliderNode.h"
#import "DoricInputNode.h"
#import "DoricDraggableNode.h"
#import "DoricLibrary.h"
#import "DoricNotificationPlugin.h"
#import "DoricStatusBarPlugin.h"
#import "DoricUtil.h"
#import "DoricCoordinatorPlugin.h"
#import "DoricSwitchNode.h"

@interface DoricLibraries : NSObject
@property(nonatomic, strong) NSMutableSet <DoricLibrary *> *libraries;

+ (instancetype)instance;
@end

@implementation DoricLibraries
- (instancetype)init {
    if (self = [super init]) {
        _libraries = [NSMutableSet new];
    }
    return self;
}

+ (instancetype)instance {
    static DoricLibraries *_instance;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _instance = [[DoricLibraries alloc] init];
    });
    return _instance;
}

@end

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

@interface DoricRegistry ()

@property(nonatomic, strong) NSMutableDictionary *bundles;
@property(nonatomic, strong) NSMutableDictionary *plugins;
@property(nonatomic, strong) NSMutableDictionary *nodes;
@property(nonatomic, strong) NSMutableDictionary <NSString *, id> *envVariables;
@property(nonatomic, strong) NSMutableSet <id <DoricMonitorProtocol>> *monitors;
@end

@implementation DoricRegistry

+ (void)register:(DoricLibrary *)library {
    [DoricLibraries.instance.libraries addObject:library];
}

- (instancetype)init {
    if (self = [super init]) {
        _bundles = [NSMutableDictionary new];
        _plugins = [NSMutableDictionary new];
        _nodes = [NSMutableDictionary new];
        _envVariables = [NSMutableDictionary new];
        [self innerRegister];
        _monitors = [NSMutableSet new];
        [self registerMonitor:[DoricDefaultMonitor new]];
        [DoricLibraries.instance.libraries enumerateObjectsUsingBlock:^(DoricLibrary *obj, BOOL *stop) {
            [obj load:self];
        }];
    }
    return self;
}

- (void)innerRegister {
    [self registerNativePlugin:DoricShaderPlugin.class withName:@"shader"];
    [self registerNativePlugin:DoricModalPlugin.class withName:@"modal"];
    [self registerNativePlugin:DoricNetworkPlugin.class withName:@"network"];
    [self registerNativePlugin:DoricStoragePlugin.class withName:@"storage"];
    [self registerNativePlugin:DoricNavigatorPlugin.class withName:@"navigator"];
    [self registerNativePlugin:DoricNavBarPlugin.class withName:@"navbar"];
    [self registerNativePlugin:DoricPopoverPlugin.class withName:@"popover"];
    [self registerNativePlugin:DoricAnimatePlugin.class withName:@"animate"];
    [self registerNativePlugin:DoricNotificationPlugin.class withName:@"notification"];
    [self registerNativePlugin:DoricStatusBarPlugin.class withName:@"statusbar"];
    [self registerNativePlugin:DoricCoordinatorPlugin.class withName:@"coordinator"];

    [self registerViewNode:DoricStackNode.class withName:@"Stack"];
    [self registerViewNode:DoricVLayoutNode.class withName:@"VLayout"];
    [self registerViewNode:DoricHLayoutNode.class withName:@"HLayout"];
    [self registerViewNode:DoricTextNode.class withName:@"Text"];
    [self registerViewNode:DoricImageNode.class withName:@"Image"];
    [self registerViewNode:DoricListNode.class withName:@"List"];
    [self registerViewNode:DoricListItemNode.class withName:@"ListItem"];
    [self registerViewNode:DoricScrollerNode.class withName:@"Scroller"];
    [self registerViewNode:DoricSliderNode.class withName:@"Slider"];
    [self registerViewNode:DoricSlideItemNode.class withName:@"SlideItem"];
    [self registerViewNode:DoricRefreshableNode.class withName:@"Refreshable"];
    [self registerViewNode:DoricFlowLayoutItemNode.class withName:@"FlowLayoutItem"];
    [self registerViewNode:DoricFlowLayoutNode.class withName:@"FlowLayout"];
    [self registerViewNode:DoricNestedSliderNode.class withName:@"NestedSlider"];
    [self registerViewNode:DoricInputNode.class withName:@"Input"];
    [self registerViewNode:DoricDraggableNode.class withName:@"Draggable"];
    [self registerViewNode:DoricSwitchNode.class withName:@"Switch"];
}

- (void)registerJSBundle:(NSString *)bundle withName:(NSString *)name {
    self.bundles[name] = bundle;
}

- (NSString *)acquireJSBundle:(NSString *)name {
    return self.bundles[name];
}

- (void)registerNativePlugin:(Class)pluginClass withName:(NSString *)name {
    self.plugins[name] = pluginClass;
}

- (Class)acquireNativePlugin:(NSString *)name {
    return self.plugins[name];
}

- (void)registerViewNode:(Class)nodeClass withName:(NSString *)name {
    self.nodes[name] = nodeClass;
}

- (Class)acquireViewNode:(NSString *)name {
    return self.nodes[name];
}

- (void)setEnvironment:(NSString *)key variable:(id)value {
    self.envVariables[key] = value;
}

- (NSDictionary *)environmentVariables {
    return self.envVariables;
}

- (void)registerMonitor:(id <DoricMonitorProtocol>)monitor {
    [self.monitors addObject:monitor];
}

- (void)onException:(NSException *)exception inContext:(DoricContext *)context {
    for (id <DoricMonitorProtocol> monitor in self.monitors) {
        [monitor onException:exception inContext:context];
    }
}

- (void)onLog:(DoricLogType)type message:(NSString *)message {
    for (id <DoricMonitorProtocol> monitor in self.monitors) {
        [monitor onLog:type message:message];
    }
}
@end
