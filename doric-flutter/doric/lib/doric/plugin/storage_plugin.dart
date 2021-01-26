import 'package:doric/doric/doric_context.dart';
import 'package:doric/doric/doric_promise.dart';
import 'package:doric/doric/engine/doric_plugin.dart';
import 'package:doric/flutter_jscore.dart';
import 'package:shared_preferences/shared_preferences.dart';

class StoragePlugin extends DoricPlugin {
  final String PREF_NAME = "pref_doric";

  StoragePlugin(DoricContext context) : super(context);

  @override
  Map initFunc() {
    return {
      "setItem": setItem,
      "getItem": getItem,
      "remove": remove,
      "clear": clear,
    };
  }

  void setItem(JSValue jsValue, DoricPromise promise) {
    var data = jsValue.toObject().toMap();
    SharedPreferences.getInstance().then((value) {
      value.setString(_getKey(data), data["value"]);
      promise.resolve([]);
    }).catchError((e) => {promise.reject([])});
  }

  String _getKey(Map data) {
    return _getPrefix(data) + data["key"];
  }

  String _getPrefix(Map data) {
    String prefix = PREF_NAME;
    if (data["zone"] is String) {
      prefix = prefix + "_" + data["zone"];
    }
    return prefix;
  }

  void getItem(JSValue jsValue, DoricPromise promise) {
    var data = jsValue.toObject().toMap();
    SharedPreferences.getInstance().then((prefs) async {
      var result = prefs.getString(_getKey(data));
      promise.resolve(
          [JSValue.makeString(getDoricContext().getJSContext(), result)]);
    }).catchError((e) {
      promise.reject([]);
    });
  }

  void remove(JSValue jsValue, DoricPromise promise)  {
    var data = jsValue.toObject().toMap();
    SharedPreferences.getInstance().then((value) {
      value.remove(_getKey(data));
      promise.resolve([]);
    }).catchError((e) {
      promise.reject(
          [JSValue.makeString(getDoricContext().getJSContext(), e.toString())]);
    });
  }

  void clear(JSValue jsValue, DoricPromise promise)  {
    var data = jsValue.toObject().toMap();
    var key = _getPrefix(data);
    SharedPreferences.getInstance().then((value) {
      value.getKeys().forEach((element) {
        if (element.startsWith(key)) {
          value.remove(element);
        }
        promise.resolve([]);
      });
    }).catchError((e) {
      promise.reject([]);
    });
  }
  @override
  void onTearDown() {}
}
