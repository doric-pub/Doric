import 'package:flutter/cupertino.dart';
import 'package:doric/doric/doric_context.dart';
import 'package:doric/doric/shader/view_node.dart';
import 'package:doric/flutter_jscore.dart';

import 'doric_root.dart';

abstract class SuperNode<T extends Widget> extends ViewNode<T> {
  Map<String, Map>
  subNodes = {};
  bool subviewsChanged;
  bool subviewChanged;

  SuperNode(DoricContext context) : super(context);

  @override
  beforeBlend(Map props) {
    super.beforeBlend(props);
    subviewsChanged = false;
    if (props["subviews"] is List) {
      (props["subviews"] as List).forEach((element) {
        subviewChanged = false;
        mixinSubNode(element);
        blendSubNode(element);
      });
    }
  }

  @override
  bool shouldUpdate() {
    return subviewsChanged;
  }

  void mixinSubNode(Map subNode) {
    String id = subNode['id'];
    Map targetNode = subNodes[id];
    if (targetNode == null) {
      subNodes[id] = subNode;
      subviewsChanged = true;
    } else {
      _mixin(subNode, targetNode);
    }
  }

  void setSubModel(String id, Map model) {
    subNodes[id] = model;
  }
   void removeSubModel(String id) {
    subNodes.remove(id);
  }


  Map _mixin(Map src, Map target) {
    (src['props'] as Map).forEach((key, value) {
      if (target["props"][key].toString() != value.toString()) {
        target["props"][key] = value;
        if (key != "subviews") {
          subviewChanged = true;
        }
      }
    });

    subNodes[src['id']] = target;
  }

  ViewNode getSubNodeById(String id);

  Map getSubModel(String id) {
    return subNodes[id];
  }

  void blendSubNode(Map subProperties);
}
