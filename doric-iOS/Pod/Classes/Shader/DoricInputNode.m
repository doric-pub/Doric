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

@implementation DoricInputView

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

- (void)layoutSubviews {
    [super layoutSubviews];
    self.placeholderLabel.hidden = self.text.length > 0;
    if (self.placeholderLabel.hidden) {
        return;
    }
    CGFloat lineFragmentPadding = self.textContainer.lineFragmentPadding;
    UIEdgeInsets textContainerInset = self.textContainerInset;
    self.placeholderLabel.x = lineFragmentPadding + textContainerInset.left;
    self.placeholderLabel.y = textContainerInset.top;
    
    float desiredWidth = self.width - lineFragmentPadding * 2 - textContainerInset.left - textContainerInset.right;
    CGSize fitSize = [self.placeholderLabel sizeThatFits:CGSizeMake(desiredWidth, 0)];
    
    if (fitSize.width < desiredWidth) {
        self.placeholderLabel.width = desiredWidth;
    }
    self.placeholderLabel.height = fitSize.height;
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

@end

@interface DoricInputNode () <UITextViewDelegate>
@property(nonatomic, copy) onTextChangeBlock onTextChange;
@property(nonatomic, copy) onFocusChangeBlock onFocusChange;
@property(nonatomic, copy) onSubmitEditingBlock onSubmitEditing;
@property(nonatomic, strong) NSNumber *maxLength;
@property(nonatomic, copy) NSString *beforeTextChangeFuncId;
@end

@implementation DoricInputNode
- (DoricInputView *)build {
    DoricInputView *v = [[DoricInputView alloc] init];
    v.delegate = self;
    v.textContainer.lineFragmentPadding = 0;
    v.doricLayout.paddingTop = v.textContainerInset.top;
    v.doricLayout.paddingBottom = v.textContainerInset.bottom;
    v.doricLayout.paddingLeft = v.textContainerInset.left;
    v.doricLayout.paddingRight = v.textContainerInset.right;
    return v;
}

- (void)blendView:(DoricInputView *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([name isEqualToString:@"text"]) {
        view.text = prop;
    } else if ([name isEqualToString:@"textSize"]) {
        view.font = [UIFont systemFontOfSize:[(NSNumber *) prop floatValue]];
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
        view.placeholderLabel.textAlignment = alignment;
    } else if ([name isEqualToString:@"multiline"]) {
        BOOL value = [(NSNumber *) prop boolValue];
        if (!value) {
            view.textContainer.maximumNumberOfLines = 1;
            if (view.text.length > 0) {
                view.text = [view.text stringByReplacingOccurrencesOfString:@"\n" withString:@" "];
            }
        } else {
            view.textContainer.maximumNumberOfLines = 0;
        }
    } else if ([name isEqualToString:@"beforeTextChange"]) {
        self.beforeTextChangeFuncId = prop;
    } else if ([name isEqualToString:@"hintText"]) {
        view.placeholderLabel.text = (NSString *) prop;
    } else if ([name isEqualToString:@"hintTextColor"]) {
        view.placeholderLabel.textColor = DoricColor(prop);
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
        if (view.textContainer.maximumNumberOfLines == 1) {
            return;
        }
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
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (void)blend:(NSDictionary *)props {
    [super blend:props];
}

- (void)afterBlended:(NSDictionary *)props {
    [super afterBlended:props];
    if (self.view.doricLayout.paddingTop != self.view.textContainerInset.top
            || self.view.doricLayout.paddingLeft != self.view.textContainerInset.left
            || self.view.doricLayout.paddingBottom != self.view.textContainerInset.bottom
            || self.view.doricLayout.paddingRight != self.view.textContainerInset.right) {
        self.view.textContainerInset = UIEdgeInsetsMake(self.view.doricLayout.paddingTop, self.view.doricLayout.paddingLeft, self.view.doricLayout.paddingBottom, self.view.doricLayout.paddingRight);
    }
    self.view.placeholderLabel.font = self.view.font;
    self.view.placeholderLabel.numberOfLines = self.view.textContainer.maximumNumberOfLines;
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
    NSString *start = params[@"start"];
    NSString *end = params[@"end"];

    if (([start isKindOfClass:[NSString class]] || [start isKindOfClass:[NSNumber class]]) &&
            ([start isKindOfClass:[NSString class]] || [start isKindOfClass:[NSNumber class]])) {
        self.view.selectedRange = NSMakeRange(start.intValue, end.intValue - start.intValue);
    }

    [promise resolve:nil];
}

- (NSDictionary *)getSelection {
    return @{
            @"start": @([self.view offsetFromPosition:self.view.beginningOfDocument toPosition:self.view.selectedTextRange.start]),
            @"end": @([self.view offsetFromPosition:self.view.beginningOfDocument toPosition:self.view.selectedTextRange.end]),
    };
}

- (void)requestFocus {
    [self.view becomeFirstResponder];
}

- (void)releaseFocus {
    [self.view resignFirstResponder];
}

#pragma mark - UITextViewDelegate

- (BOOL)textViewShouldBeginEditing:(UITextView *)textView {
    if (self.onFocusChange) {
        self.onFocusChange(YES, self);
    }
    return YES;
}

- (BOOL)textViewShouldEndEditing:(UITextView *)textView {
    if (self.onFocusChange) {
        self.onFocusChange(NO, self);
    }
    return YES;
}

- (BOOL)textView:(UITextView *)textView shouldChangeTextInRange:(NSRange)range replacementText:(NSString *)text {
    if ([text isEqualToString:@"\n"]) {
        if (textView.textContainer.maximumNumberOfLines == 1) {
            if (self.onSubmitEditing) {
                self.onSubmitEditing(textView.text, self);
            }
            return NO;
        }
    }

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
        self.view.placeholderLabel.hidden = YES;
    } else {
        self.view.placeholderLabel.hidden = NO;
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
@end
