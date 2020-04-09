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
// Created by pengfei.zhou on 2020/4/9.
//

#import <YogaKit/UIView+Yoga.h>
#import "DoricFlexNode.h"
#import "DoricExtensions.h"
#import "YGLayout.h"

@interface DoricFlexView : UIView
@end

@implementation DoricFlexView
- (CGSize)sizeThatFits:(CGSize)size {
    return [self.yoga calculateLayoutWithSize:size];
}
@end

@implementation DoricFlexNode
- (UIView *)build {
    return [[DoricFlexView new] also:^(DoricFlexView *it) {
        it.yoga.isEnabled = YES;
    }];
}

- (void)blendView:(UIView *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([name isEqualToString:@"flexConfig"]) {
        if ([prop isKindOfClass:[NSDictionary class]]) {
            [((DoricFlexNode *) self.superNode) blendSubNode:self flexConfig:prop];
        }
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (void)blendSubNode:(DoricViewNode *)subNode flexConfig:(NSDictionary *)flexConfig {

}

- (void)blendYoga:(YGLayout *)yoga from:(NSDictionary *)flexConfig {
    [flexConfig enumerateKeysAndObjectsUsingBlock:^(NSString *key, id obj, BOOL *stop) {
        [self blendYoga:yoga name:key value:obj];
    }];
}

- (void)blendYoga:(YGLayout *)yoga name:(NSString *)name value:(id)value {
    if ([name isEqualToString:@"direction"]) {
        yoga.direction = (YGDirection) [(NSNumber *) value integerValue];
    } else if ([name isEqualToString:@"flexDirection"]) {
        yoga.flexDirection = (YGFlexDirection) [(NSNumber *) value integerValue];
    } else if ([name isEqualToString:@"justifyContent"]) {
        yoga.justifyContent = (YGJustify) [(NSNumber *) value integerValue];
    }else if ([name isEqualToString:@"alignContent"]) {
        yoga.alignContent = (YGAlign) [(NSNumber *) value integerValue];
    }else if ([name isEqualToString:@"justifyContent"]) {
        yoga.flexDirection = (YGFlexDirection) [(NSNumber *) value integerValue];
    }else if ([name isEqualToString:@"justifyContent"]) {
        yoga.flexDirection = (YGFlexDirection) [(NSNumber *) value integerValue];
    }else if ([name isEqualToString:@"justifyContent"]) {
        yoga.flexDirection = (YGFlexDirection) [(NSNumber *) value integerValue];
    }else if ([name isEqualToString:@"justifyContent"]) {
        yoga.flexDirection = (YGFlexDirection) [(NSNumber *) value integerValue];
    }else if ([name isEqualToString:@"justifyContent"]) {
        yoga.flexDirection = (YGFlexDirection) [(NSNumber *) value integerValue];
    }else if ([name isEqualToString:@"justifyContent"]) {
        yoga.flexDirection = (YGFlexDirection) [(NSNumber *) value integerValue];
    }else if ([name isEqualToString:@"justifyContent"]) {
        yoga.flexDirection = (YGFlexDirection) [(NSNumber *) value integerValue];
    }else if ([name isEqualToString:@"justifyContent"]) {
        yoga.flexDirection = (YGFlexDirection) [(NSNumber *) value integerValue];
    }else if ([name isEqualToString:@"justifyContent"]) {
        yoga.flexDirection = (YGFlexDirection) [(NSNumber *) value integerValue];
    }else if ([name isEqualToString:@"justifyContent"]) {
        yoga.flexDirection = (YGFlexDirection) [(NSNumber *) value integerValue];
    }else if ([name isEqualToString:@"justifyContent"]) {
        yoga.flexDirection = (YGFlexDirection) [(NSNumber *) value integerValue];
    }else if ([name isEqualToString:@"justifyContent"]) {
        yoga.flexDirection = (YGFlexDirection) [(NSNumber *) value integerValue];
    }else if ([name isEqualToString:@"justifyContent"]) {
        yoga.flexDirection = (YGFlexDirection) [(NSNumber *) value integerValue];
    }else if ([name isEqualToString:@"justifyContent"]) {
        yoga.flexDirection = (YGFlexDirection) [(NSNumber *) value integerValue];
    }else if ([name isEqualToString:@"justifyContent"]) {
        yoga.flexDirection = (YGFlexDirection) [(NSNumber *) value integerValue];
    }else if ([name isEqualToString:@"justifyContent"]) {
        yoga.flexDirection = (YGFlexDirection) [(NSNumber *) value integerValue];
    }else if ([name isEqualToString:@"justifyContent"]) {
        yoga.flexDirection = (YGFlexDirection) [(NSNumber *) value integerValue];
    }else if ([name isEqualToString:@"justifyContent"]) {
        yoga.flexDirection = (YGFlexDirection) [(NSNumber *) value integerValue];
    }else if ([name isEqualToString:@"justifyContent"]) {
        yoga.flexDirection = (YGFlexDirection) [(NSNumber *) value integerValue];
    }else if ([name isEqualToString:@"justifyContent"]) {
        yoga.flexDirection = (YGFlexDirection) [(NSNumber *) value integerValue];
    }

}


- (void)requestLayout {
    [super requestLayout];
    [self.view.yoga applyLayoutPreservingOrigin:NO];
}
@end