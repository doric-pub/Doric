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
//  QRScanViewController.m
//  Doric
//
//  Created by jingpeng.wang on 2020/2/25.
//

#import "QRScanViewController.h"
#import <AVFoundation/AVFoundation.h>
#import <DoricCore/Doric.h>
#import <DoricDevkit/DoricDev.h>

@interface QRScanViewController () <AVCaptureMetadataOutputObjectsDelegate>
@property(strong, nonatomic) AVCaptureDevice *device;
@property(strong, nonatomic) AVCaptureDeviceInput *input;
@property(strong, nonatomic) AVCaptureMetadataOutput *output;
@property(strong, nonatomic) AVCaptureSession *session;
@property(strong, nonatomic) AVCaptureVideoPreviewLayer *previewLayer;
@property(strong, nonatomic) UIPinchGestureRecognizer *pinchGes;
@property(assign, nonatomic) CGFloat scanRegion_W;
@property(assign, nonatomic) CGFloat initScale;
@end

@implementation QRScanViewController
- (void)viewDidLoad {
    [super viewDidLoad];
    self.title = @"扫一扫";
    [self configBasicDevice];
    [self configPinchGes];
    [self.session startRunning];
}

- (void)configBasicDevice {
    self.device = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
    self.input = [[AVCaptureDeviceInput alloc] initWithDevice:self.device error:nil];
    self.output = [[AVCaptureMetadataOutput alloc] init];
    [self.output setMetadataObjectsDelegate:self queue:dispatch_get_main_queue()];
    self.session = [[AVCaptureSession alloc] init];
    [self.session setSessionPreset:AVCaptureSessionPresetHigh];
    if ([self.session canAddInput:self.input]) {
        [self.session addInput:self.input];
    }
    if ([self.session canAddOutput:self.output]) {
        [self.session addOutput:self.output];
    }
    [self.output setMetadataObjectTypes:@[AVMetadataObjectTypeQRCode]];
    [self.output setRectOfInterest:CGRectMake(0, 0, 1, 1)];
    self.previewLayer = [[AVCaptureVideoPreviewLayer alloc] initWithSession:self.session];
    self.previewLayer.frame = CGRectMake(0, 0, self.view.width, self.view.height);
    self.previewLayer.videoGravity = AVLayerVideoGravityResizeAspectFill;
    [self.view.layer addSublayer:self.previewLayer];
}

- (void)configPinchGes {
    self.pinchGes = [[UIPinchGestureRecognizer alloc] initWithTarget:self action:@selector(pinchDetected:)];
    [self.view addGestureRecognizer:self.pinchGes];
}

- (void)pinchDetected:(UIPinchGestureRecognizer *)recogniser {
    if (!_device) {
        return;
    }
    if (recogniser.state == UIGestureRecognizerStateBegan) {
        _initScale = _device.videoZoomFactor;
    }
    NSError *error = nil;
    [_device lockForConfiguration:&error];
    if (!error) {
        CGFloat zoomFactor;
        CGFloat scale = recogniser.scale;
        if (scale < 1.0f) {
            zoomFactor = self.initScale - pow(self.device.activeFormat.videoMaxZoomFactor, 1.0f - recogniser.scale);
        } else {
            zoomFactor = self.initScale + pow(self.device.activeFormat.videoMaxZoomFactor, (recogniser.scale - 1.0f) / 2.0f);
        }
        zoomFactor = MIN(15.0f, zoomFactor);
        zoomFactor = MAX(1.0f, zoomFactor);
        _device.videoZoomFactor = zoomFactor;
        [_device unlockForConfiguration];
    }
}

#pragma mark - AVCaptureMetadataOutputObjectsDelegate

- (void)captureOutput:(AVCaptureOutput *)captureOutput didOutputMetadataObjects:(NSArray *)metadataObjects fromConnection:(AVCaptureConnection *)connection {
    [self.session stopRunning];
    if ([metadataObjects count] >= 1) {
        AVMetadataMachineReadableCodeObject *qrObject = [metadataObjects lastObject];
        NSString *result = qrObject.stringValue;
        NSLog(@"Scan result is %@", result);
        [[DoricDev instance] connectDevKit:[NSString stringWithFormat:@"ws://%@:7777", result]];
        ShowToast([NSString stringWithFormat:@"Connected to %@", result], DoricGravityBottom);
        [self.navigationController popViewControllerAnimated:NO];
    }
}
@end
