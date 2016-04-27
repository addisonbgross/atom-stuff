(function() {
  var Command, CommandModifier, Modifiers;

  CommandModifier = require('../lib/pipeline/command-modifier');

  Modifiers = require('../lib/modifier/modifier');

  Command = require('../lib/provider/command');

  describe('Command Modifier', function() {
    var command, modifier, module;
    command = null;
    module = null;
    modifier = null;
    beforeEach(function() {
      var out;
      command = new Command({
        project: '/home/fabian/.atom/packages/build-tools/spec/fixtures',
        name: 'Test',
        command: 'echo Hello World',
        wd: '.',
        env: {},
        modifier: {
          test: {
            t: 1
          },
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
      out = {
        preSplit: function(command) {
          command.command += '!';
        }
      };
      module = Modifiers.addModule('test', out);
      return modifier = new CommandModifier(command);
    });
    afterEach(function() {
      return module.dispose();
    });
    it('has the correct keys', function() {
      expect(modifier.keys).toEqual(['test', 'shell']);
      expect(modifier.preSplitKeys).toEqual(['test']);
      return expect(modifier.postSplitKeys).toEqual(['shell']);
    });
    return describe('On ::run', function() {
      beforeEach(function() {
        return waitsForPromise(function() {
          return modifier.run();
        });
      });
      return it('returns the new command with splitted args', function() {
        expect(command.command).toBe('bash');
        return expect(command.args).toEqual(['-c', 'echo Hello World!']);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvc3BlYy9jb21tYW5kLW1vZGlmaWVyLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1DQUFBOztBQUFBLEVBQUEsZUFBQSxHQUFrQixPQUFBLENBQVEsa0NBQVIsQ0FBbEIsQ0FBQTs7QUFBQSxFQUNBLFNBQUEsR0FBWSxPQUFBLENBQVEsMEJBQVIsQ0FEWixDQUFBOztBQUFBLEVBRUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSx5QkFBUixDQUZWLENBQUE7O0FBQUEsRUFJQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLFFBQUEseUJBQUE7QUFBQSxJQUFBLE9BQUEsR0FBVSxJQUFWLENBQUE7QUFBQSxJQUNBLE1BQUEsR0FBUyxJQURULENBQUE7QUFBQSxJQUVBLFFBQUEsR0FBVyxJQUZYLENBQUE7QUFBQSxJQUlBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLEdBQUE7QUFBQSxNQUFBLE9BQUEsR0FBYyxJQUFBLE9BQUEsQ0FBUTtBQUFBLFFBQ3BCLE9BQUEsRUFBUyx1REFEVztBQUFBLFFBRXBCLElBQUEsRUFBTSxNQUZjO0FBQUEsUUFHcEIsT0FBQSxFQUFTLGtCQUhXO0FBQUEsUUFJcEIsRUFBQSxFQUFJLEdBSmdCO0FBQUEsUUFLcEIsR0FBQSxFQUFLLEVBTGU7QUFBQSxRQU1wQixRQUFBLEVBQ0U7QUFBQSxVQUFBLElBQUEsRUFBTTtBQUFBLFlBQ0osQ0FBQSxFQUFHLENBREM7V0FBTjtBQUFBLFVBR0EsS0FBQSxFQUNFO0FBQUEsWUFBQSxPQUFBLEVBQVMsU0FBVDtXQUpGO1NBUGtCO0FBQUEsUUFZcEIsTUFBQSxFQUNFO0FBQUEsVUFBQSxZQUFBLEVBQWMsSUFBZDtTQWJrQjtBQUFBLFFBY3BCLE1BQUEsRUFDRTtBQUFBLFVBQUEsWUFBQSxFQUFjLElBQWQ7U0Fma0I7QUFBQSxRQWdCcEIsTUFBQSxFQUNFO0FBQUEsVUFBQSxPQUFBLEVBQ0U7QUFBQSxZQUFBLGFBQUEsRUFBZSxLQUFmO1dBREY7U0FqQmtCO0FBQUEsUUFtQnBCLE9BQUEsRUFBUyxDQW5CVztPQUFSLENBQWQsQ0FBQTtBQUFBLE1BcUJBLEdBQUEsR0FBTTtBQUFBLFFBQ0osUUFBQSxFQUFVLFNBQUMsT0FBRCxHQUFBO0FBQ1IsVUFBQSxPQUFPLENBQUMsT0FBUixJQUFtQixHQUFuQixDQURRO1FBQUEsQ0FETjtPQXJCTixDQUFBO0FBQUEsTUEwQkEsTUFBQSxHQUFTLFNBQVMsQ0FBQyxTQUFWLENBQW9CLE1BQXBCLEVBQTRCLEdBQTVCLENBMUJULENBQUE7YUEyQkEsUUFBQSxHQUFlLElBQUEsZUFBQSxDQUFnQixPQUFoQixFQTVCTjtJQUFBLENBQVgsQ0FKQSxDQUFBO0FBQUEsSUFrQ0EsU0FBQSxDQUFVLFNBQUEsR0FBQTthQUNSLE1BQU0sQ0FBQyxPQUFQLENBQUEsRUFEUTtJQUFBLENBQVYsQ0FsQ0EsQ0FBQTtBQUFBLElBcUNBLEVBQUEsQ0FBRyxzQkFBSCxFQUEyQixTQUFBLEdBQUE7QUFDekIsTUFBQSxNQUFBLENBQU8sUUFBUSxDQUFDLElBQWhCLENBQXFCLENBQUMsT0FBdEIsQ0FBOEIsQ0FBQyxNQUFELEVBQVMsT0FBVCxDQUE5QixDQUFBLENBQUE7QUFBQSxNQUNBLE1BQUEsQ0FBTyxRQUFRLENBQUMsWUFBaEIsQ0FBNkIsQ0FBQyxPQUE5QixDQUFzQyxDQUFDLE1BQUQsQ0FBdEMsQ0FEQSxDQUFBO2FBRUEsTUFBQSxDQUFPLFFBQVEsQ0FBQyxhQUFoQixDQUE4QixDQUFDLE9BQS9CLENBQXVDLENBQUMsT0FBRCxDQUF2QyxFQUh5QjtJQUFBLENBQTNCLENBckNBLENBQUE7V0EwQ0EsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQSxHQUFBO0FBRW5CLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtlQUNULGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUFHLFFBQVEsQ0FBQyxHQUFULENBQUEsRUFBSDtRQUFBLENBQWhCLEVBRFM7TUFBQSxDQUFYLENBQUEsQ0FBQTthQUdBLEVBQUEsQ0FBRyw0Q0FBSCxFQUFpRCxTQUFBLEdBQUE7QUFDL0MsUUFBQSxNQUFBLENBQU8sT0FBTyxDQUFDLE9BQWYsQ0FBdUIsQ0FBQyxJQUF4QixDQUE2QixNQUE3QixDQUFBLENBQUE7ZUFDQSxNQUFBLENBQU8sT0FBTyxDQUFDLElBQWYsQ0FBb0IsQ0FBQyxPQUFyQixDQUE2QixDQUFDLElBQUQsRUFBTyxtQkFBUCxDQUE3QixFQUYrQztNQUFBLENBQWpELEVBTG1CO0lBQUEsQ0FBckIsRUEzQzJCO0VBQUEsQ0FBN0IsQ0FKQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/build-tools/spec/command-modifier-spec.coffee
