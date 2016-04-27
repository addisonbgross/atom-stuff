(function() {
  var AutocompleteGlsl;

  AutocompleteGlsl = require('../lib/autocomplete-glsl');

  describe("AutocompleteGlsl", function() {
    var activationPromise, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('autocomplete-glsl');
    });
    return describe("when the autocomplete-glsl:toggle event is triggered", function() {
      it("hides and shows the modal panel", function() {
        expect(workspaceElement.querySelector('.autocomplete-glsl')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'autocomplete-glsl:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var autocompleteGlslElement, autocompleteGlslPanel;
          expect(workspaceElement.querySelector('.autocomplete-glsl')).toExist();
          autocompleteGlslElement = workspaceElement.querySelector('.autocomplete-glsl');
          expect(autocompleteGlslElement).toExist();
          autocompleteGlslPanel = atom.workspace.panelForItem(autocompleteGlslElement);
          expect(autocompleteGlslPanel.isVisible()).toBe(true);
          atom.commands.dispatch(workspaceElement, 'autocomplete-glsl:toggle');
          return expect(autocompleteGlslPanel.isVisible()).toBe(false);
        });
      });
      return it("hides and shows the view", function() {
        jasmine.attachToDOM(workspaceElement);
        expect(workspaceElement.querySelector('.autocomplete-glsl')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'autocomplete-glsl:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var autocompleteGlslElement;
          autocompleteGlslElement = workspaceElement.querySelector('.autocomplete-glsl');
          expect(autocompleteGlslElement).toBeVisible();
          atom.commands.dispatch(workspaceElement, 'autocomplete-glsl:toggle');
          return expect(autocompleteGlslElement).not.toBeVisible();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWdsc2wvc3BlYy9hdXRvY29tcGxldGUtZ2xzbC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnQkFBQTs7QUFBQSxFQUFBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSwwQkFBUixDQUFuQixDQUFBOztBQUFBLEVBT0EsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTtBQUMzQixRQUFBLHlDQUFBO0FBQUEsSUFBQSxPQUF3QyxFQUF4QyxFQUFDLDBCQUFELEVBQW1CLDJCQUFuQixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQW5CLENBQUE7YUFDQSxpQkFBQSxHQUFvQixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsbUJBQTlCLEVBRlg7SUFBQSxDQUFYLENBRkEsQ0FBQTtXQU1BLFFBQUEsQ0FBUyxzREFBVCxFQUFpRSxTQUFBLEdBQUE7QUFDL0QsTUFBQSxFQUFBLENBQUcsaUNBQUgsRUFBc0MsU0FBQSxHQUFBO0FBR3BDLFFBQUEsTUFBQSxDQUFPLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLG9CQUEvQixDQUFQLENBQTRELENBQUMsR0FBRyxDQUFDLE9BQWpFLENBQUEsQ0FBQSxDQUFBO0FBQUEsUUFJQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLDBCQUF6QyxDQUpBLENBQUE7QUFBQSxRQU1BLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLGtCQURjO1FBQUEsQ0FBaEIsQ0FOQSxDQUFBO2VBU0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGNBQUEsOENBQUE7QUFBQSxVQUFBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixvQkFBL0IsQ0FBUCxDQUE0RCxDQUFDLE9BQTdELENBQUEsQ0FBQSxDQUFBO0FBQUEsVUFFQSx1QkFBQSxHQUEwQixnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixvQkFBL0IsQ0FGMUIsQ0FBQTtBQUFBLFVBR0EsTUFBQSxDQUFPLHVCQUFQLENBQStCLENBQUMsT0FBaEMsQ0FBQSxDQUhBLENBQUE7QUFBQSxVQUtBLHFCQUFBLEdBQXdCLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBZixDQUE0Qix1QkFBNUIsQ0FMeEIsQ0FBQTtBQUFBLFVBTUEsTUFBQSxDQUFPLHFCQUFxQixDQUFDLFNBQXRCLENBQUEsQ0FBUCxDQUF5QyxDQUFDLElBQTFDLENBQStDLElBQS9DLENBTkEsQ0FBQTtBQUFBLFVBT0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QywwQkFBekMsQ0FQQSxDQUFBO2lCQVFBLE1BQUEsQ0FBTyxxQkFBcUIsQ0FBQyxTQUF0QixDQUFBLENBQVAsQ0FBeUMsQ0FBQyxJQUExQyxDQUErQyxLQUEvQyxFQVRHO1FBQUEsQ0FBTCxFQVpvQztNQUFBLENBQXRDLENBQUEsQ0FBQTthQXVCQSxFQUFBLENBQUcsMEJBQUgsRUFBK0IsU0FBQSxHQUFBO0FBTzdCLFFBQUEsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsZ0JBQXBCLENBQUEsQ0FBQTtBQUFBLFFBRUEsTUFBQSxDQUFPLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLG9CQUEvQixDQUFQLENBQTRELENBQUMsR0FBRyxDQUFDLE9BQWpFLENBQUEsQ0FGQSxDQUFBO0FBQUEsUUFNQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLDBCQUF6QyxDQU5BLENBQUE7QUFBQSxRQVFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLGtCQURjO1FBQUEsQ0FBaEIsQ0FSQSxDQUFBO2VBV0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUVILGNBQUEsdUJBQUE7QUFBQSxVQUFBLHVCQUFBLEdBQTBCLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLG9CQUEvQixDQUExQixDQUFBO0FBQUEsVUFDQSxNQUFBLENBQU8sdUJBQVAsQ0FBK0IsQ0FBQyxXQUFoQyxDQUFBLENBREEsQ0FBQTtBQUFBLFVBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QywwQkFBekMsQ0FGQSxDQUFBO2lCQUdBLE1BQUEsQ0FBTyx1QkFBUCxDQUErQixDQUFDLEdBQUcsQ0FBQyxXQUFwQyxDQUFBLEVBTEc7UUFBQSxDQUFMLEVBbEI2QjtNQUFBLENBQS9CLEVBeEIrRDtJQUFBLENBQWpFLEVBUDJCO0VBQUEsQ0FBN0IsQ0FQQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/autocomplete-glsl/spec/autocomplete-glsl-spec.coffee
