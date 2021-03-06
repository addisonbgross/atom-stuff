(function() {
  var Command, Dependency;

  Dependency = require('../lib/modifier/dependency');

  Command = require('../lib/provider/command');

  describe('Queue Modifier - Dependencies', function() {
    var command, queue;
    command = null;
    queue = null;
    beforeEach(function() {
      var p;
      Dependency.activate(null, require('../lib/provider/project', null));
      command = new Command({
        project: atom.project.getPaths()[0],
        source: require('path').join(atom.project.getPaths()[0], '.build-tools.cson'),
        name: 'Test 2',
        command: 'echo Hello World',
        modifier: {
          dependency: {
            abort: false,
            list: [[1, 1, 'Bar 2'], [0, 0, 'Test'], [0, 2, 'Test 2']]
          }
        },
        version: 1
      });
      queue = {
        queue: [command]
      };
      p = Dependency["in"](queue);
      return waitsForPromise(function() {
        return p;
      });
    });
    return it('returns the correct queue', function() {
      expect(queue.queue[0].name).toBe('Bar');
      expect(queue.queue[1].name).toBe('Bar 2');
      expect(queue.queue[2].name).toBe('Test');
      return expect(queue.queue[3].name).toBe('Test 2');
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvc3BlYy9tb2RpZmllci1kZXBlbmRlbmN5LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSw0QkFBUixDQUFiLENBQUE7O0FBQUEsRUFDQSxPQUFBLEdBQVUsT0FBQSxDQUFRLHlCQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsQ0FBUywrQkFBVCxFQUEwQyxTQUFBLEdBQUE7QUFDeEMsUUFBQSxjQUFBO0FBQUEsSUFBQSxPQUFBLEdBQVUsSUFBVixDQUFBO0FBQUEsSUFDQSxLQUFBLEdBQVEsSUFEUixDQUFBO0FBQUEsSUFHQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxDQUFBO0FBQUEsTUFBQSxVQUFVLENBQUMsUUFBWCxDQUFvQixJQUFwQixFQUEwQixPQUFBLENBQVEseUJBQVIsRUFBbUMsSUFBbkMsQ0FBMUIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxPQUFBLEdBQWMsSUFBQSxPQUFBLENBQVE7QUFBQSxRQUNwQixPQUFBLEVBQVMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBRGI7QUFBQSxRQUVwQixNQUFBLEVBQVEsT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDLElBQWhCLENBQXFCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUE3QyxFQUFpRCxtQkFBakQsQ0FGWTtBQUFBLFFBR3BCLElBQUEsRUFBTSxRQUhjO0FBQUEsUUFJcEIsT0FBQSxFQUFTLGtCQUpXO0FBQUEsUUFLcEIsUUFBQSxFQUNFO0FBQUEsVUFBQSxVQUFBLEVBQ0U7QUFBQSxZQUFBLEtBQUEsRUFBTyxLQUFQO0FBQUEsWUFDQSxJQUFBLEVBQU0sQ0FDSixDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sT0FBUCxDQURJLEVBRUosQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLE1BQVAsQ0FGSSxFQUdKLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxRQUFQLENBSEksQ0FETjtXQURGO1NBTmtCO0FBQUEsUUFhcEIsT0FBQSxFQUFTLENBYlc7T0FBUixDQURkLENBQUE7QUFBQSxNQWdCQSxLQUFBLEdBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxDQUFDLE9BQUQsQ0FBUDtPQWpCRixDQUFBO0FBQUEsTUFrQkEsQ0FBQSxHQUFJLFVBQVUsQ0FBQyxJQUFELENBQVYsQ0FBYyxLQUFkLENBbEJKLENBQUE7YUFtQkEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFBRyxFQUFIO01BQUEsQ0FBaEIsRUFwQlM7SUFBQSxDQUFYLENBSEEsQ0FBQTtXQXlCQSxFQUFBLENBQUcsMkJBQUgsRUFBZ0MsU0FBQSxHQUFBO0FBQzlCLE1BQUEsTUFBQSxDQUFPLEtBQUssQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBdEIsQ0FBMkIsQ0FBQyxJQUE1QixDQUFpQyxLQUFqQyxDQUFBLENBQUE7QUFBQSxNQUNBLE1BQUEsQ0FBTyxLQUFLLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLElBQXRCLENBQTJCLENBQUMsSUFBNUIsQ0FBaUMsT0FBakMsQ0FEQSxDQUFBO0FBQUEsTUFFQSxNQUFBLENBQU8sS0FBSyxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxJQUF0QixDQUEyQixDQUFDLElBQTVCLENBQWlDLE1BQWpDLENBRkEsQ0FBQTthQUdBLE1BQUEsQ0FBTyxLQUFLLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLElBQXRCLENBQTJCLENBQUMsSUFBNUIsQ0FBaUMsUUFBakMsRUFKOEI7SUFBQSxDQUFoQyxFQTFCd0M7RUFBQSxDQUExQyxDQUhBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/build-tools/spec/modifier-dependency-spec.coffee
