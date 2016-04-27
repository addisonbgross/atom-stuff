(function() {
  var Command, Disposable, Input, Project, path;

  Disposable = require('atom').Disposable;

  path = require('path');

  Command = null;

  Project = null;

  Input = null;

  module.exports = {
    modules: {
      shell: require('./shell'),
      wildcards: require('./wildcards'),
      save_all: require('./save_all'),
      env: require('./env'),
      dependency: require('./dependency')
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
      this.modules.shell = require('./shell');
      this.modules.wildcards = require('./wildcards');
      this.modules.save_all = require('./save_all');
      this.modules.env = require('./env');
      this.modules.dependency = require('./dependency');
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
      return key === 'shell' || key === 'wildcards' || key === 'save_all' || key === 'env' || key === 'dependency';
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL21vZGlmaWVyL21vZGlmaWVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5Q0FBQTs7QUFBQSxFQUFDLGFBQWMsT0FBQSxDQUFRLE1BQVIsRUFBZCxVQUFELENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBR0EsT0FBQSxHQUFVLElBSFYsQ0FBQTs7QUFBQSxFQUlBLE9BQUEsR0FBVSxJQUpWLENBQUE7O0FBQUEsRUFLQSxLQUFBLEdBQVEsSUFMUixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsT0FBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sT0FBQSxDQUFRLFNBQVIsQ0FBUDtBQUFBLE1BQ0EsU0FBQSxFQUFXLE9BQUEsQ0FBUSxhQUFSLENBRFg7QUFBQSxNQUVBLFFBQUEsRUFBVSxPQUFBLENBQVEsWUFBUixDQUZWO0FBQUEsTUFHQSxHQUFBLEVBQUssT0FBQSxDQUFRLE9BQVIsQ0FITDtBQUFBLE1BSUEsVUFBQSxFQUFZLE9BQUEsQ0FBUSxjQUFSLENBSlo7S0FERjtBQUFBLElBT0EsU0FBQSxFQUFXLFNBQUMsR0FBRCxFQUFNLEdBQU4sR0FBQTtBQUNULE1BQUEsSUFBVSwyQkFBQSxJQUFtQixDQUFBLElBQUssQ0FBQSxVQUFELENBQVksR0FBWixDQUFqQztBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBUSxDQUFBLEdBQUEsQ0FBVCxHQUFnQixHQURoQixDQUFBO2FBRUksSUFBQSxVQUFBLENBQVcsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNiLFVBQUEsS0FBQyxDQUFBLFVB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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/modifier/modifier.coffee
