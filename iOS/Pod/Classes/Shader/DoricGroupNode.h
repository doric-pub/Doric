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
//  DoricGroupNode.h
//  Doric
//
//  Created by pengfei.zhou on 2019/7/30.
//

#import "DoricViewNode.h"

NS_ASSUME_NONNULL_BEGIN

@interface DoricGroupNode <V:UIView *, P:LayoutParams *> : DoricViewNode<V>

@property(nonatomic, strong) NSMutableDictionary *children;
@property(nonatomic, strong) NSMutableArray *indexedChildren;

@property(nonatomic) CGFloat desiredWidth;
@property(nonatomic) CGFloat desiredHeight;

- (void)blendChild:(DoricViewNode *)child layoutConfig:(NSDictionary *)layoutconfig;

- (P)generateDefaultLayoutParams;
@end

NS_ASSUME_NONNULL_END
