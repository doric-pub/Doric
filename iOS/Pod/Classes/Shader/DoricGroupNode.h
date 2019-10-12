//
//  DoricGroupNode.h
//  Doric
//
//  Created by pengfei.zhou on 2019/7/30.
//

#import "DoricViewNode.h"

NS_ASSUME_NONNULL_BEGIN

@interface DoricGroupNode <V:UIView *, P:LayoutParams *> : DoricViewNode<V>

@property(nonatomic, strong) NSMutableDictionary *children;
@property(nonatomic, strong) NSMutableArray *indexedChildren;

@property(nonatomic) CGFloat desiredWidth;
@property(nonatomic) CGFloat desiredHeight;

- (void)blendChild:(DoricViewNode *)child layoutConfig:(NSDictionary *)layoutconfig;

- (P)generateDefaultLayoutParams;
@end

NS_ASSUME_NONNULL_END
