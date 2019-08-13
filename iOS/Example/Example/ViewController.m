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
    
    NSString *path = [[NSBundle bundleForClass:[self class]] pathForResource:@"Snake" ofType:@"js"];
    NSString *jsContent = [NSString stringWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
    self.doricContext = [[DoricContext alloc] initWithScript:jsContent source:@"Snake"];
    self.doricContext.rootNode.view = self.view;
    [self.doricContext callEntity:@"__init__",@{@"width": [NSNumber numberWithFloat:self.view.width],
                                                @"height":[NSNumber numberWithFloat:self.view.height]},nil];
}


@end
