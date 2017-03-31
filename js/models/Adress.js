"use strict";

var $ = window.$;
var Backbone = window.Backbone;
var Common = require('../common.js');
Backbone.$ = $;

module.exports = Backbone.Model.extend({
    urlRoot: Common.URL + 'adress',
    defaults: {
        pk: 0,
        client: 0,
        name: '',
        type: '',
        default: false,
        firstname: '',
        lastname: '',
        adress_line1: '',
        adress_line2: '',
        city: '',
        state_province: '',
        country: '',
        zipcode: '',
        phone_number: '',
        date: ''
    },

    url: function() {
        return this.urlRoot + '/' + this.pk;
    }
});
