(function() {
  var MainPane, TextEditorView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), TextEditorView = _ref.TextEditorView, View = _ref.View;

  module.exports = MainPane = (function(_super) {
    __extends(MainPane, _super);

    function MainPane() {
      return MainPane.__super__.constructor.apply(this, arguments);
    }

    MainPane.content = function() {
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
              }, 'Command Name');
              return _this.div(function() {
                _this.span({
                  "class": 'inline-block text-subtle'
                }, 'Name of command when using ');
                return _this.span({
                  "class": 'inline-block highlight'
                }, 'build-tools:commands');
              });
            });
            _this.subview('command_name', new TextEditorView({
              mini: true
            }));
            _this.div({
              id: 'name-error-none',
              "class": 'error hidden'
            }, 'This field cannot be empty');
            return _this.div({
              id: 'name-error-used',
              "class": 'error hidden'
            }, 'Name already used in this project');
          });
          _this.div({
            "class": 'block'
          }, function() {
            _this.label(function() {
              _this.div({
                "class": 'settings-header'
              }, function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Command');
                return _this.div({
                  "class": 'wildcard-info icon-info'
                }, function() {
                  return _this.div({
                    "class": 'content'
                  }, function() {
                    _this.div({
                      "class": 'text-highlight bold'
                    }, 'Wildcards');
                    return _this.div({
                      "class": 'info'
                    }, function() {
                      _this.div({
                        "class": 'col'
                      }, function() {
                        _this.div('Current File');
                        _this.div('Base Path');
                        _this.div('Folder (rel.)');
                        return _this.div('File (no ext.)');
                      });
                      return _this.div({
                        "class": 'col'
                      }, function() {
                        _this.div({
                          "class": 'text-highlight'
                        }, '%f');
                        _this.div({
                          "class": 'text-highlight'
                        }, '%b');
                        _this.div({
                          "class": 'text-highlight'
                        }, '%d');
                        return _this.div({
                          "class": 'text-highlight'
                        }, '%e');
                      });
                    });
                  });
                });
              });
              return _this.div(function() {
                return _this.span({
                  "class": 'inline-block text-subtle'
                }, 'Command to execute ');
              });
            });
            _this.subview('command_text', new TextEditorView({
              mini: true
            }));
            return _this.div({
              id: 'command-error-none',
              "class": 'error hidden'
            }, 'This field cannot be empty');
          });
          return _this.div({
            "class": 'block'
          }, function() {
            _this.label(function() {
              _this.div({
                "class": 'settings-header'
              }, function() {
                _this.div({
                  "class": 'settings-name'
                }, 'Working Directory');
                return _this.div({
                  "class": 'wildcard-info icon-info'
                }, function() {
                  return _this.div({
                    "class": 'content'
                  }, function() {
                    _this.div({
                      "class": 'text-highlight bold'
                    }, 'Wildcards');
                    return _this.div({
                      "class": 'info'
                    }, function() {
                      _this.div({
                        "class": 'col'
                      }, function() {
                        _this.div('Current File');
                        _this.div('Base Path');
                        _this.div('Folder (rel.)');
                        return _this.div('File (no ext.)');
                      });
                      return _this.div({
                        "class": 'col'
                      }, function() {
                        _this.div({
                          "class": 'text-highlight'
                        }, '%f');
                        _this.div({
                          "class": 'text-highlight'
                        }, '%b');
                        _this.div({
                          "class": 'text-highlight'
                        }, '%d');
                        return _this.div({
                          "class": 'text-highlight'
                        }, '%e');
                      });
                    });
                  });
                });
              });
              return _this.div(function() {
                return _this.span({
                  "class": 'inline-block text-subtle'
                }, 'Directory to execute command in');
              });
            });
            return _this.subview('working_directory', new TextEditorView({
              mini: true,
              placeholderText: '.'
            }));
          });
        };
      })(this));
    };

    MainPane.prototype.set = function(command) {
      if (command != null) {
        this.command_name.getModel().setText(command.name);
        this.command_text.getModel().setText(command.command);
        return this.working_directory.getModel().setText(command.wd);
      } else {
        this.command_name.getModel().setText('');
        this.command_text.getModel().setText('');
        return this.working_directory.getModel().setText('.');
      }
    };

    MainPane.prototype.get = function(command) {
      var c, n, w;
      if ((n = this.command_name.getModel().getText()) === '') {
        return 'Empty Name';
      }
      if ((c = this.command_text.getModel().getText()) === '') {
        return 'Empty Command';
      }
      if ((w = this.working_directory.getModel()).getText() === '') {
        w.setText('.');
      }
      command.name = n;
      command.command = c;
      command.wd = w.getText();
      return null;
    };

    return MainPane;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3ZpZXcvY29tbWFuZC1lZGl0LW1haW4tcGFuZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsb0NBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQXlCLE9BQUEsQ0FBUSxzQkFBUixDQUF6QixFQUFDLHNCQUFBLGNBQUQsRUFBaUIsWUFBQSxJQUFqQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUVKLCtCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFFBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLG1CQUFQO09BQUwsRUFBaUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUMvQixVQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxPQUFQO1dBQUwsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLFlBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTyxTQUFBLEdBQUE7QUFDTCxjQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxnQkFBQSxPQUFBLEVBQU8sZUFBUDtlQUFMLEVBQTZCLGNBQTdCLENBQUEsQ0FBQTtxQkFDQSxLQUFDLENBQUEsR0FBRCxDQUFLLFNBQUEsR0FBQTtBQUNILGdCQUFBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxrQkFBQSxPQUFBLEVBQU8sMEJBQVA7aUJBQU4sRUFBeUMsNkJBQXpDLENBQUEsQ0FBQTt1QkFDQSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsa0JBQUEsT0FBQSxFQUFPLHdCQUFQO2lCQUFOLEVBQXVDLHNCQUF2QyxFQUZHO2NBQUEsQ0FBTCxF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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/view/command-edit-main-pane.coffee
