(function() {
  var BuildToolsPane, BuildToolsProject, CSON, Command, CommandInfoPane, CompositeDisposable, Emitter, View, fs, notify, path,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fs = null;

  path = null;

  Emitter = null;

  Command = null;

  CommandInfoPane = null;

  CSON = null;

  CompositeDisposable = null;

  View = require('atom-space-pen-views').View;

  notify = function(message) {
    var _ref;
    if ((_ref = atom.notifications) != null) {
      _ref.addError(message);
    }
    return console.log('build-tools: ' + message);
  };

  module.exports = {
    name: 'Custom Commands',
    singular: 'Custom Command',
    activate: function(command) {
      var _ref;
      fs = require('fs');
      path = require('path');
      _ref = require('atom'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;
      Command = command;
      CommandInfoPane = require('../view/command-info-pane');
      return CSON = require('season');
    },
    deactivate: function() {
      fs = null;
      path = null;
      Emitter = null;
      Command = null;
      CommandInfoPane = null;
      return CSON = null;
    },
    model: BuildToolsProject = (function() {
      function BuildToolsProject(_arg, config, _save) {
        var command, project, _i, _len, _ref;
        project = _arg[0], this.sourceFile = _arg[1];
        this.config = config;
        this._save = _save;
        this.path = project;
        if (this._save != null) {
          this.emitter = new Emitter;
        }
        this.commands = [];
        if (this.config.commands != null) {
          _ref = this.config.commands;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            command = _ref[_i];
            command.project = this.path;
            command.source = this.sourceFile;
            this.commands.push(new Command(command));
          }
        }
        this.config.commands = this.commands;
      }

      BuildToolsProject.prototype.save = function() {
        return this._save();
      };

      BuildToolsProject.prototype.destroy = function() {
        if (this._save != null) {
          this.emitter.dispose();
        }
        this._save = null;
        this.commands = [];
        this.config = null;
        this.sourceFile = null;
        return this.path = null;
      };

      BuildToolsProject.prototype.getCommandByIndex = function(id) {
        return this.commands[id];
      };

      BuildToolsProject.prototype.getCommandCount = function() {
        return this.commands.length;
      };

      BuildToolsProject.prototype.getCommandNames = function() {
        var c, _i, _len, _ref, _results;
        _ref = this.commands;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          c = _ref[_i];
          _results.push(c.name);
        }
        return _results;
      };

      BuildToolsProject.prototype.getCommands = function() {
        return this.commands;
      };

      BuildToolsProject.prototype.addCommand = function(item) {
        if (this.getCommandIndex(item.name) === -1) {
          item['project'] = this.path;
          item['source'] = this.sourceFile;
          this.commands.push(new Command(item));
          this.emitter.emit('change');
          return true;
        } else {
          notify("Command \"" + item.name + "\" already exists");
          return false;
        }
      };

      BuildToolsProject.prototype.removeCommand = function(name) {
        var i;
        if ((i = this.getCommandIndex(name)) !== -1) {
          this.commands.splice(i, 1)[0];
          this.emitter.emit('change');
          return true;
        } else {
          notify("Command \"" + name + "\" not found");
          return false;
        }
      };

      BuildToolsProject.prototype.replaceCommand = function(oldname, item) {
        var i;
        if ((i = this.getCommandIndex(oldname)) !== -1) {
          item['project'] = this.path;
          item['source'] = this.sourceFile;
          this.commands.splice(i, 1, item);
          this.emitter.emit('change');
          return true;
        } else {
          notify("Command \"" + oldname + "\" not found");
          return false;
        }
      };

      BuildToolsProject.prototype.moveCommand = function(name, offset) {
        var i;
        if ((i = this.getCommandIndex(name)) !== -1) {
          this.commands.splice(i + offset, 0, this.commands.splice(i, 1)[0]);
          this.emitter.emit('change');
          return true;
        } else {
          notify("Command \"" + name + "\" not found");
          return false;
        }
      };

      BuildToolsProject.prototype.hasCommand = function(name) {
        return this.getCommandIndex(name !== -1);
      };

      BuildToolsProject.prototype.getCommandIndex = function(name) {
        var cmd, index, _i, _len, _ref;
        _ref = this.commands;
        for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
          cmd = _ref[index];
          if (cmd.name === name) {
            return index;
          }
        }
        return -1;
      };

      BuildToolsProject.prototype.onChange = function(callback) {
        return this.emitter.on('change', callback);
      };

      return BuildToolsProject;

    })(),
    view: BuildToolsPane = (function(_super) {
      __extends(BuildToolsPane, _super);

      function BuildToolsPane() {
        this.accept = __bind(this.accept, this);
        return BuildToolsPane.__super__.constructor.apply(this, arguments);
      }

      BuildToolsPane.content = function() {
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
                  "class": 'inline-block panel-text icon icon-code'
                });
                return _this.span({
                  id: 'add-command-button',
                  "class": 'inline-block btn btn-xs icon icon-plus'
                }, 'Add command');
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
              return _this.div({
                "class": 'command-list',
                outlet: 'command_list'
              });
            });
          };
        })(this));
      };

      BuildToolsPane.prototype.initialize = function(project) {
        this.project = project;
        return this.disposable = this.project.onChange((function(_this) {
          return function() {
            _this.project.save();
            _this.command_list.html('');
            return _this.addCommands();
          };
        })(this));
      };

      BuildToolsPane.prototype.setCallbacks = function(hidePanes, showPane) {
        this.hidePanes = hidePanes;
        this.showPane = showPane;
      };

      BuildToolsPane.prototype.destroy = function() {
        var _ref;
        this.disposable.dispose();
        this.project = null;
        this.hidePanes = null;
        this.showPane = null;
        if ((_ref = this.commandPane) != null) {
          _ref.destroy();
        }
        return this.commandPane = null;
      };

      BuildToolsPane.prototype.accept = function(c) {
        return this.project.addCommand(c);
      };

      BuildToolsPane.prototype.attached = function() {
        this.on('click', '#add-command-button', (function(_this) {
          return function(e) {
            var _ref;
            if ((_ref = _this.commandPane) != null) {
              _ref.destroy();
            }
            _this.commandPane = atom.views.getView(new Command);
            _this.commandPane.setSource(_this.project.sourceFile);
            _this.commandPane.setCallbacks(_this.accept, _this.hidePanes);
            return _this.showPane(_this.commandPane);
          };
        })(this));
        return this.addCommands();
      };

      BuildToolsPane.prototype.detached = function() {
        return this.off('click', '#add-command-button');
      };

      BuildToolsPane.prototype.addCommands = function() {
        var command, down, edit, pane, remove, up, _i, _len, _ref, _results;
        this.command_list.html('');
        _ref = this.project.getCommands();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          command = _ref[_i];
          pane = new CommandInfoPane(command);
          up = (function(_this) {
            return function(command) {
              return _this.project.moveCommand(command.name, -1);
            };
          })(this);
          down = (function(_this) {
            return function(command) {
              return _this.project.moveCommand(command.name, 1);
            };
          })(this);
          edit = (function(_this) {
            return function(command) {
              var c;
              c = new Command(command);
              c.oldname = c.name;
              c.project = _this.project.projectPath;
              _this.commandPane = atom.views.getView(c);
              _this.commandPane.sourceFile = _this.project.sourceFile;
              _this.commandPane.setCallbacks(function(_command, oldname) {
                return _this.project.replaceCommand(oldname, _command);
              }, _this.hidePanes);
              return _this.showPane(_this.commandPane);
            };
          })(this);
          remove = (function(_this) {
            return function(command) {
              return _this.project.removeCommand(command.name);
            };
          })(this);
          pane.setCallbacks(up, down, edit, remove);
          _results.push(this.command_list.append(pane));
        }
        return _results;
      };

      return BuildToolsPane;

    })(View)
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3Byb3ZpZGVyL2J1aWxkLXRvb2xzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1SEFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxJQUFMLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sSUFEUCxDQUFBOztBQUFBLEVBRUEsT0FBQSxHQUFVLElBRlYsQ0FBQTs7QUFBQSxFQUdBLE9BQUEsR0FBVSxJQUhWLENBQUE7O0FBQUEsRUFJQSxlQUFBLEdBQWtCLElBSmxCLENBQUE7O0FBQUEsRUFLQSxJQUFBLEdBQU8sSUFMUCxDQUFBOztBQUFBLEVBTUEsbUJBQUEsR0FBc0IsSUFOdEIsQ0FBQTs7QUFBQSxFQU9DLE9BQVEsT0FBQSxDQUFRLHNCQUFSLEVBQVIsSUFQRCxDQUFBOztBQUFBLEVBU0EsTUFBQSxHQUFTLFNBQUMsT0FBRCxHQUFBO0FBQ1AsUUFBQSxJQUFBOztVQUFrQixDQUFFLFFBQXBCLENBQTZCLE9BQTdCO0tBQUE7V0FDQSxPQUFPLENBQUMsR0FBUixDQUFZLGVBQUEsR0FBa0IsT0FBOUIsRUFGTztFQUFBLENBVFQsQ0FBQTs7QUFBQSxFQWFBLE1BQU0sQ0FBQyxPQUFQLEdBRUU7QUFBQSxJQUFBLElBQUEsRUFBTSxpQkFBTjtBQUFBLElBQ0EsUUFBQSxFQUFVLGdCQURWO0FBQUEsSUFHQSxRQUFBLEVBQVUsU0FBQyxPQUFELEdBQUE7QUFDUixVQUFBLElBQUE7QUFBQSxNQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUFMLENBQUE7QUFBQSxNQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7QUFBQSxNQUVBLE9BQWlDLE9BQUEsQ0FBUSxNQUFSLENBQWpDLEVBQUMsZUFBQSxP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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/provider/build-tools.coffee
