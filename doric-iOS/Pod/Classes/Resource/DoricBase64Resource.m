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

#import "DoricBase64Resource.h"


@implementation DoricBase64Resource
- (DoricAsyncResult <NSData *> *)fetchRaw {
    DoricAsyncResult *result = [DoricAsyncResult new];
    NSString *inString = nil;
    if ([self.identifier hasPrefix:@"data:image"]) {
        inString = [self.identifier componentsSeparatedByString:@","].lastObject;
    }
    NSData *data = [[NSData alloc] initWithBase64EncodedString:inString
                                                       options:NSDataBase64DecodingIgnoreUnknownCharacters];
    [result setupResult:data];
    return result;
}
@end
