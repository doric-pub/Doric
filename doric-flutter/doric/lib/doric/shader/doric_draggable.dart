import 'package:flutter/cupertino.dart';
import 'package:doric/doric/doric_context.dart';
import 'package:doric/doric/layout/doric_node_data.dart';
import 'package:doric/doric/layout/doric_widget.dart';
import 'package:doric/doric/shader/stack_node.dart';
import 'package:doric/doric/shader/view_node.dart';
import 'package:doric/flutter_jscore.dart';

class DoricDraggableNode extends StackNode {
  DoricDraggableNode(DoricContext context) : super(context);
  Offset offset = Offset.zero;

  @override
  Widget build(Map props) {
    return DraggableWidget(this, props, getChildWidgets());
  }
}

class DraggableWidget extends DoricStateWidget{
  final List<Widget> children;

  DraggableWidget(ViewNode viewNode, Map props, this.children)
      : super(viewNode, props);

  @override
  State<StatefulWidget> createState() {
    return DraggableState();
  }
}

class DraggableState extends DoricState<DoricDraggableNode, DraggableWidget> {
  void onDrag() {
    var onDragId = props["onDrag"];
    if (onDragId != null) {
      var offset = getViewNode().offset;
      getViewNode().callJSResponse(onDragId, [
        JSValue.makeNumber(getJSContext(), offset.dx),
        JSValue.makeNumber(getJSContext(), offset.dy)
      ]);
    }
  }

  @override
  Widget build(BuildContext context) {
    Map dragProps = {};
    dragProps["x"] = getViewNode().offset.dx;
    dragProps["y"] = getViewNode().offset.dy;
    dragProps["width"] = props["width"];
    dragProps["height"] = props["height"];
    dragProps["minHeight"] = props["minHeight"];
    dragProps["maxHeight"] = props["maxHeight"];
    dragProps["minWidth"] = props["minWidth"];
    dragProps["maxWidth"] = props["maxWidth"];
    dragProps["widthSpec"] = props["widthSpec"];
    dragProps["heightSpec"] = props["heightSpec"];
    return DoricSingleWidget(
        data: DoricNodeData(dragProps),
        child: GestureDetector(
            onPanDown: (data) {},
            onPanStart: (data) {},
            onPanUpdate: (data) {
              (getViewNode()).offset += data.delta;
              onDrag();
              setState(() {});
            },
            onPanCancel: () {},
            onPanEnd: (data) {},
            child: DoricStack(
              children: widget.children,
              data: DoricNodeData(props),
            )));
  }
}
