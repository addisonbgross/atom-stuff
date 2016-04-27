(function() {
  var BufferedProcess, CommandWorker, InputOutputManager;

  InputOutputManager = require('./io-manager');

  BufferedProcess = require('atom').BufferedProcess;

  module.exports = CommandWorker = (function() {
    function CommandWorker(command, outputs) {
      this.command = command;
      this.outputs = outputs;
      this.manager = new InputOutputManager(this.command, this.outputs);
      this.killed = false;
    }

    CommandWorker.prototype.run = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var args, command, env, _ref;
          if (atom.inSpecMode()) {
            _this.process = {
              exit: function(exitcode) {
                if (_this.killed) {
                  return resolve(exitcode);
                }
                _this.killed = true;
                _this.manager.finish(exitcode);
                _this.destroy();
                return resolve(exitcode);
              },
              error: function(error) {
                _this.manager.error(error);
                _this.destroy();
                return reject(error);
              },
              kill: function() {
                if (_this.killed) {
                  return resolve(null);
                }
                _this.manager.finish(null);
                _this.destroy();
                return resolve(null);
              }
            };
            return _this.manager.setInput({
              write: function() {},
              end: function() {}
            });
          } else {
            _ref = _this.command, command = _ref.command, args = _ref.args, env = _ref.env;
            _this.process = new BufferedProcess({
              command: command,
              args: args,
              options: {
                cwd: _this.command.getWD(),
                env: env
              },
              stdout: function() {},
              stderr: function() {},
              exit: function(exitcode) {
                if (_this.killed) {
                  return resolve(exitcode);
                }
                _this.killed = true;
                _this.manager.finish(exitcode);
                _this.destroy();
                return resolve(exitcode);
              }
            });
            _this.process.process.stdout.setEncoding('utf8');
            _this.process.process.stderr.setEncoding('utf8');
            _this.process.process.stdout.on('data', function(data) {
              if (_this.process == null) {
                return;
              }
              if (_this.process.killed) {
                return;
              }
              return _this.manager.stdout["in"](data);
            });
            _this.process.process.stderr.on('data', function(data) {
              if (_this.process == null) {
                return;
              }
              if (_this.process.killed) {
                return;
              }
              return _this.manager.stderr["in"](data);
            });
            _this.manager.setInput(_this.process.process.stdin);
            return _this.process.onWillThrowError(function(_arg) {
              var error, handle;
              error = _arg.error, handle = _arg.handle;
              _this.manager.error(error);
              _this.destroy();
              handle();
              return reject(error);
            });
          }
        };
      })(this));
    };

    CommandWorker.prototype.kill = function() {
      var _ref;
      this.killed = true;
      if ((_ref = this.process) != null) {
        if (typeof _ref.kill === "function") {
          _ref.kill();
        }
      }
      return this.process = null;
    };

    CommandWorker.prototype.destroy = function() {
      var _ref;
      if (!this.killed) {
        this.kill();
      }
      if ((_ref = this.manager) != null) {
        _ref.destroy();
      }
      return this.manager = null;
    };

    return CommandWorker;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3BpcGVsaW5lL2NvbW1hbmQtd29ya2VyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrREFBQTs7QUFBQSxFQUFBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSxjQUFSLENBQXJCLENBQUE7O0FBQUEsRUFFQyxrQkFBbUIsT0FBQSxDQUFRLE1BQVIsRUFBbkIsZUFGRCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUVTLElBQUEsdUJBQUUsT0FBRixFQUFZLE9BQVosR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFVBQUEsT0FDYixDQUFBO0FBQUEsTUFEc0IsSUFBQyxDQUFBLFVBQUEsT0FDdkIsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBZSxJQUFBLGtCQUFBLENBQW1CLElBQUMsQ0FBQSxPQUFwQixFQUE2QixJQUFDLENBQUEsT0FBOUIsQ0FBZixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsTUFBRCxHQUFVLEtBRFYsQ0FEVztJQUFBLENBQWI7O0FBQUEsNEJBSUEsR0FBQSxHQUFLLFNBQUEsR0FBQTthQUNDLElBQUEsT0FBQSxDQUFRLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7QUFDVixjQUFBLHdCQUFBO0FBQUEsVUFBQSxJQUFHLElBQUksQ0FBQyxVQUFMLENBQUEsQ0FBSDtBQUNFLFlBQUEsS0FBQyxDQUFBLE9BQUQsR0FDRTtBQUFBLGNBQUEsSUFBQSxFQUFNLFNBQUMsUUFBRCxHQUFBO0FBQ0osZ0JBQUEsSUFBNEIsS0FBQyxDQUFBLE1BQTdCO0FBQUEseUJBQU8sT0FBQSxDQUFRLFFBQVIsQ0FBUCxDQUFBO2lCQUFBO0FBQUEsZ0JBQ0EsS0FBQyxD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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/pipeline/command-worker.coffee
