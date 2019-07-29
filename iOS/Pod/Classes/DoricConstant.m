//
//  DoricConstant.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/26.
//

#import "DoricConstant.h"

NSString * const DORIC_BUNDLE_SANDBOX = @"doric-sandbox";
NSString * const DORIC_BUNDLE_LIB = @"doric-lib";
NSString * const DORIC_MODULE_LIB = @"./index";


NSString * const INJECT_LOG = @"nativeLog";
NSString * const INJECT_REQUIRE = @"nativeRequire";
NSString * const INJECT_TIMER_SET = @"nativeSetTimer";
NSString * const INJECT_TIMER_CLEAR = @"nativeClearTimer";
NSString * const INJECT_BRIDGE = @"nativeBridge";

NSString * const TEMPLATE_CONTEXT_CREATE = @"Reflect.apply("
"function(doric,context,Entry,require,exports){" "\n"
"%@"   "\n"
"},doric.jsObtainContext(\"%@\"),["
"undefined,"
"doric.jsObtainContext(\"%@\"),"
"doric.jsObtainEntry(\"%@\"),"
"doric.__require__"
",{}"
"])";

NSString * const TEMPLATE_MODULE = @"Reflect.apply(doric.jsRegisterModule,this,["
"\"%@\","
"Reflect.apply(function(__module){"
"(function(module,exports,require){" "\n"
"%@" "\n"
"})(__module,__module.exports,doric.__require__);"
"\nreturn __module.exports;"
"},this,[{exports:{}}])"
"])";

NSString * const TEMPLATE_CONTEXT_DESTROY = @"doric.jsReleaseContext(\"%@\")";

NSString * const GLOBAL_DORIC = @"doric";

NSString * const DORIC_CONTEXT_RELEASE = @"jsReleaseContext";

NSString * const DORIC_CONTEXT_INVOKE = @"jsCallEntityMethod";

NSString * const DORIC_TIMER_CALLBACK = @"jsCallbackTimer";

NSString * const DORIC_BRIDGE_RESOLVE = @"jsCallResolve";

NSString * const DORIC_BRIDGE_REJECT = @"jsCallReject";

NSString * const DORIC_ENTITY_RESPONSE = @"__response__";
