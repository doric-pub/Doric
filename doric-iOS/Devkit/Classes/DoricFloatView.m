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
// Created by pengfei.zhou on 2021/7/14.
//

#import "DoricFloatView.h"
#import <DoricCore/Doric.h>

@implementation DoricFloatView
- (instancetype)init {
    if (self = [super init]) {
        UIPanGestureRecognizer *gesture = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(onDrag:)];
        [self addGestureRecognizer:gesture];
    }
    return self;
}

- (void)onDrag:(UIPanGestureRecognizer *)gesture {
    CGPoint point = [gesture translationInView:self];
    CGRect originalFrame = self.frame;
    originalFrame.origin.x += point.x;
    originalFrame.origin.y += point.y;
    self.frame = originalFrame;
    self.left = originalFrame.origin.x;
    self.top = originalFrame.origin.y;
    [gesture setTranslation:CGPointZero inView:self];
}
@end