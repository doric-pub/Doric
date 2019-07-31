//
//  DoricViewContainer.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/30.
//

#import "DoricViewContainer.h"
#import <objc/runtime.h>

@implementation DoricRect
- (instancetype)init {
    if (self  = [super init]) {
        _left = 0;
        _right = 0;
        _top = 0;
        _bottom = 0;
    }
    return self;
}
@end

@implementation LayoutParams
- (instancetype)init {
    if (self  = [super init]) {
        _margin = [[DoricRect alloc] init];
        _width = LAYOUT_DEFAULT;
        _height = LAYOUT_DEFAULT;
        _alignment = 0;
    }
    return self;
}
@end


@implementation UIView(DoricContainer)

- (LayoutParams *)layoutParams {
    return objc_getAssociatedObject(self, _cmd);
}

- (void)setLayoutParams:(LayoutParams *)layoutParams {
    objc_setAssociatedObject(self, @selector(layoutParams), layoutParams, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (void)layout {
    
}

- (void)measure {
    if(self.layoutParams) {
        
    }
}
@end

@implementation Stack
@end

@implementation LinearLayout
@end

@implementation VLayout
@end

@implementation HLayout
@end
