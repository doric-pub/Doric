//
//  DoricJSEngine.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/26.
//

#import "DoricJSEngine.h"
#import "DoricJSExecutorProtocal.h"
#import "DoricJSCoreExecutor.h"
#import "DoricConstant.h"
#import "DoricUtil.h"

@interface DoricJSEngine()

@property(nonatomic,strong) id<DoricJSExecutorProtocal> jsExecutor;
@property(nonatomic,strong) dispatch_queue_t jsQueue;
@end

@implementation DoricJSEngine

-(instancetype)init {
    if(self = [super init]){
        _jsQueue = dispatch_queue_create("doric.jsengine", DISPATCH_QUEUE_SERIAL);
        dispatch_async(_jsQueue, ^(){
            self.jsExecutor = [[DoricJSCoreExecutor alloc] init];
            [self initDoricEnvironment];
        });
    }
    return self;
}

-(void)initDoricEnvironment {
    [self.jsExecutor injectGlobalJSObject:INJECT_LOG obj:^(NSString * type, NSString * message){
        DoricLog(@"JS:%@",message);
    }];
    [self.jsExecutor injectGlobalJSObject:INJECT_REQUIRE obj:^(NSString *name){
        
    }];
    [self.jsExecutor loadJSScript:@"nativeLog('w','log from js')" source:@""];
}

-(void)invokeDoricMethod:(NSString *)method,... {
    NSMutableArray *array = [[NSMutableArray alloc] init];
    va_list args;
    va_start(args, method);
    JSValue *arg = va_arg(args, JSValue *);
    while(arg!=nil){
        [array addObject:arg];
        arg = va_arg(args, JSValue *);
    }
    va_end(args);
    [self.jsExecutor invokeObject:GLOBAL_DORIC method:method args:array];
}


@end
