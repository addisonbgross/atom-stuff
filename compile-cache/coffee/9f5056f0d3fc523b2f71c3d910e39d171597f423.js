(function() {
  var MainInfoPane;

  module.exports = MainInfoPane = (function() {
    function MainInfoPane(command) {
      var k, keys, value, values, _i, _len, _ref;
      this.element = document.createElement('div');
      this.element.classList.add('module');
      keys = document.createElement('div');
      keys.innerHTML = '<div class="text-padded">Command:</div>\n<div class="text-padded">Working Directory:</div>';
      values = document.createElement('div');
      _ref = ['command', 'wd'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        k = _ref[_i];
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = String(command[k]);
        values.appendChild(value);
      }
      this.element.appendChild(keys);
      this.element.appendChild(values);
    }

    return MainInfoPane;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3ZpZXcvY29tbWFuZC1pbmZvLW1haW4tcGFuZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsWUFBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFFUyxJQUFBLHNCQUFDLE9BQUQsR0FBQTtBQUNYLFVBQUEsc0NBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QixRQUF2QixDQURBLENBQUE7QUFBQSxNQUVBLElBQUEsR0FBTyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUZQLENBQUE7QUFBQSxNQUdBLElBQUksQ0FBQyxTQUFMLEdBQWlCLDRGQUhqQixDQUFBO0FBQUEsTUFPQSxNQUFBLEdBQVMsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FQVCxDQUFBO0FBUUE7QUFBQSxXQUFBLDJDQUFBO3FCQUFBO0FBQ0UsUUFBQSxLQUFBLEdBQVEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBUixDQUFBO0FBQUEsUUFDQSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQWhCLENBQW9CLGFBQXBCLENBREEsQ0FBQTtBQUFBLFFBRUEsS0FBSyxDQUFDLFNBQU4sR0FBa0IsTUFBQSxDQUFPLE9BQVEsQ0FBQSxDQUFBLENBQWYsQ0FGbEIsQ0FBQTtBQUFBLFFBR0EsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsS0FBbkIsQ0FIQSxDQURGO0FBQUEsT0FSQTtBQUFBLE1BYUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxXQUFULENBQXFCLElBQXJCLENBYkEsQ0FBQTtBQUFBLE1BY0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxXQUFULENBQXFCLE1BQXJCLENBZEEsQ0FEVztJQUFBLENBQWI7O3dCQUFBOztNQUhKLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/view/command-info-main-pane.coffee
