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

static const void *kLayoutConfig = &kLayoutConfig;

@implementation UIView (DoricLayoutConfig)
@dynamic layoutConfig;

- (void)setLayoutConfig:(DoricLayoutConfig *)layoutConfig {
    objc_setAssociatedObject(self, kLayoutConfig, layoutConfig, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (DoricLayoutConfig *)layoutConfig {
    return objc_getAssociatedObject(self, kLayoutConfig);
}

@end

static const void *kLayoutPadding = &kLayoutPadding;

@implementation UIView (DoricPadding)
@dynamic padding;

- (void)setPadding:(DoricPadding)padding {
    objc_setAssociatedObject(self, kLayoutPadding, [NSValue value:&padding withObjCType:@encode(DoricPadding)], OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (DoricPadding)padding {
    DoricPadding value;
    value.left = value.right = value.top = value.bottom = 0;
    [objc_getAssociatedObject(self, kLayoutPadding) getValue:&value];
    return value;
}

@end

static const void *kTagString = &kTagString;

@implementation UIView (DoricTag)

- (void)setTagString:(NSString *)tagString {
    objc_setAssociatedObject(self, kTagString, tagString, OBJC_ASSOCIATION_COPY_NONATOMIC);
    self.tag = [tagString hash];
}

- (NSString *)tagString {
    return objc_getAssociatedObject(self, kTagString);
}


- (UIView *)viewWithTagString:(NSString *)tagString {
    // notice the potential hash collision
    return [self viewWithTag:[tagString hash]];
}

@end


@implementation UIView (DoricLayouts)
/**
 * Measure self's size
 * */
- (CGSize)measureSize:(CGSize)targetSize {
    CGFloat width = self.width;
    CGFloat height = self.height;

    DoricLayoutConfig *config = self.layoutConfig;
    if (!config) {
        config = [DoricLayoutConfig new];
    }
    if (config.widthSpec == DoricLayoutAtMost
            || config.widthSpec == DoricLayoutWrapContent) {
        width = targetSize.width - config.margin.left - config.margin.right;
    }
    if (config.heightSpec == DoricLayoutAtMost
            || config.heightSpec == DoricLayoutWrapContent) {
        height = targetSize.height - config.margin.top - config.margin.bottom;
    }
    DoricPadding padding = self.padding;
    CGSize contentSize = [self sizeThatFits:CGSizeMake(
            width - padding.left - padding.right,
            height - padding.top - padding.bottom)];
    if (config.widthSpec == DoricLayoutWrapContent) {
        width = contentSize.width + padding.left + padding.right;
    }
    if (config.heightSpec == DoricLayoutWrapContent) {
        height = contentSize.height + padding.left + padding.top + padding.bottom;
    }
    return CGSizeMake(width, height);
}

/**
 * layout self and subviews
 * */
- (void)layoutSelf:(CGSize)targetSize {
    self.width = targetSize.width;
    self.height = targetSize.height;
    for (UIView *view in self.subviews) {
        [view layoutSelf:[view measureSize:targetSize]];
    }
}


- (void)doricLayoutSubviews {
    if ([self.superview requestFromSubview:self]) {
        [self.superview doricLayoutSubviews];
    } else {
        [self layoutSelf:CGSizeMake(self.width, self.height)];
    }
}

- (BOOL)requestFromSubview:(UIView *)subview {
    if (self.layoutConfig
            && self.layoutConfig.widthSpec != DoricLayoutExact
            && self.layoutConfig.heightSpec != DoricLayoutExact) {
        return YES;
    }
    return NO;
}
@end

DoricMargin DoricMarginMake(CGFloat left, CGFloat top, CGFloat right, CGFloat bottom) {
    DoricMargin margin;
    margin.left = left;
    margin.top = top;
    margin.right = right;
    margin.bottom = bottom;
    return margin;
}

@implementation DoricLayoutConfig
- (instancetype)init {
    if (self = [super init]) {
        _widthSpec = DoricLayoutExact;
        _heightSpec = DoricLayoutExact;
    }
    return self;
}

- (instancetype)initWithWidth:(DoricLayoutSpec)width height:(DoricLayoutSpec)height {
    if (self = [super init]) {
        _widthSpec = width;
        _heightSpec = height;
    }
    return self;
}

- (instancetype)initWithWidth:(DoricLayoutSpec)width height:(DoricLayoutSpec)height margin:(DoricMargin)margin {
    if (self = [super init]) {
        _widthSpec = width;
        _heightSpec = height;
        _margin = margin;
    }
    return self;
}
@end


@interface DoricLayoutContainer ()
@property(nonatomic, assign) CGFloat contentWidth;
@property(nonatomic, assign) CGFloat contentHeight;
@property(nonatomic, assign) NSUInteger contentWeight;
@end

@implementation DoricLayoutContainer
- (void)setNeedsLayout {
    [super setNeedsLayout];
}

- (void)layoutSubviews {
    [super layoutSubviews];
    [self doricLayoutSubviews];
}
@end


@interface DoricStackView ()
@end

@implementation DoricStackView

- (CGSize)sizeThatFits:(CGSize)size {
    CGFloat contentWidth = 0;
    CGFloat contentHeight = 0;
    for (UIView *child in self.subviews) {
        if (child.isHidden) {
            continue;
        }
        DoricLayoutConfig *childConfig = child.layoutConfig;
        if (!childConfig) {
            childConfig = [DoricLayoutConfig new];
        }
        CGSize childSize;
        if (CGAffineTransformEqualToTransform(child.transform, CGAffineTransformIdentity)) {
            childSize = [child measureSize:CGSizeMake(size.width, size.height)];
        } else {
            childSize = child.bounds.size;
        }
        contentWidth = MAX(contentWidth, childSize.width + childConfig.margin.left + childConfig.margin.right);
        contentHeight = MAX(contentHeight, childSize.height + childConfig.margin.top + childConfig.margin.bottom);
    }
    self.contentWidth = contentWidth;
    self.contentHeight = contentHeight;
    return CGSizeMake(contentWidth, contentHeight);
}

- (void)layoutSelf:(CGSize)targetSize {
    self.width = targetSize.width;
    self.height = targetSize.height;
    DoricPadding padding = self.padding;

    for (UIView *child in self.subviews) {
        if (child.isHidden) {
            continue;
        }
        if (!CGAffineTransformEqualToTransform(child.transform, CGAffineTransformIdentity)) {
            continue;
        }
        DoricLayoutConfig *childConfig = child.layoutConfig;
        if (!childConfig) {
            childConfig = [DoricLayoutConfig new];
        }
        CGSize size = [child measureSize:CGSizeMake(
                targetSize.width - padding.left - padding.right,
                targetSize.height - padding.top - padding.bottom)];
        [child layoutSelf:size];
        DoricGravity gravity = childConfig.alignment;
        if ((gravity & LEFT) == LEFT) {
            child.left = padding.left;
        } else if ((gravity & RIGHT) == RIGHT) {
            child.right = targetSize.width - padding.right;
        } else if ((gravity & CENTER_X) == CENTER_X) {
            child.centerX = targetSize.width / 2;
        } else {
            if (childConfig.margin.left) {
                child.left = childConfig.margin.left + padding.left;
            } else if (childConfig.margin.right) {
                child.right = targetSize.width - childConfig.margin.right - padding.right;
            }
        }
        if ((gravity & TOP) == TOP) {
            child.top = padding.top;
        } else if ((gravity & BOTTOM) == BOTTOM) {
            child.bottom = targetSize.height - padding.bottom;
        } else if ((gravity & CENTER_Y) == CENTER_Y) {
            child.centerY = targetSize.height / 2;
        } else {
            if (childConfig.margin.top) {
                child.top = childConfig.margin.top + padding.top;
            } else if (childConfig.margin.bottom) {
                child.bottom = targetSize.height - childConfig.margin.bottom - padding.bottom;
            }
        }
    }
}
@end

@implementation DoricLinearView
@end

@implementation DoricVLayoutView

- (CGSize)sizeThatFits:(CGSize)size {
    CGFloat contentWidth = 0;
    CGFloat contentHeight = 0;
    NSUInteger contentWeight = 0;
    for (UIView *child in self.subviews) {
        if (child.isHidden) {
            continue;
        }
        DoricLayoutConfig *childConfig = child.layoutConfig;
        if (!childConfig) {
            childConfig = [DoricLayoutConfig new];
        }
        CGSize childSize;
        if (CGAffineTransformEqualToTransform(child.transform, CGAffineTransformIdentity)) {
            childSize = [child measureSize:CGSizeMake(size.width, size.height - contentHeight)];
        } else {
            childSize = child.bounds.size;
        }
        contentWidth = MAX(contentWidth, childSize.width + childConfig.margin.left + childConfig.margin.right);
        contentHeight += childSize.height + self.space + childConfig.margin.top + childConfig.margin.bottom;
        contentWeight += childConfig.weight;
    }
    contentHeight -= self.space;
    self.contentWidth = contentWidth;
    self.contentHeight = contentHeight;
    self.contentWeight = contentWeight;
    if (contentWeight) {
        contentHeight = size.height;
    }
    return CGSizeMake(contentWidth, contentHeight);
}

- (void)layoutSelf:(CGSize)targetSize {
    self.width = targetSize.width;
    self.height = targetSize.height;
    DoricPadding padding = self.padding;
    CGFloat yStart = padding.top;
    if ((self.gravity & TOP) == TOP) {
        yStart = padding.top;
    } else if ((self.gravity & BOTTOM) == BOTTOM) {
        yStart = targetSize.height - self.contentHeight - padding.bottom;
    } else if ((self.gravity & CENTER_Y) == CENTER_Y) {
        yStart = (targetSize.height - self.contentHeight - padding.top - padding.bottom) / 2 + padding.top;
    }
    CGFloat remain = targetSize.height - self.contentHeight - padding.top - padding.bottom;
    for (UIView *child in self.subviews) {
        if (child.isHidden) {
            continue;
        }
        if (!CGAffineTransformEqualToTransform(child.transform, CGAffineTransformIdentity)) {
            continue;
        }
        DoricLayoutConfig *childConfig = child.layoutConfig;
        if (!childConfig) {
            childConfig = [DoricLayoutConfig new];
        }

        CGSize size = [child measureSize:CGSizeMake(
                targetSize.width - padding.left - padding.right,
                targetSize.height - yStart - padding.bottom)];
        if (childConfig.weight) {
            size.height += remain / self.contentWeight * childConfig.weight;
        }
        [child layoutSelf:size];
        DoricGravity gravity = childConfig.alignment | self.gravity;
        if ((gravity & LEFT) == LEFT) {
            child.left = padding.left;
        } else if ((gravity & RIGHT) == RIGHT) {
            child.right = self.width - padding.right;
        } else if ((gravity & CENTER_X) == CENTER_X) {
            child.centerX = targetSize.width / 2;
        } else if (childConfig.margin.left) {
            child.left = childConfig.margin.left + padding.left;
        } else if (childConfig.margin.right) {
            child.right = targetSize.width - childConfig.margin.right - padding.right;
        } else {
            child.left = padding.left;
        }
        if (childConfig.margin.top) {
            yStart += childConfig.margin.top;
        }
        child.top = yStart;
        yStart = child.bottom + self.space;
        if (childConfig.margin.bottom) {
            yStart += childConfig.margin.bottom;
        }
    }
}
@end

@implementation DoricHLayoutView
- (CGSize)sizeThatFits:(CGSize)size {
    CGFloat contentWidth = 0;
    CGFloat contentHeight = 0;
    NSUInteger contentWeight = 0;
    for (UIView *child in self.subviews) {
        if (child.isHidden) {
            continue;
        }
        DoricLayoutConfig *childConfig = child.layoutConfig;
        if (!childConfig) {
            childConfig = [DoricLayoutConfig new];
        }
        CGSize childSize;
        if (CGAffineTransformEqualToTransform(child.transform, CGAffineTransformIdentity)) {
            childSize = [child measureSize:CGSizeMake(size.width - contentWidth, size.height)];
        } else {
            childSize = child.bounds.size;
        }
        contentWidth += childSize.width + self.space + childConfig.margin.left + childConfig.margin.right;
        contentHeight = MAX(contentHeight, childSize.height + childConfig.margin.top + childConfig.margin.bottom);
        contentWeight += childConfig.weight;
    }
    contentWidth -= self.space;
    self.contentWidth = contentWidth;
    self.contentHeight = contentHeight;
    self.contentWeight = contentWeight;
    if (contentWeight) {
        contentWidth = size.width;
    }
    return CGSizeMake(contentWidth, contentHeight);
}

- (void)layoutSelf:(CGSize)targetSize {
    self.width = targetSize.width;
    self.height = targetSize.height;
    DoricPadding padding = self.padding;
    CGFloat xStart = padding.left;
    if ((self.gravity & LEFT) == LEFT) {
        xStart = padding.left;
    } else if ((self.gravity & RIGHT) == RIGHT) {
        xStart = targetSize.width - self.contentWidth - padding.right;
    } else if ((self.gravity & CENTER_X) == CENTER_X) {
        xStart = (targetSize.width - self.contentWidth - padding.left - padding.right) / 2 + padding.left;
    }
    CGFloat remain = targetSize.width - self.contentWidth - padding.left - padding.right;
    for (UIView *child in self.subviews) {
        if (child.isHidden) {
            continue;
        }
        if (!CGAffineTransformEqualToTransform(child.transform, CGAffineTransformIdentity)) {
            continue;
        }
        DoricLayoutConfig *childConfig = child.layoutConfig;
        if (!childConfig) {
            childConfig = [DoricLayoutConfig new];
        }

        CGSize size = [child measureSize:CGSizeMake(
                targetSize.width - xStart - padding.right,
                targetSize.height - padding.top - padding.bottom)];
        if (childConfig.weight) {
            size.width += remain / self.contentWeight * childConfig.weight;
        }

        [child layoutSelf:size];

        DoricGravity gravity = childConfig.alignment | self.gravity;
        if ((gravity & TOP) == TOP) {
            child.top = padding.top;
        } else if ((gravity & BOTTOM) == BOTTOM) {
            child.bottom = targetSize.height - padding.bottom;
        } else if ((gravity & CENTER_Y) == CENTER_Y) {
            child.centerY = targetSize.height / 2;
        } else if (childConfig.margin.top) {
            child.top = childConfig.margin.top + padding.top;
        } else if (childConfig.margin.bottom) {
            child.bottom = targetSize.height - childConfig.margin.bottom - padding.bottom;
        } else {
            child.top = padding.top;
        }

        if (childConfig.margin.left) {
            xStart += childConfig.margin.left;
        }
        child.left = xStart;
        xStart = child.right + self.space;
        if (childConfig.margin.right) {
            xStart += childConfig.margin.right;
        }
    }
}
@end


DoricVLayoutView *vLayout(NSArray <__kindof UIView *> *views) {
    DoricVLayoutView *layout = [[DoricVLayoutView alloc] initWithFrame:CGRectZero];
    for (__kindof UIView *uiView in views) {
        [layout addSubview:uiView];
    }
    layout.layoutConfig = [[DoricLayoutConfig alloc] initWithWidth:DoricLayoutWrapContent height:DoricLayoutWrapContent];
    return layout;
}

DoricHLayoutView *hLayout(NSArray <__kindof UIView *> *views) {
    DoricHLayoutView *layout = [[DoricHLayoutView alloc] initWithFrame:CGRectZero];
    for (__kindof UIView *uiView in views) {
        [layout addSubview:uiView];
    }
    layout.layoutConfig = [[DoricLayoutConfig alloc] initWithWidth:DoricLayoutWrapContent height:DoricLayoutWrapContent];
    return layout;
}
