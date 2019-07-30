//
//  DoricGroupNode.h
//  Doric
//
//  Created by pengfei.zhou on 2019/7/30.
//

#import "DoricViewNode.h"

NS_ASSUME_NONNULL_BEGIN

@interface DoricGroupNode : DoricViewNode<UIView *>
- (void)blendChild:(DoricViewNode *)child layoutConfig:(NSDictionary *)layoutconfig;
@end

NS_ASSUME_NONNULL_END
