//
//  DoricGroupNode.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/30.
//

#import "DoricGroupNode.h"

@implementation DoricGroupNode

- (instancetype)initWithContext:(DoricContext *)doricContext {
    if(self = [super initWithContext:doricContext]) {
        _children = [[NSMutableDictionary alloc] init];
        _indexedChildren = [[NSMutableArray alloc] init];
    }
    return self;
}
- (UIView *)build:(NSDictionary *)props {
    UIView *ret = [[UIView alloc] init];
    ret.clipsToBounds = YES;
    return ret;
}

- (void)blendView:(UIView *)view forPropName:(NSString *)name propValue:(id)prop {
    if([name isEqualToString:@"children"]) {
        NSArray *array = prop;
        NSInteger i;
        NSMutableArray *tobeRemoved = [[NSMutableArray alloc] init];
        for (i = 0; i< array.count; i++) {
            NSDictionary *val = array[i];
            if (!val || (NSNull *)val == [NSNull null]) {
                continue;
            }
            NSString *type = [val objectForKey:@"type"];
            NSString *viewId = [val objectForKey:@"id"];
            DoricViewNode *node = [self.children objectForKey:viewId];
            if (node == nil) {
                node = [DoricViewNode create:self.doricContext withType:type];
                node.index = i;
                node.parent = self;
                node.viewId = viewId;
                [self.children setObject:node forKey:viewId];
            } else {
                if (i != node.index) {
                    [self.indexedChildren removeObjectAtIndex:i];
                    node.index = i;
                    [node.view removeFromSuperview];
                }
                [tobeRemoved removeObject:node];
            }
            DoricViewNode *old = i >= self.indexedChildren.count ? nil :[self.indexedChildren objectAtIndex:i];
            if (old && old != node) {
                [old.view removeFromSuperview];
                self.indexedChildren[i] = [NSNull null];
                [tobeRemoved addObject:old];
            }
            
            LayoutParams *params = node.layoutParams;
            if (params == nil) {
                params = [self generateDefaultLayoutParams];
                node.layoutParams = params;
            }
            [node blend:[val objectForKey:@"props"]];
            if (self.indexedChildren.count <= i) {
                [self.view addSubview:node.view];
                [self.indexedChildren addObject:node];
            }else if ([self.indexedChildren objectAtIndex:i] == [NSNull null]) {
                self.indexedChildren[i] = node;
                [self.view insertSubview:node.view atIndex:i];
            }
        }
        NSUInteger start = i;
        while (start < self.indexedChildren.count) {
            DoricViewNode *node = [self.indexedChildren objectAtIndex:start];
            if (node) {
                [self.children removeObjectForKey: node.viewId];
                [node.view removeFromSuperview];
                [tobeRemoved removeObject:node];
            }
            start++;
        }
        if (i < self.indexedChildren.count) {
            [self.indexedChildren removeObjectsInRange:NSMakeRange(i, self.indexedChildren.count - i)];
        }
        
        for (DoricViewNode *node in tobeRemoved) {
            [self.children removeObjectForKey:node.viewId];
        }
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (LayoutParams *)generateDefaultLayoutParams {
    LayoutParams *params = [[LayoutParams alloc] init];
    return params;
}

- (void)blendChild:(DoricViewNode *)child layoutConfig:(NSDictionary *)layoutconfig {
    LayoutParams *params = child.layoutParams;
    if ([params isKindOfClass:MarginLayoutParams.class]) {
        MarginLayoutParams *marginParams = (MarginLayoutParams *)params;
        NSDictionary *margin = [layoutconfig objectForKey:@"margin"];
        if (margin) {
            marginParams.margin.top = [(NSNumber *)[margin objectForKey:@"top"] floatValue];
            marginParams.margin.left = [(NSNumber *)[margin objectForKey:@"left"] floatValue];
            marginParams.margin.right = [(NSNumber *)[margin objectForKey:@"right"] floatValue];
            marginParams.margin.bottom = [(NSNumber *)[margin objectForKey:@"bottom"] floatValue];
        }
    }
    
}

@end
