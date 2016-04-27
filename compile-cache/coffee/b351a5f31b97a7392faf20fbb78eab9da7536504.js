(function() {
  var Android;

  Android = require('../lib/android');

  describe("Android", function() {
    var activationPromise, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('android');
    });
    return describe("when the android:toggle event is triggered", function() {
      it("hides and shows the modal panel", function() {
        expect(workspaceElement.querySelector('.android')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'android:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var androidElement, androidPanel;
          expect(workspaceElement.querySelector('.android')).toExist();
          androidElement = workspaceElement.querySelector('.android');
          expect(androidElement).toExist();
          androidPanel = atom.workspace.panelForItem(androidElement);
          expect(androidPanel.isVisible()).toBe(true);
          atom.commands.dispatch(workspaceElement, 'android:toggle');
          return expect(androidPanel.isVisible()).toBe(false);
        });
      });
      return it("hides and shows the view", function() {
        jasmine.attachToDOM(workspaceElement);
        expect(workspaceElement.querySelector('.android')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'android:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var androidElement;
          androidElement = workspaceElement.querySelector('.android');
          expect(androidElement).toBeVisible();
          atom.commands.dispatch(workspaceElement, 'android:toggle');
          return expect(androidElement).not.toBeVisible();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYW5kcm9pZC9zcGVjL2FuZHJvaWQtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsT0FBQTs7QUFBQSxFQUFBLE9BQUEsR0FBVSxPQUFBLENBQVEsZ0JBQVIsQ0FBVixDQUFBOztBQUFBLEVBT0EsUUFBQSxDQUFTLFNBQVQsRUFBb0IsU0FBQSxHQUFBO0FBQ2xCLFFBQUEseUNBQUE7QUFBQSxJQUFBLE9BQXdDLEVBQXhDLEVBQUMsMEJBQUQsRUFBbUIsMkJBQW5CLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBbkIsQ0FBQTthQUNBLGlCQUFBLEdBQW9CLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixTQUE5QixFQUZYO0lBQUEsQ0FBWCxDQUZBLENBQUE7V0FNQSxRQUFBLENBQVMsNENBQVQsRUFBdUQsU0FBQSxHQUFBO0FBQ3JELE1BQUEsRUFBQSxDQUFHLGlDQUFILEVBQXNDLFNBQUEsR0FBQTtBQUdwQyxRQUFBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixVQUEvQixDQUFQLENBQWtELENBQUMsR0FBRyxDQUFDLE9BQXZELENBQUEsQ0FBQSxDQUFBO0FBQUEsUUFJQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLGdCQUF6QyxDQUpBLENBQUE7QUFBQSxRQU1BLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLGtCQURjO1FBQUEsQ0FBaEIsQ0FOQSxDQUFBO2VBU0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGNBQUEsNEJBQUE7QUFBQSxVQUFBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixVQUEvQixDQUFQLENBQWtELENBQUMsT0FBbkQsQ0FBQSxDQUFBLENBQUE7QUFBQSxVQUVBLGNBQUEsR0FBaUIsZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsVUFBL0IsQ0FGakIsQ0FBQTtBQUFBLFVBR0EsTUFBQSxDQUFPLGNBQVAsQ0FBc0IsQ0FBQyxPQUF2QixDQUFBLENBSEEsQ0FBQTtBQUFBLFVBS0EsWUFBQSxHQUFlLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBZixDQUE0QixjQUE1QixDQUxmLENBQUE7QUFBQSxVQU1BLE1BQUEsQ0FBTyxZQUFZLENBQUMsU0FBYixDQUFBLENBQVAsQ0FBZ0MsQ0FBQyxJQUFqQyxDQUFzQyxJQUF0QyxDQU5BLENBQUE7QUFBQSxVQU9BLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsZ0JBQXpDLENBUEEsQ0FBQTtpQkFRQSxNQUFBLENBQU8sWUFBWSxDQUFDLFNBQWIsQ0FBQSxDQUFQLENBQWdDLENBQUMsSUFBakMsQ0FBc0MsS0FBdEMsRUFURztRQUFBLENBQUwsRUFab0M7TUFBQSxDQUF0QyxDQUFBLENBQUE7YUF1QkEsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUEsR0FBQTtBQU83QixRQUFBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGdCQUFwQixDQUFBLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixVQUEvQixDQUFQLENBQWtELENBQUMsR0FBRyxDQUFDLE9BQXZELENBQUEsQ0FGQSxDQUFBO0FBQUEsUUFNQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLGdCQUF6QyxDQU5BLENBQUE7QUFBQSxRQVFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLGtCQURjO1FBQUEsQ0FBaEIsQ0FSQSxDQUFBO2VBV0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUVILGNBQUEsY0FBQTtBQUFBLFVBQUEsY0FBQSxHQUFpQixnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixVQUEvQixDQUFqQixDQUFBO0FBQUEsVUFDQSxNQUFBLENBQU8sY0FBUCxDQUFzQixDQUFDLFdBQXZCLENBQUEsQ0FEQSxDQUFBO0FBQUEsVUFFQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLGdCQUF6QyxDQUZBLENBQUE7aUJBR0EsTUFBQSxDQUFPLGNBQVAsQ0FBc0IsQ0FBQyxHQUFHLENBQUMsV0FBM0IsQ0FBQSxFQUxHO1FBQUEsQ0FBTCxFQWxCNkI7TUFBQSxDQUEvQixFQXhCcUQ7SUFBQSxDQUF2RCxFQVBrQjtFQUFBLENBQXBCLENBUEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/android/spec/android-spec.coffee
