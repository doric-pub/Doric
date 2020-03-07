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
//  DoricTextNode.m
//  Doric
//
//  Created by jingpeng.wang on 2020/01/03.
//

#import "DoricDraggableNode.h"

@implementation DoricDraggableNode
- (DoricStackView *)build {
    DoricStackView *stackView = [DoricStackView new];
    UIPanGestureRecognizer *gesture = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(onDrag:)];
    [stackView addGestureRecognizer:gesture];
    return stackView;
}

- (void)onDrag:(UIPanGestureRecognizer *)gesture {
    CGPoint point = [gesture translationInView:self.view];
    CGRect originalFrame = self.view.frame;
    originalFrame.origin.x += point.x;
    originalFrame.origin.y += point.y;
    self.view.frame = originalFrame;
    [gesture setTranslation:CGPointZero inView:self.view];
    [self callJSResponse:_onDragFunction, @(originalFrame.origin.x), @(originalFrame.origin.y), nil];
}

- (void)blendView:(DoricStackView *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([name isEqualToString:@"onDrag"]) {
        _onDragFunction = prop;
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}
@end
