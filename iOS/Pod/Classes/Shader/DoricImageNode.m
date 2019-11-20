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
//  DoricImageNode.m
//  Doric
//
//  Created by pengfei.zhou on 2019/8/6.
//

#import "DoricImageNode.h"
#import "Doric.h"
#import <SDWebImage/SDWebImage.h>

@implementation DoricImageNode

- (UIImageView *)build {
    return [[UIImageView new] also:^(UIImageView *it) {
        it.clipsToBounds = YES;
    }];
}

- (void)blendView:(UIImageView *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([@"imageUrl" isEqualToString:name]) {
        __weak typeof(self) _self = self;
        [view sd_setImageWithURL:[NSURL URLWithString:prop] completed:^(UIImage *_Nullable image, NSError *_Nullable error, SDImageCacheType cacheType, NSURL *_Nullable imageURL) {
            __strong typeof(_self) self = _self;
            [self requestLayout];
        }];
    } else if ([@"scaleType" isEqualToString:name]) {
        switch ([prop integerValue]) {
            case 1: {
                self.view.contentMode = UIViewContentModeScaleAspectFit;
                break;
            }
            case 2: {
                self.view.contentMode = UIViewContentModeScaleAspectFill;
                break;
            }
            default: {
                self.view.contentMode = UIViewContentModeScaleToFill;
                break;
            }
        }
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}
@end
