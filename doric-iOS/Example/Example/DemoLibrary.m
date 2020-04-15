//
// Created by pengfei.zhou on 2019/12/11.
// Copyright (c) 2019 pengfei.zhou. All rights reserved.
//

#import "DemoLibrary.h"

@interface DoricDemoPlugin : DoricNativePlugin

@end

@implementation DoricDemoPlugin
- (void)test {
    dispatch_async(dispatch_get_main_queue(), ^{
        ShowToast(@"Test called", DoricGravityCenter);
    });
}
@end

@implementation DemoLibrary
- (void)load:(DoricRegistry *)registry {
    [registry registerNativePlugin:[DoricDemoPlugin class] withName:@"demo"];
}
@end
