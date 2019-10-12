//
//  DoricTextNode.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/31.
//

#import "DoricTextNode.h"
#import "DoricUtil.h"
#import "DoricGroupNode.h"

@implementation DoricTextNode
- (id)build:(NSDictionary *)props {
    return [[UILabel alloc] init];
}

- (void)blendView:(UILabel *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([name isEqualToString:@"text"]) {
        view.text = prop;
    } else if ([name isEqualToString:@"textSize"]) {
        view.font = [UIFont systemFontOfSize:[(NSNumber *) prop floatValue]];
    } else if ([name isEqualToString:@"textColor"]) {
        view.textColor = DoricColor(prop);
    } else if ([name isEqualToString:@"textAlignment"]) {
        DoricGravity gravity = [(NSNumber *) prop integerValue];
        NSTextAlignment alignment = NSTextAlignmentCenter;
        switch (gravity) {
            case LEFT:
                alignment = NSTextAlignmentLeft;
                break;
            case RIGHT:
                alignment = NSTextAlignmentRight;
                break;
            default:
                break;
        }
        view.textAlignment = alignment;
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (void)measureByParent:(DoricGroupNode *)parent {
    DoricLayoutDesc widthSpec = self.layoutParams.width;
    DoricLayoutDesc heightSpec = self.layoutParams.height;
    if (widthSpec == LAYOUT_WRAP_CONTENT || heightSpec == LAYOUT_WRAP_CONTENT) {
        [self.view sizeToFit];
    }
}
@end
