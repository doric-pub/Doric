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
//  DoricJSRemoteExecutor.m
//  Doric
//
//  Created by 王劲鹏 on 2019/10/31.
//
#import "DoricJSRemoteExecutor.h"
#import <SocketRocket/SRWebSocket.h>
#import "DoricUtil.h"
#import "DoricJSRemoteArgType.h"
#import "NSString+JsonString.h"

static NSString * const kUrlStr = @"ws://192.168.24.240:2080";

typedef id (^Block0)(void);
typedef id (^Block1)(id arg0);
typedef id (^Block2)(id arg0, id arg1);
typedef id (^Block3)(id arg0, id arg1, id arg2);
typedef id (^Block4)(id arg0, id arg1, id arg2, id arg3);
typedef id (^Block5)(id arg0, id arg1, id arg2, id arg3, id arg4);

@interface DoricJSRemoteExecutor () <SRWebSocketDelegate>
@property(nonatomic, strong) SRWebSocket *srWebSocket;
@property(nonatomic, strong) NSMutableDictionary <NSString *, id>  *blockMDic;
@property(nonatomic, strong) JSValue *temp;
@end

@implementation DoricJSRemoteExecutor
- (instancetype)init {
    if (self = [super init]) {
        [self srWebSocket];
        _semaphore = dispatch_semaphore_create(0);
        DC_LOCK(self.semaphore);
    }
    return self;
}

- (void)webSocketDidOpen:(SRWebSocket *)webSocket {
    DoricLog(@"debugger webSocketDidOpen");
    DC_UNLOCK(self.semaphore);
}

- (void)webSocket:(SRWebSocket *)webSocket didReceivePong:(NSData *)pongPayload {
    DoricLog(@"debugger webSocketdidReceivePong");
}

- (void)webSocket:(SRWebSocket *)webSocket didReceiveMessage:(id)message {
    NSData *jsonData = [message dataUsingEncoding:NSUTF8StringEncoding];
    NSError *err;
    NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:jsonData
                                                        options:NSJSONReadingMutableContainers
                                                          error:&err];
    if (err) {
        DoricLog(@"debugger webSocketdidReceiveMessage parse error：%@", err);
        return;
    }
    NSString *cmd = [[dic valueForKey:@"cmd"] copy];
    
    if ([cmd isEqualToString:@"injectGlobalJSFunction"]) {
        NSString *name = [dic valueForKey:@"name"];
        NSArray *argsArr = [dic valueForKey:@"arguments"];
        NSMutableArray *argsMarr = [NSMutableArray new];
        for (NSUInteger i = 0; i < argsArr.count; i++) {
            [argsMarr addObject:argsArr[i]];
        }
        
        id result;
        id tmpBlk = self.blockMDic[name];
        if (argsArr.count == 0) {
            result = ((Block0) tmpBlk)();
        } else if (argsArr.count == 1) {
            result = ((Block1) tmpBlk)(argsArr[0]);
        } else if (argsArr.count == 2) {
            result = ((Block2)tmpBlk)(argsArr[0], argsArr[1]);
        } else if (argsArr.count == 3) {
            result = ((Block3)tmpBlk)(argsArr[0], argsArr[1], argsArr[2]);
        } else if (argsArr.count == 4) {
            result = ((Block4)tmpBlk)(argsArr[0], argsArr[1], argsArr[2], argsArr[3]);
        } else if (argsArr.count == 5) {
            result = ((Block5)tmpBlk)(argsArr[0], argsArr[1], argsArr[2], argsArr[3], argsArr[4]);
        }
        
    } else if ([cmd isEqualToString:@"invokeMethod"]) {
        @try {
            self.temp = [JSValue valueWithObject:[dic valueForKey:@"result"] inContext:nil];
        } @catch (NSException *exception) {
            DoricLog(@"debugger ", NSStringFromSelector(_cmd), exception.reason);
        } @finally {
            DC_UNLOCK(self.semaphore);
        }
    }
}

- (void)webSocket:(SRWebSocket *)webSocket didFailWithError:(NSError *)error {
    DoricLog(@"debugger webSocketdidFailWithError");
    DC_UNLOCK(self.semaphore);
}

- (void)webSocket:(SRWebSocket *)webSocket didCloseWithCode:(NSInteger)code reason:(NSString *)reason wasClean:(BOOL)wasClean {
    DoricLog(@"debugger webSocketdidCloseWithCode");
}

- (NSString *)loadJSScript:(NSString *)script source:(NSString *)source {
    
    return nil;
}

- (void)injectGlobalJSObject:(NSString *)name obj:(id)obj {
    if ([obj isKindOfClass:NSClassFromString(@"NSBlock")]) {
        self.blockMDic[name] = obj;
    }
    NSDictionary *jsonDic = @{
        @"cmd": @"injectGlobalJSFunction",
        @"name": name
    };

    NSString *jsonStr = [NSString dc_convertToJsonWithDic:jsonDic];
    if (!jsonStr) {
        return;
    }
   
    [self.srWebSocket send:jsonStr];
}

- (JSValue *)invokeObject:(NSString *)objName method:(NSString *)funcName args:(NSArray *)args {
    
    NSMutableArray *argsMArr = [NSMutableArray new];
    for (id arg in args) {
        NSDictionary *dic = @{
            @"type": @(DoricargTypeWithArg(arg)),
            @"value": arg
        };
        [argsMArr addObject:dic];
    }
    
    NSArray *argsArr = [argsMArr copy];
    
    NSDictionary *jsonDic = @{
        @"cmd": @"invokeMethod",
        @"objectName": objName,
        @"functionName": funcName,
        @"javaValues": argsArr
    };
    
    NSString *jsonStr = [NSString dc_convertToJsonWithDic:jsonDic];
    if (!jsonStr) {
        return nil;
    }
    
    [self.srWebSocket send:jsonStr];
    DC_LOCK(self.semaphore);
    
    return self.temp;
}

- (void)close {
    [self.srWebSocket close];
}

#pragma mark - Properties
- (SRWebSocket *)srWebSocket {
    if (!_srWebSocket) {
        NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:kUrlStr] cachePolicy:NSURLRequestReloadIgnoringLocalAndRemoteCacheData timeoutInterval:10];
        _srWebSocket = [[SRWebSocket alloc] initWithURLRequest:request];
        _srWebSocket.delegate = self;
        [_srWebSocket open];
    }
    return _srWebSocket;
}

- (NSMutableDictionary *)blockMDic {
    if (!_blockMDic) {
        _blockMDic = [NSMutableDictionary new];
    }
    return _blockMDic;
}

@end
