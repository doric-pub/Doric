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
//  DoricDevViewController.m
//  Doric
//
//  Created by jingpeng.wang on 2020/2/26.
//
#import <DoricCore/Doric.h>
#import <DoricCore/DoricContextManager.h>

#import "DoricDev.h"
#import "DoricDevViewController.h"
#import "QRScanViewController.h"

@interface DoricDevViewController () <UITableViewDelegate, UITableViewDataSource, DoricDevStatusCallback>
@property(nonatomic, strong) UIView *headerView;
@property(nonatomic, strong) UILabel *tvLabel;
@property(nonatomic, strong) UILabel *tvConnection;
@property(nonatomic, strong) UILabel *tvInput;
@property(nonatomic, strong) UILabel *tvScan;
@property(nonatomic, strong) UILabel *tvDisconnect;

@property(nonatomic, strong) UITableView *listView;

@end

@implementation DoricDevViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.title = @"Doric Devkit";
    self.view.backgroundColor = UIColor.whiteColor;
    self.headerView = [[UIView new] also:^(UIView *it) {
        it.width = self.view.width;
        it.height = 60;
        it.backgroundColor = DoricColor(@(0xff70a1ff));
        [self.view addSubview:it];
    }];
    self.tvLabel = [[UILabel new] also:^(UILabel *it) {
        it.text = @"Devkit";
        it.textColor = [UIColor whiteColor];
        it.font = [UIFont systemFontOfSize:30];
        it.textAlignment = NSTextAlignmentCenter;
        [it sizeToFit];
        it.centerY = self.headerView.centerY;
        it.left = 15;
        [self.headerView addSubview:it];
    }];
    self.tvConnection = [[UILabel new] also:^(UILabel *it) {
        it.text = @"Disconnected";
        it.textColor = [UIColor whiteColor];
        it.font = [UIFont systemFontOfSize:12];
        it.textAlignment = NSTextAlignmentCenter;
        [it sizeToFit];
        [self.headerView addSubview:it];
    }];
    self.tvInput = [[UILabel new] also:^(UILabel *it) {
        it.text = @"Input";
        it.textColor = [UIColor whiteColor];
        it.font = [UIFont systemFontOfSize:15];
        it.textAlignment = NSTextAlignmentCenter;
        [it sizeToFit];
        it.width += 30;
        it.height += 10;
        it.backgroundColor = DoricColor(@(0xff1abc9c));
        [self.headerView addSubview:it];
        it.userInteractionEnabled = YES;
        UITapGestureRecognizer *tapGestureRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(input)];
        [it addGestureRecognizer:tapGestureRecognizer];
    }];
    self.tvScan = [[UILabel new] also:^(UILabel *it) {
        it.text = @"Scan";
        it.textColor = [UIColor whiteColor];
        it.font = [UIFont systemFontOfSize:15];
        it.textAlignment = NSTextAlignmentCenter;
        [it sizeToFit];
        it.width += 30;
        it.height += 10;
        it.backgroundColor = DoricColor(@(0xff1abc9c));
        [self.headerView addSubview:it];
        it.userInteractionEnabled = YES;
        UITapGestureRecognizer *tapGestureRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(scan)];
        [it addGestureRecognizer:tapGestureRecognizer];
    }];
    self.tvDisconnect = [[UILabel new] also:^(UILabel *it) {
        it.text = @"Disconnect";
        it.textColor = [UIColor whiteColor];
        it.font = [UIFont systemFontOfSize:15];
        it.textAlignment = NSTextAlignmentCenter;
        [it sizeToFit];
        it.width += 30;
        it.height += 10;
        it.backgroundColor = DoricColor(@(0xff95a5a6));
        [self.headerView addSubview:it];
        it.userInteractionEnabled = YES;
        UITapGestureRecognizer *tapGestureRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(disconnect)];
        [it addGestureRecognizer:tapGestureRecognizer];
    }];
    [self initHeaders];
    [DoricDev.instance addStatusCallback:self];
}

- (void)disconnect {
    [DoricDev.instance closeDevMode];
}

- (void)input {
    if (self.isSimulator) {
        NSString *result = @"127.0.0.1";
        [[DoricDev instance] connectDevKit:[NSString stringWithFormat:@"ws://%@:7777", result]];
        ShowToast([NSString stringWithFormat:@"Connected to %@", result], DoricGravityBottom);
    } else {
        UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"Please input devkit ip"
                                                                       message:@""
                                                                preferredStyle:UIAlertControllerStyleAlert];
        [alert addTextFieldWithConfigurationHandler:^(UITextField *_Nonnull textField) {
            textField.placeholder = @"192.168.1.1";
        }];
        __weak typeof(alert) _alert = alert;

        UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:NSLocalizedString(@"Cancel", nil)
                                                               style:UIAlertActionStyleDefault
                                                             handler:nil];
        [alert addAction:cancelAction];

        UIAlertAction *okAction = [UIAlertAction actionWithTitle:NSLocalizedString(@"Ok", nil)
                                                           style:UIAlertActionStyleDefault
                                                         handler:^(UIAlertAction *action) {
                                                             __strong typeof(_alert) alert = _alert;
                                                             NSString *ip = alert.textFields.lastObject.text;
                                                             [[DoricDev instance] connectDevKit:[NSString stringWithFormat:@"ws://%@:7777", ip]];
                                                         }];
        [alert addAction:okAction];

        [self presentViewController:alert animated:YES completion:nil];
    }
}

- (void)scan {
    if (self.isSimulator) {
        NSString *result = @"127.0.0.1";
        [[DoricDev instance] connectDevKit:[NSString stringWithFormat:@"ws://%@:7777", result]];
        ShowToast([NSString stringWithFormat:@"Connected to %@", result], DoricGravityBottom);
    } else {
        [self.navigationController pushViewController:[QRScanViewController new] animated:NO];
    }
}

- (void)initHeaders {
    if (DoricDev.instance.isInDevMode) {
        self.tvConnection.text = DoricDev.instance.ip;
        self.tvInput.hidden = YES;
        self.tvScan.hidden = YES;
        self.tvDisconnect.hidden = NO;
        self.tvConnection.backgroundColor = DoricColor(@(0xff2ed573));

        [self.tvConnection sizeToFit];
        self.tvConnection.width += 20;
        self.tvConnection.height += 6;

        self.tvConnection.left = self.tvLabel.right + 20;
        self.tvDisconnect.right = self.view.width - 15;
        self.tvConnection.centerY = self.headerView.centerY;
        self.tvDisconnect.centerY = self.headerView.centerY;
    } else {
        self.tvConnection.text = @"Disconnected";
        self.tvInput.hidden = NO;
        self.tvScan.hidden = NO;
        self.tvDisconnect.hidden = YES;
        self.tvConnection.backgroundColor = DoricColor(@(0xffa4b0be));

        [self.tvConnection sizeToFit];
        self.tvConnection.width += 20;
        self.tvConnection.height += 6;

        self.tvConnection.left = self.tvLabel.right + 20;
        self.tvScan.right = self.view.width - 15;
        self.tvInput.right = self.tvScan.left - 10;
        self.tvConnection.centerY = self.headerView.centerY;
        self.tvScan.centerY = self.headerView.centerY;
        self.tvInput.centerY = self.headerView.centerY;
    }
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return [DoricContextManager.instance aliveContexts].count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    DoricContext *context = [DoricContextManager.instance aliveContexts][(NSUInteger) indexPath.row];
    NSString *path = context.source;
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"cell"];
    if (cell == nil) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:@"cellID"];
        cell.selectionStyle = UITableViewCellSelectionStyleNone;
    }
    cell.textLabel.text = [path stringByAppendingString:@" Debug"];
    return cell;
}

- (BOOL)isSimulator {
    return TARGET_OS_SIMULATOR == 1;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    DoricContext *context = [DoricContextManager.instance aliveContexts][(NSUInteger) indexPath.row];
    [[NSNotificationCenter defaultCenter] postNotificationName:@"StartDebugEvent" object:context.contextId];
    NSDictionary *jsonDic = @{
            @"cmd": @"DEBUG",
            @"data": @{
                    @"contextId": context.contextId,
                    @"source": [context.source stringByReplacingOccurrencesOfString:@".js" withString:@".ts"]
            }
    };
}

- (void)onOpen:(NSString *)url {
    [self initHeaders];
}

- (void)onClose:(NSString *)url {
    [self initHeaders];
}

- (void)onFailure:(NSError *)error {
    [self initHeaders];
}

- (void)onReload:(DoricContext *)context script:(NSString *)script {

}

- (void)onStartDebugging:(DoricContext *)context {

}

- (void)onStopDebugging {

}


@end
