//
//  DoricViewNode.h
//  Doric
//
//  Created by pengfei.zhou on 2019/7/30.
//

#import "DoricContextHolder.h"
#import "DoricViewContainer.h"

#import "UIView+Doric.h"

NS_ASSUME_NONNULL_BEGIN
@class DoricGroupNode;

@interface DoricViewNode <V:UIView *> : DoricContextHolder

@property(nonatomic, strong) V view;

@property(nonatomic, weak) DoricGroupNode *parent;
@property(nonatomic) NSInteger index;

@property(nonatomic, strong) NSString *viewId;

@property(nonatomic, strong) LayoutParams *layoutParams;

@property(nonatomic, strong, readonly) NSArray<NSString *> *idList;


@property(nonatomic) CGFloat x;
@property(nonatomic) CGFloat y;
@property(nonatomic) CGFloat width;
@property(nonatomic) CGFloat height;
@property(nonatomic) CGFloat centerX;
@property(nonatomic) CGFloat centerY;
@property(nonatomic) CGFloat top;
@property(nonatomic) CGFloat left;
@property(nonatomic) CGFloat right;
@property(nonatomic) CGFloat bottom;
@property(nonatomic, readonly) CGFloat measuredWidth;
@property(nonatomic, readonly) CGFloat measuredHeight;

- (V)build:(NSDictionary *)props;

- (void)blend:(NSDictionary *)props;

- (void)blendView:(V)view forPropName:(NSString *)name propValue:(id)prop;

- (void)callJSResponse:(NSString *)funcId, ...;

- (void)measureByParent:(DoricGroupNode *)parent;

- (void)layoutByParent:(DoricGroupNode *)parent;

+ (DoricViewNode *)create:(DoricContext *)context withType:(NSString *)type;

- (void)requestLayout;
@end

NS_ASSUME_NONNULL_END
