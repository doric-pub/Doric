//
//  DoricRootNode.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/30.
//

#import "DoricRootNode.h"

@implementation DoricRootNode
- (void)setupRootView:(UIView *)view {
    self.view = view;
}

- (void)render:(NSDictionary *)props {
    [self blend:props];
    [self requestLayout];
}

- (void)requestLayout {
    [self measureByParent:self];
    [self layoutByParent:self];
}
@end
