(function() {
  var DebugContext, helpers;

  helpers = require('../helpers.coffee');

  module.exports = DebugContext = (function() {
    function DebugContext() {
      this.scopeList = {};
      this.watchpointList = [];
      this.stackFrameList = [];
    }

    DebugContext.prototype.addScope = function(scopeId, name) {
      return this.scopeList[scopeId] = {
        name: name,
        scopeId: scopeId,
        context: {}
      };
    };

    DebugContext.prototype.setScopeContext = function(scopeId, context) {
      return this.scopeList[scopeId].context = context;
    };

    DebugContext.prototype.addWatchpoint = function(watchpoint) {
      var index;
      index = helpers.getInsertIndex(this.watchpointList, watchpoint);
      return this.watchpointList.push(watchpoint);
    };

    DebugContext.prototype.clearWatchpoints = function() {
      return this.watchpointList = [];
    };

    DebugContext.prototype.getWatchpoints = function() {
      return this.watchpointList;
    };

    DebugContext.prototype.setStack = function(stack) {
      return this.stackFrameList = stack;
    };

    DebugContext.prototype.getStack = function() {
      return this.stackFrameList;
    };

    DebugContext.prototype.clear = function() {
      return this.scopeList = {};
    };

    DebugContext.prototype.getScopes = function() {
      return this.scopeList;
    };

    return DebugContext;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGhwLWRlYnVnL2xpYi9tb2RlbHMvZGVidWctY29udGV4dC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscUJBQUE7O0FBQUEsRUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLG1CQUFSLENBQVYsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBRU07QUFFUyxJQUFBLHNCQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxTQUFELEdBQWEsRUFBYixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsY0FBRCxHQUFrQixFQURsQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsY0FBRCxHQUFrQixFQUZsQixDQURXO0lBQUEsQ0FBYjs7QUFBQSwyQkFLQSxRQUFBLEdBQVUsU0FBQyxPQUFELEVBQVUsSUFBVixHQUFBO2FBQ1IsSUFBQyxDQUFBLFNBQVUsQ0FBQSxPQUFBLENBQVgsR0FBc0I7QUFBQSxRQUFFLElBQUEsRUFBTSxJQUFSO0FBQUEsUUFBYyxPQUFBLEVBQVMsT0FBdkI7QUFBQSxRQUFnQyxPQUFBLEVBQVMsRUFBekM7UUFEZDtJQUFBLENBTFYsQ0FBQTs7QUFBQSwyQkFRQSxlQUFBLEdBQWlCLFNBQUMsT0FBRCxFQUFVLE9BQVYsR0FBQTthQUNmLElBQUMsQ0FBQSxTQUFVLENBQUEsT0FBQSxDQUFRLENBQUMsT0FBcEIsR0FBOEIsUUFEZjtJQUFBLENBUmpCLENBQUE7O0FBQUEsMkJBV0EsYUFBQSxHQUFlLFNBQUMsVUFBRCxHQUFBO0FBQ2IsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsT0FBTyxDQUFDLGNBQVIsQ0FBdUIsSUFBQyxDQUFBLGNBQXhCLEVBQXdDLFVBQXhDLENBQVIsQ0FBQTthQUNBLElBQUMsQ0FBQSxjQUFjLENBQUMsSUFBaEIsQ0FBcUIsVUFBckIsRUFGYTtJQUFBLENBWGYsQ0FBQTs7QUFBQSwyQkFlQSxnQkFBQSxHQUFrQixTQUFBLEdBQUE7YUFDaEIsSUFBQyxDQUFBLGNBQUQsR0FBa0IsR0FERjtJQUFBLENBZmxCLENBQUE7O0FBQUEsMkJBa0JBLGNBQUEsR0FBZ0IsU0FBQSxHQUFBO0FBQ2QsYUFBTyxJQUFDLENBQUEsY0FBUixDQURjO0lBQUEsQ0FsQmhCLENBQUE7O0FBQUEsMkJBcUJBLFFBQUEsR0FBVSxTQUFDLEtBQUQsR0FBQTthQUNSLElBQUMsQ0FBQSxjQUFELEdBQWtCLE1BRFY7SUFBQSxDQXJCVixDQUFBOztBQUFBLDJCQXdCQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsYUFBTyxJQUFDLENBQUEsY0FBUixDQURRO0lBQUEsQ0F4QlYsQ0FBQTs7QUFBQSwyQkEyQkEsS0FBQSxHQUFPLFNBQUEsR0FBQTthQUNMLElBQUMsQ0FBQSxTQUFELEdBQWEsR0FEUjtJQUFBLENBM0JQLENBQUE7O0FBQUEsMkJBOEJBLFNBQUEsR0FBVyxTQUFBLEdBQUE7QUFDVCxhQUFPLElBQUMsQ0FBQSxTQUFSLENBRFM7SUFBQSxDQTlCWCxDQUFBOzt3QkFBQTs7TUFORixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/php-debug/lib/models/debug-context.coffee
