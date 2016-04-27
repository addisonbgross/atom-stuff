(function() {
  var ProfileInfoPane;

  ProfileInfoPane = require('../lib/view/command-info-profile-pane');

  describe('Command Info Profile Pane', function() {
    var command, view;
    view = null;
    command = null;
    beforeEach(function() {
      command = {
        project: atom.project.getPaths()[0],
        oldname: 'Test 1',
        name: 'Test 1',
        command: 'echo test',
        wd: '.',
        shell: false,
        wildcards: true,
        save_all: true,
        stdout: {
          pty: true,
          highlighting: 'nh',
          ansi_option: 'parse'
        },
        stderr: {
          highlighting: 'hc',
          profile: 'python'
        },
        output: {
          console: {
            close_success: true
          }
        }
      };
      return view = new ProfileInfoPane(command);
    });
    it('has an element', function() {
      return expect(view.element).toBeDefined();
    });
    return it('has all values', function() {
      expect(view.element.children[1].children[0].innerText).toBe('No highlighting - Parse ANSI Color Codes');
      return expect(view.element.children[1].children[1].innerText).toBe('Disabled (pty enabled)');
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvc3BlYy9jb21tYW5kLWluZm8tcHJvZmlsZS1wYW5lLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGVBQUE7O0FBQUEsRUFBQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSx1Q0FBUixDQUFsQixDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLDJCQUFULEVBQXNDLFNBQUEsR0FBQTtBQUNwQyxRQUFBLGFBQUE7QUFBQSxJQUFBLElBQUEsR0FBTyxJQUFQLENBQUE7QUFBQSxJQUNBLE9BQUEsR0FBVSxJQURWLENBQUE7QUFBQSxJQUdBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLE9BQUEsR0FDRTtBQUFBLFFBQUEsT0FBQSxFQUFTLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFqQztBQUFBLFFBQ0EsT0FBQSxFQUFTLFFBRFQ7QUFBQSxRQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsUUFHQSxPQUFBLEVBQVMsV0FIVDtBQUFBLFFBSUEsRUFBQSxFQUFJLEdBSko7QUFBQSxRQUtBLEtBQUEsRUFBTyxLQUxQO0FBQUEsUUFNQSxTQUFBLEVBQVcsSUFOWDtBQUFBLFFBT0EsUUFBQSxFQUFVLElBUFY7QUFBQSxRQVFBLE1BQUEsRUFDRTtBQUFBLFVBQUEsR0FBQSxFQUFLLElBQUw7QUFBQSxVQUNBLFlBQUEsRUFBYyxJQURkO0FBQUEsVUFFQSxXQUFBLEVBQWEsT0FGYjtTQVRGO0FBQUEsUUFZQSxNQUFBLEVBQ0U7QUFBQSxVQUFBLFlBQUEsRUFBYyxJQUFkO0FBQUEsVUFDQSxPQUFBLEVBQVMsUUFEVDtTQWJGO0FBQUEsUUFlQSxNQUFBLEVBQ0U7QUFBQSxVQUFBLE9BQUEsRUFDRTtBQUFBLFlBQUEsYUFBQSxFQUFlLElBQWY7V0FERjtTQWhCRjtPQURGLENBQUE7YUFvQkEsSUFBQSxHQUFXLElBQUEsZUFBQSxDQUFnQixPQUFoQixFQXJCRjtJQUFBLENBQVgsQ0FIQSxDQUFBO0FBQUEsSUEwQkEsRUFBQSxDQUFHLGdCQUFILEVBQXFCLFNBQUEsR0FBQTthQUNuQixNQUFBLENBQU8sSUFBSSxDQUFDLE9BQVosQ0FBb0IsQ0FBQyxXQUFyQixDQUFBLEVBRG1CO0lBQUEsQ0FBckIsQ0ExQkEsQ0FBQTtXQTZCQSxFQUFBLENBQUcsZ0JBQUgsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLE1BQUEsTUFBQSxDQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUyxDQUFBLENBQUEsQ0FBRSxDQUFDLFFBQVMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxTQUE1QyxDQUFzRCxDQUFDLElBQXZELENBQTRELDBDQUE1RCxDQUFBLENBQUE7YUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFTLENBQUEsQ0FBQSxDQUFFLENBQUMsUUFBUyxDQUFBLENBQUEsQ0FBRSxDQUFDLFNBQTVDLENBQXNELENBQUMsSUFBdkQsQ0FBNEQsd0JBQTVELEVBRm1CO0lBQUEsQ0FBckIsRUE5Qm9DO0VBQUEsQ0FBdEMsQ0FGQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/build-tools/spec/command-info-profile-pane-spec.coffee
