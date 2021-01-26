import 'dart:collection';
import 'package:flutter/material.dart';
import 'package:doric/doric/doric_context.dart';
import 'package:doric/doric/doric_promise.dart';
import 'package:doric/doric/layout/doric_node_data.dart';
import 'package:doric/doric/layout/doric_widget.dart';
import 'package:doric/doric/shader/stack_node.dart';
import 'package:doric/doric/shader/super_node.dart';
import 'package:doric/doric/shader/view_node.dart';
import 'package:doric/jscore/js_value.dart';

class SliderNode extends SuperNode<Widget> {
  LinkedHashMap<int, String> itemValues = LinkedHashMap();
  Map<int, ViewNode> items = {};
  String renderItemFuncId;
  bool update = false;
  PageController pageController;
  GlobalKey sliderKey = new GlobalKey();

  SliderNode(DoricContext context) : super(context) {
    registerFunc("slidePage", slidePage);
  }

  @override
  Widget build(Map<dynamic, dynamic> props) {
    return DoricSingleWidget(
      data: DoricNodeData(props),
      child: SliderWidget(this, props, sliderKey),
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

  void slidePage(JSValue jsValue, DoricPromise promise) {
    if (sliderKey.currentState != null) {
      (sliderKey.currentState as SliderState).slidePage(jsValue, promise);
    }
  }

  @override
  ViewNode<Widget> getSubNodeById(String id) {
    return items.values.firstWhere((element) => element?.getId() == id,
        orElse: () => SliderItemNode(getDoricContext()));
  }
}

// ignore: must_be_immutable
class SliderWidget extends DoricStateWidget {
  SliderWidget(ViewNode<Widget> viewNode, Map props, GlobalKey key)
      : super(viewNode, props, key: key);

  @override
  State<StatefulWidget> createState() {
    return SliderState();
  }
}

class SliderState extends DoricState<SliderNode, SliderWidget> {
  int itemCount = 0;
  int batchCount = 0;
  bool loop = false;
  GlobalKey theKey = new GlobalKey();
  String onPageSlided;
  PageController pageController;

  @override
  initState() {
    super.initState();
    pageController =
        PageController(initialPage: dataIndex2ViewIndex(0), keepPage: true);
    pageController.addListener(() {
      if (loop) {
        if (pageController.page == (0)) {
          pageController.position
              .setPixels(theKey.currentContext.size.width * itemCount);
        } else if (pageController.page == (itemCount + 1)) {
          pageController.position
              .setPixels(theKey.currentContext.size.width * 1);
        }
      }
    });
  }

  Map getItemModel(int position) {
    if (position >= itemCount) {
      return null;
    }
    var id = getViewNode().itemValues[position];
    if (id == null) {
      int batchCount = this.batchCount;
      int start = position;
      while (start > 0 && getViewNode().itemValues[start - 1] == null) {
        start--;
        batchCount++;
      }
      JSValue jsValue = getViewNode().callJSResponse("renderBunchedItems", [
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
    return getViewNode().getSubModel(getViewNode().itemValues[position]) ?? {};
  }

  void slidePage(JSValue jsValue, DoricPromise promise) {
    var data = jsValue.toObject().toMap();
    var page = (data["page"] ?? 0.0).toInt();
    var smooth = data["smooth"];
    if (page != null) {
      page = dataIndex2ViewIndex(page);
      if (smooth != null && smooth == true) {
        pageController.animateToPage(page,
            duration: Duration(milliseconds: 300), curve: Curves.linear);
      } else {
        pageController.jumpToPage(page);
      }
    }
    promise.resolve([]);
  }

  bool onNotification(Notification notification) {
    if (notification is ScrollEndNotification) {}
    return false;
  }

  int dataIndex2ViewIndex(int index) {
    if (!loop) {
      return index;
    }
    if (index == 0) {
      return 1;
    }
    if (index == itemCount + 1) {
      return 0;
    }
    return index + 1;
  }

  int viewIndex2DataIndex(int index) {
    if (!loop) {
      return index;
    }
    if (index == 0) {
      return itemCount - 1;
    }
    if (index == itemCount + 1) {
      return 0;
    }
    return index - 1;
  }

  @override
  Widget build(BuildContext context) {
    itemCount = (this.props["itemCount"] ?? 0.0).toInt();
    batchCount = (this.props["batchCount"] ?? 0.0).toInt();
    onPageSlided = props["onPageSlided"];
    var updateLoop = props["loop"] ?? false;
    if (this.loop != updateLoop) {
      var dataIndex = viewIndex2DataIndex(pageController.page.round());
      this.loop = updateLoop;
      pageController.jumpToPage(dataIndex2ViewIndex(dataIndex));
    }
    return NotificationListener(
      onNotification: onNotification,
      child: PageView.builder(
        key: theKey,
        controller: pageController,
        scrollDirection: Axis.horizontal,
        onPageChanged: (index) {
          if (onPageSlided != null && onPageSlided.isNotEmpty) {
            getViewNode().callJSResponse(onPageSlided, [
              JSValue.makeNumber(
                  getJSContext(), viewIndex2DataIndex(index) * 1.0)
            ]);
          }
        },
        itemBuilder: (context, index) {
          index = viewIndex2DataIndex(index);
          var node = getViewNode().items[index];
          if (node == null) {
            node = SliderItemNode(getDoricContext());
            getViewNode().items[index] = node;
          }
          var data = getItemModel(index) ?? {};
          node.init(getViewNode());
          node.setId(data["id"]);
          node.blend(data['props'] ?? {});

          return _SliderItem(node, index);
        },
        itemCount: loop ? itemCount + 2 : itemCount,
      ),
    );
  }
}

class SliderItemNode extends StackNode<Widget> {
  SliderItemNode(DoricContext context) : super(context);
}

class _SliderItem extends DoricStateWidget {
  int index;

  _SliderItem(ViewNode viewNode, this.index) : super(viewNode, null);

  @override
  State<StatefulWidget> createState() {
    return __SliderState();
  }
}

class __SliderState extends DoricState {
  @override
  Widget build(BuildContext context) {
    return getViewNode().getNodeView();
  }
}
