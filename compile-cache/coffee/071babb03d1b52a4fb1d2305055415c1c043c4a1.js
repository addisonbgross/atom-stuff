(function() {
  var Disposable;

  Disposable = require('atom').Disposable;

  module.exports = {
    profiles: {
      gcc_clang: require('./gcc_clang'),
      apm_test: require('./apm_test'),
      java: require('./javac'),
      python: require('./python'),
      modelsim: require('./modelsim')
    },
    addProfile: function(key, profile) {
      if ((this.profiles[key] != null) && !this.isCoreName(key)) {
        return;
      }
      this.profiles[key] = profile;
      return new Disposable((function(_this) {
        return function() {
          return _this.removeProfile(key);
        };
      })(this));
    },
    removeProfile: function(key) {
      return delete this.profiles[key];
    },
    reset: function() {
      var k, _i, _len, _ref;
      _ref = Object.keys(this.profiles);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        k = _ref[_i];
        if (k !== 'gcc_clang' && k !== 'apm_test' && k !== 'java' && k !== 'python' && k !== 'modelsim') {
          this.removeProfile(k);
        }
      }
      this.profiles.gcc_clang = require('./gcc_clang');
      this.profiles.apm_test = require('./apm_test');
      this.profiles.java = require('./javac');
      this.profiles.python = require('./python');
      return this.profiles.modelsim = require('./modelsim');
    },
    isCoreName: function(key) {
      return key === 'gcc_clang' || key === 'apm_test' || key === 'java' || key === 'python' || key === 'modelsim';
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3Byb2ZpbGVzL3Byb2ZpbGVzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxVQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFDRTtBQUFBLE1BQUEsU0FBQSxFQUFXLE9BQUEsQ0FBUSxhQUFSLENBQVg7QUFBQSxNQUNBLFFBQUEsRUFBVSxPQUFBLENBQVEsWUFBUixDQURWO0FBQUEsTUFFQSxJQUFBLEVBQU0sT0FBQSxDQUFRLFNBQVIsQ0FGTjtBQUFBLE1BR0EsTUFBQSxFQUFRLE9BQUEsQ0FBUSxVQUFSLENBSFI7QUFBQSxNQUlBLFFBQUEsRUFBVSxPQUFBLENBQVEsWUFBUixDQUpWO0tBREY7QUFBQSxJQU9BLFVBQUEsRUFBWSxTQUFDLEdBQUQsRUFBTSxPQUFOLEdBQUE7QUFDVixNQUFBLElBQVUsNEJBQUEsSUFBb0IsQ0FBQSxJQUFLLENBQUEsVUFBRCxDQUFZLEdBQVosQ0FBbEM7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFFBQVMsQ0FBQSxHQUFBLENBQVYsR0FBaUIsT0FEakIsQ0FBQTthQUVJLElBQUEsVUFBQSxDQUFXLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2IsS0FBQyxDQUFBLGFBQUQsQ0FBZSxHQUFmLEVBRGE7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFYLEVBSE07SUFBQSxDQVBaO0FBQUEsSUFjQSxhQUFBLEVBQWUsU0FBQyxHQUFELEdBQUE7YUFDYixNQUFBLENBQUEsSUFBUSxDQUFBLFFBQVMsQ0FBQSxHQUFBLEVBREo7SUFBQSxDQWRmO0FBQUEsSUFpQkEsS0FBQSxFQUFPLFNBQUEsR0FBQTtBQUNMLFVBQUEsaUJBQUE7QUFBQTtBQUFBLFdBQUEsMkNBQUE7cUJBQUE7QUFDRSxRQUFBLElBQXdCLENBQUEsS0FBTSxXQUFOLElBQUEsQ0FBQSxLQUFtQixVQUFuQixJQUFBLENBQUEsS0FBK0IsTUFBL0IsSUFBQSxDQUFBLEtBQXVDLFFBQXZDLElBQUEsQ0FBQSxLQUFpRCxVQUF6RTtBQUFBLFVBQUEsSUFBQyxDQUFBLGFBQUQsQ0FBZSxDQUFmLENBQUEsQ0FBQTtTQURGO0FBQUEsT0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxTQUFWLEdBQXNCLE9BQUEsQ0FBUSxhQUFSLENBRnRCLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxRQUFRLENBQUMsUUFBVixHQUFxQixPQUFBLENBQVEsWUFBUixDQUhyQixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsR0FBaUIsT0FBQSxDQUFRLFNBQVIsQ0FKakIsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxNQUFWLEdBQW1CLE9BQUEsQ0FBUSxVQUFSLENBTG5CLENBQUE7YUFNQSxJQUFDLENBQUEsUUFBUSxDQUFDLFFBQVYsR0FBcUIsT0FBQSxDQUFRLFlBQVIsRUFQaEI7SUFBQSxDQWpCUDtBQUFBLElBMEJBLFVBQUEsRUFBWSxTQUFDLEdBQUQsR0FBQTthQUNWLEdBQUEsS0FBUSxXQUFSLElBQUEsR0FBQSxLQUFxQixVQUFyQixJQUFBLEdBQUEsS0FBaUMsTUFBakMsSUFBQSxHQUFBLEtBQXlDLFFBQXpDLElBQUEsR0FBQSxLQUFtRCxXQUR6QztJQUFBLENBMUJaO0dBSEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/profiles/profiles.coffee
