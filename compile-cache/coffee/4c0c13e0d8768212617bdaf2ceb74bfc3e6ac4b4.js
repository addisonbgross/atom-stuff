(function() {
  var commands, contextMenu, deregister, handler, register, runCommand, utility;

  handler = require('./handler');

  utility = require('./utility');

  commands = {
    'get-type': 'GetType',
    'get-parent': 'GetParent',
    'go-to-declaration': 'GoToDeclaration',
    'go-to-definition': 'GoToDefinition',
    'go-to': 'GoTo',
    'go-to-imprecise': 'GoToImprecise',
    'clear-compilation-flag-cache': 'ClearCompilationFlagCache'
  };

  contextMenu = null;

  runCommand = function(command) {
    return Promise.resolve().then(utility.getEditorData).then(function(_arg) {
      var bufferPosition, contents, filepath, filetypes, parameters;
      filepath = _arg.filepath, contents = _arg.contents, filetypes = _arg.filetypes, bufferPosition = _arg.bufferPosition;
      parameters = utility.buildRequestParameters(filepath, contents, filetypes, bufferPosition);
      parameters.command_arguments = [command];
      return handler.request('POST', 'run_completer_command', parameters).then(function(response) {
        if (command.startsWith('Get')) {
          if ((response != null ? response.message : void 0) != null) {
            return atom.notifications.addInfo("[YCM] " + command, {
              detail: response.message
            });
          }
        } else if (command.startsWith('GoTo')) {
          if ((response != null ? response.filepath : void 0) != null) {
            return atom.workspace.open(response.filepath, {
              initialLine: response.line_num - 1,
              initialColumn: response.column_num - 1
            });
          }
        }
      });
    });
  };

  register = function() {
    var command, generatedCommands, generatedMenus, key;
    generatedCommands = {};
    generatedMenus = [];
    for (key in commands) {
      command = commands[key];
      generatedCommands["you-complete-me:" + key] = (function(command) {
        return function(event) {
          return runCommand(command);
        };
      })(command);
      generatedMenus.push({
        command: "you-complete-me:" + key,
        label: command
      });
    }
    atom.commands.add('atom-text-editor', generatedCommands);
    return contextMenu = atom.contextMenu.add({
      'atom-text-editor': [
        {
          label: 'YouCompleteMe',
          submenu: generatedMenus
        }
      ]
    });
  };

  deregister = function() {
    return contextMenu.dispose();
  };

  module.exports = {
    register: register,
    deregister: deregister
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMveW91LWNvbXBsZXRlLW1lL2xpYi9tZW51LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5RUFBQTs7QUFBQSxFQUFBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQUFWLENBQUE7O0FBQUEsRUFDQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FEVixDQUFBOztBQUFBLEVBR0EsUUFBQSxHQUNFO0FBQUEsSUFBQSxVQUFBLEVBQVksU0FBWjtBQUFBLElBQ0EsWUFBQSxFQUFjLFdBRGQ7QUFBQSxJQUVBLG1CQUFBLEVBQXFCLGlCQUZyQjtBQUFBLElBR0Esa0JBQUEsRUFBb0IsZ0JBSHBCO0FBQUEsSUFJQSxPQUFBLEVBQVMsTUFKVDtBQUFBLElBS0EsaUJBQUEsRUFBbUIsZUFMbkI7QUFBQSxJQU9BLDhCQUFBLEVBQWdDLDJCQVBoQztHQUpGLENBQUE7O0FBQUEsRUFZQSxXQUFBLEdBQWMsSUFaZCxDQUFBOztBQUFBLEVBY0EsVUFBQSxHQUFhLFNBQUMsT0FBRCxHQUFBO1dBQ1gsT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUNFLENBQUMsSUFESCxDQUNRLE9BQU8sQ0FBQyxhQURoQixDQUVFLENBQUMsSUFGSCxDQUVRLFNBQUMsSUFBRCxHQUFBO0FBQ0osVUFBQSx5REFBQTtBQUFBLE1BRE0sZ0JBQUEsVUFBVSxnQkFBQSxVQUFVLGlCQUFBLFdBQVcsc0JBQUEsY0FDckMsQ0FBQTtBQUFBLE1BQUEsVUFBQSxHQUFhLE9BQU8sQ0FBQyxzQkFBUixDQUErQixRQUEvQixFQUF5QyxRQUF6QyxFQUFtRCxTQUFuRCxFQUE4RCxjQUE5RCxDQUFiLENBQUE7QUFBQSxNQUNBLFVBQVUsQ0FBQyxpQkFBWCxHQUErQixDQUFDLE9BQUQsQ0FEL0IsQ0FBQTthQUVBLE9BQU8sQ0FBQyxPQUFSLENBQWdCLE1BQWhCLEVBQXdCLHVCQUF4QixFQUFpRCxVQUFqRCxDQUE0RCxDQUFDLElBQTdELENBQWtFLFNBQUMsUUFBRCxHQUFBO0FBQ2hFLFFBQUEsSUFBRyxPQUFPLENBQUMsVUFBUixDQUFtQixLQUFuQixDQUFIO0FBQ0UsVUFBQSxJQUFHLHNEQUFIO21CQUNFLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBNEIsUUFBQSxHQUFRLE9BQXBDLEVBQStDO0FBQUEsY0FBQSxNQUFBLEVBQVEsUUFBUSxDQUFDLE9BQWpCO2FBQS9DLEVBREY7V0FERjtTQUFBLE1BR0ssSUFBRyxPQUFPLENBQUMsVUFBUixDQUFtQixNQUFuQixDQUFIO0FBQ0gsVUFBQSxJQUFHLHVEQUFIO21CQUNFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixRQUFRLENBQUMsUUFBN0IsRUFBdUM7QUFBQSxjQUFBLFdBQUEsRUFBYSxRQUFRLENBQUMsUUFBVCxHQUFvQixDQUFqQztBQUFBLGNBQW9DLGFBQUEsRUFBZSxRQUFRLENBQUMsVUFBVCxHQUFzQixDQUF6RTthQUF2QyxFQURGO1dBREc7U0FKMkQ7TUFBQSxDQUFsRSxFQUhJO0lBQUEsQ0FGUixFQURXO0VBQUEsQ0FkYixDQUFBOztBQUFBLEVBNEJBLFFBQUEsR0FBVyxTQUFBLEdBQUE7QUFDVCxRQUFBLCtDQUFBO0FBQUEsSUFBQSxpQkFBQSxHQUFvQixFQUFwQixDQUFBO0FBQUEsSUFDQSxjQUFBLEdBQWlCLEVBRGpCLENBQUE7QUFFQSxTQUFBLGVBQUE7OEJBQUE7QUFDRSxNQUFBLGlCQUFrQixDQUFDLGtCQUFBLEdBQWtCLEdBQW5CLENBQWxCLEdBQThDLENBQUMsU0FBQyxPQUFELEdBQUE7ZUFBYSxTQUFDLEtBQUQsR0FBQTtpQkFBVyxVQUFBLENBQVcsT0FBWCxFQUFYO1FBQUEsRUFBYjtNQUFBLENBQUQsQ0FBQSxDQUE2QyxPQUE3QyxDQUE5QyxDQUFBO0FBQUEsTUFDQSxjQUFjLENBQUMsSUFBZixDQUFvQjtBQUFBLFFBQUEsT0FBQSxFQUFVLGtCQUFBLEdBQWtCLEdBQTVCO0FBQUEsUUFBbUMsS0FBQSxFQUFPLE9BQTFDO09BQXBCLENBREEsQ0FERjtBQUFBLEtBRkE7QUFBQSxJQUtBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0MsaUJBQXRDLENBTEEsQ0FBQTtXQU1BLFdBQUEsR0FBYyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQWpCLENBQXFCO0FBQUEsTUFBQSxrQkFBQSxFQUFvQjtRQUFDO0FBQUEsVUFBQSxLQUFBLEVBQU8sZUFBUDtBQUFBLFVBQXdCLE9BQUEsRUFBUyxjQUFqQztTQUFEO09BQXBCO0tBQXJCLEVBUEw7RUFBQSxDQTVCWCxDQUFBOztBQUFBLEVBcUNBLFVBQUEsR0FBYSxTQUFBLEdBQUE7V0FDWCxXQUFXLENBQUMsT0FBWixDQUFBLEVBRFc7RUFBQSxDQXJDYixDQUFBOztBQUFBLEVBd0NBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxRQUFWO0FBQUEsSUFDQSxVQUFBLEVBQVksVUFEWjtHQXpDRixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/you-complete-me/lib/menu.coffee
