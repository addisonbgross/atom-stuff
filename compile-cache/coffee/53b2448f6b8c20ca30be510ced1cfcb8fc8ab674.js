(function() {
  module.exports = {
    apply: function() {
      var root, setFontSize, setLayoutMode;
      root = document.documentElement;
      setFontSize = function(currentFontSize) {
        if (Number.isInteger(currentFontSize)) {
          return root.style.fontSize = currentFontSize + 'px';
        } else if (currentFontSize === 'Auto') {
          return root.style.fontSize = '';
        }
      };
      atom.config.onDidChange('slim-dark-ui.fontSize', function() {
        return setFontSize(atom.config.get('slim-dark-ui.fontSize'));
      });
      setFontSize(atom.config.get('slim-dark-ui.fontSize'));
      setLayoutMode = function(layoutMode) {
        return root.setAttribute('theme-slim-dark-ui-layoutmode', layoutMode.toLowerCase());
      };
      atom.config.onDidChange('slim-dark-ui.layoutMode', function() {
        return setLayoutMode(atom.config.get('slim-dark-ui.layoutMode'));
      });
      return setLayoutMode(atom.config.get('slim-dark-ui.layoutMode'));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvc2xpbS1kYXJrLXVpL2xpYi9jb25maWcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBRUU7QUFBQSxJQUFBLEtBQUEsRUFBTyxTQUFBLEdBQUE7QUFFTCxVQUFBLGdDQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sUUFBUSxDQUFDLGVBQWhCLENBQUE7QUFBQSxNQUlBLFdBQUEsR0FBYyxTQUFDLGVBQUQsR0FBQTtBQUNaLFFBQUEsSUFBRyxNQUFNLENBQUMsU0FBUCxDQUFpQixlQUFqQixDQUFIO2lCQUNFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBWCxHQUFzQixlQUFBLEdBQWtCLEtBRDFDO1NBQUEsTUFFSyxJQUFHLGVBQUEsS0FBbUIsTUFBdEI7aUJBQ0gsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFYLEdBQXNCLEdBRG5CO1NBSE87TUFBQSxDQUpkLENBQUE7QUFBQSxNQVVBLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBWixDQUF3Qix1QkFBeEIsRUFBaUQsU0FBQSxHQUFBO2VBQy9DLFdBQUEsQ0FBWSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUJBQWhCLENBQVosRUFEK0M7TUFBQSxDQUFqRCxDQVZBLENBQUE7QUFBQSxNQWFBLFdBQUEsQ0FBWSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUJBQWhCLENBQVosQ0FiQSxDQUFBO0FBQUEsTUFpQkEsYUFBQSxHQUFnQixTQUFDLFVBQUQsR0FBQTtlQUNkLElBQUksQ0FBQyxZQUFMLENBQWtCLCtCQUFsQixFQUFtRCxVQUFVLENBQUMsV0FBWCxDQUFBLENBQW5ELEVBRGM7TUFBQSxDQWpCaEIsQ0FBQTtBQUFBLE1Bb0JBLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBWixDQUF3Qix5QkFBeEIsRUFBbUQsU0FBQSxHQUFBO2VBQ2pELGFBQUEsQ0FBYyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IseUJBQWhCLENBQWQsRUFEaUQ7TUFBQSxDQUFuRCxDQXBCQSxDQUFBO2FBdUJBLGFBQUEsQ0FBYyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IseUJBQWhCLENBQWQsRUF6Qks7SUFBQSxDQUFQO0dBRkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/slim-dark-ui/lib/config.coffee
