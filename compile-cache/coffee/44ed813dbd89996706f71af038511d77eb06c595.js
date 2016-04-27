(function() {
  var CompositeDisposable, MinimapPigmentsBinding,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = MinimapPigmentsBinding = (function() {
    function MinimapPigmentsBinding(_arg) {
      this.editor = _arg.editor, this.minimap = _arg.minimap, this.colorBuffer = _arg.colorBuffer;
      this.displayedMarkers = [];
      this.decorationsByMarkerId = {};
      this.subscriptionsByMarkerId = {};
      this.subscriptions = new CompositeDisposable;
      this.colorBuffer.initialize().then((function(_this) {
        return function() {
          return _this.updateMarkers();
        };
      })(this));
      this.subscriptions.add(this.colorBuffer.editor.displayBuffer.onDidTokenize((function(_this) {
        return function() {
          return _this.updateMarkers();
        };
      })(this)));
      this.subscriptions.add(this.colorBuffer.onDidUpdateColorMarkers((function(_this) {
        return function() {
          return _this.updateMarkers();
        };
      })(this)));
      this.decorations = [];
    }

    MinimapPigmentsBinding.prototype.updateMarkers = function() {
      var decoration, m, markers, _i, _j, _len, _len1, _ref, _ref1, _ref2;
      markers = this.colorBuffer.findValidColorMarkers();
      _ref = this.displayedMarkers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        m = _ref[_i];
        if (__indexOf.call(markers, m) < 0) {
          if ((_ref1 = this.decorationsByMarkerId[m.id]) != null) {
            _ref1.destroy();
          }
        }
      }
      for (_j = 0, _len1 = markers.length; _j < _len1; _j++) {
        m = markers[_j];
        if (!(((_ref2 = m.color) != null ? _ref2.isValid() : void 0) && __indexOf.call(this.displayedMarkers, m) < 0)) {
          continue;
        }
        decoration = this.minimap.decorateMarker(m.marker, {
          type: 'highlight',
          color: m.color.toCSS(),
          plugin: 'pigments'
        });
        this.decorationsByMarkerId[m.id] = decoration;
        this.subscriptionsByMarkerId[m.id] = decoration.onDidDestroy((function(_this) {
          return function() {
            var _ref3;
            if ((_ref3 = _this.subscriptionsByMarkerId[m.id]) != null) {
              _ref3.dispose();
            }
            delete _this.subscriptionsByMarkerId[m.id];
            return delete _this.decorationsByMarkerId[m.id];
          };
        })(this));
      }
      return this.displayedMarkers = markers;
    };

    MinimapPigmentsBinding.prototype.destroy = function() {
      this.destroyDecorations();
      return this.subscriptions.dispose();
    };

    MinimapPigmentsBinding.prototype.destroyDecorations = function() {
      var decoration, id, sub, _ref, _ref1;
      _ref = this.subscriptionsByMarkerId;
      for (id in _ref) {
        sub = _ref[id];
        if (sub != null) {
          sub.dispose();
        }
      }
      _ref1 = this.decorationsByMarkerId;
      for (id in _ref1) {
        decoration = _ref1[id];
        if (decoration != null) {
          decoration.destroy();
        }
      }
      this.decorationsByMarkerId = {};
      return this.subscriptionsByMarkerId = {};
    };

    return MinimapPigmentsBinding;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvbWluaW1hcC1waWdtZW50cy9saWIvbWluaW1hcC1waWdtZW50cy1iaW5kaW5nLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwyQ0FBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxnQ0FBQyxJQUFELEdBQUE7QUFDWCxNQURhLElBQUMsQ0FBQSxjQUFBLFFBQVEsSUFBQyxDQUFBLGVBQUEsU0FBUyxJQUFDLENBQUEsbUJBQUEsV0FDakMsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGdCQUFELEdBQW9CLEVBQXBCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxxQkFBRCxHQUF5QixFQUR6QixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsdUJBQUQsR0FBMkIsRUFGM0IsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUpqQixDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsV0FBVyxDQUFDLFVBQWIsQ0FBQSxDQUF5QixDQUFDLElBQTFCLENBQStCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLGFBQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBL0IsQ0FOQSxDQUFBO0FBQUEsTUFRQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLFdBQVcsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLGFBQWxDLENBQWdELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2pF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

//# sourceURL=/home/champ/.atom/packages/minimap-pigments/lib/minimap-pigments-binding.coffee
