import 'dart:async';

import 'package:flutter/cupertino.dart';
import 'package:flutter/services.dart';
import 'package:doric/doric/doric_context.dart';
import 'package:doric/doric/engine/doric_constant.dart';
import 'package:doric/doric/shader/stack_node.dart';
import 'package:doric/doric/shader/view_node.dart';
import 'package:doric/doric/utils/util.dart';

class RootNode extends StackNode<DoricRootWidget> {
  RootNode(DoricContext context) : super(context);

  setRootWidget(DoricWidget widget) {
    setLayer(widget);
  }

  @override
  String getType() {
    return "Root";
  }

  rootWidth() {
    return DoricUtils.getScreenWidth();
  }

  rootHeight() {
    return DoricUtils.getScreenHeight();
  }
}

class DoricRootWidget extends DoricWidget with WidgetsBindingObserver {
  DoricContext _doricContext;
  bool first = true;

  DoricRootWidget() : super(null, {}) {
    WidgetsBinding.instance.addObserver(this);
  }

  config(String source, String alias, String extra) {
    _doricContext = DoricContext.create(source, alias ?? "", extra ?? "");
    setViewNode(_doricContext.getRoot());
    _doricContext.getRoot().setRootWidget(this);
  }

  onConfigChange() {
    _doricContext.build(
        DoricUtils.getScreenWidth(), DoricUtils.getScreenHeight());
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    switch (state) {
      case AppLifecycleState.resumed:
        _doricContext?.onShow();
        break;
      case AppLifecycleState.inactive:
        _doricContext?.onHidden();
        break;
      case AppLifecycleState.paused:
        _doricContext?.onHidden();
        break;
      case AppLifecycleState.detached:
        break;
    }
  }

  @override
  void dispose() {
    super.dispose();
    if (_doricContext != null) {
      _doricContext.teardown();
    }
    WidgetsBinding.instance.removeObserver(this);
  }
}
