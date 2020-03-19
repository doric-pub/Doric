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
        [it.rootNode setupRootView:[[DoricStackView new] also:^(DoricStackView *it) {
            it.width = self.view.width;
            it.height = self.view.height;
            it.clipsToBounds = YES;
            [self.view addSubview:it];
        }]];
    }];
    [self.doricContext onShow];
}

- (void)viewWillLayoutSubviews {
    [super viewWillLayoutSubviews];
    if (self.doricContext && self.renderedWidth != self.view.width && self.renderedHeight != self.view.height) {
        self.renderedWidth = self.view.width;
        self.renderedHeight = self.view.height;
        [self.doricContext build:CGSizeMake(self.renderedWidth, self.renderedHeight)];
    } else {
        [self.doricContext.rootNode.view also:^(DoricStackView *it) {
            if (it.width != self.renderedWidth || it.height != self.renderedHeight) {
                // Frame changed
                self.renderedWidth = self.view.width = it.width;
                self.renderedHeight = self.view.height = it.height;
                if (self.frameChangedBlock) {
                    self.frameChangedBlock(CGSizeMake(it.width, it.height));
                }
            }
        }];
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
