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
      return expect(view.element.children[1].children[1].innerText).toBe('Python');
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvc3BlYy9jb21tYW5kLWluZm8tcHJvZmlsZS1wYW5lLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGVBQUE7O0FBQUEsRUFBQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSx1Q0FBUixDQUFsQixDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLDJCQUFULEVBQXNDLFNBQUEsR0FBQTtBQUNwQyxRQUFBLGFBQUE7QUFBQSxJQUFBLElBQUEsR0FBTyxJQUFQLENBQUE7QUFBQSxJQUNBLE9BQUEsR0FBVSxJQURWLENBQUE7QUFBQSxJQUdBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLE9BQUEsR0FDRTtBQUFBLFFBQUEsT0FBQSxFQUFTLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFqQztBQUFBLFFBQ0EsT0FBQSxFQUFTLFFBRFQ7QUFBQSxRQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsUUFHQSxPQUFBLEVBQVMsV0FIVDtBQUFBLFFBSUEsRUFBQSxFQUFJLEdBSko7QUFBQSxRQUtBLEtBQUEsRUFBTyxLQUxQO0FBQUEsUUFNQSxTQUFBLEVBQVcsSUFOWDtBQUFBLFFBT0EsUUFBQSxFQUFVLElBUFY7QUFBQSxRQVFBLE1BQUEsRUFDRTtBQUFBLFVBQUEsWUFBQSxFQUFjLElBQWQ7QUFBQSxVQUNBLFdBQUEsRUFBYSxPQURiO1NBVEY7QUFBQSxRQVdBLE1BQUEsRUFDRTtBQUFBLFVBQUEsWUFBQSxFQUFjLElBQWQ7QUFBQSxVQUNBLE9BQUEsRUFBUyxRQURUO1NBWkY7QUFBQSxRQWNBLE1BQUEsRUFDRTtBQUFBLFVBQUEsT0FBQSxFQUNFO0FBQUEsWUFBQSxhQUFBLEVBQWUsSUFBZjtXQURGO1NBZkY7T0FERixDQUFBO2FBbUJBLElBQUEsR0FBVyxJQUFBLGVBQUEsQ0FBZ0IsT0FBaEIsRUFwQkY7SUFBQSxDQUFYLENBSEEsQ0FBQTtBQUFBLElBeUJBLEVBQUEsQ0FBRyxnQkFBSCxFQUFxQixTQUFBLEdBQUE7YUFDbkIsTUFBQSxDQUFPLElBQUksQ0FBQyxPQUFaLENBQW9CLENBQUMsV0FBckIsQ0FBQSxFQURtQjtJQUFBLENBQXJCLENBekJBLENBQUE7V0E0QkEsRUFBQSxDQUFHLGdCQUFILEVBQXFCLFNBQUEsR0FBQTtBQUNuQixNQUFBLE1BQUEsQ0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxRQUFTLENBQUEsQ0FBQSxDQUFFLENBQUMsU0FBNUMsQ0FBc0QsQ0FBQyxJQUF2RCxDQUE0RCwwQ0FBNUQsQ0FBQSxDQUFBO2FBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUyxDQUFBLENBQUEsQ0FBRSxDQUFDLFFBQVMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxTQUE1QyxDQUFzRCxDQUFDLElBQXZELENBQTRELFFBQTVELEVBRm1CO0lBQUEsQ0FBckIsRUE3Qm9DO0VBQUEsQ0FBdEMsQ0FGQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/build-tools/spec/command-info-profile-pane-spec.coffee
