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
//  DoricViewNode.h
//  Doric
//
//  Created by pengfei.zhou on 2019/7/30.
//

#import "DoricContextHolder.h"
#import "DoricLayouts.h"
#import "UIView+Doric.h"

@class DoricSuperNode;

@interface DoricViewNode <V:UIView *> : DoricContextHolder

@property(nonatomic, strong) V view;
@property(nonatomic, weak) DoricSuperNode *superNode;
@property(nonatomic) NSInteger index;

@property(nonatomic, copy) NSString *viewId;

@property(nonatomic, copy) NSString *type;

@property(nonatomic, readonly) NSArray<NSString *> *idList;

- (void)initWithSuperNode:(DoricSuperNode *)superNode;

- (V)build;

- (void)blend:(NSDictionary *)props;

- (void)blendView:(V)view forPropName:(NSString *)name propValue:(id)prop;

- (DoricAsyncResult *)callJSResponse:(NSString *)funcId, ...;

+ (__kindof DoricViewNode *)create:(DoricContext *)context withType:(NSString *)type;

- (void)requestLayout;

- (void)blendLayoutConfig:(NSDictionary *)params;

- (void)afterBlended:(NSDictionary *)props;
@end
