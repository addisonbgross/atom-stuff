(function() {
  var EnvInfoPane, EnvPane, TextEditorView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), TextEditorView = _ref.TextEditorView, View = _ref.View;

  module.exports = {
    name: 'Environment Variables',
    description: 'Add/Change environment variables. Each line has the format "VARIABLE=VALUE". One variable per line',
    "private": false,
    edit: EnvPane = (function(_super) {
      __extends(EnvPane, _super);

      function EnvPane() {
        return EnvPane.__super__.constructor.apply(this, arguments);
      }

      EnvPane.content = function() {
        return this.div({
          "class": 'panel-body padded'
        }, (function(_this) {
          return function() {
            return _this.subview('env', new TextEditorView());
          };
        })(this));
      };

      EnvPane.prototype.set = function(command) {
        var key, _i, _len, _ref1, _ref2, _results;
        if ((command != null ? command.modifier.env : void 0) != null) {
          _ref2 = Object.keys((_ref1 = command.modifier.env) != null ? _ref1 : {});
          _results = [];
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            key = _ref2[_i];
            _results.push(this.env.getModel().insertText("" + key + "=" + command.modifier.env[key] + "\n"));
          }
          return _results;
        } else {
          return this.env.getModel().setText('');
        }
      };

      EnvPane.prototype.get = function(command) {
        var key, l, value, _i, _len, _ref1;
        command.modifier.env = {};
        _ref1 = this.env.getModel().getText().split('\n');
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          l = _ref1[_i];
          if (l.trim() === '') {
            continue;
          }
          key = l.split('=')[0];
          if (key.length === 0) {
            return 'No variable name found';
          }
          value = l.substr(key.length + 1);
          command.modifier.env[key] = value;
        }
        return null;
      };

      return EnvPane;

    })(View),
    info: EnvInfoPane = (function() {
      function EnvInfoPane(command) {
        var key, keys, value, values, _i, _key, _len, _ref1;
        this.element = document.createElement('div');
        this.element.classList.add('module');
        keys = document.createElement('div');
        values = document.createElement('div');
        _ref1 = Object.keys(command.modifier.env);
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          key = _ref1[_i];
          _key = document.createElement('div');
          _key.classList.add('text-padded');
          _key.innerText = "" + key + " = ";
          value = document.createElement('div');
          value.classList.add('text-padded');
          value.innerText = command.modifier.env[key];
          keys.appendChild(_key);
          values.appendChild(value);
        }
        this.element.appendChild(keys);
        this.element.appendChild(values);
      }

      return EnvInfoPane;

    })(),
    preSplit: function(command) {
      var k, _i, _len, _ref1;
      command.env = {};
      _ref1 = Object.keys(command.modifier.env);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        k = _ref1[_i];
        command.env[k] = command.modifier.env[k];
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL21vZGlmaWVyL2Vudi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0RBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQXlCLE9BQUEsQ0FBUSxzQkFBUixDQUF6QixFQUFDLHNCQUFBLGNBQUQsRUFBaUIsWUFBQSxJQUFqQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsSUFBQSxFQUFNLHVCQUFOO0FBQUEsSUFDQSxXQUFBLEVBQWEsb0dBRGI7QUFBQSxJQUVBLFNBQUEsRUFBUyxLQUZUO0FBQUEsSUFJQSxJQUFBLEVBQ1E7QUFFSixnQ0FBQSxDQUFBOzs7O09BQUE7O0FBQUEsTUFBQSxPQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTtlQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxVQUFBLE9BQUEsRUFBTyxtQkFBUDtTQUFMLEVBQWlDLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUMvQixLQUFDLENBQUEsT0FBRCxDQUFTLEtBQVQsRUFBb0IsSUFBQSxjQUFBLENBQUEsQ0FBcEIsRUFEK0I7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQyxFQURRO01BQUEsQ0FBVixDQUFBOztBQUFBLHdCQUlBLEdBQUEsR0FBSyxTQUFDLE9BQUQsR0FBQTtBQUNILFlBQUEscUNBQUE7QUFBQSxRQUFBLElBQUcseURBQUg7QUFDRTtBQUFBO2VBQUEsNENBQUE7NEJBQUE7QUFDRSwwQkFBQSxJQUFDLENBQUEsR0FBRyxDQUFDLFFBQUwsQ0FBQSxDQUFlLENBQUMsVUFBaEIsQ0FBMkIsRUFBQSxHQUFHLEdBQUgsR0FBTyxHQUFQLEdBQVUsT0FBTyxDQUFD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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/modifier/env.coffee
