import 'package:flutter/material.dart';
import 'package:doric/doric/engine/doric_plugin.dart';

import '../../flutter_jscore.dart';
import '../doric_context.dart';
import '../doric_promise.dart';

class NotchPlugin extends DoricPlugin {
  NotchPlugin(DoricContext context) : super(context);

  @override
  Map initFunc() {
    return {
      "inset": inset,
    };
  }

  @override
  void onTearDown() {}

  void inset(JSValue jsValue, DoricPromise promise) {
    var padding = MediaQuery.of(getDoricContext().getContext()).padding;
    promise.resolve([
      JSValue.makeFromObject(getDoricContext().getJSContext(), {
        "left": padding.left,
        "right": padding.right,
        "top": padding.top,
        "bottom": padding.bottom,
      })
    ]);
  }
}
