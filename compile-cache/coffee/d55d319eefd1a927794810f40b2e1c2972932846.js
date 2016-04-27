(function() {
  var $$, SelectListView, SelectionView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  module.exports = SelectionView = (function(_super) {
    __extends(SelectionView, _super);

    function SelectionView() {
      return SelectionView.__super__.constructor.apply(this, arguments);
    }

    SelectionView.prototype.initialize = function() {
      SelectionView.__super__.initialize.apply(this, arguments);
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.focusFilterEditor();
    };

    SelectionView.prototype.viewForItem = function(item) {
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'command-name'
            }, item.name);
            return _this.div({
              "class": 'text-subtle'
            }, "" + item.singular + " (" + item.origin + ")");
          };
        })(this));
      });
    };

    SelectionView.prototype.confirmed = function(item) {
      this.cancel();
      return this.callback(item);
    };

    SelectionView.prototype.cancel = function() {
      var _ref1;
      SelectionView.__super__.cancel.apply(this, arguments);
      return (_ref1 = this.panel) != null ? _ref1.hide() : void 0;
    };

    SelectionView.prototype.getFilterKey = function() {
      return 'name';
    };

    return SelectionView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3ZpZXcvc2VsZWN0aW9uLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUF1QixPQUFBLENBQVEsc0JBQVIsQ0FBdkIsRUFBQyxVQUFBLEVBQUQsRUFBSyxzQkFBQSxjQUFMLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBQ0osb0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLDRCQUFBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixNQUFBLCtDQUFBLFNBQUEsQ0FBQSxDQUFBOztRQUNBLElBQUMsQ0FBQSxRQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtBQUFBLFVBQUEsSUFBQSxFQUFNLElBQU47U0FBN0I7T0FEVjtBQUFBLE1BRUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUEsQ0FGQSxDQUFBO2FBR0EsSUFBQyxDQUFBLGlCQUFELENBQUEsRUFKVTtJQUFBLENBQVosQ0FBQTs7QUFBQSw0QkFNQSxXQUFBLEdBQWEsU0FBQyxJQUFELEdBQUE7YUFDWCxFQUFBLENBQUcsU0FBQSxHQUFBO2VBQ0QsSUFBQyxDQUFBLEVBQUQsQ0FBSSxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUNGLFlBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLGNBQVA7YUFBTCxFQUE0QixJQUFJLENBQUMsSUFBakMsQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxhQUFQO2FBQUwsRUFBMkIsRUFBQSxHQUFHLElBQUksQ0FBQyxRQUFSLEdBQWlCLElBQWpCLEdBQXFCLElBQUksQ0FBQyxNQUExQixHQUFpQyxHQUE1RCxFQUZFO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBSixFQURDO01BQUEsQ0FBSCxFQURXO0lBQUEsQ0FOYixDQUFBOztBQUFBLDRCQVlBLFNBQUEsR0FBVyxTQUFDLElBQUQsR0FBQTtBQUNULE1BQUEsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLElBQVYsRUFGUztJQUFBLENBWlgsQ0FBQTs7QUFBQSw0QkFnQkEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLFVBQUEsS0FBQTtBQUFBLE1BQUEsMkNBQUEsU0FBQSxDQUFBLENBQUE7aURBQ00sQ0FBRSxJQUFSLENBQUEsV0FGTTtJQUFBLENBaEJSLENBQUE7O0FBQUEsNEJBb0JBLFlBQUEsR0FBYyxTQUFBLEdBQUE7YUFDWixPQURZO0lBQUEsQ0FwQmQsQ0FBQTs7eUJBQUE7O0tBRDBCLGVBSDlCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/view/selection-view.coffee
