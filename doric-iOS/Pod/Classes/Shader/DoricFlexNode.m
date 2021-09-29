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
// Created by pengfei.zhou on 2020/4/9.
//

#import <YogaKit/UIView+Yoga.h>
#import "DoricFlexNode.h"
#import "DoricExtensions.h"
#import "UIView+Yoga.h"

@interface DoricFlexView : UIView
@end

@implementation DoricFlexView
- (CGSize)sizeThatFits:(CGSize)size {
    for (UIView *view in self.subviews) {
        [view.doricLayout measure:size];
        [view configureLayoutWithBlock:^(YGLayout *layout) {
            layout.isEnabled = YES;
            if (view.doricLayout.undefined) {
                return;
            }
            if (layout.width.unit == YGUnitUndefined
                    || layout.width.unit == YGUnitAuto) {
                layout.width = YGPointValue(view.doricLayout.measuredWidth);
            }
            if (layout.height.unit == YGUnitUndefined
                    || layout.height.unit == YGUnitAuto) {
                layout.height = YGPointValue(view.doricLayout.measuredHeight);
            }
        }];
    }
    if (self.yoga.isLeaf) {
        return CGSizeZero;
    }
    return [self.yoga intrinsicSize];
}
@end

@implementation DoricFlexNode
- (UIView *)build {
    return [[DoricFlexView new] also:^(DoricFlexView *it) {
        it.clipsToBounds = YES;
        [it configureLayoutWithBlock:^(YGLayout *_Nonnull layout) {
            layout.isEnabled = YES;
        }];
    }];
}

- (void)blendView:(UIView *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([name isEqualToString:@"flexConfig"]) {
        [self blendYoga:view.yoga from:prop];
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (void)afterBlended:(NSDictionary *)props {
    [super afterBlended:props];
    [self.childNodes forEach:^(DoricViewNode *viewNode) {
        NSString *viewId = viewNode.viewId;
        NSDictionary *model = [self subModelOf:viewId];
        NSDictionary *dictionary = model[@"props"];
        if (!dictionary[@"flexConfig"]) {
            viewNode.view.yoga.width = YGValueAuto;
            viewNode.view.yoga.height = YGValueAuto;
        }
    }];
}

- (void)blendSubNode:(DoricViewNode *)subNode flexConfig:(NSDictionary *)flexConfig {
    [subNode.view configureLayoutWithBlock:^(YGLayout *_Nonnull layout) {
        layout.isEnabled = YES;
    }];
    subNode.view.doricLayout.disabled = YES;
    subNode.view.yoga.width = YGValueAuto;
    subNode.view.yoga.height = YGValueAuto;
    [self blendYoga:subNode.view.yoga from:flexConfig];
}

- (void)blendYoga:(YGLayout *)yoga from:(NSDictionary *)flexConfig {
    [flexConfig enumerateKeysAndObjectsUsingBlock:^(NSString *key, id obj, BOOL *stop) {
        [self blendYoga:yoga name:key value:obj];
    }];
}

- (void)blendYoga:(YGLayout *)yoga name:(NSString *)name value:(id)value {
    if ([name isEqualToString:@"direction"]) {
        yoga.direction = (YGDirection) [(NSNumber *) value integerValue];
    } else if ([name isEqualToString:@"flexDirection"]) {
        yoga.flexDirection = (YGFlexDirection) [(NSNumber *) value integerValue];
    } else if ([name isEqualToString:@"justifyContent"]) {
        yoga.justifyContent = (YGJustify) [(NSNumber *) value integerValue];
    } else if ([name isEqualToString:@"alignContent"]) {
        yoga.alignContent = (YGAlign) [(NSNumber *) value integerValue];
    } else if ([name isEqualToString:@"alignItems"]) {
        yoga.alignItems = (YGAlign) [(NSNumber *) value integerValue];
    } else if ([name isEqualToString:@"alignSelf"]) {
        yoga.alignSelf = (YGAlign) [(NSNumber *) value integerValue];
    } else if ([name isEqualToString:@"positionType"]) {
        yoga.position = (YGPositionType) [(NSNumber *) value integerValue];
    } else if ([name isEqualToString:@"flexWrap"]) {
        yoga.flexWrap = (YGWrap) [(NSNumber *) value integerValue];
    } else if ([name isEqualToString:@"overFlow"]) {
        yoga.overflow = (YGOverflow) [(NSNumber *) value integerValue];
    } else if ([name isEqualToString:@"display"]) {
        yoga.display = (YGDisplay) [(NSNumber *) value integerValue];
    } else if ([name isEqualToString:@"flex"]) {
        yoga.flex = [(NSNumber *) value floatValue];
    } else if ([name isEqualToString:@"flexGrow"]) {
        yoga.flexGrow = [(NSNumber *) value floatValue];
    } else if ([name isEqualToString:@"flexShrink"]) {
        yoga.flexShrink = [(NSNumber *) value floatValue];
    } else if ([name isEqualToString:@"flexBasis"]) {
        yoga.flexBasis = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"marginLeft"]) {
        yoga.marginLeft = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"marginRight"]) {
        yoga.marginRight = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"marginTop"]) {
        yoga.marginTop = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"marginBottom"]) {
        yoga.marginBottom = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"marginStart"]) {
        yoga.marginStart = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"marginEnd"]) {
        yoga.marginEnd = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"marginHorizontal"]) {
        yoga.marginHorizontal = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"marginVertical"]) {
        yoga.marginVertical = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"margin"]) {
        yoga.margin = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"paddingLeft"]) {
        yoga.paddingLeft = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"paddingRight"]) {
        yoga.paddingRight = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"paddingTop"]) {
        yoga.paddingTop = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"paddingBottom"]) {
        yoga.paddingBottom = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"paddingStart"]) {
        yoga.paddingStart = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"paddingEnd"]) {
        yoga.paddingEnd = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"paddingHorizontal"]) {
        yoga.paddingHorizontal = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"paddingVertical"]) {
        yoga.paddingVertical = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"padding"]) {
        yoga.padding = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"borderLeftWidth"]) {
        yoga.borderLeftWidth = [(NSNumber *) value floatValue];
    } else if ([name isEqualToString:@"borderRightWidth"]) {
        yoga.borderRightWidth = [(NSNumber *) value floatValue];
    } else if ([name isEqualToString:@"borderTopWidth"]) {
        yoga.borderTopWidth = [(NSNumber *) value floatValue];
    } else if ([name isEqualToString:@"borderBottomWidth"]) {
        yoga.borderBottomWidth = [(NSNumber *) value floatValue];
    } else if ([name isEqualToString:@"borderStartWidth"]) {
        yoga.borderStartWidth = [(NSNumber *) value floatValue];
    } else if ([name isEqualToString:@"borderEndWidth"]) {
        yoga.borderEndWidth = [(NSNumber *) value floatValue];
    } else if ([name isEqualToString:@"borderWidth"]) {
        yoga.borderWidth = [(NSNumber *) value floatValue];
    } else if ([name isEqualToString:@"left"]) {
        yoga.left = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"right"]) {
        yoga.right = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"top"]) {
        yoga.top = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"bottom"]) {
        yoga.bottom = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"start"]) {
        yoga.start = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"end"]) {
        yoga.end = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"width"]) {
        yoga.width = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"height"]) {
        yoga.height = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"minWidth"]) {
        yoga.minWidth = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"minHeight"]) {
        yoga.minHeight = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"maxWidth"]) {
        yoga.maxWidth = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"maxHeight"]) {
        yoga.maxHeight = [self translateYGValueFromProperty:value];
    } else if ([name isEqualToString:@"aspectRatio"]) {
        yoga.aspectRatio = [(NSNumber *) value floatValue];
    } else {
        NSLog(@"Should not exists in flex box:%@,%@", name, value);
    }
}

- (YGValue)translateYGValueFromProperty:(id)prop {
    if ([prop isKindOfClass:[NSDictionary class]]) {
        NSNumber *type = prop[@"type"];
        NSNumber *value = prop[@"value"];
        switch (type.integerValue) {
            case YGUnitPoint:
                return YGPointValue(value.floatValue);
            case YGUnitPercent:
                return YGPercentValue(value.floatValue);
            case YGUnitUndefined:
                return YGValueUndefined;
            default:
                return YGValueAuto;
        }
    } else if ([prop isKindOfClass:[NSNumber class]]) {
        return YGPointValue([prop floatValue]);
    } else {
        return YGValueAuto;
    }
}

- (void)requestLayout {
    if (self.view.doricLayout.widthSpec != DoricLayoutFit) {
        self.view.yoga.width = YGPointValue(self.view.width);
    }
    if (self.view.doricLayout.heightSpec != DoricLayoutFit) {
        self.view.yoga.height = YGPointValue(self.view.height);
    }
    [self.view.yoga applyLayoutPreservingOrigin:YES];
    /// Need layout again.
    for (UIView *view in self.view.subviews) {
        if ([view isKindOfClass:[DoricFlexView class]]) {
            continue;
        }
        if (view.doricLayout.undefined) {
            continue;
        }
        if (view.doricLayout.measuredWidth != view.width || view.doricLayout.measuredHeight != view.height) {
            view.doricLayout.widthSpec = DoricLayoutJust;
            view.doricLayout.heightSpec = DoricLayoutJust;
            view.doricLayout.width = view.width;
            view.doricLayout.height = view.height;
        }
        view.doricLayout.measuredX = view.left;
        view.doricLayout.measuredY = view.top;
        [view.doricLayout apply];
    }
    [super requestLayout];
}
@end
