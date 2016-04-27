
/**
 * PHP files namespace management
 */

(function() {
  module.exports = {

    /**
     * Add the good namespace to the given file
     * @param {TextEditor} editor
     */
    createNamespace: function(editor) {
      var autoload, autoloaders, composer, directory, element, elements, index, line, lines, name, namespace, path, proxy, psr, src, text, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
      proxy = require('./php-proxy.coffee');
      composer = proxy.composer();
      autoloaders = [];
      if (!composer) {
        return;
      }
      _ref = composer.autoload;
      for (psr in _ref) {
        autoload = _ref[psr];
        for (namespace in autoload) {
          src = autoload[namespace];
          if (namespace.endsWith("\\")) {
            namespace = namespace.substr(0, namespace.length - 1);
          }
          autoloaders[src] = namespace;
        }
      }
      path = editor.getPath();
      _ref1 = atom.project.getDirectories();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        directory = _ref1[_i];
        if (path.indexOf(directory.path) === 0) {
          path = path.substr(directory.path.length + 1);
          break;
        }
      }
      path = path.replace(/\\/g, '/');
      namespace = null;
      for (src in autoloaders) {
        name = autoloaders[src];
        if (path.indexOf(src) === 0) {
          path = path.substr(src.length);
          namespace = name;
          break;
        }
      }
      if (namespace === null) {
        return;
      }
      if (path.indexOf("/") === 0) {
        path = path.substr(1);
      }
      elements = path.split('/');
      index = 1;
      for (_j = 0, _len1 = elements.length; _j < _len1; _j++) {
        element = elements[_j];
        if (element === "" || index === elements.length) {
          continue;
        }
        namespace = namespace === "" ? element : namespace + "\\" + element;
        index++;
      }
      text = editor.getText();
      index = 0;
      lines = text.split('\n');
      for (_k = 0, _len2 = lines.length; _k < _len2; _k++) {
        line = lines[_k];
        line = line.trim();
        if (line.indexOf('namespace ') === 0) {
          editor.setTextInBufferRange([[index, 0], [index + 1, 0]], "namespace " + namespace + ";\n");
          return;
        } else if (line.trim() !== "" && line.trim().indexOf("<?") !== 0) {
          editor.setTextInBufferRange([[index, 0], [index, 0]], "namespace " + namespace + ";\n\n");
          return;
        }
        index += 1;
      }
      return editor.setTextInBufferRange([[2, 0], [2, 0]], "namespace " + namespace + ";\n\n");
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1hdXRvY29tcGxldGUtcGhwL2xpYi9zZXJ2aWNlcy9uYW1lc3BhY2UuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7R0FBQTtBQUFBO0FBQUE7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBRUk7QUFBQTtBQUFBOzs7T0FBQTtBQUFBLElBSUEsZUFBQSxFQUFpQixTQUFDLE1BQUQsR0FBQTtBQUNiLFVBQUEsNEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsb0JBQVIsQ0FBUixDQUFBO0FBQUEsTUFFQSxRQUFBLEdBQWMsS0FBSyxDQUFDLFFBQU4sQ0FBQSxDQUZkLENBQUE7QUFBQSxNQUdBLFdBQUEsR0FBYyxFQUhkLENBQUE7QUFLQSxNQUFBLElBQUcsQ0FBQSxRQUFIO0FBQ0ksY0FBQSxDQURKO09BTEE7QUFTQTtBQUFBLFdBQUEsV0FBQTs2QkFBQTtBQUNJLGFBQUEscUJBQUE7b0NBQUE7QUFDSSxVQUFBLElBQUcsU0FBUyxDQUFDLFFBQVYsQ0FBbUIsSUFBbkIsQ0FBSDtBQUNJLFlBQUEsU0FBQSxHQUFZLFNBQVMsQ0FBQyxNQUFWLENBQWlCLENBQWpCLEVBQW9CLFNBQVMsQ0FBQyxNQUFWLEdBQWlCLENBQXJDLENBQVosQ0FESjtXQUFBO0FBQUEsVUFHQSxXQUFZLENBQUEsR0FBQSxDQUFaLEdBQW1CLFNBSG5CLENBREo7QUFBQSxTQURKO0FBQUEsT0FUQTtBQUFBLE1BaUJBLElBQUEsR0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBakJQLENBQUE7QUFrQkE7QUFBQSxXQUFBLDRDQUFBOzhCQUFBO0FBQ0ksUUFBQSxJQUFHLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBUyxDQUFDLElBQXZCLENBQUEsS0FBZ0MsQ0FBbkM7QUFDSSxVQUFBLElB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

//# sourceURL=/home/champ/.atom/packages/atom-autocomplete-php/lib/services/namespace.coffee
