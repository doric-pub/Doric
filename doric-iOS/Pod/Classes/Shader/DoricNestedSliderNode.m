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
// Created by pengfei.zhou on 2019/12/7.
//

#import "DoricNestedSliderNode.h"
#import "Doric.h"

@interface DoricNestedSliderView : UIScrollView

@end

@implementation DoricNestedSliderView
- (CGSize)sizeThatFits:(CGSize)size {
    if (self.subviews.count > 0) {
        CGFloat width = size.width;
        CGFloat height = size.height;
        for (UIView *child in self.subviews) {
            CGSize childSize = [child measureSize:size];
            width = MAX(childSize.width, width);
            height = MAX(childSize.height, height);
        }
        return CGSizeMake(width, height);
    }
    return size;
}

- (void)layoutSelf:(CGSize)targetSize {
    [super layoutSelf:targetSize];
    [self.subviews forEachIndexed:^(__kindof UIView *obj, NSUInteger idx) {
        obj.left = idx * self.width;
    }];
    [self setContentSize:CGSizeMake(self.subviews.count * self.width, self.height)];
}
@end

@interface DoricNestedSliderNode () <UIScrollViewDelegate>
@property(nonatomic, copy) NSString *onPageSelectedFuncId;
@property(nonatomic, assign) NSUInteger lastPosition;
@end

@implementation DoricNestedSliderNode
- (UIScrollView *)build {
    return [[DoricNestedSliderView new] also:^(DoricNestedSliderView *it) {
        it.delegate = self;
        it.pagingEnabled = YES;
        [it setShowsVerticalScrollIndicator:NO];
        [it setShowsHorizontalScrollIndicator:NO];
        if (@available(iOS 11, *)) {
            it.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
        }
    }];
}

- (void)blendView:(UIScrollView *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([@"onPageSlided" isEqualToString:name]) {
        self.onPageSelectedFuncId = prop;
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView {
    NSUInteger pageIndex = (NSUInteger) (scrollView.contentOffset.x / scrollView.width);
    [scrollView setContentOffset:CGPointMake(pageIndex * scrollView.width, scrollView.contentOffset.y) animated:YES];
    if (self.onPageSelectedFuncId && self.onPageSelectedFuncId.length > 0) {
        if (pageIndex != self.lastPosition) {
            [self callJSResponse:self.onPageSelectedFuncId, @(pageIndex), nil];
        }
    }
    self.lastPosition = pageIndex;
}


- (void)slidePage:(NSDictionary *)params withPromise:(DoricPromise *)promise {
    NSUInteger pageIndex = [params[@"page"] unsignedIntegerValue];
    BOOL smooth = [params[@"smooth"] boolValue];
    [self.view setContentOffset:CGPointMake(pageIndex * self.view.width, self.view.contentOffset.y) animated:smooth];
    [promise resolve:nil];
    self.lastPosition = pageIndex;
    if (self.onPageSelectedFuncId && self.onPageSelectedFuncId.length > 0) {
        [self callJSResponse:self.onPageSelectedFuncId, @(pageIndex), nil];
    }
}

- (NSNumber *)getSlidedPage {
    NSUInteger pageIndex = (NSUInteger) (self.view.contentOffset.x / self.view.width);
    return @(pageIndex);
}
@end
