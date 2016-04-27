(function() {
  var Command, CommandWorker, _command;

  CommandWorker = require('../lib/pipeline/command-worker');

  Command = require('../lib/provider/command');

  _command = {
    name: '',
    command: '',
    wd: '.',
    stdout: {
      highlighting: 'nh'
    },
    stderr: {
      highlighting: 'ha'
    },
    version: 1
  };

  describe('Command Worker', function() {
    var command, output, promise, worker;
    worker = null;
    output = null;
    command = null;
    promise = null;
    beforeEach(function() {
      command = new Command(_command);
      output = {
        newQueue: jasmine.createSpy('newQueue'),
        newCommand: jasmine.createSpy('newCommand'),
        exitCommand: jasmine.createSpy('exitCommand'),
        exitQueue: jasmine.createSpy('exitQueue'),
        stdout_in: jasmine.createSpy('stdout_in'),
        stdout_setType: jasmine.createSpy('stdout_setType'),
        stderr_in: jasmine.createSpy('stderr_in'),
        stderr_setType: jasmine.createSpy('stderr_setType'),
        stderr_print: jasmine.createSpy('stderr_setType'),
        stderr_linter: jasmine.createSpy('stderr_linter'),
        error: jasmine.createSpy('error')
      };
      command.project = atom.project.getPaths()[0];
      worker = new CommandWorker(command, [output]);
      return promise = worker.run();
    });
    afterEach(function() {
      return worker.destroy();
    });
    it('calls newCommand of all outputs', function() {
      return expect(output.newCommand).toHaveBeenCalledWith(command);
    });
    describe('on input', function() {
      beforeEach(function() {
        return worker.manager.stdout["in"]('Hello World\n');
      });
      return it('calls stdout.in of all outputs', function() {
        return expect(output.stdout_in).toHaveBeenCalledWith({
          input: 'Hello World',
          files: []
        });
      });
    });
    describe('on error', function() {
      beforeEach(function() {
        return worker.process.error('Test Error');
      });
      it('calls error of all outputs', function() {
        return expect(output.error).toHaveBeenCalledWith('Test Error');
      });
      return it('does not call exitCommand', function() {
        return expect(output.exitCommand).not.toHaveBeenCalled();
      });
    });
    describe('on finish', function() {
      beforeEach(function() {
        worker.process.exit(0);
        return waitsForPromise(function() {
          return promise;
        });
      });
      it('calls exitCommand of all outputs', function() {
        return promise.then(function() {
          return expect(output.exitCommand).toHaveBeenCalledWith(0);
        });
      });
      return it('calls the finish callback', function() {
        return promise.then(function(finish) {
          return expect(finish).toBe(0);
        });
      });
    });
    return describe('on stop', function() {
      beforeEach(function() {
        worker.kill();
        return waitsForPromise(function() {
          return promise;
        });
      });
      it('does not call exitCommand', function() {
        return expect(output.exitCommand).not.toHaveBeenCalled();
      });
      return it('calls the finish callback', function() {
        return promise.then(function(finish) {
          return expect(finish).toBe(null);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvc3BlYy9jb21tYW5kLXdvcmtlci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnQ0FBQTs7QUFBQSxFQUFBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGdDQUFSLENBQWhCLENBQUE7O0FBQUEsRUFDQSxPQUFBLEdBQVUsT0FBQSxDQUFRLHlCQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsR0FDRTtBQUFBLElBQUEsSUFBQSxFQUFNLEVBQU47QUFBQSxJQUNBLE9BQUEsRUFBUyxFQURUO0FBQUEsSUFFQSxFQUFBLEVBQUksR0FGSjtBQUFBLElBR0EsTUFBQSxFQUNFO0FBQUEsTUFBQSxZQUFBLEVBQWMsSUFBZDtLQUpGO0FBQUEsSUFLQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLFlBQUEsRUFBYyxJQUFkO0tBTkY7QUFBQSxJQU9BLE9BQUEsRUFBUyxDQVBUO0dBSkYsQ0FBQTs7QUFBQSxFQWFBLFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBLEdBQUE7QUFDekIsUUFBQSxnQ0FBQTtBQUFBLElBQUEsTUFBQSxHQUFTLElBQVQsQ0FBQTtBQUFBLElBQ0EsTUFBQSxHQUFTLElBRFQsQ0FBQTtBQUFBLElBRUEsT0FBQSxHQUFVLElBRlYsQ0FBQTtBQUFBLElBR0EsT0FBQSxHQUFVLElBSFYsQ0FBQTtBQUFBLElBS0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsT0FBQSxHQUFjLElBQUEsT0FBQSxDQUFRLFFBQVIsQ0FBZCxDQUFBO0FBQUEsTUFDQSxNQUFBLEdBQ0U7QUFBQSxRQUFBLFFBQUEsRUFBVSxPQUFPLENBQUMsU0FBUixDQUFrQixVQUFsQixDQUFWO0FBQUEsUUFDQSxVQUFBLEVBQVksT0FBTyxDQUFDLFNBQVIsQ0FBa0Is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

//# sourceURL=/home/champ/.atom/packages/build-tools/spec/command-worker-spec.coffee
