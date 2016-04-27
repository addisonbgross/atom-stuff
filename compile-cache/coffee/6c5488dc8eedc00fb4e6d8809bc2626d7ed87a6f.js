(function() {
  var Command, Wildcards, path;

  Wildcards = require('../lib/modifier/wildcards');

  Command = require('../lib/provider/command');

  path = require('path');

  describe('Command Modifier - Wildcards', function() {
    var command;
    command = null;
    beforeEach(function() {
      command = new Command({
        project: atom.project.getPaths()[0],
        name: 'Test',
        command: 'echo %f',
        wd: '.',
        env: {},
        modifier: {
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
      });
      jasmine.attachToDOM(atom.views.getView(atom.workspace));
      waitsForPromise(function() {
        return atom.workspace.open(path.join(atom.project.getPaths()[0], 'test.vhd'));
      });
      Wildcards.activate();
      return waitsForPromise(function() {
        return Wildcards.preSplit(command);
      });
    });
    return it('returns valid data', function() {
      return expect(command.command).toBe('echo test.vhd');
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvc3BlYy9tb2RpZmllci13aWxkY2FyZHMtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0JBQUE7O0FBQUEsRUFBQSxTQUFBLEdBQVksT0FBQSxDQUFRLDJCQUFSLENBQVosQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBVSxPQUFBLENBQVEseUJBQVIsQ0FEVixDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsQ0FBUyw4QkFBVCxFQUF5QyxTQUFBLEdBQUE7QUFDdkMsUUFBQSxPQUFBO0FBQUEsSUFBQSxPQUFBLEdBQVUsSUFBVixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxPQUFBLEdBQWMsSUFBQSxPQUFBLENBQVE7QUFBQSxRQUNwQixPQUFBLEVBQVMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBRGI7QUFBQSxRQUVwQixJQUFBLEVBQU0sTUFGYztBQUFBLFFBR3BCLE9BQUEsRUFBUyxTQUhXO0FBQUEsUUFJcEIsRUFBQSxFQUFJLEdBSmdCO0FBQUEsUUFLcEIsR0FBQSxFQUFLLEVBTGU7QUFBQSxRQU1wQixRQUFBLEVBQ0U7QUFBQSxVQUFBLFNBQUEsRUFBVyxFQUFYO1NBUGtCO0FBQUEsUUFRcEIsTUFBQSxFQUNFO0FBQUEsVUFBQSxZQUFBLEVBQWMsSUFBZDtTQVRrQjtBQUFBLFFBVXBCLE1BQUEsRUFDRTtBQUFBLFVBQUEsWUFBQSxFQUFjLElBQWQ7U0FYa0I7QUFBQSxRQVlwQixNQUFBLEVBQ0U7QUFBQSxVQUFBLE9BQUEsRUFDRTtBQUFBLFlBQUEsYUFBQSxFQUFlLEtBQWY7V0FERjtTQWJrQjtBQUFBLFFBZXBCLE9BQUEsRUFBUyxDQWZXO09BQVIsQ0FBZCxDQUFBO0FBQUEsTUFpQkEsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFwQixDQWpCQSxDQUFBO0FBQUEsTUFrQkEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsVUFBdEMsQ0FBcEIsRUFBSDtNQUFBLENBQWhCLENBbEJBLENBQUE7QUFBQSxNQW1CQSxTQUFTLENBQUMsUUFBVixDQUFBLENBbkJBLENBQUE7YUFvQkEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFBRyxTQUFTLENBQUMsUUFBVixDQUFtQixPQUFuQixFQUFIO01BQUEsQ0FBaEIsRUFyQlM7SUFBQSxDQUFYLENBRkEsQ0FBQTtXQXlCQSxFQUFBLENBQUcsb0JBQUgsRUFBeUIsU0FBQSxHQUFBO2FBQ3ZCLE1BQUEsQ0FBTyxPQUFPLENBQUMsT0FBZixDQUF1QixDQUFDLElBQXhCLENBQTZCLGVBQTdCLEVBRHVCO0lBQUEsQ0FBekIsRUExQnVDO0VBQUEsQ0FBekMsQ0FKQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/build-tools/spec/modifier-wildcards-spec.coffee
