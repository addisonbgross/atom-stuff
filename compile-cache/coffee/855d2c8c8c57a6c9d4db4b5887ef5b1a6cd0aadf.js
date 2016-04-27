(function() {
  var ContextVariableView, GlobalContext, View, WatchView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  ContextVariableView = require('../context/context-variable-view');

  GlobalContext = require('../models/global-context');

  module.exports = WatchView = (function(_super) {
    __extends(WatchView, _super);

    function WatchView() {
      return WatchView.__super__.constructor.apply(this, arguments);
    }

    WatchView.content = function() {
      return this.div({
        "class": 'native-key-bindings'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'watch-item'
          }, function() {
            _this.div({
              outlet: 'variable'
            });
            return _this.span({
              click: 'remove',
              "class": 'close-icon'
            });
          });
        };
      })(this));
    };

    WatchView.prototype.initialize = function(params) {
      this.watchpoint = params.watchpoint;
      this.autoopen = params.autoopen;
      this.GlobalContext = params.context;
      return this.render();
    };

    WatchView.prototype.remove = function() {
      return this.GlobalContext.removeWatchpoint(this.watchpoint);
    };

    WatchView.prototype.render = function() {
      var datum;
      datum = this.watchpoint.getValue();
      if (datum == null) {
        datum = {
          label: this.watchpoint.getExpression(),
          type: 'uninitialized'
        };
      }
      return this.variable.append(new ContextVariableView({
        variable: datum,
        parent: null,
        openpaths: this.autoopen
      }));
    };

    return WatchView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGhwLWRlYnVnL2xpYi93YXRjaC93YXRjaC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtREFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFDQSxtQkFBQSxHQUFzQixPQUFBLENBQVEsa0NBQVIsQ0FEdEIsQ0FBQTs7QUFBQSxFQUVBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLDBCQUFSLENBRmhCLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUosZ0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsU0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8scUJBQVA7T0FBTCxFQUFtQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNqQyxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sWUFBUDtXQUFMLEVBQTBCLFNBQUEsR0FBQTtBQUN4QixZQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE1BQUEsRUFBUSxVQUFSO2FBQUwsQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxjQUFBLEtBQUEsRUFBTyxRQUFQO0FBQUEsY0FBaUIsT0FBQSxFQUFPLFlBQXhCO2FBQU4sRUFGd0I7VUFBQSxDQUExQixFQURpQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5DLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsd0JBTUEsVUFBQSxHQUFZLFNBQUMsTUFBRCxHQUFBO0FBQ1YsTUFBQSxJQUFDLENBQUEsVUFBRCxHQUFjLE1BQU0sQ0FBQyxVQUFyQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsUUFBRCxHQUFZLE1BQU0sQ0FBQyxRQURuQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsYUFBRCxHQUFpQixNQUFNLENBQUMsT0FGeEIsQ0FBQTthQUdBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFKVTtJQUFBLENBTlosQ0FBQTs7QUFBQSx3QkFZQSxNQUFBLEdBQVEsU0FBQSxHQUFBO2FBQ04sSUFBQyxDQUFBLGFBQWEsQ0FBQyxnQkFBZixDQUFnQyxJQUFDLENBQUEsVUFBakMsRUFETTtJQUFBLENBWlIsQ0FBQTs7QUFBQSx3QkFlQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxRQUFaLENBQUEsQ0FBUixDQUFBO0FBQ0EsTUFBQSxJQUFPLGFBQVA7QUFDRSxRQUFBLEtBQUEsR0FBUTtBQUFBLFVBQ04sS0FBQSxFQUFRLElBQUMsQ0FBQSxVQUFVLENBQUMsYUFBWixDQUFBLENBREY7QUFBQSxVQUVOLElBQUEsRUFBTSxlQUZBO1NBQVIsQ0FERjtPQURBO2FBTUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxNQUFWLENBQXFCLElBQUEsbUJBQUEsQ0FBb0I7QUFBQSxRQUFDLFFBQUEsRUFBUyxLQUFWO0FBQUEsUUFBZ0IsTUFBQSxFQUFPLElBQXZCO0FBQUEsUUFBNEIsU0FBQSxFQUFVLElBQUMsQ0FBQSxRQUF2QztPQUFwQixDQUFyQixFQVBNO0lBQUEsQ0FmUixDQUFBOztxQkFBQTs7S0FGc0IsS0FMeEIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/php-debug/lib/watch/watch-view.coffee
