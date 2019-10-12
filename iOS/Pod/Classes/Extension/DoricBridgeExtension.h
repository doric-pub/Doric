//
//  DoricBridgeExtension.h
//  Doric
//
//  Created by pengfei.zhou on 2019/7/29.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface DoricBridgeExtension : NSObject
- (id)callNativeWithContextId:(NSString *)contextId module:(NSString *)module method:(NSString *)method callbackId:(NSString *)callbackId argument:(id)argument;
@end

NS_ASSUME_NONNULL_END
