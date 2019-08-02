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
    DoricAddEllipticArcPath(path, (CGPoint){
        minX + leftTop, minY + leftTop
    }, leftTop, M_PI, 3 * M_PI_2);
    DoricAddEllipticArcPath(path, (CGPoint){
        maxX - rightTop, minY + rightTop
    }, rightTop, 3 * M_PI_2, 0);
    DoricAddEllipticArcPath(path, (CGPoint){
        maxX - rightBottom, maxY -rightBottom
    }, rightBottom, 0, M_PI_2);
    DoricAddEllipticArcPath(path, (CGPoint){
        minX + leftBottom, maxY - leftBottom
    }, leftBottom, M_PI_2, M_PI);
    CGPathCloseSubpath(path);
    return path;
}



@interface DoricViewNode()
@property (nonatomic,strong) NSMutableDictionary *callbackIds;
@end

@implementation DoricViewNode

- (instancetype)initWithContext:(DoricContext *)doricContext {
    if(self = [super initWithContext:doricContext]) {
        _callbackIds = [[NSMutableDictionary alloc] init];
    }
    return self;
}
- (UIView *)build:(NSDictionary *)props {
    return [[UIView alloc] init];
}

- (void)blend:(NSDictionary *)props {
    if(self.view == nil) {
        self.view = [self build:props];
    }
    for (NSString *key in props) {
        id value = props[key];
        [self blendView:self.view forPropName:key propValue:value];
    }
}

- (void)blendView:(UIView *)view forPropName:(NSString *)name propValue:(id)prop {
    if([name isEqualToString:@"width"]) {
        NSNumber *width = (NSNumber *)prop;
        if ([width integerValue] < 0) {
            self.layoutParams.width = [width integerValue];
        } else {
            self.layoutParams.width = LAYOUT_ABSOLUTE;
            view.width = [width floatValue];
        }
    } else if([name isEqualToString:@"height"]) {
        NSNumber *height = (NSNumber *)prop;
        if ([height integerValue] < 0) {
            self.layoutParams.height = [height integerValue];
        } else {
            self.layoutParams.height = LAYOUT_ABSOLUTE;
            view.height = [height floatValue];
        }
    } else if([name isEqualToString:@"x"]) {
        view.x = [(NSNumber *)prop floatValue];
    } else if([name isEqualToString:@"y"]) {
        view.y = [(NSNumber *)prop floatValue];
    } else if([name isEqualToString:@"bgColor"]) {
        view.backgroundColor = DoricColor(prop);
    } else if([name isEqualToString:@"layoutConfig"]) {
        if(self.parent && [prop isKindOfClass:[NSDictionary class]]){
            [self.parent blendChild:self layoutConfig:prop];
        }
    } else if([name isEqualToString:@"onClick"]) {
        [self.callbackIds setObject:prop forKey:@"onClick"];
        view.userInteractionEnabled = YES;
        UITapGestureRecognizer *tapGesturRecognizer=[[UITapGestureRecognizer alloc]initWithTarget:self action:@selector(onClick:)];
        [view addGestureRecognizer:tapGesturRecognizer];
    } else if([name isEqualToString:@"border"]) {
        NSDictionary *dic = prop;
        CGFloat width = [(NSNumber *)[dic objectForKey:@"width"] floatValue];
        UIColor *color = DoricColor((NSNumber *)[dic objectForKey:@"color"]);
        view.layer.borderWidth = width;
        view.layer.borderColor = color.CGColor;
    } else if([name isEqualToString:@"corners"]) {
        if([prop isKindOfClass:NSNumber.class]) {
            view.layer.cornerRadius = [(NSNumber *)prop floatValue];
        } else if([prop isKindOfClass:NSDictionary.class]) {
            NSDictionary *dic = prop;
            CGFloat leftTop = [(NSNumber *)[dic objectForKey:@"leftTop"] floatValue];
            CGFloat rightTop = [(NSNumber *)[dic objectForKey:@"rightTop"] floatValue];
            CGFloat rightBottom = [(NSNumber *)[dic objectForKey:@"rightBottom"] floatValue];
            CGFloat leftBottom = [(NSNumber *)[dic objectForKey:@"leftBottom"] floatValue];
            CALayer *mask = nil;
            if(ABS(leftTop - rightTop) > CGFLOAT_MIN
               ||ABS(leftTop - rightBottom) > CGFLOAT_MIN
               ||ABS(leftTop - leftBottom) > CGFLOAT_MIN) {
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
    } else if([name isEqualToString:@"shadow"]) {
        NSDictionary *dic = prop;
        CGFloat opacity = [(NSNumber *)[dic objectForKey:@"opacity"] floatValue];
        if (opacity > CGFLOAT_MIN) {
            view.clipsToBounds = NO;
            UIColor *color = DoricColor((NSNumber *)[dic objectForKey:@"color"]);
            view.layer.shadowColor = color.CGColor;
            view.layer.shadowRadius = [(NSNumber *)[dic objectForKey:@"radius"] floatValue];
            view.layer.shadowOffset = CGSizeMake([(NSNumber *)[dic objectForKey:@"offsetX"] floatValue],[(NSNumber *)[dic objectForKey:@"offsetY"] floatValue]);
            view.layer.shadowOpacity = opacity;
        } else {
            view.clipsToBounds = YES;
        }

    } else {
        DoricLog(@"Blend View error for View Type :%@, prop is %@", self.class, name);
    }
}

- (void)onClick:(UIView *)view {
    [self callJSResponse:[self.callbackIds objectForKey:@"onClick"],nil];
}

- (CGFloat)measuredWidth {
    if ([self.layoutParams isKindOfClass: MarginLayoutParams.class]) {
        MarginLayoutParams *marginParams = (MarginLayoutParams *)self.layoutParams;
        return self.width + marginParams.margin.left + marginParams.margin.right;
    }
    return self.width;
}

- (CGFloat)measuredHeight {
    if ([self.layoutParams isKindOfClass: MarginLayoutParams.class]) {
        MarginLayoutParams *marginParams = (MarginLayoutParams *)self.layoutParams;
        return self.height + marginParams.margin.top + marginParams.margin.bottom;
    }
    return self.height;
}

- (void)measureByParent:(DoricGroupNode *)parent {
    
}

- (void)layoutByParent:(DoricGroupNode *)parent {
    
}

- (NSArray<NSString *> *)idList {
    NSMutableArray *ret = [[NSMutableArray alloc] init];
    DoricViewNode *node = self;
    do {
        [ret addObject:node.viewId];
        node = node.parent;
    } while (node && ![node isKindOfClass:[DoricRootNode class]]);
    
    return [[ret reverseObjectEnumerator] allObjects];
}

- (void)callJSResponse:(NSString *)funcId,... {
    NSMutableArray *array = [[NSMutableArray alloc] init];
    [array addObject:self.idList];
    [array addObject:funcId];
    va_list args;
    va_start(args, funcId);
    id arg;
    while ((arg = va_arg(args, id)) != nil) {
        [array addObject:arg];
    }
    [self.doricContext callEntity:DORIC_ENTITY_RESPONSE withArgumentsArray:array];
    va_end(args);
}

+ (DoricViewNode *)create:(DoricContext *)context withType:(NSString *)type {
    DoricRegistry *registry = context.driver.registry;
    Class  clz = [registry acquireViewNode:type];
    return [[clz alloc] initWithContext:context];
}

- (CGFloat)x {
    return ((UIView *)self.view).x;
}

- (CGFloat)y {
    return ((UIView *)self.view).y;
}

- (CGFloat)width {
    return ((UIView *)self.view).width;
}

- (CGFloat)height {
    return ((UIView *)self.view).height;
}

- (CGFloat)top {
    return ((UIView *)self.view).top;
}

- (CGFloat)bottom {
    return ((UIView *)self.view).bottom;
}

- (CGFloat)left {
    return ((UIView *)self.view).left;
}

- (CGFloat)right {
    return ((UIView *)self.view).right;
}

- (CGFloat)centerX {
    return ((UIView *)self.view).centerX;
}

- (CGFloat)centerY {
    return ((UIView *)self.view).centerY;
}

- (void)setX:(CGFloat)x {
    ((UIView *)self.view).x = x;
}

- (void)setY:(CGFloat)y {
    ((UIView *)self.view).y = y;
}

- (void)setWidth:(CGFloat)width {
    ((UIView *)self.view).width = width;
}

- (void)setHeight:(CGFloat)height {
    ((UIView *)self.view).height = height;
}

- (void)setLeft:(CGFloat)left {
    ((UIView *)self.view).left = left;
}

- (void)setRight:(CGFloat)right {
    ((UIView *)self.view).right = right;
}

- (void)setTop:(CGFloat)top {
    ((UIView *)self.view).top = top;
}

- (void)setBottom:(CGFloat)bottom {
    ((UIView *)self.view).bottom = bottom;
}

- (void)setCenterX:(CGFloat)centerX {
    ((UIView *)self.view).centerX = centerX;
}

- (void)setCenterY:(CGFloat)centerY {
    ((UIView *)self.view).centerY = centerY;
}

@end
