import '../../flutter_jscore.dart';
import '../doric_registry.dart';
import 'doric_constant.dart';
import 'doric_engine.dart';
import 'doric_driver.dart';

class DoricNativeDriver with IDoricDriver {
  DoricNativeDriver._() {
    jsEngine = DoricJSEngine();
  }

  static final _instance = DoricNativeDriver._();

  factory DoricNativeDriver.getInstance() => _instance;

  DoricJSEngine jsEngine;

  @override
  bool createContext(String contextId, String script, String source) {
    try {
      jsEngine.prepareContext(contextId, script, source);
      return true;
    } catch (e) {
      return false;
    }
  }

  @override
  bool destroyContext(String contextId) {
    try {
      jsEngine.destroyContext(contextId);
      return true;
    } catch (e) {
      return false;
    }
  }

  getJSContext() {
    return jsEngine.getJSContext();
  }

  DoricRegistry getRegistry() {
    return jsEngine.getRegistry();
  }

  @override
  JSValue invokeContextEntityMethod(
      String contextId, String method, List<JSValue> args) {
    var theArgs = [
      JSValue.makeString(jsEngine.getJSContext(), contextId),
      JSValue.makeString(jsEngine.getJSContext(), method)
    ];
    theArgs.addAll(args);
    return invokeDoricMethod(DoricConstant.DORIC_CONTEXT_INVOKE, theArgs);
  }

  @override
  JSValue invokeDoricMethod(String method, List<JSValue> args) {
    return jsEngine.invokeDoricMethod(method, args);
  }
}
