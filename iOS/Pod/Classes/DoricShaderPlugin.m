//
//  DoricShaderPlugin.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/29.
//

#import "DoricShaderPlugin.h"

@implementation DoricShaderPlugin

- (void)render:(NSDictionary *)argument withPromise:(DoricPromise *)promise {
    NSLog(@"%@",argument);
}

@end
