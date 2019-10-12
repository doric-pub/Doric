//
//  DoricShaderPlugin.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/29.
//

#import "DoricShaderPlugin.h"
#import "DoricRootNode.h"

@implementation DoricShaderPlugin

- (void)render:(NSDictionary *)argument withPromise:(DoricPromise *)promise {
    __weak typeof(self) _self = self;
    dispatch_async(dispatch_get_main_queue(), ^{
        __strong typeof(_self) self = _self;
        [self.doricContext.rootNode render:argument[@"props"]];
    });
}

@end
