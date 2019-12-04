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
//  DoricJSEngineProtocal.h
//  Doric
//
//  Created by pengfei.zhou on 2019/7/25.
//

#import <Foundation/Foundation.h>
#import <JavaScriptCore/JavaScriptCore.h>

NS_ASSUME_NONNULL_BEGIN

@protocol DoricJSExecutorProtocol <NSObject>

- (NSString *)loadJSScript:(NSString *)script source:(NSString *)source;

- (void)injectGlobalJSObject:(NSString *)name obj:(id)obj;

- (JSValue *)invokeObject:(NSString *)objName method:(NSString *)funcName args:(NSArray *)args;

@end

NS_ASSUME_NONNULL_END
