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

typedef NS_ENUM(NSInteger, DoricLayoutSpec) {
    DoricLayoutExact = 0,
    DoricLayoutWrapContent = 1,
    DoricLayoutAtMost = 2,
};

typedef NS_ENUM(NSInteger, DoricGravity) {
    DoricGravitySpecified = 1,
    DoricGravityStart = 1 << 1,
    DoricGravityEnd = 1 << 2,
    DoricGravityShiftX = 0,
    DoricGravityShiftY = 4,
    DoricGravityLeft = (DoricGravityStart | DoricGravitySpecified) << DoricGravityShiftX,
    DoricGravityRight = (DoricGravityEnd | DoricGravitySpecified) << DoricGravityShiftX,
    DoricTOP = (DoricGravityStart | DoricGravitySpecified) << DoricGravityShiftY,
    DoricBottom = (DoricGravityEnd | DoricGravitySpecified) << DoricGravityShiftY,
    DoricCenterX = DoricGravitySpecified << DoricGravityShiftX,
    DoricCenterY = DoricGravitySpecified << DoricGravityShiftY,
    DoricCenter = DoricCenterX | DoricCenterY,
};

@interface DoricLayoutConfig : NSObject
@property(nonatomic, assign) DoricLayoutSpec widthSpec;
@property(nonatomic, assign) DoricLayoutSpec heightSpec;
@property(nonatomic) DoricMargin margin;
@property(nonatomic, assign) DoricGravity alignment;
@property(nonatomic, assign) NSUInteger weight;

- (instancetype)init;

- (instancetype)initWithWidth:(DoricLayoutSpec)width height:(DoricLayoutSpec)height;

- (instancetype)initWithWidth:(DoricLayoutSpec)width height:(DoricLayoutSpec)height margin:(DoricMargin)margin;

@end


@interface DoricLayoutContainer : UIView
@end

@interface DoricStackView : DoricLayoutContainer
@end

@interface DoricLinearView : DoricLayoutContainer
@property(nonatomic, assign) DoricGravity gravity;
@property(nonatomic, assign) CGFloat space;
@end


@interface DoricVLayoutView : DoricLinearView
@end

@interface DoricHLayoutView : DoricLinearView
@end

@interface UIView (DoricLayoutConfig)
@property(nonatomic, strong) DoricLayoutConfig *layoutConfig;
@end

@interface UIView (DoricPadding)
@property(nonatomic, assign) DoricPadding padding;
@end

@interface UIView (DoricTag)
@property(nonatomic, copy) NSString *tagString;

- (UIView *)viewWithTagString:(NSString *)tagString;
@end

@interface UIView (DoricLayouts)
- (void)layoutSelf:(CGSize)targetSize;

- (CGSize)measureSize:(CGSize)targetSize;

- (void)doricLayoutSubviews;

- (BOOL)requestFromSubview:(UIView *)subview;
@end
