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
//  DoricRootNode.h
//  Doric
//
//  Created by pengfei.zhou on 2019/7/30.
//

#import "DoricStackNode.h"

@interface DoricRootView : UIView
@property(nonatomic, strong) void (^frameChangedBlock)(CGSize oldSize, CGSize newSize);
@end

@interface DoricRootNode : DoricStackNode

@property(nonatomic, assign) CGSize mostFrameSize;

- (void)setupRootView:(UIView *)view;

@end
