(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("underscore"), require("backbone"));
	else if(typeof define === 'function' && define.amd)
		define(["underscore", "backbone"], factory);
	else if(typeof exports === 'object')
		exports["XolaBackboneSDK"] = factory(require("underscore"), require("backbone"));
	else
		root["XolaBackboneSDK"] = factory(root["_"], root["Backbone"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 22);
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

var _underscore = __webpack_require__(2);

var _underscore2 = _interopRequireDefault(_underscore);

var _backbone = __webpack_require__(3);

var _backbone2 = _interopRequireDefault(_backbone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BaseModel = exports.BaseModel = _backbone2.default.Model.extend({
    parent: null,

    /**
     * Nested models that want to override default URL for the model's representation on the server may override parent's urlRoot property.
     */
    parentUrlRoot: null,

    filters: null,

    /**
     * Override the default `initialize` to support nested models by default.
     * If overriding this method, make sure you always call BaseModel.prototype.initialize.apply(this, options) first.
     *
     * @param options
     */
    initialize: function initialize(attributes) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _underscore2.default.defaults(options, {
            parent: null
        });

        this.parent = options.parent;
        this.filters = {};
    },


    /**
     * Override the default `url` method so that nested urls can be constructed.
     *
     * @param {string} urlRoot
     * @returns {string}
     */
    url: function url(urlRoot) {
        var parentUrl = this.parent ? this.parent.url(this.parentUrlRoot) : '';

        var url;
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
    fetch: function fetch() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _underscore2.default.defaults(options, {
            data: {}
        });
        _underscore2.default.extend(options.data, this.filters);

        return _backbone2.default.Model.prototype.fetch.apply(this, [options]);
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
        var _this = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (!resp) return resp;

        _underscore2.default.each(resp, function (value, key) {
            var parsedValue = value;

            if (_this.constructor.PARSERS && _this.constructor.PARSERS[key]) {
                parsedValue = _this.constructor.PARSERS[key](value, options, _this);

                if (parsedValue instanceof _backbone2.default.Model) {
                    if (_this.has(key) && _this.get(key).id == parsedValue.id) {
                        _this.get(key).set(parsedValue.attributes);

                        parsedValue = _this.get(key);
                    }
                }

                if (parsedValue instanceof _backbone2.default.Collection) {
                    if (_this.has(key)) {
                        _this.get(key).set(parsedValue.models);

                        parsedValue = _this.get(key);
                    }
                }
            }

            resp[key] = parsedValue;
        });

        return resp;
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

var _underscore = __webpack_require__(2);

var _underscore2 = _interopRequireDefault(_underscore);

var _backbone = __webpack_require__(3);

var _backbone2 = _interopRequireDefault(_backbone);

var _BaseModel = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BaseCollection = exports.BaseCollection = _backbone2.default.Collection.extend({
    model: _BaseModel.BaseModel,
    parent: null,
    filters: null,

    /**
     * Override the default `initialize` to support nested models by default.
     * If overriding this method, make sure you always call BaseModel.prototype.initialize.apply(this, options) first.
     *
     * @param models
     * @param options
     */
    initialize: function initialize() {
        var models = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _underscore2.default.defaults(options, {
            parent: null
        });

        this.parent = options.parent;
        this.filters = {};
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
            attributes[this.model.prototype.idAttribute] = id;

            model = new this.model(attributes);
            this.add(model);
        }

        return model;
    },
    fetch: function fetch() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _underscore2.default.defaults(options, {
            data: {}
        });
        _underscore2.default.extend(options.data, this.filters);

        return _backbone2.default.Collection.prototype.fetch.apply(this, [options]);
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
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

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
exports.ExperienceCollection = undefined;

var _BaseCollection = __webpack_require__(1);

var _Availabilities = __webpack_require__(21);

var _Experience = __webpack_require__(10);

var ExperienceCollection = exports.ExperienceCollection = _BaseCollection.BaseCollection.extend({
    model: _Experience.Experience,

    initialize: function initialize() {
        var _this = this;

        _BaseCollection.BaseCollection.prototype.initialize.apply(this, arguments);

        this.availability = new _Availabilities.AvailabilityCollection(null, { experiences: this });

        this.listenTo(this, "update", function () {
            _this.availability.filters.experience = _this.pluck("id").join(",");
        });
    },


    /**
     * @returns { AvailabilityCollection }
     */
    getAvailability: function getAvailability() {
        return this.availability;
    }
}, {
    POOL_ID: 'Experiences'
});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ParseHelper = undefined;

var _BaseModel = __webpack_require__(0);

var _BaseCollection = __webpack_require__(1);

var _CollectionPool = __webpack_require__(6);

var ParseHelper = exports.ParseHelper = {
    Date: function (_Date) {
        function Date(_x) {
            return _Date.apply(this, arguments);
        }

        Date.toString = function () {
            return _Date.toString();
        };

        return Date;
    }(function (dateString) {
        return new Date(dateString);
    }),
    Locale: function Locale(localeString) {
        return localeString.replace('_', '-');
    },
    Model: function Model(type) {
        var nested = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (type.prototype instanceof _BaseCollection.BaseCollection) {
            return function (attributes, options) {
                var idAttribute = type.prototype.model.prototype.idAttribute;

                var model = _CollectionPool.CollectionPool.getCollection(type).get(attributes[idAttribute], true);

                model.set(model.parse(attributes, options), options);

                return model;
            };
        }

        if (type.prototype instanceof _BaseModel.BaseModel) {
            return function (attributes, options) {
                var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

                if (nested && parent) {
                    attributes.parent = parent;
                }

                return new type(attributes, { parse: true });
            };
        }
    },
    Collection: function Collection(type) {
        return function (models, options) {
            return new type(models, options);
        };
    }
};

/***/ }),
/* 6 */
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DemographicCollection = undefined;

var _BaseCollection = __webpack_require__(1);

var _Demographic = __webpack_require__(8);

var DemographicCollection = exports.DemographicCollection = _BaseCollection.BaseCollection.extend({
    model: _Demographic.Demographic
}, {
    POOL_ID: 'Demographics'
});

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Demographic = undefined;

var _BaseModel = __webpack_require__(0);

var Demographic = exports.Demographic = _BaseModel.BaseModel.extend({
    urlRoot: "/demographics",

    getLabel: function getLabel() {
        return this.get("label");
    }
});

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Event = undefined;

var _BaseModel = __webpack_require__(0);

var _ParseHelper = __webpack_require__(5);

var _Experiences = __webpack_require__(4);

var Event = exports.Event = _BaseModel.BaseModel.extend({
    urlRoot: "/events"
}, {
    PARSERS: {
        start_date: _ParseHelper.ParseHelper.Date,
        experience: _ParseHelper.ParseHelper.Model(_Experiences.ExperienceCollection)
    }
});

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Experience = undefined;

var _backbone = __webpack_require__(3);

var _backbone2 = _interopRequireDefault(_backbone);

var _BaseModel = __webpack_require__(0);

var _Availability = __webpack_require__(14);

var _Demographics = __webpack_require__(7);

var _ParseHelper = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Experience = exports.Experience = _BaseModel.BaseModel.extend({
    urlRoot: "/experiences",

    initialize: function initialize() {
        _BaseModel.BaseModel.prototype.initialize.apply(this, arguments);

        this.availability = new _Availability.Availability(null, {
            parent: this
        });
    },
    getAvailability: function getAvailability() {
        return this.availability;
    },
    getDemographics: function getDemographics() {
        return this.get("demographics");
    }
}, {
    PARSERS: {
        demographics: _ParseHelper.ParseHelper.Collection(_Demographics.DemographicCollection)
    }
});

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Order = undefined;

var _BaseModel = __webpack_require__(0);

var Order = exports.Order = _BaseModel.BaseModel.extend({
    urlRoot: "/orders",

    calculateAmount: function calculateAmount() {
        var totalQuantity = 0;
        var totalAmount = 0;

        var basePrice = this.get("experience").get("price");
        var currency = this.get("experience").get("currency");

        // Sum up all the demographics
        this.get("demographics").each(function (orderDemographic) {
            var quantity = orderDemographic.get("quantity");
            var price = orderDemographic.calculatePrice(basePrice);
            var amount = price * quantity;

            totalQuantity += quantity;
            totalAmount += amount;
        });

        // TODO: Sum up all fees

        this.set("quantity", totalQuantity);
        this.set("amount", totalAmount);
    },
    checkIn: function checkIn(options) {
        var adjustment = new _BaseModel.BaseModel({
            updates: {
                guestStatus: "arrived"
            }
        }, {
            parent: this
        });
        adjustment.urlRoot = "/modify";

        adjustment.save(null, options);
    },
    toJSON: function toJSON() {
        var json = _BaseModel.BaseModel.prototype.toJSON.apply(this, arguments);

        json.demographics = this.get("demographics").toJSON();

        json.seller = {
            id: this.get("seller").id
        };

        json.experience = {
            id: this.get("experience").id
        };

        json.payment = this.get("payment").toJSON();

        return json;
    }
});

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OrderDemographic = undefined;

var _BaseModel = __webpack_require__(0);

var OrderDemographic = exports.OrderDemographic = _BaseModel.BaseModel.extend({
    urlRoot: null,

    initialize: function initialize(attributes) {
        _BaseModel.BaseModel.prototype.initialize.apply(this, arguments);

        this.set({
            id: attributes.demographic.id,
            label: attributes.demographic.getLabel()
        });
    },
    getQuantity: function getQuantity() {
        return this.get("quantity");
    },
    setQuantity: function setQuantity(quantity) {
        return this.set("quantity", quantity);
    },
    calculatePrice: function calculatePrice(basePrice) {
        var demographic = this.get("demographic");
        if (demographic.has("discount")) {
            switch (demographic.get("discount").amountType) {
                case "absolute":
                    return basePrice - demographic.get("discount").amount;
                    break;

                default:
                    // Unsupported discount type
                    return basePrice;
            }
        } else {
            return basePrice;
        }
    }
});

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.User = undefined;

var _underscore = __webpack_require__(2);

var _underscore2 = _interopRequireDefault(_underscore);

var _BaseModel = __webpack_require__(0);

var _ParseHelper = __webpack_require__(5);

var _Meta = __webpack_require__(23);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserRoles = {
    ROLE_SELLER: "ROLE_SELLER",
    ROLE_SUPER_ADMIN: "ROLE_SUPER_ADMIN",
    ROLE_ADMIN: "ROLE_ADMIN",
    ROLE_RESERVATION: "ROLE_RESERVATION",
    ROLE_RESERVATION_LITE: "ROLE_RESERVATION_LITE",
    ROLE_GUIDE_MANAGER: "ROLE_GUIDE_MANAGER"
};

var User = exports.User = _BaseModel.BaseModel.extend({
    urlRoot: "/users",

    hasRole: function hasRole(role) {
        return _underscore2.default.contains(this.get('roles'), role);
    },
    isSeller: function isSeller() {
        return this.hasRole(UserRoles.ROLE_SELLER);
    },
    isAdmin: function isAdmin() {
        return this.hasRole(UserRoles.ROLE_ADMIN) || this.hasRole(UserRoles.ROLE_SUPER_ADMIN);
    },
    isReservationist: function isReservationist() {
        return this.hasRole(UserRoles.ROLE_RESERVATION) || this.hasRole(UserRoles.ROLE_RESERVATION_LITE);
    },
    isGuideManager: function isGuideManager() {
        return this.hasRole(UserRoles.ROLE_GUIDE_MANAGER);
    }
}, _underscore2.default.extend({
    PARSERS: {
        locale: _ParseHelper.ParseHelper.Locale,
        meta: _ParseHelper.ParseHelper.Model(_Meta.Meta)
    }
}, UserRoles));

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Availability = undefined;

var _BaseModel = __webpack_require__(0);

var Availability = exports.Availability = _BaseModel.BaseModel.extend({
    urlRoot: "/availability",

    initialize: function initialize() {
        _BaseModel.BaseModel.prototype.initialize.apply(this, arguments);
    },
    parse: function parse(attributes, options) {
        options.parent = attributes._experience;
        delete attributes._experience;

        return _BaseModel.BaseModel.prototype.parse.call(this, attributes, options);
    },
    getSlotsByDate: function getSlotsByDate(date) {
        return this.get(date);
    },
    getSlotsByDateTime: function getSlotsByDateTime(date, time) {
        return this.getSlotsByDate(date)[time];
    }
});

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EventCollection = undefined;

var _BaseCollection = __webpack_require__(1);

var _Event = __webpack_require__(9);

var EventCollection = exports.EventCollection = _BaseCollection.BaseCollection.extend({
    model: _Event.Event
}, {
    POOL_ID: 'Events'
});

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OrderDemographicCollection = undefined;

var _BaseCollection = __webpack_require__(1);

var _OrderDemographic = __webpack_require__(12);

var OrderDemographicCollection = exports.OrderDemographicCollection = _BaseCollection.BaseCollection.extend({
    model: _OrderDemographic.OrderDemographic
}, {
    POOL_ID: 'OrderDemographics'
});

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OrderCollection = undefined;

var _BaseCollection = __webpack_require__(1);

var _Order = __webpack_require__(11);

var OrderCollection = exports.OrderCollection = _BaseCollection.BaseCollection.extend({
    model: _Order.Order
}, {
    POOL_ID: 'Orders'
});

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UserCollection = undefined;

var _BaseCollection = __webpack_require__(1);

var _User = __webpack_require__(13);

var UserCollection = exports.UserCollection = _BaseCollection.BaseCollection.extend({
    model: _User.User
}, {
    POOL_ID: 'Users'
});

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Payment = undefined;

var _underscore = __webpack_require__(2);

var _underscore2 = _interopRequireDefault(_underscore);

var _BaseModel = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PaymentMethods = {
    METHOD_CREDIT_CARD: "cc"
};

var Payment = exports.Payment = _BaseModel.BaseModel.extend({
    toJSON: function toJSON() {
        var json = _BaseModel.BaseModel.prototype.toJSON.apply(this, arguments);

        switch (this.get("method")) {
            case PaymentMethods.METHOD_CREDIT_CARD:
                json.card = this.get("card").toJSON();
                break;
        }

        return json;
    }
}, _underscore2.default.extend({
    PARSERS: {}
}, PaymentMethods));

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Seller = undefined;

var _BaseModel = __webpack_require__(0);

var _Experiences = __webpack_require__(4);

var Seller = exports.Seller = _BaseModel.BaseModel.extend({
    urlRoot: "/sellers",

    initialize: function initialize() {
        this.experiences = new _Experiences.ExperienceCollection();

        this.experiences.filters.seller = this.id;
    },
    getExperiences: function getExperiences() {
        return this.experiences;
    }
});

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AvailabilityCollection = undefined;

var _underscore = __webpack_require__(2);

var _underscore2 = _interopRequireDefault(_underscore);

var _BaseCollection = __webpack_require__(1);

var _Availability = __webpack_require__(14);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AvailabilityCollection = exports.AvailabilityCollection = _BaseCollection.BaseCollection.extend({
    model: _Availability.Availability,

    initialize: function initialize(models, options) {
        var _this = this;

        _BaseCollection.BaseCollection.prototype.initialize.apply(this, arguments);

        this.experiences = options.experiences;

        this.listenTo(this, "update", function () {
            _this.each(function (availability) {
                availability.parent.getAvailability().set(availability.attributes);
            });
        });
    },
    parse: function parse(resp) {
        var _this2 = this;

        var array = [];
        _underscore2.default.each(resp, function (value, key, obj) {
            value._experience = _this2.experiences.get(key);
            array.push(value);
        });

        return array;
    }
});

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _underscore = __webpack_require__(2);

var _underscore2 = _interopRequireDefault(_underscore);

var _backbone = __webpack_require__(3);

var _backbone2 = _interopRequireDefault(_backbone);

var _BaseModel = __webpack_require__(0);

var _BaseCollection = __webpack_require__(1);

var _Demographic = __webpack_require__(8);

var _Experience = __webpack_require__(10);

var _Event = __webpack_require__(9);

var _Order = __webpack_require__(11);

var _OrderDemographic = __webpack_require__(12);

var _Payment = __webpack_require__(19);

var _Seller = __webpack_require__(20);

var _User = __webpack_require__(13);

var _Demographics = __webpack_require__(7);

var _Experiences = __webpack_require__(4);

var _Events = __webpack_require__(15);

var _Orders = __webpack_require__(17);

var _OrderDemographics = __webpack_require__(16);

var _Users = __webpack_require__(18);

var _CollectionPool = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var currentUser = null;

var XolaBackboneSDK = {
    BaseModel: _BaseModel.BaseModel,
    BaseCollection: _BaseCollection.BaseCollection,

    Model: {
        Demographic: _Demographic.Demographic,
        Experience: _Experience.Experience,
        Event: _Event.Event,
        Order: _Order.Order,
        OrderDemographic: _OrderDemographic.OrderDemographic,
        Payment: _Payment.Payment,
        Seller: _Seller.Seller,
        User: _User.User
    },

    Collection: {
        Demographics: _Demographics.DemographicCollection,
        Experiences: _Experiences.ExperienceCollection,
        Events: _Events.EventCollection,
        Orders: _Orders.OrderCollection,
        OrderDemographics: _OrderDemographics.OrderDemographicCollection,
        Users: _Users.UserCollection
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
    },
    setApiVersion: function setApiVersion(apiVersion) {
        var headers = _backbone2.default.$.ajaxSetup().headers || {};

        if (apiVersion) {
            headers["X-API-VERSION"] = apiVersion;
        } else {
            delete headers["X-API-VERSION"];
        }

        _backbone2.default.$.ajaxSetup(_backbone2.default.$.ajaxSettings, {
            headers: headers
        });
    },
    login: function login(username, password) {
        var _this = this;

        var headers = _backbone2.default.$.ajaxSetup().headers || {};

        headers["Authorization"] = 'Basic ' + btoa(username + ':' + password);
        delete headers["X-API-KEY"];

        _backbone2.default.$.ajaxSetup(_backbone2.default.$.ajaxSettings, {
            headers: headers
        });

        var currentUser = _CollectionPool.CollectionPool.getCollection(_Users.UserCollection).get("me", true);
        currentUser.fetch({
            success: function success(me) {
                currentUser = me;
                _this.setApiKey(me.get("apiKey"));

                _this.trigger("user.login", me);
            }
        });
    },
    logout: function logout() {
        this.setApiKey();
        currentUser = null;

        this.trigger("user.logout");
    }
};

var sdkInitialized;
if (!sdkInitialized) {
    _underscore2.default.extend(XolaBackboneSDK, _backbone2.default.Events);

    XolaBackboneSDK.setBaseUrl("http://xola.local/api");
    XolaBackboneSDK.setApiVersion("2017-09-13");

    sdkInitialized = true;
}

module.exports = XolaBackboneSDK;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Meta = undefined;

var _BaseModel = __webpack_require__(0);

var Meta = exports.Meta = _BaseModel.BaseModel.extend({
    urlRoot: "/meta"
});

/***/ })
/******/ ]);
});