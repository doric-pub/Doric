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
//  DoricContext.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/25.
//

#import "DoricContext.h"
#import "DoricContextManager.h"
#import "DoricRootNode.h"
#import "DoricConstant.h"
#import "DoricExtensions.h"
#import "DoricNativeDriver.h"

@implementation DoricContext

- (instancetype)initWithScript:(NSString *)script source:(NSString *)source extra:(NSString *)extra {
    if (self = [super init]) {
        _driver = [DoricNativeDriver instance];
        _pluginInstanceMap = [NSMutableDictionary new];
        _script = script;
        _source = source;
        _initialParams = [@{@"width": @(0), @"height": @(0)} mutableCopy];
        [[DoricContextManager instance] createContext:self script:script source:source];
        _headNodes = [NSMutableDictionary new];
        DoricRootNode *rootNode = [[DoricRootNode alloc] initWithContext:self];
        _rootNode = rootNode;
        [self init:extra];
        [self callEntity:DORIC_ENTITY_CREATE withArgumentsArray:@[]];
    }
    return self;
}

- (DoricViewNode *)targetViewNode:(NSString *)viewId {
    if ([self.rootNode.viewId isEqualToString:viewId]) {
        return self.rootNode;
    } else {
        for (NSMutableDictionary <NSString *, DoricViewNode *> *map in self.headNodes.allValues) {
            if ([[map allKeys] containsObject:viewId]) {
                return map[viewId];
            }
        }
    }
    return nil;
}

- (void)dealloc {
    [[DoricContextManager instance] destroyContext:self];
    [self callEntity:DORIC_ENTITY_DESTROY withArgumentsArray:@[]];
    [self.driver destroyContext:self.contextId];
}

- (DoricAsyncResult *)callEntity:(NSString *)method, ... {
    va_list args;
    va_start(args, method);
    DoricAsyncResult *ret = [self.driver invokeContextEntity:self.contextId method:method arguments:args];
    va_end(args);
    return ret;
}

- (DoricAsyncResult *)callEntity:(NSString *)method withArguments:(va_list)args {
    return [self.driver invokeContextEntity:self.contextId method:method arguments:args];
}

- (DoricAsyncResult *)callEntity:(NSString *)method withArgumentsArray:(NSArray *)args {
    return [self.driver invokeContextEntity:self.contextId method:method argumentsArray:args];
}

- (void)init:(NSString *)initData {
    self.extra = initData;
    if (initData) {
        [self callEntity:DORIC_ENTITY_INIT withArgumentsArray:@[initData]];
    }
}

- (void)build:(CGSize)size {
    [self.initialParams also:^(NSMutableDictionary *it) {
        it[@"width"] = @(size.width);
        it[@"height"] = @(size.height);
    }];
    [self callEntity:DORIC_ENTITY_BUILD withArgumentsArray:@[self.initialParams]];
}

- (void)reload:(NSString *)script {
    self.rootNode.viewId = nil;
    self.script = script;
    [self.driver createContext:self.contextId script:script source:self.source];
    [self init:self.extra];
    [self callEntity:DORIC_ENTITY_CREATE withArgumentsArray:@[]];
    [self callEntity:DORIC_ENTITY_BUILD withArgumentsArray:@[self.initialParams]];
    [self onShow];
}

- (void)onShow {
    [self callEntity:DORIC_ENTITY_SHOW withArgumentsArray:@[]];
}

- (void)onHidden {
    [self callEntity:DORIC_ENTITY_HIDDEN withArgumentsArray:@[]];
}
- (UIViewController *)vc {
    if(!_vc) {
        return [UIApplication sharedApplication].keyWindow.rootViewController;
    }
    return _vc;
}
@end
