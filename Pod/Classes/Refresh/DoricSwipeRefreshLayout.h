//
// Created by pengfei.zhou on 2019/11/26.
//

#import <Foundation/Foundation.h>

@protocol DoricSwipePullingDelegate <NSObject>
- (void)startAnimation;

- (void)stopAnimation;

- (void)setPullingDistance:(CGFloat)rotation;
@end

@interface DoricSwipeRefreshLayout : UIScrollView
@property(nonatomic, strong) UIView *contentView;
@property(nonatomic, strong) UIView *headerView;
@property(nonatomic, assign) BOOL refreshable;
@property(nonatomic, assign) BOOL refreshing;
@property(nonatomic, strong) void (^onRefreshBlock)(void);
@property(nonatomic, weak) id <DoricSwipePullingDelegate> swipePullingDelegate;
@end