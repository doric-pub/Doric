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

#import "DoricAnimatePlugin.h"
#import "DoricRootNode.h"

@implementation DoricAnimatePlugin

- (void)submit:(NSDictionary *)args withPromise:(DoricPromise *)promise {
    [promise resolve:nil];
}

- (void)animateRender:(NSDictionary *)args withPromise:(DoricPromise *)promise {
    NSNumber *duration = args[@"duration"];
    dispatch_async(dispatch_get_main_queue(), ^{
        NSString *viewId = args[@"id"];
        [UIView animateWithDuration:[duration floatValue] / 1000
                         animations:^{
                             if (self.doricContext.rootNode.viewId == nil) {
                                 self.doricContext.rootNode.viewId = viewId;
                                 [self.doricContext.rootNode blend:args[@"props"]];
                             } else {
                                 DoricViewNode *viewNode = [self.doricContext targetViewNode:viewId];
                                 [viewNode blend:args[@"props"]];
                             }
                         }
                         completion:^(BOOL finished) {
                             [promise resolve:nil];
                         }];
    });
}
@end