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
        var _ref1, _ref2, _ref3;
        if ((command != null ? (_ref1 = command.output) != null ? _ref1.console : void 0 : void 0) != null) {
          this.find('#close_success').prop('checked', command.output.console.close_success);
          this.find('#all_in_one').prop('checked', (_ref2 = command.output.console.queue_in_buffer) != null ? _ref2 : true);
          return this.find('#stdin').prop('checked', (_ref3 = command.output.console.stdin) != null ? _ref3 : false);
        } else {
          this.find('#close_success').prop('checked', atom.config.get('build-tools.CloseOnSuccess') === -1 ? false : true);
          this.find('#all_in_one').prop('checked', true);
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
        keys.innerHTML = '<div class="text-padded">Close on success:</div>\n<div class="text-padded">Execute queue in one tab:</div>\n<div class="text-padded">User Input:</div>';
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
        this.tab.unlock();
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
        if (this.command.stdout.highlighting === 'nh' && this.command.stdout.ansi_option === 'parse' && ((last = this.stdout_lines[this.stdout_lines.length - 1]) != null)) {
          if (last.innerText === '') {
            last.innerText = ' ';
            AnsiParser.copyAttributes(this.stdout_lines, this.stdout_lines.length - 1);
          }
        }
        return this.stdout_lines.push(this.tab.newLine());
      };

      Console.prototype.stdout_raw = function(input) {
        if (this.command.stdout.highlighting === 'nh' && this.command.stdout.ansi_option === 'parse') {
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
        if (this.command.stderr.highlighting === 'nh' && this.command.stderr.ansi_option === 'parse' && ((last = this.stderr_lines[this.stderr_lines.length - 1]) != null)) {
          if (last.innerText === '') {
            last.innerText = ' ';
            AnsiParser.copyAttributes(this.stderr_lines, this.stderr_lines.length - 1);
          }
        }
        return this.stderr_lines.push(this.tab.newLine());
      };

      Console.prototype.stderr_raw = function(input) {
        if (this.command.stderr.highlighting === 'nh' && this.command.stderr.ansi_option === 'parse') {
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
        this.tab.lock();
        return this.tab.finishConsole();
      };

      Console.prototype.exitCommand = function(code) {
        this.tab.setFinished(code);
        this.tab.lock();
        if (this.queue_in_buffer) {
          return;
        }
        return this.finish(code);
      };

      Console.prototype.exitQueue = function(code) {
        if (code === -2) {
          this.tab.setCancelled();
          this.tab.lock();
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

      Console.prototype.finish = function(code) {
        var t;
        this.tab.finishConsole();
        if (this.tab.hasFocus()) {
          consoleview.hideInput();
        }
        if (this.command.output['console'].close_success && code === 0) {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL291dHB1dC9jb25zb2xlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzSkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBZ0IsT0FBQSxDQUFRLHNCQUFSLENBQWhCLEVBQUMsU0FBQSxDQUFELEVBQUksVUFBQSxFQUFKLEVBQVEsWUFBQSxJQUFSLENBQUE7O0FBQUEsRUFFQSxPQUFBLEdBQVUsSUFGVixDQUFBOztBQUFBLEVBR0EsWUFBQSxHQUFlLElBSGYsQ0FBQTs7QUFBQSxFQUlBLFdBQUEsR0FBYyxJQUpkLENBQUE7O0FBQUEsRUFLQSxZQUFBLEdBQWUsSUFMZixDQUFBOztBQUFBLEVBT0EsT0FBQSxHQUFVLElBUFYsQ0FBQTs7QUFBQSxFQVNBLG1CQUFBLEdBQXNCLElBVHRCLENBQUE7O0FBQUEsRUFXQSxVQUFBLEdBQWEsSUFYYixDQUFBOztBQUFBLEVBYUEsU0FBQSxHQUFZLFNBQUMsT0FBRCxFQUFVLE1BQVYsRUFBa0IsU0FBbEIsR0FBQTtXQUNWLEVBQUEsQ0FBRyxTQUFBLEdBQUE7QUFDRCxNQUFBLElBQW1CLGNBQW5CO0FBQUEsUUFBQSxNQUFBLEdBQVMsRUFBVCxDQUFBO09BQUE7QUFDQSxNQUFBLElBQW1CLE1BQUEsS0FBVSxNQUE3QjtBQUFBLFFBQUEsTUFBQSxHQUFTLE1BQVQsQ0FBQTtPQURBO2FBRUEsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFRLE9BQUEsR0FBTyxNQUFmO09BQUwsRUFBOEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUM1QixjQUFBLGlEQUFBO0FBQUEsVUFBQSxJQUFHLG1CQUFBLElBQWUsU0FBUyxDQUFDLE1BQVYsS0FBc0IsQ0FBeEM7QUFD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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/output/console.coffee
