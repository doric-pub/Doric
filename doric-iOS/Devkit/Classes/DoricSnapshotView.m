/*
 * Copyright [2021] [Doric.Pub]
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
// Created by pengfei.zhou on 2021/7/14.
//

#import "DoricSnapshotView.h"
#import <JavaScriptCore/JavaScriptCore.h>

@interface DoricSnapshotView ()
@property(nonatomic, weak) DoricContext *doricContext;
@property(nonatomic, strong) UIImageView *prevBtn;
@property(nonatomic, strong) UIImageView *nextBtn;
@property(nonatomic, strong) UIImageView *closeBtn;
@property(nonatomic, strong) UILabel *indexLabel;
@property(nonatomic, assign) NSUInteger snapSize;
@property(nonatomic, assign) NSUInteger snapIndex;
@end

@implementation DoricSnapshotView
- (instancetype)initWithDoricContext:(DoricContext *)context {
    if (self = [super init]) {
        _doricContext = context;
        [self setupUI];
    }
    return self;
}

- (void)setupUI {
    self.width = 240;
    self.height = 70;
    self.backgroundColor = DoricColor(@(0xffecf0f1));
    self.alpha = 0.8f;
    UIImageView *moveBtn = [[UIImageView new] also:^(UIImageView *it) {
        UIImage *image = [UIImage imageNamed:@"DoricDevkit.bundle/icon_doricdev_move"];
        it.image = image;
        it.width = 40;
        it.height = 40;
        it.contentMode = UIViewContentModeScaleToFill;
        [self addSubview:it];
    }];
    self.prevBtn = [[UIImageView new] also:^(UIImageView *it) {
        UIImage *image = [UIImage imageNamed:@"DoricDevkit.bundle/icon_doricdev_prev"];
        it.image = image;
        it.width = 40;
        it.height = 40;
        it.contentMode = UIViewContentModeScaleToFill;
        [self addSubview:it];
        it.userInteractionEnabled = YES;
        UITapGestureRecognizer *tapGestureRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(onPrev)];
        [it addGestureRecognizer:tapGestureRecognizer];
    }];
    self.nextBtn = [[UIImageView new] also:^(UIImageView *it) {
        UIImage *image = [UIImage imageNamed:@"DoricDevkit.bundle/icon_doricdev_next"];
        it.image = image;
        it.width = 40;
        it.height = 40;
        it.contentMode = UIViewContentModeScaleToFill;
        [self addSubview:it];
        it.userInteractionEnabled = YES;
        UITapGestureRecognizer *tapGestureRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(onNext)];
        [it addGestureRecognizer:tapGestureRecognizer];
    }];
    self.closeBtn = [[UIImageView new] also:^(UIImageView *it) {
        UIImage *image = [UIImage imageNamed:@"DoricDevkit.bundle/icon_doricdev_close"];
        it.image = image;
        it.width = 40;
        it.height = 40;
        it.contentMode = UIViewContentModeScaleToFill;
        [self addSubview:it];
        it.userInteractionEnabled = YES;
        UITapGestureRecognizer *tapGestureRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(onClose)];
        [it addGestureRecognizer:tapGestureRecognizer];
    }];
    self.indexLabel = [[UILabel new] also:^(UILabel *it) {
        it.width = 40;
        it.height = 40;
        it.textAlignment = NSTextAlignmentCenter;
        it.font = [UIFont systemFontOfSize:30];
        [self addSubview:it];
    }];
    moveBtn.left = 0;
    moveBtn.centerY = self.centerY;

    self.prevBtn.left = moveBtn.right + 5;
    self.prevBtn.centerY = self.centerY;

    self.indexLabel.left = self.prevBtn.right + 10;
    self.indexLabel.centerY = self.centerY;

    self.nextBtn.left = self.indexLabel.right + 10;
    self.nextBtn.centerY = self.centerY;

    self.closeBtn.left = self.nextBtn.right + 10;
    self.closeBtn.centerY = self.centerY;

    [[self.doricContext callEntity:@"__renderSnapshotDepth__" withArgumentsArray:@[]] setResultCallback:^(JSValue *result) {
        self.snapSize = [[result toNumber] unsignedIntegerValue];
        dispatch_async(dispatch_get_main_queue(), ^{
            self.snapIndex = self.snapSize;
            [self updateUI];
        });
    }];
}

- (void)onPrev {
    if (self.snapIndex <= 0) {
        return;
    }
    self.snapIndex--;
    [self updateUI];
}

- (void)onNext {
    if (self.snapIndex >= self.snapSize) {
        return;
    }
    self.snapIndex++;
    [self updateUI];
}

- (void)onClose {
    self.snapIndex = self.snapSize;
    [self updateUI];
    [self removeFromSuperview];
}

- (void)updateUI {
    self.prevBtn.alpha = self.snapIndex <= 0 ? 0.5f : 1;
    self.nextBtn.alpha = self.snapIndex >= self.snapSize ? 0.5f : 1;
    self.indexLabel.text = [NSString stringWithFormat:@"%@", @(self.snapIndex)];
    [[self.doricContext callEntity:@"__restoreRenderSnapshot__" withArgumentsArray:@[@(self.snapIndex)]] setResultCallback:^(JSValue *result) {
        dispatch_async(dispatch_get_main_queue(), ^{
            [self.doricContext.rootNode.view.subviews forEach:^(__kindof UIView *obj) {
                [obj removeFromSuperview];
            }];
            [self.doricContext.rootNode clearSubModel];
            [[result toArray] forEach:^(NSDictionary *obj) {
                NSString *viewId = obj[@"id"];
                if (self.doricContext.rootNode.viewId == nil && [@"Root" isEqualToString:[obj optString:@"type"]]) {
                    self.doricContext.rootNode.viewId = viewId;
                    [self.doricContext.rootNode blend:[obj optObject:@"props"]];
                    [self.doricContext.rootNode requestLayout];
                } else {
                    DoricViewNode *viewNode = [self.doricContext targetViewNode:viewId];
                    [viewNode blend:[obj optObject:@"props"]];
                    [viewNode requestLayout];
                }
            }];
        });
    }];
}
@end
