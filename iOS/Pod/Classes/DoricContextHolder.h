//
//  DoricComponent.h
//  Doric
//
//  Created by pengfei.zhou on 2019/7/29.
//

#import <Foundation/Foundation.h>
#import "DoricContext.h"
NS_ASSUME_NONNULL_BEGIN

@interface DoricContextHolder : NSObject
@property (nonatomic,strong) DoricContext *doricContext;

- (instancetype)initWithContext:(DoricContext *)doricContext;

@end

NS_ASSUME_NONNULL_END
