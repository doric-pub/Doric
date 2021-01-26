import 'dart:async';
import 'dart:math';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:doric/doric/loader/doric_JSLoaderManager.dart';
import 'package:doric/doric/plugin/navigator_plugin.dart';

import 'shader/doric_root.dart';

class DoricPanel extends StatefulWidget {
  Map data;

  DoricPanel(this.data);

  @override
  State<StatefulWidget> createState() {
    return _DoricPanelState();
  }
}

class _DoricPanelState extends State<DoricPanel> {
  DoricRootWidget rootWidget;
  bool init = false;
  Orientation _orientation;

  @override
  void initState() {
    super.initState();
    rootWidget = DoricRootWidget();
    Timer.run(() async {
      Map data = widget.data;
      String source =
          await DoricJSLoaderManager.getInstance().loadJSBundle(data["source"]);
      if (source != null) {
        Map config = data["config"] ?? {};
        rootWidget.config(source, config["alias"] ?? "", config["extra"] ?? "");
      }
      setState(() {
        init = (source != null);
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    rootWidget.setContext(context);
    if (init) {
      return OrientationBuilder(builder: (context, orientation) {
        if (_orientation == null) {
          _orientation = orientation;
        } else if (_orientation != orientation) {
          _orientation = orientation;
          rootWidget.onConfigChange();
        }
        return rootWidget;
      });
    }
    return Container(
      child: Text("加载中..."),
    );
  }
}
