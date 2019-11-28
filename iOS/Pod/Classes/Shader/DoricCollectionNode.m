//
// Created by pengfei.zhou on 2019/11/28.
//

#import "DoricCollectionNode.h"
#import "DoricCollectionItemNode.h"
#import "DoricExtensions.h"

@interface DoricCollectionViewCell : UICollectionViewCell
@property(nonatomic, strong) DoricCollectionItemNode *viewNode;
@end

@implementation DoricCollectionViewCell
@end

@interface DoricCollectionView : UICollectionView
@end

@implementation DoricCollectionView
- (CGSize)sizeThatFits:(CGSize)size {
    if (self.subviews.count > 0) {
        CGFloat width = size.width;
        CGFloat height = size.height;
        for (UIView *child in self.subviews) {
            CGSize childSize = [child measureSize:size];
            width = MAX(childSize.width, width);
            height = MAX(childSize.height, height);
        }
        return CGSizeMake(width, height);
    }
    return size;
}

- (void)layoutSelf:(CGSize)targetSize {
    [super layoutSelf:targetSize];
    [self reloadData];
}
@end

@interface DoricCollectionNode () <UICollectionViewDataSource, UICollectionViewDelegateFlowLayout>
@property(nonatomic, strong) NSMutableDictionary <NSNumber *, NSString *> *itemViewIds;
@property(nonatomic, assign) NSUInteger itemCount;
@property(nonatomic, assign) NSUInteger batchCount;
@end

@implementation DoricCollectionNode
- (instancetype)initWithContext:(DoricContext *)doricContext {
    if (self = [super initWithContext:doricContext]) {
        _itemViewIds = [NSMutableDictionary new];
        _batchCount = 15;
    }
    return self;
}

- (UICollectionView *)build {
    UICollectionViewFlowLayout *flowLayout = [[UICollectionViewFlowLayout alloc] init];
    [flowLayout setScrollDirection:UICollectionViewScrollDirectionHorizontal];

    return [[[DoricCollectionView alloc] initWithFrame:CGRectZero
                                  collectionViewLayout:flowLayout]
            also:^(UICollectionView *it) {
                it.backgroundColor = [UIColor whiteColor];
                it.pagingEnabled = YES;
                it.delegate = self;
                it.dataSource = self;
                [it registerClass:[DoricCollectionViewCell class] forCellWithReuseIdentifier:@"doricCell"];
            }];
}


@end