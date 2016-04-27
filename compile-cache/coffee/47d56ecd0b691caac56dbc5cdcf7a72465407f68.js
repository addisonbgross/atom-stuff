(function() {
  var AutocompletionManager, ClassProvider, ConstantProvider, FunctionProvider, MemberProvider, VariableProvider;

  ClassProvider = require('./class-provider.coffee');

  MemberProvider = require('./member-provider.coffee');

  ConstantProvider = require('./constant-provider.coffee');

  VariableProvider = require('./variable-provider.coffee');

  FunctionProvider = require('./function-provider.coffee');

  module.exports = AutocompletionManager = (function() {
    function AutocompletionManager() {}

    AutocompletionManager.prototype.providers = [];


    /**
     * Initializes the autocompletion providers.
     */

    AutocompletionManager.prototype.init = function() {
      var provider, _i, _len, _ref, _results;
      this.providers.push(new ConstantProvider());
      this.providers.push(new VariableProvider());
      this.providers.push(new FunctionProvider());
      this.providers.push(new ClassProvider());
      this.providers.push(new MemberProvider());
      _ref = this.providers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        provider = _ref[_i];
        _results.push(provider.init(this));
      }
      return _results;
    };


    /**
     * Deactivates the autocompletion providers.
     */

    AutocompletionManager.prototype.deactivate = function() {
      var provider, _i, _len, _ref, _results;
      _ref = this.providers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        provider = _ref[_i];
        _results.push(provider.deactivate());
      }
      return _results;
    };


    /**
     * Deactivates the autocompletion providers.
     */

    AutocompletionManager.prototype.getProviders = function() {
      return this.providers;
    };

    return AutocompletionManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1hdXRvY29tcGxldGUtcGhwL2xpYi9hdXRvY29tcGxldGlvbi9hdXRvY29tcGxldGlvbi1tYW5hZ2VyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwR0FBQTs7QUFBQSxFQUFBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLHlCQUFSLENBQWhCLENBQUE7O0FBQUEsRUFDQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSwwQkFBUixDQURqQixDQUFBOztBQUFBLEVBRUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLDRCQUFSLENBRm5CLENBQUE7O0FBQUEsRUFHQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsNEJBQVIsQ0FIbkIsQ0FBQTs7QUFBQSxFQUlBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSw0QkFBUixDQUpuQixDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FFTTt1Q0FDRjs7QUFBQSxvQ0FBQSxTQUFBLEdBQVcsRUFBWCxDQUFBOztBQUVBO0FBQUE7O09BRkE7O0FBQUEsb0NBS0EsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNGLFVBQUEsa0NBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBWCxDQUFvQixJQUFBLGdCQUFBLENBQUEsQ0FBcEIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsQ0FBb0IsSUFBQSxnQkFBQSxDQUFBLENBQXBCLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxJQUFYLENBQW9CLElBQUEsZ0JBQUEsQ0FBQSxDQUFwQixDQUZBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBWCxDQUFvQixJQUFBLGFBQUEsQ0FBQSxDQUFwQixDQUhBLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBWCxDQUFvQixJQUFBLGNBQUEsQ0FBQSxDQUFwQixDQUpBLENBQUE7QUFNQTtBQUFBO1dBQUEsMkNBQUE7NEJBQUE7QUFDSSxzQkFBQSxRQUFRLENBQUMsSUFBVCxDQUFjLElBQWQsRUFBQSxDQURKO0FBQUE7c0JBUEU7SUFBQSxDQUxOLENBQUE7O0FBZUE7QUFBQTs7T0FmQTs7QUFBQSxvQ0FrQkEsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNSLFVBQUEsa0NBQUE7QUFBQTtBQUFBO1dBQUEsMkNBQUE7NEJBQUE7QUFDSSxzQkFBQSxRQUFRLENBQUMsVUFBVCxDQUFBLEVBQUEsQ0FESjtBQUFBO3NCQURRO0lBQUEsQ0FsQlosQ0FBQTs7QUFzQkE7QUFBQTs7T0F0QkE7O0FBQUEsb0NBeUJBLFlBQUEsR0FBYyxTQUFBLEdBQUE7YUFDVixJQUFDLENBQUEsVUFEUztJQUFBLENBekJkLENBQUE7O2lDQUFBOztNQVRKLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/atom-autocomplete-php/lib/autocompletion/autocompletion-manager.coffee
