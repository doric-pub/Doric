import 'dart:math';

import 'package:flutter/material.dart';
import 'package:doric/doric/shader/doric_gravity.dart';

import 'doric_multi_child_layout_render.dart';
import 'doric_node_data.dart';

class DoricStackRender extends DoricMultiChildLayoutRender {
  DoricStackRender({DoricNodeData data}) : super(data: data);

  @override
  void onMeasure() {
    super.onMeasure();
    double maxHeight = 0.0, maxWidth = 0.0;
    visitDoricChildren((RenderBox child, int index, DoricNodeData childData,
        DoricMultiChildLayoutParentData parentData) {
      BoxConstraints childBoxConstraints =
          computeChildBoxConstraints(childData);
      if (sizedByParent) {
        child.layout(childBoxConstraints, parentUsesSize: true);
      } else {

        child.layout(childBoxConstraints, parentUsesSize: true);
        maxWidth =
            max(maxWidth, child.size.width + childData.horizontalMargin());
        maxHeight =
            max(maxHeight, child.size.height + childData.verticalMargin());
      }
    });
    if (!sizedByParent) {
      size = defaultComputeSize(Size(maxWidth, maxHeight));
      visitDoricChildren((RenderBox child, int index, DoricNodeData childData,
          DoricMultiChildLayoutParentData parentData) {
        BoxConstraints childBoxConstraints = BoxConstraints(
          maxHeight: size.height,
          maxWidth: size.width,
        );

        if(data.heightFit() && childData.heightMost()||data.widthFit() && childData.widthMost()){
          child.layout(childBoxConstraints, parentUsesSize: true);
        }
      });
    }
  }

  @override
  void onLayout() {
    super.onLayout();

    visitDoricChildren((RenderBox child, int index, DoricNodeData childData,
        DoricMultiChildLayoutParentData parentData) {
      var gravity = new DoricGravity(childData.alignment);
      var xStart = 0.0;
      if (gravity.isRight()) {
        xStart = size.width -
            child.size.width -
            data.paddingRight -
            childData.marginRight;
      } else if (gravity.isCenterX()) {
        xStart = (size.width -
                    child.size.width -
                    data.paddingLeft -
                    data.paddingRight) /
                2 +
            data.paddingLeft +
            childData.marginLeft;
      } else {
        xStart = data.paddingLeft + childData.marginLeft;
      }

      var yStart = 0.0;
      if (gravity.isBottom()) {
        yStart = size.height -
            child.size.height -
            data.paddingBottom -
            childData.marginBottom;
      } else if (gravity.isCenterY()) {
        yStart = (size.height -
                    child.size.height -
                    data.paddingTop -
                    data.paddingBottom) /
                2 +
            data.paddingTop +
            childData.marginTop;
      } else {
        yStart = data.paddingTop + childData.marginTop;
      }
      parentData.offset = Offset(xStart, yStart);
    });
  }

  BoxConstraints computeChildBoxConstraints(DoricNodeData childData) {
    var measureSize;
    if (sizedByParent) {
      measureSize = size;
    } else {
      var height = constraintMaxHeight;
      var width = constraintMaxWidth;
      if (data.heightFit() && childData.heightMost()) {
        height = double.minPositive;
      }
      if (data.widthFit() && childData.widthMost()) {
        width = double.minPositive;
      }
      measureSize = Size(width, height);
    }
    var maxHeight = measureSize.height -
        data.verticalPadding() -
        childData.verticalMargin();
    if (maxHeight < 0) {
      maxHeight = double.minPositive;
    }
    var maxWidth = measureSize.width -
        data.horizontalPadding() -
        childData.horizontalMargin();
    if (maxWidth < 0) {
      maxWidth = double.minPositive;
    }
    return BoxConstraints(
        minHeight: data.minHeight,
        minWidth: data.minWidth,
        maxHeight: maxHeight,
        maxWidth: maxWidth);
  }
}
