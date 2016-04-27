(function() {
  var BufferedProcess, CommandWorker, InputOutputManager, pty;

  InputOutputManager = require('./io-manager');

  BufferedProcess = require('atom').BufferedProcess;

  pty = null;

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
            if (_this.command.stdout.pty) {
              pty = require('ptyw.js');
              _this.process = pty.spawn(command, args, {
                name: 'xterm-color',
                cols: _this.command.stdout.pty_cols,
                rows: _this.command.stderr.pty_rows,
                cwd: _this.command.getWD(),
                env: env
              });
              _this.process.on('data', function(data) {
                if (_this.process == null) {
                  return;
                }
                if (_this.process._emittedClose) {
                  return;
                }
                return _this.manager.stdout["in"](data);
              });
              _this.process.on('exit', function(exitcode) {
                if (_this.killed) {
                  return resolve(exitcode);
                }
                _this.killed = true;
                _this.manager.finish(exitcode);
                _this.destroy();
                return resolve(exitcode);
              });
              return _this.manager.setInput(_this.process);
            } else {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3BpcGVsaW5lL2NvbW1hbmQtd29ya2VyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1REFBQTs7QUFBQSxFQUFBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSxjQUFSLENBQXJCLENBQUE7O0FBQUEsRUFFQyxrQkFBbUIsT0FBQSxDQUFRLE1BQVIsRUFBbkIsZUFGRCxDQUFBOztBQUFBLEVBSUEsR0FBQSxHQUFNLElBSk4sQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFFUyxJQUFBLHVCQUFFLE9BQUYsRUFBWSxPQUFaLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxVQUFBLE9BQ2IsQ0FBQTtBQUFBLE1BRHNCLElBQUMsQ0FBQSxVQUFBLE9BQ3ZCLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQWUsSUFBQSxrQkFBQSxDQUFtQixJQUFDLENBQUEsT0FBcEIsRUFBNkIsSUFBQyxDQUFBLE9BQTlCLENBQWYsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxLQURWLENBRFc7SUFBQSxDQUFiOztBQUFBLDRCQUlBLEdBQUEsR0FBSyxTQUFBLEdBQUE7YUFDQyxJQUFBLE9BQUEsQ0FBUSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxPQUFELEVBQVUsTUFBVixHQUFBO0FBQ1YsY0FBQSx3QkFBQTtBQUFBLFVBQUEsSUFBRyxJQUFJLENBQUMsVUFBTCxDQUFBLENBQUg7QUFDRSxZQUFBLEtBQUMsQ0FBQSxPQUFELEdBQ0U7QUFBQSxjQUFBLElBQUEsRUFBTSxTQUFDLFFBQUQsR0FBQTtBQUNKLGdCQUFBLElBQTRCLEtBQUMsQ0FBQSxNQUE3QjtBQUFBLHlCQUFPLE9BQUEsQ0FBUSxRQUFSLENB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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/pipeline/command-worker.coffee
