//
// Created by pengfei.zhou on 2019/11/19.
// Copyright (c) 2019 pengfei.zhou. All rights reserved.
//
#import <DoricCore/Doric.h>

#import "DoricPanelListViewController.h"
#import "DoricSingleton.h"

@interface DoricPanelListViewController () <UITableViewDelegate, UITableViewDataSource>
@property(nonatomic, copy) NSArray <NSString *> *demoFilePaths;
@property(nonatomic, strong) NSMutableDictionary *doricViewControllers;
@end

@implementation DoricPanelListViewController

- (instancetype)init {
    if (self = [super init]) {
        _doricViewControllers = [NSMutableDictionary new];
    }
    return self;
}


- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    [self.view addSubview:[[UITableView new] also:^(UITableView *it) {
        it.width = self.view.width;
        it.height = self.view.height;
        it.left = it.top = 0;
        it.dataSource = self;
        it.delegate = self;
    }]];
}

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.title = @"Doric Panel List";
    [self.navigationController.navigationBar setBackgroundImage:UIImageWithColor(UIColor.whiteColor) forBarMetrics:UIBarMetricsDefault];
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
    self.demoFilePaths = tmp;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return self.demoFilePaths.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    NSString *cellId = [@(indexPath.row) stringValue];
    
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellId];
    if (cell == nil) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellId];
        cell.selectionStyle = UITableViewCellSelectionStyleNone;
        cell.textLabel.hidden = YES;
        
        NSString *file = self.demoFilePaths[(NSUInteger) indexPath.row];
        DoricViewController *doricViewController = [[DoricViewController alloc]
                initWithSource:[NSString stringWithFormat:@"assets://src/%@", file]
                         alias:@"__dev__"
                         extra:nil
        ];
        
        [self addChildViewController:doricViewController];
        [cell.contentView addSubview:doricViewController.view];
        
        doricViewController.view.translatesAutoresizingMaskIntoConstraints = NO;
        NSLayoutConstraint *leading = [NSLayoutConstraint constraintWithItem:doricViewController.view attribute:NSLayoutAttributeLeading relatedBy:NSLayoutRelationEqual toItem:cell.contentView attribute:NSLayoutAttributeLeading multiplier:1.0 constant:0.0];
        NSLayoutConstraint *trailing = [NSLayoutConstraint constraintWithItem:doricViewController.view attribute:NSLayoutAttributeTrailing relatedBy:NSLayoutRelationEqual toItem:cell.contentView attribute:NSLayoutAttributeTrailing multiplier:1.0 constant:0.0];
        NSLayoutConstraint *top = [NSLayoutConstraint constraintWithItem:doricViewController.view attribute:NSLayoutAttributeTop relatedBy:NSLayoutRelationEqual toItem:cell.contentView attribute:NSLayoutAttributeTop multiplier:1.0 constant:0.0];
        NSLayoutConstraint *bottom = [NSLayoutConstraint constraintWithItem:doricViewController.view attribute:NSLayoutAttributeBottom relatedBy:NSLayoutRelationEqual toItem:cell.contentView attribute:NSLayoutAttributeBottom multiplier:1.0 constant:0.0];
        
        [cell.contentView addConstraint:leading];
        [cell.contentView addConstraint:trailing];
        [cell.contentView addConstraint:top];
        [cell.contentView addConstraint:bottom];
        
        [doricViewController didMoveToParentViewController:self];
        [doricViewController.view layoutIfNeeded];
    } else {
        //TODO at here to handle data bind
    }
    return cell;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
    return 300;
}

@end
