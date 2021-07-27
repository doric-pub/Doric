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
 * distributed under the License is distributed onO an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//
// Created by pengfei.zhou on 2019/11/23.
//

#import <Foundation/Foundation.h>
#import "DoricNavigatorDelegate.h"
#import "DoricNavBarDelegate.h"
#import "DoricPanel.h"

extern NSString *const DORIC_MASK_RETRY;


@interface DoricViewController : UIViewController <DoricNavigatorDelegate, DoricNavBarDelegate, DoricStatusBarDelegate>
@property(nonatomic, copy) NSString *source;
@property(nonatomic, copy) NSString *alias;
@property(nonatomic, copy) NSString *extra;

@property(nonatomic, strong) DoricPanel *doricPanel;
@property(nonatomic) BOOL statusBarHidden;
@property(nonatomic) int statusBarMode;
@property(nonatomic, strong) UIView *loadingView;
@property(nonatomic, strong) UIView *errorView;

- (instancetype)initWithSource:(NSString *)source alias:(NSString *)alias extra:(NSString *)extra;
@end
