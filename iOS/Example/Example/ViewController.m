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
#import "DoricUtil.h"
#import "DoricJSEngine.h"

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
//    DoricJSCoreExecutor *jse = [[DoricJSCoreExecutor alloc] init];
//    @try{
//        NSString *ret = [jse loadJSScript:@"typef Reflect" source:@"test"];
//        NSLog(@"js result %@", ret);
//    }@catch(NSException *e){
//        NSLog(@"catch Exception: %@,reason is %@",e.name,e.reason);
//    }
//    DoricLog(@"%@",@"testxxxxx");
//    DoricLog(@"test2rwr");
    DoricJSEngine *jsengine = [[DoricJSEngine alloc] init];
    [self test:@"method",@"1",@"2",nil];
    
    UIButton *btn = [UIButton buttonWithType:UIButtonTypeCustom];
    [btn setTitle:@"sss" forState:UIControlStateNormal];
    btn.tag = 111;
    [btn addTarget:self action:@selector(testBtn:) forControlEvents:UIControlEventTouchUpInside];
}

- (void)testBtn:(UIButton *)btn {
    btn.tag;
}

-(void)test:(NSString *)method,... {
    va_list args;
    va_start(args, method);
    [self test2:method args:args];
    va_end(args);
}
-(void)test2:(NSString *)method args:(va_list)args {
    NSMutableArray *array = [[NSMutableArray alloc] init];
    id arg = va_arg(args, id);
    while(arg != nil){
        [array addObject:arg];
        arg = va_arg(args, id);
    }
    for(id obj in array){
        DoricLog(@"test:%@",obj);
    }
}

@end
