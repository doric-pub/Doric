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

#import "DoricInputNode.h"
#import "DoricUtil.h"
#import "DoricPromise.h"

typedef void (^onTextChangeBlock)(NSString *text,DoricInputNode *node);
typedef void (^onFocusChangeBlock)(BOOL focused,DoricInputNode *node);

@interface DoricInputNode()<UITextViewDelegate>
@property(nonatomic, copy) onTextChangeBlock onTextChange;
@property(nonatomic, copy) onFocusChangeBlock onFocusShange;
@property(nonatomic, strong) UILabel *placeholderLabel;

@end

@implementation DoricInputNode
- (UITextView *)build {
    UITextView *v = [[UITextView alloc] init];
    v.delegate = self;
    return v;
}

- (void)blendView:(UITextView *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([name isEqualToString:@"text"]) {
        view.text = prop;
    } else if ([name isEqualToString:@"textSize"]) {
        view.font = [UIFont systemFontOfSize:[(NSNumber *) prop floatValue]];
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
        view.textAlignment = alignment;
    } else if ([name isEqualToString:@"multiline"]) {
        BOOL mutilin = [(NSNumber *) prop boolValue];
        if (!mutilin) {
            view.textContainer.maximumNumberOfLines = 1;
        }else {
            view.textContainer.maximumNumberOfLines = 0;
        }
    } else if ([name isEqualToString:@"hintText"]) {
        self.placeholderLabel.text = (NSString *)prop;
    } else if ([name isEqualToString:@"hintTextColor"]) {
        self.placeholderLabel.textColor = DoricColor(prop);
    } else if ([name isEqualToString:@"onTextChange"]) {
        if ([prop isKindOfClass:[NSString class]]) {
            self.onTextChange = ^(NSString *text, DoricInputNode *node) {
                [node callJSResponse:prop,text,nil];
            };
        }else {
            self.onTextChange = nil;
        }
    } else if ([name isEqualToString:@"onFocusChange"]) {
        if ([prop isKindOfClass:[NSString class]]) {
            self.onFocusShange = ^(BOOL focused, DoricInputNode *node) {
                [node callJSResponse:prop,@(focused),nil];
            };
        }else {
            self.onFocusShange = nil;
        }

    } else{
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (void)blend:(NSDictionary *)props {
    [super blend:props];
    [self updatePlaceholderLabel];
    [self.view.superview setNeedsLayout];
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

- (void)requestFocus {
    [self.view becomeFirstResponder];
}

- (void)releaseFocus {
    [self.view resignFirstResponder];
}

#pragma mark - UITextViewDelegate
- (BOOL)textViewShouldBeginEditing:(UITextView *)textView {
    if (self.onFocusShange) {
        self.onFocusShange(YES, self);
    }
    return YES;
}
- (BOOL)textViewShouldEndEditing:(UITextView *)textView {
    if (self.onFocusShange) {
        self.onFocusShange(NO, self);
    }
    return YES;
}

- (void)textViewDidChange:(UITextView *)textView {
    if (self.onTextChange) {
        self.onTextChange(textView.text, self);
    }
    [self updatePlaceholderLabel];
}

#pragma mark - placeholderLabel
- (UILabel *)placeholderLabel {
    if (!_placeholderLabel) {
        _placeholderLabel = [[UILabel alloc] init];
        _placeholderLabel.numberOfLines = 0;
        _placeholderLabel.userInteractionEnabled = NO;
    }
    return _placeholderLabel;
}

- (void)updatePlaceholderLabel {
    if (self.view.text.length) {
        [self.placeholderLabel removeFromSuperview];
        return;
    } else {
        [self.view insertSubview:self.placeholderLabel atIndex:0];
    }
  
    self.placeholderLabel.textAlignment = self.view.textAlignment;
    CGFloat lineFragmentPadding = self.view.textContainer.lineFragmentPadding;
    UIEdgeInsets textContainerInset = self.view.textContainerInset;

    CGFloat x = lineFragmentPadding + textContainerInset.left;
    CGFloat y = textContainerInset.top;
    CGFloat width = CGRectGetWidth(self.view.bounds) - x - lineFragmentPadding - textContainerInset.right;
    CGFloat height = [self.placeholderLabel sizeThatFits:CGSizeMake(width, 0)].height;
    self.placeholderLabel.frame = CGRectMake(x, y, width, height);
}
@end
