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
// Created by pengfei.zhou on 2020/2/13.
//

#import "DoricCoordinatorPlugin.h"
#import "DoricSuperNode.h"
#import "DoricScrollableProtocol.h"
#import "DoricUtil.h"

@implementation DoricCoordinatorPlugin

- (void)verticalScrolling:(NSDictionary *)params withPromise:(DoricPromise *)promise {
    dispatch_async(dispatch_get_main_queue(), ^{
        NSArray <NSString *> *scrollableIds = params[@"scrollable"];
        DoricViewNode *scrollNode = nil;
        for (NSString *value in scrollableIds) {
            if (!scrollNode) {
                scrollNode = [self.doricContext targetViewNode:value];
            } else {
                if ([scrollNode isKindOfClass:[DoricSuperNode class]]) {
                    scrollNode = [((DoricSuperNode *) scrollNode) subNodeWithViewId:value];
                }
            }
        }
        if (!scrollNode) {
            [promise reject:@"Cannot find scrollable view"];
            return;
        }
        NSDictionary *scrollRange = params[@"scrollRange"];
        CGFloat startAnchor = [scrollRange[@"start"] floatValue];
        CGFloat endAnchor = [scrollRange[@"end"] floatValue];
        id target = params[@"target"];
        BOOL isNavBar = false;
        DoricViewNode *targetNode = nil;
        if ([target isKindOfClass:[NSString class]] && [target isEqualToString:@"NavBar"]) {
            isNavBar = true;
        } else {
            for (NSString *value in target) {
                if (!targetNode) {
                    targetNode = [self.doricContext targetViewNode:value];
                } else {
                    if ([targetNode isKindOfClass:[DoricSuperNode class]]) {
                        targetNode = [((DoricSuperNode *) targetNode) subNodeWithViewId:value];
                    }
                }
            }
            if (!targetNode) {
                [promise reject:@"Cannot find target view"];
            }
        }
        NSDictionary *changing = params[@"changing"];
        NSString *name = changing[@"name"];
        NSNumber *changingStart = changing[@"start"];
        NSNumber *changingEnd = changing[@"end"];
        if ([scrollNode conformsToProtocol:@protocol(DoricScrollableProtocol)]) {
            __weak typeof(self) __self = self;
            [(id <DoricScrollableProtocol>) scrollNode addDidScrollBlock:^(UIScrollView *scrollView) {
                __strong typeof(__self) self = __self;
                CGFloat scrollY = scrollView.contentOffset.y;
                if (scrollY <= startAnchor) {
                    [self setValue:targetNode isNavBar:isNavBar name:name value:changingStart];
                } else if (scrollY >= endAnchor) {
                    [self setValue:targetNode isNavBar:isNavBar name:name value:changingEnd];
                } else {
                    CGFloat range = MAX(1, endAnchor - startAnchor);
                    CGFloat offset = scrollY - startAnchor;
                    CGFloat rate = offset / range;
                    id value;
                    if ([@"backgroundColor" isEqualToString:name]) {
                        UIColor *startColor = DoricColor(changingStart);
                        UIColor *endColor = DoricColor(changingEnd);
                        CGFloat startR, startG, startB, startA;
                        [startColor getRed:&startR green:&startG blue:&startB alpha:&startA];
                        CGFloat endR, endG, endB, endA;
                        [endColor getRed:&endR green:&endG blue:&endB alpha:&endA];
                        value = [UIColor colorWithRed:startR + (endR - startR) * rate
                                                green:startG + (endG - startG) * rate
                                                 blue:startB + (endB - startB) * rate
                                                alpha:startA + (endA - startA) * rate];
                    } else {
                        value = @([changingStart floatValue] + ([changingEnd floatValue] - [changingStart floatValue]) * rate);
                    }
                    [self setValue:targetNode isNavBar:isNavBar name:name value:value];
                }
            }];
        } else {
            [promise reject:@"Scroller type error"];
        }
    });
}

- (void)setValue:(DoricViewNode *)viewNode isNavBar:(BOOL)isNavBar name:(NSString *)name value:(id)value {
    if ([@"backgroundColor" isEqualToString:name]) {
        if ([value isKindOfClass:[NSNumber class]]) {
            value = DoricColor(value);
        }
        if (isNavBar) {
            [self.doricContext.navBar doric_navBar_setBackgroundColor:value];
        } else {
            viewNode.view.backgroundColor = value;
        }
    } else if ([@"width" isEqualToString:name]) {
        viewNode.view.width = [value floatValue];
    } else if ([@"height" isEqualToString:name]) {
        viewNode.view.height = [value floatValue];
    } else if ([@"x" isEqualToString:name]) {
        viewNode.view.left = [value floatValue];
    } else if ([@"y" isEqualToString:name]) {
        viewNode.view.top = [value floatValue];
    }
}

@end