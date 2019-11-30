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
//  DoricViewNode.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/30.
//

#import "DoricViewNode.h"
#import "DoricUtil.h"
#import "DoricGroupNode.h"
#import "DoricRootNode.h"
#import "DoricConstant.h"
#import "DoricSuperNode.h"
#import "DoricExtensions.h"
#import "DoricPromise.h"

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


@interface DoricViewNode ()
@property(nonatomic, strong) NSMutableDictionary *callbackIds;
@property(nonatomic, copy) NSNumber *translationX;
@property(nonatomic, copy) NSNumber *translationY;
@property(nonatomic, copy) NSNumber *scaleX;
@property(nonatomic, copy) NSNumber *scaleY;
@property(nonatomic, copy) NSNumber *rotation;
@property(nonatomic, copy) NSNumber *pivotX;
@property(nonatomic, copy) NSNumber *pivotY;
@end

@implementation DoricViewNode

- (instancetype)initWithContext:(DoricContext *)doricContext {
    if (self = [super initWithContext:doricContext]) {
        _callbackIds = [[NSMutableDictionary alloc] init];
    }
    return self;
}

- (void)initWithSuperNode:(DoricSuperNode *)superNode {
    if ([self isKindOfClass:[DoricSuperNode class]]) {
        ((DoricSuperNode *) self).reusable = superNode.reusable;
    }
    self.superNode = superNode;
    self.view = [[self build] also:^(UIView *it) {
        it.layoutConfig = [superNode generateDefaultLayoutParams];
    }];
}

- (DoricLayoutConfig *)layoutConfig {
    return self.view.layoutConfig;
}

- (UIView *)build {
    return [[UIView alloc] init];
}

- (void)blend:(NSDictionary *)props {
    self.view.layoutConfig = self.layoutConfig;
    for (NSString *key in props) {
        id value = props[key];
        [self blendView:self.view forPropName:key propValue:value];
    }
    [self transformProperties];
}

- (void)transformProperties {
    CGAffineTransform transform = CGAffineTransformIdentity;
    if (self.translationX || self.translationY) {
        transform = CGAffineTransformTranslate(transform, [self.translationX floatValue] ?: 0, [self.translationY floatValue] ?: 0);
    }
    if (self.scaleX || self.scaleY) {
        transform = CGAffineTransformScale(transform, [self.scaleX floatValue] ?: 1, [self.scaleY floatValue] ?: 1);
    }
    if (self.rotation) {
        transform = CGAffineTransformRotate(transform, (self.rotation.floatValue ?: 0) * M_PI);
    }
    if (!CGAffineTransformEqualToTransform(transform, self.view.transform)) {
        self.view.transform = transform;
    }
    if (self.pivotX || self.pivotY) {
        self.view.layer.anchorPoint = CGPointMake(self.pivotX.floatValue
                ?: 0.5f, self.pivotY.floatValue ?: 0.5f);
    }
}

- (void)blendView:(UIView *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([name isEqualToString:@"width"]) {
        NSNumber *width = (NSNumber *) prop;
        if ([width floatValue] >= 0) {
            view.width = [width floatValue];
        }
    } else if ([name isEqualToString:@"height"]) {
        NSNumber *height = (NSNumber *) prop;
        if ([height floatValue] >= 0) {
            view.height = [height floatValue];
        }
    } else if ([name isEqualToString:@"x"]) {
        view.x = [(NSNumber *) prop floatValue];
    } else if ([name isEqualToString:@"y"]) {
        view.y = [(NSNumber *) prop floatValue];
    } else if ([name isEqualToString:@"bgColor"]) {
        view.backgroundColor = DoricColor(prop);
    } else if ([name isEqualToString:@"alpha"]) {
        view.alpha = [prop floatValue];
    } else if ([name isEqualToString:@"layoutConfig"]) {
        if (self.superNode && [prop isKindOfClass:[NSDictionary class]]) {
            [self.superNode blendSubNode:self layoutConfig:prop];
        } else {
            [self blendLayoutConfig:prop];
        }
    } else if ([name isEqualToString:@"onClick"]) {
        self.callbackIds[@"onClick"] = prop;
        view.userInteractionEnabled = YES;
        UITapGestureRecognizer *tapGestureRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(onClick:)];
        [view addGestureRecognizer:tapGestureRecognizer];
    } else if ([name isEqualToString:@"border"]) {
        NSDictionary *dic = prop;
        CGFloat width = [(NSNumber *) dic[@"width"] floatValue];
        UIColor *color = DoricColor((NSNumber *) dic[@"color"]);
        view.layer.borderWidth = width;
        view.layer.borderColor = color.CGColor;
    } else if ([name isEqualToString:@"corners"]) {
        if ([prop isKindOfClass:NSNumber.class]) {
            view.layer.cornerRadius = [(NSNumber *) prop floatValue];
        } else if ([prop isKindOfClass:NSDictionary.class]) {
            NSDictionary *dic = prop;
            CGFloat leftTop = [(NSNumber *) dic[@"leftTop"] floatValue];
            CGFloat rightTop = [(NSNumber *) dic[@"rightTop"] floatValue];
            CGFloat rightBottom = [(NSNumber *) dic[@"rightBottom"] floatValue];
            CGFloat leftBottom = [(NSNumber *) dic[@"leftBottom"] floatValue];
            if (ABS(leftTop - rightTop) > CGFLOAT_MIN
                    || ABS(leftTop - rightBottom) > CGFLOAT_MIN
                    || ABS(leftTop - leftBottom) > CGFLOAT_MIN) {
                view.layer.cornerRadius = 0;
                dispatch_async(dispatch_get_main_queue(), ^{
                    CAShapeLayer *shapeLayer = [CAShapeLayer layer];
                    CGPathRef path = DoricCreateRoundedRectPath(self.view.bounds, leftTop, rightTop, rightBottom, leftBottom);
                    shapeLayer.path = path;
                    CGPathRelease(path);
                    view.layer.mask = shapeLayer;
                });
            } else {
                view.layer.cornerRadius = leftTop;
                view.layer.mask = nil;
            }
        }
    } else if ([name isEqualToString:@"shadow"]) {
        NSDictionary *dic = prop;
        CGFloat opacity = [(NSNumber *) dic[@"opacity"] floatValue];
        if (opacity > CGFLOAT_MIN) {
            view.clipsToBounds = NO;
            UIColor *color = DoricColor((NSNumber *) dic[@"color"]);
            view.layer.shadowColor = color.CGColor;
            view.layer.shadowRadius = [(NSNumber *) dic[@"radius"] floatValue];
            view.layer.shadowOffset = CGSizeMake([(NSNumber *) dic[@"offsetX"] floatValue], [(NSNumber *) dic[@"offsetY"] floatValue]);
            view.layer.shadowOpacity = (float) opacity;
        } else {
            view.clipsToBounds = YES;
        }

    } else if ([name isEqualToString:@"translationX"]) {
        self.translationX = prop;
    } else if ([name isEqualToString:@"translationY"]) {
        self.translationY = prop;
    } else if ([name isEqualToString:@"scaleX"]) {
        self.scaleX = prop;
    } else if ([name isEqualToString:@"scaleY"]) {
        self.scaleY = prop;
    } else if ([name isEqualToString:@"pivotX"]) {
        self.pivotX = prop;
    } else if ([name isEqualToString:@"pivotY"]) {
        self.pivotY = prop;
    } else if ([name isEqualToString:@"rotation"]) {
        self.rotation = prop;
    } else {
        DoricLog(@"Blend View error for View Type :%@, prop is %@", self.class, name);
    }
}

- (void)onClick:(UIView *)view {
    [self callJSResponse:self.callbackIds[@"onClick"], nil];
}

- (NSArray<NSString *> *)idList {
    NSMutableArray *ret = [[NSMutableArray alloc] init];
    DoricViewNode *node = self;
    do {
        [ret addObject:node.viewId];
        node = node.superNode;
    } while (node);

    return [[ret reverseObjectEnumerator] allObjects];
}

- (DoricAsyncResult *)callJSResponse:(NSString *)funcId, ... {
    NSMutableArray *array = [[NSMutableArray alloc] init];
    [array addObject:self.idList];
    [array addObject:funcId];
    va_list args;
    va_start(args, funcId);
    id arg;
    while ((arg = va_arg(args, id)) != nil) {
        [array addObject:arg];
    }
    DoricAsyncResult *ret = [self.doricContext callEntity:DORIC_ENTITY_RESPONSE withArgumentsArray:array];
    va_end(args);
    return ret;
}

+ (__kindof DoricViewNode *)create:(DoricContext *)context withType:(NSString *)type {
    DoricRegistry *registry = context.driver.registry;
    Class clz = [registry acquireViewNode:type];
    DoricViewNode *viewNode = [(DoricViewNode *) [clz alloc] initWithContext:context];
    viewNode.type = type;
    return viewNode;
}

- (void)requestLayout {
    [self.superNode requestLayout];
}

- (NSNumber *)getWidth {
    return @(self.view.width);
}

- (NSNumber *)getHeight {
    return @(self.view.height);
}

- (void)blendLayoutConfig:(NSDictionary *)params {
    [params[@"widthSpec"] also:^(NSNumber *it) {
        if (it) {
            self.layoutConfig.widthSpec = (DoricLayoutSpec) [it integerValue];
        }
    }];

    [params[@"heightSpec"] also:^(NSNumber *it) {
        if (it) {
            self.layoutConfig.heightSpec = (DoricLayoutSpec) [it integerValue];
        }
    }];

    NSDictionary *margin = params[@"margin"];
    if (margin) {
        self.layoutConfig.margin = DoricMarginMake(
                [(NSNumber *) margin[@"left"] floatValue],
                [(NSNumber *) margin[@"top"] floatValue],
                [(NSNumber *) margin[@"right"] floatValue],
                [(NSNumber *) margin[@"bottom"] floatValue]);
    }

    NSNumber *alignment = params[@"alignment"];
    if (alignment) {
        self.layoutConfig.alignment = (DoricGravity) [alignment integerValue];
    }
    NSNumber *weight = params[@"weight"];
    if (weight) {
        self.layoutConfig.weight = (DoricGravity) [weight integerValue];
    }
}

- (void)doAnimation:(id)params withPromise:(DoricPromise *)promise {
    CAAnimation *animation = [self parseAnimation:params];
    animation.removedOnCompletion = NO;
    animation.fillMode = kCAFillModeForwards;
    [self.view.layer addAnimation:animation forKey:nil];
}

- (CAAnimation *)parseAnimation:(id)params {
    if ([params isKindOfClass:[NSArray class]]) {
        NSArray *anims = params;
        CAAnimationGroup *animationGroup = [CAAnimationGroup animation];
        NSMutableArray *animations = [NSMutableArray new];
        [anims forEach:^(id obj) {
            [animations addObject:[self parseAnimation:obj]];
        }];
        animationGroup.animations = animations;
        return animationGroup;
    } else if ([params isKindOfClass:[NSDictionary class]]) {
        NSArray<NSDictionary *> *changeables = params[@"changeables"];
        NSString *type = params[@"type"];
        if ([@"TranslationAnimation" isEqualToString:type]) {
            __block CGPoint from = self.view.layer.position;
            __block CGPoint to = self.view.layer.position;
            CABasicAnimation *animation = [CABasicAnimation animationWithKeyPath:@"position"];
            [changeables forEach:^(NSDictionary *obj) {
                NSString *key = obj[@"key"];
                if ([@"translationX" isEqualToString:key]) {
                    from.x += [obj[@"fromValue"] floatValue];
                    to.x += [obj[@"toValue"] floatValue];
                } else if ([@"translationY" isEqualToString:key]) {
                    from.y += [obj[@"fromValue"] floatValue];
                    to.y += [obj[@"toValue"] floatValue];
                }
            }];
            animation.fromValue = [NSValue valueWithCGPoint:from];
            animation.toValue = [NSValue valueWithCGPoint:to];
            return animation;
        } else {
            CAAnimationGroup *animationGroup = [CAAnimationGroup animation];
            NSMutableArray *animations = [NSMutableArray new];
            [changeables forEach:^(NSDictionary *obj) {
                [animations addObject:[self parseChangeable:obj]];
            }];
            animationGroup.animations = animations;
            animationGroup.duration = [params[@"duration"] floatValue] / 1000;
            if (params[@"delay"]) {
                animationGroup.beginTime = CACurrentMediaTime() + [params[@"delay"] floatValue] / 1000;
            }

            return animationGroup;
        }


    }
    return nil;
}

- (CAAnimation *)parseChangeable:(NSDictionary *)params {
    NSString *key = params[@"key"];
    CABasicAnimation *animation = [CABasicAnimation animation];
    if ([@"scaleX" isEqualToString:key]) {
        animation.keyPath = @"transform.scale.x";
        animation.fromValue = params[@"fromValue"];
        animation.toValue = params[@"toValue"];
    } else if ([@"scaleY" isEqualToString:key]) {
        animation.keyPath = @"transform.scale.y";
        animation.fromValue = params[@"fromValue"];
        animation.toValue = params[@"toValue"];
    } else if ([@"rotation" isEqualToString:key]) {
        animation.keyPath = @"transform.rotation.z";
        animation.fromValue = @([params[@"fromValue"] floatValue] * M_PI);
        animation.toValue = @([params[@"toValue"] floatValue] * M_PI);
    } else if ([@"bgColor" isEqualToString:key]) {
        animation.keyPath = @"backgroundColor";
        animation.fromValue = params[@"fromValue"];
        animation.toValue = params[@"toValue"];
    }
    if (params[@"repeatCount"]) {
        NSInteger repeatCount = [params[@"repeatCount"] integerValue];
        if (repeatCount < 0) {
            repeatCount = NSNotFound;
        }
        animation.repeatCount = repeatCount;
    }
    if (params[@"repeatMode"]) {
        NSInteger repeatMode = [params[@"repeatMode"] integerValue];
        animation.autoreverses = repeatMode == 2;
    }
    return animation;
}

@end
