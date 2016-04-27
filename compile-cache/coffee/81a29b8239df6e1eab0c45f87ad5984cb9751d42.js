(function() {
  var AnnotationManager, MethodProvider, PropertyProvider;

  MethodProvider = require('./method-provider.coffee');

  PropertyProvider = require('./property-provider.coffee');

  module.exports = AnnotationManager = (function() {
    function AnnotationManager() {}

    AnnotationManager.prototype.providers = [];


    /**
     * Initializes the tooltip providers.
     */

    AnnotationManager.prototype.init = function() {
      var provider, _i, _len, _ref, _results;
      this.providers.push(new MethodProvider());
      this.providers.push(new PropertyProvider());
      _ref = this.providers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        provider = _ref[_i];
        _results.push(provider.init(this));
      }
      return _results;
    };


    /**
     * Deactivates the tooltip providers.
     */

    AnnotationManager.prototype.deactivate = function() {
      var provider, _i, _len, _ref, _results;
      _ref = this.providers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        provider = _ref[_i];
        _results.push(provider.deactivate());
      }
      return _results;
    };

    return AnnotationManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1hdXRvY29tcGxldGUtcGhwL2xpYi9hbm5vdGF0aW9uL2Fubm90YXRpb24tbWFuYWdlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbURBQUE7O0FBQUEsRUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSwwQkFBUixDQUFqQixDQUFBOztBQUFBLEVBQ0EsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLDRCQUFSLENBRG5CLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUVNO21DQUNGOztBQUFBLGdDQUFBLFNBQUEsR0FBVyxFQUFYLENBQUE7O0FBRUE7QUFBQTs7T0FGQTs7QUFBQSxnQ0FLQSxJQUFBLEdBQU0sU0FBQSxHQUFBO0FBQ0YsVUFBQSxrQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxJQUFYLENBQW9CLElBQUEsY0FBQSxDQUFBLENBQXBCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxJQUFYLENBQW9CLElBQUEsZ0JBQUEsQ0FBQSxDQUFwQixDQURBLENBQUE7QUFHQTtBQUFBO1dBQUEsMkNBQUE7NEJBQUE7QUFDSSxzQkFBQSxRQUFRLENBQUMsSUFBVCxDQUFjLElBQWQsRUFBQSxDQURKO0FBQUE7c0JBSkU7SUFBQSxDQUxOLENBQUE7O0FBWUE7QUFBQTs7T0FaQTs7QUFBQSxnQ0FlQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1IsVUFBQSxrQ0FBQTtBQUFBO0FBQUE7V0FBQSwyQ0FBQTs0QkFBQTtBQUNJLHNCQUFBLFFBQVEsQ0FBQyxVQUFULENBQUEsRUFBQSxDQURKO0FBQUE7c0JBRFE7SUFBQSxDQWZaLENBQUE7OzZCQUFBOztNQU5KLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/atom-autocomplete-php/lib/annotation/annotation-manager.coffee
