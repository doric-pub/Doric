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
// Created by pengfei.zhou on 2019/11/23.
//

#import "DoricPanel.h"
#import "Doric.h"

@interface DoricPanel ()
@property(nonatomic, assign) CGFloat renderedWidth;
@property(nonatomic, assign) CGFloat renderedHeight;
@end

@implementation DoricPanel

- (void)config:(NSString *)script alias:(NSString *)alias extra:(NSString *)extra {
    self.doricContext = [[[DoricContext alloc] initWithScript:script source:alias extra:extra] also:^(DoricContext *it) {
        [it.rootNode setupRootView:[[DoricRootView new] also:^(DoricRootView *it) {
            it.width = self.view.width;
            it.height = self.view.height;
            it.clipsToBounds = YES;
            __weak typeof(self) __self = self;
            it.frameChangedBlock = ^(CGSize oldSize, CGSize newSize) {
                __strong typeof(__self) self = __self;
                self.renderedWidth = newSize.width;
                self.renderedHeight = newSize.height;
                self.view.width = newSize.width;
                self.view.height = newSize.height;
                if (self.frameChangedBlock) {
                    self.frameChangedBlock(newSize);
                }
            };
            [self.view addSubview:it];
        }]];
    }];
    [self.doricContext onShow];
}

- (void)viewWillLayoutSubviews {
    [super viewWillLayoutSubviews];
    if (self.doricContext && (self.renderedWidth != self.view.width || self.renderedHeight != self.view.height)) {
        self.renderedWidth = self.view.width;
        self.renderedHeight = self.view.height;
        [self.doricContext build:CGSizeMake(self.renderedWidth, self.renderedHeight)];
    }
}

- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    [self.doricContext onShow];
}

- (void)viewDidDisappear:(BOOL)animated {
    [super viewDidDisappear:animated];
    [self.doricContext onHidden];
}

@end
