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

const bool _DEBUG = YES;

@interface DoricPerformanceProfile ()
@property(nonatomic, copy) NSString *name;
@property(nonatomic, strong) NSMutableDictionary <NSString *, NSNumber *> *anchorMap;
@property(nonatomic, strong) dispatch_queue_t anchorQueue;
@end

@implementation DoricPerformanceProfile
- (instancetype)initWithName:(NSString *)name {
    if (self = [super init]) {
        _name = name;
        _anchorQueue = dispatch_queue_create("doric.performance.profile", DISPATCH_QUEUE_SERIAL);
        _anchorMap = [NSMutableDictionary new];
    }
    return self;
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
    if (!_DEBUG) {
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
    if (_DEBUG) {
        [self print:anchorName];
    }
}

- (void)print:(NSString *)anchorName {
    dispatch_async(self.anchorQueue, ^{
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
        NSLog(@"[DoricPerformanceProfile] %@: %@ prepared %@ms, cost %@ms",
                self.name,
                anchorName,
                @(start.integerValue - prepare.integerValue),
                @(end.integerValue - start.integerValue)
        );
    });
}
@end
