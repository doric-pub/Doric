//
// Created by pengfei.zhou on 2021/11/19.
//

#import "JSValue+Doric.h"

@implementation JSValue (Doric)
- (BOOL)isArrayBuffer {
    JSContextRef ctx = self.context.JSGlobalContextRef;
    JSValueRef jsValueRef = self.JSValueRef;
    if (self.isObject) {
        JSTypedArrayType type = JSValueGetTypedArrayType(ctx, jsValueRef, NULL);
        return type == kJSTypedArrayTypeArrayBuffer;
    }
    return NO;
}

- (NSData *)toArrayBuffer {
    if (!self.isArrayBuffer) {
        return nil;
    }
    JSContextRef ctx = self.context.JSGlobalContextRef;
    JSValueRef jsValueRef = self.JSValueRef;
    JSObjectRef ref = JSValueToObject(ctx, jsValueRef, NULL);
    size_t size = JSObjectGetArrayBufferByteLength(ctx, ref, NULL);
    void *ptr = JSObjectGetArrayBufferBytesPtr(ctx, ref, NULL);

    return [[NSData alloc] initWithBytesNoCopy:ptr length:size freeWhenDone:NO];
}

@end
