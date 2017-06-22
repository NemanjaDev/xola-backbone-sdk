import { BaseModel } from "./BaseModel";
import { BaseCollection } from "./BaseCollection";
import { CollectionPool } from "./CollectionPool";

export const ParseHelper = {
    Date(dateString) {
        return new Date(dateString);
    },

    Locale(localeString) {
        return localeString.replace('_', '-');
    },

    Model(type, nested = false) {
        if (type.prototype instanceof BaseCollection) {
            return function(attributes, options) {
                const idAttribute = type.prototype.model.prototype.idAttribute;

                const model = CollectionPool.getCollection(type).get(attributes[idAttribute], true);

                model.set(model.parse(attributes, options), options);

                return model;
            }
        }

        if (type.prototype instanceof BaseModel) {
            return function(attributes, options, parent = null) {
                if (nested && parent) {
                    attributes.parent = parent;
                }

                return new type(attributes, { parse: true });
            }
        }
    },

    Collection(type) {
        return function(collection, models) {
            return new type(models);
        }
    }
};