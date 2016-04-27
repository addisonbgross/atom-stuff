(function() {
  var Disposable, Popover,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Disposable = require('atom').Disposable;

  module.exports = Popover = (function(_super) {
    __extends(Popover, _super);

    Popover.prototype.element = null;


    /**
     * Constructor.
     */

    function Popover() {
      this.$ = require('jquery');
      this.element = document.createElement('div');
      this.element.className = 'tooltip bottom fade php-atom-autocomplete-popover';
      this.element.innerHTML = "<div class='tooltip-arrow'></div><div class='tooltip-inner'></div>";
      document.body.appendChild(this.element);
      Popover.__super__.constructor.call(this, this.destructor);
    }


    /**
     * Destructor.
     */

    Popover.prototype.destructor = function() {
      this.hide();
      return document.body.removeChild(this.element);
    };


    /**
     * Retrieves the HTML element containing the popover.
     *
     * @return {HTMLElement}
     */

    Popover.prototype.getElement = function() {
      return this.element;
    };


    /**
     * sets the text to display.
     *
     * @param {string} text
     */

    Popover.prototype.setText = function(text) {
      return this.$('.tooltip-inner', this.element).html('<div class="php-atom-autocomplete-popover-wrapper">' + text.replace(/\n\n/g, '<br/><br/>') + '</div>');
    };


    /**
     * Shows a popover at the specified location with the specified text and fade in time.
     *
     * @param {int}    x          The X coordinate to show the popover at (left).
     * @param {int}    y          The Y coordinate to show the popover at (top).
     * @param {int}    fadeInTime The amount of time to take to fade in the tooltip.
     */

    Popover.prototype.show = function(x, y, fadeInTime) {
      if (fadeInTime == null) {
        fadeInTime = 100;
      }
      this.$(this.element).css('left', x + 'px');
      this.$(this.element).css('top', y + 'px');
      this.$(this.element).addClass('in');
      this.$(this.element).css('opacity', 100);
      return this.$(this.element).css('display', 'block');
    };


    /**
     * Hides the tooltip, if it is displayed.
     */

    Popover.prototype.hide = function() {
      this.$(this.element).removeClass('in');
      this.$(this.element).css('opacity', 0);
      return this.$(this.element).css('display', 'none');
    };

    return Popover;

  })(Disposable);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1hdXRvY29tcGxldGUtcGhwL2xpYi9zZXJ2aWNlcy9wb3BvdmVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBRU07QUFDRiw4QkFBQSxDQUFBOztBQUFBLHNCQUFBLE9BQUEsR0FBUyxJQUFULENBQUE7O0FBRUE7QUFBQTs7T0FGQTs7QUFLYSxJQUFBLGlCQUFBLEdBQUE7QUFDVCxNQUFBLElBQUMsQ0FBQSxDQUFELEdBQUssT0FBQSxDQUFRLFFBQVIsQ0FBTCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBRlgsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULEdBQXFCLG1EQUhyQixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsR0FBcUIsb0VBSnJCLENBQUE7QUFBQSxNQU1BLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBZCxDQUEwQixJQUFDLENBQUEsT0FBM0IsQ0FOQSxDQUFBO0FBQUEsTUFRQSx5Q0FBTSxJQUFDLENBQUEsVUFBUCxDQVJBLENBRFM7SUFBQSxDQUxiOztBQWdCQTtBQUFBOztPQWhCQTs7QUFBQSxzQkFtQkEsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQUFBLENBQUE7YUFDQSxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQWQsQ0FBMEIsSUFBQyxDQUFBLE9BQTNCLEVBRlE7SUFBQSxDQW5CWixDQUFBOztBQXVCQTtBQUFBOzs7O09BdkJBOztBQUFBLHNCQTRCQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1IsYUFBTyxJQUFDLENBQUEsT0FBUixDQURRO0lBQUEsQ0E1QlosQ0FBQTs7QUErQkE7QUFBQTs7OztPQS9CQTs7QUFBQSxzQkFvQ0EsT0FBQSxHQUFTLFNBQUMsSUFBRCxHQUFBO2FBQ0wsSUFBQyxDQUFBLENBQUQsQ0FBRyxnQkFBSCxFQUFxQixJQUFDLENBQUEsT0FBdEIsQ0FBOEIsQ0FBQyxJQUEvQixDQUNJLHFEQUFBLEdBQXdELElBQUksQ0FBQyxPQUFMLENBQWEsT0FBYixFQUFzQixZQUF0QixDQUF4RCxHQUE4RixRQURsRyxFQURLO0lBQUEsQ0FwQ1QsQ0FBQTs7QUF5Q0E7QUFBQTs7Ozs7O09BekNBOztBQUFBLHNCQWdEQSxJQUFBLEdBQU0sU0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLFVBQVAsR0FBQTs7UUFBTyxhQUFhO09BQ3RCO0FBQUEsTUFBQSxJQUFDLENBQUEsQ0FBRCxDQUFHLElBQUMsQ0FBQSxPQUFKLENBQVksQ0FBQyxHQUFiLENBQWlCLE1BQWpCLEVBQXlCLENBQUEsR0FBSSxJQUE3QixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxDQUFELENBQUcsSUFBQyxDQUFBLE9BQUosQ0FBWSxDQUFDLEdBQWIsQ0FBaUIsS0FBakIsRUFBd0IsQ0FBQSxHQUFJLElBQTVCLENBREEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLENBQUQsQ0FBRyxJQUFDLENBQUEsT0FBSixDQUFZLENBQUMsUUFBYixDQUFzQixJQUF0QixDQUhBLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxDQUFELENBQUcsSUFBQyxDQUFBLE9BQUosQ0FBWSxDQUFDLEdBQWIsQ0FBaUIsU0FBakIsRUFBNEIsR0FBNUIsQ0FKQSxDQUFBO2FBS0EsSUFBQyxDQUFBLENBQUQsQ0FBRyxJQUFDLENBQUEsT0FBSixDQUFZLENBQUMsR0FBYixDQUFpQixTQUFqQixFQUE0QixPQUE1QixFQU5FO0lBQUEsQ0FoRE4sQ0FBQTs7QUF3REE7QUFBQTs7T0F4REE7O0FBQUEsc0JBMkRBLElBQUEsR0FBTSxTQUFBLEdBQUE7QUFDRixNQUFBLElBQUMsQ0FBQSxDQUFELENBQUcsSUFBQyxDQUFBLE9BQUosQ0FBWSxDQUFDLFdBQWIsQ0FBeUIsSUFBekIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsQ0FBRCxDQUFHLElBQUMsQ0FBQSxPQUFKLENBQVksQ0FBQyxHQUFiLENBQWlCLFNBQWpCLEVBQTRCLENBQTVCLENBREEsQ0FBQTthQUVBLElBQUMsQ0FBQSxDQUFELENBQUcsSUFBQyxDQUFBLE9BQUosQ0FBWSxDQUFDLEdBQWIsQ0FBaUIsU0FBakIsRUFBNEIsTUFBNUIsRUFIRTtJQUFBLENBM0ROLENBQUE7O21CQUFBOztLQURrQixXQUp0QixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/atom-autocomplete-php/lib/services/popover.coffee
