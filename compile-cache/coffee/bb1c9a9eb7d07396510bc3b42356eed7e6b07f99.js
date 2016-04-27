(function() {
  var InputStream, OutputInterface, OutputManager, OutputStream, Outputs;

  InputStream = require('./input-stream');

  OutputStream = require('./output-stream');

  OutputInterface = require('./output-interface');

  Outputs = require('../output/output');

  module.exports = OutputManager = (function() {
    function OutputManager(command, outputs) {
      this.command = command;
      this.outputs = outputs;
      this.stdin = new InputStream;
      this.stdout = new OutputStream(this.command, this.command.stdout);
      this.stderr = new OutputStream(this.command, this.command.stderr);
      this.stdin.onWrite((function(_this) {
        return function(text) {
          return _this.stdout["in"](text);
        };
      })(this));
      this["interface"] = new OutputInterface(this.outputs, this.stdin, this.stdout, this.stderr);
      this["interface"].initialize(this.command);
    }

    OutputManager.prototype.setInput = function(input) {
      return this.stdin.setInput(input);
    };

    OutputManager.prototype.destroy = function() {
      this.stdin.destroy();
      this.stdout.destroy();
      return this.stderr.destroy();
    };

    OutputManager.prototype.finish = function(exitcode) {
      return this["interface"].finish(exitcode);
    };

    OutputManager.prototype.error = function(error) {
      return this["interface"].error(error);
    };

    return OutputManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3BpcGVsaW5lL2lvLW1hbmFnZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtFQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQUFkLENBQUE7O0FBQUEsRUFDQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGlCQUFSLENBRGYsQ0FBQTs7QUFBQSxFQUVBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLG9CQUFSLENBRmxCLENBQUE7O0FBQUEsRUFHQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGtCQUFSLENBSFYsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFFUyxJQUFBLHVCQUFFLE9BQUYsRUFBWSxPQUFaLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxVQUFBLE9BQ2IsQ0FBQTtBQUFBLE1BRHNCLElBQUMsQ0FBQSxVQUFBLE9BQ3ZCLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsR0FBQSxDQUFBLFdBQVQsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE1BQUQsR0FBYyxJQUFBLFlBQUEsQ0FBYSxJQUFDLENBQUEsT0FBZCxFQUF1QixJQUFDLENBQUEsT0FBTyxDQUFDLE1BQWhDLENBRGQsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLE1BQUQsR0FBYyxJQUFBLFlBQUEsQ0FBYSxJQUFDLENBQUEsT0FBZCxFQUF1QixJQUFDLENBQUEsT0FBTyxDQUFDLE1BQWhDLENBRmQsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxPQUFQLENBQWUsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsSUFBRCxHQUFBO2lCQUNiLEtBQUMsQ0FBQSxNQUFNLENBQUMsSUFBRCxDQUFQLENBQVcsSUFBWCxFQURhO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZixDQUpBLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxXQUFBLENBQUQsR0FBaUIsSUFBQSxlQUFBLENBQWdCLElBQUMsQ0FBQSxPQUFqQixFQUEwQixJQUFDLENBQUEsS0FBM0IsRUFBa0MsSUFBQyxDQUFBLE1BQW5DLEVBQTJDLElBQUMsQ0FBQSxNQUE1QyxDQVBqQixDQUFBO0FBQUEsTUFRQSxJQUFDLENBQUEsV0FBQSxDQUFTLENBQUMsVUFBWCxDQUFzQixJQUFDLENBQUEsT0FBdkIsQ0FSQSxDQURXO0lBQUEsQ0FBYjs7QUFBQSw0QkFXQSxRQUFBLEdBQVUsU0FBQyxLQUFELEdBQUE7YUFDUixJQUFDLENBQUEsS0FBSyxDQUFDLFFBQVAsQ0FBZ0IsS0FBaEIsRUFEUTtJQUFBLENBWFYsQ0FBQTs7QUFBQSw0QkFjQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQVAsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFBLENBREEsQ0FBQTthQUVBLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFBLEVBSE87SUFBQSxDQWRULENBQUE7O0FBQUEsNEJBbUJBLE1BQUEsR0FBUSxTQUFDLFFBQUQsR0FBQTthQUNOLElBQUMsQ0FBQSxXQUFBLENBQVMsQ0FBQyxNQUFYLENBQWtCLFFBQWxCLEVBRE07SUFBQSxDQW5CUixDQUFBOztBQUFBLDRCQXNCQSxLQUFBLEdBQU8sU0FBQyxLQUFELEdBQUE7YUFDTCxJQUFDLENBQUEsV0FBQSxDQUFTLENBQUMsS0FBWCxDQUFpQixLQUFqQixFQURLO0lBQUEsQ0F0QlAsQ0FBQTs7eUJBQUE7O01BUkosQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/pipeline/io-manager.coffee
