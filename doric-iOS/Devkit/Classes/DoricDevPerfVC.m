/*
 * Copyright [2021] [Doric.Pub]
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
// Created by pengfei.zhou on 2021/7/20.
//

#import "DoricDevPerfVC.h"
#import <DoricCore/Doric.h>
#import <DoricCore/DoricContextManager.h>
#import "DoricDevPerformanceAnchorHook.h"

@interface DoricDevAnchorItem : NSObject
@property(nonatomic, copy) NSString *name;
@property(nonatomic, assign) long position;
@property(nonatomic, assign) long prepared;
@property(nonatomic, assign) long worked;
@property(nonatomic, assign) BOOL expanded;
@end

@implementation DoricDevAnchorItem
- (CGFloat)cellHeight {
    return 40;
}
@end

@interface DoricDevAnchorCell : UITableViewCell
@property(nonatomic, strong) UILabel *labelName;
@property(nonatomic, strong) UIView *waterfallPrepared;
@property(nonatomic, strong) UIView *waterfallWorked;
@property(nonatomic, assign) long duration;
@end

@implementation DoricDevAnchorCell
- (instancetype)initWithStyle:(UITableViewCellStyle)style
              reuseIdentifier:(NSString *)reuseIdentifier {
    if (self = [super initWithStyle:style reuseIdentifier:reuseIdentifier]) {
        self.selectionStyle = UITableViewCellSelectionStyleNone;
        self.labelName = [[UILabel new] also:^(UILabel *it) {
            it.font = [UIFont systemFontOfSize:16];
            it.width = 80;
            it.height = 25;
            it.backgroundColor = DoricColor(@(0xff3498db));
            it.textColor = [UIColor whiteColor];
            it.text = @"Destroy";
            it.textAlignment = NSTextAlignmentCenter;
            [self.contentView addSubview:it];
        }];
        self.waterfallPrepared = [[UIView new] also:^(UIView *it) {
            it.backgroundColor = DoricColor(@(0xff1abc9c));
            it.height = 20;
            [self.contentView addSubview:it];

        }];
        self.waterfallWorked = [[UIView new] also:^(UIView *it) {
            it.backgroundColor = DoricColor(@(0xfff1c40f));
            it.height = 20;
            [self.contentView addSubview:it];
        }];
    }
    return self;
}

- (void)refreshUI:(DoricDevAnchorItem *)anchorItem {
    self.contentView.width = self.width;
    self.contentView.height = [anchorItem cellHeight];
    self.labelName.left = 15;
    self.labelName.centerY = 20;
    if ([anchorItem.name hasPrefix:@"Call"]) {
        self.labelName.text = @"Call";
        self.labelName.backgroundColor = DoricColor(@(0xff3498db));
    } else {
        if ([anchorItem.name isEqualToString:@"Render"]) {
            self.labelName.backgroundColor = DoricColor(@(0xffe74c3c));
        } else {
            self.labelName.backgroundColor = DoricColor(@(0xff2ecc71));
        }
        self.labelName.text = anchorItem.name;
    }
    self.waterfallPrepared.centerY = 20;
    self.waterfallWorked.centerY = 20;
    CGFloat all = self.width - 15 - self.labelName.width - 15 - 15;
    self.waterfallPrepared.left = self.labelName.right + 15 + ((CGFloat) anchorItem.position / (CGFloat) self.duration) * all;
    self.waterfallPrepared.width = ((CGFloat) anchorItem.prepared / (CGFloat) self.duration) * all;
    self.waterfallWorked.left = self.waterfallPrepared.right;
    self.waterfallWorked.width = ((CGFloat) MAX(anchorItem.worked, 1) / (CGFloat) self.duration) * all;
}
@end

@interface DoricDevPerfVC () <UITableViewDelegate, UITableViewDataSource>
@property(nonatomic, weak) DoricContext *doricContext;
@property(nonatomic, strong) UILabel *rightButton;
@property(nonatomic, strong) UIView *headerView;
@property(nonatomic, strong) UITableView *tableView;
@property(nonatomic, strong) NSMutableArray<DoricDevAnchorItem *> *anchorItems;
@property(nonatomic, assign) long duration;
@end

@implementation DoricDevPerfVC
- (instancetype)initWithContextId:(NSString *)contextId {
    if (self = [super init]) {
        _doricContext = [DoricContextManager.instance getContext:contextId];
        _anchorItems = [NSMutableArray new];
        _duration = 1;
    }
    return self;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    self.title = @"Performance";
    self.view.backgroundColor = [UIColor whiteColor];
    self.headerView = [[UIView new] also:^(UIView *it) {
        it.width = self.view.width;
        it.height = 50.f;
        it.backgroundColor = DoricColor(@(0xff7f8c8d));
        [self.view addSubview:it];
    }];
    UILabel *label = [[UILabel new] also:^(UILabel *it) {
        it.textColor = [UIColor whiteColor];
        it.font = [UIFont systemFontOfSize:16];
        it.text = [NSString stringWithFormat:@"%@ <%@>",
                                             self.doricContext.source,
                                             self.doricContext.contextId];
        [it sizeToFit];
        [self.headerView addSubview:it];
    }];
    label.left = 15.f;
    label.centerY = self.headerView.centerY;
    self.rightButton = [[UILabel new] also:^(UILabel *it) {
        it.textColor = [UIColor whiteColor];
        it.font = [UIFont systemFontOfSize:16];
        it.text = @"Expand[+]";
        [it sizeToFit];
        [self.headerView addSubview:it];
    }];
    self.rightButton.right = self.headerView.right - 15;
    self.rightButton.centerY = self.headerView.centerY;
    self.tableView = [[UITableView new] also:^(UITableView *it) {
        it.width = self.view.width;
        it.height = self.view.height - self.headerView.height;
        it.delegate = self;
        it.dataSource = self;
        it.separatorStyle = UITableViewCellSeparatorStyleNone;
        it.allowsSelection = NO;
        [self.view addSubview:it];
    }];
    self.tableView.top = self.headerView.bottom;
    if ([self.doricContext.driver.registry.globalPerformanceAnchorHook
            isKindOfClass:DoricDevPerformanceAnchorHook.class]) {
        NSArray <DoricDevAnchorNode *> *nodes = [((DoricDevPerformanceAnchorHook *) self.doricContext.driver.registry.globalPerformanceAnchorHook)
                getAnchorNodeList:self.doricContext.contextId];
        DoricDevAnchorNode *prevNode = nil;
        long position = 0;
        for (DoricDevAnchorNode *node in nodes) {
            DoricDevAnchorItem *item = [DoricDevAnchorItem new];
            item.name = node.name;
            long gap = 0;
            if (prevNode) {
                gap = MIN(16, node.prepare - prevNode.end);
            }
            position += gap;
            item.position = position;
            item.prepared = node.start - node.prepare;
            item.worked = node.end - node.start;
            [self.anchorItems addObject:item];
            position += (node.end - node.prepare);
            prevNode = node;
        }
        self.duration = position;
    }
    [self.tableView reloadData];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    self.tableView.height = self.view.height - self.headerView.height;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    DoricDevAnchorCell *cell = [tableView dequeueReusableCellWithIdentifier:@"DoricDevAnchorCell"];
    if (!cell) {
        cell = [[DoricDevAnchorCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:@"DoricDevAnchorCell"];
    }
    cell.width = tableView.width;
    cell.duration = self.duration;
    NSUInteger position = (NSUInteger) indexPath.row;
    cell.backgroundColor = position % 2 == 0 ? DoricColor(@(0xffecf0f1)) : [UIColor whiteColor];
    [cell refreshUI:self.anchorItems[position]];
    return cell;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return self.anchorItems.count;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
    NSUInteger position = (NSUInteger) indexPath.row;
    return [self.anchorItems[position] cellHeight];
}
@end
