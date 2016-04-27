(function() {
  var $, $$, CSON, RegexEditPane, RegexInfoPane, RegexModifier, TextEditorView, View, XRegExp, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  XRegExp = null;

  CSON = null;

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, TextEditorView = _ref.TextEditorView, View = _ref.View;

  module.exports = {
    name: 'Regular Expression',
    activate: function() {
      XRegExp = require('xregexp').XRegExp;
      return CSON = require('season');
    },
    deactivate: function() {
      XRegExp = null;
      return CSON = null;
    },
    info: RegexInfoPane = (function() {
      function RegexInfoPane(command, config) {
        var key, keys, value, values;
        this.element = document.createElement('div');
        this.element.classList.add('module');
        keys = document.createElement('div');
        values = document.createElement('div');
        key = document.createElement('div');
        key.classList.add('text-padded');
        key.innerText = 'Regular Expression:';
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = config.regex;
        keys.appendChild(key);
        values.appendChild(value);
        key = document.createElement('div');
        key.classList.add('text-padded');
        key.innerText = 'Default Values:';
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = config.defaults;
        keys.appendChild(key);
        values.appendChild(value);
        this.element.appendChild(keys);
        this.element.appendChild(values);
      }

      return RegexInfoPane;

    })(),
    edit: RegexEditPane = (function(_super) {
      __extends(RegexEditPane, _super);

      function RegexEditPane() {
        return RegexEditPane.__super__.constructor.apply(this, arguments);
      }

      RegexEditPane.content = function() {
        return this.div({
          "class": 'panel-body padded'
        }, (function(_this) {
          return function() {
            _this.div({
              "class": 'block'
            }, function() {
              _this.label(function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Regular Expression');
                return _this.div(function() {
                  _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'Enter XRegExp string. The XRegExp object will use ');
                  _this.span({
                    "class": 'inline-block highlight'
                  }, 'xni');
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, ' flags. Refer to the internet (including this package\'s wiki) for details.');
                });
              });
              return _this.subview('regex', new TextEditorView({
                mini: true
              }));
            });
            return _this.div({
              "class": 'block'
            }, function() {
              _this.label(function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Hardcoded values');
                return _this.div(function() {
                  _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'Enter CSON string with default properties. To highlight an error you need at least a ');
                  _this.span({
                    "class": 'inline-block highlight'
                  }, 'type');
                  _this.span({
                    "class": 'inline-block text-subtle'
                  }, ' field. Linter messages require at least ');
                  _this.span({
                    "class": 'inline-block highlight'
                  }, 'type');
                  _this.span({
                    "class": 'inline-block text-subtle'
                  }, ', ');
                  _this.span({
                    "class": 'inline-block highlight'
                  }, 'file');
                  _this.span({
                    "class": 'inline-block text-subtle'
                  }, ', ');
                  _this.span({
                    "class": 'inline-block highlight'
                  }, 'row');
                  _this.span({
                    "class": 'inline-block text-subtle'
                  }, ' and ');
                  _this.span({
                    "class": 'inline-block highlight'
                  }, 'message');
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, ' fields.');
                });
              });
              return _this.subview('default', new TextEditorView({
                mini: true
              }));
            });
          };
        })(this));
      };

      RegexEditPane.prototype.set = function(command, config) {
        if (command != null) {
          this.regex.getModel().setText(config.regex);
          return this["default"].getModel().setText(config.defaults);
        } else {
          this.regex.getModel().setText('');
          return this["default"].getModel().setText('');
        }
      };

      RegexEditPane.prototype.get = function(command, stream) {
        if (this.regex.getModel().getText() === '') {
          return 'Regular expression must not be empty';
        }
        command[stream].pipeline.push({
          name: 'regex',
          config: {
            regex: this.regex.getModel().getText(),
            defaults: this["default"].getModel().getText()
          }
        });
        return null;
      };

      return RegexEditPane;

    })(View),
    modifier: RegexModifier = (function() {
      function RegexModifier(config, command, output) {
        this.config = config;
        this.command = command;
        this.output = output;
        this.regex = new XRegExp(this.config.regex, 'xni');
        this["default"] = {};
        if ((this.config.defaults != null) && this.config.defaults !== '') {
          this["default"] = CSON.parse(this.config.defaults);
        }
      }

      RegexModifier.prototype.modify = function(_arg) {
        var k, m, match, perm, temp, _i, _j, _k, _len, _len1, _len2, _ref1, _ref2, _ref3;
        temp = _arg.temp, perm = _arg.perm;
        if ((m = this.regex.xexec(temp.input)) != null) {
          match = {};
          _ref1 = Object.keys(this["default"]);
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            k = _ref1[_i];
            match[k] = this["default"][k];
          }
          _ref2 = Object.keys(m);
          for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            k = _ref2[_j];
            if (m[k] != null) {
              match[k] = m[k];
            }
          }
          _ref3 = Object.keys(match);
          for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
            k = _ref3[_k];
            temp[k] = perm[k] = match[k];
          }
        }
        return null;
      };

      RegexModifier.prototype.getFiles = function(_arg) {
        var end, file, perm, start, temp;
        temp = _arg.temp, perm = _arg.perm;
        if (temp.file == null) {
          return [];
        }
        start = temp.input.indexOf(temp.file);
        end = start + temp.file.length - 1;
        file = this.output.absolutePath(temp.file);
        if (file == null) {
          return [];
        }
        return [
          {
            file: file,
            start: start,
            end: end,
            row: temp.row,
            col: temp.col
          }
        ];
      };

      return RegexModifier;

    })()
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3N0cmVhbS1tb2RpZmllcnMvcmVnZXguY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZGQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFBLEdBQVUsSUFBVixDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLElBRFAsQ0FBQTs7QUFBQSxFQUVBLE9BQWdDLE9BQUEsQ0FBUSxzQkFBUixDQUFoQyxFQUFDLFNBQUEsQ0FBRCxFQUFJLFVBQUEsRUFBSixFQUFRLHNCQUFBLGNBQVIsRUFBd0IsWUFBQSxJQUZ4QixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsSUFBQSxFQUFNLG9CQUFOO0FBQUEsSUFFQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFNBQVIsQ0FBa0IsQ0FBQyxPQUE3QixDQUFBO2FBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSLEVBRkM7SUFBQSxDQUZWO0FBQUEsSUFNQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxPQUFBLEdBQVUsSUFBVixDQUFBO2FBQ0EsSUFBQSxHQUFPLEtBRkc7SUFBQSxDQU5aO0FBQUEsSUFVQSxJQUFBLEVBQ1E7QUFDUyxNQUFBLHVCQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7QUFDWCxZQUFBLHdCQUFBO0FBQUEsUUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQVgsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsUUFBdkIsQ0FEQSxDQUFBO0FBQUEsUUFFQSxJQUFBLEdBQU8sUUFBUSxDQUFDLGFB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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/stream-modifiers/regex.coffee
