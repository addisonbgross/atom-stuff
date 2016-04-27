(function() {
  var APMTest;

  module.exports = APMTest = (function() {
    APMTest.profile_name = 'apm test';

    APMTest.prototype.scopes = ['source.coffee', 'source.js'];

    APMTest.prototype.default_extensions = ['js', 'htc', '_js', 'es', 'es6', 'jsm', 'pjs', 'xsjs', 'xsjslib', 'coffee', 'Cakefile', 'coffee.erb', 'cson', '_coffee'];

    APMTest.prototype.error_string_file = '^ \n [\\s]+ #Indentation \n (?<message> .+) #Message \n \\.?\\s\\( #File \n (?<file> [\\S]+\\.(?extensions)): #File \n ((?<row> [\\d]+)(:(?<col> [\\d]+))?)? #Row and column \n \\) \n $';

    APMTest.prototype.error_string_nofile = '^ \n [\\s]+ #Indentation \n (?<message> .+) #Message \n $';

    APMTest.prototype.at_string = '^ \n [\\s]+ #Indentation \n at\\s #At \n (?<message> .*\\s)? #Reference \n \\(? #File begin \n (?<file> [\\S]+\\.(?extensions)): #File \n (?<row> [\\d]+)(:(?<col> [\\d]+))? #Row and column \n \\)? #File end \n $';

    APMTest.prototype.file_string = '(\\(|\")?(?<file> [\\S]+\\.(?extensions)): #File \n ((?<row> [\\d]+)(:(?<col> [\\d]+))?)? #Row and column \n';

    function APMTest(output) {
      this.output = output;
      this.extensions = this.output.createExtensionString(this.scopes, this.default_extensions);
      this.regex_at = this.output.createRegex(this.at_string, this.extensions);
      this.regex_error_file = this.output.createRegex(this.error_string_file, this.extensions);
      this.regex_error_nofile = this.output.createRegex(this.error_string_nofile, this.extensions);
      this.regex_file = this.output.createRegex(this.file_string, this.extensions);
    }

    APMTest.prototype.files = function(line) {
      var m, out, start;
      start = 0;
      out = [];
      while ((m = this.regex_file.xexec(line.substr(start))) != null) {
        start += m.index;
        start += (line[start] === '(' || line[start] === '"' ? 1 : 0);
        m.start = start;
        m.end = start + m.file.length + (m.row != null ? m.row.length + 1 : 0) + (m.col != null ? m.col.length : -1);
        start = m.end + 1;
        out.push(m);
      }
      return out;
    };

    APMTest.prototype["in"] = function(line) {
      var m, n;
      if ((m = this.regex_at.xexec(line)) != null) {
        if (this.lastMatch != null) {
          if (this.firstAt && (this.lastMatch.file == null)) {
            m.type = 'error';
            m.message = this.lastMatch.message;
            m.trace = [];
            this.lastMatch = m;
          } else {
            m.type = 'trace';
            m.highlighting = 'error';
            if ((m.message == null) || m.message.trim() !== '') {
              m.message = 'Referenced';
            }
            this.lastMatch.trace.push(this.output.createMessage(m));
            m.message = this.lastMatch.message;
            this.output.lint(m);
          }
          this.output.print(m);
          return this.firstAt = false;
        } else {
          return this.output.print(m);
        }
      } else if ((m = this.regex_error_nofile.xexec(line)) != null) {
        this.output.lint(this.lastMatch);
        if ((n = this.regex_error_file.xexec(line, this.regex_error_file)) != null) {
          m = n;
        }
        m.type = 'error';
        this.lastMatch = m;
        this.firstAt = true;
        this.output.print(m);
        return this.output.lint(m);
      } else {
        this.output.lint(this.lastMatch);
        this.firstAt = true;
        this.lastMatch = null;
        return this.output.print({
          input: line,
          type: 'error'
        });
      }
    };

    APMTest.prototype.clear = function() {
      this.lastMatch = null;
      return this.firstAt = true;
    };

    return APMTest;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3Byb2ZpbGVzL2FwbV90ZXN0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxPQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUNKLElBQUEsT0FBQyxDQUFBLFlBQUQsR0FBZSxVQUFmLENBQUE7O0FBQUEsc0JBRUEsTUFBQSxHQUFRLENBQUMsZUFBRCxFQUFrQixXQUFsQixDQUZSLENBQUE7O0FBQUEsc0JBSUEsa0JBQUEsR0FBb0IsQ0FBQyxJQUFELEVBQU8sS0FBUCxFQUFjLEtBQWQsRUFBcUIsSUFBckIsRUFBMkIsS0FBM0IsRUFBa0MsS0FBbEMsRUFBeUMsS0FBekMsRUFBZ0QsTUFBaEQsRUFBd0QsU0FBeEQsRUFBbUUsUUFBbkUsRUFBNkUsVUFBN0UsRUFBeUYsWUFBekYsRUFBdUcsTUFBdkcsRUFBK0csU0FBL0csQ0FKcEIsQ0FBQTs7QUFBQSxzQkFNQSxpQkFBQSxHQUFtQiwwTEFObkIsQ0FBQTs7QUFBQSxzQkFlQSxtQkFBQSxHQUFxQiwyREFmckIsQ0FBQTs7QUFBQSxzQkFvQkEsU0FBQSxHQUFXLHFOQXBCWCxDQUFBOztBQUFBLHNCQThCQSxXQUFBLEdBQWEsOEdBOUJiLENBQUE7O0FBbUNhLElBQUEsaUJBQUUsTUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsU0FBQSxNQUNiLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxxQkFBUixDQUE4QixJQUFDLENBQUEsTUFBL0IsRUFBdUMsSUFBQyxDQUFBLGtCQUF4QyxDQUFkLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFSLENBQW9CLElBQUMs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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/profiles/apm_test.coffee
