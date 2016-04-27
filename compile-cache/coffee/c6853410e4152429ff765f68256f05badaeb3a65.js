(function() {
  var $, $$, AnsiParser, CompositeDisposable, Console, ConsoleInfoPane, ConsolePane, View, buildHTML, consolemodel, consolepanel, consoleview, timeout, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, View = _ref.View;

  Console = null;

  consolemodel = null;

  consoleview = null;

  consolepanel = null;

  timeout = null;

  CompositeDisposable = null;

  AnsiParser = null;

  buildHTML = function(message, status, filenames) {
    return $$(function() {
      if (status == null) {
        status = '';
      }
      if (status === 'note') {
        status = 'info';
      }
      return this.div({
        "class": "text-" + status
      }, (function(_this) {
        return function() {
          var col, end, file, prev, row, start, _i, _len, _ref1;
          if ((filenames != null) && filenames.length !== 0) {
            prev = -1;
            for (_i = 0, _len = filenames.length; _i < _len; _i++) {
              _ref1 = filenames[_i], file = _ref1.file, row = _ref1.row, col = _ref1.col, start = _ref1.start, end = _ref1.end;
              _this.span(message.substr(prev + 1, start - (prev + 1)));
              _this.span({
                "class": "filelink highlight-" + status,
                name: file,
                row: row,
                col: col
              }, message.substr(start, end - start + 1));
              prev = end;
            }
            if (prev !== message.length - 1) {
              return _this.span(message.substr(prev + 1));
            }
          } else {
            return _this.span(message === '' ? ' ' : message);
          }
        };
      })(this));
    });
  };

  module.exports = {
    activate: function() {
      var ConsoleView;
      Console = require('../console/console');
      ConsoleView = require('../console/console-element');
      consolemodel = new Console;
      consoleview = new ConsoleView(consolemodel);
      consolepanel = atom.workspace.addBottomPanel({
        item: consoleview,
        visible: false
      });
      consoleview.show = function() {
        return consolepanel.show();
      };
      consoleview.hide = function() {
        return consolepanel.hide();
      };
      CompositeDisposable = require('atom').CompositeDisposable;
      AnsiParser = require('./ansi-parser');
      this.disposables = new CompositeDisposable;
      this.disposables.add(atom.commands.add('atom-workspace', {
        'build-tools:toggle': function() {
          if (consolepanel.isVisible()) {
            return consolepanel.hide();
          } else {
            return consolepanel.show();
          }
        }
      }));
      return this.disposables.add(atom.keymaps.add('build-tools:console', {
        'atom-workspace': {
          'ctrl-l ctrl-s': 'build-tools:toggle'
        }
      }));
    },
    deactivate: function() {
      var ConsoleView;
      consolepanel.destroy();
      consolemodel.destroy();
      this.disposables.dispose();
      this.disposables = null;
      consolepanel = null;
      consoleview = null;
      consolemodel = null;
      ConsoleView = null;
      return Console = null;
    },
    provideConsole: function() {
      return consolemodel;
    },
    name: 'Console',
    description: 'Display command output in console pane',
    "private": false,
    edit: ConsolePane = (function(_super) {
      __extends(ConsolePane, _super);

      function ConsolePane() {
        return ConsolePane.__super__.constructor.apply(this, arguments);
      }

      ConsolePane.content = function() {
        return this.div({
          "class": 'panel-body padded'
        }, (function(_this) {
          return function() {
            _this.div({
              "class": 'block checkbox'
            }, function() {
              _this.input({
                id: 'close_success',
                type: 'checkbox'
              });
              return _this.label(function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Close on success');
                return _this.div(function() {
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'Close console on success. Uses config value in package settings if enabled');
                });
              });
            });
            _this.div({
              "class": 'block checkbox'
            }, function() {
              _this.input({
                id: 'all_in_one',
                type: 'checkbox'
              });
              return _this.label(function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Execute Queue in one tab');
                return _this.div(function() {
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'Print output of all commands of the queue in one tab');
                });
              });
            });
            _this.div({
              "class": 'block checkbox'
            }, function() {
              _this.input({
                id: 'colors',
                type: 'checkbox'
              });
              return _this.label(function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Use ANSI Color Codes');
                return _this.div(function() {
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'Highlight console output using ANSI Color Codes');
                });
              });
            });
            return _this.div({
              "class": 'block checkbox'
            }, function() {
              _this.input({
                id: 'stdin',
                type: 'checkbox'
              });
              return _this.label(function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Allow user input');
                return _this.div(function() {
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'Allow user to interact with the spawned process');
                });
              });
            });
          };
        })(this));
      };

      ConsolePane.prototype.set = function(command) {
        var _ref1, _ref2, _ref3, _ref4;
        if ((command != null ? (_ref1 = command.output) != null ? _ref1.console : void 0 : void 0) != null) {
          this.find('#close_success').prop('checked', command.output.console.close_success);
          this.find('#all_in_one').prop('checked', (_ref2 = command.output.console.queue_in_buffer) != null ? _ref2 : true);
          this.find('#colors').prop('checked', (_ref3 = command.output.console.colors) != null ? _ref3 : false);
          return this.find('#stdin').prop('checked', (_ref4 = command.output.console.stdin) != null ? _ref4 : false);
        } else {
          this.find('#close_success').prop('checked', atom.config.get('build-tools.CloseOnSuccess') === -1 ? false : true);
          this.find('#all_in_one').prop('checked', true);
          this.find('#colors').prop('checked', false);
          return this.find('#stdin').prop('checked', false);
        }
      };

      ConsolePane.prototype.get = function(command) {
        var _base;
        if ((_base = command.output).console == null) {
          _base.console = {};
        }
        command.output.console.close_success = this.find('#close_success').prop('checked');
        command.output.console.queue_in_buffer = this.find('#all_in_one').prop('checked');
        command.output.console.colors = this.find('#colors').prop('checked');
        command.output.console.stdin = this.find('#stdin').prop('checked');
        return null;
      };

      return ConsolePane;

    })(View),
    info: ConsoleInfoPane = (function() {
      function ConsoleInfoPane(command) {
        var keys, value, values;
        this.element = document.createElement('div');
        this.element.classList.add('module');
        keys = document.createElement('div');
        keys.innerHTML = '<div class="text-padded">Close on success:</div>\n<div class="text-padded">Execute queue in one tab:</div>\n<div class="text-padded">ANSI Colors:</div>\n<div class="text-padded">User Input:</div>';
        values = document.createElement('div');
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = String(command.output.console.close_success);
        values.appendChild(value);
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = String(command.output.console.queue_in_buffer);
        values.appendChild(value);
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = String(command.output.console.colors);
        values.appendChild(value);
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = String(command.output.console.stdin);
        values.appendChild(value);
        this.element.appendChild(keys);
        this.element.appendChild(values);
      }

      return ConsoleInfoPane;

    })(),
    output: Console = (function() {
      function Console() {}

      Console.prototype.newQueue = function(queue) {
        var _ref1;
        this.queue_in_buffer = (_ref1 = queue.queue[queue.queue.length - 1].output.console) != null ? _ref1.queue_in_buffer : void 0;
        if (this.queue_in_buffer) {
          this.tab = consolemodel.getTab(queue.queue[queue.queue.length - 1]);
          this.tab.clear();
          return clearTimeout(timeout);
        }
      };

      Console.prototype.newCommand = function(command) {
        this.command = command;
        if (!this.queue_in_buffer) {
          this.tab = consolemodel.getTab(this.command);
          this.tab.clear();
          clearTimeout(timeout);
        }
        this.tab.setRunning();
        this.tab.focus();
        this.stdout_lines = [];
        return this.stderr_lines = [];
      };

      Console.prototype.setInput = function(input) {
        if (this.command.output.console.stdin) {
          this.tab.setInput(input.write);
          consoleview.input_container.removeClass('hidden');
          return consoleview.input.focus();
        } else {
          return consoleview.input_container.addClass('hidden');
        }
      };

      Console.prototype.stdout_new = function() {
        var last;
        if (this.command.output.console.colors && ((last = this.stdout_lines[this.stdout_lines.length - 1]) != null)) {
          if (last.innerText === '') {
            last.innerText = ' ';
            AnsiParser.copyAttributes(this.stdout_lines, this.stdout_lines.length - 1);
          }
        }
        return this.stdout_lines.push(this.tab.newLine());
      };

      Console.prototype.stdout_raw = function(input) {
        if (this.command.output.console.colors) {
          AnsiParser.parseAnsi(input, this.stdout_lines, this.stdout_lines.length - 1);
        } else {
          this.stdout_lines[this.stdout_lines.length - 1].innerText += input;
        }
        return this.tab.scroll();
      };

      Console.prototype.stdout_in = function(_arg) {
        var input;
        input = _arg.input;
        if (input === '') {
          return this.stdout_lines[this.stdout_lines.length - 1].innerText = ' ';
        }
      };

      Console.prototype.stdout_setType = function(status) {
        var last;
        last = this.stdout_lines[this.stdout_lines.length - 1];
        if (last == null) {
          return;
        }
        if (status == null) {
          status = '';
        }
        if (status === 'note') {
          status = 'info';
        }
        return $(last).prop('class', "bold text-" + status);
      };

      Console.prototype.stdout_print = function(_arg) {
        var element, files, input, _new, _ref1;
        input = _arg.input, files = _arg.files;
        if (this.stdout_lines[this.stdout_lines.length - 1] == null) {
          return;
        }
        _new = buildHTML(input.input, (_ref1 = input.highlighting) != null ? _ref1 : input.type, files);
        element = $(this.stdout_lines[this.stdout_lines.length - 1]);
        element.prop('class', _new.prop('class'));
        return element.html(_new.html());
      };

      Console.prototype.stdout_replacePrevious = function(lines) {
        var element, files, index, input, _i, _len, _new, _ref1, _ref2, _results;
        if (this.stdout_lines[this.stdout_lines.length - lines.length - 1] == null) {
          return;
        }
        _results = [];
        for (index = _i = 0, _len = lines.length; _i < _len; index = ++_i) {
          _ref1 = lines[index], input = _ref1.input, files = _ref1.files;
          _new = buildHTML(input.input, (_ref2 = input.highlighting) != null ? _ref2 : input.type, files);
          element = $(this.stdout_lines[this.stdout_lines.length - lines.length + index - 1]);
          element.prop('class', _new.prop('class'));
          _results.push(element.html(_new.html()));
        }
        return _results;
      };

      Console.prototype.stderr_new = function() {
        var last;
        if (this.command.output.console.colors && ((last = this.stderr_lines[this.stderr_lines.length - 1]) != null)) {
          if (last.innerText === '') {
            last.innerText = ' ';
            AnsiParser.copyAttributes(this.stderr_lines, this.stderr_lines.length - 1);
          }
        }
        return this.stderr_lines.push(this.tab.newLine());
      };

      Console.prototype.stderr_raw = function(input) {
        if (this.command.output.console.colors) {
          AnsiParser.parseAnsi(input, this.stderr_lines, this.stderr_lines.length - 1);
        } else {
          this.stderr_lines[this.stderr_lines.length - 1].innerText += input;
        }
        return this.tab.scroll();
      };

      Console.prototype.stderr_in = function(_arg) {
        var input;
        input = _arg.input;
        if (input === '') {
          return this.stderr_lines[this.stderr_lines.length - 1].innerText = ' ';
        }
      };

      Console.prototype.stderr_setType = function(status) {
        var last;
        last = this.stderr_lines[this.stderr_lines.length - 1];
        if (last == null) {
          return;
        }
        if (status == null) {
          status = '';
        }
        if (status === 'note') {
          status = 'info';
        }
        return $(last).prop('class', "bold text-" + status);
      };

      Console.prototype.stderr_print = function(_arg) {
        var element, files, input, _new, _ref1;
        input = _arg.input, files = _arg.files;
        if (this.stderr_lines[this.stderr_lines.length - 1] == null) {
          return;
        }
        _new = buildHTML(input.input, (_ref1 = input.highlighting) != null ? _ref1 : input.type, files);
        element = $(this.stderr_lines[this.stderr_lines.length - 1]);
        element.prop('class', _new.prop('class'));
        return element.html(_new.html());
      };

      Console.prototype.stderr_replacePrevious = function(lines) {
        var element, files, index, input, _i, _len, _new, _ref1, _ref2, _results;
        if (this.stderr_lines[this.stderr_lines.length - lines.length - 1] == null) {
          return;
        }
        _results = [];
        for (index = _i = 0, _len = lines.length; _i < _len; index = ++_i) {
          _ref1 = lines[index], input = _ref1.input, files = _ref1.files;
          _new = buildHTML(input.input, (_ref2 = input.highlighting) != null ? _ref2 : input.type, files);
          element = $(this.stderr_lines[this.stderr_lines.length - lines.length + index - 1]);
          element.prop('class', _new.prop('class'));
          _results.push(element.html(_new.html()));
        }
        return _results;
      };

      Console.prototype.error = function(message) {
        this.tab.setError(message);
        return this.tab.finishConsole();
      };

      Console.prototype.exitCommand = function(status) {
        this.tab.setFinished(status);
        if (this.queue_in_buffer) {
          return;
        }
        return this.finish(status);
      };

      Console.prototype.exitQueue = function(code) {
        if (code === -2) {
          this.tab.setCancelled();
          this.tab.finishConsole();
          if (this.tab.hasFocus()) {
            consoleview.hideInput();
          }
          return;
        }
        if (!this.queue_in_buffer) {
          return;
        }
        return this.finish(code);
      };

      Console.prototype.finish = function(status) {
        var t;
        this.tab.finishConsole();
        if (this.tab.hasFocus()) {
          consoleview.hideInput();
        }
        if (this.command.output['console'].close_success && status === 0) {
          t = atom.config.get('build-tools.CloseOnSuccess');
          if (t < 1) {
            consolepanel.hide();
            this.tab = null;
            return this.command = null;
          } else {
            clearTimeout(timeout);
            return timeout = setTimeout((function(_this) {
              return function() {
                if (_this.tab.hasFocus()) {
                  consolepanel.hide();
                }
                timeout = null;
                _this.tab = null;
                return _this.command = null;
              };
            })(this), t * 1000);
          }
        }
      };

      return Console;

    })()
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL291dHB1dC9jb25zb2xlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzSkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBZ0IsT0FBQSxDQUFRLHNCQUFSLENBQWhCLEVBQUMsU0FBQSxDQUFELEVBQUksVUFBQSxFQUFKLEVBQVEsWUFBQSxJQUFSLENBQUE7O0FBQUEsRUFFQSxPQUFBLEdBQVUsSUFGVixDQUFBOztBQUFBLEVBR0EsWUFBQSxHQUFlLElBSGYsQ0FBQTs7QUFBQSxFQUlBLFdBQUEsR0FBYyxJQUpkLENBQUE7O0FBQUEsRUFLQSxZQUFBLEdBQWUsSUFMZixDQUFBOztBQUFBLEVBT0EsT0FBQSxHQUFVLElBUFYsQ0FBQTs7QUFBQSxFQVNBLG1CQUFBLEdBQXNCLElBVHRCLENBQUE7O0FBQUEsRUFXQSxVQUFBLEdBQWEsSUFYYixDQUFBOztBQUFBLEVBYUEsU0FBQSxHQUFZLFNBQUMsT0FBRCxFQUFVLE1BQVYsRUFBa0IsU0FBbEIsR0FBQTtXQUNWLEVBQUEsQ0FBRyxTQUFBLEdBQUE7QUFDRCxNQUFBLElBQW1CLGNBQW5CO0FBQUEsUUFBQSxNQUFBLEdBQVMsRUFBVCxDQUFBO09BQUE7QUFDQSxNQUFBLElBQW1CLE1BQUEsS0FBVSxNQUE3QjtBQUFBLFFBQUEsTUFBQSxHQUFTLE1BQVQsQ0FBQTtPQURBO2FBRUEsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFRLE9BQUEsR0FBTyxNQUFmO09BQUwsRUFBOEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUM1QixjQUFBLGlEQUFBO0FBQUEsVUFBQSxJQUFHLG1CQUFBLElBQWUsU0FBUyxDQUFDLE1BQVYsS0FBc0IsQ0FBeEM7QUFDRSxZQUFBLElBQUEsR0FBTyxDQUFBLENBQVAsQ0FBQTtBQUNBLGlCQUFBLGdEQUFBLEdBQUE7QUFDRSxxQ0FERyxhQUFBLE1BQU0sWUFBQSxLQUFLLFlBQUEsS0FBSyxjQUFBLE9BQU8sWUFBQSxHQUMxQixDQUFBO0FBQUEsY0FBQSxLQUFDLENBQUEsSUFBRCxDQUFNLE9BQU8sQ0FBQyxNQUFSLENBQWUsSUFBQSxHQUFPLENBQXRCLEVBQXlCLEtBQUEsR0FBUSxDQUFDLElBQUEsR0FBTyxDQUFSLENBQWpDLENBQU4sQ0FBQSxDQUFBO0FBQUEsY0FDQSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsZ0JBQUEsT0FBQSxFQUFRLHFCQUFBLEdBQXFCLE1BQTdCO0FBQUEsZ0JBQXVDLElBQUEsRUFBTSxJQUE3QztBQUFBLGdCQUFtRCxHQUFBLEVBQUssR0FBeEQ7QUFBQSxnQkFBNkQsR0FBQSxFQUFLLEdBQWxFO2VBQU4sRUFBNkUsT0FBTyxDQUFDLE1BQVIsQ0FBZSxLQUFmLEVBQXNCLEdBQUEsR0FBTSxLQUFOLEdBQWMsQ0FBcEMsQ0FBN0UsQ0FEQSxDQUFBO0FBQUEsY0FFQSxJQUFBLEdBQU8sR0FGUCxDQURGO0FBQUEsYUFEQTtBQUtBLFlBQUEsSUFBa0MsSUFBQSxLQUFVLE9BQU8sQ0FBQyxNQUFSLEdBQWlCLENBQTdEO3FCQUFBLEtBQUMsQ0FBQSxJQUFELENBQU0sT0FBTyxDQUFDLE1BQVIsQ0FBZSxJQUFBLEdBQU8sQ0FBdEIsQ0FBTixFQUFBO2FBTkY7V0FBQSxNQUFBO21CQVFFLEtBQUMsQ0FBQSxJQUFELENBQVMsT0FBQSxLQUFXLEVBQWQsR0FBc0IsR0FBdEIsR0FBK0IsT0FBckMsRUFSRjtXQUQ0QjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTlCLEVBSEM7SUFBQSxDQUFILEVBRFU7RUFBQSxDQWJaLENBQUE7O0FBQUEsRUE0QkEsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEsV0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxvQkFBUixDQUFWLENBQUE7QUFBQSxNQUNBLFdBQUEsR0FBYyxPQUFBLENBQVEsNEJBQVIsQ0FEZCxDQUFBO0FBQUEsTUFFQSxZQUFBLEdBQWUsR0FBQSxDQUFBLE9BRmYsQ0FBQTtBQUFBLE1BR0EsV0FBQSxHQUFrQixJQUFBLFdBQUEsQ0FBWSxZQUFaLENBSGxCLENBQUE7QUFBQSxNQUlBLFlBQUEsR0FBZSxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWYsQ0FBOEI7QUFBQSxRQUFBLElBQUEsRUFBTSxXQUFOO0FBQUEsUUFBbUIsT0FBQSxFQUFTLEtBQTVCO09BQTlCLENBSmYsQ0FBQTtBQUFBLE1BS0EsV0FBVyxDQUFDLElBQVosR0FBbUIsU0FBQSxHQUFBO2VBQUcsWUFBWSxDQUFDLElBQWIsQ0FBQSxFQUFIO01BQUEsQ0FMbkIsQ0FBQTtBQUFBLE1BTUEsV0FBVyxDQUFDLElBQVosR0FBbUIsU0FBQSxHQUFBO2VBQUcsWUFBWSxDQUFDLElBQWIsQ0FBQSxFQUFIO01BQUEsQ0FObkIsQ0FBQTtBQUFBLE1BUUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQVJELENBQUE7QUFBQSxNQVNBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQVRiLENBQUE7QUFBQSxNQVVBLElBQUMsQ0FBQSxXQUFELEdBQWUsR0FBQSxDQUFBLG1CQVZmLENBQUE7QUFBQSxNQVdBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ2Y7QUFBQSxRQUFBLG9CQUFBLEVBQXNCLFNBQUEsR0FBQTtBQUNwQixVQUFBLElBQUcsWUFBWSxDQUFDLFNBQWIsQ0FBQSxDQUFIO21CQUNFLFlBQVksQ0FBQyxJQUFiLENBQUEsRUFERjtXQUFBLE1BQUE7bUJBR0UsWUFBWSxDQUFDLElBQWIsQ0FBQSxFQUhGO1dBRG9CO1FBQUEsQ0FBdEI7T0FEZSxDQUFqQixDQVhBLENBQUE7YUFpQkEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBYixDQUFpQixxQkFBakIsRUFBd0M7QUFBQSxRQUFBLGdCQUFBLEVBQWtCO0FBQUEsVUFBQSxlQUFBLEVBQWlCLG9CQUFqQjtTQUFsQjtPQUF4QyxDQUFqQixFQWxCUTtJQUFBLENBQVY7QUFBQSxJQW9CQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSxXQUFBO0FBQUEsTUFBQSxZQUFZLENBQUMsT0FBYixDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsWUFBWSxDQUFDLE9BQWIsQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBLENBRkEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUhmLENBQUE7QUFBQSxNQUlBLFlBQUEsR0FBZSxJQUpmLENBQUE7QUFBQSxNQUtBLFdBQUEsR0FBYyxJQUxkLENBQUE7QUFBQSxNQU1BLFlBQUEsR0FBZSxJQU5mLENBQUE7QUFBQSxNQU9BLFdBQUEsR0FBYyxJQVBkLENBQUE7YUFRQSxPQUFBLEdBQVUsS0FUQTtJQUFBLENBcEJaO0FBQUEsSUErQkEsY0FBQSxFQUFnQixTQUFBLEdBQUE7YUFDZCxhQURjO0lBQUEsQ0EvQmhCO0FBQUEsSUFrQ0EsSUFBQSxFQUFNLFNBbENOO0FBQUEsSUFtQ0EsV0FBQSxFQUFhLHdDQW5DYjtBQUFBLElBb0NBLFNBQUEsRUFBUyxLQXBDVDtBQUFBLElBc0NBLElBQUEsRUFDUTtBQUVKLG9DQUFBLENBQUE7Ozs7T0FBQTs7QUFBQSxNQUFBLFdBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2VBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFVBQUEsT0FBQSxFQUFPLG1CQUFQO1NBQUwsRUFBaUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFDL0IsWUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sZ0JBQVA7YUFBTCxFQUE4QixTQUFBLEdBQUE7QUFDNUIsY0FBQSxLQUFDLENBQUEsS0FBRCxDQUFPO0FBQUEsZ0JBQUEsRUFBQSxFQUFJLGVBQUo7QUFBQSxnQkFBcUIsSUFBQSxFQUFNLFVBQTNCO2VBQVAsQ0FBQSxDQUFBO3FCQUNBLEtBQUMsQ0FBQSxLQUFELENBQU8sU0FBQSxHQUFBO0FBQ0wsZ0JBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGtCQUFBLE9BQUEsRUFBTyxlQUFQO2lCQUFMLEVBQTZCLGtCQUE3QixDQUFBLENBQUE7dUJBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSyxTQUFBLEdBQUE7eUJBQ0gsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLG9CQUFBLE9BQUEsRUFBTywwQkFBUDttQkFBTixFQUF5Qyw0RUFBekMsRUFERztnQkFBQSxDQUFMLEVBRks7Y0FBQSxDQUFQLEVBRjRCO1lBQUEsQ0FBOUIsQ0FBQSxDQUFBO0FBQUEsWUFNQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sZ0JBQVA7YUFBTCxFQUE4QixTQUFBLEdBQUE7QUFDNUIsY0FBQSxLQUFDLENBQUEsS0FBRCxDQUFPO0FBQUEsZ0JBQUEsRUFBQSxFQUFJLFlBQUo7QUFBQSxnQkFBa0IsSUFBQSxFQUFNLFVBQXhCO2VBQVAsQ0FBQSxDQUFBO3FCQUNBLEtBQUMsQ0FBQSxLQUFELENBQU8sU0FBQSxHQUFBO0FBQ0wsZ0JBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGtCQUFBLE9BQUEsRUFBTyxlQUFQO2lCQUFMLEVBQTZCLDBCQUE3QixDQUFBLENBQUE7dUJBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSyxTQUFBLEdBQUE7eUJBQ0gsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLG9CQUFBLE9BQUEsRUFBTywwQkFBUDttQkFBTixFQUF5QyxzREFBekMsRUFERztnQkFBQSxDQUFMLEVBRks7Y0FBQSxDQUFQLEVBRjRCO1lBQUEsQ0FBOUIsQ0FOQSxDQUFBO0FBQUEsWUFZQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sZ0JBQVA7YUFBTCxFQUE4QixTQUFBLEdBQUE7QUFDNUIsY0FBQSxLQUFDLENBQUEsS0FBRCxDQUFPO0FBQUEsZ0JBQUEsRUFBQSxFQUFJLFFBQUo7QUFBQSxnQkFBYyxJQUFBLEVBQU0sVUFBcEI7ZUFBUCxDQUFBLENBQUE7cUJBQ0EsS0FBQyxDQUFBLEtBQUQsQ0FBTyxTQUFBLEdBQUE7QUFDTCxnQkFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsa0JBQUEsT0FBQSxFQUFPLGVBQVA7aUJBQUwsRUFBNkIsc0JBQTdCLENBQUEsQ0FBQTt1QkFDQSxLQUFDLENBQUEsR0FBRCxDQUFLLFNBQUEsR0FBQTt5QkFDSCxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsb0JBQUEsT0FBQSxFQUFPLDBCQUFQO21CQUFOLEVBQXlDLGlEQUF6QyxFQURHO2dCQUFBLENBQUwsRUFGSztjQUFBLENBQVAsRUFGNEI7WUFBQSxDQUE5QixDQVpBLENBQUE7bUJBa0JBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxnQkFBUDthQUFMLEVBQThCLFNBQUEsR0FBQTtBQUM1QixjQUFBLEtBQUMsQ0FBQSxLQUFELENBQU87QUFBQSxnQkFBQSxFQUFBLEVBQUksT0FBSjtBQUFBLGdCQUFhLElBQUEsRUFBTSxVQUFuQjtlQUFQLENBQUEsQ0FBQTtxQkFDQSxLQUFDLENBQUEsS0FBRCxDQUFPLFNBQUEsR0FBQTtBQUNMLGdCQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxrQkFBQSxPQUFBLEVBQU8sZUFBUDtpQkFBTCxFQUE2QixrQkFBN0IsQ0FBQSxDQUFBO3VCQUNBLEtBQUMsQ0FBQSxHQUFELENBQUssU0FBQSxHQUFBO3lCQUNILEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxvQkFBQSxPQUFBLEVBQU8sMEJBQVA7bUJBQU4sRUFBeUMsaURBQXpDLEVBREc7Z0JBQUEsQ0FBTCxFQUZLO2NBQUEsQ0FBUCxFQUY0QjtZQUFBLENBQTlCLEVBbkIrQjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpDLEVBRFE7TUFBQSxDQUFWLENBQUE7O0FBQUEsNEJBMkJBLEdBQUEsR0FBSyxTQUFDLE9BQUQsR0FBQTtBQUNILFlBQUEsMEJBQUE7QUFBQSxRQUFBLElBQUcsOEZBQUg7QUFDRSxVQUFBLElBQUMsQ0FBQSxJQUFELENBQU0sZ0JBQU4sQ0FBdUIsQ0FBQyxJQUF4QixDQUE2QixTQUE3QixFQUF3QyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUEvRCxDQUFBLENBQUE7QUFBQSxVQUNBLElBQUMsQ0FBQSxJQUFELENBQU0sYUFBTixDQUFvQixDQUFDLElBQXJCLENBQTBCLFNBQTFCLHFFQUE4RSxJQUE5RSxDQURBLENBQUE7QUFBQSxVQUVBLElBQUMsQ0FBQSxJQUFELENBQU0sU0FBTixDQUFnQixDQUFDLElBQWpCLENBQXNCLFNBQXRCLDREQUFpRSxLQUFqRSxDQUZBLENBQUE7aUJBR0EsSUFBQyxDQUFBLElBQUQsQ0FBTSxRQUFOLENBQWUsQ0FBQyxJQUFoQixDQUFxQixTQUFyQiwyREFBK0QsS0FBL0QsRUFKRjtTQUFBLE1BQUE7QUFNRSxVQUFBLElBQUMsQ0FBQSxJQUFELENBQU0sZ0JBQU4sQ0FBdUIsQ0FBQyxJQUF4QixDQUE2QixTQUE3QixFQUEyQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCLENBQUEsS0FBaUQsQ0FBQSxDQUFwRCxHQUE0RCxLQUE1RCxHQUF1RSxJQUEvRyxDQUFBLENBQUE7QUFBQSxVQUNBLElBQUMsQ0FBQSxJQUFELENBQU0sYUFBTixDQUFvQixDQUFDLElBQXJCLENBQTBCLFNBQTFCLEVBQXFDLElBQXJDLENBREEsQ0FBQTtBQUFBLFVBRUEsSUFBQyxDQUFBLElBQUQsQ0FBTSxTQUFOLENBQWdCLENBQUMsSUFBakIsQ0FBc0IsU0FBdEIsRUFBaUMsS0FBakMsQ0FGQSxDQUFBO2lCQUdBLElBQUMsQ0FBQSxJQUFELENBQU0sUUFBTixDQUFlLENBQUMsSUFBaEIsQ0FBcUIsU0FBckIsRUFBZ0MsS0FBaEMsRUFURjtTQURHO01BQUEsQ0EzQkwsQ0FBQTs7QUFBQSw0QkF1Q0EsR0FBQSxHQUFLLFNBQUMsT0FBRCxHQUFBO0FBQ0gsWUFBQSxLQUFBOztlQUFjLENBQUMsVUFBVztTQUExQjtBQUFBLFFBQ0EsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBdkIsR0FBdUMsSUFBQyxDQUFBLElBQUQsQ0FBTSxnQkFBTixDQUF1QixDQUFDLElBQXhCLENBQTZCLFNBQTdCLENBRHZDLENBQUE7QUFBQSxRQUVBLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGVBQXZCLEdBQXlDLElBQUMsQ0FBQSxJQUFELENBQU0sYUFBTixDQUFvQixDQUFDLElBQXJCLENBQTBCLFNBQTFCLENBRnpDLENBQUE7QUFBQSxRQUdBLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQXZCLEdBQWdDLElBQUMsQ0FBQSxJQUFELENBQU0sU0FBTixDQUFnQixDQUFDLElBQWpCLENBQXNCLFNBQXRCLENBSGhDLENBQUE7QUFBQSxRQUlBLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQXZCLEdBQStCLElBQUMsQ0FBQSxJQUFELENBQU0sUUFBTixDQUFlLENBQUMsSUFBaEIsQ0FBcUIsU0FBckIsQ0FKL0IsQ0FBQTtBQUtBLGVBQU8sSUFBUCxDQU5HO01BQUEsQ0F2Q0wsQ0FBQTs7eUJBQUE7O09BRndCLEtBdkM1QjtBQUFBLElBd0ZBLElBQUEsRUFDUTtBQUVTLE1BQUEseUJBQUMsT0FBRCxHQUFBO0FBQ1gsWUFBQSxtQkFBQTtBQUFBLFFBQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUFYLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLFFBQXZCLENBREEsQ0FBQTtBQUFBLFFBRUEsSUFBQSxHQUFPLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBRlAsQ0FBQTtBQUFBLFFBR0EsSUFBSSxDQUFDLFNBQUwsR0FBaUIscU1BSGpCLENBQUE7QUFBQSxRQVNBLE1BQUEsR0FBUyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQVRULENBQUE7QUFBQSxRQVVBLEtBQUEsR0FBUSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQVZSLENBQUE7QUFBQSxRQVdBLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBaEIsQ0FBb0IsYUFBcEIsQ0FYQSxDQUFBO0FBQUEsUUFZQSxLQUFLLENBQUMsU0FBTixHQUFrQixNQUFBLENBQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBOUIsQ0FabEIsQ0FBQTtBQUFBLFFBYUEsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsS0FBbkIsQ0FiQSxDQUFBO0FBQUEsUUFjQSxLQUFBLEdBQVEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FkUixDQUFBO0FBQUEsUUFlQSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQWhCLENBQW9CLGFBQXBCLENBZkEsQ0FBQTtBQUFBLFFBZ0JBLEtBQUssQ0FBQyxTQUFOLEdBQWtCLE1BQUEsQ0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxlQUE5QixDQWhCbEIsQ0FBQTtBQUFBLFFBaUJBLE1BQU0sQ0FBQyxXQUFQLENBQW1CLEtBQW5CLENBakJBLENBQUE7QUFBQSxRQWtCQSxLQUFBLEdBQVEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FsQlIsQ0FBQTtBQUFBLFFBbUJBLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBaEIsQ0FBb0IsYUFBcEIsQ0FuQkEsQ0FBQTtBQUFBLFFBb0JBLEtBQUssQ0FBQyxTQUFOLEdBQWtCLE1BQUEsQ0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUE5QixDQXBCbEIsQ0FBQTtBQUFBLFFBcUJBLE1BQU0sQ0FBQyxXQUFQLENBQW1CLEtBQW5CLENBckJBLENBQUE7QUFBQSxRQXNCQSxLQUFBLEdBQVEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0F0QlIsQ0FBQTtBQUFBLFFBdUJBLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBaEIsQ0FBb0IsYUFBcEIsQ0F2QkEsQ0FBQTtBQUFBLFFBd0JBLEtBQUssQ0FBQyxTQUFOLEdBQWtCLE1BQUEsQ0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUE5QixDQXhCbEIsQ0FBQTtBQUFBLFFBeUJBLE1BQU0sQ0FBQyxXQUFQLENBQW1CLEtBQW5CLENBekJBLENBQUE7QUFBQSxRQTBCQSxJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVQsQ0FBcUIsSUFBckIsQ0ExQkEsQ0FBQTtBQUFBLFFBMkJBLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFxQixNQUFyQixDQTNCQSxDQURXO01BQUEsQ0FBYjs7NkJBQUE7O1FBM0ZKO0FBQUEsSUF5SEEsTUFBQSxFQUNROzJCQUVKOztBQUFBLHdCQUFBLFFBQUEsR0FBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLFlBQUEsS0FBQTtBQUFBLFFBQUEsSUFBQyxDQUFBLGVBQUQsK0VBQXFFLENBQUUsd0JBQXZFLENBQUE7QUFDQSxRQUFBLElBQUcsSUFBQyxDQUFBLGVBQUo7QUFDRSxVQUFBLElBQUMsQ0FBQSxHQUFELEdBQU8sWUFBWSxDQUFDLE1BQWIsQ0FBb0IsS0FBSyxDQUFDLEtBQU0sQ0FBQSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQVosR0FBcUIsQ0FBckIsQ0FBaEMsQ0FBUCxDQUFBO0FBQUEsVUFDQSxJQUFDLENBQUEsR0FBRyxDQUFDLEtBQUwsQ0FBQSxDQURBLENBQUE7aUJBRUEsWUFBQSxDQUFhLE9BQWIsRUFIRjtTQUZRO01BQUEsQ0FBVixDQUFBOztBQUFBLHdCQU9BLFVBQUEsR0FBWSxTQUFFLE9BQUYsR0FBQTtBQUNWLFFBRFcsSUFBQyxDQUFBLFVBQUEsT0FDWixDQUFBO0FBQUEsUUFBQSxJQUFBLENBQUEsSUFBUSxDQUFBLGVBQVI7QUFDRSxVQUFBLElBQUMsQ0FBQSxHQUFELEdBQU8sWUFBWSxDQUFDLE1BQWIsQ0FBb0IsSUFBQyxDQUFBLE9BQXJCLENBQVAsQ0FBQTtBQUFBLFVBQ0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxLQUFMLENBQUEsQ0FEQSxDQUFBO0FBQUEsVUFFQSxZQUFBLENBQWEsT0FBYixDQUZBLENBREY7U0FBQTtBQUFBLFFBSUEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxVQUFMLENBQUEsQ0FKQSxDQUFBO0FBQUEsUUFLQSxJQUFDLENBQUEsR0FBRyxDQUFDLEtBQUwsQ0FBQSxDQUxBLENBQUE7QUFBQSxRQU1BLElBQUMsQ0FBQSxZQUFELEdBQWdCLEVBTmhCLENBQUE7ZUFPQSxJQUFDLENBQUEsWUFBRCxHQUFnQixHQVJOO01BQUEsQ0FQWixDQUFBOztBQUFBLHdCQWlCQSxRQUFBLEdBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixRQUFBLElBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQTNCO0FBQ0UsVUFBQSxJQUFDLENBQUEsR0FBRyxDQUFDLFFBQUwsQ0FBYyxLQUFLLENBQUMsS0FBcEIsQ0FBQSxDQUFBO0FBQUEsVUFDQSxXQUFXLENBQUMsZUFBZSxDQUFDLFdBQTVCLENBQXdDLFFBQXhDLENBREEsQ0FBQTtpQkFFQSxXQUFXLENBQUMsS0FBSyxDQUFDLEtBQWxCLENBQUEsRUFIRjtTQUFBLE1BQUE7aUJBS0UsV0FBVyxDQUFDLGVBQWUsQ0FBQyxRQUE1QixDQUFxQyxRQUFyQyxFQUxGO1NBRFE7TUFBQSxDQWpCVixDQUFBOztBQUFBLHdCQXlCQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsWUFBQSxJQUFBO0FBQUEsUUFBQSxJQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUF4QixJQUFtQyxrRUFBdEM7QUFDRSxVQUFBLElBQUcsSUFBSSxDQUFDLFNBQUwsS0FBa0IsRUFBckI7QUFDRSxZQUFBLElBQUksQ0FBQyxTQUFMLEdBQWlCLEdBQWpCLENBQUE7QUFBQSxZQUNBLFVBQVUsQ0FBQyxjQUFYLENBQTBCLElBQUMsQ0FBQSxZQUEzQixFQUF5QyxJQUFDLENBQUEsWUFBWSxDQUFDLE1BQWQsR0FBdUIsQ0FBaEUsQ0FEQSxDQURGO1dBREY7U0FBQTtlQUlBLElBQUMsQ0FBQSxZQUFZLENBQUMsSUFBZCxDQUFtQixJQUFDLENBQUEsR0FBRyxDQUFDLE9BQUwsQ0FBQSxDQUFuQixFQUxVO01BQUEsQ0F6QlosQ0FBQTs7QUFBQSx3QkFnQ0EsVUFBQSxHQUFZLFNBQUMsS0FBRCxHQUFBO0FBQ1YsUUFBQSxJQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUEzQjtBQUNFLFVBQUEsVUFBVSxDQUFDLFNBQVgsQ0FBcUIsS0FBckIsRUFBNEIsSUFBQyxDQUFBLFlBQTdCLEVBQTJDLElBQUMsQ0FBQSxZQUFZLENBQUMsTUFBZCxHQUF1QixDQUFsRSxDQUFBLENBREY7U0FBQSxNQUFBO0FBR0UsVUFBQSxJQUFDLENBQUEsWUFBYSxDQUFBLElBQUMsQ0FBQSxZQUFZLENBQUMsTUFBZCxHQUF1QixDQUF2QixDQUF5QixDQUFDLFNBQXhDLElBQXFELEtBQXJELENBSEY7U0FBQTtlQUlBLElBQUMsQ0FBQSxHQUFHLENBQUMsTUFBTCxDQUFBLEVBTFU7TUFBQSxDQWhDWixDQUFBOztBQUFBLHdCQXVDQSxTQUFBLEdBQVcsU0FBQyxJQUFELEdBQUE7QUFDVCxZQUFBLEtBQUE7QUFBQSxRQURXLFFBQUQsS0FBQyxLQUNYLENBQUE7QUFBQSxRQUFBLElBQTJELEtBQUEsS0FBUyxFQUFwRTtpQkFBQSxJQUFDLENBQUEsWUFBYSxDQUFBLElBQUMsQ0FBQSxZQUFZLENBQUMsTUFBZCxHQUF1QixDQUF2QixDQUF5QixDQUFDLFNBQXhDLEdBQW9ELElBQXBEO1NBRFM7TUFBQSxDQXZDWCxDQUFBOztBQUFBLHdCQTBDQSxjQUFBLEdBQWdCLFNBQUMsTUFBRCxHQUFBO0FBQ2QsWUFBQSxJQUFBO0FBQUEsUUFBQSxJQUFBLEdBQU8sSUFBQyxDQUFBLFlBQWEsQ0FBQSxJQUFDLENBQUEsWUFBWSxDQUFDLE1BQWQsR0FBdUIsQ0FBdkIsQ0FBckIsQ0FBQTtBQUNBLFFBQUEsSUFBYyxZQUFkO0FBQUEsZ0JBQUEsQ0FBQTtTQURBO0FBRUEsUUFBQSxJQUFtQixjQUFuQjtBQUFBLFVBQUEsTUFBQSxHQUFTLEVBQVQsQ0FBQTtTQUZBO0FBR0EsUUFBQSxJQUFtQixNQUFBLEtBQVUsTUFBN0I7QUFBQSxVQUFBLE1BQUEsR0FBUyxNQUFULENBQUE7U0FIQTtlQUlBLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxJQUFSLENBQWEsT0FBYixFQUF1QixZQUFBLEdBQVksTUFBbkMsRUFMYztNQUFBLENBMUNoQixDQUFBOztBQUFBLHdCQWlEQSxZQUFBLEdBQWMsU0FBQyxJQUFELEdBQUE7QUFDWixZQUFBLGtDQUFBO0FBQUEsUUFEYyxhQUFBLE9BQU8sYUFBQSxLQUNyQixDQUFBO0FBQUEsUUFBQSxJQUFjLHVEQUFkO0FBQUEsZ0JBQUEsQ0FBQTtTQUFBO0FBQUEsUUFDQSxJQUFBLEdBQU8sU0FBQSxDQUFVLEtBQUssQ0FBQyxLQUFoQixpREFBNkMsS0FBSyxDQUFDLElBQW5ELEVBQTBELEtBQTFELENBRFAsQ0FBQTtBQUFBLFFBRUEsT0FBQSxHQUFVLENBQUEsQ0FBRSxJQUFDLENBQUEsWUFBYSxDQUFBLElBQUMsQ0FBQSxZQUFZLENBQUMsTUFBZCxHQUF1QixDQUF2QixDQUFoQixDQUZWLENBQUE7QUFBQSxRQUdBLE9BQU8sQ0FBQyxJQUFSLENBQWEsT0FBYixFQUFzQixJQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsQ0FBdEIsQ0FIQSxDQUFBO2VBSUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxJQUFJLENBQUMsSUFBTCxDQUFBLENBQWIsRUFMWTtNQUFBLENBakRkLENBQUE7O0FBQUEsd0JBd0RBLHNCQUFBLEdBQXdCLFNBQUMsS0FBRCxHQUFBO0FBQ3RCLFlBQUEsb0VBQUE7QUFBQSxRQUFBLElBQWMsc0VBQWQ7QUFBQSxnQkFBQSxDQUFBO1NBQUE7QUFDQTthQUFBLDREQUFBLEdBQUE7QUFDRSxnQ0FERyxjQUFBLE9BQU8sY0FBQSxLQUNWLENBQUE7QUFBQSxVQUFBLElBQUEsR0FBTyxTQUFBLENBQVUsS0FBSyxDQUFDLEtBQWhCLGlEQUE2QyxLQUFLLENBQUMsSUFBbkQsRUFBMEQsS0FBMUQsQ0FBUCxDQUFBO0FBQUEsVUFDQSxPQUFBLEdBQVUsQ0FBQSxDQUFFLElBQUMsQ0FBQSxZQUFhLENBQUEsSUFBQyxDQUFBLFlBQVksQ0FBQyxNQUFkLEdBQXVCLEtBQUssQ0FBQyxNQUE3QixHQUFzQyxLQUF0QyxHQUE4QyxDQUE5QyxDQUFoQixDQURWLENBQUE7QUFBQSxVQUVBLE9BQU8sQ0FBQyxJQUFSLENBQWEsT0FBYixFQUFzQixJQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsQ0FBdEIsQ0FGQSxDQUFBO0FBQUEsd0JBR0EsT0FBTyxDQUFDLElBQVIsQ0FBYSxJQUFJLENBQUMsSUFBTCxDQUFBLENBQWIsRUFIQSxDQURGO0FBQUE7d0JBRnNCO01BQUEsQ0F4RHhCLENBQUE7O0FBQUEsd0JBZ0VBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixZQUFBLElBQUE7QUFBQSxRQUFBLElBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQXhCLElBQW1DLGtFQUF0QztBQUNFLFVBQUEsSUFBRyxJQUFJLENBQUMsU0FBTCxLQUFrQixFQUFyQjtBQUNFLFlBQUEsSUFBSSxDQUFDLFNBQUwsR0FBaUIsR0FBakIsQ0FBQTtBQUFBLFlBQ0EsVUFBVSxDQUFDLGNBQVgsQ0FBMEIsSUFBQyxDQUFBLFlBQTNCLEVBQXlDLElBQUMsQ0FBQSxZQUFZLENBQUMsTUFBZCxHQUF1QixDQUFoRSxDQURBLENBREY7V0FERjtTQUFBO2VBSUEsSUFBQyxDQUFBLFlBQVksQ0FBQyxJQUFkLENBQW1CLElBQUMsQ0FBQSxHQUFHLENBQUMsT0FBTCxDQUFBLENBQW5CLEVBTFU7TUFBQSxDQWhFWixDQUFBOztBQUFBLHdCQXVFQSxVQUFBLEdBQVksU0FBQyxLQUFELEdBQUE7QUFDVixRQUFBLElBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQTNCO0FBQ0UsVUFBQSxVQUFVLENBQUMsU0FBWCxDQUFxQixLQUFyQixFQUE0QixJQUFDLENBQUEsWUFBN0IsRUFBMkMsSUFBQyxDQUFBLFlBQVksQ0FBQyxNQUFkLEdBQXVCLENBQWxFLENBQUEsQ0FERjtTQUFBLE1BQUE7QUFHRSxVQUFBLElBQUMsQ0FBQSxZQUFhLENBQUEsSUFBQyxDQUFBLFlBQVksQ0FBQyxNQUFkLEdBQXVCLENBQXZCLENBQXlCLENBQUMsU0FBeEMsSUFBcUQsS0FBckQsQ0FIRjtTQUFBO2VBSUEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxNQUFMLENBQUEsRUFMVTtNQUFBLENBdkVaLENBQUE7O0FBQUEsd0JBOEVBLFNBQUEsR0FBVyxTQUFDLElBQUQsR0FBQTtBQUNULFlBQUEsS0FBQTtBQUFBLFFBRFcsUUFBRCxLQUFDLEtBQ1gsQ0FBQTtBQUFBLFFBQUEsSUFBMkQsS0FBQSxLQUFTLEVBQXBFO2lCQUFBLElBQUMsQ0FBQSxZQUFhLENBQUEsSUFBQyxDQUFBLFlBQVksQ0FBQyxNQUFkLEdBQXVCLENBQXZCLENBQXlCLENBQUMsU0FBeEMsR0FBb0QsSUFBcEQ7U0FEUztNQUFBLENBOUVYLENBQUE7O0FBQUEsd0JBaUZBLGNBQUEsR0FBZ0IsU0FBQyxNQUFELEdBQUE7QUFDZCxZQUFBLElBQUE7QUFBQSxRQUFBLElBQUEsR0FBTyxJQUFDLENBQUEsWUFBYSxDQUFBLElBQUMsQ0FBQSxZQUFZLENBQUMsTUFBZCxHQUF1QixDQUF2QixDQUFyQixDQUFBO0FBQ0EsUUFBQSxJQUFjLFlBQWQ7QUFBQSxnQkFBQSxDQUFBO1NBREE7QUFFQSxRQUFBLElBQW1CLGNBQW5CO0FBQUEsVUFBQSxNQUFBLEdBQVMsRUFBVCxDQUFBO1NBRkE7QUFHQSxRQUFBLElBQW1CLE1BQUEsS0FBVSxNQUE3QjtBQUFBLFVBQUEsTUFBQSxHQUFTLE1BQVQsQ0FBQTtTQUhBO2VBSUEsQ0FBQSxDQUFFLElBQUYsQ0FBTyxDQUFDLElBQVIsQ0FBYSxPQUFiLEVBQXVCLFlBQUEsR0FBWSxNQUFuQyxFQUxjO01BQUEsQ0FqRmhCLENBQUE7O0FBQUEsd0JBd0ZBLFlBQUEsR0FBYyxTQUFDLElBQUQsR0FBQTtBQUNaLFlBQUEsa0NBQUE7QUFBQSxRQURjLGFBQUEsT0FBTyxhQUFBLEtBQ3JCLENBQUE7QUFBQSxRQUFBLElBQWMsdURBQWQ7QUFBQSxnQkFBQSxDQUFBO1NBQUE7QUFBQSxRQUNBLElBQUEsR0FBTyxTQUFBLENBQVUsS0FBSyxDQUFDLEtBQWhCLGlEQUE2QyxLQUFLLENBQUMsSUFBbkQsRUFBMEQsS0FBMUQsQ0FEUCxDQUFBO0FBQUEsUUFFQSxPQUFBLEdBQVUsQ0FBQSxDQUFFLElBQUMsQ0FBQSxZQUFhLENBQUEsSUFBQyxDQUFBLFlBQVksQ0FBQyxNQUFkLEdBQXVCLENBQXZCLENBQWhCLENBRlYsQ0FBQTtBQUFBLFFBR0EsT0FBTyxDQUFDLElBQVIsQ0FBYSxPQUFiLEVBQXNCLElBQUksQ0FBQyxJQUFMLENBQVUsT0FBVixDQUF0QixDQUhBLENBQUE7ZUFJQSxPQUFPLENBQUMsSUFBUixDQUFhLElBQUksQ0FBQyxJQUFMLENBQUEsQ0FBYixFQUxZO01BQUEsQ0F4RmQsQ0FBQTs7QUFBQSx3QkErRkEsc0JBQUEsR0FBd0IsU0FBQyxLQUFELEdBQUE7QUFDdEIsWUFBQSxvRUFBQTtBQUFBLFFBQUEsSUFBYyxzRUFBZDtBQUFBLGdCQUFBLENBQUE7U0FBQTtBQUNBO2FBQUEsNERBQUEsR0FBQTtBQUNFLGdDQURHLGNBQUEsT0FBTyxjQUFBLEtBQ1YsQ0FBQTtBQUFBLFVBQUEsSUFBQSxHQUFPLFNBQUEsQ0FBVSxLQUFLLENBQUMsS0FBaEIsaURBQTZDLEtBQUssQ0FBQyxJQUFuRCxFQUEwRCxLQUExRCxDQUFQLENBQUE7QUFBQSxVQUNBLE9BQUEsR0FBVSxDQUFBLENBQUUsSUFBQyxDQUFBLFlBQWEsQ0FBQSxJQUFDLENBQUEsWUFBWSxDQUFDLE1BQWQsR0FBdUIsS0FBSyxDQUFDLE1BQTdCLEdBQXNDLEtBQXRDLEdBQThDLENBQTlDLENBQWhCLENBRFYsQ0FBQTtBQUFBLFVBRUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxPQUFiLEVBQXNCLElBQUksQ0FBQyxJQUFMLENBQVUsT0FBVixDQUF0QixDQUZBLENBQUE7QUFBQSx3QkFHQSxPQUFPLENBQUMsSUFBUixDQUFhLElBQUksQ0FBQyxJQUFMLENBQUEsQ0FBYixFQUhBLENBREY7QUFBQTt3QkFGc0I7TUFBQSxDQS9GeEIsQ0FBQTs7QUFBQSx3QkF1R0EsS0FBQSxHQUFPLFNBQUMsT0FBRCxHQUFBO0FBQ0wsUUFBQSxJQUFDLENBQUEsR0FBRyxDQUFDLFFBQUwsQ0FBYyxPQUFkLENBQUEsQ0FBQTtlQUNBLElBQUMsQ0FBQSxHQUFHLENBQUMsYUFBTCxDQUFBLEVBRks7TUFBQSxDQXZHUCxDQUFBOztBQUFBLHdCQTJHQSxXQUFBLEdBQWEsU0FBQyxNQUFELEdBQUE7QUFDWCxRQUFBLElBQUMsQ0FBQSxHQUFHLENBQUMsV0FBTCxDQUFpQixNQUFqQixDQUFBLENBQUE7QUFDQSxRQUFBLElBQVUsSUFBQyxDQUFBLGVBQVg7QUFBQSxnQkFBQSxDQUFBO1NBREE7ZUFFQSxJQUFDLENBQUEsTUFBRCxDQUFRLE1BQVIsRUFIVztNQUFBLENBM0diLENBQUE7O0FBQUEsd0JBZ0hBLFNBQUEsR0FBVyxTQUFDLElBQUQsR0FBQTtBQUNULFFBQUEsSUFBRyxJQUFBLEtBQVEsQ0FBQSxDQUFYO0FBQ0UsVUFBQSxJQUFDLENBQUEsR0FBRyxDQUFDLFlBQUwsQ0FBQSxDQUFBLENBQUE7QUFBQSxVQUNBLElBQUMsQ0FBQSxHQUFHLENBQUMsYUFBTCxDQUFBLENBREEsQ0FBQTtBQUVBLFVBQUEsSUFBMkIsSUFBQyxDQUFBLEdBQUcsQ0FBQyxRQUFMLENBQUEsQ0FBM0I7QUFBQSxZQUFBLFdBQVcsQ0FBQyxTQUFaLENBQUEsQ0FBQSxDQUFBO1dBRkE7QUFHQSxnQkFBQSxDQUpGO1NBQUE7QUFLQSxRQUFBLElBQUEsQ0FBQSxJQUFlLENBQUEsZUFBZjtBQUFBLGdCQUFBLENBQUE7U0FMQTtlQU1BLElBQUMsQ0FBQSxNQUFELENBQVEsSUFBUixFQVBTO01BQUEsQ0FoSFgsQ0FBQTs7QUFBQSx3QkF5SEEsTUFBQSxHQUFRLFNBQUMsTUFBRCxHQUFBO0FBQ04sWUFBQSxDQUFBO0FBQUEsUUFBQSxJQUFDLENBQUEsR0FBRyxDQUFDLGFBQUwsQ0FBQSxDQUFBLENBQUE7QUFDQSxRQUFBLElBQTJCLElBQUMsQ0FBQSxHQUFHLENBQUMsUUFBTCxDQUFBLENBQTNCO0FBQUEsVUFBQSxXQUFXLENBQUMsU0FBWixDQUFBLENBQUEsQ0FBQTtTQURBO0FBRUEsUUFBQSxJQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBTyxDQUFBLFNBQUEsQ0FBVSxDQUFDLGFBQTNCLElBQTZDLE1BQUEsS0FBVSxDQUExRDtBQUNFLFVBQUEsQ0FBQSxHQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw0QkFBaEIsQ0FBSixDQUFBO0FBQ0EsVUFBQSxJQUFHLENBQUEsR0FBSSxDQUFQO0FBQ0UsWUFBQSxZQUFZLENBQUMsSUFBYixDQUFBLENBQUEsQ0FBQTtBQUFBLFlBQ0EsSUFBQyxDQUFBLEdBQUQsR0FBTyxJQURQLENBQUE7bUJBRUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxLQUhiO1dBQUEsTUFBQTtBQUtFLFlBQUEsWUFBQSxDQUFhLE9BQWIsQ0FBQSxDQUFBO21CQUNBLE9BQUEsR0FBVSxVQUFBLENBQVksQ0FBQSxTQUFBLEtBQUEsR0FBQTtxQkFBQSxTQUFBLEdBQUE7QUFDcEIsZ0JBQUEsSUFBdUIsS0FBQyxDQUFBLEdBQUcsQ0FBQyxRQUFMLENBQUEsQ0FBdkI7QUFBQSxrQkFBQSxZQUFZLENBQUMsSUFBYixDQUFBLENBQUEsQ0FBQTtpQkFBQTtBQUFBLGdCQUNBLE9BQUEsR0FBVSxJQURWLENBQUE7QUFBQSxnQkFFQSxLQUFDLENBQUEsR0FBRCxHQUFPLElBRlAsQ0FBQTt1QkFHQSxLQUFDLENBQUEsT0FBRCxHQUFXLEtBSlM7Y0FBQSxFQUFBO1lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFaLEVBS1IsQ0FBQSxHQUFJLElBTEksRUFOWjtXQUZGO1NBSE07TUFBQSxDQXpIUixDQUFBOztxQkFBQTs7UUE1SEo7R0E5QkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/output/console.coffee
