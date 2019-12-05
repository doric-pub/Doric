//
//  ViewController.m
//  Example
//
//  Created by pengfei.zhou on 2019/7/25.
//  Copyright © 2019 pengfei.zhou. All rights reserved.
//

#import "ViewController.h"
#import <Doric/Doric.h>
#import "DemoVC.h"
#import "QRScanViewController.h"

@interface ViewController () <UITableViewDelegate, UITableViewDataSource>
@property(nonatomic, copy) NSArray <NSString *> *demoFilePaths;
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.title = @"Doric Demo";
    NSString *path = [[NSBundle mainBundle] bundlePath];
    NSString *demoPath = [path stringByAppendingPathComponent:@"demo"];
    NSFileManager *mgr = [NSFileManager defaultManager];
    self.demoFilePaths = [[mgr subpathsAtPath:demoPath] filter:^BOOL(NSString *obj) {
        return ![obj containsString:@".map"];
    }];
    NSMutableArray <NSString *> *tmp = [self.demoFilePaths mutableCopy];
    NSStringCompareOptions comparisonOptions = NSCaseInsensitiveSearch | NSNumericSearch | NSWidthInsensitiveSearch | NSForcedOrderingSearch;
    [tmp sortUsingComparator:^NSComparisonResult(NSString *obj1, NSString *obj2) {
        NSRange range = NSMakeRange(0, obj1.length);
        return [obj1 compare:obj2 options:comparisonOptions range:range];
    }];
    [tmp insertObject:@"Dev Kit" atIndex:0];
    self.demoFilePaths = tmp;
    [self.view addSubview:[[UITableView new] also:^(UITableView *it) {
        it.width = self.view.width;
        it.height = self.view.height;
        it.left = it.top = 0;
        it.dataSource = self;
        it.delegate = self;
    }]];
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return self.demoFilePaths.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    NSString *path = self.demoFilePaths[(NSUInteger) indexPath.row];
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"cell"];
    if (cell == nil) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:@"cellID"];
        cell.selectionStyle = UITableViewCellSelectionStyleNone;
    }
    cell.textLabel.text = path;
    return cell;
}

- (BOOL)isSimulator {
    return TARGET_OS_SIMULATOR == 1;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    if (indexPath.row == 0) {
        if (self.isSimulator) {
            NSString *result = @"127.0.0.1";
            [[DoricDriver instance] connectDevKit:[NSString stringWithFormat:@"ws://%@:7777", result]];
            ShowToast([NSString stringWithFormat:@"Connected to %@", result], BOTTOM);
        } else {
            [self.navigationController pushViewController:[QRScanViewController new] animated:NO];
        }
        return;
    }
    NSString *file = self.demoFilePaths[(NSUInteger) indexPath.row];
    if ([file containsString:@"NavigatorDemo"]) {
        DoricViewController *doricViewController = [[DoricViewController alloc]
                initWithScheme:[NSString stringWithFormat:@"assets://demo/%@", file]
                         alias:self.demoFilePaths[(NSUInteger) indexPath.row]];
        [self.navigationController pushViewController:doricViewController animated:NO];
    } else {
        DemoVC *demoVC = [[DemoVC alloc] initWithPath:file];
        [self.navigationController pushViewController:demoVC animated:NO];
    }
}

@end
