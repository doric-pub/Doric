//
// Created by pengfei.zhou on 2021/7/20.
//

#import "DoricDevPerformanceAnchorHook.h"


@implementation DoricDevPerformanceAnchorHook
- (void)onAnchorName:(NSString *)name prepare:(NSNumber *)prepare start:(NSNumber *)start end:(NSNumber *)end in:(DoricPerformanceProfile *)profile {
    NSLog(@"[DoricPerformance] %@: %@ prepared %@ms, cost %@ms",
            profile.name,
            name,
            @(start.integerValue - prepare.integerValue),
            @(end.integerValue - start.integerValue)
    );
}
@end