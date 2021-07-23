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
    if (self.expanded) {
        if ([self.name hasPrefix:@"Call"]) {
            if ([self.name componentsSeparatedByString:@","].count > 1) {
                return 40 + 5 + 16 + 5 + 16 + 5 + 16 + 10;
            } else {
                return 40 + 5 + 16 + 5 + 16 + 10;
            }
        } else {
            return 40 + 5 + 16 + 10;
        }
    }
    return 40;
}
@end

@interface DoricDevAnchorCell : UITableViewCell
@property(nonatomic, strong) UILabel *labelName;
@property(nonatomic, strong) UILabel *funcName;
@property(nonatomic, strong) UILabel *argumentName;
@property(nonatomic, strong) UILabel *costTime;
@property(nonatomic, strong) UIView *expandedView;
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
        self.expandedView = [[UIView new] also:^(UIView *it) {
            it.backgroundColor = DoricColor(@(0x0f000000));
            [self.contentView addSubview:it];
        }];
        self.funcName = [[UILabel new] also:^(UILabel *it) {
            it.font = [UIFont systemFontOfSize:12];
            it.textColor = [UIColor blackColor];
            [self.expandedView addSubview:it];
        }];
        self.argumentName = [[UILabel new] also:^(UILabel *it) {
            it.font = [UIFont systemFontOfSize:12];
            it.textColor = [UIColor blackColor];
            [self.expandedView addSubview:it];
        }];
        self.costTime = [[UILabel new] also:^(UILabel *it) {
            it.font = [UIFont systemFontOfSize:12];
            it.textColor = [UIColor blackColor];
            [self.expandedView addSubview:it];
        }];
    }
    return self;
}

- (void)refreshUI:(DoricDevAnchorItem *)anchorItem {
    self.contentView.width = self.width;
    self.contentView.height = [anchorItem cellHeight];
    self.labelName.left = 15;
    self.labelName.centerY = 20;

    self.waterfallPrepared.centerY = 20;
    self.waterfallWorked.centerY = 20;
    CGFloat all = self.width - 15 - self.labelName.width - 15 - 15;
    self.waterfallPrepared.left = self.labelName.right + 15 + ((CGFloat) anchorItem.position / (CGFloat) self.duration) * all;
    self.waterfallPrepared.width = ((CGFloat) anchorItem.prepared / (CGFloat) self.duration) * all;
    self.waterfallWorked.left = self.waterfallPrepared.right;
    self.waterfallWorked.width = ((CGFloat) MAX(anchorItem.worked, 1) / (CGFloat) self.duration) * all;

    self.expandedView.hidden = anchorItem.expanded ? NO : YES;
    self.expandedView.width = self.width - 15;
    self.expandedView.left = 15;
    self.expandedView.top = 40;
    self.costTime.text = [NSString stringWithFormat:@"%@ ms", @(anchorItem.prepared + anchorItem.worked)];
    self.costTime.width = self.expandedView.width - 15;
    self.costTime.left = 15;
    self.costTime.height = 16;

    if ([anchorItem.name hasPrefix:@"Call"]) {
        self.labelName.text = @"Call";
        self.labelName.backgroundColor = DoricColor(@(0xff3498db));
        NSString *extraInfo = [anchorItem.name substringFromIndex:@"Call:".length];
        NSRange range = [extraInfo rangeOfString:@","];
        if (range.location != NSNotFound) {
            NSUInteger location = range.location;
            NSString *method = [extraInfo substringToIndex:location];
            NSString *params = [extraInfo substringFromIndex:location + 1];

            self.expandedView.height = 5 + 16 + 5 + 16 + 5 + 16;
            [self.funcName also:^(UILabel *it) {
                it.hidden = NO;
                it.text = method;
                it.width = self.expandedView.width - 15;
                it.height = 16;
                it.left = 15;
            }];

            [self.argumentName also:^(UILabel *it) {
                it.hidden = NO;
                it.text = [params stringByReplacingOccurrencesOfString:@"\n" withString:@"\t"];
                it.width = self.expandedView.width - 15;
                it.height = 16;
                it.left = 15;
            }];

            self.funcName.top = 5;
            self.argumentName.top = self.funcName.bottom + 5;
            self.costTime.top = self.argumentName.bottom + 5;
        } else {
            self.expandedView.height = 5 + 16 + 5 + 16;
            self.argumentName.hidden = YES;
            [self.funcName also:^(UILabel *it) {
                it.hidden = NO;
                it.text = extraInfo;
                it.width = self.expandedView.width - 15;
                it.height = 16;
                it.left = 15;
            }];

            self.funcName.top = 5;
            self.costTime.top = self.funcName.bottom + 5;
        }
    } else {
        self.expandedView.height = 5 + 16;
        if ([anchorItem.name isEqualToString:@"Render"]) {
            self.labelName.backgroundColor = DoricColor(@(0xffe74c3c));
        } else {
            self.labelName.backgroundColor = DoricColor(@(0xff2ecc71));
        }
        self.labelName.text = anchorItem.name;
        self.funcName.hidden = YES;
        self.argumentName.hidden = YES;
        self.costTime.top = 5;
    }
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
        it.userInteractionEnabled = YES;
        [self.headerView addSubview:it];
        UITapGestureRecognizer *tapGestureRecognizer = [[UITapGestureRecognizer alloc]
                initWithTarget:self
                        action:@selector(onRightButtonClicked)];
        [it addGestureRecognizer:tapGestureRecognizer];
    }];
    self.rightButton.right = self.headerView.right - 15;
    self.rightButton.centerY = self.headerView.centerY;
    self.tableView = [[UITableView new] also:^(UITableView *it) {
        it.width = self.view.width;
        it.height = self.view.height - self.headerView.height;
        it.delegate = self;
        it.dataSource = self;
        it.separatorStyle = UITableViewCellSeparatorStyleNone;
        [self.view addSubview:it];
    }];
    self.tableView.top = self.headerView.bottom;
    self.tableView.backgroundColor = DoricColor(@(0xffeeeeee));
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
    cell.backgroundColor = position % 2 == 0 ? DoricColor(@(0x2ff1c40f)) : DoricColor(@(0x2f2ecc71));
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

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    NSUInteger position = (NSUInteger) indexPath.row;
    self.anchorItems[position].expanded = !self.anchorItems[position].expanded;
    [tableView reloadData];
    [self updateButton];
}

- (BOOL)allExpanded {
    for (DoricDevAnchorItem *item in self.anchorItems) {
        if (!item.expanded) {
            return NO;
        }
    }
    return YES;
}

- (void)updateButton {
    self.rightButton.text = self.allExpanded ? @"Collapse[-]" : @"Expand[+]";
    [self.rightButton sizeToFit];
    self.rightButton.right = self.view.width - 15;
}

- (void)onRightButtonClicked {
    if (self.allExpanded) {
        [self.anchorItems forEach:^(DoricDevAnchorItem *obj) {
            obj.expanded = NO;
        }];
    } else {
        [self.anchorItems forEach:^(DoricDevAnchorItem *obj) {
            obj.expanded = YES;
        }];
    }
    [self updateButton];
    [self.tableView reloadData];
}
@end
