(function() {
  var Dialog, DisplayBuffer, Editor, FtpHost, Host, LocalFile, RemoteEditEditor, SftpHost, TextEditor, async, e, path, resourcePath, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  resourcePath = atom.config.resourcePath;

  try {
    Editor = require(path.resolve(resourcePath, 'src', 'editor'));
  } catch (_error) {
    e = _error;
  }

  TextEditor = Editor != null ? Editor : require(path.resolve(resourcePath, 'src', 'text-editor'));

  DisplayBuffer = require(path.resolve(resourcePath, 'src', 'display-buffer'));

  Host = null;

  FtpHost = null;

  SftpHost = null;

  LocalFile = null;

  async = null;

  Dialog = null;

  _ = null;

  module.exports = RemoteEditEditor = (function(_super) {
    __extends(RemoteEditEditor, _super);

    atom.deserializers.add(RemoteEditEditor);

    function RemoteEditEditor(params) {
      if (params == null) {
        params = {};
      }
      RemoteEditEditor.__super__.constructor.call(this, params);
      if (params.host) {
        this.host = params.host;
      }
      if (params.localFile) {
        this.localFile = params.localFile;
      }
    }

    RemoteEditEditor.prototype.getIconName = function() {
      return "globe";
    };

    RemoteEditEditor.prototype.getTitle = function() {
      var sessionPath;
      if (this.localFile != null) {
        return this.localFile.name;
      } else if (sessionPath = this.getPath()) {
        return path.basename(sessionPath);
      } else {
        return "undefined";
      }
    };

    RemoteEditEditor.prototype.getLongTitle = function() {
      var directory, fileName, i, relativePath;
      if (Host == null) {
        Host = require('./host');
      }
      if (FtpHost == null) {
        FtpHost = require('./ftp-host');
      }
      if (SftpHost == null) {
        SftpHost = require('./sftp-host');
      }
      if (i = this.localFile.remoteFile.path.indexOf(this.host.directory) > -1) {
        relativePath = this.localFile.remoteFile.path.slice(i + this.host.directory.length);
      }
      fileName = this.getTitle();
      if (this.host instanceof SftpHost && (this.host != null) && (this.localFile != null)) {
        directory = relativePath != null ? relativePath : "sftp://" + this.host.username + "@" + this.host.hostname + ":" + this.host.port + this.localFile.remoteFile.path;
      } else if (this.host instanceof FtpHost && (this.host != null) && (this.localFile != null)) {
        directory = relativePath != null ? relativePath : "ftp://" + this.host.username + "@" + this.host.hostname + ":" + this.host.port + this.localFile.remoteFile.path;
      } else {
        directory = atom.project.relativize(path.dirname(sessionPath));
        directory = directory.length > 0 ? directory : path.basename(path.dirname(sessionPath));
      }
      return "" + fileName + " - " + directory;
    };

    RemoteEditEditor.prototype.onDidSaved = function(callback) {
      return this.emitter.on('did-saved', callback);
    };

    RemoteEditEditor.prototype.save = function() {
      this.buffer.save();
      this.emitter.emit('saved');
      return this.initiateUpload();
    };

    RemoteEditEditor.prototype.saveAs = function(filePath) {
      this.buffer.saveAs(filePath);
      this.localFile.path = filePath;
      this.emitter.emit('saved');
      return this.initiateUpload();
    };

    RemoteEditEditor.prototype.initiateUpload = function() {
      var chosen;
      if (atom.config.get('remote-edit.uploadOnSave')) {
        return this.upload();
      } else {
        if (Dialog == null) {
          Dialog = require('../view/dialog');
        }
        chosen = atom.confirm({
          message: "File has been saved. Do you want to upload changes to remote host?",
          detailedMessage: "The changes exists on disk and can be uploaded later.",
          buttons: ["Upload", "Cancel"]
        });
        switch (chosen) {
          case 0:
            return this.upload();
          case 1:
        }
      }
    };

    RemoteEditEditor.prototype.upload = function(connectionOptions) {
      if (connectionOptions == null) {
        connectionOptions = {};
      }
      if (async == null) {
        async = require('async');
      }
      if (_ == null) {
        _ = require('underscore-plus');
      }
      if ((this.localFile != null) && (this.host != null)) {
        return async.waterfall([
          (function(_this) {
            return function(callback) {
              if (_this.host.usePassword && (connectionOptions.password == null)) {
                if (_this.host.password === "" || _this.host.password === '' || (_this.host.password == null)) {
                  return async.waterfall([
                    function(callback) {
                      var passwordDialog;
                      if (Dialog == null) {
                        Dialog = require('../view/dialog');
                      }
                      passwordDialog = new Dialog({
                        prompt: "Enter password"
                      });
                      return passwordDialog.toggle(callback);
                    }
                  ], function(err, result) {
                    connectionOptions = _.extend({
                      password: result
                    }, connectionOptions);
                    return callback(null);
                  });
                } else {
                  return callback(null);
                }
              } else {
                return callback(null);
              }
            };
          })(this), (function(_this) {
            return function(callback) {
              if (!_this.host.isConnected()) {
                return _this.host.connect(callback, connectionOptions);
              } else {
                return callback(null);
              }
            };
          })(this), (function(_this) {
            return function(callback) {
              return _this.host.writeFile(_this.localFile, callback);
            };
          })(this)
        ], (function(_this) {
          return function(err) {
            if ((err != null) && _this.host.usePassword) {
              return async.waterfall([
                function(callback) {
                  var passwordDialog;
                  if (Dialog == null) {
                    Dialog = require('../view/dialog');
                  }
                  passwordDialog = new Dialog({
                    prompt: "Enter password"
                  });
                  return passwordDialog.toggle(callback);
                }
              ], function(err, result) {
                return _this.upload({
                  password: result
                });
              });
            }
          };
        })(this));
      } else {
        return console.error('LocalFile and host not defined. Cannot upload file!');
      }
    };

    RemoteEditEditor.prototype.serialize = function() {
      var data, _ref, _ref1;
      data = RemoteEditEditor.__super__.serialize.apply(this, arguments);
      data.deserializer = 'RemoteEditEditor';
      data.localFile = (_ref = this.localFile) != null ? _ref.serialize() : void 0;
      data.host = (_ref1 = this.host) != null ? _ref1.serialize() : void 0;
      return data;
    };

    RemoteEditEditor.deserialize = function(state, atomEnvironment) {
      var displayBuffer, error;
      try {
        displayBuffer = DisplayBuffer.deserialize(state.displayBuffer, atomEnvironment);
      } catch (_error) {
        error = _error;
        if (error.syscall === 'read') {
          return;
        } else {
          throw error;
        }
      }
      state.displayBuffer = displayBuffer;
      state.registerEditor = true;
      if (state.localFile != null) {
        LocalFile = require('../model/local-file');
        state.localFile = LocalFile.deserialize(state.localFile);
      }
      if (state.host != null) {
        Host = require('../model/host');
        FtpHost = require('../model/ftp-host');
        SftpHost = require('../model/sftp-host');
        state.host = Host.deserialize(state.host);
      }
      state.config = atomEnvironment.config;
      state.notificationManager = atomEnvironment.notifications;
      state.packageManager = atomEnvironment.packages;
      state.clipboard = atomEnvironment.clipboard;
      state.viewRegistry = atomEnvironment.views;
      state.grammarRegistry = atomEnvironment.grammars;
      state.project = atomEnvironment.project;
      state.assert = atomEnvironment.assert.bind(atomEnvironment);
      state.applicationDelegate = atomEnvironment.applicationDelegate;
      return new this(state);
    };

    return RemoteEditEditor;

  })(TextEditor);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcmVtb3RlLWVkaXQvbGliL21vZGVsL3JlbW90ZS1lZGl0LWVkaXRvci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0lBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxZQUFBLEdBQWUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUQzQixDQUFBOztBQUVBO0FBQ0UsSUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLElBQUksQ0FBQyxPQUFMLENBQWEsWUFBYixFQUEyQixLQUEzQixFQUFrQyxRQUFsQyxDQUFSLENBQVQsQ0FERjtHQUFBLGNBQUE7QUFFTSxJQUFBLFVBQUEsQ0FGTjtHQUZBOztBQUFBLEVBTUEsVUFBQSxvQkFBYSxTQUFTLE9BQUEsQ0FBUSxJQUFJLENBQUMsT0FBTCxDQUFhLFlBQWIsRUFBMkIsS0FBM0IsRUFBa0MsYUFBbEMsQ0FBUixDQU50QixDQUFBOztBQUFBLEVBUUEsYUFBQSxHQUFnQixPQUFBLENBQVEsSUFBSSxDQUFDLE9BQUwsQ0FBYSxZQUFiLEVBQTJCLEtBQTNCLEVBQWtDLGdCQUFsQyxDQUFSLENBUmhCLENBQUE7O0FBQUEsRUFXQSxJQUFBLEdBQU8sSUFYUCxDQUFBOztBQUFBLEVBWUEsT0FBQSxHQUFVLElBWlYsQ0FBQTs7QUFBQSxFQWFBLFFBQUEsR0FBVyxJQWJYLENBQUE7O0FBQUEsRUFjQSxTQUFBLEdBQVksSUFkWixDQUFBOztBQUFBLEVBZUEsS0FBQSxHQUFRLElBZlIsQ0FBQTs7QUFBQSxFQWdCQSxNQUFBLEdBQVMsSUFoQlQsQ0FBQTs7QUFBQSxFQWlCQSxDQUFBLEdBQUksSUFqQkosQ0FBQTs7QUFBQSxFQW1CQSxNQUFNLENBQUMsT0FBUCxHQUNR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

//# sourceURL=/home/champ/.atom/packages/remote-edit/lib/model/remote-edit-editor.coffee
