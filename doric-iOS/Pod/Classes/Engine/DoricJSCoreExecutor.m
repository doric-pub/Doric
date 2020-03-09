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
//  DoricJSCoreExecutor.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/25.
//

#import "DoricJSCoreExecutor.h"

@interface DoricJSCoreExecutor ()

@property(nonatomic, strong) JSContext *jsContext;

@end

@implementation DoricJSCoreExecutor
- (instancetype)init {
    if (self = [super init]) {
        _jsContext = [[JSContext alloc] init];
    }
    return self;
}

- (void)checkJSException {
    if (self.jsContext.exception) {
        NSString *errMsg = [NSString stringWithFormat:@"%@ (line %@ in the generated bundle)\n/***StackTrace***/\n%@\n/***StackTrace***/", self.jsContext.exception, self.jsContext.exception[@"line"], self.jsContext.exception[@"stack"]];
        self.jsContext.exception = nil;
        @throw [[NSException alloc] initWithName:@"DoricJS" reason:errMsg userInfo:nil];
    }
}

- (NSString *)loadJSScript:(NSString *)script source:(NSString *)source {
    NSString *ret = [[self.jsContext evaluateScript:script withSourceURL:[NSURL URLWithString:source]] toString];
    [self checkJSException];
    return ret;
}

- (void)injectGlobalJSObject:(NSString *)name obj:(id)obj {
    self.jsContext[name] = obj;
    [self checkJSException];
}

- (JSValue *)invokeObject:(NSString *)objName method:(NSString *)funcName args:(NSArray *)args {
    JSValue *obj = [self.jsContext objectForKeyedSubscript:objName];
    JSValue *ret = [obj invokeMethod:funcName withArguments:args];
    [self checkJSException];
    return ret;
}

@end
