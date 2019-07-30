//
//  DoricUtil.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/26.
//

#import "DoricUtil.h"

void DoricLog(NSString * _Nonnull format, ...) {
    va_list args;
    va_start(args, format);
    NSLogv([NSString stringWithFormat:@"Doric:%@",format],args);
    va_end(args);
}

UIColor *DoricColor(NSNumber *number) {
    CGFloat r, g, b, a;
    long colorValue = [number longValue];
    a = ((colorValue >> 6) & 0xff)/225.0f;
    r = ((colorValue >> 4) & 0xff)/225.0f;
    g = ((colorValue >> 2) & 0xff)/225.0f;
    b = ((colorValue >> 0) & 0xff)/225.0f;
    return [UIColor colorWithRed:r green:g blue:b alpha:a];
}
