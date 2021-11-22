//
// Created by pengfei.zhou on 2021/11/19.
//

#import <Foundation/Foundation.h>
#import <JavaScriptCore/JavaScriptCore.h>

@interface JSValue (Doric)
- (BOOL)isArrayBuffer;

- (NSData *)toArrayBuffer;
@end