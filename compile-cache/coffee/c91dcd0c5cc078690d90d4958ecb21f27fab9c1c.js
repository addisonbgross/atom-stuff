(function() {
  var CompositeDisposable, Pacmanfy, PacmanfyView;

  CompositeDisposable = require('atom').CompositeDisposable;

  PacmanfyView = require('./pacmanfy-view');

  module.exports = Pacmanfy = {
    config: {
      opacity: {
        type: 'number',
        "default": 1.0
      }
    },
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.pacmanView = new PacmanfyView();
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'pacmanfy:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      }));
    },
    deactivate: function() {
      var _ref, _ref1;
      if ((_ref = this.subscriptions) != null) {
        _ref.dispose();
      }
      this.subscriptions = null;
      if ((_ref1 = this.pacmanView) != null) {
        _ref1.dispose();
      }
      return this.pacmanView = null;
    },
    toggle: function() {
      if (this.pacmanView.disabled) {
        return this.pacmanView.enable();
      } else {
        return this.pacmanView.disable();
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGFjbWFuZnkvbGliL3BhY21hbmZ5LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwyQ0FBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQURmLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUFpQixRQUFBLEdBQ2Y7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsT0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEdBRFQ7T0FERjtLQURGO0FBQUEsSUFLQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFFUixNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFVBQUQsR0FBa0IsSUFBQSxZQUFBLENBQUEsQ0FEbEIsQ0FBQTthQUdBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DO0FBQUEsUUFBQSxpQkFBQSxFQUFtQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsTUFBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuQjtPQUFwQyxDQUFuQixFQUxRO0lBQUEsQ0FMVjtBQUFBLElBWUEsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsV0FBQTs7WUFBYyxDQUFFLE9BQWhCLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFEakIsQ0FBQTs7YUFFVyxDQUFFLE9BQWIsQ0FBQTtPQUZBO2FBR0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxLQUpKO0lBQUEsQ0FaWjtBQUFBLElBa0JBLE1BQUEsRUFBUSxTQUFBLEdBQUE7QUFDTixNQUFBLElBQUcsSUFBQyxDQUFBLFVBQVUsQ0FBQyxRQUFmO2VBQ0UsSUFBQyxDQUFBLFVBQVUsQ0FBQyxNQUFaLENBQUEsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsVUFBVSxDQUFDLE9BQVosQ0FBQSxFQUhGO09BRE07SUFBQSxDQWxCUjtHQUpGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/pacmanfy/lib/pacmanfy.coffee
