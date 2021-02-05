//
//  DoricDevMonitor.m
//  DoricDevkit
//
//  Created by pengfei.zhou on 2021/2/5.
//

#import "DoricDevMonitor.h"

#import "DoricDev.h"
#import "NSString+JsonString.h"
#import "Doric.h"

@implementation DoricDevMonitor
- (void)onException:(NSException *)exception inContext:(DoricContext *)context {
    if (!DoricDev.instance.isInDevMode) {
        return;
    }
    NSDictionary *jsonDic = @{
            @"cmd": @"EXCEPTION",
            @"data": @{
                    @"source": [context.source stringByReplacingOccurrencesOfString:@".js" withString:@".ts"],
                    @"exception": exception.reason
            }
    };

    NSString *jsonStr = [NSString dc_convertToJsonWithDic:jsonDic];
    [[DoricDev instance] sendDevCommand:jsonStr];
}

- (void)onLog:(DoricLogType)type message:(NSString *)message {
    if (!DoricDev.instance.isInDevMode) {
        return;
    }
    NSString *typeString = @"DEFAULT";
    if (type == DoricLogTypeDebug) {
        typeString = @"DEFAULT";
    } else if (type == DoricLogTypeWarning) {
        typeString = @"WARN";
    } else if (type == DoricLogTypeError) {
        typeString = @"ERROR";
    }

    NSDictionary *jsonDic = @{
            @"cmd": @"LOG",
            @"data": @{
                    @"type": typeString,
                    @"message": message
            }
    };

    NSString *jsonStr = [NSString dc_convertToJsonWithDic:jsonDic];
    [[DoricDev instance] sendDevCommand:jsonStr];
}
@end
