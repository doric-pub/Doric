//
//  DoricVLayoutNode.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/30.
//

#import "DoricVLayoutNode.h"
#import "DoricUtil.h"

@implementation DoricVLayoutNode
- (instancetype)init {
    if (self = [super init]) {
        _space = 0;
        _gravity = 0;
    }
    return self;
}

- (void)blendView:(id)view forPropName:(NSString *)name propValue:(id)prop {
    if ([name isEqualToString:@"gravity"]) {
        self.gravity = [(NSNumber *)prop integerValue];
    } else if ([name isEqualToString:@"space"]) {
        self.space = [(NSNumber *)prop floatValue];
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (void)blendChild:(DoricViewNode *)child layoutConfig:(NSDictionary *)layoutconfig {
    [super blendChild:child layoutConfig:layoutconfig];
    if (![child.layoutParams isKindOfClass:VHLayoutParams.class]) {
        DoricLog(@"blend VLayout child error,layout params not match");
        return;
    }
    VHLayoutParams *params = (VHLayoutParams *)child.layoutParams;
    NSDictionary *margin = [layoutconfig objectForKey:@"margin"];
    if (margin) {
        params.margin.top = [(NSNumber *)[margin objectForKey:@"top"] floatValue];
        params.margin.left = [(NSNumber *)[margin objectForKey:@"left"] floatValue];
        params.margin.right = [(NSNumber *)[margin objectForKey:@"right"] floatValue];
        params.margin.bottom = [(NSNumber *)[margin objectForKey:@"bottom"] floatValue];
    }
    NSNumber *alignment = [layoutconfig objectForKey:@"alignment"];
    if (alignment) {
        params.alignment = [alignment integerValue];
    }
}

- (LayoutParams *)generateDefaultLayoutParams {
    return [[VHLayoutParams alloc] init];
}

- (void)measureByParent:(DoricGroupNode *)parent {
    DoricLayoutDesc widthSpec = self.layoutParams.width;
    DoricLayoutDesc heightSpec = self.layoutParams.height;
    CGFloat maxWidth = 0,maxHeight = 0;
    for (DoricViewNode *child in self.indexedChildren) {
        [child measureByParent:self];
        CGFloat placeWidth = child.measuredWidth;
        CGFloat placeHeight = child.measuredHeight;
        maxWidth = MAX(maxWidth, placeWidth);
        maxHeight += placeHeight + self.space;
    }
    maxHeight -= self.space;
    
    self.desiredWidth = maxWidth;
    self.desiredHeight = maxHeight;
    
    if (widthSpec == LAYOUT_WRAP_CONTENT) {
        self.width = maxWidth;
    }
    
    if (heightSpec == LAYOUT_WRAP_CONTENT) {
        self.height = maxHeight;
    }
}

- (void)layoutByParent:(DoricGroupNode *)parent {
    if (self.layoutParams.width == LAYOUT_MATCH_PARENT) {
        self.width = parent.width;
    }
    if (self.layoutParams.height == LAYOUT_MATCH_PARENT) {
        self.height = parent.height;
    }
    // layotu child
    CGFloat xStart = 0, yStart = 0;
    if ((self.gravity & LEFT) == LEFT) {
        xStart = 0;
    } else if ((self.gravity & RIGHT) == RIGHT) {
        xStart = self.width - self.desiredWidth;
    } else if ((self.gravity & CENTER_X) == CENTER_X) {
        xStart = (self.width -self.desiredWidth)/2;
    }
    
    if ((self.gravity & TOP) == TOP) {
        yStart = 0;
    } else if ((self.gravity & BOTTOM) == BOTTOM) {
        yStart = self.height - self.desiredHeight;
    } else if ((self.gravity & CENTER_Y) == CENTER_Y) {
        yStart = (self.height -self.desiredHeight)/2;
    }
    
    
    for (DoricViewNode *child in self.indexedChildren) {
        if (child.layoutParams.width == LAYOUT_MATCH_PARENT) {
            child.width = self.width;
        }
        if (child.layoutParams.height == LAYOUT_MATCH_PARENT) {
            child.height = self.height;
        }
        if ([child.layoutParams isKindOfClass:VHLayoutParams.class]) {
            VHLayoutParams *layoutParams = (VHLayoutParams *)child.layoutParams;
            DoricGravity gravity = layoutParams.alignment;
            if ((gravity & LEFT) == LEFT) {
                child.left = xStart;
            } else if ((gravity & RIGHT) == RIGHT) {
                child.right = xStart + self.desiredWidth;
            } else if ((gravity & CENTER_X) == CENTER_X) {
                child.centerX = xStart + self.desiredWidth/2;
            }
        }        
        child.top = yStart;
        yStart = child.bottom + self.space;
        [child layoutByParent:self];
    }
}
@end
