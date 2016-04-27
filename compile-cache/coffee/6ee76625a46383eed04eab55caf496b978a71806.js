(function() {
  var Command, Shell;

  Shell = require('../lib/modifier/shell');

  Command = require('../lib/provider/command');

  describe('Command Modifier - Shell', function() {
    var command;
    command = null;
    beforeEach(function() {
      command = new Command({
        project: '/home/fabian/.atom/packages/build-tools/spec/fixtures',
        name: 'Test',
        command: 'echo Hello World',
        wd: '.',
        env: {},
        modifier: {
          shell: {
            command: 'bash -c'
          }
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
      });
      command.getSpawnInfo();
      return Shell.postSplit(command);
    });
    return it('returns valid data', function() {
      expect(command.command).toBe('bash');
      return expect(command.args).toEqual(['-c', 'echo Hello World']);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvc3BlYy9tb2RpZmllci1zaGVsbC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxjQUFBOztBQUFBLEVBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSx1QkFBUixDQUFSLENBQUE7O0FBQUEsRUFDQSxPQUFBLEdBQVUsT0FBQSxDQUFRLHlCQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsQ0FBUywwQkFBVCxFQUFxQyxTQUFBLEdBQUE7QUFDbkMsUUFBQSxPQUFBO0FBQUEsSUFBQSxPQUFBLEdBQVUsSUFBVixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxPQUFBLEdBQWMsSUFBQSxPQUFBLENBQVE7QUFBQSxRQUNwQixPQUFBLEVBQVMsdURBRFc7QUFBQSxRQUVwQixJQUFBLEVBQU0sTUFGYztBQUFBLFFBR3BCLE9BQUEsRUFBUyxrQkFIVztBQUFBLFFBSXBCLEVBQUEsRUFBSSxHQUpnQjtBQUFBLFFBS3BCLEdBQUEsRUFBSyxFQUxlO0FBQUEsUUFNcEIsUUFBQSxFQUNFO0FBQUEsVUFBQSxLQUFBLEVBQ0U7QUFBQSxZQUFBLE9BQUEsRUFBUyxTQUFUO1dBREY7U0FQa0I7QUFBQSxRQVNwQixNQUFBLEVBQ0U7QUFBQSxVQUFBLFlBQUEsRUFBYyxJQUFkO1NBVmtCO0FBQUEsUUFXcEIsTUFBQSxFQUNFO0FBQUEsVUFBQSxZQUFBLEVBQWMsSUFBZDtTQVprQjtBQUFBLFFBYXBCLE1BQUEsRUFDRTtBQUFBLFVBQUEsT0FBQSxFQUNFO0FBQUEsWUFBQSxhQUFBLEVBQWUsS0FBZjtXQURGO1NBZGtCO0FBQUEsUUFnQnBCLE9BQUEsRUFBUyxDQWhCVztPQUFSLENBQWQsQ0FBQTtBQUFBLE1Ba0JBLE9BQU8sQ0FBQyxZQUFSLENBQUEsQ0FsQkEsQ0FBQTthQW1CQSxLQUFLLENBQUMsU0FBTixDQUFnQixPQUFoQixFQXBCUztJQUFBLENBQVgsQ0FGQSxDQUFBO1dBd0JBLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBLEdBQUE7QUFDdkIsTUFBQSxNQUFBLENBQU8sT0FBTyxDQUFDLE9BQWYsQ0FBdUIsQ0FBQyxJQUF4QixDQUE2QixNQUE3QixDQUFBLENBQUE7YUFDQSxNQUFBLENBQU8sT0FBTyxDQUFDLElBQWYsQ0FBb0IsQ0FBQyxPQUFyQixDQUE2QixDQUFDLElBQUQsRUFBTyxrQkFBUCxDQUE3QixFQUZ1QjtJQUFBLENBQXpCLEVBekJtQztFQUFBLENBQXJDLENBSEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/build-tools/spec/modifier-shell-spec.coffee
