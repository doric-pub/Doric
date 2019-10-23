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
//  DoricStackNode.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/30.
//

#import "DoricStackNode.h"
#import "DoricUtil.h"

@implementation DoricStackNode

- (DoricStackView *)build:(NSDictionary *)props {
    return [DoricStackView new];
}

- (void)blendView:(DoricStackView *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([name isEqualToString:@"gravity"]) {
        view.gravity = (DoricGravity) [(NSNumber *) prop integerValue];
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (DoricStackConfig *)generateDefaultLayoutParams {
    return [[DoricStackConfig alloc] init];
}

- (void)blendChild:(DoricViewNode *)child layoutConfig:(NSDictionary *)layoutConfig {
    [super blendChild:child layoutConfig:layoutConfig];
    if (![child.layoutConfig isKindOfClass:DoricStackConfig.class]) {
        DoricLog(@"blend HLayout child error,layout params not match");
        return;
    }
    DoricStackConfig *params = (DoricStackConfig *) child.layoutConfig;
    NSNumber *alignment = layoutConfig[@"alignment"];
    if (alignment) {
        params.alignment = (DoricGravity) [alignment integerValue];
    }
}

@end
