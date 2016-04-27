(function() {
  var SaveAllSaver;

  module.exports = {
    name: 'Save All',
    description: 'Save all modified files before executing the command(s)',
    "private": false,
    edit: SaveAllSaver = (function() {
      function SaveAllSaver() {}

      SaveAllSaver.prototype.get = function(command) {
        command.modifier.save_all = {};
        return null;
      };

      return SaveAllSaver;

    })(),
    "in": function() {
      var editor, _i, _len, _ref;
      _ref = atom.workspace.getTextEditors();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        editor = _ref[_i];
        if (editor.isModified() && (editor.getPath() != null)) {
          editor.save();
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL21vZGlmaWVyL3NhdmVfYWxsLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxZQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsSUFBQSxFQUFNLFVBQU47QUFBQSxJQUNBLFdBQUEsRUFBYSx5REFEYjtBQUFBLElBRUEsU0FBQSxFQUFTLEtBRlQ7QUFBQSxJQUlBLElBQUEsRUFDUTtnQ0FDSjs7QUFBQSw2QkFBQSxHQUFBLEdBQUssU0FBQyxPQUFELEdBQUE7QUFDSCxRQUFBLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBakIsR0FBNEIsRUFBNUIsQ0FBQTtBQUNBLGVBQU8sSUFBUCxDQUZHO01BQUEsQ0FBTCxDQUFBOzswQkFBQTs7UUFOSjtBQUFBLElBVUEsSUFBQSxFQUFJLFNBQUEsR0FBQTtBQUNGLFVBQUEsc0JBQUE7QUFBQTtBQUFBLFdBQUEsMkNBQUE7MEJBQUE7QUFDRSxRQUFBLElBQWlCLE1BQU0sQ0FBQyxVQUFQLENBQUEsQ0FBQSxJQUF3QiwwQkFBekM7QUFBQSxVQUFBLE1BQU0sQ0FBQyxJQUFQLENBQUEsQ0FBQSxDQUFBO1NBREY7QUFBQSxPQURFO0lBQUEsQ0FWSjtHQUZGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/modifier/save_all.coffee
