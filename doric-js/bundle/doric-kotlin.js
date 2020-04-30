(function (_, Kotlin) {
  'use strict';
  var $$importsForInline$$ = _.$$importsForInline$$ || (_.$$importsForInline$$ = {});
  var VLayout = doric.VLayout;
  var HLayout = doric.HLayout;
  var Stack = doric.Stack;
  var FlexLayout = doric.FlexLayout;
  var Text = doric.Text;
  var Image = doric.Image;
  var Scroller = doric.Scroller;
  var List = doric.List;
  var ListItem = doric.ListItem;
  var Slider = doric.Slider;
  var SlideItem = doric.SlideItem;
  var FlowLayout = doric.FlowLayout;
  var FlowLayoutItem = doric.FlowLayoutItem;
  var Input = doric.Input;
  var Refreshable = doric.Refreshable;
  var Switch = doric.Switch;
  var Draggable = doric.Draggable;
  var defineInlineFunction = Kotlin.defineInlineFunction;
  var wrapFunction = Kotlin.wrapFunction;
  var to = Kotlin.kotlin.to_ujzrz7$;
  var json = Kotlin.kotlin.js.json_pyyo18$;
  var Kind_CLASS = Kotlin.Kind.CLASS;
  var Color = doric.Color;
  var equals = Kotlin.equals;
  var LayoutSpec$FIT = doric.LayoutSpec.FIT;
  var LayoutSpec$MOST = doric.LayoutSpec.MOST;
  var LayoutSpec$JUST = doric.LayoutSpec.JUST;
  var Kind_OBJECT = Kotlin.Kind.OBJECT;
  var Enum = Kotlin.kotlin.Enum;
  var throwISE = Kotlin.throwISE;
  var animate = doric.animate;
  var modal = doric.modal;
  var coordinator = doric.coordinator;
  var popover = doric.popover;
  GradientColor.prototype = Object.create(Color.prototype);
  GradientColor.prototype.constructor = GradientColor;
  FontStyle.prototype = Object.create(Enum.prototype);
  FontStyle.prototype.constructor = FontStyle;
  ValueType.prototype = Object.create(Enum.prototype);
  ValueType.prototype.constructor = ValueType;
  function Factory_VLayout$lambda() {
    var ret = new VLayout();
    ret.layoutConfig = (new LayoutConfig()).fit();
    return ret;
  }
  var Factory_VLayout;
  function Factory_HLayout$lambda() {
    var ret = new HLayout();
    ret.layoutConfig = (new LayoutConfig()).fit();
    return ret;
  }
  var Factory_HLayout;
  function Factory_Stack$lambda() {
    var ret = new Stack();
    ret.layoutConfig = (new LayoutConfig()).fit();
    return ret;
  }
  var Factory_Stack;
  function Factory_FlexLayout$lambda() {
    var ret = new FlexLayout();
    ret.layoutConfig = (new LayoutConfig()).fit();
    return ret;
  }
  var Factory_FlexLayout;
  function Factory_Text$lambda() {
    var ret = new Text();
    ret.layoutConfig = (new LayoutConfig()).fit();
    return ret;
  }
  var Factory_Text;
  function Factory_Image$lambda() {
    var ret = new Image();
    ret.layoutConfig = (new LayoutConfig()).fit();
    return ret;
  }
  var Factory_Image;
  function Factory_Scroller$lambda() {
    var ret = new Scroller();
    return ret;
  }
  var Factory_Scroller;
  function Factory_List$lambda() {
    var ret = new List();
    return ret;
  }
  var Factory_List;
  function Factory_ListItem$lambda() {
    var ret = new ListItem();
    ret.layoutConfig = new LayoutConfig();
    return ret;
  }
  var Factory_ListItem;
  function Factory_Slider$lambda() {
    var ret = new Slider();
    return ret;
  }
  var Factory_Slider;
  function Factory_SliderItem$lambda() {
    var ret = new SlideItem();
    ret.layoutConfig = (new LayoutConfig()).most();
    return ret;
  }
  var Factory_SliderItem;
  function Factory_FlowLayout$lambda() {
    var ret = new FlowLayout();
    return ret;
  }
  var Factory_FlowLayout;
  function Factory_FlowLayoutItem$lambda() {
    var ret = new FlowLayoutItem();
    return ret;
  }
  var Factory_FlowLayoutItem;
  function Factory_Input$lambda() {
    var ret = new Input();
    return ret;
  }
  var Factory_Input;
  function Factory_Refreshable$lambda() {
    var ret = new Refreshable();
    return ret;
  }
  var Factory_Refreshable;
  function Factory_Switch$lambda() {
    var ret = new Switch();
    return ret;
  }
  var Factory_Switch;
  function Factory_Draggable$lambda() {
    var ret = new Draggable();
    return ret;
  }
  var Factory_Draggable;
  var doricView = defineInlineFunction('doric-kotlin.doric.kotlin.doricView_fvi3mv$', function (factory, init, parent) {
    var view = factory();
    init(view);
    parent.addChild(view);
    return view;
  });
  var vlayout = defineInlineFunction('doric-kotlin.doric.kotlin.vlayout_3zqh6x$', wrapFunction(function () {
    var kotlin = _.doric.kotlin;
    return function ($receiver, function_0) {
      var view = kotlin.Factory_VLayout();
      function_0(view);
      $receiver.addChild(view);
      return view;
    };
  }));
  var hlayout = defineInlineFunction('doric-kotlin.doric.kotlin.hlayout_q36rgb$', wrapFunction(function () {
    var kotlin = _.doric.kotlin;
    return function ($receiver, function_0) {
      var view = kotlin.Factory_HLayout();
      function_0(view);
      $receiver.addChild(view);
      return view;
    };
  }));
  var stack = defineInlineFunction('doric-kotlin.doric.kotlin.stack_94hqmp$', wrapFunction(function () {
    var kotlin = _.doric.kotlin;
    return function ($receiver, function_0) {
      var view = kotlin.Factory_Stack();
      function_0(view);
      $receiver.addChild(view);
      return view;
    };
  }));
  var flexlayout = defineInlineFunction('doric-kotlin.doric.kotlin.flexlayout_rrrbn6$', wrapFunction(function () {
    var kotlin = _.doric.kotlin;
    return function ($receiver, function_0) {
      var view = kotlin.Factory_FlexLayout();
      function_0(view);
      $receiver.addChild(view);
      return view;
    };
  }));
  var text = defineInlineFunction('doric-kotlin.doric.kotlin.text_p7a598$', wrapFunction(function () {
    var kotlin = _.doric.kotlin;
    return function ($receiver, function_0) {
      var view = kotlin.Factory_Text();
      function_0(view);
      $receiver.addChild(view);
      return view;
    };
  }));
  var image = defineInlineFunction('doric-kotlin.doric.kotlin.image_9tdvok$', wrapFunction(function () {
    var kotlin = _.doric.kotlin;
    return function ($receiver, function_0) {
      var view = kotlin.Factory_Image();
      function_0(view);
      $receiver.addChild(view);
      return view;
    };
  }));
  var input = defineInlineFunction('doric-kotlin.doric.kotlin.input_gkob83$', wrapFunction(function () {
    var kotlin = _.doric.kotlin;
    return function ($receiver, function_0) {
      var view = kotlin.Factory_Input();
      function_0(view);
      $receiver.addChild(view);
      return view;
    };
  }));
  var scroller = defineInlineFunction('doric-kotlin.doric.kotlin.scroller_rk47hl$', wrapFunction(function () {
    var kotlin = _.doric.kotlin;
    return function ($receiver, function_0) {
      var view = kotlin.Factory_Scroller();
      function_0(view);
      $receiver.addChild(view);
      return view;
    };
  }));
  var list = defineInlineFunction('doric-kotlin.doric.kotlin.list_4qks7h$', wrapFunction(function () {
    var kotlin = _.doric.kotlin;
    return function ($receiver, function_0) {
      var view = kotlin.Factory_List();
      function_0(view);
      $receiver.addChild(view);
      return view;
    };
  }));
  var listItem = defineInlineFunction('doric-kotlin.doric.kotlin.listItem_cyko1s$', wrapFunction(function () {
    var kotlin = _.doric.kotlin;
    return function ($receiver, function_0) {
      var view = kotlin.Factory_ListItem();
      function_0(view);
      $receiver.addChild(view);
      return view;
    };
  }));
  var flowlayout = defineInlineFunction('doric-kotlin.doric.kotlin.flowlayout_snomu1$', wrapFunction(function () {
    var kotlin = _.doric.kotlin;
    return function ($receiver, function_0) {
      var view = kotlin.Factory_FlowLayout();
      function_0(view);
      $receiver.addChild(view);
      return view;
    };
  }));
  var flowLayoutItem = defineInlineFunction('doric-kotlin.doric.kotlin.flowLayoutItem_iai886$', wrapFunction(function () {
    var kotlin = _.doric.kotlin;
    return function ($receiver, function_0) {
      var view = kotlin.Factory_FlowLayoutItem();
      function_0(view);
      $receiver.addChild(view);
      return view;
    };
  }));
  var slider = defineInlineFunction('doric-kotlin.doric.kotlin.slider_cfwmb4$', wrapFunction(function () {
    var kotlin = _.doric.kotlin;
    return function ($receiver, function_0) {
      var view = kotlin.Factory_Slider();
      function_0(view);
      $receiver.addChild(view);
      return view;
    };
  }));
  var sliderItem = defineInlineFunction('doric-kotlin.doric.kotlin.sliderItem_xx9ca5$', wrapFunction(function () {
    var kotlin = _.doric.kotlin;
    return function ($receiver, function_0) {
      var view = kotlin.Factory_SliderItem();
      function_0(view);
      $receiver.addChild(view);
      return view;
    };
  }));
  var switch_0 = defineInlineFunction('doric-kotlin.doric.kotlin.switch_umm6n7$', wrapFunction(function () {
    var kotlin = _.doric.kotlin;
    return function ($receiver, function_0) {
      var view = kotlin.Factory_Switch();
      function_0(view);
      $receiver.addChild(view);
      return view;
    };
  }));
  var draggable = defineInlineFunction('doric-kotlin.doric.kotlin.draggable_n93hli$', wrapFunction(function () {
    var kotlin = _.doric.kotlin;
    return function ($receiver, function_0) {
      var view = kotlin.Factory_Draggable();
      function_0(view);
      $receiver.addChild(view);
      return view;
    };
  }));
  function Border(color, width) {
    this.color = color;
    this.width = width;
  }
  Border.prototype.toModel = function () {
    return json([to('width', this.width), to('color', this.color.toModel())]);
  };
  Border.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'Border',
    interfaces: []
  };
  Border.prototype.component1 = function () {
    return this.color;
  };
  Border.prototype.component2 = function () {
    return this.width;
  };
  Border.prototype.copy_5gwl5a$ = function (color, width) {
    return new Border(color === void 0 ? this.color : color, width === void 0 ? this.width : width);
  };
  Border.prototype.toString = function () {
    return 'Border(color=' + Kotlin.toString(this.color) + (', width=' + Kotlin.toString(this.width)) + ')';
  };
  Border.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.color) | 0;
    result = result * 31 + Kotlin.hashCode(this.width) | 0;
    return result;
  };
  Border.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.color, other.color) && Kotlin.equals(this.width, other.width)))));
  };
  function Edge(left, right, top, bottom) {
    if (left === void 0)
      left = null;
    if (right === void 0)
      right = null;
    if (top === void 0)
      top = null;
    if (bottom === void 0)
      bottom = null;
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
  }
  Edge.prototype.toModel = function () {
    var $receiver = json([]);
    var tmp$, tmp$_0, tmp$_1, tmp$_2;
    if ((tmp$ = this.left) != null) {
      $receiver['left'] = tmp$;
    }if ((tmp$_0 = this.right) != null) {
      $receiver['right'] = tmp$_0;
    }if ((tmp$_1 = this.top) != null) {
      $receiver['top'] = tmp$_1;
    }if ((tmp$_2 = this.bottom) != null) {
      $receiver['bottom'] = tmp$_2;
    }return $receiver;
  };
  Edge.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'Edge',
    interfaces: []
  };
  Edge.prototype.component1 = function () {
    return this.left;
  };
  Edge.prototype.component2 = function () {
    return this.right;
  };
  Edge.prototype.component3 = function () {
    return this.top;
  };
  Edge.prototype.component4 = function () {
    return this.bottom;
  };
  Edge.prototype.copy_ybjecs$ = function (left, right, top, bottom) {
    return new Edge(left === void 0 ? this.left : left, right === void 0 ? this.right : right, top === void 0 ? this.top : top, bottom === void 0 ? this.bottom : bottom);
  };
  Edge.prototype.toString = function () {
    return 'Edge(left=' + Kotlin.toString(this.left) + (', right=' + Kotlin.toString(this.right)) + (', top=' + Kotlin.toString(this.top)) + (', bottom=' + Kotlin.toString(this.bottom)) + ')';
  };
  Edge.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.left) | 0;
    result = result * 31 + Kotlin.hashCode(this.right) | 0;
    result = result * 31 + Kotlin.hashCode(this.top) | 0;
    result = result * 31 + Kotlin.hashCode(this.bottom) | 0;
    return result;
  };
  Edge.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.left, other.left) && Kotlin.equals(this.right, other.right) && Kotlin.equals(this.top, other.top) && Kotlin.equals(this.bottom, other.bottom)))));
  };
  function Shadow(color, opacity, radius, offsetX, offsetY) {
    this.color = color;
    this.opacity = opacity;
    this.radius = radius;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }
  Shadow.prototype.toModel = function () {
    var $receiver = json([]);
    $receiver['color'] = this.color.toModel();
    $receiver['opacity'] = this.opacity;
    $receiver['radius'] = this.radius;
    $receiver['offsetX'] = this.offsetX;
    $receiver['offsetY'] = this.offsetY;
    return $receiver;
  };
  Shadow.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'Shadow',
    interfaces: []
  };
  Shadow.prototype.component1 = function () {
    return this.color;
  };
  Shadow.prototype.component2 = function () {
    return this.opacity;
  };
  Shadow.prototype.component3 = function () {
    return this.radius;
  };
  Shadow.prototype.component4 = function () {
    return this.offsetX;
  };
  Shadow.prototype.component5 = function () {
    return this.offsetY;
  };
  Shadow.prototype.copy_adbb3g$ = function (color, opacity, radius, offsetX, offsetY) {
    return new Shadow(color === void 0 ? this.color : color, opacity === void 0 ? this.opacity : opacity, radius === void 0 ? this.radius : radius, offsetX === void 0 ? this.offsetX : offsetX, offsetY === void 0 ? this.offsetY : offsetY);
  };
  Shadow.prototype.toString = function () {
    return 'Shadow(color=' + Kotlin.toString(this.color) + (', opacity=' + Kotlin.toString(this.opacity)) + (', radius=' + Kotlin.toString(this.radius)) + (', offsetX=' + Kotlin.toString(this.offsetX)) + (', offsetY=' + Kotlin.toString(this.offsetY)) + ')';
  };
  Shadow.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.color) | 0;
    result = result * 31 + Kotlin.hashCode(this.opacity) | 0;
    result = result * 31 + Kotlin.hashCode(this.radius) | 0;
    result = result * 31 + Kotlin.hashCode(this.offsetX) | 0;
    result = result * 31 + Kotlin.hashCode(this.offsetY) | 0;
    return result;
  };
  Shadow.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.color, other.color) && Kotlin.equals(this.opacity, other.opacity) && Kotlin.equals(this.radius, other.radius) && Kotlin.equals(this.offsetX, other.offsetX) && Kotlin.equals(this.offsetY, other.offsetY)))));
  };
  function GradientColor(start, end, orientation) {
    Color.call(this, 0);
    this.start = start;
    this.end = end;
    this.orientation = orientation;
  }
  GradientColor.prototype.toModel = function () {
    var $receiver = json([]);
    $receiver['start'] = this.start.toModel();
    $receiver['end'] = this.end.toModel();
    $receiver['orientation'] = this.orientation;
    return $receiver;
  };
  GradientColor.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'GradientColor',
    interfaces: []
  };
  GradientColor.prototype.component1 = function () {
    return this.start;
  };
  GradientColor.prototype.component2 = function () {
    return this.end;
  };
  GradientColor.prototype.component3 = function () {
    return this.orientation;
  };
  GradientColor.prototype.copy_jdkezj$ = function (start, end, orientation) {
    return new GradientColor(start === void 0 ? this.start : start, end === void 0 ? this.end : end, orientation === void 0 ? this.orientation : orientation);
  };
  GradientColor.prototype.toString = function () {
    return 'GradientColor(start=' + Kotlin.toString(this.start) + (', end=' + Kotlin.toString(this.end)) + (', orientation=' + Kotlin.toString(this.orientation)) + ')';
  };
  GradientColor.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.start) | 0;
    result = result * 31 + Kotlin.hashCode(this.end) | 0;
    result = result * 31 + Kotlin.hashCode(this.orientation) | 0;
    return result;
  };
  GradientColor.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.start, other.start) && Kotlin.equals(this.end, other.end) && Kotlin.equals(this.orientation, other.orientation)))));
  };
  function Corners(leftTop, rightTop, leftBottom, rightBottom) {
    if (leftTop === void 0)
      leftTop = null;
    if (rightTop === void 0)
      rightTop = null;
    if (leftBottom === void 0)
      leftBottom = null;
    if (rightBottom === void 0)
      rightBottom = null;
    this.leftTop = leftTop;
    this.rightTop = rightTop;
    this.leftBottom = leftBottom;
    this.rightBottom = rightBottom;
  }
  Corners.prototype.toModel = function () {
    if (equals(this.leftTop, this.rightTop) && equals(this.leftTop, this.leftBottom) && equals(this.leftTop, this.rightBottom)) {
      return this.leftTop;
    }var $receiver = json([]);
    var tmp$, tmp$_0, tmp$_1, tmp$_2;
    if ((tmp$ = this.leftTop) != null) {
      $receiver['leftTop'] = tmp$;
    }if ((tmp$_0 = this.rightTop) != null) {
      $receiver['rightTop'] = tmp$_0;
    }if ((tmp$_1 = this.leftBottom) != null) {
      $receiver['leftBottom'] = tmp$_1;
    }if ((tmp$_2 = this.rightBottom) != null) {
      $receiver['rightBottom'] = tmp$_2;
    }return $receiver;
  };
  Corners.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'Corners',
    interfaces: []
  };
  function Corners_init(corner, $this) {
    $this = $this || Object.create(Corners.prototype);
    Corners.call($this, corner, corner, corner, corner);
    return $this;
  }
  Corners.prototype.component1 = function () {
    return this.leftTop;
  };
  Corners.prototype.component2 = function () {
    return this.rightTop;
  };
  Corners.prototype.component3 = function () {
    return this.leftBottom;
  };
  Corners.prototype.component4 = function () {
    return this.rightBottom;
  };
  Corners.prototype.copy_ybjecs$ = function (leftTop, rightTop, leftBottom, rightBottom) {
    return new Corners(leftTop === void 0 ? this.leftTop : leftTop, rightTop === void 0 ? this.rightTop : rightTop, leftBottom === void 0 ? this.leftBottom : leftBottom, rightBottom === void 0 ? this.rightBottom : rightBottom);
  };
  Corners.prototype.toString = function () {
    return 'Corners(leftTop=' + Kotlin.toString(this.leftTop) + (', rightTop=' + Kotlin.toString(this.rightTop)) + (', leftBottom=' + Kotlin.toString(this.leftBottom)) + (', rightBottom=' + Kotlin.toString(this.rightBottom)) + ')';
  };
  Corners.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.leftTop) | 0;
    result = result * 31 + Kotlin.hashCode(this.rightTop) | 0;
    result = result * 31 + Kotlin.hashCode(this.leftBottom) | 0;
    result = result * 31 + Kotlin.hashCode(this.rightBottom) | 0;
    return result;
  };
  Corners.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.leftTop, other.leftTop) && Kotlin.equals(this.rightTop, other.rightTop) && Kotlin.equals(this.leftBottom, other.leftBottom) && Kotlin.equals(this.rightBottom, other.rightBottom)))));
  };
  function LayoutConfig(widthSpec, heightSpec, margin, weight, alignment, maxWidth, maxHeight, minWidth, minHeight) {
    if (widthSpec === void 0)
      widthSpec = null;
    if (heightSpec === void 0)
      heightSpec = null;
    if (margin === void 0)
      margin = null;
    if (weight === void 0)
      weight = null;
    if (alignment === void 0)
      alignment = null;
    if (maxWidth === void 0)
      maxWidth = null;
    if (maxHeight === void 0)
      maxHeight = null;
    if (minWidth === void 0)
      minWidth = null;
    if (minHeight === void 0)
      minHeight = null;
    this.widthSpec = widthSpec;
    this.heightSpec = heightSpec;
    this.margin = margin;
    this.weight = weight;
    this.alignment = alignment;
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this.minWidth = minWidth;
    this.minHeight = minHeight;
  }
  LayoutConfig.prototype.fit = function () {
    this.widthSpec = LayoutSpec$FIT;
    this.heightSpec = LayoutSpec$FIT;
    return this;
  };
  LayoutConfig.prototype.most = function () {
    this.widthSpec = LayoutSpec$MOST;
    this.heightSpec = LayoutSpec$MOST;
    return this;
  };
  LayoutConfig.prototype.just = function () {
    this.widthSpec = LayoutSpec$JUST;
    this.heightSpec = LayoutSpec$JUST;
    return this;
  };
  LayoutConfig.prototype.configWidth_5ch4ck$ = function (w) {
    this.widthSpec = w;
    return this;
  };
  LayoutConfig.prototype.configHeight_5ch4ck$ = function (h) {
    this.heightSpec = h;
    return this;
  };
  LayoutConfig.prototype.configMargin_dmhj31$ = function (m) {
    this.margin = m;
    return this;
  };
  LayoutConfig.prototype.configAlignment_e5kceq$ = function (a) {
    this.alignment = a;
    return this;
  };
  LayoutConfig.prototype.configWeight_3p81yu$ = function (w) {
    this.weight = w;
    return this;
  };
  LayoutConfig.prototype.configMaxWidth_3p81yu$ = function (v) {
    this.maxWidth = v;
    return this;
  };
  LayoutConfig.prototype.configMaxHeight_3p81yu$ = function (v) {
    this.maxHeight = v;
    return this;
  };
  LayoutConfig.prototype.configMinWidth_3p81yu$ = function (v) {
    this.minWidth = v;
    return this;
  };
  LayoutConfig.prototype.configMinHeight_3p81yu$ = function (v) {
    this.minHeight = v;
    return this;
  };
  LayoutConfig.prototype.toModel = function () {
    var $receiver = json([]);
    var tmp$, tmp$_0, tmp$_1, tmp$_2, tmp$_3, tmp$_4, tmp$_5, tmp$_6, tmp$_7;
    if ((tmp$ = this.widthSpec) != null) {
      $receiver['widthSpec'] = tmp$;
    }if ((tmp$_0 = this.heightSpec) != null) {
      $receiver['heightSpec'] = tmp$_0;
    }if ((tmp$_1 = this.margin) != null) {
      $receiver['margin'] = tmp$_1.toModel();
    }if ((tmp$_2 = this.weight) != null) {
      $receiver['weight'] = tmp$_2;
    }if ((tmp$_3 = this.alignment) != null) {
      $receiver['alignment'] = tmp$_3.toModel();
    }if ((tmp$_4 = this.maxWidth) != null) {
      $receiver['maxWidth'] = tmp$_4;
    }if ((tmp$_5 = this.maxHeight) != null) {
      $receiver['maxHeight'] = tmp$_5;
    }if ((tmp$_6 = this.minWidth) != null) {
      $receiver['minWidth'] = tmp$_6;
    }if ((tmp$_7 = this.minHeight) != null) {
      $receiver['minHeight'] = tmp$_7;
    }return $receiver;
  };
  LayoutConfig.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'LayoutConfig',
    interfaces: []
  };
  LayoutConfig.prototype.component1 = function () {
    return this.widthSpec;
  };
  LayoutConfig.prototype.component2 = function () {
    return this.heightSpec;
  };
  LayoutConfig.prototype.component3 = function () {
    return this.margin;
  };
  LayoutConfig.prototype.component4 = function () {
    return this.weight;
  };
  LayoutConfig.prototype.component5 = function () {
    return this.alignment;
  };
  LayoutConfig.prototype.component6 = function () {
    return this.maxWidth;
  };
  LayoutConfig.prototype.component7 = function () {
    return this.maxHeight;
  };
  LayoutConfig.prototype.component8 = function () {
    return this.minWidth;
  };
  LayoutConfig.prototype.component9 = function () {
    return this.minHeight;
  };
  LayoutConfig.prototype.copy_ocyks8$ = function (widthSpec, heightSpec, margin, weight, alignment, maxWidth, maxHeight, minWidth, minHeight) {
    return new LayoutConfig(widthSpec === void 0 ? this.widthSpec : widthSpec, heightSpec === void 0 ? this.heightSpec : heightSpec, margin === void 0 ? this.margin : margin, weight === void 0 ? this.weight : weight, alignment === void 0 ? this.alignment : alignment, maxWidth === void 0 ? this.maxWidth : maxWidth, maxHeight === void 0 ? this.maxHeight : maxHeight, minWidth === void 0 ? this.minWidth : minWidth, minHeight === void 0 ? this.minHeight : minHeight);
  };
  LayoutConfig.prototype.toString = function () {
    return 'LayoutConfig(widthSpec=' + Kotlin.toString(this.widthSpec) + (', heightSpec=' + Kotlin.toString(this.heightSpec)) + (', margin=' + Kotlin.toString(this.margin)) + (', weight=' + Kotlin.toString(this.weight)) + (', alignment=' + Kotlin.toString(this.alignment)) + (', maxWidth=' + Kotlin.toString(this.maxWidth)) + (', maxHeight=' + Kotlin.toString(this.maxHeight)) + (', minWidth=' + Kotlin.toString(this.minWidth)) + (', minHeight=' + Kotlin.toString(this.minHeight)) + ')';
  };
  LayoutConfig.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.widthSpec) | 0;
    result = result * 31 + Kotlin.hashCode(this.heightSpec) | 0;
    result = result * 31 + Kotlin.hashCode(this.margin) | 0;
    result = result * 31 + Kotlin.hashCode(this.weight) | 0;
    result = result * 31 + Kotlin.hashCode(this.alignment) | 0;
    result = result * 31 + Kotlin.hashCode(this.maxWidth) | 0;
    result = result * 31 + Kotlin.hashCode(this.maxHeight) | 0;
    result = result * 31 + Kotlin.hashCode(this.minWidth) | 0;
    result = result * 31 + Kotlin.hashCode(this.minHeight) | 0;
    return result;
  };
  LayoutConfig.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.widthSpec, other.widthSpec) && Kotlin.equals(this.heightSpec, other.heightSpec) && Kotlin.equals(this.margin, other.margin) && Kotlin.equals(this.weight, other.weight) && Kotlin.equals(this.alignment, other.alignment) && Kotlin.equals(this.maxWidth, other.maxWidth) && Kotlin.equals(this.maxHeight, other.maxHeight) && Kotlin.equals(this.minWidth, other.minWidth) && Kotlin.equals(this.minHeight, other.minHeight)))));
  };
  function layoutConfig() {
    return new LayoutConfig();
  }
  function Gravity(gravity) {
    Gravity$Companion_getInstance();
    this.gravity = gravity;
  }
  function Gravity$Companion() {
    Gravity$Companion_instance = this;
    this.SPECIFIED_0 = 1;
    this.START_0 = 2;
    this.END_0 = 4;
    this.SHIFT_X_0 = 0;
    this.SHIFT_Y_0 = 4;
    this.LEFT_0 = (this.START_0 | this.SPECIFIED_0) << this.SHIFT_X_0;
    this.RIGHT_0 = (this.END_0 | this.SPECIFIED_0) << this.SHIFT_X_0;
    this.TOP_0 = (this.START_0 | this.SPECIFIED_0) << this.SHIFT_Y_0;
    this.BOTTOM_0 = (this.END_0 | this.SPECIFIED_0) << this.SHIFT_Y_0;
    this.CENTER_X_0 = this.SPECIFIED_0 << this.SHIFT_X_0;
    this.CENTER_Y_0 = this.SPECIFIED_0 << this.SHIFT_Y_0;
    this.CENTER_0 = this.CENTER_X_0 | this.CENTER_Y_0;
    this.Origin = new Gravity(0);
    this.Center = this.Origin.center();
    this.CenterX = this.Origin.centerX();
    this.CenterY = this.Origin.centerY();
    this.Left = this.Origin.left();
    this.Right = this.Origin.right();
    this.Top = this.Origin.top();
    this.Bottom = this.Origin.bottom();
  }
  Gravity$Companion.$metadata$ = {
    kind: Kind_OBJECT,
    simpleName: 'Companion',
    interfaces: []
  };
  var Gravity$Companion_instance = null;
  function Gravity$Companion_getInstance() {
    if (Gravity$Companion_instance === null) {
      new Gravity$Companion();
    }return Gravity$Companion_instance;
  }
  Gravity.prototype.toModel = function () {
    return this.gravity;
  };
  Gravity.prototype.left = function () {
    return new Gravity(this.gravity | Gravity$Companion_getInstance().LEFT_0);
  };
  Gravity.prototype.right = function () {
    return new Gravity(this.gravity | Gravity$Companion_getInstance().RIGHT_0);
  };
  Gravity.prototype.top = function () {
    return new Gravity(this.gravity | Gravity$Companion_getInstance().TOP_0);
  };
  Gravity.prototype.bottom = function () {
    return new Gravity(this.gravity | Gravity$Companion_getInstance().BOTTOM_0);
  };
  Gravity.prototype.center = function () {
    return new Gravity(this.gravity | Gravity$Companion_getInstance().CENTER_0);
  };
  Gravity.prototype.centerX = function () {
    return new Gravity(this.gravity | Gravity$Companion_getInstance().CENTER_X_0);
  };
  Gravity.prototype.centerY = function () {
    return new Gravity(this.gravity | Gravity$Companion_getInstance().CENTER_Y_0);
  };
  Gravity.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'Gravity',
    interfaces: []
  };
  Gravity.prototype.component1 = function () {
    return this.gravity;
  };
  Gravity.prototype.copy_za3lpa$ = function (gravity) {
    return new Gravity(gravity === void 0 ? this.gravity : gravity);
  };
  Gravity.prototype.toString = function () {
    return 'Gravity(gravity=' + Kotlin.toString(this.gravity) + ')';
  };
  Gravity.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.gravity) | 0;
    return result;
  };
  Gravity.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && Kotlin.equals(this.gravity, other.gravity))));
  };
  function gravity() {
    return Gravity$Companion_getInstance().Origin;
  }
  function FlexTypedValue(type, value) {
    FlexTypedValue$Companion_getInstance();
    this.type = type;
    this.value = value;
  }
  FlexTypedValue.prototype.toModel = function () {
    var $receiver = json([]);
    $receiver['type'] = this.type.toModel();
    $receiver['value'] = this.value;
    return $receiver;
  };
  function FlexTypedValue$Companion() {
    FlexTypedValue$Companion_instance = this;
    this.Auto = new FlexTypedValue(ValueType$Auto_getInstance(), 0);
  }
  FlexTypedValue$Companion.prototype.percent_3p81yu$ = function (v) {
    return new FlexTypedValue(ValueType$Percent_getInstance(), v);
  };
  FlexTypedValue$Companion.prototype.point_3p81yu$ = function (v) {
    return new FlexTypedValue(ValueType$Point_getInstance(), v);
  };
  FlexTypedValue$Companion.$metadata$ = {
    kind: Kind_OBJECT,
    simpleName: 'Companion',
    interfaces: []
  };
  var FlexTypedValue$Companion_instance = null;
  function FlexTypedValue$Companion_getInstance() {
    if (FlexTypedValue$Companion_instance === null) {
      new FlexTypedValue$Companion();
    }return FlexTypedValue$Companion_instance;
  }
  FlexTypedValue.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'FlexTypedValue',
    interfaces: []
  };
  FlexTypedValue.prototype.component1 = function () {
    return this.type;
  };
  FlexTypedValue.prototype.component2 = function () {
    return this.value;
  };
  FlexTypedValue.prototype.copy_vu2xx1$ = function (type, value) {
    return new FlexTypedValue(type === void 0 ? this.type : type, value === void 0 ? this.value : value);
  };
  FlexTypedValue.prototype.toString = function () {
    return 'FlexTypedValue(type=' + Kotlin.toString(this.type) + (', value=' + Kotlin.toString(this.value)) + ')';
  };
  FlexTypedValue.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.type) | 0;
    result = result * 31 + Kotlin.hashCode(this.value) | 0;
    return result;
  };
  FlexTypedValue.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.type, other.type) && Kotlin.equals(this.value, other.value)))));
  };
  function FlexConfig(direction, flexDirection, justifyContent, alignContent, alignItems, alignSelf, positionType, flexWrap, overFlow, display, flex, flexGrow, flexShrink, flexBasis, marginLeft, marginRight, marginTop, marginBottom, marginStart, marginEnd, marginHorizontal, marginVertical, margin, paddingLeft, paddingRight, paddingTop, paddingBottom, paddingStart, paddingEnd, paddingHorizontal, paddingVertical, padding, borderLeftWidth, borderRightWidth, borderTopWidth, borderBottomWidth, borderStartWidth, borderEndWidth, borderWidth, left, right, top, bottom, start, end, width, height, minWidth, minHeight, maxWidth, maxHeight, aspectRatio) {
    if (direction === void 0)
      direction = null;
    if (flexDirection === void 0)
      flexDirection = null;
    if (justifyContent === void 0)
      justifyContent = null;
    if (alignContent === void 0)
      alignContent = null;
    if (alignItems === void 0)
      alignItems = null;
    if (alignSelf === void 0)
      alignSelf = null;
    if (positionType === void 0)
      positionType = null;
    if (flexWrap === void 0)
      flexWrap = null;
    if (overFlow === void 0)
      overFlow = null;
    if (display === void 0)
      display = null;
    if (flex === void 0)
      flex = null;
    if (flexGrow === void 0)
      flexGrow = null;
    if (flexShrink === void 0)
      flexShrink = null;
    if (flexBasis === void 0)
      flexBasis = null;
    if (marginLeft === void 0)
      marginLeft = null;
    if (marginRight === void 0)
      marginRight = null;
    if (marginTop === void 0)
      marginTop = null;
    if (marginBottom === void 0)
      marginBottom = null;
    if (marginStart === void 0)
      marginStart = null;
    if (marginEnd === void 0)
      marginEnd = null;
    if (marginHorizontal === void 0)
      marginHorizontal = null;
    if (marginVertical === void 0)
      marginVertical = null;
    if (margin === void 0)
      margin = null;
    if (paddingLeft === void 0)
      paddingLeft = null;
    if (paddingRight === void 0)
      paddingRight = null;
    if (paddingTop === void 0)
      paddingTop = null;
    if (paddingBottom === void 0)
      paddingBottom = null;
    if (paddingStart === void 0)
      paddingStart = null;
    if (paddingEnd === void 0)
      paddingEnd = null;
    if (paddingHorizontal === void 0)
      paddingHorizontal = null;
    if (paddingVertical === void 0)
      paddingVertical = null;
    if (padding === void 0)
      padding = null;
    if (borderLeftWidth === void 0)
      borderLeftWidth = null;
    if (borderRightWidth === void 0)
      borderRightWidth = null;
    if (borderTopWidth === void 0)
      borderTopWidth = null;
    if (borderBottomWidth === void 0)
      borderBottomWidth = null;
    if (borderStartWidth === void 0)
      borderStartWidth = null;
    if (borderEndWidth === void 0)
      borderEndWidth = null;
    if (borderWidth === void 0)
      borderWidth = null;
    if (left === void 0)
      left = null;
    if (right === void 0)
      right = null;
    if (top === void 0)
      top = null;
    if (bottom === void 0)
      bottom = null;
    if (start === void 0)
      start = null;
    if (end === void 0)
      end = null;
    if (width === void 0)
      width = null;
    if (height === void 0)
      height = null;
    if (minWidth === void 0)
      minWidth = null;
    if (minHeight === void 0)
      minHeight = null;
    if (maxWidth === void 0)
      maxWidth = null;
    if (maxHeight === void 0)
      maxHeight = null;
    if (aspectRatio === void 0)
      aspectRatio = null;
    this.direction = direction;
    this.flexDirection = flexDirection;
    this.justifyContent = justifyContent;
    this.alignContent = alignContent;
    this.alignItems = alignItems;
    this.alignSelf = alignSelf;
    this.positionType = positionType;
    this.flexWrap = flexWrap;
    this.overFlow = overFlow;
    this.display = display;
    this.flex = flex;
    this.flexGrow = flexGrow;
    this.flexShrink = flexShrink;
    this.flexBasis = flexBasis;
    this.marginLeft = marginLeft;
    this.marginRight = marginRight;
    this.marginTop = marginTop;
    this.marginBottom = marginBottom;
    this.marginStart = marginStart;
    this.marginEnd = marginEnd;
    this.marginHorizontal = marginHorizontal;
    this.marginVertical = marginVertical;
    this.margin = margin;
    this.paddingLeft = paddingLeft;
    this.paddingRight = paddingRight;
    this.paddingTop = paddingTop;
    this.paddingBottom = paddingBottom;
    this.paddingStart = paddingStart;
    this.paddingEnd = paddingEnd;
    this.paddingHorizontal = paddingHorizontal;
    this.paddingVertical = paddingVertical;
    this.padding = padding;
    this.borderLeftWidth = borderLeftWidth;
    this.borderRightWidth = borderRightWidth;
    this.borderTopWidth = borderTopWidth;
    this.borderBottomWidth = borderBottomWidth;
    this.borderStartWidth = borderStartWidth;
    this.borderEndWidth = borderEndWidth;
    this.borderWidth = borderWidth;
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    this.start = start;
    this.end = end;
    this.width = width;
    this.height = height;
    this.minWidth = minWidth;
    this.minHeight = minHeight;
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this.aspectRatio = aspectRatio;
  }
  FlexConfig.prototype.toModel = function () {
    var $receiver = json([]);
    var tmp$, tmp$_0, tmp$_1, tmp$_2, tmp$_3, tmp$_4, tmp$_5, tmp$_6, tmp$_7, tmp$_8, tmp$_9, tmp$_10, tmp$_11, tmp$_12, tmp$_13, tmp$_14, tmp$_15, tmp$_16, tmp$_17, tmp$_18, tmp$_19, tmp$_20, tmp$_21, tmp$_22, tmp$_23, tmp$_24, tmp$_25, tmp$_26, tmp$_27, tmp$_28, tmp$_29, tmp$_30, tmp$_31, tmp$_32, tmp$_33, tmp$_34, tmp$_35, tmp$_36, tmp$_37, tmp$_38, tmp$_39, tmp$_40, tmp$_41, tmp$_42, tmp$_43, tmp$_44, tmp$_45, tmp$_46, tmp$_47, tmp$_48, tmp$_49, tmp$_50;
    if ((tmp$ = this.direction) != null) {
      $receiver['direction'] = tmp$;
    }if ((tmp$_0 = this.flexDirection) != null) {
      $receiver['flexDirection'] = tmp$_0;
    }if ((tmp$_1 = this.justifyContent) != null) {
      $receiver['justifyContent'] = tmp$_1;
    }if ((tmp$_2 = this.alignContent) != null) {
      $receiver['alignContent'] = tmp$_2;
    }if ((tmp$_3 = this.alignItems) != null) {
      $receiver['alignItems'] = tmp$_3;
    }if ((tmp$_4 = this.alignSelf) != null) {
      $receiver['alignSelf'] = tmp$_4;
    }if ((tmp$_5 = this.positionType) != null) {
      $receiver['positionType'] = tmp$_5;
    }if ((tmp$_6 = this.flexWrap) != null) {
      $receiver['flexWrap'] = tmp$_6;
    }if ((tmp$_7 = this.overFlow) != null) {
      $receiver['overFlow'] = tmp$_7;
    }if ((tmp$_8 = this.display) != null) {
      $receiver['display'] = tmp$_8;
    }if ((tmp$_9 = this.flex) != null) {
      $receiver['flex'] = tmp$_9;
    }if ((tmp$_10 = this.flexGrow) != null) {
      $receiver['flexGrow'] = tmp$_10;
    }if ((tmp$_11 = this.flexShrink) != null) {
      $receiver['flexShrink'] = tmp$_11;
    }if ((tmp$_12 = this.flexBasis) != null) {
      $receiver['flexBasis'] = tmp$_12.toModel();
    }if ((tmp$_13 = this.marginLeft) != null) {
      $receiver['marginLeft'] = tmp$_13.toModel();
    }if ((tmp$_14 = this.marginRight) != null) {
      $receiver['marginRight'] = tmp$_14.toModel();
    }if ((tmp$_15 = this.marginTop) != null) {
      $receiver['marginTop'] = tmp$_15.toModel();
    }if ((tmp$_16 = this.marginBottom) != null) {
      $receiver['marginBottom'] = tmp$_16.toModel();
    }if ((tmp$_17 = this.marginStart) != null) {
      $receiver['marginStart'] = tmp$_17.toModel();
    }if ((tmp$_18 = this.marginEnd) != null) {
      $receiver['marginEnd'] = tmp$_18.toModel();
    }if ((tmp$_19 = this.marginHorizontal) != null) {
      $receiver['marginHorizontal'] = tmp$_19.toModel();
    }if ((tmp$_20 = this.marginVertical) != null) {
      $receiver['marginVertical'] = tmp$_20.toModel();
    }if ((tmp$_21 = this.margin) != null) {
      $receiver['margin'] = tmp$_21.toModel();
    }if ((tmp$_22 = this.paddingLeft) != null) {
      $receiver['paddingLeft'] = tmp$_22.toModel();
    }if ((tmp$_23 = this.paddingRight) != null) {
      $receiver['paddingRight'] = tmp$_23.toModel();
    }if ((tmp$_24 = this.paddingTop) != null) {
      $receiver['paddingTop'] = tmp$_24.toModel();
    }if ((tmp$_25 = this.paddingBottom) != null) {
      $receiver['paddingBottom'] = tmp$_25.toModel();
    }if ((tmp$_26 = this.paddingStart) != null) {
      $receiver['paddingStart'] = tmp$_26.toModel();
    }if ((tmp$_27 = this.paddingEnd) != null) {
      $receiver['paddingEnd'] = tmp$_27.toModel();
    }if ((tmp$_28 = this.paddingHorizontal) != null) {
      $receiver['paddingHorizontal'] = tmp$_28.toModel();
    }if ((tmp$_29 = this.paddingVertical) != null) {
      $receiver['paddingVertical'] = tmp$_29.toModel();
    }if ((tmp$_30 = this.padding) != null) {
      $receiver['padding'] = tmp$_30.toModel();
    }if ((tmp$_31 = this.borderLeftWidth) != null) {
      $receiver['borderLeftWidth'] = tmp$_31;
    }if ((tmp$_32 = this.borderRightWidth) != null) {
      $receiver['borderRightWidth'] = tmp$_32;
    }if ((tmp$_33 = this.borderTopWidth) != null) {
      $receiver['borderTopWidth'] = tmp$_33;
    }if ((tmp$_34 = this.borderBottomWidth) != null) {
      $receiver['borderBottomWidth'] = tmp$_34;
    }if ((tmp$_35 = this.borderStartWidth) != null) {
      $receiver['borderStartWidth'] = tmp$_35;
    }if ((tmp$_36 = this.borderEndWidth) != null) {
      $receiver['borderEndWidth'] = tmp$_36;
    }if ((tmp$_37 = this.borderWidth) != null) {
      $receiver['borderWidth'] = tmp$_37;
    }if ((tmp$_38 = this.left) != null) {
      $receiver['left'] = tmp$_38.toModel();
    }if ((tmp$_39 = this.right) != null) {
      $receiver['right'] = tmp$_39.toModel();
    }if ((tmp$_40 = this.top) != null) {
      $receiver['top'] = tmp$_40.toModel();
    }if ((tmp$_41 = this.bottom) != null) {
      $receiver['bottom'] = tmp$_41.toModel();
    }if ((tmp$_42 = this.start) != null) {
      $receiver['start'] = tmp$_42.toModel();
    }if ((tmp$_43 = this.end) != null) {
      $receiver['end'] = tmp$_43.toModel();
    }if ((tmp$_44 = this.width) != null) {
      $receiver['width'] = tmp$_44.toModel();
    }if ((tmp$_45 = this.height) != null) {
      $receiver['height'] = tmp$_45.toModel();
    }if ((tmp$_46 = this.minWidth) != null) {
      $receiver['minWidth'] = tmp$_46.toModel();
    }if ((tmp$_47 = this.minHeight) != null) {
      $receiver['minHeight'] = tmp$_47.toModel();
    }if ((tmp$_48 = this.maxWidth) != null) {
      $receiver['maxWidth'] = tmp$_48.toModel();
    }if ((tmp$_49 = this.maxHeight) != null) {
      $receiver['maxHeight'] = tmp$_49.toModel();
    }if ((tmp$_50 = this.aspectRatio) != null) {
      $receiver['aspectRatio'] = tmp$_50;
    }return $receiver;
  };
  FlexConfig.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'FlexConfig',
    interfaces: []
  };
  FlexConfig.prototype.component1 = function () {
    return this.direction;
  };
  FlexConfig.prototype.component2 = function () {
    return this.flexDirection;
  };
  FlexConfig.prototype.component3 = function () {
    return this.justifyContent;
  };
  FlexConfig.prototype.component4 = function () {
    return this.alignContent;
  };
  FlexConfig.prototype.component5 = function () {
    return this.alignItems;
  };
  FlexConfig.prototype.component6 = function () {
    return this.alignSelf;
  };
  FlexConfig.prototype.component7 = function () {
    return this.positionType;
  };
  FlexConfig.prototype.component8 = function () {
    return this.flexWrap;
  };
  FlexConfig.prototype.component9 = function () {
    return this.overFlow;
  };
  FlexConfig.prototype.component10 = function () {
    return this.display;
  };
  FlexConfig.prototype.component11 = function () {
    return this.flex;
  };
  FlexConfig.prototype.component12 = function () {
    return this.flexGrow;
  };
  FlexConfig.prototype.component13 = function () {
    return this.flexShrink;
  };
  FlexConfig.prototype.component14 = function () {
    return this.flexBasis;
  };
  FlexConfig.prototype.component15 = function () {
    return this.marginLeft;
  };
  FlexConfig.prototype.component16 = function () {
    return this.marginRight;
  };
  FlexConfig.prototype.component17 = function () {
    return this.marginTop;
  };
  FlexConfig.prototype.component18 = function () {
    return this.marginBottom;
  };
  FlexConfig.prototype.component19 = function () {
    return this.marginStart;
  };
  FlexConfig.prototype.component20 = function () {
    return this.marginEnd;
  };
  FlexConfig.prototype.component21 = function () {
    return this.marginHorizontal;
  };
  FlexConfig.prototype.component22 = function () {
    return this.marginVertical;
  };
  FlexConfig.prototype.component23 = function () {
    return this.margin;
  };
  FlexConfig.prototype.component24 = function () {
    return this.paddingLeft;
  };
  FlexConfig.prototype.component25 = function () {
    return this.paddingRight;
  };
  FlexConfig.prototype.component26 = function () {
    return this.paddingTop;
  };
  FlexConfig.prototype.component27 = function () {
    return this.paddingBottom;
  };
  FlexConfig.prototype.component28 = function () {
    return this.paddingStart;
  };
  FlexConfig.prototype.component29 = function () {
    return this.paddingEnd;
  };
  FlexConfig.prototype.component30 = function () {
    return this.paddingHorizontal;
  };
  FlexConfig.prototype.component31 = function () {
    return this.paddingVertical;
  };
  FlexConfig.prototype.component32 = function () {
    return this.padding;
  };
  FlexConfig.prototype.component33 = function () {
    return this.borderLeftWidth;
  };
  FlexConfig.prototype.component34 = function () {
    return this.borderRightWidth;
  };
  FlexConfig.prototype.component35 = function () {
    return this.borderTopWidth;
  };
  FlexConfig.prototype.component36 = function () {
    return this.borderBottomWidth;
  };
  FlexConfig.prototype.component37 = function () {
    return this.borderStartWidth;
  };
  FlexConfig.prototype.component38 = function () {
    return this.borderEndWidth;
  };
  FlexConfig.prototype.component39 = function () {
    return this.borderWidth;
  };
  FlexConfig.prototype.component40 = function () {
    return this.left;
  };
  FlexConfig.prototype.component41 = function () {
    return this.right;
  };
  FlexConfig.prototype.component42 = function () {
    return this.top;
  };
  FlexConfig.prototype.component43 = function () {
    return this.bottom;
  };
  FlexConfig.prototype.component44 = function () {
    return this.start;
  };
  FlexConfig.prototype.component45 = function () {
    return this.end;
  };
  FlexConfig.prototype.component46 = function () {
    return this.width;
  };
  FlexConfig.prototype.component47 = function () {
    return this.height;
  };
  FlexConfig.prototype.component48 = function () {
    return this.minWidth;
  };
  FlexConfig.prototype.component49 = function () {
    return this.minHeight;
  };
  FlexConfig.prototype.component50 = function () {
    return this.maxWidth;
  };
  FlexConfig.prototype.component51 = function () {
    return this.maxHeight;
  };
  FlexConfig.prototype.component52 = function () {
    return this.aspectRatio;
  };
  FlexConfig.prototype.copy_al3n19$ = function (direction, flexDirection, justifyContent, alignContent, alignItems, alignSelf, positionType, flexWrap, overFlow, display, flex, flexGrow, flexShrink, flexBasis, marginLeft, marginRight, marginTop, marginBottom, marginStart, marginEnd, marginHorizontal, marginVertical, margin, paddingLeft, paddingRight, paddingTop, paddingBottom, paddingStart, paddingEnd, paddingHorizontal, paddingVertical, padding, borderLeftWidth, borderRightWidth, borderTopWidth, borderBottomWidth, borderStartWidth, borderEndWidth, borderWidth, left, right, top, bottom, start, end, width, height, minWidth, minHeight, maxWidth, maxHeight, aspectRatio) {
    return new FlexConfig(direction === void 0 ? this.direction : direction, flexDirection === void 0 ? this.flexDirection : flexDirection, justifyContent === void 0 ? this.justifyContent : justifyContent, alignContent === void 0 ? this.alignContent : alignContent, alignItems === void 0 ? this.alignItems : alignItems, alignSelf === void 0 ? this.alignSelf : alignSelf, positionType === void 0 ? this.positionType : positionType, flexWrap === void 0 ? this.flexWrap : flexWrap, overFlow === void 0 ? this.overFlow : overFlow, display === void 0 ? this.display : display, flex === void 0 ? this.flex : flex, flexGrow === void 0 ? this.flexGrow : flexGrow, flexShrink === void 0 ? this.flexShrink : flexShrink, flexBasis === void 0 ? this.flexBasis : flexBasis, marginLeft === void 0 ? this.marginLeft : marginLeft, marginRight === void 0 ? this.marginRight : marginRight, marginTop === void 0 ? this.marginTop : marginTop, marginBottom === void 0 ? this.marginBottom : marginBottom, marginStart === void 0 ? this.marginStart : marginStart, marginEnd === void 0 ? this.marginEnd : marginEnd, marginHorizontal === void 0 ? this.marginHorizontal : marginHorizontal, marginVertical === void 0 ? this.marginVertical : marginVertical, margin === void 0 ? this.margin : margin, paddingLeft === void 0 ? this.paddingLeft : paddingLeft, paddingRight === void 0 ? this.paddingRight : paddingRight, paddingTop === void 0 ? this.paddingTop : paddingTop, paddingBottom === void 0 ? this.paddingBottom : paddingBottom, paddingStart === void 0 ? this.paddingStart : paddingStart, paddingEnd === void 0 ? this.paddingEnd : paddingEnd, paddingHorizontal === void 0 ? this.paddingHorizontal : paddingHorizontal, paddingVertical === void 0 ? this.paddingVertical : paddingVertical, padding === void 0 ? this.padding : padding, borderLeftWidth === void 0 ? this.borderLeftWidth : borderLeftWidth, borderRightWidth === void 0 ? this.borderRightWidth : borderRightWidth, borderTopWidth === void 0 ? this.borderTopWidth : borderTopWidth, borderBottomWidth === void 0 ? this.borderBottomWidth : borderBottomWidth, borderStartWidth === void 0 ? this.borderStartWidth : borderStartWidth, borderEndWidth === void 0 ? this.borderEndWidth : borderEndWidth, borderWidth === void 0 ? this.borderWidth : borderWidth, left === void 0 ? this.left : left, right === void 0 ? this.right : right, top === void 0 ? this.top : top, bottom === void 0 ? this.bottom : bottom, start === void 0 ? this.start : start, end === void 0 ? this.end : end, width === void 0 ? this.width : width, height === void 0 ? this.height : height, minWidth === void 0 ? this.minWidth : minWidth, minHeight === void 0 ? this.minHeight : minHeight, maxWidth === void 0 ? this.maxWidth : maxWidth, maxHeight === void 0 ? this.maxHeight : maxHeight, aspectRatio === void 0 ? this.aspectRatio : aspectRatio);
  };
  FlexConfig.prototype.toString = function () {
    return 'FlexConfig(direction=' + Kotlin.toString(this.direction) + (', flexDirection=' + Kotlin.toString(this.flexDirection)) + (', justifyContent=' + Kotlin.toString(this.justifyContent)) + (', alignContent=' + Kotlin.toString(this.alignContent)) + (', alignItems=' + Kotlin.toString(this.alignItems)) + (', alignSelf=' + Kotlin.toString(this.alignSelf)) + (', positionType=' + Kotlin.toString(this.positionType)) + (', flexWrap=' + Kotlin.toString(this.flexWrap)) + (', overFlow=' + Kotlin.toString(this.overFlow)) + (', display=' + Kotlin.toString(this.display)) + (', flex=' + Kotlin.toString(this.flex)) + (', flexGrow=' + Kotlin.toString(this.flexGrow)) + (', flexShrink=' + Kotlin.toString(this.flexShrink)) + (', flexBasis=' + Kotlin.toString(this.flexBasis)) + (', marginLeft=' + Kotlin.toString(this.marginLeft)) + (', marginRight=' + Kotlin.toString(this.marginRight)) + (', marginTop=' + Kotlin.toString(this.marginTop)) + (', marginBottom=' + Kotlin.toString(this.marginBottom)) + (', marginStart=' + Kotlin.toString(this.marginStart)) + (', marginEnd=' + Kotlin.toString(this.marginEnd)) + (', marginHorizontal=' + Kotlin.toString(this.marginHorizontal)) + (', marginVertical=' + Kotlin.toString(this.marginVertical)) + (', margin=' + Kotlin.toString(this.margin)) + (', paddingLeft=' + Kotlin.toString(this.paddingLeft)) + (', paddingRight=' + Kotlin.toString(this.paddingRight)) + (', paddingTop=' + Kotlin.toString(this.paddingTop)) + (', paddingBottom=' + Kotlin.toString(this.paddingBottom)) + (', paddingStart=' + Kotlin.toString(this.paddingStart)) + (', paddingEnd=' + Kotlin.toString(this.paddingEnd)) + (', paddingHorizontal=' + Kotlin.toString(this.paddingHorizontal)) + (', paddingVertical=' + Kotlin.toString(this.paddingVertical)) + (', padding=' + Kotlin.toString(this.padding)) + (', borderLeftWidth=' + Kotlin.toString(this.borderLeftWidth)) + (', borderRightWidth=' + Kotlin.toString(this.borderRightWidth)) + (', borderTopWidth=' + Kotlin.toString(this.borderTopWidth)) + (', borderBottomWidth=' + Kotlin.toString(this.borderBottomWidth)) + (', borderStartWidth=' + Kotlin.toString(this.borderStartWidth)) + (', borderEndWidth=' + Kotlin.toString(this.borderEndWidth)) + (', borderWidth=' + Kotlin.toString(this.borderWidth)) + (', left=' + Kotlin.toString(this.left)) + (', right=' + Kotlin.toString(this.right)) + (', top=' + Kotlin.toString(this.top)) + (', bottom=' + Kotlin.toString(this.bottom)) + (', start=' + Kotlin.toString(this.start)) + (', end=' + Kotlin.toString(this.end)) + (', width=' + Kotlin.toString(this.width)) + (', height=' + Kotlin.toString(this.height)) + (', minWidth=' + Kotlin.toString(this.minWidth)) + (', minHeight=' + Kotlin.toString(this.minHeight)) + (', maxWidth=' + Kotlin.toString(this.maxWidth)) + (', maxHeight=' + Kotlin.toString(this.maxHeight)) + (', aspectRatio=' + Kotlin.toString(this.aspectRatio)) + ')';
  };
  FlexConfig.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.direction) | 0;
    result = result * 31 + Kotlin.hashCode(this.flexDirection) | 0;
    result = result * 31 + Kotlin.hashCode(this.justifyContent) | 0;
    result = result * 31 + Kotlin.hashCode(this.alignContent) | 0;
    result = result * 31 + Kotlin.hashCode(this.alignItems) | 0;
    result = result * 31 + Kotlin.hashCode(this.alignSelf) | 0;
    result = result * 31 + Kotlin.hashCode(this.positionType) | 0;
    result = result * 31 + Kotlin.hashCode(this.flexWrap) | 0;
    result = result * 31 + Kotlin.hashCode(this.overFlow) | 0;
    result = result * 31 + Kotlin.hashCode(this.display) | 0;
    result = result * 31 + Kotlin.hashCode(this.flex) | 0;
    result = result * 31 + Kotlin.hashCode(this.flexGrow) | 0;
    result = result * 31 + Kotlin.hashCode(this.flexShrink) | 0;
    result = result * 31 + Kotlin.hashCode(this.flexBasis) | 0;
    result = result * 31 + Kotlin.hashCode(this.marginLeft) | 0;
    result = result * 31 + Kotlin.hashCode(this.marginRight) | 0;
    result = result * 31 + Kotlin.hashCode(this.marginTop) | 0;
    result = result * 31 + Kotlin.hashCode(this.marginBottom) | 0;
    result = result * 31 + Kotlin.hashCode(this.marginStart) | 0;
    result = result * 31 + Kotlin.hashCode(this.marginEnd) | 0;
    result = result * 31 + Kotlin.hashCode(this.marginHorizontal) | 0;
    result = result * 31 + Kotlin.hashCode(this.marginVertical) | 0;
    result = result * 31 + Kotlin.hashCode(this.margin) | 0;
    result = result * 31 + Kotlin.hashCode(this.paddingLeft) | 0;
    result = result * 31 + Kotlin.hashCode(this.paddingRight) | 0;
    result = result * 31 + Kotlin.hashCode(this.paddingTop) | 0;
    result = result * 31 + Kotlin.hashCode(this.paddingBottom) | 0;
    result = result * 31 + Kotlin.hashCode(this.paddingStart) | 0;
    result = result * 31 + Kotlin.hashCode(this.paddingEnd) | 0;
    result = result * 31 + Kotlin.hashCode(this.paddingHorizontal) | 0;
    result = result * 31 + Kotlin.hashCode(this.paddingVertical) | 0;
    result = result * 31 + Kotlin.hashCode(this.padding) | 0;
    result = result * 31 + Kotlin.hashCode(this.borderLeftWidth) | 0;
    result = result * 31 + Kotlin.hashCode(this.borderRightWidth) | 0;
    result = result * 31 + Kotlin.hashCode(this.borderTopWidth) | 0;
    result = result * 31 + Kotlin.hashCode(this.borderBottomWidth) | 0;
    result = result * 31 + Kotlin.hashCode(this.borderStartWidth) | 0;
    result = result * 31 + Kotlin.hashCode(this.borderEndWidth) | 0;
    result = result * 31 + Kotlin.hashCode(this.borderWidth) | 0;
    result = result * 31 + Kotlin.hashCode(this.left) | 0;
    result = result * 31 + Kotlin.hashCode(this.right) | 0;
    result = result * 31 + Kotlin.hashCode(this.top) | 0;
    result = result * 31 + Kotlin.hashCode(this.bottom) | 0;
    result = result * 31 + Kotlin.hashCode(this.start) | 0;
    result = result * 31 + Kotlin.hashCode(this.end) | 0;
    result = result * 31 + Kotlin.hashCode(this.width) | 0;
    result = result * 31 + Kotlin.hashCode(this.height) | 0;
    result = result * 31 + Kotlin.hashCode(this.minWidth) | 0;
    result = result * 31 + Kotlin.hashCode(this.minHeight) | 0;
    result = result * 31 + Kotlin.hashCode(this.maxWidth) | 0;
    result = result * 31 + Kotlin.hashCode(this.maxHeight) | 0;
    result = result * 31 + Kotlin.hashCode(this.aspectRatio) | 0;
    return result;
  };
  FlexConfig.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.direction, other.direction) && Kotlin.equals(this.flexDirection, other.flexDirection) && Kotlin.equals(this.justifyContent, other.justifyContent) && Kotlin.equals(this.alignContent, other.alignContent) && Kotlin.equals(this.alignItems, other.alignItems) && Kotlin.equals(this.alignSelf, other.alignSelf) && Kotlin.equals(this.positionType, other.positionType) && Kotlin.equals(this.flexWrap, other.flexWrap) && Kotlin.equals(this.overFlow, other.overFlow) && Kotlin.equals(this.display, other.display) && Kotlin.equals(this.flex, other.flex) && Kotlin.equals(this.flexGrow, other.flexGrow) && Kotlin.equals(this.flexShrink, other.flexShrink) && Kotlin.equals(this.flexBasis, other.flexBasis) && Kotlin.equals(this.marginLeft, other.marginLeft) && Kotlin.equals(this.marginRight, other.marginRight) && Kotlin.equals(this.marginTop, other.marginTop) && Kotlin.equals(this.marginBottom, other.marginBottom) && Kotlin.equals(this.marginStart, other.marginStart) && Kotlin.equals(this.marginEnd, other.marginEnd) && Kotlin.equals(this.marginHorizontal, other.marginHorizontal) && Kotlin.equals(this.marginVertical, other.marginVertical) && Kotlin.equals(this.margin, other.margin) && Kotlin.equals(this.paddingLeft, other.paddingLeft) && Kotlin.equals(this.paddingRight, other.paddingRight) && Kotlin.equals(this.paddingTop, other.paddingTop) && Kotlin.equals(this.paddingBottom, other.paddingBottom) && Kotlin.equals(this.paddingStart, other.paddingStart) && Kotlin.equals(this.paddingEnd, other.paddingEnd) && Kotlin.equals(this.paddingHorizontal, other.paddingHorizontal) && Kotlin.equals(this.paddingVertical, other.paddingVertical) && Kotlin.equals(this.padding, other.padding) && Kotlin.equals(this.borderLeftWidth, other.borderLeftWidth) && Kotlin.equals(this.borderRightWidth, other.borderRightWidth) && Kotlin.equals(this.borderTopWidth, other.borderTopWidth) && Kotlin.equals(this.borderBottomWidth, other.borderBottomWidth) && Kotlin.equals(this.borderStartWidth, other.borderStartWidth) && Kotlin.equals(this.borderEndWidth, other.borderEndWidth) && Kotlin.equals(this.borderWidth, other.borderWidth) && Kotlin.equals(this.left, other.left) && Kotlin.equals(this.right, other.right) && Kotlin.equals(this.top, other.top) && Kotlin.equals(this.bottom, other.bottom) && Kotlin.equals(this.start, other.start) && Kotlin.equals(this.end, other.end) && Kotlin.equals(this.width, other.width) && Kotlin.equals(this.height, other.height) && Kotlin.equals(this.minWidth, other.minWidth) && Kotlin.equals(this.minHeight, other.minHeight) && Kotlin.equals(this.maxWidth, other.maxWidth) && Kotlin.equals(this.maxHeight, other.maxHeight) && Kotlin.equals(this.aspectRatio, other.aspectRatio)))));
  };
  function FontStyle(name, ordinal, value) {
    Enum.call(this);
    this.value = value;
    this.name$ = name;
    this.ordinal$ = ordinal;
  }
  function FontStyle_initFields() {
    FontStyle_initFields = function () {
    };
    FontStyle$Normal_instance = new FontStyle('Normal', 0, 'normal');
    FontStyle$Bold_instance = new FontStyle('Bold', 1, 'bold');
    FontStyle$Italic_instance = new FontStyle('Italic', 2, 'italic');
    FontStyle$BoldItalic_instance = new FontStyle('BoldItalic', 3, 'bold_italic');
  }
  var FontStyle$Normal_instance;
  function FontStyle$Normal_getInstance() {
    FontStyle_initFields();
    return FontStyle$Normal_instance;
  }
  var FontStyle$Bold_instance;
  function FontStyle$Bold_getInstance() {
    FontStyle_initFields();
    return FontStyle$Bold_instance;
  }
  var FontStyle$Italic_instance;
  function FontStyle$Italic_getInstance() {
    FontStyle_initFields();
    return FontStyle$Italic_instance;
  }
  var FontStyle$BoldItalic_instance;
  function FontStyle$BoldItalic_getInstance() {
    FontStyle_initFields();
    return FontStyle$BoldItalic_instance;
  }
  FontStyle.prototype.toModel = function () {
    return this.value;
  };
  FontStyle.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'FontStyle',
    interfaces: [Enum]
  };
  function FontStyle$values() {
    return [FontStyle$Normal_getInstance(), FontStyle$Bold_getInstance(), FontStyle$Italic_getInstance(), FontStyle$BoldItalic_getInstance()];
  }
  FontStyle.values = FontStyle$values;
  function FontStyle$valueOf(name) {
    switch (name) {
      case 'Normal':
        return FontStyle$Normal_getInstance();
      case 'Bold':
        return FontStyle$Bold_getInstance();
      case 'Italic':
        return FontStyle$Italic_getInstance();
      case 'BoldItalic':
        return FontStyle$BoldItalic_getInstance();
      default:throwISE('No enum constant doric.kotlin.FontStyle.' + name);
    }
  }
  FontStyle.valueOf_61zpoe$ = FontStyle$valueOf;
  function ValueType(name, ordinal, value) {
    Enum.call(this);
    this.value_32uodw$_0 = value;
    this.name$ = name;
    this.ordinal$ = ordinal;
  }
  function ValueType_initFields() {
    ValueType_initFields = function () {
    };
    ValueType$Undefined_instance = new ValueType('Undefined', 0, 0);
    ValueType$Point_instance = new ValueType('Point', 1, 1);
    ValueType$Percent_instance = new ValueType('Percent', 2, 2);
    ValueType$Auto_instance = new ValueType('Auto', 3, 3);
  }
  var ValueType$Undefined_instance;
  function ValueType$Undefined_getInstance() {
    ValueType_initFields();
    return ValueType$Undefined_instance;
  }
  var ValueType$Point_instance;
  function ValueType$Point_getInstance() {
    ValueType_initFields();
    return ValueType$Point_instance;
  }
  var ValueType$Percent_instance;
  function ValueType$Percent_getInstance() {
    ValueType_initFields();
    return ValueType$Percent_instance;
  }
  var ValueType$Auto_instance;
  function ValueType$Auto_getInstance() {
    ValueType_initFields();
    return ValueType$Auto_instance;
  }
  ValueType.prototype.toModel = function () {
    return this.value_32uodw$_0;
  };
  ValueType.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'ValueType',
    interfaces: [Enum]
  };
  function ValueType$values() {
    return [ValueType$Undefined_getInstance(), ValueType$Point_getInstance(), ValueType$Percent_getInstance(), ValueType$Auto_getInstance()];
  }
  ValueType.values = ValueType$values;
  function ValueType$valueOf(name) {
    switch (name) {
      case 'Undefined':
        return ValueType$Undefined_getInstance();
      case 'Point':
        return ValueType$Point_getInstance();
      case 'Percent':
        return ValueType$Percent_getInstance();
      case 'Auto':
        return ValueType$Auto_getInstance();
      default:throwISE('No enum constant doric.kotlin.ValueType.' + name);
    }
  }
  ValueType.valueOf_61zpoe$ = ValueType$valueOf;
  function animate_0($receiver, duration, animates) {
    var argument = json([to('animations', animates), to('duration', duration)]);
    return animate($receiver)(argument);
  }
  function AlertArg(title, msg, okLabel) {
    if (title === void 0)
      title = null;
    if (okLabel === void 0)
      okLabel = null;
    this.title = title;
    this.msg = msg;
    this.okLabel = okLabel;
  }
  AlertArg.prototype.toModel = function () {
    var $receiver = json([]);
    var tmp$, tmp$_0;
    if ((tmp$ = this.title) != null) {
      $receiver['title'] = tmp$;
    }$receiver['title'] = this.msg;
    if ((tmp$_0 = this.okLabel) != null) {
      $receiver['okLabel'] = tmp$_0;
    }return $receiver;
  };
  AlertArg.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'AlertArg',
    interfaces: []
  };
  AlertArg.prototype.component1 = function () {
    return this.title;
  };
  AlertArg.prototype.component2 = function () {
    return this.msg;
  };
  AlertArg.prototype.component3 = function () {
    return this.okLabel;
  };
  AlertArg.prototype.copy_744wau$ = function (title, msg, okLabel) {
    return new AlertArg(title === void 0 ? this.title : title, msg === void 0 ? this.msg : msg, okLabel === void 0 ? this.okLabel : okLabel);
  };
  AlertArg.prototype.toString = function () {
    return 'AlertArg(title=' + Kotlin.toString(this.title) + (', msg=' + Kotlin.toString(this.msg)) + (', okLabel=' + Kotlin.toString(this.okLabel)) + ')';
  };
  AlertArg.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.title) | 0;
    result = result * 31 + Kotlin.hashCode(this.msg) | 0;
    result = result * 31 + Kotlin.hashCode(this.okLabel) | 0;
    return result;
  };
  AlertArg.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.title, other.title) && Kotlin.equals(this.msg, other.msg) && Kotlin.equals(this.okLabel, other.okLabel)))));
  };
  function ConfirmArg(title, msg, okLabel, cancelLabel) {
    if (title === void 0)
      title = null;
    if (okLabel === void 0)
      okLabel = null;
    if (cancelLabel === void 0)
      cancelLabel = null;
    this.title = title;
    this.msg = msg;
    this.okLabel = okLabel;
    this.cancelLabel = cancelLabel;
  }
  ConfirmArg.prototype.toModel = function () {
    var $receiver = json([]);
    var tmp$, tmp$_0, tmp$_1;
    if ((tmp$ = this.title) != null) {
      $receiver['title'] = tmp$;
    }$receiver['title'] = this.msg;
    if ((tmp$_0 = this.okLabel) != null) {
      $receiver['okLabel'] = tmp$_0;
    }if ((tmp$_1 = this.cancelLabel) != null) {
      $receiver['cancelLabel'] = tmp$_1;
    }return $receiver;
  };
  ConfirmArg.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'ConfirmArg',
    interfaces: []
  };
  ConfirmArg.prototype.component1 = function () {
    return this.title;
  };
  ConfirmArg.prototype.component2 = function () {
    return this.msg;
  };
  ConfirmArg.prototype.component3 = function () {
    return this.okLabel;
  };
  ConfirmArg.prototype.component4 = function () {
    return this.cancelLabel;
  };
  ConfirmArg.prototype.copy_vsep4j$ = function (title, msg, okLabel, cancelLabel) {
    return new ConfirmArg(title === void 0 ? this.title : title, msg === void 0 ? this.msg : msg, okLabel === void 0 ? this.okLabel : okLabel, cancelLabel === void 0 ? this.cancelLabel : cancelLabel);
  };
  ConfirmArg.prototype.toString = function () {
    return 'ConfirmArg(title=' + Kotlin.toString(this.title) + (', msg=' + Kotlin.toString(this.msg)) + (', okLabel=' + Kotlin.toString(this.okLabel)) + (', cancelLabel=' + Kotlin.toString(this.cancelLabel)) + ')';
  };
  ConfirmArg.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.title) | 0;
    result = result * 31 + Kotlin.hashCode(this.msg) | 0;
    result = result * 31 + Kotlin.hashCode(this.okLabel) | 0;
    result = result * 31 + Kotlin.hashCode(this.cancelLabel) | 0;
    return result;
  };
  ConfirmArg.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.title, other.title) && Kotlin.equals(this.msg, other.msg) && Kotlin.equals(this.okLabel, other.okLabel) && Kotlin.equals(this.cancelLabel, other.cancelLabel)))));
  };
  function PromptArg(title, msg, okLabel, cancelLabel, text, defaultText) {
    if (title === void 0)
      title = null;
    if (msg === void 0)
      msg = null;
    if (okLabel === void 0)
      okLabel = null;
    if (cancelLabel === void 0)
      cancelLabel = null;
    if (text === void 0)
      text = null;
    if (defaultText === void 0)
      defaultText = null;
    this.title = title;
    this.msg = msg;
    this.okLabel = okLabel;
    this.cancelLabel = cancelLabel;
    this.text = text;
    this.defaultText = defaultText;
  }
  PromptArg.prototype.toModel = function () {
    var $receiver = json([]);
    var tmp$, tmp$_0, tmp$_1, tmp$_2, tmp$_3, tmp$_4;
    if ((tmp$ = this.title) != null) {
      $receiver['title'] = tmp$;
    }if ((tmp$_0 = this.msg) != null) {
      $receiver['title'] = tmp$_0;
    }if ((tmp$_1 = this.okLabel) != null) {
      $receiver['okLabel'] = tmp$_1;
    }if ((tmp$_2 = this.cancelLabel) != null) {
      $receiver['cancelLabel'] = tmp$_2;
    }if ((tmp$_3 = this.text) != null) {
      $receiver['text'] = tmp$_3;
    }if ((tmp$_4 = this.defaultText) != null) {
      $receiver['defaultText'] = tmp$_4;
    }return $receiver;
  };
  PromptArg.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'PromptArg',
    interfaces: []
  };
  PromptArg.prototype.component1 = function () {
    return this.title;
  };
  PromptArg.prototype.component2 = function () {
    return this.msg;
  };
  PromptArg.prototype.component3 = function () {
    return this.okLabel;
  };
  PromptArg.prototype.component4 = function () {
    return this.cancelLabel;
  };
  PromptArg.prototype.component5 = function () {
    return this.text;
  };
  PromptArg.prototype.component6 = function () {
    return this.defaultText;
  };
  PromptArg.prototype.copy_ssykek$ = function (title, msg, okLabel, cancelLabel, text, defaultText) {
    return new PromptArg(title === void 0 ? this.title : title, msg === void 0 ? this.msg : msg, okLabel === void 0 ? this.okLabel : okLabel, cancelLabel === void 0 ? this.cancelLabel : cancelLabel, text === void 0 ? this.text : text, defaultText === void 0 ? this.defaultText : defaultText);
  };
  PromptArg.prototype.toString = function () {
    return 'PromptArg(title=' + Kotlin.toString(this.title) + (', msg=' + Kotlin.toString(this.msg)) + (', okLabel=' + Kotlin.toString(this.okLabel)) + (', cancelLabel=' + Kotlin.toString(this.cancelLabel)) + (', text=' + Kotlin.toString(this.text)) + (', defaultText=' + Kotlin.toString(this.defaultText)) + ')';
  };
  PromptArg.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.title) | 0;
    result = result * 31 + Kotlin.hashCode(this.msg) | 0;
    result = result * 31 + Kotlin.hashCode(this.okLabel) | 0;
    result = result * 31 + Kotlin.hashCode(this.cancelLabel) | 0;
    result = result * 31 + Kotlin.hashCode(this.text) | 0;
    result = result * 31 + Kotlin.hashCode(this.defaultText) | 0;
    return result;
  };
  PromptArg.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.title, other.title) && Kotlin.equals(this.msg, other.msg) && Kotlin.equals(this.okLabel, other.okLabel) && Kotlin.equals(this.cancelLabel, other.cancelLabel) && Kotlin.equals(this.text, other.text) && Kotlin.equals(this.defaultText, other.defaultText)))));
  };
  function toast($receiver, msg, gravity) {
    if (gravity === void 0)
      gravity = Gravity$Companion_getInstance().Bottom;
    return modal($receiver).toast(msg, gravity);
  }
  function alert($receiver, msg) {
    return modal($receiver).alert(msg);
  }
  function alert_0($receiver, args) {
    return modal($receiver).alert(args.toModel());
  }
  function confirm($receiver, args) {
    return modal($receiver).confirm(args);
  }
  function confirm_0($receiver, args) {
    return modal($receiver).confirm(args);
  }
  function prompt($receiver, args) {
    return modal($receiver).prompt(args);
  }
  function ScrollRange(start, end) {
    this.start = start;
    this.end = end;
  }
  ScrollRange.prototype.toModel = function () {
    return json([to('start', this.start), to('end', this.end)]);
  };
  ScrollRange.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'ScrollRange',
    interfaces: []
  };
  ScrollRange.prototype.component1 = function () {
    return this.start;
  };
  ScrollRange.prototype.component2 = function () {
    return this.end;
  };
  ScrollRange.prototype.copy_z8e4lc$ = function (start, end) {
    return new ScrollRange(start === void 0 ? this.start : start, end === void 0 ? this.end : end);
  };
  ScrollRange.prototype.toString = function () {
    return 'ScrollRange(start=' + Kotlin.toString(this.start) + (', end=' + Kotlin.toString(this.end)) + ')';
  };
  ScrollRange.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.start) | 0;
    result = result * 31 + Kotlin.hashCode(this.end) | 0;
    return result;
  };
  ScrollRange.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.start, other.start) && Kotlin.equals(this.end, other.end)))));
  };
  function Changing(name, start, end) {
    this.name = name;
    this.start = start;
    this.end = end;
  }
  Changing.prototype.toModel = function () {
    return json([to('name', this.name), to('start', this.start), to('end', this.end)]);
  };
  Changing.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'Changing',
    interfaces: []
  };
  Changing.prototype.component1 = function () {
    return this.name;
  };
  Changing.prototype.component2 = function () {
    return this.start;
  };
  Changing.prototype.component3 = function () {
    return this.end;
  };
  Changing.prototype.copy_2w64eq$ = function (name, start, end) {
    return new Changing(name === void 0 ? this.name : name, start === void 0 ? this.start : start, end === void 0 ? this.end : end);
  };
  Changing.prototype.toString = function () {
    return 'Changing(name=' + Kotlin.toString(this.name) + (', start=' + Kotlin.toString(this.start)) + (', end=' + Kotlin.toString(this.end)) + ')';
  };
  Changing.prototype.hashCode = function () {
    var result = 0;
    result = result * 31 + Kotlin.hashCode(this.name) | 0;
    result = result * 31 + Kotlin.hashCode(this.start) | 0;
    result = result * 31 + Kotlin.hashCode(this.end) | 0;
    return result;
  };
  Changing.prototype.equals = function (other) {
    return this === other || (other !== null && (typeof other === 'object' && (Object.getPrototypeOf(this) === Object.getPrototypeOf(other) && (Kotlin.equals(this.name, other.name) && Kotlin.equals(this.start, other.start) && Kotlin.equals(this.end, other.end)))));
  };
  function coordinate($receiver, scrollable, scrollRange, target, changing) {
    return coordinator($receiver).verticalScrolling(json([to('scrollable', scrollable), to('scrollRange', scrollRange), to('target', target), to('changing', changing)]));
  }
  function coordinateNavBar($receiver, scrollable, scrollRange, changing) {
    return coordinator($receiver).verticalScrolling(json([to('scrollable', scrollable), to('scrollRange', scrollRange), to('target', 'NavBar'), to('changing', changing)]));
  }
  function showPopover($receiver, v) {
    return popover($receiver).show(v);
  }
  function dismissPopover($receiver, v) {
    if (v === void 0)
      v = null;
    return popover($receiver).dismiss(v);
  }
  var package$doric = _.doric || (_.doric = {});
  var package$kotlin = package$doric.kotlin || (package$doric.kotlin = {});
  Object.defineProperty(package$kotlin, 'Factory_VLayout', {
    get: function () {
      return Factory_VLayout;
    }
  });
  Object.defineProperty(package$kotlin, 'Factory_HLayout', {
    get: function () {
      return Factory_HLayout;
    }
  });
  Object.defineProperty(package$kotlin, 'Factory_Stack', {
    get: function () {
      return Factory_Stack;
    }
  });
  Object.defineProperty(package$kotlin, 'Factory_FlexLayout', {
    get: function () {
      return Factory_FlexLayout;
    }
  });
  Object.defineProperty(package$kotlin, 'Factory_Text', {
    get: function () {
      return Factory_Text;
    }
  });
  Object.defineProperty(package$kotlin, 'Factory_Image', {
    get: function () {
      return Factory_Image;
    }
  });
  Object.defineProperty(package$kotlin, 'Factory_Scroller', {
    get: function () {
      return Factory_Scroller;
    }
  });
  Object.defineProperty(package$kotlin, 'Factory_List', {
    get: function () {
      return Factory_List;
    }
  });
  Object.defineProperty(package$kotlin, 'Factory_ListItem', {
    get: function () {
      return Factory_ListItem;
    }
  });
  Object.defineProperty(package$kotlin, 'Factory_Slider', {
    get: function () {
      return Factory_Slider;
    }
  });
  Object.defineProperty(package$kotlin, 'Factory_SliderItem', {
    get: function () {
      return Factory_SliderItem;
    }
  });
  Object.defineProperty(package$kotlin, 'Factory_FlowLayout', {
    get: function () {
      return Factory_FlowLayout;
    }
  });
  Object.defineProperty(package$kotlin, 'Factory_FlowLayoutItem', {
    get: function () {
      return Factory_FlowLayoutItem;
    }
  });
  Object.defineProperty(package$kotlin, 'Factory_Input', {
    get: function () {
      return Factory_Input;
    }
  });
  Object.defineProperty(package$kotlin, 'Factory_Refreshable', {
    get: function () {
      return Factory_Refreshable;
    }
  });
  Object.defineProperty(package$kotlin, 'Factory_Switch', {
    get: function () {
      return Factory_Switch;
    }
  });
  Object.defineProperty(package$kotlin, 'Factory_Draggable', {
    get: function () {
      return Factory_Draggable;
    }
  });
  $$importsForInline$$['doric-kotlin'] = _;
  package$kotlin.doricView_fvi3mv$ = doricView;
  package$kotlin.vlayout_3zqh6x$ = vlayout;
  package$kotlin.hlayout_q36rgb$ = hlayout;
  package$kotlin.stack_94hqmp$ = stack;
  package$kotlin.flexlayout_rrrbn6$ = flexlayout;
  package$kotlin.text_p7a598$ = text;
  package$kotlin.image_9tdvok$ = image;
  package$kotlin.input_gkob83$ = input;
  package$kotlin.scroller_rk47hl$ = scroller;
  package$kotlin.list_4qks7h$ = list;
  package$kotlin.listItem_cyko1s$ = listItem;
  package$kotlin.flowlayout_snomu1$ = flowlayout;
  package$kotlin.flowLayoutItem_iai886$ = flowLayoutItem;
  package$kotlin.slider_cfwmb4$ = slider;
  package$kotlin.sliderItem_xx9ca5$ = sliderItem;
  package$kotlin.switch_umm6n7$ = switch_0;
  package$kotlin.draggable_n93hli$ = draggable;
  package$kotlin.Border = Border;
  package$kotlin.Edge = Edge;
  package$kotlin.Shadow = Shadow;
  package$kotlin.GradientColor = GradientColor;
  package$kotlin.Corners_init_3p81yu$ = Corners_init;
  package$kotlin.Corners = Corners;
  package$kotlin.LayoutConfig = LayoutConfig;
  package$kotlin.layoutConfig = layoutConfig;
  Object.defineProperty(Gravity, 'Companion', {
    get: Gravity$Companion_getInstance
  });
  package$kotlin.Gravity = Gravity;
  package$kotlin.gravity = gravity;
  Object.defineProperty(FlexTypedValue, 'Companion', {
    get: FlexTypedValue$Companion_getInstance
  });
  package$kotlin.FlexTypedValue = FlexTypedValue;
  package$kotlin.FlexConfig = FlexConfig;
  Object.defineProperty(FontStyle, 'Normal', {
    get: FontStyle$Normal_getInstance
  });
  Object.defineProperty(FontStyle, 'Bold', {
    get: FontStyle$Bold_getInstance
  });
  Object.defineProperty(FontStyle, 'Italic', {
    get: FontStyle$Italic_getInstance
  });
  Object.defineProperty(FontStyle, 'BoldItalic', {
    get: FontStyle$BoldItalic_getInstance
  });
  package$kotlin.FontStyle = FontStyle;
  Object.defineProperty(ValueType, 'Undefined', {
    get: ValueType$Undefined_getInstance
  });
  Object.defineProperty(ValueType, 'Point', {
    get: ValueType$Point_getInstance
  });
  Object.defineProperty(ValueType, 'Percent', {
    get: ValueType$Percent_getInstance
  });
  Object.defineProperty(ValueType, 'Auto', {
    get: ValueType$Auto_getInstance
  });
  package$kotlin.ValueType = ValueType;
  package$kotlin.animate_riy3pp$ = animate_0;
  package$kotlin.AlertArg = AlertArg;
  package$kotlin.ConfirmArg = ConfirmArg;
  package$kotlin.PromptArg = PromptArg;
  package$kotlin.toast_pq7gum$ = toast;
  package$kotlin.alert_gbj1ig$ = alert;
  package$kotlin.alert_mbi1pg$ = alert_0;
  package$kotlin.confirm_gbj1ig$ = confirm;
  package$kotlin.confirm_jodyyo$ = confirm_0;
  package$kotlin.prompt_7evc54$ = prompt;
  package$kotlin.ScrollRange = ScrollRange;
  package$kotlin.Changing = Changing;
  package$kotlin.coordinate_ukjw57$ = coordinate;
  package$kotlin.coordinateNavBar_w42tnj$ = coordinateNavBar;
  package$kotlin.showPopover_2tpt8c$ = showPopover;
  package$kotlin.dismissPopover_gk448z$ = dismissPopover;
  Factory_VLayout = Factory_VLayout$lambda;
  Factory_HLayout = Factory_HLayout$lambda;
  Factory_Stack = Factory_Stack$lambda;
  Factory_FlexLayout = Factory_FlexLayout$lambda;
  Factory_Text = Factory_Text$lambda;
  Factory_Image = Factory_Image$lambda;
  Factory_Scroller = Factory_Scroller$lambda;
  Factory_List = Factory_List$lambda;
  Factory_ListItem = Factory_ListItem$lambda;
  Factory_Slider = Factory_Slider$lambda;
  Factory_SliderItem = Factory_SliderItem$lambda;
  Factory_FlowLayout = Factory_FlowLayout$lambda;
  Factory_FlowLayoutItem = Factory_FlowLayoutItem$lambda;
  Factory_Input = Factory_Input$lambda;
  Factory_Refreshable = Factory_Refreshable$lambda;
  Factory_Switch = Factory_Switch$lambda;
  Factory_Draggable = Factory_Draggable$lambda;
  Kotlin.defineModule('doric-kotlin', _);
  return _;
}(module.exports, require('kotlin')));

//# sourceMappingURL=doric-kotlin.js.map
