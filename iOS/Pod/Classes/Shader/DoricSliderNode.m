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
//  DoricSliderNode.m
//  Doric
//
//  Created by pengfei.zhou on 2019/11/19.
//
#import <JavaScriptCore/JavaScriptCore.h>
#import "DoricSliderNode.h"
#import "Doric.h"
#import "DoricSlideItemNode.h"

@interface DoricCollectionViewCell : UICollectionViewCell
@property(nonatomic, strong) DoricSlideItemNode *doricSlideItemNode;
@end

@implementation DoricCollectionViewCell
@end

@interface DoricSliderNode () <UICollectionViewDataSource, UICollectionViewDelegateFlowLayout>
@property(nonatomic, strong) NSMutableDictionary <NSNumber *, NSString *> *itemViewIds;
@property(nonatomic, assign) NSUInteger itemCount;
@property(nonatomic, assign) NSUInteger batchCount;
@end

@interface DoricCollectionView : UICollectionView
@end

@implementation DoricCollectionView
- (CGSize)sizeThatFits:(CGSize)size {
    if (self.subviews.count > 0) {
        CGFloat height = size.height;
        for (UIView *child in self.subviews) {
            CGSize childSize = [child measureSize:size];
            height = MAX(childSize.height, height);
        }
        return CGSizeMake(size.width, size.height);
    }
    return size;
}

- (void)layoutSelf:(CGSize)targetSize {
    [super layoutSelf:targetSize];
    [self reloadData];
}
@end

@implementation DoricSliderNode
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

- (void)blendView:(UICollectionView *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([@"itemCount" isEqualToString:name]) {
        self.itemCount = [prop unsignedIntegerValue];
        [self.view reloadData];
    } else if ([@"renderPage" isEqualToString:name]) {
        [self.itemViewIds removeAllObjects];
        [self clearSubModel];
        [self.view reloadData];
    } else if ([@"batchCount" isEqualToString:name]) {
        self.batchCount = [prop unsignedIntegerValue];
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    return self.itemCount;
}

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath {
    return CGSizeMake(self.view.width, self.view.height);
}

- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout minimumInteritemSpacingForSectionAtIndex:(NSInteger)section {
    return 0;
}

- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout minimumLineSpacingForSectionAtIndex:(NSInteger)section {
    return 0;
}

- (__kindof UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath {
    NSUInteger position = (NSUInteger) indexPath.row;
    NSDictionary *model = [self itemModelAt:position];
    NSDictionary *props = model[@"props"];
    DoricCollectionViewCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"doricCell" forIndexPath:indexPath];
    if (!cell.doricSlideItemNode) {
        DoricSlideItemNode *slideItemNode = [[DoricSlideItemNode alloc] initWithContext:self.doricContext];
        [slideItemNode initWithSuperNode:self];
        cell.doricSlideItemNode = slideItemNode;
        [cell.contentView addSubview:slideItemNode.view];
    }
    DoricSlideItemNode *node = cell.doricSlideItemNode;
    node.viewId = model[@"id"];
    [node blend:props];
    [node.view setNeedsLayout];
    return cell;
}

- (BOOL)collectionView:(UICollectionView *)collectionView shouldSelectItemAtIndexPath:(NSIndexPath *)indexPath {
    return NO;
}

- (NSDictionary *)itemModelAt:(NSUInteger)position {
    NSString *viewId = self.itemViewIds[@(position)];
    if (viewId && viewId.length > 0) {
        return [self subModelOf:viewId];
    } else {
        DoricAsyncResult *result = [self callJSResponse:@"renderBunchedItems", @(position), @(self.batchCount), nil];
        JSValue *models = [result waitUntilResult];
        NSArray *array = [models toArray];
        [array enumerateObjectsUsingBlock:^(NSDictionary *obj, NSUInteger idx, BOOL *stop) {
            NSString *thisViewId = obj[@"id"];
            [self setSubModel:obj in:thisViewId];
            NSUInteger pos = position + idx;
            self.itemViewIds[@(pos)] = thisViewId;
        }];
        return array[0];
    }
}

- (DoricViewNode *)subNodeWithViewId:(NSString *)viewId {
    __block DoricViewNode *ret = nil;
    [self.doricContext.driver ensureSyncInMainQueue:^{
        for (UICollectionViewCell *collectionViewCell in self.view.visibleCells) {
            if ([collectionViewCell isKindOfClass:[DoricCollectionViewCell class]]) {
                DoricSlideItemNode *node = ((DoricCollectionViewCell *) collectionViewCell).doricSlideItemNode;
                if ([viewId isEqualToString:node.viewId]) {
                    ret = node;
                    break;
                }
            }
        }
    }];
    return ret;
}

- (void)blendSubNode:(NSDictionary *)subModel {
    NSString *viewId = subModel[@"id"];
    DoricViewNode *viewNode = [self subNodeWithViewId:viewId];
    if (viewNode) {
        [viewNode blend:subModel[@"props"]];
    } else {
        NSMutableDictionary *model = [[self subModelOf:viewId] mutableCopy];
        [self recursiveMixin:subModel to:model];
        [self setSubModel:model in:viewId];
    }
    [self.itemViewIds enumerateKeysAndObjectsUsingBlock:^(NSNumber *_Nonnull key, NSString *_Nonnull obj, BOOL *_Nonnull stop) {
        if ([viewId isEqualToString:obj]) {
            *stop = YES;
            NSIndexPath *indexPath = [NSIndexPath indexPathForRow:[key integerValue] inSection:0];
            [UIView performWithoutAnimation:^{
                [self.view reloadItemsAtIndexPaths:@[indexPath]];
            }];
        }
    }];
}

- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView {
    NSUInteger pageIndex = (NSUInteger) (scrollView.contentOffset.x / scrollView.width);
    scrollView.contentOffset = CGPointMake(pageIndex * scrollView.width, scrollView.contentOffset.y);
}
@end
