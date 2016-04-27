(function() {
  var $, $$, HighlightingPane, StreamPane, TextEditorView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, TextEditorView = _ref.TextEditorView, View = _ref.View;

  StreamPane = require('./command-edit-stream-pane');

  module.exports = HighlightingPane = (function(_super) {
    __extends(HighlightingPane, _super);

    function HighlightingPane() {
      return HighlightingPane.__super__.constructor.apply(this, arguments);
    }

    HighlightingPane.content = function() {
      return this.div({
        "class": 'panel-body'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'padded'
          }, function() {
            _this.div({
              "class": 'block'
            }, function() {
              _this.label(function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Output Streams');
                return _this.div(function() {
                  return _this.span({
                    "class": 'inline-block text-subtle'
                  }, 'Configure standard output/error stream');
                });
              });
              return _this.select({
                "class": 'form-control',
                outlet: 'streams'
              }, function() {
                _this.option({
                  value: 'none'
                }, 'Disable all streams');
                _this.option({
                  value: 'no-stdout'
                }, 'No stdout');
                _this.option({
                  value: 'no-stderr'
                }, 'No stderr');
                _this.option({
                  value: 'stderr-in-stdout'
                }, 'Redirect stderr in stdout');
                _this.option({
                  value: 'stdout-in-stderr'
                }, 'Redirect stdout in stderr');
                _this.option({
                  value: 'both'
                }, 'Display all streams');
                _this.option({
                  value: 'pty-stdout'
                }, 'Use pty.js + redirect stderr in stdout');
                return _this.option({
                  value: 'pty-stderr'
                }, 'Use pty.js + redirect stdout in stderr');
              });
            });
            return _this.div({
              "class": 'block hidden',
              outlet: 'pty'
            }, function() {
              _this.div({
                "class": 'block'
              }, function() {
                _this.label(function() {
                  _this.div({
                    "class": 'settings-name'
                  }, 'Number of Rows');
                  return _this.div(function() {
                    return _this.span({
                      "class": 'inline-block text-subtle'
                    }, 'Dimensions of pseudo terminal (for pty.js)');
                  });
                });
                return _this.subview('pty_rows', new TextEditorView({
                  mini: true,
                  placeholderText: '25'
                }));
              });
              return _this.div({
                "class": 'block'
              }, function() {
                _this.label(function() {
                  _this.div({
                    "class": 'settings-name'
                  }, 'Number of Columns');
                  return _this.div(function() {
                    return _this.span({
                      "class": 'inline-block text-subtle'
                    }, 'Dimensions of pseudo terminal (for pty.js)');
                  });
                });
                return _this.subview('pty_cols', new TextEditorView({
                  mini: true,
                  placeholderText: '80'
                }));
              });
            });
          });
          _this.div({
            "class": 'stream',
            outlet: 'stdout'
          });
          return _this.div({
            "class": 'stream',
            outlet: 'stderr'
          });
        };
      })(this));
    };

    HighlightingPane.prototype.attached = function() {
      this._stdout = new StreamPane;
      this._stderr = new StreamPane;
      this.stdout.append(this._stdout);
      this.stderr.append(this._stderr);
      return this.streams.on('change', this.pty, function(_arg) {
        var currentTarget, data, value;
        data = _arg.data, currentTarget = _arg.currentTarget;
        value = currentTarget.children[currentTarget.selectedIndex].value;
        if (value.startsWith('pty')) {
          return data.removeClass('hidden');
        } else {
          return data.addClass('hidden');
        }
      });
    };

    HighlightingPane.prototype.detached = function() {
      this.streams.off('change');
      this._stdout.remove();
      this._stderr.remove();
      this._stdout = null;
      this._stderr = null;
      this.stdout.empty();
      return this.stderr.empty();
    };

    HighlightingPane.prototype.set = function(command, sourceFile) {
      this._stdout.set(command, 'stdout', sourceFile);
      this._stderr.set(command, 'stderr', sourceFile);
      if (command != null) {
        return this.setStreamOption(command.environment.config.stdoe);
      } else {
        return this.setStreamOption('both');
      }
    };

    HighlightingPane.prototype.setStreamOption = function(stdoe) {
      var id, option, _i, _len, _ref1;
      _ref1 = this.streams.children();
      for (id = _i = 0, _len = _ref1.length; _i < _len; id = ++_i) {
        option = _ref1[id];
        if (option.attributes.getNamedItem('value').nodeValue === stdoe) {
          this.streams[0].selectedIndex = id;
          break;
        }
      }
      if (stdoe.startsWith('pty')) {
        return this.pty.removeClass('hidden');
      }
    };

    HighlightingPane.prototype.get = function(command) {
      var c, r, value;
      value = this.streams.children()[this.streams[0].selectedIndex].attributes.getNamedItem('value').nodeValue;
      if (value.startsWith('pty')) {
        r = 0;
        c = 0;
        if (this.pty_cols.getModel().getText() === '') {
          c = 80;
        } else {
          c = parseInt(this.pty_cols.getModel().getText());
          if (Number.isNaN(c)) {
            return "cols: " + (this.pty_cols.getModel().getText()) + " is not a number";
          }
        }
        if (this.pty_rows.getModel().getText() === '') {
          r = 25;
        } else {
          r = parseInt(this.pty_rows.getModel().getText());
          if (Number.isNaN(r)) {
            return "rows: " + (this.pty_rows.getModel().getText()) + " is not a number";
          }
        }
        command.environment = {
          name: 'ptyw',
          config: {
            stdoe: value,
            rows: r,
            cols: c
          }
        };
      } else {
        command.environment = {
          name: 'child_process',
          config: {
            stdoe: value
          }
        };
      }
      this._stdout.get(command, 'stdout');
      return this._stderr.get(command, 'stderr');
    };

    return HighlightingPane;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3ZpZXcvY29tbWFuZC1lZGl0LWhpZ2hsaWdodGluZy1wYW5lLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrREFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBZ0MsT0FBQSxDQUFRLHNCQUFSLENBQWhDLEVBQUMsU0FBQSxDQUFELEVBQUksVUFBQSxFQUFKLEVBQVEsc0JBQUEsY0FBUixFQUF3QixZQUFBLElBQXhCLENBQUE7O0FBQUEsRUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLDRCQUFSLENBRGIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFFSix1Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxnQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sWUFBUDtPQUFMLEVBQTBCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDeEIsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sUUFBUDtXQUFMLEVBQXNCLFNBQUEsR0FBQTtBQUNwQixZQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxPQUFQO2FBQUwsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLGNBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTyxTQUFBLEdBQUE7QUFDTCxnQkFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsa0JBQUEsT0FBQSxFQUFPLGVBQVA7aUJBQUwsRUFBNkIsZ0JBQTdCLENBQUEsQ0FBQTt1QkFDQSxLQUFDLENBQUEsR0FBRCxDQUFLLFNBQUEsR0FBQTt5QkFDSCxLQUFD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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/view/command-edit-highlighting-pane.coffee
