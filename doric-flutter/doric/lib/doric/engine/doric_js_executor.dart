import 'dart:async';
import 'dart:ffi';

import 'package:doric/doric/utils/log.dart';

import '../../flutter_jscore.dart';

class DartFunction {
  static JSContext _jsContext;

  static Map<String, Function> funcMap = {};

  static void registerFunc(String name, Function function) {
    funcMap[name] = function;
  }

  static String getFuncName(String function) {
    var start = function.indexOf("function");
    var end = function.indexOf("(");
    return function
        .substring(start, end)
        .replaceAll(" ", "")
        .replaceAll("function", "");
  }



  static Pointer exec(
      Pointer ctx,
      Pointer function,
      Pointer thisObject,
      int argumentCount,
      Pointer<Pointer> arguments,
      Pointer<Pointer> exception) {

    Function theFunc =
        funcMap[getFuncName(JSValue(_jsContext, function).string)];
    List<JSValue> values = [];
    for (var i = 0; i < argumentCount; i++) {
      var v = JSValue(_jsContext, arguments[i]);
      //当前对象是直接从js->dart,引用一致,并且是同步执行,容易出现,js端清空对象导致dart端数据不对
      if (v.isObject) {
        v = JSValue.makeFromObject(_jsContext, v.toObject().toMap());
      } else if (v.isString) {
        v = JSValue.makeString(_jsContext, v.string);
      } else if (v.isBoolean) {
        v = JSValue.makeBoolean(_jsContext, v.toBoolean);
      } else if (v.isNumber) {
        v = JSValue.makeNumber(_jsContext, v.toNumber());
      } else if (v.isUndefined) {
        v = JSValue.makeUndefined(_jsContext);
      } else if (v.isNull) {
        v = JSValue.makeNull(_jsContext);
      }
      values.add(v);
    }
    if (theFunc != null) {
      theFunc(values);
      return nullptr;
    }
    return nullptr;
  }
}

abstract class IDoricJSE {
  void loadJS(String script, String source);

  void injectGlobalJSFunction(String name, Function function);

  void injectGlobalJSObject(String name, JSObject jsObject);

  JSValue invokeMethod(String objName, String functionName, List<JSValue> args);
}

class DoricNativeJSExecutor with IDoricJSE {
  JSContext _jsContext;

  DoricNativeJSExecutor() {
    _jsContext = JSContext.createInGroup();
    DartFunction._jsContext = _jsContext;
  }

  JSContext getJSContext() {
    return _jsContext;
  }

  @override
  void injectGlobalJSFunction(String name, Function function) {
    DartFunction.registerFunc(name, function);
    _jsContext.globalObject.setProperty(
        name,
        JSObject.makeFunctionWithCallback(
                _jsContext, name, Pointer.fromFunction(DartFunction.exec))
            .toValue(),
        JSPropertyAttributes.kJSPropertyAttributeDontDelete);
  }

  @override
  void injectGlobalJSObject(String name, JSObject jsObject) {
    _jsContext.globalObject.setProperty(name, jsObject.toValue(),
        JSPropertyAttributes.kJSPropertyAttributeDontDelete);
  }

  @override
  JSValue invokeMethod(
      String objName, String functionName, List<JSValue> args) {
    JSObject doricObj;
    if (objName == null) {
      doricObj = _jsContext.globalObject;
    } else {
      doricObj = _jsContext.globalObject.getProperty(objName).toObject();
    }
    return doricObj
        .getProperty(functionName)
        .toObject()
        .callAsFunction(doricObj, JSValuePointer.array(args));
  }

  @override
  void loadJS(String script, String source) {
    print("loadJS " + source);
    JSValue value = _jsContext.evaluate(script);
    if (value.isNull) {
      print("JS Run time Error");
      print(_jsContext.exception.getValue(_jsContext).toObject().toMap());
    }
  }
}
