//
//  DoricModalPlugin.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/29.
//

#import "DoricModalPlugin.h"
#import "DoricRegistry.h"


@implementation DoricModalPlugin

- (void)toast:(NSString *)message promise:(DoricPromise *)promise {
    dispatch_async(dispatch_get_main_queue(), ^{
        NSLog(@"toast:%@",message);
    });
}

@end
