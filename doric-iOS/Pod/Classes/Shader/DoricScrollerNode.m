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
//  DoricScrollerNode.m
//  Doric
//
//  Created by pengfei.zhou on 2019/11/19.
//
#import "DoricScrollerNode.h"
#import "DoricExtensions.h"
#import "DoricRefreshableNode.h"
#import "DoricPromise.h"
#import "DoricJSDispatcher.h"

@implementation DoricScrollView

- (void)setContentView:(UIView *)contentView {
    if (_contentView) {
        [_contentView removeFromSuperview];
    }
    _contentView = contentView;
    [self addSubview:contentView];
}

- (CGSize)sizeThatFits:(CGSize)size {
    if (self.contentView) {
        if (!self.contentView.doricLayout.resolved) {
            [self.contentView.doricLayout apply:size];
        }
        return CGSizeMake(
                MIN(size.width, self.contentView.doricLayout.measuredWidth),
                MIN(size.height, self.contentView.doricLayout.measuredHeight));
    }
    return CGSizeZero;
}

- (void)layoutSubviews {
    [super layoutSubviews];
    self.contentSize = self.contentView.frame.size;
}
@end

@interface DoricScrollerNode () <UIScrollViewDelegate>
@property(nonatomic, strong) DoricViewNode *childNode;
@property(nonatomic, copy) NSString *childViewId;
@property(nonatomic, copy) NSString *onScrollFuncId;
@property(nonatomic, copy) NSString *onScrollEndFuncId;
@property(nonatomic, strong) NSMutableSet <DoricDidScrollBlock> *didScrollBlocks;
@property(nonatomic, strong) DoricJSDispatcher *jsDispatcher;
@end

@implementation DoricScrollerNode
- (DoricScrollView *)build {
    return [[DoricScrollView new] also:^(DoricScrollView *it) {
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
    NSDictionary *childModel = [self subModelOf:self.childViewId];
    if (!childModel) {
        return;
    }
    NSString *viewId = childModel[@"id"];
    NSString *type = childModel[@"type"];
    NSDictionary *childProps = childModel[@"props"];
    if (self.childNode) {
        if ([self.childNode.viewId isEqualToString:viewId]) {
            //skip
        } else {
            if (self.reusable && [type isEqualToString:self.childNode.type]) {
                [self.childNode also:^(DoricViewNode *it) {
                    it.viewId = viewId;
                    [it blend:childProps];
                }];
            } else {
                self.childNode = [[DoricViewNode create:self.doricContext withType:type] also:^(DoricViewNode *it) {
                    it.viewId = viewId;
                    [it initWithSuperNode:self];
                    [it blend:childProps];
                    self.view.contentView = it.view;
                }];
            }
        }
    } else {
        self.childNode = [[DoricViewNode create:self.doricContext withType:type] also:^(DoricViewNode *it) {
            it.viewId = viewId;
            [it initWithSuperNode:self];
            [it blend:childProps];
            self.view.contentView = it.view;
        }];
    }
    if (props[@"contentOffset"]) {
        NSDictionary *prop = props[@"contentOffset"];
        self.view.contentOffset = CGPointMake([prop[@"x"] floatValue], [prop[@"y"] floatValue]);
    }
}

- (void)requestLayout {
    [self.childNode requestLayout];
    [self.view.contentView.doricLayout apply:self.view.frame.size];
}

- (void)blendView:(DoricScrollView *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([@"scrollable" isEqualToString:name]) {
        self.view.scrollEnabled = [prop boolValue];
    } else if ([@"bounces" isEqualToString:name]) {
        self.view.bounces = [prop boolValue];
    } else if ([@"content" isEqualToString:name]) {
        self.childViewId = prop;
    } else if ([@"onScroll" isEqualToString:name]) {
        self.onScrollFuncId = prop;
    } else if ([@"onScrollEnd" isEqualToString:name]) {
        self.onScrollEndFuncId = prop;
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (void)blendSubNode:(NSDictionary *)subModel {
    [self.childNode blend:subModel[@"props"]];
}

- (DoricViewNode *)subNodeWithViewId:(NSString *)viewId {
    if ([viewId isEqualToString:self.childViewId]) {
        return self.childNode;
    }
    return nil;
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
