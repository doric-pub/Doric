//
//  DoricRegistry.h
//  Doric
//
//  Created by pengfei.zhou on 2019/7/27.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface DoricRegistry : NSObject

-(NSString *)acquireJSBundle:(NSString *)bundleName;

@end

NS_ASSUME_NONNULL_END
