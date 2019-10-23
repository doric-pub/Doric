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

#import "DoricLinearLayout.h"
#import <objc/runtime.h>
#import "UIView+Doric.h"

Margin MarginMake(CGFloat left, CGFloat top, CGFloat right, CGFloat bottom) {
    Margin margin;
    margin.left = left;
    margin.top = top;
    margin.right = right;
    margin.bottom = bottom;
    return margin;
}

@implementation LayoutConfig
- (instancetype)init {
    if (self = [super init]) {
        _widthSpec = LayoutParamExact;
        _heightSpec = LayoutParamExact;
    }
    return self;
}

- (instancetype)initWithWidth:(LayoutParam)width height:(LayoutParam)height {
    if (self = [super init]) {
        _widthSpec = width;
        _heightSpec = height;
    }
    return self;
}
@end

@implementation MarginLayoutConfig
- (instancetype)init {
    if (self = [super init]) {
        _margin = MarginMake(0, 0, 0, 0);
    }
    return self;
}

- (instancetype)initWithWidth:(LayoutParam)width height:(LayoutParam)height margin:(Margin)margin {
    if (self = [super initWithWidth:width height:height]) {
        _margin = margin;
    }
    return self;
}
@end

@implementation StackLayoutConfig
@end

@implementation LinearLayoutConfig
@end


@interface LayoutContainer ()
@property(nonatomic, assign) BOOL waitingLayout;
@end

@implementation LayoutContainer
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


- (LayoutConfig *)configForChild:(UIView *)child {
    LayoutConfig *config = child.layoutConfig;
    if (!config) {
        config = [[LayoutConfig alloc] init];
    }
    return config;
}

- (void)requestLayout {
    if ([self.superview isKindOfClass:[LinearLayout class]]) {
        [(LinearLayout *) self.superview requestLayout];
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
        if ([child isKindOfClass:[LayoutContainer class]]) {
            [(LayoutContainer *) child layout];
        }
    }];
}

@end


@interface Stack ()

@property(nonatomic, assign) CGFloat contentWidth;
@property(nonatomic, assign) CGFloat contentHeight;
@end

@implementation Stack
- (StackLayoutConfig *)configForChild:(UIView *)child {
    StackLayoutConfig *config = (StackLayoutConfig *) child.layoutConfig;
    if (!config) {
        config = [[StackLayoutConfig alloc] init];
    }
    return config;
}


- (void)sizeToFit {
    LayoutConfig *config = self.layoutConfig;
    self.contentWidth = 0;
    self.contentHeight = 0;
    for (UIView *child in self.subviews) {
        if (child.isHidden) {
            continue;
        }
        StackLayoutConfig *childConfig = [self configForChild:child];
        if ([child isKindOfClass:[LayoutContainer class]]
                || childConfig.widthSpec == LayoutParamWrapContent
                || childConfig.heightSpec == LayoutParamWrapContent) {
            [child sizeToFit];
        }
        self.contentWidth = MAX(self.contentWidth, child.width);
        self.contentHeight = MAX(self.contentHeight, child.height);
    }
    if (config.widthSpec == LayoutParamWrapContent) {
        self.width = self.contentWidth;
    } else if (config.widthSpec == LayoutParamAtMost) {
        self.width = self.superview.width;
    }
    if (config.heightSpec == LayoutParamWrapContent) {
        self.height = self.contentHeight;
    } else if (config.heightSpec == LayoutParamAtMost) {
        self.height = self.superview.height;
    }
}

- (void)layout {
    for (UIView *child in self.subviews) {
        if (child.isHidden) {
            continue;
        }
        StackLayoutConfig *childConfig = [self configForChild:child];
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
        if (childConfig.widthSpec == LayoutParamAtMost) {
            child.width = self.width;
        }
        if (childConfig.heightSpec == LayoutParamAtMost) {
            child.height = self.height;
        }

        if ([child isKindOfClass:[LayoutContainer class]]) {
            [(LayoutContainer *) child layout];
        }
    }
}
@end

@interface LinearLayout ()
@property(nonatomic, assign) CGFloat contentWidth;
@property(nonatomic, assign) CGFloat contentHeight;
@property(nonatomic, assign) NSUInteger contentWeight;
@end

@implementation LinearLayout
- (LinearLayoutConfig *)configForChild:(UIView *)child {
    LinearLayoutConfig *config = (LinearLayoutConfig *) child.layoutConfig;
    if (!config) {
        config = [[LinearLayoutConfig alloc] init];
    }
    return config;
}
@end

@implementation VLayout

- (void)sizeToFit {
    LayoutConfig *config = self.layoutConfig;
    self.contentWidth = 0;
    self.contentHeight = 0;
    self.contentWeight = 0;
    for (UIView *child in self.subviews) {
        if (child.isHidden) {
            continue;
        }
        LinearLayoutConfig *childConfig = [self configForChild:child];
        if ([child isKindOfClass:[LayoutContainer class]]
                || childConfig.widthSpec == LayoutParamWrapContent
                || childConfig.heightSpec == LayoutParamWrapContent) {
            [child sizeToFit];
        }
        self.contentWidth = MAX(self.contentWidth, child.width + childConfig.margin.left + childConfig.margin.right);
        self.contentHeight += child.height + self.space + childConfig.margin.top + childConfig.margin.bottom;
        self.contentWeight += childConfig.weight;
    }
    self.contentHeight -= self.space;
    if (config.widthSpec == LayoutParamWrapContent) {
        self.width = self.contentWidth;
    } else if (config.widthSpec == LayoutParamAtMost) {
        self.width = self.superview.width;
    }
    if (config.heightSpec == LayoutParamWrapContent) {
        self.height = self.contentHeight;
    } else if (config.heightSpec == LayoutParamAtMost) {
        self.height = self.superview.height;
    }
    if (self.contentWeight) {
        CGFloat remain = self.height - self.contentHeight;
        for (UIView *child in self.subviews) {
            if (child.isHidden) {
                continue;
            }
            LinearLayoutConfig *childConfig = [self configForChild:child];
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
        LinearLayoutConfig *childConfig = [self configForChild:child];
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
        if (childConfig.widthSpec == LayoutParamAtMost) {
            child.width = self.width;
        }
        if (childConfig.heightSpec == LayoutParamAtMost) {
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
        if ([child isKindOfClass:[LayoutContainer class]]) {
            [(LayoutContainer *) child layout];
        }
    }
}
@end

@implementation HLayout
- (void)sizeToFit {
    LinearLayoutConfig *config;
    if ([self.superview isKindOfClass:[LinearLayout class]]) {
        config = [(LinearLayout *) self.superview configForChild:self];
    } else {
        config = (LinearLayoutConfig *) self.layoutConfig;
        if (!config) {
            config = [[LinearLayoutConfig alloc] init];
        }
    }
    self.contentWidth = 0;
    self.contentHeight = 0;
    self.contentWeight = 0;
    for (UIView *child in self.subviews) {
        if (child.isHidden) {
            continue;
        }
        LinearLayoutConfig *childConfig = [self configForChild:child];
        if ([child isKindOfClass:[LayoutContainer class]]
                || childConfig.widthSpec == LayoutParamWrapContent
                || childConfig.heightSpec == LayoutParamWrapContent) {
            [child sizeToFit];
        }
        self.contentHeight = MAX(self.contentHeight, child.height + childConfig.margin.top + childConfig.margin.bottom);
        self.contentWidth += child.width + self.space + childConfig.margin.left + childConfig.margin.right;
        self.contentWeight += childConfig.weight;
    }
    self.contentWidth -= self.space;
    if (config.widthSpec == LayoutParamWrapContent) {
        self.width = self.contentWidth;
    } else if (config.widthSpec == LayoutParamAtMost) {
        self.width = self.superview.width;
    }
    if (config.heightSpec == LayoutParamWrapContent) {
        self.height = self.contentHeight;
    } else if (config.heightSpec == LayoutParamAtMost) {
        self.height = self.superview.height;
    }
    if (self.contentWeight) {
        CGFloat remain = self.width - self.contentWidth;
        for (UIView *child in self.subviews) {
            if (child.isHidden) {
                continue;
            }
            LinearLayoutConfig *childConfig = [self configForChild:child];
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
        LinearLayoutConfig *childConfig = [self configForChild:child];
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

        if (childConfig.heightSpec == LayoutParamAtMost) {
            child.height = self.height;
        }
        if (childConfig.widthSpec == LayoutParamAtMost) {
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
        if ([child isKindOfClass:[LayoutContainer class]]) {
            [(LayoutContainer *) child layout];
        }
    }
}
@end

static const void *kLayoutConfig = &kLayoutConfig;
static const void *kTagString = &kTagString;

@implementation UIView (LayoutConfig)
@dynamic layoutConfig;

- (void)setLayoutConfig:(LayoutConfig *)layoutConfig {
    objc_setAssociatedObject(self, kLayoutConfig, layoutConfig, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (LayoutConfig *)layoutConfig {
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

VLayout *vLayout(NSArray <__kindof UIView *> *views) {
    VLayout *layout = [[VLayout alloc] initWithFrame:CGRectZero];
    for (__kindof UIView *uiView in views) {
        [layout addSubview:uiView];
    }
    layout.layoutConfig = [[LayoutConfig alloc] initWithWidth:LayoutParamWrapContent height:LayoutParamWrapContent];
    return layout;
}

HLayout *hLayout(NSArray <__kindof UIView *> *views) {
    HLayout *layout = [[HLayout alloc] initWithFrame:CGRectZero];
    for (__kindof UIView *uiView in views) {
        [layout addSubview:uiView];
    }
    layout.layoutConfig = [[LayoutConfig alloc] initWithWidth:LayoutParamWrapContent height:LayoutParamWrapContent];
    return layout;
}

VLayout *vLayoutWithBlock(NSArray <UIView *(^)()> *blocks) {
    VLayout *layout = [[VLayout alloc] initWithFrame:CGRectZero];
    UIView *(^block)();
    for (block in blocks) {
        [layout addSubview:block()];
    }
    layout.layoutConfig = [[LayoutConfig alloc] initWithWidth:LayoutParamWrapContent height:LayoutParamWrapContent];
    return layout;
}

HLayout *hLayoutWithBlock(NSArray <UIView *(^)()> *blocks) {
    HLayout *layout = [[HLayout alloc] initWithFrame:CGRectZero];
    UIView *(^block)();
    for (block in blocks) {
        [layout addSubview:block()];
    }
    layout.layoutConfig = [[LayoutConfig alloc] initWithWidth:LayoutParamWrapContent height:LayoutParamWrapContent];
    return layout;
}