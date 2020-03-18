/*
 * Copyright [2019] [Doric.Pub]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//
//  DoricDebugJSEngine.m
//  Doric
//
//  Created by jingpeng.wang on 2020/2/25.
//

#import "DoricContext.h"
#import "DoricDebugJSEngine.h"
#import "DoricJSRemoteExecutor.h"
#import "DoricUtil.h"
#import "NSString+JsonString.h"
#import "DoricDev.h"

@interface DoricDebugMonitor : NSObject <DoricMonitorProtocol>
@end

@implementation DoricDebugMonitor
- (void)onException:(NSException *)exception inContext:(DoricContext *)context {
    DoricLog(@"DefaultMonitor - source: %@-  onException - %@", context.source, exception.reason);
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
    DoricLog(message);
    
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

@interface DoricDebugJSEngine ()
@end

@implementation DoricDebugJSEngine

- (instancetype)init {
    if (self = [super init]) {
    }
    return self;
}

- (void)initJSEngine {
    [self.registry registerMonitor:[DoricDebugMonitor new]];
    self.jsExecutor = [[DoricJSRemoteExecutor alloc] init];
}

@end
