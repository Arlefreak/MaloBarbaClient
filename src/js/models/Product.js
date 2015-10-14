"use strict";

var $ = window.$;
var Backbone = window.Backbone;
var Common = require('../common.js');
Backbone.$ = $;

module.exports = Backbone.Model.extend({
    urlRoot: Common.URL,
    defaults: {
        pk: -1,
        sku: '',
        name: '',
        image: '',
        description: '',
        price: 0,
        discount: 0,
        inventory: 0,
        status: '',
        tags: [],
        category: '',
        date: '',
        updated: '',
        order: 0,
        title: 'test',
        completed: false
    },

    url: function() {
        return this.urlRoot + '/' + this.pk;
    },

    fetchSuccess: function(collection, response) {
        console.log('Collection fetch success', response);
        console.log('Collection models: ', collection.models);
    },

    fetchError: function(collection, response) {
        throw new Error("Books fetch error");
    },

    toggle: function() {
        this.save({
            completed: !this.get('completed')
        });
    }
});
