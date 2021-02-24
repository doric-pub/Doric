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
//  WSClient.m
//  Doric
//
//  Created by pengfei.zhou on 2019/8/14.
//

#import "DoricWSClient.h"
#import "SRWebSocket.h"
#import <DoricCore/Doric.h>
#import <DoricCore/DoricContextManager.h>
#import <DoricCore/NSString+JsonString.h>
#import "DoricDev.h"

@interface DoricWSClient () <SRWebSocketDelegate>
@property(nonatomic, strong) SRWebSocket *websocket;
@property(nonatomic, strong) NSHashTable <id <DoricWSClientInterceptor>> *interceptors;
@end

@implementation DoricWSClient
- (instancetype)initWithUrl:(NSString *)url {
    if (self = [super init]) {
        _interceptors = [NSHashTable hashTableWithOptions:NSPointerFunctionsWeakMemory];
        _websocket = [[SRWebSocket alloc] initWithURL:[NSURL URLWithString:url]];
        _websocket.delegate = self;
        [_websocket open];
    }
    return self;
}

- (void)webSocketDidOpen:(SRWebSocket *)webSocket {
    DoricLog(@"webSocketDidOpen");
    [[NSNotificationCenter defaultCenter] postNotificationName:@"OpenEvent" object:nil];
    [DoricDev.instance onOpen];
}

- (void)webSocket:(SRWebSocket *)webSocket didReceivePong:(NSData *)pongPayload {
    DoricLog(@"webSocketdidReceivePong");
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

    NSString *type = dic[@"type"];
    NSString *cmd = dic[@"cmd"];
    NSDictionary *payload = dic[@"payload"];
    for (id <DoricWSClientInterceptor> interceptor in self.interceptors) {
        if ([interceptor interceptType:type command:cmd payload:payload]) {
            return;
        }
    }

    if ([cmd isEqualToString:@"DEBUG_REQ"]) {
        NSString *source = payload[@"source"];
        [DoricDev.instance startDebugging:source];
    } else if ([cmd isEqualToString:@"DEBUG_STOP"]) {
        [DoricDev.instance stopDebugging:YES];
    } else if ([cmd isEqualToString:@"RELOAD"]) {
        NSString *source = payload[@"source"];
        NSString *script = payload[@"script"];
        [DoricDev.instance reload:source script:script];
    }

    if ([cmd compare:@"SWITCH_TO_DEBUG"] == NSOrderedSame) {
        [[NSNotificationCenter defaultCenter] postNotificationName:@"EnterDebugEvent" object:nil];
    } else if ([cmd compare:@"RELOAD"] == NSOrderedSame) {
        NSString *source = [[dic valueForKey:@"source"] mutableCopy];
        NSString *script = [dic valueForKey:@"script"];
        for (DoricContext *context in  [[DoricContextManager instance] aliveContexts]) {
            if ([source containsString:context.source] || [context.source isEqualToString:@"__dev__"]) {
                [context reload:script];
            }
        }
    }
}

- (void)webSocket:(SRWebSocket *)webSocket didFailWithError:(NSError *)error {
    DoricLog(@"webSocketdidFailWithError");
    [DoricDev.instance onFailure:error];
}

- (void)webSocket:(SRWebSocket *)webSocket didCloseWithCode:(NSInteger)code reason:(NSString *)reason wasClean:(BOOL)wasClean {
    DoricLog(@"webSocketdidCloseWithCode");
    [DoricDev.instance onClose];
}

- (void)send:(NSDictionary *)command {
    NSString *jsonStr = [NSString dc_convertToJsonWithDic:command];
    [_websocket send:jsonStr];
}

- (void)addInterceptor:(id <DoricWSClientInterceptor>)interceptor {
    [self.interceptors addObject:interceptor];
}

- (void)removeInterceptor:(id <DoricWSClientInterceptor>)interceptor {
    [self.interceptors removeObject:interceptor];
}

- (void)sendToDebugger:(NSString *)cmd payload:(NSDictionary *)payload {
    [self send:@{
            @"type": @"C2D",
            @"cmd": cmd,
            @"payload": payload,
    }];
}

- (void)sendToServer:(NSString *)cmd payload:(NSDictionary *)payload {
    [self send:@{
            @"type": @"C2S",
            @"cmd": cmd,
            @"payload": payload,
    }];
}

- (void)close {
    [self.websocket close];
}
@end
