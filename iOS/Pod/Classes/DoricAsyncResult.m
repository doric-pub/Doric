//
//  DoricAsyncResult.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/26.
//

#import "DoricAsyncResult.h"

@interface DoricAsyncResult()
@property(nonatomic,strong) id result;
@property(nonatomic,strong) DoricResultCallback resultCallback;
@property(nonatomic,strong) DoricExceptionCallback exceptionCallback;
@property(nonatomic,strong) DoricFinishCallback finishCallback;
@end

@implementation DoricAsyncResult

- (void)setupResult:(id)result {
    self.result = result;
    if(self.resultCallback){
        self.resultCallback(result);
    }
    if(self.finishCallback){
        self.finishCallback();
    }
}

- (void)setupError:(NSException *)exception {
    self.result = exception;
    if(self.exceptionCallback){
        self.exceptionCallback(exception);
    }
    if(self.finishCallback){
        self.finishCallback();
    }
}
- (BOOL)hasResult {
    return self.result;
}

- (id)getResult {
    return self.result;
}

- (void)setResultCallback:(DoricResultCallback)callback exceptionCallback:(DoricExceptionCallback)exceptionCallback {
    self.resultCallback = callback;
    self.exceptionCallback = exceptionCallback;
    if([self.result isKindOfClass: [NSException class]]){
        self.exceptionCallback(self.result);
    }else if(self.result){
        self.resultCallback(self.result);
    }
}

- (void)setFinishCallback:(DoricFinishCallback)callback {
    self.finishCallback = callback;
    if(self.result){
        callback();
    }
}
@end
