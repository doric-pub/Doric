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
//  DoricDev.h
//  Doric
//
//  Created by jingpeng.wang on 2020/2/25.
//
#import <DoricCore/Doric.h>

NS_ASSUME_NONNULL_BEGIN

@protocol DoricDevStatusCallback <NSObject>
- (void)onOpen:(NSString *)url;

- (void)onClose:(NSString *)url;

- (void)onFailure:(NSError *)error;

- (void)onReload:(DoricContext *)context script:(NSString *)script;

- (void)onStartDebugging:(DoricContext *)context;

- (void)onStopDebugging;

@end

@interface DoricDev : NSObject
@property(nonatomic, readonly) NSString *ip;

+ (instancetype)instance;

- (void)openDevMode;

- (void)openDevMode:(UIViewController *)vc;

- (void)closeDevMode;

- (BOOL)isInDevMode;

- (void)connectDevKit:(NSString *)url;

- (void)onOpen;

- (void)onClose;

- (void)onFailure:(NSError *)error;

- (void)startDebugging:(NSString *)source;

- (void)stopDebugging:(BOOL)resume;

- (void)requestDebugging:(DoricContext *)context;

- (BOOL)isReloadingContext:(DoricContext *)context;

- (void)reload:(NSString *)source script:(NSString *)script;

- (void)sendDevCommand:(NSString *)command payload:(NSDictionary *)payload;

- (void)addStatusCallback:(id <DoricDevStatusCallback>)callback;

- (void)removeStatusCallback:(id <DoricDevStatusCallback>)callback;

UIViewController* _Nonnull findBestViewController(UIViewController* _Nonnull vc);

@end

NS_ASSUME_NONNULL_END
