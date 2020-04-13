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

@interface DoricTextView : UILabel
@end

@implementation DoricTextView
- (void)drawTextInRect:(CGRect)rect {
    [super drawTextInRect:UIEdgeInsetsInsetRect(
            rect,
            UIEdgeInsetsMake(
                    self.doricLayout.paddingTop,
                    self.doricLayout.paddingLeft,
                    self.doricLayout.paddingBottom,
                    self.doricLayout.paddingRight))];
}
@end

@interface DoricTextNode ()
@property(nonatomic, strong) NSMutableParagraphStyle *paragraphStyle;
@property(nonatomic, assign) NSNumber *underline;
@property(nonatomic, assign) NSNumber *strikethrough;
@end

@implementation DoricTextNode
- (UILabel *)build {
    return [[[DoricTextView alloc] init] also:^(DoricTextView *it) {
        it.textAlignment = NSTextAlignmentCenter;
    }];
}

- (void)blendView:(UILabel *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([name isEqualToString:@"text"]) {
        view.text = prop;
        if (self.paragraphStyle) {
            [self reloadParagraphStyle];
        }
    } else if ([name isEqualToString:@"textSize"]) {
        UIFont *font = view.font;
        if (font) {
            view.font = [view.font fontWithSize:[(NSNumber *) prop floatValue]];
        } else {
            view.font = [UIFont systemFontOfSize:[(NSNumber *) prop floatValue]];
        }
    } else if ([name isEqualToString:@"textColor"]) {
        view.textColor = DoricColor(prop);
    } else if ([name isEqualToString:@"textAlignment"]) {
        DoricGravity gravity = (DoricGravity) [(NSNumber *) prop integerValue];
        NSTextAlignment alignment = NSTextAlignmentCenter;
        if ((gravity & DoricGravityLeft) == DoricGravityLeft) {
            alignment = NSTextAlignmentLeft;
        } else if ((gravity & DoricGravityRight) == DoricGravityRight) {
            alignment = NSTextAlignmentRight;
        }
        if (self.paragraphStyle) {
            self.paragraphStyle.alignment = alignment;
            NSMutableAttributedString *attributedString = [[NSMutableAttributedString alloc] initWithString:view.text];
            [attributedString addAttribute:NSParagraphStyleAttributeName value:self.paragraphStyle range:NSMakeRange(0, [attributedString length])];
            view.attributedText = attributedString;
        } else {
            view.textAlignment = alignment;
        }
    } else if ([name isEqualToString:@"maxLines"]) {
        view.numberOfLines = [prop integerValue];
    } else if ([name isEqualToString:@"fontStyle"]) {
        UIFont *font = view.font;
        if (!font) {
            font = [UIFont systemFontOfSize:[UIFont systemFontSize]];
        }
        UIFontDescriptor *fontDescriptor = nil;
        if ([@"bold" isEqualToString:prop]) {
            fontDescriptor = [font.fontDescriptor fontDescriptorWithSymbolicTraits:UIFontDescriptorTraitBold];
        } else if ([@"italic" isEqualToString:prop]) {
            fontDescriptor = [font.fontDescriptor fontDescriptorWithSymbolicTraits:UIFontDescriptorTraitItalic];
        } else if ([@"bold_italic" isEqualToString:prop]) {
            fontDescriptor = [font.fontDescriptor fontDescriptorWithSymbolicTraits:UIFontDescriptorTraitBold | UIFontDescriptorTraitItalic];
        }
        if (fontDescriptor) {
            font = [UIFont fontWithDescriptor:fontDescriptor size:0];
        }
        view.font = font;
    } else if ([name isEqualToString:@"maxWidth"]) {
        view.doricLayout.maxWidth = [prop floatValue];
    } else if ([name isEqualToString:@"maxHeight"]) {
        view.doricLayout.maxHeight = [prop floatValue];
    } else if ([name isEqualToString:@"font"]) {
        NSString *iconfont = prop;
        UIFont *font = [UIFont fontWithName:iconfont size:view.font.pointSize];
        view.font = font;
    } else if ([name isEqualToString:@"lineSpacing"]) {
        [[self ensureParagraphStyle] also:^(NSMutableParagraphStyle *it) {
            [it setLineSpacing:[prop floatValue]];
            [self reloadParagraphStyle];
        }];
    } else if ([name isEqualToString:@"underline"]) {
        [[self ensureParagraphStyle] also:^(NSMutableParagraphStyle *it) {
            self.underline = prop;
            [self reloadParagraphStyle];
        }];
    } else if ([name isEqualToString:@"strikethrough"]) {
        [[self ensureParagraphStyle] also:^(NSMutableParagraphStyle *it) {
            self.strikethrough = prop;
            [self reloadParagraphStyle];
        }];
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (NSMutableParagraphStyle *)ensureParagraphStyle {
    if (self.paragraphStyle == nil) {
        self.paragraphStyle = [NSMutableParagraphStyle new];
        self.paragraphStyle.alignment = self.view.textAlignment;
    }
    return self.paragraphStyle;
}

- (void)reloadParagraphStyle {
    NSString *labelText = self.view.text ?: @"";
    NSMutableAttributedString *attributedString = [[NSMutableAttributedString alloc] initWithString:labelText];
    [attributedString addAttribute:NSParagraphStyleAttributeName value:self.paragraphStyle range:NSMakeRange(0, [labelText length])];
    if (self.underline) {
        [attributedString addAttribute:NSUnderlineStyleAttributeName value:self.underline range:NSMakeRange(0, [labelText length])];
    }
    if (self.strikethrough) {
        [attributedString addAttribute:NSStrikethroughStyleAttributeName value:self.strikethrough range:NSMakeRange(0, [labelText length])];
    }
    self.view.attributedText = attributedString;
}

- (void)blend:(NSDictionary *)props {
    [super blend:props];
    [self.view.superview setNeedsLayout];
}
@end
