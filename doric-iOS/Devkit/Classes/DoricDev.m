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
//  DoricDev.m
//  Doric
//
//  Created by jingpeng.wang on 2020/2/25.
//

#import "DoricDev.h"
#import "DoricWSClient.h"

@interface DoricDev ()
@property(nonatomic, strong) DoricWSClient *wsclient;
@end

@implementation DoricDev

- (instancetype)init {
    if (self = [super init]) {
    }
    return self;
}

+ (instancetype)instance {
    static DoricDev *_instance;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _instance = [[DoricDev alloc] init];
    });
    return _instance;
}

- (void)connectDevKit:(NSString *)url {
    if (self.wsclient) {
        [self.wsclient close];
    }
    self.wsclient = [[DoricWSClient alloc] initWithUrl:url];
}

- (void)sendDevCommand:(NSString *)command {
    [self.wsclient send:command];
}

- (void)disconnectDevKit {
    if (self.wsclient) {
        [self.wsclient close];
        self.wsclient = nil;
    }
}

@end
