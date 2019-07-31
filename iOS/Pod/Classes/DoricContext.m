//
//  DoricContext.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/25.
//

#import "DoricContext.h"
#import "DoricContextManager.h"
#import "DoricRootNode.h"

@implementation DoricContext

- (instancetype)initWithScript:(NSString *)script source:(NSString *)source {
    if(self = [super init]){
        _driver = [DoricDriver instance];
        _pluginInstanceMap = [[NSMutableDictionary alloc] init];
        [[DoricContextManager instance] createContext:self script:script source:source];
        _rootNode = [[DoricRootNode alloc] initWithContext:self];
    }
    return self;
}

- (void)dealloc {
    [[DoricContextManager instance] destroyContext:self];
}

- (DoricAsyncResult *)callEntity:(NSString *)method, ... {
    va_list args;
    va_start(args, method);
    DoricAsyncResult *ret = [self.driver invokeContextEntity:self.contextId method:method arguments:args];
    va_end(args);
    return ret;
}

- (DoricAsyncResult *)callEntity:(NSString *)method withArguments:(va_list)args {
    return [self.driver invokeContextEntity:self.contextId method:method arguments:args];
}
- (DoricAsyncResult *)callEntity:(NSString *)method withArgumentsArray:(NSArray *)args {
    return [self.driver invokeContextEntity:self.contextId method:method argumentsArray:args];
}
@end
