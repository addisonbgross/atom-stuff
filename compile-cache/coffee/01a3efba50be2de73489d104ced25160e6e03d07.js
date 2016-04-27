(function() {
  var CompositeDisposable, MinimapPigmentsBinding;

  CompositeDisposable = require('event-kit').CompositeDisposable;

  MinimapPigmentsBinding = require('./minimap-pigments-binding');

  module.exports = {
    active: false,
    isActive: function() {
      return this.active;
    },
    activate: function(state) {
      this.bindingsById = {};
      this.subscriptionsById = {};
      return this.subscriptions = new CompositeDisposable;
    },
    consumeMinimapServiceV1: function(minimap) {
      this.minimap = minimap;
      return this.minimap.registerPlugin('pigments', this);
    },
    consumePigmentsServiceV1: function(pigments) {
      this.pigments = pigments;
      this.subscriptions.add(this.pigments.getProject().onDidDestroy((function(_this) {
        return function() {
          return _this.pigments = null;
        };
      })(this)));
      if ((this.minimap != null) && this.active) {
        return this.initialize();
      }
    },
    deactivate: function() {
      this.subscriptions.dispose();
      this.editorsSubscription.dispose();
      this.minimap.unregisterPlugin('pigments');
      this.minimap = null;
      return this.pigments = null;
    },
    activatePlugin: function() {
      if (this.active) {
        return;
      }
      this.active = true;
      if (this.pigments != null) {
        return this.initialize();
      }
    },
    initialize: function() {
      return this.editorsSubscription = this.pigments.observeColorBuffers((function(_this) {
        return function(colorBuffer) {
          var binding, editor, minimap;
          editor = colorBuffer.editor;
          minimap = _this.minimap.minimapForEditor(editor);
          binding = new MinimapPigmentsBinding({
            editor: editor,
            minimap: minimap,
            colorBuffer: colorBuffer
          });
          _this.bindingsById[editor.id] = binding;
          return _this.subscriptionsById[editor.id] = editor.onDidDestroy(function() {
            var _ref;
            if ((_ref = _this.subscriptionsById[editor.id]) != null) {
              _ref.dispose();
            }
            binding.destroy();
            delete _this.subscriptionsById[editor.id];
            return delete _this.bindingsById[editor.id];
          });
        };
      })(this));
    },
    bindingForEditor: function(editor) {
      if (this.bindingsById[editor.id] != null) {
        return this.bindingsById[editor.id];
      }
    },
    deactivatePlugin: function() {
      var binding, id, _ref, _ref1;
      if (!this.active) {
        return;
      }
      _ref = this.bindingsById;
      for (id in _ref) {
        binding = _ref[id];
        binding.destroy();
      }
      this.active = false;
      return (_ref1 = this.editorsSubscription) != null ? _ref1.dispose() : void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvbWluaW1hcC1waWdtZW50cy9saWIvbWluaW1hcC1waWdtZW50cy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMkNBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLFdBQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLHNCQUFBLEdBQXlCLE9BQUEsQ0FBUSw0QkFBUixDQUR6QixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUFRLEtBQVI7QUFBQSxJQUVBLFFBQUEsRUFBVSxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsT0FBSjtJQUFBLENBRlY7QUFBQSxJQUlBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsRUFBaEIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGlCQUFELEdBQXFCLEVBRHJCLENBQUE7YUFFQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsb0JBSFQ7SUFBQSxDQUpWO0FBQUEsSUFTQSx1QkFBQSxFQUF5QixTQUFFLE9BQUYsR0FBQTtBQUN2QixNQUR3QixJQUFDLENBQUEsVUFBQSxPQUN6QixDQUFBO2FBQUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxjQUFULENBQXdCLFVBQXhCLEVBQW9DLElBQXBDLEVBRHVCO0lBQUEsQ0FUekI7QUFBQSxJQVlBLHdCQUFBLEVBQTBCLFNBQUUsUUFBRixHQUFBO0FBQ3hCLE1BRHlCLElBQUMsQ0FBQSxXQUFBLFFBQzFCLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsUUFBUSxDQUFDLFVBQVYsQ0FBQSxDQUFzQixDQUFDLFlBQXZCLENB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

//# sourceURL=/home/champ/.atom/packages/minimap-pigments/lib/minimap-pigments.coffee
