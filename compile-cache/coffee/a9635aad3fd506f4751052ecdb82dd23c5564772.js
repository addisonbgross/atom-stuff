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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1jc2NvcGUvbGliL2F0b20tY3Njb3BlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpRUFBQTs7QUFBQSxFQUFBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLDBCQUFSLENBQWpCLENBQUE7O0FBQUEsRUFDQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBREQsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQUZYLENBQUE7O0FBQUEsRUFHQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FIVCxDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBQSxHQUNmO0FBQUEsSUFBQSxjQUFBLEVBQWdCLElBQWhCO0FBQUEsSUFDQSxVQUFBLEVBQVksSUFEWjtBQUFBLElBRUEsYUFBQSxFQUFlLElBRmY7QUFBQSxJQUlBLE1BQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sb0JBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSxvQkFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxJQUhUO09BREY7QUFBQSxNQUtBLGVBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLG1CQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsNERBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsR0FIVDtPQU5GO0FBQUEsTUFVQSxjQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxxQkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLCtCQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLEtBSFQ7QUFBQSxRQUlBLE1BQUEsRUFBTSxDQUFDLEtBQUQsRUFBUSxRQUFSLENBSk47T0FYRjtBQUFBLE1BZ0JBLGlCQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyx3QkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLDZGQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLHFCQUhUO09BakJGO0FBQUEsTUFxQkEsb0JBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLHdCQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsdUNBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsUUFIVDtPQXRCRjtLQUxGO0FBQUEsSUFnQ0EsZUFBQSxFQUFpQixTQUFBLEdBQUE7QUFDZixVQUFBLElBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsK0JBQWhCLENBQVAsQ0FBQTtBQUFBLE1BQ0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFaLENBREEsQ0FBQTtBQUVBLE1BQUEsSUFBVSxJQUFJLENBQUMsSUFBTCxDQUFBLENBQUEsS0FBZSxFQUF6QjtBQUFBLGNBQUEsQ0FBQTtPQUZBO0FBQUEsTUFHQSxNQUFNLENBQUMsV0FBUCxDQUFtQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUFuQixFQUE0QyxJQUE1QyxFQUFrRCxJQUFsRCxDQUNBLENBQUMsSUFERCxDQUNNLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtBQUNKLFVBQUEsUUFBUSxDQUFDLFVBQVQsQ0FBb0Isb0NBQXBCLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsY0FBYyxDQUFDLFNBQVMsQ0FBQyxVQUExQixDQUFBLEVBRkk7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUROLENBSUEsQ0FBQyxPQUFELENBSkEsQ0FJTyxTQUFDLElBQUQsR0FBQTtBQUNMLFFBQUEsUUFBUSxDQUFDLFFBQVQsQ0FBa0IsMENBQWxCLENBQUEsQ0FBQTtlQUNBLE9BQU8sQ0FBQyxHQUFSLENBQVksSUFBWixFQUZLO01BQUEsQ0FKUCxDQUhBLENBQUE7QUFVQSxNQUFBLElBQWdELElBQUMsQ0FBQSxjQUFjLENBQUMsU0FBaEIsQ0FBQSxDQUFoRDtlQUFBLElBQUMsQ0FBQSxjQUFjLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxLQUFyQyxDQUFBLEVBQUE7T0FYZTtJQUFBLENBaENqQjtBQUFBLElBNkNBLFdBQUEsRUFBYSxTQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxjQUFjLENBQUMsRUFBaEIsQ0FBbUIsT0FBbkIsRUFBNEIsZ0JBQTVCLEVBQThDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLGVBQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUMsQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsY0FBYyxDQUFDLFFBQWhCLENBQXlCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE1BQUQsR0FBQTtBQUN2QixjQUFBLGtDQUFBO0FBQUEsVUFBQSxNQUFBLEdBQVMsTUFBTSxDQUFDLE1BQWhCLENBQUE7QUFBQSxVQUNBLE9BQUEsR0FBVSxNQUFNLENBQUMsT0FEakIsQ0FBQTtBQUFBLFVBRUEsUUFBQSxHQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBRlgsQ0FBQTtBQUlBLGtCQUFPLE1BQVA7QUFBQSxpQkFDTyxDQURQO0FBQ2MsY0FBQSxPQUFBLEdBQVUsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsT0FBdEIsRUFBK0IsUUFBL0IsQ0FBVixDQURkO0FBQ087QUFEUCxpQkFFTyxDQUZQO0FBRWMsY0FBQSxPQUFBLEdBQVUsTUFBTSxDQUFDLHdCQUFQLENBQWdDLE9BQWhDLEVBQXlDLFFBQXpDLENBQVYsQ0FGZDtBQUVPO0FBRlAsaUJBR08sQ0FIUDtBQUdjLGNBQUEsT0FBQSxHQUFVLE1BQU0sQ0FBQyxxQkFBUCxDQUE2QixPQUE3QixFQUFzQyxRQUF0QyxDQUFWLENBSGQ7QUFHTztBQUhQLGlCQUlPLENBSlA7QUFJYyxjQUFBLE9BQUEsR0FBVSxNQUFNLENBQUMsb0JBQVAsQ0FBNEIsT0FBNUIsRUFBcUMsUUFBckMsQ0FBVixDQUpkO0FBSU87QUFKUCxpQkFLTyxDQUxQO0FBS2MsY0FBQSxPQUFBLEdBQVUsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsT0FBdEIsRUFBK0IsUUFBL0IsQ0FBVixDQUxkO0FBS087QUFMUCxpQkFNTyxDQU5QO0FBTWMsY0FBQSxPQUFBLEdBQVUsTUFBTSxDQUFDLGdCQUFQLENBQXdCLE9BQXhCLEVBQWlDLFFBQWpDLENBQVYsQ0FOZDtBQU1PO0FBTlAsaUJBT08sQ0FQUDtBQU9jLGNBQUEsT0FBQSxHQUFVLE1BQU0sQ0FBQyxZQUFQLENBQW9CLE9BQXBCLEVBQTZCLFFBQTdCLENBQVYsQ0FQZDtBQU9PO0FBUFAsaUJBUU8sQ0FSUDtBQVFjLGNBQUEsT0FBQSxHQUFVLE1BQU0sQ0FBQyxrQkFBUCxDQUEwQixPQUExQixFQUFtQyxRQUFuQyxDQUFWLENBUmQ7QUFRTztBQVJQLGlCQVNPLENBVFA7QUFTYyxjQUFBLE9BQUEsR0FBVSxNQUFNLENBQUMsaUJBQVAsQ0FBeUIsT0FBekIsRUFBa0MsUUFBbEMsQ0FBVixDQVRkO0FBU087QUFUUDtBQVdJLGNBQUEsUUFBUSxDQUFDLFFBQVQsQ0FBa0IsdUJBQWxCLENBQUEsQ0FBQTtBQUNBLG9CQUFBLENBWko7QUFBQSxXQUpBO2lCQWtCQSxPQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRCxHQUFBO0FBQ0osWUFBQSxLQUFDLENBQUEsY0FBYyxDQUFDLFVBQWhCLENBQUEsQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxjQUFjLENBQUMsY0FBaEIsQ0FBK0IsSUFBL0IsRUFGSTtVQUFBLENBRE4sQ0FJQSxDQUFDLE9BQUQsQ0FKQSxDQUlPLFNBQUMsSUFBRCxHQUFBO0FBQ0wsWUFBQSxJQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBYixDQUFxQiw2QkFBckIsQ0FBQSxHQUFzRCxDQUF6RDtxQkFDRSxRQUFRLENBQUMsUUFBVCxDQUFrQiw2Q0FBbEIsRUFERjthQUFBLE1BQUE7cUJBR0UsUUFBUSxDQUFDLFFBQVQsQ0FBa0IsU0FBQSxHQUFZLElBQUksQ0FBQyxPQUFuQyxFQUhGO2FBREs7VUFBQSxDQUpQLEVBbkJ1QjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpCLENBRkEsQ0FBQTthQStCQSxJQUFDLENBQUEsY0FBYyxDQUFDLGFBQWhCLENBQThCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE1BQUQsR0FBQTtpQkFDNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLE1BQU0sQ0FBQyxRQUEzQixFQUFxQztBQUFBLFlBQUMsV0FBQSxFQUFjLE1BQU0sQ0FBQyxVQUFQLEdBQW9CLENBQW5DO1dBQXJDLEVBRDRCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUIsRUFoQ1c7SUFBQSxDQTdDYjtBQUFBLElBZ0ZBLGFBQUEsRUFBZSxTQUFBLEdBQUE7QUFDYixNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDakI7QUFBQSxRQUFBLG9CQUFBLEVBQXNCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxNQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRCO0FBQUEsUUFDQSxhQUFBLEVBQWUsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFBRyxZQUFBLElBQVcsS0FBQyxDQUFBLFVBQVUsQ0FBQyxTQUFaLENBQUEsQ0FBWDtxQkFBQSxLQUFDLENBQUEsSUFBRCxDQUFBLEVBQUE7YUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRGY7QUFBQSxRQUVBLHdCQUFBLEVBQTBCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO0FBQUcsWUFBQSxJQUFrQixLQUFDLENBQUEsVUFBVSxDQUFDLFNBQVosQ0FBQSxDQUFsQjtxQkFBQSxLQUFDLENBQUEsV0FBRCxDQUFBLEVBQUE7YUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRjFCO0FBQUEsUUFHQSx3QkFBQSxFQUEwQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsZUFBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUgxQjtPQURpQixDQUFuQixDQURBLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ2pCO0FBQUEsUUFBQSwyQkFBQSxFQUE2QixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUMzQixZQUFBLEtBQUMsQ0FBQSxjQUFjLENBQUMsU0FBUyxDQUFDLGlCQUExQixDQUE0QyxDQUE1QyxDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUYyQjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTdCO0FBQUEsUUFHQSwrQkFBQSxFQUFpQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUMvQixZQUFBLEtBQUMsQ0FBQSxjQUFjLENBQUMsU0FBUyxDQUFDLGlCQUExQixDQUE0QyxDQUE1QyxDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUYrQjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSGpDO0FBQUEsUUFNQSx3Q0FBQSxFQUEwQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUN4QyxZQUFBLEtBQUMsQ0FBQSxjQUFjLENBQUMsU0FBUyxDQUFDLGlCQUExQixDQUE0QyxDQUE1QyxDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUZ3QztVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBTjFDO0FBQUEsUUFTQSxzQ0FBQSxFQUF3QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUN0QyxZQUFBLEtBQUMsQ0FBQSxjQUFjLENBQUMsU0FBUyxDQUFDLGlCQUExQixDQUE0QyxDQUE1QyxDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUZzQztVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBVHhDO0FBQUEsUUFZQSxnQ0FBQSxFQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUNoQyxZQUFBLEtBQUMsQ0FBQSxjQUFjLENBQUMsU0FBUyxDQUFDLGlCQUExQixDQUE0QyxDQUE1QyxDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUZnQztVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBWmxDO0FBQUEsUUFlQSxrQ0FBQSxFQUFvQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUNsQyxZQUFBLEtBQUMsQ0FBQSxjQUFjLENBQUMsU0FBUyxDQUFDLGlCQUExQixDQUE0QyxDQUE1QyxDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUZrQztVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBZnBDO0FBQUEsUUFrQkEseUJBQUEsRUFBMkIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFDekIsWUFBQSxLQUFDLENBQUEsY0FBYyxDQUFDLFNBQVMsQ0FBQyxpQkFBMUIsQ0FBNEMsQ0FBNUMsQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxNQUFELENBQUEsRUFGeUI7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQWxCM0I7QUFBQSxRQXFCQSxvQ0FBQSxFQUFzQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUNwQyxZQUFBLEtBQUMsQ0FBQSxjQUFjLENBQUMsU0FBUyxDQUFDLGlCQUExQixDQUE0QyxDQUE1QyxDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUZvQztVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBckJ0QztBQUFBLFFBd0JBLG1DQUFBLEVBQXFDLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO0FBQ25DLFlBQUEsS0FBQyxDQUFBLGNBQWMsQ0FBQyxTQUFTLENBQUMsaUJBQTFCLENBQTRDLENBQTVDLENBQUEsQ0FBQTttQkFDQSxLQUFDLENBQUEsTUFBRCxDQUFBLEVBRm1DO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0F4QnJDO09BRGlCLENBQW5CLENBUEEsQ0FBQTthQW9DQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNqQjtBQUFBLFFBQUEsOEJBQUEsRUFBZ0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFDOUIsWUFBQSxLQUFDLENBQUEsSUFBRCxDQUFBLENBQUEsQ0FBQTttQkFDQSxLQUFDLENBQUEsbUJBQUQsQ0FBcUIsQ0FBckIsRUFGOEI7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQztBQUFBLFFBR0EseUNBQUEsRUFBMkMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFDekMsWUFBQSxLQUFDLENBQUEsSUFBRCxDQUFBLENBQUEsQ0FBQTttQkFDQSxLQUFDLENBQUEsbUJBQUQsQ0FBcUIsQ0FBckIsRUFGeUM7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUgzQztBQUFBLFFBTUEsc0NBQUEsRUFBd0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFDdEMsWUFBQSxLQUFDLENBQUEsSUFBRCxDQUFBLENBQUEsQ0FBQTttQkFDQSxLQUFDLENBQUEsbUJBQUQsQ0FBcUIsQ0FBckIsRUFGc0M7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQU54QztBQUFBLFFBU0Esb0NBQUEsRUFBc0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFDcEMsWUFBQSxLQUFDLENBQUEsSUFBRCxDQUFBLENBQUEsQ0FBQTttQkFDQSxLQUFDLENBQUEsbUJBQUQsQ0FBcUIsQ0FBckIsRUFGb0M7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVR0QztBQUFBLFFBWUEsOEJBQUEsRUFBZ0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFDOUIsWUFBQSxLQUFDLENBQUEsSUFBRCxDQUFBLENBQUEsQ0FBQTttQkFDQSxLQUFDLENBQUEsbUJBQUQsQ0FBcUIsQ0FBckIsRUFGOEI7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVpoQztBQUFBLFFBZUEsZ0NBQUEsRUFBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFDaEMsWUFBQSxLQUFDLENBQUEsSUFBRCxDQUFBLENBQUEsQ0FBQTttQkFDQSxLQUFDLENBQUEsbUJBQUQsQ0FBcUIsQ0FBckIsRUFGZ0M7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQWZsQztBQUFBLFFBa0JBLDRCQUFBLEVBQThCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO0FBQzVCLFlBQUEsS0FBQyxDQUFBLElBQUQsQ0FBQSxDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLG1CQUFELENBQXFCLENBQXJCLEVBRjRCO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FsQjlCO0FBQUEsUUFxQkEsa0NBQUEsRUFBb0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFDbEMsWUFBQSxLQUFDLENBQUEsSUFBRCxDQUFBLENBQUEsQ0FBQTttQkFDQSxLQUFDLENBQUEsbUJBQUQsQ0FBcUIsQ0FBckIsRUFGa0M7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQXJCcEM7QUFBQSxRQXdCQSxpQ0FBQSxFQUFtQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUNqQyxZQUFBLEtBQUMsQ0FBQSxJQUFELENBQUEsQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxtQkFBRCxDQUFxQixDQUFyQixFQUZpQztVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBeEJuQztPQURpQixDQUFuQixFQXJDYTtJQUFBLENBaEZmO0FBQUEsSUFrSkEsbUJBQUEsRUFBcUIsU0FBQyxNQUFELEdBQUE7QUFDbkIsVUFBQSxtQ0FBQTtBQUFBLE1BQUEsWUFBQSxHQUFlLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFmLENBQUE7QUFBQSxNQUNBLFlBQUEsR0FBZSxZQUFZLENBQUMsZUFBYixDQUFBLENBRGYsQ0FBQTtBQUFBLE1BR0EsT0FBQSxHQUFhLFlBQUEsS0FBZ0IsRUFBbkIsR0FBMkIsWUFBWSxDQUFDLGtCQUFiLENBQUEsQ0FBM0IsR0FBa0UsWUFINUUsQ0FBQTthQUlBLElBQUMsQ0FBQSxjQUFjLENBQUMsU0FBUyxDQUFDLFlBQTFCLENBQXVDLE1BQXZDLEVBQStDLE9BQS9DLEVBTG1CO0lBQUEsQ0FsSnJCO0FBQUEsSUF5SkEsV0FBQSxFQUFhLFNBQUMsS0FBRCxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsY0FBRCxHQUFzQixJQUFBLGNBQUEsQ0FBZSxLQUFLLENBQUMsbUJBQXJCLENBQXRCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxrQkFBRCxDQUFBLENBREEsQ0FBQTthQUVBLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBWixDQUF3Qiw0QkFBeEIsRUFBc0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxHQUFBO0FBQ3BELGNBQUEsVUFBQTtBQUFBLFVBQUEsVUFBQSxHQUFnQixLQUFDLENBQUEsVUFBVSxDQUFDLFNBQVosQ0FBQSxDQUFILEdBQWdDLElBQWhDLEdBQTBDLEtBQXZELENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxVQUFVLENBQUMsT0FBWixDQUFBLENBREEsQ0FBQTtBQUFBLFVBRUEsS0FBQyxDQUFBLGtCQUFELENBQUEsQ0FGQSxDQUFBO0FBR0EsVUFBQSxJQUFzQixVQUF0QjttQkFBQSxLQUFDLENBQUEsVUFBVSxDQUFDLElBQVosQ0FBQSxFQUFBO1dBSm9EO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdEQsRUFIVztJQUFBLENBekpiO0FBQUEsSUFrS0Esa0JBQUEsRUFBb0IsU0FBQSxHQUFBO0FBQ2xCLGNBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRCQUFoQixDQUFQO0FBQUEsYUFDTyxRQURQO2lCQUNxQixJQUFDLENBQUEsVUFBRCxHQUFjLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBZixDQUE4QjtBQUFBLFlBQUEsSUFBQSxFQUFNLElBQUMsQ0FBQSxjQUFjLENBQUMsT0FBdEI7QUFBQSxZQUErQixPQUFBLEVBQVMsS0FBeEM7V0FBOUIsRUFEbkM7QUFBQSxhQUVPLEtBRlA7aUJBRWtCLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFmLENBQTJCO0FBQUEsWUFBQSxJQUFBLEVBQU0sSUFBQyxDQUFBLGNBQWMsQ0FBQyxPQUF0QjtBQUFBLFlBQStCLE9BQUEsRUFBUyxLQUF4QztXQUEzQixFQUZoQztBQUFBO2lCQUdPLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFmLENBQTJCO0FBQUEsWUFBQSxJQUFBLEVBQU0sSUFBQyxDQUFBLGNBQWMsQ0FBQyxPQUF0QjtBQUFBLFlBQStCLE9BQUEsRUFBUyxLQUF4QztXQUEzQixFQUhyQjtBQUFBLE9BRGtCO0lBQUEsQ0FsS3BCO0FBQUEsSUF3S0EsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsV0FBRCxDQUFhLEtBQWIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBRCxDQUFBLENBREEsQ0FBQTthQUVBLElBQUMsQ0FBQSxXQUFELENBQUEsRUFIUTtJQUFBLENBeEtWO0FBQUEsSUE2S0EsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQSxDQURBLENBQUE7YUFFQSxJQUFDLENBQUEsY0FBYyxDQUFDLE9BQWhCLENBQUEsRUFIVTtJQUFBLENBN0taO0FBQUEsSUFrTEEsU0FBQSxFQUFXLFNBQUEsR0FBQTthQUNUO0FBQUEsUUFBQSxtQkFBQSxFQUFxQixJQUFDLENBQUEsY0FBYyxDQUFDLFNBQWhCLENBQUEsQ0FBckI7UUFEUztJQUFBLENBbExYO0FBQUEsSUFxTEEsSUFBQSxFQUFNLFNBQUEsR0FBQTtBQUNKLE1BQUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBZCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsVUFBVSxDQUFDLElBQVosQ0FBQSxDQURBLENBQUE7YUFFQSxJQUFDLENBQUEsY0FBYyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsS0FBckMsQ0FBQSxFQUhJO0lBQUEsQ0FyTE47QUFBQSxJQTBMQSxJQUFBLEVBQU0sU0FBQSxHQUFBO0FBQ0osVUFBQSxjQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsVUFBVSxDQUFDLElBQVosQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLGNBQUEsR0FBaUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUMsQ0FBQSxVQUFwQixDQURqQixDQUFBO0FBRUEsTUFBQSxJQUEwQixNQUFBLENBQUEsY0FBQSxLQUF5QixXQUFuRDtlQUFBLGNBQWMsQ0FBQyxLQUFmLENBQUEsRUFBQTtPQUhJO0lBQUEsQ0ExTE47QUFBQSxJQStMQSxNQUFBLEVBQVEsU0FBQSxHQUFBO0FBQ04sTUFBQSxJQUFHLElBQUMsQ0FBQSxVQUFVLENBQUMsU0FBWixDQUFBLENBQUg7ZUFBZ0MsSUFBQyxDQUFBLElBQUQsQ0FBQSxFQUFoQztPQUFBLE1BQUE7ZUFBNkMsSUFBQyxDQUFBLElBQUQsQ0FBQSxFQUE3QztPQURNO0lBQUEsQ0EvTFI7QUFBQSxJQWtNQSxXQUFBLEVBQWEsU0FBQSxHQUFBO0FBQ1gsVUFBQSxjQUFBO0FBQUEsTUFBQSxJQUFHLElBQUMsQ0FBQSxjQUFjLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxRQUFyQyxDQUFBLENBQUg7QUFDRSxRQUFBLGNBQUEsR0FBaUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUMsQ0FBQSxVQUFwQixDQUFqQixDQUFBO0FBQ0EsUUFBQSxJQUEwQixNQUFBLENBQUEsY0FBQSxLQUF5QixXQUFuRDtpQkFBQSxjQUFjLENBQUMsS0FBZixDQUFBLEVBQUE7U0FGRjtPQUFBLE1BQUE7ZUFJRSxJQUFDLENBQUEsY0FBYyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsS0FBckMsQ0FBQSxFQUpGO09BRFc7SUFBQSxDQWxNYjtHQU5GLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/atom-cscope/lib/atom-cscope.coffee
