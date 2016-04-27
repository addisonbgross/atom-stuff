(function() {
  var CommandWorker, Environment, InputOutputManager, pty;

  InputOutputManager = require('./io-manager');

  Environment = require('../environment/environment');

  pty = null;

  module.exports = CommandWorker = (function() {
    function CommandWorker(command, outputs) {
      this.command = command;
      this.outputs = outputs;
      this.manager = new InputOutputManager(this.command, this.outputs);
      this.killed = false;
    }

    CommandWorker.prototype.run = function() {
      var mod, _ref, _ref1, _ref2;
      if (!Environment.activate((_ref = this.command.environment) != null ? _ref.name : void 0)) {
        this.manager.error("Could not find environment module " + ((_ref1 = this.command.environment) != null ? _ref1.name : void 0));
        return Promise.reject("Could not find environment module " + ((_ref2 = this.command.environment) != null ? _ref2.name : void 0));
      }
      mod = Environment.modules[this.command.environment.name].mod;
      this.environment = new mod(this.command, this.manager, this.command.environment.config);
      return this.environment.getPromise();
    };

    CommandWorker.prototype.kill = function() {
      if (this.environment === null || this.environment.isKilled()) {
        console.log('Kill on finished process');
        return Promise.resolve();
      }
      return new Promise((function(_this) {
        return function(resolve) {
          _this.environment.getPromise().then(resolve, resolve);
          if (!_this.environment.isKilled()) {
            _this.environment.sigterm();
          }
          return setTimeout(function() {
            if (_this.environment == null) {
              return;
            }
            if (!_this.environment.isKilled()) {
              return _this.environment.sigkill();
            }
          }, 3000);
        };
      })(this));
    };

    CommandWorker.prototype.destroy = function() {
      var _ref;
      if (!(this.environment.isKilled() || atom.inSpecMode())) {
        this.environment.sigkill();
      }
      this.environment.destroy();
      if ((_ref = this.manager) != null) {
        _ref.destroy();
      }
      this.manager = null;
      return this.environment = null;
    };

    return CommandWorker;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3BpcGVsaW5lL2NvbW1hbmQtd29ya2VyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtREFBQTs7QUFBQSxFQUFBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSxjQUFSLENBQXJCLENBQUE7O0FBQUEsRUFFQSxXQUFBLEdBQWMsT0FBQSxDQUFRLDRCQUFSLENBRmQsQ0FBQTs7QUFBQSxFQUlBLEdBQUEsR0FBTSxJQUpOLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBRVMsSUFBQSx1QkFBRSxPQUFGLEVBQVksT0FBWixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsVUFBQSxPQUNiLENBQUE7QUFBQSxNQURzQixJQUFDLENBQUEsVUFBQSxPQUN2QixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFlLElBQUEsa0JBQUEsQ0FBbUIsSUFBQyxDQUFBLE9BQXBCLEVBQTZCLElBQUMsQ0FBQSxPQUE5QixDQUFmLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxNQUFELEdBQVUsS0FEVixDQURXO0lBQUEsQ0FBYjs7QUFBQSw0QkFJQSxHQUFBLEdBQUssU0FBQSxHQUFBO0FBQ0gsVUFBQSx1QkFBQTtBQUFBLE1BQUEsSUFBQSxDQUFBLFdBQWtCLENBQUMsUUFBWixpREFBeUMsQ0FBRSxhQUEzQyxDQUFQO0FBQ0UsUUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLEtBQVQsQ0FBZ0Isb0NBQUEsR0FBbUMsbURBQXFCLENBQUUsYUFBdkIsQ0FBbkQsQ0FBQSxDQUFBO0FBQ0EsZUFBTyxPQUFPLENBQUMsTUFBUixDQUFnQixvQ0FBQSxHQUFtQyxtREFBcUIsQ0FBRSxhQUF2QixDQUFuRCxDQUFQLENBRkY7T0FBQTtBQUFBLE1BR0EsR0FBQSxHQUFNLFdBQVcsQ0FBQyxPQUFRLENBQUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBckIsQ0FBMEIsQ0FBQyxHQUhyRCxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsV0FBRCxHQUFtQixJQUFBLEdBQUEsQ0FBSSxJQUFDLENBQUEsT0FBTCxFQUFjLElBQUMsQ0FBQSxPQUFmLEVBQXdCLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQTdDLENBSm5CLENBQUE7QUFLQSxhQUFPLElBQUMsQ0FBQSxXQUFXLENBQUMsVUFBYixDQUFBLENBQVAsQ0FORztJQUFBLENBSkwsQ0FBQTs7QUFBQSw0QkFZQSxJQUFBLEdBQU0sU0FBQSxHQUFBO0FBQ0osTUFBQSxJQUFHLElBQUMsQ0FBQSxXQUFELEtBQWdCLElBQWhCLElBQXdCLElBQUMsQ0FBQSxXQUFXLENBQUMsUUFBYixDQUFBLENBQTNCO0FBQ0UsUUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLDBCQUFaLENBQUEsQ0FBQTtBQUNBLGVBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFQLENBRkY7T0FBQTthQUdJLElBQUEsT0FBQSxDQUFRLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE9BQUQsR0FBQTtBQUNWLFVBQUEsS0FBQyxDQUFBLFdBQVcsQ0FBQyxVQUFiLENBQUEsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixPQUEvQixFQUF3QyxPQUF4QyxDQUFBLENBQUE7QUFDQSxVQUFBLElBQUEsQ0FBQSxLQUErQixDQUFBLFdBQVcsQ0FBQyxRQUFiLENBQUEsQ0FBOUI7QUFBQSxZQUFBLEtBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBLENBQUEsQ0FBQTtXQURBO2lCQUVBLFVBQUEsQ0FDRSxTQUFBLEdBQUE7QUFDRSxZQUFBLElBQWMseUJBQWQ7QUFBQSxvQkFBQSxDQUFBO2FBQUE7QUFDQSxZQUFBLElBQUEsQ0FBQSxLQUErQixDQUFBLFdBQVcsQ0FBQyxRQUFiLENBQUEsQ0FBOUI7cUJBQUEsS0FBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUEsRUFBQTthQUZGO1VBQUEsQ0FERixFQUlFLElBSkYsRUFIVTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVIsRUFKQTtJQUFBLENBWk4sQ0FBQTs7QUFBQSw0QkEwQkEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxDQUFBLENBQThCLElBQUMsQ0FBQSxXQUFXLENBQUMsUUFBYixDQUFBLENBQUEsSUFBMkIsSUFBSSxDQUFDLFVBQUwsQ0FBQSxDQUF6RCxDQUFBO0FBQUEsUUFBQSxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQSxDQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUEsQ0FEQSxDQUFBOztZQUVRLENBQUUsT0FBVixDQUFBO09BRkE7QUFBQSxNQUdBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFIWCxDQUFBO2FBSUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxLQUxSO0lBQUEsQ0ExQlQsQ0FBQTs7eUJBQUE7O01BVEosQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/pipeline/command-worker.coffee
