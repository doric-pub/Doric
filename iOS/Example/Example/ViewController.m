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

@interface ViewController ()

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
}

- (void)test:(UIView *)view {
    NSLog(@"test");
    NSString *path = [[NSBundle bundleForClass:[self class]] pathForResource:@"demo" ofType:@"js"];
    NSString *jsContent = [NSString stringWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
    DoricContext *context = [[DoricContext alloc] initWithScript:jsContent source:@"demo"];
    [context callEntity:@"log",nil];
    DoricNativePlugin *doricNativePlugin = [[DoricNativePlugin alloc] initWithContext:context];
    NSLog(@"%@",doricNativePlugin.doricContext);
}
@end
