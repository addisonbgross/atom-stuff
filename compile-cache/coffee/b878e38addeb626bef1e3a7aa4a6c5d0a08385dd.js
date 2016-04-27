(function() {
  var BuildToolsProjectExternal, Command, Project, TextEditorView, View, path, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Command = null;

  path = null;

  _ref = require('atom-space-pen-views'), View = _ref.View, TextEditorView = _ref.TextEditorView;

  Project = null;

  module.exports = {
    name: 'Link to configuration file',
    singular: 'External Command',
    activate: function(command, project) {
      Command = command;
      Project = project;
      return path = require('path');
    },
    deactivate: function() {
      Command = null;
      Project = null;
      return path = null;
    },
    model: BuildToolsProjectExternal = (function() {
      function BuildToolsProjectExternal(_arg, config, _save) {
        var file;
        this.projectPath = _arg[0];
        this.config = config;
        this._save = _save != null ? _save : null;
        if (this._save != null) {
          return;
        }
        file = path.resolve(this.projectPath, this.config.file);
        if (!this.config.overwrite) {
          this.projectPath = path.dirname(file);
        }
        try {
          this.project = new Project(this.projectPath, file);
        } catch (_error) {
          this.project = null;
        }
      }

      BuildToolsProjectExternal.prototype.save = function() {
        return this._save();
      };

      BuildToolsProjectExternal.prototype.destroy = function() {
        var _ref1;
        this.projectPath = null;
        this.config = null;
        this._save = null;
        if (this._save != null) {
          return;
        }
        if ((_ref1 = this.project) != null) {
          _ref1.destroy();
        }
        return this.project = null;
      };

      BuildToolsProjectExternal.prototype.getCommandByIndex = function(id) {
        return new Promise((function(_this) {
          return function(resolve, reject) {
            if (_this.project == null) {
              throw new Error("Could not load project file " + _this.config.file);
            }
            return _this.project.getCommandByIndex(id).then(resolve, reject);
          };
        })(this));
      };

      BuildToolsProjectExternal.prototype.getCommandCount = function() {
        return new Promise((function(_this) {
          return function(resolve, reject) {
            if (_this.project == null) {
              throw new Error("Could not load project file " + _this.config.file);
            }
            return _this.project.getCommandNameObjects().then((function(arr) {
              return resolve(arr.length);
            }), reject);
          };
        })(this));
      };

      BuildToolsProjectExternal.prototype.getCommandNames = function() {
        return new Promise((function(_this) {
          return function(resolve, reject) {
            if (_this.project == null) {
              throw new Error("Could not load project file " + _this.config.file);
            }
            return _this.project.getCommandNameObjects().then((function(commands) {
              var command;
              return resolve((function() {
                var _i, _len, _results;
                _results = [];
                for (_i = 0, _len = commands.length; _i < _len; _i++) {
                  command = commands[_i];
                  _results.push(command.name);
                }
                return _results;
              })());
            }), reject);
          };
        })(this));
      };

      return BuildToolsProjectExternal;

    })(),
    view: BuildToolsProjectExternal = (function(_super) {
      __extends(BuildToolsProjectExternal, _super);

      function BuildToolsProjectExternal() {
        return BuildToolsProjectExternal.__super__.constructor.apply(this, arguments);
      }

      BuildToolsProjectExternal.content = function() {
        return this.div({
          "class": 'inset-panel'
        }, (function(_this) {
          return function() {
            _this.div({
              "class": 'top panel-heading'
            }, function() {
              _this.div(function() {
                _this.span({
                  id: 'provider-name',
                  "class": 'inline-block panel-text icon icon-file-symlink-file'
                });
                return _this.span({
                  id: 'apply',
                  "class": 'inline-block btn btn-xs icon icon-check'
                }, 'Apply');
              });
              return _this.div({
                "class": 'config-buttons align'
              }, function() {
                _this.div({
                  "class": 'icon-triangle-up'
                });
                _this.div({
                  "class": 'icon-triangle-down'
                });
                return _this.div({
                  "class": 'icon-x'
                });
              });
            });
            return _this.div({
              "class": 'panel-body padded'
            }, function() {
              _this.div({
                "class": 'block'
              }, function() {
                _this.label(function() {
                  _this.div({
                    "class": 'settings-name'
                  }, 'File Location');
                  return _this.div(function() {
                    return _this.span({
                      "class": 'inline-block text-subtle'
                    }, 'Path to .build-tools.cson file');
                  });
                });
                return _this.subview('path', new TextEditorView({
                  mini: true
                }));
              });
              return _this.div({
                "class": 'block checkbox'
              }, function() {
                _this.input({
                  id: 'overwrite_wd',
                  type: 'checkbox'
                });
                return _this.label(function() {
                  _this.div({
                    "class": 'settings-name'
                  }, 'Overwrite working directory');
                  return _this.div(function() {
                    _this.span({
                      "class": 'inline-block text-subtle'
                    }, 'Execute command relative to ');
                    _this.span({
                      "class": 'inline-block text-highlight'
                    }, 'this');
                    return _this.span({
                      "class": 'inline-block text-subtle'
                    }, ' config file instead of the external one');
                  });
                });
              });
            });
          };
        })(this));
      };

      BuildToolsProjectExternal.prototype.initialize = function(project) {
        var _ref1;
        this.project = project;
        this.path.getModel().setText((_ref1 = this.project.config.file) != null ? _ref1 : '');
        return this.find('#overwrite_wd').prop('checked', this.project.config.overwrite);
      };

      BuildToolsProjectExternal.prototype.destroy = function() {
        return this.project = null;
      };

      BuildToolsProjectExternal.prototype.attached = function() {
        return this.on('click', '#apply', (function(_this) {
          return function() {
            var p, _ref1;
            if ((p = _this.path.getModel().getText()) !== '') {
              _this.project.config.file = p;
              _this.project.config.overwrite = _this.find('#overwrite_wd').prop('checked');
              return _this.project.save();
            } else {
              return (_ref1 = atom.notifications) != null ? _ref1.addError('Path must not be empty') : void 0;
            }
          };
        })(this));
      };

      return BuildToolsProjectExternal;

    })(View)
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3Byb3ZpZGVyL2J1aWxkLXRvb2xzLWV4dGVybmFsLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw2RUFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBQSxHQUFVLElBQVYsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxJQURQLENBQUE7O0FBQUEsRUFFQSxPQUF5QixPQUFBLENBQVEsc0JBQVIsQ0FBekIsRUFBQyxZQUFBLElBQUQsRUFBTyxzQkFBQSxjQUZQLENBQUE7O0FBQUEsRUFHQSxPQUFBLEdBQVUsSUFIVixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsSUFBQSxFQUFNLDRCQUFOO0FBQUEsSUFDQSxRQUFBLEVBQVUsa0JBRFY7QUFBQSxJQUdBLFFBQUEsRUFBVSxTQUFDLE9BQUQsRUFBVSxPQUFWLEdBQUE7QUFDUixNQUFBLE9BQUEsR0FBVSxPQUFWLENBQUE7QUFBQSxNQUNBLE9BQUEsR0FBVSxPQURWLENBQUE7YUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsRUFIQztJQUFBLENBSFY7QUFBQSxJQVFBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixNQUFBLE9BQUEsR0FBVSxJQUFWLENBQUE7QUFBQSxNQUNBLE9BQUEsR0FBVSxJQURWLENBQUE7YUFFQSxJQUFBLEdBQU8sS0FIRztJQUFBLENBUlo7QUFBQSxJQWFBLEtBQUEsRUFDUTtBQUVTLE1BQUEsbUNBQUMsSUFBRCxFQUFrQixNQUFsQixFQUEyQixLQUEzQixHQUFBO0FBQ1gsWUFBQSxJQUFBO0FBQUEsUUFEYSxJQUFDLENBQUEsY0FBRixPQUNaLENBQUE7QUFBQSxRQUQ0QixJQUFDLENBQUEsU0FBQSxNQUM3QixDQUFBO0FB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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/provider/build-tools-external.coffee
