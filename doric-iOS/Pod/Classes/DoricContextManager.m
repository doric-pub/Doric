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
//  DoricContextManager.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/29.
//

#import "DoricContextManager.h"
#import "DoricSingleton.h"

@interface DoricContextManager ()

@property(nonatomic) NSInteger counter;
@property(nonatomic, strong) NSMapTable <NSString *, DoricContext *> *contextMapTable;
@property(nonatomic, strong) dispatch_queue_t mapQueue;
@end

@implementation DoricContextManager

- (instancetype)init {
    if (self = [super init]) {
        _counter = 0;
        _mapQueue = dispatch_queue_create("doric.contextmap", DISPATCH_QUEUE_SERIAL);
        _contextMapTable = [[NSMapTable alloc] initWithKeyOptions:NSPointerFunctionsCopyIn
                                                     valueOptions:NSPointerFunctionsWeakMemory
                                                         capacity:0];
    }
    return self;
}

+ (instancetype)instance {
    return DoricSingleton.instance.contextManager;
}

- (void)createContext:(DoricContext *)context script:(NSString *)script source:(NSString *)source {
    context.contextId = [NSString stringWithFormat:@"%ld", (long) ++self.counter];
    context.performanceProfile = [[DoricPerformanceProfile alloc] initWithName:context.contextId];
    if (context.driver.registry.globalPerformanceAnchorHook) {
        [context.performanceProfile addAnchorHook:context.driver.registry.globalPerformanceAnchorHook];
    }
    dispatch_sync(self.mapQueue, ^() {
        [self.contextMapTable setObject:context forKey:context.contextId];
    });
    [context.driver createContext:context.contextId script:script source:source];
}

- (DoricContext *)getContext:(NSString *)contextId {
    __block DoricContext *context;
    dispatch_sync(self.mapQueue, ^{
        context = [self.contextMapTable objectForKey:contextId];
    });
    return context;
}

- (void)destroyContext:(DoricContext *)context {
    NSString *contextId = context.contextId;
    dispatch_sync(self.mapQueue, ^() {
        [self.contextMapTable removeObjectForKey:contextId];
    });
}

- (NSArray <DoricContext *> *)aliveContexts {
    NSEnumerator *enumerator = [self.contextMapTable objectEnumerator];
    NSMutableArray *ret = [NSMutableArray new];
    DoricContext *context;
    while ((context = [enumerator nextObject])) {
        [ret addObject:context];
    }
    return ret;
}

@end
