/*
 *  Project: Scrolly : parallax is easy as a matter of fact !
 *  Description: Based on jQuery boilerplate
 *  Author: Victor C. / Octave & Octave web agency
 *  Licence: MIT
 */
(function($) {
  'use strict';
  
    // Create the defaults once
    var pluginName = 'scrolly',
      defaults = {
        bgParallax: false
      },
      didScroll = false;
  
    function Plugin(element, options) {
      this.element = element;
      this.$element = $(this.element);
  
      this.options = $.extend({}, defaults, options);
  
      this._defaults = defaults;
      this._name = pluginName;
  
      this.init();
    }
  
    Plugin.prototype.init = function() {
      var self = this;
      this.startPosition = this.$element.position().top;
      this.offsetTop = this.$element.offset().top;
      this.height = this.$element.outerHeight(true);
      this.velocity = this.$element.attr('data-velocity');
      this.bgStart = parseInt(this.$element.attr('data-fit'), 10);
  
      $(document).scroll(function() {
        self.didScroll = true;
      });
  
      setInterval(function() {
        if (self.didScroll) {
          self.didScroll = false;
          self.scrolly();
        }
      }, 10);
    };
  
    Plugin.prototype.scrolly = function() {
      /*
      Is on screen
       */
        $.fn.isOnScreen = function(){
  
          var win = $(window);
  
          var viewport = {
              top : win.scrollTop(),
              left : win.scrollLeft()
          };
          viewport.right = viewport.left + win.width();
          viewport.bottom = viewport.top + win.height();
  
          var bounds = this.offset();
          bounds.right = bounds.left + this.outerWidth();
          bounds.bottom = bounds.top + this.outerHeight();
  
          return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
      };
  
  
  
      var dT = $(window).scrollTop(),
        wH = $(window).height(),
        position = this.startPosition;
  
  
      /*
      Verify if element is on screen
       */
      if($(this.element).isOnScreen()){
          var current = this.startPosition + (dT + (wH - this.offsetTop)) * this.velocity;
          position = parseInt(current, 10);
      }else{}
  
  
      // Fix background position
      if (this.bgStart) {
        position = position + this.bgStart;
      }
  
      if (this.options.bgParallax === true) {
        this.$element.css({
          backgroundPosition: '50% ' + position + 'px'
        });
      } else {
        this.$element.css({
          transform: 'translateY(' + position + 'px)',
          MozTransform: 'translateY(' + position + 'px)',
          WebkitTransform: 'translateY(' + position + 'px)',
          msTransform: 'translateY(' + position + 'px)'
        });
      }
    };
  
    $.fn[pluginName] = function(options) {
      return this.each(function() {
        if (!$.data(this, 'plugin_' + pluginName)) {
          $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
        }
      });
    };
  
}(jQuery));