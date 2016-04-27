(function() {
  var BufferedProcess, Emitter, GDB, RESULT, parser, _ref, _ref1;

  _ref = require('atom'), BufferedProcess = _ref.BufferedProcess, Emitter = _ref.Emitter;

  _ref1 = require('./gdb-mi-parser'), RESULT = _ref1.RESULT, parser = _ref1.parser;

  module.exports = GDB = (function() {
    var STATUS;

    STATUS = {
      NOTHING: 0,
      RUNNING: 1
    };

    function GDB(target) {
      var args, command, stderr, stdout;
      this.token = 0;
      this.handler = {};
      this.emitter = new Emitter;
      stdout = (function(_this) {
        return function(lines) {
          var clazz, line, result, token, _i, _len, _ref2, _ref3, _ref4, _results;
          _ref2 = lines.split('\n');
          _results = [];
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            line = _ref2[_i];
            switch (line[0]) {
              case '+':
                _results.push(null);
                break;
              case '=':
                _results.push(null);
                break;
              case '~':
                _results.push(null);
                break;
              case '@':
                _results.push(null);
                break;
              case '&':
                _results.push(null);
                break;
              case '*':
                _ref3 = parser.parse(line.substr(1)), clazz = _ref3.clazz, result = _ref3.result;
                _this.emitter.emit('exec-async-output', {
                  clazz: clazz,
                  result: result
                });
                if (clazz === RESULT.RUNNING) {
                  _this.emitter.emit("exec-async-running", result);
                }
                if (clazz === RESULT.STOPPED) {
                  _results.push(_this.emitter.emit("exec-async-stopped", result));
                } else {
                  _results.push(void 0);
                }
                break;
              default:
                if (line[0] <= '9' && line[0] >= '0') {
                  _ref4 = parser.parse(line), token = _ref4.token, clazz = _ref4.clazz, result = _ref4.result;
                  _this.handler[token](clazz, result);
                  _results.push(delete _this.handler[token]);
                } else {
                  _results.push(void 0);
                }
            }
          }
          return _results;
        };
      })(this);
      stderr = (function(_this) {
        return function(lines) {};
      })(this);
      command = 'gdb';
      args = ['--interpreter=mi2', target];
      console.log("target", target);
      this.process = new BufferedProcess({
        command: command,
        args: args,
        stdout: stdout,
        stderr: stderr
      }).process;
      this.stdin = this.process.stdin;
      this.status = STATUS.NOTHING;
    }

    GDB.prototype.destroy = function() {
      this.process.kill();
      return this.emitter.dispose();
    };

    GDB.prototype.onExecAsyncOutput = function(callback) {
      return this.emitter.on('exec-async-output', callback);
    };

    GDB.prototype.onExecAsyncStopped = function(callback) {
      return this.emitter.on('exec-async-stopped', callback);
    };

    GDB.prototype.onExecAsyncRunning = function(callback) {
      return this.emitter.on('exec-async-running', callback);
    };

    GDB.prototype.listFiles = function(handler) {
      return this.postCommand('file-list-exec-source-files', (function(_this) {
        return function(clazz, result) {
          var file, files, _i, _len, _ref2;
          files = [];
          if (clazz === RESULT.DONE) {
            _ref2 = result.files;
            for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
              file = _ref2[_i];
              files.push(file.fullname);
            }
          }
          return handler(files);
        };
      })(this));
    };

    GDB.prototype.listExecFile = function(handler) {
      return this.postCommand('file-list-exec-source-file', (function(_this) {
        return function(clazz, result) {
          var file;
          file = null;
          if (clazz === RESULT.DONE) {
            file = result;
          }
          return handler(file);
        };
      })(this));
    };

    GDB.prototype.setSourceDirectories = function(directories, handler) {
      var args, command, directory, _i, _len;
      args = [];
      for (_i = 0, _len = directories.length; _i < _len; _i++) {
        directory = directories[_i];
        args.push("\"" + directory + "\"");
      }
      command = 'environment-directory ' + args.join(' ');
      return this.postCommand(command, (function(_this) {
        return function(clazz, result) {
          return handler(clazz === RESULT.DONE);
        };
      })(this));
    };

    GDB.prototype.listBreaks = function(handler) {
      return this.postCommand('break-list', (function(_this) {
        return function(clazz, result) {
          var breaks;
          breaks = [];
          if (clazz === RESULT.DONE && result.BreakpointTable.body.bkpt) {
            breaks = result.BreakpointTable.body.bkpt;
          }
          return handler(breaks);
        };
      })(this));
    };

    GDB.prototype.deleteBreak = function(number, handler) {
      var command;
      command = "break-delete " + number;
      return this.postCommand(command, (function(_this) {
        return function(clazz, result) {
          return handler(clazz === RESULT.DONE);
        };
      })(this));
    };

    GDB.prototype.disassembleData = function(_arg, handler) {
      var address, args, command, file, mode;
      address = _arg.address, file = _arg.file, mode = _arg.mode;
      args = [];
      if (address) {
        args.push("-s " + address.start);
        args.push("-e " + address.end);
      } else if (file) {
        args.push("-f " + file.name);
        args.push("-l " + file.linenum);
        if (file.lines) {
          args.push("-n " + file.lines);
        }
      }
      args.push("-- " + mode);
      command = 'data-disassemble ' + args.join(' ');
      return this.postCommand(command, (function(_this) {
        return function(clazz, result) {
          var instructions;
          instructions = [];
          if (clazz === RESULT.DONE) {
            instructions = result.asm_insns.src_and_asm_line;
          }
          return handler(instructions);
        };
      })(this));
    };

    GDB.prototype.insertBreak = function(_arg, handler) {
      var args, command, condition, count, disabled, hardware, location, temporary, thread, tracepoint;
      location = _arg.location, condition = _arg.condition, count = _arg.count, thread = _arg.thread, temporary = _arg.temporary, hardware = _arg.hardware, disabled = _arg.disabled, tracepoint = _arg.tracepoint;
      args = [];
      if (temporary === true) {
        args.push('-t');
      }
      if (hardware === true) {
        args.push('-h');
      }
      if (disabled === true) {
        args.push('-d');
      }
      if (tracepoint === true) {
        args.push('-a');
      }
      if (condition) {
        args.push("-c " + condition);
      }
      if (count) {
        args.push("-i " + count);
      }
      if (thread) {
        args.push("-p " + thread);
      }
      args.push(location);
      command = 'break-insert ' + args.join(' ');
      return this.postCommand(command, (function(_this) {
        return function(clazz, result) {
          var abreak;
          abreak = null;
          if (clazz === RESULT.DONE) {
            abreak = result.bkpt;
          }
          return handler(abreak);
        };
      })(this));
    };

    GDB.prototype.run = function(handler) {
      var command;
      command = 'exec-run';
      return this.postCommand(command, (function(_this) {
        return function(clazz, result) {
          return handler(clazz === RESULT.RUNNING);
        };
      })(this));
    };

    GDB.prototype["continue"] = function(handler) {
      var command;
      command = 'exec-continue';
      return this.postCommand(command, (function(_this) {
        return function(clazz, result) {
          return handler(clazz === RESULT.RUNNING);
        };
      })(this));
    };

    GDB.prototype.interrupt = function(handler) {
      var command;
      command = 'exec-interrupt';
      return this.postCommand(command, (function(_this) {
        return function(clazz, result) {
          return handler(clazz === RESULT.DONE);
        };
      })(this));
    };

    GDB.prototype.next = function(handler) {
      var command;
      command = 'exec-next';
      return this.postCommand(command, (function(_this) {
        return function(clazz, result) {
          return handler(clazz === RESULT.RUNNING);
        };
      })(this));
    };

    GDB.prototype.step = function(handler) {
      var command;
      command = 'exec-step';
      return this.postCommand(command, (function(_this) {
        return function(clazz, result) {
          return handler(clazz === RESULT.RUNNING);
        };
      })(this));
    };

    GDB.prototype.set = function(key, value, handler) {
      var command;
      command = "gdb-set " + key + " " + value;
      return this.postCommand(command, (function(_this) {
        return function(clazz, result) {
          return handler(clazz === RESULT.DONE);
        };
      })(this));
    };

    GDB.prototype.postCommand = function(command, handler) {
      this.handler[this.token] = handler;
      this.stdin.write("" + this.token + "-" + command + "\n");
      return this.token = this.token + 1;
    };

    return GDB;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1kZWJ1Z2dlci9saWIvYmFja2VuZC9nZGIvZ2RiLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwREFBQTs7QUFBQSxFQUFBLE9BQTZCLE9BQUEsQ0FBUSxNQUFSLENBQTdCLEVBQUMsdUJBQUEsZUFBRCxFQUFrQixlQUFBLE9BQWxCLENBQUE7O0FBQUEsRUFDQSxRQUFtQixPQUFBLENBQVEsaUJBQVIsQ0FBbkIsRUFBQyxlQUFBLE1BQUQsRUFBUyxlQUFBLE1BRFQsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFFSixRQUFBLE1BQUE7O0FBQUEsSUFBQSxNQUFBLEdBQ0U7QUFBQSxNQUFBLE9BQUEsRUFBUyxDQUFUO0FBQUEsTUFDQSxPQUFBLEVBQVMsQ0FEVDtLQURGLENBQUE7O0FBSWEsSUFBQSxhQUFDLE1BQUQsR0FBQTtBQUNYLFVBQUEsNkJBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsQ0FBVCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXLEVBRFgsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FGWCxDQUFBO0FBQUEsTUFJQSxNQUFBLEdBQVMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxHQUFBO0FBQ1AsY0FBQSxtRUFBQTtBQUFBO0FBQUE7ZUFBQSw0Q0FBQTs2QkFBQTtBQUNFLG9CQUFPLElBQUssQ0FBQSxDQUFBLENBQVo7QUFBQSxtQkFDTyxHQURQO0FBQ2dCLDhCQUFBLEtBQUEsQ0FEaEI7QUFDTztBQURQLG1CQUVPLEdBRlA7QUFFZ0IsOEJBQUEsS0FBQSxDQUZoQjtBQUVPO0FBRlAsbUJBR08sR0FIUDtBQUdnQiw4QkFBQSxLQUFB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

//# sourceURL=/home/champ/.atom/packages/atom-debugger/lib/backend/gdb/gdb.coffee
