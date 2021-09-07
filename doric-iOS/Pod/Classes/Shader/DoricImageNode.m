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
#import "DoricExtensions.h"
#import "DoricUtil.h"
#import "DoricSuperNode.h"
#import "DoricThirdParty.h"

#if DORIC_USE_YYWEBIMAGE

#import <YYWebImage/YYWebImage.h>
#import <YYWebImage/_YYWebImageSetter.h>

@interface DoricImageView : YYAnimatedImageView
@end

@implementation DoricImageView
- (void)displayLayer:(CALayer *)layer {
    if (@available(iOS 14.0, *)) {
        if (self.isAnimating) {
            [super displayLayer:layer];
        } else {
            layer.contents = (__bridge id) self.image.CGImage;
        };
    } else {
        [super displayLayer:layer];
    }
}
@end

#elif DORIC_USE_SDWEBIMAGE

#import <SDWebImage/SDWebImage.h>

@interface DoricImageView : SDAnimatedImageView
@end

@implementation DoricImageView
@end

#else
@interface DoricImageView : UIImageView
@end

@implementation DoricImageView
@end

#endif


@interface DoricImageNode ()
@property(nonatomic, copy) NSString *loadCallbackId;
@property(nonatomic, assign) UIViewContentMode contentMode;
@property(nonatomic, strong) NSNumber *placeHolderColor;
@property(nonatomic, strong) NSString *placeHolderImage;
@property(nonatomic, strong) NSString *placeHolderImageBase64;
@property(nonatomic, strong) NSNumber *errorColor;
@property(nonatomic, strong) NSString *errorImage;
@property(nonatomic, strong) NSString *errorImageBase64;
@property(nonatomic, strong) UIVisualEffectView *blurEffectView;
@property(nonatomic, strong) NSDictionary *stretchInsetDic;
@property(nonatomic, assign) CGFloat imageScale;
@end

@implementation DoricImageNode

- (UIImageView *)build {
    self.imageScale = UIScreen.mainScreen.scale;
    return [[DoricImageView new] also:^(UIImageView *it) {
        it.clipsToBounds = YES;
        it.contentMode = UIViewContentModeScaleAspectFill;
    }];
}

- (void)blend:(NSDictionary *)props {
    [props[@"placeHolderColor"] also:^(id it) {
        self.placeHolderColor = it;
    }];
    [props[@"placeHolderImage"] also:^(id it) {
        self.placeHolderImage = it;
    }];
    [props[@"placeHolderImageBase64"] also:^(id it) {
        self.placeHolderImageBase64 = it;
    }];
    [props[@"errorColor"] also:^(id it) {
        self.errorColor = it;
    }];
    [props[@"errorImage"] also:^(id it) {
        self.errorImage = it;
    }];
    [props[@"errorImageBase64"] also:^(id it) {
        self.errorImageBase64 = it;
    }];
    [props[@"imageScale"] also:^(NSNumber *it) {
        self.imageScale = it.floatValue;
    }];
    [props[@"loadCallback"] also:^(NSString *it) {
        self.loadCallbackId = it;
    }];
    [super blend:props];
}

- (UIImage *)currentPlaceHolderImage {
    if (self.placeHolderImage) {
        return [UIImage imageNamed:self.placeHolderImage];
    }

    if (self.placeHolderImageBase64) {
        NSString *base64 = self.placeHolderImageBase64;
        if (YES == [base64 hasPrefix:@"data:image"]) {
            base64 = [base64 componentsSeparatedByString:@","].lastObject;
        }
        NSData *imageData = [[NSData alloc] initWithBase64EncodedString:base64
                                                                options:NSDataBase64DecodingIgnoreUnknownCharacters];
#if DORIC_USE_YYWEBIMAGE
        YYImage *image = [YYImage imageWithData:imageData scale:self.imageScale];
#elif DORIC_USE_SDWEBIMAGE
        UIImage *image = [SDAnimatedImage imageWithData:imageData scale:self.imageScale];
        if (!image) {
            image = [UIImage imageWithData:imageData scale:self.imageScale];
        }
#else
        UIImage *image = [UIImage imageWithData:imageData scale:self.imageScale];
#endif
        return image;
    }

    if (self.placeHolderColor) {
        UIColor *color = DoricColor(self.placeHolderColor);
        CGRect rect = CGRectMake(0, 0, 1, 1);
        self.view.contentMode = UIViewContentModeScaleToFill;
        
        if (@available(iOS 10.0, *)) {
            UIGraphicsImageRendererFormat *format = [[UIGraphicsImageRendererFormat alloc] init];
            format.scale = [UIScreen mainScreen].scale;
            UIGraphicsImageRenderer *render = [[UIGraphicsImageRenderer alloc]initWithSize:rect.size format:format];
            UIImage *image = [render imageWithActions:^(UIGraphicsImageRendererContext * _Nonnull rendererContext) {
                CGContextRef context = rendererContext.CGContext;
                
                CGContextSetFillColorWithColor(context, color.CGColor);
                CGContextFillRect(context, rect);
            }];
            return image;
        } else {
            UIGraphicsBeginImageContextWithOptions(rect.size, NO, [UIScreen mainScreen].scale);

            CGContextRef context = UIGraphicsGetCurrentContext();
            CGContextSetFillColorWithColor(context, color.CGColor);
            CGContextFillRect(context, rect);

            UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
            UIGraphicsEndImageContext();
            return image;
        }
    }
    return self.doricContext.driver.registry.defaultPlaceHolderImage;
}

- (UIImage *)currentErrorImage {
    if (self.errorImage) {
        return [UIImage imageNamed:self.errorImage];
    }

    if (self.errorImageBase64) {
        NSString *base64 = self.errorImageBase64;
        if (YES == [base64 hasPrefix:@"data:image"]) {
            base64 = [base64 componentsSeparatedByString:@","].lastObject;
        }
        NSData *imageData = [[NSData alloc] initWithBase64EncodedString:base64
                                                                options:NSDataBase64DecodingIgnoreUnknownCharacters];
#if DORIC_USE_YYWEBIMAGE
        YYImage *image = [YYImage imageWithData:imageData scale:self.imageScale];
#elif DORIC_USE_SDWEBIMAGE
        UIImage *image = [SDAnimatedImage imageWithData:imageData scale:self.imageScale];
        if (!image) {
            image = [UIImage imageWithData:imageData scale:self.imageScale];
        }
#else
        UIImage *image = [UIImage imageWithData:imageData scale:self.imageScale];
#endif
        return image;
    }

    if (self.errorColor) {
        UIColor *color = DoricColor(self.errorColor);
        CGRect rect = CGRectMake(0, 0, 1, 1);
        self.view.contentMode = UIViewContentModeScaleToFill;
        
        if (@available(iOS 10.0, *)) {
            UIGraphicsImageRendererFormat *format = [[UIGraphicsImageRendererFormat alloc] init];
            format.scale = [UIScreen mainScreen].scale;
            UIGraphicsImageRenderer *render = [[UIGraphicsImageRenderer alloc]initWithSize:rect.size format:format];
            UIImage *image = [render imageWithActions:^(UIGraphicsImageRendererContext * _Nonnull rendererContext) {
                CGContextRef context = rendererContext.CGContext;
                
                CGContextSetFillColorWithColor(context, color.CGColor);
                CGContextFillRect(context, rect);
            }];
            return image;
        } else {
            UIGraphicsBeginImageContextWithOptions(rect.size, NO, [UIScreen mainScreen].scale);

            CGContextRef context = UIGraphicsGetCurrentContext();
            CGContextSetFillColorWithColor(context, color.CGColor);
            CGContextFillRect(context, rect);

            UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
            UIGraphicsEndImageContext();
            return image;
        }
    }
    return self.doricContext.driver.registry.defaultErrorImage;
}

- (void)blendView:(UIImageView *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([@"imageUrl" isEqualToString:name]) {
        __weak typeof(self) _self = self;
        __block BOOL async = NO;
        view.doricLayout.undefined = YES;
#if DORIC_USE_YYWEBIMAGE
        dispatch_async([_YYWebImageSetter setterQueue], ^{
            [view yy_cancelCurrentImageRequest];
            
            [view yy_setImageWithURL:[NSURL URLWithString:prop] placeholder:[self currentPlaceHolderImage] options:0 completion:^(UIImage *image, NSURL *url, YYWebImageFromType from, YYWebImageStage stage, NSError *error) {
                __strong typeof(_self) self = _self;
                if (self.placeHolderColor || self.errorColor) {
                    self.view.contentMode = self.contentMode;
                }
                self.view.doricLayout.undefined = NO;
                if (error) {
                    [[self currentErrorImage] also:^(UIImage *it) {
                        self.view.image = it;
                    }];
                    if (self.loadCallbackId.length > 0) {
                        [self callJSResponse:self.loadCallbackId, nil];
                    }
                } else if (image && stage == YYWebImageStageFinished) {
                    if (image.scale != self.imageScale) {
                        image = [YYImage imageWithCGImage:image.CGImage scale:self.imageScale orientation:image.imageOrientation];
                        self.view.image = image;
                    }
                    if (self.loadCallbackId.length > 0) {
                        [self callJSResponse:self.loadCallbackId,
                                             @{@"width": @(image.size.width), @"height": @(image.size.height)},
                                        nil];
                    }
                    if (async) {
                        DoricSuperNode *node = self.superNode;
                        while (node.superNode != nil) {
                            node = node.superNode;
                        }
                        [node requestLayout];
                    }
                }
            }];
        });
#elif DORIC_USE_SDWEBIMAGE
        [view sd_setImageWithURL:[NSURL URLWithString:prop]
                placeholderImage:[self currentPlaceHolderImage]
                         options:0
                         context:@{SDWebImageContextImageScaleFactor: @(self.imageScale)}
                        progress:nil
                       completed:^(UIImage *image, NSError *error, SDImageCacheType cacheType, NSURL *imageURL) {
                           __strong typeof(_self) self = _self;
                           if (self.placeHolderColor || self.errorColor) {
                               self.view.contentMode = self.contentMode;
                           }
                           self.view.doricLayout.undefined = NO;
                           if (error) {
                               [[self currentErrorImage] also:^(UIImage *it) {
                                   self.view.image = it;
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
                               if (async) {
                                   DoricSuperNode *node = self.superNode;
                                   while (node.superNode != nil) {
                                       node = node.superNode;
                                   }
                                   [node requestLayout];
                               }
                           }
                       }];
#else
        DoricLog(@"Do not support load image url");
#endif
        async = YES;
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
        // Do not need set
    } else if ([@"imageBase64" isEqualToString:name]) {
        NSString *base64 = prop;
        if (YES == [base64 hasPrefix:@"data:image"]) {
            base64 = [base64 componentsSeparatedByString:@","].lastObject;
        }
        NSData *imageData = [[NSData alloc] initWithBase64EncodedString:base64
                                                                options:NSDataBase64DecodingIgnoreUnknownCharacters];
#if DORIC_USE_YYWEBIMAGE
        YYImage *image = [YYImage imageWithData:imageData scale:self.imageScale];
#elif DORIC_USE_SDWEBIMAGE
        UIImage *image = [SDAnimatedImage imageWithData:imageData scale:self.imageScale];
        if (!image) {
            image = [UIImage imageWithData:imageData scale:self.imageScale];
        }
#else
        UIImage *image = [UIImage imageWithData:imageData scale:self.imageScale];
#endif
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
    } else if ([@"imageRes" isEqualToString:name]) {
        UIImage *image = [self imageNamed:prop];
        if (image) {
            view.image = image;
        } else {
            view.image = [UIImage imageNamed:prop];
        }

        if (self.loadCallbackId.length > 0) {
            if (image) {
                [self callJSResponse:self.loadCallbackId,
                                     @{@"width": @(image.size.width), @"height": @(image.size.height)},
                                nil];
            } else {
                [self callJSResponse:self.loadCallbackId, nil];
            }
        }

    } else if ([@"imagePath" isEqualToString:name]) {
        NSString *path = [[NSBundle mainBundle] bundlePath];
        NSString *fullPath = [path stringByAppendingPathComponent:prop];
        NSData *imgData = [[NSData alloc] initWithContentsOfFile:fullPath];
        UIImage *image = [self imageFromData:imgData];
        view.image = image;
        if (self.loadCallbackId.length > 0) {
            if (image) {
                [self callJSResponse:self.loadCallbackId,
                                     @{@"width": @(image.size.width), @"height": @(image.size.height)},
                                nil];
            } else {
                [self callJSResponse:self.loadCallbackId, nil];
            }
        }
    } else if ([@"imageFilePath" isEqualToString:name]) {
        NSData *imgData = [[NSData alloc] initWithContentsOfFile:prop];
        UIImage *image = [self imageFromData:imgData];
        view.image = image;
        if (self.loadCallbackId.length > 0) {
            if (image) {
                [self callJSResponse:self.loadCallbackId,
                                     @{@"width": @(image.size.width), @"height": @(image.size.height)},
                                nil];
            } else {
                [self callJSResponse:self.loadCallbackId, nil];
            }
        }
    } else if ([@"stretchInset" isEqualToString:name]) {
        self.stretchInsetDic = (NSDictionary *) prop;
    } else if ([@"imageScale" isEqualToString:name]) {
        //Do not need set
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (UIImage *)imageNamed:(NSString *)name {
#if DORIC_USE_YYWEBIMAGE
    YYImage *image = [YYImage imageNamed:name];
#elif DORIC_USE_SDWEBIMAGE
    UIImage *image = [SDAnimatedImage imageNamed:name];
    if (!image) {
        image = [UIImage imageNamed:name];
    }
#else
    UIImage *image = [UIImage imageNamed:name];
#endif
    return image;
}

- (UIImage *)imageFromData:(NSData *)imgData {
#if DORIC_USE_YYWEBIMAGE
    YYImage *image = [YYImage imageWithData:imgData scale:self.imageScale];
#elif DORIC_USE_SDWEBIMAGE
    UIImage *image = [SDAnimatedImage imageWithData:imgData scale:self.imageScale];
    if (!image) {
        image = [UIImage imageWithData:imgData scale:self.imageScale];
    }
#else
    UIImage *image = [UIImage imageWithData:imgData scale:self.imageScale];
#endif
    return image;
}

- (void)afterBlended:(NSDictionary *)props {
    if (self.stretchInsetDic != nil) {
        CGFloat left = [self.stretchInsetDic[@"left"] floatValue];
        CGFloat top = [self.stretchInsetDic[@"top"] floatValue];
        CGFloat right = [self.stretchInsetDic[@"right"] floatValue];
        CGFloat bottom = [self.stretchInsetDic[@"bottom"] floatValue];
        CGFloat scale = self.imageScale;
        UIImage *result = [self.view.image resizableImageWithCapInsets:UIEdgeInsetsMake(top / scale, left / scale, bottom / scale, right / scale) resizingMode:UIImageResizingModeStretch];
        self.view.image = result;
    }
}
@end
