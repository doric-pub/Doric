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
// Created by pengfei.zhou on 2021/10/22.
//

#import "DoricResourceLoaderManager.h"

@interface DoricResourceLoaderManager ()
@property(nonatomic, strong) NSMutableDictionary <NSString *, id <DoricResourceLoader>> *loaders;
@end

@implementation DoricResourceLoaderManager
- (instancetype)init {
    if (self = [super init]) {
        _loaders = [NSMutableDictionary new];
    }
    return self;
}

- (void)registerLoader:(id <DoricResourceLoader>)loader {
    self.loaders[loader.resourceType] = loader;
}

- (void)unRegisterLoader:(id <DoricResourceLoader>)loader {
    [self.loaders removeObjectForKey:loader.resourceType];
}

- (__kindof DoricResource *)load:(NSString *)identifier
                withResourceType:(NSString *)resourceType
                     withContext:(DoricContext *)context {
    id <DoricResourceLoader> loader = self.loaders[resourceType];
    return [loader load:identifier withContext:context];
}

@end