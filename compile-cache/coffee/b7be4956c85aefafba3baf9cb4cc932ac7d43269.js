(function() {
  var clangSourceScopeDictionary;

  clangSourceScopeDictionary = {
    'source.cpp': 'c++',
    'source.c': 'c',
    'source.objc': 'objective-c',
    'source.objcpp': 'objective-c++',
    'source.c++': 'c++',
    'source.objc++': 'objective-c++'
  };

  module.exports = {
    getFirstCursorSourceScopeLang: function(editor) {
      var scopes;
      scopes = this.getFirstCursorScopes(editor);
      return this.getSourceScopeLang(scopes);
    },
    getFirstCursorScopes: function(editor) {
      var firstPosition, scopeDescriptor, scopes;
      if (editor.getCursors) {
        firstPosition = editor.getCursors()[0].getBufferPosition();
        scopeDescriptor = editor.scopeDescriptorForBufferPosition(firstPosition);
        return scopes = scopeDescriptor.getScopesArray();
      } else {
        return scopes = [];
      }
    },
    getSourceScopeLang: function(scopes, scopeDictionary) {
      var lang, scope, _i, _len;
      if (scopeDictionary == null) {
        scopeDictionary = clangSourceScopeDictionary;
      }
      lang = null;
      for (_i = 0, _len = scopes.length; _i < _len; _i++) {
        scope = scopes[_i];
        if (scope in scopeDictionary) {
          return scopeDictionary[scope];
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWNsYW5nL2xpYi91dGlsLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwQkFBQTs7QUFBQSxFQUFBLDBCQUFBLEdBQTZCO0FBQUEsSUFDM0IsWUFBQSxFQUFrQixLQURTO0FBQUEsSUFFM0IsVUFBQSxFQUFrQixHQUZTO0FBQUEsSUFHM0IsYUFBQSxFQUFrQixhQUhTO0FBQUEsSUFJM0IsZUFBQSxFQUFrQixlQUpTO0FBQUEsSUFPM0IsWUFBQSxFQUFrQixLQVBTO0FBQUEsSUFRM0IsZUFBQSxFQUFrQixlQVJTO0dBQTdCLENBQUE7O0FBQUEsRUFXQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSw2QkFBQSxFQUErQixTQUFDLE1BQUQsR0FBQTtBQUM3QixVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFDLENBQUEsb0JBQUQsQ0FBc0IsTUFBdEIsQ0FBVCxDQUFBO0FBQ0EsYUFBTyxJQUFDLENBQUEsa0JBQUQsQ0FBb0IsTUFBcEIsQ0FBUCxDQUY2QjtJQUFBLENBQS9CO0FBQUEsSUFJQSxvQkFBQSxFQUFzQixTQUFDLE1BQUQsR0FBQTtBQUNwQixVQUFBLHNDQUFBO0FBQUEsTUFBQSxJQUFHLE1BQU0sQ0FBQyxVQUFWO0FBQ0UsUUFBQSxhQUFBLEdBQWdCLE1BQU0sQ0FBQyxVQUFQLENBQUEsQ0FBb0IsQ0FBQSxDQUFBLENBQUUsQ0FBQyxpQkFBdkIsQ0FBQSxDQUFoQixDQUFBO0FBQUEsUUFDQSxlQUFBLEdBQWtCLE1BQU0sQ0FBQyxnQ0FBUCxDQUF3QyxhQUF4QyxDQURsQixDQUFBO2VBRUEsTUFBQSxHQUFTLGVBQWUsQ0FBQyxjQUFoQixDQUFBLEVBSFg7T0FBQSxNQUFBO2VBS0UsTUFBQSxHQUFTLEdBTFg7T0FEb0I7SUFBQSxDQUp0QjtBQUFBLElBWUEsa0JBQUEsRUFBb0IsU0FBQyxNQUFELEVBQVMsZUFBVCxHQUFBO0FBQ2xCLFVBQUEscUJBQUE7O1FBRDJCLGtCQUFnQjtPQUMzQztBQUFBLE1BQUEsSUFBQSxHQUFPLElBQVAsQ0FBQTtBQUNBLFdBQUEsNkNBQUE7MkJBQUE7QUFDRSxRQUFBLElBQUcsS0FBQSxJQUFTLGVBQVo7QUFDRSxpQkFBTyxlQUFnQixDQUFBLEtBQUEsQ0FBdkIsQ0FERjtTQURGO0FBQUEsT0FGa0I7SUFBQSxDQVpwQjtHQVpGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/autocomplete-clang/lib/util.coffee
