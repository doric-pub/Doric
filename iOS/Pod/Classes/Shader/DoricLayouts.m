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
@end

@implementation DoricMarginConfig
- (instancetype)init {
    if (self = [super init]) {
        _margin = DoricMarginMake(0, 0, 0, 0);
    }
    return self;
}

- (instancetype)initWithWidth:(DoricLayoutSpec)width height:(DoricLayoutSpec)height margin:(DoricMargin)margin {
    if (self = [super initWithWidth:width height:height]) {
        _margin = margin;
    }
    return self;
}
@end

@implementation DoricStackConfig
@end

@implementation DoricLinearConfig
@end


@interface DoricLayoutContainer ()
@property(nonatomic, assign) BOOL waitingLayout;
@end

@implementation DoricLayoutContainer
- (instancetype)init {
    if (self = [super init]) {
        _waitingLayout = NO;
    }
    return self;
}

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        _waitingLayout = NO;
    }
    return self;
}

- (instancetype)initWithCoder:(NSCoder *)coder {
    if (self = [super initWithCoder:coder]) {
        _waitingLayout = NO;
    }
    return self;
}


- (DoricLayoutConfig *)configForChild:(UIView *)child {
    DoricLayoutConfig *config = child.layoutConfig;
    if (!config) {
        config = [[DoricLayoutConfig alloc] init];
    }
    return config;
}

- (void)requestLayout {
    if ([self.superview isKindOfClass:[DoricLinearView class]]) {
        [(DoricLinearView *) self.superview requestLayout];
        return;
    }
    if (self.waitingLayout) {
        return;
    }
    self.waitingLayout = YES;
    dispatch_async(dispatch_get_main_queue(), ^{
        self.waitingLayout = NO;
        [self sizeToFit];
        [self layout];
    });
}

- (void)layoutSubviews {
    [super layoutSubviews];
    [self requestLayout];
}

- (void)layout {
    [self.subviews enumerateObjectsUsingBlock:^(__kindof UIView *child, NSUInteger idx, BOOL *stop) {
        if ([child isKindOfClass:[DoricLayoutContainer class]]) {
            [(DoricLayoutContainer *) child layout];
        }
    }];
}

@end


@interface DoricStackView ()

@property(nonatomic, assign) CGFloat contentWidth;
@property(nonatomic, assign) CGFloat contentHeight;
@end

@implementation DoricStackView
- (DoricStackConfig *)configForChild:(UIView *)child {
    DoricStackConfig *config = (DoricStackConfig *) child.layoutConfig;
    if (!config) {
        config = [[DoricStackConfig alloc] init];
    }
    return config;
}


- (void)sizeToFit {
    DoricLayoutConfig *config = self.layoutConfig;
    self.contentWidth = 0;
    self.contentHeight = 0;
    for (UIView *child in self.subviews) {
        if (child.isHidden) {
            continue;
        }
        DoricStackConfig *childConfig = [self configForChild:child];
        if ([child isKindOfClass:[DoricLayoutContainer class]]
                || childConfig.widthSpec == DoricLayoutWrapContent
                || childConfig.heightSpec == DoricLayoutWrapContent) {
            [child sizeToFit];
        }
        self.contentWidth = MAX(self.contentWidth, child.width);
        self.contentHeight = MAX(self.contentHeight, child.height);
    }
    if (config.widthSpec == DoricLayoutWrapContent) {
        self.width = self.contentWidth;
    } else if (config.widthSpec == DoricLayoutAtMost) {
        self.width = self.superview.width;
    }
    if (config.heightSpec == DoricLayoutWrapContent) {
        self.height = self.contentHeight;
    } else if (config.heightSpec == DoricLayoutAtMost) {
        self.height = self.superview.height;
    }
}

- (void)layout {
    for (UIView *child in self.subviews) {
        if (child.isHidden) {
            continue;
        }
        DoricStackConfig *childConfig = [self configForChild:child];
        DoricGravity gravity = childConfig.alignment | self.gravity;
        if ((gravity & LEFT) == LEFT) {
            child.left = 0;
        } else if ((gravity & RIGHT) == RIGHT) {
            child.right = self.width;
        } else if ((gravity & CENTER_X) == CENTER_X) {
            child.centerX = self.width / 2;
        }
        if ((gravity & TOP) == TOP) {
            child.top = 0;
        } else if ((gravity & BOTTOM) == BOTTOM) {
            child.bottom = self.height;
        } else if ((gravity & CENTER_Y) == CENTER_Y) {
            child.centerY = self.height / 2;
        }
        if (childConfig.widthSpec == DoricLayoutAtMost) {
            child.width = self.width;
        }
        if (childConfig.heightSpec == DoricLayoutAtMost) {
            child.height = self.height;
        }

        if ([child isKindOfClass:[DoricLayoutContainer class]]) {
            [(DoricLayoutContainer *) child layout];
        }
    }
}
@end

@interface DoricLinearView ()
@property(nonatomic, assign) CGFloat contentWidth;
@property(nonatomic, assign) CGFloat contentHeight;
@property(nonatomic, assign) NSUInteger contentWeight;
@end

@implementation DoricLinearView
- (DoricLinearConfig *)configForChild:(UIView *)child {
    DoricLinearConfig *config = (DoricLinearConfig *) child.layoutConfig;
    if (!config) {
        config = [[DoricLinearConfig alloc] init];
    }
    return config;
}
@end

@implementation DoricVLayoutView

- (void)sizeToFit {
    DoricLayoutConfig *config = self.layoutConfig;
    self.contentWidth = 0;
    self.contentHeight = 0;
    self.contentWeight = 0;
    for (UIView *child in self.subviews) {
        if (child.isHidden) {
            continue;
        }
        DoricLinearConfig *childConfig = [self configForChild:child];
        if ([child isKindOfClass:[DoricLayoutContainer class]]
                || childConfig.widthSpec == DoricLayoutWrapContent
                || childConfig.heightSpec == DoricLayoutWrapContent) {
            [child sizeToFit];
        }
        self.contentWidth = MAX(self.contentWidth, child.width + childConfig.margin.left + childConfig.margin.right);
        self.contentHeight += child.height + self.space + childConfig.margin.top + childConfig.margin.bottom;
        self.contentWeight += childConfig.weight;
    }
    self.contentHeight -= self.space;
    if (config.widthSpec == DoricLayoutWrapContent) {
        self.width = self.contentWidth;
    } else if (config.widthSpec == DoricLayoutAtMost) {
        self.width = self.superview.width;
    }
    if (config.heightSpec == DoricLayoutWrapContent) {
        self.height = self.contentHeight;
    } else if (config.heightSpec == DoricLayoutAtMost) {
        self.height = self.superview.height;
    }
    if (self.contentWeight) {
        CGFloat remain = self.height - self.contentHeight;
        for (UIView *child in self.subviews) {
            if (child.isHidden) {
                continue;
            }
            DoricLinearConfig *childConfig = [self configForChild:child];
            if (childConfig.weight) {
                child.height += remain / self.contentWeight * childConfig.weight;
            }
        }
        self.contentHeight = self.height;
    }
}

- (void)layout {
    CGFloat yStart = 0;
    if ((self.gravity & TOP) == TOP) {
        yStart = 0;
    } else if ((self.gravity & BOTTOM) == BOTTOM) {
        yStart = self.height - self.contentHeight;
    } else if ((self.gravity & CENTER_Y) == CENTER_Y) {
        yStart = (self.height - self.contentHeight) / 2;
    }
    for (UIView *child in self.subviews) {
        if (child.isHidden) {
            continue;
        }
        DoricLinearConfig *childConfig = [self configForChild:child];
        DoricGravity gravity = childConfig.alignment | self.gravity;
        if ((gravity & LEFT) == LEFT) {
            child.left = 0;
        } else if ((gravity & RIGHT) == RIGHT) {
            child.right = self.width;
        } else if ((gravity & CENTER_X) == CENTER_X) {
            child.centerX = self.width / 2;
        } else {
            if (childConfig.margin.left) {
                child.left = childConfig.margin.left;
            } else if (childConfig.margin.right) {
                child.right = self.width - childConfig.margin.right;
            }
        }
        if (childConfig.widthSpec == DoricLayoutAtMost) {
            child.width = self.width;
        }
        if (childConfig.heightSpec == DoricLayoutAtMost) {
            child.height = self.height - yStart - childConfig.margin.top - childConfig.margin.bottom - self.space;
        }
        if (childConfig.margin.top) {
            yStart += childConfig.margin.top;
        }
        child.top = yStart;
        yStart = child.bottom + self.space;
        if (childConfig.margin.bottom) {
            yStart += childConfig.margin.bottom;
        }
        if ([child isKindOfClass:[DoricLayoutContainer class]]) {
            [(DoricLayoutContainer *) child layout];
        }
    }
}
@end

@implementation DoricHLayoutView
- (void)sizeToFit {
    DoricLinearConfig *config;
    if ([self.superview isKindOfClass:[DoricLinearView class]]) {
        config = [(DoricLinearView *) self.superview configForChild:self];
    } else {
        config = (DoricLinearConfig *) self.layoutConfig;
        if (!config) {
            config = [[DoricLinearConfig alloc] init];
        }
    }
    self.contentWidth = 0;
    self.contentHeight = 0;
    self.contentWeight = 0;
    for (UIView *child in self.subviews) {
        if (child.isHidden) {
            continue;
        }
        DoricLinearConfig *childConfig = [self configForChild:child];
        if ([child isKindOfClass:[DoricLayoutContainer class]]
                || childConfig.widthSpec == DoricLayoutWrapContent
                || childConfig.heightSpec == DoricLayoutWrapContent) {
            [child sizeToFit];
        }
        self.contentHeight = MAX(self.contentHeight, child.height + childConfig.margin.top + childConfig.margin.bottom);
        self.contentWidth += child.width + self.space + childConfig.margin.left + childConfig.margin.right;
        self.contentWeight += childConfig.weight;
    }
    self.contentWidth -= self.space;
    if (config.widthSpec == DoricLayoutWrapContent) {
        self.width = self.contentWidth;
    } else if (config.widthSpec == DoricLayoutAtMost) {
        self.width = self.superview.width;
    }
    if (config.heightSpec == DoricLayoutWrapContent) {
        self.height = self.contentHeight;
    } else if (config.heightSpec == DoricLayoutAtMost) {
        self.height = self.superview.height;
    }
    if (self.contentWeight) {
        CGFloat remain = self.width - self.contentWidth;
        for (UIView *child in self.subviews) {
            if (child.isHidden) {
                continue;
            }
            DoricLinearConfig *childConfig = [self configForChild:child];
            if (childConfig.weight) {
                child.width += remain / self.contentWeight * childConfig.weight;
            }
        }
        self.contentWidth = self.width;
    }
}

- (void)layout {
    CGFloat xStart = 0;
    if ((self.gravity & LEFT) == LEFT) {
        xStart = 0;
    } else if ((self.gravity & RIGHT) == RIGHT) {
        xStart = self.width - self.contentWidth;
    } else if ((self.gravity & CENTER_X) == CENTER_X) {
        xStart = (self.width - self.contentWidth) / 2;
    }
    for (UIView *child in self.subviews) {
        if (child.isHidden) {
            continue;
        }
        DoricLinearConfig *childConfig = [self configForChild:child];
        DoricGravity gravity = childConfig.alignment | self.gravity;
        if ((gravity & TOP) == TOP) {
            child.top = 0;
        } else if ((gravity & BOTTOM) == BOTTOM) {
            child.bottom = self.height;
        } else if ((gravity & CENTER_Y) == CENTER_Y) {
            child.centerY = self.height / 2;
        } else {
            if (childConfig.margin.top) {
                child.top = childConfig.margin.top;
            } else if (childConfig.margin.bottom) {
                child.bottom = self.height - childConfig.margin.bottom;
            }
        }

        if (childConfig.heightSpec == DoricLayoutAtMost) {
            child.height = self.height;
        }
        if (childConfig.widthSpec == DoricLayoutAtMost) {
            child.width = self.width - xStart - childConfig.margin.right - childConfig.margin.left - self.space;
        }

        if (childConfig.margin.left) {
            xStart += childConfig.margin.left;
        }
        child.left = xStart;
        xStart = child.right + self.space;
        if (childConfig.margin.right) {
            xStart += childConfig.margin.right;
        }
        if ([child isKindOfClass:[DoricLayoutContainer class]]) {
            [(DoricLayoutContainer *) child layout];
        }
    }
}
@end

static const void *kLayoutConfig = &kLayoutConfig;
static const void *kTagString = &kTagString;

@implementation UIView (DoricLayoutConfig)
@dynamic layoutConfig;

- (void)setLayoutConfig:(DoricLayoutConfig *)layoutConfig {
    objc_setAssociatedObject(self, kLayoutConfig, layoutConfig, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (DoricLayoutConfig *)layoutConfig {
    return objc_getAssociatedObject(self, kLayoutConfig);
}

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

DoricVLayoutView *vLayoutWithBlock(NSArray <UIView *(^)()> *blocks) {
    DoricVLayoutView *layout = [[DoricVLayoutView alloc] initWithFrame:CGRectZero];
    UIView *(^block)();
    for (block in blocks) {
        [layout addSubview:block()];
    }
    layout.layoutConfig = [[DoricLayoutConfig alloc] initWithWidth:DoricLayoutWrapContent height:DoricLayoutWrapContent];
    return layout;
}

DoricHLayoutView *hLayoutWithBlock(NSArray <UIView *(^)()> *blocks) {
    DoricHLayoutView *layout = [[DoricHLayoutView alloc] initWithFrame:CGRectZero];
    UIView *(^block)();
    for (block in blocks) {
        [layout addSubview:block()];
    }
    layout.layoutConfig = [[DoricLayoutConfig alloc] initWithWidth:DoricLayoutWrapContent height:DoricLayoutWrapContent];
    return layout;
}
