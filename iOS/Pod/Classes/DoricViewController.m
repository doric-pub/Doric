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
#import "DoricUtil.h"

@interface DoricViewController ()
@property(nonatomic, strong) DoricPanel *doricPanel;
@property(nonatomic) BOOL navBarHidden;
@property(nonatomic, strong) UIImage *navBarImage;
@end

@implementation DoricViewController
- (instancetype)initWithScheme:(NSString *)scheme alias:(NSString *)alias {
    if (self = [super init]) {
        self.edgesForExtendedLayout = UIRectEdgeNone;
        DoricAsyncResult <NSString *> *result = [DoricJSLoaderManager.instance request:scheme];
        result.resultCallback = ^(NSString *result) {
            dispatch_async(dispatch_get_main_queue(), ^{
                DoricPanel *panel = [DoricPanel new];
                [panel.view also:^(UIView *it) {
                    it.backgroundColor = [UIColor whiteColor];
                    it.width = self.view.width;
                    it.height = self.view.height;
                }];
                [self.view addSubview:panel.view];
                [self addChildViewController:panel];
                [panel config:result alias:alias];
                panel.doricContext.navigator = self;
                panel.doricContext.navBar = self;
                self.doricPanel = panel;
            });
        };
    }
    return self;
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    self.navBarHidden = self.navigationController.navigationBarHidden;
    self.navBarImage = [self.navigationController.navigationBar backgroundImageForBarMetrics:UIBarMetricsDefault];
}

- (void)viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];
    if (self.navigationController.navigationBarHidden != self.navBarHidden) {
        [self.navigationController setNavigationBarHidden:self.navBarHidden];
    }
    if (self.navBarImage != [self.navigationController.navigationBar backgroundImageForBarMetrics:UIBarMetricsDefault]) {
        [self.navigationController.navigationBar setBackgroundImage:self.navBarImage forBarMetrics:UIBarMetricsDefault];
    }
}

- (void)viewWillLayoutSubviews {
    [super viewWillLayoutSubviews];
    self.doricPanel.view.width = self.view.width;
    self.doricPanel.view.height = self.view.height;
}

- (void)doric_navigator_push:(NSString *)scheme alias:(NSString *)alias animated:(BOOL)animated {
    DoricViewController *viewController = [[DoricViewController alloc] initWithScheme:scheme alias:alias];
    [self.navigationController pushViewController:viewController animated:animated];
}

- (void)doric_navigator_pop:(BOOL)animated {
    [self.navigationController popViewControllerAnimated:animated];
}

- (BOOL)doric_navBar_isHidden {
    return self.navigationController.navigationBarHidden;
}

- (void)doric_navBar_setHidden:(BOOL)hidden {
    [self.navigationController setNavigationBarHidden:hidden];
}

- (void)doric_navBar_setTitle:(NSString *)title {
    self.title = title;
}

- (void)doric_navBar_setBackgroundColor:(UIColor *)color {
    [self.navigationController.navigationBar setBackgroundImage:UIImageWithColor(color) forBarMetrics:UIBarMetricsDefault];
}


@end
