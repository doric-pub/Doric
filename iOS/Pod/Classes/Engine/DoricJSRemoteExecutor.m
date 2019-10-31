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

static NSString * const kUrlStr = @"ws://192.168.24.240:2080";

@interface DoricJSRemoteExecutor () <SRWebSocketDelegate>
@property(nonatomic, strong) SRWebSocket *websocket;
@property(nonatomic, strong) NSMapTable *mapTable;
@property(nonatomic, strong) dispatch_semaphore_t mapTableLock;
@end

@implementation DoricJSRemoteExecutor
- (instancetype)init {
    if (self = [super init]) {
        [self websocket];
        _semaphore = dispatch_semaphore_create(0);
        _mapTableLock = dispatch_semaphore_create(1);
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
        DoricLog(@"webSocketdidReceiveMessage parse error：%@", err);
        return;
    }
    NSString *source = [[dic valueForKey:@"source"] mutableCopy];
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
    DC_LOCK(self.mapTableLock);
    [self.mapTable setObject:obj forKey:name];
    DC_UNLOCK(self.mapTableLock);
    
    NSDictionary *jsonDic =@{
        @"cmd": @"injectGlobalJSFunction",
        @"name": name
    };
    NSError * err;
    NSData * jsonData = [NSJSONSerialization dataWithJSONObject:jsonDic options:0 error:&err];
    if (err) {
        DoricLog(@"debugger ", NSStringFromSelector(_cmd), @" failed");
    }
    [self.websocket send:jsonData];
}

- (JSValue *)invokeObject:(NSString *)objName method:(NSString *)funcName args:(NSArray *)args {
    
    NSMutableArray *argsMArr = [NSMutableArray new];
    for (id arg in args) {
        NSDictionary *dic = @{
            @"type": [arg class],
            @"value": arg
        };
        [argsMArr addObject:dic];
    }
    
    NSDictionary *jsonDic = @{
        @"cmd": @"invokeMethod",
        @"obj": objName,
        @"functionName": funcName,
        @"javaValues": argsMArr
    };
    
    NSError * err;
    NSData * jsonData = [NSJSONSerialization dataWithJSONObject:jsonDic options:0 error:&err];
    if (err) {
        DoricLog(@"debugger ", NSStringFromSelector(_cmd), @" failed");
    }
    
    [self.websocket send:jsonData];
    DC_LOCK(self.semaphore);
    
    return nil;
}

- (void)close {
    [self.websocket close];
}

#pragma mark - Properties
- (SRWebSocket *)websocket {
    if (!_websocket) {
        NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:kUrlStr] cachePolicy:NSURLRequestReloadIgnoringLocalAndRemoteCacheData timeoutInterval:10];
        _websocket = [[SRWebSocket alloc] initWithURLRequest:request];
        _websocket.delegate = self;
        [_websocket open];
    }
    return _websocket;
}

- (NSMapTable *)mapTable {
    if (!_mapTable) {
        _mapTable = [[NSMapTable alloc] initWithKeyOptions:NSPointerFunctionsStrongMemory valueOptions:NSPointerFunctionsWeakMemory capacity:0];
    }
    return _mapTable;
}

@end
