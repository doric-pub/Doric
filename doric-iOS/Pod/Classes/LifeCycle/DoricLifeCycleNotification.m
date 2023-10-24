//
//  DoricLifeCycleManager.m
//  AFNetworking
//
//  Created by DZ0400939 on 2023/10/24.
//

#import "DoricLifeCycleManager.h"

@implementation DoricLifeCycleManager

- (instancetype)init {
    if (self = [super init]) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(appWillEnterForeground) name:UIApplicationWillEnterForegroundNotification object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(appDidEnterBackground) name:UIApplicationDidEnterBackgroundNotification object:nil];
    }
    return self;
}

- (void)appWillEnterForeground {
    [[NSNotificationCenter defaultCenter] postNotificationName:@"DoricAppWillEnterForeground" object:nil];
}

- (void)appDidEnterBackground {
    [[NSNotificationCenter defaultCenter] postNotificationName:@"DoricAppDidEnterBackground" object:nil];
}

@end