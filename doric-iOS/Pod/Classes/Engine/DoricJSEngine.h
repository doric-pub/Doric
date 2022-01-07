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
//  DoricJSEngine.h
//  Doric
//
//  Created by pengfei.zhou on 2019/7/26.
//

#import <Foundation/Foundation.h>
#import <JavaScriptCore/JavaScriptCore.h>

#import "DoricRegistry.h"
#import "DoricJSExecutorProtocol.h"

NS_ASSUME_NONNULL_BEGIN

@interface DoricJSEngine : NSObject

@property(nonatomic, strong) id <DoricJSExecutorProtocol> jsExecutor;

@property(nonatomic, strong) NSThread *jsThread;

@property(nonatomic, strong) DoricRegistry *registry;

- (void)prepareContext:(NSString *)contextId script:(NSString *)script source:(NSString *)source;

- (void)destroyContext:(NSString *)contextId;

- (JSValue *)invokeDoricMethod:(NSString *)method, ... NS_REQUIRES_NIL_TERMINATION;

- (JSValue *)invokeDoricMethod:(NSString *)method arguments:(va_list)args;

- (JSValue *)invokeDoricMethod:(NSString *)method argumentsArray:(NSArray *)args;

- (void)ensureRunOnJSThread:(dispatch_block_t)block;

- (void)initJSEngine;

- (void)teardown;

- (void)setEnvironmentValue:(NSDictionary *)value;
@end

NS_ASSUME_NONNULL_END
