/*
 * Copyright [2021] [Doric.Pub]
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
// Created by pengfei.zhou on 2021/7/20.
//

#import "DoricDevPerformanceAnchorHook.h"

@implementation DoricDevAnchorNode
@end

@interface DoricDevPerformanceAnchorHook ()
@property(nonatomic, strong) NSMutableDictionary<NSString *, NSMutableArray <DoricDevAnchorNode *> *> *nodeMap;
@property(nonatomic, copy) NSComparator comparator;
@end

@implementation DoricDevPerformanceAnchorHook
- (instancetype)init {
    if (self = [super init]) {
        _nodeMap = [NSMutableDictionary new];
        _comparator = ^NSComparisonResult(DoricDevAnchorNode *obj1, DoricDevAnchorNode *obj2) {
            long ret = obj1.prepare - obj2.prepare;
            if (ret > 0) {
                return NSOrderedDescending;
            } else if (ret < 0) {
                return NSOrderedAscending;
            } else {
                return NSOrderedSame;
            }
        };
    }
    return self;
}

- (void)onAnchorName:(NSString *)name prepare:(NSNumber *)prepare start:(NSNumber *)start end:(NSNumber *)end in:(DoricPerformanceProfile *)profile {
    NSLog(@"[DoricPerformance] %@: %@ prepared %@ms, cost %@ms",
            profile.name,
            name,
            @(start.integerValue - prepare.integerValue),
            @(end.integerValue - start.integerValue)
    );
    NSMutableArray<DoricDevAnchorNode *> *array = self.nodeMap[profile.name];
    if (!array) {
        array = [NSMutableArray new];
        self.nodeMap[profile.name] = array;
    }
    [array addObject:[[DoricDevAnchorNode new] also:^(DoricDevAnchorNode *it) {
        it.name = name;
        it.prepare = prepare.longValue;
        it.start = start.longValue;
        it.end = end.longValue;
    }]];
    [array sortUsingComparator:self.comparator];
    if ([name isEqualToString:@"Destroy"]) {
        [self.nodeMap removeObjectForKey:profile.name];
    }
}

- (void)onAnchorName:(NSString *)name prepare:(NSNumber *)prepare start:(NSNumber *)start end:(NSNumber *)end {
    //Do nothing
}

- (NSArray <DoricDevAnchorNode *> *)getAnchorNodeList:(NSString *)name {
    return [self.nodeMap[name] copy];
}
@end