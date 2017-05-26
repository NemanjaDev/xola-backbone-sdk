(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("backbone"), require("jquery"), require("underscore"));
	else if(typeof define === 'function' && define.amd)
		define(["backbone", "jquery", "underscore"], factory);
	else if(typeof exports === 'object')
		exports["XolaBackboneSDK"] = factory(require("backbone"), require("jquery"), require("underscore"));
	else
		root["XolaBackboneSDK"] = factory(root["Backbone"], root["$"], root["_"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_6__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var Config = exports.Config = {
    BASE_URL: "http://xola.local/api"
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Experience = undefined;

var _Base = __webpack_require__(4);

var _Config = __webpack_require__(0);

var Experience = exports.Experience = _Base.Base.extend({
    urlRoot: function urlRoot() {
        return _Config.Config.BASE_URL + "/experiences";
    }
});

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Base = undefined;

var _underscore = __webpack_require__(6);

var _underscore2 = _interopRequireDefault(_underscore);

var _backbone = __webpack_require__(1);

var _backbone2 = _interopRequireDefault(_backbone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Base = exports.Base = _backbone2.default.Model.extend({
    /**
     * Override the default `parse` method so that we can reuse nested models that have already been instantiated.
     * This helps reduce a lot of boilerplate code and also ensures that all listeners are kept intact.
     *
     * @param {Object} resp
     * @param {Object} options Include a `blacklist` array to indicate the keys that should be skipped
     * @return {Object}
     */
    parse: function parse(resp, options) {
        if (!resp) return resp;
        options = options || {};
        var response = resp;

        // Make sure that the `defaults` on your model is function and not object
        // If `defaults` is an object, that will get overridden by value in latest response
        var attributes = _underscore2.default.defaults(this.attributes, _underscore2.default.result(this, 'defaults', {}));
        var blacklist = options.blacklist || [];

        _underscore2.default.each(response, function (respValue, key) {
            if (!_underscore2.default.contains(blacklist, key)) {
                var modelValue = attributes[key];

                if (modelValue instanceof _backbone2.default.Model) {
                    // This is most likely a Backbone model, so set data into the existing model.
                    // Do not re-instantiate since the existing model may have listeners on it.
                    var data = options.parse ? modelValue.parse(respValue, options) : respValue;
                    modelValue.set(data, options);
                    response[key] = modelValue;
                }

                if (modelValue instanceof _backbone2.default.Collection) {
                    modelValue.set(respValue, options);
                    response[key] = modelValue;
                }
            }
        });

        return resp;
    }
});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(3);

var _jquery2 = _interopRequireDefault(_jquery);

var _backbone = __webpack_require__(1);

var _backbone2 = _interopRequireDefault(_backbone);

var _Config = __webpack_require__(0);

var _Experience = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
    Model: {
        Experience: _Experience.Experience
    },
    Collection: {},
    init: function init(options) {
        _Config.Config.BASE_URL = options.BASE_URL || 'https://xola.com/api';

        // if (options.hasOwnProperty('API_KEY')) {
        //     var headers = Backbone.$.ajaxSetup().headers || {};
        //     headers["X-API-KEY"] = options['API_KEY'];
        //     $.ajaxSetup($.ajaxSettings, {
        //         headers
        //     });
        // }
    }
};

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ })
/******/ ]);
});