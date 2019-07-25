//
//  DoricJSEngineProtocal.h
//  Doric
//
//  Created by pengfei.zhou on 2019/7/25.
//

#import <Foundation/Foundation.h>
#import <JavaScriptCore/JavaScriptCore.h>

NS_ASSUME_NONNULL_BEGIN

typedef JSValue*(^DoricOCFunction)();

@protocol DoricJSExecutorProtocal <NSObject>

-(NSString *) loadJSScript:(NSString *)script source:(NSString *)source;

-(void) injectGlobalJSFunction:(NSString *)name func:(DoricOCFunction)func;

-(void) injectGlobalJSObject:(NSString *)name obj:(NSDictionary *)obj;

-(JSValue *) invokeObject: (NSString *)objName method:(NSString *)funcName args:(NSArray *)args;

@end

NS_ASSUME_NONNULL_END
