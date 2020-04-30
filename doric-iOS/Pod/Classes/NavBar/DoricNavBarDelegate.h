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
// Created by pengfei.zhou on 2019/11/25.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@protocol DoricNavBarDelegate <NSObject>
- (BOOL)doric_navBar_isHidden;

- (void)doric_navBar_setHidden:(BOOL)hidden;

- (void)doric_navBar_setTitle:(NSString *)title;

- (void)doric_navBar_setBackgroundColor:(UIColor *)color;

- (void)doric_navBar_setLeft:(UIView *)view;

- (void)doric_navBar_setRight:(UIView *)view;

- (void)doric_navBar_setCenter:(UIView *)view;
@end
