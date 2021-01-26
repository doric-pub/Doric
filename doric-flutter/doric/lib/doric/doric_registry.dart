import 'package:flutter/cupertino.dart';
import 'package:doric/doric/doric_context.dart';
import 'package:doric/doric/plugin/animate_plugin.dart';
import 'package:doric/doric/plugin/modal_plugin.dart';
import 'package:doric/doric/plugin/navigator_plugin.dart';
import 'package:doric/doric/plugin/network_plugin.dart';
import 'package:doric/doric/plugin/notch_plugin.dart';
import 'package:doric/doric/plugin/popover_plugin.dart';
import 'package:doric/doric/plugin/shader_plugin.dart';
import 'package:doric/doric/plugin/storage_plugin.dart';
import 'package:doric/doric/shader/hlayout_node.dart';
import 'package:doric/doric/shader/image_node.dart';
import 'package:doric/doric/shader/input_node.dart';
import 'package:doric/doric/shader/scroller_node.dart';
import 'package:doric/doric/shader/slider_node.dart';
import 'package:doric/doric/shader/stack_node.dart';
import 'package:doric/doric/shader/switch_node.dart';
import 'package:doric/doric/shader/text_node.dart';
import 'package:doric/doric/shader/view_node.dart';
import 'package:doric/doric/shader/vlayout_node.dart';

import 'engine/doric_plugin.dart';
import 'shader/doric_draggable.dart';
import 'shader/doric_refreshable.dart';
import 'shader/list_node.dart';

abstract class DoricLibrary {
  void load(DoricRegistry registry);
}

class ViewNodeCreator {
  Function _creatorFunc;

  ViewNodeCreator(this._creatorFunc);

  ViewNode create(DoricContext context) {
    return _creatorFunc(context);
  }
}

class DoricRegistry {
  static Map<String, String> bundles = {};
  static Set<DoricLibrary> doricLibraries = Set();
  Map<String, DoricPluginCreator> plugins = {};
  Map<String, ViewNodeCreator> viewNodes = {};

  DoricRegistry() {
    registerNativePlugin("shader", DoricPluginCreator((DoricContext context) {
      return ShaderPlugin(context);
    }));
    registerNativePlugin("network", DoricPluginCreator((DoricContext context) {
      return NetworkPlugin(context);
    }));
    registerNativePlugin("notch", DoricPluginCreator((DoricContext context) {
      return NotchPlugin(context);
    }));
    registerNativePlugin("modal", DoricPluginCreator((DoricContext context) {
      return ModalPlugin(context);
    }));
    registerNativePlugin("animate", DoricPluginCreator((DoricContext context) {
      return AnimatePlugin(context);
    }));
    registerNativePlugin("popover", DoricPluginCreator((DoricContext context) {
      return PopoverPlugin(context);
    }));
    registerNativePlugin("navigator",
        DoricPluginCreator((DoricContext context) {
      return NavigatorPlugin(context);
    }));
    registerNativePlugin("storage", DoricPluginCreator((DoricContext context) {
      return StoragePlugin(context);
    }));
    registerViewNode("Text", ViewNodeCreator((DoricContext context) {
      return TextNode(context);
    }));
    registerViewNode("Stack", ViewNodeCreator((DoricContext context) {
      return StackNode(context);
    }));
    registerViewNode("VLayout", ViewNodeCreator((DoricContext context) {
      return VLayoutNode(context);
    }));
    registerViewNode("HLayout", ViewNodeCreator((DoricContext context) {
      return HLayoutNode(context);
    }));
    registerViewNode("Scroller", ViewNodeCreator((DoricContext context) {
      return ScrollerNode(context);
    }));
    registerViewNode("Refreshable", ViewNodeCreator((DoricContext context) {
      return DoricRefreshable(context);
    }));
    registerViewNode("Draggable", ViewNodeCreator((DoricContext context) {
      return DoricDraggableNode(context);
    }));
    registerViewNode("Input", ViewNodeCreator((DoricContext context) {
      return InputNode(context);
    }));
    registerViewNode("Switch", ViewNodeCreator((DoricContext context) {
      return SwitchNode(context);
    }));
    registerViewNode("Image", ViewNodeCreator((DoricContext context) {
      return ImageNode(context);
    }));
    registerViewNode("List", ViewNodeCreator((DoricContext context) {
      return ListNode(context);
    }));
    registerViewNode("Slider", ViewNodeCreator((DoricContext context) {
      return SliderNode(context);
    }));
  }

  static void initRegistry(DoricRegistry doricRegistry) {
    for (DoricLibrary library in doricLibraries) {
      library.load(doricRegistry);
    }
  }

  static void register(DoricLibrary doricLibrary) {
    doricLibraries.add(doricLibrary);
  }

  void registerViewNode(String name, ViewNodeCreator creator) {
    viewNodes[name] = creator;
  }

  ViewNodeCreator acquireViewNodeCreator(String name) {
    return viewNodes[name];
  }

  void registerNativePlugin(String name, DoricPluginCreator creator) {
    plugins[name] = creator;
  }

  DoricPluginCreator acquirePluginCreator(String name) {
    return plugins[name];
  }
}
