//
//  ViewController.m
//  Example
//
//  Created by pengfei.zhou on 2019/7/25.
//  Copyright © 2019 pengfei.zhou. All rights reserved.
//

#import "ViewController.h"
#import "UIView+Doric.h"
#import "DoricJSCoreExecutor.h"

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
    DoricJSCoreExecutor *jse = [[DoricJSCoreExecutor alloc] init];
    @try{
        NSString *ret = [jse loadJSScript:@"typef Reflect" source:@"test"];
        NSLog(@"js result %@", ret);
    }@catch(NSException *e){
        NSLog(@"catch Exception: %@,reason is %@",e.name,e.reason);
    }
}


@end
