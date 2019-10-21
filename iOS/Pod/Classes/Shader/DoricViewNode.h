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
#import "DoricViewContainer.h"

#import "UIView+Doric.h"

NS_ASSUME_NONNULL_BEGIN
@class DoricGroupNode;

@interface DoricViewNode <V:UIView *> : DoricContextHolder

@property(nonatomic, strong) V view;

@property(nonatomic, weak) DoricGroupNode *parent;
@property(nonatomic) NSInteger index;

@property(nonatomic, strong) NSString *viewId;

@property(nonatomic, strong) LayoutParams *layoutParams;

@property(nonatomic, strong, readonly) NSArray<NSString *> *idList;


@property(nonatomic) CGFloat x;
@property(nonatomic) CGFloat y;
@property(nonatomic) CGFloat width;
@property(nonatomic) CGFloat height;
@property(nonatomic) CGFloat centerX;
@property(nonatomic) CGFloat centerY;
@property(nonatomic) CGFloat top;
@property(nonatomic) CGFloat left;
@property(nonatomic) CGFloat right;
@property(nonatomic) CGFloat bottom;
@property(nonatomic, readonly) CGFloat measuredWidth;
@property(nonatomic, readonly) CGFloat measuredHeight;

- (V)build:(NSDictionary *)props;

- (void)blend:(NSDictionary *)props;

- (void)blendView:(V)view forPropName:(NSString *)name propValue:(id)prop;

- (void)callJSResponse:(NSString *)funcId, ...;

- (void)measureByParent:(DoricGroupNode *)parent;

- (void)layoutByParent:(DoricGroupNode *)parent;

+ (DoricViewNode *)create:(DoricContext *)context withType:(NSString *)type;

- (void)requestLayout;
@end

NS_ASSUME_NONNULL_END
