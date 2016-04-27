(function() {
  var Linter, LinterInfoPane, LinterPane, View, coordinates, ll,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ll = require('../linter-list');

  View = require('atom-space-pen-views').View;

  coordinates = {};

  module.exports = {
    name: 'Linter',
    description: 'Highlight errors in-line with Linter',
    "private": false,
    edit: LinterPane = (function(_super) {
      __extends(LinterPane, _super);

      function LinterPane() {
        return LinterPane.__super__.constructor.apply(this, arguments);
      }

      LinterPane.content = function() {
        return this.div({
          "class": 'panel-body padded'
        }, (function(_this) {
          return function() {
            _this.div({
              "class": 'block checkbox'
            }, function() {
              _this.input({
                id: 'no_trace',
                type: 'checkbox'
              });
              return _this.label(function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Disable Trace');
                return _this.div(function() {
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'Do not send stack traces to Linter');
                });
              });
            });
            return _this.div({
              "class": 'block checkbox'
            }, function() {
              _this.input({
                id: 'immediate',
                type: 'checkbox'
              });
              return _this.label(function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Trigger immediately');
                return _this.div(function() {
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'Display linter messages immediately (Only useful for larger builds / debugging processes)');
                });
              });
            });
          };
        })(this));
      };

      LinterPane.prototype.set = function(command) {
        var _ref;
        if ((command != null ? command.output.linter : void 0) != null) {
          this.find('#no_trace').prop('checked', command.output.linter.no_trace);
          return this.find('#immediate').prop('checked', (_ref = command.output.linter.immediate) != null ? _ref : false);
        } else {
          this.find('#no_trace').prop('checked', false);
          return this.find('#immediate').prop('checked', false);
        }
      };

      LinterPane.prototype.get = function(command) {
        var _base;
        if ((_base = command.output).linter == null) {
          _base.linter = {};
        }
        command.output.linter.no_trace = this.find('#no_trace').prop('checked');
        command.output.linter.immediate = this.find('#immediate').prop('checked');
        return null;
      };

      return LinterPane;

    })(View),
    info: LinterInfoPane = (function() {
      function LinterInfoPane(command) {
        var keys, value, values;
        this.element = document.createElement('div');
        this.element.classList.add('module');
        keys = document.createElement('div');
        keys.innerHTML = '<div class="text-padded">Disable stack traces:</div>\n<div class="text-padded">Fast messages:</div>';
        values = document.createElement('div');
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = String(command.output.linter.no_trace);
        values.appendChild(value);
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = String(command.output.linter.immediate);
        values.appendChild(value);
        this.element.appendChild(keys);
        this.element.appendChild(values);
      }

      return LinterInfoPane;

    })(),
    output: Linter = (function() {
      function Linter() {}

      Linter.prototype.newQueue = function(queue) {
        this.queue = queue;
        ll.messages = [];
        return coordinates = {};
      };

      Linter.prototype.newCommand = function(command) {
        this.command = command;
      };

      Linter.prototype.stdout_linter = function(message) {
        if (atom.inSpecMode()) {
          return ll.messages.push(message);
        }
        if (coordinates[message.filePath + ':' + message.range[0][0]] != null) {
          return;
        }
        coordinates[message.filePath + ':' + message.range[0][0]] = true;
        if (this.command.output.linter.no_trace) {
          message.trace = null;
        }
        ll.messages.push(message);
        if (this.command.output.linter.immediate) {
          return exitQueue(0);
        }
      };

      Linter.prototype.stderr_linter = function(message) {
        if (atom.inSpecMode()) {
          return ll.messages.push(message);
        }
        if (coordinates[message.filePath + ':' + message.range[0][0]] != null) {
          return;
        }
        coordinates[message.filePath + ':' + message.range[0][0]] = true;
        if (this.command.output.linter.no_trace) {
          message.trace = null;
        }
        ll.messages.push(message);
        if (this.command.output.linter.immediate) {
          return exitQueue(0);
        }
      };

      Linter.prototype.exitQueue = function(code) {
        return atom.commands.dispatch(atom.views.getView(atom.workspace), 'linter:lint');
      };

      return Linter;

    })()
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL291dHB1dC9saW50ZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLGdCQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUVDLE9BQVEsT0FBQSxDQUFRLHNCQUFSLEVBQVIsSUFGRCxDQUFBOztBQUFBLEVBSUEsV0FBQSxHQUFjLEVBSmQsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBRUU7QUFBQSxJQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsSUFDQSxXQUFBLEVBQWEsc0NBRGI7QUFBQSxJQUVBLFNBQUEsRUFBUyxLQUZUO0FBQUEsSUFJQSxJQUFBLEVBQ1E7QUFDSixtQ0FBQSxDQUFBOzs7O09BQUE7O0FBQUEsTUFBQSxVQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTtlQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxVQUFBLE9BQUEsRUFBTyxtQkFBUDtTQUFMLEVBQWlDLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO0FBQy9CLFlBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLGdCQUFQO2FBQUwsRUFBOEIsU0FBQSxHQUFBO0FBQzVCLGNBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTztBQUFBLGdCQUFBLEVBQUEsRUFBSSxVQUFKO0FBQUEsZ0JBQWdCLElBQUEsRUFBTSxVQUF0QjtlQUFQLENBQUEsQ0FBQTtxQkFDQSxLQUFDLENBQUEsS0FBRCxDQUFPLFNBQUEsR0FBQTtBQUNMLGdCQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxrQkFBQSxPQUFBLEVBQU8sZUFBUDtpQkFBTCxFQUE2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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/output/linter.coffee
