//
//  DoricContextManager.h
//  Doric
//
//  Created by pengfei.zhou on 2019/7/29.
//

#import <Foundation/Foundation.h>
#import "DoricContext.h"

NS_ASSUME_NONNULL_BEGIN

@interface DoricContextManager : NSObject
+ (instancetype)instance;

- (void)createContext:(DoricContext *)context script:(NSString *)script source:(NSString *)source;

- (void)destroyContext:(DoricContext *)context;

- (DoricContext *)getContext:(NSString *)contextId;
@end

NS_ASSUME_NONNULL_END
