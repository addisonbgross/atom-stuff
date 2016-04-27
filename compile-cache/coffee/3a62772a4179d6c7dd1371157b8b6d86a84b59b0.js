(function() {
  var AbstractProvider, AttachedPopover, SubAtom, TextEditor;

  TextEditor = require('atom').TextEditor;

  SubAtom = require('sub-atom');

  AttachedPopover = require('../services/attached-popover');

  module.exports = AbstractProvider = (function() {
    function AbstractProvider() {}

    AbstractProvider.prototype.hoverEventSelectors = '';


    /**
     * Initializes this provider.
     */

    AbstractProvider.prototype.init = function() {
      this.$ = require('jquery');
      this.parser = require('../services/php-file-parser');
      this.subAtom = new SubAtom;
      atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.registerEvents(editor);
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
     * Deactives the provider.
     */

    AbstractProvider.prototype.deactivate = function() {
      document.removeChild(this.popover);
      this.subAtom.dispose();
      return this.removePopover();
    };


    /**
     * Registers the necessary event handlers.
     *
     * @param {TextEditor} editor TextEditor to register events to.
     */

    AbstractProvider.prototype.registerEvents = function(editor) {
      var scrollViewElement, textEditorElement;
      if (editor.getGrammar().scopeName.match(/text.html.php$/)) {
        textEditorElement = atom.views.getView(editor);
        scrollViewElement = this.$(textEditorElement.shadowRoot).find('.scroll-view');
        this.subAtom.add(scrollViewElement, 'mouseover', this.hoverEventSelectors, (function(_this) {
          return function(event) {
            var cursorPosition, editorViewComponent, selector;
            if (_this.timeout) {
              clearTimeout(_this.timeout);
            }
            selector = _this.getSelectorFromEvent(event);
            if (selector === null) {
              return;
            }
            editorViewComponent = atom.views.getView(editor).component;
            if (editorViewComponent) {
              cursorPosition = editorViewComponent.screenPositionForMouseEvent(event);
              _this.removePopover();
              return _this.showPopoverFor(editor, selector, cursorPosition);
            }
          };
        })(this));
        this.subAtom.add(scrollViewElement, 'mouseout', this.hoverEventSelectors, (function(_this) {
          return function(event) {
            return _this.removePopover();
          };
        })(this));
        editor.onDidDestroy((function(_this) {
          return function() {
            return _this.removePopover();
          };
        })(this));
        editor.onDidStopChanging((function(_this) {
          return function() {
            return _this.removePopover();
          };
        })(this));
        this.$(textEditorElement.shadowRoot).find('.horizontal-scrollbar').on('scroll', (function(_this) {
          return function() {
            return _this.removePopover();
          };
        })(this));
        return this.$(textEditorElement.shadowRoot).find('.vertical-scrollbar').on('scroll', (function(_this) {
          return function() {
            return _this.removePopover();
          };
        })(this));
      }
    };


    /**
     * Shows a popover containing the documentation of the specified element located at the specified location.
     *
     * @param {TextEditor} editor         TextEditor containing the elemment.
     * @param {string}     element        The element to search for.
     * @param {Point}      bufferPosition The cursor location the element is at.
     * @param {int}        delay          How long to wait before the popover shows up.
     * @param {int}        fadeInTime     The amount of time to take to fade in the tooltip.
     */

    AbstractProvider.prototype.showPopoverFor = function(editor, element, bufferPosition, delay, fadeInTime) {
      var popoverElement, term, tooltipText;
      if (delay == null) {
        delay = 500;
      }
      if (fadeInTime == null) {
        fadeInTime = 100;
      }
      term = this.$(element).text();
      tooltipText = this.getTooltipForWord(editor, term, bufferPosition);
      if ((tooltipText != null ? tooltipText.length : void 0) > 0) {
        popoverElement = this.getPopoverElementFromSelector(element);
        this.attachedPopover = new AttachedPopover(popoverElement);
        this.attachedPopover.setText('<div style="margin-top: -1em;">' + tooltipText + '</div>');
        return this.attachedPopover.showAfter(delay, fadeInTime);
      }
    };


    /**
     * Removes the popover, if it is displayed.
     */

    AbstractProvider.prototype.removePopover = function() {
      if (this.attachedPopover) {
        this.attachedPopover.dispose();
        return this.attachedPopover = null;
      }
    };


    /**
     * Retrieves a tooltip for the word given.
     *
     * @param {TextEditor} editor         TextEditor to search for namespace of term.
     * @param {string}     term           Term to search for.
     * @param {Point}      bufferPosition The cursor location the term is at.
     */

    AbstractProvider.prototype.getTooltipForWord = function(editor, term, bufferPosition) {};


    /**
     * Gets the correct selector when a selector is clicked.
     * @param  {jQuery.Event}  event  A jQuery event.
     * @return {object|null}          A selector to be used with jQuery.
     */

    AbstractProvider.prototype.getSelectorFromEvent = function(event) {
      return event.currentTarget;
    };


    /**
     * Gets the correct element to attach the popover to from the retrieved selector.
     * @param  {jQuery.Event}  event  A jQuery event.
     * @return {object|null}          A selector to be used with jQuery.
     */

    AbstractProvider.prototype.getPopoverElementFromSelector = function(selector) {
      return selector;
    };

    return AbstractProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1hdXRvY29tcGxldGUtcGhwL2xpYi90b29sdGlwL2Fic3RyYWN0LXByb3ZpZGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzREFBQTs7QUFBQSxFQUFDLGFBQWMsT0FBQSxDQUFRLE1BQVIsRUFBZCxVQUFELENBQUE7O0FBQUEsRUFFQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFVBQVIsQ0FGVixDQUFBOztBQUFBLEVBR0EsZUFBQSxHQUFrQixPQUFBLENBQVEsOEJBQVIsQ0FIbEIsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBRU07a0NBQ0Y7O0FBQUEsK0JBQUEsbUJBQUEsR0FBcUIsRUFBckIsQ0FBQTs7QUFFQTtBQUFBOztPQUZBOztBQUFBLCtCQUtBLElBQUEsR0FBTSxTQUFBLEdBQUE7QUFDRixNQUFBLElBQUMsQ0FBQSxDQUFELEdBQUssT0FBQSxDQUFRLFFBQVIsQ0FBTCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsTUFBRCxHQUFVLE9BQUEsQ0FBUSw2QkFBUixDQURWLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLE9BSFgsQ0FBQTtBQUFBLE1BS0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxNQUFELEdBQUE7aUJBQzlCLEtBQUMsQ0FBQSxjQUFELENBQWdCLE1BQWhCLEVBRDhCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEMsQ0FMQSxDQUFBO0FBQUEsTUFTQSxJQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFmLENBQWdDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtBQUM1Qixj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

//# sourceURL=/home/champ/.atom/packages/atom-autocomplete-php/lib/tooltip/abstract-provider.coffee
