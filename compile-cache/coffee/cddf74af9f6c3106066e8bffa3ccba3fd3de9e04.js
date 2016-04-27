(function() {
  module.exports = {
    config: {
      fontSize: {
        title: 'Font Size',
        description: 'Change the UI font size. Needs to be between 10 and 20.',
        type: ['integer', 'string'],
        minimum: 10,
        maximum: 20,
        "default": 'Auto'
      },
      layoutMode: {
        title: 'Layout Mode',
        description: 'In Auto mode, the UI will automatically adapt based on the window size.',
        type: 'string',
        "default": 'Auto',
        "enum": ['Compact', 'Auto', 'Spacious']
      }
    },
    activate: function(state) {
      return atom.themes.onDidChangeActiveThemes(function() {
        var Config;
        Config = require('./config');
        return Config.apply();
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvc2xpbS1kYXJrLXVpL2xpYi9zZXR0aW5ncy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUVFO0FBQUEsTUFBQSxRQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxXQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEseURBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxDQUFDLFNBQUQsRUFBWSxRQUFaLENBRk47QUFBQSxRQUdBLE9BQUEsRUFBUyxFQUhUO0FBQUEsUUFJQSxPQUFBLEVBQVMsRUFKVDtBQUFBLFFBS0EsU0FBQSxFQUFTLE1BTFQ7T0FERjtBQUFBLE1BUUEsVUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sYUFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLHlFQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLE1BSFQ7QUFBQSxRQUlBLE1BQUEsRUFBTSxDQUNKLFNBREksRUFFSixNQUZJLEVBR0osVUFISSxDQUpOO09BVEY7S0FGRjtBQUFBLElBcUJBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTthQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsdUJBQVosQ0FBb0MsU0FBQSxHQUFBO0FBQ2xDLFlBQUEsTUFBQTtBQUFBLFFBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBQVQsQ0FBQTtlQUNBLE1BQU0sQ0FBQyxLQUFQLENBQUEsRUFGa0M7TUFBQSxDQUFwQyxFQURRO0lBQUEsQ0FyQlY7R0FERixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/slim-dark-ui/lib/settings.coffee
