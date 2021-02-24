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

@interface DoricDevViewController () <UITableViewDelegate, UITableViewDataSource>
@end

@implementation DoricDevViewController

- (void)viewDidLoad {
    [super viewDidLoad];

    self.title = @"Doric Devkit";
    [self.view addSubview:[[UITableView new] also:^(UITableView *it) {
        it.width = self.view.width;
        it.height = self.view.height;
        it.left = it.top = 0;
        it.dataSource = self;
        it.delegate = self;
    }]];
    UIBarButtonItem *rightBarItem = [[UIBarButtonItem alloc] initWithTitle:@"Disconnect" style:UIBarButtonItemStylePlain target:self action:@selector(onClose)];
    self.navigationItem.rightBarButtonItem = rightBarItem;
    if ([[DoricDev instance] isInDevMode]) {
        return;
    }
    if (self.isSimulator) {
        NSString *result = @"127.0.0.1";
        [[DoricDev instance] connectDevKit:[NSString stringWithFormat:@"ws://%@:7777", result]];
        ShowToast([NSString stringWithFormat:@"Connected to %@", result], DoricGravityBottom);
    } else {
        [self.navigationController pushViewController:[QRScanViewController new] animated:NO];
    }
}

- (void)onClose {
    [[DoricDev instance] closeDevMode];
    [self.navigationController popViewControllerAnimated:YES];
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

@end
