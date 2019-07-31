//
//  DoricHLayoutNode.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/30.
//

#import "DoricHLayoutNode.h"

@implementation DoricHLayoutNode
- (instancetype)init {
    if (self = [super init]) {
        _space = 0;
        _gravity = 0;
    }
    return self;
}

- (void)measureByParent:(DoricGroupNode *)parent {
    DoricLayoutDesc widthSpec = self.layoutParams.width;
    DoricLayoutDesc heightSpec = self.layoutParams.height;
    CGFloat maxWidth = 0,maxHeight = 0;
    for (DoricViewNode *child in self.indexedChildren) {
        [child measureByParent:self];
        UIView *childView = child.view;
        CGFloat placeWidth = childView.width + child.layoutParams.margin.left + child.layoutParams.margin.right;
        CGFloat placeHeight = childView.height + child.layoutParams.margin.top + child.layoutParams.margin.bottom;
        maxWidth += placeWidth + self.space;
        maxHeight = MAX(maxHeight, placeHeight);
    }
    
    maxWidth -= self.space;
    
    self.desiredWidth = maxWidth;
    self.desiredHeight = maxHeight;
    
    if (widthSpec == LAYOUT_WRAP_CONTENT) {
        self.view.width = maxWidth;
    }
    
    if (heightSpec == LAYOUT_WRAP_CONTENT) {
        self.view.height = maxHeight;
    }
}

@end
