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

@interface DoricViewNode <V>: DoricContextHolder

@property (nonatomic,strong) V view;

@property (nonatomic,weak) DoricGroupNode *parent;
@property (nonatomic) NSInteger index;

@property (nonatomic,strong) NSString *viewId;

@property (nonatomic,strong) LayoutParams *layoutParams;

@property (nonatomic,strong,readonly) NSArray<NSString *> *idList;

- (V)build:(NSDictionary *)props;

- (void)blend:(NSDictionary *)props;

- (void)blendView:(V)view forPropName:(NSString *)name propValue:(id)prop;

- (void)callJSResponse:(NSString *)funcId,...;

+ (DoricViewNode *)create:(DoricContext *)context withType:(NSString *)type;

@end

NS_ASSUME_NONNULL_END
