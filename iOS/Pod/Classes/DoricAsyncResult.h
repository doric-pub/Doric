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

-(void)setupResult:(R)result;
-(void)setupError:(NSException*)exception;
-(BOOL)hasResult;
-(R)getResult;
-(void)setResultCallback:(DoricResultCallback) callback exceptionCallback:(DoricExceptionCallback) exceptionCallback;
-(void)setFinishCallback:(DoricFinishCallback) callback;
@end

NS_ASSUME_NONNULL_END
