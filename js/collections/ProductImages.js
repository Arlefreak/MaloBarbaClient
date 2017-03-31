"use strict";

var $        = window.$;
var Backbone = window.Backbone;
Backbone.$   = $;
var Common   = require('../common');
var Product  = require('../models/Product');

var ProductImages = Backbone.Collection.extend({
    model: Product,
    url: Common.URL + 'productImage',
    
    comparator: function(product) {
        return product.get('order');
    }
});

module.exports = new ProductImages();
