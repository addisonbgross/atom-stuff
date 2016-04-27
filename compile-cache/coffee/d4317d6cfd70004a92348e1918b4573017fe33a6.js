(function() {
  var AtomCscope, AtomCscopeView, CompositeDisposable, cscope, notifier;

  AtomCscopeView = require('./views/atom-cscope-view');

  CompositeDisposable = require('atom').CompositeDisposable;

  notifier = require('./notifier');

  cscope = require('./cscope');

  module.exports = AtomCscope = {
    atomCscopeView: null,
    modalPanel: null,
    subscriptions: null,
    config: {
      LiveSearch: {
        title: 'Live Search toggle',
        description: 'Allow Live Search?',
        type: 'boolean',
        "default": true
      },
      LiveSearchDelay: {
        title: 'Live Search delay',
        description: 'Time after typing in the search box to trigger Live Search',
        type: 'integer',
        "default": 800
      },
      WidgetLocation: {
        title: 'Set Widget location',
        description: 'Where do you want the widget?',
        type: 'string',
        "default": 'top',
        "enum": ['top', 'bottom']
      },
      cscopeSourceFiles: {
        title: 'Source file extensions',
        description: 'Enter the extensions of the source files with which you want cscope generated (with spaces)',
        type: 'string',
        "default": '.c .cc .cpp .h .hpp'
      },
      cscopeBinaryLocation: {
        title: 'Path for cscope binary',
        description: 'Enter the full path to cscope program',
        type: 'string',
        "default": 'cscope'
      }
    },
    refreshCscopeDB: function() {
      var exts;
      notifier.addInfo("Refreshing... Please wait");
      exts = atom.config.get('atom-cscope.cscopeSourceFiles');
      if (exts.trim() === "") {
        return;
      }
      cscope.setupCscope(atom.project.getPaths(), exts, true).then((function(_this) {
        return function(data) {
          notifier.addSuccess("Success: Refreshed cscope database");
          return _this.atomCscopeView.inputView.redoSearch();
        };
      })(this))["catch"](function(data) {
        notifier.addError("Error: Unable to refresh cscope database");
        return console.log(data);
      });
      if (this.atomCscopeView.isVisible()) {
        return this.atomCscopeView.inputView.findEditor.focus();
      }
    },
    setUpEvents: function() {
      this.atomCscopeView.on('click', 'button#refresh', (function(_this) {
        return function() {
          return _this.refreshCscopeDB();
        };
      })(this));
      this.atomCscopeView.onSearch((function(_this) {
        return function(params) {
          var keyword, option, path, projects;
          option = params.option;
          keyword = params.keyword;
          path = params.projectPath;
          projects = path === -1 ? atom.project.getPaths() : [atom.project.getPaths()[path]];
          if (option !== 0 && option !== 1 && option !== 2 && option !== 3 && option !== 4 && option !== 6 && option !== 7 && option !== 8 && option !== 9) {
            notifier.addError("Error: Invalid option: " + option);
            return;
          }
          return cscope.runCscopeCommands(option, keyword, projects).then(function(data) {
            _this.atomCscopeView.clearItems();
            return _this.atomCscopeView.applyResultSet(data);
          })["catch"](function(data) {
            if (data.message.indexOf("cannot open file cscope.out") > 0) {
              return notifier.addError("Error: Please generate the cscope database.");
            } else {
              return notifier.addError("Error: " + data.message);
            }
          });
        };
      })(this));
      return this.atomCscopeView.onResultClick((function(_this) {
        return function(result) {
          return atom.workspace.open(result.getFilePath(), {
            initialLine: result.lineNumber - 1
          });
        };
      })(this));
    },
    togglePanelOption: function(option) {
      if (this.atomCscopeView.inputView.getSelectedOption() === option) {
        return this.toggle();
      } else {
        this.show();
        this.atomCscopeView.inputView.autoFill(option, '');
        return this.atomCscopeView.listView.clearItems();
      }
    },
    setUpBindings: function() {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atom-cscope:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'core:cancel': (function(_this) {
          return function() {
            if (_this.modalPanel.isVisible()) {
              return _this.hide();
            }
          };
        })(this),
        'atom-cscope:focus-next': (function(_this) {
          return function() {
            if (_this.modalPanel.isVisible()) {
              return _this.switchPanes();
            }
          };
        })(this),
        'atom-cscope:refresh-db': (function(_this) {
          return function() {
            return _this.refreshCscopeDB();
          };
        })(this),
        'atom-cscope:project-select': (function(_this) {
          return function() {
            return _this.atomCscopeView.inputView.openProjectSelector();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atom-cscope:toggle-symbol': (function(_this) {
          return function() {
            return _this.togglePanelOption(0);
          };
        })(this),
        'atom-cscope:toggle-global-definition': (function(_this) {
          return function() {
            return _this.togglePanelOption(1);
          };
        })(this),
        'atom-cscope:toggle-functions-called-by': (function(_this) {
          return function() {
            return _this.togglePanelOption(2);
          };
        })(this),
        'atom-cscope:toggle-functions-calling': (function(_this) {
          return function() {
            return _this.togglePanelOption(3);
          };
        })(this),
        'atom-cscope:toggle-text-string': (function(_this) {
          return function() {
            return _this.togglePanelOption(4);
          };
        })(this),
        'atom-cscope:toggle-egrep-pattern': (function(_this) {
          return function() {
            return _this.togglePanelOption(6);
          };
        })(this),
        'atom-cscope:toggle-file': (function(_this) {
          return function() {
            return _this.togglePanelOption(7);
          };
        })(this),
        'atom-cscope:toggle-files-including': (function(_this) {
          return function() {
            return _this.togglePanelOption(8);
          };
        })(this),
        'atom-cscope:toggle-assignments-to': (function(_this) {
          return function() {
            return _this.togglePanelOption(9);
          };
        })(this)
      }));
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atom-cscope:find-symbol': (function(_this) {
          return function() {
            return _this.autoInputFromCursor(0);
          };
        })(this),
        'atom-cscope:find-global-definition': (function(_this) {
          return function() {
            return _this.autoInputFromCursor(1);
          };
        })(this),
        'atom-cscope:find-functions-called-by': (function(_this) {
          return function() {
            return _this.autoInputFromCursor(2);
          };
        })(this),
        'atom-cscope:find-functions-calling': (function(_this) {
          return function() {
            return _this.autoInputFromCursor(3);
          };
        })(this),
        'atom-cscope:find-text-string': (function(_this) {
          return function() {
            return _this.autoInputFromCursor(4);
          };
        })(this),
        'atom-cscope:find-egrep-pattern': (function(_this) {
          return function() {
            return _this.autoInputFromCursor(6);
          };
        })(this),
        'atom-cscope:find-file': (function(_this) {
          return function() {
            return _this.autoInputFromCursor(7);
          };
        })(this),
        'atom-cscope:find-files-including': (function(_this) {
          return function() {
            return _this.autoInputFromCursor(8);
          };
        })(this),
        'atom-cscope:find-assignments-to': (function(_this) {
          return function() {
            return _this.autoInputFromCursor(9);
          };
        })(this)
      }));
    },
    autoInputFromCursor: function(option) {
      var activeEditor, keyword, selectedText;
      activeEditor = atom.workspace.getActiveTextEditor();
      if (activeEditor == null) {
        notifier.addInfo("Could not find text under cursor.");
        return;
      }
      selectedText = activeEditor.getSelectedText();
      keyword = selectedText === "" ? activeEditor.getWordUnderCursor() : selectedText;
      this.show();
      return this.atomCscopeView.inputView.invokeSearch(option, keyword);
    },
    attachModal: function(state) {
      this.atomCscopeView = new AtomCscopeView(state.atomCscopeViewState);
      this.setupModalLocation();
      return atom.config.onDidChange('atom-cscope.WidgetLocation', (function(_this) {
        return function(event) {
          var wasVisible;
          wasVisible = _this.modalPanel.isVisible() ? true : false;
          _this.modalPanel.destroy();
          _this.setupModalLocation();
          if (wasVisible) {
            return _this.modalPanel.show();
          }
        };
      })(this));
    },
    setupModalLocation: function() {
      switch (atom.config.get('atom-cscope.WidgetLocation')) {
        case 'bottom':
          return this.modalPanel = atom.workspace.addBottomPanel({
            item: this.atomCscopeView.element,
            visible: false
          });
        case 'top':
          return this.modalPanel = atom.workspace.addTopPanel({
            item: this.atomCscopeView.element,
            visible: false
          });
        default:
          return this.modalPanel = atom.workspace.addTopPanel({
            item: this.atomCscopeView.element,
            visible: false
          });
      }
    },
    activate: function(state) {
      this.attachModal(state);
      this.setUpBindings();
      return this.setUpEvents();
    },
    deactivate: function() {
      this.modalPanel.destroy();
      this.subscriptions.dispose();
      return this.atomCscopeView.destroy();
    },
    serialize: function() {
      return {
        atomCscopeViewState: this.atomCscopeView.serialize()
      };
    },
    show: function() {
      this.prevEditor = atom.workspace.getActiveTextEditor();
      this.modalPanel.show();
      return this.atomCscopeView.inputView.findEditor.focus();
    },
    hide: function() {
      var prevEditorView;
      this.modalPanel.hide();
      prevEditorView = atom.views.getView(this.prevEditor);
      return prevEditorView != null ? prevEditorView.focus() : void 0;
    },
    toggle: function() {
      if (this.modalPanel.isVisible()) {
        return this.hide();
      } else {
        return this.show();
      }
    },
    switchPanes: function() {
      var prevEditorView;
      if (this.atomCscopeView.inputView.findEditor.hasFocus()) {
        prevEditorView = atom.views.getView(this.prevEditor);
        return prevEditorView != null ? prevEditorView.focus() : void 0;
      } else {
        return this.atomCscopeView.inputView.findEditor.focus();
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1jc2NvcGUvbGliL2F0b20tY3Njb3BlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpRUFBQTs7QUFBQSxFQUFBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLDBCQUFSLENBQWpCLENBQUE7O0FBQUEsRUFDQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBREQsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQUZYLENBQUE7O0FBQUEsRUFHQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FIVCxDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBQSxHQUNmO0FBQUEsSUFBQSxjQUFBLEVBQWdCLElBQWhCO0FBQUEsSUFDQSxVQUFBLEVBQVksSUFEWjtBQUFBLElBRUEsYUFBQSxFQUFlLElBRmY7QUFBQSxJQUlBLE1BQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sb0JBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSxvQkFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxJQUhUO09BREY7QUFBQSxNQUtBLGVBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLG1CQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsNERBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsR0FIVDtPQU5GO0FBQUEsTUFVQSxjQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxxQkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLCtCQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLEtBSFQ7QUFB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

//# sourceURL=/home/champ/.atom/packages/atom-cscope/lib/atom-cscope.coffee
