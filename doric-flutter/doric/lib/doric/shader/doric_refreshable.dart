import 'package:flutter/cupertino.dart';
import 'package:doric/doric/doric_context.dart';
import 'package:doric/doric/layout/doric_node_data.dart';
import 'package:doric/doric/layout/doric_widget.dart';
import 'package:doric/doric/shader/super_node.dart';
import 'package:doric/doric/shader/view_node.dart';
import 'package:doric/doric/utils/js_dispatcher.dart';
import 'package:doric/doric/widget/doric_pullable.dart';
import 'package:doric/flutter_jscore.dart';

import '../doric_promise.dart';

class DoricRefreshable extends SuperNode<Widget> {
  ViewNode headerNode;
  ViewNode contentNode;
  String contentId;
  String headerId;
  GlobalKey refreshKey = new GlobalKey();

  DoricRefreshable(DoricContext context) : super(context) {
    registerFunc("setRefreshable", setRefreshable);
    registerFunc("setRefreshing", setRefreshing);
    registerFunc("isRefreshable", isRefreshable);
    registerFunc("isRefreshing", isRefreshing);
  }

  @override
  void beforeBlend(Map props) {
    super.beforeBlend(props);
    contentId = props["content"];
    headerId = props["header"];
  }

  @override
  void afterBlend(Map props) {
    super.afterBlend(props);
    blendContentNode();
    blendHeaderNode();
  }

  void blendContentNode() {
    Map mode = getSubModel(contentId);
    if (mode != null) {
      if (contentNode == null) {
        ViewNode node = ViewNode.create(getDoricContext(), mode["type"]);
        node.init(this);
        node.setId(contentId);
        contentNode = node;
      }
      contentNode.blend(mode["props"]);
    }
  }

  void blendHeaderNode() {
    Map mode = getSubModel(headerId);
    if (mode != null) {
      if (headerNode == null) {
        ViewNode node = ViewNode.create(getDoricContext(), mode["type"]);
        node.init(this);
        node.setId(headerId);
        headerNode = node;
      }
      headerNode.blend(mode["props"]);
    }
  }

  @override
  void blendSubNode(Map subProperties) {
    getSubNodeById(subProperties["id"])?.blend(
        getSubModel(subProperties["id"])["props"],
        thisBlendProp: subProperties["props"]);
  }

  @override
  Widget build(Map props) {
    return DoricSingleWidget(
      data: DoricNodeData(props),
      child: RefreshableWidget(this, props, key: refreshKey),
    );
  }

  @override
  ViewNode<Widget> getSubNodeById(String id) {
    if (id == headerNode?.getId()) {
      return headerNode;
    }
    if (id == contentNode?.getId()) {
      return contentNode;
    }
    return null;
  }

  DoricSwipeLayout get doricSwipeLayout {
    return refreshKey.currentWidget as DoricSwipeLayout;
  }

  void setRefreshable(JSValue jsValue, DoricPromise doricPromise) {
    var refreshable = jsValue.toBoolean;
    doricSwipeLayout.setRefreshable(refreshable);
    doricPromise.resolve([]);
  }

  void setRefreshing(JSValue jsValue, DoricPromise doricPromise) {
    var refreshing = jsValue.toBoolean;
    doricSwipeLayout.setRefreshing(refreshing);
    doricPromise.resolve([]);
  }

  void isRefreshable(JSValue jsValue, DoricPromise doricPromise) {
    doricPromise.resolve([
      JSValue.makeBoolean(
          getDoricContext().getJSContext(), doricSwipeLayout.isRefreshable())
    ]);
  }

  void isRefreshing(JSValue jsValue, DoricPromise doricPromise) {
    doricPromise.resolve([
      JSValue.makeBoolean(
          getDoricContext().getJSContext(), doricSwipeLayout.isRefreshing())
    ]);
  }
}

class RefreshableWidget extends DoricStateWidget {
  RefreshableWidget(DoricRefreshable node, Map props, {GlobalKey key})
      : super(node, props);

  @override
  State<StatefulWidget> createState() {
    return RefreshableState();
  }
}

class RefreshableState extends DoricState<DoricRefreshable, RefreshableWidget>
    implements PullingListener {
  DoricJSPatcher doricJSPatcher = new DoricJSPatcher();

  @override
  void setPullingDistance(double distance) {
    doricJSPatcher.dispatch("setPullingDistance", () {
      var jsValue = JSValue.makeNumber(getJSContext(), distance);
      getViewNode().headerNode.callJSResponse("setPullingDistance", [jsValue]);
    });
  }

  @override
  void startAnimation() {
    getViewNode().headerNode.callJSResponse("startAnimation", []);
  }

  @override
  void stopAnimation() {
    getViewNode().headerNode.callJSResponse("stopAnimation", []);
  }

  @override
  Widget build(BuildContext context) {
    return DoricSwipeLayout(
      key: getViewNode().refreshKey,
      headerView: getViewNode().headerNode.getNodeView(),
      body: getViewNode().contentNode.getNodeView(),
      pullingListener: this,
      onRefresh: () {
        getViewNode().callJSResponse(props["onRefresh"], []);
      },
    );
  }
}
