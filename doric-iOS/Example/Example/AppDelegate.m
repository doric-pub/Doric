//
//  AppDelegate.m
//  Example
//
//  Created by pengfei.zhou on 2019/7/25.
//  Copyright © 2019 pengfei.zhou. All rights reserved.
//

#import "AppDelegate.h"
#import "NavigationController.h"
#import "ViewController.h"
#import <DoricCore/Doric.h>

#if __has_include(<SDWebImage/SDWebImage.h>)

#import <SDWebImage/SDWebImage.h>
#import <SDWebImageWebPCoder/SDWebImageWebPCoder.h>

#endif

@interface AppDelegate ()
@property(nonatomic, strong) UIViewController *rootVC;
@property(nonatomic, strong) NavigationController *navigationController;
@end

@implementation AppDelegate


- (void)localeChanged {
    [Doric setEnvironmentValue:@{
            @"localeLanguage": [[NSLocale autoupdatingCurrentLocale] objectForKey:NSLocaleLanguageCode],
            @"localeCountry": [[NSLocale autoupdatingCurrentLocale] objectForKey:NSLocaleCountryCode],
    }];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
    NSArray<NSString *> *fonts = [UIFont familyNames];
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    self.rootVC = [[ViewController alloc] init];

    self.navigationController = [[NavigationController
            alloc] initWithRootViewController:self.rootVC];
    self.window.rootViewController = self.navigationController;
    [self.window addSubview:self.navigationController.view];
    [self.window makeKeyAndVisible];
#if __has_include(<SDWebImage/SDWebImage.h>)
    [SDImageCodersManager.sharedManager addCoder:SDImageWebPCoder.sharedCoder];
#endif
    UINavigationBar *bar = self.navigationController.navigationBar;
    if (@available(iOS 15.0, *)) {
        UINavigationBarAppearance *barAppearance = [UINavigationBarAppearance new];
        barAppearance.backgroundColor = UIColor.whiteColor;
        bar.scrollEdgeAppearance = bar.standardAppearance = barAppearance;
    }
    return YES;
}


- (void)applicationWillResignActive:(UIApplication *)application {
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
}


- (void)applicationDidEnterBackground:(UIApplication *)application {
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}


- (void)applicationWillEnterForeground:(UIApplication *)application {
    // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
}


- (void)applicationDidBecomeActive:(UIApplication *)application {
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}


- (void)applicationWillTerminate:(UIApplication *)application {
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}


@end
