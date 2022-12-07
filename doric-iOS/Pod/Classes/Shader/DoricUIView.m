//
// Created by pengfei.zhou on 2022/12/6.
//

#import "DoricUIView.h"


@implementation DoricUIView
- (nullable UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event {
    UIView *target = [super hitTest:point withEvent:event];
    if (self.gestureRecognizers.count == 0 && target == self) {
        return nil;
    } else {
        return target;
    }
}

@end