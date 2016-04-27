(function() {
  var FtpHost, Host, HostView, HostsView, InterProcessDataWatcher, LocalFile, OpenFilesView, Q, RemoteEditEditor, SftpHost, fs, url, _;

  _ = require('underscore-plus');

  RemoteEditEditor = require('./model/remote-edit-editor');

  OpenFilesView = null;

  HostView = null;

  HostsView = null;

  Host = null;

  SftpHost = null;

  FtpHost = null;

  LocalFile = null;

  url = null;

  Q = null;

  InterProcessDataWatcher = null;

  fs = null;

  module.exports = {
    config: {
      showHiddenFiles: {
        title: 'Show hidden files',
        type: 'boolean',
        "default": false
      },
      uploadOnSave: {
        title: 'Upload on save',
        description: 'When enabled, remote files will be automatically uploaded when saved',
        type: 'boolean',
        "default": true
      },
      notifications: {
        title: 'Display notifications',
        type: 'boolean',
        "default": true
      },
      sshPrivateKeyPath: {
        title: 'Path to private SSH key',
        type: 'string',
        "default": '~/.ssh/id_rsa'
      },
      defaultSerializePath: {
        title: 'Default path to serialize remoteEdit data',
        type: 'string',
        "default": '~/.atom/remoteEdit.json'
      },
      agentToUse: {
        title: 'SSH agent',
        description: 'Overrides default SSH agent. See ssh2 docs for more info.',
        type: 'string',
        "default": 'Default'
      },
      foldersOnTop: {
        title: 'Show folders on top',
        type: 'boolean',
        "default": false
      },
      followLinks: {
        title: 'Follow symbolic links',
        description: 'If set to true, symbolic links are treated as directories',
        type: 'boolean',
        "default": true
      },
      clearFileList: {
        title: 'Clear file list',
        description: 'When enabled, the open files list will be cleared on initialization',
        type: 'boolean',
        "default": false
      },
      rememberLastOpenDirectory: {
        title: 'Remember last open directory',
        description: 'When enabled, browsing a host will return you to the last directory you entered',
        type: 'boolean',
        "default": false
      },
      storePasswordsUsingKeytar: {
        title: 'Store passwords using node-keytar',
        description: 'When enabled, passwords and passphrases will be stored in system\'s keychain',
        type: 'boolean',
        "default": false
      },
      filterHostsUsing: {
        type: 'object',
        properties: {
          hostname: {
            type: 'boolean',
            "default": true
          },
          alias: {
            type: 'boolean',
            "default": false
          },
          username: {
            type: 'boolean',
            "default": false
          },
          port: {
            type: 'boolean',
            "default": false
          }
        }
      }
    },
    activate: function(state) {
      this.setupOpeners();
      this.initializeIpdwIfNecessary();
      atom.commands.add('atom-workspace', 'remote-edit:show-open-files', (function(_this) {
        return function() {
          return _this.showOpenFiles();
        };
      })(this));
      atom.commands.add('atom-workspace', 'remote-edit:browse', (function(_this) {
        return function() {
          return _this.browse();
        };
      })(this));
      atom.commands.add('atom-workspace', 'remote-edit:new-host-sftp', (function(_this) {
        return function() {
          return _this.newHostSftp();
        };
      })(this));
      return atom.commands.add('atom-workspace', 'remote-edit:new-host-ftp', (function(_this) {
        return function() {
          return _this.newHostFtp();
        };
      })(this));
    },
    deactivate: function() {
      var _ref;
      return (_ref = this.ipdw) != null ? _ref.destroy() : void 0;
    },
    newHostSftp: function() {
      var host, view;
      if (HostView == null) {
        HostView = require('./view/host-view');
      }
      if (SftpHost == null) {
        SftpHost = require('./model/sftp-host');
      }
      host = new SftpHost();
      view = new HostView(host, this.getOrCreateIpdw());
      return view.toggle();
    },
    newHostFtp: function() {
      var host, view;
      if (HostView == null) {
        HostView = require('./view/host-view');
      }
      if (FtpHost == null) {
        FtpHost = require('./model/ftp-host');
      }
      host = new FtpHost();
      view = new HostView(host, this.getOrCreateIpdw());
      return view.toggle();
    },
    browse: function() {
      var view;
      if (HostsView == null) {
        HostsView = require('./view/hosts-view');
      }
      view = new HostsView(this.getOrCreateIpdw());
      return view.toggle();
    },
    showOpenFiles: function() {
      var showOpenFilesView;
      if (OpenFilesView == null) {
        OpenFilesView = require('./view/open-files-view');
      }
      showOpenFilesView = new OpenFilesView(this.getOrCreateIpdw());
      return showOpenFilesView.toggle();
    },
    initializeIpdwIfNecessary: function() {
      var editor, stop, _i, _len, _ref, _results;
      if (atom.config.get('remote-edit.notifications')) {
        stop = false;
        _ref = atom.workspace.getTextEditors();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          editor = _ref[_i];
          if (!stop) {
            if (editor instanceof RemoteEditEditor) {
              this.getOrCreateIpdw();
              _results.push(stop = true);
            } else {
              _results.push(void 0);
            }
          }
        }
        return _results;
      }
    },
    getOrCreateIpdw: function() {
      if (this.ipdw === void 0) {
        if (InterProcessDataWatcher == null) {
          InterProcessDataWatcher = require('./model/inter-process-data-watcher');
        }
        fs = require('fs-plus');
        return this.ipdw = new InterProcessDataWatcher(fs.absolute(atom.config.get('remote-edit.defaultSerializePath')));
      } else {
        return this.ipdw;
      }
    },
    setupOpeners: function() {
      return atom.workspace.addOpener(function(uriToOpen) {
        var error, host, localFile, protocol, query, _ref;
        if (url == null) {
          url = require('url');
        }
        try {
          _ref = url.parse(uriToOpen, true), protocol = _ref.protocol, host = _ref.host, query = _ref.query;
        } catch (_error) {
          error = _error;
          return;
        }
        if (protocol !== 'remote-edit:') {
          return;
        }
        if (host === 'localfile') {
          if (Q == null) {
            Q = require('q');
          }
          if (Host == null) {
            Host = require('./model/host');
          }
          if (FtpHost == null) {
            FtpHost = require('./model/ftp-host');
          }
          if (SftpHost == null) {
            SftpHost = require('./model/sftp-host');
          }
          if (LocalFile == null) {
            LocalFile = require('./model/local-file');
          }
          localFile = LocalFile.deserialize(JSON.parse(decodeURIComponent(query.localFile)));
          host = Host.deserialize(JSON.parse(decodeURIComponent(query.host)));
          return atom.project.bufferForPath(localFile.path).then(function(buffer) {
            var editor, params, ws;
            params = {
              buffer: buffer,
              registerEditor: true,
              host: host,
              localFile: localFile
            };
            ws = atom.workspace;
            params = _.extend({
              config: ws.config,
              notificationManager: ws.notificationManager,
              packageManager: ws.packageManager,
              clipboard: ws.clipboard,
              viewRegistry: ws.viewRegistry,
              grammarRegistry: ws.grammarRegistry,
              project: ws.project,
              assert: ws.assert,
              applicationDelegate: ws.applicationDelegate
            }, params);
            return editor = new RemoteEditEditor(params);
          });
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcmVtb3RlLWVkaXQvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdJQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFFQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsNEJBQVIsQ0FGbkIsQ0FBQTs7QUFBQSxFQUtBLGFBQUEsR0FBZ0IsSUFMaEIsQ0FBQTs7QUFBQSxFQU1BLFFBQUEsR0FBVyxJQU5YLENBQUE7O0FBQUEsRUFPQSxTQUFBLEdBQVksSUFQWixDQUFBOztBQUFBLEVBUUEsSUFBQSxHQUFPLElBUlAsQ0FBQTs7QUFBQSxFQVNBLFFBQUEsR0FBVyxJQVRYLENBQUE7O0FBQUEsRUFVQSxPQUFBLEdBQVUsSUFWVixDQUFBOztBQUFBLEVBV0EsU0FBQSxHQUFZLElBWFosQ0FBQTs7QUFBQSxFQVlBLEdBQUEsR0FBTSxJQVpOLENBQUE7O0FBQUEsRUFhQSxDQUFBLEdBQUksSUFiSixDQUFBOztBQUFBLEVBY0EsdUJBQUEsR0FBMEIsSUFkMUIsQ0FBQTs7QUFBQSxFQWVBLEVBQUEsR0FBSyxJQWZMLENBQUE7O0FBQUEsRUFpQkEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxlQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxtQkFBUDtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxLQUZUO09BREY7QUFBQSxNQUlBLFlBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLGdCQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsc0VBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsSUFI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

//# sourceURL=/home/champ/.atom/packages/remote-edit/lib/main.coffee
