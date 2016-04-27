'use babel';
'use strict';

var child_process = require('child_process');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var Disposable = require('atom').Disposable;
var kill = require('tree-kill');

var SaveConfirmView = require('./save-confirm-view');
var TargetsView = require('./targets-view');
var BuildView = require('./build-view');
var GoogleAnalytics = require('./google-analytics');
var ErrorMatcher = require('./error-matcher');
var tools = [require('./atom-build')];

function BuildError(name, message) {
  this.name = name;
  this.message = message;
  Error.captureStackTrace(this, BuildError);
}

BuildError.prototype = Object.create(Error.prototype);
BuildError.prototype.constructor = BuildError;

module.exports = {
  config: {
    panelVisibility: {
      title: 'Panel Visibility',
      description: 'Set when the build panel should be visible.',
      type: 'string',
      'default': 'Toggle',
      'enum': ['Toggle', 'Keep Visible', 'Show on Error', 'Hidden'],
      order: 1
    },
    buildOnSave: {
      title: 'Automatically build on save',
      description: 'Autmatically build your project each time an editor is saved.',
      type: 'boolean',
      'default': false,
      order: 2
    },
    saveOnBuild: {
      title: 'Automatically save on build',
      description: 'Automatically save all edited files when triggering a build.',
      type: 'boolean',
      'default': false,
      order: 3
    },
    scrollOnError: {
      title: 'Automatically scroll on build error',
      description: 'Automatically scroll to first matched error when a build failed.',
      type: 'boolean',
      'default': false,
      order: 4
    },
    stealFocus: {
      title: 'Steal Focus',
      description: 'Steal focus when opening build panel.',
      type: 'boolean',
      'default': true,
      order: 5
    },
    monocleHeight: {
      title: 'Monocle Height',
      description: 'How much of the workspace to use for build panel when it is "maximized".',
      type: 'number',
      'default': 0.75,
      minimum: 0.1,
      maximum: 0.9,
      order: 6
    },
    minimizedHeight: {
      title: 'Minimized Height',
      description: 'How much of the workspace to use for build panel when it is "minimized".',
      type: 'number',
      'default': 0.15,
      minimum: 0.1,
      maximum: 0.9,
      order: 7
    },
    panelOrientation: {
      title: 'Panel Orientation',
      description: 'Where to attach the build panel',
      type: 'string',
      'default': 'Bottom',
      'enum': ['Bottom', 'Top', 'Left', 'Right'],
      order: 8
    }
  },

  activate: function activate(state) {
    var _this = this;

    // Manually append /usr/local/bin as it may not be set on some systems,
    // and it's common to have node installed here. Keep it at end so it won't
    // accidentially override any other node installation
    process.env.PATH += ':/usr/local/bin';

    this.buildView = new BuildView();

    this.cmd = {};
    this.targets = {};
    this.activeTarget = null;
    this.match = [];
    this.stdout = new Buffer(0);
    this.stderr = new Buffer(0);
    this.errorMatcher = new ErrorMatcher();

    atom.commands.add('atom-workspace', 'build:trigger', this.build.bind(this, 'trigger'));
    atom.commands.add('atom-workspace', 'build:select-active-target', this.selectActiveTarget.bind(this));
    atom.commands.add('atom-workspace', 'build:stop', this.stop.bind(this));
    atom.commands.add('atom-workspace', 'build:confirm', function () {
      GoogleAnalytics.sendEvent('build', 'confirmed');
      document.activeElement.click();
    });
    atom.commands.add('atom-workspace', 'build:no-confirm', function () {
      if (_this.saveConfirmView) {
        GoogleAnalytics.sendEvent('build', 'not confirmed');
        _this.saveConfirmView.cancel();
      }
    });

    atom.workspace.observeTextEditors(function (editor) {
      editor.onDidSave(function (event) {
        if (atom.config.get('build.buildOnSave')) {
          _this.build('save');
        }
      });
    });

    this.errorMatcher.on('error', function (message) {
      atom.notifications.addError('Error matching failed!', { detail: message });
    });

    this.errorMatcher.on('matched', function (id) {
      _this.buildView.scrollTo(id);
    });

    this.errorMatcher.on('match', function (text, id) {
      var callback = _this.errorMatcher.goto.bind(_this.errorMatcher, id);
      _this.buildView.link(text, id, callback);
    });

    this.refreshTargets()['catch'](function (e) {});
  },

  deactivate: function deactivate() {
    tools.forEach(function (tool) {
      tool.off.apply(tool.ctx, ['refresh']);
    });
    if (this.child) {
      this.child.removeAllListeners();
      kill(this.child.pid, 'SIGKILL');
      this.child = null;
    }
    clearTimeout(this.finishedTimer);
  },

  activePath: function activePath() {
    var textEditor = atom.workspace.getActiveTextEditor();
    if (!textEditor || !textEditor.getPath()) {
      /* default to building the first one if no editor is active */
      if (0 === atom.project.getPaths().length) {
        return false;
      }

      return atom.project.getPaths()[0];
    } else {
      /* otherwise, build the one in the root of the active editor */
      return _.find(atom.project.getPaths(), function (path) {
        var realpath = fs.realpathSync(path);
        return textEditor.getPath().substr(0, realpath.length) === realpath;
      });
    }
  },

  cmdDefaults: function cmdDefaults(path) {
    return {
      env: {},
      args: [],
      cwd: path,
      sh: true,
      errorMatch: ''
    };
  },

  refreshTargets: function refreshTargets() {
    var _this2 = this;

    var path = this.activePath();
    var prioritizedTarget;

    return Promise.resolve(tools).then(function () {
      if (!path) {
        throw new BuildError('No active project', 'No project is active, don\'t know what to build...');
      }

      return _.filter(tools, function (tool) {
        tool.ctx = {};
        return tool.isEligable.apply(tool.ctx, [path]);
      });
    }).then(function (tools) {
      return Promise.all(_.map(tools, function (tool) {
        GoogleAnalytics.sendEvent('build', 'tool eligible', tool.niceName);

        if (tool.on) {
          tool.off.apply(tool.ctx, ['refresh']);
          tool.on.apply(tool.ctx, ['refresh', _this2.refreshTargets.bind(_this2)]);
        }

        return tool.settings.apply(tool.ctx, [path]);
      }));
    }).then(_.flatten).then(function (settings) {
      if (0 === _.size(settings)) {
        throw new BuildError('No eligible build tool.', 'No tool can provide any build configurations.');
      }

      prioritizedTarget = settings[0].name;
      return _.map(settings, function (setting) {
        return [setting.name, _.defaults(setting, _this2.cmdDefaults(path))];
      });
    }).then(_.zipObject).then(function (targets) {
      if (_.isNull(_this2.activeTarget) || _.isUndefined(targets[_this2.activeTarget])) {
        /* Active target has been removed or not set. Set it to the highest prio target */
        _this2.activeTarget = prioritizedTarget;
      }

      _.forEach(_this2.targets, function (target) {
        target.dispose(); // Gets rid of keymaps and commands registered
      });

      _.forEach(targets, function (target, targetName) {
        if (!target.keymap) {
          target.dispose = _.noop;
          return;
        }

        GoogleAnalytics.sendEvent('keymap', 'registered', target.keymap);
        var commandName = 'build:trigger:' + targetName;
        var keymapSpec = { 'atom-workspace': {} };
        keymapSpec['atom-workspace'][target.keymap] = commandName;
        var keymapDispose = atom.keymaps.add(targetName, keymapSpec);
        var commandDispose = atom.commands.add('atom-workspace', commandName, _this2.build.bind(_this2, 'trigger'));
        target.dispose = function () {
          keymapDispose.dispose();
          commandDispose.dispose();
        };
      });

      return _this2.targets = targets;
    });
  },

  selectActiveTarget: function selectActiveTarget() {
    var _this3 = this;

    var targetsView = new TargetsView();
    targetsView.setLoading('Loading project build targets...…');

    this.refreshTargets().then(function (targets) {
      targetsView.setActiveTarget(_this3.activeTarget);
      targetsView.setItems(_.keys(targets));
      return targetsView.awaitSelection();
    }).then(function (newTarget) {
      _this3.activeTarget = newTarget;

      var workspaceElement = atom.views.getView(atom.workspace);
      atom.commands.dispatch(workspaceElement, 'build:trigger');
    })['catch'](function (err) {
      targetsView.setError(err.message);
    });
  },

  replace: function replace(value) {
    var env = _.extend(_.clone(process.env), this.cmd.env);
    value = value.replace(/\$(\w+)/g, function (match, name) {
      return name in env ? env[name] : match;
    });

    var editor = atom.workspace.getActiveTextEditor();
    if (editor && 'untitled' !== editor.getTitle()) {
      var activeFile = fs.realpathSync(editor.getPath());
      var activeFilePath = path.dirname(activeFile);
      value = value.replace('{FILE_ACTIVE}', activeFile);
      value = value.replace('{FILE_ACTIVE_PATH}', activeFilePath);
      value = value.replace('{FILE_ACTIVE_NAME}', path.basename(activeFile));
      value = value.replace('{FILE_ACTIVE_NAME_BASE}', path.basename(activeFile, path.extname(activeFile)));
    }
    var projectPaths = _.map(atom.project.getPaths(), function (projectPath) {
      try {
        return fs.realpathSync(projectPath);
      } catch (e) {}
    });
    var projectPath = _.find(projectPaths, function (projectPath) {
      return activeFilePath && activeFilePath.startsWith(projectPath);
    }) || projectPaths[0];

    value = value.replace('{PROJECT_PATH}', projectPath);
    if (atom.project.getRepositories[0]) {
      value = value.replace('{REPO_BRANCH_SHORT}', atom.project.getRepositories()[0].getShortHead());
    }

    return value;
  },

  startNewBuild: function startNewBuild(source, targetName) {
    var _this4 = this;

    this.cmd = {};
    this.match = [];

    Promise.resolve().then(function () {
      return _this4.activeTarget ? _this4.targets : _this4.refreshTargets();
    }).then(function (targets) {
      _this4.cmd = targets[targetName ? targetName : _this4.activeTarget];
      GoogleAnalytics.sendEvent('build', 'triggered');

      if (!_this4.cmd.exec) {
        atom.notifications.addError('Invalid build file.', { detail: 'No executable command specified.' });
        return;
      }

      var env = _.extend(_.clone(process.env), _this4.cmd.env);
      _.each(env, function (value, key, list) {
        list[key] = _this4.replace(value);
      });

      var args = _.map(_this4.cmd.args, _this4.replace.bind(_this4));

      _this4.cmd.exec = _this4.replace(_this4.cmd.exec);

      _this4.child = child_process.spawn(_this4.cmd.sh ? '/bin/sh' : _this4.cmd.exec, _this4.cmd.sh ? ['-c', [_this4.cmd.exec].concat(args).join(' ')] : args, { cwd: _this4.replace(_this4.cmd.cwd), env: env });

      _this4.stdout = new Buffer(0);
      _this4.child.stdout.on('data', function (buffer) {
        _this4.stdout = Buffer.concat([_this4.stdout, buffer]);
        _this4.buildView.append(buffer);
      });

      _this4.stderr = new Buffer(0);
      _this4.child.stderr.on('data', function (buffer) {
        _this4.stderr = Buffer.concat([_this4.stderr, buffer]);
        _this4.buildView.append(buffer);
      });

      _this4.child.on('error', function (err) {
        _this4.buildView.append((_this4.cmd.sh ? 'Unable to execute with sh: ' : 'Unable to execute: ') + _this4.cmd.exec + '\n');

        if (/\s/.test(_this4.cmd.exec) && !_this4.cmd.sh) {
          _this4.buildView.append('`cmd` cannot contain space. Use `args` for arguments.\n');
        }

        if ('ENOENT' === err.code) {
          _this4.buildView.append('Make sure `cmd` and `cwd` exists and have correct access permissions.');
        }
      });

      _this4.child.on('close', function (exitCode) {
        var t = _this4.targets[_this4.activeTarget];
        _this4.errorMatcher.set(t.errorMatch, _this4.replace(t.cwd), _this4.buildView.output.text());

        var success = 0 === exitCode && !_this4.errorMatcher.hasMatch();
        _this4.buildView.buildFinished(success);
        if (success) {
          GoogleAnalytics.sendEvent('build', 'succeeded');
          _this4.finishedTimer = setTimeout(function () {
            _this4.buildView.detach();
          }, 1000);
        } else {
          if (atom.config.get('build.scrollOnError')) {
            _this4.errorMatcher.matchFirst();
          }
          GoogleAnalytics.sendEvent('build', 'failed');
        }
        _this4.child = null;
      });

      _this4.buildView.buildStarted();
      _this4.buildView.append((_this4.cmd.sh ? 'Executing with sh: ' : 'Executing: ') + _this4.cmd.exec + [' '].concat(args).join(' ') + '\n');
    })['catch'](function (err) {
      if (err instanceof BuildError) {
        if (source === 'save') {
          // If there is no eligible build tool, and cause of build was a save, stay quiet.
          return;
        }

        atom.notifications.addWarning(err.name, { detail: err.message });
      } else if (err instanceof SyntaxError) {
        atom.notifications.addError('Invalid build file.', { detail: 'You have a syntax error in your build file: ' + err.message });
      } else {
        atom.notifications.addError('Ooops. Something went wrong.', { detail: err.message + (err.stack ? '\n' + err.stack : '') });
      }
    });
  },

  abort: function abort(cb) {
    var _this5 = this;

    this.child.removeAllListeners('close');
    this.child.on('close', function () {
      _this5.child = null;
      if (cb) {
        cb();
      }
    });

    try {
      kill(this.child.pid);
    } catch (e) {
      /* Something may have happened to the child (e.g. terminated by itself). Ignore this. */
    }

    this.child.killed = true;
  },

  build: function build(source, event) {
    var _this6 = this;

    clearTimeout(this.finishedTimer);

    this.doSaveConfirm(this.unsavedTextEditors(), function () {
      var next = _this6.startNewBuild.bind(_this6, source, event ? event.type.substr(14) : null);
      _this6.child ? _this6.abort(next) : next();
    });
  },

  doSaveConfirm: function doSaveConfirm(modifiedTextEditors, continuecb, cancelcb) {
    var saveAndContinue = function saveAndContinue(save) {
      _.each(modifiedTextEditors, function (textEditor) {
        save && textEditor.save();
      });
      continuecb();
    };

    if (0 === _.size(modifiedTextEditors) || atom.config.get('build.saveOnBuild')) {
      return saveAndContinue(true);
    }

    if (this.saveConfirmView) {
      this.saveConfirmView.destroy();
    }

    this.saveConfirmView = new SaveConfirmView();
    this.saveConfirmView.show(saveAndContinue, cancelcb);
  },

  unsavedTextEditors: function unsavedTextEditors() {
    return _.filter(atom.workspace.getTextEditors(), function (textEditor) {
      return textEditor.isModified() && 'untitled' !== textEditor.getTitle();
    });
  },

  stop: function stop() {

    clearTimeout(this.finishedTimer);
    if (this.child) {
      if (this.child.killed) {
        // This child has been killed, but hasn't terminated. Hide it from user.
        this.child.removeAllListeners();
        this.child = null;
        this.buildView.buildAborted();
        return;
      }

      this.abort(this.buildView.buildAborted.bind(this.buildView));

      this.buildView.buildAbortInitiated();
    } else {
      this.buildView.reset();
    }
  },

  consumeBuilder: function consumeBuilder(builders) {
    if (!(builders instanceof Array)) {
      builders = [builders];
    }
    tools = _.union(tools, builders);
    return new Disposable(function () {
      tools = _.difference(tools, builders);
    });
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2NoYW1wLy5hdG9tL3BhY2thZ2VzL2J1aWxkL2xpYi9idWlsZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7QUFDWixZQUFZLENBQUM7O0FBRWIsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzdDLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2QixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFCLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUM7QUFDNUMsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUVoQyxJQUFJLGVBQWUsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUNyRCxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUM1QyxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDeEMsSUFBSSxlQUFlLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDcEQsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDOUMsSUFBSSxLQUFLLEdBQUcsQ0FBRSxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUUsQ0FBQzs7QUFFeEMsU0FBUyxVQUFVLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTtBQUNqQyxNQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixNQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixPQUFLLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0NBQzNDOztBQUVELFVBQVUsQ0FBQyxTQUFT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YUFBYSxDQUFDLENBQUM7QUFDakMsUUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ2QsVUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTs7QUFFckIsWUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0FBQ2hDLFlBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFlBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDOUIsZUFBTztPQUNSOztBQUVELFVBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDOztBQUU3RCxVQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUM7S0FDdEMsTUFBTTtBQUNMLFVBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDeEI7R0FDRjs7QUFFRCxnQkFBYyxFQUFFLHdCQUFVLFFBQVEsRUFBRTtBQUNsQyxRQUFJLEVBQUUsUUFBUSxZQUFZLEtBQUssQ0FBQSxBQUFDLEVBQUU7QUFDaEMsY0FBUSxHQUFHLENBQUUsUUFBUSxDQUFFLENBQUM7S0FDekI7QUFDRCxTQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDakMsV0FBTyxJQUFJLFVBQVUsQ0FBQyxZQUFZO0FBQ2hDLFdBQUssR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztLQUN2QyxDQUFDLENBQUM7R0FDSjtDQUNGLENBQUMiLCJmaWxlIjoiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQvbGliL2J1aWxkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBjaGlsZF9wcm9jZXNzID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpO1xudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbnZhciBEaXNwb3NhYmxlID0gcmVxdWlyZSgnYXRvbScpLkRpc3Bvc2FibGU7XG52YXIga2lsbCA9IHJlcXVpcmUoJ3RyZWUta2lsbCcpO1xuXG52YXIgU2F2ZUNvbmZpcm1WaWV3ID0gcmVxdWlyZSgnLi9zYXZlLWNvbmZpcm0tdmlldycpO1xudmFyIFRhcmdldHNWaWV3ID0gcmVxdWlyZSgnLi90YXJnZXRzLXZpZXcnKTtcbnZhciBCdWlsZFZpZXcgPSByZXF1aXJlKCcuL2J1aWxkLXZpZXcnKTtcbnZhciBHb29nbGVBbmFseXRpY3MgPSByZXF1aXJlKCcuL2dvb2dsZS1hbmFseXRpY3MnKTtcbnZhciBFcnJvck1hdGNoZXIgPSByZXF1aXJlKCcuL2Vycm9yLW1hdGNoZXInKTtcbnZhciB0b29scyA9IFsgcmVxdWlyZSgnLi9hdG9tLWJ1aWxkJykgXTtcblxuZnVuY3Rpb24gQnVpbGRFcnJvcihuYW1lLCBtZXNzYWdlKSB7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIEJ1aWxkRXJyb3IpO1xufVxuXG5CdWlsZEVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcbkJ1aWxkRXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQnVpbGRFcnJvcjtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNvbmZpZzoge1xuICAgIHBhbmVsVmlzaWJpbGl0eToge1xuICAgICAgdGl0bGU6ICdQYW5lbCBWaXNpYmlsaXR5JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2V0IHdoZW4gdGhlIGJ1aWxkIHBhbmVsIHNob3VsZCBiZSB2aXNpYmxlLicsXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICdUb2dnbGUnLFxuICAgICAgZW51bTogWyAnVG9nZ2xlJywgJ0tlZXAgVmlzaWJsZScsICdTaG93IG9uIEVycm9yJywgJ0hpZGRlbicgXSxcbiAgICAgIG9yZGVyOiAxXG4gICAgfSxcbiAgICBidWlsZE9uU2F2ZToge1xuICAgICAgdGl0bGU6ICdBdXRvbWF0aWNhbGx5IGJ1aWxkIG9uIHNhdmUnLFxuICAgICAgZGVzY3JpcHRpb246ICdBdXRtYXRpY2FsbHkgYnVpbGQgeW91ciBwcm9qZWN0IGVhY2ggdGltZSBhbiBlZGl0b3IgaXMgc2F2ZWQuJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgb3JkZXI6IDJcbiAgICB9LFxuICAgIHNhdmVPbkJ1aWxkOiB7XG4gICAgICB0aXRsZTogJ0F1dG9tYXRpY2FsbHkgc2F2ZSBvbiBidWlsZCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ0F1dG9tYXRpY2FsbHkgc2F2ZSBhbGwgZWRpdGVkIGZpbGVzIHdoZW4gdHJpZ2dlcmluZyBhIGJ1aWxkLicsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIG9yZGVyOiAzXG4gICAgfSxcbiAgICBzY3JvbGxPbkVycm9yOiB7XG4gICAgICB0aXRsZTogJ0F1dG9tYXRpY2FsbHkgc2Nyb2xsIG9uIGJ1aWxkIGVycm9yJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQXV0b21hdGljYWxseSBzY3JvbGwgdG8gZmlyc3QgbWF0Y2hlZCBlcnJvciB3aGVuIGEgYnVpbGQgZmFpbGVkLicsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIG9yZGVyOiA0XG4gICAgfSxcbiAgICBzdGVhbEZvY3VzOiB7XG4gICAgICB0aXRsZTogJ1N0ZWFsIEZvY3VzJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnU3RlYWwgZm9jdXMgd2hlbiBvcGVuaW5nIGJ1aWxkIHBhbmVsLicsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgb3JkZXI6IDVcbiAgICB9LFxuICAgIG1vbm9jbGVIZWlnaHQ6IHtcbiAgICAgIHRpdGxlOiAnTW9ub2NsZSBIZWlnaHQnLFxuICAgICAgZGVzY3JpcHRpb246ICdIb3cgbXVjaCBvZiB0aGUgd29ya3NwYWNlIHRvIHVzZSBmb3IgYnVpbGQgcGFuZWwgd2hlbiBpdCBpcyBcIm1heGltaXplZFwiLicsXG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IDAuNzUsXG4gICAgICBtaW5pbXVtOiAwLjEsXG4gICAgICBtYXhpbXVtOiAwLjksXG4gICAgICBvcmRlcjogNlxuICAgIH0sXG4gICAgbWluaW1pemVkSGVpZ2h0OiB7XG4gICAgICB0aXRsZTogJ01pbmltaXplZCBIZWlnaHQnLFxuICAgICAgZGVzY3JpcHRpb246ICdIb3cgbXVjaCBvZiB0aGUgd29ya3NwYWNlIHRvIHVzZSBmb3IgYnVpbGQgcGFuZWwgd2hlbiBpdCBpcyBcIm1pbmltaXplZFwiLicsXG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IDAuMTUsXG4gICAgICBtaW5pbXVtOiAwLjEsXG4gICAgICBtYXhpbXVtOiAwLjksXG4gICAgICBvcmRlcjogN1xuICAgIH0sXG4gICAgcGFuZWxPcmllbnRhdGlvbjoge1xuICAgICAgdGl0bGU6ICdQYW5lbCBPcmllbnRhdGlvbicsXG4gICAgICBkZXNjcmlwdGlvbjogJ1doZXJlIHRvIGF0dGFjaCB0aGUgYnVpbGQgcGFuZWwnLFxuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAnQm90dG9tJyxcbiAgICAgIGVudW06IFsgJ0JvdHRvbScsICdUb3AnLCAnTGVmdCcsICdSaWdodCcgXSxcbiAgICAgIG9yZGVyOiA4XG4gICAgfVxuICB9LFxuXG4gIGFjdGl2YXRlOiBmdW5jdGlvbihzdGF0ZSkge1xuICAgIC8vIE1hbnVhbGx5IGFwcGVuZCAvdXNyL2xvY2FsL2JpbiBhcyBpdCBtYXkgbm90IGJlIHNldCBvbiBzb21lIHN5c3RlbXMsXG4gICAgLy8gYW5kIGl0J3MgY29tbW9uIHRvIGhhdmUgbm9kZSBpbnN0YWxsZWQgaGVyZS4gS2VlcCBpdCBhdCBlbmQgc28gaXQgd29uJ3RcbiAgICAvLyBhY2NpZGVudGlhbGx5IG92ZXJyaWRlIGFueSBvdGhlciBub2RlIGluc3RhbGxhdGlvblxuICAgIHByb2Nlc3MuZW52LlBBVEggKz0gJzovdXNyL2xvY2FsL2Jpbic7XG5cbiAgICB0aGlzLmJ1aWxkVmlldyA9IG5ldyBCdWlsZFZpZXcoKTtcblxuICAgIHRoaXMuY21kID0ge307XG4gICAgdGhpcy50YXJnZXRzID0ge307XG4gICAgdGhpcy5hY3RpdmVUYXJnZXQgPSBudWxsO1xuICAgIHRoaXMubWF0Y2ggPSBbXTtcbiAgICB0aGlzLnN0ZG91dCA9IG5ldyBCdWZmZXIoMCk7XG4gICAgdGhpcy5zdGRlcnIgPSBuZXcgQnVmZmVyKDApO1xuICAgIHRoaXMuZXJyb3JNYXRjaGVyID0gbmV3IEVycm9yTWF0Y2hlcigpO1xuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2J1aWxkOnRyaWdnZXInLCB0aGlzLmJ1aWxkLmJpbmQodGhpcywgJ3RyaWdnZXInKSk7XG4gICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2J1aWxkOnNlbGVjdC1hY3RpdmUtdGFyZ2V0JywgdGhpcy5zZWxlY3RBY3RpdmVUYXJnZXQuYmluZCh0aGlzKSk7XG4gICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2J1aWxkOnN0b3AnLCB0aGlzLnN0b3AuYmluZCh0aGlzKSk7XG4gICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2J1aWxkOmNvbmZpcm0nLCBmdW5jdGlvbigpIHtcbiAgICAgIEdvb2dsZUFuYWx5dGljcy5zZW5kRXZlbnQoJ2J1aWxkJywgJ2NvbmZpcm1lZCcpO1xuICAgICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5jbGljaygpO1xuICAgIH0pO1xuICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICdidWlsZDpuby1jb25maXJtJywgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc2F2ZUNvbmZpcm1WaWV3KSB7XG4gICAgICAgIEdvb2dsZUFuYWx5dGljcy5zZW5kRXZlbnQoJ2J1aWxkJywgJ25vdCBjb25maXJtZWQnKTtcbiAgICAgICAgdGhpcy5zYXZlQ29uZmlybVZpZXcuY2FuY2VsKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoKGVkaXRvcikgPT4ge1xuICAgICAgZWRpdG9yLm9uRGlkU2F2ZSgoZXZlbnQpID0+IHtcbiAgICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgnYnVpbGQuYnVpbGRPblNhdmUnKSkge1xuICAgICAgICAgIHRoaXMuYnVpbGQoJ3NhdmUnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmVycm9yTWF0Y2hlci5vbignZXJyb3InLCBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdFcnJvciBtYXRjaGluZyBmYWlsZWQhJywgeyBkZXRhaWw6IG1lc3NhZ2UgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmVycm9yTWF0Y2hlci5vbignbWF0Y2hlZCcsIChpZCkgPT4ge1xuICAgICAgdGhpcy5idWlsZFZpZXcuc2Nyb2xsVG8oaWQpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5lcnJvck1hdGNoZXIub24oJ21hdGNoJywgKHRleHQsIGlkKSA9PiB7XG4gICAgICB2YXIgY2FsbGJhY2sgPSB0aGlzLmVycm9yTWF0Y2hlci5nb3RvLmJpbmQodGhpcy5lcnJvck1hdGNoZXIsIGlkKTtcbiAgICAgIHRoaXMuYnVpbGRWaWV3LmxpbmsodGV4dCwgaWQsIGNhbGxiYWNrKTtcbiAgICB9KTtcblxuICAgIHRoaXMucmVmcmVzaFRhcmdldHMoKS5jYXRjaChmdW5jdGlvbihlKSB7fSk7XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZTogZnVuY3Rpb24oKSB7XG4gICAgdG9vbHMuZm9yRWFjaCh0b29sID0+IHtcbiAgICAgIHRvb2wub2ZmLmFwcGx5KHRvb2wuY3R4LCBbICdyZWZyZXNoJyBdKTtcbiAgICB9KTtcbiAgICBpZiAodGhpcy5jaGlsZCkge1xuICAgICAgdGhpcy5jaGlsZC5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgICAgIGtpbGwodGhpcy5jaGlsZC5waWQsICdTSUdLSUxMJyk7XG4gICAgICB0aGlzLmNoaWxkID0gbnVsbDtcbiAgICB9XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuZmluaXNoZWRUaW1lcik7XG4gIH0sXG5cbiAgYWN0aXZlUGF0aDogZnVuY3Rpb24gKCkge1xuICAgIHZhciB0ZXh0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgIGlmICghdGV4dEVkaXRvciB8fCAhdGV4dEVkaXRvci5nZXRQYXRoKCkpIHtcbiAgICAgIC8qIGRlZmF1bHQgdG8gYnVpbGRpbmcgdGhlIGZpcnN0IG9uZSBpZiBubyBlZGl0b3IgaXMgYWN0aXZlICovXG4gICAgICBpZiAoMCA9PT0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKCkubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvKiBvdGhlcndpc2UsIGJ1aWxkIHRoZSBvbmUgaW4gdGhlIHJvb3Qgb2YgdGhlIGFjdGl2ZSBlZGl0b3IgKi9cbiAgICAgIHJldHVybiBfLmZpbmQoYXRvbS5wcm9qZWN0LmdldFBhdGhzKCksIGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgICAgIHZhciByZWFscGF0aCA9IGZzLnJlYWxwYXRoU3luYyhwYXRoKTtcbiAgICAgICAgcmV0dXJuIHRleHRFZGl0b3IuZ2V0UGF0aCgpLnN1YnN0cigwLCByZWFscGF0aC5sZW5ndGgpID09PSByZWFscGF0aDtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcblxuICBjbWREZWZhdWx0czogZnVuY3Rpb24gKHBhdGgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZW52OiB7fSxcbiAgICAgIGFyZ3M6IFtdLFxuICAgICAgY3dkOiBwYXRoLFxuICAgICAgc2g6IHRydWUsXG4gICAgICBlcnJvck1hdGNoOiAnJ1xuICAgIH07XG4gIH0sXG5cbiAgcmVmcmVzaFRhcmdldHM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXRoID0gdGhpcy5hY3RpdmVQYXRoKCk7XG4gICAgdmFyIHByaW9yaXRpemVkVGFyZ2V0O1xuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0b29scylcbiAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFwYXRoKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEJ1aWxkRXJyb3IoJ05vIGFjdGl2ZSBwcm9qZWN0JywgJ05vIHByb2plY3QgaXMgYWN0aXZlLCBkb25cXCd0IGtub3cgd2hhdCB0byBidWlsZC4uLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF8uZmlsdGVyKHRvb2xzLCBmdW5jdGlvbiAodG9vbCkge1xuICAgICAgICAgIHRvb2wuY3R4ID0ge307XG4gICAgICAgICAgcmV0dXJuIHRvb2wuaXNFbGlnYWJsZS5hcHBseSh0b29sLmN0eCwgWyBwYXRoIF0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgICAudGhlbih0b29scyA9PiB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChfLm1hcCh0b29scywgdG9vbCA9PiB7XG4gICAgICAgICAgR29vZ2xlQW5hbHl0aWNzLnNlbmRFdmVudCgnYnVpbGQnLCAndG9vbCBlbGlnaWJsZScsIHRvb2wubmljZU5hbWUpO1xuXG4gICAgICAgICAgaWYgKHRvb2wub24pIHtcbiAgICAgICAgICAgIHRvb2wub2ZmLmFwcGx5KHRvb2wuY3R4LCBbICdyZWZyZXNoJyBdKTtcbiAgICAgICAgICAgIHRvb2wub24uYXBwbHkodG9vbC5jdHgsIFsgJ3JlZnJlc2gnLCB0aGlzLnJlZnJlc2hUYXJnZXRzLmJpbmQodGhpcykgXSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHRvb2wuc2V0dGluZ3MuYXBwbHkodG9vbC5jdHgsIFsgcGF0aCBdKTtcbiAgICAgICAgfSkpO1xuICAgICAgfSlcbiAgICAgIC50aGVuKF8uZmxhdHRlbilcbiAgICAgIC50aGVuKChzZXR0aW5ncykgPT4ge1xuICAgICAgICBpZiAoMCA9PT0gXy5zaXplKHNldHRpbmdzKSkge1xuICAgICAgICAgIHRocm93IG5ldyBCdWlsZEVycm9yKCdObyBlbGlnaWJsZSBidWlsZCB0b29sLicsICdObyB0b29sIGNhbiBwcm92aWRlIGFueSBidWlsZCBjb25maWd1cmF0aW9ucy4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaW9yaXRpemVkVGFyZ2V0ID0gc2V0dGluZ3NbMF0ubmFtZTtcbiAgICAgICAgcmV0dXJuIF8ubWFwKHNldHRpbmdzLCAoc2V0dGluZykgPT4ge1xuICAgICAgICAgIHJldHVybiBbIHNldHRpbmcubmFtZSwgXy5kZWZhdWx0cyhzZXR0aW5nLCB0aGlzLmNtZERlZmF1bHRzKHBhdGgpKSBdO1xuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgICAudGhlbihfLnppcE9iamVjdClcbiAgICAgIC50aGVuKCh0YXJnZXRzKSA9PiB7XG4gICAgICAgIGlmIChfLmlzTnVsbCh0aGlzLmFjdGl2ZVRhcmdldCkgfHwgXy5pc1VuZGVmaW5lZCh0YXJnZXRzW3RoaXMuYWN0aXZlVGFyZ2V0XSkpIHtcbiAgICAgICAgICAvKiBBY3RpdmUgdGFyZ2V0IGhhcyBiZWVuIHJlbW92ZWQgb3Igbm90IHNldC4gU2V0IGl0IHRvIHRoZSBoaWdoZXN0IHByaW8gdGFyZ2V0ICovXG4gICAgICAgICAgdGhpcy5hY3RpdmVUYXJnZXQgPSBwcmlvcml0aXplZFRhcmdldDtcbiAgICAgICAgfVxuXG4gICAgICAgIF8uZm9yRWFjaCh0aGlzLnRhcmdldHMsIGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgICB0YXJnZXQuZGlzcG9zZSgpOyAvLyBHZXRzIHJpZCBvZiBrZXltYXBzIGFuZCBjb21tYW5kcyByZWdpc3RlcmVkXG4gICAgICAgIH0pO1xuXG4gICAgICAgIF8uZm9yRWFjaCh0YXJnZXRzLCAodGFyZ2V0LCB0YXJnZXROYW1lKSA9PiB7XG4gICAgICAgICAgaWYgKCF0YXJnZXQua2V5bWFwKSB7XG4gICAgICAgICAgICB0YXJnZXQuZGlzcG9zZSA9IF8ubm9vcDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBHb29nbGVBbmFseXRpY3Muc2VuZEV2ZW50KCdrZXltYXAnLCAncmVnaXN0ZXJlZCcsIHRhcmdldC5rZXltYXApO1xuICAgICAgICAgIHZhciBjb21tYW5kTmFtZSA9ICdidWlsZDp0cmlnZ2VyOicgKyB0YXJnZXROYW1lO1xuICAgICAgICAgIHZhciBrZXltYXBTcGVjID0geyAnYXRvbS13b3Jrc3BhY2UnOiB7fSB9O1xuICAgICAgICAgIGtleW1hcFNwZWNbJ2F0b20td29ya3NwYWNlJ11bdGFyZ2V0LmtleW1hcF0gPSBjb21tYW5kTmFtZTtcbiAgICAgICAgICB2YXIga2V5bWFwRGlzcG9zZSA9IGF0b20ua2V5bWFwcy5hZGQodGFyZ2V0TmFtZSwga2V5bWFwU3BlYyk7XG4gICAgICAgICAgdmFyIGNvbW1hbmREaXNwb3NlID0gYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgY29tbWFuZE5hbWUsIHRoaXMuYnVpbGQuYmluZCh0aGlzLCAndHJpZ2dlcicpKTtcbiAgICAgICAgICB0YXJnZXQuZGlzcG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGtleW1hcERpc3Bvc2UuZGlzcG9zZSgpO1xuICAgICAgICAgICAgY29tbWFuZERpc3Bvc2UuZGlzcG9zZSgpO1xuICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiAodGhpcy50YXJnZXRzID0gdGFyZ2V0cyk7XG4gICAgICB9KTtcbiAgfSxcblxuICBzZWxlY3RBY3RpdmVUYXJnZXQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0YXJnZXRzVmlldyA9IG5ldyBUYXJnZXRzVmlldygpO1xuICAgIHRhcmdldHNWaWV3LnNldExvYWRpbmcoJ0xvYWRpbmcgcHJvamVjdCBidWlsZCB0YXJnZXRzLi4uXFx1MjAyNicpO1xuXG4gICAgdGhpcy5yZWZyZXNoVGFyZ2V0cygpLnRoZW4oKHRhcmdldHMpID0+IHtcbiAgICAgIHRhcmdldHNWaWV3LnNldEFjdGl2ZVRhcmdldCh0aGlzLmFjdGl2ZVRhcmdldCk7XG4gICAgICB0YXJnZXRzVmlldy5zZXRJdGVtcyhfLmtleXModGFyZ2V0cykpO1xuICAgICAgcmV0dXJuIHRhcmdldHNWaWV3LmF3YWl0U2VsZWN0aW9uKCk7XG4gICAgfSkudGhlbigobmV3VGFyZ2V0KSA9PiB7XG4gICAgICB0aGlzLmFjdGl2ZVRhcmdldCA9IG5ld1RhcmdldDtcblxuICAgICAgdmFyIHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpO1xuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dHJpZ2dlcicpO1xuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIHRhcmdldHNWaWV3LnNldEVycm9yKGVyci5tZXNzYWdlKTtcbiAgICB9KTtcbiAgfSxcblxuICByZXBsYWNlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciBlbnYgPSBfLmV4dGVuZChfLmNsb25lKHByb2Nlc3MuZW52KSwgdGhpcy5jbWQuZW52KTtcbiAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1xcJChcXHcrKS9nLCBmdW5jdGlvbihtYXRjaCwgbmFtZSkge1xuICAgICAgcmV0dXJuIG5hbWUgaW4gZW52ID8gZW52W25hbWVdIDogbWF0Y2g7XG4gICAgfSk7XG5cbiAgICB2YXIgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgIGlmIChlZGl0b3IgJiYgJ3VudGl0bGVkJyAhPT0gZWRpdG9yLmdldFRpdGxlKCkpIHtcbiAgICAgIHZhciBhY3RpdmVGaWxlID0gZnMucmVhbHBhdGhTeW5jKGVkaXRvci5nZXRQYXRoKCkpO1xuICAgICAgdmFyIGFjdGl2ZUZpbGVQYXRoID0gcGF0aC5kaXJuYW1lKGFjdGl2ZUZpbGUpO1xuICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKCd7RklMRV9BQ1RJVkV9JywgYWN0aXZlRmlsZSk7XG4gICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoJ3tGSUxFX0FDVElWRV9QQVRIfScsIGFjdGl2ZUZpbGVQYXRoKTtcbiAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgne0ZJTEVfQUNUSVZFX05BTUV9JywgcGF0aC5iYXNlbmFtZShhY3RpdmVGaWxlKSk7XG4gICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoJ3tGSUxFX0FDVElWRV9OQU1FX0JBU0V9JywgcGF0aC5iYXNlbmFtZShhY3RpdmVGaWxlLCBwYXRoLmV4dG5hbWUoYWN0aXZlRmlsZSkpKTtcbiAgICB9XG4gICAgdmFyIHByb2plY3RQYXRocyA9IF8ubWFwKGF0b20ucHJvamVjdC5nZXRQYXRocygpLCBmdW5jdGlvbihwcm9qZWN0UGF0aCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGZzLnJlYWxwYXRoU3luYyhwcm9qZWN0UGF0aCk7XG4gICAgICB9IGNhdGNoIChlKSB7fVxuICAgIH0pO1xuICAgIHZhciBwcm9qZWN0UGF0aCA9IF8uZmluZChwcm9qZWN0UGF0aHMsIGZ1bmN0aW9uKHByb2plY3RQYXRoKSB7XG4gICAgICByZXR1cm4gYWN0aXZlRmlsZVBhdGggJiYgYWN0aXZlRmlsZVBhdGguc3RhcnRzV2l0aChwcm9qZWN0UGF0aCk7XG4gICAgfSkgfHwgcHJvamVjdFBhdGhzWzBdO1xuXG4gICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKCd7UFJPSkVDVF9QQVRIfScsIHByb2plY3RQYXRoKTtcbiAgICBpZiAoYXRvbS5wcm9qZWN0LmdldFJlcG9zaXRvcmllc1swXSkge1xuICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKCd7UkVQT19CUkFOQ0hfU0hPUlR9JywgYXRvbS5wcm9qZWN0LmdldFJlcG9zaXRvcmllcygpWzBdLmdldFNob3J0SGVhZCgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH0sXG5cbiAgc3RhcnROZXdCdWlsZDogZnVuY3Rpb24oc291cmNlLCB0YXJnZXROYW1lKSB7XG4gICAgdGhpcy5jbWQgPSB7fTtcbiAgICB0aGlzLm1hdGNoID0gW107XG5cbiAgICBQcm9taXNlLnJlc29sdmUoKVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gKHRoaXMuYWN0aXZlVGFyZ2V0KSA/IHRoaXMudGFyZ2V0cyA6IHRoaXMucmVmcmVzaFRhcmdldHMoKTtcbiAgICAgIH0pXG4gICAgICAudGhlbigodGFyZ2V0cykgPT4ge1xuICAgICAgICB0aGlzLmNtZCA9IHRhcmdldHNbdGFyZ2V0TmFtZSA/IHRhcmdldE5hbWUgOiB0aGlzLmFjdGl2ZVRhcmdldF07XG4gICAgICAgIEdvb2dsZUFuYWx5dGljcy5zZW5kRXZlbnQoJ2J1aWxkJywgJ3RyaWdnZXJlZCcpO1xuXG4gICAgICAgIGlmICghdGhpcy5jbWQuZXhlYykge1xuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignSW52YWxpZCBidWlsZCBmaWxlLicsIHsgZGV0YWlsOiAnTm8gZXhlY3V0YWJsZSBjb21tYW5kIHNwZWNpZmllZC4nIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBlbnYgPSBfLmV4dGVuZChfLmNsb25lKHByb2Nlc3MuZW52KSwgdGhpcy5jbWQuZW52KTtcbiAgICAgICAgXy5lYWNoKGVudiwgKHZhbHVlLCBrZXksIGxpc3QpID0+IHtcbiAgICAgICAgICBsaXN0W2tleV0gPSB0aGlzLnJlcGxhY2UodmFsdWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYXJncyA9IF8ubWFwKHRoaXMuY21kLmFyZ3MsIHRoaXMucmVwbGFjZS5iaW5kKHRoaXMpKTtcblxuICAgICAgICB0aGlzLmNtZC5leGVjID0gdGhpcy5yZXBsYWNlKHRoaXMuY21kLmV4ZWMpO1xuXG4gICAgICAgIHRoaXMuY2hpbGQgPSBjaGlsZF9wcm9jZXNzLnNwYXduKFxuICAgICAgICAgIHRoaXMuY21kLnNoID8gJy9iaW4vc2gnIDogdGhpcy5jbWQuZXhlYyxcbiAgICAgICAgICB0aGlzLmNtZC5zaCA/IFsgJy1jJywgWyB0aGlzLmNtZC5leGVjIF0uY29uY2F0KGFyZ3MpLmpvaW4oJyAnKSBdIDogYXJncyxcbiAgICAgICAgICB7IGN3ZDogdGhpcy5yZXBsYWNlKHRoaXMuY21kLmN3ZCksIGVudjogZW52IH1cbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLnN0ZG91dCA9IG5ldyBCdWZmZXIoMCk7XG4gICAgICAgIHRoaXMuY2hpbGQuc3Rkb3V0Lm9uKCdkYXRhJywgKGJ1ZmZlcikgPT4ge1xuICAgICAgICAgIHRoaXMuc3Rkb3V0ID0gQnVmZmVyLmNvbmNhdChbIHRoaXMuc3Rkb3V0LCBidWZmZXIgXSk7XG4gICAgICAgICAgdGhpcy5idWlsZFZpZXcuYXBwZW5kKGJ1ZmZlcik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc3RkZXJyID0gbmV3IEJ1ZmZlcigwKTtcbiAgICAgICAgdGhpcy5jaGlsZC5zdGRlcnIub24oJ2RhdGEnLCAoYnVmZmVyKSA9PiB7XG4gICAgICAgICAgdGhpcy5zdGRlcnIgPSBCdWZmZXIuY29uY2F0KFsgdGhpcy5zdGRlcnIsIGJ1ZmZlciBdKTtcbiAgICAgICAgICB0aGlzLmJ1aWxkVmlldy5hcHBlbmQoYnVmZmVyKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5jaGlsZC5vbignZXJyb3InLCAoZXJyKSA9PiB7XG4gICAgICAgICAgdGhpcy5idWlsZFZpZXcuYXBwZW5kKCh0aGlzLmNtZC5zaCA/ICdVbmFibGUgdG8gZXhlY3V0ZSB3aXRoIHNoOiAnIDogJ1VuYWJsZSB0byBleGVjdXRlOiAnKSArIHRoaXMuY21kLmV4ZWMgKyAnXFxuJyk7XG5cbiAgICAgICAgICBpZiAoL1xccy8udGVzdCh0aGlzLmNtZC5leGVjKSAmJiAhdGhpcy5jbWQuc2gpIHtcbiAgICAgICAgICAgIHRoaXMuYnVpbGRWaWV3LmFwcGVuZCgnYGNtZGAgY2Fubm90IGNvbnRhaW4gc3BhY2UuIFVzZSBgYXJnc2AgZm9yIGFyZ3VtZW50cy5cXG4nKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoJ0VOT0VOVCcgPT09IGVyci5jb2RlKSB7XG4gICAgICAgICAgICB0aGlzLmJ1aWxkVmlldy5hcHBlbmQoJ01ha2Ugc3VyZSBgY21kYCBhbmQgYGN3ZGAgZXhpc3RzIGFuZCBoYXZlIGNvcnJlY3QgYWNjZXNzIHBlcm1pc3Npb25zLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5jaGlsZC5vbignY2xvc2UnLCAoZXhpdENvZGUpID0+IHtcbiAgICAgICAgICB2YXIgdCA9IHRoaXMudGFyZ2V0c1t0aGlzLmFjdGl2ZVRhcmdldF07XG4gICAgICAgICAgdGhpcy5lcnJvck1hdGNoZXIuc2V0KHQuZXJyb3JNYXRjaCwgdGhpcy5yZXBsYWNlKHQuY3dkKSwgdGhpcy5idWlsZFZpZXcub3V0cHV0LnRleHQoKSk7XG5cbiAgICAgICAgICB2YXIgc3VjY2VzcyA9IDAgPT09IGV4aXRDb2RlICYmICF0aGlzLmVycm9yTWF0Y2hlci5oYXNNYXRjaCgpO1xuICAgICAgICAgIHRoaXMuYnVpbGRWaWV3LmJ1aWxkRmluaXNoZWQoc3VjY2Vzcyk7XG4gICAgICAgICAgaWYgKHN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIEdvb2dsZUFuYWx5dGljcy5zZW5kRXZlbnQoJ2J1aWxkJywgJ3N1Y2NlZWRlZCcpO1xuICAgICAgICAgICAgdGhpcy5maW5pc2hlZFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuYnVpbGRWaWV3LmRldGFjaCgpO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2J1aWxkLnNjcm9sbE9uRXJyb3InKSkge1xuICAgICAgICAgICAgICB0aGlzLmVycm9yTWF0Y2hlci5tYXRjaEZpcnN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBHb29nbGVBbmFseXRpY3Muc2VuZEV2ZW50KCdidWlsZCcsICdmYWlsZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5jaGlsZCA9IG51bGw7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuYnVpbGRWaWV3LmJ1aWxkU3RhcnRlZCgpO1xuICAgICAgICB0aGlzLmJ1aWxkVmlldy5hcHBlbmQoKHRoaXMuY21kLnNoID8gJ0V4ZWN1dGluZyB3aXRoIHNoOiAnIDogJ0V4ZWN1dGluZzogJykgKyB0aGlzLmNtZC5leGVjICsgWyAnICcgXS5jb25jYXQoYXJncykuam9pbignICcpICsgJ1xcbicpO1xuICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgQnVpbGRFcnJvcikge1xuICAgICAgICAgIGlmIChzb3VyY2UgPT09ICdzYXZlJykge1xuICAgICAgICAgICAgLy8gSWYgdGhlcmUgaXMgbm8gZWxpZ2libGUgYnVpbGQgdG9vbCwgYW5kIGNhdXNlIG9mIGJ1aWxkIHdhcyBhIHNhdmUsIHN0YXkgcXVpZXQuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoZXJyLm5hbWUsIHsgZGV0YWlsOiBlcnIubWVzc2FnZSB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChlcnIgaW5zdGFuY2VvZiBTeW50YXhFcnJvcikge1xuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignSW52YWxpZCBidWlsZCBmaWxlLicsIHsgZGV0YWlsOiAnWW91IGhhdmUgYSBzeW50YXggZXJyb3IgaW4geW91ciBidWlsZCBmaWxlOiAnICsgZXJyLm1lc3NhZ2UgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdPb29wcy4gU29tZXRoaW5nIHdlbnQgd3JvbmcuJywgeyBkZXRhaWw6IGVyci5tZXNzYWdlICsgKGVyci5zdGFjayA/ICdcXG4nICsgZXJyLnN0YWNrIDogJycpIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfSxcblxuICBhYm9ydDogZnVuY3Rpb24oY2IpIHtcbiAgICB0aGlzLmNoaWxkLnJlbW92ZUFsbExpc3RlbmVycygnY2xvc2UnKTtcbiAgICB0aGlzLmNoaWxkLm9uKCdjbG9zZScsICgpID0+IHtcbiAgICAgIHRoaXMuY2hpbGQgPSBudWxsO1xuICAgICAgaWYgKGNiKSB7XG4gICAgICAgIGNiKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0cnkge1xuICAgICAga2lsbCh0aGlzLmNoaWxkLnBpZCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLyogU29tZXRoaW5nIG1heSBoYXZlIGhhcHBlbmVkIHRvIHRoZSBjaGlsZCAoZS5nLiB0ZXJtaW5hdGVkIGJ5IGl0c2VsZikuIElnbm9yZSB0aGlzLiAqL1xuICAgIH1cblxuICAgIHRoaXMuY2hpbGQua2lsbGVkID0gdHJ1ZTtcbiAgfSxcblxuICBidWlsZDogZnVuY3Rpb24oc291cmNlLCBldmVudCkge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLmZpbmlzaGVkVGltZXIpO1xuXG4gICAgdGhpcy5kb1NhdmVDb25maXJtKHRoaXMudW5zYXZlZFRleHRFZGl0b3JzKCksICgpID0+IHtcbiAgICAgIHZhciBuZXh0ID0gdGhpcy5zdGFydE5ld0J1aWxkLmJpbmQodGhpcywgc291cmNlLCBldmVudCA/IGV2ZW50LnR5cGUuc3Vic3RyKDE0KSA6IG51bGwpO1xuICAgICAgdGhpcy5jaGlsZCA/IHRoaXMuYWJvcnQobmV4dCkgOiBuZXh0KCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgZG9TYXZlQ29uZmlybTogZnVuY3Rpb24obW9kaWZpZWRUZXh0RWRpdG9ycywgY29udGludWVjYiwgY2FuY2VsY2IpIHtcbiAgICB2YXIgc2F2ZUFuZENvbnRpbnVlID0gZnVuY3Rpb24oc2F2ZSkge1xuICAgICAgXy5lYWNoKG1vZGlmaWVkVGV4dEVkaXRvcnMsIGZ1bmN0aW9uKHRleHRFZGl0b3IpIHtcbiAgICAgICAgc2F2ZSAmJiB0ZXh0RWRpdG9yLnNhdmUoKTtcbiAgICAgIH0pO1xuICAgICAgY29udGludWVjYigpO1xuICAgIH07XG5cbiAgICBpZiAoMCA9PT0gXy5zaXplKG1vZGlmaWVkVGV4dEVkaXRvcnMpIHx8IGF0b20uY29uZmlnLmdldCgnYnVpbGQuc2F2ZU9uQnVpbGQnKSkge1xuICAgICAgcmV0dXJuIHNhdmVBbmRDb250aW51ZSh0cnVlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zYXZlQ29uZmlybVZpZXcpIHtcbiAgICAgIHRoaXMuc2F2ZUNvbmZpcm1WaWV3LmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICB0aGlzLnNhdmVDb25maXJtVmlldyA9IG5ldyBTYXZlQ29uZmlybVZpZXcoKTtcbiAgICB0aGlzLnNhdmVDb25maXJtVmlldy5zaG93KHNhdmVBbmRDb250aW51ZSwgY2FuY2VsY2IpO1xuICB9LFxuXG4gIHVuc2F2ZWRUZXh0RWRpdG9yczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCksIGZ1bmN0aW9uKHRleHRFZGl0b3IpIHtcbiAgICAgIHJldHVybiB0ZXh0RWRpdG9yLmlzTW9kaWZpZWQoKSAmJiAoJ3VudGl0bGVkJyAhPT0gdGV4dEVkaXRvci5nZXRUaXRsZSgpKTtcbiAgICB9KTtcbiAgfSxcblxuICBzdG9wOiBmdW5jdGlvbigpIHtcblxuICAgIGNsZWFyVGltZW91dCh0aGlzLmZpbmlzaGVkVGltZXIpO1xuICAgIGlmICh0aGlzLmNoaWxkKSB7XG4gICAgICBpZiAodGhpcy5jaGlsZC5raWxsZWQpIHtcbiAgICAgICAgLy8gVGhpcyBjaGlsZCBoYXMgYmVlbiBraWxsZWQsIGJ1dCBoYXNuJ3QgdGVybWluYXRlZC4gSGlkZSBpdCBmcm9tIHVzZXIuXG4gICAgICAgIHRoaXMuY2hpbGQucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG4gICAgICAgIHRoaXMuY2hpbGQgPSBudWxsO1xuICAgICAgICB0aGlzLmJ1aWxkVmlldy5idWlsZEFib3J0ZWQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmFib3J0KHRoaXMuYnVpbGRWaWV3LmJ1aWxkQWJvcnRlZC5iaW5kKHRoaXMuYnVpbGRWaWV3KSk7XG5cbiAgICAgIHRoaXMuYnVpbGRWaWV3LmJ1aWxkQWJvcnRJbml0aWF0ZWQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5idWlsZFZpZXcucmVzZXQoKTtcbiAgICB9XG4gIH0sXG5cbiAgY29uc3VtZUJ1aWxkZXI6IGZ1bmN0aW9uIChidWlsZGVycykge1xuICAgIGlmICghKGJ1aWxkZXJzIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICBidWlsZGVycyA9IFsgYnVpbGRlcnMgXTtcbiAgICB9XG4gICAgdG9vbHMgPSBfLnVuaW9uKHRvb2xzLCBidWlsZGVycyk7XG4gICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKGZ1bmN0aW9uICgpIHtcbiAgICAgIHRvb2xzID0gXy5kaWZmZXJlbmNlKHRvb2xzLCBidWlsZGVycyk7XG4gICAgfSk7XG4gIH1cbn07XG4iXX0=
//# sourceURL=/home/champ/.atom/packages/build/lib/build.js
