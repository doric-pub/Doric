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
#import <JavaScriptCore/JavaScriptCore.h>
#import <JSValue+Doric.h>
#import <DoricPromise.h>

#if DORIC_USE_YYWEBIMAGE

#import <YYWebImage/YYWebImage.h>
#import <YYWebImage/_YYWebImageSetter.h>

@interface DoricImageView : YYAnimatedImageView
@end

@implementation DoricImageView
- (void)displayLayer:(CALayer *)layer {
    if (@available(iOS 14.0, *)) {
        if ([self.image isKindOfClass:YYImage.class]
                && ((YYImage *) self.image).animatedImageData) {
            [super displayLayer:layer];
        } else {
            layer.contents = (__bridge id) self.image.CGImage;
        }
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
@property(nonatomic, copy) NSString *animationEndCallbackId;
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
@property(nonatomic, strong) NSDictionary *props;
@property(nonatomic, assign) NSInteger scaleType;

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
    self.props = props;
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
            UIGraphicsImageRenderer *render = [[UIGraphicsImageRenderer alloc] initWithSize:rect.size format:format];
            UIImage *image = [render imageWithActions:^(UIGraphicsImageRendererContext *_Nonnull rendererContext) {
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
            UIGraphicsImageRenderer *render = [[UIGraphicsImageRenderer alloc] initWithSize:rect.size format:format];
            UIImage *image = [render imageWithActions:^(UIGraphicsImageRendererContext *_Nonnull rendererContext) {
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
    if ([@"image" isEqualToString:name]) {
        DoricAsyncResult <NSData *> *asyncResult = [[self.doricContext.driver.registry.loaderManager
                load:prop
         withContext:self.doricContext] fetch];
        [asyncResult setResultCallback:^(NSData *imageData) {
            [self.doricContext dispatchToMainQueue:^{
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
                if (self.needReload) {
                    [self.superNode subNodeContentChanged:self];
                }
                if (self.loadCallbackId.length > 0) {
                    if (image) {
                        [self callJSResponse:self.loadCallbackId,
                                             @{
                                                     @"width": @(image.size.width),
                                                     @"height": @(image.size.height),
#if DORIC_USE_YYWEBIMAGE
                                                @"animated": (image.animatedImageData != nil) ? @(YES) : @(NO),
#elif DORIC_USE_SDWEBIMAGE
                                                @"animated": ([image isKindOfClass:SDAnimatedImage.class]
                                                && ((SDAnimatedImage *) image).animatedImageFrameCount > 0)
                                                ? @(YES)
                                                : @(NO),
#else
                                                @"animated": @(NO),
#endif
                                        },
                                        nil];
                    } else {
                        [self callJSResponse:self.loadCallbackId, nil];
                    }
                }
                [self afterBlended:self.props];
            }];
        }];
        [asyncResult setExceptionCallback:^(NSException *e) {
            DoricLog(@"Cannot load resource %@, %@", prop, e.reason);
        }];
    } else if ([@"imageUrl" isEqualToString:name]) {
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
                        if ([image isKindOfClass:YYImage.class] && ((YYImage *) image).animatedImageData != nil) {
                            image = [YYImage imageWithData:((YYImage *) image).animatedImageData scale:self.imageScale];
                        } else {
                            image = [YYImage imageWithCGImage:image.CGImage scale:self.imageScale orientation:image.imageOrientation];
                        }
                        self.view.image = image;
                    }
                    if (self.loadCallbackId.length > 0) {
                        [self callJSResponse:self.loadCallbackId,
                                             @{
                                                     @"width": @(image.size.width),
                                                     @"height": @(image.size.height),
                                                     @"animated": ([image isKindOfClass:YYImage.class]
                                                     && ((YYImage *) image).animatedImageData != nil)
                                                     ? @(YES)
                                                     : @(NO),
                                             },
                                        nil];
                    }
                    if (async && self.needReload) {
                        [self.superNode subNodeContentChanged:self];
                    }
                    [self afterBlended:self.props];
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
                                                        @{
                                                                @"width": @(image.size.width),
                                                                @"height": @(image.size.height),
                                                                @"animated": ([image isKindOfClass:SDAnimatedImage.class]
                                                                && ((SDAnimatedImage *) image).animatedImageFrameCount > 0)
                                                                ? @(YES)
                                                                : @(NO),
                                                        },
                                                   nil];
                               }
                               if (async && self.needReload) {
                                   [self.superNode subNodeContentChanged:self];
                               }
                           }
            [self afterBlended:self.props];
        }];
#else
        DoricLog(@"Do not support load image url");
#endif
        async = YES;
    } else if ([@"scaleType" isEqualToString:name]) {
        self.scaleType = [prop integerValue];
        switch (self.scaleType) {
            case 1: {
                self.view.contentMode = UIViewContentModeScaleAspectFit;
                break;
            }
            case 2: {
                self.view.contentMode = UIViewContentModeScaleAspectFill;
                break;
            }
            case 3: { // image tile
                self.view.contentMode = UIViewContentModeScaleToFill;
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
        if (self.loadCallbackId.length > 0) {
            if (image) {
                [self callJSResponse:self.loadCallbackId,
                                     @{
                                             @"width": @(image.size.width),
                                             @"height": @(image.size.height),
#if DORIC_USE_YYWEBIMAGE
                                        @"animated": (image.animatedImageData != nil) ? @(YES) : @(NO),
#elif DORIC_USE_SDWEBIMAGE
                                        @"animated": ([image isKindOfClass:SDAnimatedImage.class]
                                        && ((SDAnimatedImage *) image).animatedImageFrameCount > 0)
                                        ? @(YES)
                                        : @(NO),
#else
                                        @"animated": @(NO),
#endif
                                },
                                nil];
            } else {
                [self callJSResponse:self.loadCallbackId, nil];
            }
        }
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
                                     @{
                                             @"width": @(image.size.width),
                                             @"height": @(image.size.height),
#if DORIC_USE_YYWEBIMAGE
                                        @"animated": ([image isKindOfClass:YYImage.class]
                                        && ((YYImage *) image).animatedImageData != nil)
                                        ? @(YES)
                                        : @(NO),
#elif DORIC_USE_SDWEBIMAGE
                                        @"animated": ([image isKindOfClass:SDAnimatedImage.class]
                                        && ((SDAnimatedImage *) image).animatedImageFrameCount > 0)
                                        ? @(YES)
                                        : @(NO),
#else
                                        @"animated": @(NO),
#endif
                                },
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
                                     @{
                                             @"width": @(image.size.width),
                                             @"height": @(image.size.height),
#if DORIC_USE_YYWEBIMAGE
                                        @"animated": ([image isKindOfClass:YYImage.class]
                                        && ((YYImage *) image).animatedImageData != nil)
                                        ? @(YES)
                                        : @(NO),
#elif DORIC_USE_SDWEBIMAGE
                                        @"animated": ([image isKindOfClass:SDAnimatedImage.class]
                                        && ((SDAnimatedImage *) image).animatedImageFrameCount > 0)
                                        ? @(YES)
                                        : @(NO),
#else
                                        @"animated": @(NO),
#endif
                                },
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
                                     @{
                                             @"width": @(image.size.width),
                                             @"height": @(image.size.height),
#if DORIC_USE_YYWEBIMAGE
                                        @"animated": @([image isKindOfClass:YYImage.class] && ((YYImage *) image).animatedImageData != nil),
#elif DORIC_USE_SDWEBIMAGE
                                        @"animated": ([image isKindOfClass:SDAnimatedImage.class]
                                        && ((SDAnimatedImage *) image).animatedImageFrameCount > 0)
                                        ? @(YES)
                                        : @(NO),
#else
                                        @"animated": @(NO),
#endif

                                },
                                nil];
            } else {
                [self callJSResponse:self.loadCallbackId, nil];
            }
        }
    } else if ([@"stretchInset" isEqualToString:name]) {
        self.stretchInsetDic = (NSDictionary *) prop;
    } else if ([@"imageScale" isEqualToString:name]) {
        //Do not need set
    } else if ([@"onAnimationEnd" isEqualToString:name]) {
        if (self.animationEndCallbackId) {
#if DORIC_USE_YYWEBIMAGE
            [(DoricImageView *) self.view removeObserver:self forKeyPath:@"currentIsPlayingAnimation" context:nil];
#elif DORIC_USE_SDWEBIMAGE
            [(DoricImageView *) self.view removeObserver:self forKeyPath:@"currentFrameIndex" context:nil];
#endif
        }
        self.animationEndCallbackId = prop;
        DoricImageView *doricImageView = (DoricImageView *) view;
#if DORIC_USE_YYWEBIMAGE
        [doricImageView addObserver:self
                         forKeyPath:@"currentIsPlayingAnimation"
                            options:NSKeyValueObservingOptionOld
                            context:nil];
#elif DORIC_USE_SDWEBIMAGE
        [doricImageView addObserver:self
                         forKeyPath:@"currentFrameIndex"
                            options:NSKeyValueObservingOptionNew
                            context:nil];
#endif
    } else if ([@"imagePixels" isEqualToString:name]) {
        NSDictionary *imagePixels = prop;
        NSUInteger width = [imagePixels[@"width"] unsignedIntValue];
        NSUInteger height = [imagePixels[@"height"] unsignedIntValue];
        NSData *pixels = imagePixels[@"pixels"];
        CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
        CGContextRef context = CGBitmapContextCreate((void *) pixels.bytes,
                width,
                height,
                8,
                width * 4,
                colorSpace,
                kCGImageAlphaPremultipliedLast);
        CGImageRef imageRef = CGBitmapContextCreateImage(context);
        UIImage *image = [[UIImage alloc] initWithCGImage:imageRef scale:UIScreen.mainScreen.scale orientation:UIImageOrientationUp];
        CGImageRelease(imageRef);
        CGContextRelease(context);
        CGColorSpaceRelease(colorSpace);
        view.image = image;
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary<NSKeyValueChangeKey, id> *)change context:(void *)context {
    DoricImageView *doricImageView = (DoricImageView *) self.view;
#if DORIC_USE_YYWEBIMAGE
    if ([keyPath isEqualToString:@"currentIsPlayingAnimation"]) {
        if (!self.animationEndCallbackId) {
            return;
        }
        if (!doricImageView.currentIsPlayingAnimation
                && [change[@"old"] boolValue]) {
            [self callJSResponse:self.animationEndCallbackId, nil];
        }
    }
#elif DORIC_USE_SDWEBIMAGE
    if ([keyPath isEqualToString:@"currentFrameIndex"]) {
        if (!self.animationEndCallbackId) {
            return;
        }
        SDAnimatedImagePlayer *player = doricImageView.player;
        if (player.totalLoopCount > 0
                && player.currentLoopCount == player.totalLoopCount - 1
                && player.currentFrameIndex == player.totalFrameCount - 1
                ) {
            [self callJSResponse:self.animationEndCallbackId, nil];
        }
    }
#endif
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
    if (CGSizeEqualToSize(self.view.image.size, CGSizeZero)) {
        return;
    }
    if (self.scaleType == 3) {  // image tile
        UIImage *result = [self.view.image resizableImageWithCapInsets:UIEdgeInsetsZero resizingMode:UIImageResizingModeTile];
        self.view.image = result;
    } else if (self.stretchInsetDic != nil) {
        CGFloat left = [self.stretchInsetDic[@"left"] floatValue];
        CGFloat top = [self.stretchInsetDic[@"top"] floatValue];
        CGFloat right = [self.stretchInsetDic[@"right"] floatValue];
        CGFloat bottom = [self.stretchInsetDic[@"bottom"] floatValue];
        CGFloat scale = self.imageScale;
        UIImage *result = [self.view.image resizableImageWithCapInsets:UIEdgeInsetsMake(top / scale, left / scale, bottom / scale, right / scale) resizingMode:UIImageResizingModeStretch];
        self.view.image = result;
    }
}

- (NSNumber *)isAnimating {
    if (self.view.animating) {
        return @(YES);
    } else {
        return @(NO);
    }
}

- (void)startAnimating {
#if DORIC_USE_YYWEBIMAGE
    [(DoricImageView *) self.view setCurrentAnimatedImageIndex:0];
#endif
    [self.view startAnimating];
}

- (void)stopAnimating {
    [self.view stopAnimating];
}

- (void)reset {
    [super reset];
    self.view.image = nil;
    self.loadCallbackId = nil;
    self.placeHolderColor = nil;
    self.placeHolderImage = nil;
    self.placeHolderImageBase64 = nil;
    self.errorColor = nil;
    self.errorImage = nil;
    self.errorImageBase64 = nil;
    self.imageScale = UIScreen.mainScreen.scale;
    self.blurEffectView = nil;
    self.view.contentMode = UIViewContentModeScaleAspectFill;
    if (self.animationEndCallbackId) {
#if DORIC_USE_YYWEBIMAGE
        [(DoricImageView *) self.view removeObserver:self forKeyPath:@"currentIsPlayingAnimation" context:nil];
#elif DORIC_USE_SDWEBIMAGE
        [(DoricImageView *) self.view removeObserver:self forKeyPath:@"currentFrameIndex" context:nil];
#endif
        self.animationEndCallbackId = nil;
    }
}

- (BOOL)needReload {
    if (self.view.doricLayout.widthSpec == DoricLayoutFit
            || self.view.doricLayout.heightSpec == DoricLayoutFit) {
        CGSize size = [self.view sizeThatFits:self.view.bounds.size];
        if (!CGSizeEqualToSize(size, self.view.bounds.size)) {
            return YES;
        }
    }
    return NO;
}

- (NSDictionary *)getImageInfo {
    CGImageRef imageRef = [self.view.image CGImage];
    return @{
            @"width": @(CGImageGetWidth(imageRef)),
            @"height": @(CGImageGetHeight(imageRef)),
    };
}

- (NSData *)getImagePixels {
    if (!self.view.image) {
        return nil;
    }
    CGImageRef imageRef = [self.view.image CGImage];
    CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
    size_t width = CGImageGetWidth(imageRef);
    size_t height = CGImageGetHeight(imageRef);
    size_t bytesPerPixel = 4;
    size_t bytesPerRow = bytesPerPixel * width;

    unsigned char *imageData = malloc(width * height * bytesPerPixel);
    CGContextRef contextRef = CGBitmapContextCreate(
            imageData,
            width,
            height,
            8,
            bytesPerRow,
            colorSpace,
            kCGImageAlphaPremultipliedLast);
    CGContextDrawImage(contextRef, CGRectMake(0, 0, width, height), imageRef);
    CGColorSpaceRelease(colorSpace);
    CGContextRelease(contextRef);
    return [[NSData alloc] initWithBytesNoCopy:imageData length:width * height * bytesPerPixel freeWhenDone:YES];
}

- (void)setImagePixels:(NSDictionary *)imagePixels withPromise:(DoricPromise *)promise {
    NSUInteger width = [imagePixels[@"width"] unsignedIntValue];
    NSUInteger height = [imagePixels[@"height"] unsignedIntValue];
    NSData *pixels = imagePixels[@"pixels"];
    CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
    CGContextRef context = CGBitmapContextCreate((void *) pixels.bytes,
            width,
            height,
            8,
            width * 4,
            colorSpace,
            kCGImageAlphaPremultipliedLast);
    CGImageRef imageRef = CGBitmapContextCreateImage(context);
    UIImage *image = [[UIImage alloc] initWithCGImage:imageRef scale:UIScreen.mainScreen.scale orientation:UIImageOrientationUp];
    CGImageRelease(imageRef);
    CGContextRelease(context);
    CGColorSpaceRelease(colorSpace);
    self.view.image = image;
    [promise resolve:nil];
}

- (void)dealloc {
    if (self.animationEndCallbackId) {
#if DORIC_USE_YYWEBIMAGE
        [(DoricImageView *) self.view removeObserver:self forKeyPath:@"currentIsPlayingAnimation" context:nil];
#elif DORIC_USE_SDWEBIMAGE
        [(DoricImageView *) self.view removeObserver:self forKeyPath:@"currentFrameIndex" context:nil];
#endif
    }
}

@end
