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
#import "DoricSliderLayout.h"

@interface DoricSliderViewCell : UICollectionViewCell
@property(nonatomic, strong) DoricSlideItemNode *doricSlideItemNode;
@end

@implementation DoricSliderViewCell
@end

@interface DoricSliderNode () <UICollectionViewDataSource, UICollectionViewDelegateFlowLayout>
@property(nonatomic, strong) NSMutableDictionary <NSNumber *, NSString *> *itemViewIds;
@property(nonatomic, assign) NSUInteger itemCount;
@property(nonatomic, assign) NSUInteger propItemCount;
@property(nonatomic, assign) NSUInteger batchCount;
@property(nonatomic, assign) NSUInteger slidePosition;
@property(nonatomic, copy) NSString *onPageSelectedFuncId;
@property(nonatomic, assign) BOOL loop;
@property(nonatomic, assign) BOOL propLoop;
@property(nonatomic, assign) NSUInteger lastPosition;
@property(nonatomic, copy) NSString *renderPageFuncId;
@property(nonatomic, copy) NSString *propRenderPageFuncId;
@property(nonatomic, assign) BOOL needResetScroll;
@property(nonatomic, strong) NSString *slideStyle;
@property(nonatomic, assign) CGFloat minScale;
@property(nonatomic, assign) CGFloat maxScale;
@property(nonatomic, assign) CGFloat galleryMinScale;
@property(nonatomic, assign) CGFloat galleryMinAlpha;
@property(nonatomic, assign) CGFloat galleryItemWidth;
@property(nonatomic, assign) BOOL scheduledLayout;
@property (nonatomic, assign) NSInteger currentPage;
@end

@interface DoricSliderView : UICollectionView
@end

@implementation DoricSliderView
- (CGSize)sizeThatFits:(CGSize)size {
    CGSize result = [super sizeThatFits:size];
    if (self.doricLayout.heightSpec == DoricLayoutFit && self.contentSize.height > 0) {
        return CGSizeMake(result.width, self.contentSize.height);
    }
    return result;
}
@end

@implementation DoricSliderNode
- (instancetype)initWithContext:(DoricContext *)doricContext {
    if (self = [super initWithContext:doricContext]) {
        _itemViewIds = [NSMutableDictionary new];
        _batchCount = 15;
        _minScale = .618f;
        _maxScale = 1.f;
    }
    return self;
}

- (UICollectionView *)build {
    DoricSliderLayout *flowLayout = [[DoricSliderLayout alloc] init];
    [flowLayout setScrollDirection:UICollectionViewScrollDirectionHorizontal];
    return [[[DoricSliderView alloc] initWithFrame:CGRectZero
                              collectionViewLayout:flowLayout]
            also:^(UICollectionView *it) {
                it.backgroundColor = [UIColor whiteColor];
                it.pagingEnabled = YES;
                it.delegate = self;
                it.dataSource = self;
                it.showsHorizontalScrollIndicator = NO;
                it.showsVerticalScrollIndicator = NO;
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
        self.propItemCount = [prop unsignedIntegerValue];
    } else if ([@"renderPage" isEqualToString:name]) {
        self.propRenderPageFuncId = prop;
    } else if ([@"batchCount" isEqualToString:name]) {
        self.batchCount = [prop unsignedIntegerValue];
    } else if ([@"onPageSlided" isEqualToString:name]) {
        self.onPageSelectedFuncId = prop;
    } else if ([@"loop" isEqualToString:name]) {
        self.propLoop = [prop boolValue];
    } else if ([@"bounces" isEqualToString:name]) {
        self.view.bounces = [prop boolValue];
    } else if ([@"scrollsToTop" isEqualToString:name]) {
        self.view.scrollsToTop = [prop boolValue];
    } else if ([@"slideStyle" isEqualToString:name]) {
        if ([prop isKindOfClass:NSDictionary.class]) {
            self.slideStyle = prop[@"type"];
            if ([self.slideStyle isEqualToString:@"zoomOut"]) {
                self.maxScale = [prop[@"maxScale"] floatValue];
                self.minScale = [prop[@"minScale"] floatValue];
            } else if([self.slideStyle isEqualToString:@"gallery"]) {
                self.galleryMinScale = [prop[@"minScale"] floatValue];
                self.galleryMinAlpha = [prop[@"minAlpha"] floatValue];
                self.galleryItemWidth = [prop[@"itemWidth"] floatValue];
                self.view.pagingEnabled = NO;
                
                DoricSliderLayout *layout = (DoricSliderLayout*)self.view.collectionViewLayout;
                layout.galleryItemWidth = self.galleryItemWidth;
                layout.galleryMinScale = self.galleryMinScale;
                layout.galleryMinAlpha = self.galleryMinAlpha;
                layout.enableGallery = YES;
            }
            
        } else if ([prop isKindOfClass:NSString.class]) {
            self.slideStyle = prop;
        }
    } else if ([@"slidePosition" isEqualToString:name]) {
        self.slidePosition = [prop unsignedIntegerValue];
        if (self.view.width > 0 && ((NSUInteger) self.view.contentOffset.x / self.view.width) == self.slidePosition) {
        } else {
            self.needResetScroll = YES;
        }
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (void)afterBlended:(NSDictionary *)props {
    bool needToScroll = (self.propLoop && !self.loop)
            || (![self.renderPageFuncId isEqualToString:self.propRenderPageFuncId])
            || (self.itemCount == 0 && self.propItemCount > 0)
            || self.needResetScroll;

    // handle item count
    if (self.itemCount != self.propItemCount) {
        self.itemCount = self.propItemCount;
        [self.view reloadData];
    }

    // handle render page
    if ([self.renderPageFuncId isEqualToString:self.propRenderPageFuncId]) {

    } else {
        [self.itemViewIds removeAllObjects];
        [self clearSubModel];
        [self.view reloadData];
        self.renderPageFuncId = self.propRenderPageFuncId;
    }

    // handle loop
    self.loop = self.propLoop;


    __weak typeof(self) _self = self;
    if (needToScroll) {
        dispatch_async(dispatch_get_main_queue(), ^{
            __strong typeof(_self) self = _self;
            [self.view reloadData];
            NSUInteger position = (self.loop ? 1 : 0) + self.slidePosition;
            float itemWidth;
            if ([self.slideStyle isEqualToString:@"gallery"]) {
                itemWidth = self.galleryItemWidth;
            } else {
                itemWidth = self.view.width;
            }
            
            if (itemWidth == 0) {
                self.needResetScroll = true;
            } else {
                self.needResetScroll = false;
                [self.view setContentOffset:CGPointMake(position * itemWidth, self.view.contentOffset.y) animated:false];
            }
        });
    }
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    if (self.loop && self.itemCount > 0) {
        return self.itemCount + 2;
    } else {
        return self.itemCount;
    }
}

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath {
    if ([self.slideStyle isEqualToString:@"gallery"]) {
        UICollectionViewFlowLayout *layout = (UICollectionViewFlowLayout *)self.view.collectionViewLayout;
        int margin = (self.view.width - self.galleryItemWidth) / 2;
        layout.sectionInset = UIEdgeInsetsMake(0, margin, 0, margin);
        return CGSizeMake(self.galleryItemWidth, self.view.height);
    }
    return CGSizeMake(self.view.width, self.view.height);
}

- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout minimumInteritemSpacingForSectionAtIndex:(NSInteger)section {
    return 0;
}

- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout minimumLineSpacingForSectionAtIndex:(NSInteger)section {
    return 0;
}

- (__kindof UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath {
    @try {
        NSUInteger position = (NSUInteger) indexPath.row;
        NSDictionary *model = [self itemModelAt:position];
        NSDictionary *props = model[@"props"];
        DoricSliderViewCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"doricCell" forIndexPath:indexPath];
        if (!cell.doricSlideItemNode) {
            DoricSlideItemNode *slideItemNode = (DoricSlideItemNode *) [DoricViewNode create:self.doricContext withType:@"SlideItem"];
            [slideItemNode initWithSuperNode:self];
            cell.doricSlideItemNode = slideItemNode;
            [cell.contentView addSubview:slideItemNode.view];
        } else {
            [cell.doricSlideItemNode reset];
        }
        DoricSlideItemNode *node = cell.doricSlideItemNode;
        node.viewId = model[@"id"];
        [node blend:props];
        CGFloat maxWidth;
        if ([self.slideStyle isEqualToString:@"gallery"]) {
            maxWidth = self.galleryItemWidth;
        } else {
            maxWidth = collectionView.width;
        }
        if (collectionView.doricLayout.widthSpec == DoricLayoutFit) {
            maxWidth = [[UIScreen mainScreen] bounds].size.width;
        }
        CGFloat maxHeight = collectionView.height;
        if (collectionView.doricLayout.heightSpec == DoricLayoutFit) {
            maxHeight = [[UIScreen mainScreen] bounds].size.height;
        }
        [node.view.doricLayout apply:CGSizeMake(maxWidth, maxHeight)];
        [node requestLayout];
        BOOL needLayout = NO;
        if (collectionView.doricLayout.widthSpec == DoricLayoutFit && collectionView.width < node.view.width) {
            self.view.width = node.view.width;
            needLayout = YES;
        }
        if (collectionView.doricLayout.heightSpec == DoricLayoutFit && collectionView.height < node.view.height) {
            collectionView.height = node.view.height;
            needLayout = YES;
        }
        if (needLayout) {
            [self scheduleLayout];
        }
        return cell;
    } @catch (NSException *exception) {
        [self.doricContext.driver.registry onException:exception inContext:self.doricContext];
        return nil;
    }
}

- (void)scheduleLayout {
    if (self.scheduledLayout) {
        return;
    }
    self.scheduledLayout = YES;
    dispatch_async(dispatch_get_main_queue(), ^{
        self.scheduledLayout = NO;
        DoricSuperNode *node = self.superNode;
        while (node.superNode != nil) {
            if ([node.view isKindOfClass:UITableView.class]) {
                UITableView *tableView = (UITableView *) node.view;
                [tableView reloadData];
                return;
            }
            node = node.superNode;
        }
        [node requestLayout];
        [self.view reloadData];
    });
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
    BOOL skipReload = NO;

    NSMutableDictionary *model = [[self subModelOf:viewId] mutableCopy];
    [self recursiveMixin:subModel to:model];
    [self setSubModel:model in:viewId];

    if (viewNode) {
        CGSize originSize = viewNode.view.frame.size;
        [viewNode blend:subModel[@"props"]];
        
        if ([self.slideStyle isEqualToString:@"gallery"]) {
            [viewNode.view.doricLayout apply:CGSizeMake(self.galleryItemWidth, self.view.height)];
        } else {
            [viewNode.view.doricLayout apply:CGSizeMake(self.view.width, self.view.height)];
        }
        [viewNode requestLayout];
        if (CGSizeEqualToSize(originSize, viewNode.view.frame.size)) {
            skipReload = YES;
        }
    }

    if (skipReload) {
        return;
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

//paging by cell | paging with one cell at a time
- (void)scrollViewWillBeginDragging:(UIScrollView *)scrollView
{
    if ([self.slideStyle isEqualToString:@"gallery"]) {
        CGFloat cellWidth = self.galleryItemWidth;
        self.currentPage = (scrollView.contentOffset.x - cellWidth / 2) / (cellWidth) + 1;
    }
}

- (void)scrollViewWillEndDragging:(UIScrollView *)scrollView withVelocity:(CGPoint)velocity targetContentOffset:(inout CGPoint *)targetContentOffset
{
    if ([self.slideStyle isEqualToString:@"gallery"]) {
        CGFloat cellWidth = self.galleryItemWidth;
        NSInteger page = (scrollView.contentOffset.x - cellWidth / 2) / (cellWidth) + 1;

        if (velocity.x > 0) page++;
        if (velocity.x < 0) page--;
        page = MAX(page, 0);
        
        NSInteger prePage = self.currentPage - 1;
        if(prePage > 0 && page < prePage){
            page = prePage;
        } else if (page > self.currentPage + 1){
            page = self.currentPage + 1;
        }
        
        self.currentPage = page;
        
        CGFloat newOffset = page * (cellWidth);
        targetContentOffset->x = newOffset;
    }
}

- (void)scrollViewDidScroll:(UIScrollView *)scrollView {
    if ([self.slideStyle isEqualToString:@"zoomOut"]) {
        CGFloat centerX = scrollView.width / 2.f;
        [self.view.visibleCells forEach:^(__kindof UICollectionViewCell *obj) {
            CGFloat vCenterX = obj.centerX - scrollView.contentOffset.x;
            CGFloat percent = ABS(vCenterX - centerX) / centerX;
            CGFloat scale = self.maxScale - (self.maxScale - self.minScale) * percent;
            obj.transform = CGAffineTransformScale(CGAffineTransformIdentity, scale, scale);
            obj.layer.anchorPoint = CGPointMake(0.5f, 0.5f);
        }];
    }
}

- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView {
    NSUInteger pageIndex;
    if ([self.slideStyle isEqualToString:@"gallery"]) {
        pageIndex = (NSUInteger) (scrollView.contentOffset.x / self.galleryItemWidth + 0.5f);
        scrollView.contentOffset = CGPointMake(pageIndex * self.galleryItemWidth, scrollView.contentOffset.y);
    } else {
        pageIndex = (NSUInteger) (scrollView.contentOffset.x / scrollView.width);
        scrollView.contentOffset = CGPointMake(pageIndex * scrollView.width, scrollView.contentOffset.y);
    }


    if (self.loop) {
        float itemWidth;
        if ([self.slideStyle isEqualToString:@"gallery"]) {
            itemWidth = self.galleryItemWidth;
        } else {
            itemWidth = self.view.width;
        }
        if (pageIndex == 0) {
            [self.view setContentOffset:CGPointMake(self.itemCount * itemWidth, self.view.contentOffset.y) animated:false];
            pageIndex = self.itemCount - 1;
        } else if (pageIndex == self.itemCount + 1) {
            [self.view setContentOffset:CGPointMake(1 * itemWidth, self.view.contentOffset.y) animated:false];
            pageIndex = 0;
        } else {
            pageIndex = pageIndex - 1;
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

    float itemWidth;
    if ([self.slideStyle isEqualToString:@"gallery"]) {
        itemWidth = self.galleryItemWidth;
    } else {
        itemWidth = self.view.width;
    }
    
    if (self.loop) {
        [self.view setContentOffset:CGPointMake((pageIndex + 1) * itemWidth, self.view.contentOffset.y) animated:smooth];
    } else {
        [self.view setContentOffset:CGPointMake(pageIndex * itemWidth, self.view.contentOffset.y) animated:smooth];
    }

    [promise resolve:nil];
    self.lastPosition = pageIndex;
    if (self.onPageSelectedFuncId && self.onPageSelectedFuncId.length > 0) {
        [self callJSResponse:self.onPageSelectedFuncId, @(pageIndex), nil];
    }
}

- (NSNumber *)getSlidedPage {
    NSUInteger pageIndex;
    if ([self.slideStyle isEqualToString:@"gallery"]) {
        pageIndex = (NSUInteger) (self.view.contentOffset.x / self.galleryItemWidth);
    } else {
        pageIndex = (NSUInteger) (self.view.contentOffset.x / self.view.width);
    }
    
    if (self.loop) {
        return @(pageIndex - 1);
    } else {
        return @(pageIndex);
    }
}

- (void)reset {
    [super reset];
    self.view.scrollEnabled = YES;
    self.onPageSelectedFuncId = nil;
    self.propRenderPageFuncId = nil;
    self.renderPageFuncId = nil;
    self.slideStyle = nil;
    self.minScale = .618f;
    self.maxScale = 1.f;
    self.slidePosition = 0;
}

- (void)subNodeContentChanged:(DoricViewNode *)subNode {
    [subNode.view.doricLayout apply];
    [super subNodeContentChanged:subNode];
}

- (void)reload {
    [self.itemViewIds removeAllObjects];
    [self clearSubModel];
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.view reloadData];
    });
}
@end
