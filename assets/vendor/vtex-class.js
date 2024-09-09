/* global document */
/* global window */
/* global $ */

/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function vtexClass(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  window.VtexClass = function(){};

  // Create a new Class that inherits from this class
 VtexClass.extend = function(prop) {
    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] === "function" &&
        typeof _super[name] === "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;

            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];

            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);
            this._super = tmp;

            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }

    // The dummy class constructor
    function VtexClass() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }

    // Populate our constructed prototype object
   VtexClass.prototype = prototype;

    // Enforce the constructor to be what we expect
   VtexClass.prototype.constructor = VtexClass;

    // And make this class extendable
   VtexClass.extend = vtexClass;

    return VtexClass;
  };
})();

/** Namespace **/
var APP = {
  core: {},
  component: {},
  controller: {},
  i: {}
};

$(window).load(function() {
  // new APP.core.Main();
});

$(document).ready(function () {
  new APP.core.Main();
});

/**
 * Util
 */
APP.core.Util = VtexClass.extend({
  getController: function () {
    var controller = $('meta[name=controller]').attr('content');
    return controller ? controller : false;
  }
});

/**
 * Main
 */
APP.core.Main = VtexClass.extend({
  init: function() {
    this.start();
  },

  start: function () {
    APP.i.util = new APP.core.Util();
    APP.i.general = new APP.controller.General();
    this.loadPageController();
  },

  loadPageController: function () {
    var controller = APP.i.util.getController();

    if (controller) {
      APP.i.currentController = new APP.controller[controller]();
    }
  }
});
