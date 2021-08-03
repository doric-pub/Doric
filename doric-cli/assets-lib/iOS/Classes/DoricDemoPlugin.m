#import "DoricDemoPlugin.h"

@implementation DoricDemoPlugin
- (void)call:(NSDictionary *)dic withPromise:(DoricPromise *)promise {
    [promise resolve:@"This is from iOS"];
}
@end