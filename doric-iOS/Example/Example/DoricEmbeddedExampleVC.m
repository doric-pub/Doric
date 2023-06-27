//
//  DoricEmbeddedExampleVC.m
//  Example
//
//  Created by pengfei.zhou on 2022/7/13.
//  Copyright © 2022 pengfei.zhou. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "DoricEmbeddedExampleVC.h"
#import <DoricCore/Doric.h>
#import <DoricCore/DoricSingleton.h>


@interface MyFlowLayout : UICollectionViewLayout
@property(nonatomic, readonly) NSInteger columnCount;
@property(nonatomic, strong) NSMutableDictionary <NSNumber *, NSNumber *> *columnHeightInfo;
@end

@implementation MyFlowLayout
- (instancetype)init {
    if (self = [super init]) {
        _columnHeightInfo = [NSMutableDictionary new];
    }
    return self;
}

- (NSInteger)columnCount {
    return 2;
}

- (BOOL)shouldInvalidateLayoutForBoundsChange:(CGRect)newBounds {
    return YES;
}

- (void)prepareLayout {
    [super prepareLayout];
    for (int i = 0; i < self.columnCount; i++) {
        self.columnHeightInfo[@(i)] = @(0);
    }
}

- (NSArray *)layoutAttributesForElementsInRect:(CGRect)rect {
    for (int i = 0; i < self.columnCount; i++) {
        self.columnHeightInfo[@(i)] = @(0);
    }
    NSMutableArray *array = [NSMutableArray array];
    NSInteger count = [self.collectionView numberOfItemsInSection:0];
    for (int i = 0; i < count; i++) {
        UICollectionViewLayoutAttributes *attrs = [self layoutAttributesForItemAtIndexPath:[NSIndexPath indexPathForItem:i inSection:0]];
        [array addObject:attrs];
    }
    return array;
}

- (UICollectionViewLayoutAttributes *)layoutAttributesForItemAtIndexPath:(NSIndexPath *)indexPath {
    NSNumber *minYOfColumn = @(0);
    NSArray<NSNumber *> *keys = self.columnHeightInfo.allKeys;
    NSArray<NSNumber *> *sortedKeys = [keys sortedArrayUsingComparator:^NSComparisonResult(NSNumber *obj1, NSNumber *obj2) {
        return ([obj1 intValue] <= [obj2 intValue] ? NSOrderedAscending : NSOrderedDescending);
    }];

    for (NSNumber *key in sortedKeys) {
        if ([self.columnHeightInfo[key] floatValue] < [self.columnHeightInfo[minYOfColumn] floatValue]) {
            minYOfColumn = key;
        }
    }
    CGFloat columnWidth = self.collectionView.width / self.columnCount;
    CGFloat width = columnWidth;
    CGFloat height = 200;
    CGFloat x = 0;
    CGFloat y = [self.columnHeightInfo[minYOfColumn] floatValue];
    x = columnWidth * [minYOfColumn integerValue];
    self.columnHeightInfo[minYOfColumn] = @(y + height);
    UICollectionViewLayoutAttributes *attrs = [UICollectionViewLayoutAttributes layoutAttributesForCellWithIndexPath:indexPath];
    attrs.frame = CGRectMake(x, y, width, height);
    return attrs;
}

- (CGSize)collectionViewContentSize {
    CGFloat width = self.collectionView.width;
    CGFloat height = 0;
    for (NSNumber *column in self.columnHeightInfo.allValues) {
        height = MAX(height, [column floatValue]);
    }
    return CGSizeMake(width, height);
}
@end


@interface MyCollectionViewCell : UICollectionViewCell
@property(nonatomic, strong) DoricPanelView *panel;
@end

@implementation MyCollectionViewCell
@end


@interface DoricEmbeddedExampleVC () <UICollectionViewDelegate, UICollectionViewDataSource>
@end

@implementation DoricEmbeddedExampleVC

- (instancetype)init {
    if (self = [super init]) {
    }
    return self;
}


- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    [self.view addSubview:[[[UICollectionView alloc] initWithFrame:CGRectMake(0, 0, self.view.width, self.view.height) collectionViewLayout:[MyFlowLayout new]] also:^(UICollectionView *it) {
        it.dataSource = self;
        it.delegate = self;
    }]];
}

- (void)viewDidLoad {
    [super viewDidLoad];
    self.title = @"Doric Embedded Demo";
    [self.navigationController.navigationBar setBackgroundImage:UIImageWithColor(UIColor.whiteColor) forBarMetrics:UIBarMetricsDefault];
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    return 1000;
}

- (__kindof UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath {
    NSString *cellId = (indexPath.row % 2 == 0) ? @"cell0" : @"cell1";
    [collectionView registerClass:[MyCollectionViewCell class] forCellWithReuseIdentifier:cellId];
    MyCollectionViewCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:cellId forIndexPath:indexPath];
    NSDictionary *data = @{
            @"imageUrl": (indexPath.row % 2 == 0)
                    ? @"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202107%2F09%2F20210709142454_dc8dc.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660279617&t=8caf9c88dbeb00c6436f76e90c54eecc"
                    : @"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202005%2F02%2F20200502185802_FuFU2.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660279617&t=77131edf568efeda32c3a6513412f324",
            @"title": [NSString stringWithFormat:@"%@", @(indexPath.row + 1)],
            @"content": [NSString stringWithFormat:@"第%@项\n++++++++可填充内容++++++++%@", @(indexPath.row + 1), (indexPath.row % 2 == 0) ? @"\n+++再加一行+++" : @""],
    };
    if (cell.panel == nil) {
        cell.panel = [[DoricPanelView new] also:^(DoricPanelView *it) {
            it.width = self.view.width / 2;
            it.height = 200;
            NSString *scheme = (indexPath.row % 2 == 0) ? @"assets://src/CellModule1Demo.js" : @"assets://src/CellModule2Demo.js";
            NSString *alias = (indexPath.row % 2 == 0) ? @"CellModule1Demo.js" : @"CellModule2Demo.js";
            [[DoricSingleton.instance.jsLoaderManager request:scheme]
                    setResultCallback:^(NSString *script) {
                        [it config:script alias:alias extra:nil];
                    }];
            [it.doricContext callEntity:@"setData", data, nil];
            it.doricContext.rootNode.reusable = YES;
        }];
    }
    if (cell.panel.doricContext != nil) {
        [cell.panel.doricContext callEntity:@"setData", data, nil];
    }
    __weak typeof(cell) _cell = cell;
    cell.panel.frameChangedBlock = ^(CGSize frameSize) {
        __strong typeof(_cell) c = _cell;
        c.width = frameSize.width;
        c.height = frameSize.height;
        c.contentView.width = c.width;
        c.contentView.height = c.height;
    };
    [cell.contentView addSubview:cell.panel];
    return cell;
}

@end
