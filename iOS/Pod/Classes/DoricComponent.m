//
//  DoricComponent.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/29.
//

#import "DoricComponent.h"

@implementation DoricComponent

- (instancetype)initWithContext:(DoricContext *)doricContext {
    if(self = [super init]){
        _doricContext = doricContext;
    }
    return self;
}

@end
