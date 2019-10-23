//
//  ViewController.m
//  Example
//
//  Created by pengfei.zhou on 2019/7/25.
//  Copyright © 2019 pengfei.zhou. All rights reserved.
//

#import "ViewController.h"
#import "UIView+Doric.h"
#import "DoricUtil.h"
#import "DoricContext.h"
#import "DoricNativePlugin.h"
#import "DoricRootNode.h"
#import "DoricLocalServer.h"
#import "DoricLinearLayout.h"
#import "DoricExtensions.h"

@interface ViewController ()
@property(nonatomic, strong) DoricContext *doricContext;
@property(nonatomic, strong) DoricLocalServer *localServer;
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];

    NSString *path = [[NSBundle bundleForClass:[self class]] pathForResource:@"Snake" ofType:@"js"];
    NSString *jsContent = [NSString stringWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
    self.doricContext = [[DoricContext alloc] initWithScript:jsContent source:@"test.js"];
    [self.doricContext.rootNode setupRootView:[[Stack new] also:^(Stack *it) {
        it.layoutConfig = [[StackLayoutConfig alloc] initWithWidth:LayoutParamAtMost height:LayoutParamAtMost];
        [self.view addSubview:it];
    }]];
    [self.doricContext initContextWithWidth:self.view.width height:self.view.height];
    [self.doricContext.driver connectDevKit:@"ws://192.168.11.38:7777"];
    self.localServer = [[DoricLocalServer alloc] init];
    [self.localServer startWithPort:8910];
    NSLog(@"00112233");
}


@end
