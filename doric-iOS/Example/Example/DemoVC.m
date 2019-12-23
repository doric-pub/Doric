//
// Created by pengfei.zhou on 2019/11/19.
// Copyright (c) 2019 pengfei.zhou. All rights reserved.
//

#import "DemoVC.h"
#import <DoricCore/Doric.h>

@interface DemoVC ()
@property(nonatomic, copy) NSString *filePath;
@end

@implementation DemoVC
- (instancetype)initWithPath:(NSString *)filePath {
    if (self = [self init]) {
        _filePath = filePath;
    }
    return self;
}

- (void)viewDidLoad {
    self.title = self.filePath;
    self.view.backgroundColor = [UIColor whiteColor];
    NSString *path = [[NSBundle mainBundle] bundlePath];
    NSString *demoPath = [path stringByAppendingPathComponent:@"src"];
    NSString *fullPath = [demoPath stringByAppendingPathComponent:self.filePath];
    NSString *jsContent = [NSString stringWithContentsOfFile:fullPath encoding:NSUTF8StringEncoding error:nil];
    DoricPanel *panel = [DoricPanel new];
    [panel.view also:^(UIView *it) {
        it.width = self.view.width;
        it.height = self.view.height - 88;
        it.top = 88;
        [self.view addSubview:it];
    }];
    [self addChildViewController:panel];
    [panel config:jsContent alias:self.filePath extra:nil];
}

@end
