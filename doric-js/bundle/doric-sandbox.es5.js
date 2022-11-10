var doric = (function (exports) {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, basedir, module) {
		return module = {
		  path: basedir,
		  exports: {},
		  require: function (path, base) {
	      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
	    }
		}, fn(module, module.exports), module.exports;
	}

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
	}

	var check = function (it) {
	  return it && it.Math == Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global_1 =
	  // eslint-disable-next-line es/no-global-this -- safe
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  // eslint-disable-next-line no-restricted-globals -- safe
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func -- fallback
	  (function () { return this; })() || Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	// Detect IE8's incomplete defineProperty implementation
	var descriptors = !fails(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
	});

	var functionBindNative = !fails(function () {
	  // eslint-disable-next-line es/no-function-prototype-bind -- safe
	  var test = (function () { /* empty */ }).bind();
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return typeof test != 'function' || test.hasOwnProperty('prototype');
	});

	var call$2 = Function.prototype.call;

	var functionCall = functionBindNative ? call$2.bind(call$2) : function () {
	  return call$2.apply(call$2, arguments);
	};

	var $propertyIsEnumerable$2 = {}.propertyIsEnumerable;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getOwnPropertyDescriptor$b = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor$b && !$propertyIsEnumerable$2.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
	var f$8 = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor$b(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : $propertyIsEnumerable$2;

	var objectPropertyIsEnumerable = {
		f: f$8
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var FunctionPrototype$4 = Function.prototype;
	var call$1 = FunctionPrototype$4.call;
	var uncurryThisWithBind = functionBindNative && FunctionPrototype$4.bind.bind(call$1, call$1);

	var functionUncurryThisRaw = functionBindNative ? uncurryThisWithBind : function (fn) {
	  return function () {
	    return call$1.apply(fn, arguments);
	  };
	};

	var toString$2 = functionUncurryThisRaw({}.toString);
	var stringSlice$h = functionUncurryThisRaw(''.slice);

	var classofRaw = function (it) {
	  return stringSlice$h(toString$2(it), 8, -1);
	};

	var functionUncurryThis = function (fn) {
	  // Nashorn bug:
	  //   https://github.com/zloirock/core-js/issues/1128
	  //   https://github.com/zloirock/core-js/issues/1130
	  if (classofRaw(fn) === 'Function') { return functionUncurryThisRaw(fn); }
	};

	var $Object$6 = Object;
	var split$3 = functionUncurryThis(''.split);

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return !$Object$6('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split$3(it, '') : $Object$6(it);
	} : $Object$6;

	// we can't use just `it == null` since of `document.all` special case
	// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
	var isNullOrUndefined = function (it) {
	  return it === null || it === undefined;
	};

	var $TypeError$A = TypeError;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.es/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (isNullOrUndefined(it)) { throw $TypeError$A("Can't call method on " + it); }
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings



	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var documentAll$2 = typeof document == 'object' && document.all;

	// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
	var IS_HTMLDDA = typeof documentAll$2 == 'undefined' && documentAll$2 !== undefined;

	var documentAll_1 = {
	  all: documentAll$2,
	  IS_HTMLDDA: IS_HTMLDDA
	};

	var documentAll$1 = documentAll_1.all;

	// `IsCallable` abstract operation
	// https://tc39.es/ecma262/#sec-iscallable
	var isCallable = documentAll_1.IS_HTMLDDA ? function (argument) {
	  return typeof argument == 'function' || argument === documentAll$1;
	} : function (argument) {
	  return typeof argument == 'function';
	};

	var documentAll = documentAll_1.all;

	var isObject = documentAll_1.IS_HTMLDDA ? function (it) {
	  return typeof it == 'object' ? it !== null : isCallable(it) || it === documentAll;
	} : function (it) {
	  return typeof it == 'object' ? it !== null : isCallable(it);
	};

	var aFunction = function (argument) {
	  return isCallable(argument) ? argument : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(global_1[namespace]) : global_1[namespace] && global_1[namespace][method];
	};

	var objectIsPrototypeOf = functionUncurryThis({}.isPrototypeOf);

	var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

	var process$5 = global_1.process;
	var Deno$1 = global_1.Deno;
	var versions = process$5 && process$5.versions || Deno$1 && Deno$1.version;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
	  // but their correct versions are not interesting for us
	  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
	}

	// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
	// so check `userAgent` even if `.v8` exists, but 0
	if (!version && engineUserAgent) {
	  match = engineUserAgent.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = engineUserAgent.match(/Chrome\/(\d+)/);
	    if (match) { version = +match[1]; }
	  }
	}

	var engineV8Version = version;

	/* eslint-disable es/no-symbol -- required for testing */



	// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
	var symbolConstructorDetection = !!Object.getOwnPropertySymbols && !fails(function () {
	  var symbol = Symbol();
	  // Chrome 38 Symbol has incorrect toString conversion
	  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
	  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
	    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
	    !Symbol.sham && engineV8Version && engineV8Version < 41;
	});

	/* eslint-disable es/no-symbol -- required for testing */


	var useSymbolAsUid = symbolConstructorDetection
	  && !Symbol.sham
	  && typeof Symbol.iterator == 'symbol';

	var $Object$5 = Object;

	var isSymbol = useSymbolAsUid ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  var $Symbol = getBuiltIn('Symbol');
	  return isCallable($Symbol) && objectIsPrototypeOf($Symbol.prototype, $Object$5(it));
	};

	var $String$5 = String;

	var tryToString = function (argument) {
	  try {
	    return $String$5(argument);
	  } catch (error) {
	    return 'Object';
	  }
	};

	var $TypeError$z = TypeError;

	// `Assert: IsCallable(argument) is true`
	var aCallable = function (argument) {
	  if (isCallable(argument)) { return argument; }
	  throw $TypeError$z(tryToString(argument) + ' is not a function');
	};

	// `GetMethod` abstract operation
	// https://tc39.es/ecma262/#sec-getmethod
	var getMethod = function (V, P) {
	  var func = V[P];
	  return isNullOrUndefined(func) ? undefined : aCallable(func);
	};

	var $TypeError$y = TypeError;

	// `OrdinaryToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-ordinarytoprimitive
	var ordinaryToPrimitive = function (input, pref) {
	  var fn, val;
	  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = functionCall(fn, input))) { return val; }
	  if (isCallable(fn = input.valueOf) && !isObject(val = functionCall(fn, input))) { return val; }
	  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = functionCall(fn, input))) { return val; }
	  throw $TypeError$y("Can't convert object to primitive value");
	};

	var isPure = false;

	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var defineProperty$g = Object.defineProperty;

	var defineGlobalProperty = function (key, value) {
	  try {
	    defineProperty$g(global_1, key, { value: value, configurable: true, writable: true });
	  } catch (error) {
	    global_1[key] = value;
	  } return value;
	};

	var SHARED = '__core-js_shared__';
	var store$3 = global_1[SHARED] || defineGlobalProperty(SHARED, {});

	var sharedStore = store$3;

	var shared = createCommonjsModule(function (module) {
	(module.exports = function (key, value) {
	  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.26.0',
	  mode: 'global',
	  copyright: '© 2014-2022 Denis Pushkarev (zloirock.ru)',
	  license: 'https://github.com/zloirock/core-js/blob/v3.26.0/LICENSE',
	  source: 'https://github.com/zloirock/core-js'
	});
	});

	var $Object$4 = Object;

	// `ToObject` abstract operation
	// https://tc39.es/ecma262/#sec-toobject
	var toObject = function (argument) {
	  return $Object$4(requireObjectCoercible(argument));
	};

	var hasOwnProperty = functionUncurryThis({}.hasOwnProperty);

	// `HasOwnProperty` abstract operation
	// https://tc39.es/ecma262/#sec-hasownproperty
	// eslint-disable-next-line es/no-object-hasown -- safe
	var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
	  return hasOwnProperty(toObject(it), key);
	};

	var id$1 = 0;
	var postfix = Math.random();
	var toString$1 = functionUncurryThis(1.0.toString);

	var uid = function (key) {
	  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString$1(++id$1 + postfix, 36);
	};

	var WellKnownSymbolsStore$1 = shared('wks');
	var Symbol$3 = global_1.Symbol;
	var symbolFor = Symbol$3 && Symbol$3['for'];
	var createWellKnownSymbol = useSymbolAsUid ? Symbol$3 : Symbol$3 && Symbol$3.withoutSetter || uid;

	var wellKnownSymbol = function (name) {
	  if (!hasOwnProperty_1(WellKnownSymbolsStore$1, name) || !(symbolConstructorDetection || typeof WellKnownSymbolsStore$1[name] == 'string')) {
	    var description = 'Symbol.' + name;
	    if (symbolConstructorDetection && hasOwnProperty_1(Symbol$3, name)) {
	      WellKnownSymbolsStore$1[name] = Symbol$3[name];
	    } else if (useSymbolAsUid && symbolFor) {
	      WellKnownSymbolsStore$1[name] = symbolFor(description);
	    } else {
	      WellKnownSymbolsStore$1[name] = createWellKnownSymbol(description);
	    }
	  } return WellKnownSymbolsStore$1[name];
	};

	var $TypeError$x = TypeError;
	var TO_PRIMITIVE$1 = wellKnownSymbol('toPrimitive');

	// `ToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-toprimitive
	var toPrimitive = function (input, pref) {
	  if (!isObject(input) || isSymbol(input)) { return input; }
	  var exoticToPrim = getMethod(input, TO_PRIMITIVE$1);
	  var result;
	  if (exoticToPrim) {
	    if (pref === undefined) { pref = 'default'; }
	    result = functionCall(exoticToPrim, input, pref);
	    if (!isObject(result) || isSymbol(result)) { return result; }
	    throw $TypeError$x("Can't convert object to primitive value");
	  }
	  if (pref === undefined) { pref = 'number'; }
	  return ordinaryToPrimitive(input, pref);
	};

	// `ToPropertyKey` abstract operation
	// https://tc39.es/ecma262/#sec-topropertykey
	var toPropertyKey = function (argument) {
	  var key = toPrimitive(argument, 'string');
	  return isSymbol(key) ? key : key + '';
	};

	var document$3 = global_1.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS$1 = isObject(document$3) && isObject(document$3.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS$1 ? document$3.createElement(it) : {};
	};

	// Thanks to IE8 for its funny defineProperty
	var ie8DomDefine = !descriptors && !fails(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var $getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
	var f$7 = descriptors ? $getOwnPropertyDescriptor$2 : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPropertyKey(P);
	  if (ie8DomDefine) { try {
	    return $getOwnPropertyDescriptor$2(O, P);
	  } catch (error) { /* empty */ } }
	  if (hasOwnProperty_1(O, P)) { return createPropertyDescriptor(!functionCall(objectPropertyIsEnumerable.f, O, P), O[P]); }
	};

	var objectGetOwnPropertyDescriptor = {
		f: f$7
	};

	// V8 ~ Chrome 36-
	// https://bugs.chromium.org/p/v8/issues/detail?id=3334
	var v8PrototypeDefineBug = descriptors && fails(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
	    value: 42,
	    writable: false
	  }).prototype != 42;
	});

	var $String$4 = String;
	var $TypeError$w = TypeError;

	// `Assert: Type(argument) is Object`
	var anObject = function (argument) {
	  if (isObject(argument)) { return argument; }
	  throw $TypeError$w($String$4(argument) + ' is not an object');
	};

	var $TypeError$v = TypeError;
	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var $defineProperty$1 = Object.defineProperty;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;
	var ENUMERABLE = 'enumerable';
	var CONFIGURABLE$1 = 'configurable';
	var WRITABLE = 'writable';

	// `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty
	var f$6 = descriptors ? v8PrototypeDefineBug ? function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPropertyKey(P);
	  anObject(Attributes);
	  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
	    var current = $getOwnPropertyDescriptor$1(O, P);
	    if (current && current[WRITABLE]) {
	      O[P] = Attributes.value;
	      Attributes = {
	        configurable: CONFIGURABLE$1 in Attributes ? Attributes[CONFIGURABLE$1] : current[CONFIGURABLE$1],
	        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
	        writable: false
	      };
	    }
	  } return $defineProperty$1(O, P, Attributes);
	} : $defineProperty$1 : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPropertyKey(P);
	  anObject(Attributes);
	  if (ie8DomDefine) { try {
	    return $defineProperty$1(O, P, Attributes);
	  } catch (error) { /* empty */ } }
	  if ('get' in Attributes || 'set' in Attributes) { throw $TypeError$v('Accessors not supported'); }
	  if ('value' in Attributes) { O[P] = Attributes.value; }
	  return O;
	};

	var objectDefineProperty = {
		f: f$6
	};

	var createNonEnumerableProperty = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var FunctionPrototype$3 = Function.prototype;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getDescriptor = descriptors && Object.getOwnPropertyDescriptor;

	var EXISTS = hasOwnProperty_1(FunctionPrototype$3, 'name');
	// additional protection from minified / mangled / dropped function names
	var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
	var CONFIGURABLE = EXISTS && (!descriptors || (descriptors && getDescriptor(FunctionPrototype$3, 'name').configurable));

	var functionName = {
	  EXISTS: EXISTS,
	  PROPER: PROPER,
	  CONFIGURABLE: CONFIGURABLE
	};

	var functionToString$1 = functionUncurryThis(Function.toString);

	// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
	if (!isCallable(sharedStore.inspectSource)) {
	  sharedStore.inspectSource = function (it) {
	    return functionToString$1(it);
	  };
	}

	var inspectSource = sharedStore.inspectSource;

	var WeakMap$4 = global_1.WeakMap;

	var weakMapBasicDetection = isCallable(WeakMap$4) && /native code/.test(String(WeakMap$4));

	var keys$3 = shared('keys');

	var sharedKey = function (key) {
	  return keys$3[key] || (keys$3[key] = uid(key));
	};

	var hiddenKeys$1 = {};

	var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
	var TypeError$8 = global_1.TypeError;
	var WeakMap$3 = global_1.WeakMap;
	var set$3, get$2, has;

	var enforce = function (it) {
	  return has(it) ? get$2(it) : set$3(it, {});
	};

	var getterFor$2 = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject(it) || (state = get$2(it)).type !== TYPE) {
	      throw TypeError$8('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (weakMapBasicDetection || sharedStore.state) {
	  var store$2 = sharedStore.state || (sharedStore.state = new WeakMap$3());
	  /* eslint-disable no-self-assign -- prototype methods protection */
	  store$2.get = store$2.get;
	  store$2.has = store$2.has;
	  store$2.set = store$2.set;
	  /* eslint-enable no-self-assign -- prototype methods protection */
	  set$3 = function (it, metadata) {
	    if (store$2.has(it)) { throw TypeError$8(OBJECT_ALREADY_INITIALIZED); }
	    metadata.facade = it;
	    store$2.set(it, metadata);
	    return metadata;
	  };
	  get$2 = function (it) {
	    return store$2.get(it) || {};
	  };
	  has = function (it) {
	    return store$2.has(it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys$1[STATE] = true;
	  set$3 = function (it, metadata) {
	    if (hasOwnProperty_1(it, STATE)) { throw TypeError$8(OBJECT_ALREADY_INITIALIZED); }
	    metadata.facade = it;
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };
	  get$2 = function (it) {
	    return hasOwnProperty_1(it, STATE) ? it[STATE] : {};
	  };
	  has = function (it) {
	    return hasOwnProperty_1(it, STATE);
	  };
	}

	var internalState = {
	  set: set$3,
	  get: get$2,
	  has: has,
	  enforce: enforce,
	  getterFor: getterFor$2
	};

	var makeBuiltIn_1 = createCommonjsModule(function (module) {
	var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;



	var enforceInternalState = internalState.enforce;
	var getInternalState = internalState.get;
	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var defineProperty = Object.defineProperty;

	var CONFIGURABLE_LENGTH = descriptors && !fails(function () {
	  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
	});

	var TEMPLATE = String(String).split('String');

	var makeBuiltIn = module.exports = function (value, name, options) {
	  if (String(name).slice(0, 7) === 'Symbol(') {
	    name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
	  }
	  if (options && options.getter) { name = 'get ' + name; }
	  if (options && options.setter) { name = 'set ' + name; }
	  if (!hasOwnProperty_1(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
	    if (descriptors) { defineProperty(value, 'name', { value: name, configurable: true }); }
	    else { value.name = name; }
	  }
	  if (CONFIGURABLE_LENGTH && options && hasOwnProperty_1(options, 'arity') && value.length !== options.arity) {
	    defineProperty(value, 'length', { value: options.arity });
	  }
	  try {
	    if (options && hasOwnProperty_1(options, 'constructor') && options.constructor) {
	      if (descriptors) { defineProperty(value, 'prototype', { writable: false }); }
	    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
	    } else if (value.prototype) { value.prototype = undefined; }
	  } catch (error) { /* empty */ }
	  var state = enforceInternalState(value);
	  if (!hasOwnProperty_1(state, 'source')) {
	    state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
	  } return value;
	};

	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	// eslint-disable-next-line no-extend-native -- required
	Function.prototype.toString = makeBuiltIn(function toString() {
	  return isCallable(this) && getInternalState(this).source || inspectSource(this);
	}, 'toString');
	});

	var defineBuiltIn = function (O, key, value, options) {
	  if (!options) { options = {}; }
	  var simple = options.enumerable;
	  var name = options.name !== undefined ? options.name : key;
	  if (isCallable(value)) { makeBuiltIn_1(value, name, options); }
	  if (options.global) {
	    if (simple) { O[key] = value; }
	    else { defineGlobalProperty(key, value); }
	  } else {
	    try {
	      if (!options.unsafe) { delete O[key]; }
	      else if (O[key]) { simple = true; }
	    } catch (error) { /* empty */ }
	    if (simple) { O[key] = value; }
	    else { objectDefineProperty.f(O, key, {
	      value: value,
	      enumerable: false,
	      configurable: !options.nonConfigurable,
	      writable: !options.nonWritable
	    }); }
	  } return O;
	};

	var ceil$1 = Math.ceil;
	var floor$a = Math.floor;

	// `Math.trunc` method
	// https://tc39.es/ecma262/#sec-math.trunc
	// eslint-disable-next-line es/no-math-trunc -- safe
	var mathTrunc = Math.trunc || function trunc(x) {
	  var n = +x;
	  return (n > 0 ? floor$a : ceil$1)(n);
	};

	// `ToIntegerOrInfinity` abstract operation
	// https://tc39.es/ecma262/#sec-tointegerorinfinity
	var toIntegerOrInfinity = function (argument) {
	  var number = +argument;
	  // eslint-disable-next-line no-self-compare -- NaN check
	  return number !== number || number === 0 ? 0 : mathTrunc(number);
	};

	var max$9 = Math.max;
	var min$c = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex = function (index, length) {
	  var integer = toIntegerOrInfinity(index);
	  return integer < 0 ? max$9(integer + length, 0) : min$c(integer, length);
	};

	var min$b = Math.min;

	// `ToLength` abstract operation
	// https://tc39.es/ecma262/#sec-tolength
	var toLength = function (argument) {
	  return argument > 0 ? min$b(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	// `LengthOfArrayLike` abstract operation
	// https://tc39.es/ecma262/#sec-lengthofarraylike
	var lengthOfArrayLike = function (obj) {
	  return toLength(obj.length);
	};

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod$8 = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = lengthOfArrayLike(O);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare -- NaN check
	    if (IS_INCLUDES && el != el) { while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare -- NaN check
	      if (value != value) { return true; }
	    // Array#indexOf ignores holes, Array#includes - not
	    } } else { for (;length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) { return IS_INCLUDES || index || 0; }
	    } } return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.es/ecma262/#sec-array.prototype.includes
	  includes: createMethod$8(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.es/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod$8(false)
	};

	var indexOf$2 = arrayIncludes.indexOf;


	var push$m = functionUncurryThis([].push);

	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) { !hasOwnProperty_1(hiddenKeys$1, key) && hasOwnProperty_1(O, key) && push$m(result, key); }
	  // Don't enum bug & hidden keys
	  while (names.length > i) { if (hasOwnProperty_1(O, key = names[i++])) {
	    ~indexOf$2(result, key) || push$m(result, key);
	  } }
	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys = [
	  'constructor',
	  'hasOwnProperty',
	  'isPrototypeOf',
	  'propertyIsEnumerable',
	  'toLocaleString',
	  'toString',
	  'valueOf'
	];

	var hiddenKeys = enumBugKeys.concat('length', 'prototype');

	// `Object.getOwnPropertyNames` method
	// https://tc39.es/ecma262/#sec-object.getownpropertynames
	// eslint-disable-next-line es/no-object-getownpropertynames -- safe
	var f$5 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys);
	};

	var objectGetOwnPropertyNames = {
		f: f$5
	};

	// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
	var f$4 = Object.getOwnPropertySymbols;

	var objectGetOwnPropertySymbols = {
		f: f$4
	};

	var concat$4 = functionUncurryThis([].concat);

	// all object keys, includes non-enumerable and symbols
	var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = objectGetOwnPropertyNames.f(anObject(it));
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  return getOwnPropertySymbols ? concat$4(keys, getOwnPropertySymbols(it)) : keys;
	};

	var copyConstructorProperties = function (target, source, exceptions) {
	  var keys = ownKeys(source);
	  var defineProperty = objectDefineProperty.f;
	  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!hasOwnProperty_1(target, key) && !(exceptions && hasOwnProperty_1(exceptions, key))) {
	      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	    }
	  }
	};

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true
	    : value == NATIVE ? false
	    : isCallable(detection) ? fails(detection)
	    : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';

	var isForced_1 = isForced;

	var getOwnPropertyDescriptor$a = objectGetOwnPropertyDescriptor.f;






	/*
	  options.target         - name of the target object
	  options.global         - target is the global object
	  options.stat           - export as static methods of target
	  options.proto          - export as prototype methods of target
	  options.real           - real prototype method for the `pure` version
	  options.forced         - export even if the native feature is available
	  options.bind           - bind methods to the target, required for the `pure` version
	  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
	  options.sham           - add a flag to not completely full polyfills
	  options.enumerable     - export as enumerable property
	  options.dontCallGetSet - prevent calling a getter on target
	  options.name           - the .name of the function if it does not match the key
	*/
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
	  if (GLOBAL) {
	    target = global_1;
	  } else if (STATIC) {
	    target = global_1[TARGET] || defineGlobalProperty(TARGET, {});
	  } else {
	    target = (global_1[TARGET] || {}).prototype;
	  }
	  if (target) { for (key in source) {
	    sourceProperty = source[key];
	    if (options.dontCallGetSet) {
	      descriptor = getOwnPropertyDescriptor$a(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else { targetProperty = target[key]; }
	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contained in target
	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty == typeof targetProperty) { continue; }
	      copyConstructorProperties(sourceProperty, targetProperty);
	    }
	    // add a flag to not completely full polyfills
	    if (options.sham || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty(sourceProperty, 'sham', true);
	    }
	    defineBuiltIn(target, key, sourceProperty, options);
	  } }
	};

	var TO_STRING_TAG$9 = wellKnownSymbol('toStringTag');
	var test$2 = {};

	test$2[TO_STRING_TAG$9] = 'z';

	var toStringTagSupport = String(test$2) === '[object z]';

	var TO_STRING_TAG$8 = wellKnownSymbol('toStringTag');
	var $Object$3 = Object;

	// ES3 wrong here
	var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) { /* empty */ }
	};

	// getting tag from ES6+ `Object.prototype.toString`
	var classof = toStringTagSupport ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (tag = tryGet(O = $Object$3(it), TO_STRING_TAG$8)) == 'string' ? tag
	    // builtinTag case
	    : CORRECT_ARGUMENTS ? classofRaw(O)
	    // ES3 arguments fallback
	    : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
	};

	var $String$3 = String;

	var toString_1 = function (argument) {
	  if (classof(argument) === 'Symbol') { throw TypeError('Cannot convert a Symbol value to a string'); }
	  return $String$3(argument);
	};

	// `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	// eslint-disable-next-line es/no-object-keys -- safe
	var objectKeys$1 = Object.keys || function keys(O) {
	  return objectKeysInternal(O, enumBugKeys);
	};

	// `Object.defineProperties` method
	// https://tc39.es/ecma262/#sec-object.defineproperties
	// eslint-disable-next-line es/no-object-defineproperties -- safe
	var f$3 = descriptors && !v8PrototypeDefineBug ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var props = toIndexedObject(Properties);
	  var keys = objectKeys$1(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;
	  while (length > index) { objectDefineProperty.f(O, key = keys[index++], props[key]); }
	  return O;
	};

	var objectDefineProperties = {
		f: f$3
	};

	var html = getBuiltIn('document', 'documentElement');

	/* global ActiveXObject -- old IE, WSH */








	var GT = '>';
	var LT = '<';
	var PROTOTYPE$2 = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO$1 = sharedKey('IE_PROTO');

	var EmptyConstructor = function () { /* empty */ };

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	};

	// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  activeXDocument = null; // avoid memory leak
	  return temp;
	};

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html.appendChild(iframe);
	  // https://github.com/zloirock/core-js/issues/475
	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	};

	// Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug
	var activeXDocument;
	var NullProtoObject = function () {
	  try {
	    activeXDocument = new ActiveXObject('htmlfile');
	  } catch (error) { /* ignore */ }
	  NullProtoObject = typeof document != 'undefined'
	    ? document.domain && activeXDocument
	      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
	      : NullProtoObjectViaIFrame()
	    : NullProtoObjectViaActiveX(activeXDocument); // WSH
	  var length = enumBugKeys.length;
	  while (length--) { delete NullProtoObject[PROTOTYPE$2][enumBugKeys[length]]; }
	  return NullProtoObject();
	};

	hiddenKeys$1[IE_PROTO$1] = true;

	// `Object.create` method
	// https://tc39.es/ecma262/#sec-object.create
	// eslint-disable-next-line es/no-object-create -- safe
	var objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE$2] = anObject(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE$2] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO$1] = O;
	  } else { result = NullProtoObject(); }
	  return Properties === undefined ? result : objectDefineProperties.f(result, Properties);
	};

	var createProperty = function (object, key, value) {
	  var propertyKey = toPropertyKey(key);
	  if (propertyKey in object) { objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value)); }
	  else { object[propertyKey] = value; }
	};

	var $Array$b = Array;
	var max$8 = Math.max;

	var arraySliceSimple = function (O, start, end) {
	  var length = lengthOfArrayLike(O);
	  var k = toAbsoluteIndex(start, length);
	  var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	  var result = $Array$b(max$8(fin - k, 0));
	  for (var n = 0; k < fin; k++, n++) { createProperty(result, n, O[k]); }
	  result.length = n;
	  return result;
	};

	/* eslint-disable es/no-object-getownpropertynames -- safe */


	var $getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;


	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function (it) {
	  try {
	    return $getOwnPropertyNames$1(it);
	  } catch (error) {
	    return arraySliceSimple(windowNames);
	  }
	};

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var f$2 = function getOwnPropertyNames(it) {
	  return windowNames && classofRaw(it) == 'Window'
	    ? getWindowNames(it)
	    : $getOwnPropertyNames$1(toIndexedObject(it));
	};

	var objectGetOwnPropertyNamesExternal = {
		f: f$2
	};

	var f$1 = wellKnownSymbol;

	var wellKnownSymbolWrapped = {
		f: f$1
	};

	var path = global_1;

	var defineProperty$f = objectDefineProperty.f;

	var wellKnownSymbolDefine = function (NAME) {
	  var Symbol = path.Symbol || (path.Symbol = {});
	  if (!hasOwnProperty_1(Symbol, NAME)) { defineProperty$f(Symbol, NAME, {
	    value: wellKnownSymbolWrapped.f(NAME)
	  }); }
	};

	var symbolDefineToPrimitive = function () {
	  var Symbol = getBuiltIn('Symbol');
	  var SymbolPrototype = Symbol && Symbol.prototype;
	  var valueOf = SymbolPrototype && SymbolPrototype.valueOf;
	  var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

	  if (SymbolPrototype && !SymbolPrototype[TO_PRIMITIVE]) {
	    // `Symbol.prototype[@@toPrimitive]` method
	    // https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
	    // eslint-disable-next-line no-unused-vars -- required for .length
	    defineBuiltIn(SymbolPrototype, TO_PRIMITIVE, function (hint) {
	      return functionCall(valueOf, this);
	    }, { arity: 1 });
	  }
	};

	var defineProperty$e = objectDefineProperty.f;



	var TO_STRING_TAG$7 = wellKnownSymbol('toStringTag');

	var setToStringTag = function (target, TAG, STATIC) {
	  if (target && !STATIC) { target = target.prototype; }
	  if (target && !hasOwnProperty_1(target, TO_STRING_TAG$7)) {
	    defineProperty$e(target, TO_STRING_TAG$7, { configurable: true, value: TAG });
	  }
	};

	var bind$1 = functionUncurryThis(functionUncurryThis.bind);

	// optional / simple context binding
	var functionBindContext = function (fn, that) {
	  aCallable(fn);
	  return that === undefined ? fn : functionBindNative ? bind$1(fn, that) : function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	// `IsArray` abstract operation
	// https://tc39.es/ecma262/#sec-isarray
	// eslint-disable-next-line es/no-array-isarray -- safe
	var isArray = Array.isArray || function isArray(argument) {
	  return classofRaw(argument) == 'Array';
	};

	var noop = function () { /* empty */ };
	var empty = [];
	var construct$1 = getBuiltIn('Reflect', 'construct');
	var constructorRegExp = /^\s*(?:class|function)\b/;
	var exec$b = functionUncurryThis(constructorRegExp.exec);
	var INCORRECT_TO_STRING$2 = !constructorRegExp.exec(noop);

	var isConstructorModern = function isConstructor(argument) {
	  if (!isCallable(argument)) { return false; }
	  try {
	    construct$1(noop, empty, argument);
	    return true;
	  } catch (error) {
	    return false;
	  }
	};

	var isConstructorLegacy = function isConstructor(argument) {
	  if (!isCallable(argument)) { return false; }
	  switch (classof(argument)) {
	    case 'AsyncFunction':
	    case 'GeneratorFunction':
	    case 'AsyncGeneratorFunction': return false;
	  }
	  try {
	    // we can't check .prototype since constructors produced by .bind haven't it
	    // `Function#toString` throws on some built-it function in some legacy engines
	    // (for example, `DOMQuad` and similar in FF41-)
	    return INCORRECT_TO_STRING$2 || !!exec$b(constructorRegExp, inspectSource(argument));
	  } catch (error) {
	    return true;
	  }
	};

	isConstructorLegacy.sham = true;

	// `IsConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-isconstructor
	var isConstructor = !construct$1 || fails(function () {
	  var called;
	  return isConstructorModern(isConstructorModern.call)
	    || !isConstructorModern(Object)
	    || !isConstructorModern(function () { called = true; })
	    || called;
	}) ? isConstructorLegacy : isConstructorModern;

	var SPECIES$6 = wellKnownSymbol('species');
	var $Array$a = Array;

	// a part of `ArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#sec-arrayspeciescreate
	var arraySpeciesConstructor = function (originalArray) {
	  var C;
	  if (isArray(originalArray)) {
	    C = originalArray.constructor;
	    // cross-realm fallback
	    if (isConstructor(C) && (C === $Array$a || isArray(C.prototype))) { C = undefined; }
	    else if (isObject(C)) {
	      C = C[SPECIES$6];
	      if (C === null) { C = undefined; }
	    }
	  } return C === undefined ? $Array$a : C;
	};

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#sec-arrayspeciescreate
	var arraySpeciesCreate = function (originalArray, length) {
	  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
	};

	var push$l = functionUncurryThis([].push);

	// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
	var createMethod$7 = function (TYPE) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var IS_FILTER_REJECT = TYPE == 7;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject($this);
	    var self = indexedObject(O);
	    var boundFunction = functionBindContext(callbackfn, that);
	    var length = lengthOfArrayLike(self);
	    var index = 0;
	    var create = specificCreate || arraySpeciesCreate;
	    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
	    var value, result;
	    for (;length > index; index++) { if (NO_HOLES || index in self) {
	      value = self[index];
	      result = boundFunction(value, index, O);
	      if (TYPE) {
	        if (IS_MAP) { target[index] = result; } // map
	        else if (result) { switch (TYPE) {
	          case 3: return true;              // some
	          case 5: return value;             // find
	          case 6: return index;             // findIndex
	          case 2: push$l(target, value);      // filter
	        } } else { switch (TYPE) {
	          case 4: return false;             // every
	          case 7: push$l(target, value);      // filterReject
	        } }
	      }
	    } }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	var arrayIteration = {
	  // `Array.prototype.forEach` method
	  // https://tc39.es/ecma262/#sec-array.prototype.foreach
	  forEach: createMethod$7(0),
	  // `Array.prototype.map` method
	  // https://tc39.es/ecma262/#sec-array.prototype.map
	  map: createMethod$7(1),
	  // `Array.prototype.filter` method
	  // https://tc39.es/ecma262/#sec-array.prototype.filter
	  filter: createMethod$7(2),
	  // `Array.prototype.some` method
	  // https://tc39.es/ecma262/#sec-array.prototype.some
	  some: createMethod$7(3),
	  // `Array.prototype.every` method
	  // https://tc39.es/ecma262/#sec-array.prototype.every
	  every: createMethod$7(4),
	  // `Array.prototype.find` method
	  // https://tc39.es/ecma262/#sec-array.prototype.find
	  find: createMethod$7(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$7(6),
	  // `Array.prototype.filterReject` method
	  // https://github.com/tc39/proposal-array-filtering
	  filterReject: createMethod$7(7)
	};

	var $forEach$3 = arrayIteration.forEach;

	var HIDDEN = sharedKey('hidden');
	var SYMBOL = 'Symbol';
	var PROTOTYPE$1 = 'prototype';

	var setInternalState$i = internalState.set;
	var getInternalState$e = internalState.getterFor(SYMBOL);

	var ObjectPrototype$5 = Object[PROTOTYPE$1];
	var $Symbol = global_1.Symbol;
	var SymbolPrototype$1 = $Symbol && $Symbol[PROTOTYPE$1];
	var TypeError$7 = global_1.TypeError;
	var QObject = global_1.QObject;
	var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
	var nativeDefineProperty = objectDefineProperty.f;
	var nativeGetOwnPropertyNames = objectGetOwnPropertyNamesExternal.f;
	var nativePropertyIsEnumerable = objectPropertyIsEnumerable.f;
	var push$k = functionUncurryThis([].push);

	var AllSymbols = shared('symbols');
	var ObjectPrototypeSymbols = shared('op-symbols');
	var WellKnownSymbolsStore = shared('wks');

	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDescriptor = descriptors && fails(function () {
	  return objectCreate(nativeDefineProperty({}, 'a', {
	    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
	  })).a != 7;
	}) ? function (O, P, Attributes) {
	  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$1(ObjectPrototype$5, P);
	  if (ObjectPrototypeDescriptor) { delete ObjectPrototype$5[P]; }
	  nativeDefineProperty(O, P, Attributes);
	  if (ObjectPrototypeDescriptor && O !== ObjectPrototype$5) {
	    nativeDefineProperty(ObjectPrototype$5, P, ObjectPrototypeDescriptor);
	  }
	} : nativeDefineProperty;

	var wrap$1 = function (tag, description) {
	  var symbol = AllSymbols[tag] = objectCreate(SymbolPrototype$1);
	  setInternalState$i(symbol, {
	    type: SYMBOL,
	    tag: tag,
	    description: description
	  });
	  if (!descriptors) { symbol.description = description; }
	  return symbol;
	};

	var $defineProperty = function defineProperty(O, P, Attributes) {
	  if (O === ObjectPrototype$5) { $defineProperty(ObjectPrototypeSymbols, P, Attributes); }
	  anObject(O);
	  var key = toPropertyKey(P);
	  anObject(Attributes);
	  if (hasOwnProperty_1(AllSymbols, key)) {
	    if (!Attributes.enumerable) {
	      if (!hasOwnProperty_1(O, HIDDEN)) { nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {})); }
	      O[HIDDEN][key] = true;
	    } else {
	      if (hasOwnProperty_1(O, HIDDEN) && O[HIDDEN][key]) { O[HIDDEN][key] = false; }
	      Attributes = objectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
	    } return setSymbolDescriptor(O, key, Attributes);
	  } return nativeDefineProperty(O, key, Attributes);
	};

	var $defineProperties = function defineProperties(O, Properties) {
	  anObject(O);
	  var properties = toIndexedObject(Properties);
	  var keys = objectKeys$1(properties).concat($getOwnPropertySymbols(properties));
	  $forEach$3(keys, function (key) {
	    if (!descriptors || functionCall($propertyIsEnumerable$1, properties, key)) { $defineProperty(O, key, properties[key]); }
	  });
	  return O;
	};

	var $create = function create(O, Properties) {
	  return Properties === undefined ? objectCreate(O) : $defineProperties(objectCreate(O), Properties);
	};

	var $propertyIsEnumerable$1 = function propertyIsEnumerable(V) {
	  var P = toPropertyKey(V);
	  var enumerable = functionCall(nativePropertyIsEnumerable, this, P);
	  if (this === ObjectPrototype$5 && hasOwnProperty_1(AllSymbols, P) && !hasOwnProperty_1(ObjectPrototypeSymbols, P)) { return false; }
	  return enumerable || !hasOwnProperty_1(this, P) || !hasOwnProperty_1(AllSymbols, P) || hasOwnProperty_1(this, HIDDEN) && this[HIDDEN][P]
	    ? enumerable : true;
	};

	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
	  var it = toIndexedObject(O);
	  var key = toPropertyKey(P);
	  if (it === ObjectPrototype$5 && hasOwnProperty_1(AllSymbols, key) && !hasOwnProperty_1(ObjectPrototypeSymbols, key)) { return; }
	  var descriptor = nativeGetOwnPropertyDescriptor$1(it, key);
	  if (descriptor && hasOwnProperty_1(AllSymbols, key) && !(hasOwnProperty_1(it, HIDDEN) && it[HIDDEN][key])) {
	    descriptor.enumerable = true;
	  }
	  return descriptor;
	};

	var $getOwnPropertyNames = function getOwnPropertyNames(O) {
	  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
	  var result = [];
	  $forEach$3(names, function (key) {
	    if (!hasOwnProperty_1(AllSymbols, key) && !hasOwnProperty_1(hiddenKeys$1, key)) { push$k(result, key); }
	  });
	  return result;
	};

	var $getOwnPropertySymbols = function (O) {
	  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype$5;
	  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
	  var result = [];
	  $forEach$3(names, function (key) {
	    if (hasOwnProperty_1(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || hasOwnProperty_1(ObjectPrototype$5, key))) {
	      push$k(result, AllSymbols[key]);
	    }
	  });
	  return result;
	};

	// `Symbol` constructor
	// https://tc39.es/ecma262/#sec-symbol-constructor
	if (!symbolConstructorDetection) {
	  $Symbol = function Symbol() {
	    if (objectIsPrototypeOf(SymbolPrototype$1, this)) { throw TypeError$7('Symbol is not a constructor'); }
	    var description = !arguments.length || arguments[0] === undefined ? undefined : toString_1(arguments[0]);
	    var tag = uid(description);
	    var setter = function (value) {
	      if (this === ObjectPrototype$5) { functionCall(setter, ObjectPrototypeSymbols, value); }
	      if (hasOwnProperty_1(this, HIDDEN) && hasOwnProperty_1(this[HIDDEN], tag)) { this[HIDDEN][tag] = false; }
	      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
	    };
	    if (descriptors && USE_SETTER) { setSymbolDescriptor(ObjectPrototype$5, tag, { configurable: true, set: setter }); }
	    return wrap$1(tag, description);
	  };

	  SymbolPrototype$1 = $Symbol[PROTOTYPE$1];

	  defineBuiltIn(SymbolPrototype$1, 'toString', function toString() {
	    return getInternalState$e(this).tag;
	  });

	  defineBuiltIn($Symbol, 'withoutSetter', function (description) {
	    return wrap$1(uid(description), description);
	  });

	  objectPropertyIsEnumerable.f = $propertyIsEnumerable$1;
	  objectDefineProperty.f = $defineProperty;
	  objectDefineProperties.f = $defineProperties;
	  objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor;
	  objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames;
	  objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

	  wellKnownSymbolWrapped.f = function (name) {
	    return wrap$1(wellKnownSymbol(name), name);
	  };

	  if (descriptors) {
	    // https://github.com/tc39/proposal-Symbol-description
	    nativeDefineProperty(SymbolPrototype$1, 'description', {
	      configurable: true,
	      get: function description() {
	        return getInternalState$e(this).description;
	      }
	    });
	    {
	      defineBuiltIn(ObjectPrototype$5, 'propertyIsEnumerable', $propertyIsEnumerable$1, { unsafe: true });
	    }
	  }
	}

	_export({ global: true, constructor: true, wrap: true, forced: !symbolConstructorDetection, sham: !symbolConstructorDetection }, {
	  Symbol: $Symbol
	});

	$forEach$3(objectKeys$1(WellKnownSymbolsStore), function (name) {
	  wellKnownSymbolDefine(name);
	});

	_export({ target: SYMBOL, stat: true, forced: !symbolConstructorDetection }, {
	  useSetter: function () { USE_SETTER = true; },
	  useSimple: function () { USE_SETTER = false; }
	});

	_export({ target: 'Object', stat: true, forced: !symbolConstructorDetection, sham: !descriptors }, {
	  // `Object.create` method
	  // https://tc39.es/ecma262/#sec-object.create
	  create: $create,
	  // `Object.defineProperty` method
	  // https://tc39.es/ecma262/#sec-object.defineproperty
	  defineProperty: $defineProperty,
	  // `Object.defineProperties` method
	  // https://tc39.es/ecma262/#sec-object.defineproperties
	  defineProperties: $defineProperties,
	  // `Object.getOwnPropertyDescriptor` method
	  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
	});

	_export({ target: 'Object', stat: true, forced: !symbolConstructorDetection }, {
	  // `Object.getOwnPropertyNames` method
	  // https://tc39.es/ecma262/#sec-object.getownpropertynames
	  getOwnPropertyNames: $getOwnPropertyNames
	});

	// `Symbol.prototype[@@toPrimitive]` method
	// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
	symbolDefineToPrimitive();

	// `Symbol.prototype[@@toStringTag]` property
	// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
	setToStringTag($Symbol, SYMBOL);

	hiddenKeys$1[HIDDEN] = true;

	/* eslint-disable es/no-symbol -- safe */
	var symbolRegistryDetection = symbolConstructorDetection && !!Symbol['for'] && !!Symbol.keyFor;

	var StringToSymbolRegistry = shared('string-to-symbol-registry');
	var SymbolToStringRegistry$1 = shared('symbol-to-string-registry');

	// `Symbol.for` method
	// https://tc39.es/ecma262/#sec-symbol.for
	_export({ target: 'Symbol', stat: true, forced: !symbolRegistryDetection }, {
	  'for': function (key) {
	    var string = toString_1(key);
	    if (hasOwnProperty_1(StringToSymbolRegistry, string)) { return StringToSymbolRegistry[string]; }
	    var symbol = getBuiltIn('Symbol')(string);
	    StringToSymbolRegistry[string] = symbol;
	    SymbolToStringRegistry$1[symbol] = string;
	    return symbol;
	  }
	});

	var SymbolToStringRegistry = shared('symbol-to-string-registry');

	// `Symbol.keyFor` method
	// https://tc39.es/ecma262/#sec-symbol.keyfor
	_export({ target: 'Symbol', stat: true, forced: !symbolRegistryDetection }, {
	  keyFor: function keyFor(sym) {
	    if (!isSymbol(sym)) { throw TypeError(tryToString(sym) + ' is not a symbol'); }
	    if (hasOwnProperty_1(SymbolToStringRegistry, sym)) { return SymbolToStringRegistry[sym]; }
	  }
	});

	var FunctionPrototype$2 = Function.prototype;
	var apply = FunctionPrototype$2.apply;
	var call = FunctionPrototype$2.call;

	// eslint-disable-next-line es/no-reflect -- safe
	var functionApply = typeof Reflect == 'object' && Reflect.apply || (functionBindNative ? call.bind(apply) : function () {
	  return call.apply(apply, arguments);
	});

	var arraySlice$1 = functionUncurryThis([].slice);

	var $stringify = getBuiltIn('JSON', 'stringify');
	var exec$a = functionUncurryThis(/./.exec);
	var charAt$i = functionUncurryThis(''.charAt);
	var charCodeAt$7 = functionUncurryThis(''.charCodeAt);
	var replace$b = functionUncurryThis(''.replace);
	var numberToString$3 = functionUncurryThis(1.0.toString);

	var tester = /[\uD800-\uDFFF]/g;
	var low = /^[\uD800-\uDBFF]$/;
	var hi = /^[\uDC00-\uDFFF]$/;

	var WRONG_SYMBOLS_CONVERSION = !symbolConstructorDetection || fails(function () {
	  var symbol = getBuiltIn('Symbol')();
	  // MS Edge converts symbol values to JSON as {}
	  return $stringify([symbol]) != '[null]'
	    // WebKit converts symbol values to JSON as null
	    || $stringify({ a: symbol }) != '{}'
	    // V8 throws on boxed symbols
	    || $stringify(Object(symbol)) != '{}';
	});

	// https://github.com/tc39/proposal-well-formed-stringify
	var ILL_FORMED_UNICODE = fails(function () {
	  return $stringify('\uDF06\uD834') !== '"\\udf06\\ud834"'
	    || $stringify('\uDEAD') !== '"\\udead"';
	});

	var stringifyWithSymbolsFix = function (it, replacer) {
	  var args = arraySlice$1(arguments);
	  var $replacer = replacer;
	  if (!isObject(replacer) && it === undefined || isSymbol(it)) { return; } // IE8 returns string on undefined
	  if (!isArray(replacer)) { replacer = function (key, value) {
	    if (isCallable($replacer)) { value = functionCall($replacer, this, key, value); }
	    if (!isSymbol(value)) { return value; }
	  }; }
	  args[1] = replacer;
	  return functionApply($stringify, null, args);
	};

	var fixIllFormed = function (match, offset, string) {
	  var prev = charAt$i(string, offset - 1);
	  var next = charAt$i(string, offset + 1);
	  if ((exec$a(low, match) && !exec$a(hi, next)) || (exec$a(hi, match) && !exec$a(low, prev))) {
	    return '\\u' + numberToString$3(charCodeAt$7(match, 0), 16);
	  } return match;
	};

	if ($stringify) {
	  // `JSON.stringify` method
	  // https://tc39.es/ecma262/#sec-json.stringify
	  _export({ target: 'JSON', stat: true, arity: 3, forced: WRONG_SYMBOLS_CONVERSION || ILL_FORMED_UNICODE }, {
	    // eslint-disable-next-line no-unused-vars -- required for `.length`
	    stringify: function stringify(it, replacer, space) {
	      var args = arraySlice$1(arguments);
	      var result = functionApply(WRONG_SYMBOLS_CONVERSION ? stringifyWithSymbolsFix : $stringify, null, args);
	      return ILL_FORMED_UNICODE && typeof result == 'string' ? replace$b(result, tester, fixIllFormed) : result;
	    }
	  });
	}

	// V8 ~ Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
	// https://bugs.chromium.org/p/v8/issues/detail?id=3443
	var FORCED$n = !symbolConstructorDetection || fails(function () { objectGetOwnPropertySymbols.f(1); });

	// `Object.getOwnPropertySymbols` method
	// https://tc39.es/ecma262/#sec-object.getownpropertysymbols
	_export({ target: 'Object', stat: true, forced: FORCED$n }, {
	  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
	    var $getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	    return $getOwnPropertySymbols ? $getOwnPropertySymbols(toObject(it)) : [];
	  }
	});

	var defineProperty$d = objectDefineProperty.f;


	var NativeSymbol = global_1.Symbol;
	var SymbolPrototype = NativeSymbol && NativeSymbol.prototype;

	if (descriptors && isCallable(NativeSymbol) && (!('description' in SymbolPrototype) ||
	  // Safari 12 bug
	  NativeSymbol().description !== undefined
	)) {
	  var EmptyStringDescriptionStore = {};
	  // wrap Symbol constructor for correct work with undefined description
	  var SymbolWrapper = function Symbol() {
	    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : toString_1(arguments[0]);
	    var result = objectIsPrototypeOf(SymbolPrototype, this)
	      ? new NativeSymbol(description)
	      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
	      : description === undefined ? NativeSymbol() : NativeSymbol(description);
	    if (description === '') { EmptyStringDescriptionStore[result] = true; }
	    return result;
	  };

	  copyConstructorProperties(SymbolWrapper, NativeSymbol);
	  SymbolWrapper.prototype = SymbolPrototype;
	  SymbolPrototype.constructor = SymbolWrapper;

	  var NATIVE_SYMBOL = String(NativeSymbol('test')) == 'Symbol(test)';
	  var thisSymbolValue = functionUncurryThis(SymbolPrototype.valueOf);
	  var symbolDescriptiveString = functionUncurryThis(SymbolPrototype.toString);
	  var regexp = /^Symbol\((.*)\)[^)]+$/;
	  var replace$a = functionUncurryThis(''.replace);
	  var stringSlice$g = functionUncurryThis(''.slice);

	  defineProperty$d(SymbolPrototype, 'description', {
	    configurable: true,
	    get: function description() {
	      var symbol = thisSymbolValue(this);
	      if (hasOwnProperty_1(EmptyStringDescriptionStore, symbol)) { return ''; }
	      var string = symbolDescriptiveString(symbol);
	      var desc = NATIVE_SYMBOL ? stringSlice$g(string, 7, -1) : replace$a(string, regexp, '$1');
	      return desc === '' ? undefined : desc;
	    }
	  });

	  _export({ global: true, constructor: true, forced: true }, {
	    Symbol: SymbolWrapper
	  });
	}

	// `Symbol.asyncIterator` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.asynciterator
	wellKnownSymbolDefine('asyncIterator');

	// `Symbol.hasInstance` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.hasinstance
	wellKnownSymbolDefine('hasInstance');

	// `Symbol.isConcatSpreadable` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.isconcatspreadable
	wellKnownSymbolDefine('isConcatSpreadable');

	// `Symbol.iterator` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.iterator
	wellKnownSymbolDefine('iterator');

	// `Symbol.match` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.match
	wellKnownSymbolDefine('match');

	// `Symbol.matchAll` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.matchall
	wellKnownSymbolDefine('matchAll');

	// `Symbol.replace` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.replace
	wellKnownSymbolDefine('replace');

	// `Symbol.search` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.search
	wellKnownSymbolDefine('search');

	// `Symbol.species` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.species
	wellKnownSymbolDefine('species');

	// `Symbol.split` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.split
	wellKnownSymbolDefine('split');

	// `Symbol.toPrimitive` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.toprimitive
	wellKnownSymbolDefine('toPrimitive');

	// `Symbol.prototype[@@toPrimitive]` method
	// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
	symbolDefineToPrimitive();

	// `Symbol.toStringTag` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.tostringtag
	wellKnownSymbolDefine('toStringTag');

	// `Symbol.prototype[@@toStringTag]` property
	// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
	setToStringTag(getBuiltIn('Symbol'), 'Symbol');

	// `Symbol.unscopables` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.unscopables
	wellKnownSymbolDefine('unscopables');

	var $String$2 = String;
	var $TypeError$u = TypeError;

	var aPossiblePrototype = function (argument) {
	  if (typeof argument == 'object' || isCallable(argument)) { return argument; }
	  throw $TypeError$u("Can't set " + $String$2(argument) + ' as a prototype');
	};

	/* eslint-disable no-proto -- safe */




	// `Object.setPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.
	// eslint-disable-next-line es/no-object-setprototypeof -- safe
	var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;
	  try {
	    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	    setter = functionUncurryThis(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set);
	    setter(test, []);
	    CORRECT_SETTER = test instanceof Array;
	  } catch (error) { /* empty */ }
	  return function setPrototypeOf(O, proto) {
	    anObject(O);
	    aPossiblePrototype(proto);
	    if (CORRECT_SETTER) { setter(O, proto); }
	    else { O.__proto__ = proto; }
	    return O;
	  };
	}() : undefined);

	var defineProperty$c = objectDefineProperty.f;

	var proxyAccessor = function (Target, Source, key) {
	  key in Target || defineProperty$c(Target, key, {
	    configurable: true,
	    get: function () { return Source[key]; },
	    set: function (it) { Source[key] = it; }
	  });
	};

	// makes subclassing work correct for wrapped built-ins
	var inheritIfRequired = function ($this, dummy, Wrapper) {
	  var NewTarget, NewTargetPrototype;
	  if (
	    // it can work only with native `setPrototypeOf`
	    objectSetPrototypeOf &&
	    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
	    isCallable(NewTarget = dummy.constructor) &&
	    NewTarget !== Wrapper &&
	    isObject(NewTargetPrototype = NewTarget.prototype) &&
	    NewTargetPrototype !== Wrapper.prototype
	  ) { objectSetPrototypeOf($this, NewTargetPrototype); }
	  return $this;
	};

	var normalizeStringArgument = function (argument, $default) {
	  return argument === undefined ? arguments.length < 2 ? '' : $default : toString_1(argument);
	};

	// `InstallErrorCause` abstract operation
	// https://tc39.es/proposal-error-cause/#sec-errorobjects-install-error-cause
	var installErrorCause = function (O, options) {
	  if (isObject(options) && 'cause' in options) {
	    createNonEnumerableProperty(O, 'cause', options.cause);
	  }
	};

	var $Error$1 = Error;
	var replace$9 = functionUncurryThis(''.replace);

	var TEST = (function (arg) { return String($Error$1(arg).stack); })('zxcasd');
	var V8_OR_CHAKRA_STACK_ENTRY = /\n\s*at [^:]*:[^\n]*/;
	var IS_V8_OR_CHAKRA_STACK = V8_OR_CHAKRA_STACK_ENTRY.test(TEST);

	var errorStackClear = function (stack, dropEntries) {
	  if (IS_V8_OR_CHAKRA_STACK && typeof stack == 'string' && !$Error$1.prepareStackTrace) {
	    while (dropEntries--) { stack = replace$9(stack, V8_OR_CHAKRA_STACK_ENTRY, ''); }
	  } return stack;
	};

	var errorStackInstallable = !fails(function () {
	  var error = Error('a');
	  if (!('stack' in error)) { return true; }
	  // eslint-disable-next-line es/no-object-defineproperty -- safe
	  Object.defineProperty(error, 'stack', createPropertyDescriptor(1, 7));
	  return error.stack !== 7;
	});

	var wrapErrorConstructorWithCause = function (FULL_NAME, wrapper, FORCED, IS_AGGREGATE_ERROR) {
	  var STACK_TRACE_LIMIT = 'stackTraceLimit';
	  var OPTIONS_POSITION = IS_AGGREGATE_ERROR ? 2 : 1;
	  var path = FULL_NAME.split('.');
	  var ERROR_NAME = path[path.length - 1];
	  var OriginalError = getBuiltIn.apply(null, path);

	  if (!OriginalError) { return; }

	  var OriginalErrorPrototype = OriginalError.prototype;

	  // V8 9.3- bug https://bugs.chromium.org/p/v8/issues/detail?id=12006
	  if (hasOwnProperty_1(OriginalErrorPrototype, 'cause')) { delete OriginalErrorPrototype.cause; }

	  if (!FORCED) { return OriginalError; }

	  var BaseError = getBuiltIn('Error');

	  var WrappedError = wrapper(function (a, b) {
	    var message = normalizeStringArgument(IS_AGGREGATE_ERROR ? b : a, undefined);
	    var result = IS_AGGREGATE_ERROR ? new OriginalError(a) : new OriginalError();
	    if (message !== undefined) { createNonEnumerableProperty(result, 'message', message); }
	    if (errorStackInstallable) { createNonEnumerableProperty(result, 'stack', errorStackClear(result.stack, 2)); }
	    if (this && objectIsPrototypeOf(OriginalErrorPrototype, this)) { inheritIfRequired(result, this, WrappedError); }
	    if (arguments.length > OPTIONS_POSITION) { installErrorCause(result, arguments[OPTIONS_POSITION]); }
	    return result;
	  });

	  WrappedError.prototype = OriginalErrorPrototype;

	  if (ERROR_NAME !== 'Error') {
	    if (objectSetPrototypeOf) { objectSetPrototypeOf(WrappedError, BaseError); }
	    else { copyConstructorProperties(WrappedError, BaseError, { name: true }); }
	  } else if (descriptors && STACK_TRACE_LIMIT in OriginalError) {
	    proxyAccessor(WrappedError, OriginalError, STACK_TRACE_LIMIT);
	    proxyAccessor(WrappedError, OriginalError, 'prepareStackTrace');
	  }

	  copyConstructorProperties(WrappedError, OriginalError);

	  { try {
	    // Safari 13- bug: WebAssembly errors does not have a proper `.name`
	    if (OriginalErrorPrototype.name !== ERROR_NAME) {
	      createNonEnumerableProperty(OriginalErrorPrototype, 'name', ERROR_NAME);
	    }
	    OriginalErrorPrototype.constructor = WrappedError;
	  } catch (error) { /* empty */ } }

	  return WrappedError;
	};

	/* eslint-disable no-unused-vars -- required for functions `.length` */





	var WEB_ASSEMBLY = 'WebAssembly';
	var WebAssembly$1 = global_1[WEB_ASSEMBLY];

	var FORCED$m = Error('e', { cause: 7 }).cause !== 7;

	var exportGlobalErrorCauseWrapper = function (ERROR_NAME, wrapper) {
	  var O = {};
	  O[ERROR_NAME] = wrapErrorConstructorWithCause(ERROR_NAME, wrapper, FORCED$m);
	  _export({ global: true, constructor: true, arity: 1, forced: FORCED$m }, O);
	};

	var exportWebAssemblyErrorCauseWrapper = function (ERROR_NAME, wrapper) {
	  if (WebAssembly$1 && WebAssembly$1[ERROR_NAME]) {
	    var O = {};
	    O[ERROR_NAME] = wrapErrorConstructorWithCause(WEB_ASSEMBLY + '.' + ERROR_NAME, wrapper, FORCED$m);
	    _export({ target: WEB_ASSEMBLY, stat: true, constructor: true, arity: 1, forced: FORCED$m }, O);
	  }
	};

	// https://github.com/tc39/proposal-error-cause
	exportGlobalErrorCauseWrapper('Error', function (init) {
	  return function Error(message) { return functionApply(init, this, arguments); };
	});
	exportGlobalErrorCauseWrapper('EvalError', function (init) {
	  return function EvalError(message) { return functionApply(init, this, arguments); };
	});
	exportGlobalErrorCauseWrapper('RangeError', function (init) {
	  return function RangeError(message) { return functionApply(init, this, arguments); };
	});
	exportGlobalErrorCauseWrapper('ReferenceError', function (init) {
	  return function ReferenceError(message) { return functionApply(init, this, arguments); };
	});
	exportGlobalErrorCauseWrapper('SyntaxError', function (init) {
	  return function SyntaxError(message) { return functionApply(init, this, arguments); };
	});
	exportGlobalErrorCauseWrapper('TypeError', function (init) {
	  return function TypeError(message) { return functionApply(init, this, arguments); };
	});
	exportGlobalErrorCauseWrapper('URIError', function (init) {
	  return function URIError(message) { return functionApply(init, this, arguments); };
	});
	exportWebAssemblyErrorCauseWrapper('CompileError', function (init) {
	  return function CompileError(message) { return functionApply(init, this, arguments); };
	});
	exportWebAssemblyErrorCauseWrapper('LinkError', function (init) {
	  return function LinkError(message) { return functionApply(init, this, arguments); };
	});
	exportWebAssemblyErrorCauseWrapper('RuntimeError', function (init) {
	  return function RuntimeError(message) { return functionApply(init, this, arguments); };
	});

	var nativeErrorToString = Error.prototype.toString;

	var INCORRECT_TO_STRING$1 = fails(function () {
	  if (descriptors) {
	    // Chrome 32- incorrectly call accessor
	    // eslint-disable-next-line es/no-object-defineproperty -- safe
	    var object = objectCreate(Object.defineProperty({}, 'name', { get: function () {
	      return this === object;
	    } }));
	    if (nativeErrorToString.call(object) !== 'true') { return true; }
	  }
	  // FF10- does not properly handle non-strings
	  return nativeErrorToString.call({ message: 1, name: 2 }) !== '2: 1'
	    // IE8 does not properly handle defaults
	    || nativeErrorToString.call({}) !== 'Error';
	});

	var errorToString = INCORRECT_TO_STRING$1 ? function toString() {
	  var O = anObject(this);
	  var name = normalizeStringArgument(O.name, 'Error');
	  var message = normalizeStringArgument(O.message);
	  return !name ? message : !message ? name : name + ': ' + message;
	} : nativeErrorToString;

	var ErrorPrototype$1 = Error.prototype;

	// `Error.prototype.toString` method fix
	// https://tc39.es/ecma262/#sec-error.prototype.tostring
	if (ErrorPrototype$1.toString !== errorToString) {
	  defineBuiltIn(ErrorPrototype$1, 'toString', errorToString);
	}

	var correctPrototypeGetter = !fails(function () {
	  function F() { /* empty */ }
	  F.prototype.constructor = null;
	  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var IE_PROTO = sharedKey('IE_PROTO');
	var $Object$2 = Object;
	var ObjectPrototype$4 = $Object$2.prototype;

	// `Object.getPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.getprototypeof
	// eslint-disable-next-line es/no-object-getprototypeof -- safe
	var objectGetPrototypeOf = correctPrototypeGetter ? $Object$2.getPrototypeOf : function (O) {
	  var object = toObject(O);
	  if (hasOwnProperty_1(object, IE_PROTO)) { return object[IE_PROTO]; }
	  var constructor = object.constructor;
	  if (isCallable(constructor) && object instanceof constructor) {
	    return constructor.prototype;
	  } return object instanceof $Object$2 ? ObjectPrototype$4 : null;
	};

	var iterators = {};

	var ITERATOR$a = wellKnownSymbol('iterator');
	var ArrayPrototype$2 = Array.prototype;

	// check on default Array iterator
	var isArrayIteratorMethod = function (it) {
	  return it !== undefined && (iterators.Array === it || ArrayPrototype$2[ITERATOR$a] === it);
	};

	var ITERATOR$9 = wellKnownSymbol('iterator');

	var getIteratorMethod = function (it) {
	  if (!isNullOrUndefined(it)) { return getMethod(it, ITERATOR$9)
	    || getMethod(it, '@@iterator')
	    || iterators[classof(it)]; }
	};

	var $TypeError$t = TypeError;

	var getIterator = function (argument, usingIterator) {
	  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
	  if (aCallable(iteratorMethod)) { return anObject(functionCall(iteratorMethod, argument)); }
	  throw $TypeError$t(tryToString(argument) + ' is not iterable');
	};

	var iteratorClose = function (iterator, kind, value) {
	  var innerResult, innerError;
	  anObject(iterator);
	  try {
	    innerResult = getMethod(iterator, 'return');
	    if (!innerResult) {
	      if (kind === 'throw') { throw value; }
	      return value;
	    }
	    innerResult = functionCall(innerResult, iterator);
	  } catch (error) {
	    innerError = true;
	    innerResult = error;
	  }
	  if (kind === 'throw') { throw value; }
	  if (innerError) { throw innerResult; }
	  anObject(innerResult);
	  return value;
	};

	var $TypeError$s = TypeError;

	var Result = function (stopped, result) {
	  this.stopped = stopped;
	  this.result = result;
	};

	var ResultPrototype = Result.prototype;

	var iterate = function (iterable, unboundFunction, options) {
	  var that = options && options.that;
	  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
	  var IS_RECORD = !!(options && options.IS_RECORD);
	  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
	  var INTERRUPTED = !!(options && options.INTERRUPTED);
	  var fn = functionBindContext(unboundFunction, that);
	  var iterator, iterFn, index, length, result, next, step;

	  var stop = function (condition) {
	    if (iterator) { iteratorClose(iterator, 'normal', condition); }
	    return new Result(true, condition);
	  };

	  var callFn = function (value) {
	    if (AS_ENTRIES) {
	      anObject(value);
	      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
	    } return INTERRUPTED ? fn(value, stop) : fn(value);
	  };

	  if (IS_RECORD) {
	    iterator = iterable.iterator;
	  } else if (IS_ITERATOR) {
	    iterator = iterable;
	  } else {
	    iterFn = getIteratorMethod(iterable);
	    if (!iterFn) { throw $TypeError$s(tryToString(iterable) + ' is not iterable'); }
	    // optimisation for array iterators
	    if (isArrayIteratorMethod(iterFn)) {
	      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
	        result = callFn(iterable[index]);
	        if (result && objectIsPrototypeOf(ResultPrototype, result)) { return result; }
	      } return new Result(false);
	    }
	    iterator = getIterator(iterable, iterFn);
	  }

	  next = IS_RECORD ? iterable.next : iterator.next;
	  while (!(step = functionCall(next, iterator)).done) {
	    try {
	      result = callFn(step.value);
	    } catch (error) {
	      iteratorClose(iterator, 'throw', error);
	    }
	    if (typeof result == 'object' && result && objectIsPrototypeOf(ResultPrototype, result)) { return result; }
	  } return new Result(false);
	};

	var TO_STRING_TAG$6 = wellKnownSymbol('toStringTag');
	var $Error = Error;
	var push$j = [].push;

	var $AggregateError$1 = function AggregateError(errors, message /* , options */) {
	  var options = arguments.length > 2 ? arguments[2] : undefined;
	  var isInstance = objectIsPrototypeOf(AggregateErrorPrototype, this);
	  var that;
	  if (objectSetPrototypeOf) {
	    that = objectSetPrototypeOf($Error(), isInstance ? objectGetPrototypeOf(this) : AggregateErrorPrototype);
	  } else {
	    that = isInstance ? this : objectCreate(AggregateErrorPrototype);
	    createNonEnumerableProperty(that, TO_STRING_TAG$6, 'Error');
	  }
	  if (message !== undefined) { createNonEnumerableProperty(that, 'message', normalizeStringArgument(message)); }
	  if (errorStackInstallable) { createNonEnumerableProperty(that, 'stack', errorStackClear(that.stack, 1)); }
	  installErrorCause(that, options);
	  var errorsArray = [];
	  iterate(errors, push$j, { that: errorsArray });
	  createNonEnumerableProperty(that, 'errors', errorsArray);
	  return that;
	};

	if (objectSetPrototypeOf) { objectSetPrototypeOf($AggregateError$1, $Error); }
	else { copyConstructorProperties($AggregateError$1, $Error, { name: true }); }

	var AggregateErrorPrototype = $AggregateError$1.prototype = objectCreate($Error.prototype, {
	  constructor: createPropertyDescriptor(1, $AggregateError$1),
	  message: createPropertyDescriptor(1, ''),
	  name: createPropertyDescriptor(1, 'AggregateError')
	});

	// `AggregateError` constructor
	// https://tc39.es/ecma262/#sec-aggregate-error-constructor
	_export({ global: true, constructor: true, arity: 2 }, {
	  AggregateError: $AggregateError$1
	});

	var AGGREGATE_ERROR = 'AggregateError';
	var $AggregateError = getBuiltIn(AGGREGATE_ERROR);

	var FORCED$l = !fails(function () {
	  return $AggregateError([1]).errors[0] !== 1;
	}) && fails(function () {
	  return $AggregateError([1], AGGREGATE_ERROR, { cause: 7 }).cause !== 7;
	});

	// https://github.com/tc39/proposal-error-cause
	_export({ global: true, constructor: true, arity: 2, forced: FORCED$l }, {
	  AggregateError: wrapErrorConstructorWithCause(AGGREGATE_ERROR, function (init) {
	    // eslint-disable-next-line no-unused-vars -- required for functions `.length`
	    return function AggregateError(errors, message) { return functionApply(init, this, arguments); };
	  }, FORCED$l, true)
	});

	var defineProperty$b = objectDefineProperty.f;

	var UNSCOPABLES = wellKnownSymbol('unscopables');
	var ArrayPrototype$1 = Array.prototype;

	// Array.prototype[@@unscopables]
	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	if (ArrayPrototype$1[UNSCOPABLES] == undefined) {
	  defineProperty$b(ArrayPrototype$1, UNSCOPABLES, {
	    configurable: true,
	    value: objectCreate(null)
	  });
	}

	// add a key to Array.prototype[@@unscopables]
	var addToUnscopables = function (key) {
	  ArrayPrototype$1[UNSCOPABLES][key] = true;
	};

	// `Array.prototype.at` method
	// https://github.com/tc39/proposal-relative-indexing-method
	_export({ target: 'Array', proto: true }, {
	  at: function at(index) {
	    var O = toObject(this);
	    var len = lengthOfArrayLike(O);
	    var relativeIndex = toIntegerOrInfinity(index);
	    var k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
	    return (k < 0 || k >= len) ? undefined : O[k];
	  }
	});

	addToUnscopables('at');

	var $TypeError$r = TypeError;
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

	var doesNotExceedSafeInteger = function (it) {
	  if (it > MAX_SAFE_INTEGER) { throw $TypeError$r('Maximum allowed index exceeded'); }
	  return it;
	};

	var SPECIES$5 = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return engineV8Version >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};
	    constructor[SPECIES$5] = function () {
	      return { foo: 1 };
	    };
	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');

	// We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679
	var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});

	var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

	var isConcatSpreadable = function (O) {
	  if (!isObject(O)) { return false; }
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray(O);
	};

	var FORCED$k = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

	// `Array.prototype.concat` method
	// https://tc39.es/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species
	_export({ target: 'Array', proto: true, arity: 1, forced: FORCED$k }, {
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  concat: function concat(arg) {
	    var arguments$1 = arguments;

	    var O = toObject(this);
	    var A = arraySpeciesCreate(O, 0);
	    var n = 0;
	    var i, k, length, len, E;
	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments$1[i];
	      if (isConcatSpreadable(E)) {
	        len = lengthOfArrayLike(E);
	        doesNotExceedSafeInteger(n + len);
	        for (k = 0; k < len; k++, n++) { if (k in E) { createProperty(A, n, E[k]); } }
	      } else {
	        doesNotExceedSafeInteger(n + 1);
	        createProperty(A, n++, E);
	      }
	    }
	    A.length = n;
	    return A;
	  }
	});

	var $TypeError$q = TypeError;

	var deletePropertyOrThrow = function (O, P) {
	  if (!delete O[P]) { throw $TypeError$q('Cannot delete property ' + tryToString(P) + ' of ' + tryToString(O)); }
	};

	var min$a = Math.min;

	// `Array.prototype.copyWithin` method implementation
	// https://tc39.es/ecma262/#sec-array.prototype.copywithin
	// eslint-disable-next-line es/no-array-prototype-copywithin -- safe
	var arrayCopyWithin = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
	  var O = toObject(this);
	  var len = lengthOfArrayLike(O);
	  var to = toAbsoluteIndex(target, len);
	  var from = toAbsoluteIndex(start, len);
	  var end = arguments.length > 2 ? arguments[2] : undefined;
	  var count = min$a((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
	  var inc = 1;
	  if (from < to && to < from + count) {
	    inc = -1;
	    from += count - 1;
	    to += count - 1;
	  }
	  while (count-- > 0) {
	    if (from in O) { O[to] = O[from]; }
	    else { deletePropertyOrThrow(O, to); }
	    to += inc;
	    from += inc;
	  } return O;
	};

	// `Array.prototype.copyWithin` method
	// https://tc39.es/ecma262/#sec-array.prototype.copywithin
	_export({ target: 'Array', proto: true }, {
	  copyWithin: arrayCopyWithin
	});

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('copyWithin');

	var arrayMethodIsStrict = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails(function () {
	    // eslint-disable-next-line no-useless-call -- required for testing
	    method.call(null, argument || function () { return 1; }, 1);
	  });
	};

	var $every$2 = arrayIteration.every;


	var STRICT_METHOD$8 = arrayMethodIsStrict('every');

	// `Array.prototype.every` method
	// https://tc39.es/ecma262/#sec-array.prototype.every
	_export({ target: 'Array', proto: true, forced: !STRICT_METHOD$8 }, {
	  every: function every(callbackfn /* , thisArg */) {
	    return $every$2(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// `Array.prototype.fill` method implementation
	// https://tc39.es/ecma262/#sec-array.prototype.fill
	var arrayFill = function fill(value /* , start = 0, end = @length */) {
	  var O = toObject(this);
	  var length = lengthOfArrayLike(O);
	  var argumentsLength = arguments.length;
	  var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
	  var end = argumentsLength > 2 ? arguments[2] : undefined;
	  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
	  while (endPos > index) { O[index++] = value; }
	  return O;
	};

	// `Array.prototype.fill` method
	// https://tc39.es/ecma262/#sec-array.prototype.fill
	_export({ target: 'Array', proto: true }, {
	  fill: arrayFill
	});

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('fill');

	var $filter$1 = arrayIteration.filter;


	var HAS_SPECIES_SUPPORT$3 = arrayMethodHasSpeciesSupport('filter');

	// `Array.prototype.filter` method
	// https://tc39.es/ecma262/#sec-array.prototype.filter
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$3 }, {
	  filter: function filter(callbackfn /* , thisArg */) {
	    return $filter$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var $find$2 = arrayIteration.find;


	var FIND = 'find';
	var SKIPS_HOLES$1 = true;

	// Shouldn't skip holes
	if (FIND in []) { Array(1)[FIND](function () { SKIPS_HOLES$1 = false; }); }

	// `Array.prototype.find` method
	// https://tc39.es/ecma262/#sec-array.prototype.find
	_export({ target: 'Array', proto: true, forced: SKIPS_HOLES$1 }, {
	  find: function find(callbackfn /* , that = undefined */) {
	    return $find$2(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables(FIND);

	var $findIndex$1 = arrayIteration.findIndex;


	var FIND_INDEX = 'findIndex';
	var SKIPS_HOLES = true;

	// Shouldn't skip holes
	if (FIND_INDEX in []) { Array(1)[FIND_INDEX](function () { SKIPS_HOLES = false; }); }

	// `Array.prototype.findIndex` method
	// https://tc39.es/ecma262/#sec-array.prototype.findindex
	_export({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
	  findIndex: function findIndex(callbackfn /* , that = undefined */) {
	    return $findIndex$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables(FIND_INDEX);

	// `Array.prototype.{ findLast, findLastIndex }` methods implementation
	var createMethod$6 = function (TYPE) {
	  var IS_FIND_LAST_INDEX = TYPE == 1;
	  return function ($this, callbackfn, that) {
	    var O = toObject($this);
	    var self = indexedObject(O);
	    var boundFunction = functionBindContext(callbackfn, that);
	    var index = lengthOfArrayLike(self);
	    var value, result;
	    while (index-- > 0) {
	      value = self[index];
	      result = boundFunction(value, index, O);
	      if (result) { switch (TYPE) {
	        case 0: return value; // findLast
	        case 1: return index; // findLastIndex
	      } }
	    }
	    return IS_FIND_LAST_INDEX ? -1 : undefined;
	  };
	};

	var arrayIterationFromLast = {
	  // `Array.prototype.findLast` method
	  // https://github.com/tc39/proposal-array-find-from-last
	  findLast: createMethod$6(0),
	  // `Array.prototype.findLastIndex` method
	  // https://github.com/tc39/proposal-array-find-from-last
	  findLastIndex: createMethod$6(1)
	};

	var $findLast$1 = arrayIterationFromLast.findLast;


	// `Array.prototype.findLast` method
	// https://github.com/tc39/proposal-array-find-from-last
	_export({ target: 'Array', proto: true }, {
	  findLast: function findLast(callbackfn /* , that = undefined */) {
	    return $findLast$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	addToUnscopables('findLast');

	var $findLastIndex$1 = arrayIterationFromLast.findLastIndex;


	// `Array.prototype.findLastIndex` method
	// https://github.com/tc39/proposal-array-find-from-last
	_export({ target: 'Array', proto: true }, {
	  findLastIndex: function findLastIndex(callbackfn /* , that = undefined */) {
	    return $findLastIndex$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	addToUnscopables('findLastIndex');

	// `FlattenIntoArray` abstract operation
	// https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
	var flattenIntoArray = function (target, original, source, sourceLen, start, depth, mapper, thisArg) {
	  var targetIndex = start;
	  var sourceIndex = 0;
	  var mapFn = mapper ? functionBindContext(mapper, thisArg) : false;
	  var element, elementLen;

	  while (sourceIndex < sourceLen) {
	    if (sourceIndex in source) {
	      element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

	      if (depth > 0 && isArray(element)) {
	        elementLen = lengthOfArrayLike(element);
	        targetIndex = flattenIntoArray(target, original, element, elementLen, targetIndex, depth - 1) - 1;
	      } else {
	        doesNotExceedSafeInteger(targetIndex + 1);
	        target[targetIndex] = element;
	      }

	      targetIndex++;
	    }
	    sourceIndex++;
	  }
	  return targetIndex;
	};

	var flattenIntoArray_1 = flattenIntoArray;

	// `Array.prototype.flat` method
	// https://tc39.es/ecma262/#sec-array.prototype.flat
	_export({ target: 'Array', proto: true }, {
	  flat: function flat(/* depthArg = 1 */) {
	    var depthArg = arguments.length ? arguments[0] : undefined;
	    var O = toObject(this);
	    var sourceLen = lengthOfArrayLike(O);
	    var A = arraySpeciesCreate(O, 0);
	    A.length = flattenIntoArray_1(A, O, O, sourceLen, 0, depthArg === undefined ? 1 : toIntegerOrInfinity(depthArg));
	    return A;
	  }
	});

	// `Array.prototype.flatMap` method
	// https://tc39.es/ecma262/#sec-array.prototype.flatmap
	_export({ target: 'Array', proto: true }, {
	  flatMap: function flatMap(callbackfn /* , thisArg */) {
	    var O = toObject(this);
	    var sourceLen = lengthOfArrayLike(O);
	    var A;
	    aCallable(callbackfn);
	    A = arraySpeciesCreate(O, 0);
	    A.length = flattenIntoArray_1(A, O, O, sourceLen, 0, 1, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    return A;
	  }
	});

	var $forEach$2 = arrayIteration.forEach;


	var STRICT_METHOD$7 = arrayMethodIsStrict('forEach');

	// `Array.prototype.forEach` method implementation
	// https://tc39.es/ecma262/#sec-array.prototype.foreach
	var arrayForEach = !STRICT_METHOD$7 ? function forEach(callbackfn /* , thisArg */) {
	  return $forEach$2(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	// eslint-disable-next-line es/no-array-prototype-foreach -- safe
	} : [].forEach;

	// `Array.prototype.forEach` method
	// https://tc39.es/ecma262/#sec-array.prototype.foreach
	// eslint-disable-next-line es/no-array-prototype-foreach -- safe
	_export({ target: 'Array', proto: true, forced: [].forEach != arrayForEach }, {
	  forEach: arrayForEach
	});

	// call something on iterator step with safe closing on error
	var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
	  try {
	    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
	  } catch (error) {
	    iteratorClose(iterator, 'throw', error);
	  }
	};

	var $Array$9 = Array;

	// `Array.from` method implementation
	// https://tc39.es/ecma262/#sec-array.from
	var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
	  var O = toObject(arrayLike);
	  var IS_CONSTRUCTOR = isConstructor(this);
	  var argumentsLength = arguments.length;
	  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
	  var mapping = mapfn !== undefined;
	  if (mapping) { mapfn = functionBindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined); }
	  var iteratorMethod = getIteratorMethod(O);
	  var index = 0;
	  var length, result, step, iterator, next, value;
	  // if the target is not iterable or it's an array with the default iterator - use a simple case
	  if (iteratorMethod && !(this === $Array$9 && isArrayIteratorMethod(iteratorMethod))) {
	    iterator = getIterator(O, iteratorMethod);
	    next = iterator.next;
	    result = IS_CONSTRUCTOR ? new this() : [];
	    for (;!(step = functionCall(next, iterator)).done; index++) {
	      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
	      createProperty(result, index, value);
	    }
	  } else {
	    length = lengthOfArrayLike(O);
	    result = IS_CONSTRUCTOR ? new this(length) : $Array$9(length);
	    for (;length > index; index++) {
	      value = mapping ? mapfn(O[index], index) : O[index];
	      createProperty(result, index, value);
	    }
	  }
	  result.length = index;
	  return result;
	};

	var ITERATOR$8 = wellKnownSymbol('iterator');
	var SAFE_CLOSING = false;

	try {
	  var called = 0;
	  var iteratorWithReturn = {
	    next: function () {
	      return { done: !!called++ };
	    },
	    'return': function () {
	      SAFE_CLOSING = true;
	    }
	  };
	  iteratorWithReturn[ITERATOR$8] = function () {
	    return this;
	  };
	  // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
	  Array.from(iteratorWithReturn, function () { throw 2; });
	} catch (error) { /* empty */ }

	var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
	  if (!SKIP_CLOSING && !SAFE_CLOSING) { return false; }
	  var ITERATION_SUPPORT = false;
	  try {
	    var object = {};
	    object[ITERATOR$8] = function () {
	      return {
	        next: function () {
	          return { done: ITERATION_SUPPORT = true };
	        }
	      };
	    };
	    exec(object);
	  } catch (error) { /* empty */ }
	  return ITERATION_SUPPORT;
	};

	var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
	  // eslint-disable-next-line es/no-array-from -- required for testing
	  Array.from(iterable);
	});

	// `Array.from` method
	// https://tc39.es/ecma262/#sec-array.from
	_export({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
	  from: arrayFrom
	});

	var $includes$1 = arrayIncludes.includes;



	// FF99+ bug
	var BROKEN_ON_SPARSE = fails(function () {
	  return !Array(1).includes();
	});

	// `Array.prototype.includes` method
	// https://tc39.es/ecma262/#sec-array.prototype.includes
	_export({ target: 'Array', proto: true, forced: BROKEN_ON_SPARSE }, {
	  includes: function includes(el /* , fromIndex = 0 */) {
	    return $includes$1(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('includes');

	/* eslint-disable es/no-array-prototype-indexof -- required for testing */


	var $indexOf$1 = arrayIncludes.indexOf;


	var nativeIndexOf = functionUncurryThis([].indexOf);

	var NEGATIVE_ZERO$1 = !!nativeIndexOf && 1 / nativeIndexOf([1], 1, -0) < 0;
	var STRICT_METHOD$6 = arrayMethodIsStrict('indexOf');

	// `Array.prototype.indexOf` method
	// https://tc39.es/ecma262/#sec-array.prototype.indexof
	_export({ target: 'Array', proto: true, forced: NEGATIVE_ZERO$1 || !STRICT_METHOD$6 }, {
	  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
	    var fromIndex = arguments.length > 1 ? arguments[1] : undefined;
	    return NEGATIVE_ZERO$1
	      // convert -0 to +0
	      ? nativeIndexOf(this, searchElement, fromIndex) || 0
	      : $indexOf$1(this, searchElement, fromIndex);
	  }
	});

	// `Array.isArray` method
	// https://tc39.es/ecma262/#sec-array.isarray
	_export({ target: 'Array', stat: true }, {
	  isArray: isArray
	});

	var ITERATOR$7 = wellKnownSymbol('iterator');
	var BUGGY_SAFARI_ITERATORS$1 = false;

	// `%IteratorPrototype%` object
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
	var IteratorPrototype$5, PrototypeOfArrayIteratorPrototype, arrayIterator$1;

	/* eslint-disable es/no-array-prototype-keys -- safe */
	if ([].keys) {
	  arrayIterator$1 = [].keys();
	  // Safari 8 has buggy iterators w/o `next`
	  if (!('next' in arrayIterator$1)) { BUGGY_SAFARI_ITERATORS$1 = true; }
	  else {
	    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator$1));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) { IteratorPrototype$5 = PrototypeOfArrayIteratorPrototype; }
	  }
	}

	var NEW_ITERATOR_PROTOTYPE = !isObject(IteratorPrototype$5) || fails(function () {
	  var test = {};
	  // FF44- legacy iterators case
	  return IteratorPrototype$5[ITERATOR$7].call(test) !== test;
	});

	if (NEW_ITERATOR_PROTOTYPE) { IteratorPrototype$5 = {}; }

	// `%IteratorPrototype%[@@iterator]()` method
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
	if (!isCallable(IteratorPrototype$5[ITERATOR$7])) {
	  defineBuiltIn(IteratorPrototype$5, ITERATOR$7, function () {
	    return this;
	  });
	}

	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype$5,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1
	};

	var IteratorPrototype$4 = iteratorsCore.IteratorPrototype;





	var returnThis$1 = function () { return this; };

	var iteratorCreateConstructor = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
	  var TO_STRING_TAG = NAME + ' Iterator';
	  IteratorConstructor.prototype = objectCreate(IteratorPrototype$4, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
	  setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
	  iterators[TO_STRING_TAG] = returnThis$1;
	  return IteratorConstructor;
	};

	var PROPER_FUNCTION_NAME$3 = functionName.PROPER;
	var CONFIGURABLE_FUNCTION_NAME$1 = functionName.CONFIGURABLE;
	var IteratorPrototype$3 = iteratorsCore.IteratorPrototype;
	var BUGGY_SAFARI_ITERATORS = iteratorsCore.BUGGY_SAFARI_ITERATORS;
	var ITERATOR$6 = wellKnownSymbol('iterator');
	var KEYS = 'keys';
	var VALUES = 'values';
	var ENTRIES = 'entries';

	var returnThis = function () { return this; };

	var iteratorDefine = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
	  iteratorCreateConstructor(IteratorConstructor, NAME, next);

	  var getIterationMethod = function (KIND) {
	    if (KIND === DEFAULT && defaultIterator) { return defaultIterator; }
	    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) { return IterablePrototype[KIND]; }
	    switch (KIND) {
	      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
	      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
	      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
	    } return function () { return new IteratorConstructor(this); };
	  };

	  var TO_STRING_TAG = NAME + ' Iterator';
	  var INCORRECT_VALUES_NAME = false;
	  var IterablePrototype = Iterable.prototype;
	  var nativeIterator = IterablePrototype[ITERATOR$6]
	    || IterablePrototype['@@iterator']
	    || DEFAULT && IterablePrototype[DEFAULT];
	  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
	  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
	  var CurrentIteratorPrototype, methods, KEY;

	  // fix native
	  if (anyNativeIterator) {
	    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
	    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
	      if (objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$3) {
	        if (objectSetPrototypeOf) {
	          objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$3);
	        } else if (!isCallable(CurrentIteratorPrototype[ITERATOR$6])) {
	          defineBuiltIn(CurrentIteratorPrototype, ITERATOR$6, returnThis);
	        }
	      }
	      // Set @@toStringTag to native iterators
	      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
	    }
	  }

	  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
	  if (PROPER_FUNCTION_NAME$3 && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
	    if (CONFIGURABLE_FUNCTION_NAME$1) {
	      createNonEnumerableProperty(IterablePrototype, 'name', VALUES);
	    } else {
	      INCORRECT_VALUES_NAME = true;
	      defaultIterator = function values() { return functionCall(nativeIterator, this); };
	    }
	  }

	  // export additional methods
	  if (DEFAULT) {
	    methods = {
	      values: getIterationMethod(VALUES),
	      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
	      entries: getIterationMethod(ENTRIES)
	    };
	    if (FORCED) { for (KEY in methods) {
	      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
	        defineBuiltIn(IterablePrototype, KEY, methods[KEY]);
	      }
	    } } else { _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods); }
	  }

	  // define iterator
	  if (IterablePrototype[ITERATOR$6] !== defaultIterator) {
	    defineBuiltIn(IterablePrototype, ITERATOR$6, defaultIterator, { name: DEFAULT });
	  }
	  iterators[NAME] = defaultIterator;

	  return methods;
	};

	// `CreateIterResultObject` abstract operation
	// https://tc39.es/ecma262/#sec-createiterresultobject
	var createIterResultObject = function (value, done) {
	  return { value: value, done: done };
	};

	var defineProperty$a = objectDefineProperty.f;





	var ARRAY_ITERATOR = 'Array Iterator';
	var setInternalState$h = internalState.set;
	var getInternalState$d = internalState.getterFor(ARRAY_ITERATOR);

	// `Array.prototype.entries` method
	// https://tc39.es/ecma262/#sec-array.prototype.entries
	// `Array.prototype.keys` method
	// https://tc39.es/ecma262/#sec-array.prototype.keys
	// `Array.prototype.values` method
	// https://tc39.es/ecma262/#sec-array.prototype.values
	// `Array.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
	// `CreateArrayIterator` internal method
	// https://tc39.es/ecma262/#sec-createarrayiterator
	var es_array_iterator = iteratorDefine(Array, 'Array', function (iterated, kind) {
	  setInternalState$h(this, {
	    type: ARRAY_ITERATOR,
	    target: toIndexedObject(iterated), // target
	    index: 0,                          // next index
	    kind: kind                         // kind
	  });
	// `%ArrayIteratorPrototype%.next` method
	// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
	}, function () {
	  var state = getInternalState$d(this);
	  var target = state.target;
	  var kind = state.kind;
	  var index = state.index++;
	  if (!target || index >= target.length) {
	    state.target = undefined;
	    return createIterResultObject(undefined, true);
	  }
	  if (kind == 'keys') { return createIterResultObject(index, false); }
	  if (kind == 'values') { return createIterResultObject(target[index], false); }
	  return createIterResultObject([index, target[index]], false);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values%
	// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
	// https://tc39.es/ecma262/#sec-createmappedargumentsobject
	var values = iterators.Arguments = iterators.Array;

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

	// V8 ~ Chrome 45- bug
	if (descriptors && values.name !== 'values') { try {
	  defineProperty$a(values, 'name', { value: 'values' });
	} catch (error) { /* empty */ } }

	var nativeJoin = functionUncurryThis([].join);

	var ES3_STRINGS = indexedObject != Object;
	var STRICT_METHOD$5 = arrayMethodIsStrict('join', ',');

	// `Array.prototype.join` method
	// https://tc39.es/ecma262/#sec-array.prototype.join
	_export({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD$5 }, {
	  join: function join(separator) {
	    return nativeJoin(toIndexedObject(this), separator === undefined ? ',' : separator);
	  }
	});

	/* eslint-disable es/no-array-prototype-lastindexof -- safe */






	var min$9 = Math.min;
	var $lastIndexOf = [].lastIndexOf;
	var NEGATIVE_ZERO = !!$lastIndexOf && 1 / [1].lastIndexOf(1, -0) < 0;
	var STRICT_METHOD$4 = arrayMethodIsStrict('lastIndexOf');
	var FORCED$j = NEGATIVE_ZERO || !STRICT_METHOD$4;

	// `Array.prototype.lastIndexOf` method implementation
	// https://tc39.es/ecma262/#sec-array.prototype.lastindexof
	var arrayLastIndexOf = FORCED$j ? function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
	  // convert -0 to +0
	  if (NEGATIVE_ZERO) { return functionApply($lastIndexOf, this, arguments) || 0; }
	  var O = toIndexedObject(this);
	  var length = lengthOfArrayLike(O);
	  var index = length - 1;
	  if (arguments.length > 1) { index = min$9(index, toIntegerOrInfinity(arguments[1])); }
	  if (index < 0) { index = length + index; }
	  for (;index >= 0; index--) { if (index in O && O[index] === searchElement) { return index || 0; } }
	  return -1;
	} : $lastIndexOf;

	// `Array.prototype.lastIndexOf` method
	// https://tc39.es/ecma262/#sec-array.prototype.lastindexof
	// eslint-disable-next-line es/no-array-prototype-lastindexof -- required for testing
	_export({ target: 'Array', proto: true, forced: arrayLastIndexOf !== [].lastIndexOf }, {
	  lastIndexOf: arrayLastIndexOf
	});

	var $map$1 = arrayIteration.map;


	var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('map');

	// `Array.prototype.map` method
	// https://tc39.es/ecma262/#sec-array.prototype.map
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 }, {
	  map: function map(callbackfn /* , thisArg */) {
	    return $map$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var $Array$8 = Array;

	var ISNT_GENERIC = fails(function () {
	  function F() { /* empty */ }
	  // eslint-disable-next-line es/no-array-of -- safe
	  return !($Array$8.of.call(F) instanceof F);
	});

	// `Array.of` method
	// https://tc39.es/ecma262/#sec-array.of
	// WebKit Array.of isn't generic
	_export({ target: 'Array', stat: true, forced: ISNT_GENERIC }, {
	  of: function of(/* ...args */) {
	    var arguments$1 = arguments;

	    var index = 0;
	    var argumentsLength = arguments.length;
	    var result = new (isConstructor(this) ? this : $Array$8)(argumentsLength);
	    while (argumentsLength > index) { createProperty(result, index, arguments$1[index++]); }
	    result.length = argumentsLength;
	    return result;
	  }
	});

	var $TypeError$p = TypeError;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getOwnPropertyDescriptor$9 = Object.getOwnPropertyDescriptor;

	// Safari < 13 does not throw an error in this case
	var SILENT_ON_NON_WRITABLE_LENGTH_SET = descriptors && !function () {
	  // makes no sense without proper strict mode support
	  if (this !== undefined) { return true; }
	  try {
	    // eslint-disable-next-line es/no-object-defineproperty -- safe
	    Object.defineProperty([], 'length', { writable: false }).length = 1;
	  } catch (error) {
	    return error instanceof TypeError;
	  }
	}();

	var arraySetLength = SILENT_ON_NON_WRITABLE_LENGTH_SET ? function (O, length) {
	  if (isArray(O) && !getOwnPropertyDescriptor$9(O, 'length').writable) {
	    throw $TypeError$p('Cannot set read only .length');
	  } return O.length = length;
	} : function (O, length) {
	  return O.length = length;
	};

	var INCORRECT_TO_LENGTH = fails(function () {
	  return [].push.call({ length: 0x100000000 }, 1) !== 4294967297;
	});

	// V8 and Safari <= 15.4, FF < 23 throws InternalError
	// https://bugs.chromium.org/p/v8/issues/detail?id=12681
	var SILENT_ON_NON_WRITABLE_LENGTH$1 = !function () {
	  try {
	    // eslint-disable-next-line es/no-object-defineproperty -- safe
	    Object.defineProperty([], 'length', { writable: false }).push();
	  } catch (error) {
	    return error instanceof TypeError;
	  }
	}();

	// `Array.prototype.push` method
	// https://tc39.es/ecma262/#sec-array.prototype.push
	_export({ target: 'Array', proto: true, arity: 1, forced: INCORRECT_TO_LENGTH || SILENT_ON_NON_WRITABLE_LENGTH$1 }, {
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  push: function push(item) {
	    var arguments$1 = arguments;

	    var O = toObject(this);
	    var len = lengthOfArrayLike(O);
	    var argCount = arguments.length;
	    doesNotExceedSafeInteger(len + argCount);
	    for (var i = 0; i < argCount; i++) {
	      O[len] = arguments$1[i];
	      len++;
	    }
	    arraySetLength(O, len);
	    return len;
	  }
	});

	var $TypeError$o = TypeError;

	// `Array.prototype.{ reduce, reduceRight }` methods implementation
	var createMethod$5 = function (IS_RIGHT) {
	  return function (that, callbackfn, argumentsLength, memo) {
	    aCallable(callbackfn);
	    var O = toObject(that);
	    var self = indexedObject(O);
	    var length = lengthOfArrayLike(O);
	    var index = IS_RIGHT ? length - 1 : 0;
	    var i = IS_RIGHT ? -1 : 1;
	    if (argumentsLength < 2) { while (true) {
	      if (index in self) {
	        memo = self[index];
	        index += i;
	        break;
	      }
	      index += i;
	      if (IS_RIGHT ? index < 0 : length <= index) {
	        throw $TypeError$o('Reduce of empty array with no initial value');
	      }
	    } }
	    for (;IS_RIGHT ? index >= 0 : length > index; index += i) { if (index in self) {
	      memo = callbackfn(memo, self[index], index, O);
	    } }
	    return memo;
	  };
	};

	var arrayReduce = {
	  // `Array.prototype.reduce` method
	  // https://tc39.es/ecma262/#sec-array.prototype.reduce
	  left: createMethod$5(false),
	  // `Array.prototype.reduceRight` method
	  // https://tc39.es/ecma262/#sec-array.prototype.reduceright
	  right: createMethod$5(true)
	};

	var engineIsNode = classofRaw(global_1.process) == 'process';

	var $reduce$1 = arrayReduce.left;




	var STRICT_METHOD$3 = arrayMethodIsStrict('reduce');
	// Chrome 80-82 has a critical bug
	// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
	var CHROME_BUG$1 = !engineIsNode && engineV8Version > 79 && engineV8Version < 83;

	// `Array.prototype.reduce` method
	// https://tc39.es/ecma262/#sec-array.prototype.reduce
	_export({ target: 'Array', proto: true, forced: !STRICT_METHOD$3 || CHROME_BUG$1 }, {
	  reduce: function reduce(callbackfn /* , initialValue */) {
	    var length = arguments.length;
	    return $reduce$1(this, callbackfn, length, length > 1 ? arguments[1] : undefined);
	  }
	});

	var $reduceRight$1 = arrayReduce.right;




	var STRICT_METHOD$2 = arrayMethodIsStrict('reduceRight');
	// Chrome 80-82 has a critical bug
	// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
	var CHROME_BUG = !engineIsNode && engineV8Version > 79 && engineV8Version < 83;

	// `Array.prototype.reduceRight` method
	// https://tc39.es/ecma262/#sec-array.prototype.reduceright
	_export({ target: 'Array', proto: true, forced: !STRICT_METHOD$2 || CHROME_BUG }, {
	  reduceRight: function reduceRight(callbackfn /* , initialValue */) {
	    return $reduceRight$1(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var nativeReverse = functionUncurryThis([].reverse);
	var test$1 = [1, 2];

	// `Array.prototype.reverse` method
	// https://tc39.es/ecma262/#sec-array.prototype.reverse
	// fix for Safari 12.0 bug
	// https://bugs.webkit.org/show_bug.cgi?id=188794
	_export({ target: 'Array', proto: true, forced: String(test$1) === String(test$1.reverse()) }, {
	  reverse: function reverse() {
	    // eslint-disable-next-line no-self-assign -- dirty hack
	    if (isArray(this)) { this.length = this.length; }
	    return nativeReverse(this);
	  }
	});

	var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('slice');

	var SPECIES$4 = wellKnownSymbol('species');
	var $Array$7 = Array;
	var max$7 = Math.max;

	// `Array.prototype.slice` method
	// https://tc39.es/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 }, {
	  slice: function slice(start, end) {
	    var O = toIndexedObject(this);
	    var length = lengthOfArrayLike(O);
	    var k = toAbsoluteIndex(start, length);
	    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
	    var Constructor, result, n;
	    if (isArray(O)) {
	      Constructor = O.constructor;
	      // cross-realm fallback
	      if (isConstructor(Constructor) && (Constructor === $Array$7 || isArray(Constructor.prototype))) {
	        Constructor = undefined;
	      } else if (isObject(Constructor)) {
	        Constructor = Constructor[SPECIES$4];
	        if (Constructor === null) { Constructor = undefined; }
	      }
	      if (Constructor === $Array$7 || Constructor === undefined) {
	        return arraySlice$1(O, k, fin);
	      }
	    }
	    result = new (Constructor === undefined ? $Array$7 : Constructor)(max$7(fin - k, 0));
	    for (n = 0; k < fin; k++, n++) { if (k in O) { createProperty(result, n, O[k]); } }
	    result.length = n;
	    return result;
	  }
	});

	var $some$2 = arrayIteration.some;


	var STRICT_METHOD$1 = arrayMethodIsStrict('some');

	// `Array.prototype.some` method
	// https://tc39.es/ecma262/#sec-array.prototype.some
	_export({ target: 'Array', proto: true, forced: !STRICT_METHOD$1 }, {
	  some: function some(callbackfn /* , thisArg */) {
	    return $some$2(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var floor$9 = Math.floor;

	var mergeSort = function (array, comparefn) {
	  var length = array.length;
	  var middle = floor$9(length / 2);
	  return length < 8 ? insertionSort(array, comparefn) : merge(
	    array,
	    mergeSort(arraySliceSimple(array, 0, middle), comparefn),
	    mergeSort(arraySliceSimple(array, middle), comparefn),
	    comparefn
	  );
	};

	var insertionSort = function (array, comparefn) {
	  var length = array.length;
	  var i = 1;
	  var element, j;

	  while (i < length) {
	    j = i;
	    element = array[i];
	    while (j && comparefn(array[j - 1], element) > 0) {
	      array[j] = array[--j];
	    }
	    if (j !== i++) { array[j] = element; }
	  } return array;
	};

	var merge = function (array, left, right, comparefn) {
	  var llength = left.length;
	  var rlength = right.length;
	  var lindex = 0;
	  var rindex = 0;

	  while (lindex < llength || rindex < rlength) {
	    array[lindex + rindex] = (lindex < llength && rindex < rlength)
	      ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++]
	      : lindex < llength ? left[lindex++] : right[rindex++];
	  } return array;
	};

	var arraySort = mergeSort;

	var firefox = engineUserAgent.match(/firefox\/(\d+)/i);

	var engineFfVersion = !!firefox && +firefox[1];

	var engineIsIeOrEdge = /MSIE|Trident/.test(engineUserAgent);

	var webkit = engineUserAgent.match(/AppleWebKit\/(\d+)\./);

	var engineWebkitVersion = !!webkit && +webkit[1];

	var test = [];
	var nativeSort$1 = functionUncurryThis(test.sort);
	var push$i = functionUncurryThis(test.push);

	// IE8-
	var FAILS_ON_UNDEFINED = fails(function () {
	  test.sort(undefined);
	});
	// V8 bug
	var FAILS_ON_NULL = fails(function () {
	  test.sort(null);
	});
	// Old WebKit
	var STRICT_METHOD = arrayMethodIsStrict('sort');

	var STABLE_SORT$1 = !fails(function () {
	  // feature detection can be too slow, so check engines versions
	  if (engineV8Version) { return engineV8Version < 70; }
	  if (engineFfVersion && engineFfVersion > 3) { return; }
	  if (engineIsIeOrEdge) { return true; }
	  if (engineWebkitVersion) { return engineWebkitVersion < 603; }

	  var result = '';
	  var code, chr, value, index;

	  // generate an array with more 512 elements (Chakra and old V8 fails only in this case)
	  for (code = 65; code < 76; code++) {
	    chr = String.fromCharCode(code);

	    switch (code) {
	      case 66: case 69: case 70: case 72: value = 3; break;
	      case 68: case 71: value = 4; break;
	      default: value = 2;
	    }

	    for (index = 0; index < 47; index++) {
	      test.push({ k: chr + index, v: value });
	    }
	  }

	  test.sort(function (a, b) { return b.v - a.v; });

	  for (index = 0; index < test.length; index++) {
	    chr = test[index].k.charAt(0);
	    if (result.charAt(result.length - 1) !== chr) { result += chr; }
	  }

	  return result !== 'DGBEFHACIJK';
	});

	var FORCED$i = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD || !STABLE_SORT$1;

	var getSortCompare$1 = function (comparefn) {
	  return function (x, y) {
	    if (y === undefined) { return -1; }
	    if (x === undefined) { return 1; }
	    if (comparefn !== undefined) { return +comparefn(x, y) || 0; }
	    return toString_1(x) > toString_1(y) ? 1 : -1;
	  };
	};

	// `Array.prototype.sort` method
	// https://tc39.es/ecma262/#sec-array.prototype.sort
	_export({ target: 'Array', proto: true, forced: FORCED$i }, {
	  sort: function sort(comparefn) {
	    if (comparefn !== undefined) { aCallable(comparefn); }

	    var array = toObject(this);

	    if (STABLE_SORT$1) { return comparefn === undefined ? nativeSort$1(array) : nativeSort$1(array, comparefn); }

	    var items = [];
	    var arrayLength = lengthOfArrayLike(array);
	    var itemsLength, index;

	    for (index = 0; index < arrayLength; index++) {
	      if (index in array) { push$i(items, array[index]); }
	    }

	    arraySort(items, getSortCompare$1(comparefn));

	    itemsLength = lengthOfArrayLike(items);
	    index = 0;

	    while (index < itemsLength) { array[index] = items[index++]; }
	    while (index < arrayLength) { deletePropertyOrThrow(array, index++); }

	    return array;
	  }
	});

	var SPECIES$3 = wellKnownSymbol('species');

	var setSpecies = function (CONSTRUCTOR_NAME) {
	  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
	  var defineProperty = objectDefineProperty.f;

	  if (descriptors && Constructor && !Constructor[SPECIES$3]) {
	    defineProperty(Constructor, SPECIES$3, {
	      configurable: true,
	      get: function () { return this; }
	    });
	  }
	};

	// `Array[@@species]` getter
	// https://tc39.es/ecma262/#sec-get-array-@@species
	setSpecies('Array');

	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');

	var max$6 = Math.max;
	var min$8 = Math.min;

	// `Array.prototype.splice` method
	// https://tc39.es/ecma262/#sec-array.prototype.splice
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
	  splice: function splice(start, deleteCount /* , ...items */) {
	    var arguments$1 = arguments;

	    var O = toObject(this);
	    var len = lengthOfArrayLike(O);
	    var actualStart = toAbsoluteIndex(start, len);
	    var argumentsLength = arguments.length;
	    var insertCount, actualDeleteCount, A, k, from, to;
	    if (argumentsLength === 0) {
	      insertCount = actualDeleteCount = 0;
	    } else if (argumentsLength === 1) {
	      insertCount = 0;
	      actualDeleteCount = len - actualStart;
	    } else {
	      insertCount = argumentsLength - 2;
	      actualDeleteCount = min$8(max$6(toIntegerOrInfinity(deleteCount), 0), len - actualStart);
	    }
	    doesNotExceedSafeInteger(len + insertCount - actualDeleteCount);
	    A = arraySpeciesCreate(O, actualDeleteCount);
	    for (k = 0; k < actualDeleteCount; k++) {
	      from = actualStart + k;
	      if (from in O) { createProperty(A, k, O[from]); }
	    }
	    A.length = actualDeleteCount;
	    if (insertCount < actualDeleteCount) {
	      for (k = actualStart; k < len - actualDeleteCount; k++) {
	        from = k + actualDeleteCount;
	        to = k + insertCount;
	        if (from in O) { O[to] = O[from]; }
	        else { deletePropertyOrThrow(O, to); }
	      }
	      for (k = len; k > len - actualDeleteCount + insertCount; k--) { deletePropertyOrThrow(O, k - 1); }
	    } else if (insertCount > actualDeleteCount) {
	      for (k = len - actualDeleteCount; k > actualStart; k--) {
	        from = k + actualDeleteCount - 1;
	        to = k + insertCount - 1;
	        if (from in O) { O[to] = O[from]; }
	        else { deletePropertyOrThrow(O, to); }
	      }
	    }
	    for (k = 0; k < insertCount; k++) {
	      O[k + actualStart] = arguments$1[k + 2];
	    }
	    arraySetLength(O, len - actualDeleteCount + insertCount);
	    return A;
	  }
	});

	// this method was added to unscopables after implementation
	// in popular engines, so it's moved to a separate module


	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('flat');

	// this method was added to unscopables after implementation
	// in popular engines, so it's moved to a separate module


	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('flatMap');

	// IE8-
	var INCORRECT_RESULT = [].unshift(0) !== 1;

	// V8 ~ Chrome < 71 and Safari <= 15.4, FF < 23 throws InternalError
	var SILENT_ON_NON_WRITABLE_LENGTH = !function () {
	  try {
	    // eslint-disable-next-line es/no-object-defineproperty -- safe
	    Object.defineProperty([], 'length', { writable: false }).unshift();
	  } catch (error) {
	    return error instanceof TypeError;
	  }
	}();

	// `Array.prototype.unshift` method
	// https://tc39.es/ecma262/#sec-array.prototype.unshift
	_export({ target: 'Array', proto: true, arity: 1, forced: INCORRECT_RESULT || SILENT_ON_NON_WRITABLE_LENGTH }, {
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  unshift: function unshift(item) {
	    var arguments$1 = arguments;

	    var O = toObject(this);
	    var len = lengthOfArrayLike(O);
	    var argCount = arguments.length;
	    if (argCount) {
	      doesNotExceedSafeInteger(len + argCount);
	      var k = len;
	      while (k--) {
	        var to = k + argCount;
	        if (k in O) { O[to] = O[k]; }
	        else { deletePropertyOrThrow(O, to); }
	      }
	      for (var j = 0; j < argCount; j++) {
	        O[j] = arguments$1[j];
	      }
	    } return arraySetLength(O, len + argCount);
	  }
	});

	// eslint-disable-next-line es/no-typed-arrays -- safe
	var arrayBufferBasicDetection = typeof ArrayBuffer != 'undefined' && typeof DataView != 'undefined';

	var defineBuiltIns = function (target, src, options) {
	  for (var key in src) { defineBuiltIn(target, key, src[key], options); }
	  return target;
	};

	var $TypeError$n = TypeError;

	var anInstance = function (it, Prototype) {
	  if (objectIsPrototypeOf(Prototype, it)) { return it; }
	  throw $TypeError$n('Incorrect invocation');
	};

	var $RangeError$c = RangeError;

	// `ToIndex` abstract operation
	// https://tc39.es/ecma262/#sec-toindex
	var toIndex = function (it) {
	  if (it === undefined) { return 0; }
	  var number = toIntegerOrInfinity(it);
	  var length = toLength(number);
	  if (number !== length) { throw $RangeError$c('Wrong length or index'); }
	  return length;
	};

	// IEEE754 conversions based on https://github.com/feross/ieee754
	var $Array$6 = Array;
	var abs$8 = Math.abs;
	var pow$5 = Math.pow;
	var floor$8 = Math.floor;
	var log$9 = Math.log;
	var LN2$2 = Math.LN2;

	var pack = function (number, mantissaLength, bytes) {
	  var buffer = $Array$6(bytes);
	  var exponentLength = bytes * 8 - mantissaLength - 1;
	  var eMax = (1 << exponentLength) - 1;
	  var eBias = eMax >> 1;
	  var rt = mantissaLength === 23 ? pow$5(2, -24) - pow$5(2, -77) : 0;
	  var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
	  var index = 0;
	  var exponent, mantissa, c;
	  number = abs$8(number);
	  // eslint-disable-next-line no-self-compare -- NaN check
	  if (number != number || number === Infinity) {
	    // eslint-disable-next-line no-self-compare -- NaN check
	    mantissa = number != number ? 1 : 0;
	    exponent = eMax;
	  } else {
	    exponent = floor$8(log$9(number) / LN2$2);
	    c = pow$5(2, -exponent);
	    if (number * c < 1) {
	      exponent--;
	      c *= 2;
	    }
	    if (exponent + eBias >= 1) {
	      number += rt / c;
	    } else {
	      number += rt * pow$5(2, 1 - eBias);
	    }
	    if (number * c >= 2) {
	      exponent++;
	      c /= 2;
	    }
	    if (exponent + eBias >= eMax) {
	      mantissa = 0;
	      exponent = eMax;
	    } else if (exponent + eBias >= 1) {
	      mantissa = (number * c - 1) * pow$5(2, mantissaLength);
	      exponent = exponent + eBias;
	    } else {
	      mantissa = number * pow$5(2, eBias - 1) * pow$5(2, mantissaLength);
	      exponent = 0;
	    }
	  }
	  while (mantissaLength >= 8) {
	    buffer[index++] = mantissa & 255;
	    mantissa /= 256;
	    mantissaLength -= 8;
	  }
	  exponent = exponent << mantissaLength | mantissa;
	  exponentLength += mantissaLength;
	  while (exponentLength > 0) {
	    buffer[index++] = exponent & 255;
	    exponent /= 256;
	    exponentLength -= 8;
	  }
	  buffer[--index] |= sign * 128;
	  return buffer;
	};

	var unpack = function (buffer, mantissaLength) {
	  var bytes = buffer.length;
	  var exponentLength = bytes * 8 - mantissaLength - 1;
	  var eMax = (1 << exponentLength) - 1;
	  var eBias = eMax >> 1;
	  var nBits = exponentLength - 7;
	  var index = bytes - 1;
	  var sign = buffer[index--];
	  var exponent = sign & 127;
	  var mantissa;
	  sign >>= 7;
	  while (nBits > 0) {
	    exponent = exponent * 256 + buffer[index--];
	    nBits -= 8;
	  }
	  mantissa = exponent & (1 << -nBits) - 1;
	  exponent >>= -nBits;
	  nBits += mantissaLength;
	  while (nBits > 0) {
	    mantissa = mantissa * 256 + buffer[index--];
	    nBits -= 8;
	  }
	  if (exponent === 0) {
	    exponent = 1 - eBias;
	  } else if (exponent === eMax) {
	    return mantissa ? NaN : sign ? -Infinity : Infinity;
	  } else {
	    mantissa = mantissa + pow$5(2, mantissaLength);
	    exponent = exponent - eBias;
	  } return (sign ? -1 : 1) * mantissa * pow$5(2, exponent - mantissaLength);
	};

	var ieee754 = {
	  pack: pack,
	  unpack: unpack
	};

	var getOwnPropertyNames$3 = objectGetOwnPropertyNames.f;
	var defineProperty$9 = objectDefineProperty.f;





	var PROPER_FUNCTION_NAME$2 = functionName.PROPER;
	var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;
	var getInternalState$c = internalState.get;
	var setInternalState$g = internalState.set;
	var ARRAY_BUFFER$1 = 'ArrayBuffer';
	var DATA_VIEW = 'DataView';
	var PROTOTYPE = 'prototype';
	var WRONG_LENGTH = 'Wrong length';
	var WRONG_INDEX = 'Wrong index';
	var NativeArrayBuffer$1 = global_1[ARRAY_BUFFER$1];
	var $ArrayBuffer = NativeArrayBuffer$1;
	var ArrayBufferPrototype = $ArrayBuffer && $ArrayBuffer[PROTOTYPE];
	var $DataView = global_1[DATA_VIEW];
	var DataViewPrototype$1 = $DataView && $DataView[PROTOTYPE];
	var ObjectPrototype$3 = Object.prototype;
	var Array$2 = global_1.Array;
	var RangeError$3 = global_1.RangeError;
	var fill = functionUncurryThis(arrayFill);
	var reverse = functionUncurryThis([].reverse);

	var packIEEE754 = ieee754.pack;
	var unpackIEEE754 = ieee754.unpack;

	var packInt8 = function (number) {
	  return [number & 0xFF];
	};

	var packInt16 = function (number) {
	  return [number & 0xFF, number >> 8 & 0xFF];
	};

	var packInt32 = function (number) {
	  return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
	};

	var unpackInt32 = function (buffer) {
	  return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
	};

	var packFloat32 = function (number) {
	  return packIEEE754(number, 23, 4);
	};

	var packFloat64 = function (number) {
	  return packIEEE754(number, 52, 8);
	};

	var addGetter = function (Constructor, key) {
	  defineProperty$9(Constructor[PROTOTYPE], key, { get: function () { return getInternalState$c(this)[key]; } });
	};

	var get$1 = function (view, count, index, isLittleEndian) {
	  var intIndex = toIndex(index);
	  var store = getInternalState$c(view);
	  if (intIndex + count > store.byteLength) { throw RangeError$3(WRONG_INDEX); }
	  var bytes = getInternalState$c(store.buffer).bytes;
	  var start = intIndex + store.byteOffset;
	  var pack = arraySliceSimple(bytes, start, start + count);
	  return isLittleEndian ? pack : reverse(pack);
	};

	var set$2 = function (view, count, index, conversion, value, isLittleEndian) {
	  var intIndex = toIndex(index);
	  var store = getInternalState$c(view);
	  if (intIndex + count > store.byteLength) { throw RangeError$3(WRONG_INDEX); }
	  var bytes = getInternalState$c(store.buffer).bytes;
	  var start = intIndex + store.byteOffset;
	  var pack = conversion(+value);
	  for (var i = 0; i < count; i++) { bytes[start + i] = pack[isLittleEndian ? i : count - i - 1]; }
	};

	if (!arrayBufferBasicDetection) {
	  $ArrayBuffer = function ArrayBuffer(length) {
	    anInstance(this, ArrayBufferPrototype);
	    var byteLength = toIndex(length);
	    setInternalState$g(this, {
	      bytes: fill(Array$2(byteLength), 0),
	      byteLength: byteLength
	    });
	    if (!descriptors) { this.byteLength = byteLength; }
	  };

	  ArrayBufferPrototype = $ArrayBuffer[PROTOTYPE];

	  $DataView = function DataView(buffer, byteOffset, byteLength) {
	    anInstance(this, DataViewPrototype$1);
	    anInstance(buffer, ArrayBufferPrototype);
	    var bufferLength = getInternalState$c(buffer).byteLength;
	    var offset = toIntegerOrInfinity(byteOffset);
	    if (offset < 0 || offset > bufferLength) { throw RangeError$3('Wrong offset'); }
	    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
	    if (offset + byteLength > bufferLength) { throw RangeError$3(WRONG_LENGTH); }
	    setInternalState$g(this, {
	      buffer: buffer,
	      byteLength: byteLength,
	      byteOffset: offset
	    });
	    if (!descriptors) {
	      this.buffer = buffer;
	      this.byteLength = byteLength;
	      this.byteOffset = offset;
	    }
	  };

	  DataViewPrototype$1 = $DataView[PROTOTYPE];

	  if (descriptors) {
	    addGetter($ArrayBuffer, 'byteLength');
	    addGetter($DataView, 'buffer');
	    addGetter($DataView, 'byteLength');
	    addGetter($DataView, 'byteOffset');
	  }

	  defineBuiltIns(DataViewPrototype$1, {
	    getInt8: function getInt8(byteOffset) {
	      return get$1(this, 1, byteOffset)[0] << 24 >> 24;
	    },
	    getUint8: function getUint8(byteOffset) {
	      return get$1(this, 1, byteOffset)[0];
	    },
	    getInt16: function getInt16(byteOffset /* , littleEndian */) {
	      var bytes = get$1(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
	      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
	    },
	    getUint16: function getUint16(byteOffset /* , littleEndian */) {
	      var bytes = get$1(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
	      return bytes[1] << 8 | bytes[0];
	    },
	    getInt32: function getInt32(byteOffset /* , littleEndian */) {
	      return unpackInt32(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined));
	    },
	    getUint32: function getUint32(byteOffset /* , littleEndian */) {
	      return unpackInt32(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)) >>> 0;
	    },
	    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
	      return unpackIEEE754(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 23);
	    },
	    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
	      return unpackIEEE754(get$1(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 52);
	    },
	    setInt8: function setInt8(byteOffset, value) {
	      set$2(this, 1, byteOffset, packInt8, value);
	    },
	    setUint8: function setUint8(byteOffset, value) {
	      set$2(this, 1, byteOffset, packInt8, value);
	    },
	    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
	      set$2(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
	      set$2(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
	      set$2(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
	      set$2(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
	      set$2(this, 4, byteOffset, packFloat32, value, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
	      set$2(this, 8, byteOffset, packFloat64, value, arguments.length > 2 ? arguments[2] : undefined);
	    }
	  });
	} else {
	  var INCORRECT_ARRAY_BUFFER_NAME = PROPER_FUNCTION_NAME$2 && NativeArrayBuffer$1.name !== ARRAY_BUFFER$1;
	  /* eslint-disable no-new -- required for testing */
	  if (!fails(function () {
	    NativeArrayBuffer$1(1);
	  }) || !fails(function () {
	    new NativeArrayBuffer$1(-1);
	  }) || fails(function () {
	    new NativeArrayBuffer$1();
	    new NativeArrayBuffer$1(1.5);
	    new NativeArrayBuffer$1(NaN);
	    return NativeArrayBuffer$1.length != 1 || INCORRECT_ARRAY_BUFFER_NAME && !CONFIGURABLE_FUNCTION_NAME;
	  })) {
	    /* eslint-enable no-new -- required for testing */
	    $ArrayBuffer = function ArrayBuffer(length) {
	      anInstance(this, ArrayBufferPrototype);
	      return new NativeArrayBuffer$1(toIndex(length));
	    };

	    $ArrayBuffer[PROTOTYPE] = ArrayBufferPrototype;

	    for (var keys$2 = getOwnPropertyNames$3(NativeArrayBuffer$1), j$1 = 0, key$3; keys$2.length > j$1;) {
	      if (!((key$3 = keys$2[j$1++]) in $ArrayBuffer)) {
	        createNonEnumerableProperty($ArrayBuffer, key$3, NativeArrayBuffer$1[key$3]);
	      }
	    }

	    ArrayBufferPrototype.constructor = $ArrayBuffer;
	  } else if (INCORRECT_ARRAY_BUFFER_NAME && CONFIGURABLE_FUNCTION_NAME) {
	    createNonEnumerableProperty(NativeArrayBuffer$1, 'name', ARRAY_BUFFER$1);
	  }

	  // WebKit bug - the same parent prototype for typed arrays and data view
	  if (objectSetPrototypeOf && objectGetPrototypeOf(DataViewPrototype$1) !== ObjectPrototype$3) {
	    objectSetPrototypeOf(DataViewPrototype$1, ObjectPrototype$3);
	  }

	  // iOS Safari 7.x bug
	  var testView = new $DataView(new $ArrayBuffer(2));
	  var $setInt8 = functionUncurryThis(DataViewPrototype$1.setInt8);
	  testView.setInt8(0, 2147483648);
	  testView.setInt8(1, 2147483649);
	  if (testView.getInt8(0) || !testView.getInt8(1)) { defineBuiltIns(DataViewPrototype$1, {
	    setInt8: function setInt8(byteOffset, value) {
	      $setInt8(this, byteOffset, value << 24 >> 24);
	    },
	    setUint8: function setUint8(byteOffset, value) {
	      $setInt8(this, byteOffset, value << 24 >> 24);
	    }
	  }, { unsafe: true }); }
	}

	setToStringTag($ArrayBuffer, ARRAY_BUFFER$1);
	setToStringTag($DataView, DATA_VIEW);

	var arrayBuffer = {
	  ArrayBuffer: $ArrayBuffer,
	  DataView: $DataView
	};

	var ARRAY_BUFFER = 'ArrayBuffer';
	var ArrayBuffer$3 = arrayBuffer[ARRAY_BUFFER];
	var NativeArrayBuffer = global_1[ARRAY_BUFFER];

	// `ArrayBuffer` constructor
	// https://tc39.es/ecma262/#sec-arraybuffer-constructor
	_export({ global: true, constructor: true, forced: NativeArrayBuffer !== ArrayBuffer$3 }, {
	  ArrayBuffer: ArrayBuffer$3
	});

	setSpecies(ARRAY_BUFFER);

	var defineProperty$8 = objectDefineProperty.f;







	var enforceInternalState$2 = internalState.enforce;
	var getInternalState$b = internalState.get;
	var Int8Array$4 = global_1.Int8Array;
	var Int8ArrayPrototype$1 = Int8Array$4 && Int8Array$4.prototype;
	var Uint8ClampedArray$1 = global_1.Uint8ClampedArray;
	var Uint8ClampedArrayPrototype = Uint8ClampedArray$1 && Uint8ClampedArray$1.prototype;
	var TypedArray = Int8Array$4 && objectGetPrototypeOf(Int8Array$4);
	var TypedArrayPrototype$1 = Int8ArrayPrototype$1 && objectGetPrototypeOf(Int8ArrayPrototype$1);
	var ObjectPrototype$2 = Object.prototype;
	var TypeError$6 = global_1.TypeError;

	var TO_STRING_TAG$5 = wellKnownSymbol('toStringTag');
	var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
	var TYPED_ARRAY_CONSTRUCTOR = 'TypedArrayConstructor';
	// Fixing native typed arrays in Opera Presto crashes the browser, see #595
	var NATIVE_ARRAY_BUFFER_VIEWS$2 = arrayBufferBasicDetection && !!objectSetPrototypeOf && classof(global_1.opera) !== 'Opera';
	var TYPED_ARRAY_TAG_REQUIRED = false;
	var NAME$1, Constructor, Prototype;

	var TypedArrayConstructorsList = {
	  Int8Array: 1,
	  Uint8Array: 1,
	  Uint8ClampedArray: 1,
	  Int16Array: 2,
	  Uint16Array: 2,
	  Int32Array: 4,
	  Uint32Array: 4,
	  Float32Array: 4,
	  Float64Array: 8
	};

	var BigIntArrayConstructorsList = {
	  BigInt64Array: 8,
	  BigUint64Array: 8
	};

	var isView = function isView(it) {
	  if (!isObject(it)) { return false; }
	  var klass = classof(it);
	  return klass === 'DataView'
	    || hasOwnProperty_1(TypedArrayConstructorsList, klass)
	    || hasOwnProperty_1(BigIntArrayConstructorsList, klass);
	};

	var getTypedArrayConstructor$5 = function (it) {
	  var proto = objectGetPrototypeOf(it);
	  if (!isObject(proto)) { return; }
	  var state = getInternalState$b(proto);
	  return (state && hasOwnProperty_1(state, TYPED_ARRAY_CONSTRUCTOR)) ? state[TYPED_ARRAY_CONSTRUCTOR] : getTypedArrayConstructor$5(proto);
	};

	var isTypedArray = function (it) {
	  if (!isObject(it)) { return false; }
	  var klass = classof(it);
	  return hasOwnProperty_1(TypedArrayConstructorsList, klass)
	    || hasOwnProperty_1(BigIntArrayConstructorsList, klass);
	};

	var aTypedArray$x = function (it) {
	  if (isTypedArray(it)) { return it; }
	  throw TypeError$6('Target is not a typed array');
	};

	var aTypedArrayConstructor$4 = function (C) {
	  if (isCallable(C) && (!objectSetPrototypeOf || objectIsPrototypeOf(TypedArray, C))) { return C; }
	  throw TypeError$6(tryToString(C) + ' is not a typed array constructor');
	};

	var exportTypedArrayMethod$y = function (KEY, property, forced, options) {
	  if (!descriptors) { return; }
	  if (forced) { for (var ARRAY in TypedArrayConstructorsList) {
	    var TypedArrayConstructor = global_1[ARRAY];
	    if (TypedArrayConstructor && hasOwnProperty_1(TypedArrayConstructor.prototype, KEY)) { try {
	      delete TypedArrayConstructor.prototype[KEY];
	    } catch (error) {
	      // old WebKit bug - some methods are non-configurable
	      try {
	        TypedArrayConstructor.prototype[KEY] = property;
	      } catch (error2) { /* empty */ }
	    } }
	  } }
	  if (!TypedArrayPrototype$1[KEY] || forced) {
	    defineBuiltIn(TypedArrayPrototype$1, KEY, forced ? property
	      : NATIVE_ARRAY_BUFFER_VIEWS$2 && Int8ArrayPrototype$1[KEY] || property, options);
	  }
	};

	var exportTypedArrayStaticMethod$3 = function (KEY, property, forced) {
	  var ARRAY, TypedArrayConstructor;
	  if (!descriptors) { return; }
	  if (objectSetPrototypeOf) {
	    if (forced) { for (ARRAY in TypedArrayConstructorsList) {
	      TypedArrayConstructor = global_1[ARRAY];
	      if (TypedArrayConstructor && hasOwnProperty_1(TypedArrayConstructor, KEY)) { try {
	        delete TypedArrayConstructor[KEY];
	      } catch (error) { /* empty */ } }
	    } }
	    if (!TypedArray[KEY] || forced) {
	      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
	      try {
	        return defineBuiltIn(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS$2 && TypedArray[KEY] || property);
	      } catch (error$1) { /* empty */ }
	    } else { return; }
	  }
	  for (ARRAY in TypedArrayConstructorsList) {
	    TypedArrayConstructor = global_1[ARRAY];
	    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
	      defineBuiltIn(TypedArrayConstructor, KEY, property);
	    }
	  }
	};

	for (NAME$1 in TypedArrayConstructorsList) {
	  Constructor = global_1[NAME$1];
	  Prototype = Constructor && Constructor.prototype;
	  if (Prototype) { enforceInternalState$2(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor; }
	  else { NATIVE_ARRAY_BUFFER_VIEWS$2 = false; }
	}

	for (NAME$1 in BigIntArrayConstructorsList) {
	  Constructor = global_1[NAME$1];
	  Prototype = Constructor && Constructor.prototype;
	  if (Prototype) { enforceInternalState$2(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor; }
	}

	// WebKit bug - typed arrays constructors prototype is Object.prototype
	if (!NATIVE_ARRAY_BUFFER_VIEWS$2 || !isCallable(TypedArray) || TypedArray === Function.prototype) {
	  // eslint-disable-next-line no-shadow -- safe
	  TypedArray = function TypedArray() {
	    throw TypeError$6('Incorrect invocation');
	  };
	  if (NATIVE_ARRAY_BUFFER_VIEWS$2) { for (NAME$1 in TypedArrayConstructorsList) {
	    if (global_1[NAME$1]) { objectSetPrototypeOf(global_1[NAME$1], TypedArray); }
	  } }
	}

	if (!NATIVE_ARRAY_BUFFER_VIEWS$2 || !TypedArrayPrototype$1 || TypedArrayPrototype$1 === ObjectPrototype$2) {
	  TypedArrayPrototype$1 = TypedArray.prototype;
	  if (NATIVE_ARRAY_BUFFER_VIEWS$2) { for (NAME$1 in TypedArrayConstructorsList) {
	    if (global_1[NAME$1]) { objectSetPrototypeOf(global_1[NAME$1].prototype, TypedArrayPrototype$1); }
	  } }
	}

	// WebKit bug - one more object in Uint8ClampedArray prototype chain
	if (NATIVE_ARRAY_BUFFER_VIEWS$2 && objectGetPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype$1) {
	  objectSetPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype$1);
	}

	if (descriptors && !hasOwnProperty_1(TypedArrayPrototype$1, TO_STRING_TAG$5)) {
	  TYPED_ARRAY_TAG_REQUIRED = true;
	  defineProperty$8(TypedArrayPrototype$1, TO_STRING_TAG$5, { get: function () {
	    return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
	  } });
	  for (NAME$1 in TypedArrayConstructorsList) { if (global_1[NAME$1]) {
	    createNonEnumerableProperty(global_1[NAME$1], TYPED_ARRAY_TAG, NAME$1);
	  } }
	}

	var arrayBufferViewCore = {
	  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS$2,
	  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQUIRED && TYPED_ARRAY_TAG,
	  aTypedArray: aTypedArray$x,
	  aTypedArrayConstructor: aTypedArrayConstructor$4,
	  exportTypedArrayMethod: exportTypedArrayMethod$y,
	  exportTypedArrayStaticMethod: exportTypedArrayStaticMethod$3,
	  getTypedArrayConstructor: getTypedArrayConstructor$5,
	  isView: isView,
	  isTypedArray: isTypedArray,
	  TypedArray: TypedArray,
	  TypedArrayPrototype: TypedArrayPrototype$1
	};

	var NATIVE_ARRAY_BUFFER_VIEWS$1 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

	// `ArrayBuffer.isView` method
	// https://tc39.es/ecma262/#sec-arraybuffer.isview
	_export({ target: 'ArrayBuffer', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS$1 }, {
	  isView: arrayBufferViewCore.isView
	});

	var $TypeError$m = TypeError;

	// `Assert: IsConstructor(argument) is true`
	var aConstructor = function (argument) {
	  if (isConstructor(argument)) { return argument; }
	  throw $TypeError$m(tryToString(argument) + ' is not a constructor');
	};

	var SPECIES$2 = wellKnownSymbol('species');

	// `SpeciesConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-speciesconstructor
	var speciesConstructor = function (O, defaultConstructor) {
	  var C = anObject(O).constructor;
	  var S;
	  return C === undefined || isNullOrUndefined(S = anObject(C)[SPECIES$2]) ? defaultConstructor : aConstructor(S);
	};

	var ArrayBuffer$2 = arrayBuffer.ArrayBuffer;
	var DataView$1 = arrayBuffer.DataView;
	var DataViewPrototype = DataView$1.prototype;
	var nativeArrayBufferSlice = functionUncurryThis(ArrayBuffer$2.prototype.slice);
	var getUint8 = functionUncurryThis(DataViewPrototype.getUint8);
	var setUint8 = functionUncurryThis(DataViewPrototype.setUint8);

	var INCORRECT_SLICE = fails(function () {
	  return !new ArrayBuffer$2(2).slice(1, undefined).byteLength;
	});

	// `ArrayBuffer.prototype.slice` method
	// https://tc39.es/ecma262/#sec-arraybuffer.prototype.slice
	_export({ target: 'ArrayBuffer', proto: true, unsafe: true, forced: INCORRECT_SLICE }, {
	  slice: function slice(start, end) {
	    if (nativeArrayBufferSlice && end === undefined) {
	      return nativeArrayBufferSlice(anObject(this), start); // FF fix
	    }
	    var length = anObject(this).byteLength;
	    var first = toAbsoluteIndex(start, length);
	    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	    var result = new (speciesConstructor(this, ArrayBuffer$2))(toLength(fin - first));
	    var viewSource = new DataView$1(this);
	    var viewTarget = new DataView$1(result);
	    var index = 0;
	    while (first < fin) {
	      setUint8(viewTarget, index++, getUint8(viewSource, first++));
	    } return result;
	  }
	});

	// `DataView` constructor
	// https://tc39.es/ecma262/#sec-dataview-constructor
	_export({ global: true, constructor: true, forced: !arrayBufferBasicDetection }, {
	  DataView: arrayBuffer.DataView
	});

	var FORCED$h = fails(function () {
	  return new Date(16e11).getYear() !== 120;
	});

	var getFullYear = functionUncurryThis(Date.prototype.getFullYear);

	// `Date.prototype.getYear` method
	// https://tc39.es/ecma262/#sec-date.prototype.getyear
	_export({ target: 'Date', proto: true, forced: FORCED$h }, {
	  getYear: function getYear() {
	    return getFullYear(this) - 1900;
	  }
	});

	// TODO: Remove from `core-js@4`



	var $Date = Date;
	var thisTimeValue$4 = functionUncurryThis($Date.prototype.getTime);

	// `Date.now` method
	// https://tc39.es/ecma262/#sec-date.now
	_export({ target: 'Date', stat: true }, {
	  now: function now() {
	    return thisTimeValue$4(new $Date());
	  }
	});

	var DatePrototype$3 = Date.prototype;
	var thisTimeValue$3 = functionUncurryThis(DatePrototype$3.getTime);
	var setFullYear = functionUncurryThis(DatePrototype$3.setFullYear);

	// `Date.prototype.setYear` method
	// https://tc39.es/ecma262/#sec-date.prototype.setyear
	_export({ target: 'Date', proto: true }, {
	  setYear: function setYear(year) {
	    // validate
	    thisTimeValue$3(this);
	    var yi = toIntegerOrInfinity(year);
	    var yyyy = 0 <= yi && yi <= 99 ? yi + 1900 : yi;
	    return setFullYear(this, yyyy);
	  }
	});

	// `Date.prototype.toGMTString` method
	// https://tc39.es/ecma262/#sec-date.prototype.togmtstring
	_export({ target: 'Date', proto: true }, {
	  toGMTString: Date.prototype.toUTCString
	});

	var $RangeError$b = RangeError;

	// `String.prototype.repeat` method implementation
	// https://tc39.es/ecma262/#sec-string.prototype.repeat
	var stringRepeat = function repeat(count) {
	  var str = toString_1(requireObjectCoercible(this));
	  var result = '';
	  var n = toIntegerOrInfinity(count);
	  if (n < 0 || n == Infinity) { throw $RangeError$b('Wrong number of repetitions'); }
	  for (;n > 0; (n >>>= 1) && (str += str)) { if (n & 1) { result += str; } }
	  return result;
	};

	// https://github.com/tc39/proposal-string-pad-start-end






	var repeat$2 = functionUncurryThis(stringRepeat);
	var stringSlice$f = functionUncurryThis(''.slice);
	var ceil = Math.ceil;

	// `String.prototype.{ padStart, padEnd }` methods implementation
	var createMethod$4 = function (IS_END) {
	  return function ($this, maxLength, fillString) {
	    var S = toString_1(requireObjectCoercible($this));
	    var intMaxLength = toLength(maxLength);
	    var stringLength = S.length;
	    var fillStr = fillString === undefined ? ' ' : toString_1(fillString);
	    var fillLen, stringFiller;
	    if (intMaxLength <= stringLength || fillStr == '') { return S; }
	    fillLen = intMaxLength - stringLength;
	    stringFiller = repeat$2(fillStr, ceil(fillLen / fillStr.length));
	    if (stringFiller.length > fillLen) { stringFiller = stringSlice$f(stringFiller, 0, fillLen); }
	    return IS_END ? S + stringFiller : stringFiller + S;
	  };
	};

	var stringPad = {
	  // `String.prototype.padStart` method
	  // https://tc39.es/ecma262/#sec-string.prototype.padstart
	  start: createMethod$4(false),
	  // `String.prototype.padEnd` method
	  // https://tc39.es/ecma262/#sec-string.prototype.padend
	  end: createMethod$4(true)
	};

	var padStart = stringPad.start;

	var $RangeError$a = RangeError;
	var $isFinite$1 = isFinite;
	var abs$7 = Math.abs;
	var DatePrototype$2 = Date.prototype;
	var nativeDateToISOString = DatePrototype$2.toISOString;
	var thisTimeValue$2 = functionUncurryThis(DatePrototype$2.getTime);
	var getUTCDate = functionUncurryThis(DatePrototype$2.getUTCDate);
	var getUTCFullYear = functionUncurryThis(DatePrototype$2.getUTCFullYear);
	var getUTCHours = functionUncurryThis(DatePrototype$2.getUTCHours);
	var getUTCMilliseconds = functionUncurryThis(DatePrototype$2.getUTCMilliseconds);
	var getUTCMinutes = functionUncurryThis(DatePrototype$2.getUTCMinutes);
	var getUTCMonth = functionUncurryThis(DatePrototype$2.getUTCMonth);
	var getUTCSeconds = functionUncurryThis(DatePrototype$2.getUTCSeconds);

	// `Date.prototype.toISOString` method implementation
	// https://tc39.es/ecma262/#sec-date.prototype.toisostring
	// PhantomJS / old WebKit fails here:
	var dateToIsoString = (fails(function () {
	  return nativeDateToISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
	}) || !fails(function () {
	  nativeDateToISOString.call(new Date(NaN));
	})) ? function toISOString() {
	  if (!$isFinite$1(thisTimeValue$2(this))) { throw $RangeError$a('Invalid time value'); }
	  var date = this;
	  var year = getUTCFullYear(date);
	  var milliseconds = getUTCMilliseconds(date);
	  var sign = year < 0 ? '-' : year > 9999 ? '+' : '';
	  return sign + padStart(abs$7(year), sign ? 6 : 4, 0) +
	    '-' + padStart(getUTCMonth(date) + 1, 2, 0) +
	    '-' + padStart(getUTCDate(date), 2, 0) +
	    'T' + padStart(getUTCHours(date), 2, 0) +
	    ':' + padStart(getUTCMinutes(date), 2, 0) +
	    ':' + padStart(getUTCSeconds(date), 2, 0) +
	    '.' + padStart(milliseconds, 3, 0) +
	    'Z';
	} : nativeDateToISOString;

	// `Date.prototype.toISOString` method
	// https://tc39.es/ecma262/#sec-date.prototype.toisostring
	// PhantomJS / old WebKit has a broken implementations
	_export({ target: 'Date', proto: true, forced: Date.prototype.toISOString !== dateToIsoString }, {
	  toISOString: dateToIsoString
	});

	var FORCED$g = fails(function () {
	  return new Date(NaN).toJSON() !== null
	    || Date.prototype.toJSON.call({ toISOString: function () { return 1; } }) !== 1;
	});

	// `Date.prototype.toJSON` method
	// https://tc39.es/ecma262/#sec-date.prototype.tojson
	_export({ target: 'Date', proto: true, arity: 1, forced: FORCED$g }, {
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  toJSON: function toJSON(key) {
	    var O = toObject(this);
	    var pv = toPrimitive(O, 'number');
	    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
	  }
	});

	var $TypeError$l = TypeError;

	// `Date.prototype[@@toPrimitive](hint)` method implementation
	// https://tc39.es/ecma262/#sec-date.prototype-@@toprimitive
	var dateToPrimitive = function (hint) {
	  anObject(this);
	  if (hint === 'string' || hint === 'default') { hint = 'string'; }
	  else if (hint !== 'number') { throw $TypeError$l('Incorrect hint'); }
	  return ordinaryToPrimitive(this, hint);
	};

	var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
	var DatePrototype$1 = Date.prototype;

	// `Date.prototype[@@toPrimitive]` method
	// https://tc39.es/ecma262/#sec-date.prototype-@@toprimitive
	if (!hasOwnProperty_1(DatePrototype$1, TO_PRIMITIVE)) {
	  defineBuiltIn(DatePrototype$1, TO_PRIMITIVE, dateToPrimitive);
	}

	// TODO: Remove from `core-js@4`



	var DatePrototype = Date.prototype;
	var INVALID_DATE = 'Invalid Date';
	var TO_STRING$1 = 'toString';
	var nativeDateToString = functionUncurryThis(DatePrototype[TO_STRING$1]);
	var thisTimeValue$1 = functionUncurryThis(DatePrototype.getTime);

	// `Date.prototype.toString` method
	// https://tc39.es/ecma262/#sec-date.prototype.tostring
	if (String(new Date(NaN)) != INVALID_DATE) {
	  defineBuiltIn(DatePrototype, TO_STRING$1, function toString() {
	    var value = thisTimeValue$1(this);
	    // eslint-disable-next-line no-self-compare -- NaN check
	    return value === value ? nativeDateToString(this) : INVALID_DATE;
	  });
	}

	var charAt$h = functionUncurryThis(''.charAt);
	var charCodeAt$6 = functionUncurryThis(''.charCodeAt);
	var exec$9 = functionUncurryThis(/./.exec);
	var numberToString$2 = functionUncurryThis(1.0.toString);
	var toUpperCase = functionUncurryThis(''.toUpperCase);

	var raw = /[\w*+\-./@]/;

	var hex$1 = function (code, length) {
	  var result = numberToString$2(code, 16);
	  while (result.length < length) { result = '0' + result; }
	  return result;
	};

	// `escape` method
	// https://tc39.es/ecma262/#sec-escape-string
	_export({ global: true }, {
	  escape: function escape(string) {
	    var str = toString_1(string);
	    var result = '';
	    var length = str.length;
	    var index = 0;
	    var chr, code;
	    while (index < length) {
	      chr = charAt$h(str, index++);
	      if (exec$9(raw, chr)) {
	        result += chr;
	      } else {
	        code = charCodeAt$6(chr, 0);
	        if (code < 256) {
	          result += '%' + hex$1(code, 2);
	        } else {
	          result += '%u' + toUpperCase(hex$1(code, 4));
	        }
	      }
	    } return result;
	  }
	});

	var $Function = Function;
	var concat$3 = functionUncurryThis([].concat);
	var join$8 = functionUncurryThis([].join);
	var factories = {};

	var construct = function (C, argsLength, args) {
	  if (!hasOwnProperty_1(factories, argsLength)) {
	    for (var list = [], i = 0; i < argsLength; i++) { list[i] = 'a[' + i + ']'; }
	    factories[argsLength] = $Function('C,a', 'return new C(' + join$8(list, ',') + ')');
	  } return factories[argsLength](C, args);
	};

	// `Function.prototype.bind` method implementation
	// https://tc39.es/ecma262/#sec-function.prototype.bind
	var functionBind = functionBindNative ? $Function.bind : function bind(that /* , ...args */) {
	  var F = aCallable(this);
	  var Prototype = F.prototype;
	  var partArgs = arraySlice$1(arguments, 1);
	  var boundFunction = function bound(/* args... */) {
	    var args = concat$3(partArgs, arraySlice$1(arguments));
	    return this instanceof boundFunction ? construct(F, args.length, args) : F.apply(that, args);
	  };
	  if (isObject(Prototype)) { boundFunction.prototype = Prototype; }
	  return boundFunction;
	};

	// TODO: Remove from `core-js@4`



	// `Function.prototype.bind` method
	// https://tc39.es/ecma262/#sec-function.prototype.bind
	_export({ target: 'Function', proto: true, forced: Function.bind !== functionBind }, {
	  bind: functionBind
	});

	var HAS_INSTANCE = wellKnownSymbol('hasInstance');
	var FunctionPrototype$1 = Function.prototype;

	// `Function.prototype[@@hasInstance]` method
	// https://tc39.es/ecma262/#sec-function.prototype-@@hasinstance
	if (!(HAS_INSTANCE in FunctionPrototype$1)) {
	  objectDefineProperty.f(FunctionPrototype$1, HAS_INSTANCE, { value: makeBuiltIn_1(function (O) {
	    if (!isCallable(this) || !isObject(O)) { return false; }
	    var P = this.prototype;
	    if (!isObject(P)) { return O instanceof this; }
	    // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
	    while (O = objectGetPrototypeOf(O)) { if (P === O) { return true; } }
	    return false;
	  }, HAS_INSTANCE) });
	}

	var FUNCTION_NAME_EXISTS = functionName.EXISTS;

	var defineProperty$7 = objectDefineProperty.f;

	var FunctionPrototype = Function.prototype;
	var functionToString = functionUncurryThis(FunctionPrototype.toString);
	var nameRE = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/;
	var regExpExec = functionUncurryThis(nameRE.exec);
	var NAME = 'name';

	// Function instances `.name` property
	// https://tc39.es/ecma262/#sec-function-instances-name
	if (descriptors && !FUNCTION_NAME_EXISTS) {
	  defineProperty$7(FunctionPrototype, NAME, {
	    configurable: true,
	    get: function () {
	      try {
	        return regExpExec(nameRE, functionToString(this))[1];
	      } catch (error) {
	        return '';
	      }
	    }
	  });
	}

	// `globalThis` object
	// https://tc39.es/ecma262/#sec-globalthis
	_export({ global: true, forced: global_1.globalThis !== global_1 }, {
	  globalThis: global_1
	});

	// JSON[@@toStringTag] property
	// https://tc39.es/ecma262/#sec-json-@@tostringtag
	setToStringTag(global_1.JSON, 'JSON', true);

	// FF26- bug: ArrayBuffers are non-extensible, but Object.isExtensible does not report it


	var arrayBufferNonExtensible = fails(function () {
	  if (typeof ArrayBuffer == 'function') {
	    var buffer = new ArrayBuffer(8);
	    // eslint-disable-next-line es/no-object-isextensible, es/no-object-defineproperty -- safe
	    if (Object.isExtensible(buffer)) { Object.defineProperty(buffer, 'a', { value: 8 }); }
	  }
	});

	// eslint-disable-next-line es/no-object-isextensible -- safe
	var $isExtensible = Object.isExtensible;
	var FAILS_ON_PRIMITIVES$9 = fails(function () { $isExtensible(1); });

	// `Object.isExtensible` method
	// https://tc39.es/ecma262/#sec-object.isextensible
	var objectIsExtensible = (FAILS_ON_PRIMITIVES$9 || arrayBufferNonExtensible) ? function isExtensible(it) {
	  if (!isObject(it)) { return false; }
	  if (arrayBufferNonExtensible && classofRaw(it) == 'ArrayBuffer') { return false; }
	  return $isExtensible ? $isExtensible(it) : true;
	} : $isExtensible;

	var freezing = !fails(function () {
	  // eslint-disable-next-line es/no-object-isextensible, es/no-object-preventextensions -- required for testing
	  return Object.isExtensible(Object.preventExtensions({}));
	});

	var internalMetadata = createCommonjsModule(function (module) {
	var defineProperty = objectDefineProperty.f;






	var REQUIRED = false;
	var METADATA = uid('meta');
	var id = 0;

	var setMetadata = function (it) {
	  defineProperty(it, METADATA, { value: {
	    objectID: 'O' + id++, // object ID
	    weakData: {}          // weak collections IDs
	  } });
	};

	var fastKey = function (it, create) {
	  // return a primitive with prefix
	  if (!isObject(it)) { return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it; }
	  if (!hasOwnProperty_1(it, METADATA)) {
	    // can't set metadata to uncaught frozen object
	    if (!objectIsExtensible(it)) { return 'F'; }
	    // not necessary to add metadata
	    if (!create) { return 'E'; }
	    // add missing metadata
	    setMetadata(it);
	  // return object ID
	  } return it[METADATA].objectID;
	};

	var getWeakData = function (it, create) {
	  if (!hasOwnProperty_1(it, METADATA)) {
	    // can't set metadata to uncaught frozen object
	    if (!objectIsExtensible(it)) { return true; }
	    // not necessary to add metadata
	    if (!create) { return false; }
	    // add missing metadata
	    setMetadata(it);
	  // return the store of weak collections IDs
	  } return it[METADATA].weakData;
	};

	// add metadata on freeze-family methods calling
	var onFreeze = function (it) {
	  if (freezing && REQUIRED && objectIsExtensible(it) && !hasOwnProperty_1(it, METADATA)) { setMetadata(it); }
	  return it;
	};

	var enable = function () {
	  meta.enable = function () { /* empty */ };
	  REQUIRED = true;
	  var getOwnPropertyNames = objectGetOwnPropertyNames.f;
	  var splice = functionUncurryThis([].splice);
	  var test = {};
	  test[METADATA] = 1;

	  // prevent exposing of metadata key
	  if (getOwnPropertyNames(test).length) {
	    objectGetOwnPropertyNames.f = function (it) {
	      var result = getOwnPropertyNames(it);
	      for (var i = 0, length = result.length; i < length; i++) {
	        if (result[i] === METADATA) {
	          splice(result, i, 1);
	          break;
	        }
	      } return result;
	    };

	    _export({ target: 'Object', stat: true, forced: true }, {
	      getOwnPropertyNames: objectGetOwnPropertyNamesExternal.f
	    });
	  }
	};

	var meta = module.exports = {
	  enable: enable,
	  fastKey: fastKey,
	  getWeakData: getWeakData,
	  onFreeze: onFreeze
	};

	hiddenKeys$1[METADATA] = true;
	});

	var collection = function (CONSTRUCTOR_NAME, wrapper, common) {
	  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
	  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
	  var ADDER = IS_MAP ? 'set' : 'add';
	  var NativeConstructor = global_1[CONSTRUCTOR_NAME];
	  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
	  var Constructor = NativeConstructor;
	  var exported = {};

	  var fixMethod = function (KEY) {
	    var uncurriedNativeMethod = functionUncurryThis(NativePrototype[KEY]);
	    defineBuiltIn(NativePrototype, KEY,
	      KEY == 'add' ? function add(value) {
	        uncurriedNativeMethod(this, value === 0 ? 0 : value);
	        return this;
	      } : KEY == 'delete' ? function (key) {
	        return IS_WEAK && !isObject(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
	      } : KEY == 'get' ? function get(key) {
	        return IS_WEAK && !isObject(key) ? undefined : uncurriedNativeMethod(this, key === 0 ? 0 : key);
	      } : KEY == 'has' ? function has(key) {
	        return IS_WEAK && !isObject(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
	      } : function set(key, value) {
	        uncurriedNativeMethod(this, key === 0 ? 0 : key, value);
	        return this;
	      }
	    );
	  };

	  var REPLACE = isForced_1(
	    CONSTRUCTOR_NAME,
	    !isCallable(NativeConstructor) || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
	      new NativeConstructor().entries().next();
	    }))
	  );

	  if (REPLACE) {
	    // create collection constructor
	    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
	    internalMetadata.enable();
	  } else if (isForced_1(CONSTRUCTOR_NAME, true)) {
	    var instance = new Constructor();
	    // early implementations not supports chaining
	    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
	    // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
	    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
	    // most early implementations doesn't supports iterables, most modern - not close it correctly
	    // eslint-disable-next-line no-new -- required for testing
	    var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable); });
	    // for early implementations -0 and +0 not the same
	    var BUGGY_ZERO = !IS_WEAK && fails(function () {
	      // V8 ~ Chromium 42- fails only with 5+ elements
	      var $instance = new NativeConstructor();
	      var index = 5;
	      while (index--) { $instance[ADDER](index, index); }
	      return !$instance.has(-0);
	    });

	    if (!ACCEPT_ITERABLES) {
	      Constructor = wrapper(function (dummy, iterable) {
	        anInstance(dummy, NativePrototype);
	        var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
	        if (!isNullOrUndefined(iterable)) { iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP }); }
	        return that;
	      });
	      Constructor.prototype = NativePrototype;
	      NativePrototype.constructor = Constructor;
	    }

	    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
	      fixMethod('delete');
	      fixMethod('has');
	      IS_MAP && fixMethod('get');
	    }

	    if (BUGGY_ZERO || HASNT_CHAINING) { fixMethod(ADDER); }

	    // weak collections should not contains .clear method
	    if (IS_WEAK && NativePrototype.clear) { delete NativePrototype.clear; }
	  }

	  exported[CONSTRUCTOR_NAME] = Constructor;
	  _export({ global: true, constructor: true, forced: Constructor != NativeConstructor }, exported);

	  setToStringTag(Constructor, CONSTRUCTOR_NAME);

	  if (!IS_WEAK) { common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP); }

	  return Constructor;
	};

	var defineProperty$6 = objectDefineProperty.f;










	var fastKey = internalMetadata.fastKey;


	var setInternalState$f = internalState.set;
	var internalStateGetterFor$1 = internalState.getterFor;

	var collectionStrong = {
	  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
	    var Constructor = wrapper(function (that, iterable) {
	      anInstance(that, Prototype);
	      setInternalState$f(that, {
	        type: CONSTRUCTOR_NAME,
	        index: objectCreate(null),
	        first: undefined,
	        last: undefined,
	        size: 0
	      });
	      if (!descriptors) { that.size = 0; }
	      if (!isNullOrUndefined(iterable)) { iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP }); }
	    });

	    var Prototype = Constructor.prototype;

	    var getInternalState = internalStateGetterFor$1(CONSTRUCTOR_NAME);

	    var define = function (that, key, value) {
	      var state = getInternalState(that);
	      var entry = getEntry(that, key);
	      var previous, index;
	      // change existing entry
	      if (entry) {
	        entry.value = value;
	      // create new entry
	      } else {
	        state.last = entry = {
	          index: index = fastKey(key, true),
	          key: key,
	          value: value,
	          previous: previous = state.last,
	          next: undefined,
	          removed: false
	        };
	        if (!state.first) { state.first = entry; }
	        if (previous) { previous.next = entry; }
	        if (descriptors) { state.size++; }
	        else { that.size++; }
	        // add to index
	        if (index !== 'F') { state.index[index] = entry; }
	      } return that;
	    };

	    var getEntry = function (that, key) {
	      var state = getInternalState(that);
	      // fast case
	      var index = fastKey(key);
	      var entry;
	      if (index !== 'F') { return state.index[index]; }
	      // frozen object case
	      for (entry = state.first; entry; entry = entry.next) {
	        if (entry.key == key) { return entry; }
	      }
	    };

	    defineBuiltIns(Prototype, {
	      // `{ Map, Set }.prototype.clear()` methods
	      // https://tc39.es/ecma262/#sec-map.prototype.clear
	      // https://tc39.es/ecma262/#sec-set.prototype.clear
	      clear: function clear() {
	        var that = this;
	        var state = getInternalState(that);
	        var data = state.index;
	        var entry = state.first;
	        while (entry) {
	          entry.removed = true;
	          if (entry.previous) { entry.previous = entry.previous.next = undefined; }
	          delete data[entry.index];
	          entry = entry.next;
	        }
	        state.first = state.last = undefined;
	        if (descriptors) { state.size = 0; }
	        else { that.size = 0; }
	      },
	      // `{ Map, Set }.prototype.delete(key)` methods
	      // https://tc39.es/ecma262/#sec-map.prototype.delete
	      // https://tc39.es/ecma262/#sec-set.prototype.delete
	      'delete': function (key) {
	        var that = this;
	        var state = getInternalState(that);
	        var entry = getEntry(that, key);
	        if (entry) {
	          var next = entry.next;
	          var prev = entry.previous;
	          delete state.index[entry.index];
	          entry.removed = true;
	          if (prev) { prev.next = next; }
	          if (next) { next.previous = prev; }
	          if (state.first == entry) { state.first = next; }
	          if (state.last == entry) { state.last = prev; }
	          if (descriptors) { state.size--; }
	          else { that.size--; }
	        } return !!entry;
	      },
	      // `{ Map, Set }.prototype.forEach(callbackfn, thisArg = undefined)` methods
	      // https://tc39.es/ecma262/#sec-map.prototype.foreach
	      // https://tc39.es/ecma262/#sec-set.prototype.foreach
	      forEach: function forEach(callbackfn /* , that = undefined */) {
	        var state = getInternalState(this);
	        var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	        var entry;
	        while (entry = entry ? entry.next : state.first) {
	          boundFunction(entry.value, entry.key, this);
	          // revert to the last existing entry
	          while (entry && entry.removed) { entry = entry.previous; }
	        }
	      },
	      // `{ Map, Set}.prototype.has(key)` methods
	      // https://tc39.es/ecma262/#sec-map.prototype.has
	      // https://tc39.es/ecma262/#sec-set.prototype.has
	      has: function has(key) {
	        return !!getEntry(this, key);
	      }
	    });

	    defineBuiltIns(Prototype, IS_MAP ? {
	      // `Map.prototype.get(key)` method
	      // https://tc39.es/ecma262/#sec-map.prototype.get
	      get: function get(key) {
	        var entry = getEntry(this, key);
	        return entry && entry.value;
	      },
	      // `Map.prototype.set(key, value)` method
	      // https://tc39.es/ecma262/#sec-map.prototype.set
	      set: function set(key, value) {
	        return define(this, key === 0 ? 0 : key, value);
	      }
	    } : {
	      // `Set.prototype.add(value)` method
	      // https://tc39.es/ecma262/#sec-set.prototype.add
	      add: function add(value) {
	        return define(this, value = value === 0 ? 0 : value, value);
	      }
	    });
	    if (descriptors) { defineProperty$6(Prototype, 'size', {
	      get: function () {
	        return getInternalState(this).size;
	      }
	    }); }
	    return Constructor;
	  },
	  setStrong: function (Constructor, CONSTRUCTOR_NAME, IS_MAP) {
	    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
	    var getInternalCollectionState = internalStateGetterFor$1(CONSTRUCTOR_NAME);
	    var getInternalIteratorState = internalStateGetterFor$1(ITERATOR_NAME);
	    // `{ Map, Set }.prototype.{ keys, values, entries, @@iterator }()` methods
	    // https://tc39.es/ecma262/#sec-map.prototype.entries
	    // https://tc39.es/ecma262/#sec-map.prototype.keys
	    // https://tc39.es/ecma262/#sec-map.prototype.values
	    // https://tc39.es/ecma262/#sec-map.prototype-@@iterator
	    // https://tc39.es/ecma262/#sec-set.prototype.entries
	    // https://tc39.es/ecma262/#sec-set.prototype.keys
	    // https://tc39.es/ecma262/#sec-set.prototype.values
	    // https://tc39.es/ecma262/#sec-set.prototype-@@iterator
	    iteratorDefine(Constructor, CONSTRUCTOR_NAME, function (iterated, kind) {
	      setInternalState$f(this, {
	        type: ITERATOR_NAME,
	        target: iterated,
	        state: getInternalCollectionState(iterated),
	        kind: kind,
	        last: undefined
	      });
	    }, function () {
	      var state = getInternalIteratorState(this);
	      var kind = state.kind;
	      var entry = state.last;
	      // revert to the last existing entry
	      while (entry && entry.removed) { entry = entry.previous; }
	      // get next entry
	      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
	        // or finish the iteration
	        state.target = undefined;
	        return createIterResultObject(undefined, true);
	      }
	      // return step by kind
	      if (kind == 'keys') { return createIterResultObject(entry.key, false); }
	      if (kind == 'values') { return createIterResultObject(entry.value, false); }
	      return createIterResultObject([entry.key, entry.value], false);
	    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

	    // `{ Map, Set }.prototype[@@species]` accessors
	    // https://tc39.es/ecma262/#sec-get-map-@@species
	    // https://tc39.es/ecma262/#sec-get-set-@@species
	    setSpecies(CONSTRUCTOR_NAME);
	  }
	};

	// `Map` constructor
	// https://tc39.es/ecma262/#sec-map-objects
	collection('Map', function (init) {
	  return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
	}, collectionStrong);

	var log$8 = Math.log;

	// `Math.log1p` method implementation
	// https://tc39.es/ecma262/#sec-math.log1p
	// eslint-disable-next-line es/no-math-log1p -- safe
	var mathLog1p = Math.log1p || function log1p(x) {
	  var n = +x;
	  return n > -1e-8 && n < 1e-8 ? n - n * n / 2 : log$8(1 + n);
	};

	// eslint-disable-next-line es/no-math-acosh -- required for testing
	var $acosh = Math.acosh;
	var log$7 = Math.log;
	var sqrt$2 = Math.sqrt;
	var LN2$1 = Math.LN2;

	var FORCED$f = !$acosh
	  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
	  || Math.floor($acosh(Number.MAX_VALUE)) != 710
	  // Tor Browser bug: Math.acosh(Infinity) -> NaN
	  || $acosh(Infinity) != Infinity;

	// `Math.acosh` method
	// https://tc39.es/ecma262/#sec-math.acosh
	_export({ target: 'Math', stat: true, forced: FORCED$f }, {
	  acosh: function acosh(x) {
	    var n = +x;
	    return n < 1 ? NaN : n > 94906265.62425156
	      ? log$7(n) + LN2$1
	      : mathLog1p(n - 1 + sqrt$2(n - 1) * sqrt$2(n + 1));
	  }
	});

	// eslint-disable-next-line es/no-math-asinh -- required for testing
	var $asinh = Math.asinh;
	var log$6 = Math.log;
	var sqrt$1 = Math.sqrt;

	function asinh(x) {
	  var n = +x;
	  return !isFinite(n) || n == 0 ? n : n < 0 ? -asinh(-n) : log$6(n + sqrt$1(n * n + 1));
	}

	// `Math.asinh` method
	// https://tc39.es/ecma262/#sec-math.asinh
	// Tor Browser bug: Math.asinh(0) -> -0
	_export({ target: 'Math', stat: true, forced: !($asinh && 1 / $asinh(0) > 0) }, {
	  asinh: asinh
	});

	// eslint-disable-next-line es/no-math-atanh -- required for testing
	var $atanh = Math.atanh;
	var log$5 = Math.log;

	// `Math.atanh` method
	// https://tc39.es/ecma262/#sec-math.atanh
	// Tor Browser bug: Math.atanh(-0) -> 0
	_export({ target: 'Math', stat: true, forced: !($atanh && 1 / $atanh(-0) < 0) }, {
	  atanh: function atanh(x) {
	    var n = +x;
	    return n == 0 ? n : log$5((1 + n) / (1 - n)) / 2;
	  }
	});

	// `Math.sign` method implementation
	// https://tc39.es/ecma262/#sec-math.sign
	// eslint-disable-next-line es/no-math-sign -- safe
	var mathSign = Math.sign || function sign(x) {
	  var n = +x;
	  // eslint-disable-next-line no-self-compare -- NaN check
	  return n == 0 || n != n ? n : n < 0 ? -1 : 1;
	};

	var abs$6 = Math.abs;
	var pow$4 = Math.pow;

	// `Math.cbrt` method
	// https://tc39.es/ecma262/#sec-math.cbrt
	_export({ target: 'Math', stat: true }, {
	  cbrt: function cbrt(x) {
	    var n = +x;
	    return mathSign(n) * pow$4(abs$6(n), 1 / 3);
	  }
	});

	var floor$7 = Math.floor;
	var log$4 = Math.log;
	var LOG2E = Math.LOG2E;

	// `Math.clz32` method
	// https://tc39.es/ecma262/#sec-math.clz32
	_export({ target: 'Math', stat: true }, {
	  clz32: function clz32(x) {
	    var n = x >>> 0;
	    return n ? 31 - floor$7(log$4(n + 0.5) * LOG2E) : 32;
	  }
	});

	// eslint-disable-next-line es/no-math-expm1 -- safe
	var $expm1 = Math.expm1;
	var exp$2 = Math.exp;

	// `Math.expm1` method implementation
	// https://tc39.es/ecma262/#sec-math.expm1
	var mathExpm1 = (!$expm1
	  // Old FF bug
	  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
	  // Tor Browser bug
	  || $expm1(-2e-17) != -2e-17
	) ? function expm1(x) {
	  var n = +x;
	  return n == 0 ? n : n > -1e-6 && n < 1e-6 ? n + n * n / 2 : exp$2(n) - 1;
	} : $expm1;

	// eslint-disable-next-line es/no-math-cosh -- required for testing
	var $cosh = Math.cosh;
	var abs$5 = Math.abs;
	var E$1 = Math.E;

	// `Math.cosh` method
	// https://tc39.es/ecma262/#sec-math.cosh
	_export({ target: 'Math', stat: true, forced: !$cosh || $cosh(710) === Infinity }, {
	  cosh: function cosh(x) {
	    var t = mathExpm1(abs$5(x) - 1) + 1;
	    return (t + 1 / (t * E$1 * E$1)) * (E$1 / 2);
	  }
	});

	// `Math.expm1` method
	// https://tc39.es/ecma262/#sec-math.expm1
	// eslint-disable-next-line es/no-math-expm1 -- required for testing
	_export({ target: 'Math', stat: true, forced: mathExpm1 != Math.expm1 }, { expm1: mathExpm1 });

	var abs$4 = Math.abs;
	var pow$3 = Math.pow;
	var EPSILON = pow$3(2, -52);
	var EPSILON32 = pow$3(2, -23);
	var MAX32 = pow$3(2, 127) * (2 - EPSILON32);
	var MIN32 = pow$3(2, -126);

	var roundTiesToEven = function (n) {
	  return n + 1 / EPSILON - 1 / EPSILON;
	};

	// `Math.fround` method implementation
	// https://tc39.es/ecma262/#sec-math.fround
	// eslint-disable-next-line es/no-math-fround -- safe
	var mathFround = Math.fround || function fround(x) {
	  var n = +x;
	  var $abs = abs$4(n);
	  var $sign = mathSign(n);
	  var a, result;
	  if ($abs < MIN32) { return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32; }
	  a = (1 + EPSILON32 / EPSILON) * $abs;
	  result = a - (a - $abs);
	  // eslint-disable-next-line no-self-compare -- NaN check
	  if (result > MAX32 || result != result) { return $sign * Infinity; }
	  return $sign * result;
	};

	// `Math.fround` method
	// https://tc39.es/ecma262/#sec-math.fround
	_export({ target: 'Math', stat: true }, { fround: mathFround });

	// eslint-disable-next-line es/no-math-hypot -- required for testing
	var $hypot = Math.hypot;
	var abs$3 = Math.abs;
	var sqrt = Math.sqrt;

	// Chrome 77 bug
	// https://bugs.chromium.org/p/v8/issues/detail?id=9546
	var BUGGY = !!$hypot && $hypot(Infinity, NaN) !== Infinity;

	// `Math.hypot` method
	// https://tc39.es/ecma262/#sec-math.hypot
	_export({ target: 'Math', stat: true, arity: 2, forced: BUGGY }, {
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  hypot: function hypot(value1, value2) {
	    var arguments$1 = arguments;

	    var sum = 0;
	    var i = 0;
	    var aLen = arguments.length;
	    var larg = 0;
	    var arg, div;
	    while (i < aLen) {
	      arg = abs$3(arguments$1[i++]);
	      if (larg < arg) {
	        div = larg / arg;
	        sum = sum * div * div + 1;
	        larg = arg;
	      } else if (arg > 0) {
	        div = arg / larg;
	        sum += div * div;
	      } else { sum += arg; }
	    }
	    return larg === Infinity ? Infinity : larg * sqrt(sum);
	  }
	});

	// eslint-disable-next-line es/no-math-imul -- required for testing
	var $imul = Math.imul;

	var FORCED$e = fails(function () {
	  return $imul(0xFFFFFFFF, 5) != -5 || $imul.length != 2;
	});

	// `Math.imul` method
	// https://tc39.es/ecma262/#sec-math.imul
	// some WebKit versions fails with big numbers, some has wrong arity
	_export({ target: 'Math', stat: true, forced: FORCED$e }, {
	  imul: function imul(x, y) {
	    var UINT16 = 0xFFFF;
	    var xn = +x;
	    var yn = +y;
	    var xl = UINT16 & xn;
	    var yl = UINT16 & yn;
	    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
	  }
	});

	var log$3 = Math.log;
	var LOG10E = Math.LOG10E;

	// eslint-disable-next-line es/no-math-log10 -- safe
	var mathLog10 = Math.log10 || function log10(x) {
	  return log$3(x) * LOG10E;
	};

	// `Math.log10` method
	// https://tc39.es/ecma262/#sec-math.log10
	_export({ target: 'Math', stat: true }, {
	  log10: mathLog10
	});

	// `Math.log1p` method
	// https://tc39.es/ecma262/#sec-math.log1p
	_export({ target: 'Math', stat: true }, { log1p: mathLog1p });

	var log$2 = Math.log;
	var LN2 = Math.LN2;

	// `Math.log2` method
	// https://tc39.es/ecma262/#sec-math.log2
	_export({ target: 'Math', stat: true }, {
	  log2: function log2(x) {
	    return log$2(x) / LN2;
	  }
	});

	// `Math.sign` method
	// https://tc39.es/ecma262/#sec-math.sign
	_export({ target: 'Math', stat: true }, {
	  sign: mathSign
	});

	var abs$2 = Math.abs;
	var exp$1 = Math.exp;
	var E = Math.E;

	var FORCED$d = fails(function () {
	  // eslint-disable-next-line es/no-math-sinh -- required for testing
	  return Math.sinh(-2e-17) != -2e-17;
	});

	// `Math.sinh` method
	// https://tc39.es/ecma262/#sec-math.sinh
	// V8 near Chromium 38 has a problem with very small numbers
	_export({ target: 'Math', stat: true, forced: FORCED$d }, {
	  sinh: function sinh(x) {
	    var n = +x;
	    return abs$2(n) < 1 ? (mathExpm1(n) - mathExpm1(-n)) / 2 : (exp$1(n - 1) - exp$1(-n - 1)) * (E / 2);
	  }
	});

	var exp = Math.exp;

	// `Math.tanh` method
	// https://tc39.es/ecma262/#sec-math.tanh
	_export({ target: 'Math', stat: true }, {
	  tanh: function tanh(x) {
	    var n = +x;
	    var a = mathExpm1(n);
	    var b = mathExpm1(-n);
	    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(n) + exp(-n));
	  }
	});

	// Math[@@toStringTag] property
	// https://tc39.es/ecma262/#sec-math-@@tostringtag
	setToStringTag(Math, 'Math', true);

	// `Math.trunc` method
	// https://tc39.es/ecma262/#sec-math.trunc
	_export({ target: 'Math', stat: true }, {
	  trunc: mathTrunc
	});

	// `thisNumberValue` abstract operation
	// https://tc39.es/ecma262/#sec-thisnumbervalue
	var thisNumberValue$1 = functionUncurryThis(1.0.valueOf);

	// a string of all valid unicode whitespaces
	var whitespaces$1 = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
	  '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

	var replace$8 = functionUncurryThis(''.replace);
	var whitespace = '[' + whitespaces$1 + ']';
	var ltrim = RegExp('^' + whitespace + whitespace + '*');
	var rtrim = RegExp(whitespace + whitespace + '*$');

	// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
	var createMethod$3 = function (TYPE) {
	  return function ($this) {
	    var string = toString_1(requireObjectCoercible($this));
	    if (TYPE & 1) { string = replace$8(string, ltrim, ''); }
	    if (TYPE & 2) { string = replace$8(string, rtrim, ''); }
	    return string;
	  };
	};

	var stringTrim = {
	  // `String.prototype.{ trimLeft, trimStart }` methods
	  // https://tc39.es/ecma262/#sec-string.prototype.trimstart
	  start: createMethod$3(1),
	  // `String.prototype.{ trimRight, trimEnd }` methods
	  // https://tc39.es/ecma262/#sec-string.prototype.trimend
	  end: createMethod$3(2),
	  // `String.prototype.trim` method
	  // https://tc39.es/ecma262/#sec-string.prototype.trim
	  trim: createMethod$3(3)
	};

	var getOwnPropertyNames$2 = objectGetOwnPropertyNames.f;
	var getOwnPropertyDescriptor$8 = objectGetOwnPropertyDescriptor.f;
	var defineProperty$5 = objectDefineProperty.f;

	var trim$2 = stringTrim.trim;

	var NUMBER = 'Number';
	var NativeNumber = global_1[NUMBER];
	var NumberPrototype = NativeNumber.prototype;
	var TypeError$5 = global_1.TypeError;
	var arraySlice = functionUncurryThis(''.slice);
	var charCodeAt$5 = functionUncurryThis(''.charCodeAt);

	// `ToNumeric` abstract operation
	// https://tc39.es/ecma262/#sec-tonumeric
	var toNumeric = function (value) {
	  var primValue = toPrimitive(value, 'number');
	  return typeof primValue == 'bigint' ? primValue : toNumber(primValue);
	};

	// `ToNumber` abstract operation
	// https://tc39.es/ecma262/#sec-tonumber
	var toNumber = function (argument) {
	  var it = toPrimitive(argument, 'number');
	  var first, third, radix, maxCode, digits, length, index, code;
	  if (isSymbol(it)) { throw TypeError$5('Cannot convert a Symbol value to a number'); }
	  if (typeof it == 'string' && it.length > 2) {
	    it = trim$2(it);
	    first = charCodeAt$5(it, 0);
	    if (first === 43 || first === 45) {
	      third = charCodeAt$5(it, 2);
	      if (third === 88 || third === 120) { return NaN; } // Number('+0x1') should be NaN, old V8 fix
	    } else if (first === 48) {
	      switch (charCodeAt$5(it, 1)) {
	        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
	        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
	        default: return +it;
	      }
	      digits = arraySlice(it, 2);
	      length = digits.length;
	      for (index = 0; index < length; index++) {
	        code = charCodeAt$5(digits, index);
	        // parseInt parses a string to a first unavailable symbol
	        // but ToNumber should return NaN if a string contains unavailable symbols
	        if (code < 48 || code > maxCode) { return NaN; }
	      } return parseInt(digits, radix);
	    }
	  } return +it;
	};

	// `Number` constructor
	// https://tc39.es/ecma262/#sec-number-constructor
	if (isForced_1(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
	  var NumberWrapper = function Number(value) {
	    var n = arguments.length < 1 ? 0 : NativeNumber(toNumeric(value));
	    var dummy = this;
	    // check on 1..constructor(foo) case
	    return objectIsPrototypeOf(NumberPrototype, dummy) && fails(function () { thisNumberValue$1(dummy); })
	      ? inheritIfRequired(Object(n), dummy, NumberWrapper) : n;
	  };
	  for (var keys$1 = descriptors ? getOwnPropertyNames$2(NativeNumber) : (
	    // ES3:
	    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
	    // ES2015 (in case, if modules with ES2015 Number statics required before):
	    'EPSILON,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,isFinite,isInteger,isNaN,isSafeInteger,parseFloat,parseInt,' +
	    // ESNext
	    'fromString,range'
	  ).split(','), j = 0, key$2; keys$1.length > j; j++) {
	    if (hasOwnProperty_1(NativeNumber, key$2 = keys$1[j]) && !hasOwnProperty_1(NumberWrapper, key$2)) {
	      defineProperty$5(NumberWrapper, key$2, getOwnPropertyDescriptor$8(NativeNumber, key$2));
	    }
	  }
	  NumberWrapper.prototype = NumberPrototype;
	  NumberPrototype.constructor = NumberWrapper;
	  defineBuiltIn(global_1, NUMBER, NumberWrapper, { constructor: true });
	}

	// `Number.EPSILON` constant
	// https://tc39.es/ecma262/#sec-number.epsilon
	_export({ target: 'Number', stat: true, nonConfigurable: true, nonWritable: true }, {
	  EPSILON: Math.pow(2, -52)
	});

	var globalIsFinite = global_1.isFinite;

	// `Number.isFinite` method
	// https://tc39.es/ecma262/#sec-number.isfinite
	// eslint-disable-next-line es/no-number-isfinite -- safe
	var numberIsFinite = Number.isFinite || function isFinite(it) {
	  return typeof it == 'number' && globalIsFinite(it);
	};

	// `Number.isFinite` method
	// https://tc39.es/ecma262/#sec-number.isfinite
	_export({ target: 'Number', stat: true }, { isFinite: numberIsFinite });

	var floor$6 = Math.floor;

	// `IsIntegralNumber` abstract operation
	// https://tc39.es/ecma262/#sec-isintegralnumber
	// eslint-disable-next-line es/no-number-isinteger -- safe
	var isIntegralNumber = Number.isInteger || function isInteger(it) {
	  return !isObject(it) && isFinite(it) && floor$6(it) === it;
	};

	// `Number.isInteger` method
	// https://tc39.es/ecma262/#sec-number.isinteger
	_export({ target: 'Number', stat: true }, {
	  isInteger: isIntegralNumber
	});

	// `Number.isNaN` method
	// https://tc39.es/ecma262/#sec-number.isnan
	_export({ target: 'Number', stat: true }, {
	  isNaN: function isNaN(number) {
	    // eslint-disable-next-line no-self-compare -- NaN check
	    return number != number;
	  }
	});

	var abs$1 = Math.abs;

	// `Number.isSafeInteger` method
	// https://tc39.es/ecma262/#sec-number.issafeinteger
	_export({ target: 'Number', stat: true }, {
	  isSafeInteger: function isSafeInteger(number) {
	    return isIntegralNumber(number) && abs$1(number) <= 0x1FFFFFFFFFFFFF;
	  }
	});

	// `Number.MAX_SAFE_INTEGER` constant
	// https://tc39.es/ecma262/#sec-number.max_safe_integer
	_export({ target: 'Number', stat: true, nonConfigurable: true, nonWritable: true }, {
	  MAX_SAFE_INTEGER: 0x1FFFFFFFFFFFFF
	});

	// `Number.MIN_SAFE_INTEGER` constant
	// https://tc39.es/ecma262/#sec-number.min_safe_integer
	_export({ target: 'Number', stat: true, nonConfigurable: true, nonWritable: true }, {
	  MIN_SAFE_INTEGER: -0x1FFFFFFFFFFFFF
	});

	var trim$1 = stringTrim.trim;


	var charAt$g = functionUncurryThis(''.charAt);
	var $parseFloat = global_1.parseFloat;
	var Symbol$2 = global_1.Symbol;
	var ITERATOR$5 = Symbol$2 && Symbol$2.iterator;
	var FORCED$c = 1 / $parseFloat(whitespaces$1 + '-0') !== -Infinity
	  // MS Edge 18- broken with boxed symbols
	  || (ITERATOR$5 && !fails(function () { $parseFloat(Object(ITERATOR$5)); }));

	// `parseFloat` method
	// https://tc39.es/ecma262/#sec-parsefloat-string
	var numberParseFloat = FORCED$c ? function parseFloat(string) {
	  var trimmedString = trim$1(toString_1(string));
	  var result = $parseFloat(trimmedString);
	  return result === 0 && charAt$g(trimmedString, 0) == '-' ? -0 : result;
	} : $parseFloat;

	// `Number.parseFloat` method
	// https://tc39.es/ecma262/#sec-number.parseFloat
	// eslint-disable-next-line es/no-number-parsefloat -- required for testing
	_export({ target: 'Number', stat: true, forced: Number.parseFloat != numberParseFloat }, {
	  parseFloat: numberParseFloat
	});

	var trim = stringTrim.trim;


	var $parseInt = global_1.parseInt;
	var Symbol$1 = global_1.Symbol;
	var ITERATOR$4 = Symbol$1 && Symbol$1.iterator;
	var hex = /^[+-]?0x/i;
	var exec$8 = functionUncurryThis(hex.exec);
	var FORCED$b = $parseInt(whitespaces$1 + '08') !== 8 || $parseInt(whitespaces$1 + '0x16') !== 22
	  // MS Edge 18- broken with boxed symbols
	  || (ITERATOR$4 && !fails(function () { $parseInt(Object(ITERATOR$4)); }));

	// `parseInt` method
	// https://tc39.es/ecma262/#sec-parseint-string-radix
	var numberParseInt = FORCED$b ? function parseInt(string, radix) {
	  var S = trim(toString_1(string));
	  return $parseInt(S, (radix >>> 0) || (exec$8(hex, S) ? 16 : 10));
	} : $parseInt;

	// `Number.parseInt` method
	// https://tc39.es/ecma262/#sec-number.parseint
	// eslint-disable-next-line es/no-number-parseint -- required for testing
	_export({ target: 'Number', stat: true, forced: Number.parseInt != numberParseInt }, {
	  parseInt: numberParseInt
	});

	var $RangeError$9 = RangeError;
	var $String$1 = String;
	var $isFinite = isFinite;
	var abs = Math.abs;
	var floor$5 = Math.floor;
	var pow$2 = Math.pow;
	var round = Math.round;
	var nativeToExponential = functionUncurryThis(1.0.toExponential);
	var repeat$1 = functionUncurryThis(stringRepeat);
	var stringSlice$e = functionUncurryThis(''.slice);

	// Edge 17-
	var ROUNDS_PROPERLY = nativeToExponential(-6.9e-11, 4) === '-6.9000e-11'
	  // IE11- && Edge 14-
	  && nativeToExponential(1.255, 2) === '1.25e+0'
	  // FF86-, V8 ~ Chrome 49-50
	  && nativeToExponential(12345, 3) === '1.235e+4'
	  // FF86-, V8 ~ Chrome 49-50
	  && nativeToExponential(25, 0) === '3e+1';

	// IE8-
	var THROWS_ON_INFINITY_FRACTION = fails(function () {
	  nativeToExponential(1, Infinity);
	}) && fails(function () {
	  nativeToExponential(1, -Infinity);
	});

	// Safari <11 && FF <50
	var PROPER_NON_FINITE_THIS_CHECK = !fails(function () {
	  nativeToExponential(Infinity, Infinity);
	}) && !fails(function () {
	  nativeToExponential(NaN, Infinity);
	});

	var FORCED$a = !ROUNDS_PROPERLY || !THROWS_ON_INFINITY_FRACTION || !PROPER_NON_FINITE_THIS_CHECK;

	// `Number.prototype.toExponential` method
	// https://tc39.es/ecma262/#sec-number.prototype.toexponential
	_export({ target: 'Number', proto: true, forced: FORCED$a }, {
	  toExponential: function toExponential(fractionDigits) {
	    var x = thisNumberValue$1(this);
	    if (fractionDigits === undefined) { return nativeToExponential(x); }
	    var f = toIntegerOrInfinity(fractionDigits);
	    if (!$isFinite(x)) { return String(x); }
	    // TODO: ES2018 increased the maximum number of fraction digits to 100, need to improve the implementation
	    if (f < 0 || f > 20) { throw $RangeError$9('Incorrect fraction digits'); }
	    if (ROUNDS_PROPERLY) { return nativeToExponential(x, f); }
	    var s = '';
	    var m = '';
	    var e = 0;
	    var c = '';
	    var d = '';
	    if (x < 0) {
	      s = '-';
	      x = -x;
	    }
	    if (x === 0) {
	      e = 0;
	      m = repeat$1('0', f + 1);
	    } else {
	      // this block is based on https://gist.github.com/SheetJSDev/1100ad56b9f856c95299ed0e068eea08
	      // TODO: improve accuracy with big fraction digits
	      var l = mathLog10(x);
	      e = floor$5(l);
	      var n = 0;
	      var w = pow$2(10, e - f);
	      n = round(x / w);
	      if (2 * x >= (2 * n + 1) * w) {
	        n += 1;
	      }
	      if (n >= pow$2(10, f + 1)) {
	        n /= 10;
	        e += 1;
	      }
	      m = $String$1(n);
	    }
	    if (f !== 0) {
	      m = stringSlice$e(m, 0, 1) + '.' + stringSlice$e(m, 1);
	    }
	    if (e === 0) {
	      c = '+';
	      d = '0';
	    } else {
	      c = e > 0 ? '+' : '-';
	      d = $String$1(abs(e));
	    }
	    m += 'e' + c + d;
	    return s + m;
	  }
	});

	var $RangeError$8 = RangeError;
	var $String = String;
	var floor$4 = Math.floor;
	var repeat = functionUncurryThis(stringRepeat);
	var stringSlice$d = functionUncurryThis(''.slice);
	var nativeToFixed = functionUncurryThis(1.0.toFixed);

	var pow$1 = function (x, n, acc) {
	  return n === 0 ? acc : n % 2 === 1 ? pow$1(x, n - 1, acc * x) : pow$1(x * x, n / 2, acc);
	};

	var log$1 = function (x) {
	  var n = 0;
	  var x2 = x;
	  while (x2 >= 4096) {
	    n += 12;
	    x2 /= 4096;
	  }
	  while (x2 >= 2) {
	    n += 1;
	    x2 /= 2;
	  } return n;
	};

	var multiply = function (data, n, c) {
	  var index = -1;
	  var c2 = c;
	  while (++index < 6) {
	    c2 += n * data[index];
	    data[index] = c2 % 1e7;
	    c2 = floor$4(c2 / 1e7);
	  }
	};

	var divide = function (data, n) {
	  var index = 6;
	  var c = 0;
	  while (--index >= 0) {
	    c += data[index];
	    data[index] = floor$4(c / n);
	    c = (c % n) * 1e7;
	  }
	};

	var dataToString = function (data) {
	  var index = 6;
	  var s = '';
	  while (--index >= 0) {
	    if (s !== '' || index === 0 || data[index] !== 0) {
	      var t = $String(data[index]);
	      s = s === '' ? t : s + repeat('0', 7 - t.length) + t;
	    }
	  } return s;
	};

	var FORCED$9 = fails(function () {
	  return nativeToFixed(0.00008, 3) !== '0.000' ||
	    nativeToFixed(0.9, 0) !== '1' ||
	    nativeToFixed(1.255, 2) !== '1.25' ||
	    nativeToFixed(1000000000000000128.0, 0) !== '1000000000000000128';
	}) || !fails(function () {
	  // V8 ~ Android 4.3-
	  nativeToFixed({});
	});

	// `Number.prototype.toFixed` method
	// https://tc39.es/ecma262/#sec-number.prototype.tofixed
	_export({ target: 'Number', proto: true, forced: FORCED$9 }, {
	  toFixed: function toFixed(fractionDigits) {
	    var number = thisNumberValue$1(this);
	    var fractDigits = toIntegerOrInfinity(fractionDigits);
	    var data = [0, 0, 0, 0, 0, 0];
	    var sign = '';
	    var result = '0';
	    var e, z, j, k;

	    // TODO: ES2018 increased the maximum number of fraction digits to 100, need to improve the implementation
	    if (fractDigits < 0 || fractDigits > 20) { throw $RangeError$8('Incorrect fraction digits'); }
	    // eslint-disable-next-line no-self-compare -- NaN check
	    if (number != number) { return 'NaN'; }
	    if (number <= -1e21 || number >= 1e21) { return $String(number); }
	    if (number < 0) {
	      sign = '-';
	      number = -number;
	    }
	    if (number > 1e-21) {
	      e = log$1(number * pow$1(2, 69, 1)) - 69;
	      z = e < 0 ? number * pow$1(2, -e, 1) : number / pow$1(2, e, 1);
	      z *= 0x10000000000000;
	      e = 52 - e;
	      if (e > 0) {
	        multiply(data, 0, z);
	        j = fractDigits;
	        while (j >= 7) {
	          multiply(data, 1e7, 0);
	          j -= 7;
	        }
	        multiply(data, pow$1(10, j, 1), 0);
	        j = e - 1;
	        while (j >= 23) {
	          divide(data, 1 << 23);
	          j -= 23;
	        }
	        divide(data, 1 << j);
	        multiply(data, 1, 1);
	        divide(data, 2);
	        result = dataToString(data);
	      } else {
	        multiply(data, 0, z);
	        multiply(data, 1 << -e, 0);
	        result = dataToString(data) + repeat('0', fractDigits);
	      }
	    }
	    if (fractDigits > 0) {
	      k = result.length;
	      result = sign + (k <= fractDigits
	        ? '0.' + repeat('0', fractDigits - k) + result
	        : stringSlice$d(result, 0, k - fractDigits) + '.' + stringSlice$d(result, k - fractDigits));
	    } else {
	      result = sign + result;
	    } return result;
	  }
	});

	var nativeToPrecision = functionUncurryThis(1.0.toPrecision);

	var FORCED$8 = fails(function () {
	  // IE7-
	  return nativeToPrecision(1, undefined) !== '1';
	}) || !fails(function () {
	  // V8 ~ Android 4.3-
	  nativeToPrecision({});
	});

	// `Number.prototype.toPrecision` method
	// https://tc39.es/ecma262/#sec-number.prototype.toprecision
	_export({ target: 'Number', proto: true, forced: FORCED$8 }, {
	  toPrecision: function toPrecision(precision) {
	    return precision === undefined
	      ? nativeToPrecision(thisNumberValue$1(this))
	      : nativeToPrecision(thisNumberValue$1(this), precision);
	  }
	});

	// eslint-disable-next-line es/no-object-assign -- safe
	var $assign = Object.assign;
	// eslint-disable-next-line es/no-object-defineproperty -- required for testing
	var defineProperty$4 = Object.defineProperty;
	var concat$2 = functionUncurryThis([].concat);

	// `Object.assign` method
	// https://tc39.es/ecma262/#sec-object.assign
	var objectAssign = !$assign || fails(function () {
	  // should have correct order of operations (Edge bug)
	  if (descriptors && $assign({ b: 1 }, $assign(defineProperty$4({}, 'a', {
	    enumerable: true,
	    get: function () {
	      defineProperty$4(this, 'b', {
	        value: 3,
	        enumerable: false
	      });
	    }
	  }), { b: 2 })).b !== 1) { return true; }
	  // should work with symbols and should have deterministic property order (V8 bug)
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line es/no-symbol -- safe
	  var symbol = Symbol();
	  var alphabet = 'abcdefghijklmnopqrst';
	  A[symbol] = 7;
	  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
	  return $assign({}, A)[symbol] != 7 || objectKeys$1($assign({}, B)).join('') != alphabet;
	}) ? function assign(target, source) {
	  var arguments$1 = arguments;
	 // eslint-disable-line no-unused-vars -- required for `.length`
	  var T = toObject(target);
	  var argumentsLength = arguments.length;
	  var index = 1;
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  var propertyIsEnumerable = objectPropertyIsEnumerable.f;
	  while (argumentsLength > index) {
	    var S = indexedObject(arguments$1[index++]);
	    var keys = getOwnPropertySymbols ? concat$2(objectKeys$1(S), getOwnPropertySymbols(S)) : objectKeys$1(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) {
	      key = keys[j++];
	      if (!descriptors || functionCall(propertyIsEnumerable, S, key)) { T[key] = S[key]; }
	    }
	  } return T;
	} : $assign;

	// `Object.assign` method
	// https://tc39.es/ecma262/#sec-object.assign
	// eslint-disable-next-line es/no-object-assign -- required for testing
	_export({ target: 'Object', stat: true, arity: 2, forced: Object.assign !== objectAssign }, {
	  assign: objectAssign
	});

	// TODO: Remove from `core-js@4`




	// `Object.create` method
	// https://tc39.es/ecma262/#sec-object.create
	_export({ target: 'Object', stat: true, sham: !descriptors }, {
	  create: objectCreate
	});

	// Forced replacement object prototype accessors methods
	var objectPrototypeAccessorsForced = !fails(function () {
	  // This feature detection crashes old WebKit
	  // https://github.com/zloirock/core-js/issues/232
	  if (engineWebkitVersion && engineWebkitVersion < 535) { return; }
	  var key = Math.random();
	  // In FF throws only define methods
	  // eslint-disable-next-line no-undef, no-useless-call, es/no-legacy-object-prototype-accessor-methods -- required for testing
	  __defineSetter__.call(null, key, function () { /* empty */ });
	  delete global_1[key];
	});

	// `Object.prototype.__defineGetter__` method
	// https://tc39.es/ecma262/#sec-object.prototype.__defineGetter__
	if (descriptors) {
	  _export({ target: 'Object', proto: true, forced: objectPrototypeAccessorsForced }, {
	    __defineGetter__: function __defineGetter__(P, getter) {
	      objectDefineProperty.f(toObject(this), P, { get: aCallable(getter), enumerable: true, configurable: true });
	    }
	  });
	}

	var defineProperties$1 = objectDefineProperties.f;

	// `Object.defineProperties` method
	// https://tc39.es/ecma262/#sec-object.defineproperties
	// eslint-disable-next-line es/no-object-defineproperties -- safe
	_export({ target: 'Object', stat: true, forced: Object.defineProperties !== defineProperties$1, sham: !descriptors }, {
	  defineProperties: defineProperties$1
	});

	var defineProperty$3 = objectDefineProperty.f;

	// `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty
	// eslint-disable-next-line es/no-object-defineproperty -- safe
	_export({ target: 'Object', stat: true, forced: Object.defineProperty !== defineProperty$3, sham: !descriptors }, {
	  defineProperty: defineProperty$3
	});

	// `Object.prototype.__defineSetter__` method
	// https://tc39.es/ecma262/#sec-object.prototype.__defineSetter__
	if (descriptors) {
	  _export({ target: 'Object', proto: true, forced: objectPrototypeAccessorsForced }, {
	    __defineSetter__: function __defineSetter__(P, setter) {
	      objectDefineProperty.f(toObject(this), P, { set: aCallable(setter), enumerable: true, configurable: true });
	    }
	  });
	}

	var $propertyIsEnumerable = objectPropertyIsEnumerable.f;

	var propertyIsEnumerable = functionUncurryThis($propertyIsEnumerable);
	var push$h = functionUncurryThis([].push);

	// `Object.{ entries, values }` methods implementation
	var createMethod$2 = function (TO_ENTRIES) {
	  return function (it) {
	    var O = toIndexedObject(it);
	    var keys = objectKeys$1(O);
	    var length = keys.length;
	    var i = 0;
	    var result = [];
	    var key;
	    while (length > i) {
	      key = keys[i++];
	      if (!descriptors || propertyIsEnumerable(O, key)) {
	        push$h(result, TO_ENTRIES ? [key, O[key]] : O[key]);
	      }
	    }
	    return result;
	  };
	};

	var objectToArray = {
	  // `Object.entries` method
	  // https://tc39.es/ecma262/#sec-object.entries
	  entries: createMethod$2(true),
	  // `Object.values` method
	  // https://tc39.es/ecma262/#sec-object.values
	  values: createMethod$2(false)
	};

	var $entries = objectToArray.entries;

	// `Object.entries` method
	// https://tc39.es/ecma262/#sec-object.entries
	_export({ target: 'Object', stat: true }, {
	  entries: function entries(O) {
	    return $entries(O);
	  }
	});

	var onFreeze$2 = internalMetadata.onFreeze;

	// eslint-disable-next-line es/no-object-freeze -- safe
	var $freeze = Object.freeze;
	var FAILS_ON_PRIMITIVES$8 = fails(function () { $freeze(1); });

	// `Object.freeze` method
	// https://tc39.es/ecma262/#sec-object.freeze
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$8, sham: !freezing }, {
	  freeze: function freeze(it) {
	    return $freeze && isObject(it) ? $freeze(onFreeze$2(it)) : it;
	  }
	});

	// `Object.fromEntries` method
	// https://github.com/tc39/proposal-object-from-entries
	_export({ target: 'Object', stat: true }, {
	  fromEntries: function fromEntries(iterable) {
	    var obj = {};
	    iterate(iterable, function (k, v) {
	      createProperty(obj, k, v);
	    }, { AS_ENTRIES: true });
	    return obj;
	  }
	});

	var nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;


	var FAILS_ON_PRIMITIVES$7 = fails(function () { nativeGetOwnPropertyDescriptor(1); });
	var FORCED$7 = !descriptors || FAILS_ON_PRIMITIVES$7;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
	_export({ target: 'Object', stat: true, forced: FORCED$7, sham: !descriptors }, {
	  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
	    return nativeGetOwnPropertyDescriptor(toIndexedObject(it), key);
	  }
	});

	// `Object.getOwnPropertyDescriptors` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
	_export({ target: 'Object', stat: true, sham: !descriptors }, {
	  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
	    var O = toIndexedObject(object);
	    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	    var keys = ownKeys(O);
	    var result = {};
	    var index = 0;
	    var key, descriptor;
	    while (keys.length > index) {
	      descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
	      if (descriptor !== undefined) { createProperty(result, key, descriptor); }
	    }
	    return result;
	  }
	});

	var getOwnPropertyNames$1 = objectGetOwnPropertyNamesExternal.f;

	// eslint-disable-next-line es/no-object-getownpropertynames -- required for testing
	var FAILS_ON_PRIMITIVES$6 = fails(function () { return !Object.getOwnPropertyNames(1); });

	// `Object.getOwnPropertyNames` method
	// https://tc39.es/ecma262/#sec-object.getownpropertynames
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$6 }, {
	  getOwnPropertyNames: getOwnPropertyNames$1
	});

	var FAILS_ON_PRIMITIVES$5 = fails(function () { objectGetPrototypeOf(1); });

	// `Object.getPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.getprototypeof
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$5, sham: !correctPrototypeGetter }, {
	  getPrototypeOf: function getPrototypeOf(it) {
	    return objectGetPrototypeOf(toObject(it));
	  }
	});

	// `Object.hasOwn` method
	// https://github.com/tc39/proposal-accessible-object-hasownproperty
	_export({ target: 'Object', stat: true }, {
	  hasOwn: hasOwnProperty_1
	});

	// `SameValue` abstract operation
	// https://tc39.es/ecma262/#sec-samevalue
	// eslint-disable-next-line es/no-object-is -- safe
	var sameValue = Object.is || function is(x, y) {
	  // eslint-disable-next-line no-self-compare -- NaN check
	  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
	};

	// `Object.is` method
	// https://tc39.es/ecma262/#sec-object.is
	_export({ target: 'Object', stat: true }, {
	  is: sameValue
	});

	// `Object.isExtensible` method
	// https://tc39.es/ecma262/#sec-object.isextensible
	// eslint-disable-next-line es/no-object-isextensible -- safe
	_export({ target: 'Object', stat: true, forced: Object.isExtensible !== objectIsExtensible }, {
	  isExtensible: objectIsExtensible
	});

	// eslint-disable-next-line es/no-object-isfrozen -- safe
	var $isFrozen = Object.isFrozen;
	var FAILS_ON_PRIMITIVES$4 = fails(function () { $isFrozen(1); });

	// `Object.isFrozen` method
	// https://tc39.es/ecma262/#sec-object.isfrozen
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$4 || arrayBufferNonExtensible }, {
	  isFrozen: function isFrozen(it) {
	    if (!isObject(it)) { return true; }
	    if (arrayBufferNonExtensible && classofRaw(it) == 'ArrayBuffer') { return true; }
	    return $isFrozen ? $isFrozen(it) : false;
	  }
	});

	// eslint-disable-next-line es/no-object-issealed -- safe
	var $isSealed = Object.isSealed;
	var FAILS_ON_PRIMITIVES$3 = fails(function () { $isSealed(1); });

	// `Object.isSealed` method
	// https://tc39.es/ecma262/#sec-object.issealed
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$3 || arrayBufferNonExtensible }, {
	  isSealed: function isSealed(it) {
	    if (!isObject(it)) { return true; }
	    if (arrayBufferNonExtensible && classofRaw(it) == 'ArrayBuffer') { return true; }
	    return $isSealed ? $isSealed(it) : false;
	  }
	});

	var FAILS_ON_PRIMITIVES$2 = fails(function () { objectKeys$1(1); });

	// `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$2 }, {
	  keys: function keys(it) {
	    return objectKeys$1(toObject(it));
	  }
	});

	var getOwnPropertyDescriptor$7 = objectGetOwnPropertyDescriptor.f;

	// `Object.prototype.__lookupGetter__` method
	// https://tc39.es/ecma262/#sec-object.prototype.__lookupGetter__
	if (descriptors) {
	  _export({ target: 'Object', proto: true, forced: objectPrototypeAccessorsForced }, {
	    __lookupGetter__: function __lookupGetter__(P) {
	      var O = toObject(this);
	      var key = toPropertyKey(P);
	      var desc;
	      do {
	        if (desc = getOwnPropertyDescriptor$7(O, key)) { return desc.get; }
	      } while (O = objectGetPrototypeOf(O));
	    }
	  });
	}

	var getOwnPropertyDescriptor$6 = objectGetOwnPropertyDescriptor.f;

	// `Object.prototype.__lookupSetter__` method
	// https://tc39.es/ecma262/#sec-object.prototype.__lookupSetter__
	if (descriptors) {
	  _export({ target: 'Object', proto: true, forced: objectPrototypeAccessorsForced }, {
	    __lookupSetter__: function __lookupSetter__(P) {
	      var O = toObject(this);
	      var key = toPropertyKey(P);
	      var desc;
	      do {
	        if (desc = getOwnPropertyDescriptor$6(O, key)) { return desc.set; }
	      } while (O = objectGetPrototypeOf(O));
	    }
	  });
	}

	var onFreeze$1 = internalMetadata.onFreeze;



	// eslint-disable-next-line es/no-object-preventextensions -- safe
	var $preventExtensions = Object.preventExtensions;
	var FAILS_ON_PRIMITIVES$1 = fails(function () { $preventExtensions(1); });

	// `Object.preventExtensions` method
	// https://tc39.es/ecma262/#sec-object.preventextensions
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$1, sham: !freezing }, {
	  preventExtensions: function preventExtensions(it) {
	    return $preventExtensions && isObject(it) ? $preventExtensions(onFreeze$1(it)) : it;
	  }
	});

	var defineBuiltInAccessor = function (target, name, descriptor) {
	  if (descriptor.get) { makeBuiltIn_1(descriptor.get, name, { getter: true }); }
	  if (descriptor.set) { makeBuiltIn_1(descriptor.set, name, { setter: true }); }
	  return objectDefineProperty.f(target, name, descriptor);
	};

	// eslint-disable-next-line es/no-object-getprototypeof -- safe
	var getPrototypeOf = Object.getPrototypeOf;
	// eslint-disable-next-line es/no-object-setprototypeof -- safe
	var setPrototypeOf = Object.setPrototypeOf;
	var ObjectPrototype$1 = Object.prototype;
	var PROTO = '__proto__';

	// `Object.prototype.__proto__` accessor
	// https://tc39.es/ecma262/#sec-object.prototype.__proto__
	if (descriptors && getPrototypeOf && setPrototypeOf && !(PROTO in ObjectPrototype$1)) { try {
	  defineBuiltInAccessor(ObjectPrototype$1, PROTO, {
	    configurable: true,
	    get: function __proto__() {
	      return getPrototypeOf(toObject(this));
	    },
	    set: function __proto__(proto) {
	      var O = requireObjectCoercible(this);
	      if (!isObject(proto) && proto !== null || !isObject(O)) { return; }
	      setPrototypeOf(O, proto);
	    }
	  });
	} catch (error) { /* empty */ } }

	var onFreeze = internalMetadata.onFreeze;



	// eslint-disable-next-line es/no-object-seal -- safe
	var $seal = Object.seal;
	var FAILS_ON_PRIMITIVES = fails(function () { $seal(1); });

	// `Object.seal` method
	// https://tc39.es/ecma262/#sec-object.seal
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !freezing }, {
	  seal: function seal(it) {
	    return $seal && isObject(it) ? $seal(onFreeze(it)) : it;
	  }
	});

	// `Object.setPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.setprototypeof
	_export({ target: 'Object', stat: true }, {
	  setPrototypeOf: objectSetPrototypeOf
	});

	// `Object.prototype.toString` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.tostring
	var objectToString = toStringTagSupport ? {}.toString : function toString() {
	  return '[object ' + classof(this) + ']';
	};

	// `Object.prototype.toString` method
	// https://tc39.es/ecma262/#sec-object.prototype.tostring
	if (!toStringTagSupport) {
	  defineBuiltIn(Object.prototype, 'toString', objectToString, { unsafe: true });
	}

	var $values = objectToArray.values;

	// `Object.values` method
	// https://tc39.es/ecma262/#sec-object.values
	_export({ target: 'Object', stat: true }, {
	  values: function values(O) {
	    return $values(O);
	  }
	});

	// `parseFloat` method
	// https://tc39.es/ecma262/#sec-parsefloat-string
	_export({ global: true, forced: parseFloat != numberParseFloat }, {
	  parseFloat: numberParseFloat
	});

	// `parseInt` method
	// https://tc39.es/ecma262/#sec-parseint-string-radix
	_export({ global: true, forced: parseInt != numberParseInt }, {
	  parseInt: numberParseInt
	});

	var $TypeError$k = TypeError;

	var validateArgumentsLength = function (passed, required) {
	  if (passed < required) { throw $TypeError$k('Not enough arguments'); }
	  return passed;
	};

	var engineIsIos = /(?:ipad|iphone|ipod).*applewebkit/i.test(engineUserAgent);

	var set$1 = global_1.setImmediate;
	var clear = global_1.clearImmediate;
	var process$4 = global_1.process;
	var Dispatch = global_1.Dispatch;
	var Function$2 = global_1.Function;
	var MessageChannel = global_1.MessageChannel;
	var String$1 = global_1.String;
	var counter = 0;
	var queue$1 = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var $location, defer, channel, port;

	try {
	  // Deno throws a ReferenceError on `location` access without `--location` flag
	  $location = global_1.location;
	} catch (error) { /* empty */ }

	var run = function (id) {
	  if (hasOwnProperty_1(queue$1, id)) {
	    var fn = queue$1[id];
	    delete queue$1[id];
	    fn();
	  }
	};

	var runner = function (id) {
	  return function () {
	    run(id);
	  };
	};

	var listener = function (event) {
	  run(event.data);
	};

	var post = function (id) {
	  // old engines have not location.origin
	  global_1.postMessage(String$1(id), $location.protocol + '//' + $location.host);
	};

	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if (!set$1 || !clear) {
	  set$1 = function setImmediate(handler) {
	    validateArgumentsLength(arguments.length, 1);
	    var fn = isCallable(handler) ? handler : Function$2(handler);
	    var args = arraySlice$1(arguments, 1);
	    queue$1[++counter] = function () {
	      functionApply(fn, undefined, args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clear = function clearImmediate(id) {
	    delete queue$1[id];
	  };
	  // Node.js 0.8-
	  if (engineIsNode) {
	    defer = function (id) {
	      process$4.nextTick(runner(id));
	    };
	  // Sphere (JS game engine) Dispatch API
	  } else if (Dispatch && Dispatch.now) {
	    defer = function (id) {
	      Dispatch.now(runner(id));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  // except iOS - https://github.com/zloirock/core-js/issues/624
	  } else if (MessageChannel && !engineIsIos) {
	    channel = new MessageChannel();
	    port = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = functionBindContext(port.postMessage, port);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if (
	    global_1.addEventListener &&
	    isCallable(global_1.postMessage) &&
	    !global_1.importScripts &&
	    $location && $location.protocol !== 'file:' &&
	    !fails(post)
	  ) {
	    defer = post;
	    global_1.addEventListener('message', listener, false);
	  // IE8-
	  } else if (ONREADYSTATECHANGE in documentCreateElement('script')) {
	    defer = function (id) {
	      html.appendChild(documentCreateElement('script'))[ONREADYSTATECHANGE] = function () {
	        html.removeChild(this);
	        run(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function (id) {
	      setTimeout(runner(id), 0);
	    };
	  }
	}

	var task$1 = {
	  set: set$1,
	  clear: clear
	};

	var engineIsIosPebble = /ipad|iphone|ipod/i.test(engineUserAgent) && global_1.Pebble !== undefined;

	var engineIsWebosWebkit = /web0s(?!.*chrome)/i.test(engineUserAgent);

	var getOwnPropertyDescriptor$5 = objectGetOwnPropertyDescriptor.f;
	var macrotask = task$1.set;





	var MutationObserver = global_1.MutationObserver || global_1.WebKitMutationObserver;
	var document$2 = global_1.document;
	var process$3 = global_1.process;
	var Promise$4 = global_1.Promise;
	// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
	var queueMicrotaskDescriptor = getOwnPropertyDescriptor$5(global_1, 'queueMicrotask');
	var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

	var flush, head, last, notify$1, toggle, node, promise, then;

	// modern engines have queueMicrotask method
	if (!queueMicrotask) {
	  flush = function () {
	    var parent, fn;
	    if (engineIsNode && (parent = process$3.domain)) { parent.exit(); }
	    while (head) {
	      fn = head.fn;
	      head = head.next;
	      try {
	        fn();
	      } catch (error) {
	        if (head) { notify$1(); }
	        else { last = undefined; }
	        throw error;
	      }
	    } last = undefined;
	    if (parent) { parent.enter(); }
	  };

	  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
	  // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
	  if (!engineIsIos && !engineIsNode && !engineIsWebosWebkit && MutationObserver && document$2) {
	    toggle = true;
	    node = document$2.createTextNode('');
	    new MutationObserver(flush).observe(node, { characterData: true });
	    notify$1 = function () {
	      node.data = toggle = !toggle;
	    };
	  // environments with maybe non-completely correct, but existent Promise
	  } else if (!engineIsIosPebble && Promise$4 && Promise$4.resolve) {
	    // Promise.resolve without an argument throws an error in LG WebOS 2
	    promise = Promise$4.resolve(undefined);
	    // workaround of WebKit ~ iOS Safari 10.1 bug
	    promise.constructor = Promise$4;
	    then = functionBindContext(promise.then, promise);
	    notify$1 = function () {
	      then(flush);
	    };
	  // Node.js without promises
	  } else if (engineIsNode) {
	    notify$1 = function () {
	      process$3.nextTick(flush);
	    };
	  // for other environments - macrotask based on:
	  // - setImmediate
	  // - MessageChannel
	  // - window.postMessage
	  // - onreadystatechange
	  // - setTimeout
	  } else {
	    // strange IE + webpack dev server bug - use .bind(global)
	    macrotask = functionBindContext(macrotask, global_1);
	    notify$1 = function () {
	      macrotask(flush);
	    };
	  }
	}

	var microtask = queueMicrotask || function (fn) {
	  var task = { fn: fn, next: undefined };
	  if (last) { last.next = task; }
	  if (!head) {
	    head = task;
	    notify$1();
	  } last = task;
	};

	var hostReportErrors = function (a, b) {
	  var console = global_1.console;
	  if (console && console.error) {
	    arguments.length == 1 ? console.error(a) : console.error(a, b);
	  }
	};

	var perform = function (exec) {
	  try {
	    return { error: false, value: exec() };
	  } catch (error) {
	    return { error: true, value: error };
	  }
	};

	var Queue = function () {
	  this.head = null;
	  this.tail = null;
	};

	Queue.prototype = {
	  add: function (item) {
	    var entry = { item: item, next: null };
	    if (this.head) { this.tail.next = entry; }
	    else { this.head = entry; }
	    this.tail = entry;
	  },
	  get: function () {
	    var entry = this.head;
	    if (entry) {
	      this.head = entry.next;
	      if (this.tail === entry) { this.tail = null; }
	      return entry.item;
	    }
	  }
	};

	var queue = Queue;

	var promiseNativeConstructor = global_1.Promise;

	/* global Deno -- Deno case */
	var engineIsDeno = typeof Deno == 'object' && Deno && typeof Deno.version == 'object';

	var engineIsBrowser = !engineIsDeno && !engineIsNode
	  && typeof window == 'object'
	  && typeof document == 'object';

	promiseNativeConstructor && promiseNativeConstructor.prototype;
	var SPECIES$1 = wellKnownSymbol('species');
	var SUBCLASSING = false;
	var NATIVE_PROMISE_REJECTION_EVENT$1 = isCallable(global_1.PromiseRejectionEvent);

	var FORCED_PROMISE_CONSTRUCTOR$5 = isForced_1('Promise', function () {
	  var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(promiseNativeConstructor);
	  var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(promiseNativeConstructor);
	  // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
	  // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
	  // We can't detect it synchronously, so just check versions
	  if (!GLOBAL_CORE_JS_PROMISE && engineV8Version === 66) { return true; }
	  // We can't use @@species feature detection in V8 since it causes
	  // deoptimization and performance degradation
	  // https://github.com/zloirock/core-js/issues/679
	  if (!engineV8Version || engineV8Version < 51 || !/native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) {
	    // Detect correctness of subclassing with @@species support
	    var promise = new promiseNativeConstructor(function (resolve) { resolve(1); });
	    var FakePromise = function (exec) {
	      exec(function () { /* empty */ }, function () { /* empty */ });
	    };
	    var constructor = promise.constructor = {};
	    constructor[SPECIES$1] = FakePromise;
	    SUBCLASSING = promise.then(function () { /* empty */ }) instanceof FakePromise;
	    if (!SUBCLASSING) { return true; }
	  // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	  } return !GLOBAL_CORE_JS_PROMISE && (engineIsBrowser || engineIsDeno) && !NATIVE_PROMISE_REJECTION_EVENT$1;
	});

	var promiseConstructorDetection = {
	  CONSTRUCTOR: FORCED_PROMISE_CONSTRUCTOR$5,
	  REJECTION_EVENT: NATIVE_PROMISE_REJECTION_EVENT$1,
	  SUBCLASSING: SUBCLASSING
	};

	var $TypeError$j = TypeError;

	var PromiseCapability = function (C) {
	  var resolve, reject;
	  this.promise = new C(function ($$resolve, $$reject) {
	    if (resolve !== undefined || reject !== undefined) { throw $TypeError$j('Bad Promise constructor'); }
	    resolve = $$resolve;
	    reject = $$reject;
	  });
	  this.resolve = aCallable(resolve);
	  this.reject = aCallable(reject);
	};

	// `NewPromiseCapability` abstract operation
	// https://tc39.es/ecma262/#sec-newpromisecapability
	var f = function (C) {
	  return new PromiseCapability(C);
	};

	var newPromiseCapability$1 = {
		f: f
	};

	var task = task$1.set;









	var PROMISE = 'Promise';
	var FORCED_PROMISE_CONSTRUCTOR$4 = promiseConstructorDetection.CONSTRUCTOR;
	var NATIVE_PROMISE_REJECTION_EVENT = promiseConstructorDetection.REJECTION_EVENT;
	var NATIVE_PROMISE_SUBCLASSING = promiseConstructorDetection.SUBCLASSING;
	var getInternalPromiseState = internalState.getterFor(PROMISE);
	var setInternalState$e = internalState.set;
	var NativePromisePrototype$2 = promiseNativeConstructor && promiseNativeConstructor.prototype;
	var PromiseConstructor = promiseNativeConstructor;
	var PromisePrototype = NativePromisePrototype$2;
	var TypeError$4 = global_1.TypeError;
	var document$1 = global_1.document;
	var process$2 = global_1.process;
	var newPromiseCapability = newPromiseCapability$1.f;
	var newGenericPromiseCapability = newPromiseCapability;

	var DISPATCH_EVENT = !!(document$1 && document$1.createEvent && global_1.dispatchEvent);
	var UNHANDLED_REJECTION = 'unhandledrejection';
	var REJECTION_HANDLED = 'rejectionhandled';
	var PENDING = 0;
	var FULFILLED = 1;
	var REJECTED = 2;
	var HANDLED = 1;
	var UNHANDLED = 2;

	var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

	// helpers
	var isThenable = function (it) {
	  var then;
	  return isObject(it) && isCallable(then = it.then) ? then : false;
	};

	var callReaction = function (reaction, state) {
	  var value = state.value;
	  var ok = state.state == FULFILLED;
	  var handler = ok ? reaction.ok : reaction.fail;
	  var resolve = reaction.resolve;
	  var reject = reaction.reject;
	  var domain = reaction.domain;
	  var result, then, exited;
	  try {
	    if (handler) {
	      if (!ok) {
	        if (state.rejection === UNHANDLED) { onHandleUnhandled(state); }
	        state.rejection = HANDLED;
	      }
	      if (handler === true) { result = value; }
	      else {
	        if (domain) { domain.enter(); }
	        result = handler(value); // can throw
	        if (domain) {
	          domain.exit();
	          exited = true;
	        }
	      }
	      if (result === reaction.promise) {
	        reject(TypeError$4('Promise-chain cycle'));
	      } else if (then = isThenable(result)) {
	        functionCall(then, result, resolve, reject);
	      } else { resolve(result); }
	    } else { reject(value); }
	  } catch (error) {
	    if (domain && !exited) { domain.exit(); }
	    reject(error);
	  }
	};

	var notify = function (state, isReject) {
	  if (state.notified) { return; }
	  state.notified = true;
	  microtask(function () {
	    var reactions = state.reactions;
	    var reaction;
	    while (reaction = reactions.get()) {
	      callReaction(reaction, state);
	    }
	    state.notified = false;
	    if (isReject && !state.rejection) { onUnhandled(state); }
	  });
	};

	var dispatchEvent = function (name, promise, reason) {
	  var event, handler;
	  if (DISPATCH_EVENT) {
	    event = document$1.createEvent('Event');
	    event.promise = promise;
	    event.reason = reason;
	    event.initEvent(name, false, true);
	    global_1.dispatchEvent(event);
	  } else { event = { promise: promise, reason: reason }; }
	  if (!NATIVE_PROMISE_REJECTION_EVENT && (handler = global_1['on' + name])) { handler(event); }
	  else if (name === UNHANDLED_REJECTION) { hostReportErrors('Unhandled promise rejection', reason); }
	};

	var onUnhandled = function (state) {
	  functionCall(task, global_1, function () {
	    var promise = state.facade;
	    var value = state.value;
	    var IS_UNHANDLED = isUnhandled(state);
	    var result;
	    if (IS_UNHANDLED) {
	      result = perform(function () {
	        if (engineIsNode) {
	          process$2.emit('unhandledRejection', value, promise);
	        } else { dispatchEvent(UNHANDLED_REJECTION, promise, value); }
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      state.rejection = engineIsNode || isUnhandled(state) ? UNHANDLED : HANDLED;
	      if (result.error) { throw result.value; }
	    }
	  });
	};

	var isUnhandled = function (state) {
	  return state.rejection !== HANDLED && !state.parent;
	};

	var onHandleUnhandled = function (state) {
	  functionCall(task, global_1, function () {
	    var promise = state.facade;
	    if (engineIsNode) {
	      process$2.emit('rejectionHandled', promise);
	    } else { dispatchEvent(REJECTION_HANDLED, promise, state.value); }
	  });
	};

	var bind = function (fn, state, unwrap) {
	  return function (value) {
	    fn(state, value, unwrap);
	  };
	};

	var internalReject = function (state, value, unwrap) {
	  if (state.done) { return; }
	  state.done = true;
	  if (unwrap) { state = unwrap; }
	  state.value = value;
	  state.state = REJECTED;
	  notify(state, true);
	};

	var internalResolve = function (state, value, unwrap) {
	  if (state.done) { return; }
	  state.done = true;
	  if (unwrap) { state = unwrap; }
	  try {
	    if (state.facade === value) { throw TypeError$4("Promise can't be resolved itself"); }
	    var then = isThenable(value);
	    if (then) {
	      microtask(function () {
	        var wrapper = { done: false };
	        try {
	          functionCall(then, value,
	            bind(internalResolve, wrapper, state),
	            bind(internalReject, wrapper, state)
	          );
	        } catch (error) {
	          internalReject(wrapper, error, state);
	        }
	      });
	    } else {
	      state.value = value;
	      state.state = FULFILLED;
	      notify(state, false);
	    }
	  } catch (error) {
	    internalReject({ done: false }, error, state);
	  }
	};

	// constructor polyfill
	if (FORCED_PROMISE_CONSTRUCTOR$4) {
	  // 25.4.3.1 Promise(executor)
	  PromiseConstructor = function Promise(executor) {
	    anInstance(this, PromisePrototype);
	    aCallable(executor);
	    functionCall(Internal, this);
	    var state = getInternalPromiseState(this);
	    try {
	      executor(bind(internalResolve, state), bind(internalReject, state));
	    } catch (error) {
	      internalReject(state, error);
	    }
	  };

	  PromisePrototype = PromiseConstructor.prototype;

	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  Internal = function Promise(executor) {
	    setInternalState$e(this, {
	      type: PROMISE,
	      done: false,
	      notified: false,
	      parent: false,
	      reactions: new queue(),
	      rejection: false,
	      state: PENDING,
	      value: undefined
	    });
	  };

	  // `Promise.prototype.then` method
	  // https://tc39.es/ecma262/#sec-promise.prototype.then
	  Internal.prototype = defineBuiltIn(PromisePrototype, 'then', function then(onFulfilled, onRejected) {
	    var state = getInternalPromiseState(this);
	    var reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor));
	    state.parent = true;
	    reaction.ok = isCallable(onFulfilled) ? onFulfilled : true;
	    reaction.fail = isCallable(onRejected) && onRejected;
	    reaction.domain = engineIsNode ? process$2.domain : undefined;
	    if (state.state == PENDING) { state.reactions.add(reaction); }
	    else { microtask(function () {
	      callReaction(reaction, state);
	    }); }
	    return reaction.promise;
	  });

	  OwnPromiseCapability = function () {
	    var promise = new Internal();
	    var state = getInternalPromiseState(promise);
	    this.promise = promise;
	    this.resolve = bind(internalResolve, state);
	    this.reject = bind(internalReject, state);
	  };

	  newPromiseCapability$1.f = newPromiseCapability = function (C) {
	    return C === PromiseConstructor || C === PromiseWrapper
	      ? new OwnPromiseCapability(C)
	      : newGenericPromiseCapability(C);
	  };

	  if (isCallable(promiseNativeConstructor) && NativePromisePrototype$2 !== Object.prototype) {
	    nativeThen = NativePromisePrototype$2.then;

	    if (!NATIVE_PROMISE_SUBCLASSING) {
	      // make `Promise#then` return a polyfilled `Promise` for native promise-based APIs
	      defineBuiltIn(NativePromisePrototype$2, 'then', function then(onFulfilled, onRejected) {
	        var that = this;
	        return new PromiseConstructor(function (resolve, reject) {
	          functionCall(nativeThen, that, resolve, reject);
	        }).then(onFulfilled, onRejected);
	      // https://github.com/zloirock/core-js/issues/640
	      }, { unsafe: true });
	    }

	    // make `.constructor === Promise` work for native promise-based APIs
	    try {
	      delete NativePromisePrototype$2.constructor;
	    } catch (error) { /* empty */ }

	    // make `instanceof Promise` work for native promise-based APIs
	    if (objectSetPrototypeOf) {
	      objectSetPrototypeOf(NativePromisePrototype$2, PromisePrototype);
	    }
	  }
	}

	_export({ global: true, constructor: true, wrap: true, forced: FORCED_PROMISE_CONSTRUCTOR$4 }, {
	  Promise: PromiseConstructor
	});

	setToStringTag(PromiseConstructor, PROMISE, false);
	setSpecies(PROMISE);

	var FORCED_PROMISE_CONSTRUCTOR$3 = promiseConstructorDetection.CONSTRUCTOR;

	var promiseStaticsIncorrectIteration = FORCED_PROMISE_CONSTRUCTOR$3 || !checkCorrectnessOfIteration(function (iterable) {
	  promiseNativeConstructor.all(iterable).then(undefined, function () { /* empty */ });
	});

	// `Promise.all` method
	// https://tc39.es/ecma262/#sec-promise.all
	_export({ target: 'Promise', stat: true, forced: promiseStaticsIncorrectIteration }, {
	  all: function all(iterable) {
	    var C = this;
	    var capability = newPromiseCapability$1.f(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform(function () {
	      var $promiseResolve = aCallable(C.resolve);
	      var values = [];
	      var counter = 0;
	      var remaining = 1;
	      iterate(iterable, function (promise) {
	        var index = counter++;
	        var alreadyCalled = false;
	        remaining++;
	        functionCall($promiseResolve, C, promise).then(function (value) {
	          if (alreadyCalled) { return; }
	          alreadyCalled = true;
	          values[index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if (result.error) { reject(result.value); }
	    return capability.promise;
	  }
	});

	var FORCED_PROMISE_CONSTRUCTOR$2 = promiseConstructorDetection.CONSTRUCTOR;





	var NativePromisePrototype$1 = promiseNativeConstructor && promiseNativeConstructor.prototype;

	// `Promise.prototype.catch` method
	// https://tc39.es/ecma262/#sec-promise.prototype.catch
	_export({ target: 'Promise', proto: true, forced: FORCED_PROMISE_CONSTRUCTOR$2, real: true }, {
	  'catch': function (onRejected) {
	    return this.then(undefined, onRejected);
	  }
	});

	// makes sure that native promise-based APIs `Promise#catch` properly works with patched `Promise#then`
	if (isCallable(promiseNativeConstructor)) {
	  var method$1 = getBuiltIn('Promise').prototype['catch'];
	  if (NativePromisePrototype$1['catch'] !== method$1) {
	    defineBuiltIn(NativePromisePrototype$1, 'catch', method$1, { unsafe: true });
	  }
	}

	// `Promise.race` method
	// https://tc39.es/ecma262/#sec-promise.race
	_export({ target: 'Promise', stat: true, forced: promiseStaticsIncorrectIteration }, {
	  race: function race(iterable) {
	    var C = this;
	    var capability = newPromiseCapability$1.f(C);
	    var reject = capability.reject;
	    var result = perform(function () {
	      var $promiseResolve = aCallable(C.resolve);
	      iterate(iterable, function (promise) {
	        functionCall($promiseResolve, C, promise).then(capability.resolve, reject);
	      });
	    });
	    if (result.error) { reject(result.value); }
	    return capability.promise;
	  }
	});

	var FORCED_PROMISE_CONSTRUCTOR$1 = promiseConstructorDetection.CONSTRUCTOR;

	// `Promise.reject` method
	// https://tc39.es/ecma262/#sec-promise.reject
	_export({ target: 'Promise', stat: true, forced: FORCED_PROMISE_CONSTRUCTOR$1 }, {
	  reject: function reject(r) {
	    var capability = newPromiseCapability$1.f(this);
	    functionCall(capability.reject, undefined, r);
	    return capability.promise;
	  }
	});

	var promiseResolve = function (C, x) {
	  anObject(C);
	  if (isObject(x) && x.constructor === C) { return x; }
	  var promiseCapability = newPromiseCapability$1.f(C);
	  var resolve = promiseCapability.resolve;
	  resolve(x);
	  return promiseCapability.promise;
	};

	var FORCED_PROMISE_CONSTRUCTOR = promiseConstructorDetection.CONSTRUCTOR;


	getBuiltIn('Promise');

	// `Promise.resolve` method
	// https://tc39.es/ecma262/#sec-promise.resolve
	_export({ target: 'Promise', stat: true, forced: FORCED_PROMISE_CONSTRUCTOR }, {
	  resolve: function resolve(x) {
	    return promiseResolve(this, x);
	  }
	});

	// `Promise.allSettled` method
	// https://tc39.es/ecma262/#sec-promise.allsettled
	_export({ target: 'Promise', stat: true }, {
	  allSettled: function allSettled(iterable) {
	    var C = this;
	    var capability = newPromiseCapability$1.f(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform(function () {
	      var promiseResolve = aCallable(C.resolve);
	      var values = [];
	      var counter = 0;
	      var remaining = 1;
	      iterate(iterable, function (promise) {
	        var index = counter++;
	        var alreadyCalled = false;
	        remaining++;
	        functionCall(promiseResolve, C, promise).then(function (value) {
	          if (alreadyCalled) { return; }
	          alreadyCalled = true;
	          values[index] = { status: 'fulfilled', value: value };
	          --remaining || resolve(values);
	        }, function (error) {
	          if (alreadyCalled) { return; }
	          alreadyCalled = true;
	          values[index] = { status: 'rejected', reason: error };
	          --remaining || resolve(values);
	        });
	      });
	      --remaining || resolve(values);
	    });
	    if (result.error) { reject(result.value); }
	    return capability.promise;
	  }
	});

	var PROMISE_ANY_ERROR = 'No one promise resolved';

	// `Promise.any` method
	// https://tc39.es/ecma262/#sec-promise.any
	_export({ target: 'Promise', stat: true }, {
	  any: function any(iterable) {
	    var C = this;
	    var AggregateError = getBuiltIn('AggregateError');
	    var capability = newPromiseCapability$1.f(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform(function () {
	      var promiseResolve = aCallable(C.resolve);
	      var errors = [];
	      var counter = 0;
	      var remaining = 1;
	      var alreadyResolved = false;
	      iterate(iterable, function (promise) {
	        var index = counter++;
	        var alreadyRejected = false;
	        remaining++;
	        functionCall(promiseResolve, C, promise).then(function (value) {
	          if (alreadyRejected || alreadyResolved) { return; }
	          alreadyResolved = true;
	          resolve(value);
	        }, function (error) {
	          if (alreadyRejected || alreadyResolved) { return; }
	          alreadyRejected = true;
	          errors[index] = error;
	          --remaining || reject(new AggregateError(errors, PROMISE_ANY_ERROR));
	        });
	      });
	      --remaining || reject(new AggregateError(errors, PROMISE_ANY_ERROR));
	    });
	    if (result.error) { reject(result.value); }
	    return capability.promise;
	  }
	});

	var NativePromisePrototype = promiseNativeConstructor && promiseNativeConstructor.prototype;

	// Safari bug https://bugs.webkit.org/show_bug.cgi?id=200829
	var NON_GENERIC = !!promiseNativeConstructor && fails(function () {
	  // eslint-disable-next-line unicorn/no-thenable -- required for testing
	  NativePromisePrototype['finally'].call({ then: function () { /* empty */ } }, function () { /* empty */ });
	});

	// `Promise.prototype.finally` method
	// https://tc39.es/ecma262/#sec-promise.prototype.finally
	_export({ target: 'Promise', proto: true, real: true, forced: NON_GENERIC }, {
	  'finally': function (onFinally) {
	    var C = speciesConstructor(this, getBuiltIn('Promise'));
	    var isFunction = isCallable(onFinally);
	    return this.then(
	      isFunction ? function (x) {
	        return promiseResolve(C, onFinally()).then(function () { return x; });
	      } : onFinally,
	      isFunction ? function (e) {
	        return promiseResolve(C, onFinally()).then(function () { throw e; });
	      } : onFinally
	    );
	  }
	});

	// makes sure that native promise-based APIs `Promise#finally` properly works with patched `Promise#then`
	if (isCallable(promiseNativeConstructor)) {
	  var method = getBuiltIn('Promise').prototype['finally'];
	  if (NativePromisePrototype['finally'] !== method) {
	    defineBuiltIn(NativePromisePrototype, 'finally', method, { unsafe: true });
	  }
	}

	// MS Edge argumentsList argument is optional
	var OPTIONAL_ARGUMENTS_LIST = !fails(function () {
	  // eslint-disable-next-line es/no-reflect -- required for testing
	  Reflect.apply(function () { /* empty */ });
	});

	// `Reflect.apply` method
	// https://tc39.es/ecma262/#sec-reflect.apply
	_export({ target: 'Reflect', stat: true, forced: OPTIONAL_ARGUMENTS_LIST }, {
	  apply: function apply(target, thisArgument, argumentsList) {
	    return functionApply(aCallable(target), thisArgument, anObject(argumentsList));
	  }
	});

	var nativeConstruct = getBuiltIn('Reflect', 'construct');
	var ObjectPrototype = Object.prototype;
	var push$g = [].push;

	// `Reflect.construct` method
	// https://tc39.es/ecma262/#sec-reflect.construct
	// MS Edge supports only 2 arguments and argumentsList argument is optional
	// FF Nightly sets third argument as `new.target`, but does not create `this` from it
	var NEW_TARGET_BUG = fails(function () {
	  function F() { /* empty */ }
	  return !(nativeConstruct(function () { /* empty */ }, [], F) instanceof F);
	});

	var ARGS_BUG = !fails(function () {
	  nativeConstruct(function () { /* empty */ });
	});

	var FORCED$6 = NEW_TARGET_BUG || ARGS_BUG;

	_export({ target: 'Reflect', stat: true, forced: FORCED$6, sham: FORCED$6 }, {
	  construct: function construct(Target, args /* , newTarget */) {
	    aConstructor(Target);
	    anObject(args);
	    var newTarget = arguments.length < 3 ? Target : aConstructor(arguments[2]);
	    if (ARGS_BUG && !NEW_TARGET_BUG) { return nativeConstruct(Target, args, newTarget); }
	    if (Target == newTarget) {
	      // w/o altered newTarget, optimization for 0-4 arguments
	      switch (args.length) {
	        case 0: return new Target();
	        case 1: return new Target(args[0]);
	        case 2: return new Target(args[0], args[1]);
	        case 3: return new Target(args[0], args[1], args[2]);
	        case 4: return new Target(args[0], args[1], args[2], args[3]);
	      }
	      // w/o altered newTarget, lot of arguments case
	      var $args = [null];
	      functionApply(push$g, $args, args);
	      return new (functionApply(functionBind, Target, $args))();
	    }
	    // with altered newTarget, not support built-in constructors
	    var proto = newTarget.prototype;
	    var instance = objectCreate(isObject(proto) ? proto : ObjectPrototype);
	    var result = functionApply(Target, instance, args);
	    return isObject(result) ? result : instance;
	  }
	});

	// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
	var ERROR_INSTEAD_OF_FALSE = fails(function () {
	  // eslint-disable-next-line es/no-reflect -- required for testing
	  Reflect.defineProperty(objectDefineProperty.f({}, 1, { value: 1 }), 1, { value: 2 });
	});

	// `Reflect.defineProperty` method
	// https://tc39.es/ecma262/#sec-reflect.defineproperty
	_export({ target: 'Reflect', stat: true, forced: ERROR_INSTEAD_OF_FALSE, sham: !descriptors }, {
	  defineProperty: function defineProperty(target, propertyKey, attributes) {
	    anObject(target);
	    var key = toPropertyKey(propertyKey);
	    anObject(attributes);
	    try {
	      objectDefineProperty.f(target, key, attributes);
	      return true;
	    } catch (error) {
	      return false;
	    }
	  }
	});

	var getOwnPropertyDescriptor$4 = objectGetOwnPropertyDescriptor.f;

	// `Reflect.deleteProperty` method
	// https://tc39.es/ecma262/#sec-reflect.deleteproperty
	_export({ target: 'Reflect', stat: true }, {
	  deleteProperty: function deleteProperty(target, propertyKey) {
	    var descriptor = getOwnPropertyDescriptor$4(anObject(target), propertyKey);
	    return descriptor && !descriptor.configurable ? false : delete target[propertyKey];
	  }
	});

	var isDataDescriptor = function (descriptor) {
	  return descriptor !== undefined && (hasOwnProperty_1(descriptor, 'value') || hasOwnProperty_1(descriptor, 'writable'));
	};

	// `Reflect.get` method
	// https://tc39.es/ecma262/#sec-reflect.get
	function get(target, propertyKey /* , receiver */) {
	  var receiver = arguments.length < 3 ? target : arguments[2];
	  var descriptor, prototype;
	  if (anObject(target) === receiver) { return target[propertyKey]; }
	  descriptor = objectGetOwnPropertyDescriptor.f(target, propertyKey);
	  if (descriptor) { return isDataDescriptor(descriptor)
	    ? descriptor.value
	    : descriptor.get === undefined ? undefined : functionCall(descriptor.get, receiver); }
	  if (isObject(prototype = objectGetPrototypeOf(target))) { return get(prototype, propertyKey, receiver); }
	}

	_export({ target: 'Reflect', stat: true }, {
	  get: get
	});

	// `Reflect.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-reflect.getownpropertydescriptor
	_export({ target: 'Reflect', stat: true, sham: !descriptors }, {
	  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
	    return objectGetOwnPropertyDescriptor.f(anObject(target), propertyKey);
	  }
	});

	// `Reflect.getPrototypeOf` method
	// https://tc39.es/ecma262/#sec-reflect.getprototypeof
	_export({ target: 'Reflect', stat: true, sham: !correctPrototypeGetter }, {
	  getPrototypeOf: function getPrototypeOf(target) {
	    return objectGetPrototypeOf(anObject(target));
	  }
	});

	// `Reflect.has` method
	// https://tc39.es/ecma262/#sec-reflect.has
	_export({ target: 'Reflect', stat: true }, {
	  has: function has(target, propertyKey) {
	    return propertyKey in target;
	  }
	});

	// `Reflect.isExtensible` method
	// https://tc39.es/ecma262/#sec-reflect.isextensible
	_export({ target: 'Reflect', stat: true }, {
	  isExtensible: function isExtensible(target) {
	    anObject(target);
	    return objectIsExtensible(target);
	  }
	});

	// `Reflect.ownKeys` method
	// https://tc39.es/ecma262/#sec-reflect.ownkeys
	_export({ target: 'Reflect', stat: true }, {
	  ownKeys: ownKeys
	});

	// `Reflect.preventExtensions` method
	// https://tc39.es/ecma262/#sec-reflect.preventextensions
	_export({ target: 'Reflect', stat: true, sham: !freezing }, {
	  preventExtensions: function preventExtensions(target) {
	    anObject(target);
	    try {
	      var objectPreventExtensions = getBuiltIn('Object', 'preventExtensions');
	      if (objectPreventExtensions) { objectPreventExtensions(target); }
	      return true;
	    } catch (error) {
	      return false;
	    }
	  }
	});

	// `Reflect.set` method
	// https://tc39.es/ecma262/#sec-reflect.set
	function set(target, propertyKey, V /* , receiver */) {
	  var receiver = arguments.length < 4 ? target : arguments[3];
	  var ownDescriptor = objectGetOwnPropertyDescriptor.f(anObject(target), propertyKey);
	  var existingDescriptor, prototype, setter;
	  if (!ownDescriptor) {
	    if (isObject(prototype = objectGetPrototypeOf(target))) {
	      return set(prototype, propertyKey, V, receiver);
	    }
	    ownDescriptor = createPropertyDescriptor(0);
	  }
	  if (isDataDescriptor(ownDescriptor)) {
	    if (ownDescriptor.writable === false || !isObject(receiver)) { return false; }
	    if (existingDescriptor = objectGetOwnPropertyDescriptor.f(receiver, propertyKey)) {
	      if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) { return false; }
	      existingDescriptor.value = V;
	      objectDefineProperty.f(receiver, propertyKey, existingDescriptor);
	    } else { objectDefineProperty.f(receiver, propertyKey, createPropertyDescriptor(0, V)); }
	  } else {
	    setter = ownDescriptor.set;
	    if (setter === undefined) { return false; }
	    functionCall(setter, receiver, V);
	  } return true;
	}

	// MS Edge 17-18 Reflect.set allows setting the property to object
	// with non-writable property on the prototype
	var MS_EDGE_BUG = fails(function () {
	  var Constructor = function () { /* empty */ };
	  var object = objectDefineProperty.f(new Constructor(), 'a', { configurable: true });
	  // eslint-disable-next-line es/no-reflect -- required for testing
	  return Reflect.set(Constructor.prototype, 'a', 1, object) !== false;
	});

	_export({ target: 'Reflect', stat: true, forced: MS_EDGE_BUG }, {
	  set: set
	});

	// `Reflect.setPrototypeOf` method
	// https://tc39.es/ecma262/#sec-reflect.setprototypeof
	if (objectSetPrototypeOf) { _export({ target: 'Reflect', stat: true }, {
	  setPrototypeOf: function setPrototypeOf(target, proto) {
	    anObject(target);
	    aPossiblePrototype(proto);
	    try {
	      objectSetPrototypeOf(target, proto);
	      return true;
	    } catch (error) {
	      return false;
	    }
	  }
	}); }

	_export({ global: true }, { Reflect: {} });

	// Reflect[@@toStringTag] property
	// https://tc39.es/ecma262/#sec-reflect-@@tostringtag
	setToStringTag(global_1.Reflect, 'Reflect', true);

	var MATCH$2 = wellKnownSymbol('match');

	// `IsRegExp` abstract operation
	// https://tc39.es/ecma262/#sec-isregexp
	var isRegexp = function (it) {
	  var isRegExp;
	  return isObject(it) && ((isRegExp = it[MATCH$2]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
	};

	// `RegExp.prototype.flags` getter implementation
	// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
	var regexpFlags = function () {
	  var that = anObject(this);
	  var result = '';
	  if (that.hasIndices) { result += 'd'; }
	  if (that.global) { result += 'g'; }
	  if (that.ignoreCase) { result += 'i'; }
	  if (that.multiline) { result += 'm'; }
	  if (that.dotAll) { result += 's'; }
	  if (that.unicode) { result += 'u'; }
	  if (that.unicodeSets) { result += 'v'; }
	  if (that.sticky) { result += 'y'; }
	  return result;
	};

	var RegExpPrototype$7 = RegExp.prototype;

	var regexpGetFlags = function (R) {
	  var flags = R.flags;
	  return flags === undefined && !('flags' in RegExpPrototype$7) && !hasOwnProperty_1(R, 'flags') && objectIsPrototypeOf(RegExpPrototype$7, R)
	    ? functionCall(regexpFlags, R) : flags;
	};

	// babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
	var $RegExp$2 = global_1.RegExp;

	var UNSUPPORTED_Y$3 = fails(function () {
	  var re = $RegExp$2('a', 'y');
	  re.lastIndex = 2;
	  return re.exec('abcd') != null;
	});

	// UC Browser bug
	// https://github.com/zloirock/core-js/issues/1008
	var MISSED_STICKY$2 = UNSUPPORTED_Y$3 || fails(function () {
	  return !$RegExp$2('a', 'y').sticky;
	});

	var BROKEN_CARET = UNSUPPORTED_Y$3 || fails(function () {
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
	  var re = $RegExp$2('^r', 'gy');
	  re.lastIndex = 2;
	  return re.exec('str') != null;
	});

	var regexpStickyHelpers = {
	  BROKEN_CARET: BROKEN_CARET,
	  MISSED_STICKY: MISSED_STICKY$2,
	  UNSUPPORTED_Y: UNSUPPORTED_Y$3
	};

	// babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
	var $RegExp$1 = global_1.RegExp;

	var regexpUnsupportedDotAll = fails(function () {
	  var re = $RegExp$1('.', 's');
	  return !(re.dotAll && re.exec('\n') && re.flags === 's');
	});

	// babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
	var $RegExp = global_1.RegExp;

	var regexpUnsupportedNcg = fails(function () {
	  var re = $RegExp('(?<a>b)', 'g');
	  return re.exec('b').groups.a !== 'b' ||
	    'b'.replace(re, '$<a>c') !== 'bc';
	});

	var getOwnPropertyNames = objectGetOwnPropertyNames.f;









	var enforceInternalState$1 = internalState.enforce;





	var MATCH$1 = wellKnownSymbol('match');
	var NativeRegExp = global_1.RegExp;
	var RegExpPrototype$6 = NativeRegExp.prototype;
	var SyntaxError$2 = global_1.SyntaxError;
	var exec$7 = functionUncurryThis(RegExpPrototype$6.exec);
	var charAt$f = functionUncurryThis(''.charAt);
	var replace$7 = functionUncurryThis(''.replace);
	var stringIndexOf$4 = functionUncurryThis(''.indexOf);
	var stringSlice$c = functionUncurryThis(''.slice);
	// TODO: Use only proper RegExpIdentifierName
	var IS_NCG = /^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/;
	var re1 = /a/g;
	var re2 = /a/g;

	// "new" should create a new object, old webkit bug
	var CORRECT_NEW = new NativeRegExp(re1) !== re1;

	var MISSED_STICKY$1 = regexpStickyHelpers.MISSED_STICKY;
	var UNSUPPORTED_Y$2 = regexpStickyHelpers.UNSUPPORTED_Y;

	var BASE_FORCED = descriptors &&
	  (!CORRECT_NEW || MISSED_STICKY$1 || regexpUnsupportedDotAll || regexpUnsupportedNcg || fails(function () {
	    re2[MATCH$1] = false;
	    // RegExp constructor can alter flags and IsRegExp works correct with @@match
	    return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
	  }));

	var handleDotAll = function (string) {
	  var length = string.length;
	  var index = 0;
	  var result = '';
	  var brackets = false;
	  var chr;
	  for (; index <= length; index++) {
	    chr = charAt$f(string, index);
	    if (chr === '\\') {
	      result += chr + charAt$f(string, ++index);
	      continue;
	    }
	    if (!brackets && chr === '.') {
	      result += '[\\s\\S]';
	    } else {
	      if (chr === '[') {
	        brackets = true;
	      } else if (chr === ']') {
	        brackets = false;
	      } result += chr;
	    }
	  } return result;
	};

	var handleNCG = function (string) {
	  var length = string.length;
	  var index = 0;
	  var result = '';
	  var named = [];
	  var names = {};
	  var brackets = false;
	  var ncg = false;
	  var groupid = 0;
	  var groupname = '';
	  var chr;
	  for (; index <= length; index++) {
	    chr = charAt$f(string, index);
	    if (chr === '\\') {
	      chr = chr + charAt$f(string, ++index);
	    } else if (chr === ']') {
	      brackets = false;
	    } else if (!brackets) { switch (true) {
	      case chr === '[':
	        brackets = true;
	        break;
	      case chr === '(':
	        if (exec$7(IS_NCG, stringSlice$c(string, index + 1))) {
	          index += 2;
	          ncg = true;
	        }
	        result += chr;
	        groupid++;
	        continue;
	      case chr === '>' && ncg:
	        if (groupname === '' || hasOwnProperty_1(names, groupname)) {
	          throw new SyntaxError$2('Invalid capture group name');
	        }
	        names[groupname] = true;
	        named[named.length] = [groupname, groupid];
	        ncg = false;
	        groupname = '';
	        continue;
	    } }
	    if (ncg) { groupname += chr; }
	    else { result += chr; }
	  } return [result, named];
	};

	// `RegExp` constructor
	// https://tc39.es/ecma262/#sec-regexp-constructor
	if (isForced_1('RegExp', BASE_FORCED)) {
	  var RegExpWrapper = function RegExp(pattern, flags) {
	    var thisIsRegExp = objectIsPrototypeOf(RegExpPrototype$6, this);
	    var patternIsRegExp = isRegexp(pattern);
	    var flagsAreUndefined = flags === undefined;
	    var groups = [];
	    var rawPattern = pattern;
	    var rawFlags, dotAll, sticky, handled, result, state;

	    if (!thisIsRegExp && patternIsRegExp && flagsAreUndefined && pattern.constructor === RegExpWrapper) {
	      return pattern;
	    }

	    if (patternIsRegExp || objectIsPrototypeOf(RegExpPrototype$6, pattern)) {
	      pattern = pattern.source;
	      if (flagsAreUndefined) { flags = regexpGetFlags(rawPattern); }
	    }

	    pattern = pattern === undefined ? '' : toString_1(pattern);
	    flags = flags === undefined ? '' : toString_1(flags);
	    rawPattern = pattern;

	    if (regexpUnsupportedDotAll && 'dotAll' in re1) {
	      dotAll = !!flags && stringIndexOf$4(flags, 's') > -1;
	      if (dotAll) { flags = replace$7(flags, /s/g, ''); }
	    }

	    rawFlags = flags;

	    if (MISSED_STICKY$1 && 'sticky' in re1) {
	      sticky = !!flags && stringIndexOf$4(flags, 'y') > -1;
	      if (sticky && UNSUPPORTED_Y$2) { flags = replace$7(flags, /y/g, ''); }
	    }

	    if (regexpUnsupportedNcg) {
	      handled = handleNCG(pattern);
	      pattern = handled[0];
	      groups = handled[1];
	    }

	    result = inheritIfRequired(NativeRegExp(pattern, flags), thisIsRegExp ? this : RegExpPrototype$6, RegExpWrapper);

	    if (dotAll || sticky || groups.length) {
	      state = enforceInternalState$1(result);
	      if (dotAll) {
	        state.dotAll = true;
	        state.raw = RegExpWrapper(handleDotAll(pattern), rawFlags);
	      }
	      if (sticky) { state.sticky = true; }
	      if (groups.length) { state.groups = groups; }
	    }

	    if (pattern !== rawPattern) { try {
	      // fails in old engines, but we have no alternatives for unsupported regex syntax
	      createNonEnumerableProperty(result, 'source', rawPattern === '' ? '(?:)' : rawPattern);
	    } catch (error) { /* empty */ } }

	    return result;
	  };

	  for (var keys = getOwnPropertyNames(NativeRegExp), index$1 = 0; keys.length > index$1;) {
	    proxyAccessor(RegExpWrapper, NativeRegExp, keys[index$1++]);
	  }

	  RegExpPrototype$6.constructor = RegExpWrapper;
	  RegExpWrapper.prototype = RegExpPrototype$6;
	  defineBuiltIn(global_1, 'RegExp', RegExpWrapper, { constructor: true });
	}

	// https://tc39.es/ecma262/#sec-get-regexp-@@species
	setSpecies('RegExp');

	var getInternalState$a = internalState.get;

	var RegExpPrototype$5 = RegExp.prototype;
	var $TypeError$i = TypeError;

	// `RegExp.prototype.dotAll` getter
	// https://tc39.es/ecma262/#sec-get-regexp.prototype.dotall
	if (descriptors && regexpUnsupportedDotAll) {
	  defineBuiltInAccessor(RegExpPrototype$5, 'dotAll', {
	    configurable: true,
	    get: function dotAll() {
	      if (this === RegExpPrototype$5) { return undefined; }
	      // We can't use InternalStateModule.getterFor because
	      // we don't add metadata for regexps created by a literal.
	      if (classofRaw(this) === 'RegExp') {
	        return !!getInternalState$a(this).dotAll;
	      }
	      throw $TypeError$i('Incompatible receiver, RegExp required');
	    }
	  });
	}

	/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
	/* eslint-disable regexp/no-useless-quantifier -- testing */







	var getInternalState$9 = internalState.get;



	var nativeReplace = shared('native-string-replace', String.prototype.replace);
	var nativeExec = RegExp.prototype.exec;
	var patchedExec = nativeExec;
	var charAt$e = functionUncurryThis(''.charAt);
	var indexOf$1 = functionUncurryThis(''.indexOf);
	var replace$6 = functionUncurryThis(''.replace);
	var stringSlice$b = functionUncurryThis(''.slice);

	var UPDATES_LAST_INDEX_WRONG = (function () {
	  var re1 = /a/;
	  var re2 = /b*/g;
	  functionCall(nativeExec, re1, 'a');
	  functionCall(nativeExec, re2, 'a');
	  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
	})();

	var UNSUPPORTED_Y$1 = regexpStickyHelpers.BROKEN_CARET;

	// nonparticipating capturing group, copied from es5-shim's String#split patch.
	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1 || regexpUnsupportedDotAll || regexpUnsupportedNcg;

	if (PATCH) {
	  patchedExec = function exec(string) {
	    var re = this;
	    var state = getInternalState$9(re);
	    var str = toString_1(string);
	    var raw = state.raw;
	    var result, reCopy, lastIndex, match, i, object, group;

	    if (raw) {
	      raw.lastIndex = re.lastIndex;
	      result = functionCall(patchedExec, raw, str);
	      re.lastIndex = raw.lastIndex;
	      return result;
	    }

	    var groups = state.groups;
	    var sticky = UNSUPPORTED_Y$1 && re.sticky;
	    var flags = functionCall(regexpFlags, re);
	    var source = re.source;
	    var charsAdded = 0;
	    var strCopy = str;

	    if (sticky) {
	      flags = replace$6(flags, 'y', '');
	      if (indexOf$1(flags, 'g') === -1) {
	        flags += 'g';
	      }

	      strCopy = stringSlice$b(str, re.lastIndex);
	      // Support anchored sticky behavior.
	      if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt$e(str, re.lastIndex - 1) !== '\n')) {
	        source = '(?: ' + source + ')';
	        strCopy = ' ' + strCopy;
	        charsAdded++;
	      }
	      // ^(? + rx + ) is needed, in combination with some str slicing, to
	      // simulate the 'y' flag.
	      reCopy = new RegExp('^(?:' + source + ')', flags);
	    }

	    if (NPCG_INCLUDED) {
	      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
	    }
	    if (UPDATES_LAST_INDEX_WRONG) { lastIndex = re.lastIndex; }

	    match = functionCall(nativeExec, sticky ? reCopy : re, strCopy);

	    if (sticky) {
	      if (match) {
	        match.input = stringSlice$b(match.input, charsAdded);
	        match[0] = stringSlice$b(match[0], charsAdded);
	        match.index = re.lastIndex;
	        re.lastIndex += match[0].length;
	      } else { re.lastIndex = 0; }
	    } else if (UPDATES_LAST_INDEX_WRONG && match) {
	      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
	    }
	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn't work for /(.?)?/
	      functionCall(nativeReplace, match[0], reCopy, function () {
	        var arguments$1 = arguments;

	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments$1[i] === undefined) { match[i] = undefined; }
	        }
	      });
	    }

	    if (match && groups) {
	      match.groups = object = objectCreate(null);
	      for (i = 0; i < groups.length; i++) {
	        group = groups[i];
	        object[group[0]] = match[group[1]];
	      }
	    }

	    return match;
	  };
	}

	var regexpExec = patchedExec;

	// `RegExp.prototype.exec` method
	// https://tc39.es/ecma262/#sec-regexp.prototype.exec
	_export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
	  exec: regexpExec
	});

	// babel-minify and Closure Compiler transpiles RegExp('.', 'd') -> /./d and it causes SyntaxError
	var RegExp$2 = global_1.RegExp;
	var RegExpPrototype$4 = RegExp$2.prototype;

	var FORCED$5 = descriptors && fails(function () {
	  var INDICES_SUPPORT = true;
	  try {
	    RegExp$2('.', 'd');
	  } catch (error) {
	    INDICES_SUPPORT = false;
	  }

	  var O = {};
	  // modern V8 bug
	  var calls = '';
	  var expected = INDICES_SUPPORT ? 'dgimsy' : 'gimsy';

	  var addGetter = function (key, chr) {
	    // eslint-disable-next-line es/no-object-defineproperty -- safe
	    Object.defineProperty(O, key, { get: function () {
	      calls += chr;
	      return true;
	    } });
	  };

	  var pairs = {
	    dotAll: 's',
	    global: 'g',
	    ignoreCase: 'i',
	    multiline: 'm',
	    sticky: 'y'
	  };

	  if (INDICES_SUPPORT) { pairs.hasIndices = 'd'; }

	  for (var key in pairs) { addGetter(key, pairs[key]); }

	  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	  var result = Object.getOwnPropertyDescriptor(RegExpPrototype$4, 'flags').get.call(O);

	  return result !== expected || calls !== expected;
	});

	// `RegExp.prototype.flags` getter
	// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
	if (FORCED$5) { defineBuiltInAccessor(RegExpPrototype$4, 'flags', {
	  configurable: true,
	  get: regexpFlags
	}); }

	var MISSED_STICKY = regexpStickyHelpers.MISSED_STICKY;


	var getInternalState$8 = internalState.get;

	var RegExpPrototype$3 = RegExp.prototype;
	var $TypeError$h = TypeError;

	// `RegExp.prototype.sticky` getter
	// https://tc39.es/ecma262/#sec-get-regexp.prototype.sticky
	if (descriptors && MISSED_STICKY) {
	  defineBuiltInAccessor(RegExpPrototype$3, 'sticky', {
	    configurable: true,
	    get: function sticky() {
	      if (this === RegExpPrototype$3) { return undefined; }
	      // We can't use InternalStateModule.getterFor because
	      // we don't add metadata for regexps created by a literal.
	      if (classofRaw(this) === 'RegExp') {
	        return !!getInternalState$8(this).sticky;
	      }
	      throw $TypeError$h('Incompatible receiver, RegExp required');
	    }
	  });
	}

	// TODO: Remove from `core-js@4` since it's moved to entry points







	var DELEGATES_TO_EXEC = function () {
	  var execCalled = false;
	  var re = /[ac]/;
	  re.exec = function () {
	    execCalled = true;
	    return /./.exec.apply(this, arguments);
	  };
	  return re.test('abc') === true && execCalled;
	}();

	var nativeTest = /./.test;

	// `RegExp.prototype.test` method
	// https://tc39.es/ecma262/#sec-regexp.prototype.test
	_export({ target: 'RegExp', proto: true, forced: !DELEGATES_TO_EXEC }, {
	  test: function (S) {
	    var R = anObject(this);
	    var string = toString_1(S);
	    var exec = R.exec;
	    if (!isCallable(exec)) { return functionCall(nativeTest, R, string); }
	    var result = functionCall(exec, R, string);
	    if (result === null) { return false; }
	    anObject(result);
	    return true;
	  }
	});

	var PROPER_FUNCTION_NAME$1 = functionName.PROPER;






	var TO_STRING = 'toString';
	var RegExpPrototype$2 = RegExp.prototype;
	var nativeToString = RegExpPrototype$2[TO_STRING];

	var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
	// FF44- RegExp#toString has a wrong name
	var INCORRECT_NAME = PROPER_FUNCTION_NAME$1 && nativeToString.name != TO_STRING;

	// `RegExp.prototype.toString` method
	// https://tc39.es/ecma262/#sec-regexp.prototype.tostring
	if (NOT_GENERIC || INCORRECT_NAME) {
	  defineBuiltIn(RegExp.prototype, TO_STRING, function toString() {
	    var R = anObject(this);
	    var pattern = toString_1(R.source);
	    var flags = toString_1(regexpGetFlags(R));
	    return '/' + pattern + '/' + flags;
	  }, { unsafe: true });
	}

	// `Set` constructor
	// https://tc39.es/ecma262/#sec-set-objects
	collection('Set', function (init) {
	  return function Set() { return init(this, arguments.length ? arguments[0] : undefined); };
	}, collectionStrong);

	var charAt$d = functionUncurryThis(''.charAt);

	var FORCED$4 = fails(function () {
	  // eslint-disable-next-line es/no-array-string-prototype-at -- safe
	  return '𠮷'.at(-2) !== '\uD842';
	});

	// `String.prototype.at` method
	// https://github.com/tc39/proposal-relative-indexing-method
	_export({ target: 'String', proto: true, forced: FORCED$4 }, {
	  at: function at(index) {
	    var S = toString_1(requireObjectCoercible(this));
	    var len = S.length;
	    var relativeIndex = toIntegerOrInfinity(index);
	    var k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
	    return (k < 0 || k >= len) ? undefined : charAt$d(S, k);
	  }
	});

	var charAt$c = functionUncurryThis(''.charAt);
	var charCodeAt$4 = functionUncurryThis(''.charCodeAt);
	var stringSlice$a = functionUncurryThis(''.slice);

	var createMethod$1 = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = toString_1(requireObjectCoercible($this));
	    var position = toIntegerOrInfinity(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) { return CONVERT_TO_STRING ? '' : undefined; }
	    first = charCodeAt$4(S, position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size
	      || (second = charCodeAt$4(S, position + 1)) < 0xDC00 || second > 0xDFFF
	        ? CONVERT_TO_STRING
	          ? charAt$c(S, position)
	          : first
	        : CONVERT_TO_STRING
	          ? stringSlice$a(S, position, position + 2)
	          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod$1(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod$1(true)
	};

	var codeAt$2 = stringMultibyte.codeAt;

	// `String.prototype.codePointAt` method
	// https://tc39.es/ecma262/#sec-string.prototype.codepointat
	_export({ target: 'String', proto: true }, {
	  codePointAt: function codePointAt(pos) {
	    return codeAt$2(this, pos);
	  }
	});

	var $TypeError$g = TypeError;

	var notARegexp = function (it) {
	  if (isRegexp(it)) {
	    throw $TypeError$g("The method doesn't accept regular expressions");
	  } return it;
	};

	var MATCH = wellKnownSymbol('match');

	var correctIsRegexpLogic = function (METHOD_NAME) {
	  var regexp = /./;
	  try {
	    '/./'[METHOD_NAME](regexp);
	  } catch (error1) {
	    try {
	      regexp[MATCH] = false;
	      return '/./'[METHOD_NAME](regexp);
	    } catch (error2) { /* empty */ }
	  } return false;
	};

	var getOwnPropertyDescriptor$3 = objectGetOwnPropertyDescriptor.f;







	// eslint-disable-next-line es/no-string-prototype-endswith -- safe
	var nativeEndsWith = functionUncurryThis(''.endsWith);
	var slice$2 = functionUncurryThis(''.slice);
	var min$7 = Math.min;

	var CORRECT_IS_REGEXP_LOGIC$1 = correctIsRegexpLogic('endsWith');
	// https://github.com/zloirock/core-js/pull/702
	var MDN_POLYFILL_BUG$1 = !CORRECT_IS_REGEXP_LOGIC$1 && !!function () {
	  var descriptor = getOwnPropertyDescriptor$3(String.prototype, 'endsWith');
	  return descriptor && !descriptor.writable;
	}();

	// `String.prototype.endsWith` method
	// https://tc39.es/ecma262/#sec-string.prototype.endswith
	_export({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG$1 && !CORRECT_IS_REGEXP_LOGIC$1 }, {
	  endsWith: function endsWith(searchString /* , endPosition = @length */) {
	    var that = toString_1(requireObjectCoercible(this));
	    notARegexp(searchString);
	    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
	    var len = that.length;
	    var end = endPosition === undefined ? len : min$7(toLength(endPosition), len);
	    var search = toString_1(searchString);
	    return nativeEndsWith
	      ? nativeEndsWith(that, search, end)
	      : slice$2(that, end - search.length, end) === search;
	  }
	});

	var $RangeError$7 = RangeError;
	var fromCharCode$3 = String.fromCharCode;
	// eslint-disable-next-line es/no-string-fromcodepoint -- required for testing
	var $fromCodePoint = String.fromCodePoint;
	var join$7 = functionUncurryThis([].join);

	// length should be 1, old FF problem
	var INCORRECT_LENGTH = !!$fromCodePoint && $fromCodePoint.length != 1;

	// `String.fromCodePoint` method
	// https://tc39.es/ecma262/#sec-string.fromcodepoint
	_export({ target: 'String', stat: true, arity: 1, forced: INCORRECT_LENGTH }, {
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  fromCodePoint: function fromCodePoint(x) {
	    var arguments$1 = arguments;

	    var elements = [];
	    var length = arguments.length;
	    var i = 0;
	    var code;
	    while (length > i) {
	      code = +arguments$1[i++];
	      if (toAbsoluteIndex(code, 0x10FFFF) !== code) { throw $RangeError$7(code + ' is not a valid code point'); }
	      elements[i] = code < 0x10000
	        ? fromCharCode$3(code)
	        : fromCharCode$3(((code -= 0x10000) >> 10) + 0xD800, code % 0x400 + 0xDC00);
	    } return join$7(elements, '');
	  }
	});

	var stringIndexOf$3 = functionUncurryThis(''.indexOf);

	// `String.prototype.includes` method
	// https://tc39.es/ecma262/#sec-string.prototype.includes
	_export({ target: 'String', proto: true, forced: !correctIsRegexpLogic('includes') }, {
	  includes: function includes(searchString /* , position = 0 */) {
	    return !!~stringIndexOf$3(
	      toString_1(requireObjectCoercible(this)),
	      toString_1(notARegexp(searchString)),
	      arguments.length > 1 ? arguments[1] : undefined
	    );
	  }
	});

	var charAt$b = stringMultibyte.charAt;





	var STRING_ITERATOR$1 = 'String Iterator';
	var setInternalState$d = internalState.set;
	var getInternalState$7 = internalState.getterFor(STRING_ITERATOR$1);

	// `String.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
	iteratorDefine(String, 'String', function (iterated) {
	  setInternalState$d(this, {
	    type: STRING_ITERATOR$1,
	    string: toString_1(iterated),
	    index: 0
	  });
	// `%StringIteratorPrototype%.next` method
	// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
	}, function next() {
	  var state = getInternalState$7(this);
	  var string = state.string;
	  var index = state.index;
	  var point;
	  if (index >= string.length) { return createIterResultObject(undefined, true); }
	  point = charAt$b(string, index);
	  state.index += point.length;
	  return createIterResultObject(point, false);
	});

	// TODO: Remove from `core-js@4` since it's moved to entry points








	var SPECIES = wellKnownSymbol('species');
	var RegExpPrototype$1 = RegExp.prototype;

	var fixRegexpWellKnownSymbolLogic = function (KEY, exec, FORCED, SHAM) {
	  var SYMBOL = wellKnownSymbol(KEY);

	  var DELEGATES_TO_SYMBOL = !fails(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};
	    O[SYMBOL] = function () { return 7; };
	    return ''[KEY](O) != 7;
	  });

	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;

	    if (KEY === 'split') {
	      // We can't use real regex here since it causes deoptimization
	      // and serious performance degradation in V8
	      // https://github.com/zloirock/core-js/issues/306
	      re = {};
	      // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.
	      re.constructor = {};
	      re.constructor[SPECIES] = function () { return re; };
	      re.flags = '';
	      re[SYMBOL] = /./[SYMBOL];
	    }

	    re.exec = function () { execCalled = true; return null; };

	    re[SYMBOL]('');
	    return !execCalled;
	  });

	  if (
	    !DELEGATES_TO_SYMBOL ||
	    !DELEGATES_TO_EXEC ||
	    FORCED
	  ) {
	    var uncurriedNativeRegExpMethod = functionUncurryThis(/./[SYMBOL]);
	    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
	      var uncurriedNativeMethod = functionUncurryThis(nativeMethod);
	      var $exec = regexp.exec;
	      if ($exec === regexpExec || $exec === RegExpPrototype$1.exec) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return { done: true, value: uncurriedNativeRegExpMethod(regexp, str, arg2) };
	        }
	        return { done: true, value: uncurriedNativeMethod(str, regexp, arg2) };
	      }
	      return { done: false };
	    });

	    defineBuiltIn(String.prototype, KEY, methods[0]);
	    defineBuiltIn(RegExpPrototype$1, SYMBOL, methods[1]);
	  }

	  if (SHAM) { createNonEnumerableProperty(RegExpPrototype$1[SYMBOL], 'sham', true); }
	};

	var charAt$a = stringMultibyte.charAt;

	// `AdvanceStringIndex` abstract operation
	// https://tc39.es/ecma262/#sec-advancestringindex
	var advanceStringIndex = function (S, index, unicode) {
	  return index + (unicode ? charAt$a(S, index).length : 1);
	};

	var $TypeError$f = TypeError;

	// `RegExpExec` abstract operation
	// https://tc39.es/ecma262/#sec-regexpexec
	var regexpExecAbstract = function (R, S) {
	  var exec = R.exec;
	  if (isCallable(exec)) {
	    var result = functionCall(exec, R, S);
	    if (result !== null) { anObject(result); }
	    return result;
	  }
	  if (classofRaw(R) === 'RegExp') { return functionCall(regexpExec, R, S); }
	  throw $TypeError$f('RegExp#exec called on incompatible receiver');
	};

	// @@match logic
	fixRegexpWellKnownSymbolLogic('match', function (MATCH, nativeMatch, maybeCallNative) {
	  return [
	    // `String.prototype.match` method
	    // https://tc39.es/ecma262/#sec-string.prototype.match
	    function match(regexp) {
	      var O = requireObjectCoercible(this);
	      var matcher = isNullOrUndefined(regexp) ? undefined : getMethod(regexp, MATCH);
	      return matcher ? functionCall(matcher, regexp, O) : new RegExp(regexp)[MATCH](toString_1(O));
	    },
	    // `RegExp.prototype[@@match]` method
	    // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
	    function (string) {
	      var rx = anObject(this);
	      var S = toString_1(string);
	      var res = maybeCallNative(nativeMatch, rx, S);

	      if (res.done) { return res.value; }

	      if (!rx.global) { return regexpExecAbstract(rx, S); }

	      var fullUnicode = rx.unicode;
	      rx.lastIndex = 0;
	      var A = [];
	      var n = 0;
	      var result;
	      while ((result = regexpExecAbstract(rx, S)) !== null) {
	        var matchStr = toString_1(result[0]);
	        A[n] = matchStr;
	        if (matchStr === '') { rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode); }
	        n++;
	      }
	      return n === 0 ? null : A;
	    }
	  ];
	});

	/* eslint-disable es/no-string-prototype-matchall -- safe */























	var MATCH_ALL = wellKnownSymbol('matchAll');
	var REGEXP_STRING = 'RegExp String';
	var REGEXP_STRING_ITERATOR = REGEXP_STRING + ' Iterator';
	var setInternalState$c = internalState.set;
	var getInternalState$6 = internalState.getterFor(REGEXP_STRING_ITERATOR);
	var RegExpPrototype = RegExp.prototype;
	var $TypeError$e = TypeError;
	var stringIndexOf$2 = functionUncurryThis(''.indexOf);
	var nativeMatchAll = functionUncurryThis(''.matchAll);

	var WORKS_WITH_NON_GLOBAL_REGEX = !!nativeMatchAll && !fails(function () {
	  nativeMatchAll('a', /./);
	});

	var $RegExpStringIterator = iteratorCreateConstructor(function RegExpStringIterator(regexp, string, $global, fullUnicode) {
	  setInternalState$c(this, {
	    type: REGEXP_STRING_ITERATOR,
	    regexp: regexp,
	    string: string,
	    global: $global,
	    unicode: fullUnicode,
	    done: false
	  });
	}, REGEXP_STRING, function next() {
	  var state = getInternalState$6(this);
	  if (state.done) { return createIterResultObject(undefined, true); }
	  var R = state.regexp;
	  var S = state.string;
	  var match = regexpExecAbstract(R, S);
	  if (match === null) {
	    state.done = true;
	    return createIterResultObject(undefined, true);
	  }
	  if (state.global) {
	    if (toString_1(match[0]) === '') { R.lastIndex = advanceStringIndex(S, toLength(R.lastIndex), state.unicode); }
	    return createIterResultObject(match, false);
	  }
	  state.done = true;
	  return createIterResultObject(match, false);
	});

	var $matchAll = function (string) {
	  var R = anObject(this);
	  var S = toString_1(string);
	  var C = speciesConstructor(R, RegExp);
	  var flags = toString_1(regexpGetFlags(R));
	  var matcher, $global, fullUnicode;
	  matcher = new C(C === RegExp ? R.source : R, flags);
	  $global = !!~stringIndexOf$2(flags, 'g');
	  fullUnicode = !!~stringIndexOf$2(flags, 'u');
	  matcher.lastIndex = toLength(R.lastIndex);
	  return new $RegExpStringIterator(matcher, S, $global, fullUnicode);
	};

	// `String.prototype.matchAll` method
	// https://tc39.es/ecma262/#sec-string.prototype.matchall
	_export({ target: 'String', proto: true, forced: WORKS_WITH_NON_GLOBAL_REGEX }, {
	  matchAll: function matchAll(regexp) {
	    var O = requireObjectCoercible(this);
	    var flags, S, matcher, rx;
	    if (!isNullOrUndefined(regexp)) {
	      if (isRegexp(regexp)) {
	        flags = toString_1(requireObjectCoercible(regexpGetFlags(regexp)));
	        if (!~stringIndexOf$2(flags, 'g')) { throw $TypeError$e('`.matchAll` does not allow non-global regexes'); }
	      }
	      if (WORKS_WITH_NON_GLOBAL_REGEX) { return nativeMatchAll(O, regexp); }
	      matcher = getMethod(regexp, MATCH_ALL);
	      if (matcher === undefined && isPure && classofRaw(regexp) == 'RegExp') { matcher = $matchAll; }
	      if (matcher) { return functionCall(matcher, regexp, O); }
	    } else if (WORKS_WITH_NON_GLOBAL_REGEX) { return nativeMatchAll(O, regexp); }
	    S = toString_1(O);
	    rx = new RegExp(regexp, 'g');
	    return rx[MATCH_ALL](S);
	  }
	});

	MATCH_ALL in RegExpPrototype || defineBuiltIn(RegExpPrototype, MATCH_ALL, $matchAll);

	// https://github.com/zloirock/core-js/issues/280


	var stringPadWebkitBug = /Version\/10(?:\.\d+){1,2}(?: [\w./]+)?(?: Mobile\/\w+)? Safari\//.test(engineUserAgent);

	var $padEnd = stringPad.end;


	// `String.prototype.padEnd` method
	// https://tc39.es/ecma262/#sec-string.prototype.padend
	_export({ target: 'String', proto: true, forced: stringPadWebkitBug }, {
	  padEnd: function padEnd(maxLength /* , fillString = ' ' */) {
	    return $padEnd(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var $padStart = stringPad.start;


	// `String.prototype.padStart` method
	// https://tc39.es/ecma262/#sec-string.prototype.padstart
	_export({ target: 'String', proto: true, forced: stringPadWebkitBug }, {
	  padStart: function padStart(maxLength /* , fillString = ' ' */) {
	    return $padStart(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var push$f = functionUncurryThis([].push);
	var join$6 = functionUncurryThis([].join);

	// `String.raw` method
	// https://tc39.es/ecma262/#sec-string.raw
	_export({ target: 'String', stat: true }, {
	  raw: function raw(template) {
	    var arguments$1 = arguments;

	    var rawTemplate = toIndexedObject(toObject(template).raw);
	    var literalSegments = lengthOfArrayLike(rawTemplate);
	    var argumentsLength = arguments.length;
	    var elements = [];
	    var i = 0;
	    while (literalSegments > i) {
	      push$f(elements, toString_1(rawTemplate[i++]));
	      if (i === literalSegments) { return join$6(elements, ''); }
	      if (i < argumentsLength) { push$f(elements, toString_1(arguments$1[i])); }
	    }
	  }
	});

	// `String.prototype.repeat` method
	// https://tc39.es/ecma262/#sec-string.prototype.repeat
	_export({ target: 'String', proto: true }, {
	  repeat: stringRepeat
	});

	var floor$3 = Math.floor;
	var charAt$9 = functionUncurryThis(''.charAt);
	var replace$5 = functionUncurryThis(''.replace);
	var stringSlice$9 = functionUncurryThis(''.slice);
	var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
	var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;

	// `GetSubstitution` abstract operation
	// https://tc39.es/ecma262/#sec-getsubstitution
	var getSubstitution = function (matched, str, position, captures, namedCaptures, replacement) {
	  var tailPos = position + matched.length;
	  var m = captures.length;
	  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
	  if (namedCaptures !== undefined) {
	    namedCaptures = toObject(namedCaptures);
	    symbols = SUBSTITUTION_SYMBOLS;
	  }
	  return replace$5(replacement, symbols, function (match, ch) {
	    var capture;
	    switch (charAt$9(ch, 0)) {
	      case '$': return '$';
	      case '&': return matched;
	      case '`': return stringSlice$9(str, 0, position);
	      case "'": return stringSlice$9(str, tailPos);
	      case '<':
	        capture = namedCaptures[stringSlice$9(ch, 1, -1)];
	        break;
	      default: // \d\d?
	        var n = +ch;
	        if (n === 0) { return match; }
	        if (n > m) {
	          var f = floor$3(n / 10);
	          if (f === 0) { return match; }
	          if (f <= m) { return captures[f - 1] === undefined ? charAt$9(ch, 1) : captures[f - 1] + charAt$9(ch, 1); }
	          return match;
	        }
	        capture = captures[n - 1];
	    }
	    return capture === undefined ? '' : capture;
	  });
	};

	var REPLACE$1 = wellKnownSymbol('replace');
	var max$5 = Math.max;
	var min$6 = Math.min;
	var concat$1 = functionUncurryThis([].concat);
	var push$e = functionUncurryThis([].push);
	var stringIndexOf$1 = functionUncurryThis(''.indexOf);
	var stringSlice$8 = functionUncurryThis(''.slice);

	var maybeToString = function (it) {
	  return it === undefined ? it : String(it);
	};

	// IE <= 11 replaces $0 with the whole match, as if it was $&
	// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
	var REPLACE_KEEPS_$0 = (function () {
	  // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
	  return 'a'.replace(/./, '$0') === '$0';
	})();

	// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
	var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
	  if (/./[REPLACE$1]) {
	    return /./[REPLACE$1]('a', '$0') === '';
	  }
	  return false;
	})();

	var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
	  var re = /./;
	  re.exec = function () {
	    var result = [];
	    result.groups = { a: '7' };
	    return result;
	  };
	  // eslint-disable-next-line regexp/no-useless-dollar-replacements -- false positive
	  return ''.replace(re, '$<a>') !== '7';
	});

	// @@replace logic
	fixRegexpWellKnownSymbolLogic('replace', function (_, nativeReplace, maybeCallNative) {
	  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

	  return [
	    // `String.prototype.replace` method
	    // https://tc39.es/ecma262/#sec-string.prototype.replace
	    function replace(searchValue, replaceValue) {
	      var O = requireObjectCoercible(this);
	      var replacer = isNullOrUndefined(searchValue) ? undefined : getMethod(searchValue, REPLACE$1);
	      return replacer
	        ? functionCall(replacer, searchValue, O, replaceValue)
	        : functionCall(nativeReplace, toString_1(O), searchValue, replaceValue);
	    },
	    // `RegExp.prototype[@@replace]` method
	    // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
	    function (string, replaceValue) {
	      var rx = anObject(this);
	      var S = toString_1(string);

	      if (
	        typeof replaceValue == 'string' &&
	        stringIndexOf$1(replaceValue, UNSAFE_SUBSTITUTE) === -1 &&
	        stringIndexOf$1(replaceValue, '$<') === -1
	      ) {
	        var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
	        if (res.done) { return res.value; }
	      }

	      var functionalReplace = isCallable(replaceValue);
	      if (!functionalReplace) { replaceValue = toString_1(replaceValue); }

	      var global = rx.global;
	      if (global) {
	        var fullUnicode = rx.unicode;
	        rx.lastIndex = 0;
	      }
	      var results = [];
	      while (true) {
	        var result = regexpExecAbstract(rx, S);
	        if (result === null) { break; }

	        push$e(results, result);
	        if (!global) { break; }

	        var matchStr = toString_1(result[0]);
	        if (matchStr === '') { rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode); }
	      }

	      var accumulatedResult = '';
	      var nextSourcePosition = 0;
	      for (var i = 0; i < results.length; i++) {
	        result = results[i];

	        var matched = toString_1(result[0]);
	        var position = max$5(min$6(toIntegerOrInfinity(result.index), S.length), 0);
	        var captures = [];
	        // NOTE: This is equivalent to
	        //   captures = result.slice(1).map(maybeToString)
	        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
	        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
	        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
	        for (var j = 1; j < result.length; j++) { push$e(captures, maybeToString(result[j])); }
	        var namedCaptures = result.groups;
	        if (functionalReplace) {
	          var replacerArgs = concat$1([matched], captures, position, S);
	          if (namedCaptures !== undefined) { push$e(replacerArgs, namedCaptures); }
	          var replacement = toString_1(functionApply(replaceValue, undefined, replacerArgs));
	        } else {
	          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
	        }
	        if (position >= nextSourcePosition) {
	          accumulatedResult += stringSlice$8(S, nextSourcePosition, position) + replacement;
	          nextSourcePosition = position + matched.length;
	        }
	      }
	      return accumulatedResult + stringSlice$8(S, nextSourcePosition);
	    }
	  ];
	}, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);

	var REPLACE = wellKnownSymbol('replace');
	var $TypeError$d = TypeError;
	var indexOf = functionUncurryThis(''.indexOf);
	functionUncurryThis(''.replace);
	var stringSlice$7 = functionUncurryThis(''.slice);
	var max$4 = Math.max;

	var stringIndexOf = function (string, searchValue, fromIndex) {
	  if (fromIndex > string.length) { return -1; }
	  if (searchValue === '') { return fromIndex; }
	  return indexOf(string, searchValue, fromIndex);
	};

	// `String.prototype.replaceAll` method
	// https://tc39.es/ecma262/#sec-string.prototype.replaceall
	_export({ target: 'String', proto: true }, {
	  replaceAll: function replaceAll(searchValue, replaceValue) {
	    var O = requireObjectCoercible(this);
	    var IS_REG_EXP, flags, replacer, string, searchString, functionalReplace, searchLength, advanceBy, replacement;
	    var position = 0;
	    var endOfLastMatch = 0;
	    var result = '';
	    if (!isNullOrUndefined(searchValue)) {
	      IS_REG_EXP = isRegexp(searchValue);
	      if (IS_REG_EXP) {
	        flags = toString_1(requireObjectCoercible(regexpGetFlags(searchValue)));
	        if (!~indexOf(flags, 'g')) { throw $TypeError$d('`.replaceAll` does not allow non-global regexes'); }
	      }
	      replacer = getMethod(searchValue, REPLACE);
	      if (replacer) {
	        return functionCall(replacer, searchValue, O, replaceValue);
	      }
	    }
	    string = toString_1(O);
	    searchString = toString_1(searchValue);
	    functionalReplace = isCallable(replaceValue);
	    if (!functionalReplace) { replaceValue = toString_1(replaceValue); }
	    searchLength = searchString.length;
	    advanceBy = max$4(1, searchLength);
	    position = stringIndexOf(string, searchString, 0);
	    while (position !== -1) {
	      replacement = functionalReplace
	        ? toString_1(replaceValue(searchString, position, string))
	        : getSubstitution(searchString, string, position, [], undefined, replaceValue);
	      result += stringSlice$7(string, endOfLastMatch, position) + replacement;
	      endOfLastMatch = position + searchLength;
	      position = stringIndexOf(string, searchString, position + advanceBy);
	    }
	    if (endOfLastMatch < string.length) {
	      result += stringSlice$7(string, endOfLastMatch);
	    }
	    return result;
	  }
	});

	// @@search logic
	fixRegexpWellKnownSymbolLogic('search', function (SEARCH, nativeSearch, maybeCallNative) {
	  return [
	    // `String.prototype.search` method
	    // https://tc39.es/ecma262/#sec-string.prototype.search
	    function search(regexp) {
	      var O = requireObjectCoercible(this);
	      var searcher = isNullOrUndefined(regexp) ? undefined : getMethod(regexp, SEARCH);
	      return searcher ? functionCall(searcher, regexp, O) : new RegExp(regexp)[SEARCH](toString_1(O));
	    },
	    // `RegExp.prototype[@@search]` method
	    // https://tc39.es/ecma262/#sec-regexp.prototype-@@search
	    function (string) {
	      var rx = anObject(this);
	      var S = toString_1(string);
	      var res = maybeCallNative(nativeSearch, rx, S);

	      if (res.done) { return res.value; }

	      var previousLastIndex = rx.lastIndex;
	      if (!sameValue(previousLastIndex, 0)) { rx.lastIndex = 0; }
	      var result = regexpExecAbstract(rx, S);
	      if (!sameValue(rx.lastIndex, previousLastIndex)) { rx.lastIndex = previousLastIndex; }
	      return result === null ? -1 : result.index;
	    }
	  ];
	});

	var UNSUPPORTED_Y = regexpStickyHelpers.UNSUPPORTED_Y;
	var MAX_UINT32 = 0xFFFFFFFF;
	var min$5 = Math.min;
	var $push = [].push;
	var exec$6 = functionUncurryThis(/./.exec);
	var push$d = functionUncurryThis($push);
	var stringSlice$6 = functionUncurryThis(''.slice);

	// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	// Weex JS has frozen built-in prototypes, so use try / catch wrapper
	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
	  // eslint-disable-next-line regexp/no-empty-group -- required for testing
	  var re = /(?:)/;
	  var originalExec = re.exec;
	  re.exec = function () { return originalExec.apply(this, arguments); };
	  var result = 'ab'.split(re);
	  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
	});

	// @@split logic
	fixRegexpWellKnownSymbolLogic('split', function (SPLIT, nativeSplit, maybeCallNative) {
	  var internalSplit;
	  if (
	    'abbc'.split(/(b)*/)[1] == 'c' ||
	    // eslint-disable-next-line regexp/no-empty-group -- required for testing
	    'test'.split(/(?:)/, -1).length != 4 ||
	    'ab'.split(/(?:ab)*/).length != 2 ||
	    '.'.split(/(.?)(.?)/).length != 4 ||
	    // eslint-disable-next-line regexp/no-empty-capturing-group, regexp/no-empty-group -- required for testing
	    '.'.split(/()()/).length > 1 ||
	    ''.split(/.?/).length
	  ) {
	    // based on es5-shim implementation, need to rework it
	    internalSplit = function (separator, limit) {
	      var string = toString_1(requireObjectCoercible(this));
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) { return []; }
	      if (separator === undefined) { return [string]; }
	      // If `separator` is not a regex, use native split
	      if (!isRegexp(separator)) {
	        return functionCall(nativeSplit, string, separator, lim);
	      }
	      var output = [];
	      var flags = (separator.ignoreCase ? 'i' : '') +
	                  (separator.multiline ? 'm' : '') +
	                  (separator.unicode ? 'u' : '') +
	                  (separator.sticky ? 'y' : '');
	      var lastLastIndex = 0;
	      // Make `global` and avoid `lastIndex` issues by working with a copy
	      var separatorCopy = new RegExp(separator.source, flags + 'g');
	      var match, lastIndex, lastLength;
	      while (match = functionCall(regexpExec, separatorCopy, string)) {
	        lastIndex = separatorCopy.lastIndex;
	        if (lastIndex > lastLastIndex) {
	          push$d(output, stringSlice$6(string, lastLastIndex, match.index));
	          if (match.length > 1 && match.index < string.length) { functionApply($push, output, arraySliceSimple(match, 1)); }
	          lastLength = match[0].length;
	          lastLastIndex = lastIndex;
	          if (output.length >= lim) { break; }
	        }
	        if (separatorCopy.lastIndex === match.index) { separatorCopy.lastIndex++; } // Avoid an infinite loop
	      }
	      if (lastLastIndex === string.length) {
	        if (lastLength || !exec$6(separatorCopy, '')) { push$d(output, ''); }
	      } else { push$d(output, stringSlice$6(string, lastLastIndex)); }
	      return output.length > lim ? arraySliceSimple(output, 0, lim) : output;
	    };
	  // Chakra, V8
	  } else if ('0'.split(undefined, 0).length) {
	    internalSplit = function (separator, limit) {
	      return separator === undefined && limit === 0 ? [] : functionCall(nativeSplit, this, separator, limit);
	    };
	  } else { internalSplit = nativeSplit; }

	  return [
	    // `String.prototype.split` method
	    // https://tc39.es/ecma262/#sec-string.prototype.split
	    function split(separator, limit) {
	      var O = requireObjectCoercible(this);
	      var splitter = isNullOrUndefined(separator) ? undefined : getMethod(separator, SPLIT);
	      return splitter
	        ? functionCall(splitter, separator, O, limit)
	        : functionCall(internalSplit, toString_1(O), separator, limit);
	    },
	    // `RegExp.prototype[@@split]` method
	    // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
	    //
	    // NOTE: This cannot be properly polyfilled in engines that don't support
	    // the 'y' flag.
	    function (string, limit) {
	      var rx = anObject(this);
	      var S = toString_1(string);
	      var res = maybeCallNative(internalSplit, rx, S, limit, internalSplit !== nativeSplit);

	      if (res.done) { return res.value; }

	      var C = speciesConstructor(rx, RegExp);

	      var unicodeMatching = rx.unicode;
	      var flags = (rx.ignoreCase ? 'i' : '') +
	                  (rx.multiline ? 'm' : '') +
	                  (rx.unicode ? 'u' : '') +
	                  (UNSUPPORTED_Y ? 'g' : 'y');

	      // ^(? + rx + ) is needed, in combination with some S slicing, to
	      // simulate the 'y' flag.
	      var splitter = new C(UNSUPPORTED_Y ? '^(?:' + rx.source + ')' : rx, flags);
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) { return []; }
	      if (S.length === 0) { return regexpExecAbstract(splitter, S) === null ? [S] : []; }
	      var p = 0;
	      var q = 0;
	      var A = [];
	      while (q < S.length) {
	        splitter.lastIndex = UNSUPPORTED_Y ? 0 : q;
	        var z = regexpExecAbstract(splitter, UNSUPPORTED_Y ? stringSlice$6(S, q) : S);
	        var e;
	        if (
	          z === null ||
	          (e = min$5(toLength(splitter.lastIndex + (UNSUPPORTED_Y ? q : 0)), S.length)) === p
	        ) {
	          q = advanceStringIndex(S, q, unicodeMatching);
	        } else {
	          push$d(A, stringSlice$6(S, p, q));
	          if (A.length === lim) { return A; }
	          for (var i = 1; i <= z.length - 1; i++) {
	            push$d(A, z[i]);
	            if (A.length === lim) { return A; }
	          }
	          q = p = e;
	        }
	      }
	      push$d(A, stringSlice$6(S, p));
	      return A;
	    }
	  ];
	}, !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC, UNSUPPORTED_Y);

	var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;







	// eslint-disable-next-line es/no-string-prototype-startswith -- safe
	var nativeStartsWith = functionUncurryThis(''.startsWith);
	var stringSlice$5 = functionUncurryThis(''.slice);
	var min$4 = Math.min;

	var CORRECT_IS_REGEXP_LOGIC = correctIsRegexpLogic('startsWith');
	// https://github.com/zloirock/core-js/pull/702
	var MDN_POLYFILL_BUG = !CORRECT_IS_REGEXP_LOGIC && !!function () {
	  var descriptor = getOwnPropertyDescriptor$2(String.prototype, 'startsWith');
	  return descriptor && !descriptor.writable;
	}();

	// `String.prototype.startsWith` method
	// https://tc39.es/ecma262/#sec-string.prototype.startswith
	_export({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
	  startsWith: function startsWith(searchString /* , position = 0 */) {
	    var that = toString_1(requireObjectCoercible(this));
	    notARegexp(searchString);
	    var index = toLength(min$4(arguments.length > 1 ? arguments[1] : undefined, that.length));
	    var search = toString_1(searchString);
	    return nativeStartsWith
	      ? nativeStartsWith(that, search, index)
	      : stringSlice$5(that, index, index + search.length) === search;
	  }
	});

	var stringSlice$4 = functionUncurryThis(''.slice);
	var max$3 = Math.max;
	var min$3 = Math.min;

	// eslint-disable-next-line unicorn/prefer-string-slice, es/no-string-prototype-substr -- required for testing
	var FORCED$3 = !''.substr || 'ab'.substr(-1) !== 'b';

	// `String.prototype.substr` method
	// https://tc39.es/ecma262/#sec-string.prototype.substr
	_export({ target: 'String', proto: true, forced: FORCED$3 }, {
	  substr: function substr(start, length) {
	    var that = toString_1(requireObjectCoercible(this));
	    var size = that.length;
	    var intStart = toIntegerOrInfinity(start);
	    var intLength, intEnd;
	    if (intStart === Infinity) { intStart = 0; }
	    if (intStart < 0) { intStart = max$3(size + intStart, 0); }
	    intLength = length === undefined ? size : toIntegerOrInfinity(length);
	    if (intLength <= 0 || intLength === Infinity) { return ''; }
	    intEnd = min$3(intStart + intLength, size);
	    return intStart >= intEnd ? '' : stringSlice$4(that, intStart, intEnd);
	  }
	});

	var PROPER_FUNCTION_NAME = functionName.PROPER;



	var non = '\u200B\u0085\u180E';

	// check that a method works with the correct list
	// of whitespaces and has a correct name
	var stringTrimForced = function (METHOD_NAME) {
	  return fails(function () {
	    return !!whitespaces$1[METHOD_NAME]()
	      || non[METHOD_NAME]() !== non
	      || (PROPER_FUNCTION_NAME && whitespaces$1[METHOD_NAME].name !== METHOD_NAME);
	  });
	};

	var $trim = stringTrim.trim;


	// `String.prototype.trim` method
	// https://tc39.es/ecma262/#sec-string.prototype.trim
	_export({ target: 'String', proto: true, forced: stringTrimForced('trim') }, {
	  trim: function trim() {
	    return $trim(this);
	  }
	});

	var $trimEnd = stringTrim.end;


	// `String.prototype.{ trimEnd, trimRight }` method
	// https://tc39.es/ecma262/#sec-string.prototype.trimend
	// https://tc39.es/ecma262/#String.prototype.trimright
	var stringTrimEnd = stringTrimForced('trimEnd') ? function trimEnd() {
	  return $trimEnd(this);
	// eslint-disable-next-line es/no-string-prototype-trimstart-trimend -- safe
	} : ''.trimEnd;

	// `String.prototype.trimRight` method
	// https://tc39.es/ecma262/#sec-string.prototype.trimend
	// eslint-disable-next-line es/no-string-prototype-trimleft-trimright -- safe
	_export({ target: 'String', proto: true, name: 'trimEnd', forced: ''.trimRight !== stringTrimEnd }, {
	  trimRight: stringTrimEnd
	});

	// TODO: Remove this line from `core-js@4`




	// `String.prototype.trimEnd` method
	// https://tc39.es/ecma262/#sec-string.prototype.trimend
	// eslint-disable-next-line es/no-string-prototype-trimstart-trimend -- safe
	_export({ target: 'String', proto: true, name: 'trimEnd', forced: ''.trimEnd !== stringTrimEnd }, {
	  trimEnd: stringTrimEnd
	});

	var $trimStart = stringTrim.start;


	// `String.prototype.{ trimStart, trimLeft }` method
	// https://tc39.es/ecma262/#sec-string.prototype.trimstart
	// https://tc39.es/ecma262/#String.prototype.trimleft
	var stringTrimStart = stringTrimForced('trimStart') ? function trimStart() {
	  return $trimStart(this);
	// eslint-disable-next-line es/no-string-prototype-trimstart-trimend -- safe
	} : ''.trimStart;

	// `String.prototype.trimLeft` method
	// https://tc39.es/ecma262/#sec-string.prototype.trimleft
	// eslint-disable-next-line es/no-string-prototype-trimleft-trimright -- safe
	_export({ target: 'String', proto: true, name: 'trimStart', forced: ''.trimLeft !== stringTrimStart }, {
	  trimLeft: stringTrimStart
	});

	// TODO: Remove this line from `core-js@4`




	// `String.prototype.trimStart` method
	// https://tc39.es/ecma262/#sec-string.prototype.trimstart
	// eslint-disable-next-line es/no-string-prototype-trimstart-trimend -- safe
	_export({ target: 'String', proto: true, name: 'trimStart', forced: ''.trimStart !== stringTrimStart }, {
	  trimStart: stringTrimStart
	});

	var quot = /"/g;
	var replace$4 = functionUncurryThis(''.replace);

	// `CreateHTML` abstract operation
	// https://tc39.es/ecma262/#sec-createhtml
	var createHtml = function (string, tag, attribute, value) {
	  var S = toString_1(requireObjectCoercible(string));
	  var p1 = '<' + tag;
	  if (attribute !== '') { p1 += ' ' + attribute + '="' + replace$4(toString_1(value), quot, '&quot;') + '"'; }
	  return p1 + '>' + S + '</' + tag + '>';
	};

	// check the existence of a method, lowercase
	// of a tag and escaping quotes in arguments
	var stringHtmlForced = function (METHOD_NAME) {
	  return fails(function () {
	    var test = ''[METHOD_NAME]('"');
	    return test !== test.toLowerCase() || test.split('"').length > 3;
	  });
	};

	// `String.prototype.anchor` method
	// https://tc39.es/ecma262/#sec-string.prototype.anchor
	_export({ target: 'String', proto: true, forced: stringHtmlForced('anchor') }, {
	  anchor: function anchor(name) {
	    return createHtml(this, 'a', 'name', name);
	  }
	});

	// `String.prototype.big` method
	// https://tc39.es/ecma262/#sec-string.prototype.big
	_export({ target: 'String', proto: true, forced: stringHtmlForced('big') }, {
	  big: function big() {
	    return createHtml(this, 'big', '', '');
	  }
	});

	// `String.prototype.blink` method
	// https://tc39.es/ecma262/#sec-string.prototype.blink
	_export({ target: 'String', proto: true, forced: stringHtmlForced('blink') }, {
	  blink: function blink() {
	    return createHtml(this, 'blink', '', '');
	  }
	});

	// `String.prototype.bold` method
	// https://tc39.es/ecma262/#sec-string.prototype.bold
	_export({ target: 'String', proto: true, forced: stringHtmlForced('bold') }, {
	  bold: function bold() {
	    return createHtml(this, 'b', '', '');
	  }
	});

	// `String.prototype.fixed` method
	// https://tc39.es/ecma262/#sec-string.prototype.fixed
	_export({ target: 'String', proto: true, forced: stringHtmlForced('fixed') }, {
	  fixed: function fixed() {
	    return createHtml(this, 'tt', '', '');
	  }
	});

	// `String.prototype.fontcolor` method
	// https://tc39.es/ecma262/#sec-string.prototype.fontcolor
	_export({ target: 'String', proto: true, forced: stringHtmlForced('fontcolor') }, {
	  fontcolor: function fontcolor(color) {
	    return createHtml(this, 'font', 'color', color);
	  }
	});

	// `String.prototype.fontsize` method
	// https://tc39.es/ecma262/#sec-string.prototype.fontsize
	_export({ target: 'String', proto: true, forced: stringHtmlForced('fontsize') }, {
	  fontsize: function fontsize(size) {
	    return createHtml(this, 'font', 'size', size);
	  }
	});

	// `String.prototype.italics` method
	// https://tc39.es/ecma262/#sec-string.prototype.italics
	_export({ target: 'String', proto: true, forced: stringHtmlForced('italics') }, {
	  italics: function italics() {
	    return createHtml(this, 'i', '', '');
	  }
	});

	// `String.prototype.link` method
	// https://tc39.es/ecma262/#sec-string.prototype.link
	_export({ target: 'String', proto: true, forced: stringHtmlForced('link') }, {
	  link: function link(url) {
	    return createHtml(this, 'a', 'href', url);
	  }
	});

	// `String.prototype.small` method
	// https://tc39.es/ecma262/#sec-string.prototype.small
	_export({ target: 'String', proto: true, forced: stringHtmlForced('small') }, {
	  small: function small() {
	    return createHtml(this, 'small', '', '');
	  }
	});

	// `String.prototype.strike` method
	// https://tc39.es/ecma262/#sec-string.prototype.strike
	_export({ target: 'String', proto: true, forced: stringHtmlForced('strike') }, {
	  strike: function strike() {
	    return createHtml(this, 'strike', '', '');
	  }
	});

	// `String.prototype.sub` method
	// https://tc39.es/ecma262/#sec-string.prototype.sub
	_export({ target: 'String', proto: true, forced: stringHtmlForced('sub') }, {
	  sub: function sub() {
	    return createHtml(this, 'sub', '', '');
	  }
	});

	// `String.prototype.sup` method
	// https://tc39.es/ecma262/#sec-string.prototype.sup
	_export({ target: 'String', proto: true, forced: stringHtmlForced('sup') }, {
	  sup: function sup() {
	    return createHtml(this, 'sup', '', '');
	  }
	});

	/* eslint-disable no-new -- required for testing */



	var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

	var ArrayBuffer$1 = global_1.ArrayBuffer;
	var Int8Array$3 = global_1.Int8Array;

	var typedArrayConstructorsRequireWrappers = !NATIVE_ARRAY_BUFFER_VIEWS || !fails(function () {
	  Int8Array$3(1);
	}) || !fails(function () {
	  new Int8Array$3(-1);
	}) || !checkCorrectnessOfIteration(function (iterable) {
	  new Int8Array$3();
	  new Int8Array$3(null);
	  new Int8Array$3(1.5);
	  new Int8Array$3(iterable);
	}, true) || fails(function () {
	  // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
	  return new Int8Array$3(new ArrayBuffer$1(2), 1, undefined).length !== 1;
	});

	var $RangeError$6 = RangeError;

	var toPositiveInteger = function (it) {
	  var result = toIntegerOrInfinity(it);
	  if (result < 0) { throw $RangeError$6("The argument can't be less than 0"); }
	  return result;
	};

	var $RangeError$5 = RangeError;

	var toOffset = function (it, BYTES) {
	  var offset = toPositiveInteger(it);
	  if (offset % BYTES) { throw $RangeError$5('Wrong offset'); }
	  return offset;
	};

	var slice$1 = functionUncurryThis(''.slice);

	var isBigIntArray = function (it) {
	  return slice$1(classof(it), 0, 3) === 'Big';
	};

	var $TypeError$c = TypeError;

	// `ToBigInt` abstract operation
	// https://tc39.es/ecma262/#sec-tobigint
	var toBigInt = function (argument) {
	  var prim = toPrimitive(argument, 'number');
	  if (typeof prim == 'number') { throw $TypeError$c("Can't convert number to bigint"); }
	  // eslint-disable-next-line es/no-bigint -- safe
	  return BigInt(prim);
	};

	var aTypedArrayConstructor$3 = arrayBufferViewCore.aTypedArrayConstructor;


	var typedArrayFrom = function from(source /* , mapfn, thisArg */) {
	  var C = aConstructor(this);
	  var O = toObject(source);
	  var argumentsLength = arguments.length;
	  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
	  var mapping = mapfn !== undefined;
	  var iteratorMethod = getIteratorMethod(O);
	  var i, length, result, thisIsBigIntArray, value, step, iterator, next;
	  if (iteratorMethod && !isArrayIteratorMethod(iteratorMethod)) {
	    iterator = getIterator(O, iteratorMethod);
	    next = iterator.next;
	    O = [];
	    while (!(step = functionCall(next, iterator)).done) {
	      O.push(step.value);
	    }
	  }
	  if (mapping && argumentsLength > 2) {
	    mapfn = functionBindContext(mapfn, arguments[2]);
	  }
	  length = lengthOfArrayLike(O);
	  result = new (aTypedArrayConstructor$3(C))(length);
	  thisIsBigIntArray = isBigIntArray(result);
	  for (i = 0; length > i; i++) {
	    value = mapping ? mapfn(O[i], i) : O[i];
	    // FF30- typed arrays doesn't properly convert objects to typed array values
	    result[i] = thisIsBigIntArray ? toBigInt(value) : +value;
	  }
	  return result;
	};

	var typedArrayConstructor = createCommonjsModule(function (module) {






















	var getOwnPropertyNames = objectGetOwnPropertyNames.f;

	var forEach = arrayIteration.forEach;






	var getInternalState = internalState.get;
	var setInternalState = internalState.set;
	var enforceInternalState = internalState.enforce;
	var nativeDefineProperty = objectDefineProperty.f;
	var nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	var round = Math.round;
	var RangeError = global_1.RangeError;
	var ArrayBuffer = arrayBuffer.ArrayBuffer;
	var ArrayBufferPrototype = ArrayBuffer.prototype;
	var DataView = arrayBuffer.DataView;
	var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
	var TYPED_ARRAY_TAG = arrayBufferViewCore.TYPED_ARRAY_TAG;
	var TypedArray = arrayBufferViewCore.TypedArray;
	var TypedArrayPrototype = arrayBufferViewCore.TypedArrayPrototype;
	var aTypedArrayConstructor = arrayBufferViewCore.aTypedArrayConstructor;
	var isTypedArray = arrayBufferViewCore.isTypedArray;
	var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
	var WRONG_LENGTH = 'Wrong length';

	var fromList = function (C, list) {
	  aTypedArrayConstructor(C);
	  var index = 0;
	  var length = list.length;
	  var result = new C(length);
	  while (length > index) { result[index] = list[index++]; }
	  return result;
	};

	var addGetter = function (it, key) {
	  nativeDefineProperty(it, key, { get: function () {
	    return getInternalState(this)[key];
	  } });
	};

	var isArrayBuffer = function (it) {
	  var klass;
	  return objectIsPrototypeOf(ArrayBufferPrototype, it) || (klass = classof(it)) == 'ArrayBuffer' || klass == 'SharedArrayBuffer';
	};

	var isTypedArrayIndex = function (target, key) {
	  return isTypedArray(target)
	    && !isSymbol(key)
	    && key in target
	    && isIntegralNumber(+key)
	    && key >= 0;
	};

	var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
	  key = toPropertyKey(key);
	  return isTypedArrayIndex(target, key)
	    ? createPropertyDescriptor(2, target[key])
	    : nativeGetOwnPropertyDescriptor(target, key);
	};

	var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
	  key = toPropertyKey(key);
	  if (isTypedArrayIndex(target, key)
	    && isObject(descriptor)
	    && hasOwnProperty_1(descriptor, 'value')
	    && !hasOwnProperty_1(descriptor, 'get')
	    && !hasOwnProperty_1(descriptor, 'set')
	    // TODO: add validation descriptor w/o calling accessors
	    && !descriptor.configurable
	    && (!hasOwnProperty_1(descriptor, 'writable') || descriptor.writable)
	    && (!hasOwnProperty_1(descriptor, 'enumerable') || descriptor.enumerable)
	  ) {
	    target[key] = descriptor.value;
	    return target;
	  } return nativeDefineProperty(target, key, descriptor);
	};

	if (descriptors) {
	  if (!NATIVE_ARRAY_BUFFER_VIEWS) {
	    objectGetOwnPropertyDescriptor.f = wrappedGetOwnPropertyDescriptor;
	    objectDefineProperty.f = wrappedDefineProperty;
	    addGetter(TypedArrayPrototype, 'buffer');
	    addGetter(TypedArrayPrototype, 'byteOffset');
	    addGetter(TypedArrayPrototype, 'byteLength');
	    addGetter(TypedArrayPrototype, 'length');
	  }

	  _export({ target: 'Object', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS }, {
	    getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
	    defineProperty: wrappedDefineProperty
	  });

	  module.exports = function (TYPE, wrapper, CLAMPED) {
	    var BYTES = TYPE.match(/\d+$/)[0] / 8;
	    var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array';
	    var GETTER = 'get' + TYPE;
	    var SETTER = 'set' + TYPE;
	    var NativeTypedArrayConstructor = global_1[CONSTRUCTOR_NAME];
	    var TypedArrayConstructor = NativeTypedArrayConstructor;
	    var TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype;
	    var exported = {};

	    var getter = function (that, index) {
	      var data = getInternalState(that);
	      return data.view[GETTER](index * BYTES + data.byteOffset, true);
	    };

	    var setter = function (that, index, value) {
	      var data = getInternalState(that);
	      if (CLAMPED) { value = (value = round(value)) < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF; }
	      data.view[SETTER](index * BYTES + data.byteOffset, value, true);
	    };

	    var addElement = function (that, index) {
	      nativeDefineProperty(that, index, {
	        get: function () {
	          return getter(this, index);
	        },
	        set: function (value) {
	          return setter(this, index, value);
	        },
	        enumerable: true
	      });
	    };

	    if (!NATIVE_ARRAY_BUFFER_VIEWS) {
	      TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
	        anInstance(that, TypedArrayConstructorPrototype);
	        var index = 0;
	        var byteOffset = 0;
	        var buffer, byteLength, length;
	        if (!isObject(data)) {
	          length = toIndex(data);
	          byteLength = length * BYTES;
	          buffer = new ArrayBuffer(byteLength);
	        } else if (isArrayBuffer(data)) {
	          buffer = data;
	          byteOffset = toOffset(offset, BYTES);
	          var $len = data.byteLength;
	          if ($length === undefined) {
	            if ($len % BYTES) { throw RangeError(WRONG_LENGTH); }
	            byteLength = $len - byteOffset;
	            if (byteLength < 0) { throw RangeError(WRONG_LENGTH); }
	          } else {
	            byteLength = toLength($length) * BYTES;
	            if (byteLength + byteOffset > $len) { throw RangeError(WRONG_LENGTH); }
	          }
	          length = byteLength / BYTES;
	        } else if (isTypedArray(data)) {
	          return fromList(TypedArrayConstructor, data);
	        } else {
	          return functionCall(typedArrayFrom, TypedArrayConstructor, data);
	        }
	        setInternalState(that, {
	          buffer: buffer,
	          byteOffset: byteOffset,
	          byteLength: byteLength,
	          length: length,
	          view: new DataView(buffer)
	        });
	        while (index < length) { addElement(that, index++); }
	      });

	      if (objectSetPrototypeOf) { objectSetPrototypeOf(TypedArrayConstructor, TypedArray); }
	      TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = objectCreate(TypedArrayPrototype);
	    } else if (typedArrayConstructorsRequireWrappers) {
	      TypedArrayConstructor = wrapper(function (dummy, data, typedArrayOffset, $length) {
	        anInstance(dummy, TypedArrayConstructorPrototype);
	        return inheritIfRequired(function () {
	          if (!isObject(data)) { return new NativeTypedArrayConstructor(toIndex(data)); }
	          if (isArrayBuffer(data)) { return $length !== undefined
	            ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES), $length)
	            : typedArrayOffset !== undefined
	              ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES))
	              : new NativeTypedArrayConstructor(data); }
	          if (isTypedArray(data)) { return fromList(TypedArrayConstructor, data); }
	          return functionCall(typedArrayFrom, TypedArrayConstructor, data);
	        }(), dummy, TypedArrayConstructor);
	      });

	      if (objectSetPrototypeOf) { objectSetPrototypeOf(TypedArrayConstructor, TypedArray); }
	      forEach(getOwnPropertyNames(NativeTypedArrayConstructor), function (key) {
	        if (!(key in TypedArrayConstructor)) {
	          createNonEnumerableProperty(TypedArrayConstructor, key, NativeTypedArrayConstructor[key]);
	        }
	      });
	      TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
	    }

	    if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
	      createNonEnumerableProperty(TypedArrayConstructorPrototype, 'constructor', TypedArrayConstructor);
	    }

	    enforceInternalState(TypedArrayConstructorPrototype).TypedArrayConstructor = TypedArrayConstructor;

	    if (TYPED_ARRAY_TAG) {
	      createNonEnumerableProperty(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME);
	    }

	    var FORCED = TypedArrayConstructor != NativeTypedArrayConstructor;

	    exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;

	    _export({ global: true, constructor: true, forced: FORCED, sham: !NATIVE_ARRAY_BUFFER_VIEWS }, exported);

	    if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
	      createNonEnumerableProperty(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
	    }

	    if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
	      createNonEnumerableProperty(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
	    }

	    setSpecies(CONSTRUCTOR_NAME);
	  };
	} else { module.exports = function () { /* empty */ }; }
	});

	// `Float32Array` constructor
	// https://tc39.es/ecma262/#sec-typedarray-objects
	typedArrayConstructor('Float32', function (init) {
	  return function Float32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	// `Float64Array` constructor
	// https://tc39.es/ecma262/#sec-typedarray-objects
	typedArrayConstructor('Float64', function (init) {
	  return function Float64Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	// `Int8Array` constructor
	// https://tc39.es/ecma262/#sec-typedarray-objects
	typedArrayConstructor('Int8', function (init) {
	  return function Int8Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	// `Int16Array` constructor
	// https://tc39.es/ecma262/#sec-typedarray-objects
	typedArrayConstructor('Int16', function (init) {
	  return function Int16Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	// `Int32Array` constructor
	// https://tc39.es/ecma262/#sec-typedarray-objects
	typedArrayConstructor('Int32', function (init) {
	  return function Int32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	// `Uint8Array` constructor
	// https://tc39.es/ecma262/#sec-typedarray-objects
	typedArrayConstructor('Uint8', function (init) {
	  return function Uint8Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	// `Uint8ClampedArray` constructor
	// https://tc39.es/ecma262/#sec-typedarray-objects
	typedArrayConstructor('Uint8', function (init) {
	  return function Uint8ClampedArray(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	}, true);

	// `Uint16Array` constructor
	// https://tc39.es/ecma262/#sec-typedarray-objects
	typedArrayConstructor('Uint16', function (init) {
	  return function Uint16Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	// `Uint32Array` constructor
	// https://tc39.es/ecma262/#sec-typedarray-objects
	typedArrayConstructor('Uint32', function (init) {
	  return function Uint32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var aTypedArray$w = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$x = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.at` method
	// https://github.com/tc39/proposal-relative-indexing-method
	exportTypedArrayMethod$x('at', function at(index) {
	  var O = aTypedArray$w(this);
	  var len = lengthOfArrayLike(O);
	  var relativeIndex = toIntegerOrInfinity(index);
	  var k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
	  return (k < 0 || k >= len) ? undefined : O[k];
	});

	var u$ArrayCopyWithin = functionUncurryThis(arrayCopyWithin);
	var aTypedArray$v = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$w = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.copyWithin` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.copywithin
	exportTypedArrayMethod$w('copyWithin', function copyWithin(target, start /* , end */) {
	  return u$ArrayCopyWithin(aTypedArray$v(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
	});

	var $every$1 = arrayIteration.every;

	var aTypedArray$u = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$v = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.every` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.every
	exportTypedArrayMethod$v('every', function every(callbackfn /* , thisArg */) {
	  return $every$1(aTypedArray$u(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	var aTypedArray$t = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$u = arrayBufferViewCore.exportTypedArrayMethod;
	var slice = functionUncurryThis(''.slice);

	// V8 ~ Chrome < 59, Safari < 14.1, FF < 55, Edge <=18
	var CONVERSION_BUG = fails(function () {
	  var count = 0;
	  // eslint-disable-next-line es/no-typed-arrays -- safe
	  new Int8Array(2).fill({ valueOf: function () { return count++; } });
	  return count !== 1;
	});

	// `%TypedArray%.prototype.fill` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.fill
	exportTypedArrayMethod$u('fill', function fill(value /* , start, end */) {
	  var length = arguments.length;
	  aTypedArray$t(this);
	  var actualValue = slice(classof(this), 0, 3) === 'Big' ? toBigInt(value) : +value;
	  return functionCall(arrayFill, this, actualValue, length > 1 ? arguments[1] : undefined, length > 2 ? arguments[2] : undefined);
	}, CONVERSION_BUG);

	var arrayFromConstructorAndList = function (Constructor, list) {
	  var index = 0;
	  var length = lengthOfArrayLike(list);
	  var result = new Constructor(length);
	  while (length > index) { result[index] = list[index++]; }
	  return result;
	};

	var aTypedArrayConstructor$2 = arrayBufferViewCore.aTypedArrayConstructor;
	var getTypedArrayConstructor$4 = arrayBufferViewCore.getTypedArrayConstructor;

	// a part of `TypedArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#typedarray-species-create
	var typedArraySpeciesConstructor = function (originalArray) {
	  return aTypedArrayConstructor$2(speciesConstructor(originalArray, getTypedArrayConstructor$4(originalArray)));
	};

	var typedArrayFromSpeciesAndList = function (instance, list) {
	  return arrayFromConstructorAndList(typedArraySpeciesConstructor(instance), list);
	};

	var $filter = arrayIteration.filter;


	var aTypedArray$s = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$t = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.filter` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.filter
	exportTypedArrayMethod$t('filter', function filter(callbackfn /* , thisArg */) {
	  var list = $filter(aTypedArray$s(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  return typedArrayFromSpeciesAndList(this, list);
	});

	var $find$1 = arrayIteration.find;

	var aTypedArray$r = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$s = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.find` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.find
	exportTypedArrayMethod$s('find', function find(predicate /* , thisArg */) {
	  return $find$1(aTypedArray$r(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	});

	var $findIndex = arrayIteration.findIndex;

	var aTypedArray$q = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$r = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.findIndex` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.findindex
	exportTypedArrayMethod$r('findIndex', function findIndex(predicate /* , thisArg */) {
	  return $findIndex(aTypedArray$q(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	});

	var $findLast = arrayIterationFromLast.findLast;

	var aTypedArray$p = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$q = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.findLast` method
	// https://github.com/tc39/proposal-array-find-from-last
	exportTypedArrayMethod$q('findLast', function findLast(predicate /* , thisArg */) {
	  return $findLast(aTypedArray$p(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	});

	var $findLastIndex = arrayIterationFromLast.findLastIndex;

	var aTypedArray$o = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$p = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.findLastIndex` method
	// https://github.com/tc39/proposal-array-find-from-last
	exportTypedArrayMethod$p('findLastIndex', function findLastIndex(predicate /* , thisArg */) {
	  return $findLastIndex(aTypedArray$o(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	});

	var $forEach$1 = arrayIteration.forEach;

	var aTypedArray$n = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$o = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.forEach` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.foreach
	exportTypedArrayMethod$o('forEach', function forEach(callbackfn /* , thisArg */) {
	  $forEach$1(aTypedArray$n(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	var exportTypedArrayStaticMethod$2 = arrayBufferViewCore.exportTypedArrayStaticMethod;


	// `%TypedArray%.from` method
	// https://tc39.es/ecma262/#sec-%typedarray%.from
	exportTypedArrayStaticMethod$2('from', typedArrayFrom, typedArrayConstructorsRequireWrappers);

	var $includes = arrayIncludes.includes;

	var aTypedArray$m = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$n = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.includes` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.includes
	exportTypedArrayMethod$n('includes', function includes(searchElement /* , fromIndex */) {
	  return $includes(aTypedArray$m(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	});

	var $indexOf = arrayIncludes.indexOf;

	var aTypedArray$l = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$m = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.indexOf` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.indexof
	exportTypedArrayMethod$m('indexOf', function indexOf(searchElement /* , fromIndex */) {
	  return $indexOf(aTypedArray$l(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	});

	var ITERATOR$3 = wellKnownSymbol('iterator');
	var Uint8Array$2 = global_1.Uint8Array;
	var arrayValues = functionUncurryThis(es_array_iterator.values);
	var arrayKeys = functionUncurryThis(es_array_iterator.keys);
	var arrayEntries = functionUncurryThis(es_array_iterator.entries);
	var aTypedArray$k = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$l = arrayBufferViewCore.exportTypedArrayMethod;
	var TypedArrayPrototype = Uint8Array$2 && Uint8Array$2.prototype;

	var GENERIC = !fails(function () {
	  TypedArrayPrototype[ITERATOR$3].call([1]);
	});

	var ITERATOR_IS_VALUES = !!TypedArrayPrototype
	  && TypedArrayPrototype.values
	  && TypedArrayPrototype[ITERATOR$3] === TypedArrayPrototype.values
	  && TypedArrayPrototype.values.name === 'values';

	var typedArrayValues = function values() {
	  return arrayValues(aTypedArray$k(this));
	};

	// `%TypedArray%.prototype.entries` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.entries
	exportTypedArrayMethod$l('entries', function entries() {
	  return arrayEntries(aTypedArray$k(this));
	}, GENERIC);
	// `%TypedArray%.prototype.keys` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.keys
	exportTypedArrayMethod$l('keys', function keys() {
	  return arrayKeys(aTypedArray$k(this));
	}, GENERIC);
	// `%TypedArray%.prototype.values` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.values
	exportTypedArrayMethod$l('values', typedArrayValues, GENERIC || !ITERATOR_IS_VALUES, { name: 'values' });
	// `%TypedArray%.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype-@@iterator
	exportTypedArrayMethod$l(ITERATOR$3, typedArrayValues, GENERIC || !ITERATOR_IS_VALUES, { name: 'values' });

	var aTypedArray$j = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$k = arrayBufferViewCore.exportTypedArrayMethod;
	var $join = functionUncurryThis([].join);

	// `%TypedArray%.prototype.join` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.join
	exportTypedArrayMethod$k('join', function join(separator) {
	  return $join(aTypedArray$j(this), separator);
	});

	var aTypedArray$i = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$j = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.lastIndexOf` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.lastindexof
	exportTypedArrayMethod$j('lastIndexOf', function lastIndexOf(searchElement /* , fromIndex */) {
	  var length = arguments.length;
	  return functionApply(arrayLastIndexOf, aTypedArray$i(this), length > 1 ? [searchElement, arguments[1]] : [searchElement]);
	});

	var $map = arrayIteration.map;


	var aTypedArray$h = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$i = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.map` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.map
	exportTypedArrayMethod$i('map', function map(mapfn /* , thisArg */) {
	  return $map(aTypedArray$h(this), mapfn, arguments.length > 1 ? arguments[1] : undefined, function (O, length) {
	    return new (typedArraySpeciesConstructor(O))(length);
	  });
	});

	var aTypedArrayConstructor$1 = arrayBufferViewCore.aTypedArrayConstructor;
	var exportTypedArrayStaticMethod$1 = arrayBufferViewCore.exportTypedArrayStaticMethod;

	// `%TypedArray%.of` method
	// https://tc39.es/ecma262/#sec-%typedarray%.of
	exportTypedArrayStaticMethod$1('of', function of(/* ...items */) {
	  var arguments$1 = arguments;

	  var index = 0;
	  var length = arguments.length;
	  var result = new (aTypedArrayConstructor$1(this))(length);
	  while (length > index) { result[index] = arguments$1[index++]; }
	  return result;
	}, typedArrayConstructorsRequireWrappers);

	var $reduce = arrayReduce.left;

	var aTypedArray$g = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$h = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.reduce` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduce
	exportTypedArrayMethod$h('reduce', function reduce(callbackfn /* , initialValue */) {
	  var length = arguments.length;
	  return $reduce(aTypedArray$g(this), callbackfn, length, length > 1 ? arguments[1] : undefined);
	});

	var $reduceRight = arrayReduce.right;

	var aTypedArray$f = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$g = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.reduceRight` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduceright
	exportTypedArrayMethod$g('reduceRight', function reduceRight(callbackfn /* , initialValue */) {
	  var length = arguments.length;
	  return $reduceRight(aTypedArray$f(this), callbackfn, length, length > 1 ? arguments[1] : undefined);
	});

	var aTypedArray$e = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$f = arrayBufferViewCore.exportTypedArrayMethod;
	var floor$2 = Math.floor;

	// `%TypedArray%.prototype.reverse` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reverse
	exportTypedArrayMethod$f('reverse', function reverse() {
	  var that = this;
	  var length = aTypedArray$e(that).length;
	  var middle = floor$2(length / 2);
	  var index = 0;
	  var value;
	  while (index < middle) {
	    value = that[index];
	    that[index++] = that[--length];
	    that[length] = value;
	  } return that;
	});

	var RangeError$2 = global_1.RangeError;
	var Int8Array$2 = global_1.Int8Array;
	var Int8ArrayPrototype = Int8Array$2 && Int8Array$2.prototype;
	var $set = Int8ArrayPrototype && Int8ArrayPrototype.set;
	var aTypedArray$d = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$e = arrayBufferViewCore.exportTypedArrayMethod;

	var WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS = !fails(function () {
	  // eslint-disable-next-line es/no-typed-arrays -- required for testing
	  var array = new Uint8ClampedArray(2);
	  functionCall($set, array, { length: 1, 0: 3 }, 1);
	  return array[1] !== 3;
	});

	// https://bugs.chromium.org/p/v8/issues/detail?id=11294 and other
	var TO_OBJECT_BUG = WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS && arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS && fails(function () {
	  var array = new Int8Array$2(2);
	  array.set(1);
	  array.set('2', 1);
	  return array[0] !== 0 || array[1] !== 2;
	});

	// `%TypedArray%.prototype.set` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.set
	exportTypedArrayMethod$e('set', function set(arrayLike /* , offset */) {
	  aTypedArray$d(this);
	  var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
	  var src = toObject(arrayLike);
	  if (WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS) { return functionCall($set, this, src, offset); }
	  var length = this.length;
	  var len = lengthOfArrayLike(src);
	  var index = 0;
	  if (len + offset > length) { throw RangeError$2('Wrong length'); }
	  while (index < len) { this[offset + index] = src[index++]; }
	}, !WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS || TO_OBJECT_BUG);

	var aTypedArray$c = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$d = arrayBufferViewCore.exportTypedArrayMethod;

	var FORCED$2 = fails(function () {
	  // eslint-disable-next-line es/no-typed-arrays -- required for testing
	  new Int8Array(1).slice();
	});

	// `%TypedArray%.prototype.slice` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.slice
	exportTypedArrayMethod$d('slice', function slice(start, end) {
	  var list = arraySlice$1(aTypedArray$c(this), start, end);
	  var C = typedArraySpeciesConstructor(this);
	  var index = 0;
	  var length = list.length;
	  var result = new C(length);
	  while (length > index) { result[index] = list[index++]; }
	  return result;
	}, FORCED$2);

	var $some$1 = arrayIteration.some;

	var aTypedArray$b = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$c = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.some` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.some
	exportTypedArrayMethod$c('some', function some(callbackfn /* , thisArg */) {
	  return $some$1(aTypedArray$b(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	var aTypedArray$a = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$b = arrayBufferViewCore.exportTypedArrayMethod;
	var Uint16Array = global_1.Uint16Array;
	var nativeSort = Uint16Array && functionUncurryThis(Uint16Array.prototype.sort);

	// WebKit
	var ACCEPT_INCORRECT_ARGUMENTS = !!nativeSort && !(fails(function () {
	  nativeSort(new Uint16Array(2), null);
	}) && fails(function () {
	  nativeSort(new Uint16Array(2), {});
	}));

	var STABLE_SORT = !!nativeSort && !fails(function () {
	  // feature detection can be too slow, so check engines versions
	  if (engineV8Version) { return engineV8Version < 74; }
	  if (engineFfVersion) { return engineFfVersion < 67; }
	  if (engineIsIeOrEdge) { return true; }
	  if (engineWebkitVersion) { return engineWebkitVersion < 602; }

	  var array = new Uint16Array(516);
	  var expected = Array(516);
	  var index, mod;

	  for (index = 0; index < 516; index++) {
	    mod = index % 4;
	    array[index] = 515 - index;
	    expected[index] = index - 2 * mod + 3;
	  }

	  nativeSort(array, function (a, b) {
	    return (a / 4 | 0) - (b / 4 | 0);
	  });

	  for (index = 0; index < 516; index++) {
	    if (array[index] !== expected[index]) { return true; }
	  }
	});

	var getSortCompare = function (comparefn) {
	  return function (x, y) {
	    if (comparefn !== undefined) { return +comparefn(x, y) || 0; }
	    // eslint-disable-next-line no-self-compare -- NaN check
	    if (y !== y) { return -1; }
	    // eslint-disable-next-line no-self-compare -- NaN check
	    if (x !== x) { return 1; }
	    if (x === 0 && y === 0) { return 1 / x > 0 && 1 / y < 0 ? 1 : -1; }
	    return x > y;
	  };
	};

	// `%TypedArray%.prototype.sort` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort
	exportTypedArrayMethod$b('sort', function sort(comparefn) {
	  if (comparefn !== undefined) { aCallable(comparefn); }
	  if (STABLE_SORT) { return nativeSort(this, comparefn); }

	  return arraySort(aTypedArray$a(this), getSortCompare(comparefn));
	}, !STABLE_SORT || ACCEPT_INCORRECT_ARGUMENTS);

	var aTypedArray$9 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$a = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.subarray` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.subarray
	exportTypedArrayMethod$a('subarray', function subarray(begin, end) {
	  var O = aTypedArray$9(this);
	  var length = O.length;
	  var beginIndex = toAbsoluteIndex(begin, length);
	  var C = typedArraySpeciesConstructor(O);
	  return new C(
	    O.buffer,
	    O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT,
	    toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - beginIndex)
	  );
	});

	var Int8Array$1 = global_1.Int8Array;
	var aTypedArray$8 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$9 = arrayBufferViewCore.exportTypedArrayMethod;
	var $toLocaleString = [].toLocaleString;

	// iOS Safari 6.x fails here
	var TO_LOCALE_STRING_BUG = !!Int8Array$1 && fails(function () {
	  $toLocaleString.call(new Int8Array$1(1));
	});

	var FORCED$1 = fails(function () {
	  return [1, 2].toLocaleString() != new Int8Array$1([1, 2]).toLocaleString();
	}) || !fails(function () {
	  Int8Array$1.prototype.toLocaleString.call([1, 2]);
	});

	// `%TypedArray%.prototype.toLocaleString` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.tolocalestring
	exportTypedArrayMethod$9('toLocaleString', function toLocaleString() {
	  return functionApply(
	    $toLocaleString,
	    TO_LOCALE_STRING_BUG ? arraySlice$1(aTypedArray$8(this)) : aTypedArray$8(this),
	    arraySlice$1(arguments)
	  );
	}, FORCED$1);

	var exportTypedArrayMethod$8 = arrayBufferViewCore.exportTypedArrayMethod;




	var Uint8Array$1 = global_1.Uint8Array;
	var Uint8ArrayPrototype = Uint8Array$1 && Uint8Array$1.prototype || {};
	var arrayToString = [].toString;
	var join$5 = functionUncurryThis([].join);

	if (fails(function () { arrayToString.call({}); })) {
	  arrayToString = function toString() {
	    return join$5(this);
	  };
	}

	var IS_NOT_ARRAY_METHOD = Uint8ArrayPrototype.toString != arrayToString;

	// `%TypedArray%.prototype.toString` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.tostring
	exportTypedArrayMethod$8('toString', arrayToString, IS_NOT_ARRAY_METHOD);

	var fromCharCode$2 = String.fromCharCode;
	var charAt$8 = functionUncurryThis(''.charAt);
	var exec$5 = functionUncurryThis(/./.exec);
	var stringSlice$3 = functionUncurryThis(''.slice);

	var hex2 = /^[\da-f]{2}$/i;
	var hex4 = /^[\da-f]{4}$/i;

	// `unescape` method
	// https://tc39.es/ecma262/#sec-unescape-string
	_export({ global: true }, {
	  unescape: function unescape(string) {
	    var str = toString_1(string);
	    var result = '';
	    var length = str.length;
	    var index = 0;
	    var chr, part;
	    while (index < length) {
	      chr = charAt$8(str, index++);
	      if (chr === '%') {
	        if (charAt$8(str, index) === 'u') {
	          part = stringSlice$3(str, index + 1, index + 5);
	          if (exec$5(hex4, part)) {
	            result += fromCharCode$2(parseInt(part, 16));
	            index += 5;
	            continue;
	          }
	        } else {
	          part = stringSlice$3(str, index, index + 2);
	          if (exec$5(hex2, part)) {
	            result += fromCharCode$2(parseInt(part, 16));
	            index += 2;
	            continue;
	          }
	        }
	      }
	      result += chr;
	    } return result;
	  }
	});

	var getWeakData = internalMetadata.getWeakData;









	var setInternalState$b = internalState.set;
	var internalStateGetterFor = internalState.getterFor;
	var find$1 = arrayIteration.find;
	var findIndex = arrayIteration.findIndex;
	var splice$1 = functionUncurryThis([].splice);
	var id = 0;

	// fallback for uncaught frozen keys
	var uncaughtFrozenStore = function (store) {
	  return store.frozen || (store.frozen = new UncaughtFrozenStore());
	};

	var UncaughtFrozenStore = function () {
	  this.entries = [];
	};

	var findUncaughtFrozen = function (store, key) {
	  return find$1(store.entries, function (it) {
	    return it[0] === key;
	  });
	};

	UncaughtFrozenStore.prototype = {
	  get: function (key) {
	    var entry = findUncaughtFrozen(this, key);
	    if (entry) { return entry[1]; }
	  },
	  has: function (key) {
	    return !!findUncaughtFrozen(this, key);
	  },
	  set: function (key, value) {
	    var entry = findUncaughtFrozen(this, key);
	    if (entry) { entry[1] = value; }
	    else { this.entries.push([key, value]); }
	  },
	  'delete': function (key) {
	    var index = findIndex(this.entries, function (it) {
	      return it[0] === key;
	    });
	    if (~index) { splice$1(this.entries, index, 1); }
	    return !!~index;
	  }
	};

	var collectionWeak = {
	  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
	    var Constructor = wrapper(function (that, iterable) {
	      anInstance(that, Prototype);
	      setInternalState$b(that, {
	        type: CONSTRUCTOR_NAME,
	        id: id++,
	        frozen: undefined
	      });
	      if (!isNullOrUndefined(iterable)) { iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP }); }
	    });

	    var Prototype = Constructor.prototype;

	    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

	    var define = function (that, key, value) {
	      var state = getInternalState(that);
	      var data = getWeakData(anObject(key), true);
	      if (data === true) { uncaughtFrozenStore(state).set(key, value); }
	      else { data[state.id] = value; }
	      return that;
	    };

	    defineBuiltIns(Prototype, {
	      // `{ WeakMap, WeakSet }.prototype.delete(key)` methods
	      // https://tc39.es/ecma262/#sec-weakmap.prototype.delete
	      // https://tc39.es/ecma262/#sec-weakset.prototype.delete
	      'delete': function (key) {
	        var state = getInternalState(this);
	        if (!isObject(key)) { return false; }
	        var data = getWeakData(key);
	        if (data === true) { return uncaughtFrozenStore(state)['delete'](key); }
	        return data && hasOwnProperty_1(data, state.id) && delete data[state.id];
	      },
	      // `{ WeakMap, WeakSet }.prototype.has(key)` methods
	      // https://tc39.es/ecma262/#sec-weakmap.prototype.has
	      // https://tc39.es/ecma262/#sec-weakset.prototype.has
	      has: function has(key) {
	        var state = getInternalState(this);
	        if (!isObject(key)) { return false; }
	        var data = getWeakData(key);
	        if (data === true) { return uncaughtFrozenStore(state).has(key); }
	        return data && hasOwnProperty_1(data, state.id);
	      }
	    });

	    defineBuiltIns(Prototype, IS_MAP ? {
	      // `WeakMap.prototype.get(key)` method
	      // https://tc39.es/ecma262/#sec-weakmap.prototype.get
	      get: function get(key) {
	        var state = getInternalState(this);
	        if (isObject(key)) {
	          var data = getWeakData(key);
	          if (data === true) { return uncaughtFrozenStore(state).get(key); }
	          return data ? data[state.id] : undefined;
	        }
	      },
	      // `WeakMap.prototype.set(key, value)` method
	      // https://tc39.es/ecma262/#sec-weakmap.prototype.set
	      set: function set(key, value) {
	        return define(this, key, value);
	      }
	    } : {
	      // `WeakSet.prototype.add(value)` method
	      // https://tc39.es/ecma262/#sec-weakset.prototype.add
	      add: function add(value) {
	        return define(this, value, true);
	      }
	    });

	    return Constructor;
	  }
	};

	var enforceInternalState = internalState.enforce;


	var IS_IE11 = !global_1.ActiveXObject && 'ActiveXObject' in global_1;
	var InternalWeakMap;

	var wrapper = function (init) {
	  return function WeakMap() {
	    return init(this, arguments.length ? arguments[0] : undefined);
	  };
	};

	// `WeakMap` constructor
	// https://tc39.es/ecma262/#sec-weakmap-constructor
	var $WeakMap = collection('WeakMap', wrapper, collectionWeak);

	// IE11 WeakMap frozen keys fix
	// We can't use feature detection because it crash some old IE builds
	// https://github.com/zloirock/core-js/issues/485
	if (weakMapBasicDetection && IS_IE11) {
	  InternalWeakMap = collectionWeak.getConstructor(wrapper, 'WeakMap', true);
	  internalMetadata.enable();
	  var WeakMapPrototype = $WeakMap.prototype;
	  var nativeDelete = functionUncurryThis(WeakMapPrototype['delete']);
	  var nativeHas = functionUncurryThis(WeakMapPrototype.has);
	  var nativeGet = functionUncurryThis(WeakMapPrototype.get);
	  var nativeSet = functionUncurryThis(WeakMapPrototype.set);
	  defineBuiltIns(WeakMapPrototype, {
	    'delete': function (key) {
	      if (isObject(key) && !objectIsExtensible(key)) {
	        var state = enforceInternalState(this);
	        if (!state.frozen) { state.frozen = new InternalWeakMap(); }
	        return nativeDelete(this, key) || state.frozen['delete'](key);
	      } return nativeDelete(this, key);
	    },
	    has: function has(key) {
	      if (isObject(key) && !objectIsExtensible(key)) {
	        var state = enforceInternalState(this);
	        if (!state.frozen) { state.frozen = new InternalWeakMap(); }
	        return nativeHas(this, key) || state.frozen.has(key);
	      } return nativeHas(this, key);
	    },
	    get: function get(key) {
	      if (isObject(key) && !objectIsExtensible(key)) {
	        var state = enforceInternalState(this);
	        if (!state.frozen) { state.frozen = new InternalWeakMap(); }
	        return nativeHas(this, key) ? nativeGet(this, key) : state.frozen.get(key);
	      } return nativeGet(this, key);
	    },
	    set: function set(key, value) {
	      if (isObject(key) && !objectIsExtensible(key)) {
	        var state = enforceInternalState(this);
	        if (!state.frozen) { state.frozen = new InternalWeakMap(); }
	        nativeHas(this, key) ? nativeSet(this, key, value) : state.frozen.set(key, value);
	      } else { nativeSet(this, key, value); }
	      return this;
	    }
	  });
	}

	// `WeakSet` constructor
	// https://tc39.es/ecma262/#sec-weakset-constructor
	collection('WeakSet', function (init) {
	  return function WeakSet() { return init(this, arguments.length ? arguments[0] : undefined); };
	}, collectionWeak);

	var USE_FUNCTION_CONSTRUCTOR = 'USE_FUNCTION_CONSTRUCTOR';
	var ASYNC_ITERATOR$3 = wellKnownSymbol('asyncIterator');
	var AsyncIterator = global_1.AsyncIterator;
	var PassedAsyncIteratorPrototype = sharedStore.AsyncIteratorPrototype;
	var AsyncIteratorPrototype, prototype;

	if (PassedAsyncIteratorPrototype) {
	  AsyncIteratorPrototype = PassedAsyncIteratorPrototype;
	} else if (isCallable(AsyncIterator)) {
	  AsyncIteratorPrototype = AsyncIterator.prototype;
	} else if (sharedStore[USE_FUNCTION_CONSTRUCTOR] || global_1[USE_FUNCTION_CONSTRUCTOR]) {
	  try {
	    // eslint-disable-next-line no-new-func -- we have no alternatives without usage of modern syntax
	    prototype = objectGetPrototypeOf(objectGetPrototypeOf(objectGetPrototypeOf(Function('return async function*(){}()')())));
	    if (objectGetPrototypeOf(prototype) === Object.prototype) { AsyncIteratorPrototype = prototype; }
	  } catch (error) { /* empty */ }
	}

	if (!AsyncIteratorPrototype) { AsyncIteratorPrototype = {}; }

	if (!isCallable(AsyncIteratorPrototype[ASYNC_ITERATOR$3])) {
	  defineBuiltIn(AsyncIteratorPrototype, ASYNC_ITERATOR$3, function () {
	    return this;
	  });
	}

	var asyncIteratorPrototype = AsyncIteratorPrototype;

	var Promise$3 = getBuiltIn('Promise');

	var ASYNC_FROM_SYNC_ITERATOR = 'AsyncFromSyncIterator';
	var setInternalState$a = internalState.set;
	var getInternalState$5 = internalState.getterFor(ASYNC_FROM_SYNC_ITERATOR);

	var asyncFromSyncIteratorContinuation = function (result, resolve, reject) {
	  var done = result.done;
	  Promise$3.resolve(result.value).then(function (value) {
	    resolve(createIterResultObject(value, done));
	  }, reject);
	};

	var AsyncFromSyncIterator = function AsyncIterator(iteratorRecord) {
	  iteratorRecord.type = ASYNC_FROM_SYNC_ITERATOR;
	  setInternalState$a(this, iteratorRecord);
	};

	AsyncFromSyncIterator.prototype = defineBuiltIns(objectCreate(asyncIteratorPrototype), {
	  next: function next() {
	    var state = getInternalState$5(this);
	    return new Promise$3(function (resolve, reject) {
	      var result = anObject(functionCall(state.next, state.iterator));
	      asyncFromSyncIteratorContinuation(result, resolve, reject);
	    });
	  },
	  'return': function () {
	    var iterator = getInternalState$5(this).iterator;
	    return new Promise$3(function (resolve, reject) {
	      var $return = getMethod(iterator, 'return');
	      if ($return === undefined) { return resolve(createIterResultObject(undefined, true)); }
	      var result = anObject(functionCall($return, iterator));
	      asyncFromSyncIteratorContinuation(result, resolve, reject);
	    });
	  }
	});

	var asyncFromSyncIterator = AsyncFromSyncIterator;

	var getIteratorDirect = function (obj) {
	  return {
	    iterator: obj,
	    next: aCallable(anObject(obj).next)
	  };
	};

	var ASYNC_ITERATOR$2 = wellKnownSymbol('asyncIterator');

	var getAsyncIterator = function (it, usingIterator) {
	  var method = arguments.length < 2 ? getMethod(it, ASYNC_ITERATOR$2) : usingIterator;
	  return method ? anObject(functionCall(method, it)) : new asyncFromSyncIterator(getIteratorDirect(getIterator(it)));
	};

	var entryVirtual = function (CONSTRUCTOR) {
	  return global_1[CONSTRUCTOR].prototype;
	};

	var asyncIteratorClose = function (iterator, method, argument, reject) {
	  try {
	    var returnMethod = getMethod(iterator, 'return');
	    if (returnMethod) {
	      return getBuiltIn('Promise').resolve(functionCall(returnMethod, iterator)).then(function () {
	        method(argument);
	      }, function (error) {
	        reject(error);
	      });
	    }
	  } catch (error2) {
	    return reject(error2);
	  } method(argument);
	};

	// https://github.com/tc39/proposal-iterator-helpers
	// https://github.com/tc39/proposal-array-from-async









	var createMethod = function (TYPE) {
	  var IS_TO_ARRAY = TYPE == 0;
	  var IS_FOR_EACH = TYPE == 1;
	  var IS_EVERY = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  return function (object, fn, target) {
	    var record = getIteratorDirect(object);
	    var Promise = getBuiltIn('Promise');
	    var iterator = record.iterator;
	    var next = record.next;
	    var counter = 0;
	    var MAPPING = fn !== undefined;
	    if (MAPPING || !IS_TO_ARRAY) { aCallable(fn); }

	    return new Promise(function (resolve, reject) {
	      var ifAbruptCloseAsyncIterator = function (error) {
	        asyncIteratorClose(iterator, reject, error, reject);
	      };

	      var loop = function () {
	        try {
	          if (MAPPING) { try {
	            doesNotExceedSafeInteger(counter);
	          } catch (error5) { ifAbruptCloseAsyncIterator(error5); } }
	          Promise.resolve(anObject(functionCall(next, iterator))).then(function (step) {
	            try {
	              if (anObject(step).done) {
	                if (IS_TO_ARRAY) {
	                  target.length = counter;
	                  resolve(target);
	                } else { resolve(IS_SOME ? false : IS_EVERY || undefined); }
	              } else {
	                var value = step.value;
	                try {
	                  if (MAPPING) {
	                    var result = fn(value, counter);

	                    var handler = function ($result) {
	                      if (IS_FOR_EACH) {
	                        loop();
	                      } else if (IS_EVERY) {
	                        $result ? loop() : asyncIteratorClose(iterator, resolve, false, reject);
	                      } else if (IS_TO_ARRAY) {
	                        try {
	                          target[counter++] = $result;
	                          loop();
	                        } catch (error4) { ifAbruptCloseAsyncIterator(error4); }
	                      } else {
	                        $result ? asyncIteratorClose(iterator, resolve, IS_SOME || value, reject) : loop();
	                      }
	                    };

	                    if (isObject(result)) { Promise.resolve(result).then(handler, ifAbruptCloseAsyncIterator); }
	                    else { handler(result); }
	                  } else {
	                    target[counter++] = value;
	                    loop();
	                  }
	                } catch (error3) { ifAbruptCloseAsyncIterator(error3); }
	              }
	            } catch (error2) { reject(error2); }
	          }, reject);
	        } catch (error) { reject(error); }
	      };

	      loop();
	    });
	  };
	};

	var asyncIteratorIteration = {
	  toArray: createMethod(0),
	  forEach: createMethod(1),
	  every: createMethod(2),
	  some: createMethod(3),
	  find: createMethod(4)
	};

	var toArray = asyncIteratorIteration.toArray;

	var ASYNC_ITERATOR$1 = wellKnownSymbol('asyncIterator');
	var arrayIterator = functionUncurryThis(entryVirtual('Array').values);
	var arrayIteratorNext = functionUncurryThis(arrayIterator([]).next);

	var safeArrayIterator = function () {
	  return new SafeArrayIterator(this);
	};

	var SafeArrayIterator = function (O) {
	  this.iterator = arrayIterator(O);
	};

	SafeArrayIterator.prototype.next = function () {
	  return arrayIteratorNext(this.iterator);
	};

	// `Array.fromAsync` method implementation
	// https://github.com/tc39/proposal-array-from-async
	var arrayFromAsync = function fromAsync(asyncItems /* , mapfn = undefined, thisArg = undefined */) {
	  var C = this;
	  var argumentsLength = arguments.length;
	  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
	  var thisArg = argumentsLength > 2 ? arguments[2] : undefined;
	  return new (getBuiltIn('Promise'))(function (resolve) {
	    var O = toObject(asyncItems);
	    if (mapfn !== undefined) { mapfn = functionBindContext(mapfn, thisArg); }
	    var usingAsyncIterator = getMethod(O, ASYNC_ITERATOR$1);
	    var usingSyncIterator = usingAsyncIterator ? undefined : getIteratorMethod(O) || safeArrayIterator;
	    var A = isConstructor(C) ? new C() : [];
	    var iterator = usingAsyncIterator
	      ? getAsyncIterator(O, usingAsyncIterator)
	      : new asyncFromSyncIterator(getIteratorDirect(getIterator(O, usingSyncIterator)));
	    resolve(toArray(iterator, mapfn, A));
	  });
	};

	// `Array.fromAsync` method
	// https://github.com/tc39/proposal-array-from-async
	_export({ target: 'Array', stat: true, forced: true }, {
	  fromAsync: arrayFromAsync
	});

	// TODO: remove from `core-js@4`

	var $filterReject$3 = arrayIteration.filterReject;


	// `Array.prototype.filterOut` method
	// https://github.com/tc39/proposal-array-filtering
	_export({ target: 'Array', proto: true, forced: true }, {
	  filterOut: function filterOut(callbackfn /* , thisArg */) {
	    return $filterReject$3(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	addToUnscopables('filterOut');

	var $filterReject$2 = arrayIteration.filterReject;


	// `Array.prototype.filterReject` method
	// https://github.com/tc39/proposal-array-filtering
	_export({ target: 'Array', proto: true, forced: true }, {
	  filterReject: function filterReject(callbackfn /* , thisArg */) {
	    return $filterReject$2(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	addToUnscopables('filterReject');

	var $Array$5 = Array;
	var push$c = functionUncurryThis([].push);

	var arrayGroup = function ($this, callbackfn, that, specificConstructor) {
	  var O = toObject($this);
	  var self = indexedObject(O);
	  var boundFunction = functionBindContext(callbackfn, that);
	  var target = objectCreate(null);
	  var length = lengthOfArrayLike(self);
	  var index = 0;
	  var Constructor, key, value;
	  for (;length > index; index++) {
	    value = self[index];
	    key = toPropertyKey(boundFunction(value, index, O));
	    // in some IE10 builds, `hasOwnProperty` returns incorrect result on integer keys
	    // but since it's a `null` prototype object, we can safely use `in`
	    if (key in target) { push$c(target[key], value); }
	    else { target[key] = [value]; }
	  }
	  // TODO: Remove this block from `core-js@4`
	  if (specificConstructor) {
	    Constructor = specificConstructor(O);
	    if (Constructor !== $Array$5) {
	      for (key in target) { target[key] = arrayFromConstructorAndList(Constructor, target[key]); }
	    }
	  } return target;
	};

	// `Array.prototype.group` method
	// https://github.com/tc39/proposal-array-grouping
	_export({ target: 'Array', proto: true }, {
	  group: function group(callbackfn /* , thisArg */) {
	    var thisArg = arguments.length > 1 ? arguments[1] : undefined;
	    return arrayGroup(this, callbackfn, thisArg);
	  }
	});

	addToUnscopables('group');

	// TODO: Remove from `core-js@4`





	// `Array.prototype.groupBy` method
	// https://github.com/tc39/proposal-array-grouping
	// https://bugs.webkit.org/show_bug.cgi?id=236541
	_export({ target: 'Array', proto: true, forced: !arrayMethodIsStrict('groupBy') }, {
	  groupBy: function groupBy(callbackfn /* , thisArg */) {
	    var thisArg = arguments.length > 1 ? arguments[1] : undefined;
	    return arrayGroup(this, callbackfn, thisArg);
	  }
	});

	addToUnscopables('groupBy');

	var Map$5 = getBuiltIn('Map');
	var MapPrototype$2 = Map$5.prototype;
	var mapGet$1 = functionUncurryThis(MapPrototype$2.get);
	var mapHas$2 = functionUncurryThis(MapPrototype$2.has);
	var mapSet$2 = functionUncurryThis(MapPrototype$2.set);
	var push$b = functionUncurryThis([].push);

	// `Array.prototype.groupToMap` method
	// https://github.com/tc39/proposal-array-grouping
	var arrayGroupToMap = function groupToMap(callbackfn /* , thisArg */) {
	  var O = toObject(this);
	  var self = indexedObject(O);
	  var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  var map = new Map$5();
	  var length = lengthOfArrayLike(self);
	  var index = 0;
	  var key, value;
	  for (;length > index; index++) {
	    value = self[index];
	    key = boundFunction(value, index, O);
	    if (mapHas$2(map, key)) { push$b(mapGet$1(map, key), value); }
	    else { mapSet$2(map, key, [value]); }
	  } return map;
	};

	// TODO: Remove from `core-js@4`






	// `Array.prototype.groupByToMap` method
	// https://github.com/tc39/proposal-array-grouping
	// https://bugs.webkit.org/show_bug.cgi?id=236541
	_export({ target: 'Array', proto: true, name: 'groupToMap', forced: !arrayMethodIsStrict('groupByToMap') }, {
	  groupByToMap: arrayGroupToMap
	});

	addToUnscopables('groupByToMap');

	// `Array.prototype.groupToMap` method
	// https://github.com/tc39/proposal-array-grouping
	_export({ target: 'Array', proto: true, forced: isPure }, {
	  groupToMap: arrayGroupToMap
	});

	addToUnscopables('groupToMap');

	// eslint-disable-next-line es/no-object-isfrozen -- safe
	var isFrozen = Object.isFrozen;

	var isFrozenStringArray = function (array, allowUndefined) {
	  if (!isFrozen || !isArray(array) || !isFrozen(array)) { return false; }
	  var index = 0;
	  var length = array.length;
	  var element;
	  while (index < length) {
	    element = array[index++];
	    if (!(typeof element == 'string' || (allowUndefined && element === undefined))) {
	      return false;
	    }
	  } return length !== 0;
	};

	// `Array.isTemplateObject` method
	// https://github.com/tc39/proposal-array-is-template-object
	_export({ target: 'Array', stat: true, sham: true, forced: true }, {
	  isTemplateObject: function isTemplateObject(value) {
	    if (!isFrozenStringArray(value, true)) { return false; }
	    var raw = value.raw;
	    return raw.length === value.length && isFrozenStringArray(raw, false);
	  }
	});

	// TODO: Remove from `core-js@4`






	// `Array.prototype.lastIndex` getter
	// https://github.com/keithamus/proposal-array-last
	if (descriptors) {
	  defineBuiltInAccessor(Array.prototype, 'lastIndex', {
	    configurable: true,
	    get: function lastIndex() {
	      var O = toObject(this);
	      var len = lengthOfArrayLike(O);
	      return len == 0 ? 0 : len - 1;
	    }
	  });

	  addToUnscopables('lastIndex');
	}

	// TODO: Remove from `core-js@4`






	// `Array.prototype.lastIndex` accessor
	// https://github.com/keithamus/proposal-array-last
	if (descriptors) {
	  defineBuiltInAccessor(Array.prototype, 'lastItem', {
	    configurable: true,
	    get: function lastItem() {
	      var O = toObject(this);
	      var len = lengthOfArrayLike(O);
	      return len == 0 ? undefined : O[len - 1];
	    },
	    set: function lastItem(value) {
	      var O = toObject(this);
	      var len = lengthOfArrayLike(O);
	      return O[len == 0 ? 0 : len - 1] = value;
	    }
	  });

	  addToUnscopables('lastItem');
	}

	// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.toReversed
	// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toReversed
	var arrayToReversed = function (O, C) {
	  var len = lengthOfArrayLike(O);
	  var A = new C(len);
	  var k = 0;
	  for (; k < len; k++) { A[k] = O[len - k - 1]; }
	  return A;
	};

	var $Array$4 = Array;

	// `Array.prototype.toReversed` method
	// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.toReversed
	_export({ target: 'Array', proto: true }, {
	  toReversed: function toReversed() {
	    return arrayToReversed(toIndexedObject(this), $Array$4);
	  }
	});

	addToUnscopables('toReversed');

	var $Array$3 = Array;
	var sort$1 = functionUncurryThis(entryVirtual('Array').sort);

	// `Array.prototype.toSorted` method
	// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.toSorted
	_export({ target: 'Array', proto: true }, {
	  toSorted: function toSorted(compareFn) {
	    if (compareFn !== undefined) { aCallable(compareFn); }
	    var O = toIndexedObject(this);
	    var A = arrayFromConstructorAndList($Array$3, O);
	    return sort$1(A, compareFn);
	  }
	});

	addToUnscopables('toSorted');

	var $Array$2 = Array;
	var max$2 = Math.max;
	var min$2 = Math.min;

	// `Array.prototype.toSpliced` method
	// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.toSpliced
	_export({ target: 'Array', proto: true }, {
	  toSpliced: function toSpliced(start, deleteCount /* , ...items */) {
	    var arguments$1 = arguments;

	    var O = toIndexedObject(this);
	    var len = lengthOfArrayLike(O);
	    var actualStart = toAbsoluteIndex(start, len);
	    var argumentsLength = arguments.length;
	    var k = 0;
	    var insertCount, actualDeleteCount, newLen, A;
	    if (argumentsLength === 0) {
	      insertCount = actualDeleteCount = 0;
	    } else if (argumentsLength === 1) {
	      insertCount = 0;
	      actualDeleteCount = len - actualStart;
	    } else {
	      insertCount = argumentsLength - 2;
	      actualDeleteCount = min$2(max$2(toIntegerOrInfinity(deleteCount), 0), len - actualStart);
	    }
	    newLen = doesNotExceedSafeInteger(len + insertCount - actualDeleteCount);
	    A = $Array$2(newLen);

	    for (; k < actualStart; k++) { A[k] = O[k]; }
	    for (; k < actualStart + insertCount; k++) { A[k] = arguments$1[k - actualStart + 2]; }
	    for (; k < newLen; k++) { A[k] = O[k + actualDeleteCount - insertCount]; }

	    return A;
	  }
	});

	addToUnscopables('toSpliced');

	var Map$4 = getBuiltIn('Map');
	var MapPrototype$1 = Map$4.prototype;
	var mapForEach = functionUncurryThis(MapPrototype$1.forEach);
	var mapHas$1 = functionUncurryThis(MapPrototype$1.has);
	var mapSet$1 = functionUncurryThis(MapPrototype$1.set);
	var push$a = functionUncurryThis([].push);

	// `Array.prototype.uniqueBy` method
	// https://github.com/tc39/proposal-array-unique
	var arrayUniqueBy$2 = function uniqueBy(resolver) {
	  var that = toObject(this);
	  var length = lengthOfArrayLike(that);
	  var result = arraySpeciesCreate(that, 0);
	  var map = new Map$4();
	  var resolverFunction = !isNullOrUndefined(resolver) ? aCallable(resolver) : function (value) {
	    return value;
	  };
	  var index, item, key;
	  for (index = 0; index < length; index++) {
	    item = that[index];
	    key = resolverFunction(item);
	    if (!mapHas$1(map, key)) { mapSet$1(map, key, item); }
	  }
	  mapForEach(map, function (value) {
	    push$a(result, value);
	  });
	  return result;
	};

	// `Array.prototype.uniqueBy` method
	// https://github.com/tc39/proposal-array-unique
	_export({ target: 'Array', proto: true, forced: true }, {
	  uniqueBy: arrayUniqueBy$2
	});

	addToUnscopables('uniqueBy');

	var $RangeError$4 = RangeError;

	// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.with
	// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.with
	var arrayWith = function (O, C, index, value) {
	  var len = lengthOfArrayLike(O);
	  var relativeIndex = toIntegerOrInfinity(index);
	  var actualIndex = relativeIndex < 0 ? len + relativeIndex : relativeIndex;
	  if (actualIndex >= len || actualIndex < 0) { throw $RangeError$4('Incorrect index'); }
	  var A = new C(len);
	  var k = 0;
	  for (; k < len; k++) { A[k] = k === actualIndex ? value : O[k]; }
	  return A;
	};

	var $Array$1 = Array;

	// `Array.prototype.with` method
	// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.with
	_export({ target: 'Array', proto: true }, {
	  'with': function (index, value) {
	    return arrayWith(toIndexedObject(this), $Array$1, index, value);
	  }
	});

	// https://github.com/tc39/proposal-iterator-helpers








	var TO_STRING_TAG$4 = wellKnownSymbol('toStringTag');

	var AsyncIteratorConstructor = function AsyncIterator() {
	  anInstance(this, asyncIteratorPrototype);
	};

	AsyncIteratorConstructor.prototype = asyncIteratorPrototype;

	if (!hasOwnProperty_1(asyncIteratorPrototype, TO_STRING_TAG$4)) {
	  createNonEnumerableProperty(asyncIteratorPrototype, TO_STRING_TAG$4, 'AsyncIterator');
	}

	if (!hasOwnProperty_1(asyncIteratorPrototype, 'constructor') || asyncIteratorPrototype.constructor === Object) {
	  createNonEnumerableProperty(asyncIteratorPrototype, 'constructor', AsyncIteratorConstructor);
	}

	_export({ global: true, constructor: true, forced: isPure }, {
	  AsyncIterator: AsyncIteratorConstructor
	});

	var Promise$2 = getBuiltIn('Promise');

	var ASYNC_ITERATOR_HELPER = 'AsyncIteratorHelper';
	var WRAP_FOR_VALID_ASYNC_ITERATOR = 'WrapForValidAsyncIterator';
	var setInternalState$9 = internalState.set;

	var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');

	var createAsyncIteratorProxyPrototype = function (IS_ITERATOR) {
	  var IS_GENERATOR = !IS_ITERATOR;
	  var ASYNC_ITERATOR_PROXY = IS_ITERATOR ? WRAP_FOR_VALID_ASYNC_ITERATOR : ASYNC_ITERATOR_HELPER;

	  var getInternalState = internalState.getterFor(ASYNC_ITERATOR_PROXY);

	  var getStateOrEarlyExit = function (that) {
	    var stateCompletion = perform(function () {
	      return getInternalState(that);
	    });

	    var stateError = stateCompletion.error;
	    var state = stateCompletion.value;

	    if (stateError || (IS_GENERATOR && state.done)) {
	      return { exit: true, value: stateError ? Promise$2.reject(state) : Promise$2.resolve(createIterResultObject(undefined, true)) };
	    } return { exit: false, value: state };
	  };

	  var enqueue = function (state, handler) {
	    var task = function () {
	      var promise = handler();
	      if (IS_GENERATOR) {
	        state.awaiting = promise;
	        var clean = function () {
	          if (state.awaiting === promise) { state.awaiting = null; }
	        };
	        promise.then(clean, clean);
	      } return promise;
	    };

	    return state.awaiting ? state.awaiting = state.awaiting.then(task, task) : task();
	  };

	  var AsyncIteratorProxyPrototype = defineBuiltIns(objectCreate(asyncIteratorPrototype), {
	    next: function next() {
	      var stateCompletion = getStateOrEarlyExit(this);
	      var exit = stateCompletion.exit;
	      var state = stateCompletion.value;

	      return exit ? state : enqueue(state, function () {
	        var handlerCompletion = perform(function () {
	          return anObject(state.nextHandler(Promise$2));
	        });
	        var handlerError = handlerCompletion.error;
	        var value = handlerCompletion.value;
	        if (handlerError) { state.done = true; }
	        return handlerError ? Promise$2.reject(value) : Promise$2.resolve(value);
	      });
	    },
	    'return': function () {
	      var stateCompletion = getStateOrEarlyExit(this);
	      var exit = stateCompletion.exit;
	      var state = stateCompletion.value;

	      return exit ? state : enqueue(state, function () {
	        state.done = true;
	        var iterator = state.iterator;
	        var returnMethod, result;
	        var completion = perform(function () {
	          if (state.inner) { try {
	            iteratorClose(state.inner.iterator, 'return');
	          } catch (error) {
	            return iteratorClose(iterator, 'throw', error);
	          } }
	          return getMethod(iterator, 'return');
	        });
	        returnMethod = result = completion.value;
	        if (completion.error) { return Promise$2.reject(result); }
	        if (returnMethod === undefined) { return Promise$2.resolve(createIterResultObject(undefined, true)); }
	        completion = perform(function () {
	          return functionCall(returnMethod, iterator);
	        });
	        result = completion.value;
	        if (completion.error) { return Promise$2.reject(result); }
	        return IS_ITERATOR ? Promise$2.resolve(result) : Promise$2.resolve(result).then(function (resolved) {
	          anObject(resolved);
	          return createIterResultObject(undefined, true);
	        });
	      });
	    }
	  });

	  if (IS_GENERATOR) {
	    createNonEnumerableProperty(AsyncIteratorProxyPrototype, TO_STRING_TAG$3, 'Async Iterator Helper');
	  }

	  return AsyncIteratorProxyPrototype;
	};

	var AsyncIteratorHelperPrototype = createAsyncIteratorProxyPrototype(false);
	var WrapForValidAsyncIteratorPrototype = createAsyncIteratorProxyPrototype(true);

	var asyncIteratorCreateProxy = function (nextHandler, IS_ITERATOR) {
	  var ASYNC_ITERATOR_PROXY = IS_ITERATOR ? WRAP_FOR_VALID_ASYNC_ITERATOR : ASYNC_ITERATOR_HELPER;

	  var AsyncIteratorProxy = function AsyncIterator(record, state) {
	    if (state) {
	      state.iterator = record.iterator;
	      state.next = record.next;
	    } else { state = record; }
	    state.type = ASYNC_ITERATOR_PROXY;
	    state.nextHandler = nextHandler;
	    state.counter = 0;
	    state.done = false;
	    state.awaiting = null;
	    setInternalState$9(this, state);
	  };

	  AsyncIteratorProxy.prototype = IS_ITERATOR ? WrapForValidAsyncIteratorPrototype : AsyncIteratorHelperPrototype;

	  return AsyncIteratorProxy;
	};

	// https://github.com/tc39/proposal-iterator-helpers






	var AsyncIteratorProxy$5 = asyncIteratorCreateProxy(function (Promise) {
	  var state = this;
	  var iterator = state.iterator;

	  return Promise.resolve(anObject(functionCall(state.next, iterator))).then(function (step) {
	    if (anObject(step).done) {
	      state.done = true;
	      return createIterResultObject(undefined, true);
	    }
	    return createIterResultObject([state.index++, step.value], false);
	  }).then(null, function (error) {
	    state.done = true;
	    throw error;
	  });
	});

	var asyncIteratorIndexed = function indexed() {
	  return new AsyncIteratorProxy$5(getIteratorDirect(this), {
	    index: 0
	  });
	};

	// TODO: Remove from `core-js@4`
	// https://github.com/tc39/proposal-iterator-helpers



	_export({ target: 'AsyncIterator', name: 'indexed', proto: true, real: true, forced: true }, {
	  asIndexedPairs: asyncIteratorIndexed
	});

	var $RangeError$3 = RangeError;

	var notANan = function (it) {
	  // eslint-disable-next-line no-self-compare -- NaN check
	  if (it === it) { return it; }
	  throw $RangeError$3('NaN is not allowed');
	};

	// https://github.com/tc39/proposal-iterator-helpers









	var AsyncIteratorProxy$4 = asyncIteratorCreateProxy(function (Promise) {
	  var state = this;

	  return new Promise(function (resolve, reject) {
	    var doneAndReject = function (error) {
	      state.done = true;
	      reject(error);
	    };

	    var loop = function () {
	      try {
	        Promise.resolve(anObject(functionCall(state.next, state.iterator))).then(function (step) {
	          try {
	            if (anObject(step).done) {
	              state.done = true;
	              resolve(createIterResultObject(undefined, true));
	            } else if (state.remaining) {
	              state.remaining--;
	              loop();
	            } else { resolve(createIterResultObject(step.value, false)); }
	          } catch (err) { doneAndReject(err); }
	        }, doneAndReject);
	      } catch (error) { doneAndReject(error); }
	    };

	    loop();
	  });
	});

	_export({ target: 'AsyncIterator', proto: true, real: true, forced: true }, {
	  drop: function drop(limit) {
	    return new AsyncIteratorProxy$4(getIteratorDirect(this), {
	      remaining: toPositiveInteger(notANan(+limit))
	    });
	  }
	});

	// https://github.com/tc39/proposal-iterator-helpers

	var $every = asyncIteratorIteration.every;

	_export({ target: 'AsyncIterator', proto: true, real: true, forced: true }, {
	  every: function every(fn) {
	    return $every(this, fn);
	  }
	});

	// https://github.com/tc39/proposal-iterator-helpers










	var AsyncIteratorProxy$3 = asyncIteratorCreateProxy(function (Promise) {
	  var state = this;
	  var iterator = state.iterator;
	  var filterer = state.filterer;

	  return new Promise(function (resolve, reject) {
	    var doneAndReject = function (error) {
	      state.done = true;
	      reject(error);
	    };

	    var ifAbruptCloseAsyncIterator = function (error) {
	      asyncIteratorClose(iterator, doneAndReject, error, doneAndReject);
	    };

	    var loop = function () {
	      try {
	        Promise.resolve(anObject(functionCall(state.next, iterator))).then(function (step) {
	          try {
	            if (anObject(step).done) {
	              state.done = true;
	              resolve(createIterResultObject(undefined, true));
	            } else {
	              var value = step.value;
	              try {
	                var result = filterer(value, state.counter++);

	                var handler = function (selected) {
	                  selected ? resolve(createIterResultObject(value, false)) : loop();
	                };

	                if (isObject(result)) { Promise.resolve(result).then(handler, ifAbruptCloseAsyncIterator); }
	                else { handler(result); }
	              } catch (error3) { ifAbruptCloseAsyncIterator(error3); }
	            }
	          } catch (error2) { doneAndReject(error2); }
	        }, doneAndReject);
	      } catch (error) { doneAndReject(error); }
	    };

	    loop();
	  });
	});

	_export({ target: 'AsyncIterator', proto: true, real: true, forced: true }, {
	  filter: function filter(filterer) {
	    return new AsyncIteratorProxy$3(getIteratorDirect(this), {
	      filterer: aCallable(filterer)
	    });
	  }
	});

	// https://github.com/tc39/proposal-iterator-helpers

	var $find = asyncIteratorIteration.find;

	_export({ target: 'AsyncIterator', proto: true, real: true, forced: true }, {
	  find: function find(fn) {
	    return $find(this, fn);
	  }
	});

	var ASYNC_ITERATOR = wellKnownSymbol('asyncIterator');

	var getAsyncIteratorFlattenable = function from(obj) {
	  var object = toObject(obj);
	  var alreadyAsync = true;
	  var method = getMethod(object, ASYNC_ITERATOR);
	  var iterator;
	  if (!isCallable(method)) {
	    method = getIteratorMethod(object);
	    alreadyAsync = false;
	  }
	  if (isCallable(method)) {
	    iterator = functionCall(method, object);
	  } else {
	    iterator = object;
	    alreadyAsync = true;
	  }
	  return getIteratorDirect(alreadyAsync ? iterator : new asyncFromSyncIterator(getIteratorDirect(iterator)));
	};

	// https://github.com/tc39/proposal-iterator-helpers











	var AsyncIteratorProxy$2 = asyncIteratorCreateProxy(function (Promise) {
	  var state = this;
	  var iterator = state.iterator;
	  var mapper = state.mapper;

	  return new Promise(function (resolve, reject) {
	    var doneAndReject = function (error) {
	      state.done = true;
	      reject(error);
	    };

	    var ifAbruptCloseAsyncIterator = function (error) {
	      asyncIteratorClose(iterator, doneAndReject, error, doneAndReject);
	    };

	    var outerLoop = function () {
	      try {
	        Promise.resolve(anObject(functionCall(state.next, iterator))).then(function (step) {
	          try {
	            if (anObject(step).done) {
	              state.done = true;
	              resolve(createIterResultObject(undefined, true));
	            } else {
	              var value = step.value;
	              try {
	                var result = mapper(value, state.counter++);

	                var handler = function (mapped) {
	                  try {
	                    state.inner = getAsyncIteratorFlattenable(mapped);
	                    innerLoop();
	                  } catch (error4) { ifAbruptCloseAsyncIterator(error4); }
	                };

	                if (isObject(result)) { Promise.resolve(result).then(handler, ifAbruptCloseAsyncIterator); }
	                else { handler(result); }
	              } catch (error3) { ifAbruptCloseAsyncIterator(error3); }
	            }
	          } catch (error2) { doneAndReject(error2); }
	        }, doneAndReject);
	      } catch (error) { doneAndReject(error); }
	    };

	    var innerLoop = function () {
	      var inner = state.inner;
	      if (inner) {
	        try {
	          Promise.resolve(anObject(functionCall(inner.next, inner.iterator))).then(function (result) {
	            try {
	              if (anObject(result).done) {
	                state.inner = null;
	                outerLoop();
	              } else { resolve(createIterResultObject(result.value, false)); }
	            } catch (error1) { ifAbruptCloseAsyncIterator(error1); }
	          }, ifAbruptCloseAsyncIterator);
	        } catch (error) { ifAbruptCloseAsyncIterator(error); }
	      } else { outerLoop(); }
	    };

	    innerLoop();
	  });
	});

	_export({ target: 'AsyncIterator', proto: true, real: true, forced: true }, {
	  flatMap: function flatMap(mapper) {
	    return new AsyncIteratorProxy$2(getIteratorDirect(this), {
	      mapper: aCallable(mapper),
	      inner: null
	    });
	  }
	});

	// https://github.com/tc39/proposal-iterator-helpers

	var $forEach = asyncIteratorIteration.forEach;

	_export({ target: 'AsyncIterator', proto: true, real: true, forced: true }, {
	  forEach: function forEach(fn) {
	    return $forEach(this, fn);
	  }
	});

	var asyncIteratorWrap = asyncIteratorCreateProxy(function () {
	  return functionCall(this.next, this.iterator);
	}, true);

	// https://github.com/tc39/proposal-iterator-helpers






	_export({ target: 'AsyncIterator', stat: true, forced: true }, {
	  from: function from(O) {
	    var iteratorRecord = getAsyncIteratorFlattenable(O);
	    return objectIsPrototypeOf(asyncIteratorPrototype, iteratorRecord.iterator)
	      ? iteratorRecord.iterator
	      : new asyncIteratorWrap(iteratorRecord);
	  }
	});

	// TODO: Remove from `core-js@4`
	// https://github.com/tc39/proposal-iterator-helpers



	_export({ target: 'AsyncIterator', proto: true, real: true, forced: true }, {
	  indexed: asyncIteratorIndexed
	});

	// https://github.com/tc39/proposal-iterator-helpers










	var AsyncIteratorProxy$1 = asyncIteratorCreateProxy(function (Promise) {
	  var state = this;
	  var iterator = state.iterator;
	  var mapper = state.mapper;

	  return new Promise(function (resolve, reject) {
	    var doneAndReject = function (error) {
	      state.done = true;
	      reject(error);
	    };

	    var ifAbruptCloseAsyncIterator = function (error) {
	      asyncIteratorClose(iterator, doneAndReject, error, doneAndReject);
	    };

	    Promise.resolve(anObject(functionCall(state.next, iterator))).then(function (step) {
	      try {
	        if (anObject(step).done) {
	          state.done = true;
	          resolve(createIterResultObject(undefined, true));
	        } else {
	          var value = step.value;
	          try {
	            var result = mapper(value, state.counter++);

	            var handler = function (mapped) {
	              resolve(createIterResultObject(mapped, false));
	            };

	            if (isObject(result)) { Promise.resolve(result).then(handler, ifAbruptCloseAsyncIterator); }
	            else { handler(result); }
	          } catch (error2) { ifAbruptCloseAsyncIterator(error2); }
	        }
	      } catch (error) { doneAndReject(error); }
	    }, doneAndReject);
	  });
	});

	_export({ target: 'AsyncIterator', proto: true, real: true, forced: true }, {
	  map: function map(mapper) {
	    return new AsyncIteratorProxy$1(getIteratorDirect(this), {
	      mapper: aCallable(mapper)
	    });
	  }
	});

	// https://github.com/tc39/proposal-iterator-helpers









	var Promise$1 = getBuiltIn('Promise');
	var $TypeError$b = TypeError;

	_export({ target: 'AsyncIterator', proto: true, real: true, forced: true }, {
	  reduce: function reduce(reducer /* , initialValue */) {
	    var record = getIteratorDirect(this);
	    var iterator = record.iterator;
	    var next = record.next;
	    var noInitial = arguments.length < 2;
	    var accumulator = noInitial ? undefined : arguments[1];
	    var counter = 0;
	    aCallable(reducer);

	    return new Promise$1(function (resolve, reject) {
	      var ifAbruptCloseAsyncIterator = function (error) {
	        asyncIteratorClose(iterator, reject, error, reject);
	      };

	      var loop = function () {
	        try {
	          Promise$1.resolve(anObject(functionCall(next, iterator))).then(function (step) {
	            try {
	              if (anObject(step).done) {
	                noInitial ? reject($TypeError$b('Reduce of empty iterator with no initial value')) : resolve(accumulator);
	              } else {
	                var value = step.value;
	                if (noInitial) {
	                  noInitial = false;
	                  accumulator = value;
	                  loop();
	                } else { try {
	                  var result = reducer(accumulator, value, counter);

	                  var handler = function ($result) {
	                    accumulator = $result;
	                    loop();
	                  };

	                  if (isObject(result)) { Promise$1.resolve(result).then(handler, ifAbruptCloseAsyncIterator); }
	                  else { handler(result); }
	                } catch (error3) { ifAbruptCloseAsyncIterator(error3); } }
	              }
	              counter++;
	            } catch (error2) { reject(error2); }
	          }, reject);
	        } catch (error) { reject(error); }
	      };

	      loop();
	    });
	  }
	});

	// https://github.com/tc39/proposal-iterator-helpers

	var $some = asyncIteratorIteration.some;

	_export({ target: 'AsyncIterator', proto: true, real: true, forced: true }, {
	  some: function some(fn) {
	    return $some(this, fn);
	  }
	});

	// https://github.com/tc39/proposal-iterator-helpers









	var AsyncIteratorProxy = asyncIteratorCreateProxy(function (Promise) {
	  var state = this;
	  var iterator = state.iterator;
	  var returnMethod;

	  if (!state.remaining--) {
	    var resultDone = createIterResultObject(undefined, true);
	    state.done = true;
	    returnMethod = iterator['return'];
	    if (returnMethod !== undefined) {
	      return Promise.resolve(functionCall(returnMethod, iterator, undefined)).then(function () {
	        return resultDone;
	      });
	    }
	    return resultDone;
	  } return Promise.resolve(functionCall(state.next, iterator)).then(function (step) {
	    if (anObject(step).done) {
	      state.done = true;
	      return createIterResultObject(undefined, true);
	    } return createIterResultObject(step.value, false);
	  }).then(null, function (error) {
	    state.done = true;
	    throw error;
	  });
	});

	_export({ target: 'AsyncIterator', proto: true, real: true, forced: true }, {
	  take: function take(limit) {
	    return new AsyncIteratorProxy(getIteratorDirect(this), {
	      remaining: toPositiveInteger(notANan(+limit))
	    });
	  }
	});

	// https://github.com/tc39/proposal-iterator-helpers

	var $toArray = asyncIteratorIteration.toArray;

	_export({ target: 'AsyncIterator', proto: true, real: true, forced: true }, {
	  toArray: function toArray() {
	    return $toArray(this, undefined, []);
	  }
	});

	var defineProperties = objectDefineProperties.f;


	var INCORRECT_RANGE = 'Incorrect Number.range arguments';
	var NUMERIC_RANGE_ITERATOR = 'NumericRangeIterator';

	var setInternalState$8 = internalState.set;
	var getInternalState$4 = internalState.getterFor(NUMERIC_RANGE_ITERATOR);

	var $RangeError$2 = RangeError;
	var $TypeError$a = TypeError;

	var $RangeIterator = iteratorCreateConstructor(function NumericRangeIterator(start, end, option, type, zero, one) {
	  if (typeof start != type || (end !== Infinity && end !== -Infinity && typeof end != type)) {
	    throw $TypeError$a(INCORRECT_RANGE);
	  }
	  if (start === Infinity || start === -Infinity) {
	    throw $RangeError$2(INCORRECT_RANGE);
	  }
	  var ifIncrease = end > start;
	  var inclusiveEnd = false;
	  var step;
	  if (option === undefined) {
	    step = undefined;
	  } else if (isObject(option)) {
	    step = option.step;
	    inclusiveEnd = !!option.inclusive;
	  } else if (typeof option == type) {
	    step = option;
	  } else {
	    throw $TypeError$a(INCORRECT_RANGE);
	  }
	  if (isNullOrUndefined(step)) {
	    step = ifIncrease ? one : -one;
	  }
	  if (typeof step != type) {
	    throw $TypeError$a(INCORRECT_RANGE);
	  }
	  if (step === Infinity || step === -Infinity || (step === zero && start !== end)) {
	    throw $RangeError$2(INCORRECT_RANGE);
	  }
	  // eslint-disable-next-line no-self-compare -- NaN check
	  var hitsEnd = start != start || end != end || step != step || (end > start) !== (step > zero);
	  setInternalState$8(this, {
	    type: NUMERIC_RANGE_ITERATOR,
	    start: start,
	    end: end,
	    step: step,
	    inclusiveEnd: inclusiveEnd,
	    hitsEnd: hitsEnd,
	    currentCount: zero,
	    zero: zero
	  });
	  if (!descriptors) {
	    this.start = start;
	    this.end = end;
	    this.step = step;
	    this.inclusive = inclusiveEnd;
	  }
	}, NUMERIC_RANGE_ITERATOR, function next() {
	  var state = getInternalState$4(this);
	  if (state.hitsEnd) { return createIterResultObject(undefined, true); }
	  var start = state.start;
	  var end = state.end;
	  var step = state.step;
	  var currentYieldingValue = start + (step * state.currentCount++);
	  if (currentYieldingValue === end) { state.hitsEnd = true; }
	  var inclusiveEnd = state.inclusiveEnd;
	  var endCondition;
	  if (end > start) {
	    endCondition = inclusiveEnd ? currentYieldingValue > end : currentYieldingValue >= end;
	  } else {
	    endCondition = inclusiveEnd ? end > currentYieldingValue : end >= currentYieldingValue;
	  }
	  if (endCondition) {
	    state.hitsEnd = true;
	    return createIterResultObject(undefined, true);
	  } return createIterResultObject(currentYieldingValue, false);
	});

	var getter = function (fn) {
	  return { get: fn, set: function () { /* empty */ }, configurable: true, enumerable: false };
	};

	if (descriptors) {
	  defineProperties($RangeIterator.prototype, {
	    start: getter(function () {
	      return getInternalState$4(this).start;
	    }),
	    end: getter(function () {
	      return getInternalState$4(this).end;
	    }),
	    inclusive: getter(function () {
	      return getInternalState$4(this).inclusiveEnd;
	    }),
	    step: getter(function () {
	      return getInternalState$4(this).step;
	    })
	  });
	}

	var numericRangeIterator = $RangeIterator;

	/* eslint-disable es/no-bigint -- safe */



	// `BigInt.range` method
	// https://github.com/tc39/proposal-Number.range
	if (typeof BigInt == 'function') {
	  _export({ target: 'BigInt', stat: true, forced: true }, {
	    range: function range(start, end, option) {
	      return new numericRangeIterator(start, end, option, 'bigint', BigInt(0), BigInt(1));
	    }
	  });
	}

	// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`






	var $Object$1 = Object;
	var $TypeError$9 = TypeError;
	var Map$3 = getBuiltIn('Map');
	var WeakMap$2 = getBuiltIn('WeakMap');

	var Node = function () {
	  // keys
	  this.object = null;
	  this.symbol = null;
	  // child nodes
	  this.primitives = null;
	  this.objectsByIndex = objectCreate(null);
	};

	Node.prototype.get = function (key, initializer) {
	  return this[key] || (this[key] = initializer());
	};

	Node.prototype.next = function (i, it, IS_OBJECT) {
	  var store = IS_OBJECT
	    ? this.objectsByIndex[i] || (this.objectsByIndex[i] = new WeakMap$2())
	    : this.primitives || (this.primitives = new Map$3());
	  var entry = store.get(it);
	  if (!entry) { store.set(it, entry = new Node()); }
	  return entry;
	};

	var root = new Node();

	var compositeKey = function () {
	  var arguments$1 = arguments;

	  var active = root;
	  var length = arguments.length;
	  var i, it;
	  // for prevent leaking, start from objects
	  for (i = 0; i < length; i++) {
	    if (isObject(it = arguments$1[i])) { active = active.next(i, it, true); }
	  }
	  if (this === $Object$1 && active === root) { throw $TypeError$9('Composite keys must contain a non-primitive component'); }
	  for (i = 0; i < length; i++) {
	    if (!isObject(it = arguments$1[i])) { active = active.next(i, it, false); }
	  } return active;
	};

	var $Object = Object;

	var initializer = function () {
	  var freeze = getBuiltIn('Object', 'freeze');
	  return freeze ? freeze(objectCreate(null)) : objectCreate(null);
	};

	// https://github.com/tc39/proposal-richer-keys/tree/master/compositeKey
	_export({ global: true, forced: true }, {
	  compositeKey: function compositeKey$1() {
	    return functionApply(compositeKey, $Object, arguments).get('object', initializer);
	  }
	});

	// https://github.com/tc39/proposal-richer-keys/tree/master/compositeKey
	_export({ global: true, forced: true }, {
	  compositeSymbol: function compositeSymbol() {
	    if (arguments.length == 1 && typeof arguments[0] == 'string') { return getBuiltIn('Symbol')['for'](arguments[0]); }
	    return functionApply(compositeKey, null, arguments).get('symbol', getBuiltIn('Symbol'));
	  }
	});

	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;
	var classRegExp = /^\s*class\b/;
	var exec$4 = functionUncurryThis(classRegExp.exec);

	var isClassConstructor = function (argument) {
	  try {
	    // `Function#toString` throws on some built-it function in some legacy engines
	    // (for example, `DOMQuad` and similar in FF41-)
	    if (!descriptors || !exec$4(classRegExp, inspectSource(argument))) { return false; }
	  } catch (error) { /* empty */ }
	  var prototype = getOwnPropertyDescriptor$1(argument, 'prototype');
	  return !!prototype && hasOwnProperty_1(prototype, 'writable') && !prototype.writable;
	};

	// `Function.isCallable` method
	// https://github.com/caitp/TC39-Proposals/blob/trunk/tc39-reflect-isconstructor-iscallable.md
	_export({ target: 'Function', stat: true, sham: true, forced: true }, {
	  isCallable: function isCallable$1(argument) {
	    return isCallable(argument) && !isClassConstructor(argument);
	  }
	});

	// `Function.isConstructor` method
	// https://github.com/caitp/TC39-Proposals/blob/trunk/tc39-reflect-isconstructor-iscallable.md
	_export({ target: 'Function', stat: true, forced: true }, {
	  isConstructor: isConstructor
	});

	// `Function.prototype.unThis` method
	// https://github.com/js-choi/proposal-function-un-this
	_export({ target: 'Function', proto: true, forced: true }, {
	  unThis: function unThis() {
	    return functionUncurryThisRaw(aCallable(this));
	  }
	});

	// https://github.com/tc39/proposal-iterator-helpers








	var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;


	var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');

	var NativeIterator = global_1.Iterator;

	// FF56- have non-standard global helper `Iterator`
	var FORCED = !isCallable(NativeIterator)
	  || NativeIterator.prototype !== IteratorPrototype$2
	  // FF44- non-standard `Iterator` passes previous tests
	  || !fails(function () { NativeIterator({}); });

	var IteratorConstructor = function Iterator() {
	  anInstance(this, IteratorPrototype$2);
	};

	if (!hasOwnProperty_1(IteratorPrototype$2, TO_STRING_TAG$2)) {
	  createNonEnumerableProperty(IteratorPrototype$2, TO_STRING_TAG$2, 'Iterator');
	}

	if (FORCED || !hasOwnProperty_1(IteratorPrototype$2, 'constructor') || IteratorPrototype$2.constructor === Object) {
	  createNonEnumerableProperty(IteratorPrototype$2, 'constructor', IteratorConstructor);
	}

	IteratorConstructor.prototype = IteratorPrototype$2;

	_export({ global: true, constructor: true, forced: FORCED }, {
	  Iterator: IteratorConstructor
	});

	var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;



	var ITERATOR_HELPER = 'IteratorHelper';
	var WRAP_FOR_VALID_ITERATOR = 'WrapForValidIterator';
	var setInternalState$7 = internalState.set;

	var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');

	var createIteratorProxyPrototype = function (IS_ITERATOR) {
	  var ITERATOR_PROXY = IS_ITERATOR ? WRAP_FOR_VALID_ITERATOR : ITERATOR_HELPER;

	  var getInternalState = internalState.getterFor(ITERATOR_PROXY);

	  var IteratorProxyPrototype = defineBuiltIns(objectCreate(IteratorPrototype$1), {
	    next: function next() {
	      var state = getInternalState(this);
	      // for simplification:
	      //   for `%WrapForValidIteratorPrototype%.next` our `nextHandler` returns `IterResultObject`
	      //   for `%IteratorHelperPrototype%.next` - just a value
	      if (IS_ITERATOR) { return state.nextHandler(); }
	      try {
	        var result = state.done ? undefined : state.nextHandler();
	        return createIterResultObject(result, state.done);
	      } catch (error) {
	        state.done = true;
	        throw error;
	      }
	    },
	    'return': function () {
	      var state = getInternalState(this);
	      var iterator = state.iterator;
	      state.done = true;
	      if (IS_ITERATOR) {
	        var returnMethod = getMethod(iterator, 'return');
	        return returnMethod ? functionCall(returnMethod, iterator) : createIterResultObject(undefined, true);
	      }
	      if (state.inner) { try {
	        iteratorClose(state.inner.iterator, 'return');
	      } catch (error) {
	        return iteratorClose(iterator, 'throw', error);
	      } }
	      iteratorClose(iterator, 'return');
	      return createIterResultObject(undefined, true);
	    }
	  });

	  if (!IS_ITERATOR) {
	    createNonEnumerableProperty(IteratorProxyPrototype, TO_STRING_TAG$1, 'Iterator Helper');
	  }

	  return IteratorProxyPrototype;
	};

	var IteratorHelperPrototype = createIteratorProxyPrototype(false);
	var WrapForValidIteratorPrototype = createIteratorProxyPrototype(true);

	var iteratorCreateProxy = function (nextHandler, IS_ITERATOR) {
	  var ITERATOR_PROXY = IS_ITERATOR ? WRAP_FOR_VALID_ITERATOR : ITERATOR_HELPER;

	  var IteratorProxy = function Iterator(record, state) {
	    if (state) {
	      state.iterator = record.iterator;
	      state.next = record.next;
	    } else { state = record; }
	    state.type = ITERATOR_PROXY;
	    state.nextHandler = nextHandler;
	    state.counter = 0;
	    state.done = false;
	    setInternalState$7(this, state);
	  };

	  IteratorProxy.prototype = IS_ITERATOR ? WrapForValidIteratorPrototype : IteratorHelperPrototype;

	  return IteratorProxy;
	};

	// https://github.com/tc39/proposal-iterator-helpers





	var IteratorProxy$6 = iteratorCreateProxy(function () {
	  var result = anObject(functionCall(this.next, this.iterator));
	  var done = this.done = !!result.done;
	  if (!done) { return [this.index++, result.value]; }
	});

	var iteratorIndexed = function indexed() {
	  return new IteratorProxy$6(getIteratorDirect(this), {
	    index: 0
	  });
	};

	// TODO: Remove from `core-js@4`
	// https://github.com/tc39/proposal-iterator-helpers



	_export({ target: 'Iterator', name: 'indexed', proto: true, real: true, forced: true }, {
	  asIndexedPairs: iteratorIndexed
	});

	// https://github.com/tc39/proposal-iterator-helpers








	var IteratorProxy$5 = iteratorCreateProxy(function () {
	  var iterator = this.iterator;
	  var next = this.next;
	  var result, done;
	  while (this.remaining) {
	    this.remaining--;
	    result = anObject(functionCall(next, iterator));
	    done = this.done = !!result.done;
	    if (done) { return; }
	  }
	  result = anObject(functionCall(next, iterator));
	  done = this.done = !!result.done;
	  if (!done) { return result.value; }
	});

	_export({ target: 'Iterator', proto: true, real: true, forced: true }, {
	  drop: function drop(limit) {
	    return new IteratorProxy$5(getIteratorDirect(this), {
	      remaining: toPositiveInteger(notANan(+limit))
	    });
	  }
	});

	// https://github.com/tc39/proposal-iterator-helpers





	_export({ target: 'Iterator', proto: true, real: true, forced: true }, {
	  every: function every(fn) {
	    var record = getIteratorDirect(this);
	    var counter = 0;
	    aCallable(fn);
	    return !iterate(record, function (value, stop) {
	      if (!fn(value, counter++)) { return stop(); }
	    }, { IS_RECORD: true, INTERRUPTED: true }).stopped;
	  }
	});

	// https://github.com/tc39/proposal-iterator-helpers








	var IteratorProxy$4 = iteratorCreateProxy(function () {
	  var iterator = this.iterator;
	  var filterer = this.filterer;
	  var next = this.next;
	  var result, done, value;
	  while (true) {
	    result = anObject(functionCall(next, iterator));
	    done = this.done = !!result.done;
	    if (done) { return; }
	    value = result.value;
	    if (callWithSafeIterationClosing(iterator, filterer, [value, this.counter++], true)) { return value; }
	  }
	});

	_export({ target: 'Iterator', proto: true, real: true, forced: true }, {
	  filter: function filter(filterer) {
	    return new IteratorProxy$4(getIteratorDirect(this), {
	      filterer: aCallable(filterer)
	    });
	  }
	});

	// https://github.com/tc39/proposal-iterator-helpers





	_export({ target: 'Iterator', proto: true, real: true, forced: true }, {
	  find: function find(fn) {
	    var record = getIteratorDirect(this);
	    var counter = 0;
	    aCallable(fn);
	    return iterate(record, function (value, stop) {
	      if (fn(value, counter++)) { return stop(value); }
	    }, { IS_RECORD: true, INTERRUPTED: true }).result;
	  }
	});

	var getIteratorFlattenable = function (obj) {
	  var object = toObject(obj);
	  var method = getIteratorMethod(object);
	  return getIteratorDirect(isCallable(method) ? functionCall(method, object) : object);
	};

	// https://github.com/tc39/proposal-iterator-helpers









	var IteratorProxy$3 = iteratorCreateProxy(function () {
	  var iterator = this.iterator;
	  var mapper = this.mapper;
	  var result, inner;

	  while (true) {
	    if (inner = this.inner) { try {
	      result = anObject(functionCall(inner.next, inner.iterator));
	      if (!result.done) { return result.value; }
	      this.inner = null;
	    } catch (error) { iteratorClose(iterator, 'throw', error); } }

	    result = anObject(functionCall(this.next, iterator));

	    if (this.done = !!result.done) { return; }

	    try {
	      this.inner = getIteratorFlattenable(mapper(result.value, this.counter++));
	    } catch (error$1) { iteratorClose(iterator, 'throw', error$1); }
	  }
	});

	_export({ target: 'Iterator', proto: true, real: true, forced: true }, {
	  flatMap: function flatMap(mapper) {
	    return new IteratorProxy$3(getIteratorDirect(this), {
	      mapper: aCallable(mapper),
	      inner: null
	    });
	  }
	});

	// https://github.com/tc39/proposal-iterator-helpers





	_export({ target: 'Iterator', proto: true, real: true, forced: true }, {
	  forEach: function forEach(fn) {
	    var record = getIteratorDirect(this);
	    var counter = 0;
	    aCallable(fn);
	    iterate(record, function (value) {
	      fn(value, counter++);
	    }, { IS_RECORD: true });
	  }
	});

	// https://github.com/tc39/proposal-iterator-helpers



	var IteratorPrototype = iteratorsCore.IteratorPrototype;



	var IteratorProxy$2 = iteratorCreateProxy(function () {
	  return functionCall(this.next, this.iterator);
	}, true);

	_export({ target: 'Iterator', stat: true, forced: true }, {
	  from: function from(O) {
	    var iteratorRecord = getIteratorFlattenable(O);
	    return objectIsPrototypeOf(IteratorPrototype, iteratorRecord.iterator)
	      ? iteratorRecord.iterator
	      : new IteratorProxy$2(iteratorRecord);
	  }
	});

	// TODO: Remove from `core-js@4`
	// https://github.com/tc39/proposal-iterator-helpers



	_export({ target: 'Iterator', proto: true, real: true, forced: true }, {
	  indexed: iteratorIndexed
	});

	// https://github.com/tc39/proposal-iterator-helpers








	var IteratorProxy$1 = iteratorCreateProxy(function () {
	  var iterator = this.iterator;
	  var result = anObject(functionCall(this.next, iterator));
	  var done = this.done = !!result.done;
	  if (!done) { return callWithSafeIterationClosing(iterator, this.mapper, [result.value, this.counter++], true); }
	});

	_export({ target: 'Iterator', proto: true, real: true, forced: true }, {
	  map: function map(mapper) {
	    return new IteratorProxy$1(getIteratorDirect(this), {
	      mapper: aCallable(mapper)
	    });
	  }
	});

	// https://github.com/tc39/proposal-iterator-helpers





	var $TypeError$8 = TypeError;

	_export({ target: 'Iterator', proto: true, real: true, forced: true }, {
	  reduce: function reduce(reducer /* , initialValue */) {
	    var record = getIteratorDirect(this);
	    aCallable(reducer);
	    var noInitial = arguments.length < 2;
	    var accumulator = noInitial ? undefined : arguments[1];
	    var counter = 0;
	    iterate(record, function (value) {
	      if (noInitial) {
	        noInitial = false;
	        accumulator = value;
	      } else {
	        accumulator = reducer(accumulator, value, counter);
	      }
	      counter++;
	    }, { IS_RECORD: true });
	    if (noInitial) { throw $TypeError$8('Reduce of empty iterator with no initial value'); }
	    return accumulator;
	  }
	});

	// https://github.com/tc39/proposal-iterator-helpers





	_export({ target: 'Iterator', proto: true, real: true, forced: true }, {
	  some: function some(fn) {
	    var record = getIteratorDirect(this);
	    var counter = 0;
	    aCallable(fn);
	    return iterate(record, function (value, stop) {
	      if (fn(value, counter++)) { return stop(); }
	    }, { IS_RECORD: true, INTERRUPTED: true }).stopped;
	  }
	});

	// https://github.com/tc39/proposal-iterator-helpers









	var IteratorProxy = iteratorCreateProxy(function () {
	  var iterator = this.iterator;
	  if (!this.remaining--) {
	    this.done = true;
	    return iteratorClose(iterator, 'normal', undefined);
	  }
	  var result = anObject(functionCall(this.next, iterator));
	  var done = this.done = !!result.done;
	  if (!done) { return result.value; }
	});

	_export({ target: 'Iterator', proto: true, real: true, forced: true }, {
	  take: function take(limit) {
	    return new IteratorProxy(getIteratorDirect(this), {
	      remaining: toPositiveInteger(notANan(+limit))
	    });
	  }
	});

	// https://github.com/tc39/proposal-iterator-helpers




	var push$9 = [].push;

	_export({ target: 'Iterator', proto: true, real: true, forced: true }, {
	  toArray: function toArray() {
	    var result = [];
	    iterate(getIteratorDirect(this), push$9, { that: result, IS_RECORD: true });
	    return result;
	  }
	});

	// https://github.com/tc39/proposal-iterator-helpers





	_export({ target: 'Iterator', proto: true, real: true, forced: true }, {
	  toAsync: function toAsync() {
	    return new asyncIteratorWrap(getIteratorDirect(new asyncFromSyncIterator(getIteratorDirect(this))));
	  }
	});

	// https://github.com/tc39/collection-methods
	var collectionDeleteAll = function deleteAll(/* ...elements */) {
	  var arguments$1 = arguments;

	  var collection = anObject(this);
	  var remover = aCallable(collection['delete']);
	  var allDeleted = true;
	  var wasDeleted;
	  for (var k = 0, len = arguments.length; k < len; k++) {
	    wasDeleted = functionCall(remover, collection, arguments$1[k]);
	    allDeleted = allDeleted && wasDeleted;
	  }
	  return !!allDeleted;
	};

	// `Map.prototype.deleteAll` method
	// https://github.com/tc39/proposal-collection-methods
	_export({ target: 'Map', proto: true, real: true, forced: true }, {
	  deleteAll: collectionDeleteAll
	});

	// `Map.prototype.emplace` method
	// https://github.com/thumbsupep/proposal-upsert
	var mapEmplace = function emplace(key, handler) {
	  var map = anObject(this);
	  var get = aCallable(map.get);
	  var has = aCallable(map.has);
	  var set = aCallable(map.set);
	  var value, inserted;
	  if (functionCall(has, map, key)) {
	    value = functionCall(get, map, key);
	    if ('update' in handler) {
	      value = handler.update(value, key, map);
	      functionCall(set, map, key, value);
	    } return value;
	  }
	  inserted = handler.insert(key, map);
	  functionCall(set, map, key, inserted);
	  return inserted;
	};

	// `Map.prototype.emplace` method
	// https://github.com/thumbsupep/proposal-upsert
	_export({ target: 'Map', proto: true, real: true, forced: true }, {
	  emplace: mapEmplace
	});

	var getMapIterator = function (it) {
	  // eslint-disable-next-line es/no-map -- safe
	  return functionCall(Map.prototype.entries, it);
	};

	// `Map.prototype.every` method
	// https://github.com/tc39/proposal-collection-methods
	_export({ target: 'Map', proto: true, real: true, forced: true }, {
	  every: function every(callbackfn /* , thisArg */) {
	    var map = anObject(this);
	    var iterator = getMapIterator(map);
	    var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    return !iterate(iterator, function (key, value, stop) {
	      if (!boundFunction(value, key, map)) { return stop(); }
	    }, { AS_ENTRIES: true, IS_ITERATOR: true, INTERRUPTED: true }).stopped;
	  }
	});

	// `Map.prototype.filter` method
	// https://github.com/tc39/proposal-collection-methods
	_export({ target: 'Map', proto: true, real: true, forced: true }, {
	  filter: function filter(callbackfn /* , thisArg */) {
	    var map = anObject(this);
	    var iterator = getMapIterator(map);
	    var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    var newMap = new (speciesConstructor(map, getBuiltIn('Map')))();
	    var setter = aCallable(newMap.set);
	    iterate(iterator, function (key, value) {
	      if (boundFunction(value, key, map)) { functionCall(setter, newMap, key, value); }
	    }, { AS_ENTRIES: true, IS_ITERATOR: true });
	    return newMap;
	  }
	});

	// `Map.prototype.find` method
	// https://github.com/tc39/proposal-collection-methods
	_export({ target: 'Map', proto: true, real: true, forced: true }, {
	  find: function find(callbackfn /* , thisArg */) {
	    var map = anObject(this);
	    var iterator = getMapIterator(map);
	    var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    return iterate(iterator, function (key, value, stop) {
	      if (boundFunction(value, key, map)) { return stop(value); }
	    }, { AS_ENTRIES: true, IS_ITERATOR: true, INTERRUPTED: true }).result;
	  }
	});

	// `Map.prototype.findKey` method
	// https://github.com/tc39/proposal-collection-methods
	_export({ target: 'Map', proto: true, real: true, forced: true }, {
	  findKey: function findKey(callbackfn /* , thisArg */) {
	    var map = anObject(this);
	    var iterator = getMapIterator(map);
	    var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    return iterate(iterator, function (key, value, stop) {
	      if (boundFunction(value, key, map)) { return stop(key); }
	    }, { AS_ENTRIES: true, IS_ITERATOR: true, INTERRUPTED: true }).result;
	  }
	});

	// https://tc39.github.io/proposal-setmap-offrom/







	var push$8 = [].push;

	var collectionFrom = function from(source /* , mapFn, thisArg */) {
	  var length = arguments.length;
	  var mapFn = length > 1 ? arguments[1] : undefined;
	  var mapping, array, n, boundFunction;
	  aConstructor(this);
	  mapping = mapFn !== undefined;
	  if (mapping) { aCallable(mapFn); }
	  if (isNullOrUndefined(source)) { return new this(); }
	  array = [];
	  if (mapping) {
	    n = 0;
	    boundFunction = functionBindContext(mapFn, length > 2 ? arguments[2] : undefined);
	    iterate(source, function (nextItem) {
	      functionCall(push$8, array, boundFunction(nextItem, n++));
	    });
	  } else {
	    iterate(source, push$8, { that: array });
	  }
	  return new this(array);
	};

	// `Map.from` method
	// https://tc39.github.io/proposal-setmap-offrom/#sec-map.from
	_export({ target: 'Map', stat: true, forced: true }, {
	  from: collectionFrom
	});

	var push$7 = functionUncurryThis([].push);

	// `Map.groupBy` method
	// https://github.com/tc39/proposal-collection-methods
	_export({ target: 'Map', stat: true, forced: true }, {
	  groupBy: function groupBy(iterable, keyDerivative) {
	    aCallable(keyDerivative);
	    var iterator = getIterator(iterable);
	    var newMap = new this();
	    var has = aCallable(newMap.has);
	    var get = aCallable(newMap.get);
	    var set = aCallable(newMap.set);
	    iterate(iterator, function (element) {
	      var derivedKey = keyDerivative(element);
	      if (!functionCall(has, newMap, derivedKey)) { functionCall(set, newMap, derivedKey, [element]); }
	      else { push$7(functionCall(get, newMap, derivedKey), element); }
	    }, { IS_ITERATOR: true });
	    return newMap;
	  }
	});

	// `SameValueZero` abstract operation
	// https://tc39.es/ecma262/#sec-samevaluezero
	var sameValueZero = function (x, y) {
	  // eslint-disable-next-line no-self-compare -- NaN check
	  return x === y || x != x && y != y;
	};

	// `Map.prototype.includes` method
	// https://github.com/tc39/proposal-collection-methods
	_export({ target: 'Map', proto: true, real: true, forced: true }, {
	  includes: function includes(searchElement) {
	    return iterate(getMapIterator(anObject(this)), function (key, value, stop) {
	      if (sameValueZero(value, searchElement)) { return stop(); }
	    }, { AS_ENTRIES: true, IS_ITERATOR: true, INTERRUPTED: true }).stopped;
	  }
	});

	// `Map.keyBy` method
	// https://github.com/tc39/proposal-collection-methods
	_export({ target: 'Map', stat: true, forced: true }, {
	  keyBy: function keyBy(iterable, keyDerivative) {
	    var newMap = new this();
	    aCallable(keyDerivative);
	    var setter = aCallable(newMap.set);
	    iterate(iterable, function (element) {
	      functionCall(setter, newMap, keyDerivative(element), element);
	    });
	    return newMap;
	  }
	});

	// `Map.prototype.keyOf` method
	// https://github.com/tc39/proposal-collection-methods
	_export({ target: 'Map', proto: true, real: true, forced: true }, {
	  keyOf: function keyOf(searchElement) {
	    return iterate(getMapIterator(anObject(this)), function (key, value, stop) {
	      if (value === searchElement) { return stop(key); }
	    }, { AS_ENTRIES: true, IS_ITERATOR: true, INTERRUPTED: true }).result;
	  }
	});

	// `Map.prototype.mapKeys` method
	// https://github.com/tc39/proposal-collection-methods
	_export({ target: 'Map', proto: true, real: true, forced: true }, {
	  mapKeys: function mapKeys(callbackfn /* , thisArg */) {
	    var map = anObject(this);
	    var iterator = getMapIterator(map);
	    var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    var newMap = new (speciesConstructor(map, getBuiltIn('Map')))();
	    var setter = aCallable(newMap.set);
	    iterate(iterator, function (key, value) {
	      functionCall(setter, newMap, boundFunction(value, key, map), value);
	    }, { AS_ENTRIES: true, IS_ITERATOR: true });
	    return newMap;
	  }
	});

	// `Map.prototype.mapValues` method
	// https://github.com/tc39/proposal-collection-methods
	_export({ target: 'Map', proto: true, real: true, forced: true }, {
	  mapValues: function mapValues(callbackfn /* , thisArg */) {
	    var map = anObject(this);
	    var iterator = getMapIterator(map);
	    var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    var newMap = new (speciesConstructor(map, getBuiltIn('Map')))();
	    var setter = aCallable(newMap.set);
	    iterate(iterator, function (key, value) {
	      functionCall(setter, newMap, key, boundFunction(value, key, map));
	    }, { AS_ENTRIES: true, IS_ITERATOR: true });
	    return newMap;
	  }
	});

	// `Map.prototype.merge` method
	// https://github.com/tc39/proposal-collection-methods
	_export({ target: 'Map', proto: true, real: true, arity: 1, forced: true }, {
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  merge: function merge(iterable /* ...iterables */) {
	    var arguments$1 = arguments;

	    var map = anObject(this);
	    var setter = aCallable(map.set);
	    var argumentsLength = arguments.length;
	    var i = 0;
	    while (i < argumentsLength) {
	      iterate(arguments$1[i++], setter, { that: map, AS_ENTRIES: true });
	    }
	    return map;
	  }
	});

	// https://tc39.github.io/proposal-setmap-offrom/
	var collectionOf = function of() {
	  return new this(arraySlice$1(arguments));
	};

	// `Map.of` method
	// https://tc39.github.io/proposal-setmap-offrom/#sec-map.of
	_export({ target: 'Map', stat: true, forced: true }, {
	  of: collectionOf
	});

	var $TypeError$7 = TypeError;

	// `Map.prototype.reduce` method
	// https://github.com/tc39/proposal-collection-methods
	_export({ target: 'Map', proto: true, real: true, forced: true }, {
	  reduce: function reduce(callbackfn /* , initialValue */) {
	    var map = anObject(this);
	    var iterator = getMapIterator(map);
	    var noInitial = arguments.length < 2;
	    var accumulator = noInitial ? undefined : arguments[1];
	    aCallable(callbackfn);
	    iterate(iterator, function (key, value) {
	      if (noInitial) {
	        noInitial = false;
	        accumulator = value;
	      } else {
	        accumulator = callbackfn(accumulator, value, key, map);
	      }
	    }, { AS_ENTRIES: true, IS_ITERATOR: true });
	    if (noInitial) { throw $TypeError$7('Reduce of empty map with no initial value'); }
	    return accumulator;
	  }
	});

	// `Set.prototype.some` method
	// https://github.com/tc39/proposal-collection-methods
	_export({ target: 'Map', proto: true, real: true, forced: true }, {
	  some: function some(callbackfn /* , thisArg */) {
	    var map = anObject(this);
	    var iterator = getMapIterator(map);
	    var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    return iterate(iterator, function (key, value, stop) {
	      if (boundFunction(value, key, map)) { return stop(); }
	    }, { AS_ENTRIES: true, IS_ITERATOR: true, INTERRUPTED: true }).stopped;
	  }
	});

	var $TypeError$6 = TypeError;

	// `Set.prototype.update` method
	// https://github.com/tc39/proposal-collection-methods
	_export({ target: 'Map', proto: true, real: true, forced: true }, {
	  update: function update(key, callback /* , thunk */) {
	    var map = anObject(this);
	    var get = aCallable(map.get);
	    var has = aCallable(map.has);
	    var set = aCallable(map.set);
	    var length = arguments.length;
	    aCallable(callback);
	    var isPresentInMap = functionCall(has, map, key);
	    if (!isPresentInMap && length < 3) {
	      throw $TypeError$6('Updating absent value');
	    }
	    var value = isPresentInMap ? functionCall(get, map, key) : aCallable(length > 2 ? arguments[2] : undefined)(key, map);
	    functionCall(set, map, key, callback(value, key, map));
	    return map;
	  }
	});

	var $TypeError$5 = TypeError;

	// `Map.prototype.upsert` method
	// https://github.com/thumbsupep/proposal-upsert
	var mapUpsert = function upsert(key, updateFn /* , insertFn */) {
	  var map = anObject(this);
	  var get = aCallable(map.get);
	  var has = aCallable(map.has);
	  var set = aCallable(map.set);
	  var insertFn = arguments.length > 2 ? arguments[2] : undefined;
	  var value;
	  if (!isCallable(updateFn) && !isCallable(insertFn)) {
	    throw $TypeError$5('At least one callback required');
	  }
	  if (functionCall(has, map, key)) {
	    value = functionCall(get, map, key);
	    if (isCallable(updateFn)) {
	      value = updateFn(value);
	      functionCall(set, map, key, value);
	    }
	  } else if (isCallable(insertFn)) {
	    value = insertFn();
	    functionCall(set, map, key, value);
	  } return value;
	};

	// TODO: remove from `core-js@4`



	// `Map.prototype.updateOrInsert` method (replaced by `Map.prototype.emplace`)
	// https://github.com/thumbsupep/proposal-upsert
	_export({ target: 'Map', proto: true, real: true, name: 'upsert', forced: true }, {
	  updateOrInsert: mapUpsert
	});

	// TODO: remove from `core-js@4`



	// `Map.prototype.upsert` method (replaced by `Map.prototype.emplace`)
	// https://github.com/thumbsupep/proposal-upsert
	_export({ target: 'Map', proto: true, real: true, forced: true }, {
	  upsert: mapUpsert
	});

	var min$1 = Math.min;
	var max$1 = Math.max;

	// `Math.clamp` method
	// https://rwaldron.github.io/proposal-math-extensions/
	_export({ target: 'Math', stat: true, forced: true }, {
	  clamp: function clamp(x, lower, upper) {
	    return min$1(upper, max$1(lower, x));
	  }
	});

	// `Math.DEG_PER_RAD` constant
	// https://rwaldron.github.io/proposal-math-extensions/
	_export({ target: 'Math', stat: true, nonConfigurable: true, nonWritable: true }, {
	  DEG_PER_RAD: Math.PI / 180
	});

	var RAD_PER_DEG = 180 / Math.PI;

	// `Math.degrees` method
	// https://rwaldron.github.io/proposal-math-extensions/
	_export({ target: 'Math', stat: true, forced: true }, {
	  degrees: function degrees(radians) {
	    return radians * RAD_PER_DEG;
	  }
	});

	// `Math.scale` method implementation
	// https://rwaldron.github.io/proposal-math-extensions/
	var mathScale = Math.scale || function scale(x, inLow, inHigh, outLow, outHigh) {
	  var nx = +x;
	  var nInLow = +inLow;
	  var nInHigh = +inHigh;
	  var nOutLow = +outLow;
	  var nOutHigh = +outHigh;
	  // eslint-disable-next-line no-self-compare -- NaN check
	  if (nx != nx || nInLow != nInLow || nInHigh != nInHigh || nOutLow != nOutLow || nOutHigh != nOutHigh) { return NaN; }
	  if (nx === Infinity || nx === -Infinity) { return nx; }
	  return (nx - nInLow) * (nOutHigh - nOutLow) / (nInHigh - nInLow) + nOutLow;
	};

	// `Math.fscale` method
	// https://rwaldron.github.io/proposal-math-extensions/
	_export({ target: 'Math', stat: true, forced: true }, {
	  fscale: function fscale(x, inLow, inHigh, outLow, outHigh) {
	    return mathFround(mathScale(x, inLow, inHigh, outLow, outHigh));
	  }
	});

	// `Math.iaddh` method
	// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
	// TODO: Remove from `core-js@4`
	_export({ target: 'Math', stat: true, forced: true }, {
	  iaddh: function iaddh(x0, x1, y0, y1) {
	    var $x0 = x0 >>> 0;
	    var $x1 = x1 >>> 0;
	    var $y0 = y0 >>> 0;
	    return $x1 + (y1 >>> 0) + (($x0 & $y0 | ($x0 | $y0) & ~($x0 + $y0 >>> 0)) >>> 31) | 0;
	  }
	});

	// `Math.imulh` method
	// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
	// TODO: Remove from `core-js@4`
	_export({ target: 'Math', stat: true, forced: true }, {
	  imulh: function imulh(u, v) {
	    var UINT16 = 0xFFFF;
	    var $u = +u;
	    var $v = +v;
	    var u0 = $u & UINT16;
	    var v0 = $v & UINT16;
	    var u1 = $u >> 16;
	    var v1 = $v >> 16;
	    var t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
	    return u1 * v1 + (t >> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >> 16);
	  }
	});

	// `Math.isubh` method
	// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
	// TODO: Remove from `core-js@4`
	_export({ target: 'Math', stat: true, forced: true }, {
	  isubh: function isubh(x0, x1, y0, y1) {
	    var $x0 = x0 >>> 0;
	    var $x1 = x1 >>> 0;
	    var $y0 = y0 >>> 0;
	    return $x1 - (y1 >>> 0) - ((~$x0 & $y0 | ~($x0 ^ $y0) & $x0 - $y0 >>> 0) >>> 31) | 0;
	  }
	});

	// `Math.RAD_PER_DEG` constant
	// https://rwaldron.github.io/proposal-math-extensions/
	_export({ target: 'Math', stat: true, nonConfigurable: true, nonWritable: true }, {
	  RAD_PER_DEG: 180 / Math.PI
	});

	var DEG_PER_RAD = Math.PI / 180;

	// `Math.radians` method
	// https://rwaldron.github.io/proposal-math-extensions/
	_export({ target: 'Math', stat: true, forced: true }, {
	  radians: function radians(degrees) {
	    return degrees * DEG_PER_RAD;
	  }
	});

	// `Math.scale` method
	// https://rwaldron.github.io/proposal-math-extensions/
	_export({ target: 'Math', stat: true, forced: true }, {
	  scale: mathScale
	});

	var SEEDED_RANDOM = 'Seeded Random';
	var SEEDED_RANDOM_GENERATOR = SEEDED_RANDOM + ' Generator';
	var SEED_TYPE_ERROR = 'Math.seededPRNG() argument should have a "seed" field with a finite value.';
	var setInternalState$6 = internalState.set;
	var getInternalState$3 = internalState.getterFor(SEEDED_RANDOM_GENERATOR);
	var $TypeError$4 = TypeError;

	var $SeededRandomGenerator = iteratorCreateConstructor(function SeededRandomGenerator(seed) {
	  setInternalState$6(this, {
	    type: SEEDED_RANDOM_GENERATOR,
	    seed: seed % 2147483647
	  });
	}, SEEDED_RANDOM, function next() {
	  var state = getInternalState$3(this);
	  var seed = state.seed = (state.seed * 1103515245 + 12345) % 2147483647;
	  return createIterResultObject((seed & 1073741823) / 1073741823, false);
	});

	// `Math.seededPRNG` method
	// https://github.com/tc39/proposal-seeded-random
	// based on https://github.com/tc39/proposal-seeded-random/blob/78b8258835b57fc2100d076151ab506bc3202ae6/demo.html
	_export({ target: 'Math', stat: true, forced: true }, {
	  seededPRNG: function seededPRNG(it) {
	    var seed = anObject(it).seed;
	    if (!numberIsFinite(seed)) { throw $TypeError$4(SEED_TYPE_ERROR); }
	    return new $SeededRandomGenerator(seed);
	  }
	});

	// `Math.signbit` method
	// https://github.com/tc39/proposal-Math.signbit
	_export({ target: 'Math', stat: true, forced: true }, {
	  signbit: function signbit(x) {
	    var n = +x;
	    // eslint-disable-next-line no-self-compare -- NaN check
	    return n == n && n == 0 ? 1 / n == -Infinity : n < 0;
	  }
	});

	// `Math.umulh` method
	// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
	// TODO: Remove from `core-js@4`
	_export({ target: 'Math', stat: true, forced: true }, {
	  umulh: function umulh(u, v) {
	    var UINT16 = 0xFFFF;
	    var $u = +u;
	    var $v = +v;
	    var u0 = $u & UINT16;
	    var v0 = $v & UINT16;
	    var u1 = $u >>> 16;
	    var v1 = $v >>> 16;
	    var t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
	    return u1 * v1 + (t >>> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >>> 16);
	  }
	});

	var INVALID_NUMBER_REPRESENTATION = 'Invalid number representation';
	var INVALID_RADIX = 'Invalid radix';
	var $RangeError$1 = RangeError;
	var $SyntaxError = SyntaxError;
	var $TypeError$3 = TypeError;
	var valid = /^[\da-z]+$/;
	var charAt$7 = functionUncurryThis(''.charAt);
	var exec$3 = functionUncurryThis(valid.exec);
	var numberToString$1 = functionUncurryThis(1.0.toString);
	var stringSlice$2 = functionUncurryThis(''.slice);

	// `Number.fromString` method
	// https://github.com/tc39/proposal-number-fromstring
	_export({ target: 'Number', stat: true, forced: true }, {
	  fromString: function fromString(string, radix) {
	    var sign = 1;
	    var R, mathNum;
	    if (typeof string != 'string') { throw $TypeError$3(INVALID_NUMBER_REPRESENTATION); }
	    if (!string.length) { throw $SyntaxError(INVALID_NUMBER_REPRESENTATION); }
	    if (charAt$7(string, 0) == '-') {
	      sign = -1;
	      string = stringSlice$2(string, 1);
	      if (!string.length) { throw $SyntaxError(INVALID_NUMBER_REPRESENTATION); }
	    }
	    R = radix === undefined ? 10 : toIntegerOrInfinity(radix);
	    if (R < 2 || R > 36) { throw $RangeError$1(INVALID_RADIX); }
	    if (!exec$3(valid, string) || numberToString$1(mathNum = numberParseInt(string, R), R) !== string) {
	      throw $SyntaxError(INVALID_NUMBER_REPRESENTATION);
	    }
	    return sign * mathNum;
	  }
	});

	// `Number.range` method
	// https://github.com/tc39/proposal-Number.range
	_export({ target: 'Number', stat: true, forced: true }, {
	  range: function range(start, end, option) {
	    return new numericRangeIterator(start, end, option, 'number', 0, 1);
	  }
	});

	var OBJECT_ITERATOR = 'Object Iterator';
	var setInternalState$5 = internalState.set;
	var getInternalState$2 = internalState.getterFor(OBJECT_ITERATOR);

	var objectIterator = iteratorCreateConstructor(function ObjectIterator(source, mode) {
	  var object = toObject(source);
	  setInternalState$5(this, {
	    type: OBJECT_ITERATOR,
	    mode: mode,
	    object: object,
	    keys: objectKeys$1(object),
	    index: 0
	  });
	}, 'Object', function next() {
	  var state = getInternalState$2(this);
	  var keys = state.keys;
	  while (true) {
	    if (keys === null || state.index >= keys.length) {
	      state.object = state.keys = null;
	      return createIterResultObject(undefined, true);
	    }
	    var key = keys[state.index++];
	    var object = state.object;
	    if (!hasOwnProperty_1(object, key)) { continue; }
	    switch (state.mode) {
	      case 'keys': return createIterResultObject(key, false);
	      case 'values': return createIterResultObject(object[key], false);
	    } /* entries */ return createIterResultObject([key, object[key]], false);
	  }
	});

	// TODO: Remove from `core-js@4`



	// `Object.iterateEntries` method
	// https://github.com/tc39/proposal-object-iteration
	_export({ target: 'Object', stat: true, forced: true }, {
	  iterateEntries: function iterateEntries(object) {
	    return new objectIterator(object, 'entries');
	  }
	});

	// TODO: Remove from `core-js@4`



	// `Object.iterateKeys` method
	// https://github.com/tc39/proposal-object-iteration
	_export({ target: 'Object', stat: true, forced: true }, {
	  iterateKeys: function iterateKeys(object) {
	    return new objectIterator(object, 'keys');
	  }
	});

	// TODO: Remove from `core-js@4`



	// `Object.iterateValues` method
	// https://github.com/tc39/proposal-object-iteration
	_export({ target: 'Object', stat: true, forced: true }, {
	  iterateValues: function iterateValues(object) {
	    return new objectIterator(object, 'values');
	  }
	});

	var $$OBSERVABLE$2 = wellKnownSymbol('observable');
	var NativeObservable = global_1.Observable;
	var NativeObservablePrototype = NativeObservable && NativeObservable.prototype;

	var observableForced = !isCallable(NativeObservable)
	  || !isCallable(NativeObservable.from)
	  || !isCallable(NativeObservable.of)
	  || !isCallable(NativeObservablePrototype.subscribe)
	  || !isCallable(NativeObservablePrototype[$$OBSERVABLE$2]);

	// https://github.com/tc39/proposal-observable



















	var $$OBSERVABLE$1 = wellKnownSymbol('observable');
	var OBSERVABLE = 'Observable';
	var SUBSCRIPTION = 'Subscription';
	var SUBSCRIPTION_OBSERVER = 'SubscriptionObserver';
	var getterFor$1 = internalState.getterFor;
	var setInternalState$4 = internalState.set;
	var getObservableInternalState = getterFor$1(OBSERVABLE);
	var getSubscriptionInternalState = getterFor$1(SUBSCRIPTION);
	var getSubscriptionObserverInternalState = getterFor$1(SUBSCRIPTION_OBSERVER);

	var SubscriptionState = function (observer) {
	  this.observer = anObject(observer);
	  this.cleanup = undefined;
	  this.subscriptionObserver = undefined;
	};

	SubscriptionState.prototype = {
	  type: SUBSCRIPTION,
	  clean: function () {
	    var cleanup = this.cleanup;
	    if (cleanup) {
	      this.cleanup = undefined;
	      try {
	        cleanup();
	      } catch (error) {
	        hostReportErrors(error);
	      }
	    }
	  },
	  close: function () {
	    if (!descriptors) {
	      var subscription = this.facade;
	      var subscriptionObserver = this.subscriptionObserver;
	      subscription.closed = true;
	      if (subscriptionObserver) { subscriptionObserver.closed = true; }
	    } this.observer = undefined;
	  },
	  isClosed: function () {
	    return this.observer === undefined;
	  }
	};

	var Subscription = function (observer, subscriber) {
	  var subscriptionState = setInternalState$4(this, new SubscriptionState(observer));
	  var start;
	  if (!descriptors) { this.closed = false; }
	  try {
	    if (start = getMethod(observer, 'start')) { functionCall(start, observer, this); }
	  } catch (error) {
	    hostReportErrors(error);
	  }
	  if (subscriptionState.isClosed()) { return; }
	  var subscriptionObserver = subscriptionState.subscriptionObserver = new SubscriptionObserver(subscriptionState);
	  try {
	    var cleanup = subscriber(subscriptionObserver);
	    var subscription = cleanup;
	    if (!isNullOrUndefined(cleanup)) { subscriptionState.cleanup = isCallable(cleanup.unsubscribe)
	      ? function () { subscription.unsubscribe(); }
	      : aCallable(cleanup); }
	  } catch (error$1) {
	    subscriptionObserver.error(error$1);
	    return;
	  } if (subscriptionState.isClosed()) { subscriptionState.clean(); }
	};

	Subscription.prototype = defineBuiltIns({}, {
	  unsubscribe: function unsubscribe() {
	    var subscriptionState = getSubscriptionInternalState(this);
	    if (!subscriptionState.isClosed()) {
	      subscriptionState.close();
	      subscriptionState.clean();
	    }
	  }
	});

	if (descriptors) { defineBuiltInAccessor(Subscription.prototype, 'closed', {
	  configurable: true,
	  get: function closed() {
	    return getSubscriptionInternalState(this).isClosed();
	  }
	}); }

	var SubscriptionObserver = function (subscriptionState) {
	  setInternalState$4(this, {
	    type: SUBSCRIPTION_OBSERVER,
	    subscriptionState: subscriptionState
	  });
	  if (!descriptors) { this.closed = false; }
	};

	SubscriptionObserver.prototype = defineBuiltIns({}, {
	  next: function next(value) {
	    var subscriptionState = getSubscriptionObserverInternalState(this).subscriptionState;
	    if (!subscriptionState.isClosed()) {
	      var observer = subscriptionState.observer;
	      try {
	        var nextMethod = getMethod(observer, 'next');
	        if (nextMethod) { functionCall(nextMethod, observer, value); }
	      } catch (error) {
	        hostReportErrors(error);
	      }
	    }
	  },
	  error: function error(value) {
	    var subscriptionState = getSubscriptionObserverInternalState(this).subscriptionState;
	    if (!subscriptionState.isClosed()) {
	      var observer = subscriptionState.observer;
	      subscriptionState.close();
	      try {
	        var errorMethod = getMethod(observer, 'error');
	        if (errorMethod) { functionCall(errorMethod, observer, value); }
	        else { hostReportErrors(value); }
	      } catch (err) {
	        hostReportErrors(err);
	      } subscriptionState.clean();
	    }
	  },
	  complete: function complete() {
	    var subscriptionState = getSubscriptionObserverInternalState(this).subscriptionState;
	    if (!subscriptionState.isClosed()) {
	      var observer = subscriptionState.observer;
	      subscriptionState.close();
	      try {
	        var completeMethod = getMethod(observer, 'complete');
	        if (completeMethod) { functionCall(completeMethod, observer); }
	      } catch (error) {
	        hostReportErrors(error);
	      } subscriptionState.clean();
	    }
	  }
	});

	if (descriptors) { defineBuiltInAccessor(SubscriptionObserver.prototype, 'closed', {
	  configurable: true,
	  get: function closed() {
	    return getSubscriptionObserverInternalState(this).subscriptionState.isClosed();
	  }
	}); }

	var $Observable = function Observable(subscriber) {
	  anInstance(this, ObservablePrototype);
	  setInternalState$4(this, {
	    type: OBSERVABLE,
	    subscriber: aCallable(subscriber)
	  });
	};

	var ObservablePrototype = $Observable.prototype;

	defineBuiltIns(ObservablePrototype, {
	  subscribe: function subscribe(observer) {
	    var length = arguments.length;
	    return new Subscription(isCallable(observer) ? {
	      next: observer,
	      error: length > 1 ? arguments[1] : undefined,
	      complete: length > 2 ? arguments[2] : undefined
	    } : isObject(observer) ? observer : {}, getObservableInternalState(this).subscriber);
	  }
	});

	defineBuiltIn(ObservablePrototype, $$OBSERVABLE$1, function () { return this; });

	_export({ global: true, constructor: true, forced: observableForced }, {
	  Observable: $Observable
	});

	setSpecies(OBSERVABLE);

	var $$OBSERVABLE = wellKnownSymbol('observable');

	// `Observable.from` method
	// https://github.com/tc39/proposal-observable
	_export({ target: 'Observable', stat: true, forced: observableForced }, {
	  from: function from(x) {
	    var C = isConstructor(this) ? this : getBuiltIn('Observable');
	    var observableMethod = getMethod(anObject(x), $$OBSERVABLE);
	    if (observableMethod) {
	      var observable = anObject(functionCall(observableMethod, x));
	      return observable.constructor === C ? observable : new C(function (observer) {
	        return observable.subscribe(observer);
	      });
	    }
	    var iterator = getIterator(x);
	    return new C(function (observer) {
	      iterate(iterator, function (it, stop) {
	        observer.next(it);
	        if (observer.closed) { return stop(); }
	      }, { IS_ITERATOR: true, INTERRUPTED: true });
	      observer.complete();
	    });
	  }
	});

	var Array$1 = getBuiltIn('Array');

	// `Observable.of` method
	// https://github.com/tc39/proposal-observable
	_export({ target: 'Observable', stat: true, forced: observableForced }, {
	  of: function of() {
	    var arguments$1 = arguments;

	    var C = isConstructor(this) ? this : getBuiltIn('Observable');
	    var length = arguments.length;
	    var items = Array$1(length);
	    var index = 0;
	    while (index < length) { items[index] = arguments$1[index++]; }
	    return new C(function (observer) {
	      for (var i = 0; i < length; i++) {
	        observer.next(items[i]);
	        if (observer.closed) { return; }
	      } observer.complete();
	    });
	  }
	});

	// TODO: Remove from `core-js@4`




	// `Promise.try` method
	// https://github.com/tc39/proposal-promise-try
	_export({ target: 'Promise', stat: true, forced: true }, {
	  'try': function (callbackfn) {
	    var promiseCapability = newPromiseCapability$1.f(this);
	    var result = perform(callbackfn);
	    (result.error ? promiseCapability.reject : promiseCapability.resolve)(result.value);
	    return promiseCapability.promise;
	  }
	});

	// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`






	var Map$2 = getBuiltIn('Map');
	var WeakMap$1 = getBuiltIn('WeakMap');
	var push$6 = functionUncurryThis([].push);

	var metadata = shared('metadata');
	var store$1 = metadata.store || (metadata.store = new WeakMap$1());

	var getOrCreateMetadataMap$1 = function (target, targetKey, create) {
	  var targetMetadata = store$1.get(target);
	  if (!targetMetadata) {
	    if (!create) { return; }
	    store$1.set(target, targetMetadata = new Map$2());
	  }
	  var keyMetadata = targetMetadata.get(targetKey);
	  if (!keyMetadata) {
	    if (!create) { return; }
	    targetMetadata.set(targetKey, keyMetadata = new Map$2());
	  } return keyMetadata;
	};

	var ordinaryHasOwnMetadata$3 = function (MetadataKey, O, P) {
	  var metadataMap = getOrCreateMetadataMap$1(O, P, false);
	  return metadataMap === undefined ? false : metadataMap.has(MetadataKey);
	};

	var ordinaryGetOwnMetadata$2 = function (MetadataKey, O, P) {
	  var metadataMap = getOrCreateMetadataMap$1(O, P, false);
	  return metadataMap === undefined ? undefined : metadataMap.get(MetadataKey);
	};

	var ordinaryDefineOwnMetadata$2 = function (MetadataKey, MetadataValue, O, P) {
	  getOrCreateMetadataMap$1(O, P, true).set(MetadataKey, MetadataValue);
	};

	var ordinaryOwnMetadataKeys$2 = function (target, targetKey) {
	  var metadataMap = getOrCreateMetadataMap$1(target, targetKey, false);
	  var keys = [];
	  if (metadataMap) { metadataMap.forEach(function (_, key) { push$6(keys, key); }); }
	  return keys;
	};

	var toMetadataKey$9 = function (it) {
	  return it === undefined || typeof it == 'symbol' ? it : String(it);
	};

	var reflectMetadata = {
	  store: store$1,
	  getMap: getOrCreateMetadataMap$1,
	  has: ordinaryHasOwnMetadata$3,
	  get: ordinaryGetOwnMetadata$2,
	  set: ordinaryDefineOwnMetadata$2,
	  keys: ordinaryOwnMetadataKeys$2,
	  toKey: toMetadataKey$9
	};

	// TODO: Remove from `core-js@4`




	var toMetadataKey$8 = reflectMetadata.toKey;
	var ordinaryDefineOwnMetadata$1 = reflectMetadata.set;

	// `Reflect.defineMetadata` method
	// https://github.com/rbuckton/reflect-metadata
	_export({ target: 'Reflect', stat: true }, {
	  defineMetadata: function defineMetadata(metadataKey, metadataValue, target /* , targetKey */) {
	    var targetKey = arguments.length < 4 ? undefined : toMetadataKey$8(arguments[3]);
	    ordinaryDefineOwnMetadata$1(metadataKey, metadataValue, anObject(target), targetKey);
	  }
	});

	var toMetadataKey$7 = reflectMetadata.toKey;
	var getOrCreateMetadataMap = reflectMetadata.getMap;
	var store = reflectMetadata.store;

	// `Reflect.deleteMetadata` method
	// https://github.com/rbuckton/reflect-metadata
	_export({ target: 'Reflect', stat: true }, {
	  deleteMetadata: function deleteMetadata(metadataKey, target /* , targetKey */) {
	    var targetKey = arguments.length < 3 ? undefined : toMetadataKey$7(arguments[2]);
	    var metadataMap = getOrCreateMetadataMap(anObject(target), targetKey, false);
	    if (metadataMap === undefined || !metadataMap['delete'](metadataKey)) { return false; }
	    if (metadataMap.size) { return true; }
	    var targetMetadata = store.get(target);
	    targetMetadata['delete'](targetKey);
	    return !!targetMetadata.size || store['delete'](target);
	  }
	});

	// TODO: Remove from `core-js@4`





	var ordinaryHasOwnMetadata$2 = reflectMetadata.has;
	var ordinaryGetOwnMetadata$1 = reflectMetadata.get;
	var toMetadataKey$6 = reflectMetadata.toKey;

	var ordinaryGetMetadata = function (MetadataKey, O, P) {
	  var hasOwn = ordinaryHasOwnMetadata$2(MetadataKey, O, P);
	  if (hasOwn) { return ordinaryGetOwnMetadata$1(MetadataKey, O, P); }
	  var parent = objectGetPrototypeOf(O);
	  return parent !== null ? ordinaryGetMetadata(MetadataKey, parent, P) : undefined;
	};

	// `Reflect.getMetadata` method
	// https://github.com/rbuckton/reflect-metadata
	_export({ target: 'Reflect', stat: true }, {
	  getMetadata: function getMetadata(metadataKey, target /* , targetKey */) {
	    var targetKey = arguments.length < 3 ? undefined : toMetadataKey$6(arguments[2]);
	    return ordinaryGetMetadata(metadataKey, anObject(target), targetKey);
	  }
	});

	// TODO: Remove from `core-js@4`







	var arrayUniqueBy$1 = functionUncurryThis(arrayUniqueBy$2);
	var concat = functionUncurryThis([].concat);
	var ordinaryOwnMetadataKeys$1 = reflectMetadata.keys;
	var toMetadataKey$5 = reflectMetadata.toKey;

	var ordinaryMetadataKeys = function (O, P) {
	  var oKeys = ordinaryOwnMetadataKeys$1(O, P);
	  var parent = objectGetPrototypeOf(O);
	  if (parent === null) { return oKeys; }
	  var pKeys = ordinaryMetadataKeys(parent, P);
	  return pKeys.length ? oKeys.length ? arrayUniqueBy$1(concat(oKeys, pKeys)) : pKeys : oKeys;
	};

	// `Reflect.getMetadataKeys` method
	// https://github.com/rbuckton/reflect-metadata
	_export({ target: 'Reflect', stat: true }, {
	  getMetadataKeys: function getMetadataKeys(target /* , targetKey */) {
	    var targetKey = arguments.length < 2 ? undefined : toMetadataKey$5(arguments[1]);
	    return ordinaryMetadataKeys(anObject(target), targetKey);
	  }
	});

	// TODO: Remove from `core-js@4`




	var ordinaryGetOwnMetadata = reflectMetadata.get;
	var toMetadataKey$4 = reflectMetadata.toKey;

	// `Reflect.getOwnMetadata` method
	// https://github.com/rbuckton/reflect-metadata
	_export({ target: 'Reflect', stat: true }, {
	  getOwnMetadata: function getOwnMetadata(metadataKey, target /* , targetKey */) {
	    var targetKey = arguments.length < 3 ? undefined : toMetadataKey$4(arguments[2]);
	    return ordinaryGetOwnMetadata(metadataKey, anObject(target), targetKey);
	  }
	});

	// TODO: Remove from `core-js@4`




	var ordinaryOwnMetadataKeys = reflectMetadata.keys;
	var toMetadataKey$3 = reflectMetadata.toKey;

	// `Reflect.getOwnMetadataKeys` method
	// https://github.com/rbuckton/reflect-metadata
	_export({ target: 'Reflect', stat: true }, {
	  getOwnMetadataKeys: function getOwnMetadataKeys(target /* , targetKey */) {
	    var targetKey = arguments.length < 2 ? undefined : toMetadataKey$3(arguments[1]);
	    return ordinaryOwnMetadataKeys(anObject(target), targetKey);
	  }
	});

	// TODO: Remove from `core-js@4`





	var ordinaryHasOwnMetadata$1 = reflectMetadata.has;
	var toMetadataKey$2 = reflectMetadata.toKey;

	var ordinaryHasMetadata = function (MetadataKey, O, P) {
	  var hasOwn = ordinaryHasOwnMetadata$1(MetadataKey, O, P);
	  if (hasOwn) { return true; }
	  var parent = objectGetPrototypeOf(O);
	  return parent !== null ? ordinaryHasMetadata(MetadataKey, parent, P) : false;
	};

	// `Reflect.hasMetadata` method
	// https://github.com/rbuckton/reflect-metadata
	_export({ target: 'Reflect', stat: true }, {
	  hasMetadata: function hasMetadata(metadataKey, target /* , targetKey */) {
	    var targetKey = arguments.length < 3 ? undefined : toMetadataKey$2(arguments[2]);
	    return ordinaryHasMetadata(metadataKey, anObject(target), targetKey);
	  }
	});

	// TODO: Remove from `core-js@4`




	var ordinaryHasOwnMetadata = reflectMetadata.has;
	var toMetadataKey$1 = reflectMetadata.toKey;

	// `Reflect.hasOwnMetadata` method
	// https://github.com/rbuckton/reflect-metadata
	_export({ target: 'Reflect', stat: true }, {
	  hasOwnMetadata: function hasOwnMetadata(metadataKey, target /* , targetKey */) {
	    var targetKey = arguments.length < 3 ? undefined : toMetadataKey$1(arguments[2]);
	    return ordinaryHasOwnMetadata(metadataKey, anObject(target), targetKey);
	  }
	});

	var toMetadataKey = reflectMetadata.toKey;
	var ordinaryDefineOwnMetadata = reflectMetadata.set;

	// `Reflect.metadata` method
	// https://github.com/rbuckton/reflect-metadata
	_export({ target: 'Reflect', stat: true }, {
	  metadata: function metadata(metadataKey, metadataValue) {
	    return function decorator(target, key) {
	      ordinaryDefineOwnMetadata(metadataKey, metadataValue, anObject(target), toMetadataKey(key));
	    };
	  }
	});

	// https://github.com/tc39/collection-methods
	var collectionAddAll = function addAll(/* ...elements */) {
	  var arguments$1 = arguments;

	  var set = anObject(this);
	  var adder = aCallable(set.add);
	  for (var k = 0, len = arguments.length; k < len; k++) {
	    functionCall(adder, set, arguments$1[k]);
	  }
	  return set;
	};

	// `Set.prototype.addAll` method
	// https://github.com/tc39/proposal-collection-methods
	_export({ target: 'Set', proto: true, real: true, forced: true }, {
	  addAll: collectionAddAll
	});

	// `Set.prototype.deleteAll` method
	// https://github.com/tc39/proposal-collection-methods
	_export({ target: 'Set', proto: true, real: true, forced: true }, {
	  deleteAll: collectionDeleteAll
	});

	// `Set.prototype.difference` method
	// https://github.com/tc39/proposal-set-methods
	_export({ target: 'Set', proto: true, real: true, forced: true }, {
	  difference: function difference(iterable) {
	    var set = anObject(this);
	    var newSet = new (speciesConstructor(set, getBuiltIn('Set')))(set);
	    var remover = aCallable(newSet['delete']);
	    iterate(iterable, function (value) {
	      functionCall(remover, newSet, value);
	    });
	    return newSet;
	  }
	});

	var getSetIterator = function (it) {
	  // eslint-disable-next-line es/no-set -- safe
	  return functionCall(Set.prototype.values, it);
	};

	// `Set.prototype.every` method
	// https://github.com/tc39/proposal-collection-methods
	_export({ target: 'Set', proto: true, real: true, forced: true }, {
	  every: function every(callbackfn /* , thisArg */) {
	    var set = anObject(this);
	    var iterator = getSetIterator(set);
	    var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    return !iterate(iterator, function (value, stop) {
	      if (!boundFunction(value, value, set)) { return stop(); }
	    }, { IS_ITERATOR: true, INTERRUPTED: true }).stopped;
	  }
	});

	// `Set.prototype.filter` method
	// https://github.com/tc39/proposal-collection-methods
	_export({ target: 'Set', proto: true, real: true, forced: true }, {
	  filter: function filter(callbackfn /* , thisArg */) {
	    var set = anObject(this);
	    var iterator = getSetIterator(set);
	    var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    var newSet = new (speciesConstructor(set, getBuiltIn('Set')))();
	    var adder = aCallable(newSet.add);
	    iterate(iterator, function (value) {
	      if (boundFunction(value, value, set)) { functionCall(adder, newSet, value); }
	    }, { IS_ITERATOR: true });
	    return newSet;
	  }
	});

	// `Set.prototype.find` method
	// https://github.com/tc39/proposal-collection-methods
	_export({ target: 'Set', proto: true, real: true, forced: true }, {
	  find: function find(callbackfn /* , thisArg */) {
	    var set = anObject(this);
	    var iterator = getSetIterator(set);
	    var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    return iterate(iterator, function (value, stop) {
	      if (boundFunction(value, value, set)) { return stop(value); }
	    }, { IS_ITERATOR: true, INTERRUPTED: true }).result;
	  }
	});

	// `Set.from` method
	// https://tc39.github.io/proposal-setmap-offrom/#sec-set.from
	_export({ target: 'Set', stat: true, forced: true }, {
	  from: collectionFrom
	});

	// `Set.prototype.intersection` method
	// https://github.com/tc39/proposal-set-methods
	_export({ target: 'Set', proto: true, real: true, forced: true }, {
	  intersection: function intersection(iterable) {
	    var set = anObject(this);
	    var newSet = new (speciesConstructor(set, getBuiltIn('Set')))();
	    var hasCheck = aCallable(set.has);
	    var adder = aCallable(newSet.add);
	    iterate(iterable, function (value) {
	      if (functionCall(hasCheck, set, value)) { functionCall(adder, newSet, value); }
	    });
	    return newSet;
	  }
	});

	// `Set.prototype.isDisjointFrom` method
	// https://tc39.github.io/proposal-set-methods/#Set.prototype.isDisjointFrom
	_export({ target: 'Set', proto: true, real: true, forced: true }, {
	  isDisjointFrom: function isDisjointFrom(iterable) {
	    var set = anObject(this);
	    var hasCheck = aCallable(set.has);
	    return !iterate(iterable, function (value, stop) {
	      if (functionCall(hasCheck, set, value) === true) { return stop(); }
	    }, { INTERRUPTED: true }).stopped;
	  }
	});

	// `Set.prototype.isSubsetOf` method
	// https://tc39.github.io/proposal-set-methods/#Set.prototype.isSubsetOf
	_export({ target: 'Set', proto: true, real: true, forced: true }, {
	  isSubsetOf: function isSubsetOf(iterable) {
	    var iterator = getIterator(this);
	    var otherSet = anObject(iterable);
	    var hasCheck = otherSet.has;
	    if (!isCallable(hasCheck)) {
	      otherSet = new (getBuiltIn('Set'))(iterable);
	      hasCheck = aCallable(otherSet.has);
	    }
	    return !iterate(iterator, function (value, stop) {
	      if (functionCall(hasCheck, otherSet, value) === false) { return stop(); }
	    }, { IS_ITERATOR: true, INTERRUPTED: true }).stopped;
	  }
	});

	// `Set.prototype.isSupersetOf` method
	// https://tc39.github.io/proposal-set-methods/#Set.prototype.isSupersetOf
	_export({ target: 'Set', proto: true, real: true, forced: true }, {
	  isSupersetOf: function isSupersetOf(iterable) {
	    var set = anObject(this);
	    var hasCheck = aCallable(set.has);
	    return !iterate(iterable, function (value, stop) {
	      if (functionCall(hasCheck, set, value) === false) { return stop(); }
	    }, { INTERRUPTED: true }).stopped;
	  }
	});

	var arrayJoin = functionUncurryThis([].join);
	var push$5 = [].push;

	// `Set.prototype.join` method
	// https://github.com/tc39/proposal-collection-methods
	_export({ target: 'Set', proto: true, real: true, forced: true }, {
	  join: function join(separator) {
	    var set = anObject(this);
	    var iterator = getSetIterator(set);
	    var sep = separator === undefined ? ',' : toString_1(separator);
	    var result = [];
	    iterate(iterator, push$5, { that: result, IS_ITERATOR: true });
	    return arrayJoin(result, sep);
	  }
	});

	// `Set.prototype.map` method
	// https://github.com/tc39/proposal-collection-methods
	_export({ target: 'Set', proto: true, real: true, forced: true }, {
	  map: function map(callbackfn /* , thisArg */) {
	    var set = anObject(this);
	    var iterator = getSetIterator(set);
	    var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    var newSet = new (speciesConstructor(set, getBuiltIn('Set')))();
	    var adder = aCallable(newSet.add);
	    iterate(iterator, function (value) {
	      functionCall(adder, newSet, boundFunction(value, value, set));
	    }, { IS_ITERATOR: true });
	    return newSet;
	  }
	});

	// `Set.of` method
	// https://tc39.github.io/proposal-setmap-offrom/#sec-set.of
	_export({ target: 'Set', stat: true, forced: true }, {
	  of: collectionOf
	});

	var $TypeError$2 = TypeError;

	// `Set.prototype.reduce` method
	// https://github.com/tc39/proposal-collection-methods
	_export({ target: 'Set', proto: true, real: true, forced: true }, {
	  reduce: function reduce(callbackfn /* , initialValue */) {
	    var set = anObject(this);
	    var iterator = getSetIterator(set);
	    var noInitial = arguments.length < 2;
	    var accumulator = noInitial ? undefined : arguments[1];
	    aCallable(callbackfn);
	    iterate(iterator, function (value) {
	      if (noInitial) {
	        noInitial = false;
	        accumulator = value;
	      } else {
	        accumulator = callbackfn(accumulator, value, value, set);
	      }
	    }, { IS_ITERATOR: true });
	    if (noInitial) { throw $TypeError$2('Reduce of empty set with no initial value'); }
	    return accumulator;
	  }
	});

	// `Set.prototype.some` method
	// https://github.com/tc39/proposal-collection-methods
	_export({ target: 'Set', proto: true, real: true, forced: true }, {
	  some: function some(callbackfn /* , thisArg */) {
	    var set = anObject(this);
	    var iterator = getSetIterator(set);
	    var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    return iterate(iterator, function (value, stop) {
	      if (boundFunction(value, value, set)) { return stop(); }
	    }, { IS_ITERATOR: true, INTERRUPTED: true }).stopped;
	  }
	});

	// `Set.prototype.symmetricDifference` method
	// https://github.com/tc39/proposal-set-methods
	_export({ target: 'Set', proto: true, real: true, forced: true }, {
	  symmetricDifference: function symmetricDifference(iterable) {
	    var set = anObject(this);
	    var newSet = new (speciesConstructor(set, getBuiltIn('Set')))(set);
	    var remover = aCallable(newSet['delete']);
	    var adder = aCallable(newSet.add);
	    iterate(iterable, function (value) {
	      functionCall(remover, newSet, value) || functionCall(adder, newSet, value);
	    });
	    return newSet;
	  }
	});

	// `Set.prototype.union` method
	// https://github.com/tc39/proposal-set-methods
	_export({ target: 'Set', proto: true, real: true, forced: true }, {
	  union: function union(iterable) {
	    var set = anObject(this);
	    var newSet = new (speciesConstructor(set, getBuiltIn('Set')))(set);
	    iterate(iterable, aCallable(newSet.add), { that: newSet });
	    return newSet;
	  }
	});

	// TODO: Remove from `core-js@4`

	var charAt$6 = stringMultibyte.charAt;




	// `String.prototype.at` method
	// https://github.com/mathiasbynens/String.prototype.at
	_export({ target: 'String', proto: true, forced: true }, {
	  at: function at(index) {
	    var S = toString_1(requireObjectCoercible(this));
	    var len = S.length;
	    var relativeIndex = toIntegerOrInfinity(index);
	    var k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
	    return (k < 0 || k >= len) ? undefined : charAt$6(S, k);
	  }
	});

	var $TypeError$1 = TypeError;
	var ArrayPrototype = Array.prototype;
	var push$4 = functionUncurryThis(ArrayPrototype.push);
	var join$4 = functionUncurryThis(ArrayPrototype.join);

	// `String.cooked` method
	// https://github.com/tc39/proposal-string-cooked
	_export({ target: 'String', stat: true, forced: true }, {
	  cooked: function cooked(template /* , ...substitutions */) {
	    var arguments$1 = arguments;

	    var cookedTemplate = toIndexedObject(template);
	    var literalSegments = lengthOfArrayLike(cookedTemplate);
	    var argumentsLength = arguments.length;
	    var elements = [];
	    var i = 0;
	    while (literalSegments > i) {
	      var nextVal = cookedTemplate[i++];
	      if (nextVal === undefined) { throw $TypeError$1('Incorrect template'); }
	      push$4(elements, toString_1(nextVal));
	      if (i === literalSegments) { return join$4(elements, ''); }
	      if (i < argumentsLength) { push$4(elements, toString_1(arguments$1[i])); }
	    }
	  }
	});

	var codeAt$1 = stringMultibyte.codeAt;
	var charAt$5 = stringMultibyte.charAt;
	var STRING_ITERATOR = 'String Iterator';
	var setInternalState$3 = internalState.set;
	var getInternalState$1 = internalState.getterFor(STRING_ITERATOR);

	// TODO: unify with String#@@iterator
	var $StringIterator = iteratorCreateConstructor(function StringIterator(string) {
	  setInternalState$3(this, {
	    type: STRING_ITERATOR,
	    string: string,
	    index: 0
	  });
	}, 'String', function next() {
	  var state = getInternalState$1(this);
	  var string = state.string;
	  var index = state.index;
	  var point;
	  if (index >= string.length) { return createIterResultObject(undefined, true); }
	  point = charAt$5(string, index);
	  state.index += point.length;
	  return createIterResultObject({ codePoint: codeAt$1(point, 0), position: index }, false);
	});

	// `String.prototype.codePoints` method
	// https://github.com/tc39/proposal-string-prototype-codepoints
	_export({ target: 'String', proto: true, forced: true }, {
	  codePoints: function codePoints() {
	    return new $StringIterator(toString_1(requireObjectCoercible(this)));
	  }
	});

	var charCodeAt$3 = functionUncurryThis(''.charCodeAt);

	// `String.prototype.isWellFormed` method
	// https://github.com/tc39/proposal-is-usv-string
	_export({ target: 'String', proto: true, forced: true }, {
	  isWellFormed: function isWellFormed() {
	    var S = toString_1(requireObjectCoercible(this));
	    var length = S.length;
	    for (var i = 0; i < length; i++) {
	      var charCode = charCodeAt$3(S, i);
	      // single UTF-16 code unit
	      if ((charCode & 0xF800) != 0xD800) { continue; }
	      // unpaired surrogate
	      if (charCode >= 0xDC00 || ++i >= length || (charCodeAt$3(S, i) & 0xFC00) != 0xDC00) { return false; }
	    } return true;
	  }
	});

	var $Array = Array;
	var charAt$4 = functionUncurryThis(''.charAt);
	var charCodeAt$2 = functionUncurryThis(''.charCodeAt);
	var join$3 = functionUncurryThis([].join);
	var REPLACEMENT_CHARACTER = '\uFFFD';

	// `String.prototype.toWellFormed` method
	// https://github.com/tc39/proposal-is-usv-string
	_export({ target: 'String', proto: true, forced: true }, {
	  toWellFormed: function toWellFormed() {
	    var S = toString_1(requireObjectCoercible(this));
	    var length = S.length;
	    var result = $Array(length);
	    for (var i = 0; i < length; i++) {
	      var charCode = charCodeAt$2(S, i);
	      // single UTF-16 code unit
	      if ((charCode & 0xF800) != 0xD800) { result[i] = charAt$4(S, i); }
	      // unpaired surrogate
	      else if (charCode >= 0xDC00 || i + 1 >= length || (charCodeAt$2(S, i + 1) & 0xFC00) != 0xDC00) { result[i] = REPLACEMENT_CHARACTER; }
	      // surrogate pair
	      else {
	        result[i] = charAt$4(S, i);
	        result[++i] = charAt$4(S, i);
	      }
	    } return join$3(result, '');
	  }
	});

	// `Symbol.asyncDispose` well-known symbol
	// https://github.com/tc39/proposal-using-statement
	wellKnownSymbolDefine('asyncDispose');

	// `Symbol.dispose` well-known symbol
	// https://github.com/tc39/proposal-using-statement
	wellKnownSymbolDefine('dispose');

	// `Symbol.matcher` well-known symbol
	// https://github.com/tc39/proposal-pattern-matching
	wellKnownSymbolDefine('matcher');

	// TODO: Remove from `core-js@4`


	// `Symbol.metadata` well-known symbol
	// https://github.com/tc39/proposal-decorators
	wellKnownSymbolDefine('metadata');

	// `Symbol.metadataKey` well-known symbol
	// https://github.com/tc39/proposal-decorator-metadata
	wellKnownSymbolDefine('metadataKey');

	// `Symbol.observable` well-known symbol
	// https://github.com/tc39/proposal-observable
	wellKnownSymbolDefine('observable');

	// TODO: remove from `core-js@4`


	// `Symbol.patternMatch` well-known symbol
	// https://github.com/tc39/proposal-pattern-matching
	wellKnownSymbolDefine('patternMatch');

	// TODO: remove from `core-js@4`


	wellKnownSymbolDefine('replaceAll');

	// TODO: Remove from `core-js@4`






	var aTypedArrayConstructor = arrayBufferViewCore.aTypedArrayConstructor;
	var exportTypedArrayStaticMethod = arrayBufferViewCore.exportTypedArrayStaticMethod;

	// `%TypedArray%.fromAsync` method
	// https://github.com/tc39/proposal-array-from-async
	exportTypedArrayStaticMethod('fromAsync', function fromAsync(asyncItems /* , mapfn = undefined, thisArg = undefined */) {
	  var C = this;
	  var argumentsLength = arguments.length;
	  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
	  var thisArg = argumentsLength > 2 ? arguments[2] : undefined;
	  return new (getBuiltIn('Promise'))(function (resolve) {
	    aConstructor(C);
	    resolve(arrayFromAsync(asyncItems, mapfn, thisArg));
	  }).then(function (list) {
	    return arrayFromConstructorAndList(aTypedArrayConstructor(C), list);
	  });
	}, true);

	// TODO: Remove from `core-js@4`

	var $filterReject$1 = arrayIteration.filterReject;


	var aTypedArray$7 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$7 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.filterOut` method
	// https://github.com/tc39/proposal-array-filtering
	exportTypedArrayMethod$7('filterOut', function filterOut(callbackfn /* , thisArg */) {
	  var list = $filterReject$1(aTypedArray$7(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  return typedArrayFromSpeciesAndList(this, list);
	}, true);

	var $filterReject = arrayIteration.filterReject;


	var aTypedArray$6 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$6 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.filterReject` method
	// https://github.com/tc39/proposal-array-filtering
	exportTypedArrayMethod$6('filterReject', function filterReject(callbackfn /* , thisArg */) {
	  var list = $filterReject(aTypedArray$6(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  return typedArrayFromSpeciesAndList(this, list);
	}, true);

	// TODO: Remove from `core-js@4`




	var aTypedArray$5 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$5 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.groupBy` method
	// https://github.com/tc39/proposal-array-grouping
	exportTypedArrayMethod$5('groupBy', function groupBy(callbackfn /* , thisArg */) {
	  var thisArg = arguments.length > 1 ? arguments[1] : undefined;
	  return arrayGroup(aTypedArray$5(this), callbackfn, thisArg, typedArraySpeciesConstructor);
	}, true);

	var aTypedArray$4 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$4 = arrayBufferViewCore.exportTypedArrayMethod;
	var getTypedArrayConstructor$3 = arrayBufferViewCore.getTypedArrayConstructor;

	// `%TypedArray%.prototype.toReversed` method
	// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toReversed
	exportTypedArrayMethod$4('toReversed', function toReversed() {
	  return arrayToReversed(aTypedArray$4(this), getTypedArrayConstructor$3(this));
	});

	var aTypedArray$3 = arrayBufferViewCore.aTypedArray;
	var getTypedArrayConstructor$2 = arrayBufferViewCore.getTypedArrayConstructor;
	var exportTypedArrayMethod$3 = arrayBufferViewCore.exportTypedArrayMethod;
	var sort = functionUncurryThis(arrayBufferViewCore.TypedArrayPrototype.sort);

	// `%TypedArray%.prototype.toSorted` method
	// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toSorted
	exportTypedArrayMethod$3('toSorted', function toSorted(compareFn) {
	  if (compareFn !== undefined) { aCallable(compareFn); }
	  var O = aTypedArray$3(this);
	  var A = arrayFromConstructorAndList(getTypedArrayConstructor$2(O), O);
	  return sort(A, compareFn);
	});

	// TODO: Remove from `core-js@4`








	var aTypedArray$2 = arrayBufferViewCore.aTypedArray;
	var getTypedArrayConstructor$1 = arrayBufferViewCore.getTypedArrayConstructor;
	var exportTypedArrayMethod$2 = arrayBufferViewCore.exportTypedArrayMethod;
	var max = Math.max;
	var min = Math.min;

	// some early implementations, like WebKit, does not follow the final semantic
	var PROPER_ORDER$1 = !fails(function () {
	  // eslint-disable-next-line es/no-typed-arrays -- required for testing
	  var array = new Int8Array([1]);

	  var spliced = array.toSpliced(1, 0, {
	    valueOf: function () {
	      array[0] = 2;
	      return 3;
	    }
	  });

	  return spliced[0] !== 2 || spliced[1] !== 3;
	});

	// `%TypedArray%.prototype.toSpliced` method
	// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toSpliced
	exportTypedArrayMethod$2('toSpliced', function toSpliced(start, deleteCount /* , ...items */) {
	  var arguments$1 = arguments;

	  var O = aTypedArray$2(this);
	  var C = getTypedArrayConstructor$1(O);
	  var len = lengthOfArrayLike(O);
	  var actualStart = toAbsoluteIndex(start, len);
	  var argumentsLength = arguments.length;
	  var k = 0;
	  var insertCount, actualDeleteCount, thisIsBigIntArray, convertedItems, value, newLen, A;
	  if (argumentsLength === 0) {
	    insertCount = actualDeleteCount = 0;
	  } else if (argumentsLength === 1) {
	    insertCount = 0;
	    actualDeleteCount = len - actualStart;
	  } else {
	    actualDeleteCount = min(max(toIntegerOrInfinity(deleteCount), 0), len - actualStart);
	    insertCount = argumentsLength - 2;
	    if (insertCount) {
	      convertedItems = new C(insertCount);
	      thisIsBigIntArray = isBigIntArray(convertedItems);
	      for (var i = 2; i < argumentsLength; i++) {
	        value = arguments$1[i];
	        // FF30- typed arrays doesn't properly convert objects to typed array values
	        convertedItems[i - 2] = thisIsBigIntArray ? toBigInt(value) : +value;
	      }
	    }
	  }
	  newLen = len + insertCount - actualDeleteCount;
	  A = new C(newLen);

	  for (; k < actualStart; k++) { A[k] = O[k]; }
	  for (; k < actualStart + insertCount; k++) { A[k] = convertedItems[k - actualStart]; }
	  for (; k < newLen; k++) { A[k] = O[k + actualDeleteCount - insertCount]; }

	  return A;
	}, !PROPER_ORDER$1);

	var aTypedArray$1 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$1 = arrayBufferViewCore.exportTypedArrayMethod;
	var arrayUniqueBy = functionUncurryThis(arrayUniqueBy$2);

	// `%TypedArray%.prototype.uniqueBy` method
	// https://github.com/tc39/proposal-array-unique
	exportTypedArrayMethod$1('uniqueBy', function uniqueBy(resolver) {
	  return typedArrayFromSpeciesAndList(this, arrayUniqueBy(aTypedArray$1(this), resolver));
	}, true);

	var aTypedArray = arrayBufferViewCore.aTypedArray;
	var getTypedArrayConstructor = arrayBufferViewCore.getTypedArrayConstructor;
	var exportTypedArrayMethod = arrayBufferViewCore.exportTypedArrayMethod;

	var PROPER_ORDER = !!function () {
	  try {
	    // eslint-disable-next-line no-throw-literal, es/no-typed-arrays -- required for testing
	    new Int8Array(1)['with'](2, { valueOf: function () { throw 8; } });
	  } catch (error) {
	    // some early implementations, like WebKit, does not follow the final semantic
	    // https://github.com/tc39/proposal-change-array-by-copy/pull/86
	    return error === 8;
	  }
	}();

	// `%TypedArray%.prototype.with` method
	// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.with
	exportTypedArrayMethod('with', { 'with': function (index, value) {
	  var O = aTypedArray(this);
	  var relativeIndex = toIntegerOrInfinity(index);
	  var actualValue = isBigIntArray(O) ? toBigInt(value) : +value;
	  return arrayWith(O, getTypedArrayConstructor(O), relativeIndex, actualValue);
	} }['with'], !PROPER_ORDER);

	// `WeakMap.prototype.deleteAll` method
	// https://github.com/tc39/proposal-collection-methods
	_export({ target: 'WeakMap', proto: true, real: true, forced: true }, {
	  deleteAll: collectionDeleteAll
	});

	// `WeakMap.from` method
	// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.from
	_export({ target: 'WeakMap', stat: true, forced: true }, {
	  from: collectionFrom
	});

	// `WeakMap.of` method
	// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.of
	_export({ target: 'WeakMap', stat: true, forced: true }, {
	  of: collectionOf
	});

	// `WeakMap.prototype.emplace` method
	// https://github.com/tc39/proposal-upsert
	_export({ target: 'WeakMap', proto: true, real: true, forced: true }, {
	  emplace: mapEmplace
	});

	// TODO: remove from `core-js@4`



	// `WeakMap.prototype.upsert` method (replaced by `WeakMap.prototype.emplace`)
	// https://github.com/tc39/proposal-upsert
	_export({ target: 'WeakMap', proto: true, real: true, forced: true }, {
	  upsert: mapUpsert
	});

	// `WeakSet.prototype.addAll` method
	// https://github.com/tc39/proposal-collection-methods
	_export({ target: 'WeakSet', proto: true, real: true, forced: true }, {
	  addAll: collectionAddAll
	});

	// `WeakSet.prototype.deleteAll` method
	// https://github.com/tc39/proposal-collection-methods
	_export({ target: 'WeakSet', proto: true, real: true, forced: true }, {
	  deleteAll: collectionDeleteAll
	});

	// `WeakSet.from` method
	// https://tc39.github.io/proposal-setmap-offrom/#sec-weakset.from
	_export({ target: 'WeakSet', stat: true, forced: true }, {
	  from: collectionFrom
	});

	// `WeakSet.of` method
	// https://tc39.github.io/proposal-setmap-offrom/#sec-weakset.of
	_export({ target: 'WeakSet', stat: true, forced: true }, {
	  of: collectionOf
	});

	var itoc$1 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	var ctoi$1 = {};

	for (var index = 0; index < 66; index++) { ctoi$1[itoc$1.charAt(index)] = index; }

	var base64Map = {
	  itoc: itoc$1,
	  ctoi: ctoi$1
	};

	var ctoi = base64Map.ctoi;

	var disallowed = /[^\d+/a-z]/i;
	var whitespaces = /[\t\n\f\r ]+/g;
	var finalEq = /[=]+$/;

	var $atob = getBuiltIn('atob');
	var fromCharCode$1 = String.fromCharCode;
	var charAt$3 = functionUncurryThis(''.charAt);
	var replace$3 = functionUncurryThis(''.replace);
	var exec$2 = functionUncurryThis(disallowed.exec);

	var NO_SPACES_IGNORE = fails(function () {
	  return $atob(' ') !== '';
	});

	var NO_ENCODING_CHECK = !fails(function () {
	  $atob('a');
	});

	var NO_ARG_RECEIVING_CHECK$1 = !NO_SPACES_IGNORE && !NO_ENCODING_CHECK && !fails(function () {
	  $atob();
	});

	var WRONG_ARITY$1 = !NO_SPACES_IGNORE && !NO_ENCODING_CHECK && $atob.length !== 1;

	// `atob` method
	// https://html.spec.whatwg.org/multipage/webappapis.html#dom-atob
	_export({ global: true, enumerable: true, forced: NO_SPACES_IGNORE || NO_ENCODING_CHECK || NO_ARG_RECEIVING_CHECK$1 || WRONG_ARITY$1 }, {
	  atob: function atob(data) {
	    validateArgumentsLength(arguments.length, 1);
	    if (NO_ARG_RECEIVING_CHECK$1 || WRONG_ARITY$1) { return $atob(data); }
	    var string = replace$3(toString_1(data), whitespaces, '');
	    var output = '';
	    var position = 0;
	    var bc = 0;
	    var chr, bs;
	    if (string.length % 4 == 0) {
	      string = replace$3(string, finalEq, '');
	    }
	    if (string.length % 4 == 1 || exec$2(disallowed, string)) {
	      throw new (getBuiltIn('DOMException'))('The string is not correctly encoded', 'InvalidCharacterError');
	    }
	    while (chr = charAt$3(string, position++)) {
	      if (hasOwnProperty_1(ctoi, chr)) {
	        bs = bc % 4 ? bs * 64 + ctoi[chr] : ctoi[chr];
	        if (bc++ % 4) { output += fromCharCode$1(255 & bs >> (-2 * bc & 6)); }
	      }
	    } return output;
	  }
	});

	var itoc = base64Map.itoc;

	var $btoa = getBuiltIn('btoa');
	var charAt$2 = functionUncurryThis(''.charAt);
	var charCodeAt$1 = functionUncurryThis(''.charCodeAt);

	var NO_ARG_RECEIVING_CHECK = !!$btoa && !fails(function () {
	  $btoa();
	});

	var WRONG_ARG_CONVERSION = !!$btoa && fails(function () {
	  return $btoa(null) !== 'bnVsbA==';
	});

	var WRONG_ARITY = !!$btoa && $btoa.length !== 1;

	// `btoa` method
	// https://html.spec.whatwg.org/multipage/webappapis.html#dom-btoa
	_export({ global: true, enumerable: true, forced: NO_ARG_RECEIVING_CHECK || WRONG_ARG_CONVERSION || WRONG_ARITY }, {
	  btoa: function btoa(data) {
	    validateArgumentsLength(arguments.length, 1);
	    if (NO_ARG_RECEIVING_CHECK || WRONG_ARG_CONVERSION || WRONG_ARITY) { return $btoa(toString_1(data)); }
	    var string = toString_1(data);
	    var output = '';
	    var position = 0;
	    var map = itoc;
	    var block, charCode;
	    while (charAt$2(string, position) || (map = '=', position % 1)) {
	      charCode = charCodeAt$1(string, position += 3 / 4);
	      if (charCode > 0xFF) {
	        throw new (getBuiltIn('DOMException'))('The string contains characters outside of the Latin1 range', 'InvalidCharacterError');
	      }
	      block = block << 8 | charCode;
	      output += charAt$2(map, 63 & block >> 8 - position % 1 * 8);
	    } return output;
	  }
	});

	// iterable DOM collections
	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
	var domIterables = {
	  CSSRuleList: 0,
	  CSSStyleDeclaration: 0,
	  CSSValueList: 0,
	  ClientRectList: 0,
	  DOMRectList: 0,
	  DOMStringList: 0,
	  DOMTokenList: 1,
	  DataTransferItemList: 0,
	  FileList: 0,
	  HTMLAllCollection: 0,
	  HTMLCollection: 0,
	  HTMLFormElement: 0,
	  HTMLSelectElement: 0,
	  MediaList: 0,
	  MimeTypeArray: 0,
	  NamedNodeMap: 0,
	  NodeList: 1,
	  PaintRequestList: 0,
	  Plugin: 0,
	  PluginArray: 0,
	  SVGLengthList: 0,
	  SVGNumberList: 0,
	  SVGPathSegList: 0,
	  SVGPointList: 0,
	  SVGStringList: 0,
	  SVGTransformList: 0,
	  SourceBufferList: 0,
	  StyleSheetList: 0,
	  TextTrackCueList: 0,
	  TextTrackList: 0,
	  TouchList: 0
	};

	// in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`


	var classList = documentCreateElement('span').classList;
	var DOMTokenListPrototype = classList && classList.constructor && classList.constructor.prototype;

	var domTokenListPrototype = DOMTokenListPrototype === Object.prototype ? undefined : DOMTokenListPrototype;

	var handlePrototype$1 = function (CollectionPrototype) {
	  // some Chrome versions have non-configurable methods on DOMTokenList
	  if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) { try {
	    createNonEnumerableProperty(CollectionPrototype, 'forEach', arrayForEach);
	  } catch (error) {
	    CollectionPrototype.forEach = arrayForEach;
	  } }
	};

	for (var COLLECTION_NAME$1 in domIterables) {
	  if (domIterables[COLLECTION_NAME$1]) {
	    handlePrototype$1(global_1[COLLECTION_NAME$1] && global_1[COLLECTION_NAME$1].prototype);
	  }
	}

	handlePrototype$1(domTokenListPrototype);

	var ITERATOR$2 = wellKnownSymbol('iterator');
	var TO_STRING_TAG = wellKnownSymbol('toStringTag');
	var ArrayValues = es_array_iterator.values;

	var handlePrototype = function (CollectionPrototype, COLLECTION_NAME) {
	  if (CollectionPrototype) {
	    // some Chrome versions have non-configurable methods on DOMTokenList
	    if (CollectionPrototype[ITERATOR$2] !== ArrayValues) { try {
	      createNonEnumerableProperty(CollectionPrototype, ITERATOR$2, ArrayValues);
	    } catch (error) {
	      CollectionPrototype[ITERATOR$2] = ArrayValues;
	    } }
	    if (!CollectionPrototype[TO_STRING_TAG]) {
	      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
	    }
	    if (domIterables[COLLECTION_NAME]) { for (var METHOD_NAME in es_array_iterator) {
	      // some Chrome versions have non-configurable methods on DOMTokenList
	      if (CollectionPrototype[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) { try {
	        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, es_array_iterator[METHOD_NAME]);
	      } catch (error$1) {
	        CollectionPrototype[METHOD_NAME] = es_array_iterator[METHOD_NAME];
	      } }
	    } }
	  }
	};

	for (var COLLECTION_NAME in domIterables) {
	  handlePrototype(global_1[COLLECTION_NAME] && global_1[COLLECTION_NAME].prototype, COLLECTION_NAME);
	}

	handlePrototype(domTokenListPrototype, 'DOMTokenList');

	var tryNodeRequire = function (name) {
	  try {
	    // eslint-disable-next-line no-new-func -- safe
	    if (engineIsNode) { return Function('return require("' + name + '")')(); }
	  } catch (error) { /* empty */ }
	};

	var domExceptionConstants = {
	  IndexSizeError: { s: 'INDEX_SIZE_ERR', c: 1, m: 1 },
	  DOMStringSizeError: { s: 'DOMSTRING_SIZE_ERR', c: 2, m: 0 },
	  HierarchyRequestError: { s: 'HIERARCHY_REQUEST_ERR', c: 3, m: 1 },
	  WrongDocumentError: { s: 'WRONG_DOCUMENT_ERR', c: 4, m: 1 },
	  InvalidCharacterError: { s: 'INVALID_CHARACTER_ERR', c: 5, m: 1 },
	  NoDataAllowedError: { s: 'NO_DATA_ALLOWED_ERR', c: 6, m: 0 },
	  NoModificationAllowedError: { s: 'NO_MODIFICATION_ALLOWED_ERR', c: 7, m: 1 },
	  NotFoundError: { s: 'NOT_FOUND_ERR', c: 8, m: 1 },
	  NotSupportedError: { s: 'NOT_SUPPORTED_ERR', c: 9, m: 1 },
	  InUseAttributeError: { s: 'INUSE_ATTRIBUTE_ERR', c: 10, m: 1 },
	  InvalidStateError: { s: 'INVALID_STATE_ERR', c: 11, m: 1 },
	  SyntaxError: { s: 'SYNTAX_ERR', c: 12, m: 1 },
	  InvalidModificationError: { s: 'INVALID_MODIFICATION_ERR', c: 13, m: 1 },
	  NamespaceError: { s: 'NAMESPACE_ERR', c: 14, m: 1 },
	  InvalidAccessError: { s: 'INVALID_ACCESS_ERR', c: 15, m: 1 },
	  ValidationError: { s: 'VALIDATION_ERR', c: 16, m: 0 },
	  TypeMismatchError: { s: 'TYPE_MISMATCH_ERR', c: 17, m: 1 },
	  SecurityError: { s: 'SECURITY_ERR', c: 18, m: 1 },
	  NetworkError: { s: 'NETWORK_ERR', c: 19, m: 1 },
	  AbortError: { s: 'ABORT_ERR', c: 20, m: 1 },
	  URLMismatchError: { s: 'URL_MISMATCH_ERR', c: 21, m: 1 },
	  QuotaExceededError: { s: 'QUOTA_EXCEEDED_ERR', c: 22, m: 1 },
	  TimeoutError: { s: 'TIMEOUT_ERR', c: 23, m: 1 },
	  InvalidNodeTypeError: { s: 'INVALID_NODE_TYPE_ERR', c: 24, m: 1 },
	  DataCloneError: { s: 'DATA_CLONE_ERR', c: 25, m: 1 }
	};

	var defineProperty$2 = objectDefineProperty.f;













	var DOM_EXCEPTION$2 = 'DOMException';
	var DATA_CLONE_ERR = 'DATA_CLONE_ERR';
	var Error$3 = getBuiltIn('Error');
	// NodeJS < 17.0 does not expose `DOMException` to global
	var NativeDOMException$1 = getBuiltIn(DOM_EXCEPTION$2) || (function () {
	  try {
	    // NodeJS < 15.0 does not expose `MessageChannel` to global
	    var MessageChannel = getBuiltIn('MessageChannel') || tryNodeRequire('worker_threads').MessageChannel;
	    // eslint-disable-next-line es/no-weak-map, unicorn/require-post-message-target-origin -- safe
	    new MessageChannel().port1.postMessage(new WeakMap());
	  } catch (error) {
	    if (error.name == DATA_CLONE_ERR && error.code == 25) { return error.constructor; }
	  }
	})();
	var NativeDOMExceptionPrototype = NativeDOMException$1 && NativeDOMException$1.prototype;
	var ErrorPrototype = Error$3.prototype;
	var setInternalState$2 = internalState.set;
	var getInternalState = internalState.getterFor(DOM_EXCEPTION$2);
	var HAS_STACK = 'stack' in Error$3(DOM_EXCEPTION$2);

	var codeFor = function (name) {
	  return hasOwnProperty_1(domExceptionConstants, name) && domExceptionConstants[name].m ? domExceptionConstants[name].c : 0;
	};

	var $DOMException$1 = function DOMException() {
	  anInstance(this, DOMExceptionPrototype$1);
	  var argumentsLength = arguments.length;
	  var message = normalizeStringArgument(argumentsLength < 1 ? undefined : arguments[0]);
	  var name = normalizeStringArgument(argumentsLength < 2 ? undefined : arguments[1], 'Error');
	  var code = codeFor(name);
	  setInternalState$2(this, {
	    type: DOM_EXCEPTION$2,
	    name: name,
	    message: message,
	    code: code
	  });
	  if (!descriptors) {
	    this.name = name;
	    this.message = message;
	    this.code = code;
	  }
	  if (HAS_STACK) {
	    var error = Error$3(message);
	    error.name = DOM_EXCEPTION$2;
	    defineProperty$2(this, 'stack', createPropertyDescriptor(1, errorStackClear(error.stack, 1)));
	  }
	};

	var DOMExceptionPrototype$1 = $DOMException$1.prototype = objectCreate(ErrorPrototype);

	var createGetterDescriptor = function (get) {
	  return { enumerable: true, configurable: true, get: get };
	};

	var getterFor = function (key) {
	  return createGetterDescriptor(function () {
	    return getInternalState(this)[key];
	  });
	};

	if (descriptors) {
	  defineBuiltInAccessor(DOMExceptionPrototype$1, 'code', getterFor('code'));
	  defineBuiltInAccessor(DOMExceptionPrototype$1, 'message', getterFor('message'));
	  defineBuiltInAccessor(DOMExceptionPrototype$1, 'name', getterFor('name'));
	}

	defineProperty$2(DOMExceptionPrototype$1, 'constructor', createPropertyDescriptor(1, $DOMException$1));

	// FF36- DOMException is a function, but can't be constructed
	var INCORRECT_CONSTRUCTOR = fails(function () {
	  return !(new NativeDOMException$1() instanceof Error$3);
	});

	// Safari 10.1 / Chrome 32- / IE8- DOMException.prototype.toString bugs
	var INCORRECT_TO_STRING = INCORRECT_CONSTRUCTOR || fails(function () {
	  return ErrorPrototype.toString !== errorToString || String(new NativeDOMException$1(1, 2)) !== '2: 1';
	});

	// Deno 1.6.3- DOMException.prototype.code just missed
	var INCORRECT_CODE = INCORRECT_CONSTRUCTOR || fails(function () {
	  return new NativeDOMException$1(1, 'DataCloneError').code !== 25;
	});

	// Deno 1.6.3- DOMException constants just missed
	INCORRECT_CONSTRUCTOR
	  || NativeDOMException$1[DATA_CLONE_ERR] !== 25
	  || NativeDOMExceptionPrototype[DATA_CLONE_ERR] !== 25;

	var FORCED_CONSTRUCTOR$1 = INCORRECT_CONSTRUCTOR;

	// `DOMException` constructor
	// https://webidl.spec.whatwg.org/#idl-DOMException
	_export({ global: true, constructor: true, forced: FORCED_CONSTRUCTOR$1 }, {
	  DOMException: FORCED_CONSTRUCTOR$1 ? $DOMException$1 : NativeDOMException$1
	});

	var PolyfilledDOMException$1 = getBuiltIn(DOM_EXCEPTION$2);
	var PolyfilledDOMExceptionPrototype$1 = PolyfilledDOMException$1.prototype;

	if (INCORRECT_TO_STRING && (NativeDOMException$1 === PolyfilledDOMException$1)) {
	  defineBuiltIn(PolyfilledDOMExceptionPrototype$1, 'toString', errorToString);
	}

	if (INCORRECT_CODE && descriptors && NativeDOMException$1 === PolyfilledDOMException$1) {
	  defineBuiltInAccessor(PolyfilledDOMExceptionPrototype$1, 'code', createGetterDescriptor(function () {
	    return codeFor(anObject(this).name);
	  }));
	}

	for (var key$1 in domExceptionConstants) { if (hasOwnProperty_1(domExceptionConstants, key$1)) {
	  var constant$1 = domExceptionConstants[key$1];
	  var constantName$1 = constant$1.s;
	  var descriptor$2 = createPropertyDescriptor(6, constant$1.c);
	  if (!hasOwnProperty_1(PolyfilledDOMException$1, constantName$1)) {
	    defineProperty$2(PolyfilledDOMException$1, constantName$1, descriptor$2);
	  }
	  if (!hasOwnProperty_1(PolyfilledDOMExceptionPrototype$1, constantName$1)) {
	    defineProperty$2(PolyfilledDOMExceptionPrototype$1, constantName$1, descriptor$2);
	  }
	} }

	var defineProperty$1 = objectDefineProperty.f;









	var DOM_EXCEPTION$1 = 'DOMException';
	var Error$2 = getBuiltIn('Error');
	var NativeDOMException = getBuiltIn(DOM_EXCEPTION$1);

	var $DOMException = function DOMException() {
	  anInstance(this, DOMExceptionPrototype);
	  var argumentsLength = arguments.length;
	  var message = normalizeStringArgument(argumentsLength < 1 ? undefined : arguments[0]);
	  var name = normalizeStringArgument(argumentsLength < 2 ? undefined : arguments[1], 'Error');
	  var that = new NativeDOMException(message, name);
	  var error = Error$2(message);
	  error.name = DOM_EXCEPTION$1;
	  defineProperty$1(that, 'stack', createPropertyDescriptor(1, errorStackClear(error.stack, 1)));
	  inheritIfRequired(that, this, $DOMException);
	  return that;
	};

	var DOMExceptionPrototype = $DOMException.prototype = NativeDOMException.prototype;

	var ERROR_HAS_STACK = 'stack' in Error$2(DOM_EXCEPTION$1);
	var DOM_EXCEPTION_HAS_STACK = 'stack' in new NativeDOMException(1, 2);

	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var descriptor$1 = NativeDOMException && descriptors && Object.getOwnPropertyDescriptor(global_1, DOM_EXCEPTION$1);

	// Bun ~ 0.1.1 DOMException have incorrect descriptor and we can't redefine it
	// https://github.com/Jarred-Sumner/bun/issues/399
	var BUGGY_DESCRIPTOR = !!descriptor$1 && !(descriptor$1.writable && descriptor$1.configurable);

	var FORCED_CONSTRUCTOR = ERROR_HAS_STACK && !BUGGY_DESCRIPTOR && !DOM_EXCEPTION_HAS_STACK;

	// `DOMException` constructor patch for `.stack` where it's required
	// https://webidl.spec.whatwg.org/#es-DOMException-specialness
	_export({ global: true, constructor: true, forced: FORCED_CONSTRUCTOR }, { // TODO: fix export logic
	  DOMException: FORCED_CONSTRUCTOR ? $DOMException : NativeDOMException
	});

	var PolyfilledDOMException = getBuiltIn(DOM_EXCEPTION$1);
	var PolyfilledDOMExceptionPrototype = PolyfilledDOMException.prototype;

	if (PolyfilledDOMExceptionPrototype.constructor !== PolyfilledDOMException) {
	  {
	    defineProperty$1(PolyfilledDOMExceptionPrototype, 'constructor', createPropertyDescriptor(1, PolyfilledDOMException));
	  }

	  for (var key in domExceptionConstants) { if (hasOwnProperty_1(domExceptionConstants, key)) {
	    var constant = domExceptionConstants[key];
	    var constantName = constant.s;
	    if (!hasOwnProperty_1(PolyfilledDOMException, constantName)) {
	      defineProperty$1(PolyfilledDOMException, constantName, createPropertyDescriptor(6, constant.c));
	    }
	  } }
	}

	var DOM_EXCEPTION = 'DOMException';

	setToStringTag(getBuiltIn(DOM_EXCEPTION), DOM_EXCEPTION);

	var clearImmediate = task$1.clear;

	// `clearImmediate` method
	// http://w3c.github.io/setImmediate/#si-clearImmediate
	_export({ global: true, bind: true, enumerable: true, forced: global_1.clearImmediate !== clearImmediate }, {
	  clearImmediate: clearImmediate
	});

	var setImmediate = task$1.set;

	// `setImmediate` method
	// http://w3c.github.io/setImmediate/#si-setImmediate
	_export({ global: true, bind: true, enumerable: true, forced: global_1.setImmediate !== setImmediate }, {
	  setImmediate: setImmediate
	});

	var process$1 = global_1.process;

	// `queueMicrotask` method
	// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-queuemicrotask
	_export({ global: true, enumerable: true, dontCallGetSet: true }, {
	  queueMicrotask: function queueMicrotask(fn) {
	    validateArgumentsLength(arguments.length, 1);
	    aCallable(fn);
	    var domain = engineIsNode && process$1.domain;
	    microtask(domain ? domain.bind(fn) : fn);
	  }
	});

	var $TypeError = TypeError;
	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var defineProperty = Object.defineProperty;
	var INCORRECT_VALUE = global_1.self !== global_1;

	// `self` getter
	// https://html.spec.whatwg.org/multipage/window-object.html#dom-self
	try {
	  if (descriptors) {
	    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	    var descriptor = Object.getOwnPropertyDescriptor(global_1, 'self');
	    // some engines have `self`, but with incorrect descriptor
	    // https://github.com/denoland/deno/issues/15765
	    if (INCORRECT_VALUE || !descriptor || !descriptor.get || !descriptor.enumerable) {
	      defineBuiltInAccessor(global_1, 'self', {
	        get: function self() {
	          return global_1;
	        },
	        set: function self(value) {
	          if (this !== global_1) { throw $TypeError('Illegal invocation'); }
	          defineProperty(global_1, 'self', {
	            value: value,
	            writable: true,
	            configurable: true,
	            enumerable: true
	          });
	        },
	        configurable: true,
	        enumerable: true
	      });
	    }
	  } else { _export({ global: true, simple: true, forced: INCORRECT_VALUE }, {
	    self: global_1
	  }); }
	} catch (error) { /* empty */ }

	var Object$1 = global_1.Object;
	var Date$1 = global_1.Date;
	var Error$1 = global_1.Error;
	var EvalError = global_1.EvalError;
	var RangeError$1 = global_1.RangeError;
	var ReferenceError = global_1.ReferenceError;
	var SyntaxError$1 = global_1.SyntaxError;
	var TypeError$3 = global_1.TypeError;
	var URIError = global_1.URIError;
	var PerformanceMark = global_1.PerformanceMark;
	var WebAssembly = global_1.WebAssembly;
	var CompileError = WebAssembly && WebAssembly.CompileError || Error$1;
	var LinkError = WebAssembly && WebAssembly.LinkError || Error$1;
	var RuntimeError = WebAssembly && WebAssembly.RuntimeError || Error$1;
	var DOMException = getBuiltIn('DOMException');
	var Set$1 = getBuiltIn('Set');
	var Map$1 = getBuiltIn('Map');
	var MapPrototype = Map$1.prototype;
	var mapHas = functionUncurryThis(MapPrototype.has);
	var mapGet = functionUncurryThis(MapPrototype.get);
	var mapSet = functionUncurryThis(MapPrototype.set);
	var setAdd = functionUncurryThis(Set$1.prototype.add);
	var objectKeys = getBuiltIn('Object', 'keys');
	var push$3 = functionUncurryThis([].push);
	var thisBooleanValue = functionUncurryThis(true.valueOf);
	var thisNumberValue = functionUncurryThis(1.0.valueOf);
	var thisStringValue = functionUncurryThis(''.valueOf);
	var thisTimeValue = functionUncurryThis(Date$1.prototype.getTime);
	var PERFORMANCE_MARK = uid('structuredClone');
	var DATA_CLONE_ERROR = 'DataCloneError';
	var TRANSFERRING = 'Transferring';

	var checkBasicSemantic = function (structuredCloneImplementation) {
	  return !fails(function () {
	    var set1 = new global_1.Set([7]);
	    var set2 = structuredCloneImplementation(set1);
	    var number = structuredCloneImplementation(Object$1(7));
	    return set2 == set1 || !set2.has(7) || typeof number != 'object' || number != 7;
	  }) && structuredCloneImplementation;
	};

	var checkErrorsCloning = function (structuredCloneImplementation, $Error) {
	  return !fails(function () {
	    var error = new $Error();
	    var test = structuredCloneImplementation({ a: error, b: error });
	    return !(test && test.a === test.b && test.a instanceof $Error && test.a.stack === error.stack);
	  });
	};

	// https://github.com/whatwg/html/pull/5749
	var checkNewErrorsCloningSemantic = function (structuredCloneImplementation) {
	  return !fails(function () {
	    var test = structuredCloneImplementation(new global_1.AggregateError([1], PERFORMANCE_MARK, { cause: 3 }));
	    return test.name != 'AggregateError' || test.errors[0] != 1 || test.message != PERFORMANCE_MARK || test.cause != 3;
	  });
	};

	// FF94+, Safari 15.4+, Chrome 98+, NodeJS 17.0+, Deno 1.13+
	// FF<103 and Safari implementations can't clone errors
	// https://bugzilla.mozilla.org/show_bug.cgi?id=1556604
	// FF103 can clone errors, but `.stack` of clone is an empty string
	// https://bugzilla.mozilla.org/show_bug.cgi?id=1778762
	// FF104+ fixed it on usual errors, but not on DOMExceptions
	// https://bugzilla.mozilla.org/show_bug.cgi?id=1777321
	// Chrome <102 returns `null` if cloned object contains multiple references to one error
	// https://bugs.chromium.org/p/v8/issues/detail?id=12542
	// NodeJS implementation can't clone DOMExceptions
	// https://github.com/nodejs/node/issues/41038
	// only FF103+ supports new (html/5749) error cloning semantic
	var nativeStructuredClone = global_1.structuredClone;

	var FORCED_REPLACEMENT = !checkErrorsCloning(nativeStructuredClone, Error$1)
	  || !checkErrorsCloning(nativeStructuredClone, DOMException)
	  || !checkNewErrorsCloningSemantic(nativeStructuredClone);

	// Chrome 82+, Safari 14.1+, Deno 1.11+
	// Chrome 78-81 implementation swaps `.name` and `.message` of cloned `DOMException`
	// Chrome returns `null` if cloned object contains multiple references to one error
	// Safari 14.1 implementation doesn't clone some `RegExp` flags, so requires a workaround
	// Safari implementation can't clone errors
	// Deno 1.2-1.10 implementations too naive
	// NodeJS 16.0+ does not have `PerformanceMark` constructor
	// NodeJS <17.2 structured cloning implementation from `performance.mark` is too naive
	// and can't clone, for example, `RegExp` or some boxed primitives
	// https://github.com/nodejs/node/issues/40840
	// no one of those implementations supports new (html/5749) error cloning semantic
	var structuredCloneFromMark = !nativeStructuredClone && checkBasicSemantic(function (value) {
	  return new PerformanceMark(PERFORMANCE_MARK, { detail: value }).detail;
	});

	var nativeRestrictedStructuredClone = checkBasicSemantic(nativeStructuredClone) || structuredCloneFromMark;

	var throwUncloneable = function (type) {
	  throw new DOMException('Uncloneable type: ' + type, DATA_CLONE_ERROR);
	};

	var throwUnpolyfillable = function (type, action) {
	  throw new DOMException((action || 'Cloning') + ' of ' + type + ' cannot be properly polyfilled in this engine', DATA_CLONE_ERROR);
	};

	var createDataTransfer = function () {
	  var dataTransfer;
	  try {
	    dataTransfer = new global_1.DataTransfer();
	  } catch (error) {
	    try {
	      dataTransfer = new global_1.ClipboardEvent('').clipboardData;
	    } catch (error2) { /* empty */ }
	  }
	  return dataTransfer && dataTransfer.items && dataTransfer.files ? dataTransfer : null;
	};

	var structuredCloneInternal = function (value, map) {
	  if (isSymbol(value)) { throwUncloneable('Symbol'); }
	  if (!isObject(value)) { return value; }
	  // effectively preserves circular references
	  if (map) {
	    if (mapHas(map, value)) { return mapGet(map, value); }
	  } else { map = new Map$1(); }

	  var type = classof(value);
	  var deep = false;
	  var C, name, cloned, dataTransfer, i, length, keys, key, source, target;

	  switch (type) {
	    case 'Array':
	      cloned = [];
	      deep = true;
	      break;
	    case 'Object':
	      cloned = {};
	      deep = true;
	      break;
	    case 'Map':
	      cloned = new Map$1();
	      deep = true;
	      break;
	    case 'Set':
	      cloned = new Set$1();
	      deep = true;
	      break;
	    case 'RegExp':
	      // in this block because of a Safari 14.1 bug
	      // old FF does not clone regexes passed to the constructor, so get the source and flags directly
	      cloned = new RegExp(value.source, regexpGetFlags(value));
	      break;
	    case 'Error':
	      name = value.name;
	      switch (name) {
	        case 'AggregateError':
	          cloned = getBuiltIn('AggregateError')([]);
	          break;
	        case 'EvalError':
	          cloned = EvalError();
	          break;
	        case 'RangeError':
	          cloned = RangeError$1();
	          break;
	        case 'ReferenceError':
	          cloned = ReferenceError();
	          break;
	        case 'SyntaxError':
	          cloned = SyntaxError$1();
	          break;
	        case 'TypeError':
	          cloned = TypeError$3();
	          break;
	        case 'URIError':
	          cloned = URIError();
	          break;
	        case 'CompileError':
	          cloned = CompileError();
	          break;
	        case 'LinkError':
	          cloned = LinkError();
	          break;
	        case 'RuntimeError':
	          cloned = RuntimeError();
	          break;
	        default:
	          cloned = Error$1();
	      }
	      deep = true;
	      break;
	    case 'DOMException':
	      cloned = new DOMException(value.message, value.name);
	      deep = true;
	      break;
	    case 'DataView':
	    case 'Int8Array':
	    case 'Uint8Array':
	    case 'Uint8ClampedArray':
	    case 'Int16Array':
	    case 'Uint16Array':
	    case 'Int32Array':
	    case 'Uint32Array':
	    case 'Float32Array':
	    case 'Float64Array':
	    case 'BigInt64Array':
	    case 'BigUint64Array':
	      C = global_1[type];
	      // in some old engines like Safari 9, typeof C is 'object'
	      // on Uint8ClampedArray or some other constructors
	      if (!isObject(C)) { throwUnpolyfillable(type); }
	      cloned = new C(
	        // this is safe, since arraybuffer cannot have circular references
	        structuredCloneInternal(value.buffer, map),
	        value.byteOffset,
	        type === 'DataView' ? value.byteLength : value.length
	      );
	      break;
	    case 'DOMQuad':
	      try {
	        cloned = new DOMQuad(
	          structuredCloneInternal(value.p1, map),
	          structuredCloneInternal(value.p2, map),
	          structuredCloneInternal(value.p3, map),
	          structuredCloneInternal(value.p4, map)
	        );
	      } catch (error) {
	        if (nativeRestrictedStructuredClone) {
	          cloned = nativeRestrictedStructuredClone(value);
	        } else { throwUnpolyfillable(type); }
	      }
	      break;
	    case 'FileList':
	      dataTransfer = createDataTransfer();
	      if (dataTransfer) {
	        for (i = 0, length = lengthOfArrayLike(value); i < length; i++) {
	          dataTransfer.items.add(structuredCloneInternal(value[i], map));
	        }
	        cloned = dataTransfer.files;
	      } else if (nativeRestrictedStructuredClone) {
	        cloned = nativeRestrictedStructuredClone(value);
	      } else { throwUnpolyfillable(type); }
	      break;
	    case 'ImageData':
	      // Safari 9 ImageData is a constructor, but typeof ImageData is 'object'
	      try {
	        cloned = new ImageData(
	          structuredCloneInternal(value.data, map),
	          value.width,
	          value.height,
	          { colorSpace: value.colorSpace }
	        );
	      } catch (error$1) {
	        if (nativeRestrictedStructuredClone) {
	          cloned = nativeRestrictedStructuredClone(value);
	        } else { throwUnpolyfillable(type); }
	      } break;
	    default:
	      if (nativeRestrictedStructuredClone) {
	        cloned = nativeRestrictedStructuredClone(value);
	      } else { switch (type) {
	        case 'BigInt':
	          // can be a 3rd party polyfill
	          cloned = Object$1(value.valueOf());
	          break;
	        case 'Boolean':
	          cloned = Object$1(thisBooleanValue(value));
	          break;
	        case 'Number':
	          cloned = Object$1(thisNumberValue(value));
	          break;
	        case 'String':
	          cloned = Object$1(thisStringValue(value));
	          break;
	        case 'Date':
	          cloned = new Date$1(thisTimeValue(value));
	          break;
	        case 'ArrayBuffer':
	          C = global_1.DataView;
	          // `ArrayBuffer#slice` is not available in IE10
	          // `ArrayBuffer#slice` and `DataView` are not available in old FF
	          if (!C && typeof value.slice != 'function') { throwUnpolyfillable(type); }
	          // detached buffers throws in `DataView` and `.slice`
	          try {
	            if (typeof value.slice == 'function') {
	              cloned = value.slice(0);
	            } else {
	              length = value.byteLength;
	              cloned = new ArrayBuffer(length);
	              source = new C(value);
	              target = new C(cloned);
	              for (i = 0; i < length; i++) {
	                target.setUint8(i, source.getUint8(i));
	              }
	            }
	          } catch (error$2) {
	            throw new DOMException('ArrayBuffer is detached', DATA_CLONE_ERROR);
	          } break;
	        case 'SharedArrayBuffer':
	          // SharedArrayBuffer should use shared memory, we can't polyfill it, so return the original
	          cloned = value;
	          break;
	        case 'Blob':
	          try {
	            cloned = value.slice(0, value.size, value.type);
	          } catch (error$3) {
	            throwUnpolyfillable(type);
	          } break;
	        case 'DOMPoint':
	        case 'DOMPointReadOnly':
	          C = global_1[type];
	          try {
	            cloned = C.fromPoint
	              ? C.fromPoint(value)
	              : new C(value.x, value.y, value.z, value.w);
	          } catch (error$4) {
	            throwUnpolyfillable(type);
	          } break;
	        case 'DOMRect':
	        case 'DOMRectReadOnly':
	          C = global_1[type];
	          try {
	            cloned = C.fromRect
	              ? C.fromRect(value)
	              : new C(value.x, value.y, value.width, value.height);
	          } catch (error$5) {
	            throwUnpolyfillable(type);
	          } break;
	        case 'DOMMatrix':
	        case 'DOMMatrixReadOnly':
	          C = global_1[type];
	          try {
	            cloned = C.fromMatrix
	              ? C.fromMatrix(value)
	              : new C(value);
	          } catch (error$6) {
	            throwUnpolyfillable(type);
	          } break;
	        case 'AudioData':
	        case 'VideoFrame':
	          if (!isCallable(value.clone)) { throwUnpolyfillable(type); }
	          try {
	            cloned = value.clone();
	          } catch (error$7) {
	            throwUncloneable(type);
	          } break;
	        case 'File':
	          try {
	            cloned = new File([value], value.name, value);
	          } catch (error$8) {
	            throwUnpolyfillable(type);
	          } break;
	        case 'CropTarget':
	        case 'CryptoKey':
	        case 'FileSystemDirectoryHandle':
	        case 'FileSystemFileHandle':
	        case 'FileSystemHandle':
	        case 'GPUCompilationInfo':
	        case 'GPUCompilationMessage':
	        case 'ImageBitmap':
	        case 'RTCCertificate':
	        case 'WebAssembly.Module':
	          throwUnpolyfillable(type);
	          // break omitted
	        default:
	          throwUncloneable(type);
	      } }
	  }

	  mapSet(map, value, cloned);

	  if (deep) { switch (type) {
	    case 'Array':
	    case 'Object':
	      keys = objectKeys(value);
	      for (i = 0, length = lengthOfArrayLike(keys); i < length; i++) {
	        key = keys[i];
	        createProperty(cloned, key, structuredCloneInternal(value[key], map));
	      } break;
	    case 'Map':
	      value.forEach(function (v, k) {
	        mapSet(cloned, structuredCloneInternal(k, map), structuredCloneInternal(v, map));
	      });
	      break;
	    case 'Set':
	      value.forEach(function (v) {
	        setAdd(cloned, structuredCloneInternal(v, map));
	      });
	      break;
	    case 'Error':
	      createNonEnumerableProperty(cloned, 'message', structuredCloneInternal(value.message, map));
	      if (hasOwnProperty_1(value, 'cause')) {
	        createNonEnumerableProperty(cloned, 'cause', structuredCloneInternal(value.cause, map));
	      }
	      if (name == 'AggregateError') {
	        cloned.errors = structuredCloneInternal(value.errors, map);
	      } // break omitted
	    case 'DOMException':
	      if (errorStackInstallable) {
	        createNonEnumerableProperty(cloned, 'stack', structuredCloneInternal(value.stack, map));
	      }
	  } }

	  return cloned;
	};

	var PROPER_TRANSFER = nativeStructuredClone && !fails(function () {
	  // prevent V8 ArrayBufferDetaching protector cell invalidation and performance degradation
	  // https://github.com/zloirock/core-js/issues/679
	  if ((engineIsDeno && engineV8Version > 92) || (engineIsNode && engineV8Version > 94) || (engineIsBrowser && engineV8Version > 97)) { return false; }
	  var buffer = new ArrayBuffer(8);
	  var clone = nativeStructuredClone(buffer, { transfer: [buffer] });
	  return buffer.byteLength != 0 || clone.byteLength != 8;
	});

	var tryToTransfer = function (rawTransfer, map) {
	  if (!isObject(rawTransfer)) { throw TypeError$3('Transfer option cannot be converted to a sequence'); }

	  var transfer = [];

	  iterate(rawTransfer, function (value) {
	    push$3(transfer, anObject(value));
	  });

	  var i = 0;
	  var length = lengthOfArrayLike(transfer);
	  var value, type, C, transferredArray, transferred, canvas, context;

	  if (PROPER_TRANSFER) {
	    transferredArray = nativeStructuredClone(transfer, { transfer: transfer });
	    while (i < length) { mapSet(map, transfer[i], transferredArray[i++]); }
	  } else { while (i < length) {
	    value = transfer[i++];
	    if (mapHas(map, value)) { throw new DOMException('Duplicate transferable', DATA_CLONE_ERROR); }

	    type = classof(value);

	    switch (type) {
	      case 'ImageBitmap':
	        C = global_1.OffscreenCanvas;
	        if (!isConstructor(C)) { throwUnpolyfillable(type, TRANSFERRING); }
	        try {
	          canvas = new C(value.width, value.height);
	          context = canvas.getContext('bitmaprenderer');
	          context.transferFromImageBitmap(value);
	          transferred = canvas.transferToImageBitmap();
	        } catch (error) { /* empty */ }
	        break;
	      case 'AudioData':
	      case 'VideoFrame':
	        if (!isCallable(value.clone) || !isCallable(value.close)) { throwUnpolyfillable(type, TRANSFERRING); }
	        try {
	          transferred = value.clone();
	          value.close();
	        } catch (error$1) { /* empty */ }
	        break;
	      case 'ArrayBuffer':
	      case 'MediaSourceHandle':
	      case 'MessagePort':
	      case 'OffscreenCanvas':
	      case 'ReadableStream':
	      case 'TransformStream':
	      case 'WritableStream':
	        throwUnpolyfillable(type, TRANSFERRING);
	    }

	    if (transferred === undefined) { throw new DOMException('This object cannot be transferred: ' + type, DATA_CLONE_ERROR); }
	    mapSet(map, value, transferred);
	  } }
	};

	// `structuredClone` method
	// https://html.spec.whatwg.org/multipage/structured-data.html#dom-structuredclone
	_export({ global: true, enumerable: true, sham: !PROPER_TRANSFER, forced: FORCED_REPLACEMENT }, {
	  structuredClone: function structuredClone(value /* , { transfer } */) {
	    var options = validateArgumentsLength(arguments.length, 1) > 1 && !isNullOrUndefined(arguments[1]) ? anObject(arguments[1]) : undefined;
	    var transfer = options ? options.transfer : undefined;
	    var map;

	    if (transfer !== undefined) {
	      map = new Map$1();
	      tryToTransfer(transfer, map);
	    }

	    return structuredCloneInternal(value, map);
	  }
	});

	var MSIE = /MSIE .\./.test(engineUserAgent); // <- dirty ie9- check
	var Function$1 = global_1.Function;

	var wrap = function (scheduler) {
	  return MSIE ? function (handler, timeout /* , ...arguments */) {
	    var boundArgs = validateArgumentsLength(arguments.length, 1) > 2;
	    var fn = isCallable(handler) ? handler : Function$1(handler);
	    var args = boundArgs ? arraySlice$1(arguments, 2) : undefined;
	    return scheduler(boundArgs ? function () {
	      functionApply(fn, this, args);
	    } : fn, timeout);
	  } : scheduler;
	};

	// ie9- setTimeout & setInterval additional parameters fix
	// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
	var schedulersFix = {
	  // `setTimeout` method
	  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
	  setTimeout: wrap(global_1.setTimeout),
	  // `setInterval` method
	  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
	  setInterval: wrap(global_1.setInterval)
	};

	var setInterval = schedulersFix.setInterval;

	// ie9- setInterval additional parameters fix
	// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
	_export({ global: true, bind: true, forced: global_1.setInterval !== setInterval }, {
	  setInterval: setInterval
	});

	var setTimeout$1 = schedulersFix.setTimeout;

	// ie9- setTimeout additional parameters fix
	// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
	_export({ global: true, bind: true, forced: global_1.setTimeout !== setTimeout$1 }, {
	  setTimeout: setTimeout$1
	});

	var ITERATOR$1 = wellKnownSymbol('iterator');

	var urlConstructorDetection = !fails(function () {
	  // eslint-disable-next-line unicorn/relative-url-style -- required for testing
	  var url = new URL('b?a=1&b=2&c=3', 'http://a');
	  var searchParams = url.searchParams;
	  var result = '';
	  url.pathname = 'c%20d';
	  searchParams.forEach(function (value, key) {
	    searchParams['delete']('b');
	    result += key + value;
	  });
	  return (isPure && !url.toJSON)
	    || !searchParams.sort
	    || url.href !== 'http://a/c%20d?a=1&c=3'
	    || searchParams.get('c') !== '3'
	    || String(new URLSearchParams('?a=1')) !== 'a=1'
	    || !searchParams[ITERATOR$1]
	    // throws in Edge
	    || new URL('https://a@b').username !== 'a'
	    || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
	    // not punycoded in Edge
	    || new URL('http://тест').host !== 'xn--e1aybc'
	    // not escaped in Chrome 62-
	    || new URL('http://a#б').hash !== '#%D0%B1'
	    // fails in Chrome 66-
	    || result !== 'a1c3'
	    // throws in Safari
	    || new URL('http://x', undefined).host !== 'x';
	});

	// based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js


	var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
	var base = 36;
	var tMin = 1;
	var tMax = 26;
	var skew = 38;
	var damp = 700;
	var initialBias = 72;
	var initialN = 128; // 0x80
	var delimiter = '-'; // '\x2D'
	var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
	var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
	var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
	var baseMinusTMin = base - tMin;

	var $RangeError = RangeError;
	var exec$1 = functionUncurryThis(regexSeparators.exec);
	var floor$1 = Math.floor;
	var fromCharCode = String.fromCharCode;
	var charCodeAt = functionUncurryThis(''.charCodeAt);
	var join$2 = functionUncurryThis([].join);
	var push$2 = functionUncurryThis([].push);
	var replace$2 = functionUncurryThis(''.replace);
	var split$2 = functionUncurryThis(''.split);
	var toLowerCase$1 = functionUncurryThis(''.toLowerCase);

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 */
	var ucs2decode = function (string) {
	  var output = [];
	  var counter = 0;
	  var length = string.length;
	  while (counter < length) {
	    var value = charCodeAt(string, counter++);
	    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
	      // It's a high surrogate, and there is a next character.
	      var extra = charCodeAt(string, counter++);
	      if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
	        push$2(output, ((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
	      } else {
	        // It's an unmatched surrogate; only append this code unit, in case the
	        // next code unit is the high surrogate of a surrogate pair.
	        push$2(output, value);
	        counter--;
	      }
	    } else {
	      push$2(output, value);
	    }
	  }
	  return output;
	};

	/**
	 * Converts a digit/integer into a basic code point.
	 */
	var digitToBasic = function (digit) {
	  //  0..25 map to ASCII a..z or A..Z
	  // 26..35 map to ASCII 0..9
	  return digit + 22 + 75 * (digit < 26);
	};

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 */
	var adapt = function (delta, numPoints, firstTime) {
	  var k = 0;
	  delta = firstTime ? floor$1(delta / damp) : delta >> 1;
	  delta += floor$1(delta / numPoints);
	  while (delta > baseMinusTMin * tMax >> 1) {
	    delta = floor$1(delta / baseMinusTMin);
	    k += base;
	  }
	  return floor$1(k + (baseMinusTMin + 1) * delta / (delta + skew));
	};

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 */
	var encode = function (input) {
	  var output = [];

	  // Convert the input in UCS-2 to an array of Unicode code points.
	  input = ucs2decode(input);

	  // Cache the length.
	  var inputLength = input.length;

	  // Initialize the state.
	  var n = initialN;
	  var delta = 0;
	  var bias = initialBias;
	  var i, currentValue;

	  // Handle the basic code points.
	  for (i = 0; i < input.length; i++) {
	    currentValue = input[i];
	    if (currentValue < 0x80) {
	      push$2(output, fromCharCode(currentValue));
	    }
	  }

	  var basicLength = output.length; // number of basic code points.
	  var handledCPCount = basicLength; // number of code points that have been handled;

	  // Finish the basic string with a delimiter unless it's empty.
	  if (basicLength) {
	    push$2(output, delimiter);
	  }

	  // Main encoding loop:
	  while (handledCPCount < inputLength) {
	    // All non-basic code points < n have been handled already. Find the next larger one:
	    var m = maxInt;
	    for (i = 0; i < input.length; i++) {
	      currentValue = input[i];
	      if (currentValue >= n && currentValue < m) {
	        m = currentValue;
	      }
	    }

	    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
	    var handledCPCountPlusOne = handledCPCount + 1;
	    if (m - n > floor$1((maxInt - delta) / handledCPCountPlusOne)) {
	      throw $RangeError(OVERFLOW_ERROR);
	    }

	    delta += (m - n) * handledCPCountPlusOne;
	    n = m;

	    for (i = 0; i < input.length; i++) {
	      currentValue = input[i];
	      if (currentValue < n && ++delta > maxInt) {
	        throw $RangeError(OVERFLOW_ERROR);
	      }
	      if (currentValue == n) {
	        // Represent delta as a generalized variable-length integer.
	        var q = delta;
	        var k = base;
	        while (true) {
	          var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
	          if (q < t) { break; }
	          var qMinusT = q - t;
	          var baseMinusT = base - t;
	          push$2(output, fromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
	          q = floor$1(qMinusT / baseMinusT);
	          k += base;
	        }

	        push$2(output, fromCharCode(digitToBasic(q)));
	        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
	        delta = 0;
	        handledCPCount++;
	      }
	    }

	    delta++;
	    n++;
	  }
	  return join$2(output, '');
	};

	var stringPunycodeToAscii = function (input) {
	  var encoded = [];
	  var labels = split$2(replace$2(toLowerCase$1(input), regexSeparators, '\u002E'), '.');
	  var i, label;
	  for (i = 0; i < labels.length; i++) {
	    label = labels[i];
	    push$2(encoded, exec$1(regexNonASCII, label) ? 'xn--' + encode(label) : label);
	  }
	  return join$2(encoded, '.');
	};

	// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`




























	var ITERATOR = wellKnownSymbol('iterator');
	var URL_SEARCH_PARAMS = 'URLSearchParams';
	var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
	var setInternalState$1 = internalState.set;
	var getInternalParamsState = internalState.getterFor(URL_SEARCH_PARAMS);
	var getInternalIteratorState = internalState.getterFor(URL_SEARCH_PARAMS_ITERATOR);
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// Avoid NodeJS experimental warning
	var safeGetBuiltIn = function (name) {
	  if (!descriptors) { return global_1[name]; }
	  var descriptor = getOwnPropertyDescriptor(global_1, name);
	  return descriptor && descriptor.value;
	};

	var nativeFetch = safeGetBuiltIn('fetch');
	var NativeRequest = safeGetBuiltIn('Request');
	var Headers = safeGetBuiltIn('Headers');
	var RequestPrototype = NativeRequest && NativeRequest.prototype;
	var HeadersPrototype = Headers && Headers.prototype;
	var RegExp$1 = global_1.RegExp;
	var TypeError$2 = global_1.TypeError;
	var decodeURIComponent = global_1.decodeURIComponent;
	var encodeURIComponent$1 = global_1.encodeURIComponent;
	var charAt$1 = functionUncurryThis(''.charAt);
	var join$1 = functionUncurryThis([].join);
	var push$1 = functionUncurryThis([].push);
	var replace$1 = functionUncurryThis(''.replace);
	var shift$1 = functionUncurryThis([].shift);
	var splice = functionUncurryThis([].splice);
	var split$1 = functionUncurryThis(''.split);
	var stringSlice$1 = functionUncurryThis(''.slice);

	var plus = /\+/g;
	var sequences = Array(4);

	var percentSequence = function (bytes) {
	  return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp$1('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
	};

	var percentDecode = function (sequence) {
	  try {
	    return decodeURIComponent(sequence);
	  } catch (error) {
	    return sequence;
	  }
	};

	var deserialize = function (it) {
	  var result = replace$1(it, plus, ' ');
	  var bytes = 4;
	  try {
	    return decodeURIComponent(result);
	  } catch (error) {
	    while (bytes) {
	      result = replace$1(result, percentSequence(bytes--), percentDecode);
	    }
	    return result;
	  }
	};

	var find = /[!'()~]|%20/g;

	var replacements = {
	  '!': '%21',
	  "'": '%27',
	  '(': '%28',
	  ')': '%29',
	  '~': '%7E',
	  '%20': '+'
	};

	var replacer = function (match) {
	  return replacements[match];
	};

	var serialize = function (it) {
	  return replace$1(encodeURIComponent$1(it), find, replacer);
	};

	var URLSearchParamsIterator = iteratorCreateConstructor(function Iterator(params, kind) {
	  setInternalState$1(this, {
	    type: URL_SEARCH_PARAMS_ITERATOR,
	    iterator: getIterator(getInternalParamsState(params).entries),
	    kind: kind
	  });
	}, 'Iterator', function next() {
	  var state = getInternalIteratorState(this);
	  var kind = state.kind;
	  var step = state.iterator.next();
	  var entry = step.value;
	  if (!step.done) {
	    step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
	  } return step;
	}, true);

	var URLSearchParamsState = function (init) {
	  this.entries = [];
	  this.url = null;

	  if (init !== undefined) {
	    if (isObject(init)) { this.parseObject(init); }
	    else { this.parseQuery(typeof init == 'string' ? charAt$1(init, 0) === '?' ? stringSlice$1(init, 1) : init : toString_1(init)); }
	  }
	};

	URLSearchParamsState.prototype = {
	  type: URL_SEARCH_PARAMS,
	  bindURL: function (url) {
	    this.url = url;
	    this.update();
	  },
	  parseObject: function (object) {
	    var iteratorMethod = getIteratorMethod(object);
	    var iterator, next, step, entryIterator, entryNext, first, second;

	    if (iteratorMethod) {
	      iterator = getIterator(object, iteratorMethod);
	      next = iterator.next;
	      while (!(step = functionCall(next, iterator)).done) {
	        entryIterator = getIterator(anObject(step.value));
	        entryNext = entryIterator.next;
	        if (
	          (first = functionCall(entryNext, entryIterator)).done ||
	          (second = functionCall(entryNext, entryIterator)).done ||
	          !functionCall(entryNext, entryIterator).done
	        ) { throw TypeError$2('Expected sequence with length 2'); }
	        push$1(this.entries, { key: toString_1(first.value), value: toString_1(second.value) });
	      }
	    } else { for (var key in object) { if (hasOwnProperty_1(object, key)) {
	      push$1(this.entries, { key: key, value: toString_1(object[key]) });
	    } } }
	  },
	  parseQuery: function (query) {
	    if (query) {
	      var attributes = split$1(query, '&');
	      var index = 0;
	      var attribute, entry;
	      while (index < attributes.length) {
	        attribute = attributes[index++];
	        if (attribute.length) {
	          entry = split$1(attribute, '=');
	          push$1(this.entries, {
	            key: deserialize(shift$1(entry)),
	            value: deserialize(join$1(entry, '='))
	          });
	        }
	      }
	    }
	  },
	  serialize: function () {
	    var entries = this.entries;
	    var result = [];
	    var index = 0;
	    var entry;
	    while (index < entries.length) {
	      entry = entries[index++];
	      push$1(result, serialize(entry.key) + '=' + serialize(entry.value));
	    } return join$1(result, '&');
	  },
	  update: function () {
	    this.entries.length = 0;
	    this.parseQuery(this.url.query);
	  },
	  updateURL: function () {
	    if (this.url) { this.url.update(); }
	  }
	};

	// `URLSearchParams` constructor
	// https://url.spec.whatwg.org/#interface-urlsearchparams
	var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
	  anInstance(this, URLSearchParamsPrototype);
	  var init = arguments.length > 0 ? arguments[0] : undefined;
	  setInternalState$1(this, new URLSearchParamsState(init));
	};

	var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

	defineBuiltIns(URLSearchParamsPrototype, {
	  // `URLSearchParams.prototype.append` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-append
	  append: function append(name, value) {
	    validateArgumentsLength(arguments.length, 2);
	    var state = getInternalParamsState(this);
	    push$1(state.entries, { key: toString_1(name), value: toString_1(value) });
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.delete` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
	  'delete': function (name) {
	    validateArgumentsLength(arguments.length, 1);
	    var state = getInternalParamsState(this);
	    var entries = state.entries;
	    var key = toString_1(name);
	    var index = 0;
	    while (index < entries.length) {
	      if (entries[index].key === key) { splice(entries, index, 1); }
	      else { index++; }
	    }
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.get` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
	  get: function get(name) {
	    validateArgumentsLength(arguments.length, 1);
	    var entries = getInternalParamsState(this).entries;
	    var key = toString_1(name);
	    var index = 0;
	    for (; index < entries.length; index++) {
	      if (entries[index].key === key) { return entries[index].value; }
	    }
	    return null;
	  },
	  // `URLSearchParams.prototype.getAll` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
	  getAll: function getAll(name) {
	    validateArgumentsLength(arguments.length, 1);
	    var entries = getInternalParamsState(this).entries;
	    var key = toString_1(name);
	    var result = [];
	    var index = 0;
	    for (; index < entries.length; index++) {
	      if (entries[index].key === key) { push$1(result, entries[index].value); }
	    }
	    return result;
	  },
	  // `URLSearchParams.prototype.has` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
	  has: function has(name) {
	    validateArgumentsLength(arguments.length, 1);
	    var entries = getInternalParamsState(this).entries;
	    var key = toString_1(name);
	    var index = 0;
	    while (index < entries.length) {
	      if (entries[index++].key === key) { return true; }
	    }
	    return false;
	  },
	  // `URLSearchParams.prototype.set` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-set
	  set: function set(name, value) {
	    validateArgumentsLength(arguments.length, 1);
	    var state = getInternalParamsState(this);
	    var entries = state.entries;
	    var found = false;
	    var key = toString_1(name);
	    var val = toString_1(value);
	    var index = 0;
	    var entry;
	    for (; index < entries.length; index++) {
	      entry = entries[index];
	      if (entry.key === key) {
	        if (found) { splice(entries, index--, 1); }
	        else {
	          found = true;
	          entry.value = val;
	        }
	      }
	    }
	    if (!found) { push$1(entries, { key: key, value: val }); }
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.sort` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
	  sort: function sort() {
	    var state = getInternalParamsState(this);
	    arraySort(state.entries, function (a, b) {
	      return a.key > b.key ? 1 : -1;
	    });
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.forEach` method
	  forEach: function forEach(callback /* , thisArg */) {
	    var entries = getInternalParamsState(this).entries;
	    var boundFunction = functionBindContext(callback, arguments.length > 1 ? arguments[1] : undefined);
	    var index = 0;
	    var entry;
	    while (index < entries.length) {
	      entry = entries[index++];
	      boundFunction(entry.value, entry.key, this);
	    }
	  },
	  // `URLSearchParams.prototype.keys` method
	  keys: function keys() {
	    return new URLSearchParamsIterator(this, 'keys');
	  },
	  // `URLSearchParams.prototype.values` method
	  values: function values() {
	    return new URLSearchParamsIterator(this, 'values');
	  },
	  // `URLSearchParams.prototype.entries` method
	  entries: function entries() {
	    return new URLSearchParamsIterator(this, 'entries');
	  }
	}, { enumerable: true });

	// `URLSearchParams.prototype[@@iterator]` method
	defineBuiltIn(URLSearchParamsPrototype, ITERATOR, URLSearchParamsPrototype.entries, { name: 'entries' });

	// `URLSearchParams.prototype.toString` method
	// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
	defineBuiltIn(URLSearchParamsPrototype, 'toString', function toString() {
	  return getInternalParamsState(this).serialize();
	}, { enumerable: true });

	setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

	_export({ global: true, constructor: true, forced: !urlConstructorDetection }, {
	  URLSearchParams: URLSearchParamsConstructor
	});

	// Wrap `fetch` and `Request` for correct work with polyfilled `URLSearchParams`
	if (!urlConstructorDetection && isCallable(Headers)) {
	  var headersHas = functionUncurryThis(HeadersPrototype.has);
	  var headersSet = functionUncurryThis(HeadersPrototype.set);

	  var wrapRequestOptions = function (init) {
	    if (isObject(init)) {
	      var body = init.body;
	      var headers;
	      if (classof(body) === URL_SEARCH_PARAMS) {
	        headers = init.headers ? new Headers(init.headers) : new Headers();
	        if (!headersHas(headers, 'content-type')) {
	          headersSet(headers, 'content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
	        }
	        return objectCreate(init, {
	          body: createPropertyDescriptor(0, toString_1(body)),
	          headers: createPropertyDescriptor(0, headers)
	        });
	      }
	    } return init;
	  };

	  if (isCallable(nativeFetch)) {
	    _export({ global: true, enumerable: true, dontCallGetSet: true, forced: true }, {
	      fetch: function fetch(input /* , init */) {
	        return nativeFetch(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
	      }
	    });
	  }

	  if (isCallable(NativeRequest)) {
	    var RequestConstructor = function Request(input /* , init */) {
	      anInstance(this, RequestPrototype);
	      return new NativeRequest(input, arguments.length > 1 ? wrapRequestOptions(arguments[1]) : {});
	    };

	    RequestPrototype.constructor = RequestConstructor;
	    RequestConstructor.prototype = RequestPrototype;

	    _export({ global: true, constructor: true, dontCallGetSet: true, forced: true }, {
	      Request: RequestConstructor
	    });
	  }
	}

	var web_urlSearchParams_constructor = {
	  URLSearchParams: URLSearchParamsConstructor,
	  getState: getInternalParamsState
	};

	// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`














	var codeAt = stringMultibyte.codeAt;







	var setInternalState = internalState.set;
	var getInternalURLState = internalState.getterFor('URL');
	var URLSearchParams$1 = web_urlSearchParams_constructor.URLSearchParams;
	var getInternalSearchParamsState = web_urlSearchParams_constructor.getState;

	var NativeURL = global_1.URL;
	var TypeError$1 = global_1.TypeError;
	var parseInt$1 = global_1.parseInt;
	var floor = Math.floor;
	var pow = Math.pow;
	var charAt = functionUncurryThis(''.charAt);
	var exec = functionUncurryThis(/./.exec);
	var join = functionUncurryThis([].join);
	var numberToString = functionUncurryThis(1.0.toString);
	var pop = functionUncurryThis([].pop);
	var push = functionUncurryThis([].push);
	var replace = functionUncurryThis(''.replace);
	var shift = functionUncurryThis([].shift);
	var split = functionUncurryThis(''.split);
	var stringSlice = functionUncurryThis(''.slice);
	var toLowerCase = functionUncurryThis(''.toLowerCase);
	var unshift = functionUncurryThis([].unshift);

	var INVALID_AUTHORITY = 'Invalid authority';
	var INVALID_SCHEME = 'Invalid scheme';
	var INVALID_HOST = 'Invalid host';
	var INVALID_PORT = 'Invalid port';

	var ALPHA = /[a-z]/i;
	// eslint-disable-next-line regexp/no-obscure-range -- safe
	var ALPHANUMERIC = /[\d+-.a-z]/i;
	var DIGIT = /\d/;
	var HEX_START = /^0x/i;
	var OCT = /^[0-7]+$/;
	var DEC = /^\d+$/;
	var HEX = /^[\da-f]+$/i;
	/* eslint-disable regexp/no-control-character -- safe */
	var FORBIDDEN_HOST_CODE_POINT = /[\0\t\n\r #%/:<>?@[\\\]^|]/;
	var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\0\t\n\r #/:<>?@[\\\]^|]/;
	var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u0020]+|[\u0000-\u0020]+$/g;
	var TAB_AND_NEW_LINE = /[\t\n\r]/g;
	/* eslint-enable regexp/no-control-character -- safe */
	var EOF;

	// https://url.spec.whatwg.org/#ipv4-number-parser
	var parseIPv4 = function (input) {
	  var parts = split(input, '.');
	  var partsLength, numbers, index, part, radix, number, ipv4;
	  if (parts.length && parts[parts.length - 1] == '') {
	    parts.length--;
	  }
	  partsLength = parts.length;
	  if (partsLength > 4) { return input; }
	  numbers = [];
	  for (index = 0; index < partsLength; index++) {
	    part = parts[index];
	    if (part == '') { return input; }
	    radix = 10;
	    if (part.length > 1 && charAt(part, 0) == '0') {
	      radix = exec(HEX_START, part) ? 16 : 8;
	      part = stringSlice(part, radix == 8 ? 1 : 2);
	    }
	    if (part === '') {
	      number = 0;
	    } else {
	      if (!exec(radix == 10 ? DEC : radix == 8 ? OCT : HEX, part)) { return input; }
	      number = parseInt$1(part, radix);
	    }
	    push(numbers, number);
	  }
	  for (index = 0; index < partsLength; index++) {
	    number = numbers[index];
	    if (index == partsLength - 1) {
	      if (number >= pow(256, 5 - partsLength)) { return null; }
	    } else if (number > 255) { return null; }
	  }
	  ipv4 = pop(numbers);
	  for (index = 0; index < numbers.length; index++) {
	    ipv4 += numbers[index] * pow(256, 3 - index);
	  }
	  return ipv4;
	};

	// https://url.spec.whatwg.org/#concept-ipv6-parser
	// eslint-disable-next-line max-statements -- TODO
	var parseIPv6 = function (input) {
	  var address = [0, 0, 0, 0, 0, 0, 0, 0];
	  var pieceIndex = 0;
	  var compress = null;
	  var pointer = 0;
	  var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

	  var chr = function () {
	    return charAt(input, pointer);
	  };

	  if (chr() == ':') {
	    if (charAt(input, 1) != ':') { return; }
	    pointer += 2;
	    pieceIndex++;
	    compress = pieceIndex;
	  }
	  while (chr()) {
	    if (pieceIndex == 8) { return; }
	    if (chr() == ':') {
	      if (compress !== null) { return; }
	      pointer++;
	      pieceIndex++;
	      compress = pieceIndex;
	      continue;
	    }
	    value = length = 0;
	    while (length < 4 && exec(HEX, chr())) {
	      value = value * 16 + parseInt$1(chr(), 16);
	      pointer++;
	      length++;
	    }
	    if (chr() == '.') {
	      if (length == 0) { return; }
	      pointer -= length;
	      if (pieceIndex > 6) { return; }
	      numbersSeen = 0;
	      while (chr()) {
	        ipv4Piece = null;
	        if (numbersSeen > 0) {
	          if (chr() == '.' && numbersSeen < 4) { pointer++; }
	          else { return; }
	        }
	        if (!exec(DIGIT, chr())) { return; }
	        while (exec(DIGIT, chr())) {
	          number = parseInt$1(chr(), 10);
	          if (ipv4Piece === null) { ipv4Piece = number; }
	          else if (ipv4Piece == 0) { return; }
	          else { ipv4Piece = ipv4Piece * 10 + number; }
	          if (ipv4Piece > 255) { return; }
	          pointer++;
	        }
	        address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
	        numbersSeen++;
	        if (numbersSeen == 2 || numbersSeen == 4) { pieceIndex++; }
	      }
	      if (numbersSeen != 4) { return; }
	      break;
	    } else if (chr() == ':') {
	      pointer++;
	      if (!chr()) { return; }
	    } else if (chr()) { return; }
	    address[pieceIndex++] = value;
	  }
	  if (compress !== null) {
	    swaps = pieceIndex - compress;
	    pieceIndex = 7;
	    while (pieceIndex != 0 && swaps > 0) {
	      swap = address[pieceIndex];
	      address[pieceIndex--] = address[compress + swaps - 1];
	      address[compress + --swaps] = swap;
	    }
	  } else if (pieceIndex != 8) { return; }
	  return address;
	};

	var findLongestZeroSequence = function (ipv6) {
	  var maxIndex = null;
	  var maxLength = 1;
	  var currStart = null;
	  var currLength = 0;
	  var index = 0;
	  for (; index < 8; index++) {
	    if (ipv6[index] !== 0) {
	      if (currLength > maxLength) {
	        maxIndex = currStart;
	        maxLength = currLength;
	      }
	      currStart = null;
	      currLength = 0;
	    } else {
	      if (currStart === null) { currStart = index; }
	      ++currLength;
	    }
	  }
	  if (currLength > maxLength) {
	    maxIndex = currStart;
	    maxLength = currLength;
	  }
	  return maxIndex;
	};

	// https://url.spec.whatwg.org/#host-serializing
	var serializeHost = function (host) {
	  var result, index, compress, ignore0;
	  // ipv4
	  if (typeof host == 'number') {
	    result = [];
	    for (index = 0; index < 4; index++) {
	      unshift(result, host % 256);
	      host = floor(host / 256);
	    } return join(result, '.');
	  // ipv6
	  } else if (typeof host == 'object') {
	    result = '';
	    compress = findLongestZeroSequence(host);
	    for (index = 0; index < 8; index++) {
	      if (ignore0 && host[index] === 0) { continue; }
	      if (ignore0) { ignore0 = false; }
	      if (compress === index) {
	        result += index ? ':' : '::';
	        ignore0 = true;
	      } else {
	        result += numberToString(host[index], 16);
	        if (index < 7) { result += ':'; }
	      }
	    }
	    return '[' + result + ']';
	  } return host;
	};

	var C0ControlPercentEncodeSet = {};
	var fragmentPercentEncodeSet = objectAssign({}, C0ControlPercentEncodeSet, {
	  ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
	});
	var pathPercentEncodeSet = objectAssign({}, fragmentPercentEncodeSet, {
	  '#': 1, '?': 1, '{': 1, '}': 1
	});
	var userinfoPercentEncodeSet = objectAssign({}, pathPercentEncodeSet, {
	  '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
	});

	var percentEncode = function (chr, set) {
	  var code = codeAt(chr, 0);
	  return code > 0x20 && code < 0x7F && !hasOwnProperty_1(set, chr) ? chr : encodeURIComponent(chr);
	};

	// https://url.spec.whatwg.org/#special-scheme
	var specialSchemes = {
	  ftp: 21,
	  file: null,
	  http: 80,
	  https: 443,
	  ws: 80,
	  wss: 443
	};

	// https://url.spec.whatwg.org/#windows-drive-letter
	var isWindowsDriveLetter = function (string, normalized) {
	  var second;
	  return string.length == 2 && exec(ALPHA, charAt(string, 0))
	    && ((second = charAt(string, 1)) == ':' || (!normalized && second == '|'));
	};

	// https://url.spec.whatwg.org/#start-with-a-windows-drive-letter
	var startsWithWindowsDriveLetter = function (string) {
	  var third;
	  return string.length > 1 && isWindowsDriveLetter(stringSlice(string, 0, 2)) && (
	    string.length == 2 ||
	    ((third = charAt(string, 2)) === '/' || third === '\\' || third === '?' || third === '#')
	  );
	};

	// https://url.spec.whatwg.org/#single-dot-path-segment
	var isSingleDot = function (segment) {
	  return segment === '.' || toLowerCase(segment) === '%2e';
	};

	// https://url.spec.whatwg.org/#double-dot-path-segment
	var isDoubleDot = function (segment) {
	  segment = toLowerCase(segment);
	  return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
	};

	// States:
	var SCHEME_START = {};
	var SCHEME = {};
	var NO_SCHEME = {};
	var SPECIAL_RELATIVE_OR_AUTHORITY = {};
	var PATH_OR_AUTHORITY = {};
	var RELATIVE = {};
	var RELATIVE_SLASH = {};
	var SPECIAL_AUTHORITY_SLASHES = {};
	var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
	var AUTHORITY = {};
	var HOST = {};
	var HOSTNAME = {};
	var PORT = {};
	var FILE = {};
	var FILE_SLASH = {};
	var FILE_HOST = {};
	var PATH_START = {};
	var PATH = {};
	var CANNOT_BE_A_BASE_URL_PATH = {};
	var QUERY = {};
	var FRAGMENT = {};

	var URLState = function (url, isBase, base) {
	  var urlString = toString_1(url);
	  var baseState, failure, searchParams;
	  if (isBase) {
	    failure = this.parse(urlString);
	    if (failure) { throw TypeError$1(failure); }
	    this.searchParams = null;
	  } else {
	    if (base !== undefined) { baseState = new URLState(base, true); }
	    failure = this.parse(urlString, null, baseState);
	    if (failure) { throw TypeError$1(failure); }
	    searchParams = getInternalSearchParamsState(new URLSearchParams$1());
	    searchParams.bindURL(this);
	    this.searchParams = searchParams;
	  }
	};

	URLState.prototype = {
	  type: 'URL',
	  // https://url.spec.whatwg.org/#url-parsing
	  // eslint-disable-next-line max-statements -- TODO
	  parse: function (input, stateOverride, base) {
	    var url = this;
	    var state = stateOverride || SCHEME_START;
	    var pointer = 0;
	    var buffer = '';
	    var seenAt = false;
	    var seenBracket = false;
	    var seenPasswordToken = false;
	    var codePoints, chr, bufferCodePoints, failure;

	    input = toString_1(input);

	    if (!stateOverride) {
	      url.scheme = '';
	      url.username = '';
	      url.password = '';
	      url.host = null;
	      url.port = null;
	      url.path = [];
	      url.query = null;
	      url.fragment = null;
	      url.cannotBeABaseURL = false;
	      input = replace(input, LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE, '');
	    }

	    input = replace(input, TAB_AND_NEW_LINE, '');

	    codePoints = arrayFrom(input);

	    while (pointer <= codePoints.length) {
	      chr = codePoints[pointer];
	      switch (state) {
	        case SCHEME_START:
	          if (chr && exec(ALPHA, chr)) {
	            buffer += toLowerCase(chr);
	            state = SCHEME;
	          } else if (!stateOverride) {
	            state = NO_SCHEME;
	            continue;
	          } else { return INVALID_SCHEME; }
	          break;

	        case SCHEME:
	          if (chr && (exec(ALPHANUMERIC, chr) || chr == '+' || chr == '-' || chr == '.')) {
	            buffer += toLowerCase(chr);
	          } else if (chr == ':') {
	            if (stateOverride && (
	              (url.isSpecial() != hasOwnProperty_1(specialSchemes, buffer)) ||
	              (buffer == 'file' && (url.includesCredentials() || url.port !== null)) ||
	              (url.scheme == 'file' && !url.host)
	            )) { return; }
	            url.scheme = buffer;
	            if (stateOverride) {
	              if (url.isSpecial() && specialSchemes[url.scheme] == url.port) { url.port = null; }
	              return;
	            }
	            buffer = '';
	            if (url.scheme == 'file') {
	              state = FILE;
	            } else if (url.isSpecial() && base && base.scheme == url.scheme) {
	              state = SPECIAL_RELATIVE_OR_AUTHORITY;
	            } else if (url.isSpecial()) {
	              state = SPECIAL_AUTHORITY_SLASHES;
	            } else if (codePoints[pointer + 1] == '/') {
	              state = PATH_OR_AUTHORITY;
	              pointer++;
	            } else {
	              url.cannotBeABaseURL = true;
	              push(url.path, '');
	              state = CANNOT_BE_A_BASE_URL_PATH;
	            }
	          } else if (!stateOverride) {
	            buffer = '';
	            state = NO_SCHEME;
	            pointer = 0;
	            continue;
	          } else { return INVALID_SCHEME; }
	          break;

	        case NO_SCHEME:
	          if (!base || (base.cannotBeABaseURL && chr != '#')) { return INVALID_SCHEME; }
	          if (base.cannotBeABaseURL && chr == '#') {
	            url.scheme = base.scheme;
	            url.path = arraySliceSimple(base.path);
	            url.query = base.query;
	            url.fragment = '';
	            url.cannotBeABaseURL = true;
	            state = FRAGMENT;
	            break;
	          }
	          state = base.scheme == 'file' ? FILE : RELATIVE;
	          continue;

	        case SPECIAL_RELATIVE_OR_AUTHORITY:
	          if (chr == '/' && codePoints[pointer + 1] == '/') {
	            state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
	            pointer++;
	          } else {
	            state = RELATIVE;
	            continue;
	          } break;

	        case PATH_OR_AUTHORITY:
	          if (chr == '/') {
	            state = AUTHORITY;
	            break;
	          } else {
	            state = PATH;
	            continue;
	          }

	        case RELATIVE:
	          url.scheme = base.scheme;
	          if (chr == EOF) {
	            url.username = base.username;
	            url.password = base.password;
	            url.host = base.host;
	            url.port = base.port;
	            url.path = arraySliceSimple(base.path);
	            url.query = base.query;
	          } else if (chr == '/' || (chr == '\\' && url.isSpecial())) {
	            state = RELATIVE_SLASH;
	          } else if (chr == '?') {
	            url.username = base.username;
	            url.password = base.password;
	            url.host = base.host;
	            url.port = base.port;
	            url.path = arraySliceSimple(base.path);
	            url.query = '';
	            state = QUERY;
	          } else if (chr == '#') {
	            url.username = base.username;
	            url.password = base.password;
	            url.host = base.host;
	            url.port = base.port;
	            url.path = arraySliceSimple(base.path);
	            url.query = base.query;
	            url.fragment = '';
	            state = FRAGMENT;
	          } else {
	            url.username = base.username;
	            url.password = base.password;
	            url.host = base.host;
	            url.port = base.port;
	            url.path = arraySliceSimple(base.path);
	            url.path.length--;
	            state = PATH;
	            continue;
	          } break;

	        case RELATIVE_SLASH:
	          if (url.isSpecial() && (chr == '/' || chr == '\\')) {
	            state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
	          } else if (chr == '/') {
	            state = AUTHORITY;
	          } else {
	            url.username = base.username;
	            url.password = base.password;
	            url.host = base.host;
	            url.port = base.port;
	            state = PATH;
	            continue;
	          } break;

	        case SPECIAL_AUTHORITY_SLASHES:
	          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
	          if (chr != '/' || charAt(buffer, pointer + 1) != '/') { continue; }
	          pointer++;
	          break;

	        case SPECIAL_AUTHORITY_IGNORE_SLASHES:
	          if (chr != '/' && chr != '\\') {
	            state = AUTHORITY;
	            continue;
	          } break;

	        case AUTHORITY:
	          if (chr == '@') {
	            if (seenAt) { buffer = '%40' + buffer; }
	            seenAt = true;
	            bufferCodePoints = arrayFrom(buffer);
	            for (var i = 0; i < bufferCodePoints.length; i++) {
	              var codePoint = bufferCodePoints[i];
	              if (codePoint == ':' && !seenPasswordToken) {
	                seenPasswordToken = true;
	                continue;
	              }
	              var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
	              if (seenPasswordToken) { url.password += encodedCodePoints; }
	              else { url.username += encodedCodePoints; }
	            }
	            buffer = '';
	          } else if (
	            chr == EOF || chr == '/' || chr == '?' || chr == '#' ||
	            (chr == '\\' && url.isSpecial())
	          ) {
	            if (seenAt && buffer == '') { return INVALID_AUTHORITY; }
	            pointer -= arrayFrom(buffer).length + 1;
	            buffer = '';
	            state = HOST;
	          } else { buffer += chr; }
	          break;

	        case HOST:
	        case HOSTNAME:
	          if (stateOverride && url.scheme == 'file') {
	            state = FILE_HOST;
	            continue;
	          } else if (chr == ':' && !seenBracket) {
	            if (buffer == '') { return INVALID_HOST; }
	            failure = url.parseHost(buffer);
	            if (failure) { return failure; }
	            buffer = '';
	            state = PORT;
	            if (stateOverride == HOSTNAME) { return; }
	          } else if (
	            chr == EOF || chr == '/' || chr == '?' || chr == '#' ||
	            (chr == '\\' && url.isSpecial())
	          ) {
	            if (url.isSpecial() && buffer == '') { return INVALID_HOST; }
	            if (stateOverride && buffer == '' && (url.includesCredentials() || url.port !== null)) { return; }
	            failure = url.parseHost(buffer);
	            if (failure) { return failure; }
	            buffer = '';
	            state = PATH_START;
	            if (stateOverride) { return; }
	            continue;
	          } else {
	            if (chr == '[') { seenBracket = true; }
	            else if (chr == ']') { seenBracket = false; }
	            buffer += chr;
	          } break;

	        case PORT:
	          if (exec(DIGIT, chr)) {
	            buffer += chr;
	          } else if (
	            chr == EOF || chr == '/' || chr == '?' || chr == '#' ||
	            (chr == '\\' && url.isSpecial()) ||
	            stateOverride
	          ) {
	            if (buffer != '') {
	              var port = parseInt$1(buffer, 10);
	              if (port > 0xFFFF) { return INVALID_PORT; }
	              url.port = (url.isSpecial() && port === specialSchemes[url.scheme]) ? null : port;
	              buffer = '';
	            }
	            if (stateOverride) { return; }
	            state = PATH_START;
	            continue;
	          } else { return INVALID_PORT; }
	          break;

	        case FILE:
	          url.scheme = 'file';
	          if (chr == '/' || chr == '\\') { state = FILE_SLASH; }
	          else if (base && base.scheme == 'file') {
	            if (chr == EOF) {
	              url.host = base.host;
	              url.path = arraySliceSimple(base.path);
	              url.query = base.query;
	            } else if (chr == '?') {
	              url.host = base.host;
	              url.path = arraySliceSimple(base.path);
	              url.query = '';
	              state = QUERY;
	            } else if (chr == '#') {
	              url.host = base.host;
	              url.path = arraySliceSimple(base.path);
	              url.query = base.query;
	              url.fragment = '';
	              state = FRAGMENT;
	            } else {
	              if (!startsWithWindowsDriveLetter(join(arraySliceSimple(codePoints, pointer), ''))) {
	                url.host = base.host;
	                url.path = arraySliceSimple(base.path);
	                url.shortenPath();
	              }
	              state = PATH;
	              continue;
	            }
	          } else {
	            state = PATH;
	            continue;
	          } break;

	        case FILE_SLASH:
	          if (chr == '/' || chr == '\\') {
	            state = FILE_HOST;
	            break;
	          }
	          if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(join(arraySliceSimple(codePoints, pointer), ''))) {
	            if (isWindowsDriveLetter(base.path[0], true)) { push(url.path, base.path[0]); }
	            else { url.host = base.host; }
	          }
	          state = PATH;
	          continue;

	        case FILE_HOST:
	          if (chr == EOF || chr == '/' || chr == '\\' || chr == '?' || chr == '#') {
	            if (!stateOverride && isWindowsDriveLetter(buffer)) {
	              state = PATH;
	            } else if (buffer == '') {
	              url.host = '';
	              if (stateOverride) { return; }
	              state = PATH_START;
	            } else {
	              failure = url.parseHost(buffer);
	              if (failure) { return failure; }
	              if (url.host == 'localhost') { url.host = ''; }
	              if (stateOverride) { return; }
	              buffer = '';
	              state = PATH_START;
	            } continue;
	          } else { buffer += chr; }
	          break;

	        case PATH_START:
	          if (url.isSpecial()) {
	            state = PATH;
	            if (chr != '/' && chr != '\\') { continue; }
	          } else if (!stateOverride && chr == '?') {
	            url.query = '';
	            state = QUERY;
	          } else if (!stateOverride && chr == '#') {
	            url.fragment = '';
	            state = FRAGMENT;
	          } else if (chr != EOF) {
	            state = PATH;
	            if (chr != '/') { continue; }
	          } break;

	        case PATH:
	          if (
	            chr == EOF || chr == '/' ||
	            (chr == '\\' && url.isSpecial()) ||
	            (!stateOverride && (chr == '?' || chr == '#'))
	          ) {
	            if (isDoubleDot(buffer)) {
	              url.shortenPath();
	              if (chr != '/' && !(chr == '\\' && url.isSpecial())) {
	                push(url.path, '');
	              }
	            } else if (isSingleDot(buffer)) {
	              if (chr != '/' && !(chr == '\\' && url.isSpecial())) {
	                push(url.path, '');
	              }
	            } else {
	              if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
	                if (url.host) { url.host = ''; }
	                buffer = charAt(buffer, 0) + ':'; // normalize windows drive letter
	              }
	              push(url.path, buffer);
	            }
	            buffer = '';
	            if (url.scheme == 'file' && (chr == EOF || chr == '?' || chr == '#')) {
	              while (url.path.length > 1 && url.path[0] === '') {
	                shift(url.path);
	              }
	            }
	            if (chr == '?') {
	              url.query = '';
	              state = QUERY;
	            } else if (chr == '#') {
	              url.fragment = '';
	              state = FRAGMENT;
	            }
	          } else {
	            buffer += percentEncode(chr, pathPercentEncodeSet);
	          } break;

	        case CANNOT_BE_A_BASE_URL_PATH:
	          if (chr == '?') {
	            url.query = '';
	            state = QUERY;
	          } else if (chr == '#') {
	            url.fragment = '';
	            state = FRAGMENT;
	          } else if (chr != EOF) {
	            url.path[0] += percentEncode(chr, C0ControlPercentEncodeSet);
	          } break;

	        case QUERY:
	          if (!stateOverride && chr == '#') {
	            url.fragment = '';
	            state = FRAGMENT;
	          } else if (chr != EOF) {
	            if (chr == "'" && url.isSpecial()) { url.query += '%27'; }
	            else if (chr == '#') { url.query += '%23'; }
	            else { url.query += percentEncode(chr, C0ControlPercentEncodeSet); }
	          } break;

	        case FRAGMENT:
	          if (chr != EOF) { url.fragment += percentEncode(chr, fragmentPercentEncodeSet); }
	          break;
	      }

	      pointer++;
	    }
	  },
	  // https://url.spec.whatwg.org/#host-parsing
	  parseHost: function (input) {
	    var result, codePoints, index;
	    if (charAt(input, 0) == '[') {
	      if (charAt(input, input.length - 1) != ']') { return INVALID_HOST; }
	      result = parseIPv6(stringSlice(input, 1, -1));
	      if (!result) { return INVALID_HOST; }
	      this.host = result;
	    // opaque host
	    } else if (!this.isSpecial()) {
	      if (exec(FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT, input)) { return INVALID_HOST; }
	      result = '';
	      codePoints = arrayFrom(input);
	      for (index = 0; index < codePoints.length; index++) {
	        result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
	      }
	      this.host = result;
	    } else {
	      input = stringPunycodeToAscii(input);
	      if (exec(FORBIDDEN_HOST_CODE_POINT, input)) { return INVALID_HOST; }
	      result = parseIPv4(input);
	      if (result === null) { return INVALID_HOST; }
	      this.host = result;
	    }
	  },
	  // https://url.spec.whatwg.org/#cannot-have-a-username-password-port
	  cannotHaveUsernamePasswordPort: function () {
	    return !this.host || this.cannotBeABaseURL || this.scheme == 'file';
	  },
	  // https://url.spec.whatwg.org/#include-credentials
	  includesCredentials: function () {
	    return this.username != '' || this.password != '';
	  },
	  // https://url.spec.whatwg.org/#is-special
	  isSpecial: function () {
	    return hasOwnProperty_1(specialSchemes, this.scheme);
	  },
	  // https://url.spec.whatwg.org/#shorten-a-urls-path
	  shortenPath: function () {
	    var path = this.path;
	    var pathSize = path.length;
	    if (pathSize && (this.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
	      path.length--;
	    }
	  },
	  // https://url.spec.whatwg.org/#concept-url-serializer
	  serialize: function () {
	    var url = this;
	    var scheme = url.scheme;
	    var username = url.username;
	    var password = url.password;
	    var host = url.host;
	    var port = url.port;
	    var path = url.path;
	    var query = url.query;
	    var fragment = url.fragment;
	    var output = scheme + ':';
	    if (host !== null) {
	      output += '//';
	      if (url.includesCredentials()) {
	        output += username + (password ? ':' + password : '') + '@';
	      }
	      output += serializeHost(host);
	      if (port !== null) { output += ':' + port; }
	    } else if (scheme == 'file') { output += '//'; }
	    output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + join(path, '/') : '';
	    if (query !== null) { output += '?' + query; }
	    if (fragment !== null) { output += '#' + fragment; }
	    return output;
	  },
	  // https://url.spec.whatwg.org/#dom-url-href
	  setHref: function (href) {
	    var failure = this.parse(href);
	    if (failure) { throw TypeError$1(failure); }
	    this.searchParams.update();
	  },
	  // https://url.spec.whatwg.org/#dom-url-origin
	  getOrigin: function () {
	    var scheme = this.scheme;
	    var port = this.port;
	    if (scheme == 'blob') { try {
	      return new URLConstructor(scheme.path[0]).origin;
	    } catch (error) {
	      return 'null';
	    } }
	    if (scheme == 'file' || !this.isSpecial()) { return 'null'; }
	    return scheme + '://' + serializeHost(this.host) + (port !== null ? ':' + port : '');
	  },
	  // https://url.spec.whatwg.org/#dom-url-protocol
	  getProtocol: function () {
	    return this.scheme + ':';
	  },
	  setProtocol: function (protocol) {
	    this.parse(toString_1(protocol) + ':', SCHEME_START);
	  },
	  // https://url.spec.whatwg.org/#dom-url-username
	  getUsername: function () {
	    return this.username;
	  },
	  setUsername: function (username) {
	    var codePoints = arrayFrom(toString_1(username));
	    if (this.cannotHaveUsernamePasswordPort()) { return; }
	    this.username = '';
	    for (var i = 0; i < codePoints.length; i++) {
	      this.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
	    }
	  },
	  // https://url.spec.whatwg.org/#dom-url-password
	  getPassword: function () {
	    return this.password;
	  },
	  setPassword: function (password) {
	    var codePoints = arrayFrom(toString_1(password));
	    if (this.cannotHaveUsernamePasswordPort()) { return; }
	    this.password = '';
	    for (var i = 0; i < codePoints.length; i++) {
	      this.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
	    }
	  },
	  // https://url.spec.whatwg.org/#dom-url-host
	  getHost: function () {
	    var host = this.host;
	    var port = this.port;
	    return host === null ? ''
	      : port === null ? serializeHost(host)
	      : serializeHost(host) + ':' + port;
	  },
	  setHost: function (host) {
	    if (this.cannotBeABaseURL) { return; }
	    this.parse(host, HOST);
	  },
	  // https://url.spec.whatwg.org/#dom-url-hostname
	  getHostname: function () {
	    var host = this.host;
	    return host === null ? '' : serializeHost(host);
	  },
	  setHostname: function (hostname) {
	    if (this.cannotBeABaseURL) { return; }
	    this.parse(hostname, HOSTNAME);
	  },
	  // https://url.spec.whatwg.org/#dom-url-port
	  getPort: function () {
	    var port = this.port;
	    return port === null ? '' : toString_1(port);
	  },
	  setPort: function (port) {
	    if (this.cannotHaveUsernamePasswordPort()) { return; }
	    port = toString_1(port);
	    if (port == '') { this.port = null; }
	    else { this.parse(port, PORT); }
	  },
	  // https://url.spec.whatwg.org/#dom-url-pathname
	  getPathname: function () {
	    var path = this.path;
	    return this.cannotBeABaseURL ? path[0] : path.length ? '/' + join(path, '/') : '';
	  },
	  setPathname: function (pathname) {
	    if (this.cannotBeABaseURL) { return; }
	    this.path = [];
	    this.parse(pathname, PATH_START);
	  },
	  // https://url.spec.whatwg.org/#dom-url-search
	  getSearch: function () {
	    var query = this.query;
	    return query ? '?' + query : '';
	  },
	  setSearch: function (search) {
	    search = toString_1(search);
	    if (search == '') {
	      this.query = null;
	    } else {
	      if ('?' == charAt(search, 0)) { search = stringSlice(search, 1); }
	      this.query = '';
	      this.parse(search, QUERY);
	    }
	    this.searchParams.update();
	  },
	  // https://url.spec.whatwg.org/#dom-url-searchparams
	  getSearchParams: function () {
	    return this.searchParams.facade;
	  },
	  // https://url.spec.whatwg.org/#dom-url-hash
	  getHash: function () {
	    var fragment = this.fragment;
	    return fragment ? '#' + fragment : '';
	  },
	  setHash: function (hash) {
	    hash = toString_1(hash);
	    if (hash == '') {
	      this.fragment = null;
	      return;
	    }
	    if ('#' == charAt(hash, 0)) { hash = stringSlice(hash, 1); }
	    this.fragment = '';
	    this.parse(hash, FRAGMENT);
	  },
	  update: function () {
	    this.query = this.searchParams.serialize() || null;
	  }
	};

	// `URL` constructor
	// https://url.spec.whatwg.org/#url-class
	var URLConstructor = function URL(url /* , base */) {
	  var that = anInstance(this, URLPrototype);
	  var base = validateArgumentsLength(arguments.length, 1) > 1 ? arguments[1] : undefined;
	  var state = setInternalState(that, new URLState(url, false, base));
	  if (!descriptors) {
	    that.href = state.serialize();
	    that.origin = state.getOrigin();
	    that.protocol = state.getProtocol();
	    that.username = state.getUsername();
	    that.password = state.getPassword();
	    that.host = state.getHost();
	    that.hostname = state.getHostname();
	    that.port = state.getPort();
	    that.pathname = state.getPathname();
	    that.search = state.getSearch();
	    that.searchParams = state.getSearchParams();
	    that.hash = state.getHash();
	  }
	};

	var URLPrototype = URLConstructor.prototype;

	var accessorDescriptor = function (getter, setter) {
	  return {
	    get: function () {
	      return getInternalURLState(this)[getter]();
	    },
	    set: setter && function (value) {
	      return getInternalURLState(this)[setter](value);
	    },
	    configurable: true,
	    enumerable: true
	  };
	};

	if (descriptors) {
	  // `URL.prototype.href` accessors pair
	  // https://url.spec.whatwg.org/#dom-url-href
	  defineBuiltInAccessor(URLPrototype, 'href', accessorDescriptor('serialize', 'setHref'));
	  // `URL.prototype.origin` getter
	  // https://url.spec.whatwg.org/#dom-url-origin
	  defineBuiltInAccessor(URLPrototype, 'origin', accessorDescriptor('getOrigin'));
	  // `URL.prototype.protocol` accessors pair
	  // https://url.spec.whatwg.org/#dom-url-protocol
	  defineBuiltInAccessor(URLPrototype, 'protocol', accessorDescriptor('getProtocol', 'setProtocol'));
	  // `URL.prototype.username` accessors pair
	  // https://url.spec.whatwg.org/#dom-url-username
	  defineBuiltInAccessor(URLPrototype, 'username', accessorDescriptor('getUsername', 'setUsername'));
	  // `URL.prototype.password` accessors pair
	  // https://url.spec.whatwg.org/#dom-url-password
	  defineBuiltInAccessor(URLPrototype, 'password', accessorDescriptor('getPassword', 'setPassword'));
	  // `URL.prototype.host` accessors pair
	  // https://url.spec.whatwg.org/#dom-url-host
	  defineBuiltInAccessor(URLPrototype, 'host', accessorDescriptor('getHost', 'setHost'));
	  // `URL.prototype.hostname` accessors pair
	  // https://url.spec.whatwg.org/#dom-url-hostname
	  defineBuiltInAccessor(URLPrototype, 'hostname', accessorDescriptor('getHostname', 'setHostname'));
	  // `URL.prototype.port` accessors pair
	  // https://url.spec.whatwg.org/#dom-url-port
	  defineBuiltInAccessor(URLPrototype, 'port', accessorDescriptor('getPort', 'setPort'));
	  // `URL.prototype.pathname` accessors pair
	  // https://url.spec.whatwg.org/#dom-url-pathname
	  defineBuiltInAccessor(URLPrototype, 'pathname', accessorDescriptor('getPathname', 'setPathname'));
	  // `URL.prototype.search` accessors pair
	  // https://url.spec.whatwg.org/#dom-url-search
	  defineBuiltInAccessor(URLPrototype, 'search', accessorDescriptor('getSearch', 'setSearch'));
	  // `URL.prototype.searchParams` getter
	  // https://url.spec.whatwg.org/#dom-url-searchparams
	  defineBuiltInAccessor(URLPrototype, 'searchParams', accessorDescriptor('getSearchParams'));
	  // `URL.prototype.hash` accessors pair
	  // https://url.spec.whatwg.org/#dom-url-hash
	  defineBuiltInAccessor(URLPrototype, 'hash', accessorDescriptor('getHash', 'setHash'));
	}

	// `URL.prototype.toJSON` method
	// https://url.spec.whatwg.org/#dom-url-tojson
	defineBuiltIn(URLPrototype, 'toJSON', function toJSON() {
	  return getInternalURLState(this).serialize();
	}, { enumerable: true });

	// `URL.prototype.toString` method
	// https://url.spec.whatwg.org/#URL-stringification-behavior
	defineBuiltIn(URLPrototype, 'toString', function toString() {
	  return getInternalURLState(this).serialize();
	}, { enumerable: true });

	if (NativeURL) {
	  var nativeCreateObjectURL = NativeURL.createObjectURL;
	  var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
	  // `URL.createObjectURL` method
	  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
	  if (nativeCreateObjectURL) { defineBuiltIn(URLConstructor, 'createObjectURL', functionBindContext(nativeCreateObjectURL, NativeURL)); }
	  // `URL.revokeObjectURL` method
	  // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
	  if (nativeRevokeObjectURL) { defineBuiltIn(URLConstructor, 'revokeObjectURL', functionBindContext(nativeRevokeObjectURL, NativeURL)); }
	}

	setToStringTag(URLConstructor, 'URL');

	_export({ global: true, constructor: true, forced: !urlConstructorDetection, sham: !descriptors }, {
	  URL: URLConstructor
	});

	// `URL.prototype.toJSON` method
	// https://url.spec.whatwg.org/#dom-url-tojson
	_export({ target: 'URL', proto: true, enumerable: true }, {
	  toJSON: function toJSON() {
	    return functionCall(URL.prototype.toString, this);
	  }
	});

	/*
	 * Copyright [2019] [Doric.Pub]
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var __uniqueId__ = 0;
	function uniqueId(prefix) {
	    return "__".concat(prefix, "_").concat(__uniqueId__++, "__");
	}

	function toString(message) {
	    if (message instanceof Function) {
	        return message.toString();
	    }
	    else if (message instanceof Object) {
	        try {
	            return JSON.stringify(message);
	        }
	        catch (e) {
	            return message.toString();
	        }
	    }
	    else if (message === undefined) {
	        return "undefined";
	    }
	    else {
	        return message.toString();
	    }
	}
	function log() {
	    var arguments$1 = arguments;
	    var out = "";
	    for (var i = 0; i < arguments.length; i++) {
	        if (i > 0) {
	            out += ',';
	        }
	        out += toString(arguments$1[i]);
	    }
	    nativeLog('d', out);
	}
	function loge() {
	    var arguments$1 = arguments;
	    var out = "";
	    for (var i = 0; i < arguments.length; i++) {
	        if (i > 0) {
	            out += ',';
	        }
	        out += toString(arguments$1[i]);
	    }
	    nativeLog('e', out);
	}
	function logw() {
	    var arguments$1 = arguments;
	    var out = "";
	    for (var i = 0; i < arguments.length; i++) {
	        if (i > 0) {
	            out += ',';
	        }
	        out += toString(arguments$1[i]);
	    }
	    nativeLog('w', out);
	}

	/*! *****************************************************************************
	Copyright (C) Microsoft. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0

	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.

	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */
	var Reflect$1;
	(function (Reflect) {
	    // Metadata Proposal
	    // https://rbuckton.github.io/reflect-metadata/
	    (function (factory) {
	        var root = typeof commonjsGlobal === "object" ? commonjsGlobal :
	            typeof self === "object" ? self :
	                typeof this === "object" ? this :
	                    Function("return this;")();
	        var exporter = makeExporter(Reflect);
	        if (typeof root.Reflect === "undefined") {
	            root.Reflect = Reflect;
	        }
	        else {
	            exporter = makeExporter(root.Reflect, exporter);
	        }
	        factory(exporter);
	        function makeExporter(target, previous) {
	            return function (key, value) {
	                if (typeof target[key] !== "function") {
	                    Object.defineProperty(target, key, { configurable: true, writable: true, value: value });
	                }
	                if (previous)
	                    { previous(key, value); }
	            };
	        }
	    })(function (exporter) {
	        var hasOwn = Object.prototype.hasOwnProperty;
	        // feature test for Symbol support
	        var supportsSymbol = typeof Symbol === "function";
	        var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
	        var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
	        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
	        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
	        var downLevel = !supportsCreate && !supportsProto;
	        var HashMap = {
	            // create an object in dictionary mode (a.k.a. "slow" mode in v8)
	            create: supportsCreate
	                ? function () { return MakeDictionary(Object.create(null)); }
	                : supportsProto
	                    ? function () { return MakeDictionary({ __proto__: null }); }
	                    : function () { return MakeDictionary({}); },
	            has: downLevel
	                ? function (map, key) { return hasOwn.call(map, key); }
	                : function (map, key) { return key in map; },
	            get: downLevel
	                ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
	                : function (map, key) { return map[key]; },
	        };
	        // Load global or shim versions of Map, Set, and WeakMap
	        var functionPrototype = Object.getPrototypeOf(Function);
	        var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
	        var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
	        var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
	        var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
	        // [[Metadata]] internal slot
	        // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
	        var Metadata = new _WeakMap();
	        /**
	         * Applies a set of decorators to a property of a target object.
	         * @param decorators An array of decorators.
	         * @param target The target object.
	         * @param propertyKey (Optional) The property key to decorate.
	         * @param attributes (Optional) The property descriptor for the target key.
	         * @remarks Decorators are applied in reverse order.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     Example = Reflect.decorate(decoratorsArray, Example);
	         *
	         *     // property (on constructor)
	         *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     Object.defineProperty(Example, "staticMethod",
	         *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
	         *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
	         *
	         *     // method (on prototype)
	         *     Object.defineProperty(Example.prototype, "method",
	         *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
	         *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
	         *
	         */
	        function decorate(decorators, target, propertyKey, attributes) {
	            if (!IsUndefined(propertyKey)) {
	                if (!IsArray(decorators))
	                    { throw new TypeError(); }
	                if (!IsObject(target))
	                    { throw new TypeError(); }
	                if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
	                    { throw new TypeError(); }
	                if (IsNull(attributes))
	                    { attributes = undefined; }
	                propertyKey = ToPropertyKey(propertyKey);
	                return DecorateProperty(decorators, target, propertyKey, attributes);
	            }
	            else {
	                if (!IsArray(decorators))
	                    { throw new TypeError(); }
	                if (!IsConstructor(target))
	                    { throw new TypeError(); }
	                return DecorateConstructor(decorators, target);
	            }
	        }
	        exporter("decorate", decorate);
	        // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
	        // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
	        /**
	         * A default metadata decorator factory that can be used on a class, class member, or parameter.
	         * @param metadataKey The key for the metadata entry.
	         * @param metadataValue The value for the metadata entry.
	         * @returns A decorator function.
	         * @remarks
	         * If `metadataKey` is already defined for the target and target key, the
	         * metadataValue for that key will be overwritten.
	         * @example
	         *
	         *     // constructor
	         *     @Reflect.metadata(key, value)
	         *     class Example {
	         *     }
	         *
	         *     // property (on constructor, TypeScript only)
	         *     class Example {
	         *         @Reflect.metadata(key, value)
	         *         static staticProperty;
	         *     }
	         *
	         *     // property (on prototype, TypeScript only)
	         *     class Example {
	         *         @Reflect.metadata(key, value)
	         *         property;
	         *     }
	         *
	         *     // method (on constructor)
	         *     class Example {
	         *         @Reflect.metadata(key, value)
	         *         static staticMethod() { }
	         *     }
	         *
	         *     // method (on prototype)
	         *     class Example {
	         *         @Reflect.metadata(key, value)
	         *         method() { }
	         *     }
	         *
	         */
	        function metadata(metadataKey, metadataValue) {
	            function decorator(target, propertyKey) {
	                if (!IsObject(target))
	                    { throw new TypeError(); }
	                if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
	                    { throw new TypeError(); }
	                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
	            }
	            return decorator;
	        }
	        exporter("metadata", metadata);
	        /**
	         * Define a unique metadata entry on the target.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param metadataValue A value that contains attached metadata.
	         * @param target The target object on which to define metadata.
	         * @param propertyKey (Optional) The property key for the target.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     Reflect.defineMetadata("custom:annotation", options, Example);
	         *
	         *     // property (on constructor)
	         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
	         *
	         *     // decorator factory as metadata-producing annotation.
	         *     function MyAnnotation(options): Decorator {
	         *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
	         *     }
	         *
	         */
	        function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
	            if (!IsObject(target))
	                { throw new TypeError(); }
	            if (!IsUndefined(propertyKey))
	                { propertyKey = ToPropertyKey(propertyKey); }
	            return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
	        }
	        exporter("defineMetadata", defineMetadata);
	        /**
	         * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.hasMetadata("custom:annotation", Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
	         *
	         */
	        function hasMetadata(metadataKey, target, propertyKey) {
	            if (!IsObject(target))
	                { throw new TypeError(); }
	            if (!IsUndefined(propertyKey))
	                { propertyKey = ToPropertyKey(propertyKey); }
	            return OrdinaryHasMetadata(metadataKey, target, propertyKey);
	        }
	        exporter("hasMetadata", hasMetadata);
	        /**
	         * Gets a value indicating whether the target object has the provided metadata key defined.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
	         *
	         */
	        function hasOwnMetadata(metadataKey, target, propertyKey) {
	            if (!IsObject(target))
	                { throw new TypeError(); }
	            if (!IsUndefined(propertyKey))
	                { propertyKey = ToPropertyKey(propertyKey); }
	            return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
	        }
	        exporter("hasOwnMetadata", hasOwnMetadata);
	        /**
	         * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.getMetadata("custom:annotation", Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
	         *
	         */
	        function getMetadata(metadataKey, target, propertyKey) {
	            if (!IsObject(target))
	                { throw new TypeError(); }
	            if (!IsUndefined(propertyKey))
	                { propertyKey = ToPropertyKey(propertyKey); }
	            return OrdinaryGetMetadata(metadataKey, target, propertyKey);
	        }
	        exporter("getMetadata", getMetadata);
	        /**
	         * Gets the metadata value for the provided metadata key on the target object.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.getOwnMetadata("custom:annotation", Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
	         *
	         */
	        function getOwnMetadata(metadataKey, target, propertyKey) {
	            if (!IsObject(target))
	                { throw new TypeError(); }
	            if (!IsUndefined(propertyKey))
	                { propertyKey = ToPropertyKey(propertyKey); }
	            return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
	        }
	        exporter("getOwnMetadata", getOwnMetadata);
	        /**
	         * Gets the metadata keys defined on the target object or its prototype chain.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns An array of unique metadata keys.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.getMetadataKeys(Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.getMetadataKeys(Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.getMetadataKeys(Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.getMetadataKeys(Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.getMetadataKeys(Example.prototype, "method");
	         *
	         */
	        function getMetadataKeys(target, propertyKey) {
	            if (!IsObject(target))
	                { throw new TypeError(); }
	            if (!IsUndefined(propertyKey))
	                { propertyKey = ToPropertyKey(propertyKey); }
	            return OrdinaryMetadataKeys(target, propertyKey);
	        }
	        exporter("getMetadataKeys", getMetadataKeys);
	        /**
	         * Gets the unique metadata keys defined on the target object.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns An array of unique metadata keys.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.getOwnMetadataKeys(Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
	         *
	         */
	        function getOwnMetadataKeys(target, propertyKey) {
	            if (!IsObject(target))
	                { throw new TypeError(); }
	            if (!IsUndefined(propertyKey))
	                { propertyKey = ToPropertyKey(propertyKey); }
	            return OrdinaryOwnMetadataKeys(target, propertyKey);
	        }
	        exporter("getOwnMetadataKeys", getOwnMetadataKeys);
	        /**
	         * Deletes the metadata entry from the target object with the provided key.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns `true` if the metadata entry was found and deleted; otherwise, false.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.deleteMetadata("custom:annotation", Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
	         *
	         */
	        function deleteMetadata(metadataKey, target, propertyKey) {
	            if (!IsObject(target))
	                { throw new TypeError(); }
	            if (!IsUndefined(propertyKey))
	                { propertyKey = ToPropertyKey(propertyKey); }
	            var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
	            if (IsUndefined(metadataMap))
	                { return false; }
	            if (!metadataMap.delete(metadataKey))
	                { return false; }
	            if (metadataMap.size > 0)
	                { return true; }
	            var targetMetadata = Metadata.get(target);
	            targetMetadata.delete(propertyKey);
	            if (targetMetadata.size > 0)
	                { return true; }
	            Metadata.delete(target);
	            return true;
	        }
	        exporter("deleteMetadata", deleteMetadata);
	        function DecorateConstructor(decorators, target) {
	            for (var i = decorators.length - 1; i >= 0; --i) {
	                var decorator = decorators[i];
	                var decorated = decorator(target);
	                if (!IsUndefined(decorated) && !IsNull(decorated)) {
	                    if (!IsConstructor(decorated))
	                        { throw new TypeError(); }
	                    target = decorated;
	                }
	            }
	            return target;
	        }
	        function DecorateProperty(decorators, target, propertyKey, descriptor) {
	            for (var i = decorators.length - 1; i >= 0; --i) {
	                var decorator = decorators[i];
	                var decorated = decorator(target, propertyKey, descriptor);
	                if (!IsUndefined(decorated) && !IsNull(decorated)) {
	                    if (!IsObject(decorated))
	                        { throw new TypeError(); }
	                    descriptor = decorated;
	                }
	            }
	            return descriptor;
	        }
	        function GetOrCreateMetadataMap(O, P, Create) {
	            var targetMetadata = Metadata.get(O);
	            if (IsUndefined(targetMetadata)) {
	                if (!Create)
	                    { return undefined; }
	                targetMetadata = new _Map();
	                Metadata.set(O, targetMetadata);
	            }
	            var metadataMap = targetMetadata.get(P);
	            if (IsUndefined(metadataMap)) {
	                if (!Create)
	                    { return undefined; }
	                metadataMap = new _Map();
	                targetMetadata.set(P, metadataMap);
	            }
	            return metadataMap;
	        }
	        // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
	        function OrdinaryHasMetadata(MetadataKey, O, P) {
	            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
	            if (hasOwn)
	                { return true; }
	            var parent = OrdinaryGetPrototypeOf(O);
	            if (!IsNull(parent))
	                { return OrdinaryHasMetadata(MetadataKey, parent, P); }
	            return false;
	        }
	        // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
	        function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
	            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
	            if (IsUndefined(metadataMap))
	                { return false; }
	            return ToBoolean(metadataMap.has(MetadataKey));
	        }
	        // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
	        function OrdinaryGetMetadata(MetadataKey, O, P) {
	            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
	            if (hasOwn)
	                { return OrdinaryGetOwnMetadata(MetadataKey, O, P); }
	            var parent = OrdinaryGetPrototypeOf(O);
	            if (!IsNull(parent))
	                { return OrdinaryGetMetadata(MetadataKey, parent, P); }
	            return undefined;
	        }
	        // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
	        function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
	            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
	            if (IsUndefined(metadataMap))
	                { return undefined; }
	            return metadataMap.get(MetadataKey);
	        }
	        // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
	        function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
	            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
	            metadataMap.set(MetadataKey, MetadataValue);
	        }
	        // 3.1.6.1 OrdinaryMetadataKeys(O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
	        function OrdinaryMetadataKeys(O, P) {
	            var ownKeys = OrdinaryOwnMetadataKeys(O, P);
	            var parent = OrdinaryGetPrototypeOf(O);
	            if (parent === null)
	                { return ownKeys; }
	            var parentKeys = OrdinaryMetadataKeys(parent, P);
	            if (parentKeys.length <= 0)
	                { return ownKeys; }
	            if (ownKeys.length <= 0)
	                { return parentKeys; }
	            var set = new _Set();
	            var keys = [];
	            for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
	                var key = ownKeys_1[_i];
	                var hasKey = set.has(key);
	                if (!hasKey) {
	                    set.add(key);
	                    keys.push(key);
	                }
	            }
	            for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
	                var key = parentKeys_1[_a];
	                var hasKey = set.has(key);
	                if (!hasKey) {
	                    set.add(key);
	                    keys.push(key);
	                }
	            }
	            return keys;
	        }
	        // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
	        function OrdinaryOwnMetadataKeys(O, P) {
	            var keys = [];
	            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
	            if (IsUndefined(metadataMap))
	                { return keys; }
	            var keysObj = metadataMap.keys();
	            var iterator = GetIterator(keysObj);
	            var k = 0;
	            while (true) {
	                var next = IteratorStep(iterator);
	                if (!next) {
	                    keys.length = k;
	                    return keys;
	                }
	                var nextValue = IteratorValue(next);
	                try {
	                    keys[k] = nextValue;
	                }
	                catch (e) {
	                    try {
	                        IteratorClose(iterator);
	                    }
	                    finally {
	                        throw e;
	                    }
	                }
	                k++;
	            }
	        }
	        // 6 ECMAScript Data Typ0es and Values
	        // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
	        function Type(x) {
	            if (x === null)
	                { return 1 /* Null */; }
	            switch (typeof x) {
	                case "undefined": return 0 /* Undefined */;
	                case "boolean": return 2 /* Boolean */;
	                case "string": return 3 /* String */;
	                case "symbol": return 4 /* Symbol */;
	                case "number": return 5 /* Number */;
	                case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
	                default: return 6 /* Object */;
	            }
	        }
	        // 6.1.1 The Undefined Type
	        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
	        function IsUndefined(x) {
	            return x === undefined;
	        }
	        // 6.1.2 The Null Type
	        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
	        function IsNull(x) {
	            return x === null;
	        }
	        // 6.1.5 The Symbol Type
	        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
	        function IsSymbol(x) {
	            return typeof x === "symbol";
	        }
	        // 6.1.7 The Object Type
	        // https://tc39.github.io/ecma262/#sec-object-type
	        function IsObject(x) {
	            return typeof x === "object" ? x !== null : typeof x === "function";
	        }
	        // 7.1 Type Conversion
	        // https://tc39.github.io/ecma262/#sec-type-conversion
	        // 7.1.1 ToPrimitive(input [, PreferredType])
	        // https://tc39.github.io/ecma262/#sec-toprimitive
	        function ToPrimitive(input, PreferredType) {
	            switch (Type(input)) {
	                case 0 /* Undefined */: return input;
	                case 1 /* Null */: return input;
	                case 2 /* Boolean */: return input;
	                case 3 /* String */: return input;
	                case 4 /* Symbol */: return input;
	                case 5 /* Number */: return input;
	            }
	            var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
	            var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
	            if (exoticToPrim !== undefined) {
	                var result = exoticToPrim.call(input, hint);
	                if (IsObject(result))
	                    { throw new TypeError(); }
	                return result;
	            }
	            return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
	        }
	        // 7.1.1.1 OrdinaryToPrimitive(O, hint)
	        // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
	        function OrdinaryToPrimitive(O, hint) {
	            if (hint === "string") {
	                var toString_1 = O.toString;
	                if (IsCallable(toString_1)) {
	                    var result = toString_1.call(O);
	                    if (!IsObject(result))
	                        { return result; }
	                }
	                var valueOf = O.valueOf;
	                if (IsCallable(valueOf)) {
	                    var result = valueOf.call(O);
	                    if (!IsObject(result))
	                        { return result; }
	                }
	            }
	            else {
	                var valueOf = O.valueOf;
	                if (IsCallable(valueOf)) {
	                    var result = valueOf.call(O);
	                    if (!IsObject(result))
	                        { return result; }
	                }
	                var toString_2 = O.toString;
	                if (IsCallable(toString_2)) {
	                    var result = toString_2.call(O);
	                    if (!IsObject(result))
	                        { return result; }
	                }
	            }
	            throw new TypeError();
	        }
	        // 7.1.2 ToBoolean(argument)
	        // https://tc39.github.io/ecma262/2016/#sec-toboolean
	        function ToBoolean(argument) {
	            return !!argument;
	        }
	        // 7.1.12 ToString(argument)
	        // https://tc39.github.io/ecma262/#sec-tostring
	        function ToString(argument) {
	            return "" + argument;
	        }
	        // 7.1.14 ToPropertyKey(argument)
	        // https://tc39.github.io/ecma262/#sec-topropertykey
	        function ToPropertyKey(argument) {
	            var key = ToPrimitive(argument, 3 /* String */);
	            if (IsSymbol(key))
	                { return key; }
	            return ToString(key);
	        }
	        // 7.2 Testing and Comparison Operations
	        // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
	        // 7.2.2 IsArray(argument)
	        // https://tc39.github.io/ecma262/#sec-isarray
	        function IsArray(argument) {
	            return Array.isArray
	                ? Array.isArray(argument)
	                : argument instanceof Object
	                    ? argument instanceof Array
	                    : Object.prototype.toString.call(argument) === "[object Array]";
	        }
	        // 7.2.3 IsCallable(argument)
	        // https://tc39.github.io/ecma262/#sec-iscallable
	        function IsCallable(argument) {
	            // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
	            return typeof argument === "function";
	        }
	        // 7.2.4 IsConstructor(argument)
	        // https://tc39.github.io/ecma262/#sec-isconstructor
	        function IsConstructor(argument) {
	            // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
	            return typeof argument === "function";
	        }
	        // 7.2.7 IsPropertyKey(argument)
	        // https://tc39.github.io/ecma262/#sec-ispropertykey
	        function IsPropertyKey(argument) {
	            switch (Type(argument)) {
	                case 3 /* String */: return true;
	                case 4 /* Symbol */: return true;
	                default: return false;
	            }
	        }
	        // 7.3 Operations on Objects
	        // https://tc39.github.io/ecma262/#sec-operations-on-objects
	        // 7.3.9 GetMethod(V, P)
	        // https://tc39.github.io/ecma262/#sec-getmethod
	        function GetMethod(V, P) {
	            var func = V[P];
	            if (func === undefined || func === null)
	                { return undefined; }
	            if (!IsCallable(func))
	                { throw new TypeError(); }
	            return func;
	        }
	        // 7.4 Operations on Iterator Objects
	        // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
	        function GetIterator(obj) {
	            var method = GetMethod(obj, iteratorSymbol);
	            if (!IsCallable(method))
	                { throw new TypeError(); } // from Call
	            var iterator = method.call(obj);
	            if (!IsObject(iterator))
	                { throw new TypeError(); }
	            return iterator;
	        }
	        // 7.4.4 IteratorValue(iterResult)
	        // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
	        function IteratorValue(iterResult) {
	            return iterResult.value;
	        }
	        // 7.4.5 IteratorStep(iterator)
	        // https://tc39.github.io/ecma262/#sec-iteratorstep
	        function IteratorStep(iterator) {
	            var result = iterator.next();
	            return result.done ? false : result;
	        }
	        // 7.4.6 IteratorClose(iterator, completion)
	        // https://tc39.github.io/ecma262/#sec-iteratorclose
	        function IteratorClose(iterator) {
	            var f = iterator["return"];
	            if (f)
	                { f.call(iterator); }
	        }
	        // 9.1 Ordinary Object Internal Methods and Internal Slots
	        // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
	        // 9.1.1.1 OrdinaryGetPrototypeOf(O)
	        // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
	        function OrdinaryGetPrototypeOf(O) {
	            var proto = Object.getPrototypeOf(O);
	            if (typeof O !== "function" || O === functionPrototype)
	                { return proto; }
	            // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
	            // Try to determine the superclass constructor. Compatible implementations
	            // must either set __proto__ on a subclass constructor to the superclass constructor,
	            // or ensure each class has a valid `constructor` property on its prototype that
	            // points back to the constructor.
	            // If this is not the same as Function.[[Prototype]], then this is definately inherited.
	            // This is the case when in ES6 or when using __proto__ in a compatible browser.
	            if (proto !== functionPrototype)
	                { return proto; }
	            // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
	            var prototype = O.prototype;
	            var prototypeProto = prototype && Object.getPrototypeOf(prototype);
	            if (prototypeProto == null || prototypeProto === Object.prototype)
	                { return proto; }
	            // If the constructor was not a function, then we cannot determine the heritage.
	            var constructor = prototypeProto.constructor;
	            if (typeof constructor !== "function")
	                { return proto; }
	            // If we have some kind of self-reference, then we cannot determine the heritage.
	            if (constructor === O)
	                { return proto; }
	            // we have a pretty good guess at the heritage.
	            return constructor;
	        }
	        // naive Map shim
	        function CreateMapPolyfill() {
	            var cacheSentinel = {};
	            var arraySentinel = [];
	            var MapIterator = /** @class */ (function () {
	                function MapIterator(keys, values, selector) {
	                    this._index = 0;
	                    this._keys = keys;
	                    this._values = values;
	                    this._selector = selector;
	                }
	                MapIterator.prototype["@@iterator"] = function () { return this; };
	                MapIterator.prototype[iteratorSymbol] = function () { return this; };
	                MapIterator.prototype.next = function () {
	                    var index = this._index;
	                    if (index >= 0 && index < this._keys.length) {
	                        var result = this._selector(this._keys[index], this._values[index]);
	                        if (index + 1 >= this._keys.length) {
	                            this._index = -1;
	                            this._keys = arraySentinel;
	                            this._values = arraySentinel;
	                        }
	                        else {
	                            this._index++;
	                        }
	                        return { value: result, done: false };
	                    }
	                    return { value: undefined, done: true };
	                };
	                MapIterator.prototype.throw = function (error) {
	                    if (this._index >= 0) {
	                        this._index = -1;
	                        this._keys = arraySentinel;
	                        this._values = arraySentinel;
	                    }
	                    throw error;
	                };
	                MapIterator.prototype.return = function (value) {
	                    if (this._index >= 0) {
	                        this._index = -1;
	                        this._keys = arraySentinel;
	                        this._values = arraySentinel;
	                    }
	                    return { value: value, done: true };
	                };
	                return MapIterator;
	            }());
	            return /** @class */ (function () {
	                function Map() {
	                    this._keys = [];
	                    this._values = [];
	                    this._cacheKey = cacheSentinel;
	                    this._cacheIndex = -2;
	                }
	                Object.defineProperty(Map.prototype, "size", {
	                    get: function () { return this._keys.length; },
	                    enumerable: true,
	                    configurable: true
	                });
	                Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
	                Map.prototype.get = function (key) {
	                    var index = this._find(key, /*insert*/ false);
	                    return index >= 0 ? this._values[index] : undefined;
	                };
	                Map.prototype.set = function (key, value) {
	                    var index = this._find(key, /*insert*/ true);
	                    this._values[index] = value;
	                    return this;
	                };
	                Map.prototype.delete = function (key) {
	                    var index = this._find(key, /*insert*/ false);
	                    if (index >= 0) {
	                        var size = this._keys.length;
	                        for (var i = index + 1; i < size; i++) {
	                            this._keys[i - 1] = this._keys[i];
	                            this._values[i - 1] = this._values[i];
	                        }
	                        this._keys.length--;
	                        this._values.length--;
	                        if (key === this._cacheKey) {
	                            this._cacheKey = cacheSentinel;
	                            this._cacheIndex = -2;
	                        }
	                        return true;
	                    }
	                    return false;
	                };
	                Map.prototype.clear = function () {
	                    this._keys.length = 0;
	                    this._values.length = 0;
	                    this._cacheKey = cacheSentinel;
	                    this._cacheIndex = -2;
	                };
	                Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
	                Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
	                Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
	                Map.prototype["@@iterator"] = function () { return this.entries(); };
	                Map.prototype[iteratorSymbol] = function () { return this.entries(); };
	                Map.prototype._find = function (key, insert) {
	                    if (this._cacheKey !== key) {
	                        this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
	                    }
	                    if (this._cacheIndex < 0 && insert) {
	                        this._cacheIndex = this._keys.length;
	                        this._keys.push(key);
	                        this._values.push(undefined);
	                    }
	                    return this._cacheIndex;
	                };
	                return Map;
	            }());
	            function getKey(key, _) {
	                return key;
	            }
	            function getValue(_, value) {
	                return value;
	            }
	            function getEntry(key, value) {
	                return [key, value];
	            }
	        }
	        // naive Set shim
	        function CreateSetPolyfill() {
	            return /** @class */ (function () {
	                function Set() {
	                    this._map = new _Map();
	                }
	                Object.defineProperty(Set.prototype, "size", {
	                    get: function () { return this._map.size; },
	                    enumerable: true,
	                    configurable: true
	                });
	                Set.prototype.has = function (value) { return this._map.has(value); };
	                Set.prototype.add = function (value) { return this._map.set(value, value), this; };
	                Set.prototype.delete = function (value) { return this._map.delete(value); };
	                Set.prototype.clear = function () { this._map.clear(); };
	                Set.prototype.keys = function () { return this._map.keys(); };
	                Set.prototype.values = function () { return this._map.values(); };
	                Set.prototype.entries = function () { return this._map.entries(); };
	                Set.prototype["@@iterator"] = function () { return this.keys(); };
	                Set.prototype[iteratorSymbol] = function () { return this.keys(); };
	                return Set;
	            }());
	        }
	        // naive WeakMap shim
	        function CreateWeakMapPolyfill() {
	            var UUID_SIZE = 16;
	            var keys = HashMap.create();
	            var rootKey = CreateUniqueKey();
	            return /** @class */ (function () {
	                function WeakMap() {
	                    this._key = CreateUniqueKey();
	                }
	                WeakMap.prototype.has = function (target) {
	                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
	                    return table !== undefined ? HashMap.has(table, this._key) : false;
	                };
	                WeakMap.prototype.get = function (target) {
	                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
	                    return table !== undefined ? HashMap.get(table, this._key) : undefined;
	                };
	                WeakMap.prototype.set = function (target, value) {
	                    var table = GetOrCreateWeakMapTable(target, /*create*/ true);
	                    table[this._key] = value;
	                    return this;
	                };
	                WeakMap.prototype.delete = function (target) {
	                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
	                    return table !== undefined ? delete table[this._key] : false;
	                };
	                WeakMap.prototype.clear = function () {
	                    // NOTE: not a real clear, just makes the previous data unreachable
	                    this._key = CreateUniqueKey();
	                };
	                return WeakMap;
	            }());
	            function CreateUniqueKey() {
	                var key;
	                do
	                    { key = "@@WeakMap@@" + CreateUUID(); }
	                while (HashMap.has(keys, key));
	                keys[key] = true;
	                return key;
	            }
	            function GetOrCreateWeakMapTable(target, create) {
	                if (!hasOwn.call(target, rootKey)) {
	                    if (!create)
	                        { return undefined; }
	                    Object.defineProperty(target, rootKey, { value: HashMap.create() });
	                }
	                return target[rootKey];
	            }
	            function FillRandomBytes(buffer, size) {
	                for (var i = 0; i < size; ++i)
	                    { buffer[i] = Math.random() * 0xff | 0; }
	                return buffer;
	            }
	            function GenRandomBytes(size) {
	                if (typeof Uint8Array === "function") {
	                    if (typeof crypto !== "undefined")
	                        { return crypto.getRandomValues(new Uint8Array(size)); }
	                    if (typeof msCrypto !== "undefined")
	                        { return msCrypto.getRandomValues(new Uint8Array(size)); }
	                    return FillRandomBytes(new Uint8Array(size), size);
	                }
	                return FillRandomBytes(new Array(size), size);
	            }
	            function CreateUUID() {
	                var data = GenRandomBytes(UUID_SIZE);
	                // mark as random - RFC 4122 § 4.4
	                data[6] = data[6] & 0x4f | 0x40;
	                data[8] = data[8] & 0xbf | 0x80;
	                var result = "";
	                for (var offset = 0; offset < UUID_SIZE; ++offset) {
	                    var byte = data[offset];
	                    if (offset === 4 || offset === 6 || offset === 8)
	                        { result += "-"; }
	                    if (byte < 16)
	                        { result += "0"; }
	                    result += byte.toString(16).toLowerCase();
	                }
	                return result;
	            }
	        }
	        // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
	        function MakeDictionary(obj) {
	            obj.__ = undefined;
	            delete obj.__;
	            return obj;
	        }
	    });
	})(Reflect$1 || (Reflect$1 = {}));

	/*
	 * Copyright [2019] [Doric.Pub]
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	function hookBeforeNativeCall(context) {
	    if (context) {
	        setContext(context);
	        context.hookBeforeNativeCall();
	    }
	}
	function getContext() {
	    return Reflect.getMetadata('__doric_context__', global$2);
	}
	function setContext(context) {
	    Reflect.defineMetadata('__doric_context__', context, global$2);
	}
	function jsCallResolve(contextId, callbackId, args) {
	    var arguments$1 = arguments;

	    var context = gContexts.get(contextId);
	    if (context === undefined) {
	        loge("Cannot find context for context id:".concat(contextId));
	        return;
	    }
	    var callback = context.callbacks.get(callbackId);
	    if (callback === undefined) {
	        loge("Cannot find call for context id:".concat(contextId, ",callback id:").concat(callbackId));
	        return;
	    }
	    var argumentsList = [];
	    for (var i = 2; i < arguments.length; i++) {
	        argumentsList.push(arguments$1[i]);
	    }
	    hookBeforeNativeCall(context);
	    Reflect.apply(callback.resolve, context, argumentsList);
	}
	function jsCallReject(contextId, callbackId, args) {
	    var arguments$1 = arguments;

	    var context = gContexts.get(contextId);
	    if (context === undefined) {
	        loge("Cannot find context for context id:".concat(contextId));
	        return;
	    }
	    var callback = context.callbacks.get(callbackId);
	    if (callback === undefined) {
	        loge("Cannot find call for context id:".concat(contextId, ",callback id:").concat(callbackId));
	        return;
	    }
	    var argumentsList = [];
	    for (var i = 2; i < arguments.length; i++) {
	        argumentsList.push(arguments$1[i]);
	    }
	    hookBeforeNativeCall(context);
	    Reflect.apply(callback.reject, context.entity, argumentsList);
	}
	var Context = /** @class */ (function () {
	    function Context(id) {
	        this.callbacks = new Map;
	        this.classes = new Map;
	        this.id = id;
	    }
	    Context.prototype.hookBeforeNativeCall = function () {
	        if (this.entity && Reflect.has(this.entity, 'hookBeforeNativeCall')) {
	            Reflect.apply(Reflect.get(this.entity, 'hookBeforeNativeCall'), this.entity, []);
	        }
	    };
	    Context.prototype.hookAfterNativeCall = function () {
	        if (this.entity && Reflect.has(this.entity, 'hookAfterNativeCall')) {
	            Reflect.apply(Reflect.get(this.entity, 'hookAfterNativeCall'), this.entity, []);
	        }
	    };
	    Context.prototype.callNative = function (namespace, method, args) {
	        var _this = this;
	        var callbackId = uniqueId('callback');
	        return new Promise(function (resolve, reject) {
	            _this.callbacks.set(callbackId, {
	                resolve: resolve,
	                reject: reject,
	            });
	            nativeBridge(_this.id, namespace, method, callbackId, args);
	        });
	    };
	    Context.prototype.register = function (instance) {
	        this.entity = instance;
	    };
	    Context.prototype.function2Id = function (func) {
	        var functionId = uniqueId('function');
	        this.callbacks.set(functionId, {
	            resolve: func,
	            reject: function () { loge("This should not be called"); }
	        });
	        return functionId;
	    };
	    Context.prototype.removeFuncById = function (funcId) {
	        this.callbacks.delete(funcId);
	    };
	    return Context;
	}());
	var gContexts = new Map;
	var gModules = new Map;
	function allContexts() {
	    return gContexts.values();
	}
	function jsObtainContext(id) {
	    if (gContexts.has(id)) {
	        var context_1 = gContexts.get(id);
	        setContext(context_1);
	        return context_1;
	    }
	    else {
	        var context_2 = new Context(id);
	        gContexts.set(id, context_2);
	        setContext(context_2);
	        return context_2;
	    }
	}
	function jsReleaseContext(id) {
	    var context = gContexts.get(id);
	    var args = arguments;
	    if (context) {
	        timerInfos.forEach(function (v, k) {
	            if (v.context === context) {
	                if (global$2.nativeClearTimer === undefined) {
	                    return Reflect.apply(_clearTimeout, undefined, args);
	                }
	                timerInfos.delete(k);
	                nativeClearTimer(k);
	            }
	        });
	    }
	    gContexts.delete(id);
	}
	function __require__(name) {
	    if (gModules.has(name)) {
	        return gModules.get(name);
	    }
	    else {
	        if (nativeRequire(name)) {
	            return gModules.get(name);
	        }
	        else {
	            return undefined;
	        }
	    }
	}
	function jsRegisterModule(name, moduleObject) {
	    gModules.set(name, moduleObject);
	}
	function jsCallEntityMethod(contextId, methodName, args) {
	    var arguments$1 = arguments;

	    var context = gContexts.get(contextId);
	    if (context === undefined) {
	        loge("Cannot find context for context id:".concat(contextId));
	        return;
	    }
	    if (context.entity === undefined) {
	        loge("Cannot find holder for context id:".concat(contextId));
	        return;
	    }
	    if (Reflect.has(context.entity, methodName)) {
	        var argumentsList = [];
	        for (var i = 2; i < arguments.length; i++) {
	            argumentsList.push(arguments$1[i]);
	        }
	        hookBeforeNativeCall(context);
	        var ret = Reflect.apply(Reflect.get(context.entity, methodName), context.entity, argumentsList);
	        return ret;
	    }
	    else {
	        loge("Cannot find method for context id:".concat(contextId, ",method name is:").concat(methodName));
	    }
	}
	function pureCallEntityMethod(contextId, methodName, args) {
	    var arguments$1 = arguments;

	    var context = gContexts.get(contextId);
	    if (context === undefined) {
	        loge("Cannot find context for context id:".concat(contextId));
	        return;
	    }
	    if (context.entity === undefined) {
	        loge("Cannot find holder for context id:".concat(contextId));
	        return;
	    }
	    if (Reflect.has(context.entity, methodName)) {
	        var argumentsList = [];
	        for (var i = 2; i < arguments.length; i++) {
	            argumentsList.push(arguments$1[i]);
	        }
	        return Reflect.apply(Reflect.get(context.entity, methodName), context.entity, argumentsList);
	    }
	    else {
	        loge("Cannot find method for context id:".concat(contextId, ",method name is:").concat(methodName));
	    }
	}
	function jsObtainEntry(contextId) {
	    var context = jsObtainContext(contextId);
	    var exportFunc = function (constructor) {
	        context === null || context === void 0 ? void 0 : context.classes.set(constructor.name, constructor);
	        var ret = new constructor;
	        Reflect.set(ret, 'context', context);
	        context === null || context === void 0 ? void 0 : context.register(ret);
	        return constructor;
	    };
	    return function () {
	        if (arguments.length === 1) {
	            var args = arguments[0];
	            if (args instanceof Array) {
	                args.forEach(function (clz) {
	                    var _a;
	                    (_a = context === null || context === void 0 ? void 0 : context.classes) === null || _a === void 0 ? void 0 : _a.set(clz.name, clz);
	                });
	                return exportFunc;
	            }
	            else {
	                return exportFunc(args);
	            }
	        }
	        else if (arguments.length === 2) {
	            var srcContextId = arguments[0];
	            var className = arguments[1];
	            var srcContext = gContexts.get(srcContextId);
	            if (srcContext) {
	                srcContext.classes.forEach(function (v, k) {
	                    context === null || context === void 0 ? void 0 : context.classes.set(k, v);
	                });
	                var clz = srcContext.classes.get(className);
	                if (clz) {
	                    return exportFunc(clz);
	                }
	                else {
	                    throw new Error("Cannot find class:".concat(className, " in context:").concat(srcContextId));
	                }
	            }
	            else {
	                throw new Error("Cannot find context for ".concat(srcContextId));
	            }
	        }
	        else {
	            throw new Error("Entry arguments error:".concat(arguments));
	        }
	    };
	}
	var global$2 = Function('return this')();
	if (global$2.Envrionemnt &&
	    (Environment.platform === 'Android'
	        || Environment.platform === 'iOS'
	        || Environment.platform === 'Qt')) {
	    Reflect.set(global$2, "console", {
	        warn: logw,
	        error: loge,
	        log: log
	    });
	}
	var __timerId__ = 1;
	var timerInfos = new Map;
	var _setTimeout = global$2.setTimeout;
	var _setInterval = global$2.setInterval;
	var _clearTimeout = global$2.clearTimeout;
	var _clearInterval = global$2.clearInterval;
	var doricSetTimeout = function (handler, timeout) {
	    var arguments$1 = arguments;

	    var args = [];
	    for (var _i = 2; _i < arguments.length; _i++) {
	        args[_i - 2] = arguments$1[_i];
	    }
	    if (global$2.nativeSetTimer === undefined) {
	        return Reflect.apply(_setTimeout, undefined, arguments);
	    }
	    var id = __timerId__++;
	    timerInfos.set(id, {
	        callback: function () {
	            Reflect.apply(handler, undefined, args);
	            timerInfos.delete(id);
	        },
	        context: getContext(),
	    });
	    nativeSetTimer(id, timeout || 0, false);
	    return id;
	};
	var doricSetInterval = function (handler, timeout) {
	    var arguments$1 = arguments;

	    var args = [];
	    for (var _i = 2; _i < arguments.length; _i++) {
	        args[_i - 2] = arguments$1[_i];
	    }
	    if (global$2.nativeSetTimer === undefined) {
	        return Reflect.apply(_setInterval, undefined, arguments);
	    }
	    var id = __timerId__++;
	    timerInfos.set(id, {
	        callback: function () {
	            Reflect.apply(handler, undefined, args);
	        },
	        context: getContext(),
	    });
	    nativeSetTimer(id, timeout || 0, true);
	    return id;
	};
	var doricClearTimeout = function (timerId) {
	    if (global$2.nativeClearTimer === undefined) {
	        return Reflect.apply(_clearTimeout, undefined, arguments);
	    }
	    timerInfos.delete(timerId);
	    nativeClearTimer(timerId);
	};
	var doricClearInterval = function (timerId) {
	    if (global$2.nativeClearTimer === undefined) {
	        return Reflect.apply(_clearInterval, undefined, arguments);
	    }
	    timerInfos.delete(timerId);
	    nativeClearTimer(timerId);
	};
	if (!global$2.setTimeout) {
	    global$2.setTimeout = doricSetTimeout;
	}
	else {
	    global$2.doricSetTimeout = doricSetTimeout;
	}
	if (!global$2.setInterval) {
	    global$2.setInterval = doricSetInterval;
	}
	else {
	    global$2.doricSetInterval = doricSetInterval;
	}
	if (!global$2.clearTimeout) {
	    global$2.clearTimeout = doricClearTimeout;
	}
	else {
	    global$2.doricClearTimeout = doricClearTimeout;
	}
	if (!global$2.clearInterval) {
	    global$2.clearInterval = doricClearInterval;
	}
	else {
	    global$2.doricClearInterval = doricClearInterval;
	}
	function jsCallbackTimer(timerId) {
	    var timerInfo = timerInfos.get(timerId);
	    if (timerInfo === undefined) {
	        return;
	    }
	    if (timerInfo.callback instanceof Function) {
	        setContext(timerInfo.context);
	        hookBeforeNativeCall(timerInfo.context);
	        Reflect.apply(timerInfo.callback, timerInfo.context, []);
	    }
	}
	function jsHookAfterNativeCall() {
	    var context = getContext();
	    context === null || context === void 0 ? void 0 : context.hookAfterNativeCall();
	}

	/*
	 * Copyright [2019] [Doric.Pub]
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var ProxyPolyfill = /** @class */ (function () {
	    function ProxyPolyfill(target, handler) {
	        this.__target__ = target;
	        this.__handler__ = handler;
	        this.defineProps();
	        return target;
	    }
	    ProxyPolyfill.prototype.defineProps = function () {
	        var _this = this;
	        var keys = Object.keys(this.__target__);
	        keys.forEach(function (property) {
	            if (Object.getOwnPropertyDescriptor(_this.__target__, property) !== undefined) {
	                return;
	            }
	            Object.defineProperty(_this, property, {
	                get: function () {
	                    _this.defineProps();
	                    if (_this.__handler__.get) {
	                        return _this.__handler__.get(_this.__target__, property, _this);
	                    }
	                    else {
	                        return _this.__target__[property];
	                    }
	                },
	                set: function (value) {
	                    _this.defineProps();
	                    if (_this.__handler__.set) {
	                        _this.__handler__.set(_this.__target__, property, value, property);
	                    }
	                    else {
	                        _this.__target__[property] = value;
	                    }
	                },
	                enumerable: true,
	                configurable: true,
	            });
	        });
	    };
	    return ProxyPolyfill;
	}());
	var global$1 = Function('return this')();
	global$1.Proxy = ProxyPolyfill;

	exports.Context = Context;
	exports.__require__ = __require__;
	exports.allContexts = allContexts;
	exports.jsCallEntityMethod = jsCallEntityMethod;
	exports.jsCallReject = jsCallReject;
	exports.jsCallResolve = jsCallResolve;
	exports.jsCallbackTimer = jsCallbackTimer;
	exports.jsHookAfterNativeCall = jsHookAfterNativeCall;
	exports.jsObtainContext = jsObtainContext;
	exports.jsObtainEntry = jsObtainEntry;
	exports.jsRegisterModule = jsRegisterModule;
	exports.jsReleaseContext = jsReleaseContext;
	exports.pureCallEntityMethod = pureCallEntityMethod;

	Object.defineProperty(exports, '__esModule', { value: true });

	return exports;

})({});
