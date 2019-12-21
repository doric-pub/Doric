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
//  DoricTextNode.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/31.
//

#import "DoricTextNode.h"
#import "DoricUtil.h"
#import "DoricGroupNode.h"
#import "Doric.h"

@implementation DoricTextNode
- (UILabel *)build {
    return [[[UILabel alloc] init] also:^(UILabel *it) {
        it.textAlignment = NSTextAlignmentCenter;
    }];
}

- (void)blendView:(UILabel *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([name isEqualToString:@"text"]) {
        view.text = prop;
    } else if ([name isEqualToString:@"textSize"]) {
        view.font = [UIFont systemFontOfSize:[(NSNumber *) prop floatValue]];
    } else if ([name isEqualToString:@"textColor"]) {
        view.textColor = DoricColor(prop);
    } else if ([name isEqualToString:@"textAlignment"]) {
        DoricGravity gravity = (DoricGravity) [(NSNumber *) prop integerValue];
        NSTextAlignment alignment = NSTextAlignmentCenter;
        if ((gravity & LEFT) == LEFT) {
            alignment = NSTextAlignmentLeft;
        } else if ((gravity & RIGHT) == RIGHT) {
            alignment = NSTextAlignmentRight;
        }
        view.textAlignment = alignment;
    } else if ([name isEqualToString:@"maxLines"]) {
        view.numberOfLines = [prop integerValue];
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (void)blend:(NSDictionary *)props {
    [super blend:props];
    [self.view.superview setNeedsLayout];
}
@end
