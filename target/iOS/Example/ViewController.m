//
//  ViewController.m
//  Example
//
//  Created by pengfei.zhou on 2019/12/5.
//  Copyright © 2019 pengfei.zhou. All rights reserved.
//

#import "ViewController.h"
#import <Doric/Doric.h>

@interface ViewController ()
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
    NSString *bundleName = @"__$__";
    NSString *path = [[NSBundle mainBundle] bundlePath];
    NSString *demoPath = [path stringByAppendingPathComponent:@"src"];
    NSString *fullPath = [demoPath stringByAppendingPathComponent:[NSString stringWithFormat:@"%@.js",bundleName]];
    NSString *jsContent = [NSString stringWithContentsOfFile:fullPath encoding:NSUTF8StringEncoding error:nil];
    DoricPanel *panel = [DoricPanel new];
    [panel.view also:^(UIView *it) {
        it.width = self.view.width;
        it.height = self.view.height - 88;
        it.top = 88;
        [self.view addSubview:it];
    }];
    [self addChildViewController:panel];
    [panel config:jsContent alias:bundleName];
}


@end
