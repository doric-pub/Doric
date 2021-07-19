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
//  DoricPerformanceProfile.h
//  DoricCore
//
//  Created by pengfei.zhou on 2021/3/29.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@protocol DoricPerformanceAnchorHookProtocol <NSObject>
- (void)onAnchorName:(NSString *)name
             prepare:(NSNumber *)prepare
               start:(NSNumber *)start
                 end:(NSNumber *)end;
@end


@interface DoricPerformanceProfile : NSObject
@property(nonatomic, strong) NSMutableDictionary <NSString *, NSNumber *> *anchorMap;

- (instancetype)initWithName:(NSString *)name;

- (void)prepare:(NSString *)anchorName;

- (void)start:(NSString *)anchorName;

- (void)end:(NSString *)anchorName;

- (void)addAnchorHook:(id <DoricPerformanceAnchorHookProtocol>)hook;

- (void)removeAnchorHook:(id <DoricPerformanceAnchorHookProtocol>)hook;

- (void)enable:(bool)enable;
@end

NS_ASSUME_NONNULL_END
