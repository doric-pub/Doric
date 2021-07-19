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
//  DoricShowNodeTreeViewController.m
//  Doric
//
//  Created by jingpeng.wang on 2021/7/12.
//
#import "DoricShowNodeTreeViewCell.h"

#import <DoricCore/Doric.h>

@implementation DoricShowNodeTreeViewCell

- (instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier {
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    
    if (self) {
        self.nodeIcon = [[UIImageView new] also:^(UIImageView *it) {
            it.width = 20;
            it.height = 20;
            it.contentMode = UIViewContentModeScaleToFill;
            [self.contentView addSubview:it];
        }];
        
        self.nodeNameLabel = [[UILabel new] also:^(UIImageView *it) {
            it.contentMode = UIViewContentModeScaleToFill;
            it.left = 30;
            [self.contentView addSubview:it];
        }];
    }
    return self;
}

- (void)layoutSubviews {
    [super layoutSubviews];
    
    self.nodeIcon.centerY = self.contentView.height / 2;
    self.nodeNameLabel.centerY = self.contentView.height / 2;
}

@end
