(function() {
  var Command, Disposable, Input, Project;

  Disposable = require('atom').Disposable;

  Command = null;

  Project = null;

  Input = null;

  module.exports = {
    modules: {
      console: require('./console'),
      linter: require('./linter'),
      buffer: require('./buffer'),
      file: require('./file')
    },
    addModule: function(key, mod) {
      if ((this.modules[key] != null) && !this.isCoreName(key)) {
        return;
      }
      this.modules[key] = mod;
      return new Disposable((function(_this) {
        return function() {
          _this.deactivate(key);
          return _this.removeModule(key);
        };
      })(this));
    },
    removeModule: function(key) {
      return delete this.modules[key];
    },
    reset: function() {
      var k, _i, _len, _ref;
      _ref = Object.keys(this.modules);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        k = _ref[_i];
        this.deactivate(k);
        this.removeModule(k);
      }
      this.modules.console = require('./console');
      this.modules.linter = require('./linter');
      this.modules.buffer = require('./buffer');
      this.modules.file = require('./file');
      Command = null;
      Project = null;
      return Input = null;
    },
    activate: function(key) {
      var mod;
      mod = this.modules[key];
      if (mod == null) {
        return;
      }
      if (mod.active != null) {
        return true;
      }
      if (mod.activate == null) {
        return true;
      }
      if (Command == null) {
        Command = require('../provider/command');
      }
      if (Project == null) {
        Project = require('../provider/project');
      }
      if (Input == null) {
        Input = require('../provider/input');
      }
      mod.activate(Command, Project, Input);
      return mod.active = true;
    },
    deactivate: function(key) {
      var mod;
      mod = this.modules[key];
      if (mod == null) {
        return;
      }
      if (mod.active == null) {
        return true;
      }
      if (mod.deactivate == null) {
        return true;
      }
      mod.deactivate();
      mod.active = null;
      return true;
    },
    isCoreName: function(key) {
      return key === 'console' || key === 'linter' || key === 'buffer' || key === 'file';
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL291dHB1dC9vdXRwdXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1DQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBVSxJQUZWLENBQUE7O0FBQUEsRUFHQSxPQUFBLEdBQVUsSUFIVixDQUFBOztBQUFBLEVBSUEsS0FBQSxHQUFRLElBSlIsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE9BQUEsRUFDRTtBQUFBLE1BQUEsT0FBQSxFQUFTLE9BQUEsQ0FBUSxXQUFSLENBQVQ7QUFBQSxNQUNBLE1BQUEsRUFBUSxPQUFBLENBQVEsVUFBUixDQURSO0FBQUEsTUFFQSxNQUFBLEVBQVEsT0FBQSxDQUFRLFVBQVIsQ0FGUjtBQUFBLE1BR0EsSUFBQSxFQUFNLE9BQUEsQ0FBUSxRQUFSLENBSE47S0FERjtBQUFBLElBTUEsU0FBQSxFQUFXLFNBQUMsR0FBRCxFQUFNLEdBQU4sR0FBQTtBQUNULE1BQUEsSUFBVSwyQkFBQSxJQUFtQixDQUFBLElBQUssQ0FBQSxVQUFELENBQVksR0FBWixDQUFqQztBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBUSxDQUFBLEdBQUEsQ0FBVCxHQUFnQixHQURoQixDQUFBO2FBRUksSUFBQSxVQUFBLENBQVcsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNiLFVBQUEsS0FBQyxDQUFBLFVBQUQsQ0FBWSxHQUFaLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsWUFBRCxDQUFjLEdBQWQsRUFGYTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVgsRUFISztJQUFBLENBTlg7QUFBQSxJQWNBLFlBQUEsRUFBYyxTQUFDLEdBQUQsR0FBQTthQUNaLE1BQUEsQ0FBQSxJQUFRLENBQUEsT0FBUSxDQUFBLEdBQUEsRUFESjtJQUFBLENBZGQ7QUFBQSxJQWlCQSxLQUFBLEVBQU8sU0FBQSxHQUFBO0FBQ0wsVUFBQSxpQkFBQTtBQUFBO0FBQUEsV0FBQSwyQ0FBQTtxQkFBQTtBQUNFLFFBQUEsSUFBQyxDQUFBLFVBQUQsQ0FBWSxDQUFaLENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLFlBQUQsQ0FBYyxDQUFkLENBREEsQ0FERjtBQUFBLE9BQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxPQUFPLENBQUMsT0FBVCxHQUFtQixPQUFBLENBQVEsV0FBUixDQUhuQixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsR0FBa0IsT0FBQSxDQUFRLFVBQVIsQ0FKbEIsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULEdBQWtCLE9BQUEsQ0FBUSxVQUFSLENBTGxCLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxHQUFnQixPQUFBLENBQVEsUUFBUixDQU5oQixDQUFBO0FBQUEsTUFPQSxPQUFBLEdBQVUsSUFQVixDQUFBO0FBQUEsTUFRQSxPQUFBLEdBQVUsSUFSVixDQUFBO2FBU0EsS0FBQSxHQUFRLEtBVkg7SUFBQSxDQWpCUDtBQUFBLElBNkJBLFFBQUEsRUFBVSxTQUFDLEdBQUQsR0FBQTtBQUNSLFVBQUEsR0FBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLElBQUMsQ0FBQSxPQUFRLENBQUEsR0FBQSxDQUFmLENBQUE7QUFDQSxNQUFBLElBQWMsV0FBZDtBQUFBLGNBQUEsQ0FBQTtPQURBO0FBRUEsTUFBQSxJQUFlLGtCQUFmO0FBQUEsZUFBTyxJQUFQLENBQUE7T0FGQTtBQUdBLE1BQUEsSUFBbUIsb0JBQW5CO0FBQUEsZUFBTyxJQUFQLENBQUE7T0FIQTs7UUFJQSxVQUFXLE9BQUEsQ0FBUSxxQkFBUjtPQUpYOztRQUtBLFVBQVcsT0FBQSxDQUFRLHFCQUFSO09BTFg7O1FBTUEsUUFBUyxPQUFBLENBQVEsbUJBQVI7T0FOVDtBQUFBLE1BT0EsR0FBRyxDQUFDLFFBQUosQ0FBYSxPQUFiLEVBQXNCLE9BQXRCLEVBQStCLEtBQS9CLENBUEEsQ0FBQTthQVFBLEdBQUcsQ0FBQyxNQUFKLEdBQWEsS0FUTDtJQUFBLENBN0JWO0FBQUEsSUF3Q0EsVUFBQSxFQUFZLFNBQUMsR0FBRCxHQUFBO0FBQ1YsVUFBQSxHQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sSUFBQyxDQUFBLE9BQVEsQ0FBQSxHQUFBLENBQWYsQ0FBQTtBQUNBLE1BQUEsSUFBYyxXQUFkO0FBQUEsY0FBQSxDQUFBO09BREE7QUFFQSxNQUFBLElBQW1CLGtCQUFuQjtBQUFBLGVBQU8sSUFBUCxDQUFBO09BRkE7QUFHQSxNQUFBLElBQW1CLHNCQUFuQjtBQUFBLGVBQU8sSUFBUCxDQUFBO09BSEE7QUFBQSxNQUlBLEdBQUcsQ0FBQyxVQUFKLENBQUEsQ0FKQSxDQUFBO0FBQUEsTUFLQSxHQUFHLENBQUMsTUFBSixHQUFhLElBTGIsQ0FBQTtBQU1BLGFBQU8sSUFBUCxDQVBVO0lBQUEsQ0F4Q1o7QUFBQSxJQWlEQSxVQUFBLEVBQVksU0FBQyxHQUFELEdBQUE7YUFDVixHQUFBLEtBQVEsU0FBUixJQUFBLEdBQUEsS0FBbUIsUUFBbkIsSUFBQSxHQUFBLEtBQTZCLFFBQTdCLElBQUEsR0FBQSxLQUF1QyxPQUQ3QjtJQUFBLENBakRaO0dBUEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/output/output.coffee
