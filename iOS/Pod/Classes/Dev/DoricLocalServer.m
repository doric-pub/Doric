//
//  DoricLocalServer.m
//  Doric
//
//  Created by pengfei.zhou on 2019/8/14.
//

#import "DoricLocalServer.h"
#import "GCDWebServer.h"
#import "GCDWebServerDataResponse.h"
#import "DoricUtil.h"
#import "DoricContextManager.h"

#include <arpa/inet.h>
#include <net/if.h>
#include <ifaddrs.h>

typedef id (^ServerHandler)(GCDWebServerRequest *request);

@interface DoricLocalServer ()
@property(nonatomic, strong) GCDWebServer *server;
@property(nonatomic, strong) NSMutableDictionary *handlers;
@end

@implementation DoricLocalServer

- (instancetype)init {
    if (self = [super init]) {
        _server = [[GCDWebServer alloc] init];
        _handlers = [[NSMutableDictionary alloc] init];
        [self configurate];
    }
    return self;
}

- (NSString *)localIPAddress {
    NSString *localIP = nil;
    struct ifaddrs *addrs;
    if (getifaddrs(&addrs) == 0) {
        const struct ifaddrs *cursor = addrs;
        while (cursor != NULL) {
            if (cursor->ifa_addr->sa_family == AF_INET && (cursor->ifa_flags & IFF_LOOPBACK) == 0) {
                //NSString *name = [NSString stringWithUTF8String:cursor->ifa_name];
                //if ([name isEqualToString:@"en0"]) // Wi-Fi adapter
                {
                    localIP = [NSString stringWithUTF8String:inet_ntoa(((struct sockaddr_in *) cursor->ifa_addr)->sin_addr)];
                    break;
                }
            }
            cursor = cursor->ifa_next;
        }
        freeifaddrs(addrs);
    }
    return localIP;
}

- (GCDWebServerResponse *)handleRequest:(GCDWebServerRequest *)request {
    if ([request.path hasPrefix:@"/api/"]) {
        NSString *command = [request.path substringFromIndex:@"/api/".length];
        ServerHandler handler = [self.handlers objectForKey:command];
        if (handler) {
            id dic = handler(request);
            return [GCDWebServerDataResponse responseWithJSONObject:dic];
        }
        return [GCDWebServerDataResponse responseWithHTML:@"<html><body><p>It's a API request.</p></body></html>"];
    }
    NSBundle *bundle = DoricBundle();
    NSString *filePath = [NSString stringWithFormat:@"%@/dist%@", bundle.bundlePath, request.path];
    NSData *data = [NSData dataWithContentsOfFile:filePath];
    NSURL *url = [NSURL fileURLWithPath:filePath];
    NSMutableURLRequest *req = [NSMutableURLRequest requestWithURL:url];
    NSHTTPURLResponse *response;
    [NSURLConnection sendSynchronousRequest:req returningResponse:&response error:nil];
    return [GCDWebServerDataResponse responseWithData:data contentType:response.MIMEType];
}

- (void)configurate {
    __weak typeof(self) _self = self;
    [self.server addDefaultHandlerForMethod:@"GET"
                               requestClass:[GCDWebServerRequest class]
                               processBlock:^GCDWebServerResponse *(GCDWebServerRequest *request) {
                                   __strong typeof(_self) self = _self;
                                   return [self handleRequest:request];
                               }];
    [self.handlers setObject:^id(GCDWebServerRequest *request) {
                NSMutableArray *array = [[NSMutableArray alloc] init];

                for (NSValue *value in [[DoricContextManager instance] aliveContexts]) {
                    DoricContext *context = value.nonretainedObjectValue;
                    [array addObject:@{
                            @"source": context.source,
                            @"id": context.contextId,
                    }];
                }
                return array;
            }
                      forKey:@"allContexts"];

    [self.handlers setObject:^id(GCDWebServerRequest *request) {
                NSString *contextId = [request.query objectForKey:@"id"];
                DoricContext *context = [[DoricContextManager instance] getContext:contextId];
                return @{
                        @"id": context.contextId,
                        @"source": context.source,
                        @"script": context.script
                };
            }
                      forKey:@"context"];
}

- (void)startWithPort:(NSUInteger)port {
    [self.server startWithPort:port bonjourName:nil];
    DoricLog(@"Start Server At %@:%d", [self localIPAddress], port);
}
@end
