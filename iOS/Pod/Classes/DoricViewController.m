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

#import "DoricViewController.h"
#import "DoricAsyncResult.h"
#import "DoricJSLoaderManager.h"
#import "DoricPanel.h"
#import "UIView+Doric.h"
#import "DoricExtensions.h"

@implementation DoricViewController
- (instancetype)initWithScheme:(NSString *)scheme alias:(NSString *)alias {
    if (self = [super init]) {
        DoricAsyncResult <NSString *> *result = [DoricJSLoaderManager.instance request:scheme];
        result.resultCallback = ^(NSString *result) {
            dispatch_async(dispatch_get_main_queue(), ^{
                DoricPanel *panel = [DoricPanel new];
                [panel.view also:^(UIView *it) {
                    it.backgroundColor = [UIColor whiteColor];
                    it.width = self.view.width;
                    it.height = self.view.height - 88;
                    it.top = 88;
                }];
                [self.view addSubview:panel.view];
                [self addChildViewController:panel];
                [panel config:result alias:alias];

            });
        };
    }
    return self;
}

- (void)push:(NSString *)scheme alias:(NSString *)alias animated:(BOOL)animated {
    DoricViewController *viewController = [[DoricViewController alloc] initWithScheme:scheme alias:alias];
    [self.navigationController pushViewController:viewController animated:animated];
}

- (void)pop:(BOOL)animated {
    [self.navigationController popViewControllerAnimated:animated];
}

@end
