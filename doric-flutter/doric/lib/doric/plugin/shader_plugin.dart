import 'package:doric/doric/doric_context.dart';
import 'package:doric/doric/doric_promise.dart';
import 'package:doric/doric/engine/doric_plugin.dart';
import 'package:doric/doric/shader/super_node.dart';
import 'package:doric/doric/shader/view_node.dart';
import 'package:doric/doric/utils/log.dart';
import 'package:doric/doric/utils/util.dart';
import 'package:doric/flutter_jscore.dart';

class ShaderPlugin extends DoricPlugin {
  ShaderPlugin(DoricContext context) : super(context);

  @override
  Map initFunc() {
    return {
      "render": render,
      "command": command,
    };
  }

  JSValue render(JSValue jsValue, DoricPromise promise) {
    var data = jsValue.toObject().toMap();
    var viewId = data["id"];
    // DoricLog.i(data);
    var rootNode = getDoricContext().getRoot();
    if ("Root" == data["type"]) {
      rootNode.setId(viewId);
      rootNode.blend(data["props"]);
    } else {
      var targetNode = getDoricContext().targetViewNode(viewId);
      if (targetNode != null) {
        targetNode.blend(data["props"]);
      }
    }
    promise.resolve([]);
    return JSValue.makeBoolean(getDoricContext().getJSContext(), true);
  }

  JSValue command(JSValue jsValue, DoricPromise promise) {
    var data = jsValue.toObject().toMap();
    ViewNode viewNode;
    (data["viewIds"] as List).forEach((id) {
      if (viewNode == null) {
        viewNode = getDoricContext().targetViewNode(id);
      } else {
        if (id != null && viewNode is SuperNode) {
          viewNode = (viewNode as SuperNode).getSubNodeById(id);
        }
      }
    });
    if (viewNode != null) {
      Function function = viewNode.getPluginFunc(data['name']);
      if (function != null) {
        function(jsValue.toObject().getProperty("args"), promise);
        return JSValue.makeBoolean(getDoricContext().getJSContext(), true);
      } else {
        promise.reject([]);
        DoricLog.e("not found func " + data['name']);
      }
    } else {
      promise.resolve([]);
    }

    return JSValue.makeBoolean(getDoricContext().getJSContext(), false);
  }

  @override
  void onTearDown() {}
}
