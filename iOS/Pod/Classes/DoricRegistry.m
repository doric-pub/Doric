//
//  DoricRegistry.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/27.
//

#import "DoricRegistry.h"
#import "DoricModalPlugin.h"
#import "DoricShaderPlugin.h"

@interface DoricRegistry ()

@property (nonatomic,strong) NSMutableDictionary *bundles;
@property (nonatomic,strong) NSMutableDictionary *plugins;

@end

@implementation DoricRegistry

- (instancetype)init {
    if(self = [super init]){
        _bundles = [[NSMutableDictionary alloc] init];
        _plugins = [[NSMutableDictionary alloc] init];
        [self innerRegister];
    }
    return self;
}

- (void)innerRegister {
    [self registerNativePlugin:DoricModalPlugin.class withName:@"modal"];
    [self registerNativePlugin:DoricShaderPlugin.class withName:@"shader"];
}

- (void)registerJSBundle:(NSString *)bundle withName:(NSString *)name {
    [self.bundles setObject:bundle forKey:name];
}

- (NSString *)acquireJSBundle:(NSString *)name {
    return [self.bundles objectForKey:name];
}

- (void)registerNativePlugin:(Class)pluginClass withName:(NSString *)name {
    [self.plugins setObject:pluginClass forKey:name];
}

- (Class)acquireNativePlugin:(NSString *)name {
    return [self.plugins objectForKey:name];
}

@end
