(function() {
  var OutputInterface, OutputStream;

  OutputStream = require('./output-stream');

  module.exports = OutputInterface = (function() {
    function OutputInterface(outputs, stdin, stdout, stderr) {
      var output, _i, _len, _ref;
      this.outputs = outputs;
      this.stdin = stdin;
      this.stdout = stdout;
      this.stderr = stderr;
      _ref = this.outputs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        output = _ref[_i];
        this.stdout.subscribeToCommands(output, 'stdout_new', 'new');
        this.stdout.subscribeToCommands(output, 'stdout_raw', 'raw');
        this.stdout.subscribeToCommands(output, 'stdout_in', 'input');
        this.stderr.subscribeToCommands(output, 'stderr_new', 'new');
        this.stderr.subscribeToCommands(output, 'stderr_raw', 'raw');
        this.stderr.subscribeToCommands(output, 'stderr_in', 'input');
        if (this.stdout.highlighting !== 'nh') {
          this.stdout.subscribeToCommands(output, 'stdout_setType', 'setType');
          if ((this.stdout.profile != null) || (this.stdout.regex != null)) {
            this.stdout.subscribeToCommands(output, 'stdout_replacePrevious', 'replacePrevious');
            this.stdout.subscribeToCommands(output, 'stdout_print', 'print');
            this.stdout.subscribeToCommands(output, 'stdout_linter', 'linter');
          }
        }
        if (this.stderr.highlighting !== 'nh') {
          this.stderr.subscribeToCommands(output, 'stderr_setType', 'setType');
          if ((this.stderr.profile != null) || (this.stderr.regex != null)) {
            this.stderr.subscribeToCommands(output, 'stderr_replacePrevious', 'replacePrevious');
            this.stderr.subscribeToCommands(output, 'stderr_print', 'print');
            this.stderr.subscribeToCommands(output, 'stderr_linter', 'linter');
          }
        }
      }
    }

    OutputInterface.prototype.initialize = function(command) {
      var output, _i, _len, _ref, _results;
      _ref = this.outputs;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        output = _ref[_i];
        if (typeof output.newCommand === "function") {
          output.newCommand(command);
        }
        if (typeof output.setInput === "function") {
          output.setInput(this.stdin.write);
        }
        if (output.onInput != null) {
          _results.push(this.stdin.onWrite(output.onInput));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    OutputInterface.prototype.finish = function(exitcode) {
      var output, _i, _len, _ref, _results;
      this.stdout.flush();
      this.stderr.flush();
      _ref = this.outputs;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        output = _ref[_i];
        _results.push(typeof output.exitCommand === "function" ? output.exitCommand(exitcode) : void 0);
      }
      return _results;
    };

    OutputInterface.prototype.error = function(error) {
      var output, _i, _len, _ref, _results;
      _ref = this.outputs;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        output = _ref[_i];
        _results.push(typeof output.error === "function" ? output.error(error) : void 0);
      }
      return _results;
    };

    return OutputInterface;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3BpcGVsaW5lL291dHB1dC1pbnRlcmZhY2UuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZCQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQUFmLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBRVMsSUFBQSx5QkFBRSxPQUFGLEVBQVksS0FBWixFQUFvQixNQUFwQixFQUE2QixNQUE3QixHQUFBO0FBQ1gsVUFBQSxzQkFBQTtBQUFBLE1BRFksSUFBQyxDQUFBLFVBQUEsT0FDYixDQUFBO0FBQUEsTUFEc0IsSUFBQyxDQUFBLFFBQUEsS0FDdkIsQ0FBQTtBQUFBLE1BRDhCLElBQUMsQ0FBQSxTQUFBLE1BQy9CLENBQUE7QUFBQSxNQUR1QyxJQUFDLENBQUEsU0FBQSxNQUN4QyxDQUFBO0FBQUE7QUFBQSxXQUFBLDJDQUFBOzBCQUFBO0FBQ0UsUUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLG1CQUFSLENBQTRCLE1BQTVCLEVBQW9DLFlBQXBDLEVBQWtELEtBQWxELENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxtQkFBUixDQUE0QixNQUE1QixFQUFvQyxZQUFwQyxFQUFrRCxLQUFsRCxDQURBLENBQUE7QUFBQSxRQUVBLElBQUMsQ0FBQSxNQUFNLENBQUMsbUJBQVIsQ0FBNEIsTUFBNUIsRUFBb0MsV0FBcEMsRUFBaUQsT0FBakQsQ0FGQSxDQUFBO0FBQUEsUUFJQSxJQUFDLENBQUEsTUFBTSxDQUFDLG1CQUFSLENBQTRCLE1BQTVCLEVBQW9DLFlBQXBDLEVBQWtELEtBQWxELENBSkEsQ0FBQTtBQUFBLFFBS0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxtQkFBUixDQUE0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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/pipeline/output-interface.coffee
