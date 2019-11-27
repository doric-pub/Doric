//
// Created by pengfei.zhou on 2019/11/26.
//

#import "DoricSwipeRefreshLayout.h"
#import "UIView+Doric.h"
#import "DoricLayouts.h"
#import "Doric.h"

@interface DoricSwipeRefreshLayout () <UIScrollViewDelegate>

@end

@implementation DoricSwipeRefreshLayout

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        self.showsHorizontalScrollIndicator = NO;
        self.showsVerticalScrollIndicator = NO;
        self.alwaysBounceVertical = YES;
        self.delegate = self;
    }
    return self;
}

- (instancetype)init {
    if (self = [super init]) {
        self.showsHorizontalScrollIndicator = NO;
        self.showsVerticalScrollIndicator = NO;
        self.alwaysBounceVertical = YES;
        self.delegate = self;
    }
    return self;
}

- (CGSize)sizeThatFits:(CGSize)size {
    if (self.contentView) {
        return [self.contentView measureSize:size];
    }
    return CGSizeZero;
}

- (void)layoutSelf:(CGSize)targetSize {
    [super layoutSelf:targetSize];
    [self.contentView layoutSelf:targetSize];
}

- (void)setContentView:(UIView *)contentView {
    if (_contentView) {
        [_contentView removeFromSuperview];
    }
    _contentView = contentView;
    [self addSubview:contentView];
}

- (void)setHeaderView:(UIView *)headerView {
    if (_headerView) {
        [_headerView removeFromSuperview];
    }
    _headerView = headerView;
    [self addSubview:headerView];
    self.refreshable = YES;
}


- (void)scrollViewDidEndDragging:(UIScrollView *)scrollView willDecelerate:(BOOL)decelerate {
    if (-scrollView.contentOffset.y >= self.headerView.height) {
        self.refreshing = YES;
    }
}

- (void)scrollViewDidScroll:(UIScrollView *)scrollView {
    if (scrollView.contentOffset.y <= 0) {
        [self.swipePullingDelegate setProgressRotation:-scrollView.contentOffset.y / self.headerView.height];
    }
}

- (void)setRefreshing:(BOOL)refreshing {
    if (_refreshing == refreshing) {
        return;
    }
    if (refreshing) {
        if (self.onRefreshBlock) {
            self.onRefreshBlock();
        }
        [UIView animateWithDuration:0.3f
                         animations:^{
                             self.contentInset = UIEdgeInsetsMake(self.headerView.height, 0, 0, 0);
                         }
                         completion:^(BOOL finished) {
                             [self.swipePullingDelegate startAnimation];
                         }
        ];
    } else {
        [UIView animateWithDuration:0.3f
                         animations:^{
                             self.contentInset = UIEdgeInsetsMake(0, 0, 0, 0);
                         }
                         completion:^(BOOL finished) {
                             [self.swipePullingDelegate stopAnimation];
                         }
        ];
    }
    _refreshing = refreshing;
}

- (void)setRefreshable:(BOOL)refreshable {
    self.scrollEnabled = refreshable;
}

- (BOOL)refreshable {
    return self.scrollEnabled;
}

- (void)setContentSize:(CGSize)contentSize {
    [super setContentSize:contentSize];
}
@end
