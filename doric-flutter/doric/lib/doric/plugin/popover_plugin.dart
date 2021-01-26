import 'package:flutter/material.dart';
import 'package:doric/doric/doric_context.dart';
import 'package:doric/doric/doric_promise.dart';
import 'package:doric/doric/engine/doric_plugin.dart';
import 'package:doric/doric/layout/doric_node_data.dart';
import 'package:doric/doric/layout/doric_widget.dart';
import 'package:doric/doric/shader/view_node.dart';
import 'package:doric/flutter_jscore.dart';

class PopoverPlugin extends DoricPlugin {
  Map<String, OverlayEntry> overlays = {};

  PopoverPlugin(DoricContext context) : super(context);
  String TYPE = "popOver";

  @override
  Map initFunc() {
    return {
      "show": show,
      "dismiss": dismiss,
    };
  }

  void show(JSValue jsValue, DoricPromise promise) {
    print(jsValue.toObject().toMap());
    var data = jsValue.toObject().toMap();
    var id = data["id"];
    var type = data["type"];
    ViewNode viewNode = ViewNode.create(getDoricContext(), type);
    viewNode.setId(id);
    var view = _createPopover(viewNode);
    getDoricContext().addHeadNode(TYPE, viewNode);
    overlays[id] = view;
    Overlay.of(getDoricContext().getRoot().getLayer().getContext())
        .insert(view);
  }

  void dismiss(JSValue jsValue, DoricPromise promise) {
    if (jsValue.isObject) {
      var data = jsValue.toObject().toMap();
      ViewNode viewNode = getDoricContext().targetViewNode(data["id"]);
      dismissViewNode(viewNode);
    } else {
      dismissAll();
    }
  }

  void dismissAll() {
    getDoricContext().allHeadNodes(TYPE).forEach((viewNode) {
      dismissViewNode(viewNode);
    });
  }

  void dismissViewNode(ViewNode viewNode) {
    OverlayEntry overlayEntry = overlays.remove(viewNode.getId());
    overlayEntry.remove();
    getDoricContext().removeHeadNode(TYPE, viewNode.getId());
  }

  OverlayEntry _createPopover(ViewNode viewNode) {
    return OverlayEntry(
        builder: (context) => Positioned(
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              child: DoricStack(
                data: DoricNodeData({
                  "layoutConfig":{
                    "widthSpec": DoricLayoutSpec.DoricLayoutMost.index*1.0,
                    "heightSpec": DoricLayoutSpec.DoricLayoutMost.index*1.0,
                  }
                }),
                children: <Widget>[viewNode.getNodeView()],
              ),
            ));
  }

  @override
  void onTearDown() {
    dismissAll();
  }
}
