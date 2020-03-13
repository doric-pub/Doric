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
// Created by pengfei.zhou on 2020/3/12.
//

#import "DoricSwitchNode.h"
#import "DoricExtensions.h"
#import "DoricUtil.h"

@interface DoricSwitchNode ()
@property(nonatomic, copy) NSString *onSwitchFuncId;
@end

@implementation DoricSwitchNode
- (UISwitch *)build {
    return [[UISwitch new] also:^(UISwitch *it) {
        [it addTarget:self action:@selector(onSwitch) forControlEvents:UIControlEventValueChanged];
    }];
}

- (void)onSwitch {
    if (self.onSwitchFuncId.length > 0) {
        [self callJSResponse:self.onSwitchFuncId, @(self.view.isOn), nil];
    }
}

- (void)blend:(NSDictionary *)props {
    [super blend:props];
    [self.view also:^(UISwitch *it) {
        it.layer.cornerRadius = it.bounds.size.height / 2;
        it.layer.masksToBounds = YES;
        it.clipsToBounds = NO;
    }];
}

- (void)blendView:(UISwitch *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([@"state" isEqualToString:name]) {
        view.on = [prop boolValue];
    } else if ([@"onSwitch" isEqualToString:name]) {
        self.onSwitchFuncId = prop;
    } else if ([@"offTintColor" isEqualToString:name]) {
        UIColor *color = DoricColor(prop);
        view.tintColor = color;
        view.backgroundColor = color;
    } else if ([@"onTintColor" isEqualToString:name]) {
        UIColor *color = DoricColor(prop);
        view.onTintColor = color;
    } else if ([@"thumbTintColor" isEqualToString:name]) {
        UIColor *color = DoricColor(prop);
        view.thumbTintColor = color;
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (NSNumber *)getState {
    return @(self.view.isOn);
}
@end
