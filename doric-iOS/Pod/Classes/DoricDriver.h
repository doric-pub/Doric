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
//  DoricDriver.h
//  Doric
//
//  Created by pengfei.zhou on 2019/7/26.
//

#import <Foundation/Foundation.h>
#import "DoricAsyncResult.h"
#import "DoricRegistry.h"

typedef NS_ENUM(NSInteger, DoricQueueMode) {
    JS = 0,
    UI,
    INDEPENDENT
};

NS_ASSUME_NONNULL_BEGIN

@interface DoricDriver : NSObject
+ (instancetype)instance;

@property(nonatomic, strong) DoricRegistry *registry;

- (DoricAsyncResult *)createContext:(NSString *)contextId script:(NSString *)script source:(NSString *)source;

- (DoricAsyncResult *)destroyContext:(NSString *)contextId;

- (DoricAsyncResult *)invokeDoricMethod:(NSString *)method, ...;

- (DoricAsyncResult *)invokeContextEntity:(NSString *)contextId method:(NSString *)method, ...;

- (DoricAsyncResult *)invokeContextEntity:(NSString *)contextId method:(NSString *)method arguments:(va_list)args;

- (DoricAsyncResult *)invokeContextEntity:(NSString *)contextId method:(NSString *)method argumentsArray:(NSArray *)args;

- (void)connectDevKit:(NSString *)url;

- (void)disconnectDevKit;

- (void)ensureSyncInMainQueue:(dispatch_block_t)block;
@end

NS_ASSUME_NONNULL_END
