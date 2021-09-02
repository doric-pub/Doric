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
#import "DoricFlexNode.h"
#import "DoricErrorHintNode.h"

@interface AnimationCallback : NSObject <CAAnimationDelegate>
@property(nonatomic, strong) NSMutableDictionary *dictionary;
@property(nonatomic, strong) void (^startBlock)(AnimationCallback *callback);

@property(nonatomic, strong) void (^endBlock)(AnimationCallback *callback);

@property(nonatomic, strong) void (^cancelBlock)(void);
@property(nonatomic, strong) void (^clearBlock)(void);

@end

@implementation AnimationCallback
- (instancetype)init {
    if (self = [super init]) {
        _dictionary = [NSMutableDictionary new];
    }
    return self;
}

- (void)animationDidStart:(CAAnimation *)anim {
    if (self.startBlock) {
        self.startBlock(self);
    }
}

- (void)animationDidStop:(CAAnimation *)anim finished:(BOOL)flag {
    if (self.endBlock) {
        self.endBlock(self);
    }
}
@end

@interface DoricViewNode ()
@property(nonatomic, strong) NSMutableDictionary *callbackIds;
@property(nonatomic, copy) NSNumber *translationX;
@property(nonatomic, copy) NSNumber *translationY;
@property(nonatomic, copy) NSNumber *scaleX;
@property(nonatomic, copy) NSNumber *scaleY;
@property(nonatomic, copy) NSNumber *rotation;
@property(nonatomic, copy) NSNumber *rotationX;
@property(nonatomic, copy) NSNumber *rotationY;
@property(nonatomic, copy) NSNumber *pivotX;
@property(nonatomic, copy) NSNumber *pivotY;
@property(nonatomic, strong) NSDictionary *gradientProps;
@property(nonatomic, assign) CGSize gradientSize;
@property(nonatomic, assign) CGFloat perspective;
@end

@implementation DoricViewNode

- (instancetype)initWithContext:(DoricContext *)doricContext {
    if (self = [super initWithContext:doricContext]) {
        _callbackIds = [[NSMutableDictionary alloc] init];
        _perspective = 200;
    }
    return self;
}

- (void)initWithSuperNode:(DoricSuperNode *)superNode {
    if ([self isKindOfClass:[DoricSuperNode class]]) {
        ((DoricSuperNode *) self).reusable = superNode.reusable;
    }
    self.superNode = superNode;
    self.view = [self build];
    self.view.clipsToBounds = YES;
}

- (UIView *)build {
    return [[UIView alloc] init];
}

- (void)blend:(NSDictionary *)props {
    for (NSString *key in props) {
        id value = props[key];
        if (!value || [value isKindOfClass:[NSNull class]]) {
            continue;
        }
        [self blendView:self.view forPropName:key propValue:value];
    }
    [self afterBlended:props];
    [self transformProperties];
}

- (void)afterBlended:(NSDictionary *)props {
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
    self.view.layer.anchorPoint = CGPointMake(self.pivotX.floatValue
            ?: 0.5f, self.pivotY.floatValue ?: 0.5f);

    if (self.rotationX || self.rotationY) {
        CATransform3D transform3D = CATransform3DMakeAffineTransform(transform);
        transform3D.m34 = -1.0 / self.perspective;
        if (self.rotationX) {
            transform3D = CATransform3DRotate(transform3D, (self.rotationX.floatValue ?: 0) * M_PI, 1, 0, 0);
        }
        if (self.rotationY) {
            transform3D = CATransform3DRotate(transform3D, (self.rotationY.floatValue ?: 0) * M_PI, 0, 1, 0);
        }
        if (!CATransform3DEqualToTransform(transform3D, self.view.layer.transform)) {
            self.view.layer.shouldRasterize = TRUE;
            self.view.layer.rasterizationScale = [[UIScreen mainScreen] scale];
            self.view.layer.transform = transform3D;
        }
    } else {
        if (!CGAffineTransformEqualToTransform(transform, self.view.transform)) {
            self.view.transform = transform;
        }
    }
}

- (void)blendView:(UIView *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([name isEqualToString:@"width"]) {
        view.doricLayout.width = [prop floatValue];
    } else if ([name isEqualToString:@"height"]) {
        view.doricLayout.height = [prop floatValue];
    } else if ([name isEqualToString:@"x"]) {
        view.doricLayout.marginLeft = [prop floatValue];
    } else if ([name isEqualToString:@"y"]) {
        view.doricLayout.marginTop = [prop floatValue];
    } else if ([name isEqualToString:@"backgroundColor"]) {
        if ([prop isKindOfClass:[NSNumber class]]) {
            view.backgroundColor = DoricColor(prop);
            self.gradientProps = nil;
            self.gradientSize = CGSizeZero;
        } else if ([prop isKindOfClass:[NSDictionary class]]) {
            self.gradientProps = prop;
            self.gradientSize = CGSizeZero;
        }
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
                view.doricLayout.corners = UIEdgeInsetsMake(leftTop, rightTop, rightBottom, leftBottom);
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
    } else if ([name isEqualToString:@"rotationX"]) {
        self.rotationX = prop;
    } else if ([name isEqualToString:@"rotationY"]) {
        self.rotationY = prop;
    } else if ([name isEqualToString:@"perspective"]) {
        self.perspective = [prop floatValue];
    } else if ([name isEqualToString:@"padding"]) {
        view.doricLayout.paddingLeft = 0;
        view.doricLayout.paddingRight = 0;
        view.doricLayout.paddingTop = 0;
        view.doricLayout.paddingBottom = 0;
        if ([prop isKindOfClass:[NSDictionary class]]) {
            NSDictionary *dictionary = prop;
            view.doricLayout.paddingLeft = [dictionary[@"left"] floatValue];
            view.doricLayout.paddingRight = [dictionary[@"right"] floatValue];
            view.doricLayout.paddingTop = [dictionary[@"top"] floatValue];
            view.doricLayout.paddingBottom = [dictionary[@"bottom"] floatValue];
        }
    } else if ([name isEqualToString:@"hidden"]) {
        self.view.hidden = [prop boolValue];
        self.view.doricLayout.disabled = [prop boolValue];
    } else if ([name isEqualToString:@"flexConfig"]) {
        if ([prop isKindOfClass:[NSDictionary class]]) {
            if ([self.superNode isKindOfClass:[DoricFlexNode class]]) {
                [((DoricFlexNode *) self.superNode) blendSubNode:self flexConfig:prop];
            }
        }
    } else {
        DoricLog(@"Blend View error for View Type :%@, prop is %@", self.class, name);
    }
}

- (void)onClick:(UITapGestureRecognizer *)recognizer {
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

- (DoricAsyncResult *)pureCallJSResponse:(NSString *)funcId, ... {
    NSMutableArray *array = [[NSMutableArray alloc] init];
    [array addObject:self.doricContext.contextId];
    [array addObject:DORIC_ENTITY_RESPONSE];
    [array addObject:self.idList];
    [array addObject:funcId];
    va_list args;
    va_start(args, funcId);
    id arg;
    while ((arg = va_arg(args, id)) != nil) {
        [array addObject:arg];
    }
    DoricAsyncResult *ret = [self.doricContext.driver invokeDoricMethod:DORIC_CONTEXT_INVOKE_PURE argumentsArray:array];
    __weak typeof(self) __self = self;
    ret.exceptionCallback = ^(NSException *e) {
        __strong typeof(__self) self = __self;
        [self.doricContext.driver.registry
                onException:e
                  inContext:self.doricContext];
    };
    va_end(args);
    return ret;
}

+ (__kindof DoricViewNode *)create:(DoricContext *)context withType:(NSString *)type {
    DoricRegistry *registry = context.driver.registry;
    Class clz = [registry acquireViewNode:type];
    DoricViewNode *viewNode;
    if (!clz) {
        viewNode = [[DoricErrorHintNode alloc] initWithContext:context];
        ((DoricErrorHintNode *) viewNode).hintText = type;
    } else {
        viewNode = [(DoricViewNode *) [clz alloc] initWithContext:context];
    }
    viewNode.type = type;
    return viewNode;
}

- (UIImage *)gradientImageFromColors:(NSArray *)colors
                           locations:(CGFloat *)locations
                          startPoint:(CGPoint)startPoint
                            endPoint:(CGPoint)endPoint
                             imgSize:(CGSize)imgSize {
    if (@available(iOS 10.0, *)) {
        UIGraphicsImageRendererFormat *format = [[UIGraphicsImageRendererFormat alloc] init];
        format.scale = [UIScreen mainScreen].scale;
        UIGraphicsImageRenderer *render = [[UIGraphicsImageRenderer alloc]initWithSize:imgSize format:format];
        UIImage *image = [render imageWithActions:^(UIGraphicsImageRendererContext * _Nonnull rendererContext) {
            CGContextRef context = rendererContext.CGContext;
            
            CGContextSaveGState(context);
            CGColorSpaceRef colorSpace = CGColorGetColorSpace((__bridge CGColorRef) colors.lastObject);
            CGGradientRef gradient = CGGradientCreateWithColors(colorSpace, (__bridge CFArrayRef) colors, locations);
            CGPoint start = (CGPoint) {startPoint.x * imgSize.width, startPoint.y * imgSize.height};
            CGPoint end = (CGPoint) {endPoint.x * imgSize.width, endPoint.y * imgSize.height};
            CGContextDrawLinearGradient(context, gradient, start, end, kCGGradientDrawsBeforeStartLocation | kCGGradientDrawsAfterEndLocation);
            CGGradientRelease(gradient);
            CGContextRestoreGState(context);
        }];
        return image;
    } else {
        UIGraphicsBeginImageContextWithOptions(imgSize, NO, [UIScreen mainScreen].scale);
        CGContextRef context = UIGraphicsGetCurrentContext();
        CGContextSaveGState(context);
        CGColorSpaceRef colorSpace = CGColorGetColorSpace((__bridge CGColorRef) colors.lastObject);
        CGGradientRef gradient = CGGradientCreateWithColors(colorSpace, (__bridge CFArrayRef) colors, locations);
        CGPoint start = (CGPoint) {startPoint.x * imgSize.width, startPoint.y * imgSize.height};
        CGPoint end = (CGPoint) {endPoint.x * imgSize.width, endPoint.y * imgSize.height};
        CGContextDrawLinearGradient(context, gradient, start, end, kCGGradientDrawsBeforeStartLocation | kCGGradientDrawsAfterEndLocation);
        UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
        CGGradientRelease(gradient);
        CGContextRestoreGState(context);
        UIGraphicsEndImageContext();
        return image;
    }
}

- (void)requestLayout {
    [self.gradientProps also:^(NSDictionary *dict) {
        if (CGSizeEqualToSize(self.gradientSize, self.view.frame.size)) {
            return;
        }
        self.gradientSize = self.view.frame.size;

        NSMutableArray *colors = [[NSMutableArray alloc] init];
        NSMutableArray *arrayLocations = nil;
        if (dict[@"colors"] != nil) {
            NSMutableArray *arrayColors = [dict mutableArrayValueForKey:@"colors"];
            [arrayColors forEach:^(id obj) {
                [colors addObject:(__bridge id) DoricColor(obj).CGColor];
            }];
            if (dict[@"locations"] != nil) {
                arrayLocations = [dict mutableArrayValueForKey:@"locations"];
            }

        } else {
            if (dict[@"start"] != nil && dict[@"end"] != nil) {
                UIColor *start = DoricColor(dict[@"start"]);
                UIColor *end = DoricColor(dict[@"end"]);

                [colors addObject:(__bridge id) start.CGColor];
                [colors addObject:(__bridge id) end.CGColor];
            }
        }

        int orientation = [dict[@"orientation"] intValue];
        CGPoint startPoint;
        CGPoint endPoint;
        if (orientation == 1) {
            startPoint = CGPointMake(1, 0);
            endPoint = CGPointMake(0, 1);
        } else if (orientation == 2) {
            startPoint = CGPointMake(1, 0);
            endPoint = CGPointMake(0, 0);
        } else if (orientation == 3) {
            startPoint = CGPointMake(1, 1);
            endPoint = CGPointMake(0, 0);
        } else if (orientation == 4) {
            startPoint = CGPointMake(0, 1);
            endPoint = CGPointMake(0, 0);
        } else if (orientation == 5) {
            startPoint = CGPointMake(0, 1);
            endPoint = CGPointMake(1, 0);
        } else if (orientation == 6) {
            startPoint = CGPointMake(0, 0);
            endPoint = CGPointMake(1, 0);
        } else if (orientation == 7) {
            startPoint = CGPointMake(0, 0);
            endPoint = CGPointMake(1, 1);
        } else {
            startPoint = CGPointMake(0, 0);
            endPoint = CGPointMake(0, 1);
        }

        UIImage *gradientImage;
        if (arrayLocations != nil) {
            CGFloat locations[arrayLocations.count];
            for (int i = 0; i != arrayLocations.count; i++) {
                locations[i] = [arrayLocations[i] floatValue];
            }
            gradientImage = [self gradientImageFromColors:colors
                                                locations:locations
                                               startPoint:startPoint
                                                 endPoint:endPoint
                                                  imgSize:self.gradientSize];
        } else {
            gradientImage = [self gradientImageFromColors:colors
                                                locations:NULL
                                               startPoint:startPoint
                                                 endPoint:endPoint
                                                  imgSize:self.gradientSize];
        }
        self.view.backgroundColor = [UIColor colorWithPatternImage:gradientImage];
    }];
}

- (NSNumber *)getWidth {
    return @(self.view.width);
}

- (NSNumber *)getHeight {
    return @(self.view.height);
}

- (NSNumber *)getX {
    return @(self.view.x);
}

- (NSNumber *)getY {
    return @(self.view.y);
}

- (NSDictionary *)getLocationOnScreen {
    CGPoint point = [self.view convertPoint:CGPointMake(0, 0) toView:[UIApplication sharedApplication].keyWindow];
    return @{@"x": @(point.x), @"y": @(point.y)};
}

- (void)blendLayoutConfig:(NSDictionary *)params {

    [params[@"widthSpec"] also:^(NSNumber *it) {
        self.view.doricLayout.widthSpec = (DoricLayoutSpec) [it integerValue];
    }];

    [params[@"heightSpec"] also:^(NSNumber *it) {
        self.view.doricLayout.heightSpec = (DoricLayoutSpec) [it integerValue];
    }];
    [params[@"margin"] also:^(NSDictionary *it) {
        [it[@"left"] also:^(NSNumber *it) {
            self.view.doricLayout.marginLeft = [it floatValue];
        }];
        [it[@"top"] also:^(NSNumber *it) {
            self.view.doricLayout.marginTop = [it floatValue];
        }];
        [it[@"right"] also:^(NSNumber *it) {
            self.view.doricLayout.marginRight = [it floatValue];
        }];
        [it[@"bottom"] also:^(NSNumber *it) {
            self.view.doricLayout.marginBottom = [it floatValue];
        }];
    }];
    [params[@"alignment"] also:^(NSNumber *it) {
        self.view.doricLayout.alignment = (DoricGravity) [it integerValue];
    }];
    [params[@"weight"] also:^(NSNumber *it) {
        self.view.doricLayout.weight = (DoricGravity) [it integerValue];
    }];
    [params[@"maxWidth"] also:^(NSNumber *it) {
        self.view.doricLayout.maxWidth = (DoricGravity) [it integerValue];
    }];
    [params[@"maxHeight"] also:^(NSNumber *it) {
        self.view.doricLayout.maxHeight = (DoricGravity) [it integerValue];
    }];
    [params[@"minWidth"] also:^(NSNumber *it) {
        self.view.doricLayout.minWidth = (DoricGravity) [it integerValue];
    }];
    [params[@"minHeight"] also:^(NSNumber *it) {
        self.view.doricLayout.minHeight = (DoricGravity) [it integerValue];
    }];
}

- (NSDictionary *)transformation {
    NSMutableDictionary *dictionary = [NSMutableDictionary new];
    if (self.translationX) {
        dictionary[@"translationX"] = self.translationX;
    }
    if (self.translationY) {
        dictionary[@"translationY"] = self.translationY;
    }
    if (self.scaleX) {
        dictionary[@"scaleX"] = self.scaleX;
    }
    if (self.scaleY) {
        dictionary[@"scaleY"] = self.scaleY;
    }
    if (self.rotation) {
        dictionary[@"rotation"] = self.rotation;
    }
    return dictionary;
}

- (void)setTransformation:(NSDictionary *)dictionary {
    self.translationX = dictionary[@"translationX"];
    self.translationY = dictionary[@"translationY"];
    self.scaleX = dictionary[@"scaleX"];
    self.scaleY = dictionary[@"scaleY"];
    self.rotation = dictionary[@"rotation"];
};

#pragma animations

- (void)doAnimation:(id)params withPromise:(DoricPromise *)promise {
    CAAnimation *animation = [self parseAnimation:params];
    AnimationCallback *originDelegate = animation.delegate;
    AnimationCallback *animationCallback = [[AnimationCallback new] also:^(AnimationCallback *it) {
        __block BOOL stop = NO;
        it.startBlock = ^(AnimationCallback *callback) {
            if (originDelegate) {
                originDelegate.startBlock(callback);
            }
        };
        it.endBlock = ^(AnimationCallback *callback) {
            if (stop) {
                return;
            }
            if (originDelegate) {
                originDelegate.endBlock(callback);
            }
            [self transformProperties];
            [promise resolve:self.transformation];
        };
        it.cancelBlock = ^{
            stop = YES;
            self.view.layer.transform = self.view.layer.presentationLayer.transform;
            [promise reject:@"Animation cancelled"];
        };
        it.clearBlock = ^{
            stop = YES;
            [promise reject:@"Animation cleared"];
        };
    }];
    animation.delegate = animationCallback;
    if (params[@"delay"]) {
        animation.beginTime = CACurrentMediaTime() + [params[@"delay"] floatValue] / 1000;
    }
    animation.removedOnCompletion = YES;
    animation.fillMode = kCAFillModeForwards;
    if (animation.duration == 0) {
        animation.duration = FLT_MIN;
    }
    [self.view.layer addAnimation:animation forKey:params[@"id"]];
}

- (void)clearAnimation:(NSString *)animationId withPromise:(DoricPromise *)promise {
    CAAnimation *caAnimation = [self.view.layer animationForKey:animationId];
    if ([caAnimation.delegate isKindOfClass:AnimationCallback.class]) {
        ((AnimationCallback *) caAnimation.delegate).clearBlock();
    }
    [self.view.layer removeAnimationForKey:animationId];
    [promise resolve:nil];
}


- (void)cancelAnimation:(NSString *)animationId withPromise:(DoricPromise *)promise {
    CAAnimation *caAnimation = [self.view.layer animationForKey:animationId];
    if ([caAnimation.delegate isKindOfClass:AnimationCallback.class]) {
        ((AnimationCallback *) caAnimation.delegate).cancelBlock();
    }
    [self.view.layer removeAnimationForKey:animationId];
    CGAffineTransform affineTransform = self.view.layer.presentationLayer.affineTransform;
    self.translationX = @(affineTransform.tx);
    self.translationY = @(affineTransform.ty);
    CGFloat angle = atan2f((float) affineTransform.b, (float) affineTransform.a);
    self.rotation = @(angle / M_PI);
    self.scaleX = @(affineTransform.a);
    self.scaleY = @(affineTransform.d);
    [promise resolve:self.transformation];
}

- (CFTimeInterval)computeDurationOfAnimations:(NSArray<CAAnimation *> *)animations {
    __block CFTimeInterval interval = 0;
    [animations forEach:^(CAAnimation *obj) {
        interval = MAX(interval, obj.beginTime + obj.duration * (1 + obj.repeatCount));
    }];
    return interval;
}

- (CAAnimation *)parseAnimation:(id)params {
    if (params[@"animations"]) {
        NSArray *anims = params[@"animations"];
        CAAnimationGroup *animationGroup = [CAAnimationGroup animation];
        NSMutableArray *animations = [NSMutableArray new];
        [anims forEach:^(id obj) {
            [animations addObject:[self parseAnimation:obj]];
        }];
        animationGroup.duration = [self computeDurationOfAnimations:animations];
        animationGroup.animations = animations;
        animationGroup.delegate = [[AnimationCallback new] also:^(AnimationCallback *it) {
            it.startBlock = ^(AnimationCallback *callback) {
                [[animations map:^id(CABasicAnimation *obj) {
                    return obj.delegate;
                }] forEach:^(AnimationCallback *obj) {
                    if (obj.startBlock) {
                        obj.startBlock(obj);
                    }
                }];
            };
            it.endBlock = ^(AnimationCallback *callback) {
                [[animations map:^id(CABasicAnimation *obj) {
                    return obj.delegate;
                }] forEach:^(AnimationCallback *obj) {
                    if (obj.endBlock) {
                        obj.endBlock(obj);
                    }
                }];
            };
        }];
        if (params[@"delay"]) {
            animationGroup.beginTime = [params[@"delay"] floatValue] / 1000;
        }
        return animationGroup;
    } else if ([params isKindOfClass:[NSDictionary class]]) {
        NSArray<NSDictionary *> *changeables = params[@"changeables"];
        CAAnimationGroup *animationGroup = [CAAnimationGroup animation];
        NSMutableArray <CABasicAnimation *> *animations = [NSMutableArray new];

        [changeables forEach:^(NSDictionary *obj) {
            CABasicAnimation *animation = [self parseChangeable:obj fillMode:params[@"fillMode"]];
            if (params[@"timingFunction"]) {
                animation.timingFunction = [self translateToTimingFunction:params[@"timingFunction"]];
            }
            [animations addObject:animation];
        }];
        animationGroup.animations = animations;
        animationGroup.delegate = [[AnimationCallback new] also:^(AnimationCallback *it) {
            it.startBlock = ^(AnimationCallback *callback) {
                [[animations map:^id(CABasicAnimation *obj) {
                    return obj.delegate;
                }] forEach:^(AnimationCallback *obj) {
                    if (obj.startBlock) {
                        obj.startBlock(obj);
                    }
                }];
            };
            it.endBlock = ^(AnimationCallback *callback) {
                [[animations map:^id(CABasicAnimation *obj) {
                    return obj.delegate;
                }] forEach:^(AnimationCallback *obj) {
                    if (obj.endBlock) {
                        obj.endBlock(obj);
                    }
                }];
            };
        }];
        [self setAnimation:animationGroup params:params];
        return animationGroup;
    }
    return nil;
}

- (void)setAnimation:(CAAnimation *)animation params:(NSDictionary *)params {
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

    if (params[@"delay"]) {
        animation.beginTime = [params[@"delay"] floatValue] / 1000;
    }
    animation.duration = [params[@"duration"] floatValue] / 1000;
}

- (void)setFillMode:(CAAnimation *)animation
                key:(NSString *)key
         startValue:(NSNumber *)startValue
           endValue:(NSNumber *)endValue
           fillMode:(NSNumber *)fillMode {
    NSUInteger fillModeInt = fillMode.unsignedIntegerValue;
    if ((fillModeInt & 2) == 2) {
        [self setAnimatedValue:key value:startValue];
    }
    AnimationCallback *callback = [AnimationCallback new];
    AnimationCallback *originCallback = animation.delegate;
    __weak typeof(self) _self = self;
    callback.startBlock = ^(AnimationCallback *callback) {
        __strong typeof(_self) self = _self;
        callback.dictionary[key] = [self getAnimatedValue:key];
        if (originCallback) {
            originCallback.startBlock(callback);
        }
    };
    callback.endBlock = ^(AnimationCallback *callback) {
        __strong typeof(_self) self = _self;
        if ((fillModeInt & 1) == 1) {
            [self setAnimatedValue:key value:endValue];
        }
        if (originCallback) {
            originCallback.endBlock(callback);
        }
    };
    animation.delegate = callback;
}

- (NSNumber *)getAnimatedValue:(NSString *)key {
    if ([@"translationX" isEqualToString:key]) {
        return self.translationX;
    }
    if ([@"translationY" isEqualToString:key]) {
        return self.translationY;
    }
    if ([@"scaleX" isEqualToString:key]) {
        return self.scaleX;
    }
    if ([@"scaleY" isEqualToString:key]) {
        return self.scaleY;
    }
    if ([@"rotation" isEqualToString:key]) {
        return self.rotation;
    }
    if ([@"rotationX" isEqualToString:key]) {
        return self.rotationX;
    }
    if ([@"rotationY" isEqualToString:key]) {
        return self.rotationY;
    }
    return nil;
}

- (void)setAnimatedValue:(NSString *)key value:(NSNumber *)value {
    if ([@"translationX" isEqualToString:key]) {
        self.translationX = value;
    } else if ([@"translationY" isEqualToString:key]) {
        self.translationY = value;
    } else if ([@"scaleX" isEqualToString:key]) {
        self.scaleX = value;
    } else if ([@"scaleY" isEqualToString:key]) {
        self.scaleY = value;
    } else if ([@"rotation" isEqualToString:key]) {
        self.rotation = value;
    } else if ([@"rotationX" isEqualToString:key]) {
        self.rotationX = value;
    } else if ([@"rotationY" isEqualToString:key]) {
        self.rotationY = value;
    }
}

- (CABasicAnimation *)parseChangeable:(NSDictionary *)params fillMode:(NSNumber *)fillMode {
    NSString *key = params[@"key"];
    CABasicAnimation *animation = [CABasicAnimation animation];
    if ([@"translationX" isEqualToString:key]) {
        animation.keyPath = @"transform.translation.x";
        animation.fromValue = params[@"fromValue"];
        animation.toValue = params[@"toValue"];
    } else if ([@"translationY" isEqualToString:key]) {
        animation.keyPath = @"transform.translation.y";
        animation.fromValue = params[@"fromValue"];
        animation.toValue = params[@"toValue"];
    } else if ([@"scaleX" isEqualToString:key]) {
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
    } else if ([@"rotationX" isEqualToString:key]) {
        animation.keyPath = @"transform.rotation.x";
        animation.fromValue = @([params[@"fromValue"] floatValue] * M_PI);
        animation.toValue = @([params[@"toValue"] floatValue] * M_PI);
    } else if ([@"rotationY" isEqualToString:key]) {
        animation.keyPath = @"transform.rotation.y";
        animation.fromValue = @([params[@"fromValue"] floatValue] * M_PI);
        animation.toValue = @([params[@"toValue"] floatValue] * M_PI);
    } else if ([@"backgroundColor" isEqualToString:key]) {
        animation.keyPath = @"backgroundColor";
        animation.fromValue = params[@"fromValue"];
        animation.toValue = params[@"toValue"];
    }
    [self setFillMode:animation
                  key:key
           startValue:params[@"fromValue"]
             endValue:params[@"toValue"]
             fillMode:fillMode];
    return animation;
}

- (CAMediaTimingFunction *)translateToTimingFunction:(NSNumber *)timingFunction {
    switch (timingFunction.integerValue) {
        case 1:
            return [CAMediaTimingFunction functionWithName:kCAMediaTimingFunctionLinear];
        case 2:
            return [CAMediaTimingFunction functionWithName:kCAMediaTimingFunctionEaseIn];
        case 3:
            return [CAMediaTimingFunction functionWithName:kCAMediaTimingFunctionEaseOut];
        case 4:
            return [CAMediaTimingFunction functionWithName:kCAMediaTimingFunctionEaseInEaseOut];
        default:
            return [CAMediaTimingFunction functionWithName:kCAMediaTimingFunctionDefault];
    }
}

@end
