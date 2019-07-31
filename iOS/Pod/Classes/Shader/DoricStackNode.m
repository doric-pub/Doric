//
//  DoricStackNode.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/30.
//

#import "DoricStackNode.h"

@implementation DoricStackNode

- (instancetype)init {
    if (self = [super init]){
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
        maxWidth = MAX(maxWidth, placeWidth);
        maxHeight = MAX(maxHeight, placeHeight);
    }
    self.desiredWidth = maxWidth;
    self.desiredHeight = maxHeight;
    
    if (widthSpec == LAYOUT_WRAP_CONTENT) {
        self.view.width = maxWidth;
    }
    
    if (heightSpec == LAYOUT_WRAP_CONTENT) {
        self.view.height = maxHeight;
    }
    
}

- (void)layoutByParent:(DoricGroupNode *)parent {
    for (DoricViewNode *child in self.indexedChildren) {
        [child measureByParent:self];
        UIView *childView = child.view;
        if (child.layoutParams.width == LAYOUT_MATCH_PARENT) {
            childView.width = self.view.width;
        }
        if (child.layoutParams.height == LAYOUT_MATCH_PARENT) {
            childView.height = self.view.height;
        }
        DoricGravity gravity = self.layoutParams.alignment;
        if ((gravity & LEFT) == LEFT) {
            childView.left = self.view.left;
        }
        if ((gravity & RIGHT) == RIGHT) {
            childView.right = self.view.right;
        }
        if ((gravity & TOP) == TOP) {
            childView.top = self.view.top;
        }
        if ((gravity & BOTTOM) == BOTTOM) {
            childView.bottom = self.view.bottom;
        }
        if ((gravity & CENTER_X) == CENTER_X) {
            childView.centerX = self.view.centerX;
        }
        if ((gravity & CENTER_Y) == CENTER_Y) {
            childView.centerY = self.view.centerY;
        }
    }
}
@end
