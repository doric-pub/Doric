//
// Created by pengfei.zhou on 2020/2/13.
//

#import <Foundation/Foundation.h>

@protocol DoricScrollViewDelegate <NSObject>
- (void)scrollViewDidScroll:(UIScrollView *)scrollView;
@end