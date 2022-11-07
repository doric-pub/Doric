//
//  DemoSSRVC.m
//  Example
//
//  Created by pengfei.zhou on 2022/11/7.
//  Copyright © 2022 pengfei.zhou. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "DemoSSRVC.h"
#import <DoricCore/Doric.h>
#import <JavaScriptCore/JavaScriptCore.h>

@interface DemoSSRVC ()
@property(nonatomic, copy) NSString *filePath;
@end

@implementation DemoSSRVC
- (instancetype)initWithPath:(NSString *)filePath {
    if (self = [self init]) {
        _filePath = filePath;
    }
    return self;
}

- (void)viewDidLoad {
    self.title = self.filePath;
    self.view.backgroundColor = [UIColor whiteColor];
    NSString *path = [[NSBundle mainBundle] bundlePath];
    NSString *demoPath = [path stringByAppendingPathComponent:@"src"];
    NSString *fullPath = [demoPath stringByAppendingPathComponent:self.filePath];
    NSString *jsContent = [NSString stringWithContentsOfFile:fullPath encoding:NSUTF8StringEncoding error:nil];
    DoricContext *context = [[DoricContext alloc] initWithScript:@"" source:@"" extra:@""];
    DoricRootNode *rootNode = [[DoricRootNode alloc] initWithContext:context];
    [rootNode setupRootView:[[DoricRootView new] also:^(DoricRootView *it) {
        it.width = self.view.width;
        it.height = self.view.height;
        it.clipsToBounds = YES;
        it.frameChangedBlock = ^(CGSize oldSize, CGSize newSize) {
            NSLog(@"frameChangedBlock:%@,%@", @(oldSize), @(newSize));
        };
        [self.view addSubview:it];
    }]];
    [context setRootNode:rootNode];
    NSData *data = [jsContent dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *viewModels = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:NULL];
    [rootNode blend:[viewModels optObject:@"props"]];
    [rootNode requestLayout];
}

@end
