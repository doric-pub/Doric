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

@interface DoricFlexView : UIView
@end

@implementation DoricFlexView
- (CGSize)sizeThatFits:(CGSize)size {
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

- (void)blendSubNode:(DoricViewNode *)subNode flexConfig:(NSDictionary *)flexConfig {
    [subNode.view configureLayoutWithBlock:^(YGLayout *_Nonnull layout) {
        layout.isEnabled = YES;
    }];
    [self blendYoga:subNode.view.yoga from:flexConfig];
}


- (void)requestLayout {
    [super requestLayout];
    if (self.view.doricLayout.widthSpec != DoricLayoutFit) {
        self.view.yoga.width = YGPointValue(self.view.width);
    }
    if (self.view.doricLayout.heightSpec != DoricLayoutFit) {
        self.view.yoga.height = YGPointValue(self.view.height);
    }
    [self.view.yoga applyLayoutPreservingOrigin:YES];
    /// Need layout again.
    for (UIView *view in self.view.subviews) {
        if (view.yoga.isEnabled) {
            continue;
        }
        if (view.doricLayout.measuredWidth == view.width && view.doricLayout.measuredHeight == view.height) {
            continue;
        }
        view.doricLayout.widthSpec = DoricLayoutJust;
        view.doricLayout.heightSpec = DoricLayoutJust;
        view.doricLayout.width = view.width;
        view.doricLayout.height = view.height;
        view.doricLayout.measuredX = view.left;
        view.doricLayout.measuredY = view.top;
        [view.doricLayout apply];
    }
}
@end
