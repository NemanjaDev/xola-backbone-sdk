import _ from "underscore";
import { BaseModel } from "../BaseModel";
import { ParseHelper } from "../ParseHelper";
import { Meta } from "../models/Meta";

const UserRoles = {
    ROLE_SELLER: "ROLE_SELLER",
    ROLE_SUPER_ADMIN: "ROLE_SUPER_ADMIN",
    ROLE_ADMIN: "ROLE_ADMIN",
    ROLE_RESERVATION: "ROLE_RESERVATION",
    ROLE_RESERVATION_LITE: "ROLE_RESERVATION_LITE",
    ROLE_GUIDE_MANAGER: "ROLE_GUIDE_MANAGER"
};

export const User = BaseModel.extend({
    urlRoot: "/users",

    initialize() {
        BaseModel.prototype.initialize.apply(this, arguments);

        this.delegators = new DelegatorCollection(null, {
            parent: this
        });
        this.delegators.urlRoot = '/delegators';
    },

    hasRole(role) {
        return _.contains(this.get('roles'), role);
    },

    isSeller() {
        return this.hasRole(UserRoles.ROLE_SELLER);
    },

    isAdmin() {
        return this.hasRole(UserRoles.ROLE_ADMIN) || this.hasRole(UserRoles.ROLE_SUPER_ADMIN);
    },

    isReservationist() {
        return this.hasRole(UserRoles.ROLE_RESERVATION) || this.hasRole(UserRoles.ROLE_RESERVATION_LITE);
    },

    isGuideManager() {
        return this.hasRole(UserRoles.ROLE_GUIDE_MANAGER);
    },

    getDelegators() {
        return this.delegators;
    }
}, _.extend({
    PARSERS: {
        locale: ParseHelper.Locale,
        meta: ParseHelper.Model(Meta)
    }
}, UserRoles));

const Delegators = BaseModel.extend({
    urlRoot: "/delegators",
});

import { BaseCollection } from "../BaseCollection";

export const DelegatorCollection = BaseCollection.extend({
    model: User, //Backbone.Model,

    /**
     * Override so we can parse out paging information.
     *
     * @param {Object} resp
     * @returns {Object} Response model data (without paging information)
     */
    parse(resp) {
        if (resp.hasOwnProperty("sellers")) {
            return resp.sellers;
        }

        return resp;
    },
}, {
    POOL_ID: 'Delegators'
});