import 'package:flutter/material.dart';
import 'package:doric/doric/doric_context.dart';
import 'package:doric/doric/doric_promise.dart';
import 'package:doric/doric/engine/doric_plugin.dart';
import 'package:doric/flutter_jscore.dart';

import '../doric_panel.dart';

class NavigatorPlugin extends DoricPlugin {
  NavigatorPlugin(DoricContext context) : super(context);

  @override
  Map initFunc() {
    return {
      "pop": pop,
      "push": push,
    };
  }

  void pop(JSValue jsValue, DoricPromise doricPromise) {
    Navigator.pop(getDoricContext().getContext());
  }

  void push(JSValue jsValue, DoricPromise doricPromise) {
    var data = jsValue.toObject().toMap();
    print(data);
    Navigator.push(
        getDoricContext().getContext(),
        MaterialPageRoute(
          builder: (context) => Scaffold(
            appBar: AppBar(
              title: Text(data["source"] ?? ""),
            ),
            body: Container(color: Colors.white, child: DoricPanel(data)),
          ),
        ));
  }

  @override
  void onTearDown() {
    // TODO: implement onTearDown
  }
}
