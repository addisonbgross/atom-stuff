(function() {
  var Python;

  module.exports = Python = (function() {
    Python.profile_name = 'Python';

    Python.prototype.scopes = ['source.python'];

    Python.prototype.default_extensions = ['cpy', 'gyp', 'gypi', 'kv', 'py', 'pyw', 'rpy', 'SConscript', 'SConstruct', 'Sconstruct', 'sconstruct', 'Snakefile', 'tac', 'wsgi'];

    Python.prototype.file_string = 'File\\ "(?<file> [\\S]+\\.(?extensions))", \\ #File \n line\\ (?<row> [\\d]+) #Row \n';

    Python.prototype.message_begin = /^Traceback \(most recent call last\):$/;

    Python.prototype.trace = /^[\s]+(.+)$/;

    function Python(output) {
      this.output = output;
      this.extensions = this.output.createExtensionString(this.scopes, this.default_extensions);
      this.regex_file = this.output.createRegex(this.file_string, this.extensions);
    }

    Python.prototype.files = function(line) {
      var m, out, start;
      start = 0;
      out = [];
      while ((m = this.regex_file.xexec(line.substr(start))) != null) {
        start += m.index;
        m.start = start;
        m.end = start + m.file.length + m.row.length + 13;
        start = m.end + 1;
        m.col = '0';
        out.push(m);
      }
      return out;
    };

    Python.prototype["in"] = function(line) {
      var index, last, m, trace, _i, _len, _ref;
      if ((m = this.regex_file.xexec(line)) != null) {
        m.type = 'trace';
        this.prebuffer.push(m);
        this.traceback = true;
        return this.output.print({
          input: line,
          type: 'error'
        });
      } else if (this.traceback && ((m = this.trace.exec(line)) != null)) {
        last = this.prebuffer[this.prebuffer.length - 1];
        if (last == null) {
          this.output.print({
            input: line
          });
          return;
        }
        if (last.message == null) {
          last.message = m[1];
        }
        return this.output.print({
          input: line,
          type: 'error'
        });
      } else if ((m = this.message_begin.exec(line)) != null) {
        this.traceback = true;
        return this.output.print({
          input: line,
          type: 'error'
        });
      } else if (this.traceback && line !== '') {
        this.traceback = false;
        last = this.prebuffer[this.prebuffer.length - 1];
        if (last == null) {
          this.output.print({
            input: line
          });
          return;
        }
        last.trace = [];
        _ref = this.prebuffer.reverse();
        for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
          trace = _ref[index];
          last.trace.push(this.output.createMessage(trace));
          trace.message = line.trim();
          if (index !== 0) {
            this.output.lint(trace);
          }
        }
        this.prebuffer = [];
        last.type = 'error';
        last.message = line.trim();
        this.output.lint(last);
        return this.output.print({
          input: line,
          type: 'error'
        });
      } else {
        return this.output.print({
          input: line
        });
      }
    };

    Python.prototype.clear = function() {
      this.prebuffer = [];
      return this.traceback = false;
    };

    return Python;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3Byb2ZpbGVzL3B5dGhvbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsTUFBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFDSixJQUFBLE1BQUMsQ0FBQSxZQUFELEdBQWUsUUFBZixDQUFBOztBQUFBLHFCQUVBLE1BQUEsR0FBUSxDQUFDLGVBQUQsQ0FGUixDQUFBOztBQUFBLHFCQUlBLGtCQUFBLEdBQW9CLENBQUMsS0FBRCxFQUFRLEtBQVIsRUFBZSxNQUFmLEVBQXVCLElBQXZCLEVBQTZCLElBQTdCLEVBQW1DLEtBQW5DLEVBQTBDLEtBQTFDLEVBQWlELFlBQWpELEVBQStELFlBQS9ELEVBQTZFLFlBQTdFLEVBQTJGLFlBQTNGLEVBQXlHLFdBQXpHLEVBQXNILEtBQXRILEVBQTZILE1BQTdILENBSnBCLENBQUE7O0FBQUEscUJBTUEsV0FBQSxHQUFhLHVGQU5iLENBQUE7O0FBQUEscUJBV0EsYUFBQSxHQUFlLHdDQVhmLENBQUE7O0FBQUEscUJBYUEsS0FBQSxHQUFPLGFBYlAsQ0FBQTs7QUFlYSxJQUFBLGdCQUFFLE1BQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsVUFBRCxHQUFjLElBQUMsQ0FBQSxNQUFNLENBQUMscUJBQVIsQ0FBOEIsSUFBQyxDQUFBLE1BQS9CLEVBQXVDLElBQUMsQ0FBQSxrQkFBeEMsQ0FBZCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsVUFBRCxHQUFjLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixDQUFvQixJQUFDLENBQUEsV0FBckIsRUFBa0MsSUFBQyxDQUFBLFVBQW5DLENBRGQsQ0FEVztJQUFBLENBZmI7O0FBQUEs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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/profiles/python.coffee
