//
//  DoricContext.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/25.
//

#import "DoricContext.h"
#import "DoricContextManager.h"
#import "DoricRootNode.h"
#import "DoricConstant.h"

@implementation DoricContext

- (instancetype)initWithScript:(NSString *)script source:(NSString *)source {
    if (self = [super init]) {
        _driver = [DoricDriver instance];
        _pluginInstanceMap = [[NSMutableDictionary alloc] init];
        [[DoricContextManager instance] createContext:self script:script source:source];
        _rootNode = [[DoricRootNode alloc] initWithContext:self];
        _script = script;
        _source = source;
        _initialParams = [@{@"width": @(LAYOUT_MATCH_PARENT), @"height": @(LAYOUT_MATCH_PARENT)} mutableCopy];
        [self callEntity:DORIC_ENTITY_CREATE, nil];
    }
    return self;
}

- (void)dealloc {
    [self callEntity:DORIC_ENTITY_DESTROY, nil];
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

- (void)initContextWithWidth:(CGFloat)width height:(CGFloat)height {
    [self.initialParams setValue:@(width) forKey:@"width"];
    [self.initialParams setValue:@(height) forKey:@"height"];
    [self callEntity:DORIC_ENTITY_INIT, self.initialParams, nil];
}

- (void)reload:(NSString *)script {
    self.script = script;
    [self.driver createContext:self.contextId script:script source:self.source];
    [self callEntity:DORIC_ENTITY_INIT, self.initialParams, nil];
}

- (void)onShow {
    [self callEntity:DORIC_ENTITY_SHOW, nil];
}

- (void)onHidden {
    [self callEntity:DORIC_ENTITY_HIDDEN, nil];
}

@end
