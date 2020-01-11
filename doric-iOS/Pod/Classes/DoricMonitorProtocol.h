//
// Created by pengfei.zhou on 2020/1/10.
//

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSInteger, DoricLogType) {
    DoricLogTypeDebug = 0,
    DoricLogTypeWarning = 1,
    DoricLogTypeError = 2,
};

@protocol DoricMonitorProtocol <NSObject>
- (void)onException:(NSException *)exception;

- (void)onLog:(DoricLogType)type message:(NSString *)message;
@end