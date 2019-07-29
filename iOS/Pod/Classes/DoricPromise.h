//
//  DoricPromise.h
//  Doric
//
//  Created by pengfei.zhou on 2019/7/29.
//

#import <Foundation/Foundation.h>
#import "DoricContext.h"

NS_ASSUME_NONNULL_BEGIN

@interface DoricPromise : NSObject
- (instancetype)initWithContext: (DoricContext *)context callbackId:(NSString *)callbackId;

- (void)resolve:(id) result;

- (void)reject:(id) result;
@end

NS_ASSUME_NONNULL_END
