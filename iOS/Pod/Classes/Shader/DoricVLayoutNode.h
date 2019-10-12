//
//  DoricVLayoutNode.h
//  Doric
//
//  Created by pengfei.zhou on 2019/7/30.
//

#import "DoricGroupNode.h"

NS_ASSUME_NONNULL_BEGIN

@interface DoricVLayoutNode : DoricGroupNode<UIView *, VHLayoutParams *>
@property(nonatomic) CGFloat space;
@property(nonatomic) DoricGravity gravity;
@end

NS_ASSUME_NONNULL_END
