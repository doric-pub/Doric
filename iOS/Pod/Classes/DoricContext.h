//
//  DoricContext.h
//  Doric
//
//  Created by pengfei.zhou on 2019/7/25.
//

#import <Foundation/Foundation.h>
#import "DoricDriver.h"

NS_ASSUME_NONNULL_BEGIN

@class DoricRootNode;

@interface DoricContext : NSObject

@property(nonatomic, strong) NSString *contextId;
@property(nonatomic, strong) DoricDriver *driver;
@property(nonatomic, strong) NSMutableDictionary *pluginInstanceMap;
@property(nonatomic, strong) DoricRootNode *rootNode;
@property(nonatomic, strong) NSString *source;
@property(nonatomic, strong) NSString *script;;
@property(nonatomic, strong) NSDictionary *initialParams;

- (instancetype)initWithScript:(NSString *)script source:(NSString *)source;

- (DoricAsyncResult *)callEntity:(NSString *)method, ...;

- (DoricAsyncResult *)callEntity:(NSString *)method withArguments:(va_list)args;

- (DoricAsyncResult *)callEntity:(NSString *)method withArgumentsArray:(NSArray *)args;

- (void)initContextWithWidth:(CGFloat)width height:(CGFloat)height;

- (void)reload:(NSString *)script;

- (void)onShow;

- (void)onHidden;

@end

NS_ASSUME_NONNULL_END
