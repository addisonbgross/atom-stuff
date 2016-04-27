(function() {
  var $, BreakpointItemView, BreakpointListView, View, helpers, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  BreakpointItemView = require('./breakpoint-item-view');

  helpers = require('../helpers');

  module.exports = BreakpointListView = (function(_super) {
    __extends(BreakpointListView, _super);

    function BreakpointListView() {
      return BreakpointListView.__super__.constructor.apply(this, arguments);
    }

    BreakpointListView.content = function() {
      return BreakpointListView.ul({
        "class": "breakpoint-list-view"
      }, function() {
        return BreakpointListView.div({
          outlet: "breakpointItemList"
        });
      });
    };

    BreakpointListView.prototype.initialize = function(breakpoints) {
      this.breakpointItemList.on('mousedown', 'li', (function(_this) {
        return function(e) {
          _this.selectBreakPoint($(e.target).closest('li'));
          e.preventDefault();
          return false;
        };
      })(this));
      this.breakpointItemList.on('mouseup', 'li', (function(_this) {
        return function(e) {
          e.preventDefault();
          return false;
        };
      })(this));
      this.breakpoints = breakpoints;
      return this.render();
    };

    BreakpointListView.prototype.render = function() {
      var breakpoint, _i, _len, _ref1, _results;
      _ref1 = this.breakpoints;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        breakpoint = _ref1[_i];
        _results.push(this.breakpointItemList.append(new BreakpointItemView(breakpoint)));
      }
      return _results;
    };

    BreakpointListView.prototype.selectBreakPoint = function(view) {
      var filepath;
      if (!view.length) {
        return;
      }
      filepath = view.find('.breakpoint-path').data('path');
      filepath = helpers.remotePathToLocal(filepath);
      return atom.workspace.open(filepath, {
        searchAllPanes: true,
        activatePane: true
      }).then((function(_this) {
        return function(editor) {
          var line, range;
          line = view.find('.breakpoint-line').data('line');
          range = [[line - 1, 0], [line - 1, 0]];
          editor.scrollToBufferPosition([line - 1, 0]);
          return editor.setCursorScreenPosition([line - 1, 0]);
        };
      })(this));
    };

    return BreakpointListView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGhwLWRlYnVnL2xpYi9icmVha3BvaW50L2JyZWFrcG9pbnQtbGlzdC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4REFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBWSxPQUFBLENBQVEsc0JBQVIsQ0FBWixFQUFDLFNBQUEsQ0FBRCxFQUFJLFlBQUEsSUFBSixDQUFBOztBQUFBLEVBQ0Esa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHdCQUFSLENBRHJCLENBQUE7O0FBQUEsRUFFQSxPQUFBLEdBQWlCLE9BQUEsQ0FBUSxZQUFSLENBRmpCLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUoseUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsa0JBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ04sa0JBQUMsQ0FBQSxFQUFELENBQUk7QUFBQSxRQUFBLE9BQUEsRUFBTyxzQkFBUDtPQUFKLEVBQW1DLFNBQUEsR0FBQTtlQUNqQyxrQkFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFVBQUEsTUFBQSxFQUFRLG9CQUFSO1NBQUwsRUFEaUM7TUFBQSxDQUFuQyxFQURNO0lBQUEsQ0FBVixDQUFBOztBQUFBLGlDQUlBLFVBQUEsR0FBWSxTQUFDLFdBQUQsR0FBQTtBQUNWLE1BQUEsSUFBQyxDQUFBLGtCQUFrQixDQUFDLEVBQXBCLENBQXVCLFdBQXZCLEVBQW9DLElBQXBDLEVBQTBDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLENBQUQsR0FBQTtBQUN4QyxVQUFBLEtBQUMsQ0FBQSxnQkFBRCxDQUFrQixDQUFBLENBQUUsQ0FBQyxDQUFDLE1BQUosQ0FBVyxDQUFDLE9BQVosQ0FBb0IsSUFBcEIsQ0FBbEIsQ0FBQSxDQUFBO0FBQUEsVUFDQSxDQUFDLENBQUMsY0FBRixDQUFBLENBREEsQ0FBQTtpQkFFQSxNQUh3QztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFDLENBQUEsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLGtCQUFrQixDQUFDLEVBQXBCLENBQXVCLFNBQXZCLEVBQWtDLElBQWxDLEVBQXdDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLENBQUQsR0FBQTtBQUN0QyxVQUFBLENBQUMsQ0FBQyxjQUFGLENBQUEsQ0FBQSxDQUFBO2lCQUNBLE1BRnNDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEMsQ0FMQSxDQUFBO0FBQUEsTUFTQSxJQUFDLENBQUEsV0FBRCxHQUFlLFdBVGYsQ0FBQTthQVVBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFYVTtJQUFBLENBSlosQ0FBQTs7QUFBQSxpQ0FpQkEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLFVBQUEscUNBQUE7QUFBQTtBQUFBO1dBQUEsNENBQUE7K0JBQUE7QUFDRSxzQkFBQSxJQUFDLENBQUEsa0JBQWtCLENBQUMsTUFBcEIsQ0FBK0IsSUFBQSxrQkFBQSxDQUFtQixVQUFuQixDQUEvQixFQUFBLENBREY7QUFBQTtzQkFETTtJQUFBLENBakJSLENBQUE7O0FBQUEsaUNBcUJBLGdCQUFBLEdBQWtCLFNBQUMsSUFBRCxHQUFBO0FBQ2hCLFVBQUEsUUFBQTtBQUFBLE1BQUEsSUFBQSxDQUFBLElBQWtCLENBQUMsTUFBbkI7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsUUFBQSxHQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsa0JBQVYsQ0FBNkIsQ0FBQyxJQUE5QixDQUFtQyxNQUFuQyxDQURYLENBQUE7QUFBQSxNQUdBLFFBQUEsR0FBVyxPQUFPLENBQUMsaUJBQVIsQ0FBMEIsUUFBMUIsQ0FIWCxDQUFBO2FBS0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFFBQXBCLEVBQTZCO0FBQUEsUUFBQyxjQUFBLEVBQWdCLElBQWpCO0FBQUEsUUFBdUIsWUFBQSxFQUFhLElBQXBDO09BQTdCLENBQXVFLENBQUMsSUFBeEUsQ0FBNkUsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO0FBQzNFLGNBQUEsV0FBQTtBQUFBLFVBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxJQUFMLENBQVUsa0JBQVYsQ0FBNkIsQ0FBQyxJQUE5QixDQUFtQyxNQUFuQyxDQUFQLENBQUE7QUFBQSxVQUNBLEtBQUEsR0FBUSxDQUFDLENBQUMsSUFBQSxHQUFLLENBQU4sRUFBUyxDQUFULENBQUQsRUFBYyxDQUFDLElBQUEsR0FBSyxDQUFOLEVBQVMsQ0FBVCxDQUFkLENBRFIsQ0FBQTtBQUFBLFVBRUEsTUFBTSxDQUFDLHNCQUFQLENBQThCLENBQUMsSUFBQSxHQUFLLENBQU4sRUFBUSxDQUFSLENBQTlCLENBRkEsQ0FBQTtpQkFHQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxJQUFBLEdBQUssQ0FBTixFQUFRLENBQVIsQ0FBL0IsRUFKMkU7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE3RSxFQU5nQjtJQUFBLENBckJsQixDQUFBOzs4QkFBQTs7S0FGK0IsS0FMakMsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/php-debug/lib/breakpoint/breakpoint-list-view.coffee
