//
//  DoricJSRemoteArgType.h
//  Doric
//
//  Created by Insomnia on 2019/11/7.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSUInteger, DoricJSRemoteArgType) {
    DoricJSRemoteArgTypeNil = 0,
    DoricJSRemoteArgTypeNumber,
    DoricJSRemoteArgTypeBool,
    DoricJSRemoteArgTypeString,
    DoricJSRemoteArgTypeObject,
    DoricJSRemoteArgTypeArray,
};

DoricJSRemoteArgType DoricargTypeWithArg(id arg);


NS_ASSUME_NONNULL_END
