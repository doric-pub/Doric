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
#import "DoricCollectionItemNode.h"
#import "DoricCollectionNode.h"

@interface DoricRegistry ()

@property(nonatomic, strong) NSMutableDictionary *bundles;
@property(nonatomic, strong) NSMutableDictionary *plugins;
@property(nonatomic, strong) NSMutableDictionary *nodes;

@end

@implementation DoricRegistry

- (instancetype)init {
    if (self = [super init]) {
        _bundles = [[NSMutableDictionary alloc] init];
        _plugins = [[NSMutableDictionary alloc] init];
        _nodes = [[NSMutableDictionary alloc] init];
        [self innerRegister];
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
    [self registerViewNode:DoricCollectionItemNode.class withName:@"CollectionItem"];
    [self registerViewNode:DoricCollectionNode.class withName:@"Collection"];
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

@end
