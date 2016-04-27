(function() {
  var AskView, Command, ProjectConfig, Queue, SelectionView, WorkerManager, askview, fs, getFirstConfig, getProjectConfig, path, selectionview, _getFirstConfig;

  path = require('path');

  fs = require('fs');

  ProjectConfig = require('./project');

  Command = require('./command');

  Queue = require('../pipeline/queue');

  WorkerManager = require('./worker-manager');

  SelectionView = null;

  selectionview = null;

  AskView = null;

  askview = null;

  getFirstConfig = function(folder) {
    return new Promise(function(resolve, reject) {
      return _getFirstConfig(folder, resolve, reject);
    });
  };

  _getFirstConfig = function(folder, resolve, reject) {
    var file;
    return fs.exists((file = path.join(folder, '.build-tools.cson')), function(exists) {
      var p;
      if (exists) {
        return resolve({
          folderPath: folder,
          filePath: file
        });
      }
      p = path.resolve(folder, '..');
      if (p !== folder) {
        return _getFirstConfig(path.resolve(folder, '..'), resolve, reject);
      }
      return reject();
    });
  };

  getProjectConfig = function(folder, file) {
    return new ProjectConfig(folder, file);
  };

  module.exports = {
    activate: function() {
      return WorkerManager.activate();
    },
    deactivate: function() {
      WorkerManager.deactivate();
      SelectionView = null;
      selectionview = null;
      AskView = null;
      return askview = null;
    },
    key: function(id) {
      var p, _ref;
      if ((p = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0) == null) {
        return;
      }
      return getFirstConfig(path.resolve(path.dirname(p))).then(((function(_this) {
        return function(_arg) {
          var c, filePath, folderPath;
          folderPath = _arg.folderPath, filePath = _arg.filePath;
          return (c = getProjectConfig(folderPath, filePath)).getCommandByIndex(id).then((function(command) {
            _this.run(command);
            return c.destroy();
          }), function(error) {
            var _ref1;
            return (_ref1 = atom.notifications) != null ? _ref1.addError(error.message) : void 0;
          });
        };
      })(this)), function() {});
    },
    keyAsk: function(id) {
      var p, _ref;
      if ((p = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0) == null) {
        return;
      }
      return getFirstConfig(path.resolve(path.dirname(p))).then(((function(_this) {
        return function(_arg) {
          var config, filePath, folderPath;
          folderPath = _arg.folderPath, filePath = _arg.filePath;
          return (config = getProjectConfig(folderPath, filePath)).getCommandByIndex(id).then((function(command) {
            if (AskView == null) {
              AskView = require('../view/ask-view');
            }
            return askview = new AskView(command.command, function(c) {
              var rc;
              rc = new Command(command);
              rc.command = c;
              _this.run(rc);
              return config.destroy();
            });
          }), function(error) {
            var _ref1;
            return (_ref1 = atom.notifications) != null ? _ref1.addError(error.message) : void 0;
          });
        };
      })(this)), function() {});
    },
    selection: function() {
      var p, _ref;
      if ((p = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0) == null) {
        return;
      }
      if (SelectionView == null) {
        SelectionView = require('../view/selection-view');
      }
      selectionview = new SelectionView;
      selectionview.setLoading('Loading project configuration');
      return getFirstConfig(path.resolve(path.dirname(p))).then(((function(_this) {
        return function(_arg) {
          var error, filePath, folderPath, project;
          folderPath = _arg.folderPath, filePath = _arg.filePath;
          selectionview.setLoading('Loading command list');
          project = getProjectConfig(folderPath, filePath);
          error = function(e) {
            selectionview.setError(e.message);
            return project.destroy();
          };
          return project.getCommandNameObjects().then((function(commands) {
            selectionview.setItems(commands);
            return selectionview.callback = function(_arg1) {
              var id, pid;
              id = _arg1.id, pid = _arg1.pid;
              return project.getCommandById(pid, id).then((function(command) {
                _this.run(command);
                return project.destroy();
              }), error);
            };
          }), error);
        };
      })(this)), function() {
        return selectionview.setError('Could not load project configuration');
      });
    },
    run: function(command) {
      var error;
      WorkerManager.removeWorker(command);
      error = function(e) {
        var _ref;
        return (_ref = atom.notifications) != null ? _ref.addError(e.message) : void 0;
      };
      return WorkerManager.createWorker(command).then((function(worker) {
        return worker.run().then(void 0, error);
      }), error);
    },
    inputCommand: function(command) {
      return new Command(command).getQueue();
    },
    inputQueue: function(commands) {
      var command, _commands, _i, _len;
      _commands = [];
      for (_i = 0, _len = commands.length; _i < _len; _i++) {
        command = commands[_i];
        _commands.push(new Command(command));
      }
      return new Queue(_commands);
    },
    cancel: function() {
      return WorkerManager.deactivate();
    },
    getFirstConfig: getFirstConfig
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3Byb3ZpZGVyL2lucHV0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5SkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsYUFBQSxHQUFnQixPQUFBLENBQVEsV0FBUixDQUZoQixDQUFBOztBQUFBLEVBR0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBSFYsQ0FBQTs7QUFBQSxFQUlBLEtBQUEsR0FBUSxPQUFBLENBQVEsbUJBQVIsQ0FKUixDQUFBOztBQUFBLEVBTUEsYUFBQSxHQUFnQixPQUFBLENBQVEsa0JBQVIsQ0FOaEIsQ0FBQTs7QUFBQSxFQVFBLGFBQUEsR0FBZ0IsSUFSaEIsQ0FBQTs7QUFBQSxFQVNBLGFBQUEsR0FBZ0IsSUFUaEIsQ0FBQTs7QUFBQSxFQVdBLE9BQUEsR0FBVSxJQVhWLENBQUE7O0FBQUEsRUFZQSxPQUFBLEdBQVUsSUFaVixDQUFBOztBQUFBLEVBY0EsY0FBQSxHQUFpQixTQUFDLE1BQUQsR0FBQTtXQUNYLElBQUEsT0FBQSxDQUFRLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTthQUNWLGVBQUEsQ0FBZ0IsTUFBaEIsRUFBd0IsT0FBeEIsRUFBa0MsTUFBbEMsRUFEVTtJQUFBLENBQVIsRUFEVztFQUFBLENBZGpCLENBQUE7O0FBQUEsRUFtQkEsZUFBQSxHQUFrQixTQUFDLE1BQUQsRUFBUyxPQUFULEVBQWtCLE1BQWxCLEdBQUE7QUFDaEIsUUFBQSxJQUFBO1dBQUEsRUFBRSxDQUFDLE1BQUgsQ0FBVSxDQUFDLElBQUEsR0FBTyxJQUFJLENBQUMsSUFBTCxD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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/provider/input.coffee
