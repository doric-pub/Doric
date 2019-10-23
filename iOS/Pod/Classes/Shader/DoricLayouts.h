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


struct DoricMargin {
    CGFloat left;
    CGFloat right;
    CGFloat top;
    CGFloat bottom;
};
typedef struct DoricMargin DoricMargin;

DoricMargin DoricMarginMake(CGFloat left, CGFloat top, CGFloat right, CGFloat bottom);

typedef NS_ENUM(NSInteger, DoricLayoutSpec) {
    DoricLayoutExact,
    DoricLayoutWrapContent,
    DoricLayoutAtMost,
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

@interface DoricLayoutConfig : NSObject
@property(nonatomic, assign) DoricLayoutSpec widthSpec;
@property(nonatomic, assign) DoricLayoutSpec heightSpec;
@property(nonatomic, assign) DoricGravity alignment;

- (instancetype)init;

- (instancetype)initWithWidth:(DoricLayoutSpec)width height:(DoricLayoutSpec)height;

@end

@interface DoricStackConfig : DoricLayoutConfig
@end

@interface DoricMarginConfig : DoricLayoutConfig
@property(nonatomic) DoricMargin margin;

- (instancetype)initWithWidth:(DoricLayoutSpec)width height:(DoricLayoutSpec)height margin:(DoricMargin)margin;
@end

@interface DoricLinearConfig : DoricMarginConfig
@property(nonatomic, assign) NSUInteger weight;
@end


@interface DoricLayoutContainer <T :DoricLayoutConfig *> : UIView

- (T)configForChild:(__kindof UIView *)child;

- (void)layout;

- (void)requestLayout;
@end

@interface DoricStackView : DoricLayoutContainer<DoricStackConfig *>
@property(nonatomic, assign) DoricGravity gravity;
@end

@interface DoricLinearView : DoricLayoutContainer<DoricLinearConfig *>
@property(nonatomic, assign) DoricGravity gravity;
@property(nonatomic, assign) CGFloat space;
@end


@interface DoricVLayoutView : DoricLinearView
@end

@interface DoricHLayoutView : DoricLinearView
@end

@interface UIView (DoricLayoutConfig)
@property(nonatomic, strong) DoricLayoutConfig *layoutConfig;
@property(nonatomic, copy) NSString *tagString;

- (UIView *)viewWithTagString:(NSString *)tagString;
@end
