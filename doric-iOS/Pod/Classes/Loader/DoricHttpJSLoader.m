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
// Created by pengfei.zhou on 2019/11/23.
//

#import "DoricHttpJSLoader.h"


@implementation DoricHttpJSLoader

- (BOOL)filter:(NSString *)source {
    return [source hasPrefix:@"http"];
}

- (DoricAsyncResult <NSString *> *)request:(NSString *)source {
    DoricAsyncResult *ret = [DoricAsyncResult new];
    NSURL *URL = [NSURL URLWithString:source];
    NSURLRequest *request = [NSURLRequest requestWithURL:URL];
    [[[NSURLSession sessionWithConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration]]
            dataTaskWithRequest:request
              completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
                  if (!error) {
                      NSString *dataStr = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
                      [ret setupResult:dataStr];
                  } else {
                      [ret setupError:[[NSException alloc] initWithName:@"DoricJSLoaderManager Exception" reason:error.description userInfo:nil]];
                  }
              }] resume];
    return ret;
}
@end