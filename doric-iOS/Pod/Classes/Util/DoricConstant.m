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
//  DoricConstant.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/26.
//

#import "DoricConstant.h"

NSString *const DORIC_BUNDLE_SANDBOX = @"doric-sandbox";
NSString *const DORIC_BUNDLE_LIB = @"doric-lib";
NSString *const DORIC_MODULE_LIB = @"doric";

NSString *const INJECT_ENVIRONMENT = @"Environment";

NSString *const INJECT_LOG = @"nativeLog";
NSString *const INJECT_REQUIRE = @"nativeRequire";
NSString *const INJECT_TIMER_SET = @"nativeSetTimer";
NSString *const INJECT_TIMER_CLEAR = @"nativeClearTimer";
NSString *const INJECT_BRIDGE = @"nativeBridge";

NSString *const TEMPLATE_CONTEXT_CREATE = @"Reflect.apply("
                                          "function(doric,context,Entry,require,exports){" "\n"
                                          "%@"   "\n"
                                          "},undefined,["
                                          "undefined,"
                                          "doric.jsObtainContext(\"%@\"),"
                                          "doric.jsObtainEntry(\"%@\"),"
                                          "doric.__require__"
                                          ",{}"
                                          "])";

NSString *const TEMPLATE_MODULE = @"Reflect.apply(doric.jsRegisterModule,this,["
                                  "\"%@\","
                                  "Reflect.apply(function(__module){"
                                  "(function(module,exports,require){" "\n"
                                  "%@" "\n"
                                  "})(__module,__module.exports,doric.__require__);"
                                  "\nreturn __module.exports;"
                                  "},this,[{exports:{}}])"
                                  "])";

NSString *const TEMPLATE_CONTEXT_DESTROY = @"doric.jsReleaseContext(\"%@\")";

NSString *const GLOBAL_DORIC = @"doric";

NSString *const DORIC_CONTEXT_RELEASE = @"jsReleaseContext";

NSString *const DORIC_CONTEXT_INVOKE = @"jsCallEntityMethod";

NSString *const DORIC_CONTEXT_INVOKE_PURE = @"pureCallEntityMethod";

NSString *const DORIC_TIMER_CALLBACK = @"jsCallbackTimer";

NSString *const DORIC_BRIDGE_RESOLVE = @"jsCallResolve";

NSString *const DORIC_BRIDGE_REJECT = @"jsCallReject";

NSString *const DORIC_HOOK_NATIVE_CALL = @"jsHookAfterNativeCall";

NSString *const DORIC_ENTITY_RESPONSE = @"__response__";

NSString *const DORIC_ENTITY_INIT = @"__init__";

NSString *const DORIC_ENTITY_CREATE = @"__onCreate__";

NSString *const DORIC_ENTITY_DESTROY = @"__onDestroy__";

NSString *const DORIC_ENTITY_SHOW = @"__onShow__";

NSString *const DORIC_ENTITY_HIDDEN = @"__onHidden__";

NSString *const DORIC_ENTITY_BUILD = @"__build__";

NSString *const DORIC_ENTITY_ENV_CHANGE = @"__onEnvChanged__";

NSString *const DORIC_ENTITY_FETCH_DIRTY_DATA = @"__fetchEffectiveData__";
