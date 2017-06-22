import _ from "underscore";
import { BaseModel } from "../BaseModel";
import { ParseHelper } from "../ParseHelper";
import { Meta } from "../models/Meta";

export const User = BaseModel.extend({
    urlRoot: "/users",

    hasRole(role) {
        return _.contains(this.get('roles'), role);
    },

    isSeller() {
        return this.hasRole(User.ROLE_SELLER);
    },

    isAdmin() {
        return this.hasRole(User.ROLE_ADMIN) || this.hasRole(User.ROLE_SUPER_ADMIN);
    },

    isReservationist() {
        return this.hasRole(User.ROLE_RESERVATION) || this.hasRole(User.ROLE_RESERVATION_LITE);
    },

    isGuideManager() {
        return this.hasRole(User.ROLE_GUIDE_MANAGER);
    }
}, {
    ROLE_SELLER: "ROLE_SELLER",
    ROLE_SUPER_ADMIN: "ROLE_SUPER_ADMIN",
    ROLE_ADMIN: "ROLE_ADMIN",
    ROLE_RESERVATION: "ROLE_RESERVATION",
    ROLE_RESERVATION_LITE: "ROLE_RESERVATION_LITE",
    ROLE_GUIDE_MANAGER: "ROLE_GUIDE_MANAGER",

    PARSERS: {
        locale: ParseHelper.Locale,
        meta: ParseHelper.Model(Meta, true)
    }
});
