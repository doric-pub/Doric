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
//  DoricErrorHintNode.m
//  DoricCore
//
//  Created by pengfei.zhou on 2021/6/22.
//

#import "DoricErrorHintNode.h"

@implementation DoricErrorHintNode
- (UILabel *)build {
    UILabel *view = [UILabel new];
    view.text = self.hintText;
    view.textColor = [UIColor blackColor];
    view.font = [UIFont systemFontOfSize:16];
    view.textAlignment = NSTextAlignmentCenter;
    view.backgroundColor = [UIColor yellowColor];
    return view;
}
@end
