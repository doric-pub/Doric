//
// Created by pengfei.zhou on 2019/11/25.
//

#import <Foundation/Foundation.h>
#import "DoricNavigatorProtocol.h"

@interface DoricDefaultNavigator : NSObject <DoricNavigatorProtocol>
- (instancetype)initWithNavigationController:(UINavigationController *)navigationController;
@end