Object.defineProperty(exports, '__esModule', {
  value: true
});

var _atom = require('atom');

'use babel';

var MinimapCursorLineBinding = null;

exports['default'] = {

  active: false,

  isActive: function isActive() {
    return this.active;
  },

  bindings: {},

  activate: function activate(state) {},

  consumeMinimapServiceV1: function consumeMinimapServiceV1(minimap) {
    this.minimap = minimap;
    this.minimap.registerPlugin('cursorline', this);
  },

  deactivate: function deactivate() {
    if (!this.minimap) {
      return;
    }
    this.minimap.unregisterPlugin('cursorline');
    this.minimap = null;
  },

  activatePlugin: function activatePlugin() {
    var _this = this;

    if (this.active) {
      return;
    }

    this.subscriptions = new _atom.CompositeDisposable();
    this.active = true;

    this.minimapsSubscription = this.minimap.observeMinimaps(function (minimap) {
      if (MinimapCursorLineBinding === null) {
        MinimapCursorLineBinding = require('./minimap-cursorline-binding');
      }

      var id = minimap.id;
      var binding = new MinimapCursorLineBinding(minimap);
      _this.bindings[id] = binding;

      var subscription = minimap.onDidDestroy(function () {
        binding.destroy();
        _this.subscriptions.remove(subscription);
        subscription.dispose();
        delete _this.bindings[id];
      });

      _this.subscriptions.add(subscription);
    });
  },

  deactivatePlugin: function deactivatePlugin() {
    if (!this.active) {
      return;
    }

    for (var id in this.bindings) {
      this.bindings[id].destroy();
    }
    this.bindings = {};
    this.active = false;
    this.minimapsSubscription.dispose();
    this.subscriptions.dispose();
  }

};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2NoYW1wLy5hdG9tL3BhY2thZ2VzL21pbmltYXAtY3Vyc29ybGluZS9saWIvbWluaW1hcC1jdXJzb3JsaW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7b0JBRW9DLE1BQU07O0FBRjFDLFdBQVcsQ0FBQTs7QUFJWCxJQUFJLHdCQUF3QixHQUFHLElBQUksQ0FBQTs7cUJBRXBCOztBQUViLFFBQU0sRUFBRSxLQUFLOztBQUViLFVBQVEsRUFBQyxvQkFBRztBQUFFLFdBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQTtHQUFFOztBQUVsQyxVQUFRLEVBQUUsRUFBRTs7QUFFWixVQUFRLEVBQUMsa0JBQUMsS0FBSyxFQUFFLEVBQUU7O0FBRW5CLHlCQUF1QixFQUFDLGlDQUFDLE9BQU8sRUFBRTtBQUNoQyxRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtBQUN0QixRQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUE7R0FDaEQ7O0FBRUQsWUFBVSxFQUFDLHNCQUFHO0FBQ1osUUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFBRSxhQUFNO0tBQUU7QUFDN0IsUUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUMzQyxRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTtHQUNwQjs7QUFFRCxnQkFBYyxFQUFDLDBCQUFHOzs7QUFDaEIsUUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQUUsYUFBTTtLQUFFOztBQUUzQixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFBOztBQUVsQixRQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsVUFBQyxPQUFPLEVBQUs7QUFDcEUsVUFBSSx3QkFBd0IsS0FBSyxJQUFJLEVBQUU7QUFDckMsZ0NBQXdCLEdBQUcsT0FBTyxDQUFDLDhCQUE4QixDQUFDLENBQUE7T0FDbkU7O0FBRUQsVUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQTtBQUNyQixVQUFNLE9BQU8sR0FBRyxJQUFJLHdCQUF3QixDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3JELFlBQUssUUFBUSxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQTs7QUFFM0IsVUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxZQUFNO0FBQzlDLGVBQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNqQixjQUFLLGFBQWEsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUE7QUFDdkMsb0JBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUN0QixlQUFPLE1BQUssUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFBO09BQ3pCLENBQUMsQ0FBQTs7QUFFRixZQUFLLGFBQWEsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUE7S0FDckMsQ0FBQyxDQUFBO0dBQ0g7O0FBRUQsa0JBQWdCLEVBQUMsNEJBQUc7QUFDbEIsUUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFBRSxhQUFNO0tBQUU7O0FBRTVCLFNBQUssSUFBTSxFQUFFLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUFFLFVBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUE7S0FBRTtBQUMvRCxRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQTtBQUNsQixRQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQTtBQUNuQixRQUFJLENBQUMsb0JBQW9CLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDbkMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtHQUM3Qjs7Q0FFRiIsImZpbGUiOiIvaG9tZS9jaGFtcC8uYXRvbS9wYWNrYWdlcy9taW5pbWFwLWN1cnNvcmxpbmUvbGliL21pbmltYXAtY3Vyc29ybGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuXG52YXIgTWluaW1hcEN1cnNvckxpbmVCaW5kaW5nID0gbnVsbFxuXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgYWN0aXZlOiBmYWxzZSxcblxuICBpc0FjdGl2ZSAoKSB7IHJldHVybiB0aGlzLmFjdGl2ZSB9LFxuXG4gIGJpbmRpbmdzOiB7fSxcblxuICBhY3RpdmF0ZSAoc3RhdGUpIHt9LFxuXG4gIGNvbnN1bWVNaW5pbWFwU2VydmljZVYxIChtaW5pbWFwKSB7XG4gICAgdGhpcy5taW5pbWFwID0gbWluaW1hcFxuICAgIHRoaXMubWluaW1hcC5yZWdpc3RlclBsdWdpbignY3Vyc29ybGluZScsIHRoaXMpXG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSAoKSB7XG4gICAgaWYgKCF0aGlzLm1pbmltYXApIHsgcmV0dXJuIH1cbiAgICB0aGlzLm1pbmltYXAudW5yZWdpc3RlclBsdWdpbignY3Vyc29ybGluZScpXG4gICAgdGhpcy5taW5pbWFwID0gbnVsbFxuICB9LFxuXG4gIGFjdGl2YXRlUGx1Z2luICgpIHtcbiAgICBpZiAodGhpcy5hY3RpdmUpIHsgcmV0dXJuIH1cblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWVcblxuICAgIHRoaXMubWluaW1hcHNTdWJzY3JpcHRpb24gPSB0aGlzLm1pbmltYXAub2JzZXJ2ZU1pbmltYXBzKChtaW5pbWFwKSA9PiB7XG4gICAgICBpZiAoTWluaW1hcEN1cnNvckxpbmVCaW5kaW5nID09PSBudWxsKSB7XG4gICAgICAgIE1pbmltYXBDdXJzb3JMaW5lQmluZGluZyA9IHJlcXVpcmUoJy4vbWluaW1hcC1jdXJzb3JsaW5lLWJpbmRpbmcnKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBpZCA9IG1pbmltYXAuaWRcbiAgICAgIGNvbnN0IGJpbmRpbmcgPSBuZXcgTWluaW1hcEN1cnNvckxpbmVCaW5kaW5nKG1pbmltYXApXG4gICAgICB0aGlzLmJpbmRpbmdzW2lkXSA9IGJpbmRpbmdcblxuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gbWluaW1hcC5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgICBiaW5kaW5nLmRlc3Ryb3koKVxuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucmVtb3ZlKHN1YnNjcmlwdGlvbilcbiAgICAgICAgc3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgICAgICBkZWxldGUgdGhpcy5iaW5kaW5nc1tpZF1cbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoc3Vic2NyaXB0aW9uKVxuICAgIH0pXG4gIH0sXG5cbiAgZGVhY3RpdmF0ZVBsdWdpbiAoKSB7XG4gICAgaWYgKCF0aGlzLmFjdGl2ZSkgeyByZXR1cm4gfVxuXG4gICAgZm9yIChjb25zdCBpZCBpbiB0aGlzLmJpbmRpbmdzKSB7IHRoaXMuYmluZGluZ3NbaWRdLmRlc3Ryb3koKSB9XG4gICAgdGhpcy5iaW5kaW5ncyA9IHt9XG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZVxuICAgIHRoaXMubWluaW1hcHNTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG5cbn1cbiJdfQ==
//# sourceURL=/home/champ/.atom/packages/minimap-cursorline/lib/minimap-cursorline.js
