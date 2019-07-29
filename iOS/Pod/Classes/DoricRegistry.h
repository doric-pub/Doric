//
//  DoricRegistry.h
//  Doric
//
//  Created by pengfei.zhou on 2019/7/27.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface DoricRegistry : NSObject

- (NSString *)acquireJSBundle:(NSString *)name;

- (void)registerJSBundle:(NSString *)bundle withName:(NSString *)name;


- (void)registerNativePlugin:(Class)pluginClass withName:(NSString *)name;

- (Class)acquireNativePlugin:(NSString *)name;

@end

NS_ASSUME_NONNULL_END
