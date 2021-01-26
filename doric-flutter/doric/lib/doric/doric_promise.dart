import 'dart:async';

import 'package:doric/doric/doric_context.dart';
import 'package:doric/doric/engine/doric_constant.dart';
import 'package:doric/doric/utils/log.dart';
import 'package:doric/jscore/js_value.dart';

class DoricPromise {
  DoricContext context;

  String callbackId;

  DoricPromise(this.context, this.callbackId);

  bool active = true;



  void resolve(List<JSValue> args) {
    if (!isActive()) {
      return;
    }
    active = false;
    Timer.run(() {
      var params = [
        JSValue.makeString(context.getJSContext(), context.getContextId()),
        JSValue.makeString(context.getJSContext(), callbackId),
      ];
      params.addAll(args);
      context
          .getDriver()
          .invokeDoricMethod(DoricConstant.DORIC_BRIDGE_RESOLVE, params);
    });
  }

  void reject(List<JSValue> args) {
    if (!isActive()) {
      return;
    }
    active = false;
    Timer.run(() {
      var params = [
        JSValue.makeString(context.getJSContext(), context.getContextId()),
        JSValue.makeString(context.getJSContext(), callbackId),
      ];
      params.addAll(args);
      context
          .getDriver()
          .invokeDoricMethod(DoricConstant.DORIC_BRIDGE_REJECT, params);
    });
  }

  bool isActive() {
    return active;
  }
}
