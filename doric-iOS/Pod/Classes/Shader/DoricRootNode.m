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

- (void)layoutSubviews {
    [super layoutSubviews];
    if (!CGSizeEqualToSize(self.currentSize, self.frame.size) && self.frameChangedBlock) {
        self.frameChangedBlock(self.currentSize, self.frame.size);
    }
    self.currentSize = self.frame.size;
}

- (void)setX:(CGFloat)x {
    self.superview.x = x;
}

- (void)setY:(CGFloat)y {
    self.superview.y = y;
}

@end

@implementation DoricRootNode

- (instancetype)initWithContext:(DoricContext *)doricContext {
    if (self = [super initWithContext:doricContext]) {
        _mostFrameSize = CGSizeZero;
    }
    return self;
}

- (void)setupRootView:(UIView *)view {
    view.doricLayout.layoutType = DoricStack;
    self.view = view;
}

- (void)requestLayout {
    if (CGSizeEqualToSize(self.mostFrameSize, CGSizeZero)) {
        [self.view.doricLayout apply];
    } else {
        [self.view.doricLayout apply:self.mostFrameSize];
    }
    [super requestLayout];
}
@end
