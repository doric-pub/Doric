/*
 * Copyright [2019] [Doric.Pub]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//
//  DoricGroupNode.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/30.
//

#import <Doric/DoricExtensions.h>
#import "DoricGroupNode.h"

@interface DoricGroupNode ()
@property(nonatomic, copy) NSArray<DoricViewNode *> *childNodes;
@property(nonatomic, copy) NSArray <NSString *> *childViewIds;
@end

@implementation DoricGroupNode

- (instancetype)initWithContext:(DoricContext *)doricContext {
    if (self = [super initWithContext:doricContext]) {
        _childNodes = @[];
        _childViewIds = @[];
    }
    return self;
}

- (UIView *)build {
    UIView *ret = [[UIView alloc] init];
    ret.clipsToBounds = YES;
    return ret;
}

- (void)blendView:(UIView *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([@"children" isEqualToString:name]) {
        self.childViewIds = prop;
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (void)blend:(NSDictionary *)props {
    [super blend:props];
    [self configChildNodes];
}

- (DoricLayoutConfig *)generateDefaultLayoutParams {
    DoricLayoutConfig *params = [[DoricLayoutConfig alloc] init];
    return params;
}

- (void)configChildNodes {
    NSMutableArray *childNodes = [self.childNodes mutableCopy];
    for (NSUInteger idx = 0; idx < self.childViewIds.count; idx++) {
        NSString *viewId = self.childViewIds[idx];
        NSDictionary *model = [self subModelOf:viewId];
        NSString *type = model[@"type"];
        if (idx < self.childNodes.count) {
            DoricViewNode *oldNode = childNodes[idx];
            if ([viewId isEqualToString:oldNode.viewId]) {
                ///Same,skip
            } else {
                ///Find in remain nodes
                NSInteger position = -1;
                for (NSUInteger start = idx + 1; start < childNodes.count; start++) {
                    DoricViewNode *node = childNodes[start];
                    if ([viewId isEqualToString:node.viewId]) {
                        position = start;
                        break;
                    }
                }
                if (position >= 0) {
                    ///Found ,swap idx,position
                    DoricViewNode *reused = childNodes[(NSUInteger) position];
                    [childNodes removeObjectAtIndex:(NSUInteger) position];
                    [childNodes removeObjectAtIndex:idx];
                    [childNodes insertObject:reused atIndex:idx];
                    [childNodes insertObject:oldNode atIndex:(NSUInteger) position];

                    ///View swap index
                    [reused.view removeFromSuperview];
                    [oldNode.view removeFromSuperview];
                    [self.view insertSubview:reused.view atIndex:idx];
                    [self.view insertSubview:oldNode.view atIndex:position];
                } else {
                    ///Not found,insert
                    DoricViewNode *viewNode = [DoricViewNode create:self.doricContext withType:type];
                    viewNode.viewId = viewId;
                    [viewNode initWithSuperNode:self];
                    [viewNode blend:model[@"props"]];
                    [childNodes insertObject:viewNode atIndex:idx];
                    [self.view insertSubview:viewNode.view atIndex:idx];
                }
            }


        } else {
            /// Insert
            DoricViewNode *viewNode = [DoricViewNode create:self.doricContext withType:type];
            viewNode.viewId = viewId;
            [viewNode initWithSuperNode:self];
            [viewNode blend:model[@"props"]];
            [childNodes addObject:viewNode];
            [self.view addSubview:viewNode.view];
        }
    }

    NSUInteger count = childNodes.count;
    for (NSUInteger idx = self.childViewIds.count; idx < count; idx++) {
        DoricViewNode *viewNode = childNodes.lastObject;
        [childNodes removeLastObject];
        [viewNode.view removeFromSuperview];
    }
    self.childNodes = [childNodes copy];
}

- (void)blendSubNode:(NSDictionary *)subModel {
    NSString *viewId = subModel[@"id"];
    [self.childNodes enumerateObjectsUsingBlock:^(DoricViewNode *obj, NSUInteger idx, BOOL *stop) {
        if ([viewId isEqualToString:obj.viewId]) {
            [obj blend:subModel[@"props"]];
            *stop = YES;
        }
    }];
}
@end
