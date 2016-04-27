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
            return _this.div({
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
          };
        })(this));
      };

      LinterPane.prototype.set = function(command) {
        if ((command != null ? command.output.linter : void 0) != null) {
          return this.find('#no_trace').prop('checked', command.output.linter.no_trace);
        } else {
          return this.find('#no_trace').prop('checked', false);
        }
      };

      LinterPane.prototype.get = function(command) {
        var _base;
        if ((_base = command.output).linter == null) {
          _base.linter = {};
        }
        command.output.linter.no_trace = this.find('#no_trace').prop('checked');
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
        keys.innerHTML = '<div class="text-padded">Disable stack traces:</div>';
        values = document.createElement('div');
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = String(command.output.linter.no_trace);
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
        return ll.messages.push(message);
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
        return ll.messages.push(message);
      };

      Linter.prototype.exitQueue = function(code) {
        return atom.commands.dispatch(atom.views.getView(atom.workspace), 'linter:lint');
      };

      return Linter;

    })()
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL291dHB1dC9saW50ZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLGdCQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUVDLE9BQVEsT0FBQSxDQUFRLHNCQUFSLEVBQVIsSUFGRCxDQUFBOztBQUFBLEVBSUEsV0FBQSxHQUFjLEVBSmQsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBRUU7QUFBQSxJQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsSUFDQSxXQUFBLEVBQWEsc0NBRGI7QUFBQSxJQUVBLFNBQUEsRUFBUyxLQUZUO0FBQUEsSUFJQSxJQUFBLEVBQ1E7QUFDSixtQ0FBQSxDQUFBOzs7O09BQUE7O0FBQUEsTUFBQSxVQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTtlQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxVQUFBLE9BQUEsRUFBTyxtQkFBUDtTQUFMLEVBQWlDLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUMvQixLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sZ0JBQVA7YUFBTCxFQUE4QixTQUFBLEdBQUE7QUFDNUIsY0FBQSxLQUFDLENBQUEsS0FBRCxDQUFPO0FBQUEsZ0JBQUEsRUFBQSxFQUFJLFVBQUo7QUFBQSxnQkFBZ0IsSUFBQSxFQUFNLFVBQXRCO2VBQVAsQ0FBQSxDQUFBO3FCQUNBLEtBQUMsQ0FBQSxLQUFELENBQU8sU0FBQSxHQUFBO0FBQ0wsZ0JBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGtCQUFBLE9BQUEsRUFBTyxlQUFQO2lCQUFMLEVBQTZCLGVB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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/output/linter.coffee
