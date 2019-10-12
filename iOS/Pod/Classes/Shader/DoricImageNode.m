//
//  DoricImageNode.m
//  Doric
//
//  Created by pengfei.zhou on 2019/8/6.
//

#import "DoricImageNode.h"
#import <SDWebImage/SDWebImage.h>

@implementation DoricImageNode

- (UIView *)build:(NSDictionary *)props {
    return [[UIImageView alloc] init];
}

- (void)blendView:(UIImageView *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([name isEqualToString:@"imageUrl"]) {
        __weak typeof(self) _self = self;
        [view sd_setImageWithURL:[NSURL URLWithString:prop] completed:^(UIImage *_Nullable image, NSError *_Nullable error, SDImageCacheType cacheType, NSURL *_Nullable imageURL) {
            __strong typeof(_self) self = _self;
            [self requestLayout];
        }];
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
