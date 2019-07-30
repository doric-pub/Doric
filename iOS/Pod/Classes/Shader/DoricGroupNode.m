//
//  DoricGroupNode.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/30.
//

#import "DoricGroupNode.h"

@implementation DoricGroupNode

- (UIView *)build:(NSDictionary *)props {
    return [[UIView alloc] init];
}

- (void)blendView:(UIView *)view forPropName:(NSString *)name propValue:(id)prop {
   
}

- (void)blendChild:(DoricViewNode *)child layoutConfig:(NSDictionary *)layoutconfig {
    
}
@end
