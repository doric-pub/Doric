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
//  DoricAsyncResult.h
//  Doric
//
//  Created by pengfei.zhou on 2019/7/26.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN


@interface DoricAsyncResult <R> : NSObject
typedef void(^DoricResultCallback)(R);

typedef void(^DoricExceptionCallback)(NSException *);

typedef void(^DoricFinishCallback)(void);

@property(nonatomic, strong) DoricResultCallback resultCallback;
@property(nonatomic, strong) DoricExceptionCallback exceptionCallback;
@property(nonatomic, strong) DoricFinishCallback finishCallback;

- (void)setupResult:(R)result;

- (void)setupError:(NSException *)exception;

- (BOOL)hasResult;

- (R)getResult;
@end

NS_ASSUME_NONNULL_END
