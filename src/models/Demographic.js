import { BaseModel } from "../BaseModel";

export const Demographic = BaseModel.extend({
    urlRoot: "/demographics",

    demographicsMap: {
        children: ['child', 'children', 'junior'],
        adult: ['adults', 'adult', 'guest', 'guests'],
        senior: ['senior', 'seniors'],
        veteran: ['military', 'veteran', 'veterans', 'soldier', 'soldiers']
    },

    getLabel() {
        return this.get("label");
    },

    guessDemographicIcon: function(label) {
        label = label || this.get('label');
        label = label && label.toLowerCase();
        var icon = _.findKey(this.demographicsMap, function(list) {
            return _.contains(list, label);
        });
        return icon || 'adult';
    },
});