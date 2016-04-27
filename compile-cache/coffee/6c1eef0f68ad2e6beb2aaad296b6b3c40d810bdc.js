(function() {
  var Command, ShellInfoPane, ShellPane, TextEditorView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Command = null;

  _ref = require('atom-space-pen-views'), TextEditorView = _ref.TextEditorView, View = _ref.View;

  module.exports = {
    name: 'Execute in Shell',
    description: 'Execute command in a shell',
    "private": false,
    edit: ShellPane = (function(_super) {
      __extends(ShellPane, _super);

      function ShellPane() {
        return ShellPane.__super__.constructor.apply(this, arguments);
      }

      ShellPane.content = function() {
        return this.div({
          "class": 'panel-body padded'
        }, (function(_this) {
          return function() {
            return _this.div({
              "class": 'block'
            }, function() {
              _this.label(function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Shell Command');
                return _this.div(function() {
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'Your command will be appended to the shell command');
                });
              });
              return _this.subview('command_name', new TextEditorView({
                mini: true,
                placeholderText: 'Default: bash -c'
              }));
            });
          };
        })(this));
      };

      ShellPane.prototype.set = function(command) {
        var _ref1;
        if ((command != null ? (_ref1 = command.modifier) != null ? _ref1.shell : void 0 : void 0) != null) {
          return this.command_name.getModel().setText(command.modifier.shell.command);
        } else {
          return this.command_name.getModel().setText('');
        }
      };

      ShellPane.prototype.get = function(command) {
        var out, _base;
        if ((out = this.command_name.getModel().getText()) === '') {
          out = 'bash -c';
        }
        if ((_base = command.modifier).shell == null) {
          _base.shell = {};
        }
        command.modifier.shell.command = out;
        return null;
      };

      return ShellPane;

    })(View),
    info: ShellInfoPane = (function() {
      function ShellInfoPane(command) {
        var keys, value, values;
        this.element = document.createElement('div');
        this.element.classList.add('module');
        keys = document.createElement('div');
        keys.innerHTML = '<div class="text-padded">Shell Command:</div>';
        values = document.createElement('div');
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = String(command.modifier.shell.command);
        values.appendChild(value);
        this.element.appendChild(keys);
        this.element.appendChild(values);
      }

      return ShellInfoPane;

    })(),
    activate: function() {
      return Command = require('../provider/command');
    },
    deactivate: function() {
      return Command = null;
    },
    postSplit: function(command) {
      var args;
      args = Command.splitQuotes(command.modifier.shell.command);
      command.args = args.slice(1).concat([command.original]);
      command.command = args[0];
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL21vZGlmaWVyL3NoZWxsLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw2REFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBQSxHQUFVLElBQVYsQ0FBQTs7QUFBQSxFQUNBLE9BQXlCLE9BQUEsQ0FBUSxzQkFBUixDQUF6QixFQUFDLHNCQUFBLGNBQUQsRUFBaUIsWUFBQSxJQURqQixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsSUFBQSxFQUFNLGtCQUFOO0FBQUEsSUFDQSxXQUFBLEVBQWEsNEJBRGI7QUFBQSxJQUVBLFNBQUEsRUFBUyxLQUZUO0FBQUEsSUFJQSxJQUFBLEVBQ1E7QUFFSixrQ0FBQSxDQUFBOzs7O09BQUE7O0FBQUEsTUFBQSxTQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTtlQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxVQUFBLE9BQUEsRUFBTyxtQkFBUDtTQUFMLEVBQWlDLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUMvQixLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sT0FBUDthQUFMLEVBQXFCLFNBQUEsR0FBQTtBQUNuQixjQUFBLEtBQUMsQ0FBQSxLQUFELENBQU8sU0FBQSxHQUFBO0FBQ0wsZ0JBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGtCQUFBLE9BQUEsRUFBTyxlQUFQO2lCQUFMLEVBQTZCLGVBQTdCLENBQUEsQ0FBQTt1QkFDQSxLQUFDLENBQUEsR0FBRCxDQUFLLFNBQUEsR0FBQTt5QkFDSCxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsb0JBQUEsT0FBQSxFQUFPLDBCQUFQO21CQUFOLEVB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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/modifier/shell.coffee
