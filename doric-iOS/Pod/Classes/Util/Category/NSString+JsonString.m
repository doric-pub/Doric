//
//  NSString+JsonString.m
//  Doric
//
//  Created by Insomnia on 2019/11/7.
//

#import "NSString+JsonString.h"
#import "DoricUtil.h"

@implementation NSString (JsonString)
+ (NSString *)dc_convertToJsonWithDic:(id)obj {
    NSError *err;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:obj options:NSJSONWritingPrettyPrinted error:&err];
    NSString *jsonStr = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];

    if (err) {
        DoricLog(NSStringFromSelector(_cmd), @"Convert dictionary to json string failed.");
        return nil;
    }
    return jsonStr;
}
@end
