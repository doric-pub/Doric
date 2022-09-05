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

#import "DoricLayouts.h"
#import <objc/runtime.h>
#import "UIView+Doric.h"
#import "DoricExtensions.h"
#import <YogaKit/UIView+Yoga.h>
#import <QuartzCore/QuartzCore.h>
#import <yoga/Yoga.h>

@interface YGLayout ()
@property (nonatomic, assign, readonly) YGNodeRef node;
@end

void DoricAddEllipticArcPath(CGMutablePathRef path,
        CGPoint origin,
        CGFloat radius,
        CGFloat startAngle,
        CGFloat endAngle) {
    CGAffineTransform t = CGAffineTransformMakeTranslation(origin.x, origin.y);
    CGPathAddArc(path, &t, 0, 0, radius, startAngle, endAngle, NO);
}


CGPathRef DoricCreateRoundedRectPath(CGRect bounds,
        CGFloat leftTop,
        CGFloat rightTop,
        CGFloat rightBottom,
        CGFloat leftBottom) {
    const CGFloat minX = CGRectGetMinX(bounds);
    const CGFloat minY = CGRectGetMinY(bounds);
    const CGFloat maxX = CGRectGetMaxX(bounds);
    const CGFloat maxY = CGRectGetMaxY(bounds);

    CGMutablePathRef path = CGPathCreateMutable();
    DoricAddEllipticArcPath(path, (CGPoint) {
            minX + leftTop, minY + leftTop
    }, leftTop, M_PI, 3 * M_PI_2);
    DoricAddEllipticArcPath(path, (CGPoint) {
            maxX - rightTop, minY + rightTop
    }, rightTop, 3 * M_PI_2, 0);
    DoricAddEllipticArcPath(path, (CGPoint) {
            maxX - rightBottom, maxY - rightBottom
    }, rightBottom, 0, M_PI_2);
    DoricAddEllipticArcPath(path, (CGPoint) {
            minX + leftBottom, maxY - leftBottom
    }, leftBottom, M_PI_2, M_PI);
    CGPathCloseSubpath(path);
    return path;
}

static const void *kLayoutConfig = &kLayoutConfig;

@interface DoricShapeLayer : CAShapeLayer
@property CGRect viewBounds;
@property UIEdgeInsets corners;
@end

@implementation DoricShapeLayer
@end

@implementation UIView (DoricLayout)
@dynamic doricLayout;

- (void)setDoricLayout:(DoricLayout *)doricLayout {
    objc_setAssociatedObject(self, kLayoutConfig, doricLayout, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (DoricLayout *)doricLayout {
    DoricLayout *layout = objc_getAssociatedObject(self, kLayoutConfig);
    if (!layout) {
        layout = [DoricLayout new];
        layout.width = self.width;
        layout.height = self.height;
        layout.view = self;
        self.doricLayout = layout;
    }
    return layout;
}

@end

struct DoricSizeAndState {
    NSUInteger state;
    CGFloat size;
};

typedef struct DoricSizeAndState DoricSizeAndState;

DoricMeasureSpec DoricMeasureSpecMake(DoricMeasureSpecMode mode, CGFloat size) {
    DoricMeasureSpec spec;
    spec.mode = mode;
    spec.size = size;
    return spec;
}

NSUInteger DORIC_MEASURED_STATE_MASK = 0x11;

NSUInteger DORIC_MEASURED_HEIGHT_STATE_SHIFT = 8;

NSUInteger DORIC_MEASURED_STATE_TOO_SMALL = 0x01;

@interface DoricLayout ()
/**
 * width-height
 * 0xff--ff
 * */
@property(nonatomic, assign) NSUInteger measuredState;
@property(nonatomic, strong) NSMutableDictionary *measuredCache;
@end

@implementation DoricLayout
- (instancetype)init {
    if (self = [super init]) {
        _widthSpec = DoricLayoutJust;
        _heightSpec = DoricLayoutJust;
        _maxWidth = CGFLOAT_MAX;
        _maxHeight = CGFLOAT_MAX;
        _minWidth = -1;
        _minHeight = -1;
        _measuredState = 0;
        _measuredCache = [NSMutableDictionary new];
    }
    return self;
}

- (void)setMeasuredWidth:(CGFloat)measuredWidth {
    _measuredWidth = MAX(0, measuredWidth);
}

- (void)setMeasuredHeight:(CGFloat)measuredHeight {
    _measuredHeight = MAX(0, measuredHeight);
}

- (void)apply:(CGSize)frameSize {
    self.resolved = NO;
    [self measure:frameSize];
    [self setFrame];
    self.resolved = YES;
}

- (void)apply {
    [self apply:self.view.frame.size];
}

- (void)measure:(CGSize)targetSize {
    [self doMeasure:targetSize];
    [self layout];
}

- (DoricMeasureSpec)getRootMeasureSpec:(CGFloat)targetSize
                            layoutSpec:(DoricLayoutSpec)spec
                                  size:(CGFloat)size {

    switch (spec) {
        case DoricLayoutMost:
            return DoricMeasureSpecMake(DoricMeasureExactly, targetSize);
        case DoricLayoutFit:
            if ([self.view.superview isKindOfClass:UIScrollView.class]) {
                return DoricMeasureSpecMake(DoricMeasureUnspecified, 0);
            }
            return DoricMeasureSpecMake(DoricMeasureAtMost, targetSize);
        default:
            return DoricMeasureSpecMake(DoricMeasureExactly, size);
    }

}

- (void)doMeasure:(CGSize)targetSize {
    DoricMeasureSpec widthSpec = [self getRootMeasureSpec:targetSize.width
                                               layoutSpec:self.widthSpec
                                                     size:self.width];
    DoricMeasureSpec heightSpec = [self getRootMeasureSpec:targetSize.height
                                                layoutSpec:self.heightSpec
                                                      size:self.height];
    [self measureWidth:widthSpec
                height:heightSpec];
}

#pragma helper

- (CGFloat)takenWidth {
    return self.measuredWidth + self.marginLeft + self.marginRight;
}

- (CGFloat)takenHeight {
    return self.measuredHeight + self.marginTop + self.marginBottom;
}


- (BOOL)rect:(CGRect)rect1 equalTo:(CGRect)rect2 {
    return ABS(rect1.origin.x - rect2.origin.x) < 0.00001f
            && ABS(rect1.origin.y - rect2.origin.y) < 0.00001f
            && ABS(rect1.size.width - rect2.size.width) < 0.00001f
            && ABS(rect1.size.height - rect2.size.height) < 0.00001f;
}

- (NSString *)getLayoutType {
    switch (self.layoutType) {
        case DoricVLayout:
            return @"VLayout";
        case DoricHLayout:
            return @"HLayout";
        case DoricStack:
            return @"Stack";
        default:
            return [NSString stringWithFormat:@"Undefined:%@", self.view.class];
    }
}


- (NSString *)getSpecType:(DoricLayoutSpec)spec {
    switch (spec) {
        case DoricLayoutJust:
            return @"JUST";
        case DoricLayoutMost:
            return @"MOST";
        default:
            return @"FIT";
    }
}

- (NSString *)toString {
    return [NSString stringWithFormat:@"%@[width:%@,height:%@]",
                                      [self getLayoutType],
                                      [self getSpecType:self.widthSpec],
                                      [self getSpecType:self.heightSpec]
    ];
}

#pragma measure

- (DoricMeasureSpec)getChildMeasureSpec:(DoricMeasureSpec)spec
                                padding:(CGFloat)padding
                        childLayoutSpec:(DoricLayoutSpec)childLayoutSpec
                              childSize:(CGFloat)childSize {
    DoricMeasureSpecMode specMode = spec.mode;
    CGFloat specSize = spec.size;
    CGFloat size = MAX(0, specSize - padding);

    CGFloat resultSize = 0;
    DoricMeasureSpecMode resultMode = DoricMeasureUnspecified;
    switch (specMode) {
        // Parent has imposed an exact size on us
        case DoricMeasureExactly:
            if (childLayoutSpec == DoricLayoutJust) {
                resultSize = childSize;
                resultMode = DoricMeasureExactly;
            } else if (childLayoutSpec == DoricLayoutMost) {
                // Child wants to be our size. So be it.
                resultSize = size;
                resultMode = DoricMeasureExactly;
            } else if (childLayoutSpec == DoricLayoutFit) {
                // Child wants to determine its own size. It can't be
                // bigger than us.
                resultSize = size;
                resultMode = DoricMeasureAtMost;
            }
            break;
            // Parent has imposed a maximum size on us
        case DoricMeasureAtMost:
            if (childLayoutSpec == DoricLayoutJust) {
                // Child wants a specific size... so be it
                resultSize = childSize;
                resultMode = DoricMeasureExactly;
            } else if (childLayoutSpec == DoricLayoutMost) {
                // Child wants to be our size, but our size is not fixed.
                // Constrain child to not be bigger than us.
                resultSize = size;
                resultMode = DoricMeasureAtMost;
            } else if (childLayoutSpec == DoricLayoutFit) {
                // Child wants to determine its own size. It can't be
                // bigger than us.
                resultSize = size;
                resultMode = DoricMeasureAtMost;
            }
            break;
            // Parent asked to see how big we want to be
        case DoricMeasureUnspecified:
            if (childLayoutSpec == DoricLayoutJust) {
                // Child wants a specific size... let them have it
                resultSize = childSize;
                resultMode = DoricMeasureExactly;
            } else if (childLayoutSpec == DoricLayoutMost) {
                // Child wants to be our size... find out how big it should
                // be
                resultSize = size;
                resultMode = DoricMeasureUnspecified;
            } else if (childLayoutSpec == DoricLayoutFit) {
                // Child wants to determine its own size. It can't be
                // bigger than us.
                resultSize = size;
                resultMode = DoricMeasureUnspecified;
            }
            break;
    }
    return DoricMeasureSpecMake(resultMode, resultSize);
}

- (void)measureChild:(DoricLayout *)child
           widthSpec:(DoricMeasureSpec)widthSpec
           usedWidth:(CGFloat)usedWidth
          heightSpec:(DoricMeasureSpec)heightSpec
          usedHeight:(CGFloat)usedHeight {

    DoricMeasureSpec childWidthSpec =
            [self getChildMeasureSpec:widthSpec
                              padding:self.paddingLeft + self.paddingRight
                                      + child.marginLeft + child.marginRight
                                      + usedWidth
                      childLayoutSpec:child.widthSpec
                            childSize:child.width];

    DoricMeasureSpec childHeightSpec =
            [self getChildMeasureSpec:heightSpec
                              padding:self.paddingTop + self.paddingBottom
                                      + child.marginTop + child.marginBottom
                                      + usedHeight
                      childLayoutSpec:child.heightSpec
                            childSize:child.height];
    [child measureWidth:childWidthSpec height:childHeightSpec];
}


- (DoricSizeAndState)resolveSizeAndState:(CGFloat)size
                                    spec:(DoricMeasureSpec)measureSpec
                      childMeasuredState:(NSUInteger)state {
    DoricSizeAndState result;
    DoricMeasureSpecMode specMode = measureSpec.mode;
    CGFloat specSize = measureSpec.size;
    result.state = 0;
    switch (specMode) {
        case DoricMeasureAtMost:
            if (specSize < size) {
                result.size = specSize;
                result.state = DORIC_MEASURED_STATE_TOO_SMALL;
            } else {
                result.size = size;
            }
            break;
        case DoricMeasureExactly:
            result.size = specSize;
            break;
        case DoricMeasureUnspecified:
        default:
            result.size = size;
            break;
    }
    result.state = result.state | (state & DORIC_MEASURED_STATE_MASK);
    return result;
}

- (CGFloat)getDefaultSize:(CGFloat)size spec:(DoricMeasureSpec)measureSpec {
    DoricMeasureSpecMode specMode = measureSpec.mode;
    CGFloat specSize = measureSpec.size;
    CGFloat result = size;
    switch (specMode) {
        case DoricMeasureUnspecified:
            result = size;
            break;
        case DoricMeasureAtMost:
        case DoricMeasureExactly:
            result = specSize;
            break;
    }
    return result;
}

- (void)forceUniformWidth:(DoricMeasureSpec)heightMeasureSpec {
    DoricMeasureSpec uniformMeasureSpec = DoricMeasureSpecMake(DoricMeasureExactly,
            self.measuredWidth);
    for (__kindof UIView *subview in self.view.subviews) {
        DoricLayout *childLayout = subview.doricLayout;
        if (childLayout.disabled) {
            continue;
        }
        if (childLayout.widthSpec == DoricLayoutMost) {
            // Temporarily force children to reuse their old measured height
            // FIXME: this may not be right for something like wrapping text?
            CGFloat oldHeight = childLayout.height;
            DoricLayoutSpec oldHeightSpec = childLayout.heightSpec;

            childLayout.height = childLayout.measuredHeight;
            childLayout.heightSpec = DoricLayoutJust;

            // Remeasure with new dimensions
            [self measureChild:childLayout
                     widthSpec:uniformMeasureSpec
                     usedWidth:0
                    heightSpec:heightMeasureSpec
                    usedHeight:0];

            childLayout.height = oldHeight;
            childLayout.heightSpec = oldHeightSpec;
        }
    }
}

- (void)forceUniformHeight:(DoricMeasureSpec)widthMeasureSpec {
    // Pretend that the linear layout has an exact size. This is the measured height of
    // ourselves. The measured height should be the max height of the children, changed
    // to accommodate the heightMeasureSpec from the parent
    DoricMeasureSpec uniformMeasureSpec
            = DoricMeasureSpecMake(DoricMeasureExactly, self.measuredHeight);
    for (__kindof UIView *subview in self.view.subviews) {
        DoricLayout *childLayout = subview.doricLayout;
        if (childLayout.disabled) {
            continue;
        }
        if (childLayout.heightSpec == DoricLayoutMost) {
            // Temporarily force children to reuse their old measured width
            // FIXME: this may not be right for something like wrapping text?
            CGFloat oldWidth = childLayout.width;
            DoricLayoutSpec oldWidthSpec = childLayout.widthSpec;

            childLayout.width = childLayout.measuredWidth;
            childLayout.widthSpec = DoricLayoutJust;

            // Remeasure with new dimensions
            [self measureChild:childLayout
                     widthSpec:widthMeasureSpec
                     usedWidth:0
                    heightSpec:uniformMeasureSpec
                    usedHeight:0];

            childLayout.width = oldWidth;
            childLayout.widthSpec = oldWidthSpec;
        }
    }
}

- (void)measureWidth:(DoricMeasureSpec)widthSpec height:(DoricMeasureSpec)heightSpec {
//    NSString *measuredKey = [NSString stringWithFormat:@"%@;%@;%@;%@",
//                                                       @(widthSpec.mode), @(widthSpec.size),
//                                                       @(heightSpec.mode), @(heightSpec.size)];
//
//    NSString *cached = self.measuredCache[measuredKey];
//    if (cached) {
//        NSArray <NSString *> *nums = [cached componentsSeparatedByString:@":"];
//        if (nums.count == 2) {
//            self.measuredWidth = nums[0].floatValue;
//            self.measuredHeight = nums[1].floatValue;
//            return;
//        }
//    }

    switch (self.layoutType) {
        case DoricStack: {
            [self stackMeasureWidth:widthSpec height:heightSpec];
            break;
        }
        case DoricVLayout: {
            [self verticalMeasureWidth:widthSpec height:heightSpec];
            break;
        }
        case DoricHLayout: {
            [self horizontalMeasureWidth:widthSpec height:heightSpec];
            break;
        }
        case DoricScroller: {
            [self scrollerMeasureWidth:widthSpec height:heightSpec];
            break;
        }
        case DoricFlexLayout: {
            [self flexMeasureWidth:widthSpec height:heightSpec];
            break;
        }
        default: {
            [self undefinedMeasureWidth:widthSpec height:heightSpec];
            break;
        }
    }
    if (self.measuredWidth > self.maxWidth || self.measuredHeight > self.measuredHeight) {
        [self measureWidth:DoricMeasureSpecMake(DoricMeasureAtMost,
                        MIN(self.measuredWidth, self.maxWidth))
                    height:DoricMeasureSpecMake(DoricMeasureAtMost,
                            MIN(self.measuredHeight, self.maxHeight))];
    }
//    self.measuredCache[measuredKey] = [NSString stringWithFormat:@"%@;%@",
//                                                                 @(self.measuredWidth),
//                                                                 @(self.measuredHeight)];
}

- (void)verticalMeasureWidth:(DoricMeasureSpec)widthMeasureSpec
                      height:(DoricMeasureSpec)heightMeasureSpec {
    CGFloat maxWidth = 0, totalLength = 0;
    NSUInteger totalWeight = 0;
    BOOL hadExtraSpace = NO;

    DoricMeasureSpecMode widthMode = widthMeasureSpec.mode;
    DoricMeasureSpecMode heightMode = heightMeasureSpec.mode;

    BOOL skippedMeasure = NO;
    BOOL matchWidth = NO;
    BOOL allFillParent = YES;

    CGFloat weightedMaxWidth = 0;
    CGFloat alternativeMaxWidth = 0;
    NSUInteger childState = 0;
    // See how tall everyone is. Also remember max width.

    for (__kindof UIView *subview in self.view.subviews) {
        DoricLayout *childLayout = subview.doricLayout;
        if (childLayout.disabled) {
            continue;
        }
        hadExtraSpace = YES;
        totalLength += self.spacing;
        totalWeight += childLayout.weight;

        if (heightMode == DoricMeasureExactly
                && childLayout.heightSpec == DoricLayoutJust
                && childLayout.height == 0
                && childLayout.weight > 0) {
            // Optimization: don't bother measuring children who are going to use
            // leftover space. These views will get measured again down below if
            // there is any leftover space.
            totalLength = MAX(totalLength, totalLength
                    +childLayout.marginTop + childLayout.marginBottom);
            skippedMeasure = YES;
        } else {
            CGFloat oldHeight = CGFLOAT_MIN;
            if (childLayout.heightSpec == DoricLayoutJust
                    && childLayout.height == 0
                    && childLayout.weight > 0) {
                // heightMode is either UNSPECIFIED or AT_MOST, and this
                // child wanted to stretch to fill available space.
                // Translate that to WRAP_CONTENT so that it does not end up
                // with a height of 0
                oldHeight = 0;
                childLayout.heightSpec = DoricLayoutFit;
            }

            // Determine how big this child would like to be. If this or
            // previous children have given a weight, then we allow it to
            // use all available space (and we will shrink things later
            // if needed).
            [self measureChild:childLayout
                     widthSpec:widthMeasureSpec
                     usedWidth:0
                    heightSpec:heightMeasureSpec
                    usedHeight:totalWeight == 0 ? totalLength : 0];

            if (oldHeight != CGFLOAT_MIN) {
                childLayout.heightSpec = DoricLayoutJust;
                childLayout.height = oldHeight;
            }

            CGFloat childHeight = childLayout.measuredHeight;
            totalLength = MAX(totalLength, totalLength + childHeight +
                    childLayout.marginTop + childLayout.marginBottom);
        }

        BOOL matchWidthLocally = NO;
        if (widthMode != DoricMeasureExactly && childLayout.widthSpec == DoricLayoutMost) {
            // The width of the linear layout will scale, and at least one
            // child said it wanted to match our width. Set a flag
            // indicating that we need to remeasure at least that view when
            // we know our width.
            matchWidth = YES;
            matchWidthLocally = YES;
        }

        CGFloat margin = childLayout.marginLeft + childLayout.marginRight;
        CGFloat measuredWidth = childLayout.measuredWidth + margin;
        maxWidth = MAX(maxWidth, measuredWidth);

        childState = childState | childLayout.measuredState;

        allFillParent = allFillParent && childLayout.widthSpec == DoricLayoutMost;
        if (childLayout.weight > 0) {
            /*
             * Widths of weighted Views are bogus if we end up
             * remeasuring, so keep them separate.
             */
            weightedMaxWidth
                    = MAX(weightedMaxWidth, matchWidthLocally ? margin : measuredWidth);
        } else {
            alternativeMaxWidth
                    = MAX(alternativeMaxWidth, matchWidthLocally ? margin : measuredWidth);
        }
    }

    if (hadExtraSpace) {
        totalLength -= self.spacing;
    }
    // Add in our padding
    totalLength += self.paddingTop + self.paddingBottom;

    CGFloat heightSize = totalLength;

    // Check against our minimum height
    heightSize = MAX(heightSize, self.minHeight);

    // Reconcile our calculated size with the heightMeasureSpec
    DoricSizeAndState heightSizeAndState = [self resolveSizeAndState:heightSize
                                                                spec:heightMeasureSpec
                                                  childMeasuredState:0];
    heightSize = heightSizeAndState.size;

    // Either expand children with weight to take up available space or
    // shrink them if they extend beyond our current bounds. If we skipped
    // measurement on any children, we need to measure them now.
    CGFloat delta = heightSize - totalLength;
    if (skippedMeasure || (delta != 0 && totalWeight > 0)) {
        NSUInteger weightSum = totalWeight;
        totalLength = 0;
        for (__kindof UIView *subview in self.view.subviews) {
            DoricLayout *childLayout = subview.doricLayout;
            if (childLayout.disabled) {
                continue;
            }
            NSUInteger childExtra = childLayout.weight;
            if (childExtra > 0) {
                // Child said it could absorb extra space -- give him his share
                CGFloat share = childExtra * delta / weightSum;
                weightSum -= childExtra;
                delta -= share;
                DoricMeasureSpec childWidthMeasureSpec =
                        [self getChildMeasureSpec:widthMeasureSpec
                                          padding:self.paddingLeft + self.paddingRight
                                                  + childLayout.marginLeft
                                                  + childLayout.marginRight
                                  childLayoutSpec:childLayout.widthSpec
                                        childSize:childLayout.width];
                // TODO: Use a field like lp.isMeasured to figure out if this
                // child has been previously measured
                if (!(childLayout.heightSpec == DoricLayoutJust && childLayout.height == 0)
                        || heightMode != DoricMeasureExactly) {
                    // child was measured once already above...
                    // base new measurement on stored values
                    CGFloat childHeight = childLayout.measuredHeight + share;
                    if (childHeight < 0) {
                        childHeight = 0;
                    }
                    [childLayout measureWidth:childWidthMeasureSpec
                                       height:DoricMeasureSpecMake(DoricMeasureExactly,
                                               childHeight)];
                } else {
                    // child was skipped in the loop above.
                    // Measure for this first time here
                    [childLayout measureWidth:childWidthMeasureSpec
                                       height:DoricMeasureSpecMake(DoricMeasureExactly,
                                               share > 0 ? share : 0)];
                }

                // Child may now not fit in vertical dimension.
                childState = childState | (childLayout.measuredState
                        & (DORIC_MEASURED_STATE_MASK >> DORIC_MEASURED_HEIGHT_STATE_SHIFT));
            }


            CGFloat margin = childLayout.marginLeft + childLayout.marginRight;
            CGFloat measuredWidth = childLayout.measuredWidth + margin;
            maxWidth = MAX(maxWidth, measuredWidth);

            BOOL matchWidthLocally = widthMode != DoricMeasureExactly
                    && childLayout.widthSpec == DoricLayoutMost;

            alternativeMaxWidth = MAX(alternativeMaxWidth,
                    matchWidthLocally ? margin : measuredWidth);

            allFillParent = allFillParent && childLayout.widthSpec == DoricLayoutMost;

            totalLength = MAX(totalLength, totalLength + childLayout.measuredHeight
                    + childLayout.marginTop + childLayout.marginBottom);

            totalLength += self.spacing;
        }
        if (hadExtraSpace) {
            totalLength -= self.spacing;
        }
        totalLength += self.paddingTop + self.paddingBottom;
        // TODO: Should we recompute the heightMeasureSpec based on the new total length?
    } else {
        alternativeMaxWidth = MAX(alternativeMaxWidth, weightedMaxWidth);
    };
    if (!allFillParent && widthMode != DoricMeasureExactly) {
        maxWidth = alternativeMaxWidth;
    }
    maxWidth += self.paddingLeft + self.paddingRight;

    // Check against our minimum width
    maxWidth = MAX(maxWidth, self.minWidth);

    DoricSizeAndState widthSizeAndState = [self resolveSizeAndState:maxWidth
                                                               spec:widthMeasureSpec
                                                 childMeasuredState:childState];

    self.measuredWidth = widthSizeAndState.size;

    self.measuredHeight = heightSize;

    self.measuredState = (widthSizeAndState.state
            << DORIC_MEASURED_HEIGHT_STATE_SHIFT) | heightSizeAndState.state;
    if (matchWidth) {
        [self forceUniformWidth:heightMeasureSpec];
    }
    self.totalLength = totalLength;
}


- (void)horizontalMeasureWidth:(DoricMeasureSpec)widthMeasureSpec
                        height:(DoricMeasureSpec)heightMeasureSpec {
    CGFloat maxHeight = 0, totalLength = 0;
    NSUInteger totalWeight = 0;
    BOOL hadExtraSpace = NO;

    DoricMeasureSpecMode widthMode = widthMeasureSpec.mode;
    DoricMeasureSpecMode heightMode = heightMeasureSpec.mode;

    BOOL skippedMeasure = NO;
    BOOL matchHeight = NO;
    BOOL allFillParent = YES;

    CGFloat weightedMaxHeight = 0;
    CGFloat alternativeMaxHeight = 0;
    BOOL isExactly = widthMode == DoricMeasureExactly;

    NSUInteger childState = 0;

    // See how wide everyone is. Also remember max height.
    for (__kindof UIView *subview in self.view.subviews) {
        DoricLayout *childLayout = subview.doricLayout;
        if (childLayout.disabled) {
            continue;
        }
        hadExtraSpace = YES;
        totalLength += self.spacing;
        totalWeight += childLayout.weight;

        if (widthMode == DoricMeasureExactly
                && childLayout.widthSpec == DoricLayoutJust
                && childLayout.width == 0
                && childLayout.weight > 0) {
            // Optimization: don't bother measuring children who are going to use
            // leftover space. These views will get measured again down below if
            // there is any leftover space.
            if (isExactly) {
                totalLength += childLayout.marginLeft + childLayout.marginRight;
            } else {
                totalLength = MAX(totalLength, totalLength
                        +childLayout.marginLeft + childLayout.marginRight);
            }
            skippedMeasure = YES;
        } else {
            CGFloat oldWidth = CGFLOAT_MIN;
            if (childLayout.widthSpec == DoricLayoutJust
                    && childLayout.width == 0
                    && childLayout.weight > 0) {
                // widthMode is either UNSPECIFIED or AT_MOST, and this
                // child
                // wanted to stretch to fill available space. Translate that to
                // WRAP_CONTENT so that it does not end up with a width of 0
                oldWidth = 0;
                childLayout.widthSpec = DoricLayoutFit;
            }

            // Determine how big this child would like to be. If this or
            // previous children have given a weight, then we allow it to
            // use all available space (and we will shrink things later
            // if needed).
            [self measureChild:childLayout
                     widthSpec:widthMeasureSpec
                     usedWidth:totalWeight == 0 ? totalLength : 0
                    heightSpec:heightMeasureSpec
                    usedHeight:0];

            if (oldWidth != CGFLOAT_MIN) {
                childLayout.widthSpec = DoricLayoutJust;
                childLayout.width = oldWidth;
            }

            CGFloat childWidth = childLayout.measuredWidth;
            if (isExactly) {
                totalLength += childWidth + childLayout.marginLeft + childLayout.marginRight;
            } else {
                totalLength = MAX(totalLength, totalLength + childWidth +
                        childLayout.marginLeft + childLayout.marginRight);
            }
        }

        BOOL matchHeightLocally = NO;
        if (heightMode != DoricMeasureExactly && childLayout.heightSpec == DoricLayoutMost) {
            // The height of the linear layout will scale, and at least one
            // child said it wanted to match our height. Set a flag indicating that
            // we need to remeasure at least that view when we know our height.
            matchHeight = YES;
            matchHeightLocally = YES;
        }

        CGFloat margin = childLayout.marginTop + childLayout.marginBottom;
        CGFloat childHeight = childLayout.measuredHeight + margin;

        childState = childState | childLayout.measuredState;

        maxHeight = MAX(maxHeight, childHeight);

        allFillParent = allFillParent && childLayout.heightSpec == DoricLayoutMost;

        if (childLayout.weight > 0) {
            /*
             * Heights of weighted Views are bogus if we end up
             * remeasuring, so keep them separate.
             */
            weightedMaxHeight = MAX(weightedMaxHeight, matchHeightLocally ? margin : childHeight);
        } else {
            alternativeMaxHeight = MAX(alternativeMaxHeight,
                    matchHeightLocally ? margin : childHeight);
        }
    }

    if (hadExtraSpace) {
        totalLength -= self.spacing;
    }
    // Add in our padding
    totalLength += self.paddingLeft + self.paddingRight;

    CGFloat widthSize = totalLength;

    // Check against our minimum width
    widthSize = MAX(widthSize, self.minWidth);

    // Reconcile our calculated size with the widthMeasureSpec
    DoricSizeAndState widthSizeAndState = [self resolveSizeAndState:widthSize
                                                               spec:widthMeasureSpec
                                                 childMeasuredState:0];
    widthSize = widthSizeAndState.size;

    // Either expand children with weight to take up available space or
    // shrink them if they extend beyond our current bounds. If we skipped
    // measurement on any children, we need to measure them now.
    CGFloat delta = widthSize - totalLength;
    if (skippedMeasure || (delta != 0 && totalWeight > 0)) {
        NSUInteger weightSum = totalWeight;
        totalLength = 0;
        for (__kindof UIView *subview in self.view.subviews) {
            DoricLayout *childLayout = subview.doricLayout;
            if (childLayout.disabled) {
                continue;
            }
            NSUInteger childExtra = childLayout.weight;
            if (childExtra > 0) {
                // Child said it could absorb extra space -- give him his share
                CGFloat share = childExtra * delta / weightSum;
                weightSum -= childExtra;
                delta -= share;

                DoricMeasureSpec childHeightMeasureSpec
                        = [self getChildMeasureSpec:heightMeasureSpec
                                            padding:self.paddingTop + self.paddingBottom
                                                    + childLayout.marginTop
                                                    + childLayout.marginBottom
                                    childLayoutSpec:childLayout.heightSpec
                                          childSize:childLayout.height];

                // TODO: Use a field like lp.isMeasured to figure out if this
                // child has been previously measured
                if (!(childLayout.widthSpec == DoricLayoutJust && childLayout.width == 0)
                        || widthMode != DoricMeasureExactly) {
                    // child was measured once already above ... base new measurement
                    // on stored values
                    CGFloat childWidth = childLayout.measuredWidth + share;
                    if (childWidth < 0) {
                        childWidth = 0;
                    }
                    [childLayout measureWidth:DoricMeasureSpecMake(DoricMeasureExactly, childWidth)
                                       height:childHeightMeasureSpec];
                } else {
                    // child was skipped in the loop above. Measure for this first time here
                    [childLayout measureWidth:DoricMeasureSpecMake(DoricMeasureExactly,
                                    share > 0 ? share : 0)
                                       height:childHeightMeasureSpec];
                }
                // Child may now not fit in horizontal dimension.
                childState = childState | (childLayout.measuredState & DORIC_MEASURED_STATE_MASK);
            }
            if (isExactly) {
                totalLength += childLayout.measuredWidth
                        + childLayout.marginLeft + childLayout.marginRight;
            } else {
                totalLength = MAX(totalLength, totalLength + childLayout.measuredWidth
                        + childLayout.marginLeft + childLayout.marginRight);
            }
            totalLength += self.spacing;

            BOOL matchHeightLocally = heightMode != DoricMeasureExactly
                    && childLayout.heightSpec == DoricLayoutMost;

            CGFloat margin = childLayout.marginTop + childLayout.marginBottom;

            CGFloat childHeight = childLayout.measuredHeight + margin;

            maxHeight = MAX(maxHeight, childHeight);

            alternativeMaxHeight = MAX(alternativeMaxHeight,
                    matchHeightLocally ? margin : childHeight);

            allFillParent = allFillParent && childLayout.heightSpec == DoricLayoutMost;
        }

        if (hadExtraSpace) {
            totalLength -= self.spacing;
        }

        // Add in our padding
        totalLength += self.paddingLeft + self.paddingRight;
        // TODO: Should we update widthSize with the new total length?
    } else {
        alternativeMaxHeight = MAX(alternativeMaxHeight, weightedMaxHeight);
    }

    if (!allFillParent && heightMode != DoricMeasureExactly) {
        maxHeight = alternativeMaxHeight;
    }

    maxHeight += self.paddingTop + self.paddingBottom;

    // Check against our minimum height
    maxHeight = MAX(maxHeight, self.minHeight);

    self.measuredWidth = widthSize;
    DoricSizeAndState heightSizeAndState = [self resolveSizeAndState:maxHeight
                                                                spec:heightMeasureSpec
                                                  childMeasuredState:childState
                                                          << DORIC_MEASURED_HEIGHT_STATE_SHIFT];

    self.measuredHeight = heightSizeAndState.size;

    self.measuredState = ((widthSizeAndState.state | (childState & DORIC_MEASURED_STATE_MASK))
            << DORIC_MEASURED_HEIGHT_STATE_SHIFT) | heightSizeAndState.state;

    if (matchHeight) {
        [self forceUniformHeight:widthMeasureSpec];
    }
    self.totalLength = totalLength;
}

- (void)stackMeasureWidth:(DoricMeasureSpec)widthMeasureSpec
                   height:(DoricMeasureSpec)heightMeasureSpec {
    CGFloat maxWidth = 0;
    CGFloat maxHeight = 0;
    BOOL measureMatchParentChildren = widthMeasureSpec.mode != DoricMeasureExactly
            || heightMeasureSpec.mode != DoricMeasureExactly;
    NSMutableArray *matchParentChildren = [NSMutableArray new];
    NSUInteger childState = 0;
    for (__kindof UIView *subview in self.view.subviews) {
        DoricLayout *childLayout = subview.doricLayout;
        if (childLayout.disabled) {
            continue;
        }
        [self measureChild:childLayout
                 widthSpec:widthMeasureSpec usedWidth:0
                heightSpec:heightMeasureSpec usedHeight:0];
        maxWidth = MAX(maxWidth, childLayout.measuredWidth
                + childLayout.marginLeft + childLayout.marginRight);
        maxHeight = MAX(maxHeight, childLayout.measuredHeight
                + childLayout.marginTop + childLayout.marginBottom);
        childState = childState | childLayout.measuredState;
        if (measureMatchParentChildren) {
            if (childLayout.widthSpec == DoricLayoutMost
                    || childLayout.heightSpec == DoricLayoutMost) {
                [matchParentChildren addObject:childLayout];
            }
        }
    }

    // Account for padding too
    maxWidth += self.paddingLeft + self.paddingRight;
    maxHeight += self.paddingTop + self.paddingBottom;

    // Check against our minimum height and width
    maxWidth = MAX(maxWidth, self.minWidth);
    maxHeight = MAX(maxHeight, self.minHeight);

    DoricSizeAndState widthSizeAndState = [self resolveSizeAndState:maxWidth
                                                               spec:widthMeasureSpec
                                                 childMeasuredState:childState];
    DoricSizeAndState heightSizeAndState = [self resolveSizeAndState:maxHeight
                                                                spec:heightMeasureSpec
                                                  childMeasuredState:childState
                                                          << DORIC_MEASURED_HEIGHT_STATE_SHIFT];
    self.measuredWidth = widthSizeAndState.size;
    self.measuredHeight = heightSizeAndState.size;

    self.measuredState = (widthSizeAndState.state
            << DORIC_MEASURED_HEIGHT_STATE_SHIFT) | heightSizeAndState.state;

    if (matchParentChildren.count > 0) {
        for (DoricLayout *child in matchParentChildren) {
            DoricMeasureSpec childWidthMeasureSpec;
            if (child.widthSpec == DoricLayoutMost) {
                childWidthMeasureSpec.size = MAX(0,
                        self.measuredWidth - self.paddingLeft - self.paddingRight
                                - child.marginLeft - child.marginRight);
                childWidthMeasureSpec.mode = DoricMeasureExactly;
            } else {
                childWidthMeasureSpec
                        = [self getChildMeasureSpec:widthMeasureSpec
                                            padding:self.paddingLeft + self.paddingRight
                                                    + child.marginLeft + child.marginRight
                                    childLayoutSpec:child.widthSpec
                                          childSize:child.width];
            }
            DoricMeasureSpec childHeightMeasureSpec;
            if (child.heightSpec == DoricLayoutMost) {
                childHeightMeasureSpec.size
                        = MAX(0, self.measuredHeight - self.paddingTop - self.paddingBottom
                        - child.marginTop - child.marginBottom);
                childHeightMeasureSpec.mode = DoricMeasureExactly;
            } else {
                childHeightMeasureSpec
                        = [self getChildMeasureSpec:heightMeasureSpec
                                            padding:self.paddingTop + self.paddingBottom
                                                    + child.marginTop + child.marginBottom
                                    childLayoutSpec:child.heightSpec
                                          childSize:child.height];
            }
            [child measureWidth:childWidthMeasureSpec height:childHeightMeasureSpec];
        }
    }
}

- (void)scrollerMeasureWidth:(DoricMeasureSpec)widthMeasureSpec
                      height:(DoricMeasureSpec)heightMeasureSpec {
    DoricScrollView *scrollView = (DoricScrollView *) self.view;
    DoricLayout *childLayout = scrollView.contentView.doricLayout;

    [self measureChild:childLayout
             widthSpec:widthMeasureSpec usedWidth:0
            heightSpec:heightMeasureSpec usedHeight:0];

    CGFloat maxWidth, maxHeight;

    maxWidth = childLayout.measuredWidth
            + childLayout.marginLeft + childLayout.marginRight;
    maxHeight = childLayout.measuredHeight
            + childLayout.marginTop + childLayout.marginBottom;

    maxWidth += self.paddingLeft + self.paddingRight;
    maxHeight += self.paddingTop + self.paddingBottom;

    maxWidth = MAX(maxWidth, self.minWidth);
    maxHeight = MAX(maxHeight, self.minHeight);

    DoricSizeAndState widthSizeAndState = [self resolveSizeAndState:maxWidth
                                                               spec:widthMeasureSpec
                                                 childMeasuredState:0];
    DoricSizeAndState heightSizeAndState = [self resolveSizeAndState:maxHeight
                                                                spec:heightMeasureSpec
                                                  childMeasuredState:0];
    self.measuredWidth = widthSizeAndState.size;
    self.measuredHeight = heightSizeAndState.size;

    if (widthMeasureSpec.mode == DoricMeasureUnspecified
            && heightMeasureSpec.mode == DoricMeasureUnspecified) {
        return;
    }

    CGFloat width = self.measuredWidth - self.paddingLeft - self.paddingRight;
    CGFloat height = self.measuredHeight - self.paddingTop - self.paddingBottom;
    DoricMeasureSpec childWidthMeasureSpec, childHeightMeasureSpec;
    if (childLayout.widthSpec == DoricLayoutMost) {
        childWidthMeasureSpec = DoricMeasureSpecMake(DoricMeasureExactly, width);
    } else {
        widthMeasureSpec = DoricMeasureSpecMake(DoricMeasureUnspecified, 0);
        childWidthMeasureSpec = [self getChildMeasureSpec:widthMeasureSpec
                                                  padding:self.paddingLeft + self.paddingRight
                                          childLayoutSpec:childLayout.widthSpec
                                                childSize:childLayout.width];
    }

    if (childLayout.heightSpec == DoricLayoutMost) {
        childHeightMeasureSpec = DoricMeasureSpecMake(DoricMeasureExactly, height);
    } else {
        heightMeasureSpec = DoricMeasureSpecMake(DoricMeasureUnspecified, 0);
        childHeightMeasureSpec = [self getChildMeasureSpec:heightMeasureSpec
                                                   padding:self.paddingTop + self.paddingBottom
                                           childLayoutSpec:childLayout.heightSpec
                                                 childSize:childLayout.height];
    }
    [childLayout measureWidth:childWidthMeasureSpec height:childHeightMeasureSpec];
}

- (void)flexMeasureWidth:(DoricMeasureSpec)widthMeasureSpec
                  height:(DoricMeasureSpec)heightMeasureSpec {

    for (__kindof UIView *subview in self.view.subviews) {
        DoricLayout *childDoricLayout = subview.doricLayout;
        YGLayout *childYGLayout = subview.yoga;
        DoricMeasureSpec childWidthMeasureSpec;
        DoricMeasureSpec childHeightMeasureSpec;
        if (childDoricLayout.widthSpec == DoricLayoutMost) {
            childWidthMeasureSpec = DoricMeasureSpecMake(DoricMeasureAtMost, self.measuredWidth);
        } else if (childDoricLayout.widthSpec == DoricLayoutFit) {
            childWidthMeasureSpec = DoricMeasureSpecMake(DoricMeasureUnspecified, 0);
        } else {
            childWidthMeasureSpec = DoricMeasureSpecMake(DoricMeasureExactly, childDoricLayout.width);
        }

        if (childDoricLayout.heightSpec == DoricLayoutMost) {
            childHeightMeasureSpec = DoricMeasureSpecMake(DoricMeasureAtMost, self.measuredHeight);
        } else if (childDoricLayout.heightSpec == DoricLayoutFit) {
            childHeightMeasureSpec = DoricMeasureSpecMake(DoricMeasureUnspecified, 0);
        } else {
            childHeightMeasureSpec = DoricMeasureSpecMake(DoricMeasureExactly, childDoricLayout.height);
        }
        [childDoricLayout measureWidth:childWidthMeasureSpec height:childHeightMeasureSpec];
        if (childDoricLayout.layoutType != DoricFlexLayout) {
            YGUnit widthUnit = YGUnitAuto;
            YGUnit heightUnit = YGUnitAuto;
            if (childDoricLayout.flexConfig) {
                id widthValue = childDoricLayout.flexConfig[@"width"];
                if ([widthValue isKindOfClass:NSNumber.class]) {
                    widthUnit = YGUnitPoint;
                } else if ([widthValue isKindOfClass:NSDictionary.class]) {
                    id type = widthValue[@"type"];
                    if ([type isKindOfClass:NSNumber.class]) {
                        widthUnit = (YGUnit) [type integerValue];
                    }
                }

                id heightValue = childDoricLayout.flexConfig[@"height"];
                if ([heightValue isKindOfClass:NSNumber.class]) {
                    heightUnit = YGUnitPoint;
                } else if ([heightValue isKindOfClass:NSDictionary.class]) {
                    id type = heightValue[@"type"];
                    if ([type isKindOfClass:NSNumber.class]) {
                        heightUnit = (YGUnit) [type integerValue];
                    }
                }
            }
            if (widthUnit == YGUnitAuto) {
                childYGLayout.width = YGPointValue(childDoricLayout.measuredWidth);
            }

            if (heightUnit == YGUnitAuto) {
                childYGLayout.height = YGPointValue(childDoricLayout.measuredHeight);
            }
        }
    }


    YGUnit widthUnit = YGUnitAuto;
    YGUnit heightUnit = YGUnitAuto;
    if (self.flexConfig) {
        id widthValue = self.flexConfig[@"width"];
        if ([widthValue isKindOfClass:NSNumber.class]) {
            widthUnit = YGUnitPoint;
        } else if ([widthValue isKindOfClass:NSDictionary.class]) {
            id type = widthValue[@"type"];
            if ([type isKindOfClass:NSNumber.class]) {
                widthUnit = (YGUnit) [type integerValue];
            }
        }

        id heightValue = self.flexConfig[@"height"];
        if ([heightValue isKindOfClass:NSNumber.class]) {
            heightUnit = YGUnitPoint;
        } else if ([heightValue isKindOfClass:NSDictionary.class]) {
            id type = heightValue[@"type"];
            if ([type isKindOfClass:NSNumber.class]) {
                heightUnit = (YGUnit) [type integerValue];
            }
        }
    }
    if (widthUnit == YGUnitAuto) {
        self.view.yoga.width = YGValueAuto;
    }

    if (heightUnit == YGUnitAuto) {
        self.view.yoga.height = YGValueAuto;
    }

    if (self.view.superview.doricLayout.layoutType != DoricFlexLayout) {
        if (heightMeasureSpec.mode == DoricMeasureAtMost) {
            heightMeasureSpec = DoricMeasureSpecMake(DoricMeasureUnspecified, heightMeasureSpec.size);
        }

        if (widthMeasureSpec.mode == DoricMeasureAtMost) {
            widthMeasureSpec = DoricMeasureSpecMake(DoricMeasureUnspecified, widthMeasureSpec.size);
        }

        if (heightMeasureSpec.mode == DoricMeasureExactly) {
            self.view.yoga.height = YGPointValue(heightMeasureSpec.size);
        }
        if (widthMeasureSpec.mode == DoricMeasureExactly) {
            self.view.yoga.width = YGPointValue(widthMeasureSpec.size);
        }

        if (heightMeasureSpec.mode == DoricMeasureAtMost) {
            self.view.yoga.maxHeight = YGPointValue(heightMeasureSpec.size);
        }

        if (widthMeasureSpec.mode == DoricMeasureAtMost) {
            self.view.yoga.maxWidth = YGPointValue(widthMeasureSpec.size);
        }

        [self.view.yoga intrinsicSize];
    }


    DoricSizeAndState widthSizeAndState = [self resolveSizeAndState:YGNodeLayoutGetWidth(self.view.yoga.node)
                                                               spec:widthMeasureSpec
                                                 childMeasuredState:0];
    self.measuredWidth = widthSizeAndState.size;
    DoricSizeAndState heightSizeAndState = [self resolveSizeAndState:YGNodeLayoutGetHeight(self.view.yoga.node)
                                                                spec:heightMeasureSpec
                                                  childMeasuredState:0];
    self.measuredHeight = heightSizeAndState.size;
}

- (void)undefinedMeasureWidth:(DoricMeasureSpec)widthMeasureSpec
                       height:(DoricMeasureSpec)heightMeasureSpec {
    CGSize targetSize = CGSizeMake(widthMeasureSpec.size - self.paddingLeft - self.paddingRight,
            heightMeasureSpec.size - self.paddingTop - self.paddingBottom);
    CGSize measuredSize = [self.view sizeThatFits:targetSize];

    CGFloat contentWidth = measuredSize.width;
    CGFloat contentHeight = measuredSize.height;

    if ([self.view isKindOfClass:UIImageView.class]) {
        if (self.widthSpec == DoricLayoutFit
                && self.heightSpec != DoricLayoutFit && measuredSize.height > 0) {
            DoricSizeAndState preHeightSizeAndState = [self resolveSizeAndState:contentHeight
                            + self.paddingTop + self.paddingBottom
                                                                           spec:heightMeasureSpec
                                                             childMeasuredState:0];
            contentWidth = measuredSize.width / measuredSize.height
                    * (preHeightSizeAndState.size - self.paddingBottom - self.paddingBottom);
            self.measuredWidth = contentWidth + self.paddingLeft + self.paddingBottom;
            self.measuredHeight = preHeightSizeAndState.size;
            self.measuredState = 0;
            return;
        }

        if (self.heightSpec == DoricLayoutFit
                && self.widthSpec != DoricLayoutFit && measuredSize.width > 0) {
            DoricSizeAndState preWidthSizeAndState = [self resolveSizeAndState:contentWidth
                            + self.paddingLeft + self.paddingRight
                                                                          spec:widthMeasureSpec
                                                            childMeasuredState:0];
            contentHeight = measuredSize.height / measuredSize.width
                    * (preWidthSizeAndState.size - self.paddingLeft - self.paddingRight);
            self.measuredWidth = preWidthSizeAndState.size;
            self.measuredHeight = contentHeight + self.paddingTop + self.paddingBottom;
            self.measuredState = 0;
            return;
        }
    }

    DoricSizeAndState widthSizeAndState = [self resolveSizeAndState:contentWidth
                    + self.paddingLeft + self.paddingRight
                                                               spec:widthMeasureSpec
                                                 childMeasuredState:0];
    DoricSizeAndState heightSizeAndState = [self resolveSizeAndState:contentHeight
                    + self.paddingTop + self.paddingBottom
                                                                spec:heightMeasureSpec
                                                  childMeasuredState:0];
    self.measuredWidth = MAX(widthSizeAndState.size, self.minWidth);
    self.measuredHeight = MAX(heightSizeAndState.size, self.minHeight);
    self.measuredState = (widthSizeAndState.state
            << DORIC_MEASURED_HEIGHT_STATE_SHIFT) | heightSizeAndState.state;
}

#pragma layout

- (void)layout {
    switch (self.layoutType) {
        case DoricStack: {
            [self layoutStack];
            break;
        }
        case DoricVLayout: {
            [self layoutVLayout];
            break;
        }
        case DoricHLayout: {
            [self layoutHLayout];
            break;
        }
        case DoricScroller: {
            [self layoutScroller];
            break;
        }
        case DoricFlexLayout: {
            [self layoutFlex];
            break;
        }
        default: {
            break;
        }
    }
}

#pragma setFrame

- (void)setFrame {
    if (self.layoutType == DoricScroller) {
        [((DoricScrollView *) self.view).contentView.doricLayout setFrame];
    } else if (self.layoutType != DoricUndefined) {
        [self.view.subviews forEach:^(__kindof UIView *obj) {
            [obj.doricLayout setFrame];
        }];
    }
    CGRect originFrame = CGRectMake(self.measuredX, self.measuredY,
            self.measuredWidth, self.measuredHeight);
    if (!CGAffineTransformEqualToTransform(self.view.transform, CGAffineTransformIdentity)) {
        CGPoint anchor = self.view.layer.anchorPoint;
        originFrame = CGRectOffset(originFrame,
                -anchor.x * self.measuredWidth - self.measuredX,
                -anchor.y * self.measuredHeight - self.measuredY);
        originFrame = CGRectApplyAffineTransform(originFrame, self.view.transform);
        originFrame = CGRectOffset(originFrame,
                anchor.x * self.measuredWidth + self.measuredX,
                anchor.y * self.measuredHeight + self.measuredY);
    }
    BOOL isFrameChange = ![self rect:originFrame equalTo:self.view.frame];
    if (isFrameChange) {
        if (isnan(originFrame.origin.x) || isinf(originFrame.origin.x)
                || isnan(originFrame.origin.y) || isinf(originFrame.origin.y)
                || isnan(originFrame.size.width) || isinf(originFrame.size.width)
                || isnan(originFrame.size.height) || isinf(originFrame.size.height)
                ) {
            return;
        }
        self.view.frame = originFrame;
    }
    if (!UIEdgeInsetsEqualToEdgeInsets(self.corners, UIEdgeInsetsZero)) {
        if (self.view.layer.mask) {
            if ([self.view.layer.mask isKindOfClass:[DoricShapeLayer class]]) {
                DoricShapeLayer *shapeLayer = (DoricShapeLayer *) self.view.layer.mask;
                if (!UIEdgeInsetsEqualToEdgeInsets(self.corners, shapeLayer.corners)
                        || !CGRectEqualToRect(self.view.bounds, shapeLayer.viewBounds)) {
                    shapeLayer.corners = self.corners;
                    shapeLayer.viewBounds = self.view.bounds;
                    [self configMaskWithLayer:shapeLayer];
                }
            } else if (isFrameChange) {
                CAShapeLayer *shapeLayer = [CAShapeLayer layer];
                [self configMaskWithLayer:shapeLayer];
            }
        } else {
            DoricShapeLayer *shapeLayer = [DoricShapeLayer layer];
            shapeLayer.corners = self.corners;
            shapeLayer.viewBounds = self.view.bounds;
            [self configMaskWithLayer:shapeLayer];
        }
    }
}

- (void)configMaskWithLayer:(CAShapeLayer *)shapeLayer {
    CGPathRef path = DoricCreateRoundedRectPath(self.view.bounds,
            self.corners.top, self.corners.left, self.corners.bottom, self.corners.right);
    shapeLayer.path = path;
    if ((self.corners.left != self.corners.right
            || self.corners.left != self.corners.top
            || self.corners.left != self.corners.bottom)
            && self.view.layer.borderWidth > CGFLOAT_MIN) {
        CAShapeLayer *lineLayer = [CAShapeLayer layer];
        lineLayer.lineWidth = self.view.layer.borderWidth * 2;
        lineLayer.strokeColor = self.view.layer.borderColor;
        lineLayer.path = path;
        lineLayer.fillColor = nil;
        [[self.view.layer sublayers] forEach:^(__kindof CALayer *obj) {
            if ([obj isKindOfClass:CAShapeLayer.class]
                    && ((CAShapeLayer *) obj).lineWidth > CGFLOAT_MIN) {
                [obj removeFromSuperlayer];
            }
        }];
        [self.view.layer addSublayer:lineLayer];
    }
    CGPathRelease(path);
    self.view.layer.mask = shapeLayer;
}


- (void)layoutStack {
    for (__kindof UIView *subview in self.view.subviews) {
        DoricLayout *layout = subview.doricLayout;
        if (layout.disabled) {
            continue;
        }
        [layout layout];
        DoricGravity gravity = layout.alignment;
        if ((gravity & DoricGravityLeft) == DoricGravityLeft) {
            layout.measuredX = self.paddingLeft;
        } else if ((gravity & DoricGravityRight) == DoricGravityRight) {
            layout.measuredX = self.measuredWidth - self.paddingRight - layout.measuredWidth;
        } else if ((gravity & DoricGravityCenterX) == DoricGravityCenterX) {
            layout.measuredX = self.measuredWidth / 2 - layout.measuredWidth / 2;
        } else {
            layout.measuredX = self.paddingLeft;
        }
        if ((gravity & DoricGravityTop) == DoricGravityTop) {
            layout.measuredY = self.paddingTop;
        } else if ((gravity & DoricGravityBottom) == DoricGravityBottom) {
            layout.measuredY = self.measuredHeight - self.paddingBottom - layout.measuredHeight;
        } else if ((gravity & DoricGravityCenterY) == DoricGravityCenterY) {
            layout.measuredY = self.measuredHeight / 2 - layout.measuredHeight / 2;
        } else {
            layout.measuredY = self.paddingTop;
        }

        if (!gravity) {
            gravity = DoricGravityLeft | DoricGravityTop;
        }
        if (layout.marginLeft && !((gravity & DoricGravityRight) == DoricGravityRight)) {
            layout.measuredX += layout.marginLeft;
        }
        if (layout.marginRight && !((gravity & DoricGravityLeft) == DoricGravityLeft)) {
            layout.measuredX -= layout.marginRight;
        }
        if (layout.marginTop && !((gravity & DoricGravityBottom) == DoricGravityBottom)) {
            layout.measuredY += layout.marginTop;
        }
        if (layout.marginBottom && !((gravity & DoricGravityTop) == DoricGravityTop)) {
            layout.measuredY -= layout.marginBottom;
        }
    }
}

- (void)layoutVLayout {
    CGFloat yStart = self.paddingTop;
    if ((self.gravity & DoricGravityTop) == DoricGravityTop) {
        yStart = self.paddingTop;
    } else if ((self.gravity & DoricGravityBottom) == DoricGravityBottom) {
        yStart = self.measuredHeight - self.totalLength - self.paddingBottom;
    } else if ((self.gravity & DoricGravityCenterY) == DoricGravityCenterY) {
        yStart = (self.measuredHeight - self.totalLength
                - self.paddingTop - self.paddingBottom) / 2 + self.paddingTop;
    }
    for (UIView *child in self.view.subviews) {
        DoricLayout *layout = child.doricLayout;
        if (layout.disabled) {
            continue;
        }
        [layout layout];
        DoricGravity gravity = layout.alignment | self.gravity;
        if ((gravity & DoricGravityLeft) == DoricGravityLeft) {
            layout.measuredX = self.paddingLeft;
        } else if ((gravity & DoricGravityRight) == DoricGravityRight) {
            layout.measuredX = self.measuredWidth - self.paddingRight - layout.measuredWidth;
        } else if ((gravity & DoricGravityCenterX) == DoricGravityCenterX) {
            layout.measuredX = self.measuredWidth / 2 - layout.measuredWidth / 2;
        } else {
            layout.measuredX = self.paddingLeft;
        }
        if (!gravity) {
            gravity = DoricGravityLeft;
        }
        if (layout.marginLeft && !((gravity & DoricGravityRight) == DoricGravityRight)) {
            layout.measuredX += layout.marginLeft;
        }
        if (layout.marginRight && !((gravity & DoricGravityLeft) == DoricGravityLeft)) {
            layout.measuredX -= layout.marginRight;
        }
        layout.measuredY = yStart + layout.marginTop;
        yStart += self.spacing + layout.takenHeight;
    }
}

- (void)layoutHLayout {
    CGFloat xStart = self.paddingLeft;
    if ((self.gravity & DoricGravityLeft) == DoricGravityLeft) {
        xStart = self.paddingLeft;
    } else if ((self.gravity & DoricGravityRight) == DoricGravityRight) {
        xStart = self.measuredWidth - self.totalLength - self.paddingRight;
    } else if ((self.gravity & DoricGravityCenterX) == DoricGravityCenterX) {
        xStart = (self.measuredWidth - self.totalLength
                - self.paddingLeft - self.paddingRight) / 2 + self.paddingLeft;
    }
    for (UIView *child in self.view.subviews) {
        DoricLayout *layout = child.doricLayout;
        if (layout.disabled) {
            continue;
        }

        [layout layout];

        DoricGravity gravity = layout.alignment | self.gravity;
        if ((gravity & DoricGravityTop) == DoricGravityTop) {
            layout.measuredY = self.paddingTop;
        } else if ((gravity & DoricGravityBottom) == DoricGravityBottom) {
            layout.measuredY = self.measuredHeight - self.paddingBottom - layout.measuredHeight;
        } else if ((gravity & DoricGravityCenterY) == DoricGravityCenterY) {
            layout.measuredY = self.measuredHeight / 2 - layout.measuredHeight / 2;
        } else {
            layout.measuredY = self.paddingTop;
        }
        if (!gravity) {
            gravity = DoricGravityTop;
        }
        if (layout.marginTop && !((gravity & DoricGravityBottom) == DoricGravityBottom)) {
            layout.measuredY += layout.marginTop;
        }
        if (layout.marginBottom && !((gravity & DoricGravityTop) == DoricGravityTop)) {
            layout.measuredY -= layout.marginBottom;
        }
        layout.measuredX = xStart + layout.marginLeft;
        xStart += self.spacing + layout.takenWidth;
    }
}

- (void)layoutScroller {
    DoricScrollView *scrollView = (DoricScrollView *) self.view;
    DoricLayout *layout = scrollView.contentView.doricLayout;
    if (layout.disabled) {
        return;
    }
    [layout layout];
}

- (void)layoutFlex {
    for (UIView *child in self.view.subviews) {
        DoricLayout *layout = child.doricLayout;
        if (layout.disabled) {
            continue;
        }
        layout.measuredX = YGNodeLayoutGetLeft(child.yoga.node);
        layout.measuredY = YGNodeLayoutGetTop(child.yoga.node);
        CGSize size = child.yoga.intrinsicSize; 
        [layout measureWidth:DoricMeasureSpecMake(DoricMeasureExactly,
                                                  size.width)
                      height:DoricMeasureSpecMake(DoricMeasureExactly,
                                                  size.height)];
        [layout layout];
    }
}
@end


@implementation DoricScrollView

- (void)setContentView:(UIView *)contentView {
    if (_contentView) {
        [_contentView removeFromSuperview];
    }
    _contentView = contentView;
    [self addSubview:contentView];
}

- (void)layoutSubviews {
    [super layoutSubviews];
    self.contentSize = self.contentView.frame.size;
}
@end
