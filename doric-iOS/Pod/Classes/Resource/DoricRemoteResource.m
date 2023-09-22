/*
 * Copyright [2021] [Doric.Pub]
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
// Created by pengfei.zhou on 2021/10/25.
//

#import "DoricRemoteResource.h"

@interface DoricRemoteResource ()
@property(nonatomic, strong) NSMutableDictionary *headers;
@end

@implementation DoricRemoteResource
- (void)setHeaderWithKey:(NSString *)key withValue:(NSString *)value {
    if (!self.headers) {
        self.headers = [NSMutableDictionary new];
    }
    self.headers[key] = value;
}

- (DoricAsyncResult <NSData *> *)fetchRaw {
    DoricAsyncResult *result = [DoricAsyncResult new];
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:[NSURL URLWithString:self.identifier]];
    if (self.headers) {
        [self.headers enumerateKeysAndObjectsUsingBlock:^(NSString *key, NSString *obj, BOOL *stop) {
            [request setValue:obj forHTTPHeaderField:key];
        }];
    }
    [[[NSURLSession sessionWithConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration]]
            dataTaskWithRequest:request
              completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
                  if (!error) {
                      [result setupResult:data];
                  } else {
                      [result setupError:(id) error.description];
                  }
              }] resume];
    return result;
}
@end
