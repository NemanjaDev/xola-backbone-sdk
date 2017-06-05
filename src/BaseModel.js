import _ from "underscore";
import Backbone from "backbone";

const url = Backbone.Model.prototype.url;

_.extend(Backbone.Model.prototype, {
    // Adding possibility to override urlRoot
    url(urlRoot) {
        if (urlRoot) {
            if (this.isNew()) return urlRoot;
            var id = this.get(this.idAttribute);
            return urlRoot.replace(/[^\/]$/, '$&/') + encodeURIComponent(id);
        }

        return url.apply(this);
    }
});

export const BaseModel = Backbone.Model.extend({
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
    initialize({
        parent = null
    } = {}) {
        this.parent = parent;
    },

    /**
     * Override the default `url` method so that nested urls can be constructed.
     *
     * @returns {string}
     */
    url() {
        const base = this.parent ? Backbone.Model.prototype.url.apply(this.parent, [this.parentUrlRoot]) : '';

        return base + Backbone.Model.prototype.url.apply(this);
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

        var response = resp;

        // Make sure that the `defaults` on your model is function and not object
        // If `defaults` is an object, that will get overridden by value in latest response
        var attributes = _.defaults(this.attributes, _.result(this, 'defaults', {}));
        var blacklist = options.blacklist || [];

        _.each(response, function(respValue, key) {
            if (!_.contains(blacklist, key)) {
                var modelValue = attributes[key];

                if (modelValue instanceof Backbone.Model) {
                    // This is most likely a Backbone model, so set data into the existing model.
                    // Do not re-instantiate since the existing model may have listeners on it.
                    var data = options.parse ? modelValue.parse(respValue, options) : respValue;
                    modelValue.set(data, options);
                    response[key] = modelValue;
                }

                if (modelValue instanceof Backbone.Collection) {
                    modelValue.set(respValue, options);
                    response[key] = modelValue;
                }
            }
        });

        return resp;
    }
});
