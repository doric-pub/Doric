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
//  Doric.m
//  Doric
//
//  Created by pengfei.zhou on 2020/2/28.
//

#import "DoricContext.h"
#import "DoricLayouts.h"
#import "DoricExtensions.h"
#import "DoricViewNode.h"
#import "DoricRootNode.h"
#import "UIView+Doric.h"
#import "DoricUtil.h"
#import "DoricPanel.h"
#import "DoricJSLoaderManager.h"
#import "DoricNavigatorDelegate.h"
#import "DoricNavBarDelegate.h"
#import "DoricViewController.h"
#import "DoricPromise.h"
#import "DoricLibrary.h"
#import "DoricNativePlugin.h"
#import "DoricMonitorProtocol.h"

@interface Doric : NSObject

/**
 * Register DoricLibrary For Extended ViewNode And Native Plugins
 * */
+ (void)registerLibrary:(DoricLibrary *)library;

/**
 * Add DoricJSLoader For Loading JS Bundles
 * */
+ (void)addJSLoader:(id <DoricLoaderProtocol>)loader;


+ (void)enablePerformance:(BOOL)enable;

+ (BOOL)isEnablePerformance;

+ (void)enableRenderSnapshot:(BOOL)enable;

+ (BOOL)isEnableRenderSnapshot;

+ (void)setEnvironmentValue:(NSDictionary *)value;

+ (DoricJSLoaderManager *)jsLoaderManager;
@end