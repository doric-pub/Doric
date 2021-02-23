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
//  DoricDevMonitor.m
//  DoricDevkit
//
//  Created by pengfei.zhou on 2021/2/5.
//

#import "DoricDevMonitor.h"

#import "DoricDev.h"
#import "Doric.h"

@implementation DoricDevMonitor
- (void)onException:(NSException *)exception inContext:(DoricContext *)context {
    if (!DoricDev.instance.isInDevMode) {
        return;
    }
    [DoricDev.instance sendDevCommand:@"EXCEPTION"
                              payload:@{
                                      @"source": [context.source stringByReplacingOccurrencesOfString:@".js" withString:@".ts"],
                                      @"exception": exception.reason
                              }];
}

- (void)onLog:(DoricLogType)type message:(NSString *)message {
    if (!DoricDev.instance.isInDevMode) {
        return;
    }
    NSString *typeString = @"DEFAULT";
    if (type == DoricLogTypeWarning) {
        typeString = @"WARN";
    } else if (type == DoricLogTypeError) {
        typeString = @"ERROR";
    }

    [DoricDev.instance sendDevCommand:@"LOG"
                              payload:@{
                                      @"type": typeString,
                                      @"message": message
                              }];
}
@end
