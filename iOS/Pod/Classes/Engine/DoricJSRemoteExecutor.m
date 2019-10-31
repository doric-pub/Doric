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
@property(nonatomic, strong) NSMapTable *mapTable;
@property(nonatomic, strong) SRWebSocket *websocket;

@end

@implementation DoricJSRemoteExecutor
- (instancetype)init {
    if (self = [super init]) {
        [self websocket];
        _semaphore = dispatch_semaphore_create(0);
        dispatch_semaphore_wait(_semaphore, DISPATCH_TIME_FOREVER);
    }
    return self;
}

- (void)webSocketDidOpen:(SRWebSocket *)webSocket {
    DoricLog(@"debugger webSocketDidOpen");
    dispatch_semaphore_signal(_semaphore);
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
    dispatch_semaphore_signal(_semaphore);
}

- (void)webSocket:(SRWebSocket *)webSocket didCloseWithCode:(NSInteger)code reason:(NSString *)reason wasClean:(BOOL)wasClean {
    DoricLog(@"debugger webSocketdidCloseWithCode");
}

- (NSString *)loadJSScript:(NSString *)script source:(NSString *)source {
    
    return nil;
}

- (void)injectGlobalJSObject:(NSString *)name obj:(id)obj {
    
}

- (JSValue *)invokeObject:(NSString *)objName method:(NSString *)funcName args:(NSArray *)args {
    
    return nil;
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
        _mapTable = [NSMapTable new];
    }
    return _mapTable;
}

@end
