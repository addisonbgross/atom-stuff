(function() {
  var ProfileInfoPane, ansi_translation, highlight_translation, profiles;

  highlight_translation = {
    'nh': 'No highlighting',
    'ha': 'Highlight all',
    'ht': 'Highlight tags'
  };

  ansi_translation = {
    'ignore': 'Ignore ANSI Color Codes',
    'remove': 'Remove ANSI Color Codes',
    'parse': 'Parse ANSI Color Codes'
  };

  profiles = require('../profiles/profiles').profiles;

  module.exports = ProfileInfoPane = (function() {
    function ProfileInfoPane(command) {
      var k, keys, value, values, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4;
      this.element = document.createElement('div');
      this.element.classList.add('module');
      keys = document.createElement('div');
      keys.innerHTML = '<div class="text-padded">stdout highlighting:</div>\n<div class="text-padded">stderr highlighting:</div>';
      values = document.createElement('div');
      if (command.stdout.pty) {
        value = document.createElement('div');
        value.classList.add('text-padded');
        if (command['stdout'].highlighting === 'hc') {
          value.innerText = String((_ref = profiles[command['stdout'].profile]) != null ? _ref.profile_name : void 0);
        } else if (command['stdout'].highlighting === 'hr') {
          value.innerText = command['stdout'].regex;
        } else if (command['stdout'].highlighting === 'nh') {
          value.innerText = "No highlighting - " + ansi_translation[(_ref1 = command['stdout'].ansi_option) != null ? _ref1 : 'ignore'];
        } else {
          value.innerText = highlight_translation[command['stdout'].highlighting];
        }
        values.appendChild(value);
        value = document.createElement('div');
        value.classList.add('text-padded');
        value.innerText = 'Disabled (pty enabled)';
        values.appendChild(value);
      } else {
        _ref2 = ['stdout', 'stderr'];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          k = _ref2[_i];
          value = document.createElement('div');
          value.classList.add('text-padded');
          if (command[k].highlighting === 'hc') {
            value.innerText = String((_ref3 = profiles[command[k].profile]) != null ? _ref3.profile_name : void 0);
          } else if (command[k].highlighting === 'hr') {
            value.innerText = command[k].regex;
          } else if (command[k].highlighting === 'nh') {
            value.innerText = "No highlighting - " + ansi_translation[(_ref4 = command[k].ansi_option) != null ? _ref4 : 'ignore'];
          } else {
            value.innerText = highlight_translation[command[k].highlighting];
          }
          values.appendChild(value);
        }
      }
      this.element.appendChild(keys);
      this.element.appendChild(values);
    }

    return ProfileInfoPane;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3ZpZXcvY29tbWFuZC1pbmZvLXByb2ZpbGUtcGFuZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0VBQUE7O0FBQUEsRUFBQSxxQkFBQSxHQUNFO0FBQUEsSUFBQSxJQUFBLEVBQU0saUJBQU47QUFBQSxJQUNBLElBQUEsRUFBTSxlQUROO0FBQUEsSUFFQSxJQUFBLEVBQU0sZ0JBRk47R0FERixDQUFBOztBQUFBLEVBS0EsZ0JBQUEsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLHlCQUFWO0FBQUEsSUFDQSxRQUFBLEVBQVUseUJBRFY7QUFBQSxJQUVBLE9BQUEsRUFBUyx3QkFGVDtHQU5GLENBQUE7O0FBQUEsRUFVQyxXQUFZLE9BQUEsQ0FBUSxzQkFBUixFQUFaLFFBVkQsQ0FBQTs7QUFBQSxFQVlBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFFUyxJQUFBLHlCQUFDLE9BQUQsR0FBQTtBQUNYLFVBQUEsa0VBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QixRQUF2QixDQURBLENBQUE7QUFBQSxNQUVBLElBQUEsR0FBTyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUZQLENBQUE7QUFBQSxNQUdBLElBQUksQ0FBQyxTQUFMLEdBQWlCLDBHQUhqQixDQUFBO0FBQUEsTUFPQSxNQUFBLEdBQVMsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FQVCxDQUFBO0FBUUEsTUFBQSxJQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBbEI7QUFDRSxRQUFBLEtBQUEsR0FB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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/view/command-info-profile-pane.coffee
