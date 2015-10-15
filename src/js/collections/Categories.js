"use strict";

var $        = window.$;
var Backbone = window.Backbone;
Backbone.$   = $;
var Common   = require('../common');
var Product  = require('../models/Product');

var Categories = Backbone.Collection.extend({
    model: Product,
    url: Common.URL + 'category',
    
    comparator: function(product) {
        return product.get('order');
    }
});

module.exports = new Categories();
