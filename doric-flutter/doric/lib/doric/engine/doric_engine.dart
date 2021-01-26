import 'dart:convert';
import 'dart:ffi';
import 'package:flutter/services.dart';
import 'package:doric/doric/doric_context.dart';
import 'package:doric/doric/doric_registry.dart';
import 'package:doric/doric/engine/doric_constant.dart';
import 'package:doric/doric/utils/log.dart';
import 'package:doric/doric/utils/util.dart';
import 'package:doric/flutter_jscore.dart';
import 'doric_js_executor.dart';
import 'doric_timer.dart';

class DoricJSEngine with TimeCallback {
  DoricNativeJSExecutor _executor;
  DoricRegistry _registry;
  bool isDoricRuntimeInit = false;
  DoricTimerExtension timerExtension;

  DoricJSEngine() {
    _executor = DoricNativeJSExecutor();
    _registry = DoricRegistry();
    timerExtension = DoricTimerExtension(this);
    injectGlobal();
    initDoricRuntime();
  }

  DoricRegistry getRegistry() {
    return _registry;
  }

  void injectGlobal() {

    var data = {
      "platform": "doric",
      "screenWidth": DoricUtils.getScreenWidth(),
      "screenHeight": DoricUtils.getScreenHeight(),
    };
    _executor.injectGlobalJSFunction(DoricConstant.INJECT_LOG,
            (List<JSValue> args) {
          DoricLog.i("Doric-" + args[0].string + " : " + args[1].string);
          return nullptr;
        });
    _executor.injectGlobalJSObject(
        DoricConstant.INJECT_ENVIRONMENT,
        JSValue.makeFromJSONString(_executor.getJSContext(), jsonEncode(data))
            .toObject());
    _executor.injectGlobalJSFunction(
        DoricConstant.INJECT_EMPTY, (List<JSValue> args) {});
    _executor.injectGlobalJSFunction(DoricConstant.INJECT_BRIDGE,
        (List<JSValue> args) {
      // contextId ,module,method,callbackId, arg
      try {
        String contextId = args[0].string;
        String module = args[1].string;
        String method = args[2].string;
        // DoricLog.i(contextId + "  " + module + " " + method);
        var creator = _registry.acquirePluginCreator(module);
        if (creator == null) {
          DoricLog.e("Cannot find plugin " + module);
          return JSValue.makeBoolean(_executor.getJSContext(), false).pointer;
        }
        return DoricContextManager.getContext(contextId)
            .obtainPlugin(module, creator)(method, [args[3], args[4]])
            .pointer;
      } catch (e) {
        DoricLog.i(e);
      }
      return JSValue.makeBoolean(_executor.getJSContext(), false).pointer;
    });
    _executor.injectGlobalJSFunction(DoricConstant.INJECT_REQUIRE,
        (List<JSValue> args) {
      //TODO implement  nativeRequire
          DoricLog.i("call nativeRequire");
    });
    _executor.injectGlobalJSFunction(DoricConstant.INJECT_TIMER_SET,
        (List<JSValue> args) {
      try {
        timerExtension.setTimer(args[0].toNumber().toInt(),
            args[1].toNumber().toInt(), args[2].toBoolean);
      } catch (e) {}
      return JSValue.makeNull(_executor.getJSContext()).pointer;
    });
    _executor.injectGlobalJSFunction(DoricConstant.INJECT_TIMER_CLEAR,
        (List<JSValue> args) {
      try {
        timerExtension.clearTimer(args[0].toNumber().toInt());
      } catch (e) {
        DoricLog.e(e);
      }
      return JSValue.makeNull(_executor.getJSContext()).pointer;
    });
  }

  void initDoricRuntime() async {
    await loadBuiltinJS(DoricConstant.DORIC_BUNDLE_SANDBOX);
    String libJS =
        await rootBundle.loadString('bundle/' + DoricConstant.DORIC_BUNDLE_LIB);
    String libName = DoricConstant.DORIC_MODULE_LIB;
    _executor.loadJS(
        packageModuleScript(libName, libJS), "Module://" + libName);
    isDoricRuntimeInit = true;
  }

  getJSContext() {
    return _executor.getJSContext();
  }

  void prepareContext(
      final String contextId, final String script, final String source) {
    _executor.loadJS(
        packageContextScript(contextId, script), "Context://" + source);
  }

  void destroyContext(final String contextId) {
    _executor.loadJS(
        DoricUtils.format(DoricConstant.TEMPLATE_CONTEXT_DESTROY, [contextId]),
        "_Context://" + contextId);
  }

  loadBuiltinJS(String assetName) async {
    String script = await rootBundle.loadString('bundle/' + assetName);
    _executor.loadJS(script, "Assets://" + assetName);
  }

  String packageModuleScript(String moduleName, String content) {
    return DoricUtils.format(
        DoricConstant.TEMPLATE_MODULE, [moduleName, content]);
  }

  String packageContextScript(String contextId, String content) {
    return DoricUtils.format(
        DoricConstant.TEMPLATE_CONTEXT_CREATE, [content, contextId, contextId]);
  }

  JSValue invokeDoricMethod(final String method, final List<JSValue> args) {
    return _executor.invokeMethod(DoricConstant.GLOBAL_DORIC, method, args);
  }

  void runJS(String script) {
    _executor.getJSContext().evaluate(script);
  }

  @override
  void callback(int timeId) {
    try {
      invokeDoricMethod(DoricConstant.DORIC_TIMER_CALLBACK,
          [JSValue.makeNumber(_executor.getJSContext(), timeId * 1.0)]);
    } catch (e) {
      DoricLog.e(e);
    }
  }
}


