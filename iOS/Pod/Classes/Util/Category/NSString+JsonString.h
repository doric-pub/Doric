//
//  NSString+JsonString.h
//  Doric
//
//  Created by Insomnia on 2019/11/7.
//



#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface NSString (JsonString)
+ (NSString *)dc_convertToJsonWithDic:(NSDictionary *)dic;
@end

NS_ASSUME_NONNULL_END
