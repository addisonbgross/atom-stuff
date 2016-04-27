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
      }
    },
    refreshCscopeDB: function() {
      var exts;
      exts = atom.config.get('atom-cscope.cscopeSourceFiles');
      console.log(exts);
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
          var keyword, option, projects, promise;
          option = params.option;
          keyword = params.keyword;
          projects = atom.project.getPaths();
          switch (option) {
            case 0:
              promise = cscope.findThisSymbol(keyword, projects);
              break;
            case 1:
              promise = cscope.findThisGlobalDefinition(keyword, projects);
              break;
            case 2:
              promise = cscope.findFunctionsCalledBy(keyword, projects);
              break;
            case 3:
              promise = cscope.findFunctionsCalling(keyword, projects);
              break;
            case 4:
              promise = cscope.findTextString(keyword, projects);
              break;
            case 6:
              promise = cscope.findEgrepPattern(keyword, projects);
              break;
            case 7:
              promise = cscope.findThisFile(keyword, projects);
              break;
            case 8:
              promise = cscope.findFilesIncluding(keyword, projects);
              break;
            case 9:
              promise = cscope.findAssignmentsTo(keyword, projects);
              break;
            default:
              notifier.addError("Error: Invalid Option");
              return;
          }
          return promise.then(function(data) {
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
          return atom.workspace.open(result.fileName, {
            initialLine: result.lineNumber - 1
          });
        };
      })(this));
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
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atom-cscope:toggle-symbol': (function(_this) {
          return function() {
            _this.atomCscopeView.inputView.setSelectedOption(0);
            return _this.toggle();
          };
        })(this),
        'atom-cscope:toggle-definition': (function(_this) {
          return function() {
            _this.atomCscopeView.inputView.setSelectedOption(1);
            return _this.toggle();
          };
        })(this),
        'atom-cscope:toggle-functions-called-by': (function(_this) {
          return function() {
            _this.atomCscopeView.inputView.setSelectedOption(2);
            return _this.toggle();
          };
        })(this),
        'atom-cscope:toggle-functions-calling': (function(_this) {
          return function() {
            _this.atomCscopeView.inputView.setSelectedOption(3);
            return _this.toggle();
          };
        })(this),
        'atom-cscope:toggle-text-string': (function(_this) {
          return function() {
            _this.atomCscopeView.inputView.setSelectedOption(4);
            return _this.toggle();
          };
        })(this),
        'atom-cscope:toggle-egrep-pattern': (function(_this) {
          return function() {
            _this.atomCscopeView.inputView.setSelectedOption(6);
            return _this.toggle();
          };
        })(this),
        'atom-cscope:toggle-file': (function(_this) {
          return function() {
            _this.atomCscopeView.inputView.setSelectedOption(7);
            return _this.toggle();
          };
        })(this),
        'atom-cscope:toggle-files-including': (function(_this) {
          return function() {
            _this.atomCscopeView.inputView.setSelectedOption(8);
            return _this.toggle();
          };
        })(this),
        'atom-cscope:toggle-assignments-to': (function(_this) {
          return function() {
            _this.atomCscopeView.inputView.setSelectedOption(9);
            return _this.toggle();
          };
        })(this)
      }));
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atom-cscope:find-this-symbol': (function(_this) {
          return function() {
            _this.show();
            return _this.autoInputFromCursor(0);
          };
        })(this),
        'atom-cscope:find-this-global-definition': (function(_this) {
          return function() {
            _this.show();
            return _this.autoInputFromCursor(1);
          };
        })(this),
        'atom-cscope:find-functions-called-by': (function(_this) {
          return function() {
            _this.show();
            return _this.autoInputFromCursor(2);
          };
        })(this),
        'atom-cscope:find-functions-calling': (function(_this) {
          return function() {
            _this.show();
            return _this.autoInputFromCursor(3);
          };
        })(this),
        'atom-cscope:find-text-string': (function(_this) {
          return function() {
            _this.show();
            return _this.autoInputFromCursor(4);
          };
        })(this),
        'atom-cscope:find-egrep-pattern': (function(_this) {
          return function() {
            _this.show();
            return _this.autoInputFromCursor(6);
          };
        })(this),
        'atom-cscope:find-this-file': (function(_this) {
          return function() {
            _this.show();
            return _this.autoInputFromCursor(7);
          };
        })(this),
        'atom-cscope:find-files-including': (function(_this) {
          return function() {
            _this.show();
            return _this.autoInputFromCursor(8);
          };
        })(this),
        'atom-cscope:find-assignments-to': (function(_this) {
          return function() {
            _this.show();
            return _this.autoInputFromCursor(9);
          };
        })(this)
      }));
    },
    autoInputFromCursor: function(option) {
      var activeEditor, keyword, selectedText;
      activeEditor = atom.workspace.getActiveTextEditor();
      selectedText = activeEditor.getSelectedText();
      keyword = selectedText === "" ? activeEditor.getWordUnderCursor() : selectedText;
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
      if (typeof prevEditorView !== 'undefined') {
        return prevEditorView.focus();
      }
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
        if (typeof prevEditorView !== 'undefined') {
          return prevEditorView.focus();
        }
      } else {
        return this.atomCscopeView.inputView.findEditor.focus();
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1jc2NvcGUvbGliL2F0b20tY3Njb3BlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpRUFBQTs7QUFBQSxFQUFBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLDBCQUFSLENBQWpCLENBQUE7O0FBQUEsRUFDQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBREQsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQUZYLENBQUE7O0FBQUEsRUFHQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FIVCxDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBQSxHQUNmO0FBQUEsSUFBQSxjQUFBLEVBQWdCLElBQWhCO0FBQUEsSUFDQSxVQUFBLEVBQVksSUFEWjtBQUFBLElBRUEsYUFBQSxFQUFlLElBRmY7QUFBQSxJQUlBLE1BQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sb0JBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSxvQkFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxJQUhUO09BREY7QUFBQSxNQUtBLGVBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLG1CQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsNERBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsR0FIVDtPQU5GO0FBQUEsTUFVQSxjQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxxQkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLCtCQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLEtBSFQ7QUFB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

//# sourceURL=/home/champ/.atom/packages/atom-cscope/lib/atom-cscope.coffee
