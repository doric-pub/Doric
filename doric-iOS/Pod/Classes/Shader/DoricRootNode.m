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
//  DoricRootNode.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/30.
//

#import "DoricRootNode.h"

@interface DoricRootView ()
@property(nonatomic, assign) CGSize currentSize;
@end

@implementation DoricRootView

- (instancetype)init {
    if (self = [super init]) {
        _currentSize = self.frame.size;
    }
    return self;
}

- (void)layoutSelf:(CGSize)targetSize {
    [super layoutSelf:targetSize];
    if (!CGSizeEqualToSize(self.currentSize, targetSize) && self.frameChangedBlock) {
        self.frameChangedBlock(self.currentSize, targetSize);
    }
    self.currentSize = targetSize;
}

- (void)setX:(CGFloat)x {
    self.superview.x = x;
}

- (void)setY:(CGFloat)y {
    self.superview.y = y;
}

@end

@implementation DoricRootNode
- (void)setupRootView:(DoricStackView *)view {
    self.view = view;
}

- (void)requestLayout {
    [self.view setNeedsLayout];
}
@end
