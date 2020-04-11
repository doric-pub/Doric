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
// Created by pengfei.zhou on 2020/4/11.
//

#import "DoricExtensions.h"
#import "DoricFlexScrollerNode.h"

#import "DoricJSDispatcher.h"
#import "DoricScrollableProtocol.h"
#import "DoricRefreshableNode.h"

@interface DoricFlexScrollView : UIScrollView

@end

@implementation DoricFlexScrollView
- (CGSize)sizeThatFits:(CGSize)size {
    return [self.yoga intrinsicSize];
}
@end


@interface DoricFlexScrollerNode () <UIScrollViewDelegate>
@property(nonatomic, copy) NSString *onScrollFuncId;
@property(nonatomic, copy) NSString *onScrollEndFuncId;
@property(nonatomic, strong) NSMutableSet <DoricDidScrollBlock> *didScrollBlocks;
@property(nonatomic, strong) DoricJSDispatcher *jsDispatcher;
@end


@implementation DoricFlexScrollerNode
- (UIScrollView *)build {
    return [[DoricFlexScrollView new] also:^(UIScrollView *it) {
        [it configureLayoutWithBlock:^(YGLayout *layout) {
            layout.isEnabled = YES;
            layout.overflow = YGOverflowScroll;
        }];
        it.delegate = self;
        it.showsHorizontalScrollIndicator = NO;
        it.showsVerticalScrollIndicator = NO;
        if (@available(iOS 11, *)) {
            it.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
        }
    }];
}

- (void)initWithSuperNode:(DoricSuperNode *)superNode {
    [super initWithSuperNode:superNode];
    if ([superNode isKindOfClass:[DoricRefreshableNode class]]) {
        self.view.bounces = NO;
    }
}

- (void)afterBlended:(NSDictionary *)props {
    [super afterBlended:props];
    if (props[@"contentOffset"]) {
        NSDictionary *prop = props[@"contentOffset"];
        self.view.contentOffset = CGPointMake([prop[@"x"] floatValue], [prop[@"y"] floatValue]);
    }
}

- (void)requestLayout {
    [super requestLayout];
    [self.view.yoga applyLayoutPreservingOrigin:YES];
    self.view.contentSize = self.view.yoga.intrinsicSize;
    /// Need layout again.
    for (UIView *view in self.view.subviews) {
        if (view.yoga.isEnabled) {
            continue;
        }
        if (view.doricLayout.measuredWidth == view.width && view.doricLayout.measuredHeight == view.height) {
            continue;
        }
        view.doricLayout.widthSpec = DoricLayoutJust;
        view.doricLayout.heightSpec = DoricLayoutJust;
        view.doricLayout.width = view.width;
        view.doricLayout.height = view.height;
        view.doricLayout.measuredX = view.left;
        view.doricLayout.measuredY = view.top;
        [view.doricLayout apply];
    }
}

- (void)blendView:(UIScrollView *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([@"flexConfig" isEqualToString:name]) {
        [self blendYoga:view.yoga from:prop];
    } else if ([@"onScroll" isEqualToString:name]) {
        self.onScrollFuncId = prop;
    } else if ([@"onScrollEnd" isEqualToString:name]) {
        self.onScrollEndFuncId = prop;
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (void)blendSubNode:(DoricViewNode *)subNode flexConfig:(NSDictionary *)flexConfig {
    [subNode.view configureLayoutWithBlock:^(YGLayout *_Nonnull layout) {
        layout.isEnabled = YES;
    }];
    [self blendYoga:subNode.view.yoga from:flexConfig];
}

- (void)scrollViewDidScroll:(UIScrollView *)scrollView {
    for (DoricDidScrollBlock block in self.didScrollBlocks) {
        block(scrollView);
    }
    if (self.onScrollFuncId) {
        if (!self.jsDispatcher) {
            self.jsDispatcher = [DoricJSDispatcher new];
        }
        __weak typeof(self) __self = self;
        [self.jsDispatcher dispatch:^DoricAsyncResult * {
            __strong typeof(__self) self = __self;
            return [self callJSResponse:self.onScrollFuncId,
                                        @{
                                                @"x": @(self.view.contentOffset.x),
                                                @"y": @(self.view.contentOffset.y),
                                        },
                            nil];
        }];
    }
}

- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView {
    if (self.onScrollEndFuncId) {
        [self callJSResponse:self.onScrollEndFuncId,
                             @{
                                     @"x": @(self.view.contentOffset.x),
                                     @"y": @(self.view.contentOffset.y),
                             },
                        nil];
    }
}

- (void)scrollViewDidEndDragging:(UIScrollView *)scrollView willDecelerate:(BOOL)decelerate {
    if (!decelerate) {
        if (self.onScrollEndFuncId) {
            [self callJSResponse:self.onScrollEndFuncId,
                                 @{
                                         @"x": @(self.view.contentOffset.x),
                                         @"y": @(self.view.contentOffset.y),
                                 },
                            nil];
        }
    }
}

- (void)scrollTo:(NSDictionary *)params {
    BOOL animated = [params[@"animated"] boolValue];
    NSDictionary *offsetDic = params[@"offset"];
    CGPoint offset = CGPointMake([offsetDic[@"x"] floatValue], [offsetDic[@"y"] floatValue]);
    [self.view setContentOffset:offset animated:animated];
}

- (void)scrollBy:(NSDictionary *)params {
    BOOL animated = [params[@"animated"] boolValue];
    NSDictionary *offsetDic = params[@"offset"];
    CGPoint offset = CGPointMake([offsetDic[@"x"] floatValue], [offsetDic[@"y"] floatValue]);
    [self.view setContentOffset:CGPointMake(
                    MIN(self.view.contentSize.width - self.view.width, MAX(0, offset.x + self.view.contentOffset.x)),
                    MIN(self.view.contentSize.height - self.view.height, MAX(0, offset.y + self.view.contentOffset.y)))
                       animated:animated];
}

- (NSMutableSet<DoricDidScrollBlock> *)didScrollBlocks {
    if (!_didScrollBlocks) {
        _didScrollBlocks = [NSMutableSet new];
    }
    return _didScrollBlocks;
}

- (void)addDidScrollBlock:(__nonnull DoricDidScrollBlock)didScrollListener {
    [self.didScrollBlocks addObject:didScrollListener];
}

- (void)removeDidScrollBlock:(__nonnull DoricDidScrollBlock)didScrollListener {
    [self.didScrollBlocks removeObject:didScrollListener];
}
@end
