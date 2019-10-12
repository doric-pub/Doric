//
//  DoricStackNode.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/30.
//

#import "DoricStackNode.h"
#import "DoricUtil.h"

@implementation DoricStackNode

- (instancetype)init {
    if (self = [super init]) {
        _gravity = 0;
    }
    return self;
}

- (void)measureByParent:(DoricGroupNode *)parent {
    DoricLayoutDesc widthSpec = self.layoutParams.width;
    DoricLayoutDesc heightSpec = self.layoutParams.height;
    CGFloat maxWidth = 0, maxHeight = 0;
    for (DoricViewNode *child in self.indexedChildren) {
        [child measureByParent:self];
        CGFloat placeWidth = child.measuredWidth;
        CGFloat placeHeight = child.measuredHeight;
        maxWidth = MAX(maxWidth, placeWidth);
        maxHeight = MAX(maxHeight, placeHeight);
    }
    self.desiredWidth = maxWidth;
    self.desiredHeight = maxHeight;

    if (widthSpec == LAYOUT_WRAP_CONTENT) {
        self.width = maxWidth;
    }

    if (heightSpec == LAYOUT_WRAP_CONTENT) {
        self.height = maxHeight;
    }
}

- (LayoutParams *)generateDefaultLayoutParams {
    return [[StackLayoutParams alloc] init];
}

- (void)blendChild:(DoricViewNode *)child layoutConfig:(NSDictionary *)layoutconfig {
    [super blendChild:child layoutConfig:layoutconfig];
    if (![child.layoutParams isKindOfClass:StackLayoutParams.class]) {
        DoricLog(@"blend Stack child error,layout params not match");
        return;
    }
    StackLayoutParams *params = (StackLayoutParams *) child.layoutParams;
//    NSDictionary *margin = [layoutconfig objectForKey:@"margin"];
//    if (margin) {
//        params.margin.top = [(NSNumber *)[margin objectForKey:@"top"] floatValue];
//        params.margin.left = [(NSNumber *)[margin objectForKey:@"left"] floatValue];
//        params.margin.right = [(NSNumber *)[margin objectForKey:@"right"] floatValue];
//        params.margin.bottom = [(NSNumber *)[margin objectForKey:@"bottom"] floatValue];
//    }
    NSNumber *alignment = layoutconfig[@"alignment"];
    if (alignment) {
        params.alignment = [alignment integerValue];
    }
}

- (void)layoutByParent:(DoricGroupNode *)parent {
    for (DoricViewNode *child in self.indexedChildren) {
        if (child.layoutParams.width == LAYOUT_MATCH_PARENT) {
            child.width = self.width;
        }
        if (child.layoutParams.height == LAYOUT_MATCH_PARENT) {
            child.height = self.height;
        }
        DoricGravity gravity = self.gravity;
        if ([child.layoutParams isKindOfClass:StackLayoutParams.class]) {
            StackLayoutParams *layoutParams = (StackLayoutParams *) child.layoutParams;
            gravity |= layoutParams.alignment;
        }

        if ((gravity & LEFT) == LEFT) {
            child.left = self.left;
        }
        if ((gravity & RIGHT) == RIGHT) {
            child.right = self.right;
        }
        if ((gravity & TOP) == TOP) {
            child.top = self.top;
        }
        if ((gravity & BOTTOM) == BOTTOM) {
            child.bottom = self.bottom;
        }
        if ((gravity & CENTER_X) == CENTER_X) {
            child.centerX = self.centerX;
        }
        if ((gravity & CENTER_Y) == CENTER_Y) {
            child.centerY = self.centerY;
        }
        [child layoutByParent:self];
    }
}
@end
