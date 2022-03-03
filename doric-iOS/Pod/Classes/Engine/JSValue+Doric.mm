//
// Created by pengfei.zhou on 2021/11/19.
//

#import "JSValue+Doric.h"
#import <vector>
#import <unordered_map>

enum ConversionType {
    ContainerNone,
    ContainerArray,
    ContainerDictionary
};

class JSContainerConvertor {
public:
    struct Task {
        JSValueRef js;
        id objc;
        ConversionType type;
    };

    JSContainerConvertor(JSGlobalContextRef context)
            : m_context(context) {
    }

    id convert(JSValueRef property);

    void add(Task);

    Task take();

    bool isWorkListEmpty() const {
        return !m_worklist.size();
    }

private:
    JSGlobalContextRef m_context;
    std::unordered_map<JSValueRef, __unsafe_unretained id> m_objectMap;
    std::vector<Task> m_worklist;
};

static id containerValueToObject(JSGlobalContextRef context, JSContainerConvertor::Task task) {
    assert(task.type != ContainerNone);
    JSContainerConvertor convertor(context);
    convertor.add(task);
    assert(!convertor.isWorkListEmpty());

    do {
        JSContainerConvertor::Task current = convertor.take();
        assert(JSValueIsObject(context, current.js));
        JSObjectRef js = JSValueToObject(context, current.js, 0);

        if (current.type == ContainerArray) {
            assert([current.objc isKindOfClass:[NSMutableArray class]]);
            NSMutableArray *array = (NSMutableArray *) current.objc;

            auto lengthString = JSStringCreateWithUTF8CString("length");
            unsigned length = static_cast<unsigned int>(JSValueToNumber(context, JSObjectGetProperty(context, js, lengthString, 0), 0));
            JSStringRelease(lengthString);
            for (unsigned i = 0; i < length; ++i) {
                id objc = convertor.convert(JSObjectGetPropertyAtIndex(context, js, i, 0));
                [array addObject:objc ? objc : [NSNull null]];
            }
        } else {
            assert([current.objc isKindOfClass:[NSMutableDictionary class]]);
            NSMutableDictionary *dictionary = (NSMutableDictionary *) current.objc;
            JSPropertyNameArrayRef propertyNameArray = JSObjectCopyPropertyNames(context, js);
            size_t length = JSPropertyNameArrayGetCount(propertyNameArray);
            for (size_t i = 0; i < length; ++i) {
                JSStringRef propertyName = JSPropertyNameArrayGetNameAtIndex(propertyNameArray, i);
                if (id objc = convertor.convert(JSObjectGetProperty(context, js, propertyName, 0))) {
                    CFStringRef cfString = JSStringCopyCFString(kCFAllocatorDefault, propertyName);
                    NSString *key = (__bridge NSString *) cfString;
                    dictionary[key] = objc;
                    CFRelease(cfString);
                }
            }
            JSPropertyNameArrayRelease(propertyNameArray);
        }

    } while (!convertor.isWorkListEmpty());

    return task.objc;
}

static JSContainerConvertor::Task valueToObjectWithoutCopy(JSGlobalContextRef context, JSValueRef value) {
    if (!JSValueIsObject(context, value)) {
        id primitive;
        if (JSValueIsBoolean(context, value))
            primitive = JSValueToBoolean(context, value) ? @YES : @NO;
        else if (JSValueIsNumber(context, value)) {
            // Normalize the number, so it will unique correctly in the hash map -
            // it's nicer not to leak this internal implementation detail!
            value = JSValueMakeNumber(context, JSValueToNumber(context, value, 0));
            primitive = @(JSValueToNumber(context, value, 0));
        } else if (JSValueIsString(context, value)) {
            // Would be nice to unique strings, too.
            JSStringRef jsString = JSValueToStringCopy(context, value, 0);
            primitive = CFBridgingRelease(JSStringCopyCFString(kCFAllocatorDefault, jsString));
            JSStringRelease(jsString);
        } else if (JSValueIsNull(context, value)) {
            primitive = [NSNull null];
        } else {
            primitive = nil;
        }
        return {value, primitive, ContainerNone};
    }

    JSObjectRef object = JSValueToObject(context, value, 0);
    JSTypedArrayType type = JSValueGetTypedArrayType(context, value, NULL);
    if (type == kJSTypedArrayTypeArrayBuffer) {
        size_t size = JSObjectGetArrayBufferByteLength(context, object, NULL);
        void *ptr = JSObjectGetArrayBufferBytesPtr(context, object, NULL);
        id primitive = [[NSData alloc] initWithBytesNoCopy:ptr length:size freeWhenDone:NO];
        return {value, primitive, ContainerNone};
    }
    if (JSValueIsArray(context, value))
        return {object, [NSMutableArray array], ContainerArray};

    return {object, [NSMutableDictionary dictionary], ContainerDictionary};
}

@implementation JSValue (Doric)


inline id JSContainerConvertor::convert(JSValueRef value) {
    auto iter = m_objectMap.find(value);
    if (iter != m_objectMap.end()) {
        return iter->second;
    }

    Task result = valueToObjectWithoutCopy(m_context, value);
    if (result.js)
        add(result);
    return result.objc;
}

void JSContainerConvertor::add(Task task) {
    if (task.type != ContainerNone)
        m_worklist.push_back(task);
    else
        m_objectMap.insert({task.js, task.objc});

}

JSContainerConvertor::Task JSContainerConvertor::take() {
    assert(!isWorkListEmpty());
    Task last = m_worklist.back();
    m_worklist.pop_back();
    return last;
}


id valueToObject(JSContext *context, JSValueRef value) {
    JSContainerConvertor::Task result = valueToObjectWithoutCopy([context JSGlobalContextRef], value);
    if (result.type == ContainerNone)
        return result.objc;
    return containerValueToObject([context JSGlobalContextRef], result);
}

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

- (id)toObjectWithArrayBuffer {
    return valueToObject(self.context, self.JSValueRef);
}

@end
