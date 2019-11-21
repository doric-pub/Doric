//
// Created by pengfei.zhou on 2019/11/19.
// Copyright (c) 2019 pengfei.zhou. All rights reserved.
//

#import "DemoVC.h"
#import "DoricContext.h"
#import "DoricLayouts.h"
#import "DoricExtensions.h"
#import "DoricRootNode.h"
#import "DoricLocalServer.h"

@interface DemoVC ()
@property(nonatomic, copy) NSString *filePath;
@property(nonatomic, strong) DoricContext *doricContext;
//@property(nonatomic, strong) DoricLocalServer *localServer;
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
    NSString *demoPath = [path stringByAppendingPathComponent:@"demo"];
    NSString *fullPath = [demoPath stringByAppendingPathComponent:self.filePath];
    NSString *jsContent = [NSString stringWithContentsOfFile:fullPath encoding:NSUTF8StringEncoding error:nil];
    self.doricContext = [[DoricContext alloc] initWithScript:jsContent source:self.filePath];
    [self.doricContext.rootNode setupRootView:[[DoricStackView new] also:^(DoricStackView *it) {
        it.backgroundColor = [UIColor whiteColor];
        it.layoutConfig = [[DoricLayoutConfig alloc]
                initWithWidth:DoricLayoutAtMost
                       height:DoricLayoutAtMost
                       margin:DoricMarginMake(0, 88, 0, 0)
        ];
        it.top = 88;
        [self.view addSubview:it];
    }]];
    [self.doricContext initContextWithWidth:self.view.width height:self.view.height];
//    [self.doricContext.driver connectDevKit:@"ws://192.168.11.38:7777"];
//    self.localServer = [[DoricLocalServer alloc] init];
//    [self.localServer startWithPort:8910];
}

@end