(function() {
  var AbstractProvider, SubAtom, TextEditor;

  TextEditor = require('atom').TextEditor;

  SubAtom = require('sub-atom');

  module.exports = AbstractProvider = (function() {
    function AbstractProvider() {}

    AbstractProvider.prototype.allMarkers = [];

    AbstractProvider.prototype.hoverEventSelectors = '';

    AbstractProvider.prototype.clickEventSelectors = '';

    AbstractProvider.prototype.manager = {};

    AbstractProvider.prototype.gotoRegex = '';

    AbstractProvider.prototype.jumpWord = '';


    /**
     * Initialisation of Gotos
     *
     * @param {GotoManager} manager The manager that stores this goto. Used mainly for backtrack registering.
     */

    AbstractProvider.prototype.init = function(manager) {
      this.subAtom = new SubAtom;
      this.$ = require('jquery');
      this.parser = require('../services/php-file-parser');
      this.fuzzaldrin = require('fuzzaldrin');
      this.manager = manager;
      atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          editor.onDidSave(function(event) {
            return _this.rescanMarkers(editor);
          });
          _this.registerMarkers(editor);
          return _this.registerEvents(editor);
        };
      })(this));
      atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(paneItem) {
          if (paneItem instanceof TextEditor && _this.jumpWord !== '' && _this.jumpWord !== void 0) {
            _this.jumpTo(paneItem, _this.jumpWord);
            return _this.jumpWord = '';
          }
        };
      })(this));
      atom.workspace.onDidDestroyPane((function(_this) {
        return function(pane) {
          var paneItem, panes, _i, _len, _ref, _results;
          panes = atom.workspace.getPanes();
          if (panes.length === 1) {
            _ref = panes[0].items;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              paneItem = _ref[_i];
              if (paneItem instanceof TextEditor) {
                _results.push(_this.registerEvents(paneItem));
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          }
        };
      })(this));
      return atom.workspace.onDidAddPane((function(_this) {
        return function(observedPane) {
          var pane, paneItem, panes, _i, _len, _results;
          panes = atom.workspace.getPanes();
          _results = [];
          for (_i = 0, _len = panes.length; _i < _len; _i++) {
            pane = panes[_i];
            if (pane === observedPane) {
              continue;
            }
            _results.push((function() {
              var _j, _len1, _ref, _results1;
              _ref = pane.items;
              _results1 = [];
              for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                paneItem = _ref[_j];
                if (paneItem instanceof TextEditor) {
                  _results1.push(this.registerEvents(paneItem));
                } else {
                  _results1.push(void 0);
                }
              }
              return _results1;
            }).call(_this));
          }
          return _results;
        };
      })(this));
    };


    /**
     * Deactives the goto feature.
     */

    AbstractProvider.prototype.deactivate = function() {
      var allMarkers;
      this.subAtom.dispose();
      return allMarkers = [];
    };


    /**
     * Goto from the current cursor position in the editor.
     *
     * @param {TextEditor} editor TextEditor to pull term from.
     */

    AbstractProvider.prototype.gotoFromEditor = function(editor) {
      var position, term, termParts;
      if (editor.getGrammar().scopeName.match(/text.html.php$/)) {
        position = editor.getCursorBufferPosition();
        term = this.parser.getFullWordFromBufferPosition(editor, position);
        termParts = term.split(/(?:\-\>|::)/);
        term = termParts.pop().replace('(', '');
        return this.gotoFromWord(editor, term);
      }
    };


    /**
     * Goto from the term given.
     *
     * @param  {TextEditor} editor TextEditor to search for namespace of term.
     * @param  {string}     term   Term to search for.
     */

    AbstractProvider.prototype.gotoFromWord = function(editor, term) {};


    /**
     * Registers the mouse events for alt-click.
     *
     * @param {TextEditor} editor TextEditor to register events to.
     */

    AbstractProvider.prototype.registerEvents = function(editor) {
      var scrollViewElement, textEditorElement;
      if (editor.getGrammar().scopeName.match(/text.html.php$/)) {
        textEditorElement = atom.views.getView(editor);
        scrollViewElement = this.$(textEditorElement.shadowRoot).find('.scroll-view');
        this.subAtom.add(scrollViewElement, 'mousemove', this.hoverEventSelectors, (function(_this) {
          return function(event) {
            var selector;
            if (!event.altKey) {
              return;
            }
            selector = _this.getSelectorFromEvent(event);
            if (!selector) {
              return;
            }
            _this.$(selector).css('border-bottom', '1px solid ' + _this.$(selector).css('color'));
            _this.$(selector).css('cursor', 'pointer');
            return _this.isHovering = true;
          };
        })(this));
        this.subAtom.add(scrollViewElement, 'mouseout', this.hoverEventSelectors, (function(_this) {
          return function(event) {
            var selector;
            if (!_this.isHovering) {
              return;
            }
            selector = _this.getSelectorFromEvent(event);
            if (!selector) {
              return;
            }
            _this.$(selector).css('border-bottom', '');
            _this.$(selector).css('cursor', '');
            return _this.isHovering = false;
          };
        })(this));
        this.subAtom.add(scrollViewElement, 'click', this.clickEventSelectors, (function(_this) {
          return function(event) {
            var selector;
            selector = _this.getSelectorFromEvent(event);
            if (selector === null || event.altKey === false) {
              return;
            }
            if (event.handled !== true) {
              _this.gotoFromWord(editor, _this.$(selector).text());
              return event.handled = true;
            }
          };
        })(this));
        return editor.onDidChangeCursorPosition((function(_this) {
          return function(event) {
            var allKey, allMarker, key, marker, markerProperties, markers, _results;
            if (!_this.isHovering) {
              return;
            }
            markerProperties = {
              containsBufferPosition: event.newBufferPosition
            };
            markers = event.cursor.editor.findMarkers(markerProperties);
            _results = [];
            for (key in markers) {
              marker = markers[key];
              _results.push((function() {
                var _ref, _results1;
                _ref = this.allMarkers[editor.getLongTitle()];
                _results1 = [];
                for (allKey in _ref) {
                  allMarker = _ref[allKey];
                  if (marker.id === allMarker.id) {
                    this.gotoFromWord(event.cursor.editor, marker.getProperties().term);
                    break;
                  } else {
                    _results1.push(void 0);
                  }
                }
                return _results1;
              }).call(_this));
            }
            return _results;
          };
        })(this));
      }
    };


    /**
     * Register any markers that you need.
     *
     * @param {TextEditor} editor The editor to search through.
     */

    AbstractProvider.prototype.registerMarkers = function(editor) {};


    /**
     * Removes any markers previously created by registerMarkers.
     *
     * @param {TextEditor} editor The editor to search through.
     */

    AbstractProvider.prototype.cleanMarkers = function(editor) {};


    /**
     * Rescans the editor, updating all markers.
     *
     * @param {TextEditor} editor The editor to search through.
     */

    AbstractProvider.prototype.rescanMarkers = function(editor) {
      this.cleanMarkers(editor);
      return this.registerMarkers(editor);
    };


    /**
     * Gets the correct selector when a selector is clicked.
     *
     * @param  {jQuery.Event} event A jQuery event.
     *
     * @return {object|null} A selector to be used with jQuery.
     */

    AbstractProvider.prototype.getSelectorFromEvent = function(event) {
      return event.currentTarget;
    };


    /**
     * Returns whether this goto is able to jump using the term.
     *
     * @param  {string} term Term to check.
     *
     * @return {boolean} Whether a jump is possible.
     */

    AbstractProvider.prototype.canGoto = function(term) {
      var _ref;
      return ((_ref = term.match(this.gotoRegex)) != null ? _ref.length : void 0) > 0;
    };


    /**
     * Gets the regex used when looking for a word within the editor.
     *
     * @param {string} term Term being search.
     *
     * @return {regex} Regex to be used.
     */

    AbstractProvider.prototype.getJumpToRegex = function(term) {};


    /**
     * Jumps to a word within the editor
     * @param  {TextEditor} editor The editor that has the function in.
     * @param  {string} word       The word to find and then jump to.
     * @return {boolean}           Whether the finding was successful.
     */

    AbstractProvider.prototype.jumpTo = function(editor, word) {
      var bufferPosition;
      bufferPosition = this.parser.findBufferPositionOfWord(editor, word, this.getJumpToRegex(word));
      if (bufferPosition === null) {
        return false;
      }
      return setTimeout(function() {
        editor.setCursorBufferPosition(bufferPosition, {
          autoscroll: false
        });
        return editor.scrollToScreenPosition(editor.screenPositionForBufferPosition(bufferPosition), {
          center: true
        });
      }, 100);
    };

    return AbstractProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1hdXRvY29tcGxldGUtcGhwL2xpYi9nb3RvL2Fic3RyYWN0LXByb3ZpZGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxQ0FBQTs7QUFBQSxFQUFDLGFBQWMsT0FBQSxDQUFRLE1BQVIsRUFBZCxVQUFELENBQUE7O0FBQUEsRUFFQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFVBQVIsQ0FGVixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FFTTtrQ0FDRjs7QUFBQSwrQkFBQSxVQUFBLEdBQVksRUFBWixDQUFBOztBQUFBLCtCQUNBLG1CQUFBLEdBQXFCLEVBRHJCLENBQUE7O0FBQUEsK0JBRUEsbUJBQUEsR0FBcUIsRUFGckIsQ0FBQTs7QUFBQSwrQkFHQSxPQUFBLEdBQVMsRUFIVCxDQUFBOztBQUFBLCtCQUlBLFNBQUEsR0FBVyxFQUpYLENBQUE7O0FBQUEsK0JBS0EsUUFBQSxHQUFVLEVBTFYsQ0FBQTs7QUFPQTtBQUFBOzs7O09BUEE7O0FBQUEsK0JBWUEsSUFBQSxHQUFNLFNBQUMsT0FBRCxHQUFBO0FBQ0YsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQUFYLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxDQUFELEdBQUssT0FBQSxDQUFRLFFBQVIsQ0FGTCxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsTUFBRCxHQUFVLE9BQUEsQ0FBUSw2QkFBUixDQUhWLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxVQUFELEdBQWMsT0FBQSxDQUFRLFlBQVIsQ0FKZCxDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsT0FBRCxHQUFXLE9BTlgsQ0FBQTtBQUFBLE1BUUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxDQUFBLFNB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

//# sourceURL=/home/champ/.atom/packages/atom-autocomplete-php/lib/goto/abstract-provider.coffee
