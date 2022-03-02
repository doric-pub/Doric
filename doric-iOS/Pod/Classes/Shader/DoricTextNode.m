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
#import <CoreText/CoreText.h>

@interface DoricTextView : UILabel
@property(nonatomic, assign) DoricGravity gravity;
@end

@implementation DoricTextView
- (void)drawTextInRect:(CGRect)rect {
    rect = UIEdgeInsetsInsetRect(
            rect,
            UIEdgeInsetsMake(
                    self.doricLayout.paddingTop,
                    self.doricLayout.paddingLeft,
                    self.doricLayout.paddingBottom,
                    self.doricLayout.paddingRight));
    if ((self.gravity & DoricGravityTop) == DoricGravityTop) {
        rect.origin.y = self.doricLayout.paddingTop;
        rect.size.height = self.doricLayout.contentHeight;
    } else if ((self.gravity & DoricGravityBottom) == DoricGravityBottom) {
        rect.origin.y = self.height - self.doricLayout.contentHeight - self.doricLayout.paddingBottom;
        rect.size.height = self.doricLayout.contentHeight;
    }
    rect.size.width = MAX(0.01f, rect.size.width);
    [super drawTextInRect:rect];
}

- (CGSize)sizeThatFits:(CGSize)size {
    return [super sizeThatFits:size];
}
@end

@interface DoricTextNode ()
@property(nonatomic, strong) NSMutableParagraphStyle *paragraphStyle;
@property(nonatomic, copy) NSNumber *underline;
@property(nonatomic, copy) NSNumber *strikethrough;
@property(nonatomic, strong) NSDictionary *textGradientProps;
@property(nonatomic, assign) CGSize textGradientSize;
@property(nonatomic, assign) CGFloat textSize;
@end

@implementation DoricTextNode
- (UILabel *)build {
    return [[[DoricTextView alloc] init] also:^(DoricTextView *it) {
        [self ensureParagraphStyle];
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
        self.textSize = [(NSNumber *) prop floatValue];
    } else if ([name isEqualToString:@"textColor"]) {
        if ([prop isKindOfClass:[NSNumber class]]) {
            view.textColor = DoricColor(prop);
            self.textGradientProps = nil;
            self.textGradientSize = CGSizeZero;
        } else if ([prop isKindOfClass:[NSDictionary class]]) {
            self.textGradientProps = prop;
            self.textGradientSize = CGSizeZero;
        }
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
            NSMutableAttributedString *attributedString = [[NSMutableAttributedString alloc] initWithString:view.text ?: @""];
            [attributedString addAttribute:NSParagraphStyleAttributeName value:self.paragraphStyle range:NSMakeRange(0, [attributedString length])];
            view.attributedText = attributedString;
        } else {
            view.textAlignment = alignment;
        }
        ((DoricTextView *) view).gravity = gravity;
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
        } else {
            font = [UIFont fontWithName:font.fontName size:font.pointSize];
        }
        view.font = font;
    } else if ([name isEqualToString:@"maxWidth"]) {
        view.doricLayout.maxWidth = [prop floatValue];
    } else if ([name isEqualToString:@"maxHeight"]) {
        view.doricLayout.maxHeight = [prop floatValue];
    } else if ([name isEqualToString:@"font"]) {
        if ([prop isKindOfClass:[NSString class]]) {
            NSString *iconfont = prop;
            UIFont *font = [UIFont fontWithName:[iconfont stringByReplacingOccurrencesOfString:@".ttf" withString:@""]
                                           size:view.font.pointSize];
            view.font = font;
        } else if ([prop isKindOfClass:[NSDictionary class]]) {
            DoricAsyncResult <NSData *> *asyncResult = [[self.doricContext.driver.registry.loaderManager
                    load:prop
             withContext:self.doricContext] fetch];
            [asyncResult setResultCallback:^(NSData *fontData) {
                [self.doricContext dispatchToMainQueue:^{
                    view.font = [self registerFontWithFontData:fontData fontSize:self.textSize > 0 ? self.textSize : 12];
                }];
            }];
            [asyncResult setExceptionCallback:^(NSException *e) {
                DoricLog(@"Cannot load resource %@, %@", prop, e.reason);
            }];
        }
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
    } else if ([name isEqualToString:@"htmlText"]) {
        NSAttributedString *attStr = [[NSAttributedString alloc] initWithData:[prop dataUsingEncoding:NSUnicodeStringEncoding]
                                                                      options:@{NSDocumentTypeDocumentAttribute: NSHTMLTextDocumentType}
                                                           documentAttributes:nil
                                                                        error:nil];
        view.attributedText = attStr;
    } else if ([name isEqualToString:@"truncateAt"]) {
        [prop also:^(NSNumber *truncateAt) {
            [[self ensureParagraphStyle] also:^(NSMutableParagraphStyle *it) {
                switch (truncateAt.integerValue) {
                    case 1:
                        it.lineBreakMode = NSLineBreakByTruncatingMiddle;
                        break;
                    case 2:
                        it.lineBreakMode = NSLineBreakByTruncatingHead;
                        break;
                    case 3:
                        it.lineBreakMode = NSLineBreakByClipping;
                        break;
                    default:
                        it.lineBreakMode = NSLineBreakByTruncatingTail;
                        break;
                }
                [self reloadParagraphStyle];
            }];
        }];

    } else if ([name isEqualToString:@"shadow"]) {
        NSDictionary *dic = prop;
        CGFloat opacity = [(NSNumber *) dic[@"opacity"] floatValue];
        if (opacity > CGFLOAT_MIN) {
            UIColor *color = DoricColor((NSNumber *) dic[@"color"]);
            view.layer.shadowColor = color.CGColor;
            view.layer.shadowRadius = [(NSNumber *) dic[@"radius"] floatValue];
            view.layer.shadowOffset = CGSizeMake([(NSNumber *) dic[@"offsetX"] floatValue], [(NSNumber *) dic[@"offsetY"] floatValue]);
            view.layer.shadowOpacity = (float) opacity;
        }
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (NSMutableParagraphStyle *)ensureParagraphStyle {
    if (self.paragraphStyle == nil) {
        self.paragraphStyle = [NSMutableParagraphStyle new];
        self.paragraphStyle.alignment = NSTextAlignmentCenter;
        self.paragraphStyle.lineBreakMode = NSLineBreakByTruncatingTail;
    }
    return self.paragraphStyle;
}

- (void)reloadParagraphStyle {
    NSString *labelText = self.view.text ?: @"";
    NSMutableAttributedString *attributedString = [[NSMutableAttributedString alloc] initWithString:labelText];
    if (self.view.attributedText) {
        [attributedString setAttributedString:self.view.attributedText];
    }
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
    self.view.doricLayout.resolved = NO;
}

- (void)requestLayout {
    [super requestLayout];

    [self.textGradientProps also:^(NSDictionary *dict) {
        if (CGSizeEqualToSize(self.textGradientSize, self.view.frame.size)) {
            return;
        }
        self.textGradientSize = self.view.frame.size;

        NSMutableArray *colors = [[NSMutableArray alloc] init];
        NSMutableArray *arrayLocations = nil;
        if (dict[@"colors"] != nil) {
            NSMutableArray *arrayColors = [dict mutableArrayValueForKey:@"colors"];
            [arrayColors forEach:^(id obj) {
                [colors addObject:(__bridge id) DoricColor(obj).CGColor];
            }];
            if (dict[@"locations"] != nil) {
                arrayLocations = [dict mutableArrayValueForKey:@"locations"];
            }

        } else {
            if (dict[@"start"] != nil && dict[@"end"] != nil) {
                UIColor *start = DoricColor(dict[@"start"]);
                UIColor *end = DoricColor(dict[@"end"]);

                [colors addObject:(__bridge id) start.CGColor];
                [colors addObject:(__bridge id) end.CGColor];
            }
        }

        int orientation = [dict[@"orientation"] intValue];
        CGPoint startPoint;
        CGPoint endPoint;
        if (orientation == 1) {
            startPoint = CGPointMake(1, 0);
            endPoint = CGPointMake(0, 1);
        } else if (orientation == 2) {
            startPoint = CGPointMake(1, 0);
            endPoint = CGPointMake(0, 0);
        } else if (orientation == 3) {
            startPoint = CGPointMake(1, 1);
            endPoint = CGPointMake(0, 0);
        } else if (orientation == 4) {
            startPoint = CGPointMake(0, 1);
            endPoint = CGPointMake(0, 0);
        } else if (orientation == 5) {
            startPoint = CGPointMake(0, 1);
            endPoint = CGPointMake(1, 0);
        } else if (orientation == 6) {
            startPoint = CGPointMake(0, 0);
            endPoint = CGPointMake(1, 0);
        } else if (orientation == 7) {
            startPoint = CGPointMake(0, 0);
            endPoint = CGPointMake(1, 1);
        } else {
            startPoint = CGPointMake(0, 0);
            endPoint = CGPointMake(0, 1);
        }

        UIImage *gradientImage;
        if (arrayLocations != nil) {
            CGFloat locations[arrayLocations.count];
            for (int i = 0; i != arrayLocations.count; i++) {
                locations[i] = [arrayLocations[i] floatValue];
            }
            gradientImage = [self gradientImageFromColors:colors
                                                locations:locations
                                               startPoint:startPoint
                                                 endPoint:endPoint
                                                  imgSize:self.textGradientSize];
        } else {
            gradientImage = [self gradientImageFromColors:colors
                                                locations:NULL
                                               startPoint:startPoint
                                                 endPoint:endPoint
                                                  imgSize:self.textGradientSize];
        }
        self.view.textColor = [UIColor colorWithPatternImage:gradientImage];
    }];
}

- (UIFont *)registerFontWithFontData:(NSData *)fontData fontSize:(CGFloat)fontSize{
    CGDataProviderRef fontDataProvider = CGDataProviderCreateWithCFData((__bridge CFDataRef)fontData);
    CGFontRef fontRef = CGFontCreateWithDataProvider(fontDataProvider);
    [UIFont familyNames];
    CGDataProviderRelease(fontDataProvider);
    CTFontManagerRegisterGraphicsFont(fontRef, NULL);
    NSString *fontName = CFBridgingRelease(CGFontCopyPostScriptName(fontRef));
    UIFont *font = [UIFont fontWithName:fontName size:fontSize];
    CGFontRelease(fontRef);
    return font;
}


- (UIImage *)gradientImageFromColors:(NSArray *)colors
                           locations:(CGFloat *)locations
                          startPoint:(CGPoint)startPoint
                            endPoint:(CGPoint)endPoint
                             imgSize:(CGSize)imgSize {
    if (@available(iOS 10.0, *)) {
        UIGraphicsImageRendererFormat *format = [[UIGraphicsImageRendererFormat alloc] init];
        format.scale = [UIScreen mainScreen].scale;
        UIGraphicsImageRenderer *render = [[UIGraphicsImageRenderer alloc] initWithSize:imgSize format:format];
        UIImage *image = [render imageWithActions:^(UIGraphicsImageRendererContext *_Nonnull rendererContext) {
            CGContextRef context = rendererContext.CGContext;

            CGContextSaveGState(context);
            CGColorSpaceRef colorSpace = CGColorGetColorSpace((__bridge CGColorRef) colors.lastObject);
            CGGradientRef gradient = CGGradientCreateWithColors(colorSpace, (__bridge CFArrayRef) colors, locations);
            CGPoint start = (CGPoint) {startPoint.x * imgSize.width, startPoint.y * imgSize.height};
            CGPoint end = (CGPoint) {endPoint.x * imgSize.width, endPoint.y * imgSize.height};
            CGContextDrawLinearGradient(context, gradient, start, end, kCGGradientDrawsBeforeStartLocation | kCGGradientDrawsAfterEndLocation);
            CGGradientRelease(gradient);
            CGContextRestoreGState(context);
        }];
        return image;
    } else {
        UIGraphicsBeginImageContextWithOptions(imgSize, NO, [UIScreen mainScreen].scale);
        CGContextRef context = UIGraphicsGetCurrentContext();
        CGContextSaveGState(context);
        CGColorSpaceRef colorSpace = CGColorGetColorSpace((__bridge CGColorRef) colors.lastObject);
        CGGradientRef gradient = CGGradientCreateWithColors(colorSpace, (__bridge CFArrayRef) colors, locations);
        CGPoint start = (CGPoint) {startPoint.x * imgSize.width, startPoint.y * imgSize.height};
        CGPoint end = (CGPoint) {endPoint.x * imgSize.width, endPoint.y * imgSize.height};
        CGContextDrawLinearGradient(context, gradient, start, end, kCGGradientDrawsBeforeStartLocation | kCGGradientDrawsAfterEndLocation);
        UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
        CGGradientRelease(gradient);
        CGContextRestoreGState(context);
        UIGraphicsEndImageContext();
        return image;
    }
}

- (void)reset {
    [super reset];
    self.view.text = nil;
    self.view.font = nil;
    self.view.textColor = UIColor.blackColor;
    self.view.textAlignment = NSTextAlignmentNatural;
    self.view.numberOfLines = 1;
    self.view.layer.shadowOpacity = 0;
    self.view.layer.shadowRadius = 3;
    self.view.layer.shadowOffset = CGSizeMake(0, -3);
    self.view.lineBreakMode = NSLineBreakByTruncatingTail;
}
@end
