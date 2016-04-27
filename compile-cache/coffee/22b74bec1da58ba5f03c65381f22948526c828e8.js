(function() {
  var $, Breakpoint, BreakpointMarker, Codepoint, CompositeDisposable, Emitter, GlobalContext, PhpDebug, PhpDebugBreakpointsUri, PhpDebugContextUri, PhpDebugStackUri, PhpDebugStatusView, PhpDebugUnifiedUri, PhpDebugWatchUri, Watchpoint, createBreakpointsView, createContextView, createWatchView, events, helpers;

  CompositeDisposable = require('atom').CompositeDisposable;

  Emitter = require('event-kit').Emitter;

  $ = require('atom-space-pen-views').$;

  events = require('events');

  Codepoint = require('./models/codepoint');

  Breakpoint = require('./models/breakpoint');

  BreakpointMarker = require('./models/breakpoint-marker');

  Watchpoint = require('./models/watchpoint');

  GlobalContext = require('./models/global-context');

  helpers = require('./helpers');

  PhpDebugStatusView = require('./status/php-debug-status-view');

  PhpDebugContextUri = "phpdebug://context";

  PhpDebugStackUri = "phpdebug://stack";

  PhpDebugBreakpointsUri = "phpdebug://breakpoints";

  PhpDebugWatchUri = "phpdebug://watch";

  PhpDebugUnifiedUri = "phpdebug://unified";

  createContextView = function(state) {
    var PhpDebugContextView;
    PhpDebugContextView = require('./context/php-debug-context-view');
    return this.contextView = new PhpDebugContextView(state);
  };

  createBreakpointsView = function(state) {
    var PhpDebugBreakpointView;
    PhpDebugBreakpointView = require('./breakpoint/php-debug-breakpoint-view');
    return this.breakpointView = new PhpDebugBreakpointView(state);
  };

  createWatchView = function(state) {
    var PhpDebugWatchView;
    PhpDebugWatchView = require('./watch/php-debug-watch-view');
    return this.watchView = new PhpDebugWatchView(state);
  };

  module.exports = PhpDebug = {
    subscriptions: null,
    config: {
      GutterBreakpointToggle: {
        title: "Enable breakpoint markers in the gutter",
        type: 'boolean',
        "default": true,
        description: "Enable breakpoints to be toggled and displayed via the gutter"
      },
      GutterPosition: {
        type: 'string',
        "default": "Right",
        description: "Display breakpoint gutter to the left or right of the line numbers",
        "enum": ["Left", "Right"]
      },
      CustomExceptions: {
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        },
        description: "Custom Exceptions to break on"
      },
      PathMaps: {
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        },
        description: "Paths in the format of remote;local (eg \"/var/www/project;C:\\projects\\mycode\")"
      },
      ServerPort: {
        type: 'integer',
        "default": 9000
      },
      MaxChildren: {
        type: 'integer',
        "default": 32
      },
      MaxData: {
        type: 'integer',
        "default": 1024
      },
      MaxDepth: {
        type: 'integer',
        "default": 4
      },
      PhpException: {
        type: 'object',
        properties: {
          FatalError: {
            type: 'boolean',
            "default": true
          },
          CatchableFatalError: {
            type: 'boolean',
            "default": true
          },
          Notice: {
            type: 'boolean',
            "default": true
          },
          Warning: {
            type: 'boolean',
            "default": true
          },
          Deprecated: {
            type: 'boolean',
            "default": true
          },
          StrictStandards: {
            type: 'boolean',
            "default": true
          },
          ParseError: {
            type: 'boolean',
            "default": true
          },
          Xdebug: {
            type: 'boolean',
            "default": true
          },
          UnknownError: {
            type: 'boolean',
            "default": true
          }
        }
      }
    },
    activate: function(state) {
      var Dbgp;
      if (state) {
        this.GlobalContext = atom.deserializers.deserialize(state);
      }
      if (!this.GlobalContext) {
        this.GlobalContext = new GlobalContext();
      }
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'php-debug:toggleBreakpoint': (function(_this) {
          return function() {
            return _this.toggleBreakpoint();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'php-debug:breakpointSettings': (function(_this) {
          return function() {
            return _this.breakpointSettings();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'php-debug:toggleDebugging': (function(_this) {
          return function() {
            return _this.toggleDebugging();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'php-debug:addWatch': (function(_this) {
          return function() {
            return _this.addWatch();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'php-debug:run': (function(_this) {
          return function() {
            return _this.run();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'php-debug:stepOver': (function(_this) {
          return function() {
            return _this.stepOver();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'php-debug:stepIn': (function(_this) {
          return function() {
            return _this.stepIn();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'php-debug:stepOut': (function(_this) {
          return function() {
            return _this.stepOut();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'php-debug:clearAllBreakpoints': (function(_this) {
          return function() {
            return _this.clearAllBreakpoints();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'php-debug:clearAllWatchpoints': (function(_this) {
          return function() {
            return _this.clearAllWatchpoints();
          };
        })(this)
      }));
      this.subscriptions.add(atom.workspace.addOpener((function(_this) {
        return function(filePath) {
          switch (filePath) {
            case PhpDebugContextUri:
              return createContextView({
                uri: PhpDebugContextUri
              });
            case PhpDebugBreakpointsUri:
              return createBreakpointsView({
                uri: PhpDebugBreakpointsUri
              });
            case PhpDebugWatchUri:
              return createWatchView({
                uri: PhpDebugWatchUri
              });
            case PhpDebugUnifiedUri:
              return _this.createUnifiedView({
                uri: PhpDebugUnifiedUri,
                context: _this.GlobalContext
              });
          }
        };
      })(this)));
      Dbgp = require('./engines/dbgp/dbgp');
      this.dbgp = new Dbgp({
        context: this.GlobalContext,
        serverPort: atom.config.get('php-debug.ServerPort')
      });
      this.GlobalContext.onBreak((function(_this) {
        return function(breakpoint) {
          return _this.doCodePoint(breakpoint);
        };
      })(this));
      this.GlobalContext.onStackChange((function(_this) {
        return function(codepoint) {
          return _this.doCodePoint(codepoint);
        };
      })(this));
      this.GlobalContext.onSocketError((function(_this) {
        return function() {
          return _this.toggleDebugging();
        };
      })(this));
      this.GlobalContext.onSessionEnd((function(_this) {
        return function() {
          _this.getUnifiedView().setConnected(false);
          if (_this.currentCodePointDecoration) {
            return _this.currentCodePointDecoration.destroy();
          }
        };
      })(this));
      this.GlobalContext.onRunning((function(_this) {
        return function() {
          if (_this.currentCodePointDecoration) {
            return _this.currentCodePointDecoration.destroy();
          }
        };
      })(this));
      this.GlobalContext.onWatchpointsChange((function(_this) {
        return function() {
          if (_this.GlobalContext.getCurrentDebugContext()) {
            return _this.GlobalContext.getCurrentDebugContext().syncCurrentContext(0);
          }
        };
      })(this));
      this.GlobalContext.onBreakpointsChange((function(_this) {
        return function(event) {
          var breakpoint, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
          if (_this.GlobalContext.getCurrentDebugContext()) {
            if (event.removed) {
              _ref = event.removed;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                breakpoint = _ref[_i];
                _this.GlobalContext.getCurrentDebugContext().executeBreakpointRemove(breakpoint);
                if (breakpoint.getMarker()) {
                  breakpoint.getMarker().destroy();
                }
              }
            }
            if (event.added) {
              _ref1 = event.added;
              for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                breakpoint = _ref1[_j];
                _this.GlobalContext.getCurrentDebugContext().executeBreakpoint(breakpoint);
              }
            }
          }
          if (event.removed) {
            _ref2 = event.removed;
            _results = [];
            for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
              breakpoint = _ref2[_k];
              if (breakpoint.getMarker()) {
                _results.push(breakpoint.getMarker().destroy());
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          }
        };
      })(this));
      atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var breakpoint, marker, _i, _len, _ref, _results;
          if (atom.config.get('php-debug.GutterBreakpointToggle')) {
            return _this.createGutter(editor);
          } else {
            _ref = _this.GlobalContext.getBreakpoints();
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              breakpoint = _ref[_i];
              if (breakpoint.getPath() === editor.getPath()) {
                marker = _this.addBreakpointMarker(breakpoint.getLine(), editor);
                _results.push(breakpoint.setMarker(marker));
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          }
        };
      })(this));
      atom.config.observe("php-debug.GutterBreakpointToggle", (function(_this) {
        return function(newValue) {
          return _this.createGutters(newValue);
        };
      })(this));
      atom.config.observe("php-debug.GutterPosition", (function(_this) {
        return function(newValue) {
          return _this.createGutters(atom.config.get('php-debug.GutterBreakpointToggle'), true);
        };
      })(this));
      atom.contextMenu.add({
        'atom-text-editor': [
          {
            label: 'Add to watch',
            command: 'php-debug:addWatch',
            shouldDisplay: (function(_this) {
              return function() {
                var editor, expression;
                editor = atom.workspace.getActivePaneItem();
                expression = editor != null ? editor.getSelectedText() : void 0;
                if (!!expression) {
                  return true;
                } else {
                  return false;
                }
              };
            })(this)
          }, {
            label: 'Breakpoint settings',
            command: 'php-debug:breakpointSettings',
            shouldDisplay: (function(_this) {
              return function() {
                var breakpoint, editor, line, path, range, _i, _len, _ref;
                editor = atom.workspace.getActivePaneItem();
                if (!editor) {
                  return false;
                }
                range = editor.getSelectedBufferRange();
                path = editor.getPath();
                line = range.getRows()[0] + 1;
                _ref = _this.GlobalContext.getBreakpoints();
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  breakpoint = _ref[_i];
                  if (breakpoint.getPath() === path && breakpoint.getLine() === line) {
                    return true;
                  }
                }
                return false;
              };
            })(this)
          }
        ]
      });
      return this.GlobalContext.onSessionStart((function(_this) {
        return function() {
          return _this.getUnifiedView().setConnected(true);
        };
      })(this));
    },
    consumeStatusBar: function(statusBar) {
      return this.statusView = new PhpDebugStatusView(statusBar, this);
    },
    getUnifiedView: function() {
      var PhpDebugUnifiedView;
      if (!this.unifiedView) {
        PhpDebugUnifiedView = require('./unified/php-debug-unified-view');
        this.unifiedView = new PhpDebugUnifiedView({
          context: this.GlobalContext
        });
      }
      return this.unifiedView;
    },
    serialize: function() {
      return this.GlobalContext.serialize();
    },
    deactivate: function() {
      var _ref, _ref1, _ref2, _ref3;
      if ((_ref = this.unifiedView) != null) {
        _ref.setConnected(false);
      }
      if ((_ref1 = this.statusView) != null) {
        _ref1.destroy();
      }
      this.statusView = null;
      if ((_ref2 = this.unifiedView) != null) {
        _ref2.destroy();
      }
      this.subscriptions.dispose();
      return (_ref3 = this.dbgp) != null ? _ref3.close() : void 0;
    },
    updateDebugContext: function(data) {
      return this.contextView.setDebugContext(data);
    },
    doCodePoint: function(point) {
      var filepath;
      filepath = point.getPath();
      filepath = helpers.remotePathToLocal(filepath);
      atom.workspace.open(filepath, {
        searchAllPanes: true,
        activatePane: true
      }).then((function(_this) {
        return function(editor) {
          var line, marker, range, type, _ref;
          if (_this.currentCodePointDecoration) {
            _this.currentCodePointDecoration.destroy();
          }
          line = point.getLine();
          range = [[line - 1, 0], [line - 1, 0]];
          marker = editor.markBufferRange(range, {
            invalidate: 'surround'
          });
          type = (_ref = typeof point.getType === "function" ? point.getType() : void 0) != null ? _ref : 'generic';
          _this.currentCodePointDecoration = editor.decorateMarker(marker, {
            type: 'line',
            "class": 'debug-break-' + type
          });
          return editor.scrollToBufferPosition([line - 1, 0]);
        };
      })(this));
      return this.GlobalContext.getCurrentDebugContext().syncCurrentContext(point.getStackDepth());
    },
    addBreakpointMarker: function(line, editor) {
      var gutter, marker, range;
      gutter = editor.gutterWithName("php-debug-gutter");
      range = [[line - 1, 0], [line - 1, 0]];
      marker = new BreakpointMarker(editor, range, gutter);
      marker.decorate();
      return marker;
    },
    breakpointSettings: function() {
      var BreakpointSettingsView, bp, breakpoint, editor, line, path, range, _i, _len, _ref;
      BreakpointSettingsView = require('./breakpoint/breakpoint-settings-view');
      editor = atom.workspace.getActivePaneItem();
      range = editor.getSelectedBufferRange();
      path = editor.getPath();
      line = range.getRows()[0] + 1;
      breakpoint = null;
      _ref = this.GlobalContext.getBreakpoints();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bp = _ref[_i];
        if (bp.getPath() === path && bp.getLine() === line) {
          breakpoint = bp;
          break;
        }
      }
      this.settingsView = new BreakpointSettingsView({
        breakpoint: breakpoint,
        context: this.GlobalContext
      });
      return this.settingsView.attach();
    },
    createGutters: function(create, recreate) {
      var editor, editors, gutter, _i, _len, _results;
      editors = atom.workspace.getTextEditors();
      _results = [];
      for (_i = 0, _len = editors.length; _i < _len; _i++) {
        editor = editors[_i];
        if (editor) {
          if (create === false) {
            if ((editor != null ? editor.gutterWithName('php-debug-gutter') : void 0) !== null) {
              gutter = editor != null ? editor.gutterWithName('php-debug-gutter') : void 0;
              _results.push(gutter != null ? gutter.destroy() : void 0);
            } else {
              _results.push(void 0);
            }
          } else {
            if (recreate) {
              if ((editor != null ? editor.gutterWithName('php-debug-gutter') : void 0) !== null) {
                gutter = editor != null ? editor.gutterWithName('php-debug-gutter') : void 0;
                if (gutter != null) {
                  gutter.destroy();
                }
              }
            }
            if ((editor != null ? editor.gutterWithName('php-debug-gutter') : void 0) === null) {
              _results.push(this.createGutter(editor));
            } else {
              _results.push(void 0);
            }
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    createGutter: function(editor) {
      var breakpoint, domNode, gutterEnabled, gutterPosition, marker, priority, view, _i, _len, _ref, _results;
      if (!editor) {
        editor = atom.workspace.getActivePaneItem();
      }
      if (!editor) {
        return;
      }
      gutterEnabled = atom.config.get('php-debug.GutterBreakpointToggle');
      if (!gutterEnabled) {
        return;
      }
      gutterPosition = atom.config.get('php-debug.GutterPosition');
      if (gutterPosition === "Left") {
        priority = -200;
      } else {
        priority = 200;
      }
      if (editor.gutterWithName('php-debug-gutter') !== null) {
        this.gutter = editor.gutterWithName('php-debug-gutter');
        return;
      } else {
        this.gutter = editor != null ? editor.gutterContainer.addGutter({
          name: 'php-debug-gutter',
          priority: priority
        }) : void 0;
      }
      view = atom.views.getView(editor);
      domNode = atom.views.getView(this.gutter);
      $(domNode).unbind('click.phpDebug');
      $(domNode).bind('click.phpDebug', (function(_this) {
        return function(event) {
          var clickedBufferRow, clickedScreenRow;
          clickedScreenRow = view.component.screenPositionForMouseEvent(event).row;
          clickedBufferRow = editor.bufferRowForScreenRow(clickedScreenRow) + 1;
          return _this.toggleBreakpoint(clickedBufferRow);
        };
      })(this));
      if (this.gutter) {
        _ref = this.GlobalContext.getBreakpoints();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          breakpoint = _ref[_i];
          if (breakpoint.getPath() === editor.getPath()) {
            marker = this.addBreakpointMarker(breakpoint.getLine(), editor);
            _results.push(breakpoint.setMarker(marker));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    },
    toggleDebugging: function() {
      var _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
      if (this.currentCodePointDecoration) {
        this.currentCodePointDecoration.destroy();
      }
      if (this.settingsView) {
        if ((_ref = this.settingsView) != null) {
          _ref.close();
        }
        if ((_ref1 = this.settingsView) != null) {
          _ref1.destroy();
        }
      }
      if (!this.getUnifiedView().isVisible()) {
        this.getUnifiedView().setVisible(true);
        if ((_ref2 = this.statusView) != null) {
          _ref2.setActive(true);
        }
        if (!this.dbgp.listening()) {
          if (!this.dbgp.listen()) {
            console.log("failed");
            this.getUnifiedView().setVisible(false);
            if ((_ref3 = this.statusView) != null) {
              _ref3.setActive(false);
            }
            return;
          }
        }
        return this.createGutter();
      } else {
        this.getUnifiedView().setVisible(false);
        if ((_ref4 = this.statusView) != null) {
          _ref4.setActive(false);
        }
        return (_ref5 = this.dbgp) != null ? _ref5.close() : void 0;
      }
    },
    addWatch: function() {
      var editor, expression, w;
      editor = atom.workspace.getActivePaneItem();
      if (!editor || !editor.getSelectedText()) {
        return;
      }
      expression = editor.getSelectedText();
      w = new Watchpoint({
        expression: expression
      });
      return this.GlobalContext.addWatchpoint(w);
    },
    run: function() {
      if (this.GlobalContext.getCurrentDebugContext()) {
        return this.GlobalContext.getCurrentDebugContext().executeRun();
      }
    },
    stepOver: function() {
      if (this.GlobalContext.getCurrentDebugContext()) {
        return this.GlobalContext.getCurrentDebugContext()["continue"]("step_over");
      }
    },
    stepIn: function() {
      if (this.GlobalContext.getCurrentDebugContext()) {
        return this.GlobalContext.getCurrentDebugContext()["continue"]("step_into");
      }
    },
    stepOut: function() {
      if (this.GlobalContext.getCurrentDebugContext()) {
        return this.GlobalContext.getCurrentDebugContext()["continue"]("step_out");
      }
    },
    clearAllBreakpoints: function() {
      return this.GlobalContext.setBreakpoints([]);
    },
    clearAllWatchpoints: function() {
      return this.GlobalContext.setWatchpoints([]);
    },
    toggleBreakpoint: function(line) {
      var breakpoint, editor, marker, path, range, removed;
      editor = atom.workspace.getActivePaneItem();
      if (!line) {
        if (!editor || !editor.getSelectedBufferRange) {
          return;
        }
        range = editor.getSelectedBufferRange();
        line = range.getRows()[0] + 1;
      }
      path = editor.getPath();
      breakpoint = new Breakpoint({
        filepath: path,
        line: line
      });
      removed = this.GlobalContext.removeBreakpoint(breakpoint);
      if (removed) {
        if (removed.getMarker()) {
          return removed.getMarker().destroy();
        }
      } else {
        marker = this.addBreakpointMarker(line, editor);
        breakpoint.setMarker(marker);
        return this.GlobalContext.addBreakpoint(breakpoint);
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGhwLWRlYnVnL2xpYi9waHAtZGVidWcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlUQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQyxVQUFXLE9BQUEsQ0FBUSxXQUFSLEVBQVgsT0FERCxDQUFBOztBQUFBLEVBRUMsSUFBSyxPQUFBLENBQVEsc0JBQVIsRUFBTCxDQUZELENBQUE7O0FBQUEsRUFHQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVIsQ0FIVCxDQUFBOztBQUFBLEVBS0EsU0FBQSxHQUFlLE9BQUEsQ0FBUSxvQkFBUixDQUxmLENBQUE7O0FBQUEsRUFNQSxVQUFBLEdBQWdCLE9BQUEsQ0FBUSxxQkFBUixDQU5oQixDQUFBOztBQUFBLEVBT0EsZ0JBQUEsR0FBc0IsT0FBQSxDQUFRLDRCQUFSLENBUHRCLENBQUE7O0FBQUEsRUFRQSxVQUFBLEdBQWdCLE9BQUEsQ0FBUSxxQkFBUixDQVJoQixDQUFBOztBQUFBLEVBU0EsYUFBQSxHQUFnQixPQUFBLENBQVEseUJBQVIsQ0FUaEIsQ0FBQTs7QUFBQSxFQVVBLE9BQUEsR0FBaUIsT0FBQSxDQUFRLFdBQVIsQ0FWakIsQ0FBQTs7QUFBQSxFQVdBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSxnQ0FBUixDQVhyQixDQUFBOztBQUFBLEVBYUEsa0JBQUEsR0FBcUIsb0JBYnJCLENBQUE7O0FBQUEsRUFjQSxnQkFBQSxHQUFtQixrQkFkbkIsQ0FBQTs7QUFBQSxFQWVBLHNCQUFBLEdBQXlCLHdCQWZ6QixDQUFBOztBQUFBLEVBZ0JBLGdCQUFBLEdBQW1CLGtCQWhCbkIsQ0FBQTs7QUFBQSxFQWlCQSxrQkFBQSxHQUFxQixvQkFqQnJCLENBQUE7O0FB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

//# sourceURL=/home/champ/.atom/packages/php-debug/lib/php-debug.coffee
