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
// Created by pengfei.zhou on 2019/11/29.
//

#import <DoricCore/Doric.h>
#import "DoricAnimatePlugin.h"
#import "DoricRootNode.h"
#import "DoricExtensions.h"

@implementation DoricAnimatePlugin

- (void)submit:(NSDictionary *)args withPromise:(DoricPromise *)promise {
    [promise resolve:nil];
}

- (void)animateRender:(NSDictionary *)args withPromise:(DoricPromise *)promise {
    NSNumber *duration = [args optNumber:@"duration"];
    NSString *viewId = [args optString:@"id"];
    NSDictionary *props = [args optObject:@"props"];
    __weak typeof(self) _self = self;
    [self.doricContext dispatchToMainQueue:^{
        __strong typeof(_self) self = _self;
        [UIView animateWithDuration:[duration floatValue] / 1000
                         animations:^{
                             if (self.doricContext.rootNode.viewId == nil) {
                                 self.doricContext.rootNode.viewId = viewId;
                                 [self.doricContext.rootNode blend:props];
                                 [self.doricContext.rootNode requestLayout];
                             } else {
                                 DoricViewNode *viewNode = [self.doricContext targetViewNode:viewId];
                                 [viewNode blend:props];
                                 [viewNode requestLayout];
                             }
                         }
                         completion:^(BOOL finished) {
                             [promise resolve:nil];
                         }];
    }];
}
@end
