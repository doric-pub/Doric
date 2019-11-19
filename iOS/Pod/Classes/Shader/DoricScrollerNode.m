//
// Created by pengfei.zhou on 2019/11/19.
//

#import "DoricScrollerNode.h"
#import "DoricExtensions.h"

@interface DoricScrollView : UIScrollView
@end

@implementation DoricScrollView

- (void)layoutSubviews {
    [super layoutSubviews];
    if (self.subviews.count > 0) {
        UIView *child = self.subviews[0];
        [self setContentSize:child.frame.size];
    }
}

- (CGSize)sizeThatFits:(CGSize)size {
    if (self.subviews.count > 0) {
        UIView *child = self.subviews[0];
        CGSize childSize = [child sizeThatFits:size];
        return CGSizeMake(MIN(size.width, childSize.width), MIN(size.height, childSize.height));
    }
    return CGSizeZero;
}
@end

@interface DoricScrollerNode ()
@property(nonatomic, strong) DoricViewNode *childNode;
@property(nonatomic, copy) NSString *childViewId;
@end

@implementation DoricScrollerNode
- (UIScrollView *)build {
    return [DoricScrollView new];
}

- (void)blend:(NSDictionary *)props {
    [super blend:props];
    NSDictionary *childModel = [self subModelOf:self.childViewId];
    if (!childModel) {
        return;
    }
    NSString *viewId = childModel[@"id"];
    NSString *type = childModel[@"type"];
    NSDictionary *childProps = childModel[@"props"];
    if (self.childNode) {
        if ([self.childNode.viewId isEqualToString:viewId]) {
            //skip
        } else {
            if (self.reusable && [type isEqualToString:self.childNode.type]) {
                [self.childNode also:^(DoricViewNode *it) {
                    it.viewId = viewId;
                    [it blend:childProps];
                }];
            } else {
                [self.childNode.view removeFromSuperview];
                self.childNode = [[DoricViewNode create:self.doricContext withType:type] also:^(DoricViewNode *it) {
                    it.viewId = viewId;
                    [it initWithSuperNode:self];
                    [it blend:childProps];
                    [self.view addSubview:it.view];
                }];
            }
        }
    } else {
        self.childNode = [[DoricViewNode create:self.doricContext withType:type] also:^(DoricViewNode *it) {
            it.viewId = viewId;
            [it initWithSuperNode:self];
            [it blend:childProps];
            [self.view addSubview:it.view];
        }];
    }
}

- (void)blendView:(UIScrollView *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([@"content" isEqualToString:name]) {
        self.childViewId = prop;
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (void)blendSubNode:(NSDictionary *)subModel {
    [self.childNode blend:subModel];
}
@end