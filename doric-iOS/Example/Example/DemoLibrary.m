//
// Created by pengfei.zhou on 2019/12/11.
// Copyright (c) 2019 pengfei.zhou. All rights reserved.
//

#import "DemoLibrary.h"

@interface DoricDemoPlugin : DoricNativePlugin

@end

@implementation DoricDemoPlugin
- (void)test {
}

- (void)test2:(NSString *)val withPromise:(DoricPromise *)promise {
    dispatch_async(dispatch_get_main_queue(), ^{
        [promise resolve:nil];
    });
}
@end

@implementation DemoLibrary
- (void)load:(DoricRegistry *)registry {
    [registry registerNativePlugin:[DoricDemoPlugin class] withName:@"demo"];
}
@end
