import 'dart:math';

import 'package:flutter/cupertino.dart';
import 'package:flutter/rendering.dart';

import 'doric_node_data.dart';
import 'doric_renderbox.dart';

//负责包裹ScrollerView的child,传递实际的约束
class DoricScrollerRender extends DoricRenderBox
    with RenderObjectWithChildMixin<RenderBox> {
  DoricScrollerRender({DoricNodeData data, Widget child}) : super(data: data);

  @override
  void onLayout() {
    super.onLayout();
    BoxConstraints childBoxConstraints = computeChildBoxConstraints();
    if (sizedByParent) {
      child.layout(childBoxConstraints, parentUsesSize: true);
    } else {
      child.layout(childBoxConstraints, parentUsesSize: true);
      size = defaultComputeSize(child.size);
    }
    if (data.widthFit() || data.heightFit()) {
      var renderBox = _unwrap();
      var width = size.width;
      var height = size.height;
      if (data.widthFit()) {
        width = renderBox.data.size.width;
      }
      if (data.heightFit()) {
        height = renderBox.data.size.height;
      }
      size = defaultComputeSize(Size(width, height));

    }

  }

  DoricRenderBox _unwrap() {
    var theChild = child;
    while (
        theChild is RenderObjectWithChildMixin && theChild is! DoricRenderBox) {
      theChild = (theChild as RenderObjectWithChildMixin).child;
    }
    return theChild as DoricRenderBox;
  }

  @override
  bool hitTestChildren(BoxHitTestResult result, {Offset position}) {
    if (child != null) {
      final BoxParentData childParentData = child.parentData as BoxParentData;
      return result.addWithPaintOffset(
        offset: childParentData.offset,
        position: position,
        hitTest: (BoxHitTestResult result, Offset transformed) {
          assert(transformed == position - childParentData.offset);
          return child.hitTest(result, position: transformed);
        },
      );
    }
    return false;
  }

  @override
  void onPaint(PaintingContext context, Offset offset) {
    if (child != null) {
      context.paintChild(
          child,
          offset +
              (child.parentData as DoricMultiChildLayoutParentData).offset);
    }
  }


  BoxConstraints computeChildBoxConstraints() {
    var maxHeight = data.measuredHeight ?? constraintMaxHeight;
    var maxWidth = data.measuredWidth ?? constraintMaxWidth;
    return BoxConstraints(
        minHeight: data.minHeight,
        minWidth: data.minWidth,
        maxHeight: maxHeight,
        maxWidth: maxWidth);
  }
}
