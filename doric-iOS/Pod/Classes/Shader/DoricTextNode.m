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
@property(nonatomic, assign) CGFloat maxWidth;
@property(nonatomic, assign) CGFloat maxHeight;
@end

@implementation DoricTextView
- (void)drawTextInRect:(CGRect)rect {
    [super drawTextInRect:UIEdgeInsetsInsetRect(rect, self.padding)];
}

- (CGSize)measureSize:(CGSize)targetSize {
    CGSize measuredSize = [super measureSize:targetSize];
    CGFloat measuredWidth = measuredSize.width;
    CGFloat measuredHeight = measuredSize.height;
    if (self.maxWidth > 0) {
        measuredWidth = MIN(self.maxWidth, measuredSize.width);
    }
    if (self.maxHeight > 0) {
        measuredHeight = MIN(self.maxHeight, measuredSize.height);
    }
    return CGSizeMake(measuredWidth, measuredHeight);
}
@end

@interface DoricTextNode ()
@property(nonatomic, strong) NSMutableParagraphStyle *paragraphStyle;
@end

@implementation DoricTextNode
- (UILabel *)build {
    return [[[DoricTextView alloc] init] also:^(UILabel *it) {
        it.textAlignment = NSTextAlignmentCenter;
    }];
}

- (void)blendView:(UILabel *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([name isEqualToString:@"text"]) {
        if (self.paragraphStyle) {
            NSMutableAttributedString *attributedString = [[NSMutableAttributedString alloc] initWithString:prop];
            [attributedString addAttribute:NSParagraphStyleAttributeName value:self.paragraphStyle range:NSMakeRange(0, [attributedString length])];
            view.attributedText = attributedString;
        } else {
            view.text = prop;
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
        if ((gravity & LEFT) == LEFT) {
            alignment = NSTextAlignmentLeft;
        } else if ((gravity & RIGHT) == RIGHT) {
            alignment = NSTextAlignmentRight;
        }
        if (self.paragraphStyle) {
            self.paragraphStyle.alignment = alignment;
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
        if ([view isKindOfClass:DoricTextView.class]) {
            ((DoricTextView *) view).maxWidth = [prop floatValue];
        }
    } else if ([name isEqualToString:@"maxHeight"]) {
        if ([view isKindOfClass:DoricTextView.class]) {
            ((DoricTextView *) view).maxHeight = [prop floatValue];
        }
    } else if ([name isEqualToString:@"font"]) {
        NSString *iconfont = prop;
        UIFont *font = [UIFont fontWithName:iconfont size:view.font.pointSize];
        view.font = font;
    } else if ([name isEqualToString:@"lineSpacing"]) {
        self.paragraphStyle = [NSMutableParagraphStyle new];
        [self.paragraphStyle setLineSpacing:[prop floatValue]];
        [self.paragraphStyle setAlignment:view.textAlignment];
        NSString *labelText = view.text ?: @"";
        NSMutableAttributedString *attributedString = [[NSMutableAttributedString alloc] initWithString:labelText];
        [attributedString addAttribute:NSParagraphStyleAttributeName value:self.paragraphStyle range:NSMakeRange(0, [labelText length])];
        view.attributedText = attributedString;
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (void)blend:(NSDictionary *)props {
    [super blend:props];
    [self.view.superview setNeedsLayout];
}
@end
