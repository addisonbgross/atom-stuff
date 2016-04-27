(function() {
  var Command, Disposable, Input, Project;

  Disposable = require('atom').Disposable;

  Command = null;

  Project = null;

  Input = null;

  module.exports = {
    modules: {
      child_process: require('./child-process'),
      ptyw: require('./ptyw')
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
      this.modules.child_process = require('./child-process');
      this.modules.ptyw = require('./ptyw');
      Command = null;
      Project = null;
      return Input = null;
    },
    activate: function(key) {
      var mod;
      if (key == null) {
        return false;
      }
      mod = this.modules[key];
      if (mod == null) {
        return false;
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
      return key === 'child_process' || key === 'ptyw';
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL2Vudmlyb25tZW50L2Vudmlyb25tZW50LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtQ0FBQTs7QUFBQSxFQUFDLGFBQWMsT0FBQSxDQUFRLE1BQVIsRUFBZCxVQUFELENBQUE7O0FBQUEsRUFFQSxPQUFBLEdBQVUsSUFGVixDQUFBOztBQUFBLEVBR0EsT0FBQSxHQUFVLElBSFYsQ0FBQTs7QUFBQSxFQUlBLEtBQUEsR0FBUSxJQUpSLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxPQUFBLEVBQ0U7QUFBQSxNQUFBLGFBQUEsRUFBZSxPQUFBLENBQVEsaUJBQVIsQ0FBZjtBQUFBLE1BQ0EsSUFBQSxFQUFNLE9BQUEsQ0FBUSxRQUFSLENBRE47S0FERjtBQUFBLElBSUEsU0FBQSxFQUFXLFNBQUMsR0FBRCxFQUFNLEdBQU4sR0FBQTtBQUNULE1BQUEsSUFBVSwyQkFBQSxJQUFtQixDQUFBLElBQUssQ0FBQSxVQUFELENBQVksR0FBWixDQUFqQztBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBUSxDQUFBLEdBQUEsQ0FBVCxHQUFnQixHQURoQixDQUFBO2FBRUksSUFBQSxVQUFBLENBQVcsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNiLFVBQUEsS0FBQyxDQUFBLFVBQUQsQ0FBWSxHQUFaLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsWUFBRCxDQUFjLEdBQWQsRUFGYTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVgsRUFISztJQUFBLENBSlg7QUFBQSxJQVlBLFlBQUEsRUFBYyxTQUFDLEdBQUQsR0FBQTthQUNaLE1BQUEsQ0FBQSxJQUFRLENBQUEsT0FBUSxDQUFBLEdBQUEsRUFESjtJQUFBLENBWmQ7QUFBQSxJQWVBLEtBQUEsRUFBTyxTQUFBLEdBQUE7QUFDTCxVQUFBLGlCQUFBO0FBQUE7QUFBQSxXQUFBLDJDQUFBO3FCQUFBO0FBQ0UsUUFBQSxJQUFDLENBQUEsVUFBRCxDQUFZLENBQVosQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsWUFBRCxDQUFjLENBQWQsQ0FEQSxDQURGO0FBQUEsT0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxhQUFULEdBQXlCLE9BQUEsQ0FBUSxpQkFBUixDQUh6QixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsR0FBZ0IsT0FBQSxDQUFRLFFBQVIsQ0FKaEIsQ0FBQTtBQUFBLE1BS0EsT0FBQSxHQUFVLElBTFYsQ0FBQTtBQUFBLE1BTUEsT0FBQSxHQUFVLElBTlYsQ0FBQTthQU9BLEtBQUEsR0FBUSxLQVJIO0lBQUEsQ0FmUDtBQUFBLElBeUJBLFFBQUEsRUFBVSxTQUFDLEdBQUQsR0FBQTtBQUNSLFVBQUEsR0FBQTtBQUFBLE1BQUEsSUFBb0IsV0FBcEI7QUFBQSxlQUFPLEtBQVAsQ0FBQTtPQUFBO0FBQUEsTUFDQSxHQUFBLEdBQU0sSUFBQyxDQUFBLE9BQVEsQ0FBQSxHQUFBLENBRGYsQ0FBQTtBQUVBLE1BQUEsSUFBb0IsV0FBcEI7QUFBQSxlQUFPLEtBQVAsQ0FBQTtPQUZBO0FBR0EsTUFBQSxJQUFlLGtCQUFmO0FBQUEsZUFBTyxJQUFQLENBQUE7T0FIQTtBQUlBLE1BQUEsSUFBbUIsb0JBQW5CO0FBQUEsZUFBTyxJQUFQLENBQUE7T0FKQTs7UUFLQSxVQUFXLE9BQUEsQ0FBUSxxQkFBUjtPQUxYOztRQU1BLFVBQVcsT0FBQSxDQUFRLHFCQUFSO09BTlg7O1FBT0EsUUFBUyxPQUFBLENBQVEsbUJBQVI7T0FQVDtBQUFBLE1BUUEsR0FBRyxDQUFDLFFBQUosQ0FBYSxPQUFiLEVBQXNCLE9BQXRCLEVBQStCLEtBQS9CLENBUkEsQ0FBQTthQVNBLEdBQUcsQ0FBQyxNQUFKLEdBQWEsS0FWTDtJQUFBLENBekJWO0FBQUEsSUFxQ0EsVUFBQSxFQUFZLFNBQUMsR0FBRCxHQUFBO0FBQ1YsVUFBQSxHQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sSUFBQyxDQUFBLE9BQVEsQ0FBQSxHQUFBLENBQWYsQ0FBQTtBQUNBLE1BQUEsSUFBYyxXQUFkO0FBQUEsY0FBQSxDQUFBO09BREE7QUFFQSxNQUFBLElBQW1CLGtCQUFuQjtBQUFBLGVBQU8sSUFBUCxDQUFBO09BRkE7QUFHQSxNQUFBLElBQW1CLHNCQUFuQjtBQUFBLGVBQU8sSUFBUCxDQUFBO09BSEE7QUFBQSxNQUlBLEdBQUcsQ0FBQyxVQUFKLENBQUEsQ0FKQSxDQUFBO0FBQUEsTUFLQSxHQUFHLENBQUMsTUFBSixHQUFhLElBTGIsQ0FBQTtBQU1BLGFBQU8sSUFBUCxDQVBVO0lBQUEsQ0FyQ1o7QUFBQSxJQThDQSxVQUFBLEVBQVksU0FBQyxHQUFELEdBQUE7YUFDVixHQUFBLEtBQVEsZUFBUixJQUFBLEdBQUEsS0FBeUIsT0FEZjtJQUFBLENBOUNaO0dBUEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/environment/environment.coffee
