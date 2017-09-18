import Backbone from "backbone";
import { BaseModel } from "./BaseModel"

export const BaseCollection = Backbone.Collection.extend({
    model: BaseModel,

    /**
     * Override the default `initialize` to support nested models by default.
     * If overriding this method, make sure you always call BaseModel.prototype.initialize.apply(this, options) first.
     *
     * @param parent
     */
    initialize({
        parent = null
    } = {}) {
        this.parent = parent;
    },

    /**
     * Override default `url` method so that url can be derived from associated model.
     *
     * @returns {string}
     */
    url() {
        const base = this.parent ? this.parent.url() : '';

        return base + this.model.prototype.urlRoot;
    },

    /**
     * Override so we can parse out paging information.
     *
     * @param {Object} resp
     * @returns {Object} Response model data (without paging information)
     */
    parse(resp) {
        if (resp.hasOwnProperty("paging") && resp.hasOwnProperty("data")) {
            return resp.data;
        }

        return resp;
    },

    get(id, create = false) {
        let model = Backbone.Collection.prototype.get.apply(this, [id]);

        if (!model && create) {
            let attributes = {};
            attributes[this.model.prototype.idAttribute] = id;

            model = new this.model(attributes);
            this.add(model);
        }

        return model;
    }
}, {
    buildModelPropertyComparator(property) {
        return function(model) {
            return model.get(property);
        }
    }
});