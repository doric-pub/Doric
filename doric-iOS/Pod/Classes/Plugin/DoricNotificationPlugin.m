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
// Created by pengfei.zhou on 2020/1/8.
//

#import <DoricCore/Doric.h>
#import "DoricNotificationPlugin.h"

@interface DoricNotificationPlugin ()

@property(nonatomic, strong) NSMutableDictionary<NSString *, id> *observers;
@property (nonatomic, strong) dispatch_queue_t syncQuene;

@end

@implementation DoricNotificationPlugin

- (NSDictionary *)observers {
    if (!_observers) {
        _observers = [NSMutableDictionary new];
    }
    return _observers;
}

- (dispatch_queue_t)syncQuene {
    if (!_syncQuene) {
        _syncQuene = dispatch_queue_create("pub.doric.plugin.notification", DISPATCH_QUEUE_CONCURRENT);
    }
    return _syncQuene;
}

- (void)publish:(NSDictionary *)dic withPromise:(DoricPromise *)promise {
    NSString *biz = [dic optString:@"biz"];
    NSString *name = [dic optString:@"name"];
    if (biz) {
        name = [NSString stringWithFormat:@"__doric__%@#%@", biz, name];
    }
    NSString *data = [dic optString:@"data"];
    NSDictionary *dataDic = nil;
    if (data) {
        NSData *jsonData = [data dataUsingEncoding:NSUTF8StringEncoding];
        NSError *err;
        dataDic = [NSJSONSerialization JSONObjectWithData:jsonData
                                                  options:NSJSONReadingMutableContainers
                                                    error:&err];
    }
    [[NSNotificationCenter defaultCenter] postNotificationName:name object:nil userInfo:dataDic];
    [promise resolve:nil];
}

- (void)subscribe:(NSDictionary *)dic withPromise:(DoricPromise *)promise {
    NSString *biz = [dic optString:@"biz"];
    NSString *name = [dic optString:@"name"];
    if (biz) {
        name = [NSString stringWithFormat:@"__doric__%@#%@", biz, name];
    }
    NSString *callbackId = [dic optString:@"callback"];
    __weak typeof(self) _self = self;
    id observer = [[NSNotificationCenter defaultCenter]
            addObserverForName:name
                        object:nil
                         queue:[NSOperationQueue mainQueue]
                    usingBlock:^(NSNotification *note) {
                        __strong typeof(_self) self = _self;
                        DoricPromise *currentPromise = [[DoricPromise alloc] initWithContext:self.doricContext callbackId:callbackId];
                        [currentPromise resolve:note.userInfo];
                    }];
    
    dispatch_barrier_async(self.syncQuene, ^{
        [self.observers setObject:observer forKey:callbackId];
    });
    [promise resolve:callbackId];
}

- (void)unsubscribe:(NSString *)subscribeId withPromise:(DoricPromise *)promise {
    dispatch_barrier_async(self.syncQuene, ^{
        id observer = [self.observers objectForKey:subscribeId];
        [[NSNotificationCenter defaultCenter] removeObserver:observer];
        [self.observers removeObjectForKey:subscribeId];
        
        [promise resolve:nil];
    });
}

- (void)dealloc {
    NSArray *values = [self.observers allValues];
    [values enumerateObjectsUsingBlock:^(id obj, NSUInteger index, BOOL *stop) {
        [[NSNotificationCenter defaultCenter] removeObserver:obj];
    }];
}

@end
