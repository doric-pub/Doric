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
/**
 * Called when native or js exception occurred in doric
 *
 * @param source Which source file
 * @param e      exception which is thrown within doric sdk
 */
- (void)onException:(NSException *)exception source:(NSString *)source;

/**
 * @param type    The priority/type of this log message.
 * @param message The message you would like logged.
 */
- (void)onLog:(DoricLogType)type message:(NSString *)message;
@end