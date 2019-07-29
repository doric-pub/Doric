//
//  DoricBridgeExtension.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/29.
//

#import "DoricBridgeExtension.h"
#import "DoricRegistry.h"
#import "DoricContextManager.h"
#import "DoricNativePlugin.h"

@implementation DoricBridgeExtension

- (id)callNativeWithContextId:(NSString *)contextId module:(NSString *)module method:(NSString *)method callbackId:(NSString *)callbackId argument:(id)argument {
    DoricContext *context = [[DoricContextManager instance] getContext:contextId];
    DoricRegistry *registry = context.driver.registry;
    Class pluginClass = [registry acquireNativePlugin:module];
    DoricNativePlugin *nativePlugin = [context.pluginInstanceMap objectForKey:module];
    if(nativePlugin == nil){
        nativePlugin = [[pluginClass alloc] initWithContext:context];
        [context.pluginInstanceMap setObject:nativePlugin forKey:module];
    }
    
    return nil;
}
@end
