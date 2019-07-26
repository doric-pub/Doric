//
//  DoricDriver.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/26.
//

#import "DoricDriver.h"
#import "DoricJSCoreExecutor.h"
#import "DoricJSExecutorProtocal.h"

@interface DoricDriver()
@property (nonatomic,  strong) id<DoricJSExecutorProtocal> jsExecutor;
@end

@implementation DoricDriver

+ (instancetype)instance{
    static DoricDriver *_instance;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _instance = [[DoricDriver alloc] init];
    });
    return _instance;
}

@end
