(function() {
  var AttachedPopover, Popover,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Popover = require('./popover');

  module.exports = AttachedPopover = (function(_super) {
    __extends(AttachedPopover, _super);


    /*
        NOTE: The reason we do not use Atom's native tooltip is because it is attached to an element, which caused
        strange problems such as tickets #107 and #72. This implementation uses the same CSS classes and transitions but
        handles the displaying manually as we don't want to attach/detach, we only want to temporarily display a popover
        on mouseover.
     */

    AttachedPopover.prototype.timeoutId = null;

    AttachedPopover.prototype.elementToAttachTo = null;


    /**
     * Constructor.
     *
     * @param {HTMLElement} elementToAttachTo The element to show the popover over.
     * @param {int}         delay             How long the mouse has to hover over the elment before the popover shows
     *                                        up (in miliiseconds).
     */

    function AttachedPopover(elementToAttachTo, delay) {
      this.elementToAttachTo = elementToAttachTo;
      if (delay == null) {
        delay = 500;
      }
      AttachedPopover.__super__.constructor.call(this);
    }


    /**
     * Destructor.
     *
     */

    AttachedPopover.prototype.destructor = function() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
      return AttachedPopover.__super__.destructor.call(this);
    };


    /**
     * Shows the popover with the specified text.
     *
     * @param {int} fadeInTime The amount of time to take to fade in the tooltip.
     */

    AttachedPopover.prototype.show = function(fadeInTime) {
      var centerOffset, coordinates, x, y;
      if (fadeInTime == null) {
        fadeInTime = 100;
      }
      coordinates = this.elementToAttachTo.getBoundingClientRect();
      centerOffset = (coordinates.right - coordinates.left) / 2;
      x = coordinates.left - (this.$(this.getElement()).width() / 2) + centerOffset;
      y = coordinates.bottom;
      return AttachedPopover.__super__.show.call(this, x, y, fadeInTime);
    };


    /**
     * Shows the popover with the specified text after the specified delay (in miliiseconds). Calling this method
     * multiple times will cancel previous show requests and restart.
     *
     * @param {int}    delay      The delay before the tooltip shows up (in milliseconds).
     * @param {int}    fadeInTime The amount of time to take to fade in the tooltip.
     */

    AttachedPopover.prototype.showAfter = function(delay, fadeInTime) {
      if (fadeInTime == null) {
        fadeInTime = 100;
      }
      return this.timeoutId = setTimeout((function(_this) {
        return function() {
          return _this.show(fadeInTime);
        };
      })(this), delay);
    };

    return AttachedPopover;

  })(Popover);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1hdXRvY29tcGxldGUtcGhwL2xpYi9zZXJ2aWNlcy9hdHRhY2hlZC1wb3BvdmVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3QkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBQVYsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBRU07QUFDRixzQ0FBQSxDQUFBOztBQUFBO0FBQUE7Ozs7O09BQUE7O0FBQUEsOEJBTUEsU0FBQSxHQUFXLElBTlgsQ0FBQTs7QUFBQSw4QkFPQSxpQkFBQSxHQUFtQixJQVBuQixDQUFBOztBQVNBO0FBQUE7Ozs7OztPQVRBOztBQWdCYSxJQUFBLHlCQUFFLGlCQUFGLEVBQXFCLEtBQXJCLEdBQUE7QUFDVCxNQURVLElBQUMsQ0FBQSxvQkFBQSxpQkFDWCxDQUFBOztRQUQ4QixRQUFRO09BQ3RDO0FBQUEsTUFBQSwrQ0FBQSxDQUFBLENBRFM7SUFBQSxDQWhCYjs7QUFtQkE7QUFBQTs7O09BbkJBOztBQUFBLDhCQXVCQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFHLElBQUMsQ0FBQSxTQUFKO0FBQ0ksUUFBQSxZQUFBLENBQWEsSUFBQyxDQUFBLFNBQWQsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsU0FBRCxHQUFhLElBRGIsQ0FESjtPQUFBO2FBSUEsOENBQUEsRUFMUTtJQUFBLENBdkJaLENBQUE7O0FBOEJBO0FBQUE7Ozs7T0E5QkE7O0FBQUEsOEJBbUNBLElBQUEsR0FBTSxTQUFDLFVBQUQsR0FBQTtBQUNGLFVBQUEsK0JBQUE7O1FBREcsYUFBYTtPQUNoQjtBQUFBLE1BQUEsV0FBQSxHQUFjLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxxQkFBbkIsQ0FBQSxDQUFkLENBQUE7QUFBQSxNQUVBLFlBQUEsR0FBZ0IsQ0FBQyxXQUFXLENBQUMsS0FBWixHQUFvQixXQUFXLENBQUMsSUFBakMsQ0FBQSxHQUF5QyxDQUZ6RCxDQUFBO0FBQUEsTUFJQSxDQUFBLEdBQUksV0FBVyxDQUFDLElBQVosR0FBbUIsQ0FBQyxJQUFDLENBQUEsQ0FBRCxDQUFHLElBQUMsQ0FBQSxVQUFELENBQUEsQ0FBSCxDQUFpQixDQUFDLEtBQWxCLENBQUEsQ0FBQSxHQUE0QixDQUE3QixDQUFuQixHQUFxRCxZQUp6RCxDQUFBO0FBQUEsTUFLQSxDQUFBLEdBQUksV0FBVyxDQUFDLE1BTGhCLENBQUE7YUFPQSwwQ0FBTSxDQUFOLEVBQVMsQ0FBVCxFQUFZLFVBQVosRUFSRTtJQUFBLENBbkNOLENBQUE7O0FBNkNBO0FBQUE7Ozs7OztPQTdDQTs7QUFBQSw4QkFvREEsU0FBQSxHQUFXLFNBQUMsS0FBRCxFQUFRLFVBQVIsR0FBQTs7UUFBUSxhQUFhO09BQzVCO2FBQUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxVQUFBLENBQVcsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDcEIsS0FBQyxDQUFBLElBQUQsQ0FBTSxVQUFOLEVBRG9CO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWCxFQUVYLEtBRlcsRUFETjtJQUFBLENBcERYLENBQUE7OzJCQUFBOztLQUQwQixRQUo5QixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/atom-autocomplete-php/lib/services/attached-popover.coffee
