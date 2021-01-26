import 'package:flutter/material.dart';
import 'package:doric/doric/doric_context.dart';
import 'package:doric/doric/doric_promise.dart';
import 'package:doric/doric/layout/doric_node_data.dart';
import 'package:doric/doric/layout/doric_widget.dart';
import 'package:doric/doric/shader/super_node.dart';
import 'package:doric/doric/shader/view_node.dart';
import 'package:doric/doric/utils/js_dispatcher.dart';
import 'package:doric/doric/utils/log.dart';
import 'package:doric/jscore/js_value.dart';

class ScrollerNode extends SuperNode<ScrollWidget> {
  ViewNode mChildNode;

  ScrollerNode(DoricContext context) : super(context) {
  }

  @override
  void beforeBlend(Map props) {
    super.beforeBlend(props);
    var contentId = props["content"];
    if (contentId != null) {
      Map subNodeProp = getSubModel(contentId);
      if (subNodeProp != null) {
        String subNodeId = subNodeProp["id"];
        String subNodeType = subNodeProp["type"];
        if (mChildNode == null || mChildNode.getId() != subNodeId) {
          mChildNode = ViewNode.create(getDoricContext(), subNodeType);
          mChildNode.setId(subNodeId);
          mChildNode.init(this);
          mChildNode.blend(subNodeProp["props"]);
        }
      }
    }
  }

  @override
  ScrollWidget build(Map props) {
    return ScrollWidget(this, props);
  }

  @override
  void blendSubNode(Map subProperties) {
    if (mChildNode != null) {
      mChildNode.blend(getSubModel(subProperties["id"])["props"],
          thisBlendProp: subProperties["props"]);
    }
  }

  @override
  ViewNode<Widget> getSubNodeById(String id) {
    return mChildNode?.getId() == id ? mChildNode : null;
  }


}

class ScrollWidget extends DoricStateWidget {
  ScrollWidget(ViewNode<ScrollWidget> node, Map props) : super(node, props);

  @override
  State<StatefulWidget> createState() {
    return ScrollState();
  }
}

class ScrollState extends DoricState<ScrollerNode, ScrollWidget> {
  Offset lastScroll = Offset(0, 0);
  Offset lastScrollEnd = Offset(0, 0);
  DoricJSPatcher doricJSPatcher = new DoricJSPatcher();

  TransformationController _transformationController =
      TransformationController();

  onScrollStart(ScaleStartDetails details) {}

  Offset getCurrentPosition() {
    var data = _transformationController.value.absolute().getTranslation();
    return Offset(data[0].toDouble(), data[1].toDouble());
  }
  @override
  void initState() {
    super.initState();
    getViewNode().registerFunc("scrollBy", scrollBy);
  }

  void scrollBy(JSValue jsValue, DoricPromise promise) async {
    var data = jsValue.toObject().toMap();
    var point=Offset(data["offset"]["x"], data["offset"]["y"]);
    print("scrollBy");
    print(data);
    print(data["offset"]);
  }

  onScroll(ScaleUpdateDetails details) {
    var currentPosition = getCurrentPosition();
    if (currentPosition != lastScroll) {
      callJsScroll(currentPosition);
      lastScroll = currentPosition;
    }
  }

  onScrollEnd(ScaleEndDetails details) {
    var currentPosition = getCurrentPosition();
    if (currentPosition != lastScrollEnd) {
      callJsScrollEnd(currentPosition);
      lastScrollEnd = currentPosition;
    }
  }

  callJsScrollEnd(Offset position) {
    if (props["onScrollEnd"] != null) {
      getViewNode().callJSResponse(props["onScrollEnd"], [
        JSValue.makeFromObject(getDoricContext().getJSContext(),
            {"x": position.dx, "y": position.dy})
      ]);
    }
  }

  callJsScroll(Offset position) {
    if (props["onScroll"] != null) {
      getViewNode().callJSResponse(props["onScroll"], [
        JSValue.makeFromObject(getViewNode().getDoricContext().getJSContext(),
            {"x": position.dx, "y": position.dy})
      ]);
    }
  }

  @override
  Widget build(BuildContext context) {
    return DoricScrollerWidget(
        data: DoricNodeData(props),
        child: InteractiveViewer(
          transformationController: _transformationController,
          onInteractionUpdate: onScroll,
          onInteractionStart: onScrollStart,
          onInteractionEnd: onScrollEnd,
          scaleEnabled: false,
          constrained: false,
          child: getViewNode().mChildNode.getNodeView(),
        ));
  }
}
