"use strict";

var $        = window.$;
var Backbone = window.Backbone;
Backbone.$   = $;
var Common   = require('../common');
var Product  = require('../models/Product');

var Products = Backbone.Collection.extend({
    model: Product,
    url: Common.URL + 'product?status=IN',

    // inStock: function(){
    //     return this.filter(function(product) {
    //         return product.get('inventory');
    //     });
    // },

    comparator: function(product) {
        return product.get('order');
    }
});

module.exports = new Products();
