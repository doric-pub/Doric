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

#import "DoricResourceManager.h"

@interface DoricResourceManager ()
@property(nonatomic, strong) NSMutableDictionary <NSString *, id <DoricResourceLoader>> *loaders;
@property(nonatomic, strong) NSMapTable <NSString *, __kindof DoricResource *> *cachedResources;
@property(nonatomic, strong) dispatch_queue_t mapQueue;
@end

@implementation DoricResourceManager
- (instancetype)init {
    if (self = [super init]) {
        _loaders = [NSMutableDictionary new];
        _mapQueue = dispatch_queue_create("doric.resource", DISPATCH_QUEUE_SERIAL);
        _cachedResources = [[NSMapTable alloc] initWithKeyOptions:NSPointerFunctionsCopyIn
                                                     valueOptions:NSPointerFunctionsWeakMemory
                                                         capacity:0];
    }
    return self;
}

- (void)registerLoader:(id <DoricResourceLoader>)loader {
    dispatch_sync(self.mapQueue, ^{
        self.loaders[loader.resourceType] = loader;
    });
}

- (void)unRegisterLoader:(id <DoricResourceLoader>)loader {
    dispatch_sync(self.mapQueue, ^{
        [self.loaders removeObjectForKey:loader.resourceType];
    });
}

- (__kindof DoricResource *)load:(NSString *)resId
                  withIdentifier:(NSString *)identifier
                withResourceType:(NSString *)resourceType
                     withContext:(DoricContext *)context {
    __block __kindof DoricResource *resource;
    dispatch_sync(self.mapQueue, ^() {
        resource = [self.cachedResources objectForKey:resId];
        if (!resource) {
            id <DoricResourceLoader> loader = self.loaders[resourceType];
            resource = [loader load:identifier withContext:context];
            [self.cachedResources setObject:resource forKey:resId];
        }
    });
    return resource;
}

@end
