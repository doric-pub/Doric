//
//  WSClient.h
//  Doric
//
//  Created by pengfei.zhou on 2019/8/14.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface DoricWSClient : NSObject
- (instancetype)initWithUrl:(NSString *)url;

- (void)close;
@end

NS_ASSUME_NONNULL_END
