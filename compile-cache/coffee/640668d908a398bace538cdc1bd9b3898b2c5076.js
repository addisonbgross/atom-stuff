(function() {
  var PtyInfoPane, Ptyw, pty;

  pty = null;

  module.exports = {
    name: 'Spawn in Pseudo-Terminal',
    info: PtyInfoPane = (function() {
      function PtyInfoPane(command) {
        var key, keys, value, values;
        this.element = document.createElement('div');
        this.element.classList.add('module');
        keys = document.createElement('div');
        values = document.createElement('div');
        key = document.createElement('div');
        key.classList.add('text-padded');
        key.innerText = 'Rows:';
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = command.environment.config.rows;
        keys.appendChild(key);
        values.appendChild(value);
        key = document.createElement('div');
        key.classList.add('text-padded');
        key.innerText = 'Columns:';
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = command.environment.config.cols;
        keys.appendChild(key);
        values.appendChild(value);
        this.element.appendChild(keys);
        this.element.appendChild(values);
      }

      return PtyInfoPane;

    })(),
    mod: Ptyw = (function() {
      function Ptyw(command, manager, config) {
        var args, env, _ref;
        this.command = command;
        this.config = config;
        _ref = this.command, command = _ref.command, args = _ref.args, env = _ref.env;
        pty = require('ptyw.js');
        this.promise = new Promise((function(_this) {
          return function(resolve, reject) {
            _this.resolve = resolve;
            _this.reject = reject;
            _this.process = pty.spawn(command, args, {
              name: 'xterm-color',
              cols: _this.config.cols,
              rows: _this.config.rows,
              cwd: _this.command.getWD(),
              env: env
            });
            if (_this.config.stdoe === 'pty-stdout') {
              _this.process.on('data', function(data) {
                if (_this.process == null) {
                  return;
                }
                if (_this.killed) {
                  return;
                }
                data = data.replace(/\r/g, '');
                return manager.stdout["in"](data);
              });
            } else {
              _this.process.on('data', function(data) {
                if (_this.process == null) {
                  return;
                }
                if (_this.killed) {
                  return;
                }
                data = data.replace(/\r/g, '');
                return manager.stderr["in"](data);
              });
            }
            _this.process.on('exit', function(exitcode, signal) {
              if (!((exitcode != null) && (signal != null))) {
                return;
              }
              if (signal !== 0) {
                exitcode = null;
                signal = 128 + signal;
              } else if (exitcode >= 128) {
                signal = exitcode;
                exitcode = null;
              } else {
                signal = null;
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
            });
            return manager.setInput(_this.process);
          };
        })(this));
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

      Ptyw.prototype.getPromise = function() {
        return this.promise;
      };

      Ptyw.prototype.isKilled = function() {
        return this.killed;
      };

      Ptyw.prototype.sigterm = function() {
        var _ref;
        return (_ref = this.process) != null ? _ref.write('\x03', 'utf8') : void 0;
      };

      Ptyw.prototype.sigkill = function() {
        var _ref;
        return (_ref = this.process) != null ? _ref.kill('SIGKILL') : void 0;
      };

      Ptyw.prototype.destroy = function() {
        this.killed = true;
        this.promise = null;
        this.process = null;
        this.reject = function(e) {
          return console.log("Received reject for finished process: " + e);
        };
        return this.resolve = function(e) {
          return console.log("Received resolve for finished process: " + e);
        };
      };

      return Ptyw;

    })()
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL2Vudmlyb25tZW50L3B0eXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNCQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLElBQU4sQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLElBQUEsRUFBTSwwQkFBTjtBQUFBLElBRUEsSUFBQSxFQUNRO0FBQ1MsTUFBQSxxQkFBQyxPQUFELEdBQUE7QUFDWCxZQUFBLHdCQUFBO0FBQUEsUUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQVgsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsUUFBdkIsQ0FEQSxDQUFBO0FBQUEsUUFFQSxJQUFBLEdBQU8sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FGUCxDQUFBO0FBQUEsUUFHQSxNQUFBLEdBQVMsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FIVCxDQUFBO0FBQUEsUUFLQSxHQUFBLEdBQU0sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FMTixDQUFBO0FBQUEsUUFNQSxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQWQsQ0FBa0IsYUFBbEIsQ0FOQSxDQUFBO0FBQUEsUUFPQSxHQUFHLENBQUMsU0FBSixHQUFnQixPQVBoQixDQUFBO0FBQUEsUUFRQSxLQUFBLEdBQVEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FSUixDQUFBO0FBQUEsUUFTQSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQWhCLENBQW9CLGFBQXBCLENBVEEsQ0FBQTtBQUFBLFFBVUEsS0FBSyxDQUFDLFNBQU4sR0FBa0IsT0FB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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/environment/ptyw.coffee
