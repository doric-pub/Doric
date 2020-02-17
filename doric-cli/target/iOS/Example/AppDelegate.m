//
//  AppDelegate.m
//  Example
//
//  Created by pengfei.zhou on 2019/12/5.
//  Copyright © 2019 pengfei.zhou. All rights reserved.
//

#import "AppDelegate.h"
#import <DoricCore/Doric.h>

@interface AppDelegate ()
@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    NSString *bundleName = @"__$__";
    DoricViewController *doricViewController = [[DoricViewController alloc] initWithSource:[NSString stringWithFormat:@"assets://src/%@.js", bundleName]
                                                                                     alias:bundleName
                                                                                     extra:@""];
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    UINavigationController *navVC = [[UINavigationController
            alloc] initWithRootViewController:doricViewController];
    self.window.rootViewController = navVC;
    [self.window makeKeyAndVisible];
    return YES;
}


#pragma mark - UISceneSession lifecycle


- (UISceneConfiguration *)application:(UIApplication *)application configurationForConnectingSceneSession:(UISceneSession *)connectingSceneSession options:(UISceneConnectionOptions *)options {
    // Called when a new scene session is being created.
    // Use this method to select a configuration to create the new scene with.
    return [[UISceneConfiguration alloc] initWithName:@"Default Configuration" sessionRole:connectingSceneSession.role];
}


- (void)application:(UIApplication *)application didDiscardSceneSessions:(NSSet<UISceneSession *> *)sceneSessions {
    // Called when the user discards a scene session.
    // If any sessions were discarded while the application was not running, this will be called shortly after application:didFinishLaunchingWithOptions.
    // Use this method to release any resources that were specific to the discarded scenes, as they will not return.
}


@end
