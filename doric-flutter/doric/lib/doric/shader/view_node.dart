import 'dart:async';
import 'dart:math';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:doric/doric/doric_context.dart';
import 'package:doric/doric/engine/doric_constant.dart';
import 'package:doric/doric/layout/doric_decoration.dart';
import 'package:doric/doric/layout/doric_node_data.dart';
import 'package:doric/doric/layout/doric_widget.dart';
import 'package:doric/doric/shader/super_node.dart';
import 'package:doric/doric/utils/js_dispatcher.dart';
import 'package:doric/doric/utils/log.dart';
import 'package:doric/flutter_jscore.dart';

import '../doric_promise.dart';

abstract class ViewNode<T extends Widget> extends DoricContextHolder {
  DoricWidget _layer;

  String _id;

  SuperNode _superNode;

  Map<String, Function> funcs = {};

  Map thisBlendProp;

  Map props;

  T _view;

  GlobalKey viewNodeGlobalKey = GlobalKey();

  ViewNode(DoricContext context) : super(context) {
    registerFunc("getWidth", getWidth);
    registerFunc("getHeight", getHeight);
    registerFunc("getX", getX);
    registerFunc("getY", getY);
    registerFunc("getLocationOnScreen", getLocationOnScreen);
  }

  Function getPluginFunc(String name) {
    return this.funcs[name];
  }

  registerFunc(String name, Function function) {
    this.funcs[name] = function;
  }

  String _type;

  String getType() {
    return _type;
  }

  setId(String id) {
    _id = id;
  }

  Widget getNodeView() {
    return _layer;
  }

  DoricWidget getLayer() {
    return _layer;
  }

  setLayer(DoricWidget widget) {
    _layer = widget;
  }

  getId() {
    return _id;
  }

  static ViewNode create(DoricContext doricContext, String type) {
    var registry = doricContext.getDriver().getRegistry();
    var clz = registry.acquireViewNodeCreator(type);
    ViewNode ret = clz.create(doricContext);
    ret._type = type;
    return ret;
  }

  init(SuperNode superNode) {
    _superNode = superNode;
  }

  setType(String type) {
    _type = type;
  }

  ViewNode getSuperNode() {
    return _superNode;
  }

  List<String> getIdList() {
    List<String> ids = [];
    ViewNode viewNode = this;
    do {
      ids.add(viewNode.getId());
      viewNode = viewNode.getSuperNode();
    } while (viewNode != null);
    return ids;
  }

  T build(Map props);

  T buildView(Map props) {
    _view = build(props);
    return _view;
  }

  Map getThisBlend() {
    return this.thisBlendProp;
  }

  Widget blend(Map props, {forceUpdate: false, thisBlendProp}) {
    props = new Map.from(props);
    this.props = props;
    if (thisBlendProp == null) {
      thisBlendProp = props;
    }
    this.thisBlendProp = thisBlendProp;
    beforeBlend(thisBlendProp);
    if (_layer == null) {
      _layer = DoricWidget(this, props);
    } else {
      if (shouldUpdate() || forceUpdate) {
        _layer.update(props);
      }
    }
    afterBlend(thisBlendProp);
    return _layer;
  }

  JSValue callJSResponse(String funcId, List<JSValue> args) {
    var ids = [];
    ids.addAll(getIdList().reversed);
    List<JSValue> data = [
      JSValue.makeFromObject(getDoricContext().getJSContext(), ids),
      JSValue.makeString(getDoricContext().getJSContext(), funcId)
    ];
    data.addAll(args);
    return getDoricContext()
        .callEntity(DoricConstant.DORIC_ENTITY_RESPONSE, data);
  }

  bool shouldUpdate() {
    return true;
  }

  void beforeBlend(Map props) {}

  void afterBlend(Map props) {}

  getX(JSValue jsValue, DoricPromise promise) async {
    promise.resolve([
      JSValue.makeNumber(getDoricContext().getJSContext(), await _layer.getX())
    ]);
  }

  getLocationOnScreen(JSValue jsValue, DoricPromise promise) async {
    var offset = await _layer.getLocationOnScreen();
    promise.resolve([
      JSValue.makeFromObject(getDoricContext().getJSContext(), {
        "x": offset.dx,
        "y": offset.dy,
      })
    ]);
  }

  getY(JSValue jsValue, DoricPromise promise) async {
    promise.resolve([
      JSValue.makeNumber(getDoricContext().getJSContext(), await _layer.getY())
    ]);
  }

  getWidth(JSValue jsValue, DoricPromise promise) async {
    promise.resolve([
      JSValue.makeNumber(
          getDoricContext().getJSContext(), await _layer.getWidth())
    ]);
  }

  getHeight(JSValue jsValue, DoricPromise promise) async {
    promise.resolve([
      JSValue.makeNumber(
          getDoricContext().getJSContext(), await _layer.getHeight())
    ]);
  }
}

// ignore: must_be_immutable
class DoricWidget extends StatefulWidget {
  Map props;

  Map oldProps;

  _DoricWidgetState state;

  ViewNode viewNode;

  BuildContext buildContext;

  DoricWidget(this.viewNode, this.props);

  setViewNode(ViewNode node) {
    viewNode = node;
  }

  bool update(Map props) {
    this.props = props;
    if (this.state != null) {
      this.state.update();
      return true;
    } else {
      return false;
    }
  }

  setContext(BuildContext context) {
    buildContext = context;
  }

  BuildContext getContext() {
    return buildContext;
  }

  @override
  State<StatefulWidget> createState() {
    return _DoricWidgetState();
  }

  void dispose() {}

  GlobalKey get globalKey => viewNode.viewNodeGlobalKey;

  Future<double> getWidth() async {
    await awaitContextAttach();
    return globalKey.currentContext.size.width;
  }

  Future awaitContextAttach() async {
    while (globalKey.currentContext == null) {
      DoricLog.e("context == null");
      await Future.delayed(Duration(milliseconds: 50));
    }
  }

  Future<double> getHeight() async {
    await awaitContextAttach();
    return globalKey.currentContext.size.height;
  }

  Future<Offset> getLocationOnScreen() async {
    await awaitContextAttach();
    RenderBox renderBox = globalKey.currentContext.findRenderObject();
    var offset = renderBox.localToGlobal(Offset.zero);
    return offset;
  }

  Future<double> getX() async {
    await awaitContextAttach();
    RenderBox renderBox = globalKey.currentContext.findRenderObject();
    var offset = renderBox.localToGlobal(Offset.zero);

    return offset.dx;
  }

  Future<double> getY() async {
    await awaitContextAttach();
    RenderBox renderBox = globalKey.currentContext.findRenderObject();
    var offset = renderBox.localToGlobal(Offset.zero);
    return offset.dy;
  }

  Widget build(Widget widget, BuildContext context) {
    return widget;
  }
}

class _DoricWidgetState extends State<DoricWidget>
    with TickerProviderStateMixin, _Animation {
  _DoricWidgetState();

  bool isDispose = false;

  void initState() {
    super.initState();
    widget.state = this;
  }

  update() {
    if (mounted) {
      initAnimation(widget, _animationUpdate);
      animationCheck();
      setState(() {});
    }
  }

  _animationUpdate() {
    if (mounted) {
      setState(() {});
    }
  }

  @override
  void dispose() {
    isDispose = true;
    widget.dispose();
    super.dispose();
  }

  getJSContext() {
    return widget.viewNode.getDoricContext().getJSContext();
  }

  getDoricContext() {
    return widget.viewNode.getDoricContext();
  }

  wrapGestureDetector(Widget child) {
    var clickId = widget.props["onClick"];
    var data = DoricNodeData(widget.props);
    var alignment = Alignment((data.pivotX - 0.5) * 2, (data.pivotY - 0.5) * 2);
    Matrix4 transform = Matrix4.identity()
      ..scale(data.scaleX, data.scaleY)
      ..rotateX(data.rotationX * pi / 2)
      ..rotateY(data.rotationY * pi / 2)
      ..rotateZ(data.rotation * pi / 2);
    return DoricWrapWidget(
      key: widget.globalKey,
      child: clickId != null
          ? GestureDetector(
              onTap: () {
                if (clickId != null) {
                  widget.viewNode.callJSResponse(clickId, []);
                }
              },
              child: Transform(
                alignment: alignment,
                transform: transform,
                child: Opacity(
                  opacity: data.alpha,
                  child: child,
                ),
              ),
            )
          : Transform(
              alignment: alignment,
              transform: transform,
              child: Opacity(
                opacity: data.alpha,
                child: child,
              ),
            ),
    );
  }

  @override
  Widget build(BuildContext context) {
    widget.state = this;
    animationValTrans();

    var resultWidget = widget.viewNode.buildView(widget.props);
    if (resultWidget == null) {
      return DoricSingleWidget(
        data: DoricNodeData({}),
        child: Container(),
      );
    }
    if (widget.viewNode is! SuperNode) {
      if (resultWidget is! DoricRenderObjectMixin) {
        resultWidget = DoricSingleWidget(
          child: resultWidget,
          data: DoricNodeData(widget.props),
        );
      }
    }
    resultWidget = wrapGestureDetector(resultWidget);
    widget.oldProps = widget.props;
    return widget.build(resultWidget, context);
  }
}

///当前动画支持属性
///
mixin _Animation {
  AnimationController animationController;
  DoricWidget _widget;
  List supportProperty = [
    "x",
    "y",
    "width",
    "height",
    "corners",
    "scaleX",
    "scaleY",
    "rotationX",
    "rotationY",
    "rotation",
    "translationX",
    "translationY",
    "alpha",
  ];
  Map defaultProperty = {
    "x": 0.0,
    "y": 0.0,
    "width": 0.0,
    "height": 0.0,
    "corners": 0.0,
    "scaleX": 1.0,
    "scaleY": 1.0,
    "rotationX": 0.0,
    "rotationY": 0.0,
    "rotation": 0.0,
    "translationX": 0.0,
    "translationY": 0.0,
    "alpha": 1.0,
  };
  Map<String, Animation> animations = {};
  Function _setState;

  bool init = false;

  initAnimation(DoricWidget widget, Function setState) {
    if (!init) {
      init = true;
      this._widget = widget;
      this._setState = setState;
    }
  }

  DoricContext getDoricContext() {
    return _widget.viewNode.getDoricContext();
  }

  bool isAnimation() {
    return getDoricContext().getAnimationController() != null;
  }

  animationCheck() {
    var props = _widget.viewNode.getThisBlend();
    var currentProps = _widget.oldProps ?? _widget.props;
    if (props != null && isAnimation()) {
      props.forEach((key, value) {
        if (supportProperty.indexOf(key) != -1) {
          animations[key] = Tween(
                  begin: currentProps[key] ?? defaultProperty[key], end: value)
              .animate(getDoricContext().getAnimationController());
          animations[key].addListener(_setState);
        }
      });
    }
  }

  animationValTrans() {
    if (_widget != null && _widget.props != null) {
      supportProperty.forEach((property) {
        _widget.props[property] = getAnimationVal(property);
      });
    }
  }

  getAnimationVal(String key) {
    var props = _widget.props;
    var animation = animations[key];
    if (animation != null) {
      return animation.value;
    }
    return props[key];
  }
}
