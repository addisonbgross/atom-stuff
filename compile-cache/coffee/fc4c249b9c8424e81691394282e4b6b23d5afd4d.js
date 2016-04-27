(function() {
  var Command;

  Command = require('../lib/provider/command');

  describe('Command', function() {
    var command, _command;
    _command = null;
    command = null;
    beforeEach(function() {
      _command = {
        project: '/home/fabian/.atom/packages/build-tools/spec/fixtures',
        name: 'Test',
        command: 'echo "Hello " World',
        wd: '.',
        modifier: {
          save_all: {},
          shell: {},
          wildcards: {}
        },
        stdout: {
          highlighting: 'nh'
        },
        stderr: {
          highlighting: 'nh'
        },
        output: {
          console: {
            close_success: false
          }
        },
        version: 1
      };
      return command = new Command(_command);
    });
    it('has all objects', function() {
      return expect(command.env).toBeDefined();
    });
    return describe('on ::getSpawnInfo', function() {
      return it('correctly splits the command', function() {
        command.getSpawnInfo();
        expect(command.command).toBe('echo');
        return expect(command.args).toEqual(['Hello ', 'World']);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvc3BlYy9jb21tYW5kLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLE9BQUE7O0FBQUEsRUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLHlCQUFSLENBQVYsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyxTQUFULEVBQW9CLFNBQUEsR0FBQTtBQUNsQixRQUFBLGlCQUFBO0FBQUEsSUFBQSxRQUFBLEdBQVcsSUFBWCxDQUFBO0FBQUEsSUFDQSxPQUFBLEdBQVUsSUFEVixDQUFBO0FBQUEsSUFHQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxRQUFBLEdBQVc7QUFBQSxRQUNULE9BQUEsRUFBUyx1REFEQTtBQUFBLFFBRVQsSUFBQSxFQUFNLE1BRkc7QUFBQSxRQUdULE9BQUEsRUFBUyxxQkFIQTtBQUFBLFFBSVQsRUFBQSxFQUFJLEdBSks7QUFBQSxRQUtULFFBQUEsRUFDRTtBQUFBLFVBQUEsUUFBQSxFQUFVLEVBQVY7QUFBQSxVQUNBLEtBQUEsRUFBTyxFQURQO0FBQUEsVUFFQSxTQUFBLEVBQVcsRUFGWDtTQU5PO0FBQUEsUUFTVCxNQUFBLEVBQ0U7QUFBQSxVQUFBLFlBQUEsRUFBYyxJQUFkO1NBVk87QUFBQSxRQVdULE1BQUEsRUFDRTtBQUFBLFVBQUEsWUFBQSxFQUFjLElBQWQ7U0FaTztBQUFBLFFBYVQsTUFBQSxFQUNFO0FBQUEsVUFBQSxPQUFBLEVBQ0U7QUFBQSxZQUFBLGFBQUEsRUFBZSxLQUFmO1dBREY7U0FkTztBQUFBLFFBZ0JULE9BQUEsRUFBUyxDQWhCQTtPQUFYLENBQUE7YUFrQkEsT0FBQSxHQUFjLElBQUEsT0FBQSxDQUFRLFFBQVIsRUFuQkw7SUFBQSxDQUFYLENBSEEsQ0FBQTtBQUFBLElBd0JBLEVBQUEsQ0FBRyxpQkFBSCxFQUFzQixTQUFBLEdBQUE7YUFDcEIsTUFBQSxDQUFPLE9BQU8sQ0FBQyxHQUFmLENBQW1CLENBQUMsV0FBcEIsQ0FBQSxFQURvQjtJQUFBLENBQXRCLENBeEJBLENBQUE7V0EyQkEsUUFBQSxDQUFTLG1CQUFULEVBQThCLFNBQUEsR0FBQTthQUM1QixFQUFBLENBQUcsOEJBQUgsRUFBbUMsU0FBQSxHQUFBO0FBQ2pDLFFBQUEsT0FBTyxDQUFDLFlBQVIsQ0FBQSxDQUFBLENBQUE7QUFBQSxRQUNBLE1BQUEsQ0FBTyxPQUFPLENBQUMsT0FBZixDQUF1QixDQUFDLElBQXhCLENBQTZCLE1BQTdCLENBREEsQ0FBQTtlQUVBLE1BQUEsQ0FBTyxPQUFPLENBQUMsSUFBZixDQUFvQixDQUFDLE9BQXJCLENBQTZCLENBQUMsUUFBRCxFQUFXLE9BQVgsQ0FBN0IsRUFIaUM7TUFBQSxDQUFuQyxFQUQ0QjtJQUFBLENBQTlCLEVBNUJrQjtFQUFBLENBQXBCLENBRkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/build-tools/spec/command-spec.coffee
