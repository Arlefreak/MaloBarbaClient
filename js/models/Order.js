"use strict";

var $ = window.$;
var Backbone = window.Backbone;
var Common = require('../common.js');
Backbone.$ = $;

module.exports = Backbone.Model.extend({
    urlRoot: Common.URL + 'order',
    defaults: {
        pk: 0,
        sku: '',
        client: 0,
        shippingAdress: 0,
        billingAdress: 0,
        items_subTotal: 0.0,
        shipping_cost: 0.0,
        total: 0.0,
        shipping_carrier: '',
        shipping_tracking: '',
        date: '',
        updated: '',
        status: ''
    },

    url: function() {
        return this.urlRoot + '/' + this.pk;
    }
});
