(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["HJevent"] = factory();
	else
		root["HJevent"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_extend__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_extend___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_extend__);




class HJevent {
    /**
    * 对一个指定事件向该事件的collection中添加一个监听函数
    * @function参数解释
    * @param {String} event - 想要添加的事件名称，字符串类型
    * @param {Function} listener - 要添加的监听函数，函数类型
    * @returns {Object} 返回Emitter实例
    * @使用举例
    * emitter.on('foo', listener);
    */
    on(event, listener) {
        // 使用现有的collection，如果不存在，则创建
        this.eventCollection = this.eventCollection || {};
        this.eventCollection[event] = this.eventCollection[event] || [];

        // 讲给定的监听函数push进入指定事件的collection
        this.eventCollection[event].push(listener);

        return this;
    }

    addListener(event, listener) {
        return this.on(event, listener);
    }

    /**
    * 使用on方法，并劫持listener参数，注意this漂移问题.
    * @function参数解释
    * @param {String} event - 想要添加的事件名称，字符串类型
    * @param {Function} listener - 要添加的监听函数，函数类型
    * @returns {Object} 返回Emitter实例
    * @使用举例
    * emitter.once('foo', listener);
    */
    once(event, listener) {
        // 使用箭头函数绑定this
        const fn = () => {
            this.off(event, fn);
            listener.apply(this, arguments);
        }

        // const self = this;
        // function fn () {
        //     self.off(event, fn);
        //     listener.apply(self, arguments);
        // }

        fn.listener = listener;

        this.on(event, fn);

        return this;
    }

    /**
     * 对指定的事件在其collection之中删除一个监听函数
     * @function
     * @param {String} event - 想要删除的事件名称，字符串类型
     * @param {Function} listener - 要删除的监听函数，函数类型
     * @returns {Object} 返回Emitter实例
     * @example
     * emitter.off('foo', listener);
     */
    off(event, listener) {

        // 指定事件的监听函数数组
        let listeners;

        // 指定的事件的collection不存在，则直接返回实例
        if (!this.eventCollection || !(listeners = this.eventCollection[event])) {
            return this;
        }

        listeners.forEach((fn, i) => {
            if (fn === listener || fn.listener === listener) {
                // 删除监听函数
                listeners.splice(i, 1);
            }
        });

        // 如果删除指定监听函数后该指定事件的监听函数数组为空，则删除此collection
        if (listeners.length === 0) {
            delete this.eventCollection[event];
        }

        return this;
    }

    /**
     * 删除所有事件的监听函数
     * @function
     * @param {String} event - 想要删除的事件名称，字符串类型
     * @returns {Object} 返回Emitter实例
     * @example
     * emitter.offAll(); emitter.offAll('foo');
     */
    offAll(event) {
        if (!this.eventCollection) {
            return this;
        }
        else if (typeof this.eventCollection[event] === 'undefined') {
            let eventArray = Object.keys(this.eventCollection);
            eventArray.forEach((v, i)=>{this.eventCollection[v].length = 0;})
        }
        else {
            this.eventCollection[event].length = 0;
        }

        return this;
    }

    /**
     * 所有指定事件的所有监听函数数组
     * @function
     * @param {String} event - 指定的事件名称，字符串类型
     * @returns 指定事件的监听函数数组
     * @example
     * emitter.listeners('foo');
     */
    listeners(event) {
        return this.eventCollection[event];
    }

    /**
     * 按照存储顺序，依次执行指定事件的监听函数
     * @function
     * @param {String} event - 想要触发的事件名称，字符串类型
     * @param {...Object} data - 想要传递给监听函数的数据
     * @returns {Object} Returns an instance of Emitter.
     * @example
     * // Emits the "foo" event with 'param1' and 'param2' as arguments.
     * emitter.emit('foo', 'param1', 'param2');
     */
    emit(event, ...args) {

        // 指定事件的监听函数数组
        let listeners;

        // 指定的事件的collection不存在，则直接返回实例
        if (!this.eventCollection || !(listeners = this.eventCollection[event])) {
            return this;
        }

        // 克隆监听函数群
        listeners = listeners.slice(0);

        listeners.forEach(fn => fn.apply(this, args));

        return this;
    }

}
/* harmony default export */ __webpack_exports__["default"] = (HJevent);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var HJevent = __webpack_require__(0).default;
module.exports = HJevent;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {/**/}

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};



/***/ })
/******/ ]);
});