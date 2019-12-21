//
// Created by pengfei.zhou on 2019/11/29.
//

#import "DoricAnimatePlugin.h"
#import "DoricRootNode.h"

@implementation DoricAnimatePlugin

- (void)submit:(NSDictionary *)args withPromise:(DoricPromise *)promise {
    [promise resolve:nil];
}

- (void)animateRender:(NSDictionary *)args withPromise:(DoricPromise *)promise {
    NSNumber *duration = args[@"duration"];
    dispatch_async(dispatch_get_main_queue(), ^{
        NSString *viewId = args[@"id"];
        [UIView animateWithDuration:[duration floatValue] / 1000
                         animations:^{
                             if (self.doricContext.rootNode.viewId == nil) {
                                 self.doricContext.rootNode.viewId = viewId;
                                 [self.doricContext.rootNode blend:args[@"props"]];
                             } else {
                                 DoricViewNode *viewNode = [self.doricContext targetViewNode:viewId];
                                 [viewNode blend:args[@"props"]];
                             }
                         }
                         completion:^(BOOL finished) {
                             [promise resolve:nil];
                         }];
    });
}
@end