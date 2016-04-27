(function() {
  var Pacmanfy;

  Pacmanfy = require('../lib/pacmanfy');

  describe("Pacmanfy", function() {
    var activationPromise, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('pacmanfy');
    });
    return describe("when the pacmanfy:toggle event is triggered", function() {
      it("hides and shows the modal panel", function() {
        expect(workspaceElement.querySelector('.pacmanfy')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'pacmanfy:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var pacmanfyElement, pacmanfyPanel;
          expect(workspaceElement.querySelector('.pacmanfy')).toExist();
          pacmanfyElement = workspaceElement.querySelector('.pacmanfy');
          expect(pacmanfyElement).toExist();
          pacmanfyPanel = atom.workspace.panelForItem(pacmanfyElement);
          expect(pacmanfyPanel.isVisible()).toBe(true);
          atom.commands.dispatch(workspaceElement, 'pacmanfy:toggle');
          return expect(pacmanfyPanel.isVisible()).toBe(false);
        });
      });
      return it("hides and shows the view", function() {
        jasmine.attachToDOM(workspaceElement);
        expect(workspaceElement.querySelector('.pacmanfy')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'pacmanfy:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var pacmanfyElement;
          pacmanfyElement = workspaceElement.querySelector('.pacmanfy');
          expect(pacmanfyElement).toBeVisible();
          atom.commands.dispatch(workspaceElement, 'pacmanfy:toggle');
          return expect(pacmanfyElement).not.toBeVisible();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGFjbWFuZnkvc3BlYy9wYWNtYW5meS1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxRQUFBOztBQUFBLEVBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxpQkFBUixDQUFYLENBQUE7O0FBQUEsRUFPQSxRQUFBLENBQVMsVUFBVCxFQUFxQixTQUFBLEdBQUE7QUFDbkIsUUFBQSx5Q0FBQTtBQUFBLElBQUEsT0FBd0MsRUFBeEMsRUFBQywwQkFBRCxFQUFtQiwyQkFBbkIsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFuQixDQUFBO2FBQ0EsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFVBQTlCLEVBRlg7SUFBQSxDQUFYLENBRkEsQ0FBQTtXQU1BLFFBQUEsQ0FBUyw2Q0FBVCxFQUF3RCxTQUFBLEdBQUE7QUFDdEQsTUFBQSxFQUFBLENBQUcsaUNBQUgsRUFBc0MsU0FBQSxHQUFBO0FBR3BDLFFBQUEsTUFBQSxDQUFPLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLFdBQS9CLENBQVAsQ0FBbUQsQ0FBQyxHQUFHLENBQUMsT0FBeEQsQ0FBQSxDQUFBLENBQUE7QUFBQSxRQUlBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsaUJBQXpDLENBSkEsQ0FBQTtBQUFBLFFBTUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQ2Qsa0JBRGM7UUFBQSxDQUFoQixDQU5BLENBQUE7ZUFTQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsY0FBQSw4QkFBQTtBQUFBLFVBQUEsTUFBQSxDQUFPLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLFdBQS9CLENBQVAsQ0FBbUQsQ0FBQyxPQUFwRCxDQUFBLENBQUEsQ0FBQTtBQUFBLFVBRUEsZUFBQSxHQUFrQixnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixXQUEvQixDQUZsQixDQUFBO0FBQUEsVUFHQSxNQUFBLENBQU8sZUFBUCxDQUF1QixDQUFDLE9BQXhCLENBQUEsQ0FIQSxDQUFBO0FBQUEsVUFLQSxhQUFBLEdBQWdCLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBZixDQUE0QixlQUE1QixDQUxoQixDQUFBO0FBQUEsVUFNQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQWQsQ0FBQSxDQUFQLENBQWlDLENBQUMsSUFBbEMsQ0FBdUMsSUFBdkMsQ0FOQSxDQUFBO0FBQUEsVUFPQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLGlCQUF6QyxDQVBBLENBQUE7aUJBUUEsTUFBQSxDQUFPLGFBQWEsQ0FBQyxTQUFkLENBQUEsQ0FBUCxDQUFpQyxDQUFDLElBQWxDLENBQXVDLEtBQXZDLEVBVEc7UUFBQSxDQUFMLEVBWm9DO01BQUEsQ0FBdEMsQ0FBQSxDQUFBO2FBdUJBLEVBQUEsQ0FBRywwQkFBSCxFQUErQixTQUFBLEdBQUE7QUFPN0IsUUFBQSxPQUFPLENBQUMsV0FBUixDQUFvQixnQkFBcEIsQ0FBQSxDQUFBO0FBQUEsUUFFQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsV0FBL0IsQ0FBUCxDQUFtRCxDQUFDLEdBQUcsQ0FBQyxPQUF4RCxDQUFBLENBRkEsQ0FBQTtBQUFBLFFBTUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QyxpQkFBekMsQ0FOQSxDQUFBO0FBQUEsUUFRQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxrQkFEYztRQUFBLENBQWhCLENBUkEsQ0FBQTtlQVdBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFFSCxjQUFBLGVBQUE7QUFBQSxVQUFBLGVBQUEsR0FBa0IsZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsV0FBL0IsQ0FBbEIsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxDQUFPLGVBQVAsQ0FBdUIsQ0FBQyxXQUF4QixDQUFBLENBREEsQ0FBQTtBQUFBLFVBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QyxpQkFBekMsQ0FGQSxDQUFBO2lCQUdBLE1BQUEsQ0FBTyxlQUFQLENBQXVCLENBQUMsR0FBRyxDQUFDLFdBQTVCLENBQUEsRUFMRztRQUFBLENBQUwsRUFsQjZCO01BQUEsQ0FBL0IsRUF4QnNEO0lBQUEsQ0FBeEQsRUFQbUI7RUFBQSxDQUFyQixDQVBBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/pacmanfy/spec/pacmanfy-spec.coffee
