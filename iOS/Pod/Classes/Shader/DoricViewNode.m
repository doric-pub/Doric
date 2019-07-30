//
//  DoricViewNode.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/30.
//

#import "DoricViewNode.h"
#import "DoricUtil.h"
#import "DoricGroupNode.h"
#import "DoricRootNode.h"
#import "DoricConstant.h"

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
    } else {
        DoricLog(@"Blend View error for View Type :%@, prop is %@", self.class, name);
    }
}

- (NSArray<NSString *> *)idList {
    NSMutableArray *ret = [[NSMutableArray alloc] init];
    DoricViewNode *node = self;
    do {
        [ret addObject:node.viewId];
        node = node.parent;
    } while (node && ![node isKindOfClass:[DoricRootNode class]]);
    
    return ret;
}

- (void)callJSResponse:(NSString *)funcId,... {
    NSMutableArray *array = [[NSMutableArray alloc] init];
    [array addObject:self.idList];
    [array addObject:funcId];
    va_list args;
    va_start(args, funcId);
    id arg;
    while ((arg = va_arg(args, id)) != nil) {
        [array addObject:arg];
    }
    [self.doricContext callEntity:DORIC_ENTITY_RESPONSE withArgumentsArray:array];
    va_end(args);
}

+ (DoricViewNode *)create:(DoricContext *)context withType:(NSString *)type {
    DoricRegistry *registry = context.driver.registry;
    Class  clz = [registry acquireViewNode:type];
    return [[clz alloc] initWithContext:context];
}

@end
