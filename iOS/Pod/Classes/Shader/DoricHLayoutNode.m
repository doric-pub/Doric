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
//  DoricHLayoutNode.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/30.
//

#import "DoricHLayoutNode.h"
#import "DoricUtil.h"

@implementation DoricHLayoutNode
- (HLayout *)build:(NSDictionary *)props {
    return [HLayout new];
}

- (void)blendView:(HLayout *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([name isEqualToString:@"gravity"]) {
        view.gravity = (DoricGravity) [(NSNumber *) prop integerValue];
    } else if ([name isEqualToString:@"space"]) {
        view.space = [(NSNumber *) prop floatValue];
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (void)blendChild:(DoricViewNode *)child layoutConfig:(NSDictionary *)layoutConfig {
    [super blendChild:child layoutConfig:layoutConfig];
    if (![child.layoutConfig isKindOfClass:LinearLayoutConfig.class]) {
        DoricLog(@"blend HLayout child error,layout params not match");
        return;
    }
    LinearLayoutConfig *params = (LinearLayoutConfig *) child.layoutConfig;
    NSDictionary *margin = layoutConfig[@"margin"];
    if (margin) {
        params.margin = MarginMake(
                [(NSNumber *) margin[@"left"] floatValue],
                [(NSNumber *) margin[@"top"] floatValue],
                [(NSNumber *) margin[@"right"] floatValue],
                [(NSNumber *) margin[@"bottom"] floatValue]);
    }
    NSNumber *alignment = layoutConfig[@"alignment"];
    if (alignment) {
        params.alignment = (DoricGravity) [alignment integerValue];
    }
}

- (LinearLayoutConfig *)generateDefaultLayoutParams {
    return [[LinearLayoutConfig alloc] init];
}
@end
