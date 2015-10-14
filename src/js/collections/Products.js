"use strict";

var $        = window.$;
var Backbone = window.Backbone;
Backbone.$   = $;
var Common   = require('../common');
var Product  = require('../models/Product');

var Products = Backbone.Collection.extend({
    model: Product,
    url: Common.URL + 'product',

    completed: function() {
        return this.filter(function(product) {
            return product.get('completed');
        });
    },

    // Filter down the list to only product items that are still not finished.
    remaining: function() {
        return this.without.apply(this, this.completed());
    },

    // We keep the Todos in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items.
    nextOrder: function() {
        if (!this.length) {
            return 1;
        }
        return this.last().get('order') + 1;
    },

    // Todos are sorted by their original insertion order.
    comparator: function(product) {
        return product.get('order');
    }
});

module.exports = new Products();
