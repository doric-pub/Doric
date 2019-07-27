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
@property(nonatomic,strong) NSMutableDictionary *timers;
@end

@implementation DoricJSEngine

-(instancetype)init {
    if(self = [super init]){
        _jsQueue = dispatch_queue_create("doric.jsengine", DISPATCH_QUEUE_SERIAL);
        dispatch_async(_jsQueue, ^(){
            self.timers = [[NSMutableDictionary alloc] init];
            self.jsExecutor = [[DoricJSCoreExecutor alloc] init];
            self.registry = [[DoricRegistry alloc] init];
            [self initDoricEnvironment];
        });
    }
    return self;
}

-(void)initJSExecutor {
    __weak typeof(self) _self = self;
    
    [self.jsExecutor injectGlobalJSObject:INJECT_LOG obj:^(NSString * type, NSString * message) {
        DoricLog(@"JS:%@",message);
    }];
    
    [self.jsExecutor injectGlobalJSObject:INJECT_REQUIRE obj:^(NSString *name){
        __strong typeof(_self) self = _self;
        if(!self) return NO;
        NSString *content = [self.registry acquireJSBundle:name];
        if(!content){
            DoricLog(@"require js bundle:%@ is empty", name);
            return NO;
        }
        @try{
            [self.jsExecutor loadJSScript:[self packageModuleScript:name content:content]
                                   source:[@"Module://" stringByAppendingString:name]];
        }@catch(NSException *e){
            DoricLog(@"require js bundle:%@ error,for %@", name, e.reason);
        }
        return YES;
    }];
    [self.jsExecutor injectGlobalJSObject:INJECT_TIMER_SET
                                      obj:^(NSNumber *timerId,NSNumber *interval,NSNumber *isInterval) {
                                           __strong typeof(_self) self = _self;
                                          NSMethodSignature *sig = [[self class] instanceMethodSignatureForSelector:@selector(doTimer:repeat:)];
                                          NSInvocation *invocation = [NSInvocation invocationWithMethodSignature:sig];
                                          invocation.target = self;
                                          invocation.selector = @selector(doTimer:repeat:);
                                          NSString *timerId_str = [timerId stringValue];
                                          BOOL repeat = [isInterval boolValue];
                                          [invocation setArgument:&timerId_str atIndex:2];
                                          [invocation setArgument:&repeat atIndex:3];
                                          NSTimer *timer = [NSTimer scheduledTimerWithTimeInterval:[interval doubleValue]/1000 invocation:invocation repeats:repeat];
                                          [self.timers setValue:timer forKey:timerId_str];
                                          dispatch_async(dispatch_get_main_queue(), ^(){
                                              [[NSRunLoop currentRunLoop] addTimer:timer forMode:NSRunLoopCommonModes];
                                          });
                                      }];
    
    [self.jsExecutor injectGlobalJSObject:INJECT_TIMER_CLEAR
                                      obj:^(NSString *timerId) {
                                           __strong typeof(_self) self = _self;
                                          NSTimer *timer = [self.timers valueForKey:timerId];
                                          if(timer){
                                              [timer invalidate];
                                              [self.timers removeObjectForKey:timerId];
                                          }
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
    
-(JSValue *)invokeDoricMethod:(NSString *)method,... {
    va_list args;
    va_start(args, method);
    JSValue *ret = [self invokeDoricMethod:method arguments:args];
    va_end(args);
    return ret;
}

-(JSValue *)invokeDoricMethod:(NSString *)method arguments:(va_list)args {
    NSMutableArray *array = [[NSMutableArray alloc] init];
    id arg = va_arg(args, id);
    while(arg != nil){
        [array addObject:arg];
        arg = va_arg(args, JSValue *);
    }
    return [self.jsExecutor invokeObject:GLOBAL_DORIC method:method args:array];
}

-(JSValue *)invokeDoricMethod:(NSString *)method argumentsArray:(NSArray *)args {
    return [self.jsExecutor invokeObject:GLOBAL_DORIC method:method args:args];
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

-(void)doTimer:(NSString *)timerId repeat:(BOOL) repeat {
    NSTimer *timer = [self.timers valueForKey:timerId];
    if(timer){
        __weak typeof(self) _self = self;
        dispatch_async(self.jsQueue, ^(){
            __strong typeof(_self) self = _self;
            @try {
                [self invokeDoricMethod:DORIC_TIMER_CALLBACK, timerId, nil];
            } @catch (NSException *exception) {
                DoricLog(@"Timer Callback error:%@", exception.reason);
            }
            if(!repeat){
                [self.timers removeObjectForKey:timerId];
            }
        });
    }
}
@end
