(function() {
  var Command, Disposable, Input, Project, path;

  Disposable = require('atom').Disposable;

  path = require('path');

  Command = null;

  Project = null;

  Input = null;

  module.exports = {
    modules: {
      bt: require('./build-tools'),
      bte: require('./build-tools-external')
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
      this.modules.bt = require('./build-tools');
      this.modules.bte = require('./build-tools-external');
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
        Command = require('./command');
      }
      if (Project == null) {
        Project = require('./project');
      }
      if (Input == null) {
        Input = require('./input');
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
      return key === 'bt' || key === 'bte';
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3Byb3ZpZGVyL3Byb3ZpZGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5Q0FBQTs7QUFBQSxFQUFDLGFBQWMsT0FBQSxDQUFRLE1BQVIsRUFBZCxVQUFELENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBR0EsT0FBQSxHQUFVLElBSFYsQ0FBQTs7QUFBQSxFQUlBLE9BQUEsR0FBVSxJQUpWLENBQUE7O0FBQUEsRUFLQSxLQUFBLEdBQVEsSUFMUixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsT0FBQSxFQUNFO0FBQUEsTUFBQSxFQUFBLEVBQUksT0FBQSxDQUFRLGVBQVIsQ0FBSjtBQUFBLE1BQ0EsR0FBQSxFQUFLLE9BQUEsQ0FBUSx3QkFBUixDQURMO0tBREY7QUFBQSxJQUlBLFNBQUEsRUFBVyxTQUFDLEdBQUQsRUFBTSxHQUFOLEdBQUE7QUFDVCxNQUFBLElBQVUsMkJBQUEsSUFBbUIsQ0FBQSxJQUFLLENBQUEsVUFBRCxDQUFZLEdBQVosQ0FBakM7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQVEsQ0FBQSxHQUFBLENBQVQsR0FBZ0IsR0FEaEIsQ0FBQTthQUVJLElBQUEsVUFBQSxDQUFXLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDYixVQUFBLEtBQUMsQ0FBQSxVQUFELENBQVksR0FBWixDQUFBLENBQUE7aUJBQ0EsS0FBQyxDQUFBLFlBQUQsQ0FBYyxHQUFkLEVBRmE7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFYLEVBSEs7SUFBQSxDQUpYO0FBQUEsSUFZQSxZQUFBLEVBQWMsU0FBQyxHQUFELEdBQUE7YUFDWixNQUFBLENBQUEsSUFBUSxDQUFBLE9BQVEsQ0FBQSxHQUFBLEVBREo7SUFBQSxDQVpkO0FBQUEsSUFlQSxLQUFBLEVBQU8sU0FBQSxHQUFBO0FBQ0wsVUFBQSxpQkFBQTtBQUFBO0FBQUEsV0FBQSwyQ0FBQTtxQkFBQTtBQUNFLFFBQUEsSUFBQyxDQUFBLFVBQUQsQ0FBWSxDQUFaLENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLFlBQUQsQ0FBYyxDQUFkLENBREEsQ0FERjtBQUFBLE9BQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxHQUFjLE9BQUEsQ0FBUSxlQUFSLENBSGQsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxHQUFULEdBQWUsT0FBQSxDQUFRLHdCQUFSLENBSmYsQ0FBQTtBQUFBLE1BS0EsT0FBQSxHQUFVLElBTFYsQ0FBQTtBQUFBLE1BTUEsT0FBQSxHQUFVLElBTlYsQ0FBQTthQU9BLEtBQUEsR0FBUSxLQVJIO0lBQUEsQ0FmUDtBQUFBLElBeUJBLFFBQUEsRUFBVSxTQUFDLEdBQUQsR0FBQTtBQUNSLFVBQUEsR0FBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLElBQUMsQ0FBQSxPQUFRLENBQUEsR0FBQSxDQUFmLENBQUE7QUFDQSxNQUFBLElBQWMsV0FBZDtBQUFBLGNBQUEsQ0FBQTtPQURBO0FBRUEsTUFBQSxJQUFlLGtCQUFmO0FBQUEsZUFBTyxJQUFQLENBQUE7T0FGQTtBQUdBLE1BQUEsSUFBbUIsb0JBQW5CO0FBQUEsZUFBTyxJQUFQLENBQUE7T0FIQTs7UUFJQSxVQUFXLE9BQUEsQ0FBUSxXQUFSO09BSlg7O1FBS0EsVUFBVyxPQUFBLENBQVEsV0FBUjtPQUxYOztRQU1BLFFBQVMsT0FBQSxDQUFRLFNBQVI7T0FOVDtBQUFBLE1BT0EsR0FBRyxDQUFDLFFBQUosQ0FBYSxPQUFiLEVBQXNCLE9BQXRCLEVBQStCLEtBQS9CLENBUEEsQ0FBQTthQVFBLEdBQUcsQ0FBQyxNQUFKLEdBQWEsS0FUTDtJQUFBLENBekJWO0FBQUEsSUFvQ0EsVUFBQSxFQUFZLFNBQUMsR0FBRCxHQUFBO0FBQ1YsVUFBQSxHQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sSUFBQyxDQUFBLE9BQVEsQ0FBQSxHQUFBLENBQWYsQ0FBQTtBQUNBLE1BQUEsSUFBYyxXQUFkO0FBQUEsY0FBQSxDQUFBO09BREE7QUFFQSxNQUFBLElBQW1CLGtCQUFuQjtBQUFBLGVBQU8sSUFBUCxDQUFBO09BRkE7QUFHQSxNQUFBLElBQW1CLHNCQUFuQjtBQUFBLGVBQU8sSUFBUCxDQUFBO09BSEE7QUFBQSxNQUlBLEdBQUcsQ0FBQyxVQUFKLENBQUEsQ0FKQSxDQUFBO0FBQUEsTUFLQSxHQUFHLENBQUMsTUFBSixHQUFhLElBTGIsQ0FBQTtBQU1BLGFBQU8sSUFBUCxDQVBVO0lBQUEsQ0FwQ1o7QUFBQSxJQTZDQSxVQUFBLEVBQVksU0FBQyxHQUFELEdBQUE7YUFDVixHQUFBLEtBQVEsSUFBUixJQUFBLEdBQUEsS0FBYyxNQURKO0lBQUEsQ0E3Q1o7R0FSRixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/provider/provider.coffee
