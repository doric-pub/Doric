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
//  DoricPerformanceProfile.m
//  DoricCore
//
//  Created by pengfei.zhou on 2021/3/29.
//  

#import "DoricPerformanceProfile.h"
#import "DoricRegistry.h"
#import "DoricSingleton.h"

@interface DoricPerformanceProfile ()
@property(nonatomic, strong) dispatch_queue_t anchorQueue;
@property(nonatomic, assign) BOOL enable;
@property(nonatomic, strong) NSHashTable<id <DoricPerformanceAnchorHookProtocol>> *hooks;
@property(nonatomic, strong) NSMutableDictionary <NSString *, NSNumber *> *anchorMap;
@end

@implementation DoricPerformanceProfile
- (instancetype)initWithName:(NSString *)name {
    if (self = [super init]) {
        _name = name;
        _anchorQueue = dispatch_queue_create("doric.performance.profile", DISPATCH_QUEUE_SERIAL);
        _anchorMap = [NSMutableDictionary new];
        _enable = DoricSingleton.instance.enablePerformance;
        _hooks = [NSHashTable weakObjectsHashTable];
    }
    return self;
}

- (void)addAnchorHook:(id)hook {
    __weak typeof(self) _self = self;
    dispatch_async(self.anchorQueue, ^{
        __strong typeof(_self) self = _self;
        if (!self) return;
        
        [self.hooks addObject:hook];
    });
}

- (void)removeAnchorHook:(id)hook {
    __weak typeof(self) _self = self;
    dispatch_async(self.anchorQueue, ^{
        __strong typeof(_self) self = _self;
        if (!self) return;
        
        [self.hooks removeObject:hook];
    });
}

- (void)enable:(bool)enable {
    self.enable = enable;
}

- (NSString *)getPrepareAnchor:(NSString *)anchorName {
    return [NSString stringWithFormat:@"%@#prepare", anchorName];
}

- (NSString *)getStartAnchor:(NSString *)anchorName {
    return [NSString stringWithFormat:@"%@#start", anchorName];
}

- (NSString *)getEndAnchor:(NSString *)anchorName {
    return [NSString stringWithFormat:@"%@#end", anchorName];
}

- (void)markAnchor:(NSString *)eventName {
    if (!self.enable) {
        return;
    }
    NSUInteger time = (NSUInteger) ([[NSDate date] timeIntervalSince1970] * 1000);
    dispatch_async(self.anchorQueue, ^{
        self.anchorMap[eventName] = @(time);
    });
}


- (void)prepare:(NSString *)anchorName {
    [self markAnchor:[self getPrepareAnchor:anchorName]];
}

- (void)start:(NSString *)anchorName {
    [self markAnchor:[self getStartAnchor:anchorName]];
}

- (void)end:(NSString *)anchorName {
    [self markAnchor:[self getEndAnchor:anchorName]];
    [self print:anchorName];
}

- (void)print:(NSString *)anchorName {
    if (!self.enable) {
        return;
    }
    __weak typeof(self) _self = self;
    dispatch_async(self.anchorQueue, ^{
        __strong typeof(_self) self = _self;
        if (!self) return;
        
        NSNumber *prepare = self.anchorMap[[self getPrepareAnchor:anchorName]];
        NSNumber *start = self.anchorMap[[self getStartAnchor:anchorName]];
        NSNumber *end = self.anchorMap[[self getEndAnchor:anchorName]];
        if (!end) {
            end = @( (NSUInteger) [[NSDate date] timeIntervalSince1970] * 1000);
        }
        if (!start) {
            start = end;
        }
        if (!prepare) {
            prepare = start;
        }
        for (id <DoricPerformanceAnchorHookProtocol> hook in self.hooks) {
            if ([hook conformsToProtocol:@protocol(DoricPerformanceGlobalAnchorHookProtocol)]) {
                [(id <DoricPerformanceGlobalAnchorHookProtocol>) hook onAnchorName:anchorName prepare:prepare start:start end:end in:self];
            } else {
                [hook onAnchorName:anchorName prepare:prepare start:start end:end];
            }
        }
    });
}
@end
