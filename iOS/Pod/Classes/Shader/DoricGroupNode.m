//
//  DoricGroupNode.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/30.
//

#import "DoricGroupNode.h"

@implementation DoricGroupNode

- (instancetype)initWithContext:(DoricContext *)doricContext {
    if (self = [super initWithContext:doricContext]) {
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
    if ([name isEqualToString:@"children"]) {
        NSArray *array = prop;
        NSInteger i;
        NSMutableArray *tobeRemoved = [[NSMutableArray alloc] init];
        for (i = 0; i < array.count; i++) {
            NSDictionary *val = array[i];
            if (!val || (NSNull *) val == [NSNull null]) {
                continue;
            }
            NSString *type = val[@"type"];
            NSString *viewId = val[@"id"];
            DoricViewNode *node = self.children[viewId];
            if (node == nil) {
                node = [DoricViewNode create:self.doricContext withType:type];
                node.index = i;
                node.parent = self;
                node.viewId = viewId;
                self.children[viewId] = node;
            } else {
                if (i != node.index) {
                    [self.indexedChildren removeObjectAtIndex:i];
                    node.index = i;
                    [node.view removeFromSuperview];
                }
                [tobeRemoved removeObject:node];
            }
            DoricViewNode *old = i >= self.indexedChildren.count ? nil : self.indexedChildren[i];
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
            [node blend:val[@"props"]];
            if (self.indexedChildren.count <= i) {
                [self.view addSubview:node.view];
                [self.indexedChildren addObject:node];
            } else if (self.indexedChildren[i] == [NSNull null]) {
                self.indexedChildren[i] = node;
                [self.view insertSubview:node.view atIndex:i];
            }
        }
        NSInteger start = i;
        while (start < self.indexedChildren.count) {
            DoricViewNode *node = self.indexedChildren[(NSUInteger) start];
            if (node) {
                [self.children removeObjectForKey:node.viewId];
                [node.view removeFromSuperview];
                [tobeRemoved removeObject:node];
            }
            start++;
        }
        if (i < self.indexedChildren.count) {
            [self.indexedChildren removeObjectsInRange:NSMakeRange((NSUInteger) i, self.indexedChildren.count - i)];
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
        MarginLayoutParams *marginParams = (MarginLayoutParams *) params;
        NSDictionary *margin = layoutconfig[@"margin"];
        if (margin) {
            marginParams.margin.top = [(NSNumber *) margin[@"top"] floatValue];
            marginParams.margin.left = [(NSNumber *) margin[@"left"] floatValue];
            marginParams.margin.right = [(NSNumber *) margin[@"right"] floatValue];
            marginParams.margin.bottom = [(NSNumber *) margin[@"bottom"] floatValue];
        }
    }

}

@end
