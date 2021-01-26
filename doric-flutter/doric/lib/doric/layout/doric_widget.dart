import 'package:flutter/material.dart';
import 'package:doric/doric/doric_context.dart';
import 'package:doric/doric/layout/doric_image_render.dart';
import 'package:doric/doric/layout/doric_scroller_wrap_render.dart';
import 'package:doric/doric/layout/doric_text_render.dart';
import 'package:doric/doric/shader/view_node.dart';
import 'package:doric/jscore/js_context.dart';
import 'doric_hlayout_render.dart';
import 'doric_node_data.dart';
import 'doric_single_child_layout_render.dart';
import 'doric_single_wrap_render.dart';
import 'doric_stack_layout_render.dart';
import 'doric_vlayout_render.dart';

mixin DoricRenderObjectMixin on RenderObjectWidget {}

// ignore: must_be_immutable
abstract class DoricStateWidget extends StatefulWidget {
  final Map props;

  final ViewNode node;

  DoricStateWidget(this.node, this.props, {GlobalKey key}) : super(key: key);
}

abstract class DoricState<T extends ViewNode, W extends DoricStateWidget>
    extends State<W> {
  @override
  void initState() {
    super.initState();
  }

  JSContext getJSContext() {
    return getDoricContext().getJSContext();
  }

  DoricContext getDoricContext() {
    return getViewNode().getDoricContext();
  }

  T getViewNode() {
    return widget.node as T;
  }

  Map get props => widget.props;
}

class DoricSingleWidget extends SingleChildRenderObjectWidget
    with DoricRenderObjectMixin {
  DoricNodeData data;

  DoricSingleWidget({@required Widget child, @required this.data, Key key})
      : super(child: child, key: key);

  @override
  void updateRenderObject(
      BuildContext context, DoricSingleChildLayoutRender renderObject) {
    super.updateRenderObject(context, renderObject);
    renderObject..data = data;
  }

  @override
  DoricSingleChildLayoutRender createRenderObject(BuildContext context) {
    return DoricSingleChildLayoutRender(data: data);
  }
}
class DoricScrollerWidget extends SingleChildRenderObjectWidget
    with DoricRenderObjectMixin {
  DoricNodeData data;

  DoricScrollerWidget({@required Widget child, @required this.data, Key key})
      : super(child: child, key: key);

  @override
  void updateRenderObject(
      BuildContext context, DoricScrollerRender renderObject) {
    super.updateRenderObject(context, renderObject);
    renderObject..data = data;
  }

  @override
  DoricScrollerRender createRenderObject(BuildContext context) {
    return DoricScrollerRender(data: data);
  }
}

class DoricImageWidget extends SingleChildRenderObjectWidget
    with DoricRenderObjectMixin {
  DoricNodeData data;

  DoricImageWidget({Widget child, this.data}) : super(child: child);

  @override
  void updateRenderObject(BuildContext context, DoricImageRender renderObject) {
    super.updateRenderObject(context, renderObject);
    renderObject..data = data;
  }

  @override
  DoricImageRender createRenderObject(BuildContext context) {
    return DoricImageRender(data: data);
  }
}

class DoricTextWidget extends SingleChildRenderObjectWidget
    with DoricRenderObjectMixin {
  DoricTextNodeData data;

  DoricTextWidget({Widget child, this.data}) : super(child: child);

  @override
  void updateRenderObject(BuildContext context, DoricTextRender renderObject) {
    super.updateRenderObject(context, renderObject);
    renderObject..data = data;
  }

  @override
  DoricTextRender createRenderObject(BuildContext context) {
    return DoricTextRender(data: data);
  }
}

class DoricWrapWidget extends SingleChildRenderObjectWidget
    with DoricRenderObjectMixin {
  DoricWrapWidget({Widget child, Key key}) : super(child: child, key: key);

  @override
  DoricSingleWrapRender createRenderObject(BuildContext context) {
    return DoricSingleWrapRender();
  }
}

class DoricStack extends MultiChildRenderObjectWidget
    with DoricRenderObjectMixin {
  DoricNodeData data;

  DoricStack({Key key, this.data, List<Widget> children})
      : super(key: key, children: children);

  @override
  void updateRenderObject(BuildContext context, DoricStackRender renderObject) {
    super.updateRenderObject(context, renderObject);
    renderObject.data = data;
  }

  @override
  RenderObject createRenderObject(BuildContext context) {
    return DoricStackRender(data: data);
  }
}

class DoricVLayout extends MultiChildRenderObjectWidget
    with DoricRenderObjectMixin {
  DoricNodeData data;

  DoricVLayout({Key key, this.data, List<Widget> children})
      : super(key: key, children: children);

  void updateRenderObject(
      BuildContext context, DoricVLinearRender renderObject) {
    super.updateRenderObject(context, renderObject);
    renderObject.data = data;
  }

  @override
  RenderObject createRenderObject(BuildContext context) {
    return DoricVLinearRender(data: data);
  }
}

class DoricHLayout extends MultiChildRenderObjectWidget
    with DoricRenderObjectMixin {
  DoricNodeData data;

  DoricHLayout({Key key, this.data, List<Widget> children})
      : super(key: key, children: children);

  void updateRenderObject(
      BuildContext context, DoricHLinearRender renderObject) {
    super.updateRenderObject(context, renderObject);
    renderObject.data = data;
  }

  @override
  RenderObject createRenderObject(BuildContext context) {
    return DoricHLinearRender(data: data);
  }
}
