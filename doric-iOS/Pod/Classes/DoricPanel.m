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

@implementation DoricPanel

- (void)config:(NSString *)script alias:(NSString *)alias extra:(NSString *)extra {
    self.doricContext = [[[DoricContext alloc] initWithScript:script source:alias extra:extra] also:^(DoricContext *it) {
        [it.rootNode setupRootView:[[DoricStackView new] also:^(DoricStackView *it) {
            [self.view addSubview:it];
        }]];
    }];
    [self.doricContext onShow];
}

- (void)viewWillLayoutSubviews {
    [super viewWillLayoutSubviews];
    [self.doricContext.rootNode.view also:^(DoricStackView *it) {
        if (it.width != self.view.width || it.height != self.view.height) {
            it.width = self.view.width;
            it.height = self.view.height;
            [self.doricContext initContextWithWidth:it.width height:it.height];
        }
    }];
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
