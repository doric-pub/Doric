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

- (void)measureByParent:(DoricGroupNode *)parent {
    // Do noting for root
}


- (void)render:(NSDictionary *)props {
    [self blend:props];
    [self measureByParent:self];
}

@end
