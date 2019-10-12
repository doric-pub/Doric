//
//  DoricPromise.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/29.
//

#import "DoricPromise.h"
#import "DoricConstant.h"

@interface DoricPromise ()
@property(nonatomic, strong) DoricContext *context;
@property(nonatomic, strong) NSString *callbackId;

@end

@implementation DoricPromise

- (instancetype)initWithContext:(DoricContext *)context callbackId:(NSString *)callbackId {
    if (self = [super init]) {
        _context = context;
        _callbackId = callbackId;
    }
    return self;
}

- (void)resolve:(id)result {
    [self.context.driver invokeDoricMethod:DORIC_BRIDGE_RESOLVE, self.context.contextId, self.callbackId, result, nil];
}

- (void)reject:(id)result {
    [self.context.driver invokeDoricMethod:DORIC_BRIDGE_REJECT, self.context.contextId, self.callbackId, result, nil];
}
@end
