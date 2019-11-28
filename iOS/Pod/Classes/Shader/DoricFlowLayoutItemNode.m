//
// Created by pengfei.zhou on 2019/11/28.
//

#import "DoricFlowLayoutItemNode.h"

@interface DoricFlowLayoutItemView : DoricStackView
@end

@implementation DoricFlowLayoutItemView
@end

@interface DoricFlowLayoutItemNode ()
@end


@implementation DoricFlowLayoutItemNode
- (instancetype)initWithContext:(DoricContext *)doricContext {
    if (self = [super initWithContext:doricContext]) {
        self.reusable = YES;
    }
    return self;
}

- (void)initWithSuperNode:(DoricSuperNode *)superNode {
    [super initWithSuperNode:superNode];
    self.reusable = YES;
}

- (DoricStackView *)build {
    return [DoricFlowLayoutItemView new];
}
@end
