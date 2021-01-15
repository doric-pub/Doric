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
// Created by pengfei.zhou on 2019/10/23.
//

#import "DoricExtensions.h"

@implementation NSObject (Doric)
- (id)apply:(id (NS_NOESCAPE ^)(id it))block {
    return block(self);
}

- (instancetype)also:(void (NS_NOESCAPE ^)(id it))block {
    block(self);
    return self;
}

- (void)let:(void (NS_NOESCAPE ^)(id it))block {
    block(self);
}
@end

@implementation NSArray (Doric)
- (void)forEachIndexed:(void (NS_NOESCAPE ^)(id obj, NSUInteger idx))block {
    [self enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
        block(obj, idx);
    }];
}

- (NSArray *)mapIndexed:(id (NS_NOESCAPE ^)(id obj, NSUInteger idx))block {
    NSMutableArray *temp = [NSMutableArray new];
    [self enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
        [temp addObject:block(obj, idx)];
    }];
    return [temp copy];
}

- (NSArray *)flatMapIndexed:(NSArray *(NS_NOESCAPE ^)(id obj, NSUInteger idx))block {
    NSMutableArray *temp = [NSMutableArray new];
    [self enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
        [temp addObjectsFromArray:block(obj, idx)];
    }];
    return [temp copy];
}

- (NSArray *)filterIndexed:(BOOL (NS_NOESCAPE ^)(id obj, NSUInteger idx))block {
    NSMutableArray *temp = [NSMutableArray new];
    [self enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
        if (block(obj, idx)) {
            [temp addObject:obj];
        }
    }];
    return [temp copy];
}

- (void)forEach:(void (NS_NOESCAPE ^)(id obj))block {
    for (id obj in self) {
        block(obj);
    }
}

- (NSArray *)map:(id (NS_NOESCAPE ^)(id obj))block {
    NSMutableArray *temp = [NSMutableArray new];
    for (id obj in self) {
        [temp addObject:block(obj)];
    }
    return [temp copy];
}

- (NSArray *)flatMap:(NSArray *(NS_NOESCAPE ^)(id obj))block {
    NSMutableArray *temp = [NSMutableArray new];
    for (id obj in self) {
        [temp addObjectsFromArray:block(obj)];
    }
    return [temp copy];
}

- (NSArray *)filter:(BOOL (NS_NOESCAPE ^)(id obj))block {
    NSMutableArray *temp = [NSMutableArray new];
    for (id obj in self) {
        if (block(obj)) {
            [temp addObject:obj];
        }
    }
    return [temp copy];
}

@end
