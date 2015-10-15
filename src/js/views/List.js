"use strict";

var $ = window.$;
var Backbone = window.Backbone;
Backbone.$ = $;

var Common = require('../common');
var Products = require('../collections/Products');
var ProductView = require('./Product.js');

module.exports = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: '#storeApp',

    // New
    // Delegated events for creating new items, and clearing completed ones.
    events: {
        // 'keypress #new-todo': 'createOnEnter',
        // 'click #clear-completed': 'clearCompleted',
        // 'click #toggle-all': 'toggleAllComplete'
    },

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function() {
        // this.allCheckbox = this.$('#toggle-all')[0];
        // this.$input = this.$('#new-todo');
        this.$footer = this.$('#footer');
        this.$main = this.$('#storeApp');

        this.listenTo(Products, 'add', this.addOne);
        this.listenTo(Products, 'reset', this.addAll);

        // New
        this.listenTo(Products, 'filter', this.filterAll);
        this.listenTo(Products, 'all', this.render);
        Products.fetch({reset:true});
    },

    // New
    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
        render: function() {

        if (Products.length) {
            this.$main.show();
            this.$footer.show();
        } else {
            this.$main.hide();
            this.$footer.hide();
        }
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(product) {
        var view = new ProductView({
            model: product
        });
        $('#productList').append(view.render().el);
    },

    // Add all items in the **Todos** collection at once.
    addAll: function() {
        this.$('#productList').html('');
        Products.each(this.addOne, this);
    },

    // New
    filterOne: function(product) {
        // product.trigger('visible');
    },

    // New
    filterAll: function() {
        Products.each(this.filterOne, this);
    },


    // New
    // Generate the attributes for a new Todo item.
    newAttributes: function() {
        return {
            name: this.$input.val().trim(),
        };
    },

    // New
    // If you hit return in the main input field, create new Todo model,
    // persisting it to localStorage.
    createOnEnter: function(event) {
        if (event.which !== Common.ENTER_KEY || !this.$input.val().trim()) {
            return;
        }
        Products.create(this.newAttributes());
        this.$input.val('');
    }
});
