Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

'use babel';

var MinimapCursorLineBinding = (function () {
  function MinimapCursorLineBinding(minimap) {
    var _this = this;

    _classCallCheck(this, MinimapCursorLineBinding);

    this.minimap = minimap;
    this.subscriptions = new _atom.CompositeDisposable();
    this.editor = this.minimap.getTextEditor();
    this.decorationsByMarkerId = {};
    this.decorationSubscriptionsByMarkerId = {};

    this.subscriptions.add(this.editor.observeCursors(function (cursor) {
      var marker = cursor.getMarker();
      if (marker.matchesProperties({ type: 'selection' })) {
        _this.handleMarker(marker);
      }
    }));
  }

  _createClass(MinimapCursorLineBinding, [{
    key: 'handleMarker',
    value: function handleMarker(marker) {
      var _this2 = this;

      var id = marker.id;

      var decoration = this.minimap.decorateMarker(marker, { type: 'line', 'class': 'cursor-line' });
      this.decorationsByMarkerId[id] = decoration;
      this.decorationSubscriptionsByMarkerId[id] = decoration.onDidDestroy(function () {
        _this2.decorationSubscriptionsByMarkerId[id].dispose();

        delete _this2.decorationsByMarkerId[id];
        delete _this2.decorationSubscriptionsByMarkerId[id];
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      for (var id in this.decorationsByMarkerId) {
        var decoration = this.decorationsByMarkerId[id];
        this.decorationSubscriptionsByMarkerId[id].dispose();
        decoration.destroy();

        delete this.decorationsByMarkerId[id];
        delete this.decorationSubscriptionsByMarkerId[id];
      }

      this.subscriptions.dispose();
    }
  }]);

  return MinimapCursorLineBinding;
})();

exports['default'] = MinimapCursorLineBinding;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2NoYW1wLy5hdG9tL3BhY2thZ2VzL21pbmltYXAtY3Vyc29ybGluZS9saWIvbWluaW1hcC1jdXJzb3JsaW5lLWJpbmRpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRW9DLE1BQU07O0FBRjFDLFdBQVcsQ0FBQTs7SUFJVSx3QkFBd0I7QUFFL0IsV0FGTyx3QkFBd0IsQ0FFOUIsT0FBTyxFQUFFOzs7MEJBRkgsd0JBQXdCOztBQUd6QyxRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtBQUN0QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQTtBQUMxQyxRQUFJLENBQUMscUJBQXFCLEdBQUcsRUFBRSxDQUFBO0FBQy9CLFFBQUksQ0FBQyxpQ0FBaUMsR0FBRyxFQUFFLENBQUE7O0FBRTNDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLFVBQUMsTUFBTSxFQUFLO0FBQzVELFVBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQTtBQUNqQyxVQUFJLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFO0FBQ25ELGNBQUssWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFBO09BQzFCO0tBQ0YsQ0FBQyxDQUFDLENBQUE7R0FDSjs7ZUFma0Isd0JBQXdCOztXQWlCOUIsc0JBQUMsTUFBTSxFQUFFOzs7VUFDWixFQUFFLEdBQUssTUFBTSxDQUFiLEVBQUU7O0FBQ1YsVUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQzVDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBTyxhQUFhLEVBQUUsQ0FDL0MsQ0FBQTtBQUNELFVBQUksQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUE7QUFDM0MsVUFBSSxDQUFDLGlDQUFpQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUMsWUFBTTtBQUN6RSxlQUFLLGlDQUFpQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFBOztBQUVwRCxlQUFPLE9BQUsscUJBQXFCLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDckMsZUFBTyxPQUFLLGlDQUFpQyxDQUFDLEVBQUUsQ0FBQyxDQUFBO09BQ2xELENBQUMsQ0FBQTtLQUNIOzs7V0FFTyxtQkFBRztBQUNULFdBQUssSUFBTSxFQUFFLElBQUksSUFBSSxDQUFDLHFCQUFxQixFQUFFO0FBQzNDLFlBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLENBQUMsQ0FBQTtBQUNqRCxZQUFJLENBQUMsaUNBQWlDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDcEQsa0JBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQTs7QUFFcEIsZUFBTyxJQUFJLENBQUMscUJBQXFCLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDckMsZUFBTyxJQUFJLENBQUMsaUNBQWlDLENBQUMsRUFBRSxDQUFDLENBQUE7T0FDbEQ7O0FBRUQsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUM3Qjs7O1NBMUNrQix3QkFBd0I7OztxQkFBeEIsd0JBQXdCIiwiZmlsZSI6Ii9ob21lL2NoYW1wLy5hdG9tL3BhY2thZ2VzL21pbmltYXAtY3Vyc29ybGluZS9saWIvbWluaW1hcC1jdXJzb3JsaW5lLWJpbmRpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWluaW1hcEN1cnNvckxpbmVCaW5kaW5nIHtcblxuICBjb25zdHJ1Y3RvciAobWluaW1hcCkge1xuICAgIHRoaXMubWluaW1hcCA9IG1pbmltYXBcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5lZGl0b3IgPSB0aGlzLm1pbmltYXAuZ2V0VGV4dEVkaXRvcigpXG4gICAgdGhpcy5kZWNvcmF0aW9uc0J5TWFya2VySWQgPSB7fVxuICAgIHRoaXMuZGVjb3JhdGlvblN1YnNjcmlwdGlvbnNCeU1hcmtlcklkID0ge31cblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lZGl0b3Iub2JzZXJ2ZUN1cnNvcnMoKGN1cnNvcikgPT4ge1xuICAgICAgY29uc3QgbWFya2VyID0gY3Vyc29yLmdldE1hcmtlcigpXG4gICAgICBpZiAobWFya2VyLm1hdGNoZXNQcm9wZXJ0aWVzKHsgdHlwZTogJ3NlbGVjdGlvbicgfSkpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVNYXJrZXIobWFya2VyKVxuICAgICAgfVxuICAgIH0pKVxuICB9XG5cbiAgaGFuZGxlTWFya2VyIChtYXJrZXIpIHtcbiAgICBjb25zdCB7IGlkIH0gPSBtYXJrZXJcbiAgICBjb25zdCBkZWNvcmF0aW9uID0gdGhpcy5taW5pbWFwLmRlY29yYXRlTWFya2VyKFxuICAgICAgbWFya2VyLCB7IHR5cGU6ICdsaW5lJywgY2xhc3M6ICdjdXJzb3ItbGluZScgfVxuICAgIClcbiAgICB0aGlzLmRlY29yYXRpb25zQnlNYXJrZXJJZFtpZF0gPSBkZWNvcmF0aW9uXG4gICAgdGhpcy5kZWNvcmF0aW9uU3Vic2NyaXB0aW9uc0J5TWFya2VySWRbaWRdID0gZGVjb3JhdGlvbi5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgdGhpcy5kZWNvcmF0aW9uU3Vic2NyaXB0aW9uc0J5TWFya2VySWRbaWRdLmRpc3Bvc2UoKVxuXG4gICAgICBkZWxldGUgdGhpcy5kZWNvcmF0aW9uc0J5TWFya2VySWRbaWRdXG4gICAgICBkZWxldGUgdGhpcy5kZWNvcmF0aW9uU3Vic2NyaXB0aW9uc0J5TWFya2VySWRbaWRdXG4gICAgfSlcbiAgfVxuXG4gIGRlc3Ryb3kgKCkge1xuICAgIGZvciAoY29uc3QgaWQgaW4gdGhpcy5kZWNvcmF0aW9uc0J5TWFya2VySWQpIHtcbiAgICAgIGNvbnN0IGRlY29yYXRpb24gPSB0aGlzLmRlY29yYXRpb25zQnlNYXJrZXJJZFtpZF1cbiAgICAgIHRoaXMuZGVjb3JhdGlvblN1YnNjcmlwdGlvbnNCeU1hcmtlcklkW2lkXS5kaXNwb3NlKClcbiAgICAgIGRlY29yYXRpb24uZGVzdHJveSgpXG5cbiAgICAgIGRlbGV0ZSB0aGlzLmRlY29yYXRpb25zQnlNYXJrZXJJZFtpZF1cbiAgICAgIGRlbGV0ZSB0aGlzLmRlY29yYXRpb25TdWJzY3JpcHRpb25zQnlNYXJrZXJJZFtpZF1cbiAgICB9XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cblxufVxuIl19
//# sourceURL=/home/champ/.atom/packages/minimap-cursorline/lib/minimap-cursorline-binding.js
