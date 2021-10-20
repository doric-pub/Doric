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
//  DoricInputNode.m
//  Doric
//
//  Created by 姜腾 on 2019/12/11.
//

#import <JavaScriptCore/JavaScriptCore.h>
#import "DoricInputNode.h"
#import "DoricUtil.h"
#import "DoricPromise.h"

typedef void (^onTextChangeBlock)(NSString *text, DoricInputNode *node);

typedef void (^onFocusChangeBlock)(BOOL focused, DoricInputNode *node);

typedef void (^onSubmitEditingBlock)(NSString *text, DoricInputNode *node);

@interface DoricSingleLineInput : UITextField
@end

@implementation DoricSingleLineInput
- (void)drawTextInRect:(CGRect)rect {
    [super drawTextInRect:rect];
}

- (CGSize)sizeThatFits:(CGSize)size {
    return [super sizeThatFits:size];
}
@end

@interface DoricMultilineInput : UITextView
@property(nonatomic, assign) DoricGravity gravity;
@property(nonatomic, strong) UILabel *placeholderLabel;
@end

@implementation DoricMultilineInput
- (instancetype)init {
    if (self = [super init]) {
        self.font = [UIFont systemFontOfSize:12];
        _placeholderLabel = [UILabel new];
        _placeholderLabel.numberOfLines = 0;
        _placeholderLabel.textColor = [UIColor grayColor];
        _placeholderLabel.userInteractionEnabled = NO;
        _placeholderLabel.font = self.font;
        [self insertSubview:_placeholderLabel atIndex:0];
    }
    return self;
}

- (void)setText:(NSString *)text {
    [super setText:text];
    self.placeholderLabel.hidden = self.text.length > 0;
}

- (void)layoutSubviews {
    [super layoutSubviews];
    self.placeholderLabel.hidden = self.text.length > 0;
    if (!self.placeholderLabel.hidden) {
        CGFloat lineFragmentPadding = self.textContainer.lineFragmentPadding;
        UIEdgeInsets textContainerInset = self.textContainerInset;
        self.placeholderLabel.x = lineFragmentPadding + textContainerInset.left;

        CGFloat desiredWidth = self.width - lineFragmentPadding * 2 - textContainerInset.left - textContainerInset.right;
        CGSize fitSize = [self.placeholderLabel sizeThatFits:CGSizeMake(desiredWidth, 0)];

        if (fitSize.width < desiredWidth) {
            self.placeholderLabel.width = desiredWidth;
        }
        self.placeholderLabel.height = fitSize.height;
        if ((self.gravity & DoricGravityTop) == DoricGravityTop) {
            self.placeholderLabel.y = textContainerInset.top;
        } else if ((self.gravity & DoricGravityBottom) == DoricGravityBottom) {
            self.placeholderLabel.y = self.height - textContainerInset.bottom - fitSize.height;
        } else {
            self.placeholderLabel.centerY = (self.height - textContainerInset.top - textContainerInset.bottom) / 2;
        }
    }
    if (self.contentSize.height < self.height) {
        if ((self.gravity & DoricGravityTop) == DoricGravityTop) {
            self.contentInset = UIEdgeInsetsMake(
                    0,
                    self.contentInset.left,
                    self.contentInset.bottom,
                    self.contentInset.right);
        } else if ((self.gravity & DoricGravityBottom) == DoricGravityBottom) {
            self.contentInset = UIEdgeInsetsMake(
                    self.height - self.contentSize.height,
                    self.contentInset.left,
                    self.contentInset.bottom,
                    self.contentInset.right);
        } else {
            self.contentInset = UIEdgeInsetsMake(
                    (self.height - self.contentSize.height) / 2,
                    self.contentInset.left,
                    self.contentInset.bottom,
                    self.contentInset.right);
        }
    }
}

- (CGSize)sizeThatFits:(CGSize)size {
    if (self.text.length > 0) {
        CGSize ret = [super sizeThatFits:size];
        return CGSizeMake(ret.width - self.doricLayout.paddingLeft - self.doricLayout.paddingRight, ret.height - self.doricLayout.paddingTop - self.doricLayout.paddingBottom);
    } else {
        CGSize ret = [self.placeholderLabel sizeThatFits:size];
        return CGSizeMake(ret.width, ret.height);
    }
}

- (void)setTextAlignment:(NSTextAlignment)textAlignment {
    [super setTextAlignment:textAlignment];
    self.placeholderLabel.textAlignment = textAlignment;
}

@end

@interface DoricInputView ()
@property(nonatomic, strong) DoricMultilineInput *multiLineInput;
@property(nonatomic, strong) DoricSingleLineInput *singleLineInput;
@property(nonatomic, strong) UIFont *hintFont;
@end

@implementation DoricInputView
- (instancetype)init {
    if (self = [super init]) {
        _multiLineInput = [DoricMultilineInput new];
        _multiLineInput.backgroundColor = UIColor.clearColor;
        _multiLineInput.textAlignment = NSTextAlignmentLeft;
        _multiLineInput.gravity = DoricGravityTop;
        [self addSubview:_multiLineInput];
        _singleLineInput = [DoricSingleLineInput new];
        _singleLineInput.backgroundColor = UIColor.clearColor;
        _singleLineInput.textAlignment = NSTextAlignmentLeft;
        _singleLineInput.contentVerticalAlignment = UIControlContentVerticalAlignmentTop;
        [self addSubview:_singleLineInput];
        self.multiline = YES;
    }
    return self;
}

- (void)setMultiline:(BOOL)multiline {
    if (multiline == self.multiline) {
        return;
    }
    if (multiline) {
        self.multiLineInput.text = self.singleLineInput.text;
        if (self.singleLineInput.isFirstResponder) {
            [self.multiLineInput becomeFirstResponder];
        }
    } else {
        self.singleLineInput.text = self.multiLineInput.text;
        if (self.multiLineInput.isFirstResponder) {
            [self.singleLineInput becomeFirstResponder];
        }
    }
    self.singleLineInput.hidden = multiline;
    self.multiLineInput.hidden = !multiline;
}

- (BOOL)multiline {
    return self.singleLineInput.hidden;
}

- (void)setFrame:(CGRect)frame {
    [super setFrame:frame];
    self.singleLineInput.width = frame.size.width - self.doricLayout.paddingLeft - self.doricLayout.paddingRight;
    self.singleLineInput.height = frame.size.height - self.doricLayout.paddingTop - self.doricLayout.paddingBottom;
    self.singleLineInput.x = self.doricLayout.paddingLeft;
    self.singleLineInput.y = self.doricLayout.paddingTop;
    self.multiLineInput.width = frame.size.width - self.doricLayout.paddingLeft - self.doricLayout.paddingRight;
    self.multiLineInput.height = frame.size.height - self.doricLayout.paddingTop - self.doricLayout.paddingBottom;
    self.multiLineInput.x = self.doricLayout.paddingLeft;
    self.multiLineInput.y = self.doricLayout.paddingTop;
}

- (CGSize)sizeThatFits:(CGSize)size {
    if (self.multiline) {
        return [self.multiLineInput sizeThatFits:size];
    } else {
        return [self.singleLineInput sizeThatFits:size];
    }
}

- (void)setText:(NSString *)text {
    self.multiLineInput.text = text;
    self.singleLineInput.text = text;
}

- (NSString *)text {
    if (self.multiline) {
        return self.multiLineInput.text;
    } else {
        return self.singleLineInput.text;
    }
}

- (void)setFont:(UIFont *)font {
    self.multiLineInput.font = font;
    self.singleLineInput.font = font;
}

- (UIFont *)font {
    if (self.multiline) {
        return self.multiLineInput.font;
    } else {
        return self.singleLineInput.font;
    }
}

- (void)setTextColor:(UIColor *)color {
    self.multiLineInput.textColor = color;
    self.singleLineInput.textColor = color;
}

- (UIColor *)textColor {
    if (self.multiline) {
        return self.multiLineInput.textColor;
    } else {
        return self.singleLineInput.textColor;
    }
}

- (void)setTextAlignment:(NSTextAlignment)textAlignment {
    self.multiLineInput.textAlignment = textAlignment;
    self.singleLineInput.textAlignment = textAlignment;
}

- (NSTextAlignment)textAlignment {
    if (self.multiline) {
        return self.multiLineInput.textAlignment;
    } else {
        return self.singleLineInput.textAlignment;
    }
}

- (void)setHintText:(NSString *)text {
    self.multiLineInput.placeholderLabel.text = text;
}

- (NSString *)hintText {
    if (self.multiline) {
        return self.multiLineInput.placeholderLabel.text;
    } else {
        return self.singleLineInput.placeholder;
    }
}

- (void)setHintTextColor:(UIColor *)color {
    self.multiLineInput.placeholderLabel.textColor = color;
}

- (void)setHintFont:(UIFont *)font {
    _hintFont = font;
    self.multiLineInput.placeholderLabel.font = font;
}

- (void)setKeyboardType:(UIKeyboardType)keyboardType {
    self.multiLineInput.keyboardType = keyboardType;
    self.singleLineInput.keyboardType = keyboardType;
}

- (void)setReturnKeyType:(UIReturnKeyType)returnKeyType {
    self.multiLineInput.returnKeyType = returnKeyType;
    self.singleLineInput.returnKeyType = returnKeyType;
}

- (void)setSecureTextEntry:(BOOL)secureTextEntry {
    self.multiLineInput.secureTextEntry = secureTextEntry;
    self.singleLineInput.secureTextEntry = secureTextEntry;
}

- (void)setEditable:(BOOL)editable {
    self.multiLineInput.editable = editable;
    self.singleLineInput.enabled = editable;
}

@end


@interface DoricInputNode () <UITextViewDelegate, UITextFieldDelegate>
@property(nonatomic, copy) onTextChangeBlock onTextChange;
@property(nonatomic, copy) onFocusChangeBlock onFocusChange;
@property(nonatomic, copy) onSubmitEditingBlock onSubmitEditing;
@property(nonatomic, strong) NSNumber *maxLength;
@property(nonatomic, copy) NSString *beforeTextChangeFuncId;
@end

@implementation DoricInputNode
- (DoricInputView *)build {
    DoricInputView *v = [DoricInputView new];
    v.singleLineInput.delegate = self;
    [v.singleLineInput addTarget:self action:@selector(textFieldDidChange:) forControlEvents:UIControlEventEditingChanged];
    v.multiLineInput.delegate = self;
    v.multiLineInput.textContainer.lineFragmentPadding = 0;
    v.doricLayout.paddingTop = v.multiLineInput.textContainerInset.top;
    v.doricLayout.paddingBottom = v.multiLineInput.textContainerInset.bottom;
    v.doricLayout.paddingLeft = v.multiLineInput.textContainerInset.left;
    v.doricLayout.paddingRight = v.multiLineInput.textContainerInset.right;
    v.multiLineInput.textContainerInset = UIEdgeInsetsMake(0, 0, 0, 0);
    return v;
}

- (void)blendView:(DoricInputView *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([name isEqualToString:@"text"]) {
        view.text = prop;
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
        view.textAlignment = alignment;
        view.multiLineInput.gravity = gravity;
        UIControlContentVerticalAlignment verticalAlignment = UIControlContentVerticalAlignmentCenter;
        if ((gravity & DoricGravityTop) == DoricGravityTop) {
            verticalAlignment = UIControlContentVerticalAlignmentTop;
        } else if ((gravity & DoricGravityBottom) == DoricGravityBottom) {
            verticalAlignment = UIControlContentVerticalAlignmentBottom;
        }
        view.singleLineInput.contentVerticalAlignment = verticalAlignment;
    } else if ([name isEqualToString:@"font"]) {
        NSString *iconfont = prop;
        UIFont *font = [UIFont fontWithName:[iconfont stringByReplacingOccurrencesOfString:@".ttf" withString:@""]
                                       size:view.font.pointSize];
        view.font = font;
    } else if ([name isEqualToString:@"multiline"]) {
        BOOL value = [(NSNumber *) prop boolValue];
        view.multiline = value;
    } else if ([name isEqualToString:@"beforeTextChange"]) {
        self.beforeTextChangeFuncId = prop;
    } else if ([name isEqualToString:@"hintText"]) {
        view.hintText = (NSString *) prop;
    } else if ([name isEqualToString:@"hintTextColor"]) {
        view.hintTextColor = DoricColor(prop);
    } else if ([name isEqualToString:@"hintFont"]) {
        NSString *iconfont = prop;
        UIFont *font = [UIFont fontWithName:[iconfont stringByReplacingOccurrencesOfString:@".ttf" withString:@""]
                                       size:view.font.pointSize];
        view.hintFont = font;
    } else if ([name isEqualToString:@"onTextChange"]) {
        if ([prop isKindOfClass:[NSString class]]) {
            self.onTextChange = ^(NSString *text, DoricInputNode *node) {
                [node callJSResponse:prop, text, nil];
            };
        } else {
            self.onTextChange = nil;
        }
    } else if ([name isEqualToString:@"onFocusChange"]) {
        if ([prop isKindOfClass:[NSString class]]) {
            self.onFocusChange = ^(BOOL focused, DoricInputNode *node) {
                [node callJSResponse:prop, @(focused), nil];
            };
        } else {
            self.onFocusChange = nil;
        }

    } else if ([name isEqualToString:@"maxLength"]) {
        self.maxLength = prop;
    } else if ([name isEqualToString:@"inputType"]) {
        switch ([prop integerValue]) {
            case 1: {
                [self.view setKeyboardType:UIKeyboardTypeNumberPad];
                break;
            }
            case 2: {
                [self.view setKeyboardType:UIKeyboardTypeDecimalPad];
                break;
            }
            case 3: {
                [self.view setKeyboardType:UIKeyboardTypeAlphabet];
                break;
            }
            case 4: {
                [self.view setKeyboardType:UIKeyboardTypePhonePad];
                break;
            }
            default: {
                [self.view setKeyboardType:UIKeyboardTypeDefault];
                break;
            }
        }
    } else if ([name isEqualToString:@"password"]) {
        view.secureTextEntry = [(NSNumber *) prop boolValue];
    } else if ([name isEqualToString:@"editable"]) {
        view.editable = [(NSNumber *) prop boolValue];
    } else if ([name isEqualToString:@"returnKeyType"]) {
        switch ([(NSNumber *) prop integerValue]) {
            case 1:
                view.returnKeyType = UIReturnKeyDone;
                break;
            case 2:
                view.returnKeyType = UIReturnKeySearch;
                break;
            case 3:
                view.returnKeyType = UIReturnKeyNext;
                break;
            case 4:
                view.returnKeyType = UIReturnKeyGo;
                break;
            case 5:
                view.returnKeyType = UIReturnKeySend;
                break;
            case 0:
            default:
                view.returnKeyType = UIReturnKeyDefault;
                break;
        }
    } else if ([name isEqualToString:@"onSubmitEditing"]) {
        if ([prop isKindOfClass:[NSString class]]) {
            self.onSubmitEditing = ^(NSString *text, DoricInputNode *node) {
                [node callJSResponse:prop, text, nil];
            };
        } else {
            self.onSubmitEditing = nil;
        }
    } else if ([name isEqualToString:@"enableHorizontalScrollBar"]) {
        view.multiLineInput.showsHorizontalScrollIndicator = [prop boolValue];;
    } else if ([name isEqualToString:@"enableVerticalScrollBar"]) {
        view.multiLineInput.showsVerticalScrollIndicator = [prop boolValue];;
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (void)blend:(NSDictionary *)props {
    [super blend:props];
}

- (void)afterBlended:(NSDictionary *)props {
    [super afterBlended:props];
    UIFont *font = self.view.hintFont;
    if (font) {
        self.view.multiLineInput.placeholderLabel.font = [self.view.multiLineInput.placeholderLabel.font fontWithSize:self.view.font.pointSize];
    } else {
        self.view.multiLineInput.placeholderLabel.font = self.view.multiLineInput.font;
    }
    self.view.multiLineInput.placeholderLabel.numberOfLines = self.view.multiLineInput.textContainer.maximumNumberOfLines;
    if (self.view.multiLineInput.placeholderLabel.text) {
        self.view.singleLineInput.attributedPlaceholder = [[NSAttributedString alloc]
                initWithString:self.view.multiLineInput.placeholderLabel.text
                    attributes:@{
                            NSForegroundColorAttributeName: self.view.multiLineInput.placeholderLabel.textColor,
                            NSFontAttributeName: self.view.multiLineInput.placeholderLabel.font}];
    }
}

- (void)requestLayout {
    [super requestLayout];
    [self.view setNeedsLayout];
}

#pragma mark - Doric-JS api

- (NSString *)getText {
    return self.view.text;
}

- (void)setSelection:(NSDictionary *)params withPromise:(DoricPromise *)promise {
    NSNumber *start = params[@"start"];
    NSNumber *end = params[@"end"];
    if (self.view.multiline) {
        self.view.multiLineInput.selectedRange = NSMakeRange(start.unsignedIntegerValue, end.unsignedIntegerValue - start.unsignedIntegerValue);
    } else {
        UITextPosition *startPos = [self.view.singleLineInput positionFromPosition:self.view.singleLineInput.beginningOfDocument
                                                                            offset:start.unsignedIntegerValue];
        UITextPosition *endPos = [self.view.singleLineInput positionFromPosition:self.view.singleLineInput.beginningOfDocument
                                                                          offset:end.unsignedIntegerValue];
        self.view.singleLineInput.selectedTextRange = [self.view.singleLineInput textRangeFromPosition:startPos
                                                                                            toPosition:endPos];
    }
    [promise resolve:nil];
}

- (NSDictionary *)getSelection {
    if (self.view.multiline) {
        return @{
                @"start": @([self.view.multiLineInput offsetFromPosition:self.view.multiLineInput.beginningOfDocument
                                                              toPosition:self.view.multiLineInput.selectedTextRange.start]),
                @"end": @([self.view.multiLineInput offsetFromPosition:self.view.multiLineInput.beginningOfDocument
                                                            toPosition:self.view.multiLineInput.selectedTextRange.end]),
        };
    } else {
        UITextRange *range = self.view.singleLineInput.selectedTextRange;
        return @{
                @"start": @( [self.view.singleLineInput offsetFromPosition:self.view.singleLineInput.beginningOfDocument
                                                                toPosition:range.start]),
                @"end": @( [self.view.singleLineInput offsetFromPosition:self.view.singleLineInput.beginningOfDocument
                                                              toPosition:range.end]),
        };
    }

}

- (void)requestFocus {
    if (self.view.multiline) {
        [self.view.multiLineInput becomeFirstResponder];
    } else {
        [self.view.singleLineInput becomeFirstResponder];
    }
}

- (void)releaseFocus {
    if (self.view.multiline) {
        [self.view.multiLineInput resignFirstResponder];
    } else {
        [self.view.singleLineInput resignFirstResponder];
    }
}

#pragma mark - UITextViewDelegate

- (void)textViewDidBeginEditing:(UITextView *)textView {
    if (self.onFocusChange) {
        self.onFocusChange(YES, self);
    }
}

- (void)textViewDidEndEditing:(UITextView *)textView {
    if (self.onFocusChange) {
        self.onFocusChange(NO, self);
    }
}

- (BOOL)textView:(UITextView *)textView shouldChangeTextInRange:(NSRange)range replacementText:(NSString *)text {
    if (self.beforeTextChangeFuncId) {
        DoricAsyncResult *asyncResult = [self
                pureCallJSResponse:self.beforeTextChangeFuncId,
                                   @{
                                           @"editing": textView.text,
                                           @"start": @(range.location),
                                           @"length": @(range.length),
                                           @"replacement": text,
                                   },
                        nil];
        NSNumber *ret = [asyncResult waitUntilResult:^(JSValue *model) {
            return [model toNumber];
        }];
        return [ret boolValue];
    }
    return YES;
}

- (void)textViewDidChange:(UITextView *)textView {
    if (textView.markedTextRange || textView.text.length > 0) {
        self.view.multiLineInput.placeholderLabel.hidden = YES;
    } else {
        self.view.multiLineInput.placeholderLabel.hidden = NO;
    }

    if (textView.markedTextRange) return;

    if (self.maxLength) {
        textView.text = [self limitToHansMaxLength:self.maxLength.unsignedIntValue text:textView.text];
    }
    if (self.onTextChange) {
        self.onTextChange(textView.text, self);
    }
    [textView setNeedsLayout];
}


- (NSString *)limitToHansMaxLength:(NSUInteger)maxLen text:(NSString *)text {
    NSUInteger asciiMaxLen = 2 * maxLen;
    __block NSUInteger asciiLen = 0;
    __block NSUInteger subStringRangeLen = 0;
    [text enumerateSubstringsInRange:NSMakeRange(0, text.length)
                             options:NSStringEnumerationByComposedCharacterSequences
                          usingBlock:^(NSString *substring, NSRange substringRange, NSRange enclosingRange, BOOL *stop) {
                              if ([substring canBeConvertedToEncoding:NSASCIIStringEncoding]) {
                                  asciiLen += 2;
                              } else {
                                  asciiLen += [substring lengthOfBytesUsingEncoding:NSUTF16StringEncoding];
                              }
                              if (asciiLen <= asciiMaxLen) {
                                  subStringRangeLen = substringRange.location + substringRange.length;
                              } else {
                                  *stop = YES;
                              }
                          }];
    return [text substringWithRange:NSMakeRange(0, subStringRangeLen)];
}


- (void)textFieldDidChange:(UITextField *)textField {
    if (self.maxLength) {
        textField.text = [self limitToHansMaxLength:self.maxLength.unsignedIntValue text:textField.text];
    }
    if (self.onTextChange) {
        self.onTextChange(textField.text, self);
    }
    [textField setNeedsLayout];
}

- (void)textFieldDidBeginEditing:(UITextField *)textField {
    if (self.onFocusChange) {
        self.onFocusChange(YES, self);
    }
}

- (void)textFieldDidEndEditing:(UITextField *)textField {
    if (self.onFocusChange) {
        self.onFocusChange(NO, self);
    }
}

- (BOOL)textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string {
    if (self.beforeTextChangeFuncId) {
        DoricAsyncResult *asyncResult = [self
                pureCallJSResponse:self.beforeTextChangeFuncId,
                                   @{
                                           @"editing": textField.text,
                                           @"start": @(range.location),
                                           @"length": @(range.length),
                                           @"replacement": string,
                                   },
                        nil];
        NSNumber *ret = [asyncResult waitUntilResult:^(JSValue *model) {
            return [model toNumber];
        }];
        return [ret boolValue];
    }
    return YES;
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField {
    if (self.onSubmitEditing) {
        self.onSubmitEditing(textField.text, self);
        return YES;
    } else {
        return NO;
    }
}

@end
