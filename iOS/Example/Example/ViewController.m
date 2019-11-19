//
//  ViewController.m
//  Example
//
//  Created by pengfei.zhou on 2019/7/25.
//  Copyright © 2019 pengfei.zhou. All rights reserved.
//

#import "ViewController.h"
#import "Doric.h"
#import "DemoVC.h"

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

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    DemoVC *demoVC = [[DemoVC alloc] initWithPath:self.demoFilePaths[(NSUInteger) indexPath.row]];
    [self.navigationController pushViewController:demoVC animated:NO];
}

@end
