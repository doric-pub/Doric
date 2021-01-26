import 'dart:math';

import 'package:flutter/cupertino.dart';
import 'package:flutter/rendering.dart';
import 'package:doric/doric/shader/doric_gravity.dart';

import 'doric_node_data.dart';
import 'doric_renderbox.dart';

class DoricTextRender extends DoricRenderBox
    with RenderObjectWithChildMixin<RenderBox> {
  DoricTextRender({DoricTextNodeData data, Widget child}) : super(data: data);

  @override
  void createBoxDecoration() {
    super.createBoxDecoration();
    boxDecoration.data.boxShadow = null;
  }

  @override
  void onMeasure() {
    BoxConstraints childBoxConstraints = computeChildBoxConstraints();
    if (sizedByParent) {
      child.layout(childBoxConstraints, parentUsesSize: true);
    } else {
      child.layout(childBoxConstraints, parentUsesSize: true);
      size = defaultComputeSize(child.size);
    }
  }

  @override
  void onLayout() {
    super.onLayout();
    var gravity = DoricGravity((data as DoricTextNodeData).textAlignment);
    var xStart = 0.0;
    if (gravity.isLeft()) {
      xStart = data.paddingLeft;
    } else if (gravity.isRight()) {
      xStart = size.width - child.size.width - data.paddingRight;
    } else if (gravity.isCenterX()) {
      xStart = (size.width -
                  child.size.width -
                  data.paddingLeft -
                  data.paddingRight) /
              2 +
          data.paddingLeft;
    }
    var yStart = 0.0;
    if (gravity.isTop()) {
      yStart = data.paddingTop;
    } else if (gravity.isBottom()) {
      yStart = size.height - child.size.height - data.paddingBottom;
    } else if (gravity.isCenterY()) {
      yStart = (size.height -
                  child.size.height -
                  data.paddingTop -
                  data.paddingBottom) /
              2 +
          data.paddingTop;
    }
    (child.parentData as DoricMultiChildLayoutParentData).offset =
        Offset(xStart, yStart);
  }

  @override
  bool get isRepaintBoundary => true;

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
