(function() {
  var BreakpointListView, BreakpointView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  BreakpointListView = require('./breakpoint-list-view');

  module.exports = BreakpointView = (function(_super) {
    __extends(BreakpointView, _super);

    function BreakpointView() {
      return BreakpointView.__super__.constructor.apply(this, arguments);
    }

    BreakpointView.content = function() {
      return BreakpointView.div(function() {
        return BreakpointView.div({
          outlet: 'breakpointListView'
        });
      });
    };

    BreakpointView.prototype.initialize = function(breakpoints) {
      this.breakpoints = breakpoints;
      return this.render();
    };

    BreakpointView.prototype.render = function() {
      return this.breakpointListView.append(new BreakpointListView(this.breakpoints));
    };

    return BreakpointView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGhwLWRlYnVnL2xpYi9icmVha3BvaW50L2JyZWFrcG9pbnQtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0NBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLE9BQVEsT0FBQSxDQUFRLHNCQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBQ0Esa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHdCQUFSLENBRHJCLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUoscUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsY0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixjQUFDLENBQUEsR0FBRCxDQUFLLFNBQUEsR0FBQTtlQUNILGNBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxVQUFBLE1BQUEsRUFBUSxvQkFBUjtTQUFMLEVBREc7TUFBQSxDQUFMLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsNkJBSUEsVUFBQSxHQUFZLFNBQUMsV0FBRCxHQUFBO0FBQ1YsTUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLFdBQWYsQ0FBQTthQUNBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFGVTtJQUFBLENBSlosQ0FBQTs7QUFBQSw2QkFRQSxNQUFBLEdBQVEsU0FBQSxHQUFBO2FBQ04sSUFBQyxDQUFBLGtCQUFrQixDQUFDLE1BQXBCLENBQStCLElBQUEsa0JBQUEsQ0FBbUIsSUFBQyxDQUFBLFdBQXBCLENBQS9CLEVBRE07SUFBQSxDQVJSLENBQUE7OzBCQUFBOztLQUYyQixLQUo3QixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/php-debug/lib/breakpoint/breakpoint-view.coffee
