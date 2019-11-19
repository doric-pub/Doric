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
    } else if ([name isEqualToString:@"layoutConfig"]) {
        if (self.superNode && [prop isKindOfClass:[NSDictionary class]]) {
            [self.superNode blendSubNode:self layoutConfig:prop];
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
            CALayer *mask = nil;
            if (ABS(leftTop - rightTop) > CGFLOAT_MIN
                    || ABS(leftTop - rightBottom) > CGFLOAT_MIN
                    || ABS(leftTop - leftBottom) > CGFLOAT_MIN) {
                view.layer.cornerRadius = 0;
                CAShapeLayer *shapeLayer = [CAShapeLayer layer];
                CGPathRef path = DoricCreateRoundedRectPath(self.view.bounds, leftTop, rightTop, rightBottom, leftBottom);
                shapeLayer.path = path;
                CGPathRelease(path);
                mask = shapeLayer;
            } else {
                view.layer.cornerRadius = leftTop;
            }
            view.layer.mask = mask;
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
    } while (node && ![node isKindOfClass:[DoricRootNode class]]);

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

@end
