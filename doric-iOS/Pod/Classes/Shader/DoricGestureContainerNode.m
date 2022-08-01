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
//  DoricGestureContainerNode.m
//  Doric
//
//  Created by jingpeng.wang on 2021/09/17.
//

#import "DoricExtensions.h"
#import "DoricGestureContainerNode.h"

@interface DoricGestureView : UIView

@property(nonatomic, weak) DoricGestureContainerNode *node;

@end

@implementation DoricGestureView

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
    [super touchesBegan:touches withEvent:event];

    [touches enumerateObjectsUsingBlock:^(UITouch *_Nonnull obj, BOOL *_Nonnull stop) {
        if (self.node.onTouchDown) {
            CGPoint currentLocation = [obj locationInView:self];
            [self.node callJSResponse:self.node.onTouchDown, @{@"x": @(currentLocation.x), @"y": @(currentLocation.y)}, nil];
            *stop = YES;
        }
    }];
}

- (void)touchesMoved:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
    [super touchesMoved:touches withEvent:event];

    [touches enumerateObjectsUsingBlock:^(UITouch *_Nonnull obj, BOOL *_Nonnull stop) {
        if (self.node.onTouchMove) {
            CGPoint currentLocation = [obj locationInView:self];
            if (!self.node.jsDispatcher) {
                self.node.jsDispatcher = [DoricJSDispatcher new];
            }
            __weak typeof(self) __self = self;
            [self.node.jsDispatcher dispatch:^DoricAsyncResult * {
                __strong typeof(__self) self = __self;
                return [self.node callJSResponse:self.node.onTouchMove, @{@"x": @(currentLocation.x), @"y": @(currentLocation.y)}, nil];
            }];
            *stop = YES;
        }
    }];
}

- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
    [super touchesEnded:touches withEvent:event];

    [touches enumerateObjectsUsingBlock:^(UITouch *_Nonnull obj, BOOL *_Nonnull stop) {
        if (self.node.onTouchUp) {
            CGPoint currentLocation = [obj locationInView:self];
            [self.node callJSResponse:self.node.onTouchUp, @{@"x": @(currentLocation.x), @"y": @(currentLocation.y)}, nil];
            *stop = YES;
        }
    }];
}

- (void)touchesCancelled:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
    [super touchesCancelled:touches withEvent:event];

    [touches enumerateObjectsUsingBlock:^(UITouch *_Nonnull obj, BOOL *_Nonnull stop) {
        if (self.node.onTouchCancel) {
            CGPoint currentLocation = [obj locationInView:self];
            [self.node callJSResponse:self.node.onTouchCancel, @{@"x": @(currentLocation.x), @"y": @(currentLocation.y)}, nil];
            *stop = YES;
        }
    }];
}

@end

@interface DoricGestureContainerNode ()

@property(nonatomic, strong) NSString *onSingleTap;
@property(nonatomic, strong) NSString *onDoubleTap;
@property(nonatomic, strong) NSString *onLongPress;
@property(nonatomic, strong) NSString *onPinch;
@property(nonatomic, strong) NSString *onPan;
@property(nonatomic, strong) NSString *onRotate;
@property(nonatomic, strong) NSString *onSwipe;

@property(nonatomic) CGPoint startPanLocation;
@property(nonatomic) CGFloat startRotationDegree;
@property(nonatomic, strong) UIGestureRecognizer *singleTapGesture;
@property(nonatomic, strong) UITapGestureRecognizer *doubleTapGesture;
@property(nonatomic, strong) UIGestureRecognizer *longPress;
@property(nonatomic, strong) UIGestureRecognizer *pinchGesture;
@property(nonatomic, strong) UIGestureRecognizer *panGesture;
@property(nonatomic, strong) UIGestureRecognizer *rotationGesture;
@end

#define SWIPE_UP_THRESHOLD -1000.0f
#define SWIPE_DOWN_THRESHOLD 1000.0f
#define SWIPE_LEFT_THRESHOLD -1000.0f
#define SWIPE_RIGHT_THRESHOLD 1000.0f

@implementation DoricGestureContainerNode
- (UIView *)build {
    UIView *stackView = [[DoricGestureView new] also:^(DoricGestureView *it) {
        it.doricLayout.layoutType = DoricStack;
        it.node = self;
    }];
    return stackView;
}

- (void)singleTapAction:(UITapGestureRecognizer *)sender {
    if (self.onSingleTap) {
        [self callJSResponse:self.onSingleTap, nil];
    }
}

- (void)doubleTapAction:(UITapGestureRecognizer *)sender {
    if (self.onDoubleTap) {
        [self callJSResponse:self.onDoubleTap, nil];
    }
}

- (void)longPressAction:(UILongPressGestureRecognizer *)sender {
    if (sender.state == UIGestureRecognizerStateBegan) {
        if (self.onLongPress) {
            [self callJSResponse:self.onLongPress, nil];
        }
    }
}

- (void)pinchAction:(UIPinchGestureRecognizer *)sender {
    if (self.onPinch) {
        if (!self.jsDispatcher) {
            self.jsDispatcher = [DoricJSDispatcher new];
        }
        __weak typeof(self) __self = self;
        [self.jsDispatcher dispatch:^DoricAsyncResult * {
            __strong typeof(__self) self = __self;
            return [self callJSResponse:self.onPinch, @(sender.scale), nil];
        }];
    }
}

- (void)panAction:(UIPanGestureRecognizer *)sender {
    if (sender.state == UIGestureRecognizerStateBegan) {
        self.startPanLocation = [sender locationInView:self.view];
    }
    CGPoint currentLocation = [sender locationInView:self.view];

    CGFloat dx = self.startPanLocation.x - currentLocation.x;
    CGFloat dy = self.startPanLocation.y - currentLocation.y;

    self.startPanLocation = currentLocation;

    if (self.onPan) {
        if (!self.jsDispatcher) {
            self.jsDispatcher = [DoricJSDispatcher new];
        }
        __weak typeof(self) __self = self;
        [self.jsDispatcher dispatch:^DoricAsyncResult * {
            __strong typeof(__self) self = __self;
            return [self callJSResponse:self.onPan, @(dx), @(dy), nil];
        }];
    }


    // detect the swipe gesture
    if (sender.state == UIGestureRecognizerStateEnded) {
        CGPoint vel = [sender velocityInView:sender.view];

        if (vel.x < SWIPE_LEFT_THRESHOLD) {
            if (self.onSwipe) {
                [self callJSResponse:self.onSwipe, @(0), nil];
            }
        } else if (vel.x > SWIPE_RIGHT_THRESHOLD) {
            if (self.onSwipe) {
                [self callJSResponse:self.onSwipe, @(1), nil];
            }
        } else if (vel.y < SWIPE_UP_THRESHOLD) {
            if (self.onSwipe) {
                [self callJSResponse:self.onSwipe, @(2), nil];
            }
        } else if (vel.y > SWIPE_DOWN_THRESHOLD) {
            if (self.onSwipe) {
                [self callJSResponse:self.onSwipe, @(3), nil];
            }
        } else {
            // TODO:
            // Here, the user lifted the finger/fingers but didn't swipe.
            // If you need you can implement a snapping behaviour, where based on the location of your         targetView,
            // you focus back on the targetView or on some next view.
            // It's your call
        }
    }
}

- (void)rotationAction:(UIRotationGestureRecognizer *)sender {
    if (sender.state == UIGestureRecognizerStateBegan) {
        self.startRotationDegree = sender.rotation;
    }

    CGFloat diffRotation = sender.rotation - self.startRotationDegree;
    self.startRotationDegree = sender.rotation;
    if (self.onRotate) {
        if (!self.jsDispatcher) {
            self.jsDispatcher = [DoricJSDispatcher new];
        }
        __weak typeof(self) __self = self;
        [self.jsDispatcher dispatch:^DoricAsyncResult * {
            __strong typeof(__self) self = __self;
            return [self callJSResponse:self.onRotate, @(diffRotation), nil];
        }];
    }
}

- (UIGestureRecognizer *)singleTapGesture {
    if (_singleTapGesture == nil) {
        _singleTapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(singleTapAction:)];
    }
    return _singleTapGesture;
}


- (UITapGestureRecognizer *)doubleTapGesture {
    if (_doubleTapGesture == nil) {
        _doubleTapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(doubleTapAction:)];
        _doubleTapGesture.numberOfTapsRequired = 2;
    }
    return _doubleTapGesture;
}

- (UIGestureRecognizer *)longPress {
    if (_longPress == nil) {
        _longPress = [[UILongPressGestureRecognizer alloc] initWithTarget:self action:@selector(longPressAction:)];
    }
    return _longPress;
}

- (UIGestureRecognizer *)pinchGesture {
    if (_pinchGesture == nil) {
        _pinchGesture = [[UIPinchGestureRecognizer alloc] initWithTarget:self action:@selector(pinchAction:)];
    }
    return _pinchGesture;
}

- (UIGestureRecognizer *)panGesture {
    if (_panGesture == nil) {
        _panGesture = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(panAction:)];
        _panGesture.cancelsTouchesInView = NO;
    }
    return _panGesture;
}

- (UIGestureRecognizer *)rotationGesture {
    if (_rotationGesture == nil) {
        _rotationGesture = [[UIRotationGestureRecognizer alloc] initWithTarget:self action:@selector(rotationAction:)];
    }
    return _rotationGesture;
}

- (void)blendView:(UIView *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([name isEqualToString:@"onSingleTap"]) {
        self.onSingleTap = prop;
        [view addGestureRecognizer:self.singleTapGesture];
    } else if ([name isEqualToString:@"onDoubleTap"]) {
        self.onDoubleTap = prop;
        [view removeGestureRecognizer:self.singleTapGesture];
        [view addGestureRecognizer:self.singleTapGesture];
        [view addGestureRecognizer:self.doubleTapGesture];
        [self.singleTapGesture requireGestureRecognizerToFail:self.doubleTapGesture];
    } else if ([name isEqualToString:@"onLongPress"]) {
        self.onLongPress = prop;
        [view addGestureRecognizer:self.longPress];
    } else if ([name isEqualToString:@"onPinch"]) {
        self.onPinch = prop;
        [view addGestureRecognizer:self.pinchGesture];
    } else if ([name isEqualToString:@"onPan"]) {
        self.onPan = prop;
        [view removeGestureRecognizer:self.panGesture];
        [view addGestureRecognizer:self.panGesture];
    } else if ([name isEqualToString:@"onRotate"]) {
        self.onRotate = prop;
        [view addGestureRecognizer:self.rotationGesture];
    } else if ([name isEqualToString:@"onSwipe"]) {
        self.onSwipe = prop;
        [view removeGestureRecognizer:self.panGesture];
        [view addGestureRecognizer:self.panGesture];
    } else if ([name isEqualToString:@"onTouchDown"]) {
        self.onTouchDown = prop;
    } else if ([name isEqualToString:@"onTouchMove"]) {
        self.onTouchMove = prop;
        [view removeGestureRecognizer:self.panGesture];
        [view addGestureRecognizer:self.panGesture];
    } else if ([name isEqualToString:@"onTouchUp"]) {
        self.onTouchUp = prop;
    } else if ([name isEqualToString:@"onTouchCancel"]) {
        self.onTouchCancel = prop;
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}
@end
