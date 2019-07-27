//
//  DoricDriver.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/26.
//

#import "DoricDriver.h"
#import "DoricJSEngine.h"
#import "DoricConstant.h"

@interface DoricDriver()
@property (nonatomic,  strong) DoricJSEngine *jsExecutor;
@end

@implementation DoricDriver

@dynamic registry;

-(DoricRegistry *)registry {
    return self.jsExecutor.registry;
}

+ (instancetype)instance{
    static DoricDriver *_instance;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _instance = [[DoricDriver alloc] init];
    });
    return _instance;
}

-(DoricAsyncResult<JSValue *>  *)invokeDoricMethod:(NSString *)method, ... {
    va_list args;
    va_start(args, method);
    DoricAsyncResult *ret = [self invokeDoricMethod:method arguments:args];
    va_end(args);
    return ret;
}

-(DoricAsyncResult<JSValue *>  *)invokeDoricMethod:(NSString *)method arguments:(va_list)args {
    DoricAsyncResult *ret = [[DoricAsyncResult alloc] init];
    __weak typeof(self) _self = self;
    dispatch_async(self.jsExecutor.jsQueue, ^(){
        __strong typeof(_self) self = _self;
        if (!self) return;
        @try {
            JSValue *jsValue = [self.jsExecutor invokeDoricMethod:method arguments:args];
            [ret setupResult:jsValue];
        } @catch (NSException *exception) {
            [ret setupError:exception];
        }
    });
    return ret;
}

-(DoricAsyncResult<JSValue *> *)invokeContextEntity:(NSString *)contextId method:(NSString *)method,... {
    DoricAsyncResult *ret = [[DoricAsyncResult alloc] init];
    NSMutableArray *array = [[NSMutableArray alloc] init];
    [array addObject:DORIC_CONTEXT_INVOKE];
    [array addObject:contextId];
    [array addObject:method];
    va_list args;
    va_start(args, method);
    id arg = va_arg(args, id);
    while(arg != nil){
        [array addObject:arg];
        arg = va_arg(args, JSValue *);
    }
    va_end(args);
    __weak typeof(self) _self = self;
    dispatch_async(self.jsExecutor.jsQueue, ^(){
        __strong typeof(_self) self = _self;
        if (!self) return;
        @try {
            JSValue *jsValue = [self.jsExecutor invokeDoricMethod:DORIC_CONTEXT_INVOKE argumentsArray:array];
            [ret setupResult:jsValue];
        } @catch (NSException *exception) {
             [ret setupError:exception];
        }
    });
    return ret;
}

-(DoricAsyncResult *)createContext:(NSString *)contextId script:(NSString *)script source:(NSString *)source {
    DoricAsyncResult *ret = [[DoricAsyncResult alloc] init];
    __weak typeof(self) _self = self;
    dispatch_async(self.jsExecutor.jsQueue, ^(){
        __strong typeof(_self) self = _self;
        if(!self) return;
        @try{
            [self.jsExecutor prepareContext:contextId script:script source:source];
            [ret setupResult:[NSNumber numberWithBool:YES]];
        } @catch (NSException *exception) {
            [ret setupError:exception];
        }
    });
    return ret;
}

-(DoricAsyncResult *)destroyContext:(NSString *)contextId {
    DoricAsyncResult *ret = [[DoricAsyncResult alloc] init];
    __weak typeof(self) _self = self;
    dispatch_async(self.jsExecutor.jsQueue, ^(){
        __strong typeof(_self) self = _self;
        if(!self) return;
        @try{
            [self.jsExecutor destroyContext:contextId];
            [ret setupResult:[NSNumber numberWithBool:YES]];
        } @catch (NSException *exception) {
            [ret setupError:exception];
        }
    });
    return ret;
}


@end
