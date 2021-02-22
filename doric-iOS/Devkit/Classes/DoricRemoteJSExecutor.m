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
//  DoricRemoteJSExecutor.m
//  DoricDevkit
//
//  Created by pengfei.zhou on 2021/2/22.
//

#import "DoricRemoteJSExecutor.h"
#import "NSString+JsonString.h"
#import <DoricCore/Doric.h>

typedef NS_ENUM(NSUInteger, DoricJSRemoteArgType) {
    DoricJSRemoteArgTypeNil = 0,
    DoricJSRemoteArgTypeNumber,
    DoricJSRemoteArgTypeBool,
    DoricJSRemoteArgTypeString,
    DoricJSRemoteArgTypeObject,
    DoricJSRemoteArgTypeArray,
};


typedef id (^Block0)(void);

typedef id (^Block1)(id arg0);

typedef id (^Block2)(id arg0, id arg1);

typedef id (^Block3)(id arg0, id arg1, id arg2);

typedef id (^Block4)(id arg0, id arg1, id arg2, id arg3);

typedef id (^Block5)(id arg0, id arg1, id arg2, id arg3, id arg4);

@interface DoricRemoteJSExecutor () <DoricWSClientInterceptor>
@property(nonatomic, weak) DoricWSClient *wsClient;
@property(nonatomic, strong) NSMutableDictionary <NSString *, id> *blockMDic;
@property(nonatomic, strong) JSValue *temp;
@property(nonatomic, strong) dispatch_semaphore_t semaphore;
@end

@implementation DoricRemoteJSExecutor
- (instancetype)initWithWSClient:(DoricWSClient *)wsClient {
    if (self = [super init]) {
        _wsClient = wsClient;
        [_wsClient addInterceptor:self];
        _blockMDic = [NSMutableDictionary new];
        _semaphore = dispatch_semaphore_create(0);
    }
    return self;
}

- (NSString *)loadJSScript:(NSString *)script source:(NSString *)source {
    return nil;
}

- (void)injectGlobalJSObject:(NSString *)name obj:(id)obj {
    if ([obj isKindOfClass:NSClassFromString(@"NSBlock")]) {
        self.blockMDic[name] = obj;
        [self.wsClient sendToDebugger:@"injectGlobalJSFunction" payload:@{
                @"name": name,
        }];
    } else if ([obj isKindOfClass:NSNumber.class]) {
        [self.wsClient sendToDebugger:@"injectGlobalJSObject" payload:@{
                @"name": name,
                @"type": @(DoricJSRemoteArgTypeNumber),
                @"value": obj,
        }];
    } else if ([obj isKindOfClass:NSString.class]) {
        [self.wsClient sendToDebugger:@"injectGlobalJSObject" payload:@{
                @"name": name,
                @"type": @(DoricJSRemoteArgTypeString),
                @"value": obj,
        }];
    } else if ([obj isKindOfClass:NSObject.class]) {
        [self.wsClient sendToDebugger:@"injectGlobalJSObject" payload:@{
                @"name": name,
                @"type": @(DoricJSRemoteArgTypeObject),
                @"value": obj,
        }];
    } else if ([obj isKindOfClass:NSArray.class]) {
        [self.wsClient sendToDebugger:@"injectGlobalJSObject" payload:@{
                @"name": name,
                @"type": @(DoricJSRemoteArgTypeArray),
                @"value": obj,
        }];
    } else if (obj == nil) {
        [self.wsClient sendToDebugger:@"injectGlobalJSObject" payload:@{
                @"name": name,
                @"type": @(DoricJSRemoteArgTypeNil),
        }];
    }
}

- (JSValue *)invokeObject:(NSString *)objName method:(NSString *)funcName args:(NSArray *)args {

    NSMutableArray *argsMArr = [NSMutableArray new];

    for (id arg in args) {
        NSDictionary *dic = [self dicForArg:arg];
        [argsMArr addObject:dic];
    }

    [self.wsClient sendToDebugger:@"invokeMethod" payload:@{
            @"cmd": @"invokeMethod",
            @"objectName": objName,
            @"functionName": funcName,
            @"values": [argsMArr copy]
    }];

    DC_LOCK(self.semaphore);

    return self.temp;
}

- (NSDictionary *)dicForArg:(id)arg {
    DoricJSRemoteArgType type = [self argType:arg];
    if (type == DoricJSRemoteArgTypeObject || type == DoricJSRemoteArgTypeArray) {
        NSString *jsonStr = [NSString dc_convertToJsonWithDic:arg];
        arg = jsonStr;
    }
    NSDictionary *dic = @{
            @"type": @(type),
            @"value": arg
    };
    return dic;
}

- (DoricJSRemoteArgType)argType:(id)arg {
    DoricJSRemoteArgType type = DoricJSRemoteArgTypeNil;
    if ([arg isKindOfClass:[NSNumber class]]) {
        type = DoricJSRemoteArgTypeNumber;
    } else if ([arg isKindOfClass:[NSString class]]) {
        type = DoricJSRemoteArgTypeString;
    } else if ([arg isKindOfClass:[NSDictionary class]]) {
        type = DoricJSRemoteArgTypeObject;
    } else if ([arg isKindOfClass:[NSMutableArray class]]) {
        type = DoricJSRemoteArgTypeArray;
    }
    return type;
}

- (BOOL)interceptType:(NSString *)type command:(NSString *)cmd payload:(NSDictionary *)payload {
    if ([type isEqualToString:@"D2C"]) {
        if ([cmd isEqualToString:@"injectGlobalJSFunction"]) {
            NSString *name = payload[@"name"];
            NSArray *argsArr = payload[@"arguments"];
            id tmpBlk = self.blockMDic[name];
            id result;
            if (argsArr.count == 0) {
                result = ((Block0) tmpBlk)();
            } else if (argsArr.count == 1) {
                result = ((Block1) tmpBlk)(argsArr[0]);
            } else if (argsArr.count == 2) {
                result = ((Block2) tmpBlk)(argsArr[0], argsArr[1]);
            } else if (argsArr.count == 3) {
                result = ((Block3) tmpBlk)(argsArr[0], argsArr[1], argsArr[2]);
            } else if (argsArr.count == 4) {
                result = ((Block4) tmpBlk)(argsArr[0], argsArr[1], argsArr[2], argsArr[3]);
            } else if (argsArr.count == 5) {
                result = ((Block5) tmpBlk)(argsArr[0], argsArr[1], argsArr[2], argsArr[3], argsArr[4]);
            } else {
                DoricLog(@"error:args to more than 5. args:%@", argsArr);
                result = nil;
            }
        } else if ([cmd isEqualToString:@"invokeMethod"]) {
            @try {
                self.temp = [JSValue valueWithObject:payload[@"result"] inContext:nil];
            } @catch (NSException *exception) {
                DoricLog(@"debugger ", NSStringFromSelector(_cmd), exception.reason);
            } @finally {
                DC_UNLOCK(self.semaphore);
            }
        }
    }
    return NO;
}


@end
