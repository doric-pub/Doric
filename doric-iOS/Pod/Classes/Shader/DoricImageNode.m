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
#import "YYWebImage.h"

@interface DoricImageNode ()
@property(nonatomic, copy) NSString *loadCallbackId;
@property(nonatomic, assign) UIViewContentMode contentMode;
@property(nonatomic, strong) NSNumber *placeHolderColor;
@property(nonatomic, strong) NSString *placeHolderImage;
@property(nonatomic, strong) NSNumber *errorColor;
@property(nonatomic, strong) NSString *errorImage;
@property(nonatomic, strong) UIVisualEffectView *blurEffectView;
@end

@implementation DoricImageNode

- (UIImageView *)build {
    return [[YYAnimatedImageView new] also:^(UIImageView *it) {
        it.clipsToBounds = YES;
    }];
}

- (void)blend:(NSDictionary *)props {
    [props[@"placeHolderColor"] also:^(id it) {
        self.placeHolderColor = it;
    }];
    [props[@"placeHolderImage"] also:^(id it) {
        self.placeHolderImage = it;
    }];
    [props[@"errorColor"] also:^(id it) {
        self.errorColor = it;
    }];
    [props[@"errorImage"] also:^(id it) {
        self.errorImage = it;
    }];
    [super blend:props];
}

- (UIImage *)currentPlaceHolderImage {
    if (self.placeHolderImage) {
        return [UIImage imageNamed:self.placeHolderImage];
    }
    if (self.placeHolderColor) {
        UIColor *color = DoricColor(self.placeHolderColor);
        CGRect rect = CGRectMake(0, 0, 1, 1);
        self.view.contentMode = UIViewContentModeScaleToFill;
        UIGraphicsBeginImageContextWithOptions(rect.size, NO, [UIScreen mainScreen].scale);

        CGContextRef context = UIGraphicsGetCurrentContext();
        CGContextSetFillColorWithColor(context, color.CGColor);
        CGContextFillRect(context, rect);

        UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
        return image;
    }
    return self.doricContext.driver.registry.defaultPlaceHolderImage;
}

- (UIImage *)currentErrorImage {
    if (self.errorImage) {
        return [UIImage imageNamed:self.errorImage];
    }
    if (self.errorColor) {
        UIColor *color = DoricColor(self.errorColor);
        CGRect rect = CGRectMake(0, 0, 1, 1);
        self.view.contentMode = UIViewContentModeScaleToFill;
        UIGraphicsBeginImageContextWithOptions(rect.size, NO, [UIScreen mainScreen].scale);

        CGContextRef context = UIGraphicsGetCurrentContext();
        CGContextSetFillColorWithColor(context, color.CGColor);
        CGContextFillRect(context, rect);

        UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
        return image;
    }
    return self.doricContext.driver.registry.defaultErrorImage;
}

- (void)blendView:(UIImageView *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([@"imageUrl" isEqualToString:name]) {
        __weak typeof(self) _self = self;
        [view yy_setImageWithURL:[NSURL URLWithString:prop] placeholder:[self currentPlaceHolderImage] options:0 completion:^(UIImage *image, NSURL *url, YYWebImageFromType from, YYWebImageStage stage, NSError *error) {
            __strong typeof(_self) self = _self;
            if (self.placeHolderColor || self.errorColor) {
                self.view.contentMode = self.contentMode;
            }
            if (error) {
                [[self currentErrorImage] also:^(UIImage *it) {
                    view.image = it;
                }];
                if (self.loadCallbackId.length > 0) {
                    [self callJSResponse:self.loadCallbackId, nil];
                }
            } else {
                if (self.loadCallbackId.length > 0) {
                    [self callJSResponse:self.loadCallbackId,
                                         @{@"width": @(image.size.width), @"height": @(image.size.height)},
                                    nil];
                }
                [self requestLayout];
            }
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
        self.contentMode = self.view.contentMode;
    } else if ([@"loadCallback" isEqualToString:name]) {
        self.loadCallbackId = prop;
    } else if ([@"imageBase64" isEqualToString:name]) {
        NSString *base64 = prop;
        if (YES == [base64 hasPrefix:@"data:image"]) {
            base64 = [base64 componentsSeparatedByString:@","].lastObject;
        }
        NSData *imageData = [[NSData alloc] initWithBase64EncodedString:base64
                                                                options:NSDataBase64DecodingIgnoreUnknownCharacters];
        UIImage *image = [UIImage imageWithData:imageData];
        view.image = image;
    } else if ([@"isBlur" isEqualToString:name]) {
        NSInteger value = [prop intValue];
        if (value == 1) {
            if (!self.blurEffectView) {
                UIBlurEffect *blurEffect = [UIBlurEffect effectWithStyle:UIBlurEffectStyleLight];
                self.blurEffectView = [[UIVisualEffectView alloc] initWithEffect:blurEffect];
                [view addSubview:self.blurEffectView];
                dispatch_async(dispatch_get_main_queue(), ^{
                    self.blurEffectView.translatesAutoresizingMaskIntoConstraints = NO;
                    NSLayoutConstraint *widthConstraint = [NSLayoutConstraint
                            constraintWithItem:self.blurEffectView
                                     attribute:(NSLayoutAttributeWidth)
                                     relatedBy:(NSLayoutRelationEqual)
                                        toItem:view
                                     attribute:(NSLayoutAttributeWidth)
                                    multiplier:1
                                      constant:0];
                    NSLayoutConstraint *heightConstraint = [NSLayoutConstraint
                            constraintWithItem:self.blurEffectView
                                     attribute:(NSLayoutAttributeHeight)
                                     relatedBy:(NSLayoutRelationEqual)
                                        toItem:view
                                     attribute:(NSLayoutAttributeHeight)
                                    multiplier:1
                                      constant:0];
                    [NSLayoutConstraint activateConstraints:@[widthConstraint, heightConstraint,]];
                });
            }

        }
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}
@end
