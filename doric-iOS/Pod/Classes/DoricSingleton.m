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

#import "DoricSingleton.h"
#import "DoricRegistry.h"
#import "DoricJSLoaderManager.h"
#import "DoricNativeDriver.h"
#import "DoricContextManager.h"
#import "DoricLifeCycleManager.h"

@interface DoricSingleton ()
@property (nonatomic, strong) DoricLifeCycleManager *lifeCycleManager;
@end

@implementation DoricSingleton

- (instancetype)init {
    if (self = [super init]) {
        _libraries = [NSMutableSet new];
        _registries = [NSHashTable weakObjectsHashTable];
        _envDic = [NSMutableDictionary new];
        _enablePerformance = NO;
        _enableRecordSnapshot = NO;
        _jsLoaderManager = [DoricJSLoaderManager new];
        _contextManager = [DoricContextManager new];
        _storageCaches = [[NSMapTable alloc] initWithKeyOptions:NSPointerFunctionsCopyIn
                                                   valueOptions:NSPointerFunctionsWeakMemory
                                                       capacity:0];
        _bundles = [NSMutableDictionary new];
        _legacyMode = NO;
        _lifeCycleManager = [DoricLifeCycleManager new];

    }
    return self;
}

+ (instancetype)instance {
    static DoricSingleton *_instance;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _instance = [DoricSingleton new];
    });
    return _instance;
}

- (DoricNativeDriver *)nativeDriver {
    if (!_nativeDriver) {
        _nativeDriver = [DoricNativeDriver new];
    }
    return _nativeDriver;
}

- (void)setEnvironmentValue:(NSDictionary *)value {
    [self.envDic addEntriesFromDictionary:value];
    for (DoricRegistry *registry in self.registries) {
        if (registry) {
            [registry innerSetEnvironmentValue:value];
        }
    }
}
@end
