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

@interface DoricSliderViewCell : UICollectionViewCell
@property(nonatomic, strong) DoricSlideItemNode *doricSlideItemNode;
@end

@implementation DoricSliderViewCell
@end

@interface DoricSliderNode () <UICollectionViewDataSource, UICollectionViewDelegateFlowLayout>
@property(nonatomic, strong) NSMutableDictionary <NSNumber *, NSString *> *itemViewIds;
@property(nonatomic, assign) NSUInteger itemCount;
@property(nonatomic, assign) NSUInteger batchCount;
@property(nonatomic, copy) NSString *onPageSelectedFuncId;
@property(nonatomic) BOOL loop;
@property(nonatomic, assign) NSUInteger lastPosition;
@property(nonatomic, copy) NSString *renderPageFuncId;
@end

@interface DoricSliderView : UICollectionView
@end

@implementation DoricSliderView
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

    return [[[DoricSliderView alloc] initWithFrame:CGRectZero
                              collectionViewLayout:flowLayout]
            also:^(UICollectionView *it) {
                it.backgroundColor = [UIColor whiteColor];
                it.pagingEnabled = YES;
                it.delegate = self;
                it.dataSource = self;
                [it registerClass:[DoricSliderViewCell class] forCellWithReuseIdentifier:@"doricCell"];
                if (@available(iOS 11, *)) {
                    it.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
                }
            }];
}

- (void)blendView:(UICollectionView *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([@"scrollable" isEqualToString:name]) {
        self.view.scrollEnabled = [prop boolValue];
    } else if ([@"itemCount" isEqualToString:name]) {
        self.itemCount = [prop unsignedIntegerValue];
        [self.view reloadData];
    } else if ([@"renderPage" isEqualToString:name]) {
        if ([self.renderPageFuncId isEqualToString:prop]) {

        } else {
            [self.itemViewIds removeAllObjects];
            [self clearSubModel];
            [self.view reloadData];
            self.renderPageFuncId = prop;
        }
    } else if ([@"batchCount" isEqualToString:name]) {
        self.batchCount = [prop unsignedIntegerValue];
    } else if ([@"onPageSlided" isEqualToString:name]) {
        self.onPageSelectedFuncId = prop;
    } else if ([@"loop" isEqualToString:name]) {
        self.loop = [prop boolValue];
        if (self.loop) {
            [self.view reloadData];
            [self.view setContentOffset:CGPointMake(1 * self.view.width, self.view.contentOffset.y) animated:false];
        }
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    if (self.loop) {
        return self.itemCount + 2;
    } else {
        return self.itemCount;
    }
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
    DoricSliderViewCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"doricCell" forIndexPath:indexPath];
    if (!cell.doricSlideItemNode) {
        DoricSlideItemNode *slideItemNode = [[DoricSlideItemNode alloc] initWithContext:self.doricContext];
        [slideItemNode initWithSuperNode:self];
        cell.doricSlideItemNode = slideItemNode;
        [cell.contentView addSubview:slideItemNode.view];
    }
    DoricSlideItemNode *node = cell.doricSlideItemNode;
    node.viewId = model[@"id"];
    [node blend:props];
    [node.view.doricLayout apply:CGSizeMake(collectionView.width, collectionView.height)];
    [node requestLayout];
    return cell;
}

- (BOOL)collectionView:(UICollectionView *)collectionView shouldSelectItemAtIndexPath:(NSIndexPath *)indexPath {
    return NO;
}

- (NSDictionary *)itemModelAt:(NSUInteger)position {
    NSUInteger index;
    if (self.loop) {
        if (position == 0) {
            index = self.itemCount - 1;
        } else if (position == self.itemCount + 1) {
            index = 0;
        } else {
            index = position - 1;
        }
    } else {
        index = position;
    }

    NSString *viewId = self.itemViewIds[@(index)];
    if (viewId && viewId.length > 0) {
        return [self subModelOf:viewId];
    } else {
        DoricAsyncResult *result = [self pureCallJSResponse:@"renderBunchedItems", @(index), @(self.batchCount), nil];
        NSArray *array = [result waitUntilResult:^(JSValue *models) {
            return [models toArray];
        }];
        [array enumerateObjectsUsingBlock:^(NSDictionary *obj, NSUInteger idx, BOOL *stop) {
            NSString *thisViewId = obj[@"id"];
            [self setSubModel:obj in:thisViewId];
            NSUInteger pos = index + idx;
            self.itemViewIds[@(pos)] = thisViewId;
        }];
        return array[0];
    }
}

- (DoricViewNode *)subNodeWithViewId:(NSString *)viewId {
    __block DoricViewNode *ret = nil;
    [self.doricContext.driver ensureSyncInMainQueue:^{
        for (UICollectionViewCell *collectionViewCell in self.view.visibleCells) {
            if ([collectionViewCell isKindOfClass:[DoricSliderViewCell class]]) {
                DoricSlideItemNode *node = ((DoricSliderViewCell *) collectionViewCell).doricSlideItemNode;
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

    if (self.loop) {
        if (pageIndex == 0) {
            [self.view setContentOffset:CGPointMake(self.itemCount * self.view.width, self.view.contentOffset.y) animated:false];
        } else if (pageIndex == self.itemCount + 1) {
            [self.view setContentOffset:CGPointMake(1 * self.view.width, self.view.contentOffset.y) animated:false];
        }
    }

    if (self.onPageSelectedFuncId && self.onPageSelectedFuncId.length > 0) {
        if (pageIndex != self.lastPosition) {
            [self callJSResponse:self.onPageSelectedFuncId, @(pageIndex), nil];
        }
    }
    self.lastPosition = pageIndex;
}

- (void)slidePage:(NSDictionary *)params withPromise:(DoricPromise *)promise {
    NSUInteger pageIndex = [params[@"page"] unsignedIntegerValue];
    BOOL smooth = [params[@"smooth"] boolValue];
    [self.view setContentOffset:CGPointMake(pageIndex * self.view.width, self.view.contentOffset.y) animated:smooth];
    [promise resolve:nil];
    self.lastPosition = pageIndex;
    if (self.onPageSelectedFuncId && self.onPageSelectedFuncId.length > 0) {
        [self callJSResponse:self.onPageSelectedFuncId, @(pageIndex), nil];
    }
}

- (NSNumber *)getSlidedPage {
    NSUInteger pageIndex = (NSUInteger) (self.view.contentOffset.x / self.view.width);
    return @(pageIndex);
}

@end
