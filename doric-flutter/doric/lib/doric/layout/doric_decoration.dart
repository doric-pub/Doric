import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

import 'doric_decoration_data.dart';

//统一处理 背景,边框,圆角,阴影
abstract class DoricDecoration {
  DoricDecorationData data;

  DoricDecoration(this.data);

  Decoration getDecoration();
}

class DoricBoxDecoration extends DoricDecoration {
  DoricBoxDecoration(DoricDecorationData data) : super(data);

  @override
  Decoration getDecoration() {
    if (data.backgroundColor == null && data.backgroundGradient == null) {
      data.backgroundColor = Colors.transparent;
    }
    return BoxDecoration(
        gradient: data.backgroundGradient,
        borderRadius: data.borderRadius,
        color: data.backgroundColor,
        boxShadow: data.boxShadow != null ? [data.boxShadow] : [],
        border: data.border);
  }
}
