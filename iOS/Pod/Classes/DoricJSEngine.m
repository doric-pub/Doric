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

-(void)initJSExecutor {
    [self.jsExecutor injectGlobalJSObject:INJECT_LOG obj:^(NSString * type, NSString * message){
        DoricLog(@"JS:%@",message);
    }];
    [self.jsExecutor injectGlobalJSObject:INJECT_REQUIRE obj:^(NSString *name){
        
    }];
}

-(void)initDoricEnvironment {
    [self loadBuiltinJS:DORIC_BUNDLE_SANDBOX];
    NSString *path = [[NSBundle bundleForClass:[self class]] pathForResource:DORIC_BUNDLE_LIB ofType:@"js"];
    NSString *jsContent = [NSString stringWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
    [self.jsExecutor loadJSScript:[self packageModuleScript: DORIC_MODULE_LIB content:jsContent]
                           source: [@"Module://" stringByAppendingString:DORIC_MODULE_LIB]];
}

-(void)loadBuiltinJS:(NSString *)fileName {
    NSString *path = [[NSBundle bundleForClass:[self class]] pathForResource:DORIC_BUNDLE_SANDBOX ofType:@"js"];
    NSString *jsContent = [NSString stringWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
    [self.jsExecutor loadJSScript:jsContent source:[@"Assets://" stringByAppendingString:fileName]];
}
    
-(void)invokeDoricMethod:(NSString *)method,... {
    NSMutableArray *array = [[NSMutableArray alloc] init];
    va_list args;
    va_start(args, method);
    id arg = va_arg(args, id);
    while(arg!=nil){
        [array addObject:arg];
        arg = va_arg(args, JSValue *);
    }
    va_end(args);
    [self.jsExecutor invokeObject:GLOBAL_DORIC method:method args:array];
}

-(NSString *)packageContextScript:(NSString *)contextId content:(NSString *)content {
    NSString *ret = [NSString stringWithFormat:TEMPLATE_CONTEXT_CREATE, content, contextId, contextId, contextId];
    return ret;
}

-(NSString *)packageModuleScript:(NSString *)moduleName content:(NSString *)content {
    NSString *ret = [NSString stringWithFormat:TEMPLATE_MODULE, moduleName, content];
    return ret;
}

-(void)prepareContext:(NSString *)contextId script:(NSString *)script source:(NSString *)source {
    [self.jsExecutor loadJSScript:[self packageContextScript:contextId content:script]
                           source:[@"Context://" stringByAppendingString:source]];
}

-(void)destroyContext:(NSString *)contextId {
    [self.jsExecutor loadJSScript:[NSString stringWithFormat:TEMPLATE_CONTEXT_DESTROY, contextId]
                           source:[@"_Context://" stringByAppendingString:contextId]];
}

@end
