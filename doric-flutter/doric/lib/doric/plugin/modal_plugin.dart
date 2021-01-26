import 'dart:async';

import 'package:flutter/material.dart';
import 'package:doric/doric/doric_context.dart';
import 'package:doric/doric/doric_promise.dart';
import 'package:doric/doric/engine/doric_plugin.dart';
import 'package:doric/doric/utils/toast.dart';
import 'package:doric/flutter_jscore.dart';

class ModalPlugin extends DoricPlugin {
  ModalPlugin(DoricContext context) : super(context);

  @override
  Map initFunc() {
    return {
      "toast": toast,
      "alert": alert,
      "confirm": confirm,
      "prompt": prompt,
    };
  }

  void toast(JSValue jsValue, DoricPromise promise) {
    if (!getDoricContext().isTeardown) {
      var value = jsValue.toObject().toMap();
      Toast.show(value["msg"] ?? "", getDoricContext().getContext(),
          gravity: (value["gravity"] ?? 0.0).toInt());
    }
  }

  void alert(JSValue jsValue, DoricPromise promise) {
    if (getDoricContext().isTeardown) {
      return;
    }
    var value = jsValue.toObject().toMap();
    showDialog(
        context: getDoricContext().getContext(),
        builder: (context) =>
            AlertDialog(
              scrollable: true,
              title: value["title"] != null ? Text(value["title"]) : null,
              content: Text((value["msg"] ?? "")),
              actions: <Widget>[
                FlatButton(
                  child: Text(value["okLabel"] ?? "确定"),
                  onPressed: () {
                    Navigator.of(context).pop();
                    promise.resolve([]);
                  },
                ),
              ],
            ));
  }

  void confirm(JSValue jsValue, DoricPromise promise) {
    var value = jsValue.toObject().toMap();

    showDialog(
        context: getDoricContext().getContext(),
        builder: (context) =>
            AlertDialog(
              title: Text(value["title"] ?? ""),
              content: Text((value["msg"] ?? "")),
              actions: <Widget>[
                new FlatButton(
                  child: new Text(value["cancelLabel"] ?? ""),
                  onPressed: () {
                    promise.reject([]);
                    Navigator.of(context).pop();
                  },
                ),
                new FlatButton(
                  child: new Text(value["okLabel"] ?? ""),
                  onPressed: () {
                    promise.resolve([]);
                    Navigator.of(context).pop();
                  },
                ),
              ],
            ));
  }

  void prompt(JSValue jsValue, DoricPromise promise) {
    var value = jsValue.toObject().toMap();
    var resultVal = value["defaultText"] ?? "";
    showDialog(
        context: getDoricContext().getContext(),
        builder: (context) =>
            AlertDialog(
              title: Text(value["title"] ?? ""),
              content: TextField(
                keyboardType: TextInputType.text,
                controller:
                TextEditingController(text: value["defaultText"] ?? ""),
                onChanged: (val) {
                  resultVal = val;
                },
              ),
              actions: <Widget>[
                new FlatButton(
                  child: new Text(value["cancelLabel"] ?? "取消"),
                  onPressed: () {
                    promise.reject([
                      JSValue.makeString(
                          getDoricContext().getJSContext(), resultVal)
                    ]);
                    Navigator.of(context).pop();
                  },
                ),
                new FlatButton(
                  child: new Text(value["okLabel"] ?? "确定"),
                  onPressed: () {
                    promise.resolve([
                      JSValue.makeString(
                          getDoricContext().getJSContext(), resultVal)
                    ]);
                    Navigator.of(context).pop();
                  },
                ),
              ],
            ));
  }

  @override
  void onTearDown() {}
}
