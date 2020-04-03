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
#import <CoreGraphics/CoreGraphics.h>
#import <UIKit/UIKit.h>

typedef UIEdgeInsets DoricMargin;
typedef UIEdgeInsets DoricPadding;

DoricMargin DoricMarginMake(CGFloat left, CGFloat top, CGFloat right, CGFloat bottom);


typedef NS_ENUM(NSInteger, DoricLayoutType) {
    DoricUndefined = 0,
    DoricStack = 1,
    DoricVLayout = 2,
    DoricHLayout = 3,
};

typedef NS_ENUM(NSInteger, DoricLayoutSpec) {
    DoricLayoutJust = 0,
    DoricLayoutFit = 1,
    DoricLayoutMost = 2,
};

typedef NS_ENUM(NSInteger, DoricGravity) {
    DoricGravitySpecified = 1,
    DoricGravityStart = 1 << 1,
    DoricGravityEnd = 1 << 2,
    DoricGravityShiftX = 0,
    DoricGravityShiftY = 4,
    DoricGravityLeft = (DoricGravityStart | DoricGravitySpecified) << DoricGravityShiftX,
    DoricGravityRight = (DoricGravityEnd | DoricGravitySpecified) << DoricGravityShiftX,
    DoricGravityTop = (DoricGravityStart | DoricGravitySpecified) << DoricGravityShiftY,
    DoricGravityBottom = (DoricGravityEnd | DoricGravitySpecified) << DoricGravityShiftY,
    DoricGravityCenterX = DoricGravitySpecified << DoricGravityShiftX,
    DoricGravityCenterY = DoricGravitySpecified << DoricGravityShiftY,
    DoricGravityCenter = DoricGravityCenterX | DoricGravityCenterY,
};

@interface DoricLayout : NSObject
@property(nonatomic, assign) DoricLayoutSpec widthSpec;
@property(nonatomic, assign) DoricLayoutSpec heightSpec;

@property(nonatomic, assign) DoricGravity alignment;

@property(nonatomic, assign) DoricGravity gravity;

@property(nonatomic, assign) CGFloat width;
@property(nonatomic, assign) CGFloat height;
@property(nonatomic, assign) CGFloat x;
@property(nonatomic, assign) CGFloat y;

@property(nonatomic, assign) CGFloat spacing;

@property(nonatomic, assign) CGFloat marginLeft;
@property(nonatomic, assign) CGFloat marginTop;
@property(nonatomic, assign) CGFloat marginRight;
@property(nonatomic, assign) CGFloat marginBottom;

@property(nonatomic, assign) CGFloat paddingLeft;
@property(nonatomic, assign) CGFloat paddingTop;
@property(nonatomic, assign) CGFloat paddingRight;
@property(nonatomic, assign) CGFloat paddingBottom;

@property(nonatomic, assign) NSUInteger weight;

@property(nonatomic, weak) UIView *view;

@property(nonatomic, assign) DoricLayoutType layoutType;

@property(nonatomic, assign) BOOL disabled;

- (instancetype)init;

- (void)apply;
@end


@interface UIView (DoricLayout)
@property(nonatomic, strong) DoricLayout *doricLayout;
@end