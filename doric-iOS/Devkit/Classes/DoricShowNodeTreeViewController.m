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
//  DoricShowNodeTreeViewController.m
//  Doric
//
//  Created by jingpeng.wang on 2021/7/8.
//
#import "DoricShowNodeTreeViewController.h"
#import "DoricShowNodeTreeViewCell.h"

#import "RATreeView.h"
#import <DoricCore/DoricContextManager.h>
#import <DoricCore/DoricContext.h>
#import <DoricCore/DoricGroupNode.h>
#import <DoricCore/DoricRootNode.h>
#import <DoricCore/DoricSuperNode.h>

@interface DoricShowNodeTreeViewController () <RATreeViewDelegate, RATreeViewDataSource>
@property(nonatomic, weak) DoricContext *doricContext;
@end

@implementation DoricShowNodeTreeViewController

- (void)viewDidLoad {
    [super viewDidLoad];

    self.doricContext = [[DoricContextManager instance] getContext:self.contextId];

    RATreeView *treeView = [[RATreeView alloc] initWithFrame:self.view.bounds];
    [self.view addSubview:treeView];

    treeView.delegate = self;
    treeView.dataSource = self;
    [treeView registerClass:DoricShowNodeTreeViewCell.self forCellReuseIdentifier:@"cell"];
    [treeView reloadData];
}


#pragma mark ratreeview delegate

- (nonnull UITableViewCell *)treeView:(nonnull RATreeView *)treeView cellForItem:(nullable id)item {
    DoricShowNodeTreeViewCell *cell = [treeView dequeueReusableCellWithIdentifier:@"cell"];
    DoricViewNode *viewNode = (DoricViewNode *) item;

    NSString *type = viewNode.type;
    if ([item isKindOfClass:[DoricRootNode class]]) {
        type = @"Root";
    }

    NSString *viewId = [[@" <" stringByAppendingString:viewNode.viewId] stringByAppendingString:@"> "];

    NSString *value = [type stringByAppendingString:viewId];
    if ([item isKindOfClass:[DoricGroupNode class]]) {
        DoricGroupNode *groupNode = item;
        NSString *childDesc = [[@"(" stringByAppendingString:[@(groupNode.childNodes.count) stringValue]] stringByAppendingString:@" Child)"];
        value = [value stringByAppendingString:childDesc];
    } else if ([item isKindOfClass:[DoricSuperNode class]]) {
        DoricSuperNode *superNode = item;
        NSArray *viewIds = [superNode getSubNodeViewIds];
        NSString *childDesc = [[@"(" stringByAppendingString:[@(viewIds.count) stringValue]] stringByAppendingString:@" Child)"];
        value = [value stringByAppendingString:childDesc];
    }

    cell.nodeNameLabel.text = value;
    [cell.nodeNameLabel sizeToFit];

    NSInteger indent = [treeView levelForCellForItem:item];
    cell.nodeIcon.left = 5 + indent * 15;
    cell.nodeNameLabel.left = 30 + indent * 15;

    return cell;
}

- (nonnull id)treeView:(nonnull RATreeView *)treeView child:(NSInteger)index ofItem:(nullable id)item {
    if (item == nil) {
        return self.doricContext.rootNode;
    } else if ([item isKindOfClass:[DoricGroupNode class]]) {
        DoricGroupNode *groupNode = item;
        return groupNode.childNodes[index];
    } else if ([item isKindOfClass:[DoricSuperNode class]]) {
        DoricSuperNode *superNode = item;
        NSArray *viewIds = [superNode getSubNodeViewIds];
        return [superNode subNodeWithViewId:viewIds[index]];
    }
    return nil;
}

- (NSInteger)treeView:(nonnull RATreeView *)treeView numberOfChildrenOfItem:(nullable id)item {
    if (item == nil) {
        return 1;
    } else if ([item isKindOfClass:[DoricGroupNode class]]) {
        DoricGroupNode *groupNode = item;
        return groupNode.childNodes.count;
    } else if ([item isKindOfClass:[DoricSuperNode class]]) {
        DoricSuperNode *superNode = item;
        return [superNode getSubNodeViewIds].count;
    }
    return 0;
}

- (CGFloat)treeView:(RATreeView *)treeView heightForRowForItem:(id)item {
    return 50;
}
@end
