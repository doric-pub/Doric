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
    NSMutableDictionary *targetProp = targetModel[@"props"];
    [srcProp enumerateKeysAndObjectsUsingBlock:^(NSString *key, id obj, BOOL *stop) {
        if (![@"subviews" isEqualToString:key]) {
            targetProp[key] = obj;
        }
    }];
}

- (void)recursiveMixin:(NSDictionary *)srcModel to:(NSMutableDictionary *)targetModel {
    NSDictionary *srcProp = srcModel[@"props"];
    NSMutableDictionary *targetProp = targetModel[@"props"];
    NSMutableArray *targetOri = targetProp[@"subviews"];

    [srcProp enumerateKeysAndObjectsUsingBlock:^(NSString *key, id obj, BOOL *stop) {
        if ([@"subviews" isEqualToString:key]) {
            NSArray *subviews = obj;
            if (subviews) {
                for (NSDictionary *subview in subviews) {
                    NSString *viewId = subview[@"id"];
                    [targetOri enumerateObjectsUsingBlock:^(NSDictionary *obj, NSUInteger idx, BOOL *stop) {
                        if ([viewId isEqualToString:obj[@"id"]]) {
                            NSMutableDictionary *mutableDictionary = [obj mutableCopy];
                            [self recursiveMixin:subview to:mutableDictionary];
                            targetOri[idx] = [mutableDictionary copy];
                            *stop = YES;
                        }
                    }];
                }
            }
        } else {
            targetProp[key] = obj;
        }
    }];
}

- (void)blendSubNode:(DoricViewNode *)subNode layoutConfig:(NSDictionary *)layoutConfig {
    DoricLayoutConfig *params = subNode.layoutConfig;

    [layoutConfig[@"widthSpec"] also:^(NSNumber *it) {
        if (it) {
            params.widthSpec = (DoricLayoutSpec) [it integerValue];
        }
    }];

    [layoutConfig[@"heightSpec"] also:^(NSNumber *it) {
        if (it) {
            params.heightSpec = (DoricLayoutSpec) [it integerValue];
        }
    }];

    NSDictionary *margin = layoutConfig[@"margin"];
    if (margin) {
        params.margin = DoricMarginMake(
                [(NSNumber *) margin[@"left"] floatValue],
                [(NSNumber *) margin[@"top"] floatValue],
                [(NSNumber *) margin[@"right"] floatValue],
                [(NSNumber *) margin[@"bottom"] floatValue]);
    }

    NSNumber *alignment = layoutConfig[@"alignment"];
    if (alignment) {
        params.alignment = (DoricGravity) [alignment integerValue];
    }
    NSNumber *weight = layoutConfig[@"weight"];
    if (weight) {
        params.weight = (DoricGravity) [weight integerValue];
    }
}

- (void)blendSubNode:(NSDictionary *)subModel {
    NSAssert(NO, @"Should override class:%@ ,method:%@.", NSStringFromClass([self class]),
            NSStringFromSelector(_cmd));
}

- (DoricLayoutConfig *)generateDefaultLayoutParams {
    DoricLayoutConfig *params = [[DoricLayoutConfig alloc] init];
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

- (void)requestLayout {
    [self.view setNeedsLayout];
}
@end
