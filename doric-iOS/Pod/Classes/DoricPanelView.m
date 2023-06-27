/*
 * Copyright [2023] [Doric.Pub]
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
// Created by pengfei.zhou on 2023/6/27.
//

#import "DoricPanelView.h"
#import "Doric.h"

@interface DoricPanelView ()
@property(nonatomic, assign) CGFloat renderedWidth;
@property(nonatomic, assign) CGFloat renderedHeight;
@end

@implementation DoricPanelView
- (void)config:(NSString *)script alias:(NSString *)alias extra:(NSString *)extra {
    self.doricContext = [[[DoricContext alloc] initWithScript:script source:alias extra:extra] also:^(DoricContext *it) {
        [it.rootNode setupRootView:[[DoricRootView new] also:^(DoricRootView *it) {
            it.width = self.width;
            it.height = self.height;
            it.clipsToBounds = YES;
            __weak typeof(self) __self = self;
            it.frameChangedBlock = ^(CGSize oldSize, CGSize newSize) {
                __strong typeof(__self) self = __self;
                self.renderedWidth = newSize.width;
                self.renderedHeight = newSize.height;
                self.width = newSize.width;
                self.height = newSize.height;
                if (self.frameChangedBlock) {
                    self.frameChangedBlock(newSize);
                }
            };
            [self addSubview:it];
        }]];
    }];
    [self build];
}


- (void)build {
    [self.doricContext build:CGSizeMake(self.width, self.height)];
    self.renderedWidth = self.width;
    self.renderedHeight = self.height;
}

- (void)renderSynchronously {
    [self.doricContext renderSynchronously];
    CGSize newSize = self.doricContext.rootNode.view.frame.size;
    if (self.renderedWidth != newSize.width || self.renderedWidth != newSize.height) {
        self.renderedWidth = newSize.width;
        self.renderedHeight = newSize.height;
        self.width = newSize.width;
        self.height = newSize.height;
        if (self.frameChangedBlock) {
            self.frameChangedBlock(newSize);
        }
    }
}
@end