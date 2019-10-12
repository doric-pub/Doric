//
//  DoricDriver.h
//  Doric
//
//  Created by pengfei.zhou on 2019/7/26.
//

#import <Foundation/Foundation.h>
#import "DoricAsyncResult.h"
#import "DoricRegistry.h"

typedef NS_ENUM(NSInteger, QueueMode) {
    JS = 0,
    UI,
    INDEPENDENT
};

NS_ASSUME_NONNULL_BEGIN

@interface DoricDriver : NSObject
+ (instancetype)instance;

@property(nonatomic, strong) DoricRegistry *registry;

- (DoricAsyncResult *)createContext:(NSString *)contextId script:(NSString *)script source:(NSString *)source;

- (DoricAsyncResult *)destroyContext:(NSString *)contextId;

- (DoricAsyncResult *)invokeDoricMethod:(NSString *)method, ...;

- (DoricAsyncResult *)invokeContextEntity:(NSString *)contextId method:(NSString *)method, ...;

- (DoricAsyncResult *)invokeContextEntity:(NSString *)contextId method:(NSString *)method arguments:(va_list)args;

- (DoricAsyncResult *)invokeContextEntity:(NSString *)contextId method:(NSString *)method argumentsArray:(NSArray *)args;

- (void)connectDevKit:(NSString *)url;

- (void)disconnectDevKit;
@end

NS_ASSUME_NONNULL_END
