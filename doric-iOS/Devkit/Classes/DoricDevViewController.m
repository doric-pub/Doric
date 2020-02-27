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
#import "NSString+JsonString.h"

#import "DoricDev.h"
#import "DoricDevViewController.h"
#import "DoricJSRemoteExecutor.h"
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
    
    if (self.isSimulator) {
        NSString *result = @"127.0.0.1";
        [DoricJSRemoteExecutor configIp:result];
        [[DoricDev instance] connectDevKit:[NSString stringWithFormat:@"ws://%@:7777", result]];
        ShowToast([NSString stringWithFormat:@"Connected to %@", result], BOTTOM);
    } else {
        [self.navigationController pushViewController:[QRScanViewController new] animated:NO];
    }
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return [DoricContextManager.instance aliveContexts].count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    NSValue *value = [DoricContextManager.instance aliveContexts][(NSUInteger) indexPath.row];
    DoricContext *context = value.nonretainedObjectValue;
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
    NSValue *value = [DoricContextManager.instance aliveContexts][(NSUInteger) indexPath.row];
    DoricContext *context = value.nonretainedObjectValue;
    [[NSNotificationCenter defaultCenter] postNotificationName:@"StartDebugEvent" object:context.contextId];
    NSDictionary *jsonDic = @{
        @"cmd": @"DEBUG",
        @"data": @{
                @"contextId": context.contextId,
                @"source": [context.source stringByReplacingOccurrencesOfString:@".js" withString:@".ts"]
        }
    };
    
    NSString *jsonStr = [NSString dc_convertToJsonWithDic:jsonDic];
    [[DoricDev instance] sendDevCommand:jsonStr];
}

@end
