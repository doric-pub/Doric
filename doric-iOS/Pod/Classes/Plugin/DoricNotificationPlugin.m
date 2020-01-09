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
// Created by pengfei.zhou on 2020/1/8.
//

#import "DoricNotificationPlugin.h"


@implementation DoricNotificationPlugin

- (void)publish:(NSDictionary *)dic withPromise:(DoricPromise *)promise {
    NSString *notificationName = [NSString stringWithFormat:@"__doric__%@#%@", dic, promise];
    NSString *data = dic[@"data"];
    NSDictionary *dataDic = nil;
    if (data) {
        NSData *jsonData = [data dataUsingEncoding:NSUTF8StringEncoding];
        NSError *err;
        dataDic = [NSJSONSerialization JSONObjectWithData:jsonData
                                                  options:NSJSONReadingMutableContainers
                                                    error:&err];
    }
    [[NSNotificationCenter defaultCenter] postNotificationName:notificationName object:nil userInfo:dataDic];
}


- (void)subscribe:(NSDictionary *)dic withPromise:(DoricPromise *)promise {
    NSString *notificationName = [NSString stringWithFormat:@"__doric__%@#%@", dic, promise];
    NSString *callbackId = dic[@"callback"];
    [[NSNotificationCenter defaultCenter] addObserverForName:notificationName
                                                      object:nil
                                                       queue:[NSOperationQueue mainQueue]
                                                  usingBlock:^(NSNotification *note) {

                                                  }];
}


@end