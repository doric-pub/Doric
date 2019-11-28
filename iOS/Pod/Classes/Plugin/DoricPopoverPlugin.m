//
// Created by pengfei.zhou on 2019/11/28.
//

#import "DoricPopoverPlugin.h"
#import "DoricRootNode.h"
#import "Doric.h"

@interface DoricPopoverPlugin ()
@property(nonatomic, strong) DoricViewNode *popoverNode;
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
                UITapGestureRecognizer *gestureRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(dismissPopover)];
                [it addGestureRecognizer:gestureRecognizer];
            }];
        }
        [superView bringSubviewToFront:self.fullScreenView];
        if (self.popoverNode) {
            [self dismissPopover];
        }
        self.fullScreenView.hidden = NO;
        NSString *viewId = params[@"id"];
        NSString *type = params[@"type"];
        self.popoverNode = [[DoricViewNode create:self.doricContext withType:type] also:^(DoricViewNode *it) {
            it.viewId = viewId;
            [it initWithSuperNode:nil];
            it.view.layoutConfig = [DoricLayoutConfig new];
            [it blend:params[@"props"]];
            [self.fullScreenView addSubview:it.view];
            [self.doricContext.headNodes addObject:it];
        }];
        [promise resolve:nil];
    });
}

- (void)dismiss:(NSDictionary *)params withPromise:(DoricPromise *)promise {
    dispatch_async(dispatch_get_main_queue(), ^{
        [self dismissPopover];
        [promise resolve:nil];
    });
}

- (void)dismissPopover {
    [self.doricContext.headNodes removeObject:self.popoverNode];
    self.popoverNode.view.hidden = YES;
    self.fullScreenView.hidden = YES;
    [self.popoverNode.view.subviews forEach:^(__kindof UIView *obj) {
        [obj removeFromSuperview];
    }];
    self.popoverNode = nil;
}
@end
