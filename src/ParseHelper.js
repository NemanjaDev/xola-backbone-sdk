import { BaseModel } from "./BaseModel";
import { BaseCollection } from "./BaseCollection";
import { CollectionPool } from "./CollectionPool";

export const ParseHelper = {
    Date(dateString) {
        return new Date(dateString);
    },

    Model(type) {
        if (type.prototype instanceof BaseCollection) {
            return function(attributes, options) {
                const idAttribute = type.prototype.model.prototype.idAttribute;

                const model = CollectionPool.getCollection(type).get(attributes[idAttribute], true);

                model.set(model.parse(attributes, options), options);

                return model;
            }
        }

        if (type.prototype instanceof BaseModel) {
            return function(attributes, options) {
                const model = new type(attributes, { parse: true });

                return model;
            }
        }
    },

    Collection(type) {
        return function(collection, models) {
            return new type(models);
        }
    }
};