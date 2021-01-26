import 'package:flutter/rendering.dart';
import 'package:flutter/widgets.dart';

import 'doric_node_data.dart';
import 'doric_renderbox.dart';

abstract class DoricMultiChildLayoutRender extends DoricRenderBox
    with ContainerRenderObjectMixin {
  DoricMultiChildLayoutRender({@required DoricNodeData data})
      : super(data: data);

  bool defaultHitTestChildren(BoxHitTestResult result, {Offset position}) {
    RenderBox child = lastChild;
    while (child != null) {
      final DoricMultiChildLayoutParentData childParentData =
          child.parentData as DoricMultiChildLayoutParentData;
      final bool isHit = result.addWithPaintOffset(
        offset: childParentData.offset,
        position: position,
        hitTest: (BoxHitTestResult result, Offset transformed) {
          assert(transformed == position - childParentData.offset);
          return child.hitTest(result, position: transformed);
        },
      );
      if (isHit) return true;
      child = childParentData.previousSibling;
    }
    return false;
  }

  @override
  bool hitTestChildren(BoxHitTestResult result, {Offset position}) {
    return !data.hidden&&defaultHitTestChildren(result, position: position);
  }

  @override
  void onPaint(PaintingContext context, Offset offset) {
    super.onPaint(context, offset);
    visitDoricChildren((RenderBox child, int index, DoricNodeData childData,
        DoricMultiChildLayoutParentData parentData) {
      var theOffset=offset + parentData.offset;
      if (size.contains(theOffset)) {
        child.paint(context, theOffset);
      } else {
        context.pushClipRect(needsCompositing, offset, Offset.zero & size,
            (PaintingContext context, Offset offset) {
          child.paint(context, offset + parentData.offset);
        }, clipBehavior: Clip.hardEdge);
      }
    });
  }

  void visitDoricChildren(
      Function(RenderBox, int, DoricNodeData, DoricMultiChildLayoutParentData)
          visitor) {
    var child = firstChild as IDoricRenderBox;
    var index = 0;
    while (child != null) {
      var childParentData = child.parentData as DoricMultiChildLayoutParentData;
      visitor(child as RenderBox, index++, child.data, childParentData);
      child = childParentData.nextSibling as IDoricRenderBox;
    }
  }
}
