//
// Created by pengfei.zhou on 2019/11/25.
//

#import "DoricDefaultNavigator.h"
#import "DoricViewController.h"

@interface DoricDefaultNavigator ()
@property(nonatomic, weak) UINavigationController *navigationController;
@end

@implementation DoricDefaultNavigator
- (instancetype)initWithNavigationController:(UINavigationController *)navigationController {
    if (self = [super init]) {
        _navigationController = navigationController;
    }
    return self;
}

- (void)push:(NSString *)scheme alias:(NSString *)alias animated:(BOOL)animated {
    DoricViewController *viewController = [[DoricViewController alloc] initWithScheme:scheme alias:alias];
    [self.navigationController pushViewController:viewController animated:animated];
}

- (void)pop:(BOOL)animated {
    [self.navigationController popViewControllerAnimated:animated];
}

@end