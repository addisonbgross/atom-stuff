(function() {
  var PeekmoPhpAtomAutocomplete, WorkspaceView;

  WorkspaceView = require('atom').WorkspaceView;

  PeekmoPhpAtomAutocomplete = require('../lib/peekmo-php-atom-autocomplete');

  describe("PeekmoPhpAtomAutocomplete", function() {
    var activationPromise;
    activationPromise = null;
    beforeEach(function() {
      atom.workspaceView = new WorkspaceView;
      return activationPromise = atom.packages.activatePackage('peekmo-php-atom-autocomplete');
    });
    return describe("when the peekmo-php-atom-autocomplete:toggle event is triggered", function() {
      return it("attaches and then detaches the view", function() {
        expect(atom.workspaceView.find('.peekmo-php-atom-autocomplete')).not.toExist();
        atom.commands.dispatch(atom.workspaceView.element, 'peekmo-php-atom-autocomplete:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {});
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1hdXRvY29tcGxldGUtcGhwL3NwZWMvcGVla21vLXBocC1hdG9tLWF1dG9jb21wbGV0ZS1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3Q0FBQTs7QUFBQSxFQUFDLGdCQUFpQixPQUFBLENBQVEsTUFBUixFQUFqQixhQUFELENBQUE7O0FBQUEsRUFDQSx5QkFBQSxHQUE0QixPQUFBLENBQVEscUNBQVIsQ0FENUIsQ0FBQTs7QUFBQSxFQVFBLFFBQUEsQ0FBUywyQkFBVCxFQUFzQyxTQUFBLEdBQUE7QUFDcEMsUUFBQSxpQkFBQTtBQUFBLElBQUEsaUJBQUEsR0FBb0IsSUFBcEIsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsSUFBSSxDQUFDLGFBQUwsR0FBcUIsR0FBQSxDQUFBLGFBQXJCLENBQUE7YUFDQSxpQkFBQSxHQUFvQixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsOEJBQTlCLEVBRlg7SUFBQSxDQUFYLENBRkEsQ0FBQTtXQU1BLFFBQUEsQ0FBUyxpRUFBVCxFQUE0RSxTQUFBLEdBQUE7YUFDMUUsRUFBQSxDQUFHLHFDQUFILEVBQTBDLFNBQUEsR0FBQTtBQUN4QyxRQUFBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQW5CLENBQXdCLCtCQUF4QixDQUFQLENBQWdFLENBQUMsR0FBRyxDQUFDLE9BQXJFLENBQUEsQ0FBQSxDQUFBO0FBQUEsUUFJQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUExQyxFQUFtRCxxQ0FBbkQsQ0FKQSxDQUFBO0FBQUEsUUFNQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxrQkFEYztRQUFBLENBQWhCLENBTkEsQ0FBQTtlQVNBLElBQUEsQ0FBSyxTQUFBLEdBQUEsQ0FBTCxFQVZ3QztNQUFBLENBQTFDLEVBRDBFO0lBQUEsQ0FBNUUsRUFQb0M7RUFBQSxDQUF0QyxDQVJBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/atom-autocomplete-php/spec/peekmo-php-atom-autocomplete-spec.coffee
