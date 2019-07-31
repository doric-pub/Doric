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

@interface ViewController ()
@property (nonatomic,strong) DoricContext *doricContext;
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    UILabel *label = [[UILabel alloc] init];
    label.text = @"Hello,Doric";
    [label sizeToFit];
    label.centerX = self.view.width/2;
    label.centerY = self.view.height/2;
    [self.view addSubview:label];
    
    UITapGestureRecognizer *recognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(test:)];
    [label addGestureRecognizer:recognizer];
    label.userInteractionEnabled = YES;
    NSString *path = [[NSBundle bundleForClass:[self class]] pathForResource:@"demo" ofType:@"js"];
    NSString *jsContent = [NSString stringWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
    self.doricContext = [[DoricContext alloc] initWithScript:jsContent source:@"demo"];
    self.doricContext.rootNode.view = self.view;
    [self.doricContext callEntity:@"__init__",@{@"width": [NSNumber numberWithFloat:self.view.width],
                                                @"height":[NSNumber numberWithFloat:self.view.height]},nil];
}

- (void)test:(UIView *)view {
    NSLog(@"test");
    [self.doricContext callEntity:@"log",nil];
}
@end
