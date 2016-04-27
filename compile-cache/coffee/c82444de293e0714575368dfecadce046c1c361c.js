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
      var k, keys, value, values, _i, _len, _ref, _ref1, _ref2;
      this.element = document.createElement('div');
      this.element.classList.add('module');
      keys = document.createElement('div');
      keys.innerHTML = '<div class="text-padded">stdout highlighting:</div>\n<div class="text-padded">stderr highlighting:</div>';
      values = document.createElement('div');
      _ref = ['stdout', 'stderr'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        k = _ref[_i];
        value = document.createElement('div');
        value.classList.add('text-padded');
        if (command[k].highlighting === 'hc') {
          value.innerText = String((_ref1 = profiles[command[k].profile]) != null ? _ref1.profile_name : void 0);
        } else if (command[k].highlighting === 'hr') {
          value.innerText = command[k].regex;
        } else if (command[k].highlighting === 'nh') {
          value.innerText = "No highlighting - " + ansi_translation[(_ref2 = command[k].ansi_option) != null ? _ref2 : 'ignore'];
        } else {
          value.innerText = highlight_translation[command[k].highlighting];
        }
        values.appendChild(value);
      }
      this.element.appendChild(keys);
      this.element.appendChild(values);
    }

    return ProfileInfoPane;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3ZpZXcvY29tbWFuZC1pbmZvLXByb2ZpbGUtcGFuZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0VBQUE7O0FBQUEsRUFBQSxxQkFBQSxHQUNFO0FBQUEsSUFBQSxJQUFBLEVBQU0saUJBQU47QUFBQSxJQUNBLElBQUEsRUFBTSxlQUROO0FBQUEsSUFFQSxJQUFBLEVBQU0sZ0JBRk47R0FERixDQUFBOztBQUFBLEVBS0EsZ0JBQUEsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLHlCQUFWO0FBQUEsSUFDQSxRQUFBLEVBQVUseUJBRFY7QUFBQSxJQUVBLE9BQUEsRUFBUyx3QkFGVDtHQU5GLENBQUE7O0FBQUEsRUFVQyxXQUFZLE9BQUEsQ0FBUSxzQkFBUixFQUFaLFFBVkQsQ0FBQTs7QUFBQSxFQVlBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFFUyxJQUFBLHlCQUFDLE9BQUQsR0FBQTtBQUNYLFVBQUEsb0RBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QixRQUF2QixDQURBLENBQUE7QUFBQSxNQUVBLElBQUEsR0FBTyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUZQLENBQUE7QUFBQSxNQUdBLElBQUksQ0FBQyxTQUFMLEdBQWlCLDBHQUhqQixDQUFBO0FBQUEsTUFPQSxNQUFBLEdBQVMsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FQVCxDQUFBO0FBUUE7QUFBQSxXQUFBLDJDQUFBO3FCQUFBO0FBQ0UsUUFBQSxLQUFBLEdBQVEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBUixDQUFBO0FBQUEsUUFDQSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQWhCLENBQW9CLGFBQXBCLENBREEsQ0FBQTtBQUVBLFFBQUEsSUFBRyxPQUFRLENBQUEsQ0FBQSxDQUFFLENBQUMsWUFBWCxLQUEyQixJQUE5QjtBQUNFLFVBQUEsS0FBSyxDQUFDLFNBQU4sR0FBa0IsTUFBQSx1REFBbUMsQ0FBRSxxQkFBckMsQ0FBbEIsQ0FERjtTQUFBLE1BRUssSUFBRyxPQUFRLENBQUEsQ0FBQSxDQUFFLENBQUMsWUFBWCxLQUEyQixJQUE5QjtBQUNILFVBQUEsS0FBSyxDQUFDLFNBQU4sR0FBa0IsT0FBUSxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQTdCLENBREc7U0FBQSxNQUVBLElBQUcsT0FBUSxDQUFBLENBQUEsQ0FBRSxDQUFDLFlBQVgsS0FBMkIsSUFBOUI7QUFDSCxVQUFBLEtBQUssQ0FBQyxTQUFOLEdBQW1CLG9CQUFBLEdBQW9CLGdCQUFpQixvREFBeUIsUUFBekIsQ0FBeEQsQ0FERztTQUFBLE1BQUE7QUFHSCxVQUFBLEtBQUssQ0FBQyxTQUFOLEdBQWtCLHFCQUFzQixDQUFBLE9BQVEsQ0FBQSxDQUFBLENBQUUsQ0FBQyxZQUFYLENBQXhDLENBSEc7U0FOTDtBQUFBLFFBVUEsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsS0FBbkIsQ0FWQSxDQURGO0FBQUEsT0FSQTtBQUFBLE1Bb0JBLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFxQixJQUFyQixDQXBCQSxDQUFBO0FBQUEsTUFxQkEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxXQUFULENBQXFCLE1BQXJCLENBckJBLENBRFc7SUFBQSxDQUFiOzsyQkFBQTs7TUFmSixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/view/command-info-profile-pane.coffee
