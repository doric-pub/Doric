//
// Created by pengfei.zhou on 2019/11/28.
//

#import "DoricPopoverPlugin.h"
#import "DoricRootNode.h"
#import "Doric.h"

@interface DoricPopoverPlugin ()
@property(nonatomic, strong) UIView *fullScreenView;
@end

@implementation DoricPopoverPlugin
- (void)show:(NSDictionary *)params withPromise:(DoricPromise *)promise {
    dispatch_async(dispatch_get_main_queue(), ^{
        UIView *superView = [UIApplication sharedApplication].windows.lastObject;
        if (!self.fullScreenView) {
            self.fullScreenView = [[DoricStackView new] also:^(UIView *it) {
                it.width = superView.width;
                it.height = superView.height;
                it.top = it.left = 0;
                [superView addSubview:it];
            }];
        }
        [superView bringSubviewToFront:self.fullScreenView];
        self.fullScreenView.hidden = NO;
        NSString *viewId = params[@"id"];
        NSString *type = params[@"type"];
        DoricViewNode *viewNode = [self.doricContext targetViewNode:viewId];
        if (!viewNode) {
            viewNode = [[DoricViewNode create:self.doricContext withType:type] also:^(DoricViewNode *it) {
                it.viewId = viewId;
                [it initWithSuperNode:nil];
                it.view.layoutConfig = [DoricLayoutConfig new];
                [self.fullScreenView addSubview:it.view];
                [self.doricContext.headNodes addObject:it];
            }];
        }
        [viewNode blend:params[@"props"]];
        [promise resolve:nil];
    });
}

- (void)dismiss:(NSDictionary *)params withPromise:(DoricPromise *)promise {
    NSString *viewId = params[@"id"];
    dispatch_async(dispatch_get_main_queue(), ^{
        if (viewId) {
            DoricViewNode *viewNode = [self.doricContext targetViewNode:viewId];
            [self dismissViewNode:viewNode];
        } else {
            [self dismissPopover];
        }
        [promise resolve:nil];
    });
}

- (void)dismissViewNode:(DoricViewNode *)node {
    [self.doricContext.headNodes removeObject:node];
    [node.view removeFromSuperview];
    if (self.doricContext.headNodes.count == 0) {
        self.fullScreenView.hidden = YES;
    }
}

- (void)dismissPopover {
    for (DoricViewNode *node in self.doricContext.headNodes) {
        [self dismissViewNode:node];
    }
}
@end
