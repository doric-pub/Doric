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
//  DoricBridgeExtension.h
//  Doric
//
//  Created by pengfei.zhou on 2019/7/29.
//

#import <Foundation/Foundation.h>
#import "DoricRegistry.h"
NS_ASSUME_NONNULL_BEGIN

@interface DoricBridgeExtension : NSObject
@property (nonatomic,weak) DoricRegistry *registry;

- (id)callNativeWithContextId:(NSString *)contextId module:(NSString *)module method:(NSString *)method callbackId:(NSString *)callbackId argument:(id)argument;
@end

NS_ASSUME_NONNULL_END
