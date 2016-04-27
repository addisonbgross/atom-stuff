(function() {
  var CompositeDisposable, provider;

  CompositeDisposable = require('atom').CompositeDisposable;

  provider = require('./provider');

  module.exports = {
    config: {
      executablePath: {
        type: 'string',
        title: 'PHP Executable Path',
        "default": 'php'
      }
    },
    activate: function() {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('autocomplete-php.executablePath', function(executablePath) {
        return provider.executablePath = executablePath;
      }));
      return provider.loadCompletions();
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    getProvider: function() {
      return provider;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBocC9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNkJBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQURYLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLGNBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLEtBQUEsRUFBTyxxQkFEUDtBQUFBLFFBRUEsU0FBQSxFQUFTLEtBRlQ7T0FERjtLQURGO0FBQUEsSUFNQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBQWpCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsaUNBQXBCLEVBQ2pCLFNBQUMsY0FBRCxHQUFBO2VBQ0UsUUFBUSxDQUFDLGNBQVQsR0FBMEIsZUFENUI7TUFBQSxDQURpQixDQUFuQixDQURBLENBQUE7YUFJQSxRQUFRLENBQUMsZUFBVCxDQUFBLEVBTFE7SUFBQSxDQU5WO0FBQUEsSUFhQSxVQUFBLEVBQVksU0FBQSxHQUFBO2FBQ1YsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUEsRUFEVTtJQUFBLENBYlo7QUFBQSxJQWdCQSxXQUFBLEVBQWEsU0FBQSxHQUFBO2FBQUcsU0FBSDtJQUFBLENBaEJiO0dBSkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/autocomplete-php/lib/main.coffee
