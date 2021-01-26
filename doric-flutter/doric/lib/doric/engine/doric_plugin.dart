import 'dart:async';

import 'package:doric/doric/utils/log.dart';

import '../../flutter_jscore.dart';
import '../doric_context.dart';
import '../doric_promise.dart';

class DoricPluginCreator {
  Function _creatorFunc;

  DoricPluginCreator(this._creatorFunc);

  DoricPlugin create(DoricContext context) {
    return _creatorFunc(context);
  }
}

class _PluginFuncInfo{
    Function func;
//    List<PluginFuncArg> args;

    _PluginFuncInfo(this.func);
}

abstract class DoricPlugin extends DoricContextHolder {
  Map<String, _PluginFuncInfo> funcInfo = {};

  DoricPlugin(DoricContext context) : super(context){
    Map map= initFunc()??{};
    map.forEach((key, value) {
        registerFunc(key, value);
    });
  }

  Map initFunc();

  registerFunc(String method, Function function) {
    funcInfo[method] =_PluginFuncInfo(function);
  }



  JSValue call(String method, List<JSValue> params) {
    var function = funcInfo[method];
    if (function != null) {
      function.func(params[1],DoricPromise(getDoricContext(),params[0].string));
    }else{
      DoricLog.e("Cannot find method " + method);
    }
    return JSValue.makeBoolean(getDoricContext().getJSContext(), false);
  }

  void onTearDown();
}
