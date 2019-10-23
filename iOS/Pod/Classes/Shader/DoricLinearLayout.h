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


struct Margin {
    CGFloat left;
    CGFloat right;
    CGFloat top;
    CGFloat bottom;
};
typedef struct Margin Margin;

Margin MarginMake(CGFloat left, CGFloat top, CGFloat right, CGFloat bottom);

typedef NS_ENUM(NSInteger, LayoutParam) {
    LayoutParamExact,
    LayoutParamWrapContent,
    LayoutParamAtMost,
};

typedef NS_ENUM(NSInteger, DoricGravity) {
    SPECIFIED = 1,
    START = 1 << 1,
    END = 1 << 2,
    SHIFT_X = 0,
    SHIFT_Y = 4,
    LEFT = (START | SPECIFIED) << SHIFT_X,
    RIGHT = (END | SPECIFIED) << SHIFT_X,
    TOP = (START | SPECIFIED) << SHIFT_Y,
    BOTTOM = (END | SPECIFIED) << SHIFT_Y,
    CENTER_X = SPECIFIED << SHIFT_X,
    CENTER_Y = SPECIFIED << SHIFT_Y,
    CENTER = CENTER_X | CENTER_Y,
};

@interface LayoutConfig : NSObject
@property(nonatomic, assign) LayoutParam widthSpec;
@property(nonatomic, assign) LayoutParam heightSpec;
@property(nonatomic, assign) DoricGravity alignment;

- (instancetype)init;

- (instancetype)initWithWidth:(LayoutParam)width height:(LayoutParam)height;

@end

@interface StackLayoutConfig : LayoutConfig
@end

@interface MarginLayoutConfig : LayoutConfig
@property(nonatomic) Margin margin;

- (instancetype)initWithWidth:(LayoutParam)width height:(LayoutParam)height margin:(Margin)margin;
@end

@interface LinearLayoutConfig : MarginLayoutConfig
@property(nonatomic, assign) NSUInteger weight;
@end


@interface LayoutContainer <T :LayoutConfig *> : UIView

- (T)configForChild:(__kindof UIView *)child;

- (void)layout;

- (void)requestLayout;
@end

@interface Stack : LayoutContainer<StackLayoutConfig *>
@property(nonatomic, assign) DoricGravity gravity;
@end

@interface LinearLayout : LayoutContainer<LinearLayoutConfig *>
@property(nonatomic, assign) DoricGravity gravity;
@property(nonatomic, assign) CGFloat space;
@end


@interface VLayout : LinearLayout
@end

@interface HLayout : LinearLayout
@end

@interface UIView (LayoutConfig)
@property(nonatomic, strong) LayoutConfig *layoutConfig;
@property(nonatomic, copy) NSString *tagString;

- (UIView *)viewWithTagString:(NSString *)tagString;
@end

VLayout *vLayout(NSArray <__kindof UIView *> *views);

HLayout *hLayout(NSArray <__kindof UIView *> *views);

VLayout *vLayoutWithBlock(NSArray <UIView *(^)()> *blocks);

HLayout *hLayoutWithBlock(NSArray <UIView *(^)()> *blocks);
