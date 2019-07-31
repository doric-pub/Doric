//
//  DoricRootNode.h
//  Doric
//
//  Created by pengfei.zhou on 2019/7/30.
//

#import "DoricStackNode.h"

NS_ASSUME_NONNULL_BEGIN

@interface DoricRootNode : DoricStackNode

- (void)setupRootView:(UIView *)view;

- (void)render:(NSDictionary *)props;
@end

NS_ASSUME_NONNULL_END
