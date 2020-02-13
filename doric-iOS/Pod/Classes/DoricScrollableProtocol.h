//
// Created by pengfei.zhou on 2020/2/13.
//

#import <Foundation/Foundation.h>
#import "DoricScrollableProtocol.h"

@protocol DoricScrollableProtocol <NSObject>
@property(nonatomic, strong, nullable) void (^didScrollListener)(UIScrollView *__nonnull scrollView);
@end
