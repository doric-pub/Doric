import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:doric/doric/doric_context.dart';
import 'package:doric/doric/doric_promise.dart';
import 'package:doric/doric/engine/doric_plugin.dart';
import 'package:doric/flutter_jscore.dart';

class NetworkPlugin extends DoricPlugin {
  NetworkPlugin(DoricContext context) : super(context);
  var dio = new Dio();

  @override
  Map initFunc() {
    return {
      "request": request,
    };
  }

  @override
  void onTearDown() {}

  void request(JSValue jsValue, DoricPromise promise) {
    var data = jsValue.toObject().toMap();
    var method = data["method"];
    var header = data["header"] ?? {};
    header["Content-Type"] =
        header["Content-Type"] ?? "application/json; charset=utf-8";

    dio
        .request(data["url"],
            options: Options(method: method, headers: data["header"]))
        .then((value) {
          var result={
            "status":value.statusCode,
            "headers":json.encode(value.headers.map),
            "data":value.data.toString()
          };
      promise.resolve([ JSValue.makeFromObject(getDoricContext().getJSContext(), result)]);
    }).catchError((e) {
      promise.reject([JSValue.makeString(getDoricContext().getJSContext(), e.toString())]);
    });
  }

  void get() {}

  void post() {}
}
