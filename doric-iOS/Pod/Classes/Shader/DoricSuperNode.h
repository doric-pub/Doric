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
// Created by pengfei.zhou on 2019/11/15.
//

#import <Foundation/Foundation.h>
#import "DoricViewNode.h"

@interface DoricSuperNode<V:UIView *> : DoricViewNode<V>
@property(nonatomic, assign) BOOL reusable;

- (void)blendSubNode:(DoricViewNode *)subNode layoutConfig:(NSDictionary *)layoutConfig;

- (void)blendSubNode:(NSDictionary *)subModel;

- (NSDictionary *)subModelOf:(NSString *)viewId;

- (void)setSubModel:(NSDictionary *)model in:(NSString *)viewId;

- (void)clearSubModel;

- (void)removeSubModel:(NSString *)viewId;

- (DoricViewNode *)subNodeWithViewId:(NSString *)viewId;

- (void)recursiveMixin:(NSDictionary *)srcModel to:(NSMutableDictionary *)targetModel;

- (NSArray *)getSubNodeViewIds;

- (void)subNodeContentChanged:(DoricViewNode *)subNode;
@end
