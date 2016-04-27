(function() {
  var AtomCscope;

  AtomCscope = require('../lib/atom-cscope');

  describe("AtomCscope", function() {
    var activationPromise, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('atom-cscope');
    });
    return describe("when the atom-cscope:toggle event is triggered", function() {
      it("hides and shows the modal panel", function() {
        expect(workspaceElement.querySelector('.atom-cscope')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'atom-cscope:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var atomCscopeElement, atomCscopePanel;
          expect(workspaceElement.querySelector('.atom-cscope')).toExist();
          atomCscopeElement = workspaceElement.querySelector('.atom-cscope');
          expect(atomCscopeElement).toExist();
          atomCscopePanel = atom.workspace.panelForItem(atomCscopeElement);
          expect(atomCscopePanel.isVisible()).toBe(true);
          atom.commands.dispatch(workspaceElement, 'atom-cscope:toggle');
          return expect(atomCscopePanel.isVisible()).toBe(false);
        });
      });
      return it("hides and shows the view", function() {
        jasmine.attachToDOM(workspaceElement);
        expect(workspaceElement.querySelector('.atom-cscope')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'atom-cscope:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var atomCscopeElement;
          atomCscopeElement = workspaceElement.querySelector('.atom-cscope');
          expect(atomCscopeElement).toBeVisible();
          atom.commands.dispatch(workspaceElement, 'atom-cscope:toggle');
          return expect(atomCscopeElement).not.toBeVisible();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1jc2NvcGUvc3BlYy9hdG9tLWNzY29wZS1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxVQUFBOztBQUFBLEVBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxvQkFBUixDQUFiLENBQUE7O0FBQUEsRUFPQSxRQUFBLENBQVMsWUFBVCxFQUF1QixTQUFBLEdBQUE7QUFDckIsUUFBQSx5Q0FBQTtBQUFBLElBQUEsT0FBd0MsRUFBeEMsRUFBQywwQkFBRCxFQUFtQiwyQkFBbkIsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFuQixDQUFBO2FBQ0EsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGFBQTlCLEVBRlg7SUFBQSxDQUFYLENBRkEsQ0FBQTtXQU1BLFFBQUEsQ0FBUyxnREFBVCxFQUEyRCxTQUFBLEdBQUE7QUFDekQsTUFBQSxFQUFBLENBQUcsaUNBQUgsRUFBc0MsU0FBQSxHQUFBO0FBR3BDLFFBQUEsTUFBQSxDQUFPLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLGNBQS9CLENBQVAsQ0FBc0QsQ0FBQyxHQUFHLENBQUMsT0FBM0QsQ0FBQSxDQUFBLENBQUE7QUFBQSxRQUlBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsb0JBQXpDLENBSkEsQ0FBQTtBQUFBLFFBTUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQ2Qsa0JBRGM7UUFBQSxDQUFoQixDQU5BLENBQUE7ZUFTQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsY0FBQSxrQ0FBQTtBQUFBLFVBQUEsTUFBQSxDQUFPLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLGNBQS9CLENBQVAsQ0FBc0QsQ0FBQyxPQUF2RCxDQUFBLENBQUEsQ0FBQTtBQUFBLFVBRUEsaUJBQUEsR0FBb0IsZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsY0FBL0IsQ0FGcEIsQ0FBQTtBQUFBLFVBR0EsTUFBQSxDQUFPLGlCQUFQLENBQXlCLENBQUMsT0FBMUIsQ0FBQSxDQUhBLENBQUE7QUFBQSxVQUtBLGVBQUEsR0FBa0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFmLENBQTRCLGlCQUE1QixDQUxsQixDQUFBO0FBQUEsVUFNQSxNQUFBLENBQU8sZUFBZSxDQUFDLFNBQWhCLENBQUEsQ0FBUCxDQUFtQyxDQUFDLElBQXBDLENBQXlDLElBQXpDLENBTkEsQ0FBQTtBQUFBLFVBT0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QyxvQkFBekMsQ0FQQSxDQUFBO2lCQVFBLE1BQUEsQ0FBTyxlQUFlLENBQUMsU0FBaEIsQ0FBQSxDQUFQLENBQW1DLENBQUMsSUFBcEMsQ0FBeUMsS0FBekMsRUFURztRQUFBLENBQUwsRUFab0M7TUFBQSxDQUF0QyxDQUFBLENBQUE7YUF1QkEsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUEsR0FBQTtBQU83QixRQUFBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGdCQUFwQixDQUFBLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixjQUEvQixDQUFQLENBQXNELENBQUMsR0FBRyxDQUFDLE9BQTNELENBQUEsQ0FGQSxDQUFBO0FBQUEsUUFNQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLG9CQUF6QyxDQU5BLENBQUE7QUFBQSxRQVFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLGtCQURjO1FBQUEsQ0FBaEIsQ0FSQSxDQUFBO2VBV0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUVILGNBQUEsaUJBQUE7QUFBQSxVQUFBLGlCQUFBLEdBQW9CLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLGNBQS9CLENBQXBCLENBQUE7QUFBQSxVQUNBLE1BQUEsQ0FBTyxpQkFBUCxDQUF5QixDQUFDLFdBQTFCLENBQUEsQ0FEQSxDQUFBO0FBQUEsVUFFQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLG9CQUF6QyxDQUZBLENBQUE7aUJBR0EsTUFBQSxDQUFPLGlCQUFQLENBQXlCLENBQUMsR0FBRyxDQUFDLFdBQTlCLENBQUEsRUFMRztRQUFBLENBQUwsRUFsQjZCO01BQUEsQ0FBL0IsRUF4QnlEO0lBQUEsQ0FBM0QsRUFQcUI7RUFBQSxDQUF2QixDQVBBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/atom-cscope/spec/atom-cscope-spec.coffee
