//
// Created by pengfei.zhou on 2019/11/28.
//

#import "DoricCollectionItemNode.h"

@interface DoricCollectionItemView : DoricStackView
@end

@implementation DoricCollectionItemView
@end

@interface DoricCollectionItemNode ()
@end


@implementation DoricCollectionItemNode
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
    return [DoricCollectionItemView new];
}
@end
