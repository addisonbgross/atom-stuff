(function() {
  var BreakpointMarker;

  module.exports = BreakpointMarker = (function() {
    function BreakpointMarker(editor, range, gutter) {
      var enableGutters, gutterMarker, lineMarker;
      this.editor = editor;
      this.range = range;
      this.gutter = gutter;
      this.markers = {};
      enableGutters = atom.config.get('php-debug.GutterBreakpointToggle');
      if (enableGutters && gutter) {
        gutterMarker = this.editor.markBufferRange(this.range, {
          invalidate: 'inside'
        });
        this.markers.gutter = gutterMarker;
      }
      lineMarker = this.editor.markBufferRange(this.range);
      this.markers.line = lineMarker;
    }

    BreakpointMarker.prototype.decorate = function() {
      var item;
      item = document.createElement('span');
      item.className = "highlight php-debug-gutter php-debug-highlight";
      if (this.markers.gutter) {
        this.gutter.decorateMarker(this.markers.gutter, {
          "class": 'php-debug-gutter-marker',
          item: item
        });
      }
      if (this.markers.line) {
        return this.editor.decorateMarker(this.markers.line, {
          type: 'line-number',
          "class": 'php-debug-breakpoint'
        });
      }
    };

    BreakpointMarker.prototype.destroy = function() {
      var marker, type, _ref, _results;
      _ref = this.markers;
      _results = [];
      for (type in _ref) {
        marker = _ref[type];
        _results.push(marker != null ? marker.destroy() : void 0);
      }
      return _results;
    };

    BreakpointMarker.prototype.getStartBufferPosition = function() {
      var marker, type, _ref;
      _ref = this.markers;
      for (type in _ref) {
        marker = _ref[type];
        if (marker) {
          return marker.getStartBufferPosition();
        }
      }
    };

    return BreakpointMarker;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGhwLWRlYnVnL2xpYi9tb2RlbHMvYnJlYWtwb2ludC1tYXJrZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBRUE7QUFBQSxNQUFBLGdCQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsMEJBQUUsTUFBRixFQUFVLEtBQVYsRUFBaUIsTUFBakIsR0FBQTtBQUNYLFVBQUEsdUNBQUE7QUFBQSxNQURZLElBQUMsQ0FBQSxTQUFBLE1BQ2IsQ0FBQTtBQUFBLE1BRG9CLElBQUMsQ0FBQSxRQUFBLEtBQ3JCLENBQUE7QUFBQSxNQUQyQixJQUFDLENBQUEsU0FBQSxNQUM1QixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLEVBQVgsQ0FBQTtBQUFBLE1BQ0EsYUFBQSxHQUFnQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isa0NBQWhCLENBRGhCLENBQUE7QUFFQSxNQUFBLElBQUcsYUFBQSxJQUFpQixNQUFwQjtBQUNFLFFBQUEsWUFBQSxHQUFlLElBQUMsQ0FBQSxNQUFNLENBQUMsZUFBUixDQUF3QixJQUFDLENBQUEsS0FBekIsRUFBZ0M7QUFBQSxVQUFDLFVBQUEsRUFBWSxRQUFiO1NBQWhDLENBQWYsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULEdBQWtCLFlBRGxCLENBREY7T0FGQTtBQUFBLE1BTUEsVUFBQSxHQUFhLElBQUMsQ0FBQSxNQUFNLENBQUMsZUFBUixDQUF3QixJQUFDLENBQUEsS0FBekIsQ0FOYixDQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsR0FBZ0IsVUFQaEIsQ0FEVztJQUFBLENBQWI7O0FBQUEsK0JBVUEsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLFFBQVEsQ0FBQyxhQUFULENBQXVCLE1BQXZCLENBQVAsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLFNBQUwsR0FBaUIsZ0RBRGpCLENBQUE7QUFHQSxNQUFBLElBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFaO0FBQ0UsUUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLGNBQVIsQ0FBdUIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFoQyxFQUF3QztBQUFBLFVBQUMsT0FBQSxFQUFPLHlCQUFSO0FBQUEsVUFBa0MsTUFBQSxJQUFsQztTQUF4QyxDQUFBLENBREY7T0FIQTtBQU1BLE1BQUEsSUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVo7ZUFDRSxJQUFDLENBQUEsTUFBTSxDQUFDLGNBQVIsQ0FBdUIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFoQyxFQUFzQztBQUFBLFVBQUMsSUFBQSxFQUFNLGFBQVA7QUFBQSxVQUFzQixPQUFBLEVBQU8sc0JBQTdCO1NBQXRDLEVBREY7T0FQUTtJQUFBLENBVlYsQ0FBQTs7QUFBQSwrQkFvQkEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLFVBQUEsNEJBQUE7QUFBQTtBQUFBO1dBQUEsWUFBQTs0QkFBQTtBQUNFLHVDQUFBLE1BQU0sQ0FBRSxPQUFSLENBQUEsV0FBQSxDQURGO0FBQUE7c0JBRE87SUFBQSxDQXBCVCxDQUFBOztBQUFBLCtCQXdCQSxzQkFBQSxHQUF3QixTQUFBLEdBQUE7QUFDdEIsVUFBQSxrQkFBQTtBQUFBO0FBQUEsV0FBQSxZQUFBOzRCQUFBO0FBQ0UsUUFBQSxJQUFHLE1BQUg7QUFDRSxpQkFBTyxNQUFNLENBQUMsc0JBQVAsQ0FBQSxDQUFQLENBREY7U0FERjtBQUFBLE9BRHNCO0lBQUEsQ0F4QnhCLENBQUE7OzRCQUFBOztNQUZGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/php-debug/lib/models/breakpoint-marker.coffee
