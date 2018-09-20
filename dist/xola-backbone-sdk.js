(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("underscore"), require("backbone"), require("jquery"));
	else if(typeof define === 'function' && define.amd)
		define(["underscore", "backbone", "jquery"], factory);
	else if(typeof exports === 'object')
		exports["XolaBackboneSDK"] = factory(require("underscore"), require("backbone"), require("jquery"));
	else
		root["XolaBackboneSDK"] = factory(root["_"], root["Backbone"], root["$"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_8__, __WEBPACK_EXTERNAL_MODULE_33__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 28);
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

var _backbone = __webpack_require__(8);

var _backbone2 = _interopRequireDefault(_backbone);

var _Config = __webpack_require__(4);

var _Account = __webpack_require__(7);

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
    sync: function sync(method, model, options) {
        var _this = this;

        var beforeSend = options.beforeSend;
        options.beforeSend = function (jqXHR, settings) {
            settings.url = _Config.Config.baseUrl + settings.url;
            settings.crossDomain = true;

            if (_Config.Config.apiKey) {
                jqXHR.setRequestHeader("X-API-KEY", _Config.Config.apiKey);
            }

            if (_Account.Account.currentUser && _Account.Account.currentUser.has('apiKey')) {
                jqXHR.setRequestHeader("X-API-KEY", _Account.Account.currentUser.get('apiKey'));
            }

            jqXHR.setRequestHeader("X-API-VERSION", _Config.Config.apiVersion);

            if (beforeSend) return beforeSend.call(_this, jqXHR, settings);
        };

        return _backbone2.default.Model.prototype.sync.call(this, method, model, options);
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
        var _this2 = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (!resp) return resp;

        _underscore2.default.each(resp, function (value, key) {
            var parsedValue = value;

            if (_this2.constructor.PARSERS && _this2.constructor.PARSERS[key]) {
                parsedValue = _this2.constructor.PARSERS[key](value, options, _this2);

                if (parsedValue instanceof _backbone2.default.Model) {
                    if (_this2.has(key) && _this2.get(key).id == parsedValue.id) {
                        _this2.get(key).set(parsedValue.attributes);

                        parsedValue = _this2.get(key);
                    }
                }

                if (parsedValue instanceof _backbone2.default.Collection) {
                    if (_this2.has(key)) {
                        _this2.get(key).set(parsedValue.models);

                        parsedValue = _this2.get(key);
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

var _backbone = __webpack_require__(8);

var _backbone2 = _interopRequireDefault(_backbone);

var _BaseModel = __webpack_require__(0);

var _Config = __webpack_require__(4);

var _Account = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BaseCollection = exports.BaseCollection = _backbone2.default.Collection.extend({
    model: _BaseModel.BaseModel,
    parent: null,
    filters: null,
    paging: {
        next: null
    },

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
        var urlRoot = this.urlRoot ? this.urlRoot : this.model.prototype.urlRoot;

        return base + urlRoot;
    },


    /**
     * Override so we can parse out paging information.
     *
     * @param {Object} resp
     * @returns {Object} Response model data (without paging information)
     */
    parse: function parse(resp) {
        if (resp.hasOwnProperty("paging") && resp.hasOwnProperty("data")) {
            this.paging.next = resp.paging.next;

            return resp.data;
        }

        return resp;
    },
    sync: function sync(method, model, options) {
        var _this = this;

        var beforeSend = options.beforeSend;
        options.beforeSend = function (jqXHR, settings) {
            settings.url = _Config.Config.baseUrl + settings.url;
            settings.crossDomain = true;

            if (_Config.Config.apiKey) {
                jqXHR.setRequestHeader("X-API-KEY", _Config.Config.apiKey);
            }

            if (_Account.Account.currentUser && _Account.Account.currentUser.has('apiKey')) {
                jqXHR.setRequestHeader("X-API-KEY", _Account.Account.currentUser.get('apiKey'));
            }

            jqXHR.setRequestHeader("X-API-VERSION", _Config.Config.apiVersion);

            if (beforeSend) return beforeSend.call(_this, jqXHR, settings);
        };

        return _backbone2.default.Collection.prototype.sync.call(this, method, model, options);
    },
    get: function get(id) {
        var create = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var model = _backbone2.default.Collection.prototype.get.call(this, id);

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
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ParseHelper = undefined;

var _BaseModel = __webpack_require__(0);

var _BaseCollection = __webpack_require__(1);

var _CollectionPool = __webpack_require__(9);

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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var Config = exports.Config = {
    apiVersion: "2017-09-13",
    baseUrl: "https://xola.com/api",
    apiKey: "595e291aa48cf267048b4568"
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DemographicCollection = undefined;

var _BaseCollection = __webpack_require__(1);

var _Demographic = __webpack_require__(12);

var DemographicCollection = exports.DemographicCollection = _BaseCollection.BaseCollection.extend({
    model: _Demographic.Demographic
}, {
    POOL_ID: 'Demographics'
});

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ExperienceCollection = undefined;

var _BaseCollection = __webpack_require__(1);

var _Availabilities = __webpack_require__(24);

var _Experience = __webpack_require__(14);

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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var Account = exports.Account = {
    currentUser: null
};

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ }),
/* 9 */
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OrderDemographicCollection = undefined;

var _BaseCollection = __webpack_require__(1);

var _OrderDemographic = __webpack_require__(16);

var OrderDemographicCollection = exports.OrderDemographicCollection = _BaseCollection.BaseCollection.extend({
    model: _OrderDemographic.OrderDemographic
}, {
    POOL_ID: 'OrderDemographics'
});

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OrderCollection = undefined;

var _BaseCollection = __webpack_require__(1);

var _Order = __webpack_require__(15);

var OrderCollection = exports.OrderCollection = _BaseCollection.BaseCollection.extend({
    model: _Order.Order
}, {
    POOL_ID: 'Orders'
});

/***/ }),
/* 12 */
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Event = undefined;

var _BaseModel = __webpack_require__(0);

var _ParseHelper = __webpack_require__(3);

var _Experiences = __webpack_require__(6);

var _Orders = __webpack_require__(11);

var Event = exports.Event = _BaseModel.BaseModel.extend({
    urlRoot: "/events",

    /**
     * Return's true if the event is an all-day event
     *
     * @returns {boolean}
     */
    isAllDay: function isAllDay() {
        var time = this.get('start').format('HHmm');
        return time === '0000';
    }
}, {
    PARSERS: {
        start_date: _ParseHelper.ParseHelper.Date,
        experience: _ParseHelper.ParseHelper.Model(_Experiences.ExperienceCollection),
        orders: _ParseHelper.ParseHelper.Collection(_Orders.OrderCollection)
    },
    OPEN_UNLIMITED: 99999
});

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Experience = undefined;

var _BaseModel = __webpack_require__(0);

var _Availability = __webpack_require__(19);

var _Demographics = __webpack_require__(5);

var _Fees = __webpack_require__(26);

var _ParseHelper = __webpack_require__(3);

var Experience = exports.Experience = _BaseModel.BaseModel.extend({
    urlRoot: "/experiences",

    initialize: function initialize() {
        _BaseModel.BaseModel.prototype.initialize.apply(this, arguments);

        this.availability = new _Availability.Availability(null, {
            parent: this
        });

        this.fees = new _Fees.FeeCollection(null, {
            parent: this
        });

        if (this.has("seller")) {
            this.fees.filters.seller = this.get("seller").id;
        }
    },
    getAvailability: function getAvailability() {
        return this.availability;
    },
    getFees: function getFees() {
        return this.fees;
    }
}, {
    PARSERS: {
        demographics: _ParseHelper.ParseHelper.Collection(_Demographics.DemographicCollection)
    }
});

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Order = undefined;

var _BaseCollection = __webpack_require__(1);

var _BaseModel = __webpack_require__(0);

var _Fee = __webpack_require__(20);

var _ParseHelper = __webpack_require__(3);

var _OrderDemographics = __webpack_require__(10);

var _Payment = __webpack_require__(17);

var Order = exports.Order = _BaseModel.BaseModel.extend({
    urlRoot: "/orders",

    calculateAmount: function calculateAmount() {
        var basePrice = this.get("experience").get("price");
        var currency = this.get("experience").get("currency");
        var baseAmount = 0;
        var totalQuantity = 0;

        // Sum up all the demographics
        this.get("demographics").each(function (orderDemographic) {
            var quantity = orderDemographic.get("quantity");
            var price = orderDemographic.calculatePrice(basePrice);
            var amount = price * quantity;

            totalQuantity += quantity;
            baseAmount += amount;
        });
        if (this.get('experience').get('priceType') === _Fee.Fee.SCOPE_OUTING) {
            baseAmount = basePrice;
        }

        var totalAmount = baseAmount;

        var totalFeeAmount = 0;
        var adjustments = new _BaseCollection.BaseCollection();
        this.get("experience").getFees().each(function (fee) {
            var feeAmount = 0;
            switch (fee.get("scope")) {
                case _Fee.Fee.SCOPE_PERSON:
                    feeAmount = fee.get('amount') * totalQuantity;
                    break;

                case _Fee.Fee.SCOPE_OUTING:
                    switch (fee.get("amountType")) {
                        case _Fee.Fee.AMOUNT_TYPE_ABSOLUTE:
                            feeAmount = fee.get('amount');
                            break;

                        case _Fee.Fee.AMOUNT_TYPE_PERCENT:
                            feeAmount = baseAmount * fee.get('amount') / 100;
                            break;
                    }
                    break;

                default:
                // Unsupported fee
            }

            adjustments.add(new _BaseModel.BaseModel({
                type: "fee",
                amount: feeAmount,
                caption: fee.get('name'),
                code: fee.id,
                meta: { fee: fee }
            }));

            totalFeeAmount += feeAmount;
        });

        totalAmount += totalFeeAmount;

        this.set("adjustments", adjustments);
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

        if (this.get("demographics")) {
            json.demographics = this.get("demographics").toJSON();
        }

        if (this.get("seller")) {
            json.seller = {
                id: this.get("seller").id
            };
        }

        if (this.get("experience")) {
            json.experience = {
                id: this.get("experience").id
            };
        }

        if (this.get("payment")) {
            json.payment = this.get("payment").toJSON();
        }

        return json;
    },
    getMaxQuantity: function getMaxQuantity() {
        var group = this.get('experience').get('group');
        if (group) {
            var max = group.outingMax || Event.OPEN_UNLIMITED;
            if (this.availability && this.availability.isAvailable()) {
                // Model has availability flag set. i.e. Availability for the specified arrival date and time
                var totalOpenCount = this.availability.getTotalOpenCount();
                if (totalOpenCount < max) {
                    max = totalOpenCount;
                }
                if (this.availability.hasTimeSlots() && this.has('arrivalTime')) {
                    var availabilitySlot = this.availability.get('slots').find({ time: this.get('arrivalTime').toString() });
                    if (availabilitySlot && availabilitySlot.get('count') != Event.OPEN_UNLIMITED) {
                        max = availabilitySlot.get('count');
                    }
                }
            }

            return max;
        }
    }
}, {
    PARSERS: {
        demographics: _ParseHelper.ParseHelper.Collection(_OrderDemographics.OrderDemographicCollection),
        payment: _ParseHelper.ParseHelper.Model(_Payment.Payment)
    }
});

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OrderDemographic = undefined;

var _BaseModel = __webpack_require__(0);

var _ParseHelper = __webpack_require__(3);

var _Demographics = __webpack_require__(5);

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
}, {
    PARSERS: {
        demographic: _ParseHelper.ParseHelper.Model(_Demographics.DemographicCollection)
    }
});

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Payment = undefined;

var _underscore = __webpack_require__(2);

var _underscore2 = _interopRequireDefault(_underscore);

var _Card = __webpack_require__(29);

var _BaseModel = __webpack_require__(0);

var _ParseHelper = __webpack_require__(3);

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
    PARSERS: {
        card: _ParseHelper.ParseHelper.Model(_Card.Card)
    }
}, PaymentMethods));

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.User = undefined;

var _underscore = __webpack_require__(2);

var _underscore2 = _interopRequireDefault(_underscore);

var _BaseModel = __webpack_require__(0);

var _ParseHelper = __webpack_require__(3);

var _Meta = __webpack_require__(32);

var _Delegators = __webpack_require__(25);

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

    initialize: function initialize() {
        _BaseModel.BaseModel.prototype.initialize.apply(this, arguments);

        this.delegators = new _Delegators.DelegatorCollection();
    },
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
    },
    getDelegators: function getDelegators() {
        return this.delegators;
    }
}, _underscore2.default.extend({
    PARSERS: {
        locale: _ParseHelper.ParseHelper.Locale,
        meta: _ParseHelper.ParseHelper.Model(_Meta.Meta)
    }
}, UserRoles));

/***/ }),
/* 19 */
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
    },


    isAvailable: function isAvailable() {
        return !this.isBlackedOut() && this.getTotalOpenCount() > 0;
    },

    isBlackedOut: function isBlackedOut() {
        var isBlackedOut = false;
        if (this.hasTimeSlots()) {
            var slots = this.get('slots');
            if (slots.length === 1) {
                var slot = slots.at(0);
                if (slot.get('count') === 0 && slot.get('time') === 0) {
                    isBlackedOut = true;
                }
            }
        }
        return isBlackedOut;
    },

    hasTimeSlots: function hasTimeSlots() {
        if (this.has('slots') && this.get('slots').size()) {
            var slots = this.get('slots');
            return !(slots.size() === 1 && slots.at(0).get('time') === 0);
        }
        return false;
    },

    getTotalOpenCount: function getTotalOpenCount() {
        var total = 0;
        this.get('slots').each(function (slot) {
            total += slot.get('count');
        });
        return total;
    }
});

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Fee = undefined;

var _BaseModel = __webpack_require__(0);

var Fee = exports.Fee = _BaseModel.BaseModel.extend({
    urlRoot: "/fees"
}, {
    AMOUNT_TYPE_PERCENT: 'percent',
    AMOUNT_TYPE_ABSOLUTE: 'absolute',

    SCOPE_PERSON: 'person',
    SCOPE_OUTING: 'outing'
});

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EventCollection = undefined;

var _BaseCollection = __webpack_require__(1);

var _Event = __webpack_require__(13);

var EventCollection = exports.EventCollection = _BaseCollection.BaseCollection.extend({
    model: _Event.Event
}, {
    POOL_ID: 'Events'
});

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UserCollection = undefined;

var _BaseCollection = __webpack_require__(1);

var _User = __webpack_require__(18);

var UserCollection = exports.UserCollection = _BaseCollection.BaseCollection.extend({
    model: _User.User
}, {
    POOL_ID: 'Users'
});

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Seller = undefined;

var _BaseModel = __webpack_require__(0);

var _Experiences = __webpack_require__(6);

var _Guides = __webpack_require__(27);

var Seller = exports.Seller = _BaseModel.BaseModel.extend({
    urlRoot: "/sellers",

    initialize: function initialize() {
        this.experiences = new _Experiences.ExperienceCollection();
        this.experiences.filters.seller = this.id;

        this.guides = new _Guides.GuideCollection(null, {
            parent: this
        });
        this.guides.filters.seller = this.id;
    },
    getExperiences: function getExperiences() {
        return this.experiences;
    },
    getGuides: function getGuides() {
        return this.guides;
    }
});

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AvailabilityCollection = undefined;

var _underscore = __webpack_require__(2);

var _underscore2 = _interopRequireDefault(_underscore);

var _BaseCollection = __webpack_require__(1);

var _Availability = __webpack_require__(19);

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
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DelegatorCollection = undefined;

var _BaseCollection = __webpack_require__(1);

var _Delegator = __webpack_require__(30);

var DelegatorCollection = exports.DelegatorCollection = _BaseCollection.BaseCollection.extend({
    model: _Delegator.Delegator

});

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FeeCollection = undefined;

var _BaseCollection = __webpack_require__(1);

var _Fee = __webpack_require__(20);

var FeeCollection = exports.FeeCollection = _BaseCollection.BaseCollection.extend({
    model: _Fee.Fee
}, {
    POOL_ID: 'Fees'
});

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GuideCollection = undefined;

var _BaseCollection = __webpack_require__(1);

var _Guide = __webpack_require__(31);

var GuideCollection = exports.GuideCollection = _BaseCollection.BaseCollection.extend({
    model: _Guide.Guide,

    findByUser: function findByUser(user) {
        return this.find(function (guide) {
            return guide.get("user").id == user.id;
        });
    }
}, {
    POOL_ID: 'Guides'
});

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _underscore = __webpack_require__(2);

var _underscore2 = _interopRequireDefault(_underscore);

var _backbone = __webpack_require__(8);

var _backbone2 = _interopRequireDefault(_backbone);

var _Config = __webpack_require__(4);

var _BaseModel = __webpack_require__(0);

var _BaseCollection = __webpack_require__(1);

var _Demographic = __webpack_require__(12);

var _Experience = __webpack_require__(14);

var _Event = __webpack_require__(13);

var _Order = __webpack_require__(15);

var _OrderDemographic = __webpack_require__(16);

var _Payment = __webpack_require__(17);

var _Seller = __webpack_require__(23);

var _User = __webpack_require__(18);

var _Demographics = __webpack_require__(5);

var _Experiences = __webpack_require__(6);

var _Events = __webpack_require__(21);

var _Orders = __webpack_require__(11);

var _OrderDemographics = __webpack_require__(10);

var _Users = __webpack_require__(22);

var _CollectionPool = __webpack_require__(9);

var _Account = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

    Service: {
        Account: _Account.Account
    },

    CollectionPool: _CollectionPool.CollectionPool,

    Config: _Config.Config,

    setUser: function setUser(user) {
        _Account.Account.currentUser = user;
    },
    getUser: function getUser() {
        return _Account.Account.currentUser;
    },
    login: function login(username, password, options) {
        var _this = this;

        options = options || {};
        var beforeSend = options.beforeSend;
        var success = options.success;

        options.beforeSend = function (jqXHR, settings) {
            settings.crossDomain = true;

            jqXHR.setRequestHeader("Authorization", "Basic " + btoa(username + ':' + password));

            if (beforeSend) return beforeSend.call(_this, jqXHR, settings);
        };
        options.success = function (data, textStatus, jqXHR) {
            if (success) success.call(_this, data, textStatus, jqXHR);

            _this.trigger("user.login", data);
        };

        _Account.Account.currentUser = new _User.User({ id: "me" });
        _Account.Account.currentUser.fetch(options);

        return _Account.Account.currentUser;
    },
    logout: function logout() {
        _Account.Account.currentUser = null;

        this.trigger("user.logout");
    }
};

var sdkInitialized;
if (!sdkInitialized) {
    _underscore2.default.extend(XolaBackboneSDK, _backbone2.default.Events);
    sdkInitialized = true;
}

module.exports = XolaBackboneSDK;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Card = undefined;

var _BaseModel = __webpack_require__(0);

var _jquery = __webpack_require__(33);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Card = exports.Card = _BaseModel.BaseModel.extend({
    defaults: function defaults() {
        return {
            number: '',
            cvv: '',
            expiryMonth: '',
            expiryYear: '',
            billingState: '',
            billingPostcode: '',
            billingName: '',
            billingCity: '',
            billingAddress: ''
        };
    },
    validation: function validation() {
        return {
            billingName: {
                required: true
            },
            number: {
                required: true,
                creditCard: true
            },
            cvv: {
                required: !(this.has('swipe') && this.get('swipe')),
                cvv: true,
                pattern: 'number',
                length: this.cardType() === 'American Express' ? 4 : 3
            },
            expiryMonth: {
                required: true,
                pattern: 'number'
            },
            expiryYear: {
                required: true,
                pattern: 'number'
            },
            billingPostcode: {
                required: true
            }
        };
    },
    cardType: function cardType() {
        var cardNumber = this.get('number');
        var p = {};
        p['51'] = 'Mastercard';
        p['52'] = 'Mastercard';
        p['53'] = 'Mastercard';
        p['54'] = 'Mastercard';
        p['55'] = 'Mastercard';
        p['34'] = 'American Express';
        p['37'] = 'American Express';
        p['4'] = 'VISA';
        p['6'] = 'Discover Card';
        p['35'] = 'JCB';
        p['30'] = 'Diners Club';
        p['36'] = 'Diners Club';
        p['38'] = 'Diners Club';

        if (cardNumber) {
            cardNumber = _jquery2.default.trim(cardNumber.toString());
            /* eslint-disable */
            for (var k in p) {
                if (cardNumber.indexOf(k) === 0) {
                    return p[k];
                }
            }
            /* eslint-enable */
        }

        return null;
    }
});

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Delegator = undefined;

var _BaseModel = __webpack_require__(0);

var _Config = __webpack_require__(4);

var Delegator = exports.Delegator = _BaseModel.BaseModel.extend({
    urlRoot: "/delegators",

    getPictureUrl: function getPictureUrl(size) {
        size = size || "small";
        return _Config.Config.baseUrl + this.url("/users") + "/picture?size=" + size;
    }
});

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Guide = undefined;

var _BaseModel = __webpack_require__(0);

var Guide = exports.Guide = _BaseModel.BaseModel.extend({
    urlRoot: "/guides"
});

/***/ }),
/* 32 */
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

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_33__;

/***/ })
/******/ ]);
});