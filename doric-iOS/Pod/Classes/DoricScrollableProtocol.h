//
// Created by pengfei.zhou on 2020/2/13.
//

#import <Foundation/Foundation.h>
#import "DoricScrollableProtocol.h"

typedef void (^DoricDidScrollBlock)(UIScrollView *__nonnull scrollView);

@protocol DoricScrollableProtocol <NSObject>

- (void)addDidScrollBlock:(__nonnull DoricDidScrollBlock)didScrollListener;

- (void)removeDidScrollBlock:(__nonnull DoricDidScrollBlock)didScrollListener;
@end
