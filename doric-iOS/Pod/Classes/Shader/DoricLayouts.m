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
#import <QuartzCore/QuartzCore.h>

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

@interface DoricLayout ()
@property(nonatomic, assign) BOOL needRemeasure;
@property(nonatomic, assign) BOOL remeasuring;
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
        _needRemeasure = NO;
        _remeasuring = NO;
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
    [self measureSelf:targetSize];
    [self layout];
}

#pragma helper

- (BOOL)remeasuring {
    return _remeasuring || [self.superLayout remeasuring];
}

- (BOOL)hasWidthWeight {
    return self.inHLayout && self.weight > 0;
}

- (BOOL)hasHeightWeight {
    return self.inVLayout && self.weight > 0;
}


- (BOOL)fitWidth {
    return self.widthSpec == DoricLayoutFit;
}

- (BOOL)fitHeight {
    return self.heightSpec == DoricLayoutFit;
}

- (BOOL)justWidth {
    return self.widthSpec == DoricLayoutJust;
}

- (BOOL)justHeight {
    return self.heightSpec == DoricLayoutJust;
}

- (BOOL)mostWidth {
    return self.widthSpec == DoricLayoutMost;
}

- (BOOL)mostHeight {
    return self.heightSpec == DoricLayoutMost;
}

- (DoricLayout *)superLayout {
    return self.view.superview.doricLayout;
}


- (BOOL)superFitWidth {
    return self.superLayout.fitWidth;
}

- (BOOL)superFitHeight {
    return self.superLayout.fitHeight;
}

- (BOOL)superJustWidth {
    return self.superLayout.justWidth;
}

- (BOOL)superJustHeight {
    return self.superLayout.justHeight;
}

- (BOOL)superMostWidth {
    return self.superLayout.mostWidth;
}

- (BOOL)superMostHeight {
    return self.superLayout.mostHeight;
}


- (BOOL)inScrollable {
    return [self.view.superview isKindOfClass:UIScrollView.class];
}

- (BOOL)inVLayout {
    return self.superLayout.layoutType == DoricVLayout;
}

- (BOOL)inHLayout {
    return self.superLayout.layoutType == DoricHLayout;
}

- (BOOL)inStack {
    return self.superLayout.layoutType == DoricStack;
}

- (CGFloat)takenWidth {
    return self.measuredWidth + self.marginLeft + self.marginRight;
}

- (CGFloat)takenHeight {
    return self.measuredHeight + self.marginTop + self.marginBottom;
}

- (CGSize)removeMargin:(CGSize)targetSize {
    return CGSizeMake(
            targetSize.width - self.marginLeft - self.marginRight,
            targetSize.height - self.marginTop - self.marginBottom);
}

- (BOOL)restrain:(CGSize)limit {
    BOOL needRemeasure = NO;
    if (self.measuredWidth > self.maxWidth) {
        self.measuredWidth = self.maxWidth;
        needRemeasure = YES;
    }
    if (self.measuredHeight > self.maxHeight) {
        self.measuredHeight = self.maxHeight;
        needRemeasure = YES;
    }
    if (self.measuredWidth < self.minWidth) {
        self.measuredWidth = self.minWidth;
        needRemeasure = YES;
    }
    if (self.measuredHeight < self.minHeight) {
        self.measuredHeight = self.minHeight;
        needRemeasure = YES;
    }

    if (self.measuredWidth > limit.width && !self.hasWidthWeight && !self.inScrollable) {
        self.measuredWidth = MIN(limit.width, self.measuredWidth);
        needRemeasure = YES;
    }

    if (self.measuredHeight > limit.height && !self.hasHeightWeight && !self.inScrollable) {
        self.measuredHeight = MIN(limit.height, self.measuredHeight);
        needRemeasure = YES;
    }

    return needRemeasure;
}

- (BOOL)rect:(CGRect)rect1 equalTo:(CGRect)rect2 {
    return ABS(rect1.origin.x - rect2.origin.x) < 0.00001f
            && ABS(rect1.origin.y - rect2.origin.y) < 0.00001f
            && ABS(rect1.size.width - rect2.size.width) < 0.00001f
            && ABS(rect1.size.height - rect2.size.height) < 0.00001f;
}

- (CGSize)removeSizePadding:(CGSize)size {
    return CGSizeMake([self removeWidthPadding:size.width],
            [self removeHeightPadding:size.height]);
}

- (CGFloat)removeWidthPadding:(CGFloat)size {
    return size - self.paddingLeft - self.paddingRight;
}

- (CGFloat)removeHeightPadding:(CGFloat)size {
    return size - self.paddingTop - self.paddingBottom;
}

- (CGFloat)addWidthPadding:(CGFloat)size {
    return size + self.paddingLeft + self.paddingRight;
}

- (CGFloat)addHeightPadding:(CGFloat)size {
    return size + self.paddingTop + self.paddingBottom;
}

- (BOOL)needFitWidth {
    if (self.widthSpec == DoricLayoutFit) {
        return YES;
    }
    if (self.widthSpec == DoricLayoutJust) {
        return self.hasWidthWeight;
    }
    if (self.widthSpec == DoricLayoutMost) {
        if (self.superLayout.needFitWidth) {
            if (!self.remeasuring) {
                return YES;
            }
            if (self.inHLayout) {
                if (self.superLayout.fitWidth) {
                    return YES;
                }
                if (!self.superLayout.inHLayout) {
                    return YES;
                }
                if (self.superLayout.superLayout.inStack) {
                    return YES;
                }
                if (self.superLayout.superLayout.superMostHeight) {
                    return YES;
                }
            }
        }
    }
    return NO;
}

- (BOOL)needFitHeight {
    if (self.heightSpec == DoricLayoutFit) {
        return YES;
    }
    if (self.heightSpec == DoricLayoutJust) {
        return self.hasHeightWeight;
    }
    if (self.heightSpec == DoricLayoutMost) {
        if (self.superLayout.needFitHeight) {
            if (!self.remeasuring) {
                return YES;
            }
            if (self.inVLayout) {
                if (self.superLayout.fitHeight) {
                    return YES;
                }
                if (!self.superLayout.inVLayout) {
                    return YES;
                }
                if (self.superLayout.superLayout.inStack) {
                    return YES;
                }
                if (self.superLayout.superLayout.superMostWidth) {
                    return YES;
                }
            }
        }
    }
    return NO;
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

#pragma measureSelf

- (void)measureSelf:(CGSize)remainingSize {
    CGFloat limitWidth = remainingSize.width;
    CGFloat limitHeight = remainingSize.height;

    if (self.inScrollable) {
        if (self.fitWidth) {
            limitWidth = CGFLOAT_MAX;
        }
        if (self.fitHeight) {
            limitHeight = CGFLOAT_MAX;
        }
    }

    [self measureSelf:remainingSize
              limitTo:CGSizeMake(limitWidth, limitHeight)];
}

- (void)measureSelf:(CGSize)remainingSize limitTo:(CGSize)limitSize {

    CGFloat remainingWidth = remainingSize.width;
    CGFloat remainingHeight = remainingSize.height;

    CGFloat limitWidth = limitSize.width;
    CGFloat limitHeight = limitSize.height;

    if (self.justWidth && !self.hasWidthWeight) {
        remainingWidth = limitWidth = self.width;
    }

    if (self.justHeight && !self.hasHeightWeight) {
        remainingHeight = limitHeight = self.height;
    }

    [self measureSelf:CGSizeMake(remainingWidth, remainingHeight)
              limitTo:CGSizeMake(limitWidth, limitHeight)
             restrain:YES];
}

- (void)measureSelf:(CGSize)remainingSize limitTo:(CGSize)limitSize restrain:(BOOL)needRestrain {
    self.needRemeasure = NO;
    self.remeasuring = NO;
    [self measureContent:[self removeSizePadding:remainingSize]
                 limitTo:[self removeSizePadding:limitSize]];

    if (self.needFitWidth) {
        self.measuredWidth = self.contentWidth
                + self.paddingLeft + self.paddingRight
                + (self.justWidth ? self.width : 0);
    } else if (self.mostWidth) {
        self.measuredWidth = remainingSize.width;
    } else {
        self.measuredWidth = self.width;
    }

    if (self.needFitHeight) {
        self.measuredHeight = self.contentHeight
                + self.paddingTop + self.paddingBottom
                + (self.justHeight ? self.height : 0);
    } else if (self.mostHeight) {
        self.measuredHeight = remainingSize.height;
    } else {
        self.measuredHeight = self.height;
    }

    if ([self.view isKindOfClass:[UIImageView class]]) {
        if (self.needFitWidth && self.heightSpec != DoricLayoutFit && self.contentWidth > 0) {
            self.measuredWidth = self.contentWidth / self.contentHeight * self.measuredHeight
                    + self.paddingLeft + self.paddingRight;
        }
        if (self.needFitHeight && self.widthSpec != DoricLayoutFit && self.contentHeight > 0) {
            self.measuredHeight = self.contentHeight / self.contentWidth * self.measuredWidth
                    + self.paddingLeft + self.paddingRight;
        }
    }

    if (needRestrain
            && [self restrain:limitSize]
            && self.layoutType != DoricUndefined
            ) {
        CGSize size = [self removeSizePadding:CGSizeMake(
                self.measuredWidth,
                self.measuredHeight)];
        [self measureSelf:size limitTo:size restrain:NO];
    }

    if (self.needRemeasure) {
        self.remeasuring = YES;
        CGFloat width, limitWidth;
        width = limitWidth = [self removeWidthPadding:self.measuredWidth];
        CGFloat height, limitHeight;
        height = limitHeight = [self removeHeightPadding:self.measuredHeight];
        if (self.needFitWidth) {
            limitWidth = limitSize.width;
        }
        if (self.needFitHeight) {
            limitHeight = limitSize.height;
        }
        [self measureContent:CGSizeMake(width, height)
                     limitTo:CGSizeMake(limitWidth, limitHeight)];

        if (self.needFitWidth) {
            if ([self.view isKindOfClass:[UIImageView class]]
                    && self.heightSpec != DoricLayoutFit && self.contentHeight > 0) {
                self.measuredWidth = self.contentWidth / self.contentHeight * self.measuredHeight
                        + self.paddingLeft + self.paddingRight;
            } else {
                self.measuredWidth = self.contentWidth
                        + self.paddingLeft + self.paddingRight
                        + (self.justWidth ? self.width : 0);
            }
        }

        if (self.needFitHeight) {
            if ([self.view isKindOfClass:[UIImageView class]]
                    && self.widthSpec != DoricLayoutFit && self.contentHeight > 0) {
                self.measuredHeight = self.contentHeight / self.contentWidth * self.measuredWidth
                        + self.paddingLeft + self.paddingRight;
            } else {
                self.measuredHeight = self.contentHeight
                        + self.paddingTop + self.paddingBottom
                        + (self.justHeight ? self.height : 0);
            }
        }

        self.remeasuring = NO;
    }

    if ((self.mostWidth && self.superLayout.needFitWidth)
            || (self.mostHeight && self.superLayout.needFitHeight)) {
        self.superLayout.needRemeasure = YES;
    }
}

#pragma measureContent

- (void)measureContent:(CGSize)remaining limitTo:(CGSize)limit {
    switch (self.layoutType) {
        case DoricStack: {
            [self measureStackContent:remaining limitTo:limit];
            break;
        }
        case DoricVLayout: {
            [self measureVLayoutContent:remaining limitTo:limit];
            break;
        }
        case DoricHLayout: {
            [self measureHLayoutContent:remaining limitTo:limit];
            break;
        }
        default: {
            [self measureUndefinedContent:remaining];
            break;
        }
    }
}


- (void)measureUndefinedContent:(CGSize)targetSize {
    CGSize measuredSize = [self.view sizeThatFits:targetSize];

    self.contentWidth = measuredSize.width;
    self.contentHeight = measuredSize.height;
}

- (void)measureStackContent:(CGSize)remaining limitTo:(CGSize)limit {
    CGFloat contentWidth = 0, contentHeight = 0;
    BOOL existsWidthContent = NO, existsHeightContent = NO;
    for (__kindof UIView *subview in self.view.subviews) {
        DoricLayout *layout = subview.doricLayout;
        if (layout.disabled) {
            continue;
        }
        CGSize childRemaining = [layout removeMargin:remaining];
        CGSize childLimit = [layout removeMargin:limit];
        [layout measureSelf:childRemaining limitTo:childLimit];
        if (!(layout.mostWidth && self.fitWidth)) {
            existsWidthContent = YES;
            contentWidth = MAX(contentWidth, layout.takenWidth);
        }
        if (!(layout.mostHeight && self.fitHeight)) {
            existsHeightContent = YES;
            contentHeight = MAX(contentHeight, layout.takenHeight);
        }
    }
    if (!existsWidthContent) {
        for (__kindof UIView *subview in self.view.subviews) {
            DoricLayout *layout = subview.doricLayout;
            if (layout.disabled) {
                continue;
            }
            contentWidth = MAX(contentWidth, layout.takenWidth);
        }
    }
    if (!existsHeightContent) {
        for (__kindof UIView *subview in self.view.subviews) {
            DoricLayout *layout = subview.doricLayout;
            if (layout.disabled) {
                continue;
            }
            contentHeight = MAX(contentHeight, layout.takenHeight);
        }
    }
    self.contentWidth = contentWidth;

    self.contentHeight = contentHeight;
}

- (void)measureVLayoutContent:(CGSize)remaining limitTo:(CGSize)limit {
    CGFloat contentWidth = 0, contentHeight = 0, contentWeight = 0;
    BOOL had = NO;
    BOOL existsContent = NO;
    for (__kindof UIView *subview in self.view.subviews) {
        DoricLayout *layout = subview.doricLayout;
        if (layout.disabled) {
            continue;
        }
        had = YES;
        CGSize childRemaining = [layout removeMargin:CGSizeMake(
                remaining.width,
                (self.contentWeight > 0 || layout.hasHeightWeight) ? remaining.height : remaining.height - contentHeight)];
        CGSize childLimit = [layout removeMargin:CGSizeMake(
                limit.width,
                (self.contentWeight > 0 || layout.hasHeightWeight) ? limit.height : limit.height - contentHeight)];
        [layout measureSelf:childRemaining limitTo:childLimit];
        if (!(layout.mostWidth && self.fitWidth)) {
            existsContent = YES;
            contentWidth = MAX(contentWidth, layout.takenWidth);
        }
        contentHeight += layout.takenHeight + self.spacing;
        contentWeight += layout.weight;
    }
    self.contentWeight = contentWeight;
    if (had) {
        contentHeight -= self.spacing;
    }
    BOOL reassign = NO;
    if (contentWeight > 0) {
        if (self.needFitHeight && self.inVLayout) {
            if (self.remeasuring) {
                reassign = YES;
            } else {
                self.superLayout.needRemeasure = YES;
            }
        }

        if (!self.needFitHeight && !self.hasHeightWeight) {
            reassign = YES;
        }
    }

    if (reassign) {
        CGFloat extra = remaining.height - contentHeight;
        contentWidth = 0;
        contentHeight = 0;
        had = NO;
        for (__kindof UIView *subview in self.view.subviews) {
            DoricLayout *layout = subview.doricLayout;
            if (layout.disabled) {
                continue;
            }
            had = YES;
            CGFloat measuredHeight = layout.measuredHeight + extra / contentWeight * layout.weight;
            layout.measuredHeight = measuredHeight;

            //Need Remeasure
            CGSize childRemaining = CGSizeMake(
                    [layout removeWidthPadding:layout.measuredWidth],
                    [layout removeHeightPadding:measuredHeight]);
            [layout measureContent:childRemaining limitTo:childRemaining];
            if (!(layout.mostWidth && self.fitWidth)) {
                contentWidth = MAX(contentWidth, layout.takenWidth);
            }
            contentHeight += layout.takenHeight + self.spacing;
        }
        if (had) {
            contentHeight -= self.spacing;
        }
    }
    
    if (!existsContent) {
        for (__kindof UIView *subview in self.view.subviews) {
            DoricLayout *layout = subview.doricLayout;
            if (layout.disabled) {
                continue;
            }
            contentWidth = MAX(contentWidth, layout.takenWidth);
        }
    }
    
    self.contentWidth = contentWidth;

    self.contentHeight = contentHeight;
}

- (void)measureHLayoutContent:(CGSize)remaining limitTo:(CGSize)limit {
    CGFloat contentWidth = 0, contentHeight = 0, contentWeight = 0;;
    BOOL had = NO;
    BOOL existsContent = NO;
    for (__kindof UIView *subview in self.view.subviews) {
        DoricLayout *layout = subview.doricLayout;
        if (layout.disabled) {
            continue;
        }
        had = YES;
        CGSize childRemaining = [layout removeMargin:CGSizeMake(
                (self.contentWeight > 0 || layout.hasWidthWeight) ? remaining.width : remaining.width - contentWidth,
                remaining.height)];
        CGSize childLimit = [layout removeMargin:CGSizeMake(
                (self.contentWeight > 0 || layout.hasWidthWeight) ? limit.width : limit.width - contentWidth,
                limit.height)];
        [layout measureSelf:childRemaining limitTo:childLimit];
        contentWidth += layout.takenWidth + self.spacing;
        if (!(layout.mostHeight && self.fitHeight)) {
            existsContent = YES;
            contentHeight = MAX(contentHeight, layout.takenHeight);
        }
        contentWeight += layout.weight;
    }
    self.contentWeight = contentWeight;
    if (had) {
        contentWidth -= self.spacing;
    }
    BOOL reassign = NO;
    if (contentWeight > 0) {
        if (self.needFitWidth && self.inHLayout) {
            if (self.remeasuring) {
                reassign = YES;
            } else {
                self.superLayout.needRemeasure = YES;
            }
        }
        if (!self.needFitWidth && !self.hasWidthWeight) {
            reassign = YES;
        }
    }
    if (reassign) {
        CGFloat extra = remaining.width - contentWidth;
        contentWidth = 0;
        contentHeight = 0;
        had = NO;
        for (__kindof UIView *subview in self.view.subviews) {
            DoricLayout *layout = subview.doricLayout;
            if (layout.disabled) {
                continue;
            }
            had = YES;
            CGFloat measuredWidth = layout.measuredWidth + extra / contentWeight * layout.weight;
            layout.measuredWidth = measuredWidth;
            //Need Remeasure
            CGSize childRemaining = CGSizeMake(
                    [layout removeWidthPadding:measuredWidth],
                    [layout removeHeightPadding:layout.measuredHeight]);
            [layout measureContent:childRemaining limitTo:childRemaining];
            contentWidth += layout.takenWidth + self.spacing;
            if (!(layout.mostHeight && self.fitHeight)) {
                contentHeight = MAX(contentHeight, layout.takenHeight);
            }
        }
        if (had) {
            contentWidth -= self.spacing;
        }
    }
    
    if (!existsContent) {
        for (__kindof UIView *subview in self.view.subviews) {
            DoricLayout *layout = subview.doricLayout;
            if (layout.disabled) {
                continue;
            }
            contentHeight = MAX(contentHeight, layout.takenHeight);
        }
    }
    
    self.contentWidth = contentWidth;
    self.contentHeight = contentHeight;
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
        default: {
            break;
        }
    }
}

#pragma setFrame

- (void)setFrame {
    if (self.layoutType != DoricUndefined) {
        [self.view.subviews forEach:^(__kindof UIView *obj) {
            [obj.doricLayout setFrame];
        }];
    }
    CGRect originFrame = CGRectMake(self.measuredX, self.measuredY, self.measuredWidth, self.measuredHeight);
    if (!CGAffineTransformEqualToTransform(self.view.transform, CGAffineTransformIdentity)) {
        CGPoint anchor = self.view.layer.anchorPoint;
        originFrame = CGRectOffset(originFrame, -anchor.x * self.measuredWidth - self.measuredX, -anchor.y * self.measuredHeight - self.measuredY);
        originFrame = CGRectApplyAffineTransform(originFrame, self.view.transform);
        originFrame = CGRectOffset(originFrame, anchor.x * self.measuredWidth + self.measuredX, anchor.y * self.measuredHeight + self.measuredY);
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
            if ([obj isKindOfClass:CAShapeLayer.class] && ((CAShapeLayer *) obj).lineWidth > CGFLOAT_MIN) {
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
        yStart = self.measuredHeight - self.contentHeight - self.paddingBottom;
    } else if ((self.gravity & DoricGravityCenterY) == DoricGravityCenterY) {
        yStart = (self.measuredHeight - self.contentHeight - self.paddingTop - self.paddingBottom) / 2 + self.paddingTop;
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
        xStart = self.measuredWidth - self.contentWidth - self.paddingRight;
    } else if ((self.gravity & DoricGravityCenterX) == DoricGravityCenterX) {
        xStart = (self.measuredWidth - self.contentWidth - self.paddingLeft - self.paddingRight) / 2 + self.paddingLeft;
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

@end

