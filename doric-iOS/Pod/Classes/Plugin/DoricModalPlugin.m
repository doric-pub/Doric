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
//  DoricModalPlugin.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/29.
//

#import "DoricModalPlugin.h"
#import "DoricUtil.h"
#import "DoricExtensions.h"

@implementation DoricModalPlugin

- (void)toast:(NSDictionary *)dic withPromise:(DoricPromise *)promise {
    __weak typeof(self) _self = self;
    [self.doricContext dispatchToMainQueue:^{
        __strong typeof(_self) self = _self;
        __block DoricGravity gravity = DoricGravityBottom;
        [dic[@"gravity"] also:^(NSNumber *it) {
            gravity = (DoricGravity) [it integerValue];
        }];
        if (self.doricContext.vc) {
            ShowToastInVC(self.doricContext.vc, dic[@"msg"], gravity);
        } else {
            ShowToast(dic[@"msg"], gravity);
        }
    }];
}

- (void)alert:(NSDictionary *)dic withPromise:(DoricPromise *)promise {
    __weak typeof(self) _self = self;
    [self.doricContext dispatchToMainQueue:^{
        __strong typeof(_self) self = _self;
        UIAlertController *alert = [UIAlertController alertControllerWithTitle:dic[@"title"]
                                                                       message:dic[@"msg"]
                                                                preferredStyle:UIAlertControllerStyleAlert];
        UIAlertAction *action = [UIAlertAction actionWithTitle:dic[@"okLabel"] ?: NSLocalizedString(@"OK", nil)
                                                         style:UIAlertActionStyleDefault
                                                       handler:^(UIAlertAction *action) {
                                                           [promise resolve:nil];
                                                       }];
        [alert addAction:action];
        [self.doricContext.vc presentViewController:alert animated:YES completion:nil];
    }];
}

- (void)confirm:(NSDictionary *)dic withPromise:(DoricPromise *)promise {
    __weak typeof(self) _self = self;
    [self.doricContext dispatchToMainQueue:^{
        __strong typeof(_self) self = _self;
        UIAlertController *alert = [UIAlertController alertControllerWithTitle:dic[@"title"]
                                                                       message:dic[@"msg"]
                                                                preferredStyle:UIAlertControllerStyleAlert];

        UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:dic[@"cancelLabel"] ?: NSLocalizedString(@"Cancel", nil)
                                                               style:UIAlertActionStyleDefault
                                                             handler:^(UIAlertAction *action) {
                                                                 [promise reject:nil];
                                                             }];
        [alert addAction:cancelAction];

        UIAlertAction *okAction = [UIAlertAction actionWithTitle:dic[@"okLabel"] ?: NSLocalizedString(@"Ok", nil)
                                                           style:UIAlertActionStyleDefault
                                                         handler:^(UIAlertAction *action) {
                                                             [promise resolve:nil];
                                                         }];
        [alert addAction:okAction];

        [self.doricContext.vc presentViewController:alert animated:YES completion:nil];
    }];
}

- (void)prompt:(NSDictionary *)dic withPromise:(DoricPromise *)promise {
    __weak typeof(self) _self = self;
    [self.doricContext dispatchToMainQueue:^{
        __strong typeof(_self) self = _self;
        UIAlertController *alert = [UIAlertController alertControllerWithTitle:dic[@"title"]
                                                                       message:dic[@"msg"]
                                                                preferredStyle:UIAlertControllerStyleAlert];
        NSString *placeholder = dic[@"defaultText"];
        NSString *preText = dic[@"text"];
        [alert addTextFieldWithConfigurationHandler:^(UITextField *_Nonnull textField) {
            if (placeholder.length > 0) {
                textField.placeholder = placeholder;
            }
            if (preText.length > 0) {
                textField.text = preText;
            }
        }];
        __weak typeof(alert) _alert = alert;

        UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:dic[@"cancelLabel"] ?: NSLocalizedString(@"Cancel", nil)
                                                               style:UIAlertActionStyleDefault
                                                             handler:^(UIAlertAction *action) {
                                                                 __strong typeof(_alert) alert = _alert;
                                                                 [promise reject:alert.textFields.lastObject.text];
                                                             }];
        [alert addAction:cancelAction];

        UIAlertAction *okAction = [UIAlertAction actionWithTitle:dic[@"okLabel"] ?: NSLocalizedString(@"Ok", nil)
                                                           style:UIAlertActionStyleDefault
                                                         handler:^(UIAlertAction *action) {
                                                             __strong typeof(_alert) alert = _alert;
                                                             [promise resolve:alert.textFields.lastObject.text];
                                                         }];
        [alert addAction:okAction];

        [self.doricContext.vc presentViewController:alert animated:YES completion:nil];
    }];
}
@end
