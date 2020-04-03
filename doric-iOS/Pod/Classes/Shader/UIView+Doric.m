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
//  UIView+Doric.m
//  Doric_Example
//
//  Created by pengfei.zhou on 2019/7/25.
//  Copyright © 2019 CocoaPods. All rights reserved.
//

#import "UIView+Doric.h"
#import <objc/runtime.h>

static const void *kTagString = &kTagString;

@implementation UIView (Doric)
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

- (CGFloat)x {
    return self.frame.origin.x;
}

- (void)setX:(CGFloat)x {
    CGRect frame = self.frame;
    frame.origin.x = x;
    [self setFrame:frame];
}

- (CGFloat)y {
    return self.frame.origin.y;
}

- (void)setY:(CGFloat)y {
    CGRect frame = self.frame;
    frame.origin.y = y;
    [self setFrame:frame];
}

- (CGFloat)left {
    return self.frame.origin.x;
}

- (void)setLeft:(CGFloat)left {
    CGRect frame = self.frame;
    frame.origin.x = left;
    [self setFrame:frame];
}

- (CGFloat)right {
    return self.frame.origin.x + self.frame.size.width;
}

- (void)setRight:(CGFloat)right {
    CGRect frame = self.frame;
    frame.origin.x = right - self.frame.size.width;
    [self setFrame:frame];
}

- (CGFloat)top {
    return self.frame.origin.y;
}

- (void)setTop:(CGFloat)top {
    CGRect frame = self.frame;
    frame.origin.y = top;
    [self setFrame:frame];
}

- (CGFloat)bottom {
    return self.frame.origin.y + self.frame.size.height;
}

- (void)setBottom:(CGFloat)bottom {
    CGRect frame = self.frame;
    frame.origin.y = bottom - self.frame.size.height;
    [self setFrame:frame];
}

- (CGFloat)width {
    return self.frame.size.width;
}

- (void)setWidth:(CGFloat)width {
    CGRect frame = self.frame;
    frame.size.width = width;
    self.frame = frame;
}

- (CGFloat)height {
    return self.frame.size.height;
}

- (void)setHeight:(CGFloat)height {
    CGRect frame = self.frame;
    frame.size.height = height;
    self.frame = frame;
}

- (CGFloat)centerX {
    return self.frame.origin.x + self.frame.size.width / 2;
}

- (void)setCenterX:(CGFloat)centerX {
    CGRect frame = self.frame;
    frame.origin.x = centerX - self.frame.size.width / 2;
    [self setFrame:frame];
}

- (CGFloat)centerY {
    return self.frame.origin.y + self.frame.size.height / 2;
}

- (void)setCenterY:(CGFloat)centerY {
    CGRect frame = self.frame;
    frame.origin.y = centerY - self.frame.size.height / 2;
    [self setFrame:frame];
}

@end
