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

#import <Foundation/Foundation.h>


@interface NSObject (Doric)
- (id)apply:(id (^)(id it))block;

- (instancetype)also:(void (^)(id it))block;

- (void)let:(void (^)(id it))block;
@end

@interface NSArray <ObjectType> (Doric)
- (void)forEachIndexed:(void (NS_NOESCAPE ^)(ObjectType obj, NSUInteger idx))block;

- (NSArray *)mapIndexed:(id (NS_NOESCAPE ^)(ObjectType obj, NSUInteger idx))block;

- (NSArray *)flatMapIndexed:(NSArray *(NS_NOESCAPE ^)(ObjectType obj, NSUInteger idx))block;

- (NSArray *)filterIndexed:(BOOL (NS_NOESCAPE ^)(ObjectType obj, NSUInteger idx))block;

- (void)forEach:(void (NS_NOESCAPE ^)(ObjectType obj))block;

- (NSArray *)map:(id (NS_NOESCAPE ^)(ObjectType obj))block;

- (NSArray *)flatMap:(NSArray *(NS_NOESCAPE ^)(ObjectType obj))block;

- (NSArray <ObjectType> *)filter:(BOOL (NS_NOESCAPE ^)(ObjectType obj))block;
@end