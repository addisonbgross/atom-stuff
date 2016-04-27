(function() {
  var CompositeDisposable, FindAndReplace, MinimapFindAndReplaceBinding;

  CompositeDisposable = require('atom').CompositeDisposable;

  FindAndReplace = null;

  module.exports = MinimapFindAndReplaceBinding = (function() {
    function MinimapFindAndReplaceBinding(minimap, fnrAPI) {
      this.minimap = minimap;
      this.fnrAPI = fnrAPI;
      this.editor = this.minimap.getTextEditor();
      this.subscriptions = new CompositeDisposable;
      this.decorationsByMarkerId = {};
      this.subscriptionsByMarkerId = {};
      this.discoverMarkers();
      if (this.fnrAPI != null) {
        this.layer = this.fnrAPI.resultsMarkerLayerForTextEditor(this.editor);
        this.subscriptions.add(this.layer.onDidCreateMarker((function(_this) {
          return function(marker) {
            return _this.handleCreatedMarker(marker);
          };
        })(this)));
      } else {
        this.subscriptions.add(this.editor.displayBuffer.onDidCreateMarker((function(_this) {
          return function(marker) {
            return _this.handleCreatedMarker(marker);
          };
        })(this)));
      }
    }

    MinimapFindAndReplaceBinding.prototype.destroy = function() {
      var decoration, id, sub, _ref, _ref1;
      _ref = this.subscriptionsByMarkerId;
      for (id in _ref) {
        sub = _ref[id];
        sub.dispose();
      }
      _ref1 = this.decorationsByMarkerId;
      for (id in _ref1) {
        decoration = _ref1[id];
        decoration.destroy();
      }
      this.subscriptions.dispose();
      this.minimap = null;
      this.editor = null;
      this.decorationsByMarkerId = {};
      return this.subscriptionsByMarkerId = {};
    };

    MinimapFindAndReplaceBinding.prototype.clear = function() {
      var decoration, id, sub, _ref, _ref1, _results;
      _ref = this.subscriptionsByMarkerId;
      for (id in _ref) {
        sub = _ref[id];
        sub.dispose();
        delete this.subscriptionsByMarkerId[id];
      }
      _ref1 = this.decorationsByMarkerId;
      _results = [];
      for (id in _ref1) {
        decoration = _ref1[id];
        decoration.destroy();
        _results.push(delete this.decorationsByMarkerId[id]);
      }
      return _results;
    };

    MinimapFindAndReplaceBinding.prototype.findAndReplace = function() {
      return FindAndReplace != null ? FindAndReplace : FindAndReplace = atom.packages.getLoadedPackage('find-and-replace').mainModule;
    };

    MinimapFindAndReplaceBinding.prototype.discoverMarkers = function() {
      var _ref;
      return ((_ref = this.layer) != null ? _ref : this.editor).findMarkers({
        "class": 'find-result'
      }).forEach((function(_this) {
        return function(marker) {
          return _this.createDecoration(marker);
        };
      })(this));
    };

    MinimapFindAndReplaceBinding.prototype.handleCreatedMarker = function(marker) {
      var _ref;
      if (((_ref = marker.getProperties()) != null ? _ref["class"] : void 0) === 'find-result') {
        return this.createDecoration(marker);
      }
    };

    MinimapFindAndReplaceBinding.prototype.createDecoration = function(marker) {
      var decoration, id;
      if (!this.findViewIsVisible()) {
        return;
      }
      if (this.decorationsByMarkerId[marker.id] != null) {
        return;
      }
      decoration = this.minimap.decorateMarker(marker, {
        type: 'highlight',
        scope: ".minimap .search-result",
        plugin: 'find-and-replace'
      });
      if (decoration == null) {
        return;
      }
      id = marker.id;
      this.decorationsByMarkerId[id] = decoration;
      return this.subscriptionsByMarkerId[id] = decoration.onDidDestroy((function(_this) {
        return function() {
          _this.subscriptionsByMarkerId[id].dispose();
          delete _this.decorationsByMarkerId[id];
          return delete _this.subscriptionsByMarkerId[id];
        };
      })(this));
    };

    MinimapFindAndReplaceBinding.prototype.findViewIsVisible = function() {
      var _ref, _ref1;
      return (_ref = this.findAndReplace()) != null ? (_ref1 = _ref.findView) != null ? _ref1.is(':visible') : void 0 : void 0;
    };

    return MinimapFindAndReplaceBinding;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvbWluaW1hcC1maW5kLWFuZC1yZXBsYWNlL2xpYi9taW5pbWFwLWZpbmQtYW5kLXJlcGxhY2UtYmluZGluZy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsaUVBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLGNBQUEsR0FBaUIsSUFEakIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLHNDQUFFLE9BQUYsRUFBWSxNQUFaLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxVQUFBLE9BQ2IsQ0FBQTtBQUFBLE1BRHNCLElBQUMsQ0FBQSxTQUFBLE1BQ3ZCLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLE9BQU8sQ0FBQyxhQUFULENBQUEsQ0FBVixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBRGpCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxxQkFBRCxHQUF5QixFQUZ6QixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsdUJBQUQsR0FBMkIsRUFIM0IsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLGVBQUQsQ0FBQSxDQUxBLENBQUE7QUFPQSxNQUFBLElBQUcsbUJBQUg7QUFDRSxRQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBLE1BQU0sQ0FBQywrQkFBUixDQUF3QyxJQUFDLENBQUEsTUFBekMsQ0FBVCxDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLEtBQUssQ0FBQyxpQkFBUCxDQUF5QixDQUFBLFNBQUEsS0FBQSxHQUFBO2lC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

//# sourceURL=/home/champ/.atom/packages/minimap-find-and-replace/lib/minimap-find-and-replace-binding.coffee
