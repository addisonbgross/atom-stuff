(function() {
  var MultiCursor, WorkspaceView;

  MultiCursor = require('../lib/multi-cursor');

  WorkspaceView = require('atom').WorkspaceView;

  describe("MultiCursor", function() {
    var activationPromise, view, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], view = _ref[1], activationPromise = _ref[2];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      view = atom.workspace.openSync('spec/files/test.txt');
      view.setCursorBufferPosition([0, 0]);
      return activationPromise = atom.packages.activatePackage('multi-cursor');
    });
    return describe("when the multi-cursor:expandDown event is triggered", function() {
      return it("When there's 1 cursor and down command is activated", function() {
        jasmine.attachToDOM(workspaceElement);
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          expect(view.getCursors().length).toBe(1);
          atom.commands.dispatch(workspaceElement, 'multi-cursor:expandDown');
          return expect(view.getCursors().length).toBe(2);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvbXVsdGktY3Vyc29yL3NwZWMvbXVsdGktY3Vyc29yLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBCQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxxQkFBUixDQUFkLENBQUE7O0FBQUEsRUFDQyxnQkFBaUIsT0FBQSxDQUFRLE1BQVIsRUFBakIsYUFERCxDQUFBOztBQUFBLEVBUUEsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLFFBQUEsK0NBQUE7QUFBQSxJQUFBLE9BQThDLEVBQTlDLEVBQUMsMEJBQUQsRUFBbUIsY0FBbkIsRUFBeUIsMkJBQXpCLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBbkIsQ0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBZixDQUF3QixxQkFBeEIsQ0FEUCxDQUFBO0FBQUEsTUFFQSxJQUFJLENBQUMsdUJBQUwsQ0FBNkIsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUE3QixDQUZBLENBQUE7YUFHQSxpQkFBQSxHQUFvQixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsY0FBOUIsRUFKWDtJQUFBLENBQVgsQ0FGQSxDQUFBO1dBUUEsUUFBQSxDQUFTLHFEQUFULEVBQWdFLFNBQUEsR0FBQTthQUM5RCxFQUFBLENBQUcscURBQUgsRUFBMEQsU0FBQSxHQUFBO0FBQ3hELFFBQUEsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsZ0JBQXBCLENBQUEsQ0FBQTtBQUFBLFFBRUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQ2Qsa0JBRGM7UUFBQSxDQUFoQixDQUZBLENBQUE7ZUFLQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsVUFBQSxNQUFBLENBQU8sSUFBSSxDQUFDLFVBQUwsQ0FBQSxDQUFpQixDQUFDLE1BQXpCLENBQWdDLENBQUMsSUFBakMsQ0FBc0MsQ0FBdEMsQ0FBQSxDQUFBO0FBQUEsVUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLHlCQUF6QyxDQURBLENBQUE7aUJBRUEsTUFBQSxDQUFPLElBQUksQ0FBQyxVQUFMLENBQUEsQ0FBaUIsQ0FBQyxNQUF6QixDQUFnQyxDQUFDLElBQWpDLENBQXNDLENBQXRDLEVBSEc7UUFBQSxDQUFMLEVBTndEO01BQUEsQ0FBMUQsRUFEOEQ7SUFBQSxDQUFoRSxFQVRzQjtFQUFBLENBQXhCLENBUkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/multi-cursor/spec/multi-cursor-spec.coffee
