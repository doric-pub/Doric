/*
 * Copyright [2019] [Doric.Pub]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
        if (@available(iOS 11, *)) {
            self.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
        }
    }
    return self;
}

- (instancetype)init {
    if (self = [super init]) {
        self.showsHorizontalScrollIndicator = NO;
        self.showsVerticalScrollIndicator = NO;
        self.alwaysBounceVertical = YES;
        self.delegate = self;
        if (@available(iOS 11, *)) {
            self.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
        }
    }
    return self;
}

- (CGSize)sizeThatFits:(CGSize)size {
    if (self.contentView) {
        return [self.contentView measureSize:size];
    }
    return CGSizeZero;
}

- (BOOL)requestFromSubview:(UIView *)subview {
    if (subview == self.headerView) {
        return NO;
    }
    return [super requestFromSubview:subview];
}

- (void)layoutSelf:(CGSize)targetSize {
    self.width = targetSize.width;
    self.height = targetSize.height;
    [self.headerView also:^(UIView *it) {
        [it layoutSelf:[it measureSize:targetSize]];
        it.bottom = 0;
        it.centerX = self.centerX;
    }];
    [self.contentView also:^(UIView *it) {
        [it layoutSelf:targetSize];
    }];
    self.contentSize = self.frame.size;
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
        dispatch_async(dispatch_get_main_queue(), ^{
            self.refreshing = YES;
        });
    }
}

- (void)scrollViewDidScroll:(UIScrollView *)scrollView {
    if (scrollView.contentOffset.y <= 0) {
        [self.swipePullingDelegate setProgressRotation:-scrollView.contentOffset.y / self.headerView.height * 2];
    }
}

- (void)setContentOffset:(CGPoint)contentOffset {
    [super setContentOffset:contentOffset];
}

- (void)setRefreshing:(BOOL)refreshing {
    if (_refreshing == refreshing) {
        return;
    }
    if (refreshing) {
        if (self.onRefreshBlock) {
            self.onRefreshBlock();
        }
        [UIView animateWithDuration:.3f
                         animations:^{
                             self.contentOffset = (CGPoint) {0, -self.headerView.height};
                             self.contentInset = UIEdgeInsetsMake(self.headerView.height, 0, 0, 0);
                         }
                         completion:^(BOOL finished) {
                             [self.swipePullingDelegate startAnimation];
                             self.scrollEnabled = NO;
                         }
        ];
    } else {
        self.bounces = YES;
        [UIView animateWithDuration:.3f
                         animations:^{
                             self.contentOffset = (CGPoint) {0, 0};
                             self.contentInset = UIEdgeInsetsMake(0, 0, 0, 0);
                         }
                         completion:^(BOOL finished) {
                             [self.swipePullingDelegate stopAnimation];
                             self.scrollEnabled = YES;
                         }
        ];
    }
    _refreshing = refreshing;
}

- (void)setRefreshable:(BOOL)refreshable {
    self.scrollEnabled = refreshable;
    if (refreshable) {
        self.contentOffset = (CGPoint) {0, 0};
        self.contentInset = UIEdgeInsetsMake(0, 0, 0, 0);
    }
}

- (BOOL)refreshable {
    return self.scrollEnabled;
}

- (void)setContentSize:(CGSize)contentSize {
    [super setContentSize:contentSize];
}
@end
