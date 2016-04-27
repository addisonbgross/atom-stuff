(function() {
  module.exports = {
    config: {
      distractionFree: {
        type: 'object',
        properties: {
          hideFiles: {
            title: 'Tree View',
            description: 'Reduces the opacity of collapsed folders and files',
            type: 'boolean',
            "default": true
          },
          hideTabs: {
            title: 'Tabs',
            description: 'Reduces the opacity of idle tabs',
            type: 'boolean',
            "default": true
          },
          hideBottom: {
            title: 'Status Bar',
            description: 'Reduces the opacity of idle status bar',
            type: 'boolean',
            "default": true
          },
          hideSpotified: {
            title: 'Spotified Package',
            description: 'Reduces the opacity of Spotified package',
            type: 'boolean',
            "default": false
          }
        }
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvZ2VuZXNpcy11aS9saWIvc2V0dGluZ3MuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7QUFBQSxJQUFBLE1BQUEsRUFDSTtBQUFBLE1BQUEsZUFBQSxFQUNJO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsVUFBQSxFQUNJO0FBQUEsVUFBQSxTQUFBLEVBQ0k7QUFBQSxZQUFBLEtBQUEsRUFBTyxXQUFQO0FBQUEsWUFDQSxXQUFBLEVBQWEsb0RBRGI7QUFBQSxZQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsWUFHQSxTQUFBLEVBQVMsSUFIVDtXQURKO0FBQUEsVUFLQSxRQUFBLEVBQ0k7QUFBQSxZQUFBLEtBQUEsRUFBTyxNQUFQO0FBQUEsWUFDQSxXQUFBLEVBQWEsa0NBRGI7QUFBQSxZQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsWUFHQSxTQUFBLEVBQVMsSUFIVDtXQU5KO0FBQUEsVUFVQSxVQUFBLEVBQ0k7QUFBQSxZQUFBLEtBQUEsRUFBTyxZQUFQO0FBQUEsWUFDQSxXQUFBLEVBQWEsd0NBRGI7QUFBQSxZQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsWUFHQSxTQUFBLEVBQVMsSUFIVDtXQVhKO0FBQUEsVUFlQSxhQUFBLEVBQ0k7QUFBQSxZQUFBLEtBQUEsRUFBTyxtQkFBUDtBQUFBLFlBQ0EsV0FBQSxFQUFhLDBDQURiO0FBQUEsWUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFlBR0EsU0FBQSxFQUFTLEtBSFQ7V0FoQko7U0FGSjtPQURKO0tBREo7QUFBQSxJQXlCQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7YUFDTixJQUFJLENBQUMsTUFBTSxDQUFDLHVCQUFaLENBQW9DLFNBQUEsR0FBQTtBQUNoQyxZQUFBLE1BQUE7QUFBQSxRQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUFULENBQUE7ZUFDQSxNQUFNLENBQUMsS0FBUCxDQUFBLEVBRmdDO01BQUEsQ0FBcEMsRUFETTtJQUFBLENBekJWO0dBREosQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/genesis-ui/lib/settings.coffee
