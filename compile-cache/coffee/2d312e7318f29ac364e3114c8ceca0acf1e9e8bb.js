(function() {
  var AsmViewer, CompositeDisposable, DebuggerView, GDB, Point, Range, TextBuffer, TextEditor, View, fs, path, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range, TextEditor = _ref.TextEditor, TextBuffer = _ref.TextBuffer, CompositeDisposable = _ref.CompositeDisposable;

  View = require('atom-space-pen-views').View;

  GDB = require('./backend/gdb/gdb');

  fs = require('fs');

  path = require('path');

  AsmViewer = require('./asm-viewer');

  module.exports = DebuggerView = (function(_super) {
    __extends(DebuggerView, _super);

    function DebuggerView() {
      return DebuggerView.__super__.constructor.apply(this, arguments);
    }

    DebuggerView.content = function() {
      return this.div({
        "class": 'atom-debugger'
      }, (function(_this) {
        return function() {
          _this.header({
            "class": 'header'
          }, function() {
            _this.span({
              "class": 'header-item title'
            }, 'Atom Debugger');
            return _this.span({
              "class": 'header-item sub-title',
              outlet: 'targetLable'
            });
          });
          return _this.div({
            "class": 'btn-toolbar'
          }, function() {
            return _this.div({
              "class": 'btn-group'
            }, function() {
              _this.div({
                "class": 'btn',
                outlet: 'runButton'
              }, 'Run');
              _this.div({
                "class": 'btn disabled',
                outlet: 'continueButton'
              }, 'Continue');
              _this.div({
                "class": 'btn disabled',
                outlet: 'interruptButton'
              }, 'Interrupt');
              _this.div({
                "class": 'btn disabled',
                outlet: 'nextButton'
              }, 'Next');
              return _this.div({
                "class": 'btn disabled',
                outlet: 'stepButton'
              }, 'Step');
            });
          });
        };
      })(this));
    };

    DebuggerView.prototype.initialize = function(target, mainBreak) {
      var contextMenuCreated;
      this.GDB = new GDB(target);
      this.targetLable.text(target);
      this.GDB.set('target-async', 'on', function(result) {});
      this.GDB.setSourceDirectories(atom.project.getPaths(), function(done) {});
      this.breaks = {};
      this.stopped = {
        marker: null,
        fullpath: null,
        line: null
      };
      this.asms = {};
      this.cachedEditors = {};
      this.handleEvents();
      contextMenuCreated = (function(_this) {
        return function(event) {
          var component, editor, position;
          if (editor = _this.getActiveTextEditor()) {
            component = atom.views.getView(editor).component;
            position = component.screenPositionForMouseEvent(event);
            return _this.contextLine = editor.bufferPositionForScreenPosition(position).row;
          }
        };
      })(this);
      this.menu = atom.contextMenu.add({
        'atom-text-editor': [
          {
            label: 'Toggle Breakpoint',
            command: 'debugger:toggle-breakpoint',
            created: contextMenuCreated
          }
        ]
      });
      this.panel = atom.workspace.addBottomPanel({
        item: this,
        visible: true
      });
      if (mainBreak) {
        this.insertMainBreak();
      }
      return this.listExecFile();
    };

    DebuggerView.prototype.getActiveTextEditor = function() {
      return atom.workspace.getActiveTextEditor();
    };

    DebuggerView.prototype.exists = function(fullpath) {
      return fs.existsSync(fullpath);
    };

    DebuggerView.prototype.getEditor = function(fullpath) {
      return this.cachedEditors[fullpath];
    };

    DebuggerView.prototype.goExitedStatus = function() {
      this.continueButton.addClass('disabled');
      this.interruptButton.addClass('disabled');
      this.stepButton.addClass('disabled');
      this.nextButton.addClass('disabled');
      this.removeClass('running');
      return this.addClass('stopped');
    };

    DebuggerView.prototype.goStoppedStatus = function() {
      this.continueButton.removeClass('disabled');
      this.interruptButton.addClass('disabled');
      this.stepButton.removeClass('disabled');
      this.nextButton.removeClass('disabled');
      this.removeClass('running');
      return this.addClass('stopped');
    };

    DebuggerView.prototype.goRunningStatus = function() {
      var _ref1;
      if ((_ref1 = this.stopped.marker) != null) {
        _ref1.destroy();
      }
      this.stopped = {
        marker: null,
        fullpath: null,
        line: null
      };
      this.continueButton.addClass('disabled');
      this.interruptButton.removeClass('disabled');
      this.stepButton.addClass('disabled');
      this.nextButton.addClass('disabled');
      this.removeClass('stopped');
      return this.addClass('running');
    };

    DebuggerView.prototype.insertMainBreak = function() {
      return this.GDB.insertBreak({
        location: 'main'
      }, (function(_this) {
        return function(abreak) {
          var fullpath, line;
          if (abreak) {
            if (abreak.fullname) {
              fullpath = path.resolve(abreak.fullname);
              line = Number(abreak.line) - 1;
              return _this.insertBreakWithoutEditor(fullpath, line);
            } else {
              return atom.confirm({
                detailedMessage: "Can't find debugging symbols\nPlease recompile with `-g` option.",
                buttons: {
                  Exit: function() {
                    return _this.destroy();
                  }
                }
              });
            }
          }
        };
      })(this));
    };

    DebuggerView.prototype.listExecFile = function() {
      return this.GDB.listExecFile((function(_this) {
        return function(file) {
          var fullpath, line;
          if (file) {
            fullpath = path.resolve(file.fullname);
            line = Number(file.line) - 1;
            if (_this.exists(fullpath)) {
              return atom.workspace.open(fullpath, function(editor) {
                return _this.moveToLine(editor, line);
              });
            } else {
              return atom.confirm({
                detailedMessage: "Can't find file " + file.file + "\nPlease add path to tree-view and try again.",
                buttons: {
                  Exit: function() {
                    return _this.destroy();
                  }
                }
              });
            }
          }
        };
      })(this));
    };

    DebuggerView.prototype.toggleBreak = function(editor, line) {
      if (this.hasBreak(editor, line)) {
        return this.deleteBreak(editor, line);
      } else {
        return this.insertBreak(editor, line);
      }
    };

    DebuggerView.prototype.hasBreak = function(editor, line) {
      return line in this.breaks[editor.getPath()];
    };

    DebuggerView.prototype.deleteBreak = function(editor, line) {
      var abreak, fullpath, marker, _ref1;
      fullpath = editor.getPath();
      _ref1 = this.breaks[fullpath][line], abreak = _ref1.abreak, marker = _ref1.marker;
      return this.GDB.deleteBreak(abreak.number, (function(_this) {
        return function(done) {
          if (done) {
            marker.destroy();
            return delete _this.breaks[fullpath][line];
          }
        };
      })(this));
    };

    DebuggerView.prototype.insertBreak = function(editor, line) {
      var fullpath;
      fullpath = editor.getPath();
      return this.GDB.insertBreak({
        location: "" + fullpath + ":" + (line + 1)
      }, (function(_this) {
        return function(abreak) {
          var marker;
          if (abreak) {
            marker = _this.markBreakLine(editor, line);
            return _this.breaks[fullpath][line] = {
              abreak: abreak,
              marker: marker
            };
          }
        };
      })(this));
    };

    DebuggerView.prototype.insertBreakWithoutEditor = function(fullpath, line) {
      var _base;
      if ((_base = this.breaks)[fullpath] == null) {
        _base[fullpath] = {};
      }
      return this.GDB.insertBreak({
        location: "" + fullpath + ":" + (line + 1)
      }, (function(_this) {
        return function(abreak) {
          var editor, marker;
          if (abreak) {
            if (editor = _this.getEditor(fullpath)) {
              marker = _this.markBreakLine(editor, line);
            } else {
              marker = null;
            }
            return _this.breaks[fullpath][line] = {
              abreak: abreak,
              marker: marker
            };
          }
        };
      })(this));
    };

    DebuggerView.prototype.moveToLine = function(editor, line) {
      editor.scrollToBufferPosition(new Point(line));
      editor.setCursorBufferPosition(new Point(line));
      return editor.moveToFirstCharacterOfLine();
    };

    DebuggerView.prototype.markBreakLine = function(editor, line) {
      var marker, range;
      range = new Range([line, 0], [line + 1, 0]);
      marker = editor.markBufferRange(range, {
        invalidate: 'never'
      });
      editor.decorateMarker(marker, {
        type: 'line-number',
        "class": 'debugger-breakpoint-line'
      });
      return marker;
    };

    DebuggerView.prototype.markStoppedLine = function(editor, line) {
      var marker, range;
      range = new Range([line, 0], [line + 1, 0]);
      marker = editor.markBufferRange(range, {
        invalidate: 'never'
      });
      editor.decorateMarker(marker, {
        type: 'line-number',
        "class": 'debugger-stopped-line'
      });
      editor.decorateMarker(marker, {
        type: 'highlight',
        "class": 'selection'
      });
      this.moveToLine(editor, line);
      return marker;
    };

    DebuggerView.prototype.refreshBreakMarkers = function(editor) {
      var abreak, fullpath, line, marker, _ref1, _ref2, _results;
      fullpath = editor.getPath();
      _ref1 = this.breaks[fullpath];
      _results = [];
      for (line in _ref1) {
        _ref2 = _ref1[line], abreak = _ref2.abreak, marker = _ref2.marker;
        marker = this.markBreakLine(editor, Number(line));
        _results.push(this.breaks[fullpath][line] = {
          abreak: abreak,
          marker: marker
        });
      }
      return _results;
    };

    DebuggerView.prototype.refreshStoppedMarker = function(editor) {
      var fullpath;
      fullpath = editor.getPath();
      if (fullpath === this.stopped.fullpath) {
        return this.stopped.marker = this.markStoppedLine(editor, this.stopped.line);
      }
    };

    DebuggerView.prototype.hackGutterDblClick = function(editor) {
      var component, gutter;
      component = atom.views.getView(editor).component;
      gutter = component.gutterComponent;
      if (gutter == null) {
        gutter = component.gutterContainerComponent;
      }
      return gutter.domNode.addEventListener('dblclick', (function(_this) {
        return function(event) {
          var line, position, selection;
          position = component.screenPositionForMouseEvent(event);
          line = editor.bufferPositionForScreenPosition(position).row;
          _this.toggleBreak(editor, line);
          selection = editor.selectionsForScreenRows(line, line + 1)[0];
          return selection != null ? selection.clear() : void 0;
        };
      })(this));
    };

    DebuggerView.prototype.handleEvents = function() {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', 'debugger:toggle-breakpoint', (function(_this) {
        return function() {
          return _this.toggleBreak(_this.getActiveTextEditor(), _this.contextLine);
        };
      })(this)));
      this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var fullpath, _base;
          fullpath = editor.getPath();
          _this.cachedEditors[fullpath] = editor;
          if ((_base = _this.breaks)[fullpath] == null) {
            _base[fullpath] = {};
          }
          _this.refreshBreakMarkers(editor);
          _this.refreshStoppedMarker(editor);
          return _this.hackGutterDblClick(editor);
        };
      })(this)));
      this.subscriptions.add(atom.project.onDidChangePaths((function(_this) {
        return function(paths) {
          return _this.GDB.setSourceDirectories(paths, function(done) {});
        };
      })(this)));
      this.runButton.on('click', (function(_this) {
        return function() {
          return _this.GDB.run(function(result) {});
        };
      })(this));
      this.continueButton.on('click', (function(_this) {
        return function() {
          return _this.GDB["continue"](function(result) {});
        };
      })(this));
      this.interruptButton.on('click', (function(_this) {
        return function() {
          return _this.GDB.interrupt(function(result) {});
        };
      })(this));
      this.nextButton.on('click', (function(_this) {
        return function() {
          return _this.GDB.next(function(result) {});
        };
      })(this));
      this.stepButton.on('click', (function(_this) {
        return function() {
          return _this.GDB.step(function(result) {});
        };
      })(this));
      this.GDB.onExecAsyncRunning((function(_this) {
        return function(result) {
          return _this.goRunningStatus();
        };
      })(this));
      return this.GDB.onExecAsyncStopped((function(_this) {
        return function(result) {
          var frame, fullpath, line;
          _this.goStoppedStatus();
          if (!(frame = result.frame)) {
            return _this.goExitedStatus();
          } else {
            fullpath = path.resolve(frame.fullname);
            line = Number(frame.line) - 1;
            if (_this.exists(fullpath)) {
              return atom.workspace.open(fullpath, {
                debugging: true,
                fullpath: fullpath,
                startline: line
              }).done(function(editor) {
                return _this.stopped = {
                  marker: _this.markStoppedLine(editor, line),
                  fullpath: fullpath,
                  line: line
                };
              });
            } else {
              return _this.GDB.next(function(result) {});
            }
          }
        };
      })(this));
    };

    DebuggerView.prototype.destroy = function() {
      var abreak, breaks, component, editor, fullpath, gutter, line, marker, _i, _len, _ref1, _ref2, _ref3, _ref4;
      this.GDB.destroy();
      this.subscriptions.dispose();
      if ((_ref1 = this.stopped.marker) != null) {
        _ref1.destroy();
      }
      this.menu.dispose();
      _ref2 = this.breaks;
      for (fullpath in _ref2) {
        breaks = _ref2[fullpath];
        for (line in breaks) {
          _ref3 = breaks[line], abreak = _ref3.abreak, marker = _ref3.marker;
          marker.destroy();
        }
      }
      _ref4 = atom.workspace.getTextEditors();
      for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
        editor = _ref4[_i];
        component = atom.views.getView(editor).component;
        gutter = component.gutterComponent;
        if (gutter == null) {
          gutter = component.gutterContainerComponent;
        }
        gutter.domNode.removeEventListener('dblclick');
      }
      this.panel.destroy();
      return this.detach();
    };

    return DebuggerView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1kZWJ1Z2dlci9saWIvZGVidWdnZXItdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNkdBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQThELE9BQUEsQ0FBUSxNQUFSLENBQTlELEVBQUMsYUFBQSxLQUFELEVBQVEsYUFBQSxLQUFSLEVBQWUsa0JBQUEsVUFBZixFQUEyQixrQkFBQSxVQUEzQixFQUF1QywyQkFBQSxtQkFBdkMsQ0FBQTs7QUFBQSxFQUNDLE9BQVEsT0FBQSxDQUFRLHNCQUFSLEVBQVIsSUFERCxDQUFBOztBQUFBLEVBRUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxtQkFBUixDQUZOLENBQUE7O0FBQUEsRUFHQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FITCxDQUFBOztBQUFBLEVBSUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSlAsQ0FBQTs7QUFBQSxFQUtBLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQUxaLENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osbUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsWUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sZUFBUDtPQUFMLEVBQTZCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDM0IsVUFBQSxLQUFDLENBQUEsTUFBRCxDQUFRO0FBQUEsWUFBQSxPQUFBLEVBQU8sUUFBUDtXQUFSLEVBQXlCLFNBQUEsR0FBQTtBQUN2QixZQUFBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxjQUFBLE9BQUEsRUFBTyxtQkFBUDthQUFOLEVBQWtD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

//# sourceURL=/home/champ/.atom/packages/atom-debugger/lib/debugger-view.coffee
