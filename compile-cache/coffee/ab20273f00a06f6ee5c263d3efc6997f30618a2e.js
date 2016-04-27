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
    describe('on ::getSpawnInfo', function() {
      return it('correctly splits the command', function() {
        command.getSpawnInfo();
        expect(command.command).toBe('echo');
        return expect(command.args).toEqual(['Hello ', 'World']);
      });
    });
    return it('automatically migrates to v2', function() {
      expect(command.stdout.pipeline).toEqual([]);
      expect(command.stderr.pipeline).toEqual([]);
      return expect(command.environment).toEqual({
        name: 'child_process',
        config: {
          stdoe: 'both'
        }
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvc3BlYy9jb21tYW5kLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLE9BQUE7O0FBQUEsRUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLHlCQUFSLENBQVYsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyxTQUFULEVBQW9CLFNBQUEsR0FBQTtBQUNsQixRQUFBLGlCQUFBO0FBQUEsSUFBQSxRQUFBLEdBQVcsSUFBWCxDQUFBO0FBQUEsSUFDQSxPQUFBLEdBQVUsSUFEVixDQUFBO0FBQUEsSUFHQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxRQUFBLEdBQVc7QUFBQSxRQUNULE9BQUEsRUFBUyx1REFEQTtBQUFBLFFBRVQsSUFBQSxFQUFNLE1BRkc7QUFBQSxRQUdULE9BQUEsRUFBUyxxQkFIQTtBQUFBLFFBSVQsRUFBQSxFQUFJLEdBSks7QUFBQSxRQUtULFFBQUEsRUFDRTtBQUFBLFVBQUEsUUFBQSxFQUFVLEVBQVY7QUFBQSxVQUNBLEtBQUEsRUFBTyxFQURQO0FBQUEsVUFFQSxTQUFBLEVBQVcsRUFGWDtTQU5PO0FBQUEsUUFTVCxNQUFBLEVBQ0U7QUFBQSxVQUFBLFlBQUEsRUFBYyxJQUFkO1NBVk87QUFBQSxRQVdULE1BQUEsRUFDRTtBQUFBLFVBQUEsWUFBQSxFQUFjLElBQWQ7U0FaTztBQUFBLFFBYVQsTUFBQSxFQUNFO0FBQUEsVUFBQSxPQUFBLEVBQ0U7QUFBQSxZQUFBLGFBQUEsRUFBZSxLQUFmO1dBREY7U0FkTztBQUFBLFFBZ0JULE9BQUEsRUFBUyxDQWhCQTtPQUFYLENBQUE7YUFrQkEsT0FBQSxHQUFjLElBQUEsT0FBQSxDQUFRLFFBQVIsRUFuQkw7SUFBQSxDQUFYLENBSEEsQ0FBQTtBQUFBLElBd0JBLEVBQUEsQ0FBRyxpQkFBSCxFQUFzQixTQUFBLEdBQUE7YUFDcEIsTUFBQSxDQUFPLE9BQU8sQ0FBQyxHQUFmLENBQW1CLENBQUMsV0FBcEIsQ0FBQSxFQURvQjtJQUFBLENBQXRCLENBeEJBLENBQUE7QUFBQSxJQTJCQSxRQUFBLENBQVMsbUJBQVQsRUFBOEIsU0FBQSxHQUFBO2FBQzVCLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBLEdBQUE7QUFDakMsUUFBQSxPQUFPLENBQUMsWUFBUixDQUFBLENBQUEsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxDQUFPLE9BQU8sQ0FBQyxPQUFmLENBQXVCLENBQUMsSUFBeEIsQ0FBNkIsTUFBN0IsQ0FEQSxDQUFBO2VBRUEsTUFBQSxDQUFPLE9BQU8sQ0FBQyxJQUFmLENBQW9CLENBQUMsT0FBckIsQ0FBNkIsQ0FBQyxRQUFELEVBQVcsT0FBWCxDQUE3QixFQUhpQztNQUFBLENBQW5DLEVBRDRCO0lBQUEsQ0FBOUIsQ0EzQkEsQ0FBQTtXQWlDQSxFQUFBLENBQUcsOEJBQUgsRUFBbUMsU0FBQSxHQUFBO0FBQ2pDLE1BQUEsTUFBQSxDQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBdEIsQ0FBK0IsQ0FBQyxPQUFoQyxDQUF3QyxFQUF4QyxDQUFBLENBQUE7QUFBQSxNQUNBLE1BQUEsQ0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQXRCLENBQStCLENBQUMsT0FBaEMsQ0FBd0MsRUFBeEMsQ0FEQSxDQUFBO2FBRUEsTUFBQSxDQUFPLE9BQU8sQ0FBQyxXQUFmLENBQTJCLENBQUMsT0FBNUIsQ0FBb0M7QUFBQSxRQUFBLElBQUEsRUFBTSxlQUFOO0FBQUEsUUFBdUIsTUFBQSxFQUFRO0FBQUEsVUFBQSxLQUFBLEVBQU8sTUFBUDtTQUEvQjtPQUFwQyxFQUhpQztJQUFBLENBQW5DLEVBbENrQjtFQUFBLENBQXBCLENBRkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/build-tools/spec/command-spec.coffee
