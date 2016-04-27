(function() {
  var AbstractProvider, AttachedPopover, Point, Range, SubAtom, TextEditor, _ref;

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point, TextEditor = _ref.TextEditor;

  SubAtom = require('sub-atom');

  AttachedPopover = require('../services/attached-popover');

  module.exports = AbstractProvider = (function() {
    function AbstractProvider() {}

    AbstractProvider.prototype.regex = null;

    AbstractProvider.prototype.markers = [];

    AbstractProvider.prototype.subAtoms = [];


    /**
     * Initializes this provider.
     */

    AbstractProvider.prototype.init = function() {
      this.$ = require('jquery');
      this.parser = require('../services/php-file-parser');
      atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          editor.onDidSave(function(event) {
            return _this.rescan(editor);
          });
          _this.registerAnnotations(editor);
          return _this.registerEvents(editor);
        };
      })(this));
      atom.workspace.onDidDestroyPane((function(_this) {
        return function(pane) {
          var paneItem, panes, _i, _len, _ref1, _results;
          panes = atom.workspace.getPanes();
          if (panes.length === 1) {
            _ref1 = panes[0].items;
            _results = [];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              paneItem = _ref1[_i];
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
              var _j, _len1, _ref1, _results1;
              _ref1 = pane.items;
              _results1 = [];
              for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                paneItem = _ref1[_j];
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
      return this.removeAnnotations();
    };


    /**
     * Registers event handlers.
     *
     * @param {TextEditor} editor TextEditor to register events to.
     */

    AbstractProvider.prototype.registerEvents = function(editor) {
      var textEditorElement;
      if (editor.getGrammar().scopeName.match(/text.html.php$/)) {
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
        textEditorElement = atom.views.getView(editor);
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
     * Registers the annotations.
     *
     * @param {TextEditor} editor The editor to search through.
     */

    AbstractProvider.prototype.registerAnnotations = function(editor) {
      var match, row, rowNum, rows, text, _results;
      text = editor.getText();
      rows = text.split('\n');
      this.subAtoms[editor.getLongTitle()] = new SubAtom;
      _results = [];
      for (rowNum in rows) {
        row = rows[rowNum];
        _results.push((function() {
          var _results1;
          _results1 = [];
          while ((match = this.regex.exec(row))) {
            _results1.push(this.placeAnnotation(editor, rowNum, row, match));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };


    /**
     * Places an annotation at the specified line and row text.
     *
     * @param {TextEditor} editor
     * @param {int}        row
     * @param {String}     rowText
     * @param {Array}      match
     */

    AbstractProvider.prototype.placeAnnotation = function(editor, row, rowText, match) {
      var annotationInfo, decoration, longTitle, marker, markerLayer, range;
      annotationInfo = this.extractAnnotationInfo(editor, row, rowText, match);
      if (!annotationInfo) {
        return;
      }
      range = new Range(new Point(parseInt(row), 0), new Point(parseInt(row), rowText.length));
      if (typeof editor.addMarkerLayer === 'function') {
        if (this.markerLayers == null) {
          this.markerLayers = new WeakMap;
        }
        if (!(markerLayer = this.markerLayers.get(editor))) {
          markerLayer = editor.addMarkerLayer({
            maintainHistory: true
          });
          this.markerLayers.set(editor, markerLayer);
        }
      }
      marker = (markerLayer != null ? markerLayer : editor).markBufferRange(range, {
        maintainHistory: true,
        invalidate: 'touch'
      });
      decoration = editor.decorateMarker(marker, {
        type: 'line-number',
        "class": annotationInfo.lineNumberClass
      });
      longTitle = editor.getLongTitle();
      if (this.markers[longTitle] === void 0) {
        this.markers[longTitle] = [];
      }
      this.markers[longTitle].push(marker);
      return this.registerAnnotationEventHandlers(editor, row, annotationInfo);
    };


    /**
     * Exracts information about the annotation match.
     *
     * @param {TextEditor} editor
     * @param {int}        row
     * @param {String}     rowText
     * @param {Array}      match
     */

    AbstractProvider.prototype.extractAnnotationInfo = function(editor, row, rowText, match) {};


    /**
     * Registers annotation event handlers for the specified row.
     *
     * @param {TextEditor} editor
     * @param {int}        row
     * @param {Object}     annotationInfo
     */

    AbstractProvider.prototype.registerAnnotationEventHandlers = function(editor, row, annotationInfo) {
      var gutterContainerElement, textEditorElement;
      textEditorElement = atom.views.getView(editor);
      gutterContainerElement = this.$(textEditorElement.shadowRoot).find('.gutter-container');
      return (function(_this) {
        return function(editor, gutterContainerElement, annotationInfo) {
          var longTitle, selector;
          longTitle = editor.getLongTitle();
          selector = '.line-number' + '.' + annotationInfo.lineNumberClass + '[data-buffer-row=' + row + '] .icon-right';
          _this.subAtoms[longTitle].add(gutterContainerElement, 'mouseover', selector, function(event) {
            return _this.handleMouseOver(event, editor, annotationInfo);
          });
          _this.subAtoms[longTitle].add(gutterContainerElement, 'mouseout', selector, function(event) {
            return _this.handleMouseOut(event, editor, annotationInfo);
          });
          return _this.subAtoms[longTitle].add(gutterContainerElement, 'click', selector, function(event) {
            return _this.handleMouseClick(event, editor, annotationInfo);
          });
        };
      })(this)(editor, gutterContainerElement, annotationInfo);
    };


    /**
     * Handles the mouse over event on an annotation.
     *
     * @param {jQuery.Event} event
     * @param {TextEditor}   editor
     * @param {Object}       annotationInfo
     */

    AbstractProvider.prototype.handleMouseOver = function(event, editor, annotationInfo) {
      if (annotationInfo.tooltipText) {
        this.removePopover();
        this.attachedPopover = new AttachedPopover(event.target);
        this.attachedPopover.setText(annotationInfo.tooltipText);
        return this.attachedPopover.show();
      }
    };


    /**
     * Handles the mouse out event on an annotation.
     *
     * @param {jQuery.Event} event
     * @param {TextEditor}   editor
     * @param {Object}       annotationInfo
     */

    AbstractProvider.prototype.handleMouseOut = function(event, editor, annotationInfo) {
      return this.removePopover();
    };


    /**
     * Handles the mouse click event on an annotation.
     *
     * @param {jQuery.Event} event
     * @param {TextEditor}   editor
     * @param {Object}       annotationInfo
     */

    AbstractProvider.prototype.handleMouseClick = function(event, editor, annotationInfo) {};


    /**
     * Removes the existing popover, if any.
     */

    AbstractProvider.prototype.removePopover = function() {
      if (this.attachedPopover) {
        this.attachedPopover.dispose();
        return this.attachedPopover = null;
      }
    };


    /**
     * Removes any annotations that were created.
     *
     * @param {TextEditor} editor The editor to search through.
     */

    AbstractProvider.prototype.removeAnnotations = function(editor) {
      var i, marker, _ref1, _ref2;
      _ref1 = this.markers[editor.getLongTitle()];
      for (i in _ref1) {
        marker = _ref1[i];
        marker.destroy();
      }
      this.markers[editor.getLongTitle()] = [];
      return (_ref2 = this.subAtoms[editor.getLongTitle()]) != null ? _ref2.dispose() : void 0;
    };


    /**
     * Rescans the editor, updating all annotations.
     *
     * @param {TextEditor} editor The editor to search through.
     */

    AbstractProvider.prototype.rescan = function(editor) {
      this.removeAnnotations(editor);
      return this.registerAnnotations(editor);
    };

    return AbstractProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1hdXRvY29tcGxldGUtcGhwL2xpYi9hbm5vdGF0aW9uL2Fic3RyYWN0LXByb3ZpZGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwRUFBQTs7QUFBQSxFQUFBLE9BQTZCLE9BQUEsQ0FBUSxNQUFSLENBQTdCLEVBQUMsYUFBQSxLQUFELEVBQVEsYUFBQSxLQUFSLEVBQWUsa0JBQUEsVUFBZixDQUFBOztBQUFBLEVBRUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxVQUFSLENBRlYsQ0FBQTs7QUFBQSxFQUlBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLDhCQUFSLENBSmxCLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUVNO2tDQUVGOztBQUFBLCtCQUFBLEtBQUEsR0FBTyxJQUFQLENBQUE7O0FBQUEsK0JBQ0EsT0FBQSxHQUFTLEVBRFQsQ0FBQTs7QUFBQSwrQkFFQSxRQUFBLEdBQVUsRUFGVixDQUFBOztBQUlBO0FBQUE7O09BSkE7O0FBQUEsK0JBT0EsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNGLE1BQUEsSUFBQyxDQUFBLENBQUQsR0FBSyxPQUFBLENBQVEsUUFBUixDQUFMLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxNQUFELEdBQVUsT0FBQSxDQUFRLDZCQUFSLENBRFYsQ0FBQTtBQUFBLE1BR0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxNQUFELEdBQUE7QUFDOUIsVUFBQSxNQUFNLENBQUMsU0FBUCxDQUFpQixTQUFDLEtBQUQsR0FBQTttQkFDYixLQUFDLENBQUEsTUFBRCxDQUFRLE1BQVIsRUFEYTtVQUFBLENBQWpCLENBQUEsQ0FBQTtBQUFBLFVBR0EsS0FBQyxDQUFB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

//# sourceURL=/home/champ/.atom/packages/atom-autocomplete-php/lib/annotation/abstract-provider.coffee
