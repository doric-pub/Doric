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
// Created by pengfei.zhou on 2021/7/21.
//

#import <Foundation/Foundation.h>

@class DoricLibrary;
@class DoricRegistry;
@class DoricJSLoaderManager;
@class DoricNativeDriver;
@class DoricContextManager;

@interface DoricSingleton : NSObject
@property(nonatomic, strong) NSMutableDictionary *bundles;
@property(nonatomic, strong) NSMutableSet <DoricLibrary *> *libraries;
@property(nonatomic, strong) NSHashTable<DoricRegistry *> *registries;
@property(nonatomic, strong) NSMutableDictionary *envDic;
@property(nonatomic, assign) BOOL enablePerformance;
@property(nonatomic, assign) BOOL enableRecordSnapshot;
@property(nonatomic, assign) BOOL legacyMode;
@property(nonatomic, strong) DoricJSLoaderManager *jsLoaderManager;
@property(nonatomic, strong) DoricNativeDriver *nativeDriver;
@property(nonatomic, strong) DoricContextManager *contextManager;
@property(nonatomic, strong) NSMapTable<NSString *, id> *storageCaches;
@property(nonatomic, assign) BOOL imageClearBufferWhenStopped;

+ (instancetype)instance;

- (void)setEnvironmentValue:(NSDictionary *)value;
@end
