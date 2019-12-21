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
//  DoricAsyncResult.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/26.
//

#import "DoricAsyncResult.h"

@interface DoricAsyncResult ()
@property(nonatomic, strong) id result;
@end

@implementation DoricAsyncResult

- (void)setupResult:(id)result {
    self.result = result;
    if (self.resultCallback) {
        self.resultCallback(result);
    }
    if (self.finishCallback) {
        self.finishCallback();
    }
}

- (void)setupError:(NSException *)exception {
    self.result = exception;
    if (self.exceptionCallback) {
        self.exceptionCallback(exception);
    }
    if (self.finishCallback) {
        self.finishCallback();
    }
}

- (BOOL)hasResult {
    return self.result != nil;
}

- (id)getResult {
    return self.result;
}

- (void)setResultCallback:(void (^)(id))callback {
    _resultCallback = callback;
    if (self.result && ![self.result isKindOfClass:[NSException class]]) {
        callback(self.result);
    }
}

- (void)setExceptionCallback:(void (^)(NSException *))exceptionCallback {
    _exceptionCallback = exceptionCallback;
    if ([self.result isKindOfClass:[NSException class]]) {
        exceptionCallback(self.result);
    }
}

- (void)setFinishCallback:(void (^)(void))finishCallback {
    _finishCallback = finishCallback;
    if (self.result) {
        finishCallback();
    }
}

- (id)waitUntilResult {
    if (self.result) {
        return self.result;
    }

    dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
    self.resultCallback = ^(id r) {
        dispatch_semaphore_signal(semaphore);
    };
    dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
    return self.result;
}
@end
