import 'dart:collection';
import 'package:flutter/material.dart';
import 'package:doric/doric/doric_context.dart';
import 'package:doric/doric/layout/doric_node_data.dart';
import 'package:doric/doric/layout/doric_widget.dart';
import 'package:doric/doric/shader/stack_node.dart';
import 'package:doric/doric/shader/super_node.dart';
import 'package:doric/doric/shader/view_node.dart';
import 'package:doric/jscore/js_value.dart';

class ListNode extends SuperNode<Widget> {
  ListNode(DoricContext context) : super(context);
  LinkedHashMap<int, String> itemValues = LinkedHashMap();
  Map<int, ViewNode> items = {};
  String renderItemFuncId;
  bool update = false;

  @override
  Widget build(Map<dynamic, dynamic> props) {
    return DoricSingleWidget(
      data: DoricNodeData(props),
      child: ListWidget(this, props),
    );
  }

  @override
  bool shouldUpdate() {
    return super.shouldUpdate() || update;
  }

  @override
  void beforeBlend(Map props) {
    update = true;
    var renderItemFuncId = thisBlendProp["renderItem"];
    if (renderItemFuncId != null && renderItemFuncId != this.renderItemFuncId) {
      this.renderItemFuncId = renderItemFuncId;
      itemValues.forEach((key, value) {
        removeSubModel(value);
      });
      itemValues.clear();
    }
    super.beforeBlend(props);
  }

  @override
  void blendSubNode(Map<dynamic, dynamic> subProperties) {
    var node = getSubNodeById(subProperties["id"]);
    if (node != null) {
      node.blend(getSubModel(subProperties["id"])["props"],
          thisBlendProp: subProperties["props"]);
    }
  }

  @override
  ViewNode<Widget> getSubNodeById(String id) {
    return items.values.firstWhere((element) => element?.getId() == id,
        orElse: () => ListItemNode(getDoricContext()));
  }
}

class ListState extends DoricState<ListNode, ListWidget> {
  int itemCount = 0;
  int batchCount = 0;
  ScrollController _scrollController;
  String loadMoreViewId;
  String onLoadMoreId;

  @override
  initState() {
    super.initState();
    _scrollController = ScrollController(keepScrollOffset: true);
    _scrollController.addListener(() {
      callJsScroll(props["onScroll"]);
    });
  }

  callJsScroll(func) {
    if (func != null) {
      getViewNode().callJSResponse(func, [
        JSValue.makeFromObject( getViewNode().getDoricContext().getJSContext(),
            {"x": 0, "y": _scrollController.offset})
      ]);
    }
  }

  Map getItemModel(int position) {
    if (position >= itemCount) {
      return  getViewNode().getSubModel(loadMoreViewId);
    }
    var id =  getViewNode().itemValues[position];
    if (id == null) {
      int batchCount = this.batchCount;
      int start = position;
      while (start > 0 &&  getViewNode().itemValues[start - 1] == null) {
        start--;
        batchCount++;
      }
      JSValue jsValue =  getViewNode().callJSResponse("renderBunchedItems", [
        JSValue.makeNumber(getJSContext(), start.toDouble()),
        JSValue.makeNumber(getJSContext(), batchCount.toDouble())
      ]);
      if (jsValue.isArray) {
        var result = jsValue.toObject().toList();
        for (int i = 0; i < result.length; i++) {
          var itemModel = result[i];
          String itemId = itemModel["id"];
           getViewNode().itemValues[i + start] = itemId;
           getViewNode().setSubModel(itemId, itemModel);
        }
      }
    }
    return  getViewNode().getSubModel( getViewNode().itemValues[position]) ?? {};
  }

  bool onNotification(Notification notification) {
    if (notification is ScrollEndNotification) {
      callJsScroll(props["onScrollEnd"]);
    }
    return false;
  }

  @override
  Widget build(BuildContext context) {
    onLoadMoreId = this.props["onLoadMore"];
    loadMoreViewId = this.props["loadMoreView"];
    itemCount = (this.props["itemCount"] ?? 0.0).toInt();
    batchCount = (this.props["batchCount"] ?? 0.0).toInt();

    return NotificationListener(
      onNotification: onNotification,
      child: ListView.builder(
        controller: _scrollController,
        physics: const ClampingScrollPhysics(),
        itemBuilder: (context, index) {
          var node =  getViewNode().items[index];
          if (node == null) {
            node = ListItemNode(getDoricContext());
             getViewNode().items[index] = node;
          }
          var data = getItemModel(index) ?? {};
          node.init( getViewNode());
          node.setId(data["id"]);
          node.blend(data['props'] ?? {});
          if (index >= itemCount && onLoadMoreId != null) {
             getViewNode().callJSResponse(onLoadMoreId, []);
          }
          return _ListItem(node, index);
        },
        itemCount: itemCount + (loadMoreViewId == null ? 0 : 1),
      ),
    );
  }
}

class ListWidget extends DoricStateWidget {
  ListWidget(ViewNode<Widget> node, Map props) : super(node, props);

  @override
  State<StatefulWidget> createState() {
    return ListState();
  }
}

class ListItemNode extends StackNode<Widget> {
  ListItemNode(DoricContext context) : super(context);
}

class _ListItem extends DoricStateWidget {
  int index;

  _ListItem(ViewNode viewNode, this.index) : super(viewNode, null);

  @override
  State<StatefulWidget> createState() {
    return _ListItemState();
  }
}

class _ListItemState extends DoricState {
  @override
  Widget build(BuildContext context) {
    return getViewNode().getNodeView();
  }
}
