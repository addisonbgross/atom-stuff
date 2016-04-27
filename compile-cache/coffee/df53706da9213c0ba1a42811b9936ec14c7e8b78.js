(function() {
  var BufferedProcess, CPInfoPane, ChildProcess, fs, pstree, translate;

  BufferedProcess = require('atom').BufferedProcess;

  fs = require('fs');

  pstree = null;

  translate = {
    'none': 'Disable all output streams',
    'no-stdout': 'Disable stdout',
    'no-stderr': 'Disable stderr',
    'stderr-in-stdout': 'Redirect stderr in stdout',
    'stdout-in-stderr': 'Redirect stdout in stderr',
    'both': 'Display all output streams'
  };

  module.exports = {
    name: 'Child Process',
    info: CPInfoPane = (function() {
      function CPInfoPane(command) {
        var key, value;
        this.element = document.createElement('div');
        this.element.classList.add('module');
        key = document.createElement('div');
        key.classList.add('text-padded');
        key.innerText = 'Output Streams:';
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = translate[command.environment.config.stdoe];
        this.element.appendChild(key);
        this.element.appendChild(value);
      }

      return CPInfoPane;

    })(),
    mod: ChildProcess = (function() {
      function ChildProcess(command, manager, config) {
        this.command = command;
        this.config = config;
        this.killed = false;
        if (atom.inSpecMode()) {
          this.promise = new Promise((function(_this) {
            return function(resolve, reject) {
              _this.resolve = resolve;
              _this.reject = reject;
              return _this.process = {
                exit: function(exitcode) {
                  if (_this.killed) {
                    return _this.resolve(exitcode);
                  }
                  _this.killed = true;
                  manager.finish(exitcode);
                  return _this.resolve(exitcode);
                },
                error: function(error) {
                  manager.error(error);
                  return _this.reject(error);
                },
                kill: function() {
                  _this.killed = true;
                  manager.finish(null);
                  return _this.resolve(null);
                }
              };
            };
          })(this));
          this.sigterm = function() {
            return this.process.kill();
          };
        } else {
          this.promise = new Promise((function(_this) {
            return function(resolve, reject) {
              var cwd;
              _this.resolve = resolve;
              _this.reject = reject;
              cwd = _this.command.getWD();
              return fs.exists(cwd, function(exists) {
                var error;
                if (exists) {
                  return _this.spawn(manager, cwd);
                }
                error = new Error("Working Directory " + cwd + " does not exist");
                _this.killed = true;
                manager.error(error);
                return _this.reject(error);
              });
            };
          })(this));
        }
        this.promise.then((function(_this) {
          return function() {
            return _this.destroy();
          };
        })(this), (function(_this) {
          return function() {
            return _this.destroy();
          };
        })(this));
      }

      ChildProcess.prototype.spawn = function(manager, cwd) {
        var args, command, env, setupStream, _ref, _ref1, _ref2;
        _ref = this.command, command = _ref.command, args = _ref.args, env = _ref.env;
        this.process = new BufferedProcess({
          command: command,
          args: args,
          options: {
            cwd: cwd,
            env: env
          }
        });
        this.process.process.on('close', (function(_this) {
          return function(exitcode, signal) {
            if (_this.killed) {
              return;
            }
            _this.killed = true;
            manager.finish({
              exitcode: exitcode,
              signal: signal
            });
            return _this.resolve({
              exitcode: exitcode,
              signal: signal
            });
          };
        })(this));
        if (this.config.stdoe !== 'none') {
          if ((_ref1 = this.process.process.stdout) != null) {
            _ref1.setEncoding('utf8');
          }
          if ((_ref2 = this.process.process.stderr) != null) {
            _ref2.setEncoding('utf8');
          }
          setupStream = function(stream, into) {
            return stream.on('data', (function(_this) {
              return function(data) {
                if (_this.process == null) {
                  return;
                }
                if (_this.killed) {
                  return;
                }
                return into["in"](data);
              };
            })(this));
          };
          if (this.config.stdoe === 'stderr-in-stdout') {
            setupStream(this.process.process.stdout, manager.stdout);
            setupStream(this.process.process.stderr, manager.stdout);
          } else if (this.config.stdoe === 'stdout-in-stderr') {
            setupStream(this.process.process.stdout, manager.stderr);
            setupStream(this.process.process.stderr, manager.stderr);
          } else if (this.config.stdoe === 'no-stdout') {
            setupStream(this.process.process.stderr, manager.stderr);
          } else if (this.config.stdoe === 'no-stderr') {
            setupStream(this.process.process.stdout, manager.stdout);
          } else if (this.config.stdoe === 'both') {
            setupStream(this.process.process.stdout, manager.stdout);
            setupStream(this.process.process.stderr, manager.stderr);
          }
        }
        manager.setInput(this.process.process.stdin);
        return this.process.onWillThrowError((function(_this) {
          return function(_arg) {
            var error, handle;
            error = _arg.error, handle = _arg.handle;
            _this.killed = true;
            manager.error(error);
            handle();
            return _this.reject(error);
          };
        })(this));
      };

      ChildProcess.prototype.getPromise = function() {
        return this.promise;
      };

      ChildProcess.prototype.isKilled = function() {
        return this.killed;
      };

      ChildProcess.prototype.sigterm = function() {
        return this.sendSignal('SIGINT');
      };

      ChildProcess.prototype.sigkill = function() {
        return this.sendSignal('SIGKILL');
      };

      ChildProcess.prototype.sendSignal = function(signal) {
        var _ref;
        if (process.platform === 'win32') {
          return (_ref = this.process) != null ? _ref.kill(signal) : void 0;
        } else {
          return (pstree != null ? pstree : pstree = require('ps-tree'))(this.process.process.pid, (function(_this) {
            return function(e, c) {
              var child, _i, _len;
              if (e != null) {
                return;
              }
              for (_i = 0, _len = c.length; _i < _len; _i++) {
                child = c[_i];
                try {
                  process.kill(child.PID, signal);
                } catch (_error) {
                  e = _error;
                  console.log(e);
                }
              }
              try {
                _this.process.process.kill(signal);
                return _this.process.killed = true;
              } catch (_error) {
                e = _error;
                return console.log(e);
              }
            };
          })(this));
        }
      };

      ChildProcess.prototype.destroy = function() {
        this.killed = true;
        this.promise = null;
        this.process = null;
        this.reject = function(e) {
          return console.log("Received reject for finished process: " + (JSON.stringify(e)));
        };
        return this.resolve = function(e) {
          return console.log("Received resolve for finished process: " + (JSON.stringify(e)));
        };
      };

      return ChildProcess;

    })()
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL2Vudmlyb25tZW50L2NoaWxkLXByb2Nlc3MuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdFQUFBOztBQUFBLEVBQUMsa0JBQW1CLE9BQUEsQ0FBUSxNQUFSLEVBQW5CLGVBQUQsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUZMLENBQUE7O0FBQUEsRUFJQSxNQUFBLEdBQVMsSUFKVCxDQUFBOztBQUFBLEVBTUEsU0FBQSxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQVEsNEJBQVI7QUFBQSxJQUNBLFdBQUEsRUFBYSxnQkFEYjtBQUFBLElBRUEsV0FBQSxFQUFhLGdCQUZiO0FBQUEsSUFHQSxrQkFBQSxFQUFvQiwyQkFIcEI7QUFBQSxJQUlBLGtCQUFBLEVBQW9CLDJCQUpwQjtBQUFBLElBS0EsTUFBQSxFQUFRLDRCQUxSO0dBUEYsQ0FBQTs7QUFBQSxFQWNBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLElBQUEsRUFBTSxlQUFOO0FBQUEsSUFFQSxJQUFBLEVBQ1E7QUFDUyxNQUFBLG9CQUFDLE9BQUQsR0FBQTtBQUNYLFlBQUEsVUFBQTtBQUFBLFFBQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUFYLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLFFBQXZCLENBREEsQ0FBQTtBQUFBLFFBRUEsR0FBQSxHQUFNLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBRk4sQ0FBQTtBQUFBLFFBR0EsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFkLENBQWtCLGFBQWxCLENBSEEsQ0FBQTtBQUFBLFFBSUEs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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/environment/child-process.coffee
