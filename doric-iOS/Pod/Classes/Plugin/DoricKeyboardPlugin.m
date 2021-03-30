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
// Created by jingpeng.wang on 2021/3/18.
//

#import <DoricCore/Doric.h>
#import "DoricKeyboardPlugin.h"

@interface DoricKeyboardPlugin ()

@property(nonatomic, copy) NSDictionary<NSString *, id> *observers;
@end

@implementation DoricKeyboardPlugin

- (NSDictionary *)observers {
    if (!_observers) {
        _observers = [NSDictionary new];
    }
    return _observers;
}

- (void)subscribe:(NSString *)callbackId withPromise:(DoricPromise *)promise {
    __weak typeof(self) _self = self;
    id observer = [[NSNotificationCenter defaultCenter]
            addObserverForName:UIKeyboardWillChangeFrameNotification
                        object:nil
                         queue:[NSOperationQueue mainQueue]
                    usingBlock:^(NSNotification *note) {
        __strong typeof(_self) self = _self;

        CGRect beginFrame = [[note.userInfo valueForKey:UIKeyboardFrameBeginUserInfoKey] CGRectValue];
        CGRect endFrame = [[note.userInfo valueForKey:UIKeyboardFrameEndUserInfoKey] CGRectValue];
        
        CGFloat oldBottomMargin = [[UIScreen mainScreen] bounds].size.height - beginFrame.origin.y - beginFrame.size.height;
        CGFloat bottomMargin = [[UIScreen mainScreen] bounds].size.height - endFrame.origin.y - endFrame.size.height;
        
        NSDictionary *dict = @{
            @"oldBottomMargin": @(oldBottomMargin),
            @"oldHeight": @(beginFrame.size.height),
            @"bottomMargin": @(bottomMargin),
            @"height": @(endFrame.size.height),
        };

        DoricPromise *currentPromise = [[DoricPromise alloc] initWithContext:self.doricContext callbackId:callbackId];
        [currentPromise resolve:dict];
    }];
    NSMutableDictionary *mutableDictionary = [self.observers mutableCopy];
    mutableDictionary[callbackId] = observer;
    self.observers = mutableDictionary;
    [promise resolve:callbackId];
}

- (void)unsubscribe:(NSString *)subscribeId withPromise:(DoricPromise *)promise {
    id observer = self.observers[subscribeId];
    if (observer) {
        [[NSNotificationCenter defaultCenter] removeObserver:observer];
        NSMutableDictionary *mutableDictionary = [self.observers mutableCopy];
        [mutableDictionary removeObjectForKey:subscribeId];
        self.observers = mutableDictionary;
    }
    [promise resolve:nil];
}

- (void)dealloc {
    NSDictionary *dictionary = self.observers;
    [dictionary enumerateKeysAndObjectsUsingBlock:^(NSString *key, id obj, BOOL *stop) {
        [[NSNotificationCenter defaultCenter] removeObserver:obj];
    }];
}

@end
