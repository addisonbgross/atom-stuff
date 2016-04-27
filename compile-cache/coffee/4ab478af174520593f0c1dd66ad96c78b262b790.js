(function() {
  var PhpDebugPanel, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  module.exports = PhpDebugPanel = (function(_super) {
    __extends(PhpDebugPanel, _super);

    function PhpDebugPanel() {
      return PhpDebugPanel.__super__.constructor.apply(this, arguments);
    }

    PhpDebugPanel.content = function() {
      return this.div({
        "class": "php-debug panel"
      }, (function(_this) {
        return function() {
          _this.div({
            "class": "panel-heading"
          }, "Node Debugger");
          return _this.div({
            "class": "panel-body padded"
          });
        };
      })(this));
    };

    return PhpDebugPanel;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGhwLWRlYnVnL2xpYi9waHAtZGVidWctcGFuZWwtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUJBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLE9BQVEsT0FBQSxDQUFRLE1BQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osb0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsYUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8saUJBQVA7T0FBTCxFQUErQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQzdCLFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLGVBQVA7V0FBTCxFQUE2QixlQUE3QixDQUFBLENBQUE7aUJBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLG1CQUFQO1dBQUwsRUFGNkI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvQixFQURRO0lBQUEsQ0FBVixDQUFBOzt5QkFBQTs7S0FEMEIsS0FINUIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/php-debug/lib/php-debug-panel-view.coffee
