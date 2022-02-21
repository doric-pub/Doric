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
// Created by jingpeng.wang on 2022/1/10.
//

#import <DoricCore/Doric.h>
#import "DoricImageDecoderPlugin.h"
#import "DoricExtensions.h"

@implementation DoricImageDecoderPlugin
- (void)getImageInfo:(NSDictionary *)resource withPromise:(DoricPromise *)promise {
    DoricResource *doricResource = [self.doricContext.driver.registry.loaderManager load:resource withContext:self.doricContext];
    if (doricResource != nil) {
        DoricAsyncResult *asyncResult = [doricResource fetch];
        [asyncResult setResultCallback:^(id _Nonnull result) {
            UIImage *image = [UIImage imageWithData:result];
            [promise resolve:@{
                    @"width": @(image.size.width),
                    @"height": @(image.size.height)
            }];
        }];
        [asyncResult setExceptionCallback:^(NSException *_Nonnull e) {
            DoricLog(@"Cannot load resource %s, %s", resource.description, e.description);
        }];
    } else {
        DoricLog(@"Cannot find loader for resource %s", resource.description);
        [promise reject:@"Load error"];
    }
}

- (void)decodeToPixels:(NSDictionary *)resource withPromise:(DoricPromise *)promise {
    DoricResource *doricResource = [self.doricContext.driver.registry.loaderManager load:resource withContext:self.doricContext];
    if (doricResource != nil) {
        DoricAsyncResult *asyncResult = [doricResource fetch];
        [asyncResult setResultCallback:^(id _Nonnull result) {
            UIImage *image = [UIImage imageWithData:result];

            CGImageRef imageRef = image.CGImage;
            NSUInteger iWidth = CGImageGetWidth(imageRef);
            NSUInteger iHeight = CGImageGetHeight(imageRef);
            NSUInteger iBytesPerPixel = 4;
            NSUInteger iBytesPerRow = iBytesPerPixel * iWidth;
            NSUInteger iBitsPerComponent = 8;
            unsigned char *imageBytes = malloc(iWidth * iHeight * iBytesPerPixel);

            CGColorSpaceRef colorspace = CGColorSpaceCreateDeviceRGB();

            CGContextRef context = CGBitmapContextCreate(imageBytes, iWidth, iHeight, iBitsPerComponent, iBytesPerRow, colorspace, kCGImageAlphaPremultipliedLast);
            CGRect rect = CGRectMake(0, 0, iWidth, iHeight);
            CGContextDrawImage(context, rect, imageRef);
            CGColorSpaceRelease(colorspace);
            CGContextRelease(context);

            NSData *data = [NSData dataWithBytesNoCopy:(void *) imageBytes length:sizeof(unsigned char) * iWidth * iHeight * iBytesPerPixel freeWhenDone:YES];
            [promise resolve:data];
        }];
        [asyncResult setExceptionCallback:^(NSException *_Nonnull e) {
            DoricLog(@"Cannot load resource %s, %s", resource.description, e.description);
        }];
    } else {
        DoricLog(@"Cannot find loader for resource %s", resource.description);
        [promise reject:@"Load error"];
    }
}
@end
