import _ from "underscore";
import Backbone from "backbone";
import { Config } from "./Config";
import { Account } from "./services/Account";

export const BaseModel = Backbone.Model.extend({
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
    initialize(attributes, options = {}) {
        _.defaults(options, {
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
    url(urlRoot) {
        const parentUrl = this.parent ? this.parent.url(this.parentUrlRoot) : '';

        var url;
        if (urlRoot) {
            if (this.isNew()) {
                url = urlRoot;
            }
            else {
                var id = this.get(this.idAttribute);
                url = urlRoot.replace(/[^\/]$/, '$&/') + encodeURIComponent(id);
            }
        }
        else {
            url = Backbone.Model.prototype.url.apply(this);
        }

        return parentUrl + url;
    },

    sync(method, model, options) {
        var beforeSend = options.beforeSend;
        options.beforeSend = (jqXHR, settings) => {
            settings.url = Config.baseUrl + settings.url;
            settings.crossDomain = true;

            if (Account.currentUser && Account.currentUser.has('apiKey')) {
                jqXHR.setRequestHeader("X-API-KEY", Account.currentUser.get('apiKey'));
            }

            jqXHR.setRequestHeader("X-API-VERSION", Config.apiVersion);

            if (beforeSend) return beforeSend.call(this, jqXHR, settings);
        };

        return Backbone.Model.prototype.sync.call(this, method, model, options);
    },

    fetch(options = {}) {
        _.defaults(options, {
            data: {}
        });
        _.extend(options.data, this.filters);

        return Backbone.Model.prototype.fetch.apply(this, [options]);
    },

    /**
     * Override the default `parse` method so that we can reuse nested models that have already been instantiated.
     * This helps reduce a lot of boilerplate code and also ensures that all listeners are kept intact.
     *
     * @param {Object} resp
     * @param {Object} options Include a `blacklist` array to indicate the keys that should be skipped
     * @return {Object}
     */
    parse(resp, options = {}) {
        if (!resp) return resp;

        _.each(resp, (value, key) => {
            var parsedValue = value;

            if (this.constructor.PARSERS && this.constructor.PARSERS[key]) {
                parsedValue = this.constructor.PARSERS[key](value, options, this);

                if (parsedValue instanceof Backbone.Model) {
                    if (this.has(key) && this.get(key).id == parsedValue.id) {
                        this.get(key).set(parsedValue.attributes);

                        parsedValue = this.get(key);
                    }
                }

                if (parsedValue instanceof Backbone.Collection) {
                    if (this.has(key)) {
                        this.get(key).set(parsedValue.models);

                        parsedValue = this.get(key);
                    }
                }
            }

            resp[key] = parsedValue;
        });

        return resp;
    }
});
