(function() {
  var Disposable, Emitter, GlobalContext, helpers, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  helpers = require('../helpers.coffee');

  _ref = require('event-kit'), Emitter = _ref.Emitter, Disposable = _ref.Disposable;

  module.exports = GlobalContext = (function() {
    atom.deserializers.add(GlobalContext);

    function GlobalContext() {
      this.getCurrentDebugContext = __bind(this.getCurrentDebugContext, this);
      this.emitter = new Emitter;
      this.breakpoints = [];
      this.watchpoints = [];
      this.debugContexts = [];
      this.onSessionEnd((function(_this) {
        return function() {
          delete _this.debugContexts[0];
          return _this.debugContexts = [];
        };
      })(this));
    }

    GlobalContext.prototype.serialize = function() {
      return {
        deserializer: 'GlobalContext',
        data: {
          version: this.constructor.version,
          breakpoints: helpers.serializeArray(this.getBreakpoints()),
          watchpoints: helpers.serializeArray(this.getWatchpoints())
        }
      };
    };

    GlobalContext.deserialize = function(_arg) {
      var breakpoints, context, data, watchpoints;
      data = _arg.data;
      context = new GlobalContext();
      breakpoints = helpers.deserializeArray(data.breakpoints);
      context.setBreakpoints(breakpoints);
      watchpoints = helpers.deserializeArray(data.watchpoints);
      context.setWatchpoints(watchpoints);
      return context;
    };

    GlobalContext.prototype.addBreakpoint = function(breakpoint) {
      var data;
      helpers.insertOrdered(this.breakpoints, breakpoint);
      data = {
        added: [breakpoint]
      };
      return this.notifyBreakpointsChange(data);
    };

    GlobalContext.prototype.removeBreakpoint = function(breakpoint) {
      var data, removed;
      removed = helpers.arrayRemove(this.breakpoints, breakpoint);
      if (removed) {
        data = {
          removed: [removed]
        };
        this.notifyBreakpointsChange(data);
        return removed;
      }
    };

    GlobalContext.prototype.setBreakpoints = function(breakpoints) {
      var data, removed;
      removed = this.breakpoints;
      this.breakpoints = breakpoints;
      data = {
        added: breakpoints,
        removed: removed
      };
      return this.notifyBreakpointsChange(data);
    };

    GlobalContext.prototype.setWatchpoints = function(watchpoints) {
      var data;
      this.watchpoints = watchpoints;
      data = {
        added: watchpoints
      };
      return this.notifyWatchpointsChange();
    };

    GlobalContext.prototype.removeWatchpoint = function(watchpoint) {
      var data, removed;
      removed = helpers.arrayRemove(this.watchpoints, watchpoint);
      if (removed) {
        data = {
          removed: [removed]
        };
        this.notifyWatchpointsChange();
        return removed;
      }
    };

    GlobalContext.prototype.getBreakpoints = function() {
      return this.breakpoints;
    };

    GlobalContext.prototype.addDebugContext = function(debugContext) {
      return this.debugContexts.push(debugContext);
    };

    GlobalContext.prototype.getCurrentDebugContext = function() {
      return this.debugContexts[0];
    };

    GlobalContext.prototype.addWatchpoint = function(watchpoint) {
      helpers.insertOrdered(this.watchpoints, watchpoint);
      return this.notifyWatchpointsChange();
    };

    GlobalContext.prototype.getWatchpoints = function() {
      return this.watchpoints;
    };

    GlobalContext.prototype.setContext = function(context) {
      return this.context = context;
    };

    GlobalContext.prototype.getContext = function() {
      return this.context;
    };

    GlobalContext.prototype.clearContext = function() {};

    GlobalContext.prototype.onBreakpointsChange = function(callback) {
      return this.emitter.on('php-debug.breakpointsChange', callback);
    };

    GlobalContext.prototype.notifyBreakpointsChange = function(data) {
      return this.emitter.emit('php-debug.breakpointsChange', data);
    };

    GlobalContext.prototype.onWatchpointsChange = function(callback) {
      return this.emitter.on('php-debug.watchpointsChange', callback);
    };

    GlobalContext.prototype.notifyWatchpointsChange = function(data) {
      return this.emitter.emit('php-debug.watchpointsChange', data);
    };

    GlobalContext.prototype.onBreak = function(callback) {
      return this.emitter.on('php-debug.break', callback);
    };

    GlobalContext.prototype.notifyBreak = function(data) {
      return this.emitter.emit('php-debug.break', data);
    };

    GlobalContext.prototype.onContextUpdate = function(callback) {
      return this.emitter.on('php-debug.contextUpdate', callback);
    };

    GlobalContext.prototype.notifyContextUpdate = function(data) {
      return this.emitter.emit('php-debug.contextUpdate', data);
    };

    GlobalContext.prototype.onStackChange = function(callback) {
      return this.emitter.on('php-debug.stackChange', callback);
    };

    GlobalContext.prototype.notifyStackChange = function(data) {
      return this.emitter.emit('php-debug.stackChange', data);
    };

    GlobalContext.prototype.onSessionEnd = function(callback) {
      return this.emitter.on('php-debug.sessionEnd', callback);
    };

    GlobalContext.prototype.notifySessionEnd = function(data) {
      return this.emitter.emit('php-debug.sessionEnd', data);
    };

    GlobalContext.prototype.onSocketError = function(callback) {
      return this.emitter.on('php-debug.socketError', callback);
    };

    GlobalContext.prototype.notifySocketError = function(data) {
      return this.emitter.emit('php-debug.socketError', data);
    };

    GlobalContext.prototype.onSessionStart = function(callback) {
      return this.emitter.on('php-debug.sessionStart', callback);
    };

    GlobalContext.prototype.notifySessionStart = function(data) {
      return this.emitter.emit('php-debug.sessionStart', data);
    };

    GlobalContext.prototype.onRunning = function(callback) {
      return this.emitter.on('php-debug.running', callback);
    };

    GlobalContext.prototype.notifyRunning = function(data) {
      return this.emitter.emit('php-debug.running', data);
    };

    return GlobalContext;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGhwLWRlYnVnL2xpYi9tb2RlbHMvZ2xvYmFsLWNvbnRleHQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlEQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLG1CQUFSLENBQVYsQ0FBQTs7QUFBQSxFQUNBLE9BQXdCLE9BQUEsQ0FBUSxXQUFSLENBQXhCLEVBQUMsZUFBQSxPQUFELEVBQVUsa0JBQUEsVUFEVixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFuQixDQUF1QixhQUF2QixDQUFBLENBQUE7O0FBRWEsSUFBQSx1QkFBQSxHQUFBO0FBQ1gsNkVBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsV0FBRCxHQUFlLEVBRGYsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxFQUZmLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEVBSGpCLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxZQUFELENBQWMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNaLFVBQUEsTUFBQSxDQUFBLEtBQVEsQ0FBQSxhQUFjLENBQUEsQ0FBQSxDQUF0QixDQUFBO2lCQUNBLEtBQUMsQ0FBQSxhQUFELEdBQWlCLEdBRkw7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFkLENBTEEsQ0FEVztJQUFBLENBRmI7O0FBQUEsNEJBWUEsU0FBQSxHQUFXLFNBQUEsR0FBQTthQUFHO0FBQUEsUUFDWixZQUFBLEVBQWMsZUFERjtBQUFBLFFBRVosSUFBQSxFQUFNO0FBQUEsVUFDSixPQUFBLEVBQVMsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQURsQjtBQUFBLFVBRUosV0FBQSxFQUFhLE9BQU8sQ0FBQyxjQUFSLENBQXVCLElBQUMsQ0FBQSxjQUFELENBQUEsQ0FBdkIsQ0FGVDtBQUFBLFVBR0osV0FBQSxFQUFhLE9BQU8sQ0FBQyxjQUFSLENBQXVCLElBQUMsQ0FBQSxjQUFELENBQUEsQ0FBdkIsQ0FIVDtTQUZNO1FBQUg7SUFBQSxDQVpYLENBQUE7O0FBQUEsSUFxQkEsYUFBQyxDQUFBLFdBQUQsR0FBYyxTQUFDLElBQUQsR0FBQTtBQUNaLFVBQUEsdUNBQUE7QUFBQSxNQURjLE9BQUQsS0FBQyxJQUNkLENBQUE7QUFBQSxNQUFBLE9BQUEsR0FBYyxJQUFBLGFBQUEsQ0FBQSxDQUFkLENBQUE7QUFBQSxNQUNBLFdBQUEsR0FBYyxPQUFPLENBQUMsZ0JBQVIsQ0FBeUIsSUFBSSxDQUFDLFdBQTlCLENBRGQsQ0FBQTtBQUFBLE1BRUEsT0FBTyxDQUFDLGNBQVIsQ0FBdUIsV0FBdkIsQ0FGQSxDQUFBO0FBQUEsTUFHQSxXQUFBLEdBQWMsT0FBTyxDQUFDLGdCQUFSLENBQXlCLElBQUksQ0FBQyxXQUE5QixDQUhkLENBQUE7QUFBQSxNQUlBLE9BQU8sQ0FBQyxjQUFSLENBQXVCLFdBQXZCLENBSkEsQ0FBQTtBQUtBLGFBQU8sT0FBUCxDQU5ZO0lBQUEsQ0FyQmQsQ0FBQTs7QUFBQSw0QkE2QkEsYUFBQSxHQUFlLFNBQUMsVUFBRCxHQUFBO0FBQ2IsVUFBQSxJQUFBO0FBQUEsTUFBQSxPQUFPLENBQUMsYUFBUixDQUF1QixJQUFDLENBQUEsV0FBeEIsRUFBcUMsVUFBckMsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFBLEdBQU87QUFBQSxRQUNMLEtBQUEsRUFBTyxDQUFDLFVBQUQsQ0FERjtPQURQLENBQUE7YUFJQSxJQUFDLENBQUEsdUJBQUQsQ0FBeUIsSUFBekIsRUFMYTtJQUFBLENBN0JmLENBQUE7O0FBQUEsNEJBb0NBLGdCQUFBLEdBQWtCLFNBQUMsVUFBRCxHQUFBO0FBQ2hCLFVBQUEsYUFBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLE9BQU8sQ0FBQyxXQUFSLENBQW9CLElBQUMsQ0FBQSxXQUFyQixFQUFrQyxVQUFsQyxDQUFWLENBQUE7QUFDQSxNQUFBLElBQUcsT0FBSDtBQUNFLFFBQUEsSUFBQSxHQUFPO0FBQUEsVUFDTCxPQUFBLEVBQVMsQ0FBQyxPQUFELENBREo7U0FBUCxDQUFBO0FBQUEsUUFHQSxJQUFDLENBQUEsdUJBQUQsQ0FBeUIsSUFBekIsQ0FIQSxDQUFBO0FBSUEsZUFBTyxPQUFQLENBTEY7T0FGZ0I7SUFBQSxDQXBDbEIsQ0FBQTs7QUFBQSw0QkE2Q0EsY0FBQSxHQUFnQixTQUFDLFdBQUQsR0FBQTtBQUNkLFVBQUEsYUFBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLElBQUMsQ0FBQSxXQUFYLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxXQUFELEdBQWUsV0FEZixDQUFBO0FBQUEsTUFFQSxJQUFBLEdBQU87QUFBQSxRQUNMLEtBQUEsRUFBTyxXQURGO0FBQUEsUUFFTCxPQUFBLEVBQVMsT0FGSjtPQUZQLENBQUE7YUFNQSxJQUFDLENBQUEsdUJBQUQsQ0FBeUIsSUFBekIsRUFQYztJQUFBLENBN0NoQixDQUFBOztBQUFBLDRCQXNEQSxjQUFBLEdBQWdCLFNBQUMsV0FBRCxHQUFBO0FBQ2QsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLFdBQWYsQ0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUFPO0FBQUEsUUFDTCxLQUFBLEVBQU8sV0FERjtPQURQLENBQUE7YUFJQSxJQUFDLENBQUEsdUJBQUQsQ0FBQSxFQUxjO0lBQUEsQ0F0RGhCLENBQUE7O0FBQUEsNEJBNkRBLGdCQUFBLEdBQWtCLFNBQUMsVUFBRCxHQUFBO0FBQ2hCLFVBQUEsYUFBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLE9BQU8sQ0FBQyxXQUFSLENBQW9CLElBQUMsQ0FBQSxXQUFyQixFQUFrQyxVQUFsQyxDQUFWLENBQUE7QUFDQSxNQUFBLElBQUcsT0FBSDtBQUNFLFFBQUEsSUFBQSxHQUFPO0FBQUEsVUFDTCxPQUFBLEVBQVMsQ0FBQyxPQUFELENBREo7U0FBUCxDQUFBO0FBQUEsUUFHQSxJQUFDLENBQUEsdUJBQUQsQ0FBQSxDQUhBLENBQUE7QUFJQSxlQUFPLE9BQVAsQ0FMRjtPQUZnQjtJQUFBLENBN0RsQixDQUFBOztBQUFBLDRCQXNFQSxjQUFBLEdBQWdCLFNBQUEsR0FBQTtBQUNkLGFBQU8sSUFBQyxDQUFBLFdBQVIsQ0FEYztJQUFBLENBdEVoQixDQUFBOztBQUFBLDRCQXlFQSxlQUFBLEdBQWlCLFNBQUMsWUFBRCxHQUFBO2FBQ2YsSUFBQyxDQUFBLGFBQWEsQ0FBQyxJQUFmLENBQW9CLFlBQXBCLEVBRGU7SUFBQSxDQXpFakIsQ0FBQTs7QUFBQSw0QkE0RUEsc0JBQUEsR0FBd0IsU0FBQSxHQUFBO0FBQ3RCLGFBQU8sSUFBQyxDQUFBLGFBQWMsQ0FBQSxDQUFBLENBQXRCLENBRHNCO0lBQUEsQ0E1RXhCLENBQUE7O0FBQUEsNEJBK0VBLGFBQUEsR0FBZSxTQUFDLFVBQUQsR0FBQTtBQUNiLE1BQUEsT0FBTyxDQUFDLGFBQVIsQ0FBdUIsSUFBQyxDQUFBLFdBQXhCLEVBQXFDLFVBQXJDLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSx1QkFBRCxDQUFBLEVBRmE7SUFBQSxDQS9FZixDQUFBOztBQUFBLDRCQW1GQSxjQUFBLEdBQWdCLFNBQUEsR0FBQTtBQUNkLGFBQU8sSUFBQyxDQUFBLFdBQVIsQ0FEYztJQUFBLENBbkZoQixDQUFBOztBQUFBLDRCQXNGQSxVQUFBLEdBQVksU0FBQyxPQUFELEdBQUE7YUFDVixJQUFDLENBQUEsT0FBRCxHQUFXLFFBREQ7SUFBQSxDQXRGWixDQUFBOztBQUFBLDRCQXlGQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsYUFBTyxJQUFDLENBQUEsT0FBUixDQURVO0lBQUEsQ0F6RlosQ0FBQTs7QUFBQSw0QkE0RkEsWUFBQSxHQUFjLFNBQUEsR0FBQSxDQTVGZCxDQUFBOztBQUFBLDRCQStGQSxtQkFBQSxHQUFxQixTQUFDLFFBQUQsR0FBQTthQUNuQixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSw2QkFBWixFQUEyQyxRQUEzQyxFQURtQjtJQUFBLENBL0ZyQixDQUFBOztBQUFBLDRCQWtHQSx1QkFBQSxHQUF5QixTQUFDLElBQUQsR0FBQTthQUN2QixJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyw2QkFBZCxFQUE2QyxJQUE3QyxFQUR1QjtJQUFBLENBbEd6QixDQUFBOztBQUFBLDRCQXFHQSxtQkFBQSxHQUFxQixTQUFDLFFBQUQsR0FBQTthQUNuQixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSw2QkFBWixFQUEyQyxRQUEzQyxFQURtQjtJQUFBLENBckdyQixDQUFBOztBQUFBLDRCQXdHQSx1QkFBQSxHQUF5QixTQUFDLElBQUQsR0FBQTthQUN2QixJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyw2QkFBZCxFQUE2QyxJQUE3QyxFQUR1QjtJQUFBLENBeEd6QixDQUFBOztBQUFBLDRCQTJHQSxPQUFBLEdBQVMsU0FBQyxRQUFELEdBQUE7YUFDUCxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxpQkFBWixFQUErQixRQUEvQixFQURPO0lBQUEsQ0EzR1QsQ0FBQTs7QUFBQSw0QkE4R0EsV0FBQSxHQUFhLFNBQUMsSUFBRCxHQUFBO2FBQ1gsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsaUJBQWQsRUFBaUMsSUFBakMsRUFEVztJQUFBLENBOUdiLENBQUE7O0FBQUEsNEJBaUhBLGVBQUEsR0FBaUIsU0FBQyxRQUFELEdBQUE7YUFDZixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSx5QkFBWixFQUF1QyxRQUF2QyxFQURlO0lBQUEsQ0FqSGpCLENBQUE7O0FBQUEsNEJBb0hBLG1CQUFBLEdBQXFCLFNBQUMsSUFBRCxHQUFBO2FBQ25CLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLHlCQUFkLEVBQXlDLElBQXpDLEVBRG1CO0lBQUEsQ0FwSHJCLENBQUE7O0FBQUEsNEJBdUhBLGFBQUEsR0FBZSxTQUFDLFFBQUQsR0FBQTthQUNiLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLHVCQUFaLEVBQXFDLFFBQXJDLEVBRGE7SUFBQSxDQXZIZixDQUFBOztBQUFBLDRCQTBIQSxpQkFBQSxHQUFtQixTQUFDLElBQUQsR0FBQTthQUNqQixJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyx1QkFBZCxFQUF1QyxJQUF2QyxFQURpQjtJQUFBLENBMUhuQixDQUFBOztBQUFBLDRCQTZIQSxZQUFBLEdBQWMsU0FBQyxRQUFELEdBQUE7YUFDWixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxzQkFBWixFQUFvQyxRQUFwQyxFQURZO0lBQUEsQ0E3SGQsQ0FBQTs7QUFBQSw0QkFnSUEsZ0JBQUEsR0FBa0IsU0FBQyxJQUFELEdBQUE7YUFDaEIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsc0JBQWQsRUFBc0MsSUFBdEMsRUFEZ0I7SUFBQSxDQWhJbEIsQ0FBQTs7QUFBQSw0QkFtSUEsYUFBQSxHQUFlLFNBQUMsUUFBRCxHQUFBO2FBQ2IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksdUJBQVosRUFBcUMsUUFBckMsRUFEYTtJQUFBLENBbklmLENBQUE7O0FBQUEsNEJBc0lBLGlCQUFBLEdBQW1CLFNBQUMsSUFBRCxHQUFBO2FBQ2pCLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLHVCQUFkLEVBQXVDLElBQXZDLEVBRGlCO0lBQUEsQ0F0SW5CLENBQUE7O0FBQUEsNEJBeUlBLGNBQUEsR0FBZ0IsU0FBQyxRQUFELEdBQUE7YUFDZCxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSx3QkFBWixFQUFzQyxRQUF0QyxFQURjO0lBQUEsQ0F6SWhCLENBQUE7O0FBQUEsNEJBNElBLGtCQUFBLEdBQW9CLFNBQUMsSUFBRCxHQUFBO2FBQ2xCLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLHdCQUFkLEVBQXdDLElBQXhDLEVBRGtCO0lBQUEsQ0E1SXBCLENBQUE7O0FBQUEsNEJBK0lBLFNBQUEsR0FBVyxTQUFDLFFBQUQsR0FBQTthQUNULElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLG1CQUFaLEVBQWlDLFFBQWpDLEVBRFM7SUFBQSxDQS9JWCxDQUFBOztBQUFBLDRCQWtKQSxhQUFBLEdBQWUsU0FBQyxJQUFELEdBQUE7YUFDYixJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxtQkFBZCxFQUFtQyxJQUFuQyxFQURhO0lBQUEsQ0FsSmYsQ0FBQTs7eUJBQUE7O01BTEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/php-debug/lib/models/global-context.coffee
