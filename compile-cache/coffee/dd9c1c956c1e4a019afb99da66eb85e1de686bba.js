(function() {
  var Debugger;

  Debugger = require('../lib/debugger');

  describe("Debugger", function() {
    var activationPromise, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('debugger');
    });
    return describe("when the debugger:toggle event is triggered", function() {
      it("hides and shows the modal panel", function() {
        expect(workspaceElement.querySelector('.debugger')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'debugger:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var debuggerElement, debuggerPanel;
          expect(workspaceElement.querySelector('.debugger')).toExist();
          debuggerElement = workspaceElement.querySelector('.debugger');
          expect(debuggerElement).toExist();
          debuggerPanel = atom.workspace.panelForItem(debuggerElement);
          expect(debuggerPanel.isVisible()).toBe(true);
          atom.commands.dispatch(workspaceElement, 'debugger:toggle');
          return expect(debuggerPanel.isVisible()).toBe(false);
        });
      });
      return it("hides and shows the view", function() {
        jasmine.attachToDOM(workspaceElement);
        expect(workspaceElement.querySelector('.debugger')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'debugger:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var debuggerElement;
          debuggerElement = workspaceElement.querySelector('.debugger');
          expect(debuggerElement).toBeVisible();
          atom.commands.dispatch(workspaceElement, 'debugger:toggle');
          return expect(debuggerElement).not.toBeVisible();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1kZWJ1Z2dlci9zcGVjL2RlYnVnZ2VyLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFFBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGlCQUFSLENBQVgsQ0FBQTs7QUFBQSxFQU9BLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUEsR0FBQTtBQUNuQixRQUFBLHlDQUFBO0FBQUEsSUFBQSxPQUF3QyxFQUF4QyxFQUFDLDBCQUFELEVBQW1CLDJCQUFuQixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQW5CLENBQUE7YUFDQSxpQkFBQSxHQUFvQixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsVUFBOUIsRUFGWDtJQUFBLENBQVgsQ0FGQSxDQUFBO1dBTUEsUUFBQSxDQUFTLDZDQUFULEVBQXdELFNBQUEsR0FBQTtBQUN0RCxNQUFBLEVBQUEsQ0FBRyxpQ0FBSCxFQUFzQyxTQUFBLEdBQUE7QUFHcEMsUUFBQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsV0FBL0IsQ0FBUCxDQUFtRCxDQUFDLEdBQUcsQ0FBQyxPQUF4RCxDQUFBLENBQUEsQ0FBQTtBQUFBLFFBSUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QyxpQkFBekMsQ0FKQSxDQUFBO0FBQUEsUUFNQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxrQkFEYztRQUFBLENBQWhCLENBTkEsQ0FBQTtlQVNBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxjQUFBLDhCQUFBO0FBQUEsVUFBQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsV0FBL0IsQ0FBUCxDQUFtRCxDQUFDLE9BQXBELENBQUEsQ0FBQSxDQUFBO0FBQUEsVUFFQSxlQUFBLEdBQWtCLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLFdBQS9CLENBRmxCLENBQUE7QUFBQSxVQUdBLE1BQUEsQ0FBTyxlQUFQLENBQXVCLENBQUMsT0FBeEIsQ0FBQSxDQUhBLENBQUE7QUFBQSxVQUtBLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFmLENBQTRCLGVBQTVCLENBTGhCLENBQUE7QUFBQSxVQU1BLE1BQUEsQ0FBTyxhQUFhLENBQUMsU0FBZCxDQUFBLENBQVAsQ0FBaUMsQ0FBQyxJQUFsQyxDQUF1QyxJQUF2QyxDQU5BLENBQUE7QUFBQSxVQU9BLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsaUJBQXpDLENBUEEsQ0FBQTtpQkFRQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQWQsQ0FBQSxDQUFQLENBQWlDLENBQUMsSUFBbEMsQ0FBdUMsS0FBdkMsRUFURztRQUFBLENBQUwsRUFab0M7TUFBQSxDQUF0QyxDQUFBLENBQUE7YUF1QkEsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUEsR0FBQTtBQU83QixRQUFBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGdCQUFwQixDQUFBLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixXQUEvQixDQUFQLENBQW1ELENBQUMsR0FBRyxDQUFDLE9BQXhELENBQUEsQ0FGQSxDQUFBO0FBQUEsUUFNQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLGlCQUF6QyxDQU5BLENBQUE7QUFBQSxRQVFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLGtCQURjO1FBQUEsQ0FBaEIsQ0FSQSxDQUFBO2VBV0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUVILGNBQUEsZUFBQTtBQUFBLFVBQUEsZUFBQSxHQUFrQixnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixXQUEvQixDQUFsQixDQUFBO0FBQUEsVUFDQSxNQUFBLENBQU8sZUFBUCxDQUF1QixDQUFDLFdBQXhCLENBQUEsQ0FEQSxDQUFBO0FBQUEsVUFFQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLGlCQUF6QyxDQUZBLENBQUE7aUJBR0EsTUFBQSxDQUFPLGVBQVAsQ0FBdUIsQ0FBQyxHQUFHLENBQUMsV0FBNUIsQ0FBQSxFQUxHO1FBQUEsQ0FBTCxFQWxCNkI7TUFBQSxDQUEvQixFQXhCc0Q7SUFBQSxDQUF4RCxFQVBtQjtFQUFBLENBQXJCLENBUEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/atom-debugger/spec/debugger-spec.coffee
