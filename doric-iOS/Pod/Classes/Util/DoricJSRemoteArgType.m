//
//  DoricJSRemoteArgType.m
//  Doric
//
//  Created by Insomnia on 2019/11/7.
//

#import "DoricJSRemoteArgType.h"
DoricJSRemoteArgType DoricargTypeWithArg(id arg) {    
    DoricJSRemoteArgType type = DoricJSRemoteArgTypeNil;
    if ([arg isKindOfClass:[NSNumber class]]) {
        type = DoricJSRemoteArgTypeNumber;
    }else if ([arg isKindOfClass:[NSString class]]) {
        type = DoricJSRemoteArgTypeString;
    }else if ([arg isKindOfClass:[NSDictionary class]]) {
        type = DoricJSRemoteArgTypeObject;
    }else if ([arg isKindOfClass:[NSMutableArray class]]) {
        type = DoricJSRemoteArgTypeArray;
    }
    return type;
}
