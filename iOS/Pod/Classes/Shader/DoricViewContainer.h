//
//  DoricViewContainer.h
//  Doric
//
//  Created by pengfei.zhou on 2019/7/30.
//

#import "UIView+Doric.h"

#define LAYOUT_MATCH_PARENT -1
#define LAYOUT_WRAP_CONTENT -2

typedef NS_ENUM(NSInteger,DoricGravity) {
    SPECIFIED = 1,
    START = 1 << 1,
    END = 1 << 2,
    SHIFT_X = 0,
    SHIFT_Y = 4,
    LEFT = (START | SPECIFIED) << SHIFT_X,
    RIGHT = (END | SPECIFIED) << SHIFT_X,
    TOP = (START | SPECIFIED) << SHIFT_Y,
    BOTTOM = (END | SPECIFIED) << SHIFT_Y,
    CENTER_X = SPECIFIED << SHIFT_X,
    CENTER_Y = SPECIFIED << SHIFT_Y,
    CENTER = CENTER_X | CENTER_Y,
};

NS_ASSUME_NONNULL_BEGIN

@interface DoricRect :NSObject
@property (nonatomic) CGFloat left;
@property (nonatomic) CGFloat right;
@property (nonatomic) CGFloat top;
@property (nonatomic) CGFloat bottom;
@end


@interface LayoutParams : NSObject
@property (nonatomic) DoricGravity alignment;
@property (nonatomic,strong) DoricRect *margin;
@end

@interface UIView(DoricContainer)

@property (nonatomic,strong) LayoutParams *layoutParams;

- (void) layout;

- (void) measure;

@end

@interface Stack : UIView
@property (nonatomic) DoricGravity gravity;
@end

@interface LinearLayout : UIView
@property (nonatomic) DoricGravity gravity;
@property (nonatomic) CGFloat space;
@end


@interface VLayout : LinearLayout
@end

@interface HLayout : LinearLayout
@end

NS_ASSUME_NONNULL_END
