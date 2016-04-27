(function() {
  var CommandModifier, CommandWorker, Modifiers;

  Modifiers = require('../modifier/modifier');

  CommandWorker = require('./command-worker');

  module.exports = CommandModifier = (function() {
    function CommandModifier(command) {
      var _ref;
      this.command = command;
      this.keys = Object.keys((_ref = command.modifier) != null ? _ref : {});
      this.preSplitKeys = this.keys.filter(function(key) {
        var _ref1;
        return ((_ref1 = Modifiers.modules[key]) != null ? _ref1.preSplit : void 0) != null;
      });
      this.postSplitKeys = this.keys.filter(function(key) {
        var _ref1;
        return ((_ref1 = Modifiers.modules[key]) != null ? _ref1.postSplit : void 0) != null;
      });
      this.preSplitKeys.reverse();
      this.postSplitKeys.reverse();
    }

    CommandModifier.prototype.run = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.runPreSplit().then((function() {
            _this.command.getSpawnInfo();
            return _this.runPostSplit().then(resolve, reject);
          }), reject);
        };
      })(this));
    };

    CommandModifier.prototype.runPreSplit = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this._runPreSplit(resolve, reject);
        };
      })(this));
    };

    CommandModifier.prototype._runPreSplit = function(resolve, reject) {
      var k, ret;
      if ((k = this.preSplitKeys.pop()) == null) {
        return resolve();
      }
      if (Modifiers.activate(k) !== true) {
        return this._runPreSplit(resolve, reject);
      }
      ret = Modifiers.modules[k].preSplit(this.command);
      if (ret instanceof Promise) {
        return ret.then(((function(_this) {
          return function() {
            return _this._runPreSplit(resolve, reject);
          };
        })(this)), reject);
      } else {
        if (ret != null) {
          reject(new Error('Error in "' + k + '" module: ' + ret));
        }
        return this._runPreSplit(resolve, reject);
      }
    };

    CommandModifier.prototype.runPostSplit = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this._runPostSplit(resolve, reject);
        };
      })(this));
    };

    CommandModifier.prototype._runPostSplit = function(resolve, reject) {
      var k, ret;
      if ((k = this.postSplitKeys.pop()) == null) {
        return resolve();
      }
      if (Modifiers.activate(k) !== true) {
        return this._runPostSplit(resolve, reject);
      }
      ret = Modifiers.modules[k].postSplit(this.command);
      if (ret instanceof Promise) {
        return ret.then(((function(_this) {
          return function() {
            return _this._runPostSplit(resolve, reject);
          };
        })(this)), reject);
      } else {
        if (ret != null) {
          reject(new Error('Error in "' + k + '" module: ' + ret));
        }
        return this._runPostSplit(resolve, reject);
      }
    };

    return CommandModifier;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3BpcGVsaW5lL2NvbW1hbmQtbW9kaWZpZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlDQUFBOztBQUFBLEVBQUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxzQkFBUixDQUFaLENBQUE7O0FBQUEsRUFDQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxrQkFBUixDQURoQixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUNTLElBQUEseUJBQUUsT0FBRixHQUFBO0FBQ1gsVUFBQSxJQUFBO0FBQUEsTUFEWSxJQUFDLENBQUEsVUFBQSxPQUNiLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxJQUFELEdBQVEsTUFBTSxDQUFDLElBQVAsNENBQStCLEVBQS9CLENBQVIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFOLENBQWEsU0FBQyxHQUFELEdBQUE7QUFDM0IsWUFBQSxLQUFBO2VBQUEsNkVBRDJCO01BQUEsQ0FBYixDQURoQixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFDLENBQUEsSUFBSSxDQUFDLE1BQU4sQ0FBYSxTQUFDLEdBQUQsR0FBQTtBQUM1QixZQUFBLEtBQUE7ZUFBQSw4RUFENEI7TUFBQSxDQUFiLENBSGpCLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxZQUFZLENBQUMsT0FBZCxDQUFBLENBTEEsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUEsQ0FOQSxDQURXO0lBQUEsQ0FBYjs7QUFBQSw4QkFTQSxHQUFBLEdBQUssU0FBQSxHQUFBO2FBQ0MsSUFBQSxPQUFBLENBQVEsQ0FBQSxTQUFBLEtB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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/pipeline/command-modifier.coffee
