(function() {
  describe('Indie', function() {
    var Indie, Validate, indie;
    Validate = require('../lib/validate');
    Indie = require('../lib/indie');
    indie = null;
    beforeEach(function() {
      if (indie != null) {
        indie.dispose();
      }
      return indie = new Indie({});
    });
    describe('Validations', function() {
      return it('just cares about a name', function() {
        var linter;
        linter = {};
        Validate.linter(linter, true);
        expect(linter.name).toBe(null);
        linter.name = 'a';
        Validate.linter(linter, true);
        expect(linter.name).toBe('a');
        linter.name = 2;
        return expect(function() {
          return Validate.linter(linter, true);
        }).toThrow();
      });
    });
    describe('constructor', function() {
      return it('sets a scope for message registry to know', function() {
        return expect(indie.scope).toBe('project');
      });
    });
    describe('{set, delete}Messages', function() {
      return it('notifies the event listeners of the change', function() {
        var listener, messages;
        listener = jasmine.createSpy('indie.listener');
        messages = [{}];
        indie.onDidUpdateMessages(listener);
        indie.setMessages(messages);
        expect(listener).toHaveBeenCalled();
        expect(listener.calls.length).toBe(1);
        expect(listener).toHaveBeenCalledWith(messages);
        indie.deleteMessages();
        expect(listener.calls.length).toBe(2);
        expect(listener.mostRecentCall.args[0] instanceof Array);
        return expect(listener.mostRecentCall.args[0].length).toBe(0);
      });
    });
    return describe('dispose', function() {
      return it('triggers the onDidDestroy event', function() {
        var listener;
        listener = jasmine.createSpy('indie.destroy');
        indie.onDidDestroy(listener);
        indie.dispose();
        return expect(listener).toHaveBeenCalled();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvbGludGVyL3NwZWMvaW5kaWUtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsUUFBQSxDQUFTLE9BQVQsRUFBa0IsU0FBQSxHQUFBO0FBQ2hCLFFBQUEsc0JBQUE7QUFBQSxJQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsaUJBQVIsQ0FBWCxDQUFBO0FBQUEsSUFDQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGNBQVIsQ0FEUixDQUFBO0FBQUEsSUFFQSxLQUFBLEdBQVEsSUFGUixDQUFBO0FBQUEsSUFJQSxVQUFBLENBQVcsU0FBQSxHQUFBOztRQUNULEtBQUssQ0FBRSxPQUFQLENBQUE7T0FBQTthQUNBLEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBTSxFQUFOLEVBRkg7SUFBQSxDQUFYLENBSkEsQ0FBQTtBQUFBLElBUUEsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO2FBQ3RCLEVBQUEsQ0FBRyx5QkFBSCxFQUE4QixTQUFBLEdBQUE7QUFDNUIsWUFBQSxNQUFBO0FBQUEsUUFBQSxNQUFBLEdBQVMsRUFBVCxDQUFBO0FBQUEsUUFDQSxRQUFRLENBQUMsTUFBVCxDQUFnQixNQUFoQixFQUF3QixJQUF4QixDQURBLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsSUFBZCxDQUFtQixDQUFDLElBQXBCLENBQXlCLElBQXpCLENBRkEsQ0FBQTtBQUFBLFFBR0EsTUFBTSxDQUFDLElBQVAsR0FBYyxHQUhkLENBQUE7QUFBQSxRQUlBLFFBQVEsQ0FBQyxNQUFULENBQWdCLE1BQWhCLEVBQXdCLElBQXhCLENBSkEsQ0FBQTtBQUFBLFFBS0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxJQUFkLENBQW1CLENBQUMsSUFBcEIsQ0FBeUIsR0FBekIsQ0FMQSxDQUFB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

//# sourceURL=/home/champ/.atom/packages/linter/spec/indie-spec.coffee