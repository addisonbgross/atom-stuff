(function() {
  var CompositeDisposable, Debugger, DebuggerView, OpenDialogView, fs;

  OpenDialogView = require('./open-dialog-view');

  DebuggerView = require('./debugger-view');

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs');

  module.exports = Debugger = {
    subscriptions: null,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'debugger:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'core:close': (function(_this) {
          return function() {
            var _ref;
            if ((_ref = _this.debuggerView) != null) {
              _ref.destroy();
            }
            return _this.debuggerView = null;
          };
        })(this)
      }));
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'core:cancel': (function(_this) {
          return function() {
            var _ref;
            if ((_ref = _this.debuggerView) != null) {
              _ref.destroy();
            }
            return _this.debuggerView = null;
          };
        })(this)
      }));
    },
    deactivate: function() {
      var _ref;
      this.subscriptions.dispose();
      this.openDialogView.destroy();
      return (_ref = this.debuggerView) != null ? _ref.destroy() : void 0;
    },
    serialize: function() {},
    toggle: function() {
      if (this.debuggerView && this.debuggerView.hasParent()) {
        this.debuggerView.destroy();
        return this.debuggerView = null;
      } else {
        return this.openDialogView = new OpenDialogView((function(_this) {
          return function(target, mainBreak) {
            if (fs.existsSync(target)) {
              return _this.debuggerView = new DebuggerView(target, mainBreak);
            } else {
              return atom.confirm({
                detailedMessage: "Can't find file " + target + ".",
                buttons: {
                  Exit: function() {}
                }
              });
            }
          };
        })(this));
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1kZWJ1Z2dlci9saWIvZGVidWdnZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtEQUFBOztBQUFBLEVBQUEsY0FBQSxHQUFpQixPQUFBLENBQVEsb0JBQVIsQ0FBakIsQ0FBQTs7QUFBQSxFQUNBLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FEZixDQUFBOztBQUFBLEVBRUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUZELENBQUE7O0FBQUEsRUFHQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FITCxDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsUUFBQSxHQUNmO0FBQUEsSUFBQSxhQUFBLEVBQWUsSUFBZjtBQUFBLElBRUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBRVIsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBQWpCLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DO0FBQUEsUUFBQSxpQkFBQSxFQUFtQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsTUFBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuQjtPQUFwQyxDQUFuQixDQUhBLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DO0FBQUEsUUFBQSxZQUFBLEVBQWMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFDbkUsZ0JBQUEsSUFBQTs7a0JBQWEsQ0FBRSxPQUFmLENBQUE7YUFBQTttQkFDQSxLQUFDLENBQUEsWUFBRCxHQUFnQixLQUZtRDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWQ7T0FBcEMsQ0FBbkIsQ0FKQSxDQUFBO2FBT0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7QUFBQSxRQUFBLGFBQUEsRUFBZSxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUNwRSxnQkFBQSxJQUFBOztrQkFBYSxDQUFFLE9BQWYsQ0FBQTthQUFBO21CQUNBLEtBQUMsQ0FBQSxZQUFELEdBQWdCLEtBRm9EO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZjtPQUFwQyxDQUFuQixFQVRRO0lBQUEsQ0FGVjtBQUFBLElBZUEsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsY0FBYyxDQUFDLE9BQWhCLENBQUEsQ0FEQSxDQUFBO3NEQUVhLENBQUUsT0FBZixDQUFBLFdBSFU7SUFBQSxDQWZaO0FBQUEsSUFvQkEsU0FBQSxFQUFXLFNBQUEsR0FBQSxDQXBCWDtBQUFBLElBc0JBLE1BQUEsRUFBUSxTQUFBLEdBQUE7QUFDTixNQUFBLElBQUcsSUFBQyxDQUFBLFlBQUQsSUFBa0IsSUFBQyxDQUFBLFlBQVksQ0FBQyxTQUFkLENBQUEsQ0FBckI7QUFDRSxRQUFBLElBQUMsQ0FBQSxZQUFZLENBQUMsT0FBZCxDQUFBLENBQUEsQ0FBQTtlQUNBLElBQUMsQ0FBQSxZQUFELEdBQWdCLEtBRmxCO09BQUEsTUFBQTtlQUlFLElBQUMsQ0FBQSxjQUFELEdBQXNCLElBQUEsY0FBQSxDQUFlLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxNQUFELEVBQVMsU0FBVCxHQUFBO0FBQ25DLFlBQUEsSUFBRyxFQUFFLENBQUMsVUFBSCxDQUFjLE1BQWQsQ0FBSDtxQkFDRSxLQUFDLENBQUEsWUFBRCxHQUFvQixJQUFBLFlBQUEsQ0FBYSxNQUFiLEVBQXFCLFNBQXJCLEVBRHRCO2FBQUEsTUFBQTtxQkFHRSxJQUFJLENBQUMsT0FBTCxDQUNFO0FBQUEsZ0JBQUEsZUFBQSxFQUFrQixrQkFBQSxHQUFrQixNQUFsQixHQUF5QixHQUEzQztBQUFBLGdCQUNBLE9BQUEsRUFDRTtBQUFBLGtCQUFBLElBQUEsRUFBTSxTQUFBLEdBQUEsQ0FBTjtpQkFGRjtlQURGLEVBSEY7YUFEbUM7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFmLEVBSnhCO09BRE07SUFBQSxDQXRCUjtHQU5GLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/atom-debugger/lib/debugger.coffee
