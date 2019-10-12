//
//  DoricUtil.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/26.
//

#import "DoricUtil.h"
#import "DoricContext.h"

void DoricLog(NSString *_Nonnull format, ...) {
    va_list args;
    va_start(args, format);
    NSLogv([NSString stringWithFormat:@"Doric:%@", format], args);
    va_end(args);
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

NSBundle *DoricBundle() {
    NSBundle *bundle = [NSBundle bundleForClass:[DoricContext class]];
    NSURL *url = [bundle URLForResource:@"Doric" withExtension:@"bundle"];
    return [NSBundle bundleWithURL:url];
}
