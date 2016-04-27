(function() {
  var HighlightColumn, HighlightColumnElement;

  HighlightColumnElement = require('./highlight-column-element');

  module.exports = HighlightColumn = {
    config: {
      opacity: {
        type: 'number',
        "default": 0.15,
        minimum: 0,
        maximum: 1
      },
      enabled: {
        type: 'boolean',
        "default": true
      },
      lineMode: {
        type: 'boolean',
        "default": false
      }
    },
    activate: function() {
      atom.commands.add('atom-workspace', 'highlight-column:toggle', (function(_this) {
        return function() {
          return atom.config.set('highlight-column.enabled', !atom.config.get('highlight-column.enabled'));
        };
      })(this));
      return atom.workspace.observeTextEditors(function(editor) {
        return editor.observeCursors((function(_this) {
          return function(cursor) {
            var editorElement, highlightColumnElement;
            editorElement = atom.views.getView(editor);
            return highlightColumnElement = new HighlightColumnElement().initialize(editor, editorElement, cursor);
          };
        })(this));
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvaGlnaGxpZ2h0LWNvbHVtbi9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUNBQUE7O0FBQUEsRUFBQSxzQkFBQSxHQUF5QixPQUFBLENBQVEsNEJBQVIsQ0FBekIsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGVBQUEsR0FDZjtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxPQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLFFBRUEsT0FBQSxFQUFTLENBRlQ7QUFBQSxRQUdBLE9BQUEsRUFBUyxDQUhUO09BREY7QUFBQSxNQUtBLE9BQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BTkY7QUFBQSxNQVFBLFFBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO09BVEY7S0FERjtBQUFBLElBY0EsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyx5QkFBcEMsRUFBK0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDN0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDBCQUFoQixFQUE0QyxDQUFBLElBQUssQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQkFBaEIsQ0FBN0MsRUFENkQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvRCxDQUFBLENBQUE7YUFHQSxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLFNBQUMsTUFBRCxHQUFBO2VBQ2hDLE1BQU0sQ0FBQyxjQUFQLENBQXNCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxNQUFELEdBQUE7QUFDcEIsZ0JBQUEscUNBQUE7QUFBQSxZQUFBLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CLENBQWhCLENBQUE7bUJBQ0Esc0JBQUEsR0FBNkIsSUFBQSxzQkFBQSxDQUFBLENBQXdCLENBQUMsVUFBekIsQ0FBb0MsTUFBcEMsRUFBNEMsYUFBNUMsRUFBMkQsTUFBM0QsRUFGVDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRCLEVBRGdDO01BQUEsQ0FBbEMsRUFKUTtJQUFBLENBZFY7R0FIRixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/highlight-column/lib/main.coffee
