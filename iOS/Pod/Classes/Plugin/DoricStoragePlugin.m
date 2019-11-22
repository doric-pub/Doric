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
// Created by pengfei.zhou on 2019/11/22.
//

#import "DoricStoragePlugin.h"
#import "YYDiskCache.h"

static NSString *doric_prefix = @"pref";

@interface DoricStoragePlugin ()
@property(atomic, strong) NSMutableDictionary <NSString *, YYDiskCache *> *cachedMap;
@property(nonatomic, strong) YYDiskCache *defaultCache;
@property(nonatomic, copy) NSString *basePath;
@end

@implementation DoricStoragePlugin
- (instancetype)initWithContext:(DoricContext *)doricContext {
    if (self = [super initWithContext:doricContext]) {
        _basePath = [[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject]
                stringByAppendingPathComponent:@"doric"];
    }
    return self;
}

- (YYDiskCache *)defaultCache {
    if (!_defaultCache) {
        _defaultCache = [[YYDiskCache alloc] initWithPath:[self.basePath stringByAppendingPathComponent:doric_prefix]];
    }
    return _defaultCache;
}

- (YYDiskCache *)getDiskCache:(NSString *)zone {
    YYDiskCache *diskCache;
    if (zone) {
        diskCache = self.cachedMap[zone];
        if (!diskCache) {
            diskCache = [[YYDiskCache alloc] initWithPath:[self.basePath
                    stringByAppendingPathComponent:[NSString stringWithFormat:@"%@_%@", doric_prefix, zone]]];
            self.cachedMap[zone] = diskCache;
        }
    } else {
        diskCache = self.defaultCache;
    }
    return diskCache;
}

- (void)setItem:(NSDictionary *)argument withPromise:(DoricPromise *)promise {
    NSString *zone = argument[@"zone"];
    NSString *key = argument[@"key"];
    NSString *value = argument[@"value"];
    YYDiskCache *diskCache = [self getDiskCache:zone];
    [diskCache setObject:value forKey:key withBlock:^{
        [promise resolve:nil];
    }];
}

- (void)getItem:(NSDictionary *)argument withPromise:(DoricPromise *)promise {
    NSString *zone = argument[@"zone"];
    NSString *key = argument[@"key"];
    YYDiskCache *diskCache = [self getDiskCache:zone];
    [diskCache objectForKey:key withBlock:^(NSString *key, NSString *value) {
        [promise resolve:value];
    }];
}

- (void)remove:(NSDictionary *)argument withPromise:(DoricPromise *)promise {
    NSString *zone = argument[@"zone"];
    NSString *key = argument[@"key"];
    YYDiskCache *diskCache = [self getDiskCache:zone];
    [diskCache removeObjectForKey:key withBlock:^(NSString *key) {
        [promise resolve:nil];
    }];
}

- (void)clear:(NSDictionary *)argument withPromise:(DoricPromise *)promise {
    NSString *zone = argument[@"zone"];
    YYDiskCache *diskCache = [self getDiskCache:zone];
    [diskCache removeAllObjectsWithBlock:^{
        [promise resolve:nil];
    }];
}
@end