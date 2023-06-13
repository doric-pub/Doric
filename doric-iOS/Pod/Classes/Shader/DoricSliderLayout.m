/*
 * Copyright [2023] [Doric.Pub]
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
//  Created by jingpeng.wang on 2023/6/13.
//
#import "DoricSliderLayout.h"

@implementation DoricSliderLayout

- (NSArray<UICollectionViewLayoutAttributes *> *)layoutAttributesForElementsInRect:(CGRect)rect {
    if (self.enableGallery) {
        NSArray *attributes = [super layoutAttributesForElementsInRect:rect];
        CGRect visitRect = {self.collectionView.contentOffset, self.collectionView.bounds.size};
        NSMutableArray *attributesCopy = [NSMutableArray array];
        for (UICollectionViewLayoutAttributes *attribute in attributes) {
            UICollectionViewLayoutAttributes *attributeCopy = [attribute copy];
            [attributesCopy addObject:attributeCopy];
        }
        
        for (UICollectionViewLayoutAttributes *attribute in attributesCopy) {
            CGFloat distance = CGRectGetMidX(visitRect) - attribute.center.x;
            float diff = fabs(distance);
            CATransform3D scaleTransform = CATransform3DIdentity;
            
            if (diff >= 0 && diff <= self.galleryItemWidth) {
                float scale = 1 - (1 - self.galleryMinScale) * (diff / self.galleryItemWidth);
                scaleTransform = CATransform3DMakeScale(scale, scale, scale);
                attribute.alpha = 1 - (1 - self.galleryMinAlpha) * (diff / self.galleryItemWidth);
            } else {
                float scale = self.galleryMinScale;
                scaleTransform = CATransform3DMakeScale(scale, scale, scale);
                attribute.alpha = self.galleryMinAlpha;
            }
            
            attribute.transform3D = scaleTransform;
        }
        return attributesCopy;
    } else {
        return [super layoutAttributesForElementsInRect:rect];
    }
}

- (BOOL)shouldInvalidateLayoutForBoundsChange:(CGRect)newBounds {
    return YES;
}

@end

