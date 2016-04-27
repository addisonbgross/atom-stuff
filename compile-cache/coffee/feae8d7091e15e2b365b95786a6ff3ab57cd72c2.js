(function() {
  var enabledForScope, getCompletions, getIssues, utility;

  utility = require('./utility');

  getCompletions = require('./get-completions');

  getIssues = require('./get-issues');

  enabledForScope = function(scopeDescriptor) {};

  module.exports = {
    selector: '*',
    inclusionPriority: 2,
    suggestionPriority: 2,
    excludeLowerPriority: false,
    grammarScopes: ['*'],
    scope: 'file',
    lintOnFly: true,
    getSuggestions: function(context) {
      if (!utility.isEnabledForScope(context.scopeDescriptor)) {
        return [];
      }
      return getCompletions(context)["catch"](function(error) {
        console.error('[YCM-ERROR]', error);
        return [];
      });
    },
    lint: function(editor) {
      if (!utility.isEnabledForScope(editor.getRootScopeDescriptor())) {
        return [];
      }
      return getIssues(editor)["catch"](function(error) {
        console.error('[YCM-ERROR]', error);
        return [];
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMveW91LWNvbXBsZXRlLW1lL2xpYi9wcm92aWRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbURBQUE7O0FBQUEsRUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FBVixDQUFBOztBQUFBLEVBQ0EsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVIsQ0FEakIsQ0FBQTs7QUFBQSxFQUVBLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQUZaLENBQUE7O0FBQUEsRUFJQSxlQUFBLEdBQWtCLFNBQUMsZUFBRCxHQUFBLENBSmxCLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsR0FBVjtBQUFBLElBQ0EsaUJBQUEsRUFBbUIsQ0FEbkI7QUFBQSxJQUVBLGtCQUFBLEVBQW9CLENBRnBCO0FBQUEsSUFHQSxvQkFBQSxFQUFzQixLQUh0QjtBQUFBLElBS0EsYUFBQSxFQUFlLENBQUMsR0FBRCxDQUxmO0FBQUEsSUFNQSxLQUFBLEVBQU8sTUFOUDtBQUFBLElBT0EsU0FBQSxFQUFXLElBUFg7QUFBQSxJQVNBLGNBQUEsRUFBZ0IsU0FBQyxPQUFELEdBQUE7QUFDZCxNQUFBLElBQUEsQ0FBQSxPQUF3QixDQUFDLGlCQUFSLENBQTBCLE9BQU8sQ0FBQyxlQUFsQyxDQUFqQjtBQUFBLGVBQU8sRUFBUCxDQUFBO09BQUE7YUFDQSxjQUFBLENBQWUsT0FBZixDQUF1QixDQUFDLE9BQUQsQ0FBdkIsQ0FBOEIsU0FBQyxLQUFELEdBQUE7QUFDNUIsUUFBQSxPQUFPLENBQUMsS0FBUixDQUFjLGFBQWQsRUFBNkIsS0FBN0IsQ0FBQSxDQUFBO0FBQ0EsZUFBTyxFQUFQLENBRjRCO01BQUEsQ0FBOUIsRUFGYztJQUFBLENBVGhCO0FBQUEsSUFlQSxJQUFBLEVBQU0sU0FBQyxNQUFELEdBQUE7QUFDSixNQUFBLElBQUEsQ0FBQSxPQUF3QixDQUFDLGlCQUFSLENBQTBCLE1BQU0sQ0FBQyxzQkFBUCxDQUFBLENBQTFCLENBQWpCO0FBQUEsZUFBTyxFQUFQLENBQUE7T0FBQTthQUNBLFNBQUEsQ0FBVSxNQUFWLENBQWlCLENBQUMsT0FBRCxDQUFqQixDQUF3QixTQUFDLEtBQUQsR0FBQTtBQUN0QixRQUFBLE9BQU8sQ0FBQyxLQUFSLENBQWMsYUFBZCxFQUE2QixLQUE3QixDQUFBLENBQUE7QUFDQSxlQUFPLEVBQVAsQ0FGc0I7TUFBQSxDQUF4QixFQUZJO0lBQUEsQ0FmTjtHQVJGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/you-complete-me/lib/provider.coffee
