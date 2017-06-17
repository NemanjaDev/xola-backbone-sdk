(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("backbone"), require("underscore"));
	else if(typeof define === 'function' && define.amd)
		define(["backbone", "underscore"], factory);
	else if(typeof exports === 'object')
		exports["XolaBackboneSDK"] = factory(require("backbone"), require("underscore"));
	else
		root["XolaBackboneSDK"] = factory(root["Backbone"], root["_"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_12__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BaseModel = undefined;

var _underscore = __webpack_require__(12);

var _underscore2 = _interopRequireDefault(_underscore);

var _backbone = __webpack_require__(3);

var _backbone2 = _interopRequireDefault(_backbone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BaseModel = exports.BaseModel = _backbone2.default.Model.extend({
    /**
     *
     */
    parent: null,

    /**
     * Nested models that want to override default URL for the model's representation on the server may override parent's urlRoot property.
     */
    parentUrlRoot: null,

    /**
     * Override the default `initialize` to support nested models by default.
     * If overriding this method, make sure you always call BaseModel.prototype.initialize.apply(this, options) first.
     *
     * @param parent
     */
    initialize: function initialize() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$parent = _ref.parent,
            parent = _ref$parent === undefined ? null : _ref$parent;

        this.parent = parent;
    },


    /**
     * Override the default `url` method so that nested urls can be constructed.
     *
     * @param {string} urlRoot
     * @returns {string}
     */
    url: function url(urlRoot) {
        var parentUrl = this.parent ? this.parent.url(this.parentUrlRoot) : '';

        var url = void 0;
        if (urlRoot) {
            if (this.isNew()) {
                url = urlRoot;
            } else {
                var id = this.get(this.idAttribute);
                url = urlRoot.replace(/[^\/]$/, '$&/') + encodeURIComponent(id);
            }
        } else {
            url = _backbone2.default.Model.prototype.url.apply(this);
        }

        return parentUrl + url;
    },


    /**
     * Override the default `parse` method so that we can reuse nested models that have already been instantiated.
     * This helps reduce a lot of boilerplate code and also ensures that all listeners are kept intact.
     *
     * @param {Object} resp
     * @param {Object} options Include a `blacklist` array to indicate the keys that should be skipped
     * @return {Object}
     */
    parse: function parse(resp) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        console.log("PARSE", resp);

        return _backbone2.default.Model.prototype.parse.apply(this, arguments);
        // if (!resp) return resp;
        //
        // var response = resp;
        //
        // // Make sure that the `defaults` on your model is function and not object
        // // If `defaults` is an object, that will get overridden by value in latest response
        // var attributes = _.defaults(this.attributes, _.result(this, 'defaults', {}));
        //
        // _.each(response, function(respValue, key) {
        //     // this.prototype.PARSERS[key]
        //
        //     var modelValue = attributes[key];
        //
        //     if (modelValue instanceof Backbone.Model) {
        //         // This is most likely a Backbone model, so set data into the existing model.
        //         // Do not re-instantiate since the existing model may have listeners on it.
        //         var data = options.parse ? modelValue.parse(respValue, options) : respValue;
        //         modelValue.set(data, options);
        //         response[key] = modelValue;
        //         // response[key] = this.prototype.PARSERS[key](modelValue);
        //     }
        //
        //     if (modelValue instanceof Backbone.Collection) {
        //         modelValue.set(respValue, options);
        //         response[key] = modelValue;
        //     }
        // });
        //
        // return resp;
    }
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BaseCollection = undefined;

var _backbone = __webpack_require__(3);

var _backbone2 = _interopRequireDefault(_backbone);

var _BaseModel = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BaseCollection = exports.BaseCollection = _backbone2.default.Collection.extend({
    model: _BaseModel.BaseModel,

    /**
     * Override the default `initialize` to support nested models by default.
     * If overriding this method, make sure you always call BaseModel.prototype.initialize.apply(this, options) first.
     *
     * @param parent
     */
    initialize: function initialize() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$parent = _ref.parent,
            parent = _ref$parent === undefined ? null : _ref$parent;

        this.parent = parent;
    },


    /**
     * Override default `url` method so that url can be derived from associated model.
     *
     * @returns {string}
     */
    url: function url() {
        var base = this.parent ? this.parent.url() : '';

        return base + this.model.prototype.urlRoot;
    },


    /**
     * Override so we can parse out paging information.
     *
     * @param {Object} resp
     * @returns {Object} Response model data (without paging information)
     */
    parse: function parse(resp) {
        if (resp.hasOwnProperty("paging") && resp.hasOwnProperty("data")) {
            return resp.data;
        }

        return resp;
    },
    get: function get(id) {
        var create = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var model = _backbone2.default.Collection.prototype.get.apply(this, [id]);

        if (!model && create) {
            var attributes = {};
            attributes[this.model.idAttribute] = id;

            model = new this.model(attributes);
            this.add(model);
        }

        return model;
    }
}, {
    buildModelPropertyComparator: function buildModelPropertyComparator(property) {
        return function (model) {
            return model.get(property);
        };
    }
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Experience = undefined;

var _BaseModel = __webpack_require__(0);

var Experience = exports.Experience = _BaseModel.BaseModel.extend({
    urlRoot: "/experiences",

    defaults: {
        name: 'Xxx'
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
var collections = {};

var CollectionPool = exports.CollectionPool = {
    getCollection: function getCollection(Collection) {
        if (!Collection.hasOwnProperty("POOL_ID")) {
            throw new Error(Collection + " is not a valid Collection");
        }

        if (!collections.hasOwnProperty(Collection.POOL_ID)) {
            collections[Collection.POOL_ID] = new Collection();
        }

        return collections[Collection.POOL_ID];
    }
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Event = undefined;

var _BaseModel = __webpack_require__(0);

var _ParseHelper = __webpack_require__(10);

var _Experience = __webpack_require__(2);

var Event = exports.Event = _BaseModel.BaseModel.extend({
    urlRoot: "/events"
}, {
    PARSERS: {
        start_date: _ParseHelper.ParseHelper.Date,
        experience: _ParseHelper.ParseHelper.Model(_Experience.Experience)
    }
});

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EventCollection = undefined;

var _BaseCollection = __webpack_require__(1);

var _Event = __webpack_require__(5);

var EventCollection = exports.EventCollection = _BaseCollection.BaseCollection.extend({
    model: _Event.Event
});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ExperienceCollection = undefined;

var _BaseCollection = __webpack_require__(1);

var _Experience = __webpack_require__(2);

var ExperienceCollection = exports.ExperienceCollection = _BaseCollection.BaseCollection.extend({
    model: _Experience.Experience
}, {
    POOL_ID: 'Experiences'
});

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Seller = undefined;

var _BaseModel = __webpack_require__(0);

var Seller = exports.Seller = _BaseModel.BaseModel.extend({
    urlRoot: "/sellers"
});

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.User = undefined;

var _BaseModel = __webpack_require__(0);

var User = exports.User = _BaseModel.BaseModel.extend({
    urlRoot: "/users"
});

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ParseHelper = undefined;

var _BaseModel = __webpack_require__(0);

var _BaseCollection = __webpack_require__(1);

var _CollectionPool = __webpack_require__(4);

var ParseHelper = exports.ParseHelper = {
    Date: function (_Date) {
        function Date(_x, _x2, _x3) {
            return _Date.apply(this, arguments);
        }

        Date.toString = function () {
            return _Date.toString();
        };

        return Date;
    }(function (date, value, options) {
        return new Date(value);
    }),
    Model: function Model(type) {
        if (type.prototype instanceof _BaseCollection.BaseCollection) {
            return function (model, attributes, options) {
                var idAttribute = type.prototype.model.prototype.idAttribute;

                if (!model || model.id != attributes[idAttribute]) {
                    model = _CollectionPool.CollectionPool.getCollection(type).get(attributes[idAttribute], true);
                }

                model.set(attributes, options);

                return model;
            };
        }

        if (type.prototype instanceof _BaseModel.BaseModel) {
            return function (model, attributes, options) {
                if (!model) {
                    model = new type();
                }

                model.set(attributes, options);

                return model;
            };
        }
    },
    Collection: function Collection(type) {
        return function (collection, models) {
            return new type(models);
        };
    }
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _backbone = __webpack_require__(3);

var _backbone2 = _interopRequireDefault(_backbone);

var _BaseModel = __webpack_require__(0);

var _BaseCollection = __webpack_require__(1);

var _Experience = __webpack_require__(2);

var _Event = __webpack_require__(5);

var _Seller = __webpack_require__(8);

var _User = __webpack_require__(9);

var _Experiences = __webpack_require__(7);

var _Events = __webpack_require__(6);

var _CollectionPool = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var XolaBackboneSDK = {
    BaseModel: _BaseModel.BaseModel,
    BaseCollection: _BaseCollection.BaseCollection,

    Model: {
        Experience: _Experience.Experience,
        Event: _Event.Event,
        Seller: _Seller.Seller,
        User: _User.User
    },

    Collection: {
        Experiences: _Experiences.ExperienceCollection,
        Events: _Events.EventCollection
    },

    CollectionPool: _CollectionPool.CollectionPool,

    setBaseUrl: function setBaseUrl(baseUrl) {
        _backbone2.default.$.ajaxSetup({
            beforeSend: function beforeSend(jqXHR, settings) {
                settings.url = baseUrl + settings.url;
                settings.crossDomain = true;
            }
        });
    },
    setApiKey: function setApiKey(apiKey) {
        var headers = _backbone2.default.$.ajaxSetup().headers || {};

        if (apiKey) {
            headers["X-API-KEY"] = apiKey;
        } else {
            delete headers["X-API-KEY"];
        }

        _backbone2.default.$.ajaxSetup(_backbone2.default.$.ajaxSettings, {
            headers: headers
        });
    }
};

XolaBackboneSDK.setBaseUrl("http://xola.com/api");

module.exports = XolaBackboneSDK;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_12__;

/***/ })
/******/ ]);
});