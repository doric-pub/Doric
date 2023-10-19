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
// Created by pengfei.zhou on 2019/11/15.
//

#import "DoricSuperNode.h"
#import "DoricExtensions.h"

@interface DoricSuperNode ()
@property(nonatomic, strong) NSMutableDictionary <NSString *, NSMutableDictionary *> *subNodes;
@end

@implementation DoricSuperNode
- (instancetype)initWithContext:(DoricContext *)doricContext {
    if (self = [super initWithContext:doricContext]) {
        _subNodes = [NSMutableDictionary new];
    }
    return self;
}

- (void)blendView:(UIView *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([@"subviews" isEqualToString:name]) {
        NSArray *subviews = prop;
        for (NSMutableDictionary *subModel in subviews) {
            [self mixinSubNode:subModel];
            [self blendSubNode:subModel];
        }
        self.view.doricLayout.resolved = NO;
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (void)mixinSubNode:(NSMutableDictionary *)dictionary {
    NSString *viewId = dictionary[@"id"];
    NSMutableDictionary *oldModel = self.subNodes[viewId];
    if (oldModel) {
        [self mixin:dictionary to:oldModel];
    } else {
        self.subNodes[viewId] = dictionary;
    }
}

- (void)mixin:(NSDictionary *)srcModel to:(NSMutableDictionary *)targetModel {
    NSDictionary *srcProp = srcModel[@"props"];
    NSMutableDictionary *targetProp = [targetModel[@"props"] mutableCopy];
    [srcProp enumerateKeysAndObjectsUsingBlock:^(NSString *key, id obj, BOOL *stop) {
        if (![@"subviews" isEqualToString:key]) {
            targetProp[key] = obj;
        }
    }];
    targetModel[@"props"] = targetProp;
}

- (void)recursiveMixin:(NSDictionary *)srcModel to:(NSMutableDictionary *)targetModel {
    NSDictionary *srcProp = srcModel[@"props"];
    NSMutableDictionary *targetProp = [targetModel[@"props"] mutableCopy];
    NSMutableArray *targetOri = targetProp[@"subviews"];
    NSArray *srcSubviews = srcProp[@"subviews"];
    if (srcSubviews && srcSubviews.count > 0) {
        for (NSDictionary *subview in srcSubviews) {
            NSString *viewId = subview[@"id"];
            __block NSMutableDictionary *viewModel = nil;
            [targetOri enumerateObjectsUsingBlock:^(NSMutableDictionary *obj, NSUInteger idx, BOOL *stop) {
                if ([viewId isEqualToString:obj[@"id"]]) {
                    viewModel = obj;
                    *stop = YES;
                }
            }];
            if (viewModel) {
                [self recursiveMixin:subview to:viewModel];
            } else {
                [targetOri addObject:subview];
            }
        }
    }
    [srcProp enumerateKeysAndObjectsUsingBlock:^(NSString *key, id obj, BOOL *stop) {
        if (![@"subviews" isEqualToString:key]) {
            targetProp[key] = obj;
        }
    }];
    targetModel[@"props"] = targetProp;
}

- (void)blendSubNode:(DoricViewNode *)subNode layoutConfig:(NSDictionary *)layoutConfig {
    [subNode blendLayoutConfig:layoutConfig];
}

- (void)blendSubNode:(NSDictionary *)subModel {
    NSAssert(NO, @"Should override class:%@ ,method:%@.", NSStringFromClass([self class]),
            NSStringFromSelector(_cmd));
}

- (DoricLayout *)generateDefaultLayoutParams {
    DoricLayout *params = [[DoricLayout alloc] init];
    return params;
}


- (NSDictionary *)subModelOf:(NSString *)viewId {
    return self.subNodes[viewId];
}

- (void)setSubModel:(NSDictionary *)model in:(NSString *)viewId {
    self.subNodes[viewId] = [model mutableCopy];
}

- (void)clearSubModel {
    [self.subNodes removeAllObjects];
}

- (void)removeSubModel:(NSString *)viewId {
    [self.subNodes removeObjectForKey:viewId];
}

- (DoricViewNode *)subNodeWithViewId:(NSString *)viewId {
    NSAssert(NO, @"Should override class:%@ ,method:%@.", NSStringFromClass([self class]),
            NSStringFromSelector(_cmd));
    return nil;
}

- (NSArray *)getSubNodeViewIds {
    NSMutableArray *discardedItems = [NSMutableArray array];

    NSMutableArray *allKeys = [[NSMutableArray alloc] init];
    allKeys = [NSMutableArray arrayWithArray:[self.subNodes allKeys]];
    for (NSString *key in allKeys) {
        if ([self subNodeWithViewId:key] == nil) {
            [discardedItems addObject:key];
        }
    }

    [allKeys removeObjectsInArray:discardedItems];

    return allKeys;
}

- (void)reset {
    [super reset];
    for (NSString *viewId in self.subNodes.allKeys) {
        [[self subNodeWithViewId:viewId] reset];
    }
}

- (void)subNodeContentChanged:(DoricViewNode *)subNode {
    if (self.doricContext.destroyed) {
        return;
    }
    if (self.superNode
            && (self.view.doricLayout.widthSpec == DoricLayoutFit
            || self.view.doricLayout.heightSpec == DoricLayoutFit
            || self.view.doricLayout.weight > 0)) {
        [self.superNode subNodeContentChanged:self];
    } else {
        if (![self.type isEqualToString:@"Root"]) {
            [self.view.doricLayout apply];
        }
        [self requestLayout];
    }
}
@end
