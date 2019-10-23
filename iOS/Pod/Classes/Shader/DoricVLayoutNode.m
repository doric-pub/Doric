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
//  DoricVLayoutNode.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/30.
//

#import "DoricVLayoutNode.h"
#import "DoricUtil.h"

@implementation DoricVLayoutNode

- (VLayout *)build:(NSDictionary *)props {
    return [VLayout new];
}

- (void)blendView:(VLayout *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([name isEqualToString:@"gravity"]) {
        view.gravity = (DoricGravity) [(NSNumber *) prop integerValue];
    } else if ([name isEqualToString:@"space"]) {
        view.space = [(NSNumber *) prop floatValue];
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (void)blendChild:(DoricViewNode *)child layoutConfig:(NSDictionary *)layoutconfig {
    [super blendChild:child layoutConfig:layoutconfig];
    if (![child.layoutConfig isKindOfClass:DoricLinearConfig.class]) {
        DoricLog(@"blend VLayout child error,layout params not match");
        return;
    }
    DoricLinearConfig *params = (DoricLinearConfig *) child.layoutConfig;
    NSDictionary *margin = layoutconfig[@"margin"];
    if (margin) {
        params.margin = DoricMarginMake(
                [(NSNumber *) margin[@"left"] floatValue],
                [(NSNumber *) margin[@"top"] floatValue],
                [(NSNumber *) margin[@"right"] floatValue],
                [(NSNumber *) margin[@"bottom"] floatValue]);
    }
    NSNumber *alignment = layoutconfig[@"alignment"];
    if (alignment) {
        params.alignment = (DoricGravity) [alignment integerValue];
    }
}

- (DoricLinearConfig *)generateDefaultLayoutParams {
    return [[DoricLinearConfig alloc] init];
}
@end
