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
#import "DoricContext.h"
#import "DoricArrayBufferResource.h"
#import "DoricRemoteResource.h"

@interface DoricResourceManager ()
@property(nonatomic, strong) NSMutableDictionary <NSString *, id <DoricResourceLoader>> *loaders;
@property(nonatomic, strong) dispatch_queue_t mapQueue;
@end

@implementation DoricResourceManager
- (instancetype)init {
    if (self = [super init]) {
        _loaders = [NSMutableDictionary new];
        _mapQueue = dispatch_queue_create("doric.resource", DISPATCH_QUEUE_SERIAL);
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

- (__kindof DoricResource *)load:(NSDictionary *)resource
                     withContext:(DoricContext *)context {
    NSString *type = resource[@"type"];
    NSString *identifier = resource[@"identifier"];
    NSString *resId = resource[@"resId"];
    __block __kindof DoricResource *doricResource;
    dispatch_sync(self.mapQueue, ^() {
        doricResource = [context.cachedResources objectForKey:resId];
        if (!doricResource) {
            id <DoricResourceLoader> loader = self.loaders[type];
            doricResource = [loader load:identifier withContext:context];
            if ([doricResource isKindOfClass:DoricArrayBufferResource.class]) {
                ((DoricArrayBufferResource *) doricResource).data = resource[@"data"];
            } else if ([doricResource isKindOfClass:DoricRemoteResource.class]) {
                NSDictionary *headers = resource[@"headers"];
                if (headers) {
                    [headers enumerateKeysAndObjectsUsingBlock:^(NSString *key, NSString *value, BOOL *stop) {
                        [(DoricRemoteResource *) doricResource setHeaderWithKey:key
                                                                      withValue:value];
                    }];
                }
            }
            [context.cachedResources setObject:doricResource forKey:resId];
        }
    });
    return doricResource;
}

@end
