//
// Created by pengfei.zhou on 2019/11/26.
//

#import "DoricRefreshableNode.h"
#import "Doric.h"

@interface DoricRefreshableNode ()
@property(nonatomic, strong) DoricViewNode *contentNode;
@property(nonatomic, copy) NSString *contentViewId;
@property(nonatomic, strong) DoricViewNode *headerNode;
@property(nonatomic, copy) NSString *headerViewId;
@end

@implementation DoricRefreshableNode
- (DoricSwipeRefreshLayout *)build {
    return [DoricSwipeRefreshLayout new];
}

- (void)blendView:(DoricSwipeRefreshLayout *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([@"content" isEqualToString:name]) {
        self.contentViewId = prop;
    } else if ([@"header" isEqualToString:name]) {
        self.headerViewId = prop;
    } else if ([@"onRefresh" isEqualToString:name]) {
        __weak typeof(self) _self = self;
        NSString *funcId = prop;
        self.view.onRefreshBlock = ^{
            __strong  typeof(_self) self = _self;
            [self callJSResponse:funcId, nil];
        };
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (DoricViewNode *)subNodeWithViewId:(NSString *)viewId {
    if ([viewId isEqualToString:self.contentViewId]) {
        return self.contentNode;
    } else if ([viewId isEqualToString:self.headerViewId]) {
        return self.headerNode;
    } else {
        return nil;
    }
}

- (void)blend:(NSDictionary *)props {
    [super blend:props];
    [self blendHeader];
    [self blendContent];
}

- (void)blendContent {
    NSDictionary *contentModel = [self subModelOf:self.contentViewId];
    if (!contentModel) {
        return;
    }
    NSString *viewId = contentModel[@"id"];
    NSString *type = contentModel[@"type"];
    NSDictionary *childProps = contentModel[@"props"];
    if (self.contentNode) {
        if ([self.contentNode.viewId isEqualToString:viewId]) {
            //skip
        } else {
            if (self.reusable && [type isEqualToString:self.contentNode.type]) {
                [self.contentNode also:^(DoricViewNode *it) {
                    it.viewId = viewId;
                    [it blend:childProps];
                }];
            } else {
                self.contentNode = [[DoricViewNode create:self.doricContext withType:type] also:^(DoricViewNode *it) {
                    it.viewId = viewId;
                    [it initWithSuperNode:self];
                    [it blend:childProps];
                    self.view.contentView = it.view;
                }];
            }
        }
    } else {
        self.contentNode = [[DoricViewNode create:self.doricContext withType:type] also:^(DoricViewNode *it) {
            it.viewId = viewId;
            [it initWithSuperNode:self];
            [it blend:childProps];
            self.view.contentView = it.view;
        }];
    }
}

- (void)blendHeader {
    NSDictionary *headerModel = [self subModelOf:self.headerViewId];
    if (!headerModel) {
        return;
    }
    NSString *viewId = headerModel[@"id"];
    NSString *type = headerModel[@"type"];
    NSDictionary *childProps = headerModel[@"props"];
    if (self.headerNode) {
        if ([self.headerNode.viewId isEqualToString:viewId]) {
            //skip
        } else {
            if (self.reusable && [type isEqualToString:self.headerNode.type]) {
                [self.headerNode also:^(DoricViewNode *it) {
                    it.viewId = viewId;
                    [it blend:childProps];
                }];
            } else {
                self.headerNode = [[DoricViewNode create:self.doricContext withType:type] also:^(DoricViewNode *it) {
                    it.viewId = viewId;
                    [it initWithSuperNode:self];
                    [it blend:childProps];
                    self.view.headerView = it.view;
                }];
            }
        }
    } else {
        self.headerNode = [[DoricViewNode create:self.doricContext withType:type] also:^(DoricViewNode *it) {
            it.viewId = viewId;
            [it initWithSuperNode:self];
            [it blend:childProps];
            self.view.headerView = it.view;
        }];
    }
}

- (void)blendSubNode:(NSDictionary *)subModel {
    [[self subNodeWithViewId:subModel[@"id"]] blend:subModel[@"props"]];
}
@end
