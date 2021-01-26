import 'package:flutter/cupertino.dart';
import 'package:flutter/rendering.dart';

import 'doric_node_data.dart';
import 'doric_renderbox.dart';

//用来组合原生组件,
class DoricSingleWrapRender extends RenderProxyBox with IDoricRenderBox {
  @override
  void setupParentData(RenderObject child) {
    super.setupParentData(child);
    if (child.parentData is! DoricMultiChildLayoutParentData) {
      child.parentData = this.parentData;
    }
  }

  @override
  bool get isRepaintBoundary => true;

  @override
  void performLayout() {
    if (child != null) {
      child.layout(constraints, parentUsesSize: true);
      size = child.size;
    }
  }

  DoricRenderBox _unwrap() {
    var theChild = child;
    while (theChild is RenderProxyBox) {
      theChild = (theChild as RenderProxyBox).child;
    }
    return theChild as DoricRenderBox;
  }

  DoricNodeData get data {
    var child = _unwrap();
    if (child != null) {
      return child.data;
    }
    return null;
  }
}
