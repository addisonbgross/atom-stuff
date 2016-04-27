(function() {
  var $, PhpDebugStatusView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  module.exports = PhpDebugStatusView = (function(_super) {
    __extends(PhpDebugStatusView, _super);

    PhpDebugStatusView.content = function() {
      return this.div({
        click: 'toggleDebugging',
        "class": 'php-debug-status-view'
      }, (function(_this) {
        return function() {
          _this.span({
            "class": 'icon icon-bug'
          });
          return _this.text('PHP Debug');
        };
      })(this));
    };

    function PhpDebugStatusView(statusBar, phpDebug) {
      this.phpDebug = phpDebug;
      PhpDebugStatusView.__super__.constructor.apply(this, arguments);
      statusBar.addLeftTile({
        item: this.element,
        priority: -100
      });
    }

    PhpDebugStatusView.prototype.toggleDebugging = function() {
      return this.phpDebug.toggleDebugging();
    };

    PhpDebugStatusView.prototype.setActive = function(active) {
      if (active) {
        return this.element.className = 'php-debug-status-view active';
      } else {
        return this.element.className = 'php-debug-status-view';
      }
    };

    return PhpDebugStatusView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGhwLWRlYnVnL2xpYi9zdGF0dXMvcGhwLWRlYnVnLXN0YXR1cy12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpQ0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBWSxPQUFBLENBQVEsc0JBQVIsQ0FBWixFQUFDLFNBQUEsQ0FBRCxFQUFJLFlBQUEsSUFBSixDQUFBOztBQUFBLEVBQ0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHlDQUFBLENBQUE7O0FBQUEsSUFBQSxrQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxLQUFBLEVBQU8saUJBQVA7QUFBQSxRQUEwQixPQUFBLEVBQU8sdUJBQWpDO09BQUwsRUFBK0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUM3RCxVQUFBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxZQUFBLE9BQUEsRUFBTyxlQUFQO1dBQU4sQ0FBQSxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxJQUFELENBQU0sV0FBTixFQUY2RDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQS9ELEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBS2EsSUFBQSw0QkFBQyxTQUFELEVBQWEsUUFBYixHQUFBO0FBQ1gsTUFEdUIsSUFBQyxDQUFBLFdBQUEsUUFDeEIsQ0FBQTtBQUFBLE1BQUEscURBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLFNBQVMsQ0FBQyxXQUFWLENBQXNCO0FBQUEsUUFBQSxJQUFBLEVBQU0sSUFBQyxDQUFBLE9BQVA7QUFBQSxRQUFnQixRQUFBLEVBQVUsQ0FBQSxHQUExQjtPQUF0QixDQURBLENBRFc7SUFBQSxDQUxiOztBQUFBLGlDQVNBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO2FBQ2YsSUFBQyxDQUFBLFFBQVEsQ0FBQyxlQUFWLENBQUEsRUFEZTtJQUFBLENBVGpCLENBQUE7O0FBQUEsaUNBWUEsU0FBQSxHQUFXLFNBQUMsTUFBRCxHQUFBO0FBQ1QsTUFBQSxJQUFHLE1BQUg7ZUFDRSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsR0FBcUIsK0JBRHZCO09BQUEsTUFBQTtlQUdFLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBVCxHQUFxQix3QkFIdkI7T0FEUztJQUFBLENBWlgsQ0FBQTs7OEJBQUE7O0tBRCtCLEtBRmpDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/php-debug/lib/status/php-debug-status-view.coffee
