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
// Created by pengfei.zhou on 2019/11/21.
//

#import "DoricNetworkPlugin.h"


@implementation DoricNetworkPlugin
- (void)request:(NSDictionary *)dic withPromise:(DoricPromise *)promise {
    NSString *url = dic[@"url"];
    NSString *method = dic[@"method"];
    NSDictionary <NSString *, NSString *> *headers = dic[@"headers"];
    NSNumber *timeout = dic[@"timeout"];
    NSString *data = dic[@"data"];
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:[NSURL URLWithString:url]];
    request.HTTPMethod = method.uppercaseString;
    if (timeout) {
        request.timeoutInterval = [timeout floatValue] / 1000;
    }
    if (headers) {
        [headers enumerateKeysAndObjectsUsingBlock:^(NSString *key, NSString *obj, BOOL *stop) {
            [request setValue:obj forHTTPHeaderField:key];
        }];
    }
    if (data) {
        [request setHTTPBody:[data dataUsingEncoding:NSUTF8StringEncoding]];
    }
    [[[NSURLSession sessionWithConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration]]
            dataTaskWithRequest:request
              completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
                  if (!error) {
                      NSString *dataStr = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
                      NSDictionary *resDic = @{
                              @"status": @(((NSHTTPURLResponse *) response).statusCode),
                              @"headers": ((NSHTTPURLResponse *) response).allHeaderFields,
                              @"data": dataStr,
                      };
                      [promise resolve:resDic];
                  } else {
                      [promise reject:error.description];
                  }
              }] resume];
}
@end
