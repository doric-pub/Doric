//
//  DoricJSEngine.h
//  Doric
//
//  Created by pengfei.zhou on 2019/7/26.
//

#import <Foundation/Foundation.h>
#import <JavaScriptCore/JavaScriptCore.h>
#import "DoricRegistry.h"

NS_ASSUME_NONNULL_BEGIN

@interface DoricJSEngine : NSObject

@property(nonatomic,strong) dispatch_queue_t jsQueue;

@property(nonatomic,strong) DoricRegistry *registry;

-(void)prepareContext:(NSString *)contextId script:(NSString *)script source:(NSString *)source;

-(void)destroyContext:(NSString *)contextId;

-(JSValue *)invokeDoricMethod:(NSString *)method, ...;

-(JSValue *)invokeDoricMethod:(NSString *)method arguments:(va_list)args;

-(JSValue *)invokeDoricMethod:(NSString *)method argumentsArray:(NSArray *)args;
@end

NS_ASSUME_NONNULL_END
