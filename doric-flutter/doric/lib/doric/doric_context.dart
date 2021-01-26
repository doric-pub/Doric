import 'dart:async';
import 'dart:convert';
import 'dart:ffi';

import 'package:flutter/widgets.dart';
import 'package:doric/doric/doric_registry.dart';
import 'package:doric/doric/engine/doric_constant.dart';
import 'package:doric/doric/engine/doric_engine.dart';
import 'package:doric/doric/shader/doric_root.dart';
import 'package:doric/doric/shader/view_node.dart';
import 'package:doric/doric/utils/log.dart';
import 'package:doric/doric/utils/util.dart';
import 'package:doric/jscore/js_value.dart';

import '../flutter_jscore.dart';
import 'engine/doric_native_driver.dart';
import 'engine/doric_plugin.dart';

class DoricContextManager {
  int counter = 0;
  Map<String, DoricContext> contextMap = {};

  DoricContextManager._();

  static final _instance = DoricContextManager._();

  factory DoricContextManager.getInstance() => _instance;

  DoricContext createContext(
      final String script, final String source, String extra) {
    String contextId = counter.toString();
    DoricContext doricContext = DoricContext(contextId, source, extra);
    contextMap[contextId] = doricContext;
    counter++;
    doricContext.getDriver().createContext(contextId, script, source);
    return doricContext;
  }

  DoricContext getTopContext() {
    return contextMap.values.last;
  }

  bool destroyContext(DoricContext doricContext) {
    var success =
        doricContext.getDriver().destroyContext(doricContext.getContextId());
    contextMap.remove(doricContext.getContextId());
    return success;
  }

  void removeAll() {
    for (var i = 0; i < aliveContexts().length; i++) {
      aliveContexts().toList()[i].teardown();
    }
  }

  static DoricContext getContext(String contextId) {
    return DoricContextManager.getInstance().contextMap[contextId];
  }

  static Iterable<DoricContext> aliveContexts() {
    return DoricContextManager.getInstance().contextMap.values;
  }
}

class DoricContext {
  String mContextId;
  String source;
  String script;
  String extra;
  Object initParams;
  Map<String, DoricPlugin> mPluginMap = {};
  Map<String, Map<String, ViewNode>> mHeadNodes = {}; //
  RootNode root;
  bool isTeardown = false;

  DoricContext(this.mContextId, this.source, this.extra) {
    root = new RootNode(this);
  }

  AnimationController animationController;

  Iterable<ViewNode> allHeadNodes(String type) {
    return Map<String, ViewNode>.from((mHeadNodes[type] ?? {})).values;
  }

  ViewNode removeHeadNode(String type, String id) {
    return (mHeadNodes[type] ?? {}).remove(id);
  }

  void addHeadNode(String type, ViewNode viewNode) {
    Map typeNodes = mHeadNodes[type];
    if (typeNodes == null) {
      typeNodes = Map<String, ViewNode>();
    }
    typeNodes[viewNode.getId()] = viewNode;
    mHeadNodes[type] = typeNodes;
  }

  ViewNode targetViewNode(String id) {
    if (id == root.getId()) {
      return root;
    }
    var headVal = mHeadNodes.values.toList();
    for (var value in headVal) {
      if (value.containsKey(id)) {
        return value[id];
      }
    }
    return null;
  }

  setAnimationController(AnimationController animationController) {
    this.animationController = animationController;
  }

  AnimationController getAnimationController() {
    return this.animationController;
  }

  void init(String initData) {
    this.extra = initData;
    if (initData != null) {
      callEntity(DoricConstant.DORIC_ENTITY_INIT,
          [JSValue.makeString(getJSContext(), initData)]);
    }
  }

  static DoricContext create(String script, String source, String extra) {
    DoricContext doricContext =
        DoricContextManager.getInstance().createContext(script, source, extra);
    doricContext.script = script;
    doricContext.initContext();
    return doricContext;
  }

  initContext() {
    Timer.run(() {
      init(extra);
      callEntity(DoricConstant.DORIC_ENTITY_CREATE, []);
      build(DoricUtils.getScreenWidth(), DoricUtils.getScreenHeight());
      onShow();
    });
  }

  BuildContext getContext() {
    return root.getLayer().getContext();
  }

  void build(double width, double height) {
    print(width.toString()+"   "+height.toString());
    callEntity(DoricConstant.DORIC_ENTITY_BUILD, [
      JSValue.makeFromObject(
          getJSContext(),
          initParams = {
            "width": width,
            "height": height,
          })
    ]);
  }

  void onShow() {
    callEntity(DoricConstant.DORIC_ENTITY_SHOW, []);
  }

  void onHidden() {
    callEntity(DoricConstant.DORIC_ENTITY_HIDDEN, []);
  }

  void teardown() {
    DoricLog.i("teardown");
    isTeardown = true;
    callEntity(DoricConstant.DORIC_ENTITY_DESTROY, []);
    mPluginMap.forEach((key, value) {
      value.onTearDown();
    });
    mPluginMap.clear();
    DoricContextManager.getInstance().destroyContext(this);
  }

  DoricPlugin obtainPlugin(String name, DoricPluginCreator creator) {
    DoricPlugin plugin = mPluginMap[name];
    if (plugin != null) {
      return plugin;
    }
    plugin = creator.create(this);
    mPluginMap[name] = plugin;
    return plugin;
  }

  RootNode getRoot() {
    return root;
  }

  getContextId() {
    return mContextId;
  }

  JSValue callEntity(String methodName, List<JSValue> args) {
    return getDriver().invokeContextEntityMethod(mContextId, methodName, args);
  }

  JSContext getJSContext() {
    return getDriver().getJSContext();
  }

  DoricNativeDriver getDriver() {
    return DoricNativeDriver.getInstance();
  }
}

class DoricContextHolder {
  final DoricContext _context;

  DoricContextHolder(this._context);

  DoricContext getDoricContext() {
    return _context;
  }
}
