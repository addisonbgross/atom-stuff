(function() {
  var BreakpointItemView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  module.exports = BreakpointItemView = (function(_super) {
    __extends(BreakpointItemView, _super);

    function BreakpointItemView() {
      return BreakpointItemView.__super__.constructor.apply(this, arguments);
    }

    BreakpointItemView.content = function() {
      return BreakpointItemView.li({
        "class": 'meow'
      }, function() {
        return BreakpointItemView.div({
          "class": 'meow'
        }, function() {
          BreakpointItemView.span({
            "class": 'breakpoint-path',
            outlet: 'path'
          });
          return BreakpointItemView.span({
            "class": 'breakpoint-line',
            outlet: 'line'
          });
        });
      });
    };

    BreakpointItemView.prototype.initialize = function(breakpoint) {
      this.breakpoint = breakpoint;
      return this.render();
    };

    BreakpointItemView.prototype.render = function() {
      this.path.append(this.breakpoint.getPath());
      this.line.append('(' + this.breakpoint.getLine() + ')');
      this.find('.breakpoint-path').data('path', this.breakpoint.getPath());
      return this.find('.breakpoint-line').data('line', this.breakpoint.getLine());
    };

    return BreakpointItemView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGhwLWRlYnVnL2xpYi9icmVha3BvaW50L2JyZWFrcG9pbnQtaXRlbS12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3QkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0oseUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsa0JBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1Isa0JBQUMsQ0FBQSxFQUFELENBQUk7QUFBQSxRQUFBLE9BQUEsRUFBTyxNQUFQO09BQUosRUFBbUIsU0FBQSxHQUFBO2VBQ2pCLGtCQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsVUFBQSxPQUFBLEVBQU8sTUFBUDtTQUFMLEVBQW9CLFNBQUEsR0FBQTtBQUNsQixVQUFBLGtCQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsWUFBQSxPQUFBLEVBQU8saUJBQVA7QUFBQSxZQUEwQixNQUFBLEVBQVEsTUFBbEM7V0FBTixDQUFBLENBQUE7aUJBQ0Esa0JBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxZQUFBLE9BQUEsRUFBTyxpQkFBUDtBQUFBLFlBQTBCLE1BQUEsRUFBUSxNQUFsQztXQUFOLEVBRmtCO1FBQUEsQ0FBcEIsRUFEaUI7TUFBQSxDQUFuQixFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLGlDQU1BLFVBQUEsR0FBWSxTQUFDLFVBQUQsR0FBQTtBQUNWLE1BQUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxVQUFkLENBQUE7YUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBRlU7SUFBQSxDQU5aLENBQUE7O0FBQUEsaUNBVUEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLE1BQUEsSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFOLENBQWEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQUEsQ0FBYixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTixDQUFhLEdBQUEsR0FBTSxJQUFDLENBQUEsVUFBVSxDQUFDLE9BQVosQ0FBQSxDQUFOLEdBQThCLEdBQTNDLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLElBQUQsQ0FBTSxrQkFBTixDQUF5QixDQUFDLElBQTFCLENBQStCLE1BQS9CLEVBQXVDLElBQUMsQ0FBQSxVQUFVLENBQUMsT0FBWixDQUFBLENBQXZDLENBRkEsQ0FBQTthQUdBLElBQUMsQ0FBQSxJQUFELENBQU0sa0JBQU4sQ0FBeUIsQ0FBQyxJQUExQixDQUErQixNQUEvQixFQUF1QyxJQUFDLENBQUEsVUFBVSxDQUFDLE9BQVosQ0FBQSxDQUF2QyxFQUpNO0lBQUEsQ0FWUixDQUFBOzs4QkFBQTs7S0FEK0IsS0FIakMsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/php-debug/lib/breakpoint/breakpoint-item-view.coffee
