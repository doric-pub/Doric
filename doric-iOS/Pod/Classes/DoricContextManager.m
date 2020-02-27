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
#import "DoricContext.h"

@interface DoricContextManager ()

@property(nonatomic) NSInteger counter;
@property(nonatomic, strong) NSMutableDictionary *doricContextMap;
@property(nonatomic, strong) dispatch_queue_t mapQueue;
@end

@implementation DoricContextManager

- (instancetype)init {
    if (self = [super init]) {
        _doricContextMap = [[NSMutableDictionary alloc] init];
        _counter = 0;
        _mapQueue = dispatch_queue_create("doric.contextmap", DISPATCH_QUEUE_SERIAL);
    }
    return self;
}

+ (instancetype)instance {
    static DoricContextManager *_instance;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _instance = [[DoricContextManager alloc] init];
    });
    return _instance;
}

- (void)createContext:(DoricContext *)context script:(NSString *)script source:(NSString *)source {
    context.contextId = [NSString stringWithFormat:@"%ld", (long) ++self.counter];
    [context.driver createContext:context.contextId script:script source:source];
    dispatch_sync(self.mapQueue, ^() {
        NSValue *value = [NSValue valueWithNonretainedObject:context];
        [self.doricContextMap setValue:value forKey:context.contextId];
    });
}

- (DoricContext *)getContext:(NSString *)contextId {
    __block DoricContext *context;
    dispatch_sync(self.mapQueue, ^{
        NSValue *value = [self.doricContextMap valueForKey:contextId];
        context = value.nonretainedObjectValue;
    });
    return context;
}

- (void)destroyContext:(DoricContext *)context {
    NSString *contextId = context.contextId;
    dispatch_sync(self.mapQueue, ^() {
        [self.doricContextMap removeObjectForKey:contextId];
    });
    [context.driver destroyContext:contextId];
}

- (NSArray *)aliveContexts {
    return [self.doricContextMap allValues];
}

@end
