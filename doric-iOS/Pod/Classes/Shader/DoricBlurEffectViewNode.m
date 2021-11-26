/*
 * Copyright [2021] [Doric.Pub]
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
// Created by pengfei.zhou on 2021/11/24.
//

#import <DoricExtensions.h>
#import "DoricBlurEffectViewNode.h"


@interface DoricBlurEffectView : UIVisualEffectView
@property(nonatomic, strong) UIViewPropertyAnimator *animator;
@property(nonatomic, assign) NSUInteger radius;
@end

@implementation DoricBlurEffectView
- (instancetype)initWithEffect:(UIVisualEffect *)effect {
    if (self = [super initWithEffect:effect]) {
        _animator = [[UIViewPropertyAnimator alloc]
                initWithDuration:1
                           curve:UIViewAnimationCurveLinear
                      animations:^{
                          self.effect = [UIBlurEffect effectWithStyle:UIBlurEffectStyleLight];
                      }];
        _animator.fractionComplete = MIN(1, MAX(0, 15.0f / 200));
        if (@available(iOS 11, *)) {
            _animator.pausesOnCompletion = YES;
        }
    }
    return self;
}

- (void)didMoveToWindow {
    [super didMoveToWindow];
}

- (void)setRadius:(NSUInteger)radius {
    _radius = radius;
    self.animator.fractionComplete = MIN(1, MAX(0, (radius / 200.f)));
}

- (void)dealloc {
    [self.animator stopAnimation:YES];
}
@end

@interface DoricBlurEffectViewNode ()
@property(nonatomic, strong) DoricBlurEffectView *visualEffectView;
@end

@implementation DoricBlurEffectViewNode
- (UIView *)build {
    UIView *ret = [super build];
    self.visualEffectView = [[DoricBlurEffectView alloc] initWithEffect:nil];
    self.visualEffectView.userInteractionEnabled = NO;
    [ret addSubview:self.visualEffectView];
    self.visualEffectView.doricLayout.widthSpec = DoricLayoutMost;
    self.visualEffectView.doricLayout.heightSpec = DoricLayoutMost;
    return ret;
}

- (void)blendView:(UIView *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([name isEqualToString:@"radius"]) {
        self.visualEffectView.radius = ((NSNumber *) prop).unsignedIntValue;
    } else if ([name isEqualToString:@"effectiveRect"]) {
        NSUInteger x = ((NSNumber *) prop[@"x"]).unsignedIntegerValue;
        NSUInteger y = ((NSNumber *) prop[@"y"]).unsignedIntegerValue;
        NSUInteger width = ((NSNumber *) prop[@"width"]).unsignedIntegerValue;
        NSUInteger height = ((NSNumber *) prop[@"height"]).unsignedIntegerValue;
        self.visualEffectView.doricLayout.widthSpec = DoricLayoutJust;
        self.visualEffectView.doricLayout.heightSpec = DoricLayoutJust;
        self.visualEffectView.doricLayout.width = width;
        self.visualEffectView.doricLayout.height = height;
        self.visualEffectView.doricLayout.marginLeft = x;
        self.visualEffectView.doricLayout.marginTop = y;
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}
@end
