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
//  DoricUtil.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/26.
//

#import "DoricUtil.h"
#import "DoricContext.h"
#import "UIView+Doric.h"

void DoricLog(NSString *_Nonnull format, ...) {
    va_list args;
    va_start(args, format);
    NSLogv([NSString stringWithFormat:@"Doric:%@", format], args);
    va_end(args);
}

void DoricSafeLog(NSString *_Nonnull message) {
    NSLog(@"%@", message);
}

UIColor *DoricColor(NSNumber *number) {
    CGFloat r, g, b, a;
    long colorValue = [number longValue];
    a = ((colorValue >> 24) & 0xff) / 255.0f;
    r = ((colorValue >> 16) & 0xff) / 255.0f;
    g = ((colorValue >> 8) & 0xff) / 255.0f;
    b = ((colorValue >> 0) & 0xff) / 255.0f;
    return [UIColor colorWithRed:r green:g blue:b alpha:a];
}

NSNumber *DoricColorToNumber(UIColor *color) {
    CGFloat r, g, b, a;
    [color getRed:&r green:&g blue:&b alpha:&a];
    return @((((long) (a * 225) & 0xff) << 24)
            | (((long) (r * 225) & 0xff) << 16)
            | (((long) (g * 225) & 0xff) << 8)
            | (((long) (b * 225) & 0xff) << 0));
}

NSBundle *DoricBundle() {
    NSBundle *bundle = [NSBundle bundleForClass:[DoricContext class]];
    NSURL *url = [bundle URLForResource:@"Doric" withExtension:@"bundle"];
    return [NSBundle bundleWithURL:url];
}


void ShowToast(NSString *text, DoricGravity gravity) {
    UIView *superView = [UIApplication sharedApplication].windows.lastObject;
    UILabel *label = [[UILabel alloc] init];
    label.font = [UIFont systemFontOfSize:20.f];
    label.text = text;
    label.textAlignment = NSTextAlignmentCenter;
    label.layer.masksToBounds = YES;
    label.backgroundColor = [UIColor grayColor];
    label.textColor = [UIColor whiteColor];
    [label sizeToFit];
    label.width += 30;
    label.height += 10;
    label.layer.cornerRadius = label.height / 2;
    label.centerX = superView.width / 2;
    if ((gravity & DoricGravityBottom) == DoricGravityBottom) {
        label.bottom = superView.height - 20;
    } else if ((gravity & DoricGravityTop) == DoricGravityTop) {
        label.top = 108;
    } else {
        label.centerY = (superView.height - 88) / 2;
    }

    [superView addSubview:label];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t) (2.0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [label removeFromSuperview];
    });
}

void ShowToastInVC(UIViewController *_Nonnull vc, NSString *_Nonnull text, DoricGravity gravity) {
    UIView *superView = vc.view;
    UILabel *label = [[UILabel alloc] init];
    label.font = [UIFont systemFontOfSize:20.f];
    label.text = text;
    label.textAlignment = NSTextAlignmentCenter;
    label.layer.masksToBounds = YES;
    label.backgroundColor = [UIColor grayColor];
    label.textColor = [UIColor whiteColor];
    [label sizeToFit];
    label.width += 30;
    label.height += 10;
    label.layer.cornerRadius = label.height / 2;
    label.centerX = superView.width / 2;
    if ((gravity & DoricGravityBottom) == DoricGravityBottom) {
        label.bottom = superView.height - 20;
    } else if ((gravity & DoricGravityTop) == DoricGravityTop) {
        label.top = 20;
    } else {
        label.centerY = (superView.height - 88) / 2;
    }

    [superView addSubview:label];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t) (2.0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [label removeFromSuperview];
    });
}

UIImage *UIImageWithColor(UIColor *color) {
    CGRect rect = CGRectMake(0.0f, 0.0f, 1.0f, 1.0f);
    UIGraphicsBeginImageContext(rect.size);
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextSetFillColorWithColor(context, [color CGColor]);
    CGContextFillRect(context, rect);
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return image;
}

BOOL hasNotch() {
    if (@available(iOS 11.0, *)) {
        CGFloat height;
        if ([[UIApplication sharedApplication] delegate].window) {
            height = [[UIApplication sharedApplication] delegate].window.safeAreaInsets.bottom;
        } else {
            height = [UIApplication sharedApplication].keyWindow.safeAreaInsets.bottom;
        }
        return (height > 0);
    } else {
        return NO;
    }
}
