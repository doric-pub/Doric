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
