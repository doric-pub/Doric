//
//  ViewController.m
//  Example
//
//  Created by pengfei.zhou on 2019/7/25.
//  Copyright © 2019 pengfei.zhou. All rights reserved.
//

#import <DoricCore/Doric.h>

#import <DoricDevkit/DoricDevViewController.h>

#import "ViewController.h"

#import "DemoLibrary.h"

@interface ViewController () <UITableViewDelegate, UITableViewDataSource>
@property(nonatomic, copy) NSArray <NSString *> *demoFilePaths;
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.title = @"Doric Demo";
    NSString *path = [[NSBundle mainBundle] bundlePath];
    NSString *demoPath = [path stringByAppendingPathComponent:@"src"];
    NSFileManager *mgr = [NSFileManager defaultManager];
    self.demoFilePaths = [[mgr subpathsAtPath:demoPath] filter:^BOOL(NSString *obj) {
        return ![obj containsString:@".map"] && ![obj containsString:@"es5."];
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
    [DoricRegistry register:[DemoLibrary new]];
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
        NSString *file = @"Snake.js";
        DoricViewController *doricViewController = [[DoricViewController alloc]
                initWithSource:[NSString stringWithFormat:@"assets://src/%@", file]
                         alias:file
                         extra:nil
        ];
        [self.navigationController pushViewController:doricViewController animated:NO];
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(3 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                [self.navigationController pushViewController:[DoricDevViewController new] animated:NO];
            }
        );
        return;
    }
    NSString *file = self.demoFilePaths[(NSUInteger) indexPath.row];
    DoricViewController *doricViewController = [[DoricViewController alloc]
            initWithSource:[NSString stringWithFormat:@"assets://src/%@", file]
                     alias:self.demoFilePaths[(NSUInteger) indexPath.row]
                     extra:nil
    ];
    [self.navigationController pushViewController:doricViewController animated:NO];
}

@end
