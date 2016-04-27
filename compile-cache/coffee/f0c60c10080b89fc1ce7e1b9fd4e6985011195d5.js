(function() {
  var GCCClang;

  module.exports = GCCClang = (function() {
    GCCClang.profile_name = 'GCC/Clang';

    GCCClang.prototype.scopes = ['source.c++', 'source.cpp', 'source.c', 'source.arduino', 'source.ino'];

    GCCClang.prototype.default_extensions = ['cc', 'cpp', 'cp', 'cxx', 'c++', 'cu', 'cuh', 'h', 'hh', 'hpp', 'hxx', 'h++', 'inl', 'ipp', 'tcc', 'tpp', 'c', 'h', 'ino', 'pde'];

    GCCClang.prototype.regex_string = '(?<file> [\\S]+\\.(?extensions)): #File \n ((?<row> [\\d]+)(:(?<col> [\\d]+))?)? #Row and column \n :\\s(fatal \\s)? (?<type> error|warning|note): \n [\\s]* (?<message> [\\S\\s]+) #Type and Message \n';

    GCCClang.prototype.regex_end = /^[\^\s~]+$/;

    GCCClang.prototype.file_string = '(?<file> [\\S]+\\.(?extensions)): #File \n ((?<row> [\\d]+)(:(?<col> [\\d]+))?)? #Row and column \n';

    function GCCClang(output) {
      this.output = output;
      this.extensions = this.output.createExtensionString(this.scopes, this.default_extensions);
      this.regex = this.output.createRegex(this.regex_string, this.extensions);
      this.regex_file = this.output.createRegex(this.file_string, this.extensions);
    }

    GCCClang.prototype.files = function(line) {
      var m, out, start;
      start = 0;
      out = [];
      while ((m = this.regex_file.xexec(line.substr(start))) != null) {
        start += m.index;
        m.start = start;
        m.end = start + m.file.length + (m.row != null ? m.row.length + 1 : 0) + (m.col != null ? m.col.length : -1);
        start = m.end + 1;
        out.push(m);
      }
      return out;
    };

    GCCClang.prototype["in"] = function(line) {
      var m, out, _i, _len, _ref;
      if ((m = this.regex.xexec(line)) != null) {
        this.status = m.type;
        out = [];
        m.trace = [];
        _ref = this.prebuffer;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          line = _ref[_i];
          line.type = 'trace';
          line.highlighting = this.status;
          line.message = m.message;
          out.push(line);
          this.output.lint(line);
          line.message = 'Referenced';
          if ((line != null) && (line.file != null) && (line.row != null) && (line.type != null) && (line.message != null)) {
            m.trace.push(this.output.createMessage(line));
          }
        }
        this.output.replacePrevious(out);
        this.prebuffer = [];
        this.output.print(m);
        return this.output.lint(m);
      } else if (this.regex_end.test(line)) {
        this.output.print({
          input: line,
          type: this.status
        });
        return this.status = null;
      } else if (this.status != null) {
        return this.output.print({
          input: line,
          type: this.status
        });
      } else {
        if ((m = this.regex_file.xexec(line)) != null) {
          this.prebuffer.push(m);
        } else {
          this.prebuffer.push({
            input: line
          });
        }
        return this.output.print({
          input: line
        });
      }
    };

    GCCClang.prototype.clear = function() {
      this.status = null;
      return this.prebuffer = [];
    };

    return GCCClang;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3Byb2ZpbGVzL2djY19jbGFuZy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsUUFBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFDSixJQUFBLFFBQUMsQ0FBQSxZQUFELEdBQWUsV0FBZixDQUFBOztBQUFBLHVCQUVBLE1BQUEsR0FBUSxDQUFDLFlBQUQsRUFBZSxZQUFmLEVBQTZCLFVBQTdCLEVBQXlDLGdCQUF6QyxFQUEyRCxZQUEzRCxDQUZSLENBQUE7O0FBQUEsdUJBSUEsa0JBQUEsR0FBb0IsQ0FBQyxJQUFELEVBQU8sS0FBUCxFQUFjLElBQWQsRUFBb0IsS0FBcEIsRUFBMkIsS0FBM0IsRUFBa0MsSUFBbEMsRUFBd0MsS0FBeEMsRUFBK0MsR0FBL0MsRUFBb0QsSUFBcEQsRUFBMEQsS0FBMUQsRUFBaUUsS0FBakUsRUFBd0UsS0FBeEUsRUFBK0UsS0FBL0UsRUFBc0YsS0FBdEYsRUFBNkYsS0FBN0YsRUFBb0csS0FBcEcsRUFBMkcsR0FBM0csRUFBZ0gsR0FBaEgsRUFBcUgsS0FBckgsRUFBNEgsS0FBNUgsQ0FKcEIsQ0FBQTs7QUFBQSx1QkFNQSxZQUFBLEdBQWMsME1BTmQsQ0FBQTs7QUFBQSx1QkFhQSxTQUFBLEdBQVcsWUFiWCxDQUFBOztBQUFBLHVCQWVBLFdBQUEsR0FBYSxxR0FmYixDQUFBOztBQW9CYSxJQUFBLGtCQUFFLE1BQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsVUFBRCxHQUFjLElBQUMsQ0FBQSxNQUFNLENBQUMscUJBQVIsQ0FBOEIsSUFBQyxDQUFBLE1BQS9CLEVBQXVDLElBQUMsQ0FBQSxrQkFBeEMsQ0FBZCxDQUFBO0FB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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/profiles/gcc_clang.coffee
