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
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(appWillActive) name:UIApplicationWillEnterForegroundNotification object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(appWillTerminate) name:UIApplicationDidEnterBackgroundNotification object:nil];
    }
    return self;
}

- (void)appWillActive {
    [[NSNotificationCenter defaultCenter] postNotificationName:@"DoricAppWillEnterForeground" object:nil];
}

- (void)appWillTerminate {
    [[NSNotificationCenter defaultCenter] postNotificationName:@"DoricAppDidEnterBackground" object:nil];
}

@end
