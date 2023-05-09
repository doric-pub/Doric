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
// Created by pengfei.zhou on 2020/3/25.
//

#import "DoricJSDispatcher.h"

@interface DoricJSDispatcher ()
@property(nonatomic, strong) NSMutableArray <DoricAsyncResult *(^)(void)> *blocks;
@property(nonatomic, assign) BOOL consuming;
@property(nonatomic, strong) dispatch_queue_t syncQueue;
@end

@implementation DoricJSDispatcher
- (instancetype)init {
    if (self = [super init]) {
        _syncQueue = dispatch_queue_create("DoricJSDispatcher", DISPATCH_QUEUE_CONCURRENT);
    }
    return self;
}

- (void)dispatch:(DoricAsyncResult *(^)(void))block {
    dispatch_barrier_async(self.syncQueue, ^{
        if (!self.blocks) {
            self.blocks = [@[block] mutableCopy];
        } else {
            if (self.blocks.count > 0) {
                [self.blocks removeAllObjects];
            }
            [self.blocks insertObject:block atIndex:0];
        }
        if (!self.consuming) {
            [self consume];
        }
    });

}

- (void)consume {
    dispatch_barrier_async(self.syncQueue, ^{
        DoricAsyncResult *(^block )(void) = self.blocks.lastObject;
        if (block) {
            self.consuming = YES;
            [self.blocks removeLastObject];
            DoricAsyncResult *result = block();
            __weak typeof(self) __self = self;
            result.finishCallback = ^{
                dispatch_async(dispatch_get_main_queue(), ^{
                    __strong typeof(__self) self = __self;
                    [self consume];
                });
            };
        } else {
            self.consuming = NO;
        }
    });
}

- (void)clear {
    dispatch_barrier_async(self.syncQueue, ^{
        [self.blocks removeAllObjects];
    });
}
@end
