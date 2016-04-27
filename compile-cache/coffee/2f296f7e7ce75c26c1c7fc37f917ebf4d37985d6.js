(function() {
  var ClassProvider, FunctionProvider, PropertyProvider, TooltipManager;

  ClassProvider = require('./class-provider.coffee');

  FunctionProvider = require('./function-provider.coffee');

  PropertyProvider = require('./property-provider.coffee');

  module.exports = TooltipManager = (function() {
    function TooltipManager() {}

    TooltipManager.prototype.providers = [];


    /**
     * Initializes the tooltip providers.
     */

    TooltipManager.prototype.init = function() {
      var provider, _i, _len, _ref, _results;
      this.providers.push(new ClassProvider());
      this.providers.push(new FunctionProvider());
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

    TooltipManager.prototype.deactivate = function() {
      var provider, _i, _len, _ref, _results;
      _ref = this.providers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        provider = _ref[_i];
        _results.push(provider.deactivate());
      }
      return _results;
    };

    return TooltipManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1hdXRvY29tcGxldGUtcGhwL2xpYi90b29sdGlwL3Rvb2x0aXAtbWFuYWdlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsaUVBQUE7O0FBQUEsRUFBQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSx5QkFBUixDQUFoQixDQUFBOztBQUFBLEVBQ0EsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLDRCQUFSLENBRG5CLENBQUE7O0FBQUEsRUFFQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsNEJBQVIsQ0FGbkIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBRU07Z0NBQ0Y7O0FBQUEsNkJBQUEsU0FBQSxHQUFXLEVBQVgsQ0FBQTs7QUFFQTtBQUFBOztPQUZBOztBQUFBLDZCQUtBLElBQUEsR0FBTSxTQUFBLEdBQUE7QUFDRixVQUFBLGtDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsQ0FBb0IsSUFBQSxhQUFBLENBQUEsQ0FBcEIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsQ0FBb0IsSUFBQSxnQkFBQSxDQUFBLENBQXBCLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxJQUFYLENBQW9CLElBQUEsZ0JBQUEsQ0FBQSxDQUFwQixDQUZBLENBQUE7QUFJQTtBQUFBO1dBQUEsMkNBQUE7NEJBQUE7QUFDSSxzQkFBQSxRQUFRLENBQUMsSUFBVCxDQUFjLElBQWQsRUFBQSxDQURKO0FBQUE7c0JBTEU7SUFBQSxDQUxOLENBQUE7O0FBYUE7QUFBQTs7T0FiQTs7QUFBQSw2QkFnQkEsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNSLFVBQUEsa0NBQUE7QUFBQTtBQUFBO1dBQUEsMkNBQUE7NEJBQUE7QUFDSSxzQkFBQSxRQUFRLENBQUMsVUFBVCxDQUFBLEVBQUEsQ0FESjtBQUFBO3NCQURRO0lBQUEsQ0FoQlosQ0FBQTs7MEJBQUE7O01BUEosQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/atom-autocomplete-php/lib/tooltip/tooltip-manager.coffee
