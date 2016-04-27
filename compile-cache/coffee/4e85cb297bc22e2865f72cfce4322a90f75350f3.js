(function() {
  var Command, Env;

  Env = require('../lib/modifier/env');

  Command = require('../lib/provider/command');

  describe('Command Modifier - Environment Variables', function() {
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
          env: {
            TEST1: 'Hello',
            PWD: '/'
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
      return Env.preSplit(command);
    });
    return it('returns valid data', function() {
      expect(command.env['TEST1']).toBe('Hello');
      return expect(command.env['PWD']).toBe('/');
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvc3BlYy9tb2RpZmllci1lbnYtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsWUFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEscUJBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSx5QkFBUixDQURWLENBQUE7O0FBQUEsRUFHQSxRQUFBLENBQVMsMENBQVQsRUFBcUQsU0FBQSxHQUFBO0FBQ25ELFFBQUEsT0FBQTtBQUFBLElBQUEsT0FBQSxHQUFVLElBQVYsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsT0FBQSxHQUFjLElBQUEsT0FBQSxDQUFRO0FBQUEsUUFDcEIsT0FBQSxFQUFTLHVEQURXO0FBQUEsUUFFcEIsSUFBQSxFQUFNLE1BRmM7QUFBQSxRQUdwQixPQUFBLEVBQVMsa0JBSFc7QUFBQSxRQUlwQixFQUFBLEVBQUksR0FKZ0I7QUFBQSxRQUtwQixHQUFBLEVBQUssRUFMZTtBQUFBLFFBTXBCLFFBQUEsRUFDRTtBQUFBLFVBQUEsR0FBQSxFQUNFO0FBQUEsWUFBQSxLQUFBLEVBQU8sT0FBUDtBQUFBLFlBQ0EsR0FBQSxFQUFLLEdBREw7V0FERjtTQVBrQjtBQUFBLFFBVXBCLE1BQUEsRUFDRTtBQUFBLFVBQUEsWUFBQSxFQUFjLElBQWQ7U0FYa0I7QUFBQSxRQVlwQixNQUFBLEVBQ0U7QUFBQSxVQUFBLFlBQUEsRUFBYyxJQUFkO1NBYmtCO0FBQUEsUUFjcEIsTUFBQSxFQUNFO0FBQUEsVUFBQSxPQUFBLEVBQ0U7QUFBQSxZQUFBLGFBQUEsRUFBZSxLQUFmO1dBREY7U0Fma0I7QUFBQSxRQWlCcEIsT0FBQSxFQUFTLENBakJXO09BQVIsQ0FBZCxDQUFBO0FBQUEsTUFtQkEsT0FBTyxDQUFDLFlBQVIsQ0FBQSxDQW5CQSxDQUFBO2FBb0JBLEdBQUcsQ0FBQyxRQUFKLENBQWEsT0FBYixFQXJCUztJQUFBLENBQVgsQ0FGQSxDQUFBO1dBeUJBLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBLEdBQUE7QUFDdkIsTUFBQSxNQUFBLENBQU8sT0FBTyxDQUFDLEdBQUksQ0FBQSxPQUFBLENBQW5CLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsT0FBbEMsQ0FBQSxDQUFBO2FBQ0EsTUFBQSxDQUFPLE9BQU8sQ0FBQyxHQUFJLENBQUEsS0FBQSxDQUFuQixDQUEwQixDQUFDLElBQTNCLENBQWdDLEdBQWhDLEVBRnVCO0lBQUEsQ0FBekIsRUExQm1EO0VBQUEsQ0FBckQsQ0FIQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/build-tools/spec/modifier-env-spec.coffee
