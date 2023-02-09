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
//  DoricUtil.h
//  Doric
//
//  Created by pengfei.zhou on 2019/7/26.
//

#import <Foundation/Foundation.h>
#import "DoricLayouts.h"

#ifdef __cplusplus
extern "C"
{
#endif

void DoricLog(NSString *_Nonnull format, ...);

void DoricSafeLog(NSString *_Nonnull message);

UIColor *_Nonnull DoricColor(NSNumber *_Nonnull number);

NSNumber *_Nonnull DoricColorToNumber(UIColor *_Nonnull color);

NSBundle *_Nonnull DoricBundle(void);

#ifndef DC_LOCK
#define DC_LOCK(lock) dispatch_semaphore_wait(lock, DISPATCH_TIME_FOREVER);
#endif

#ifndef DC_UNLOCK
#define DC_UNLOCK(lock) dispatch_semaphore_signal(lock);
#endif

void ShowToast(NSString *_Nonnull text, DoricGravity gravity);

void ShowToastInVC(UIViewController *_Nonnull vc, NSString *_Nonnull text, DoricGravity gravity);

UIImage *_Nonnull UIImageWithColor(UIColor *_Nonnull color);

BOOL hasNotch(void);

#ifdef __cplusplus
}
#endif
