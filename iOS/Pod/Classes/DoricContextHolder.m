//
//  DoricComponent.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/29.
//

#import "DoricContextHolder.h"

@implementation DoricContextHolder

- (instancetype)initWithContext:(DoricContext *)doricContext {
    if(self = [super init]){
        _doricContext = doricContext;
    }
    return self;
}

@end
