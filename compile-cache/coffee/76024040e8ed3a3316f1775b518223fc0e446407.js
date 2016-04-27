(function() {
  var PhpDebug;

  PhpDebug = require('../lib/php-debug');

  describe("PhpDebug", function() {
    var activationPromise, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('php-debug');
    });
    return describe("when the php-debug:toggle event is triggered", function() {
      it("hides and shows the modal panel", function() {
        expect(workspaceElement.querySelector('.php-debug')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'php-debug:toggleDebugging');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var phpDebugElement, phpDebugPanel;
          expect(workspaceElement.querySelector('.php-debug')).toExist();
          phpDebugElement = workspaceElement.querySelector('.php-debug');
          expect(phpDebugElement).toExist();
          phpDebugPanel = atom.workspace.panelForItem(phpDebugElement);
          expect(phpDebugPanel.isVisible()).toBe(true);
          atom.commands.dispatch(workspaceElement, 'php-debug:toggleDebugging');
          return expect(phpDebugPanel.isVisible()).toBe(false);
        });
      });
      return it("hides and shows the view", function() {
        jasmine.attachToDOM(workspaceElement);
        expect(workspaceElement.querySelector('.php-debug')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'php-debug:toggleDebugging');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var phpDebugElement;
          phpDebugElement = workspaceElement.querySelector('.php-debug');
          expect(phpDebugElement).toBeVisible();
          atom.commands.dispatch(workspaceElement, 'php-debug:toggleDebugging');
          return expect(phpDebugElement).not.toBeVisible();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGhwLWRlYnVnL3NwZWMvcGhwLWRlYnVnLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFFBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGtCQUFSLENBQVgsQ0FBQTs7QUFBQSxFQU9BLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUEsR0FBQTtBQUNuQixRQUFBLHlDQUFBO0FBQUEsSUFBQSxPQUF3QyxFQUF4QyxFQUFDLDBCQUFELEVBQW1CLDJCQUFuQixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQW5CLENBQUE7YUFDQSxpQkFBQSxHQUFvQixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsV0FBOUIsRUFGWDtJQUFBLENBQVgsQ0FGQSxDQUFBO1dBTUEsUUFBQSxDQUFTLDhDQUFULEVBQXlELFNBQUEsR0FBQTtBQUN2RCxNQUFBLEVBQUEsQ0FBRyxpQ0FBSCxFQUFzQyxTQUFBLEdBQUE7QUFHcEMsUUFBQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsWUFBL0IsQ0FBUCxDQUFvRCxDQUFDLEdBQUcsQ0FBQyxPQUF6RCxDQUFBLENBQUEsQ0FBQTtBQUFBLFFBSUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QywyQkFBekMsQ0FKQSxDQUFBO0FBQUEsUUFNQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxrQkFEYztRQUFBLENBQWhCLENBTkEsQ0FBQTtlQVNBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxjQUFBLDhCQUFBO0FBQUEsVUFBQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsWUFBL0IsQ0FBUCxDQUFvRCxDQUFDLE9BQXJELENBQUEsQ0FBQSxDQUFBO0FBQUEsVUFFQSxlQUFBLEdBQWtCLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLFlBQS9CLENBRmxCLENBQUE7QUFBQSxVQUdBLE1BQUEsQ0FBTyxlQUFQLENBQXVCLENBQUMsT0FBeEIsQ0FBQSxDQUhBLENBQUE7QUFBQSxVQUtBLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFmLENBQTRCLGVBQTVCLENBTGhCLENBQUE7QUFBQSxVQU1BLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBZCxDQUFBLENBQVAsQ0FBaUMsQ0FBQyxJQUFsQyxDQUF1QyxJQUF2QyxDQU5BLENBQUE7QUFBQSxVQU9BLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsMkJBQXpDLENBUEEsQ0FBQTtpQkFRQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQWQsQ0FBQSxDQUFQLENBQWlDLENBQUMsSUFBbEMsQ0FBdUMsS0FBdkMsRUFURztRQUFBLENBQUwsRUFab0M7TUFBQSxDQUF0QyxDQUFBLENBQUE7YUF1QkEsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUEsR0FBQTtBQU83QixRQUFBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGdCQUFwQixDQUFBLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixZQUEvQixDQUFQLENBQW9ELENBQUMsR0FBRyxDQUFDLE9BQXpELENBQUEsQ0FGQSxDQUFBO0FBQUEsUUFNQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLDJCQUF6QyxDQU5BLENBQUE7QUFBQSxRQVFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLGtCQURjO1FBQUEsQ0FBaEIsQ0FSQSxDQUFBO2VBV0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUVILGNBQUEsZUFBQTtBQUFBLFVBQUEsZUFBQSxHQUFrQixnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixZQUEvQixDQUFsQixDQUFBO0FBQUEsVUFDQSxNQUFBLENBQU8sZUFBUCxDQUF1QixDQUFDLFdBQXhCLENBQUEsQ0FEQSxDQUFBO0FBQUEsVUFFQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLDJCQUF6QyxDQUZBLENBQUE7aUJBR0EsTUFBQSxDQUFPLGVBQVAsQ0FBdUIsQ0FBQyxHQUFHLENBQUMsV0FBNUIsQ0FBQSxFQUxHO1FBQUEsQ0FBTCxFQWxCNkI7TUFBQSxDQUEvQixFQXhCdUQ7SUFBQSxDQUF6RCxFQVBtQjtFQUFBLENBQXJCLENBUEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/php-debug/spec/php-debug-spec.coffee
