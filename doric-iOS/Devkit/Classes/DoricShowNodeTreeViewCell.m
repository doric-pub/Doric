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
        NSString *base64 = @"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";
        
        self.nodeIcon = [[UIImageView new] also:^(UIImageView *it) {
            it.width = 20;
            it.height = 20;
            it.left = 5;
            it.contentMode = UIViewContentModeScaleToFill;
            [self.contentView addSubview:it];
            
            NSData *imageData = [[NSData alloc] initWithBase64EncodedString:base64
                                                                    options:NSDataBase64DecodingIgnoreUnknownCharacters];
            it.image = [UIImage imageWithData:imageData];
            
            it.userInteractionEnabled = YES;
            UITapGestureRecognizer *tapGestureRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(onClick:)];
            [it addGestureRecognizer:tapGestureRecognizer];
        }];
        
        self.nodeNameLabel = [[UILabel new] also:^(UILabel *it) {
            it.contentMode = UIViewContentModeScaleToFill;
            it.left = 30;
            UIFont *font = it.font;
            if (font) {
                it.font = [it.font fontWithSize:12];
            } else {
                it.font = [UIFont systemFontOfSize:12];
            }
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

- (void)onClick:(UITapGestureRecognizer *)recognizer {
    
}

@end
