"use strict";

var $ = window.$;
var Backbone = window.Backbone;
var _ = window._;
Backbone.$ = $;

var Common = require('../common');
var Products = require('../collections/Products');
var ProductView = require('./Product.js');

module.exports = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: '#todoapp',

    // Our template for the line of statistics at the bottom of the app.
    statsTemplate: _.template($('#stats-template').html()),

    // New
    // Delegated events for creating new items, and clearing completed ones.
    events: {
        'keypress #new-todo': 'createOnEnter',
        'click #clear-completed': 'clearCompleted',
        'click #toggle-all': 'toggleAllComplete'
    },

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function() {
        this.allCheckbox = this.$('#toggle-all')[0];
        this.$input = this.$('#new-todo');
        this.$footer = this.$('#footer');
        this.$main = this.$('#main');

        this.listenTo(Products, 'add', this.addOne);
        this.listenTo(Products, 'reset', this.addAll);

        // New
        this.listenTo(Products, 'change:completed', this.filterOne);
        this.listenTo(Products, 'filter', this.filterAll);
        this.listenTo(Products, 'all', this.render);
        Products.fetch({
            complete: function(xhr, textStatus) {
                console.log(textStatus);
            }
        });
    },

    // New
    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
        render: function() {
        var completed = Products.completed().length;
        var remaining = Products.remaining().length;

        if (Products.length) {
            this.$main.show();
            this.$footer.show();

            this.$footer.html(this.statsTemplate({
                completed: completed,
                remaining: remaining
            }));
            this.$('#filters li a')
                .removeClass('selected')
                .filter('[href="#/' + (Common.FILTER || '') + '"]')
                .addClass('selected');
        } else {
            this.$main.hide();
            this.$footer.hide();
        }

        this.allCheckbox.checked = !remaining;
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(product) {
        var view = new ProductView({
            model: product
        });
        $('#todo-list').append(view.render().el);
    },

    // Add all items in the **Todos** collection at once.
    addAll: function() {
        this.$('#todo-list').html('');
        Products.each(this.addOne, this);
    },

    // New
    filterOne: function(product) {
        product.trigger('visible');
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
            order: Products.nextOrder(),
            completed: false
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
    },

    // New
    // Clear all completed product items, destroying their models.
    clearCompleted: function() {
        _.invoke(Products.completed(), 'destroy');
        return false;
    },

    // New
    toggleAllComplete: function() {
        var completed = this.allCheckbox.checked;

        Products.each(function(product) {
            product.save({
                'completed': completed
            });
        });
    }
});
