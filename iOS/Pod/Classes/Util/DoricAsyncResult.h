//
//  DoricAsyncResult.h
//  Doric
//
//  Created by pengfei.zhou on 2019/7/26.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN


@interface DoricAsyncResult <R>: NSObject
typedef void(^DoricResultCallback)(R);
typedef void(^DoricExceptionCallback)(NSException *);
typedef void(^DoricFinishCallback)(void);

@property(nonatomic,strong) DoricResultCallback resultCallback;
@property(nonatomic,strong) DoricExceptionCallback exceptionCallback;
@property(nonatomic,strong) DoricFinishCallback finishCallback;

- (void)setupResult:(R)result;
- (void)setupError:(NSException*)exception;
- (BOOL)hasResult;
- (R)getResult;
@end

NS_ASSUME_NONNULL_END
