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
#import "DoricJSLoaderManager.h"
#import "UIView+Doric.h"
#import "DoricExtensions.h"
#import "DoricUtil.h"

NSString *const DORIC_MASK_RETRY = @"doric_mask_retry";

@interface DoricViewController ()
@property(nonatomic) BOOL navBarHidden;
@property(nonatomic, strong) UIImage *navBarImage;
@property(nonatomic, strong) UIView *maskView;
@property(nonatomic, copy) NSString *scheme;
@property(nonatomic, copy) NSString *alias;
@property(nonatomic, copy) NSString *extra;
@end

@implementation DoricViewController
- (instancetype)initWithScheme:(NSString *)scheme alias:(NSString *)alias extra:(NSString *)extra {
    if (self = [super init]) {
        self.edgesForExtendedLayout = UIRectEdgeNone;
        _scheme = scheme;
        _alias = alias;
        _extra = extra;
        _doricPanel = [DoricPanel new];
    }
    return self;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    self.doricPanel = [[DoricPanel new] also:^(DoricPanel *it) {
        [it.view also:^(UIView *it) {
            it.backgroundColor = [UIColor whiteColor];
            it.width = self.view.width;
            it.height = self.view.height;
        }];
        [self.view addSubview:it.view];
        [self addChildViewController:it];
    }];
    self.maskView = [[UIView new] also:^(UIView *it) {
        it.backgroundColor = [UIColor whiteColor];
        it.width = self.view.width;
        it.height = self.view.height;
        [self.view addSubview:it];
        if (self.loadingView) {
            [it addSubview:self.loadingView];
        }
        if (self.errorView) {
            [it addSubview:self.errorView];
        }
        UIView *retryView = [it viewWithTagString:DORIC_MASK_RETRY];
        if (retryView) {
            UITapGestureRecognizer *recognizer = [[UITapGestureRecognizer alloc]
                    initWithTarget:self
                            action:@selector(retry:)];
            [retryView addGestureRecognizer:recognizer];
        }
    }];
    [self loadJSBundle];
}

- (void)retry:(UIView *)view {
    [self loadJSBundle];
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

- (void)doric_navigator_push:(NSString *)scheme alias:(NSString *)alias animated:(BOOL)animated extra:(NSString *)extra {
    DoricViewController *viewController = [[DoricViewController alloc] initWithScheme:scheme alias:alias extra:extra];
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

- (void)doric_navBar_setLeft:(UIView *)view {
    UIBarButtonItem *custom = [[UIBarButtonItem alloc] initWithCustomView:view];
    self.navigationItem.leftBarButtonItem = custom;
}

- (void)doric_navBar_setRight:(UIView *)view {
    UIBarButtonItem *custom = [[UIBarButtonItem alloc] initWithCustomView:view];
    self.navigationItem.rightBarButtonItem = custom;
}

- (BOOL)statusBarHidden {
    return _statusBarHidden;
}

- (UIStatusBarStyle)preferredStatusBarStyle {
    if (self.statusBarMode == 0) {
        return UIStatusBarStyleLightContent;
    } else {
        return UIStatusBarStyleDefault;
    }
}

- (BOOL)prefersStatusBarHidden {
    return self.statusBarHidden;
}

- (void)showLoading {
    dispatch_async(dispatch_get_main_queue(), ^{
        self.maskView.hidden = NO;
        self.loadingView.hidden = NO;
        self.errorView.hidden = YES;
    });
}

- (void)showError {
    dispatch_async(dispatch_get_main_queue(), ^{
        self.maskView.hidden = NO;
        self.loadingView.hidden = YES;
        self.errorView.hidden = NO;
    });
}

- (void)hideMask {
    dispatch_async(dispatch_get_main_queue(), ^{
        self.maskView.hidden = YES;
    });
}

- (void)loadJSBundle {
    [self showLoading];
    DoricAsyncResult <NSString *> *result = [DoricJSLoaderManager.instance request:self.scheme];
    result.resultCallback = ^(NSString *result) {
        dispatch_async(dispatch_get_main_queue(), ^{
            [self hideMask];
            [self.doricPanel config:result alias:self.alias extra:self.extra];
            self.doricPanel.doricContext.navigator = self;
            self.doricPanel.doricContext.navBar = self;
        });
    };
    result.exceptionCallback = ^(NSException *e) {
        dispatch_async(dispatch_get_main_queue(), ^{
            [self showError];
        });
    };
}
@end
