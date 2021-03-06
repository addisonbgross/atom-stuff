(function() {
  var Command, CommandEditPane;

  CommandEditPane = require('../lib/view/command-edit-pane');

  Command = require('../lib/provider/command');

  describe('Command Edit Pane', function() {
    var accept, cancel, command, view;
    view = null;
    accept = null;
    cancel = null;
    command = null;
    beforeEach(function() {
      accept = jasmine.createSpy('accept');
      cancel = jasmine.createSpy('cancel');
      command = {
        project: atom.project.getPaths()[0],
        name: 'Test 1',
        command: 'echo test',
        wd: '.',
        modifier: {
          save_all: {}
        },
        stdout: {
          highlighting: 'nh'
        },
        stderr: {
          highlighting: 'hc',
          profile: 'python'
        },
        output: {
          console: {
            close_success: true
          }
        }
      };
      command = new Command(command);
      command.oldname = 'Test 1';
      view = new CommandEditPane(command);
      view.setCallbacks(accept, cancel);
      return jasmine.attachToDOM(view.element);
    });
    it('has a pane', function() {
      return expect(view.element).toBeDefined();
    });
    it('has 12 edit panes', function() {
      return expect(view.find('.inset-panel').length).toBe(12);
    });
    it('has the correct values', function() {
      expect(view.panes[0].view.command_name.getModel().getText()).toBe('Test 1');
      expect(view.panes[1].pane.find('#save_all').prop('checked')).toBe(true);
      expect(view.panes[6].view._stderr.panes[0].view.profile[0].selectedIndex).toBe(3);
      return expect(view.panes[7].view.find('#close_success').prop('checked')).toBe(true);
    });
    describe('On accept', function() {
      beforeEach(function() {
        view.panes[1].pane.find('#save_all').prop('checked', false);
        return view.find('.btn-primary').click();
      });
      it('returns the correct values', function() {
        var oldname, res;
        res = accept.mostRecentCall.args[0];
        oldname = accept.mostRecentCall.args[1];
        expect(accept).toHaveBeenCalled();
        expect(oldname).toBe('Test 1');
        expect(res.project).toBe(atom.project.getPaths()[0]);
        expect(res.command).toBe('echo test');
        expect(res.modifier.save_all).toBeUndefined();
        expect(res.stdout.pipeline).toEqual([]);
        expect(res.stderr.pipeline).toEqual([
          {
            name: 'profile',
            config: {
              profile: 'python'
            }
          }
        ]);
        expect(res.output.console.close_success).toBe(true);
        return expect(res.output.linter).toBeUndefined();
      });
      return it('calls the cancel callback', function() {
        return expect(cancel).toHaveBeenCalled();
      });
    });
    describe('Pane can be created with atom.views.getView', function() {
      var c, execute, p, _ref;
      _ref = [], c = _ref[0], p = _ref[1];
      execute = function(callback) {
        waitsForPromise(function() {
          return atom.packages.activatePackage('build-tools');
        });
        return runs(function() {
          return callback();
        });
      };
      it('On getView with default command', function() {
        return execute(function() {
          c = new Command;
          p = atom.views.getView(c);
          jasmine.attachToDOM(p.element);
          expect(p.panes[0].view.command_name.getModel().getText()).toBe('');
          return expect(p.command.oldname).toBeUndefined();
        });
      });
      return it('on getView with a valid command', function() {
        return execute(function() {
          command.oldname = void 0;
          c = new Command(command);
          p = atom.views.getView(c);
          jasmine.attachToDOM(p.element);
          expect(p.panes[0].view.command_name.getModel().getText()).toBe('Test 1');
          return expect(p.command.oldname).toBe('Test 1');
        });
      });
    });
    return describe('use blacklist to hide modules', function() {
      beforeEach(function() {
        view.remove();
        view = new CommandEditPane(command);
        view.setCallbacks(accept, cancel);
        view.setBlacklist(['general', 'console']);
        return jasmine.attachToDOM(view.element);
      });
      return it('shows all views minus the blacklisted ones', function() {
        expect(view.find('.inset-panel').length).toBe(10);
        return expect(view.panes[0].view.command_name).toBeUndefined();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvc3BlYy9jb21tYW5kLWVkaXQtcGFuZS1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3QkFBQTs7QUFBQSxFQUFBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLCtCQUFSLENBQWxCLENBQUE7O0FBQUEsRUFDQSxPQUFBLEdBQVUsT0FBQSxDQUFRLHlCQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsQ0FBUyxtQkFBVCxFQUE4QixTQUFBLEdBQUE7QUFDNUIsUUFBQSw2QkFBQTtBQUFBLElBQUEsSUFBQSxHQUFPLElBQVAsQ0FBQTtBQUFBLElBQ0EsTUFBQSxHQUFTLElBRFQsQ0FBQTtBQUFBLElBRUEsTUFBQSxHQUFTLElBRlQsQ0FBQTtBQUFBLElBR0EsT0FBQSxHQUFVLElBSFYsQ0FBQTtBQUFBLElBS0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsTUFBQSxHQUFTLE9BQU8sQ0FBQyxTQUFSLENBQWtCLFFBQWxCLENBQVQsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxHQUFTLE9BQU8sQ0FBQyxTQUFSLENBQWtCLFFBQWxCLENBRFQsQ0FBQTtBQUFBLE1BRUEsT0FBQSxHQUNFO0FBQUEsUUFBQSxPQUFBLEVBQVMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWpDO0FBQUEsUUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLFFBRUEsT0FBQSxFQUFTLFdBRlQ7QUFBQSxRQUdBLEVBQUEsRUFBSSxHQUhKO0FBQUEsUUFJQSxRQUFBLEVBQ0U7QUFBQSxVQUFBLFFBQUEsRUFBVSxFQUFWO1NBTEY7QUFBQSxRQU1BLE1BQUEsRUFDRTtBQUFBLFVBQUEsWUFBQSxFQUFjLElBQWQ7U0FQRjtBQUFBLFFBUUEsTUFBQSxFQUNFO0FBQUEsVUFBQSxZQUFBLEVBQWMsSUFBZDtBQUFBLFVBQ0EsT0FBQSxFQUFTLFFBRFQ7U0FURjtBQUFBLFFBV0EsTUFBQSxFQUNFO0FBQUEsVUFBQSxPQUFBLEVBQ0U7QUFBQSxZQUFBLGFBQUEsRUFBZSxJQUFmO1dBREY7U0FaRjtPQUhGLENBQUE7QUFBQSxNQWlCQSxPQUFBLEdBQWMsSUFBQSxPQUFBLENBQVEsT0FBUixDQWpCZCxDQUFBO0FBQUEsTUFrQkEsT0FBTyxDQUFDLE9BQVIsR0FBa0IsUUFsQmxCLENBQUE7QUFBQSxNQW1CQSxJQUFBLEdBQVcsSUFBQSxlQUFBLENBQWdCLE9BQWhCLENBbkJYLENBQUE7QUFBQSxNQW9CQSxJQUFJLENBQUMsWUFBTCxDQUFrQixNQUFsQixFQUEwQixNQUExQixDQXBCQSxDQUFBO2FBcUJBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLElBQUksQ0FBQyxPQUF6QixFQXRCUztJQUFBLENBQVgsQ0FMQSxDQUFBO0FBQUEsSUE2QkEsRUFBQSxDQUFHLFlBQUgsRUFBaUIsU0FBQSxHQUFBO2FBQ2YsTUFBQSxDQUFPLElBQUksQ0FBQyxPQUFaLENBQW9CLENBQUMsV0FBckIsQ0FBQSxFQURlO0lBQUEsQ0FBakIsQ0E3QkEsQ0FBQTtBQUFBLElBZ0NBLEVBQUEsQ0FBRyxtQkFBSCxFQUF3QixTQUFBLEdBQUE7YUFDdEIsTUFBQSxDQUFPLElBQUksQ0FBQyxJQUFMLENBQVUsY0FBVixDQUF5QixDQUFDLE1BQWpDLENBQXdDLENBQUMsSUFBekMsQ0FBOEMsRUFBOUMsRUFEc0I7SUFBQSxDQUF4QixDQWhDQSxDQUFBO0FBQUEsSUFtQ0EsRUFBQSxDQUFHLHdCQUFILEVBQTZCLFNBQUEsR0FBQTtBQUMzQixNQUFBLE1BQUEsQ0FBTyxJQUFJLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBaEMsQ0FBQSxDQUEwQyxDQUFDLE9BQTNDLENBQUEsQ0FBUCxDQUE0RCxDQUFDLElBQTdELENBQWtFLFFBQWxFLENBQUEsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBSSxDQUFDLElBQW5CLENBQXdCLFdBQXhCLENBQW9DLENBQUMsSUFBckMsQ0FBMEMsU0FBMUMsQ0FBUCxDQUE0RCxDQUFDLElBQTdELENBQWtFLElBQWxFLENBREEsQ0FBQTtBQUFBLE1BRUEsTUFBQSxDQUFPLElBQUksQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBSSxDQUFDLE9BQVEsQ0FBQSxDQUFBLENBQUUsQ0FBQyxhQUEzRCxDQUF5RSxDQUFDLElBQTFFLENBQStFLENBQS9FLENBRkEsQ0FBQTthQUdBLE1BQUEsQ0FBTyxJQUFJLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLElBQUksQ0FBQyxJQUFuQixDQUF3QixnQkFBeEIsQ0FBeUMsQ0FBQyxJQUExQyxDQUErQyxTQUEvQyxDQUFQLENBQWlFLENBQUMsSUFBbEUsQ0FBdUUsSUFBdkUsRUFKMkI7SUFBQSxDQUE3QixDQW5DQSxDQUFBO0FBQUEsSUF5Q0EsUUFBQSxDQUFTLFdBQVQsRUFBc0IsU0FBQSxHQUFBO0FBRXBCLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsSUFBSSxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxJQUFJLENBQUMsSUFBbkIsQ0FBd0IsV0FBeEIsQ0FBb0MsQ0FBQyxJQUFyQyxDQUEwQyxTQUExQyxFQUFxRCxLQUFyRCxDQUFBLENBQUE7ZUFDQSxJQUFJLENBQUMsSUFBTCxDQUFVLGNBQVYsQ0FBeUIsQ0FBQyxLQUExQixDQUFBLEVBRlM7TUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLE1BSUEsRUFBQSxDQUFHLDRCQUFILEVBQWlDLFNBQUEsR0FBQTtBQUMvQixZQUFBLFlBQUE7QUFBQSxRQUFBLEdBQUEsR0FBTSxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUssQ0FBQSxDQUFBLENBQWpDLENBQUE7QUFBQSxRQUNBLE9BQUEsR0FBVSxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUssQ0FBQSxDQUFBLENBRHJDLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxNQUFQLENBQWMsQ0FBQyxnQkFBZixDQUFBLENBRkEsQ0FBQTtBQUFBLFFBR0EsTUFBQSxDQUFPLE9BQVAsQ0FBZSxDQUFDLElBQWhCLENBQXFCLFFBQXJCLENBSEEsQ0FBQTtBQUFBLFFBSUEsTUFBQSxDQUFPLEdBQUcsQ0FBQyxPQUFYLENBQW1CLENBQUMsSUFBcEIsQ0FBeUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWpELENBSkEsQ0FBQTtBQUFBLFFBS0EsTUFBQSxDQUFPLEdBQUcsQ0FBQyxPQUFYLENBQW1CLENBQUMsSUFBcEIsQ0FBeUIsV0FBekIsQ0FMQSxDQUFBO0FBQUEsUUFNQSxNQUFBLENBQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFwQixDQUE2QixDQUFDLGFBQTlCLENBQUEsQ0FOQSxDQUFBO0FBQUEsUUFPQSxNQUFBLENBQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFsQixDQUEyQixDQUFDLE9BQTVCLENBQW9DLEVBQXBDLENBUEEsQ0FBQTtBQUFBLFFBUUEsTUFBQSxDQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBbEIsQ0FBMkIsQ0FBQyxPQUE1QixDQUFvQztVQUNsQztBQUFBLFlBQ0UsSUFBQSxFQUFNLFNBRFI7QUFBQSxZQUVFLE1BQUEsRUFDRTtBQUFBLGNBQUEsT0FBQSxFQUFTLFFBQVQ7YUFISjtXQURrQztTQUFwQyxDQVJBLENBQUE7QUFBQSxRQWVBLE1BQUEsQ0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUExQixDQUF3QyxDQUFDLElBQXpDLENBQThDLElBQTlDLENBZkEsQ0FBQTtlQWdCQSxNQUFBLENBQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFsQixDQUF5QixDQUFDLGFBQTFCLENBQUEsRUFqQitCO01BQUEsQ0FBakMsQ0FKQSxDQUFBO2FBdUJBLEVBQUEsQ0FBRywyQkFBSCxFQUFnQyxTQUFBLEdBQUE7ZUFDOUIsTUFBQSxDQUFPLE1BQVAsQ0FBYyxDQUFDLGdCQUFmLENBQUEsRUFEOEI7TUFBQSxDQUFoQyxFQXpCb0I7SUFBQSxDQUF0QixDQXpDQSxDQUFBO0FBQUEsSUFxRUEsUUFBQSxDQUFTLDZDQUFULEVBQXdELFNBQUEsR0FBQTtBQUN0RCxVQUFBLG1CQUFBO0FBQUEsTUFBQSxPQUFTLEVBQVQsRUFBQyxXQUFELEVBQUksV0FBSixDQUFBO0FBQUEsTUFFQSxPQUFBLEdBQVUsU0FBQyxRQUFELEdBQUE7QUFDUixRQUFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixhQUE5QixFQUFIO1FBQUEsQ0FBaEIsQ0FBQSxDQUFBO2VBQ0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtpQkFBRyxRQUFBLENBQUEsRUFBSDtRQUFBLENBQUwsRUFGUTtNQUFBLENBRlYsQ0FBQTtBQUFBLE1BTUEsRUFBQSxDQUFHLGlDQUFILEVBQXNDLFNBQUEsR0FBQTtlQUNwQyxPQUFBLENBQVEsU0FBQSxHQUFBO0FBQ04sVUFBQSxDQUFBLEdBQUksR0FBQSxDQUFBLE9BQUosQ0FBQTtBQUFBLFVBQ0EsQ0FBQSxHQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixDQUFuQixDQURKLENBQUE7QUFBQSxVQUVBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLENBQUMsQ0FBQyxPQUF0QixDQUZBLENBQUE7QUFBQSxVQUdBLE1BQUEsQ0FBTyxDQUFDLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBN0IsQ0FBQSxDQUF1QyxDQUFDLE9BQXhDLENBQUEsQ0FBUCxDQUF5RCxDQUFDLElBQTFELENBQStELEVBQS9ELENBSEEsQ0FBQTtpQkFJQSxNQUFBLENBQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFqQixDQUF5QixDQUFDLGFBQTFCLENBQUEsRUFMTTtRQUFBLENBQVIsRUFEb0M7TUFBQSxDQUF0QyxDQU5BLENBQUE7YUFjQSxFQUFBLENBQUcsaUNBQUgsRUFBc0MsU0FBQSxHQUFBO2VBQ3BDLE9BQUEsQ0FBUSxTQUFBLEdBQUE7QUFDTixVQUFBLE9BQU8sQ0FBQyxPQUFSLEdBQWtCLE1BQWxCLENBQUE7QUFBQSxVQUNBLENBQUEsR0FBUSxJQUFBLE9BQUEsQ0FBUSxPQUFSLENBRFIsQ0FBQTtBQUFBLFVBRUEsQ0FBQSxHQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixDQUFuQixDQUZKLENBQUE7QUFBQSxVQUdBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLENBQUMsQ0FBQyxPQUF0QixDQUhBLENBQUE7QUFBQSxVQUlBLE1BQUEsQ0FBTyxDQUFDLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBN0IsQ0FBQSxDQUF1QyxDQUFDLE9BQXhDLENBQUEsQ0FBUCxDQUF5RCxDQUFDLElBQTFELENBQStELFFBQS9ELENBSkEsQ0FBQTtpQkFLQSxNQUFBLENBQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFqQixDQUF5QixDQUFDLElBQTFCLENBQStCLFFBQS9CLEVBTk07UUFBQSxDQUFSLEVBRG9DO01BQUEsQ0FBdEMsRUFmc0Q7SUFBQSxDQUF4RCxDQXJFQSxDQUFBO1dBNkZBLFFBQUEsQ0FBUywrQkFBVCxFQUEwQyxTQUFBLEdBQUE7QUFFeEMsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsUUFBQSxJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBQSxHQUFXLElBQUEsZUFBQSxDQUFnQixPQUFoQixDQURYLENBQUE7QUFBQSxRQUVBLElBQUksQ0FBQyxZQUFMLENBQWtCLE1BQWxCLEVBQTBCLE1BQTFCLENBRkEsQ0FBQTtBQUFBLFFBR0EsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsQ0FBQyxTQUFELEVBQVksU0FBWixDQUFsQixDQUhBLENBQUE7ZUFJQSxPQUFPLENBQUMsV0FBUixDQUFvQixJQUFJLENBQUMsT0FBekIsRUFMUztNQUFBLENBQVgsQ0FBQSxDQUFBO2FBT0EsRUFBQSxDQUFHLDRDQUFILEVBQWlELFNBQUEsR0FBQTtBQUMvQyxRQUFBLE1BQUEsQ0FBTyxJQUFJLENBQUMsSUFBTCxDQUFVLGNBQVYsQ0FBeUIsQ0FBQyxNQUFqQyxDQUF3QyxDQUFDLElBQXpDLENBQThDLEVBQTlDLENBQUEsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLElBQUksQ0FBQyxZQUExQixDQUF1QyxDQUFDLGFBQXhDLENBQUEsRUFGK0M7TUFBQSxDQUFqRCxFQVR3QztJQUFBLENBQTFDLEVBOUY0QjtFQUFBLENBQTlCLENBSEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/build-tools/spec/command-edit-pane-spec.coffee
