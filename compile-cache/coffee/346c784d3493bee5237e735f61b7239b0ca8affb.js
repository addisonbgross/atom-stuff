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
        return worker.environment.process.error('Test Error');
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
        worker.environment.process.exit(0);
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
        return expect(output.exitCommand).toHaveBeenCalledWith(null);
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
