//
//  DoricViewNode.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/30.
//

#import "DoricViewNode.h"
#import "DoricUtil.h"
#import "DoricGroupNode.h"

@implementation DoricViewNode

- (UIView *)build:(NSDictionary *)props {
    return [[UIView alloc] init];
}

- (void)blend:(NSDictionary *)props {
    if(self.view == nil) {
        self.view = [self build:props];
    }
    for (NSString *key in props) {
        id value = props[key];
        [self blendView:self.view forPropName:key propValue:value];
    }
}

- (void)blendView:(UIView *)view forPropName:(NSString *)name propValue:(id)prop {
    if([name isEqualToString:@"width"]) {
        view.width = [(NSNumber *)prop floatValue];
    } else if([name isEqualToString:@"height"]) {
        view.height = [(NSNumber *)prop floatValue];
    } else if([name isEqualToString:@"x"]) {
        view.x = [(NSNumber *)prop floatValue];
    } else if([name isEqualToString:@"y"]) {
        view.y = [(NSNumber *)prop floatValue];
    } else if([name isEqualToString:@"bgColor"]) {
        view.backgroundColor = DoricColor(prop);
    } else if([name isEqualToString:@"layoutConfig"]) {
        if(self.parent && [prop isKindOfClass:[NSDictionary class]]){
            [self.parent blendChild:self layoutConfig:prop];
        }
    }
}

@end
