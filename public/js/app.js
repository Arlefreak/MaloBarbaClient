(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var $         = window.$;
var ENTER_KEY = 13;
var ListView  = require('./views/List');

$(function() {
    new ListView();
});

},{"./views/List":4}],2:[function(require,module,exports){
"use strict";

var $                 = window.$;
var Backbone          = window.Backbone;
var _                 = window._;
Backbone.$            = $;

var Product = require('../models/Product');

module.exports = Backbone.Collection.extend({
  model: Product,
  localStorage: new Backbone.LocalStorage('todos-backbone'),
  
  completed: function() {
    return this.filter(function( product ) {
      return product.get('completed');
    });
  },

  // Filter down the list to only product items that are still not finished.
  remaining: function() {
    return this.without.apply( this, this.completed() );
  },

  // We keep the Todos in sequential order, despite being saved by unordered
  // GUID in the database. This generates the next order number for new items.
  nextOrder: function() {
    if ( !this.length ) {
      return 1;
    }
    return this.last().get('order') + 1;
  },

  // Todos are sorted by their original insertion order.
  comparator: function( product ) {
    return product.get('order');
  }
});

},{"../models/Product":3}],3:[function(require,module,exports){
"use strict";

var $ = window.$;
var Backbone = window.Backbone;
var _ = window._; 
Backbone.$ = $;

module.exports = Backbone.Model.extend({
  defaults: {
    title: '',
    completed: false
  },

  toggle: function() {
    this.save({
      completed: !this.get('completed')
    });
  }
});

},{}],4:[function(require,module,exports){
"use strict";

var $ = window.$;
var Backbone = window.Backbone;
var _ = window._; 
Backbone.$ = $;

var Products = require('../collections/Products')
var ENTER_KEY = 13;

module.exports = Backbone.View.extend({

  // Instead of generating a new element, bind to the existing skeleton of
  // the App already present in the HTML.
  el: '#todoapp',

  // Our template for the line of statistics at the bottom of the app.
  statsTemplate: _.template( $('#stats-template').html() ),

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
    this.listenTo(Products,'filter', this.filterAll);
    this.listenTo(Products, 'all', this.render);
    this.products = new Products();
    this.products.fetch();
  },

  // New
  // Re-rendering the App just means refreshing the statistics -- the rest
  // of the app doesn't change.
  render: function() {
    var completed = Products.completed().length;
    var remaining = Products.remaining().length;

    if ( Products.length ) {
      this.$main.show();
      this.$footer.show();

      this.$footer.html(this.statsTemplate({
        completed: completed,
        remaining: remaining
      }));

      this.$('#filters li a')
      .removeClass('selected')
      .filter('[href="#/' + ( app.TodoFilter || '' ) + '"]')
      .addClass('selected');
    } else {
      this.$main.hide();
      this.$footer.hide();
    }

    this.allCheckbox.checked = !remaining;
  },

  // Add a single todo item to the list by creating a view for it, and
  // appending its element to the `<ul>`.
  addOne: function( product ) {
    var view = new app.TodoView({ model: product });
    $('#todo-list').append( view.render().el );
  },

  // Add all items in the **Todos** collection at once.
  addAll: function() {
    this.$('#todo-list').html('');
    Products.each(this.addOne, this);
  },

  // New
  filterOne : function (product) {
    product.trigger('visible');
  },

  // New
  filterAll : function () {
    Products.each(this.filterOne, this);
  },


  // New
  // Generate the attributes for a new Todo item.
  newAttributes: function() {
    return {
      title: this.$input.val().trim(),
      order: this.products.nextOrder(), 
      completed: false
    };
  },

  // New
  // If you hit return in the main input field, create new Todo model,
  // persisting it to localStorage.
  createOnEnter: function( event ) {
    if ( event.which !== ENTER_KEY || !this.$input.val().trim() ) {
      return;
    }

    this.products.create( this.newAttributes() );
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

    Products.each(function( product ) {
      product.save({
        'completed': completed
      });
    });
  }
});

},{"../collections/Products":2}]},{},[1])


//# sourceMappingURL=app.js.map
