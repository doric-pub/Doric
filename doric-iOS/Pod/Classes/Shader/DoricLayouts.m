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
@property(nonatomic, assign) BOOL reassignWidth;
@property(nonatomic, assign) BOOL reassignHeight;
@end

@implementation DoricLayout
- (instancetype)init {
    if (self = [super init]) {
        _widthSpec = DoricLayoutJust;
        _heightSpec = DoricLayoutJust;
        _maxWidth = CGFLOAT_MAX;
        _maxHeight = CGFLOAT_MAX;
        _minWidth = CGFLOAT_MIN;
        _minHeight = CGFLOAT_MIN;
        _reassignWidth = NO;
        _reassignHeight = NO;
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

- (void)measureSelf:(CGSize)targetSize {
    CGFloat width;
    CGFloat height;

    if (self.widthSpec == DoricLayoutMost) {
        if (self.view.superview.doricLayout.widthSpec == DoricLayoutFit) {
            width = targetSize.width;
        } else if (self.inHLayout && self.weight > 0) {
            width = self.measuredWidth = targetSize.width;
        } else {
            width = self.measuredWidth = targetSize.width;
        }
    } else if (self.widthSpec == DoricLayoutJust) {
        self.measuredWidth = self.width;
        if (self.inHLayout && self.weight > 0) {
            if (self.inScrollable) {
                width = CGFLOAT_MAX;
            } else {
                width = targetSize.width;
            }
        } else {
            width = self.width;
        }
    } else {
        if (self.inScrollable) {
            width = CGFLOAT_MAX;
        } else {
            width = targetSize.width;
        }
    }

    if (self.heightSpec == DoricLayoutMost) {
        if (self.view.superview.doricLayout.heightSpec == DoricLayoutFit) {
            height = targetSize.height;
        } else if (self.inVLayout && self.weight > 0) {
            height = self.measuredHeight = targetSize.height;
        } else {
            height = self.measuredHeight = targetSize.height;
        }
    } else if (self.heightSpec == DoricLayoutJust) {
        if (self.inVLayout && self.weight > 0) {
            if (self.inScrollable) {
                height = CGFLOAT_MAX;
            } else {
                height = targetSize.height;
            }
        } else {
            height = self.height;
        }
        self.measuredHeight = self.height;
    } else {
        if (self.inScrollable) {
            height = CGFLOAT_MAX;
        } else {
            height = targetSize.height;
        }
    }

    [self measureContent:CGSizeMake(
            width - self.paddingLeft - self.paddingRight,
            height - self.paddingTop - self.paddingBottom)];


    if ([self restrainSize]) {
        [self measureContent:CGSizeMake(
                self.measuredWidth - self.paddingLeft - self.paddingRight,
                self.measuredHeight - self.paddingTop - self.paddingBottom)];
    }

    if (self.measuredWidth > width && !(self.inHLayout && self.weight > 0)) {
        self.measuredWidth = MIN(width, self.measuredWidth);
    }

    if (self.measuredHeight > height && !(self.inVLayout && self.weight > 0)) {
        self.measuredHeight = MIN(height, self.measuredHeight);
    }

    [self restrainSize];
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

- (BOOL)restrainSize {
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
    return needRemeasure;
}

- (bool)hasWidthWeight {
    return self.inHLayout && self.weight > 0;
}

- (bool)hasHeightWeight {
    return self.inVLayout && self.weight > 0;
}

- (bool)superWidthFit {
    return self.superLayout.widthSpec == DoricLayoutFit;
}

- (bool)superHeightFit {
    return self.superLayout.heightSpec == DoricLayoutFit;
}

- (DoricLayout *)superLayout {
    return self.view.superview.doricLayout;
}

- (void)measureContent:(CGSize)targetSize {
    self.reassignWidth = NO;
    self.reassignHeight = NO;
    switch (self.layoutType) {
        case DoricStack: {
            [self measureStackContent:targetSize];
            break;
        }
        case DoricVLayout: {
            [self measureVLayoutContent:targetSize];
            break;
        }
        case DoricHLayout: {
            [self measureHLayoutContent:targetSize];
            break;
        }
        default: {
            [self measureUndefinedContent:targetSize];
            break;
        }
    }

    if ((self.superWidthFit || self.superLayout.hasWidthWeight) && self.widthSpec == DoricLayoutMost) {
        self.measuredWidth = self.contentWidth + self.paddingLeft + self.paddingRight;
    }

    if ((self.superHeightFit || self.superLayout.hasHeightWeight) && self.heightSpec == DoricLayoutMost) {
        self.measuredHeight = self.contentHeight + self.paddingTop + self.paddingBottom;
    }

    if (self.view.superview.doricLayout.layoutType == DoricHLayout
            && self.view.superview.doricLayout.widthSpec == DoricLayoutFit
            && self.weight > 0
            && self.widthSpec == DoricLayoutJust
            ) {
        self.measuredWidth = self.contentWidth + self.paddingLeft + self.paddingRight + self.width;
        self.reassignWidth = YES;
    }
    if (self.view.superview.doricLayout.layoutType == DoricVLayout
            && self.view.superview.doricLayout.heightSpec == DoricLayoutFit
            && self.weight > 0
            && self.heightSpec == DoricLayoutJust
            ) {
        self.measuredHeight = self.contentHeight + self.paddingTop + self.paddingBottom + self.height;
        self.reassignHeight = YES;
    }
}

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

- (BOOL)rect:(CGRect)rect1 equalTo:(CGRect)rect2 {
    return ABS(rect1.origin.x - rect2.origin.x) < 0.00001f
            && ABS(rect1.origin.y - rect2.origin.y) < 0.00001f
            && ABS(rect1.size.width - rect2.size.width) < 0.00001f
            && ABS(rect1.size.height - rect2.size.height) < 0.00001f;
}

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

- (void)measureUndefinedContent:(CGSize)targetSize {
    CGSize measuredSize = [self.view sizeThatFits:targetSize];
    if (self.widthSpec == DoricLayoutFit) {
        if ([self.view isKindOfClass:[UIImageView class]]
                && self.heightSpec != DoricLayoutFit && measuredSize.height > 0) {
            self.measuredWidth = measuredSize.width / measuredSize.height * self.measuredHeight
                    + self.paddingLeft + self.paddingRight;
        } else {
            self.measuredWidth = measuredSize.width + self.paddingLeft + self.paddingRight;
        }
    }
    if (self.heightSpec == DoricLayoutFit) {
        if ([self.view isKindOfClass:[UIImageView class]]
                && self.widthSpec != DoricLayoutFit && measuredSize.width > 0) {
            self.measuredHeight = measuredSize.height / measuredSize.width * self.measuredWidth
                    + self.paddingTop + self.paddingBottom;
        } else {
            self.measuredHeight = measuredSize.height + self.paddingTop + self.paddingBottom;
        }
    }

    self.contentWidth = measuredSize.width;

    self.contentHeight = measuredSize.height;
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

- (void)measureStackContent:(CGSize)targetSize {
    CGFloat contentWidth = 0, contentHeight = 0;
    for (__kindof UIView *subview in self.view.subviews) {
        DoricLayout *layout = subview.doricLayout;
        if (layout.disabled) {
            continue;
        }
        [layout measure:[layout removeMargin:targetSize]];
        contentWidth = MAX(contentWidth, layout.takenWidth);
        contentHeight = MAX(contentHeight, layout.takenHeight);
    }
    if (self.widthSpec == DoricLayoutFit) {
        self.measuredWidth = contentWidth + self.paddingLeft + self.paddingRight;
    }

    if (self.heightSpec == DoricLayoutFit) {
        self.measuredHeight = contentHeight + self.paddingTop + self.paddingBottom;
    }

    self.contentWidth = contentWidth;

    self.contentHeight = contentHeight;
}

- (void)measureVLayoutContent:(CGSize)targetSize {
    CGFloat contentWidth = 0, contentHeight = 0, contentWeight = 0;
    BOOL had = NO;
    for (__kindof UIView *subview in self.view.subviews) {
        DoricLayout *layout = subview.doricLayout;
        if (layout.disabled) {
            continue;
        }
        had = YES;
        [layout measure:[layout removeMargin:CGSizeMake(
                targetSize.width,
                layout.weight > 0 ? targetSize.height : targetSize.height - contentHeight)]];
        contentWidth = MAX(contentWidth, layout.takenWidth);
        contentHeight += layout.takenHeight + self.spacing;
        contentWeight += layout.weight;
    }

    if (had) {
        contentHeight -= self.spacing;
    }

    if (contentWeight > 0 && self.heightSpec != DoricLayoutFit) {
        CGFloat remaining = targetSize.height - contentHeight;
        contentWidth = 0;
        contentHeight = 0;
        had = NO;
        for (__kindof UIView *subview in self.view.subviews) {
            DoricLayout *layout = subview.doricLayout;
            if (layout.disabled) {
                continue;
            }
            had = YES;
            CGFloat measuredHeight = layout.measuredHeight + remaining / contentWeight * layout.weight;
            layout.measuredHeight = measuredHeight;
            //Need Remeasure
            [layout measureContent:CGSizeMake(
                    layout.measuredWidth - layout.paddingLeft - layout.paddingRight,
                    measuredHeight - layout.paddingTop - layout.paddingBottom)];
            layout.measuredHeight = measuredHeight;
            contentWidth = MAX(contentWidth, layout.takenWidth);
            contentHeight += layout.takenHeight + self.spacing;
        }
        if (had) {
            contentHeight -= self.spacing;
        }
    }

    if (self.widthSpec == DoricLayoutFit) {
        self.measuredWidth = contentWidth + self.paddingLeft + self.paddingRight;
    }

    if (self.heightSpec == DoricLayoutFit) {
        self.measuredHeight = contentHeight + self.paddingTop + self.paddingBottom;
    }

    self.contentWidth = contentWidth;

    self.contentHeight = contentHeight;
}

- (void)measureHLayoutContent:(CGSize)targetSize {
    CGFloat contentWidth = 0, contentHeight = 0, contentWeight = 0;;
    BOOL had = NO;
    for (__kindof UIView *subview in self.view.subviews) {
        DoricLayout *layout = subview.doricLayout;
        if (layout.disabled) {
            continue;
        }
        had = YES;
        [layout measure:[layout removeMargin:CGSizeMake(
                layout.weight > 0 ? targetSize.width : targetSize.width - contentWidth,
                targetSize.height)]];
        contentWidth += layout.takenWidth + self.spacing;
        contentHeight = MAX(contentHeight, layout.takenHeight);
        contentWeight += layout.weight;
    }

    if (had) {
        contentWidth -= self.spacing;
    }

    if (contentWeight > 0 && self.widthSpec != DoricLayoutFit) {
        CGFloat remaining = targetSize.width - contentWidth;
        contentWidth = 0;
        contentHeight = 0;
        had = NO;
        for (__kindof UIView *subview in self.view.subviews) {
            DoricLayout *layout = subview.doricLayout;
            if (layout.disabled) {
                continue;
            }
            had = YES;
            CGFloat measuredWidth = layout.measuredWidth + remaining / contentWeight * layout.weight;
            layout.measuredWidth = measuredWidth;
            //Need Remeasure
            [layout measureContent:CGSizeMake(
                    measuredWidth - layout.paddingLeft - layout.paddingRight,
                    layout.measuredHeight - layout.paddingTop - layout.paddingBottom)];
            layout.measuredWidth = measuredWidth;
            contentWidth += layout.takenWidth + self.spacing;
            contentHeight = MAX(contentHeight, layout.takenHeight);
        }
        if (had) {
            contentWidth -= self.spacing;
        }
    }

    if (self.widthSpec == DoricLayoutFit) {
        self.measuredWidth = contentWidth + self.paddingLeft + self.paddingRight;
    }

    if (self.heightSpec == DoricLayoutFit) {
        self.measuredHeight = contentHeight + self.paddingTop + self.paddingBottom;
    }

    self.contentWidth = contentWidth;

    self.contentHeight = contentHeight;
}

- (void)layoutStack {
    for (__kindof UIView *subview in self.view.subviews) {
        DoricLayout *layout = subview.doricLayout;
        if (layout.disabled) {
            continue;
        }
        if ((self.widthSpec == DoricLayoutFit || self.reassignWidth) && layout.widthSpec == DoricLayoutMost) {
            layout.measuredWidth = self.contentWidth - layout.marginLeft - layout.marginRight;
        }
        if ((self.heightSpec == DoricLayoutFit || self.reassignHeight) && layout.heightSpec == DoricLayoutMost) {
            layout.measuredHeight = self.contentHeight - layout.marginTop - layout.marginBottom;
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
        if ((self.widthSpec == DoricLayoutFit || self.reassignWidth) && layout.widthSpec == DoricLayoutMost) {
            layout.measuredWidth = self.contentWidth - layout.marginLeft - layout.marginRight;
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

        if ((self.heightSpec == DoricLayoutFit || self.reassignHeight) && layout.heightSpec == DoricLayoutMost) {
            layout.measuredHeight = self.contentHeight - layout.marginTop - layout.marginBottom;
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

