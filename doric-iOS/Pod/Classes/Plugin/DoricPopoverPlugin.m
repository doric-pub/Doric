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
static NSString *TYPE = @"popover";

- (void)show:(NSDictionary *)params withPromise:(DoricPromise *)promise {
    __weak typeof(self) _self = self;
    [self.doricContext dispatchToMainQueue:^{
        __strong typeof(_self) self = _self;
        UIView *superView = self.doricContext.vc.view;
        if (!self.fullScreenView) {
            self.fullScreenView = [[UIView new] also:^(UIView *it) {
                it.width = superView.width;
                it.height = superView.height;
                it.top = it.left = 0;
                it.doricLayout.layoutType = DoricStack;
                [superView addSubview:it];
            }];
        } else {
            self.fullScreenView.doricLayout.width = superView.width;
            self.fullScreenView.doricLayout.height = superView.height;
        }
        [superView bringSubviewToFront:self.fullScreenView];
        self.fullScreenView.hidden = NO;
        NSString *viewId = [params optString:@"id"];
        NSString *type = [params optString:@"type"];
        DoricViewNode *viewNode = [self.doricContext targetViewNode:viewId];
        if (!viewNode) {
            viewNode = [[DoricViewNode create:self.doricContext withType:type] also:^(DoricViewNode *it) {
                it.viewId = viewId;
                [it initWithSuperNode:nil];
                [self.fullScreenView addSubview:it.view];

                NSMutableDictionary <NSString *, DoricViewNode *> *map = self.doricContext.headNodes[TYPE];
                if (map != nil) {
                    self.doricContext.headNodes[TYPE][viewId] = it;
                } else {
                    map = [[NSMutableDictionary alloc] init];
                    map[viewId] = it;
                    self.doricContext.headNodes[TYPE] = map;
                }
            }];
        }
        [viewNode blend:[params optObject:@"props"]];
        [self.fullScreenView.doricLayout apply];
        [promise resolve:nil];
    }];
}

- (void)dismiss:(NSDictionary *)params withPromise:(DoricPromise *)promise {
    NSString *viewId = [params optString:@"id"];
    __weak typeof(self) _self = self;
    [self.doricContext dispatchToMainQueue:^{
        __strong typeof(_self) self = _self;
        if (viewId) {
            DoricViewNode *viewNode = [self.doricContext targetViewNode:viewId];
            [self dismissViewNode:viewNode];
        } else {
            [self dismissPopover];
        }
        [promise resolve:nil];
    }];
}

- (void)dismissViewNode:(DoricViewNode *)node {
    [self.doricContext.headNodes[TYPE] removeObjectForKey:node.viewId];
    [node.view removeFromSuperview];
    if (self.doricContext.headNodes[TYPE].count == 0) {
        self.fullScreenView.hidden = YES;
    }
}

- (void)dismissPopover {
    for (DoricViewNode *node in self.doricContext.headNodes[TYPE].allValues) {
        [self dismissViewNode:node];
    }
}
@end
