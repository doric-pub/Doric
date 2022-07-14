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
#import<CommonCrypto/CommonDigest.h>

#import "DoricDev.h"
#import "DoricDevViewController.h"
#import "QRScanViewController.h"
#import "DoricDebugDriver.h"
#import "DoricSnapshotView.h"
#import "DoricShowNodeTreeViewController.h"
#import "DoricRegistry.h"
#import "DoricSnapshotView.h"
#import "DoricDevPerfVC.h"

@interface DoricContextCell : UITableViewCell
@property(nonatomic, strong) UILabel *tvId;
@property(nonatomic, strong) UILabel *tvSource;
@property(nonatomic, strong) UIView *vBtn;
@property(nonatomic, strong) UIImageView *ivDebug;
@property(nonatomic, weak) DoricContext *doricContext;
@property(nonatomic, weak) UIViewController *vc;
@end

@implementation DoricContextCell
- (instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier {
    if (self = [super initWithStyle:style reuseIdentifier:reuseIdentifier]) {
        self.tvId = [[UILabel new] also:^(UILabel *it) {
            it.width = 50;
            it.textAlignment = NSTextAlignmentCenter;
            it.font = [UIFont systemFontOfSize:20];
            it.textColor = [UIColor blackColor];
            it.left = 0;
            [self.contentView addSubview:it];
        }];
        self.tvSource = [[UILabel new] also:^(UILabel *it) {
            it.textAlignment = NSTextAlignmentCenter;
            it.font = [UIFont systemFontOfSize:20];
            it.textColor = [UIColor blackColor];
            [self.contentView addSubview:it];
        }];
        self.vBtn = [[UIView new] also:^(UIView *it) {
            it.width = 60;
            it.height = 60;
            [self.contentView addSubview:it];
            UITapGestureRecognizer *tapGestureRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(onClick)];
            [it addGestureRecognizer:tapGestureRecognizer];
        }];
        self.ivDebug = [[UIImageView new] also:^(UIImageView *it) {
            it.width = 20;
            it.height = 20;
            it.centerX = self.vBtn.width / 2;
            it.centerY = self.vBtn.height / 2;
            it.contentMode = UIViewContentModeScaleToFill;
            [self.vBtn addSubview:it];
        }];
    }
    return self;
}

- (NSString *)md5:(NSString *)input {
    const char *cStr = [input UTF8String];
    unsigned char digest[CC_MD5_DIGEST_LENGTH];
    CC_MD5(cStr, (CC_LONG) strlen(cStr), digest);

    NSMutableString *output = [NSMutableString stringWithCapacity:CC_MD5_DIGEST_LENGTH * 2];
    for (int i = 0; i < CC_MD5_DIGEST_LENGTH; i++) {
        [output appendFormat:@"%02x", digest[i]];
    }
    return output;

}

- (void)onClick {
    UIAlertController *alertController = [[UIAlertController alloc] init];
    UIAlertAction *cancel = [UIAlertAction actionWithTitle:NSLocalizedString(@"Cancel", nil) style:UIAlertActionStyleCancel handler:nil];
    UIAlertAction *viewSource = [UIAlertAction actionWithTitle:@"View source" style:UIAlertActionStyleDefault handler:^(UIAlertAction *_) {
        UIAlertController *alert = [UIAlertController alertControllerWithTitle:[NSString stringWithFormat:@"View source: %@", self.doricContext.source]
                                                                       message:[NSString stringWithFormat:@"Size:%@\nMD5:%@\nScript:\n%@",
                                                                                                          @(self.doricContext.script.length),
                                                                                                          [self md5:self.doricContext.script],
                                                                                                          self.doricContext.script]
                                                                preferredStyle:
                                                                        UIAlertControllerStyleAlert];
        UIAlertAction *action = [UIAlertAction actionWithTitle:NSLocalizedString(@"OK", nil)
                                                         style:UIAlertActionStyleDefault
                                                       handler:nil];
        [alert addAction:action];
        [self.vc presentViewController:alert animated:YES completion:nil];
    }];
    [alertController addAction:cancel];
    [alertController addAction:viewSource];


    if (DoricDev.instance.isInDevMode) {
        if ([self.doricContext.driver isKindOfClass:DoricDebugDriver.class]) {
            UIAlertAction *stopDebugging = [UIAlertAction actionWithTitle:@"Stop debugging" style:UIAlertActionStyleDefault handler:^(UIAlertAction *_) {
                [DoricDev.instance stopDebugging:YES];
            }];
            [alertController addAction:stopDebugging];
        } else {
            UIAlertAction *startDebugging = [UIAlertAction actionWithTitle:@"Start debugging" style:UIAlertActionStyleDefault handler:^(UIAlertAction *_) {
                [DoricDev.instance requestDebugging:self.doricContext];
            }];
            [alertController addAction:startDebugging];
        }
    }
    if ([Doric isEnableRenderSnapshot]) {
        UIAlertAction *snapshot = [UIAlertAction actionWithTitle:@"Snapshot" style:UIAlertActionStyleDefault handler:^(UIAlertAction *_) {
            DoricSnapshotView *doricSnapshotView = [[DoricSnapshotView alloc] initWithDoricContext:self.doricContext];
            doricSnapshotView.top = 50;
            [self.doricContext.vc.view addSubview:doricSnapshotView];
            [self.vc.navigationController popViewControllerAnimated:NO];
        }];
        [alertController addAction:snapshot];
    }

    if ([Doric isEnablePerformance]) {
        UIAlertAction *performanceAction = [UIAlertAction
                actionWithTitle:@"Performance"
                          style:UIAlertActionStyleDefault
                        handler:^(UIAlertAction *_) {
                            DoricDevPerfVC *doricDevPerfVc = [[DoricDevPerfVC alloc] initWithContextId:self.doricContext.contextId];
                            UIViewController *viewController = [UIApplication sharedApplication].delegate.window.rootViewController;
                            UINavigationController *navigationController;
                            if ([viewController isKindOfClass:[UINavigationController class]]) {
                                navigationController = (UINavigationController *) viewController;
                            } else {
                                navigationController = viewController.navigationController;
                            }
                            [navigationController pushViewController:doricDevPerfVc animated:NO];
                        }];
        [alertController addAction:performanceAction];
    }

    UIAlertAction *showNodeTree = [UIAlertAction actionWithTitle:@"View node tree" style:UIAlertActionStyleDefault handler:^(UIAlertAction *_) {
        DoricShowNodeTreeViewController *doricShowNodeTreeViewController = [[DoricShowNodeTreeViewController alloc] init];
        doricShowNodeTreeViewController.contextId = self.doricContext.contextId;

        UIViewController *viewController = [UIApplication sharedApplication].delegate.window.rootViewController;
        UINavigationController *navigationController;
        if ([viewController isKindOfClass:[UINavigationController class]]) {
            navigationController = (UINavigationController *) viewController;
        } else {
            navigationController = viewController.navigationController;
        }
        [navigationController pushViewController:doricShowNodeTreeViewController animated:NO];
    }];
    [alertController addAction:showNodeTree];

    [self.vc presentViewController:alertController animated:true completion:nil];
}
@end

@interface DoricDevViewController () <UITableViewDelegate, UITableViewDataSource, DoricDevStatusCallback>
@property(nonatomic, strong) UIView *headerView;
@property(nonatomic, strong) UILabel *tvLabel;
@property(nonatomic, strong) UILabel *tvConnection;
@property(nonatomic, strong) UILabel *tvInput;
@property(nonatomic, strong) UILabel *tvScan;
@property(nonatomic, strong) UILabel *tvDisconnect;
@property(nonatomic, strong) UILabel *tvSnapshot;
@property(nonatomic, strong) UILabel *tvPerformance;
@property(nonatomic, strong) UISwitch *switchSnapshot;
@property(nonatomic, strong) UISwitch *switchPerformance;
@property(nonatomic, strong) UITableView *listView;

@end

@implementation DoricDevViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.title = @"Doric Devkit";
    self.edgesForExtendedLayout = UIRectEdgeNone;
    self.view.backgroundColor = UIColor.whiteColor;
    self.headerView = [[UIView new] also:^(UIView *it) {
        it.width = self.view.width;
        it.height = 140;
        it.backgroundColor = DoricColor(@(0xff70a1ff));
        [self.view addSubview:it];
    }];
    self.tvLabel = [[UILabel new] also:^(UILabel *it) {
        it.text = @"Devkit";
        it.textColor = [UIColor whiteColor];
        it.font = [UIFont systemFontOfSize:30];
        it.textAlignment = NSTextAlignmentCenter;
        [it sizeToFit];
        it.centerY = self.headerView.centerY;
        it.left = 15;
        [self.headerView addSubview:it];
    }];
    self.tvConnection = [[UILabel new] also:^(UILabel *it) {
        it.text = @"Disconnected";
        it.textColor = [UIColor whiteColor];
        it.font = [UIFont systemFontOfSize:12];
        it.textAlignment = NSTextAlignmentCenter;
        [it sizeToFit];
        [self.headerView addSubview:it];
    }];
    self.tvInput = [[UILabel new] also:^(UILabel *it) {
        it.text = @"Input";
        it.textColor = [UIColor whiteColor];
        it.font = [UIFont systemFontOfSize:15];
        it.textAlignment = NSTextAlignmentCenter;
        [it sizeToFit];
        it.width += 30;
        it.height += 10;
        it.backgroundColor = DoricColor(@(0xff1abc9c));
        [self.headerView addSubview:it];
        it.userInteractionEnabled = YES;
        UITapGestureRecognizer *tapGestureRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(input)];
        [it addGestureRecognizer:tapGestureRecognizer];
    }];
    self.tvScan = [[UILabel new] also:^(UILabel *it) {
        it.text = @"Scan";
        it.textColor = [UIColor whiteColor];
        it.font = [UIFont systemFontOfSize:15];
        it.textAlignment = NSTextAlignmentCenter;
        [it sizeToFit];
        it.width += 30;
        it.height += 10;
        it.backgroundColor = DoricColor(@(0xff1abc9c));
        [self.headerView addSubview:it];
        it.userInteractionEnabled = YES;
        UITapGestureRecognizer *tapGestureRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(scan)];
        [it addGestureRecognizer:tapGestureRecognizer];
    }];
    self.tvDisconnect = [[UILabel new] also:^(UILabel *it) {
        it.text = @"Disconnect";
        it.textColor = [UIColor whiteColor];
        it.font = [UIFont systemFontOfSize:15];
        it.textAlignment = NSTextAlignmentCenter;
        [it sizeToFit];
        it.width += 30;
        it.height += 10;
        it.backgroundColor = DoricColor(@(0xff95a5a6));
        [self.headerView addSubview:it];
        it.userInteractionEnabled = YES;
        UITapGestureRecognizer *tapGestureRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(disconnect)];
        [it addGestureRecognizer:tapGestureRecognizer];
    }];
    self.tvSnapshot = [[UILabel new] also:^(UILabel *it) {
        it.text = @"Record Snapshot";
        it.textColor = [UIColor whiteColor];
        it.font = [UIFont systemFontOfSize:15];
        it.textAlignment = NSTextAlignmentCenter;
        [it sizeToFit];
        [self.headerView addSubview:it];
    }];
    self.tvPerformance = [[UILabel new] also:^(UILabel *it) {
        it.text = @"Performance";
        it.textColor = [UIColor whiteColor];
        it.font = [UIFont systemFontOfSize:15];
        it.textAlignment = NSTextAlignmentCenter;
        [it sizeToFit];
        [self.headerView addSubview:it];
    }];
    self.switchSnapshot = [[UISwitch new] also:^(UISwitch *it) {
        [it addTarget:self action:@selector(onSnapshotSwitch) forControlEvents:UIControlEventValueChanged];
        [self.headerView addSubview:it];
    }];
    self.switchPerformance = [[UISwitch new] also:^(UISwitch *it) {
        [it addTarget:self action:@selector(onPerformanceSwitch) forControlEvents:UIControlEventValueChanged];
        [self.headerView addSubview:it];
    }];
    [self initHeaders];
    [self initList];
    [DoricDev.instance addStatusCallback:self];
}

- (void)onSnapshotSwitch {
    [Doric enableRenderSnapshot:self.switchSnapshot.isOn];
}

- (void)onPerformanceSwitch {
    [Doric enablePerformance:self.switchPerformance.isOn];
}

- (void)disconnect {
    [DoricDev.instance closeDevMode];
}

- (void)input {
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"Please input devkit ip"
                                                                   message:@""
                                                            preferredStyle:UIAlertControllerStyleAlert];
    [alert addTextFieldWithConfigurationHandler:^(UITextField *_Nonnull textField) {
        textField.placeholder = @"192.168.1.1";
        if (DoricDev.instance.ip) {
            textField.text = DoricDev.instance.ip;
        }
    }];
    __weak typeof(alert) _alert = alert;

    UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:NSLocalizedString(@"Cancel", nil)
                                                           style:UIAlertActionStyleDefault
                                                         handler:nil];
    [alert addAction:cancelAction];

    UIAlertAction *okAction = [UIAlertAction actionWithTitle:NSLocalizedString(@"Ok", nil)
                                                       style:UIAlertActionStyleDefault
                                                     handler:^(UIAlertAction *action) {
                                                         __strong typeof(_alert) alert = _alert;
                                                         NSString *ip = alert.textFields.lastObject.text;
                                                         [[DoricDev instance] connectDevKit:[NSString stringWithFormat:@"ws://%@:7777", ip]];
                                                     }];
    [alert addAction:okAction];

    [self presentViewController:alert animated:YES completion:nil];
}

- (void)scan {
    if (self.isSimulator) {
        NSString *result = @"127.0.0.1";
        [[DoricDev instance] connectDevKit:[NSString stringWithFormat:@"ws://%@:7777", result]];
        ShowToast([NSString stringWithFormat:@"Connected to %@", result], DoricGravityBottom);
    } else {
        [self.navigationController pushViewController:[QRScanViewController new] animated:NO];
    }
}

- (void)initHeaders {
    if (DoricDev.instance.isInDevMode) {
        self.tvConnection.text = DoricDev.instance.ip;
        self.tvInput.hidden = YES;
        self.tvScan.hidden = YES;
        self.tvDisconnect.hidden = NO;
        self.tvConnection.backgroundColor = DoricColor(@(0xff2ed573));

        [self.tvConnection sizeToFit];
        self.tvConnection.width += 20;
        self.tvConnection.height += 6;

        self.tvConnection.left = self.tvLabel.right + 20;
        self.tvDisconnect.right = self.view.width - 15;
        self.tvConnection.top = 15;
        self.tvDisconnect.top = 15;
    } else {
        self.tvConnection.text = @"Disconnected";
        self.tvInput.hidden = NO;
        self.tvScan.hidden = NO;
        self.tvDisconnect.hidden = YES;
        self.tvConnection.backgroundColor = DoricColor(@(0xffa4b0be));

        [self.tvConnection sizeToFit];
        self.tvConnection.width += 20;
        self.tvConnection.height += 6;

        self.tvConnection.left = self.tvLabel.right + 20;
        self.tvScan.right = self.view.width - 15;
        self.tvInput.right = self.tvScan.left - 10;

        self.tvConnection.top = 15;
        self.tvScan.top = 15;
        self.tvInput.top = 15;
    }
    self.tvSnapshot.left = self.tvLabel.right + 20;
    self.switchSnapshot.left = self.tvSnapshot.right + 20;
    self.switchSnapshot.top = self.tvConnection.bottom + 15;
    self.tvSnapshot.centerY = self.switchSnapshot.centerY;
    self.switchSnapshot.on = [Doric isEnableRenderSnapshot];

    self.tvPerformance.left = self.tvLabel.right + 20;
    self.switchPerformance.left = self.tvPerformance.right + 20;
    self.switchPerformance.top = self.switchSnapshot.bottom + 15;
    self.tvPerformance.centerY = self.switchPerformance.centerY;
    self.switchPerformance.on = [Doric isEnablePerformance];
}

- (void)initList {
    self.listView = [[UITableView new] also:^(UITableView *it) {
        it.width = self.view.width;
        it.height = self.view.height - self.headerView.height;
        it.top = self.headerView.height;
        it.backgroundColor = DoricColor(@(0xffdfe6e9));
        [self.view addSubview:it];
        it.delegate = self;
        it.dataSource = self;
        [it setSeparatorStyle:UITableViewCellSeparatorStyleNone];
    }];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    self.listView.height = self.view.height - self.headerView.height;
}

- (UIImage *)decodeImage:(BOOL)on {
    NSString *debugOff = @"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";
    NSString *debugOn = @"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";
    NSString *base64 = on ? debugOn : debugOff;
    NSData *imageData = [[NSData alloc] initWithBase64EncodedString:base64
                                                            options:NSDataBase64DecodingIgnoreUnknownCharacters];
    return [UIImage imageWithData:imageData];
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:
        (NSInteger)section {
    return [DoricContextManager.instance aliveContexts].count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    DoricContextCell *cell = [tableView dequeueReusableCellWithIdentifier:@"cell"];
    if (cell == nil) {
        cell = [[DoricContextCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:@"cell"];
        cell.selectionStyle = UITableViewCellSelectionStyleNone;
    }
    DoricContext *context = [DoricContextManager.instance aliveContexts][(NSUInteger) indexPath.row];
    NSString *contextId = context.contextId;
    NSString *source = context.source;
    cell.doricContext = context;
    cell.contentView.width = tableView.width;
    cell.contentView.height = 60;
    cell.tvId.text = contextId;
    cell.tvSource.text = source;
    cell.ivDebug.image = [self decodeImage:DoricDev.instance.isInDevMode];
    [cell.tvId sizeToFit];
    [cell.tvSource sizeToFit];
    cell.tvId.centerY = cell.contentView.height / 2;
    cell.tvId.width = 50;
    cell.tvSource.centerY = cell.contentView.height / 2;
    cell.vBtn.centerY = cell.contentView.height / 2;
    cell.tvSource.width = cell.contentView.width - cell.tvId.width - cell.vBtn.width;
    cell.tvId.left = 0;
    cell.tvSource.left = cell.tvId.right;
    cell.vBtn.right = cell.contentView.width;
    cell.vc = self;
    cell.contentView.backgroundColor = indexPath.row % 2 == 0 ? DoricColor(@(0xffecf0f1)) : DoricColor(@(0xffbdc3c7));
    if ([DoricDev.instance isReloadingContext:context]) {
        cell.contentView.backgroundColor = DoricColor(@(0xffffeaa7));
    }
    if ([context.driver isKindOfClass:DoricDebugDriver.class]) {
        cell.contentView.backgroundColor = DoricColor(@(0xfffab1a0));
    }
    return cell;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
    return 60.f;
}

- (BOOL)isSimulator {
    return TARGET_OS_SIMULATOR == 1;
}


- (void)onOpen:(NSString *)url {
    [self initHeaders];
    [self.listView reloadData];
}

- (void)onClose:(NSString *)url {
    [self initHeaders];
    [self.listView reloadData];
}

- (void)onFailure:(NSError *)error {
    [self initHeaders];
    [self.listView reloadData];
}

- (void)onReload:(DoricContext *)context
          script:
                  (NSString *)script {
    [self.listView reloadData];
}

- (void)onStartDebugging:(DoricContext *)context {
    [self.listView reloadData];
}

- (void)onStopDebugging {
    [self.listView reloadData];
}


@end
