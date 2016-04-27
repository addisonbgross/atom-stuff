(function() {
  var CompositeDisposable, HighlightColumnView, Point, Range, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Point = _ref.Point, Range = _ref.Range;

  HighlightColumnView = (function(_super) {
    __extends(HighlightColumnView, _super);

    function HighlightColumnView() {
      return HighlightColumnView.__super__.constructor.apply(this, arguments);
    }

    HighlightColumnView.prototype.initialize = function(editor, editorElement, cursor) {
      this.editor = editor;
      this.editorElement = editorElement;
      this.cursor = cursor;
      this.classList.add('highlight-column');
      this.attachToLines();
      this.handleEvents();
      this.updateHighlight();
      return this;
    };

    HighlightColumnView.prototype.attachToLines = function() {
      var lines, _ref1;
      lines = (_ref1 = this.editorElement.rootElement) != null ? typeof _ref1.querySelector === "function" ? _ref1.querySelector('.lines') : void 0 : void 0;
      return lines != null ? lines.appendChild(this) : void 0;
    };

    HighlightColumnView.prototype.handleEvents = function() {
      var configSubscriptions, cursorChanged, dispose, subscriptions, updateHighlightCallback;
      updateHighlightCallback = (function(_this) {
        return function() {
          return _this.updateHighlight();
        };
      })(this);
      subscriptions = new CompositeDisposable;
      configSubscriptions = this.handleConfigEvents();
      subscriptions.add(atom.config.onDidChange('editor.fontSize', function() {
        return setTimeout(updateHighlightCallback, 0);
      }));
      if (this.editorElement.hasTiledRendering) {
        subscriptions.add(this.editorElement.onDidChangeScrollLeft(updateHighlightCallback));
      }
      cursorChanged = (function(_this) {
        return function() {
          return _this.updateHighlight();
        };
      })(this);
      subscriptions.add(this.cursor.onDidChangePosition(cursorChanged));
      subscriptions.add(this.editorElement.onDidAttach((function(_this) {
        return function() {
          _this.attachToLines();
          return updateHighlightCallback();
        };
      })(this)));
      dispose = (function(_this) {
        return function() {
          subscriptions.dispose();
          configSubscriptions.dispose();
          return _this.remove();
        };
      })(this);
      subscriptions.add(this.editor.onDidDestroy(function() {
        return dispose();
      }));
      return subscriptions.add(this.cursor.onDidDestroy(function() {
        return dispose();
      }));
    };

    HighlightColumnView.prototype.handleConfigEvents = function() {
      var subscriptions, updateHighlightCallback;
      updateHighlightCallback = (function(_this) {
        return function() {
          return _this.updateHighlight();
        };
      })(this);
      subscriptions = new CompositeDisposable;
      subscriptions.add(atom.config.observe('highlight-column.opacity', updateHighlightCallback));
      subscriptions.add(atom.config.observe('highlight-column.enabled', updateHighlightCallback));
      subscriptions.add(atom.config.observe('highlight-column.lineMode', updateHighlightCallback));
      return subscriptions;
    };

    HighlightColumnView.prototype.updateHighlight = function() {
      var rect, width;
      if (this.isEnabled()) {
        rect = this.highlightRect();
        width = rect.width;
        if (this.isLineMode()) {
          width = 1;
        }
        this.style.left = "" + rect.left + "px";
        this.style.width = "" + width + "px";
        this.style.opacity = this.opacity();
        return this.style.display = 'block';
      } else {
        return this.style.display = 'none';
      }
    };

    HighlightColumnView.prototype.isEnabled = function() {
      var _ref1;
      return (_ref1 = atom.config.get('highlight-column.enabled')) != null ? _ref1 : true;
    };

    HighlightColumnView.prototype.isLineMode = function() {
      return atom.config.get('highlight-column.lineMode');
    };

    HighlightColumnView.prototype.opacity = function() {
      var _ref1;
      if (this.isLineMode()) {
        return 0.3;
      } else {
        return (_ref1 = atom.config.get('highlight-column.opacity')) != null ? _ref1 : 0.15;
      }
    };

    HighlightColumnView.prototype.highlightRect = function() {
      var rect;
      rect = this._cursorPixelRect();
      if (!rect.width || rect.width === 0) {
        rect.width = this.editor.getDefaultCharWidth();
      }
      if (this.editorElement.hasTiledRendering) {
        rect.left -= this.editorElement.getScrollLeft();
      }
      return rect;
    };

    HighlightColumnView.prototype._cursorPixelRect = function() {
      var column, range, rect, row, screenRange, _ref1;
      _ref1 = this.cursor.getScreenPosition(), row = _ref1.row, column = _ref1.column;
      screenRange = new Range(new Point(row, column), new Point(row, column + 1));
      rect = this.editorElement.pixelRectForScreenRange(screenRange);
      range = this.editorElement.pixelRangeForScreenRange(screenRange);
      rect.left = range.start.left;
      rect.right = range.end.left;
      return rect;
    };

    return HighlightColumnView;

  })(HTMLDivElement);

  module.exports = document.registerElement('highlight-column', {
    "extends": 'div',
    prototype: HighlightColumnView.prototype
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvaGlnaGxpZ2h0LWNvbHVtbi9saWIvaGlnaGxpZ2h0LWNvbHVtbi1lbGVtZW50LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw0REFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBc0MsT0FBQSxDQUFRLE1BQVIsQ0FBdEMsRUFBQywyQkFBQSxtQkFBRCxFQUFzQixhQUFBLEtBQXRCLEVBQTZCLGFBQUEsS0FBN0IsQ0FBQTs7QUFBQSxFQUVNO0FBQ0osMENBQUEsQ0FBQTs7OztLQUFBOztBQUFBLGtDQUFBLFVBQUEsR0FBWSxTQUFFLE1BQUYsRUFBVyxhQUFYLEVBQTJCLE1BQTNCLEdBQUE7QUFDVixNQURXLElBQUMsQ0FBQSxTQUFBLE1BQ1osQ0FBQTtBQUFBLE1BRG9CLElBQUMsQ0FBQSxnQkFBQSxhQUNyQixDQUFBO0FBQUEsTUFEb0MsSUFBQyxDQUFBLFNBQUEsTUFDckMsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxHQUFYLENBQWUsa0JBQWYsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBRCxDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFlBQUQsQ0FBQSxDQUZBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxlQUFELENBQUEsQ0FIQSxDQUFBO2FBSUEsS0FMVTtJQUFBLENBQVosQ0FBQTs7QUFBQSxrQ0FPQSxhQUFBLEdBQWUsU0FBQSxHQUFBO0FBQ2IsVUFBQSxZQUFBO0FBQUEsTUFBQSxLQUFBLHVHQUFrQyxDQUFFLGNBQWUsMkJBQW5ELENBQUE7NkJBQ0EsS0FBSyxDQUFFLFdBQVAsQ0FBbUIsSUFBbkIsV0FGYTtJQUFBLENBUGYsQ0FBQTs7QUFBQSxrQ0FXQSxZQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1os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

//# sourceURL=/home/champ/.atom/packages/highlight-column/lib/highlight-column-element.coffee
