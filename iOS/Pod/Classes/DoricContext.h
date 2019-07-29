//
//  DoricContext.h
//  Doric
//
//  Created by pengfei.zhou on 2019/7/25.
//

#import <Foundation/Foundation.h>
#import "DoricDriver.h"

NS_ASSUME_NONNULL_BEGIN

@interface DoricContext : NSObject

@property (nonatomic,strong) NSString *contextId;
@property (nonatomic,strong) DoricDriver *driver;

- (instancetype)initWithScript:(NSString *)script source:(NSString *)source;

- (DoricAsyncResult *)callEntity:(NSString *)method, ...;

@end

NS_ASSUME_NONNULL_END
