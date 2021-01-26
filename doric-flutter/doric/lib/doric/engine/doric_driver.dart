
import '../../flutter_jscore.dart';

abstract class IDoricDriver {
  JSValue invokeContextEntityMethod(
      final String contextId, final String method, List<JSValue> args);

  JSValue invokeDoricMethod(final String method, List<JSValue> args);

  bool createContext(
      final String contextId, final String script, final String source);

  bool destroyContext(final String contextId);
}
