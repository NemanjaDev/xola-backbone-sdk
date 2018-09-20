import _ from "underscore";
import Backbone from "backbone";
import { BaseModel } from "./BaseModel"
import { Config } from "./Config";
import { Account } from "./services/Account";

export const BaseCollection = Backbone.Collection.extend({
    model: BaseModel,
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
    initialize(models = null, options = {}) {
        _.defaults(options, {
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
    url() {
        const base = this.parent ? this.parent.url() : '';
        const urlRoot = this.urlRoot ? this.urlRoot : this.model.prototype.urlRoot;

        return base + urlRoot;
    },

    /**
     * Override so we can parse out paging information.
     *
     * @param {Object} resp
     * @returns {Object} Response model data (without paging information)
     */
    parse(resp) {
        if (resp.hasOwnProperty("paging") && resp.hasOwnProperty("data")) {
            this.paging.next = resp.paging.next;

            return resp.data;
        }

        return resp;
    },

    sync(method, model, options) {
        var beforeSend = options.beforeSend;
        options.beforeSend = (jqXHR, settings) => {
            settings.url = Config.baseUrl + settings.url;
            settings.crossDomain = true;

            if (Config.apiKey) {
                jqXHR.setRequestHeader("X-API-KEY", Config.apiKey);
            }

            if (Account.currentUser && Account.currentUser.has('apiKey')) {
                jqXHR.setRequestHeader("X-API-KEY", Account.currentUser.get('apiKey'));
            }

            jqXHR.setRequestHeader("X-API-VERSION", Config.apiVersion);

            if (beforeSend) return beforeSend.call(this, jqXHR, settings);
        };

        return Backbone.Collection.prototype.sync.call(this, method, model, options);
    },

    get(id, create = false) {
        var model = Backbone.Collection.prototype.get.call(this, id);

        if (!model && create) {
            var attributes = {};
            attributes[this.model.prototype.idAttribute] = id;
            model = new this.model(attributes);
            this.add(model);
        }

        return model;
    },

    fetch(options = {}) {
        _.defaults(options, {
            data: {}
        });
        _.extend(options.data, this.filters);

        return Backbone.Collection.prototype.fetch.apply(this, [options]);
    }
}, {
    buildModelPropertyComparator(property) {
        return function(model) {
            return model.get(property);
        }
    }
});