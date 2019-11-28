//
// Created by pengfei.zhou on 2019/11/28.
//

#import "DoricPopoverPlugin.h"
#import "DoricRootNode.h"
#import "Doric.h"

@interface DoricPopoverPlugin ()
@property(nonatomic, strong) DoricRootNode *popoverNode;
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
                [superView addSubview:self.fullScreenView];
                UITapGestureRecognizer *gestureRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(dismissPopover)];
                [it addGestureRecognizer:gestureRecognizer];
            }];
        }
        [superView bringSubviewToFront:self.fullScreenView];
        self.fullScreenView.hidden = NO;
        if (!self.popoverNode) {
            self.popoverNode = [[DoricRootNode alloc] initWithContext:self.doricContext];
            DoricStackView *view = [[DoricStackView alloc] initWithFrame:self.fullScreenView.frame];
            [self.popoverNode setupRootView:view];
        }
        [self.popoverNode render:params[@"props"]];
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
    self.popoverNode.view.hidden = YES;
    self.fullScreenView.hidden = YES;
    [self.popoverNode.view.subviews forEach:^(__kindof UIView *obj) {
        [obj removeFromSuperview];
    }];
}
@end