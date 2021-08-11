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
#import "DoricExtensions.h"
#import "DoricSingleton.h"

#if __has_include(<PINCache/PINCache.h>)

#import <PINCache/PINCache.h>

#define DoricCache PINCache

@interface PINCache (Doric)
- (void)setObject:(NSString *)value forKey:(NSString *)key withBlock:(void (^)(void))block;

- (void)objectForKey:(NSString *)key withBlock:(void (^)(NSString *, id <NSCoding>))block;

- (void)removeObjectForKey:(NSString *)key withBlock:(void (^)(NSString *))block;

- (void)removeAllObjectsWithBlock:(void (^)(void))pFunction;
@end

@implementation PINCache (Doric)

- (void)setObject:(NSString *)value forKey:(NSString *)key withBlock:(void (^)(void))block {
    [self setObjectAsync:value forKey:key completion:^(id <PINCaching> cache, NSString *key, id object) {
        block();
    }];
}

- (void)objectForKey:(NSString *)key withBlock:(void (^)(NSString *, id <NSCoding>))block {
    [self objectForKeyAsync:key completion:^(id <PINCaching> cache, NSString *key, id object) {
        block(key, object);
    }];
}

- (void)removeObjectForKey:(NSString *)key withBlock:(void (^)(NSString *))block {
    [self removeObjectForKeyAsync:key completion:^(id <PINCaching> cache, NSString *key, id object) {
        block(key);
    }];
}

- (void)removeAllObjectsWithBlock:(void (^)(void))block {
    [self removeAllObjectsAsync:^(id <PINCaching> cache) {
        block();
    }];
}
@end

#elif __has_include(<YYCache/YYCache.h>)

#import <YYCache/YYCache.h>

@interface DoricCache : YYCache
- (instancetype)initWithName:(NSString *)prefix rootPath:(NSString *)path;
@end

@implementation DoricCache
- (instancetype)initWithName:(NSString *)prefix rootPath:(NSString *)path {
    return [self initWithPath:[path
            stringByAppendingPathComponent:prefix]];
}
@end

#elif __has_include(<TMCache/TMCache.h>)

#import <TMCache/TMCache.h>

@interface DoricCache : TMCache
- (void)setObject:(NSString *)value forKey:(NSString *)key withBlock:(void (^)())block;

- (void)objectForKey:(NSString *)key withBlock:(void (^)(NSString *, id <NSCoding>))block;

- (void)removeObjectForKey:(NSString *)key withBlock:(void (^)(NSString *))block;

- (void)removeAllObjectsWithBlock:(void (^)())pFunction;
@end

@implementation DoricCache

- (void)setObject:(NSString *)value forKey:(NSString *)key withBlock:(void (^)())block {
    [self setObject:value forKey:key block:^(TMCache *cache, NSString *key, id object) {
        block();
    }];
}

- (void)objectForKey:(NSString *)key withBlock:(void (^)(NSString *, id <NSCoding>))block {
    [self objectForKey:key block:^(TMCache *cache, NSString *key, id object) {
        block(key, object);
    }];
}

- (void)removeObjectForKey:(NSString *)key withBlock:(void (^)(NSString *))block {
    [self removeObjectForKey:key block:^(TMCache *cache, NSString *key, id object) {
        block(key);
    }];
}

- (void)removeAllObjectsWithBlock:(void (^)())block {
    [self removeAllObjects:^(TMCache *cache) {
        block();
    }];
}
@end

#else

@interface DoricCache : NSObject
- (instancetype)initWithName:(NSString *)prefix rootPath:(NSString *)path;

- (void)setObject:(NSString *)value forKey:(NSString *)key withBlock:(void (^)())block;

- (void)objectForKey:(NSString *)key withBlock:(void (^)(NSString *, id <NSCoding>))block;

- (void)removeObjectForKey:(NSString *)key withBlock:(void (^)(NSString *))block;

- (void)removeAllObjectsWithBlock:(void (^)())pFunction;
@end

@implementation DoricCache
- (instancetype)initWithName:(NSString *)prefix rootPath:(NSString *)path {
    return [self init];
}

- (void)setObject:(NSString *)value forKey:(NSString *)key withBlock:(void (^)())block {
}

- (void)objectForKey:(NSString *)key withBlock:(void (^)(NSString *, id <NSCoding>))block {
}

- (void)removeObjectForKey:(NSString *)key withBlock:(void (^)(NSString *))block {
}

- (void)removeAllObjectsWithBlock:(void (^)())block {
}
@end

#endif


static NSString *doric_prefix = @"pref";

@interface DoricStoragePlugin ()
@property(atomic, strong) NSMutableDictionary <NSString *, DoricCache *> *cachedMap;
@property(nonatomic, strong) DoricCache *defaultCache;
@property(nonatomic, copy) NSString *basePath;
@end

@implementation DoricStoragePlugin
- (instancetype)initWithContext:(DoricContext *)doricContext {
    if (self = [super initWithContext:doricContext]) {
        _basePath = [[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject]
                stringByAppendingPathComponent:@"doric"];
        _cachedMap = [NSMutableDictionary new];
    }
    return self;
}

- (DoricCache *)defaultCache {
    if (!_defaultCache) {
        _defaultCache = [[DoricCache alloc] initWithName:doric_prefix rootPath:self.basePath];
    }
    return _defaultCache;
}

- (DoricCache *)getDiskCache:(NSString *)zone {
    DoricCache *diskCache;
    if (zone) {
        diskCache = self.cachedMap[zone];
        if (!diskCache) {
            diskCache = [DoricSingleton.instance.storageCaches objectForKey:zone];
            if (!diskCache) {
                diskCache = [[DoricCache alloc] initWithName:[NSString stringWithFormat:@"%@_%@", doric_prefix, zone]
                                                    rootPath:self.basePath];
                [DoricSingleton.instance.storageCaches setObject:diskCache forKey:zone];
            }
            self.cachedMap[zone] = diskCache;
        }
    } else {
        diskCache = self.defaultCache;
    }
    return diskCache;
}

- (void)setItem:(NSDictionary *)argument withPromise:(DoricPromise *)promise {
    NSString *zone = [argument optString:@"zone"];
    NSString *key = [argument optString:@"key"];
    NSString *value = [argument optString:@"value"];
    DoricCache *diskCache = [self getDiskCache:zone];
    [diskCache setObject:value forKey:key withBlock:^{
        [promise resolve:nil];
    }];
}

- (void)getItem:(NSDictionary *)argument withPromise:(DoricPromise *)promise {
    NSString *zone = [argument optString:@"zone"];
    NSString *key = [argument optString:@"key"];
    DoricCache *diskCache = [self getDiskCache:zone];
    [diskCache objectForKey:key withBlock:^(NSString *_Nonnull key, id <NSCoding> _Nullable object) {
        [promise resolve:object];
    }];
}

- (void)remove:(NSDictionary *)argument withPromise:(DoricPromise *)promise {
    NSString *zone = [argument optString:@"zone"];
    NSString *key = [argument optString:@"key"];
    DoricCache *diskCache = [self getDiskCache:zone];
    [diskCache removeObjectForKey:key withBlock:^(NSString *key) {
        [promise resolve:nil];
    }];
}

- (void)clear:(NSDictionary *)argument withPromise:(DoricPromise *)promise {
    NSString *zone = [argument optString:@"zone"];
    DoricCache *diskCache = [self getDiskCache:zone];
    [diskCache removeAllObjectsWithBlock:^{
        [promise resolve:nil];
    }];
}
@end
