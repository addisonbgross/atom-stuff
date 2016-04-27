(function() {
  var CSON, Emitter, ProjectConfig, Providers, path,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CSON = require('season');

  Providers = require('./provider');

  Emitter = require('atom').Emitter;

  path = require('path');

  module.exports = ProjectConfig = (function() {
    function ProjectConfig(projectPath, filePath, viewed) {
      var commands, data, l, p, provider, providers, save, _i, _len;
      this.projectPath = projectPath;
      this.filePath = filePath;
      this.viewed = viewed != null ? viewed : false;
      this.migrateGlobal = __bind(this.migrateGlobal, this);
      this.save = __bind(this.save, this);
      if (this.viewed) {
        this.emitter = new Emitter;
      }
      this.providers = [];
      data = CSON.readFileSync(this.filePath);
      if (data !== null) {
        providers = data.providers;
        commands = data.commands;
      } else {
        providers = [];
      }
      save = false;
      if ((commands != null) && (providers == null)) {
        save = true;
        providers = [];
        this.migrateLocal(commands, providers);
      }
      if (providers == null) {
        return;
      }
      for (_i = 0, _len = providers.length; _i < _len; _i++) {
        p = providers[_i];
        if (Providers.activate(p.key) !== true) {
          continue;
        }
        l = this.providers.push({
          key: p.key,
          config: p.config,
          model: Providers.modules[p.key].model,
          "interface": new Providers.modules[p.key].model([this.projectPath, this.filePath], p.config, this.viewed ? this.save : void 0)
        });
        if (!this.viewed) {
          continue;
        }
        if (Providers.modules[p.key].view == null) {
          continue;
        }
        provider = this.providers[l - 1];
        provider.view = new Providers.modules[p.key].view(provider["interface"]);
      }
      if (save) {
        this.save();
      }
      null;
    }

    ProjectConfig.prototype.destroy = function() {
      var provider, _base, _i, _len, _ref, _ref1, _ref2;
      if ((_ref = this.emitter) != null) {
        _ref.dispose();
      }
      _ref1 = this.providers;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        provider = _ref1[_i];
        if ((_ref2 = provider.view) != null) {
          if (typeof _ref2.destroy === "function") {
            _ref2.destroy();
          }
        }
        if (typeof (_base = provider["interface"]).destroy === "function") {
          _base.destroy();
        }
      }
      this.providers = null;
      return this.global_data = null;
    };

    ProjectConfig.prototype.onSave = function(callback) {
      return this.emitter.on('save', callback);
    };

    ProjectConfig.prototype.getCommandById = function(pid, id) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var c, _ref, _ref1;
          if ((c = (_ref = _this.providers[pid]) != null ? (_ref1 = _ref["interface"]) != null ? _ref1.getCommandByIndex(id) : void 0 : void 0) instanceof Promise) {
            return c.then((function(command) {
              return resolve(command);
            }), reject);
          } else if (c != null) {
            return resolve(c);
          } else {
            throw new Error("Could not get Command #" + id + " from " + pid);
          }
        };
      })(this));
    };

    ProjectConfig.prototype.getCommandByIndex = function(id) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          _this._providers = _this.providers.slice().reverse();
          _this.f = 0;
          return _this._getCommandByIndex(id, resolve, reject);
        };
      })(this));
    };

    ProjectConfig.prototype.getCommandNameObjects = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          _this._providers = _this.providers.slice().reverse();
          _this._return = [];
          return _this._getCommandNameObjects(resolve, reject);
        };
      })(this));
    };

    ProjectConfig.prototype.addProvider = function(key) {
      var l;
      if (Providers.activate(key) !== true) {
        return false;
      }
      l = this.providers.push({
        key: key,
        config: {},
        model: Providers.modules[key].model
      });
      this.providers[l - 1]["interface"] = new Providers.modules[key].model([this.projectPath, this.filePath], this.providers[l - 1].config, this.save);
      if (this.viewed && (Providers.modules[key].view != null)) {
        this.providers[l - 1].view = new Providers.modules[key].view(this.providers[l - 1]["interface"]);
      }
      this.save();
      return true;
    };

    ProjectConfig.prototype.removeProvider = function(index) {
      if (!(this.providers.length > index)) {
        return false;
      }
      this.providers.splice(index, 1)[0];
      this.save();
      return true;
    };

    ProjectConfig.prototype.moveProviderUp = function(index) {
      if ((index === 0) || (index >= this.providers.length)) {
        return false;
      }
      this.providers.splice(index - 1, 0, this.providers.splice(index, 1)[0]);
      this.save();
      return true;
    };

    ProjectConfig.prototype.moveProviderDown = function(index) {
      if (index >= this.providers.length - 1) {
        return false;
      }
      this.providers.splice(index, 0, this.providers.splice(index + 1, 1)[0]);
      this.save();
      return true;
    };

    ProjectConfig.prototype._getCommandByIndex = function(id, resolve, reject) {
      var c, p, _ref, _ref1;
      if ((p = this._providers.pop()) == null) {
        return reject(new Error("Command #" + (id + 1) + " not found"));
      }
      if ((c = (_ref = p["interface"]) != null ? _ref.getCommandByIndex(id - this.f) : void 0) instanceof Promise) {
        return c.then(resolve, (function(_this) {
          return function() {
            var _ref1;
            if ((c = (_ref1 = p["interface"]) != null ? _ref1.getCommandCount() : void 0) instanceof Promise) {
              return c.then((function(count) {
                _this.f = _this.f + count;
                return _this._getCommandByIndex(id, resolve, reject);
              }), reject);
            } else {
              _this.f = _this.f + (c != null ? c : 0);
              return _this._getCommandByIndex(id, resolve, reject);
            }
          };
        })(this));
      } else if (c != null) {
        return resolve(c);
      } else {
        if ((c = (_ref1 = p["interface"]) != null ? _ref1.getCommandCount() : void 0) instanceof Promise) {
          return c.then(((function(_this) {
            return function(count) {
              _this.f = _this.f + count;
              return _this._getCommandByIndex(id, resolve, reject);
            };
          })(this)), reject);
        } else {
          this.f = this.f + (c != null ? c : 0);
          return this._getCommandByIndex(id, resolve, reject);
        }
      }
    };

    ProjectConfig.prototype._getCommandNameObjects = function(resolve, reject) {
      var c, command, i, p, _ref;
      if ((p = this._providers.pop()) == null) {
        return resolve(this._return);
      }
      if ((c = (_ref = p["interface"]) != null ? _ref.getCommandNames() : void 0) instanceof Promise) {
        c.then(((function(_this) {
          return function(commands) {
            var command, i, _commands;
            _commands = (function() {
              var _i, _len, _results;
              _results = [];
              for (i = _i = 0, _len = commands.length; _i < _len; i = ++_i) {
                command = commands[i];
                _results.push({
                  name: command,
                  singular: Providers.modules[p.key].singular,
                  origin: p.key,
                  id: i,
                  pid: this.providers.length - this._providers.length - 1
                });
              }
              return _results;
            }).call(_this);
            _this._return = _this._return.concat(_commands);
            return _this._getCommandNameObjects(resolve, reject);
          };
        })(this)), reject);
        return;
      } else if (c != null) {
        this._return = this._return.concat((function() {
          var _i, _len, _results;
          _results = [];
          for (i = _i = 0, _len = c.length; _i < _len; i = ++_i) {
            command = c[i];
            _results.push({
              name: command,
              singular: Providers.modules[p.key].singular,
              origin: p.key,
              id: i,
              pid: this.providers.length - this._providers.length - 1
            });
          }
          return _results;
        }).call(this));
      }
      return this._getCommandNameObjects(resolve, reject);
    };

    ProjectConfig.prototype.save = function() {
      var provider, providers, _i, _len, _ref;
      providers = [];
      _ref = this.providers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        provider = _ref[_i];
        providers.push({
          key: provider.key,
          config: provider.config
        });
      }
      CSON.writeFileSync(this.filePath, {
        providers: providers
      });
      return this.emitter.emit('save');
    };

    ProjectConfig.migrateCommand = function(c) {
      var command, key, _i, _len, _ref;
      command = {};
      _ref = ['project', 'name', 'command', 'wd'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        command[key] = c[key];
      }
      if (c.version == null) {
        c.version = 1;
        if (c.stdout.highlighting === 'hc') {
          c.stdout.profile = 'gcc_clang';
        }
        if (c.stderr.highlighting === 'hc') {
          c.stderr.profile = 'gcc_clang';
        }
      }
      if (c.version === 1) {
        c.version = 2;
        c.save_all = true;
        c.close_success = false;
      }
      command.modifier = {};
      if (c.save_all) {
        command.modifier.save_all = {};
      }
      if (c.shell) {
        command.modifier.shell = {
          command: 'bash -c'
        };
      }
      if (c.wildcards) {
        command.modifier.wildcards = {};
      }
      command.stdout = c.stdout;
      command.stderr = c.stderr;
      command.output = {};
      command.output.console = {};
      command.output.console.close_success = c.close_success;
      command.output.console.queue_in_buffer = true;
      if ((c.stderr.profile != null) || (c.stdout.profile != null)) {
        command.output.linter = {
          no_trace: false
        };
      }
      command.version = 1;
      return command;
    };

    ProjectConfig.prototype.migrateLocal = function(commands, providers) {
      var command, _i, _len, _ref;
      providers.push({
        key: 'bt',
        config: {
          commands: []
        }
      });
      for (_i = 0, _len = commands.length; _i < _len; _i++) {
        command = commands[_i];
        providers[0].config.commands.push(ProjectConfig.migrateCommand(command));
      }
      return (_ref = atom.notifications) != null ? _ref.addWarning("Imported " + commands.length + " local command(s)") : void 0;
    };

    ProjectConfig.prototype.migrateGlobal = function() {
      var command, provider, _i, _len, _ref, _results;
      this.addProvider('bt');
      provider = this.providers[this.providers.length - 1]["interface"];
      _ref = this.global_data[this.projectPath].commands;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        command = _ref[_i];
        _results.push(provider.addCommand(ProjectConfig.migrateCommand(command)));
      }
      return _results;
    };

    ProjectConfig.prototype.hasGlobal = function(callback) {
      return CSON.readFile(path.join(path.dirname(atom.config.getUserConfigPath()), 'build-tools-cpp.projects'), (function(_this) {
        return function(err, global_data) {
          _this.global_data = global_data;
          if (err != null) {
            return;
          }
          if (_this.global_data[_this.projectPath] != null) {
            return callback();
          }
        };
      })(this));
    };

    return ProjectConfig;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3Byb3ZpZGVyL3Byb2plY3QuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZDQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxZQUFSLENBRFosQ0FBQTs7QUFBQSxFQUdDLFVBQVcsT0FBQSxDQUFRLE1BQVIsRUFBWCxPQUhELENBQUE7O0FBQUEsRUFLQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FMUCxDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUVTLElBQUEsdUJBQUUsV0FBRixFQUFnQixRQUFoQixFQUEyQixNQUEzQixHQUFBO0FBQ1gsVUFBQSx5REFBQTtBQUFBLE1BRFksSUFBQyxDQUFBLGNBQUEsV0FDYixDQUFBO0FBQUEsTUFEMEIsSUFBQyxDQUFBLFdBQUEsUUFDM0IsQ0FBQTtBQUFBLE1BRHFDLElBQUMsQ0FBQSwwQkFBQSxTQUFTLEtBQy9DLENBQUE7QUFBQSwyREFBQSxDQUFBO0FBQUEseUNBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBMEIsSUFBQyxDQUFBLE1BQTNCO0FBQUEsUUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQUFYLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFNBQUQsR0FBYSxFQURiLENBQUE7QUFBQSxNQUVBLElBQUEsR0FBTyxJQUFJLENBQUMsWUFBTCxDQUFrQixJQUFDLENBQUEsUUFBbkIsQ0FGUCxDQUFBO0FBR0EsTUFBQSxJQUFHLElBQUEsS0FBVSxJQUFiO0FBQ0UsUUFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLFNBQWpCLENBQUE7QUFBQSxRQUNBLFFBQUEsR0FBVyxJQUFJLENBQUMsUUFEaEIsQ0FERjtPQUFBLE1BQUE7QUFJRSxRQUFBLFNBQUEsR0FBWSxFQUFaLENBSkY7T0FIQTtBQUFBLE1BUUEsSUFBQSxHQUFPLEtBUlAsQ0FBQTtBQVNBLE1BQUEsSUFBRyxrQkFBQSxJQUFrQixtQkFBckI7QUFDRSxRQUFBLElBQUEsR0FBTyxJQUFQLENBQUE7QUFBQSxRQUNBLFNBQUEsR0FBWSxFQURaLENBQUE7QUFBQSxRQUVBLElBQUMsQ0FBQSxZQUFELENBQWMsUUFBZCxFQUF3QixTQUF4QixDQUZBLENBREY7T0FUQTtBQWNBLE1BQUEsSUFBYyxpQkFBZDtBQUFBLGNBQUEsQ0FBQTtPQWRBO0FBZ0JBLFdBQUEsZ0RBQUE7MEJBQUE7QUFDRSxRQUFBLElBQWdCLFNBQVMsQ0FBQyxRQUFWLENBQW1CLENBQUMsQ0FBQyxHQUFyQixDQUFBLEtBQTZCLElBQTdDO0FBQUEsbUJBQUE7U0FBQTtBQUFBLFFBQ0EsQ0FBQSxHQUFJLElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBWCxDQUFnQjtBQUFBLFVBQ2xCLEdBQUEsRUFBSyxDQUFDLENBQUMsR0FEVztBQUFBLFVBRWxCLE1BQUEsRUFBUSxDQUFDLENBQUMsTUFGUTtBQUFBLFVBR2xCLEtBQUEsRUFBTyxTQUFTLENBQUMsT0FBUSxDQUFBLENBQUMsQ0FBQyxHQUFGLENBQU0sQ0FBQyxLQUhkO0FBQUEsVUFJbEIsV0FBQSxFQUFlLElBQUEsU0FBUyxDQUFDLE9BQVEsQ0FBQSxDQUFDLENBQUMsR0FBRixDQUFNLENBQUMsS0FBekIsQ0FBK0IsQ0FBQyxJQUFDLENBQUEsV0FBRixFQUFlLElBQUMsQ0FBQSxRQUFoQixDQUEvQixFQUEwRCxDQUFDLENBQUMsTUFBNUQsRUFBdUUsSUFBQyxDQUFBLE1BQUosR0FBZ0IsSUFBQyxDQUFBLElBQWpCLEdBQUEsTUFBcEUsQ0FKRztTQUFoQixDQURKLENBQUE7QUFPQSxRQUFBLElBQUEsQ0FBQSxJQUFpQixDQUFBLE1BQWpCO0FBQUEsbUJBQUE7U0FQQTtBQVFBLFFBQUEsSUFBZ0IscUNBQWhCO0FBQUEsbUJBQUE7U0FSQTtBQUFBLFFBU0EsUUFBQSxHQUFXLElBQUMsQ0FBQSxTQUFVLENBQUEsQ0FBQSxHQUFJLENBQUosQ0FUdEIsQ0FBQTtBQUFBLFFBVUEsUUFBUSxDQUFDLElBQVQsR0FBb0IsSUFBQSxTQUFTLENBQUMsT0FBUSxDQUFBLENBQUMsQ0FBQyxHQUFGLENBQU0sQ0FBQyxJQUF6QixDQUE4QixRQUFRLENBQUMsV0FBRCxDQUF0QyxDQVZwQixDQURGO0FBQUEsT0FoQkE7QUE0QkEsTUFBQSxJQUFXLElBQVg7QUFBQSxRQUFBLElBQUMsQ0FBQSxJQUFELENBQUEsQ0FBQSxDQUFBO09BNUJBO0FBQUEsTUE2QkEsSUE3QkEsQ0FEVztJQUFBLENBQWI7O0FBQUEsNEJBZ0NBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxVQUFBLDZDQUFBOztZQUFRLENBQUUsT0FBVixDQUFBO09BQUE7QUFDQTtBQUFBLFdBQUEsNENBQUE7NkJBQUE7OztpQkFDZSxDQUFFOztTQUFmOztlQUNrQixDQUFDO1NBRnJCO0FBQUEsT0FEQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUpiLENBQUE7YUFLQSxJQUFDLENBQUEsV0FBRCxHQUFlLEtBTlI7SUFBQSxDQWhDVCxDQUFBOztBQUFBLDRCQTRDQSxNQUFBLEdBQVEsU0FBQyxRQUFELEdBQUE7YUFDTixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxNQUFaLEVBQW9CLFFBQXBCLEVBRE07SUFBQSxDQTVDUixDQUFBOztBQUFBLDRCQW1EQSxjQUFBLEdBQWdCLFNBQUMsR0FBRCxFQUFNLEVBQU4sR0FBQTthQUNWLElBQUEsT0FBQSxDQUFRLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7QUFDVixjQUFBLGNBQUE7QUFBQSxVQUFBLElBQUcsQ0FBQyxDQUFBLHNGQUE4QixDQUFFLGlCQUE1QixDQUE4QyxFQUE5QyxtQkFBTCxDQUFBLFlBQWtFLE9BQXJFO21CQUNFLENBQUMsQ0FBQyxJQUFGLENBQU8sQ0FBQyxTQUFDLE9BQUQsR0FBQTtxQkFBYSxPQUFBLENBQVEsT0FBUixFQUFiO1lBQUEsQ0FBRCxDQUFQLEVBQXdDLE1BQXhDLEVBREY7V0FBQSxNQUVLLElBQUcsU0FBSDttQkFDSCxPQUFBLENBQVEsQ0FBUixFQURHO1dBQUEsTUFBQTtBQUdILGtCQUFVLElBQUEsS0FBQSxDQUFPLHlCQUFBLEdBQXlCLEVBQXpCLEdBQTRCLFFBQTVCLEdBQW9DLEdBQTNDLENBQVYsQ0FIRztXQUhLO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBUixFQURVO0lBQUEsQ0FuRGhCLENBQUE7O0FBQUEsNEJBNkRBLGlCQUFBLEdBQW1CLFNBQUMsRUFBRCxHQUFBO2FBQ2IsSUFBQSxPQUFBLENBQVEsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUNWLFVBQUEsS0FBQyxDQUFBLFVBQUQsR0FBYyxLQUFDLENBQUEsU0FBUyxDQUFDLEtBQVgsQ0FBQSxDQUFrQixDQUFDLE9BQW5CLENBQUEsQ0FBZCxDQUFBO0FBQUEsVUFDQSxLQUFDLENBQUEsQ0FBRCxHQUFLLENBREwsQ0FBQTtpQkFFQSxLQUFDLENBQUEsa0JBQUQsQ0FBb0IsRUFBcEIsRUFBd0IsT0FBeEIsRUFBaUMsTUFBakMsRUFIVTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVIsRUFEYTtJQUFBLENBN0RuQixDQUFBOztBQUFBLDRCQW9FQSxxQkFBQSxHQUF1QixTQUFBLEdBQUE7YUFDakIsSUFBQSxPQUFBLENBQVEsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUNWLFVBQUEsS0FBQyxDQUFBLFVBQUQsR0FBYyxLQUFDLENBQUEsU0FBUyxDQUFDLEtBQVgsQ0FBQSxDQUFrQixDQUFDLE9BQW5CLENBQUEsQ0FBZCxDQUFBO0FBQUEsVUFDQSxLQUFDLENBQUEsT0FBRCxHQUFXLEVBRFgsQ0FBQTtpQkFFQSxLQUFDLENBQUEsc0JBQUQsQ0FBd0IsT0FBeEIsRUFBaUMsTUFBakMsRUFIVTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVIsRUFEaUI7SUFBQSxDQXBFdkIsQ0FBQTs7QUFBQSw0QkErRUEsV0FBQSxHQUFhLFNBQUMsR0FBRCxHQUFBO0FBQ1gsVUFBQSxDQUFBO0FBQUEsTUFBQSxJQUFvQixTQUFTLENBQUMsUUFBVixDQUFtQixHQUFuQixDQUFBLEtBQTJCLElBQS9DO0FBQUEsZUFBTyxLQUFQLENBQUE7T0FBQTtBQUFBLE1BQ0EsQ0FBQSxHQUFJLElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBWCxDQUNGO0FBQUEsUUFBQSxHQUFBLEVBQUssR0FBTDtBQUFBLFFBQ0EsTUFBQSxFQUFRLEVBRFI7QUFBQSxRQUVBLEtBQUEsRUFBTyxTQUFTLENBQUMsT0FBUSxDQUFBLEdBQUEsQ0FBSSxDQUFDLEtBRjlCO09BREUsQ0FESixDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsU0FBVSxDQUFBLENBQUEsR0FBSSxDQUFKLENBQU0sQ0FBQyxXQUFELENBQWpCLEdBQWtDLElBQUEsU0FBUyxDQUFDLE9BQVEsQ0FBQSxHQUFBLENBQUksQ0FBQyxLQUF2QixDQUE2QixDQUFDLElBQUMsQ0FBQSxXQUFGLEVBQWUsSUFBQyxDQUFBLFFBQWhCLENBQTdCLEVBQXdELElBQUMsQ0FBQSxTQUFVLENBQUEsQ0FBQSxHQUFJLENBQUosQ0FBTSxDQUFDLE1BQTFFLEVBQWtGLElBQUMsQ0FBQSxJQUFuRixDQU5sQyxDQUFBO0FBT0EsTUFBQSxJQUF5RixJQUFDLENBQUEsTUFBRCxJQUFZLHFDQUFyRztBQUFBLFFBQUEsSUFBQyxDQUFBLFNBQVUsQ0FBQSxDQUFBLEdBQUksQ0FBSixDQUFNLENBQUMsSUFBbEIsR0FBNkIsSUFBQSxTQUFTLENBQUMsT0FBUSxDQUFBLEdBQUEsQ0FBSSxDQUFDLElBQXZCLENBQTRCLElBQUMsQ0FBQSxTQUFVLENBQUEsQ0FBQSxHQUFJLENBQUosQ0FBTSxDQUFDLFdBQUQsQ0FBN0MsQ0FBN0IsQ0FBQTtPQVBBO0FBQUEsTUFRQSxJQUFDLENBQUEsSUFBRCxDQUFBLENBUkEsQ0FBQTtBQVNBLGFBQU8sSUFBUCxDQVZXO0lBQUEsQ0EvRWIsQ0FBQTs7QUFBQSw0QkEyRkEsY0FBQSxHQUFnQixTQUFDLEtBQUQsR0FBQTtBQUNkLE1BQUEsSUFBQSxDQUFBLENBQW9CLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxHQUFvQixLQUF4QyxDQUFBO0FBQUEsZUFBTyxLQUFQLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUFYLENBQWtCLEtBQWxCLEVBQXlCLENBQXpCLENBQTRCLENBQUEsQ0FBQSxDQUQ1QixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsSUFBRCxDQUFBLENBRkEsQ0FBQTtBQUdBLGFBQU8sSUFBUCxDQUpjO0lBQUEsQ0EzRmhCLENBQUE7O0FBQUEsNEJBaUdBLGNBQUEsR0FBZ0IsU0FBQyxLQUFELEdBQUE7QUFDZCxNQUFBLElBQWdCLENBQUMsS0FBQSxLQUFTLENBQVYsQ0FBQSxJQUFnQixDQUFDLEtBQUEsSUFBUyxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQXJCLENBQWhDO0FBQUEsZUFBTyxLQUFQLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUFYLENBQWtCLEtBQUEsR0FBUSxDQUExQixFQUE2QixDQUE3QixFQUFnQyxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBa0IsS0FBbEIsRUFBeUIsQ0FBekIsQ0FBNEIsQ0FBQSxDQUFBLENBQTVELENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQUZBLENBQUE7QUFHQSxhQUFPLElBQVAsQ0FKYztJQUFBLENBakdoQixDQUFBOztBQUFBLDRCQXVHQSxnQkFBQSxHQUFrQixTQUFDLEtBQUQsR0FBQTtBQUNoQixNQUFBLElBQWlCLEtBQUEsSUFBUyxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsR0FBb0IsQ0FBOUM7QUFBQSxlQUFPLEtBQVAsQ0FBQTtPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBa0IsS0FBbEIsRUFBeUIsQ0FBekIsRUFBNEIsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUFYLENBQWtCLEtBQUEsR0FBUSxDQUExQixFQUE2QixDQUE3QixDQUFnQyxDQUFBLENBQUEsQ0FBNUQsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsSUFBRCxDQUFBLENBRkEsQ0FBQTtBQUdBLGFBQU8sSUFBUCxDQUpnQjtJQUFBLENBdkdsQixDQUFBOztBQUFBLDRCQWlIQSxrQkFBQSxHQUFvQixTQUFDLEVBQUQsRUFBSyxPQUFMLEVBQWMsTUFBZCxHQUFBO0FBQ2xCLFVBQUEsaUJBQUE7QUFBQSxNQUFBLElBQWdFLG1DQUFoRTtBQUFBLGVBQU8sTUFBQSxDQUFXLElBQUEsS0FBQSxDQUFPLFdBQUEsR0FBVSxDQUFDLEVBQUEsR0FBSyxDQUFOLENBQVYsR0FBa0IsWUFBekIsQ0FBWCxDQUFQLENBQUE7T0FBQTtBQUNBLE1BQUEsSUFBRyxDQUFDLENBQUEseUNBQWUsQ0FBRSxpQkFBYixDQUErQixFQUFBLEdBQUssSUFBQyxDQUFBLENBQXJDLFVBQUwsQ0FBQSxZQUF3RCxPQUEzRDtlQUNFLENBQUMsQ0FBQyxJQUFGLENBQU8sT0FBUCxFQUFnQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUNkLGdCQUFBLEtBQUE7QUFBQSxZQUFBLElBQUcsQ0FBQyxDQUFBLDJDQUFlLENBQUUsZUFBYixDQUFBLFVBQUwsQ0FBQSxZQUFnRCxPQUFuRDtxQkFDRSxDQUFDLENBQUMsSUFBRixDQUFPLENBQUMsU0FBQyxLQUFELEdBQUE7QUFDTixnQkFBQSxLQUFDLENBQUEsQ0FBRCxHQUFLLEtBQUMsQ0FBQSxDQUFELEdBQUssS0FBVixDQUFBO3VCQUNBLEtBQUMsQ0FBQSxrQkFBRCxDQUFvQixFQUFwQixFQUF3QixPQUF4QixFQUFpQyxNQUFqQyxFQUZNO2NBQUEsQ0FBRCxDQUFQLEVBR0csTUFISCxFQURGO2FBQUEsTUFBQTtBQU1FLGNBQUEsS0FBQyxDQUFBLENBQUQsR0FBSyxLQUFDLENBQUEsQ0FBRCxHQUFLLGFBQUMsSUFBSSxDQUFMLENBQVYsQ0FBQTtxQkFDQSxLQUFDLENBQUEsa0JBQUQsQ0FBb0IsRUFBcEIsRUFBd0IsT0FBeEIsRUFBaUMsTUFBakMsRUFQRjthQURjO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEIsRUFERjtPQUFBLE1BVUssSUFBRyxTQUFIO2VBQ0gsT0FBQSxDQUFRLENBQVIsRUFERztPQUFBLE1BQUE7QUFHSCxRQUFBLElBQUcsQ0FBQyxDQUFBLDJDQUFlLENBQUUsZUFBYixDQUFBLFVBQUwsQ0FBQSxZQUFnRCxPQUFuRDtpQkFDRSxDQUFDLENBQUMsSUFBRixDQUFPLENBQUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTttQkFBQSxTQUFDLEtBQUQsR0FBQTtBQUNOLGNBQUEsS0FBQyxDQUFBLENBQUQsR0FBSyxLQUFDLENBQUEsQ0FBRCxHQUFLLEtBQVYsQ0FBQTtxQkFDQSxLQUFDLENBQUEsa0JBQUQsQ0FBb0IsRUFBcEIsRUFBd0IsT0FBeEIsRUFBaUMsTUFBakMsRUFGTTtZQUFBLEVBQUE7VUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUQsQ0FBUCxFQUdHLE1BSEgsRUFERjtTQUFBLE1BQUE7QUFNRSxVQUFBLElBQUMsQ0FBQSxDQUFELEdBQUssSUFBQyxDQUFBLENBQUQsR0FBSyxhQUFDLElBQUksQ0FBTCxDQUFWLENBQUE7aUJBQ0EsSUFBQyxDQUFBLGtCQUFELENBQW9CLEVBQXBCLEVBQXdCLE9BQXhCLEVBQWlDLE1BQWpDLEVBUEY7U0FIRztPQVphO0lBQUEsQ0FqSHBCLENBQUE7O0FBQUEsNEJBeUlBLHNCQUFBLEdBQXdCLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUN0QixVQUFBLHNCQUFBO0FBQUEsTUFBQSxJQUFnQyxtQ0FBaEM7QUFBQSxlQUFPLE9BQUEsQ0FBUSxJQUFDLENBQUEsT0FBVCxDQUFQLENBQUE7T0FBQTtBQUNBLE1BQUEsSUFBRyxDQUFDLENBQUEseUNBQWUsQ0FBRSxlQUFiLENBQUEsVUFBTCxDQUFBLFlBQWdELE9BQW5EO0FBQ0UsUUFBQSxDQUFDLENBQUMsSUFBRixDQUFPLENBQUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLFFBQUQsR0FBQTtBQUNOLGdCQUFBLHFCQUFBO0FBQUEsWUFBQSxTQUFBOztBQUFhO21CQUFBLHVEQUFBO3NDQUFBO0FBQUEsOEJBQUE7QUFBQSxrQkFBQyxJQUFBLEVBQU0sT0FBUDtBQUFBLGtCQUFnQixRQUFBLEVBQVUsU0FBUyxDQUFDLE9BQVEsQ0FBQSxDQUFDLENBQUMsR0FBRixDQUFNLENBQUMsUUFBbkQ7QUFBQSxrQkFBNkQsTUFBQSxFQUFRLENBQUMsQ0FBQyxHQUF2RTtBQUFBLGtCQUE0RSxFQUFBLEVBQUksQ0FBaEY7QUFBQSxrQkFBbUYsR0FBQSxFQUFLLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxHQUFvQixJQUFDLENBQUEsVUFBVSxDQUFDLE1BQWhDLEdBQXlDLENBQWpJO2tCQUFBLENBQUE7QUFBQTs7MEJBQWIsQ0FBQTtBQUFBLFlBQ0EsS0FBQyxDQUFBLE9BQUQsR0FBVyxLQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBZ0IsU0FBaEIsQ0FEWCxDQUFBO21CQUVBLEtBQUMsQ0FBQSxzQkFBRCxDQUF3QixPQUF4QixFQUFpQyxNQUFqQyxFQUhNO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBRCxDQUFQLEVBSUcsTUFKSCxDQUFBLENBQUE7QUFLQSxjQUFBLENBTkY7T0FBQSxNQU9LLElBQUcsU0FBSDtBQUNILFFBQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQ7O0FBQWlCO2VBQUEsZ0RBQUE7MkJBQUE7QUFBQSwwQkFBQTtBQUFBLGNBQUMsSUFBQSxFQUFNLE9BQVA7QUFBQSxjQUFnQixRQUFBLEVBQVUsU0FBUyxDQUFDLE9BQVEsQ0FBQSxDQUFDLENBQUMsR0FBRixDQUFNLENBQUMsUUFBbkQ7QUFBQSxjQUE2RCxNQUFBLEVBQVEsQ0FBQyxDQUFDLEdBQXZFO0FBQUEsY0FBNEUsRUFBQSxFQUFJLENBQWhGO0FBQUEsY0FBbUYsR0FBQSxFQUFLLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxHQUFvQixJQUFDLENBQUEsVUFBVSxDQUFDLE1BQWhDLEdBQXlDLENBQWpJO2NBQUEsQ0FBQTtBQUFBOztxQkFBakIsQ0FBWCxDQURHO09BUkw7YUFVQSxJQUFDLENBQUEsc0JBQUQsQ0FBd0IsT0FBeEIsRUFBaUMsTUFBakMsRUFYc0I7SUFBQSxDQXpJeEIsQ0FBQTs7QUFBQSw0QkFzSkEsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLFVBQUEsbUNBQUE7QUFBQSxNQUFBLFNBQUEsR0FBWSxFQUFaLENBQUE7QUFDQTtBQUFBLFdBQUEsMkNBQUE7NEJBQUE7QUFDRSxRQUFBLFNBQVMsQ0FBQyxJQUFWLENBQ0U7QUFBQSxVQUFBLEdBQUEsRUFBSyxRQUFRLENBQUMsR0FBZDtBQUFBLFVBQ0EsTUFBQSxFQUFRLFFBQVEsQ0FBQyxNQURqQjtTQURGLENBQUEsQ0FERjtBQUFBLE9BREE7QUFBQSxNQUtBLElBQUksQ0FBQyxhQUFMLENBQW1CLElBQUMsQ0FBQSxRQUFwQixFQUE4QjtBQUFBLFFBQUMsV0FBQSxTQUFEO09BQTlCLENBTEEsQ0FBQTthQU1BLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLE1BQWQsRUFQSTtJQUFBLENBdEpOLENBQUE7O0FBQUEsSUErSkEsYUFBQyxDQUFBLGNBQUQsR0FBaUIsU0FBQyxDQUFELEdBQUE7QUFDZixVQUFBLDRCQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsRUFBVixDQUFBO0FBQ0E7QUFBQSxXQUFBLDJDQUFBO3VCQUFBO0FBQ0UsUUFBQSxPQUFRLENBQUEsR0FBQSxDQUFSLEdBQWUsQ0FBRSxDQUFBLEdBQUEsQ0FBakIsQ0FERjtBQUFBLE9BREE7QUFHQSxNQUFBLElBQU8saUJBQVA7QUFDRSxRQUFBLENBQUMsQ0FBQyxPQUFGLEdBQVksQ0FBWixDQUFBO0FBQ0EsUUFBQSxJQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBVCxLQUF5QixJQUE1QjtBQUNFLFVBQUEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFULEdBQW1CLFdBQW5CLENBREY7U0FEQTtBQUdBLFFBQUEsSUFBRyxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVQsS0FBeUIsSUFBNUI7QUFDRSxVQUFBLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBVCxHQUFtQixXQUFuQixDQURGO1NBSkY7T0FIQTtBQVNBLE1BQUEsSUFBRyxDQUFDLENBQUMsT0FBRixLQUFhLENBQWhCO0FBQ0UsUUFBQSxDQUFDLENBQUMsT0FBRixHQUFZLENBQVosQ0FBQTtBQUFBLFFBQ0EsQ0FBQyxDQUFDLFFBQUYsR0FBYSxJQURiLENBQUE7QUFBQSxRQUVBLENBQUMsQ0FBQyxhQUFGLEdBQWtCLEtBRmxCLENBREY7T0FUQTtBQUFBLE1BYUEsT0FBTyxDQUFDLFFBQVIsR0FBbUIsRUFibkIsQ0FBQTtBQWNBLE1BQUEsSUFBa0MsQ0FBQyxDQUFDLFFBQXBDO0FBQUEsUUFBQSxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQWpCLEdBQTRCLEVBQTVCLENBQUE7T0FkQTtBQWVBLE1BQUEsSUFBK0MsQ0FBQyxDQUFDLEtBQWpEO0FBQUEsUUFBQSxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQWpCLEdBQXlCO0FBQUEsVUFBQSxPQUFBLEVBQVMsU0FBVDtTQUF6QixDQUFBO09BZkE7QUFnQkEsTUFBQSxJQUFtQyxDQUFDLENBQUMsU0FBckM7QUFBQSxRQUFBLE9BQU8sQ0FBQyxRQUFRLENBQUMsU0FBakIsR0FBNkIsRUFBN0IsQ0FBQTtPQWhCQTtBQUFBLE1BaUJBLE9BQU8sQ0FBQyxNQUFSLEdBQWlCLENBQUMsQ0FBQyxNQWpCbkIsQ0FBQTtBQUFBLE1Ba0JBLE9BQU8sQ0FBQyxNQUFSLEdBQWlCLENBQUMsQ0FBQyxNQWxCbkIsQ0FBQTtBQUFBLE1BbUJBLE9BQU8sQ0FBQyxNQUFSLEdBQWlCLEVBbkJqQixDQUFBO0FBQUEsTUFvQkEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFmLEdBQXlCLEVBcEJ6QixDQUFBO0FBQUEsTUFxQkEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBdkIsR0FBdUMsQ0FBQyxDQUFDLGFBckJ6QyxDQUFBO0FBQUEsTUFzQkEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsZUFBdkIsR0FBeUMsSUF0QnpDLENBQUE7QUF1QkEsTUFBQSxJQUE2QywwQkFBQSxJQUFxQiwwQkFBbEU7QUFBQSxRQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBZixHQUF3QjtBQUFBLFVBQUMsUUFBQSxFQUFVLEtBQVg7U0FBeEIsQ0FBQTtPQXZCQTtBQUFBLE1Bd0JBLE9BQU8sQ0FBQyxPQUFSLEdBQWtCLENBeEJsQixDQUFBO0FBeUJBLGFBQU8sT0FBUCxDQTFCZTtJQUFBLENBL0pqQixDQUFBOztBQUFBLDRCQTJMQSxZQUFBLEdBQWMsU0FBQyxRQUFELEVBQVcsU0FBWCxHQUFBO0FBQ1osVUFBQSx1QkFBQTtBQUFBLE1BQUEsU0FBUyxDQUFDLElBQVYsQ0FBZTtBQUFBLFFBQUEsR0FBQSxFQUFLLElBQUw7QUFBQSxRQUFXLE1BQUEsRUFBUTtBQUFBLFVBQUEsUUFBQSxFQUFVLEVBQVY7U0FBbkI7T0FBZixDQUFBLENBQUE7QUFDQSxXQUFBLCtDQUFBOytCQUFBO0FBQ0UsUUFBQSxTQUFVLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUE3QixDQUFrQyxhQUFhLENBQUMsY0FBZCxDQUE2QixPQUE3QixDQUFsQyxDQUFBLENBREY7QUFBQSxPQURBO3VEQUdrQixDQUFFLFVBQXBCLENBQWdDLFdBQUEsR0FBVyxRQUFRLENBQUMsTUFBcEIsR0FBMkIsbUJBQTNELFdBSlk7SUFBQSxDQTNMZCxDQUFBOztBQUFBLDRCQWlNQSxhQUFBLEdBQWUsU0FBQSxHQUFBO0FBQ2IsVUFBQSwyQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFiLENBQUEsQ0FBQTtBQUFBLE1BQ0EsUUFBQSxHQUFXLElBQUMsQ0FBQSxTQUFVLENBQUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUFYLEdBQW9CLENBQXBCLENBQXNCLENBQUMsV0FBRCxDQUQ1QyxDQUFBO0FBRUE7QUFBQTtXQUFBLDJDQUFBOzJCQUFBO0FBQ0Usc0JBQUEsUUFBUSxDQUFDLFVBQVQsQ0FBb0IsYUFBYSxDQUFDLGNBQWQsQ0FBNkIsT0FBN0IsQ0FBcEIsRUFBQSxDQURGO0FBQUE7c0JBSGE7SUFBQSxDQWpNZixDQUFBOztBQUFBLDRCQXVNQSxTQUFBLEdBQVcsU0FBQyxRQUFELEdBQUE7YUFDVCxJQUFJLENBQUMsUUFBTCxDQUFjLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFaLENBQUEsQ0FBYixDQUFWLEVBQXlELDBCQUF6RCxDQUFkLEVBQW9HLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEdBQUQsRUFBTyxXQUFQLEdBQUE7QUFDbEcsVUFEd0csS0FBQyxDQUFBLGNBQUEsV0FDekcsQ0FBQTtBQUFBLFVBQUEsSUFBVSxXQUFWO0FBQUEsa0JBQUEsQ0FBQTtXQUFBO0FBQ0EsVUFBQSxJQUFjLDRDQUFkO21CQUFBLFFBQUEsQ0FBQSxFQUFBO1dBRmtHO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEcsRUFEUztJQUFBLENBdk1YLENBQUE7O3lCQUFBOztNQVZKLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/provider/project.coffee
