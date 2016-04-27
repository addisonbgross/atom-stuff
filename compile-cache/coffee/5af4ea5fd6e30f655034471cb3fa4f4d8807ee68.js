(function() {
  var Command, Disposable, Input, Project;

  Disposable = require('atom').Disposable;

  Command = null;

  Project = null;

  Input = null;

  module.exports = {
    modules: {
      all: require('./all'),
      regex: require('./regex'),
      profile: require('./profile'),
      remansi: require('./remansi')
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
      this.modules.all = require('./all');
      this.modules.regex = require('./regex');
      this.modules.profile = require('./profile');
      this.modules.remansi = require('./remansi');
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
      return key === 'all' || key === 'regex' || key === 'profile' || key === 'remansi';
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3N0cmVhbS1tb2RpZmllcnMvbW9kaWZpZXJzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtQ0FBQTs7QUFBQSxFQUFDLGFBQWMsT0FBQSxDQUFRLE1BQVIsRUFBZCxVQUFELENBQUE7O0FBQUEsRUFFQSxPQUFBLEdBQVUsSUFGVixDQUFBOztBQUFBLEVBR0EsT0FBQSxHQUFVLElBSFYsQ0FBQTs7QUFBQSxFQUlBLEtBQUEsR0FBUSxJQUpSLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxPQUFBLEVBQ0U7QUFBQSxNQUFBLEdBQUEsRUFBSyxPQUFBLENBQVEsT0FBUixDQUFMO0FBQUEsTUFDQSxLQUFBLEVBQU8sT0FBQSxDQUFRLFNBQVIsQ0FEUDtBQUFBLE1BRUEsT0FBQSxFQUFTLE9BQUEsQ0FBUSxXQUFSLENBRlQ7QUFBQSxNQUdBLE9BQUEsRUFBUyxPQUFBLENBQVEsV0FBUixDQUhUO0tBREY7QUFBQSxJQU1BLFNBQUEsRUFBVyxTQUFDLEdBQUQsRUFBTSxHQUFOLEdBQUE7QUFDVCxNQUFBLElBQVUsMkJBQUEsSUFBbUIsQ0FBQSxJQUFLLENBQUEsVUFBRCxDQUFZLEdBQVosQ0FBakM7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQVEsQ0FBQSxHQUFBLENBQVQsR0FBZ0IsR0FEaEIsQ0FBQTthQUVJLElBQUEsVUFBQSxDQUFXLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDYixVQUFBLEtBQUMsQ0FBQSxVQUFELENBQVksR0FBWixDQUFBLENBQUE7aUJBQ0EsS0FBQyxDQUFBLFlBQUQsQ0FBYyxHQUFkLEVBRmE7UUFBQSxFQUFBO01BQUEsQ0FB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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/stream-modifiers/modifiers.coffee
