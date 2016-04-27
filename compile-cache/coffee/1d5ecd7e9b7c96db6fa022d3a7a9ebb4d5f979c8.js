(function() {
  var Java;

  module.exports = Java = (function() {
    Java.profile_name = 'Java';

    Java.prototype.scopes = ['source.java'];

    Java.prototype.default_extensions = ['java', 'bsh'];

    Java.prototype.regex_string = '(?<file> [\\S]+\\.(?extensions)): #File \n (?<row> [\\d]+)? #Row \n :\\s(?<type> error|warning): \n [\\s]* (?<message> [\\S\\s]+) #Type and Message \n';

    Java.prototype.file_string = '(?<file> [\\S]+\\.(?extensions)): #File \n (?<row> [\\d]+)? #Row\n';

    function Java(output) {
      this.output = output;
      this.extensions = this.output.createExtensionString(this.scopes, this.default_extensions);
      this.regex = this.output.createRegex(this.regex_string, this.extensions);
      this.regex_file = this.output.createRegex(this.file_string, this.extensions);
    }

    Java.prototype.files = function(line) {
      var m, out, start;
      start = 0;
      out = [];
      while ((m = this.regex_file.xexec(line.substr(start))) != null) {
        start += m.index;
        m.start = start;
        m.end = start + m.file.length + (m.row != null ? m.row.length : 0);
        if (m.row == null) {
          m.row = '0';
        }
        m.col = '0';
        start = m.end + 1;
        out.push(m);
      }
      return out;
    };

    Java.prototype["in"] = function(line) {
      var m;
      if ((m = this.regex.xexec(line)) != null) {
        this.status = m.type;
        this.laststatus = this.status;
        this.output.print(m);
        return this.output.lint(m);
      } else if (/\s+\^\s*/.test(line)) {
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
      } else if (/required|found|reason|symbol|location/.test(line)) {
        return this.output.print({
          input: line,
          type: this.laststatus
        });
      } else {
        return this.output.print({
          input: line
        });
      }
    };

    Java.prototype.clear = function() {
      this.status = null;
      return this.laststatus = null;
    };

    return Java;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3Byb2ZpbGVzL2phdmFjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxJQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUNKLElBQUEsSUFBQyxDQUFBLFlBQUQsR0FBZSxNQUFmLENBQUE7O0FBQUEsbUJBRUEsTUFBQSxHQUFRLENBQUMsYUFBRCxDQUZSLENBQUE7O0FBQUEsbUJBSUEsa0JBQUEsR0FBb0IsQ0FBQyxNQUFELEVBQVMsS0FBVCxDQUpwQixDQUFBOztBQUFBLG1CQU1BLFlBQUEsR0FBYyx3SkFOZCxDQUFBOztBQUFBLG1CQWFBLFdBQUEsR0FBYSxvRUFiYixDQUFBOztBQWtCYSxJQUFBLGNBQUUsTUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsU0FBQSxNQUNiLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxxQkFBUixDQUE4QixJQUFDLENBQUEsTUFBL0IsRUFBdUMsSUFBQyxDQUFBLGtCQUF4QyxDQUFkLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFSLENBQW9CLElBQUMsQ0FBQSxZQUFyQixFQUFtQyxJQUFDLENBQUEsVUFBcEMsQ0FEVCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsVUFBRCxHQUFjLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixDQUFvQixJQUFDLENBQUEsV0FBckIsRUFBa0MsSUFBQyxDQUFBLFVBQW5DLENBRmQsQ0FEVztJQUFBLENBbEJiOztBQUFBLG1CQXVCQSxLQUFBLEdBQU8sU0FBQyxJQUFELEdBQUE7QUFDTCxVQUFBLGFBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxDQUFSLENBQUE7QUFBQSxNQUNBLEdBQUEsR0FBTSxFQUROLENBQUE7QUFFQSxhQUFNLHVEQUFOLEdBQUE7QUFDRSxRQUFBLEtBQUEsSUFBUyxDQUFDLENBQUMsS0FBWCxDQUFBO0FBQUEsUUFDQSxDQUFDLENBQUMsS0FBRixHQUFVLEtBRFYsQ0FBQTtBQUFBLFFBRUEsQ0FBQyxDQUFDLEdBQUYsR0FBUSxLQUFBLEdBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFmLEdBQXdCLENBQUksYUFBSCxHQUFlLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBckIsR0FBaUMsQ0FBbEMsQ0FGaEMsQ0FBQTtBQUdBLFFBQUEsSUFBbUIsYUFBbkI7QUFBQSxVQUFBLENBQUMsQ0FBQyxHQUFGLEdBQVEsR0FBUixDQUFBO1NBSEE7QUFBQSxRQUlBLENBQUMsQ0FBQyxHQUFGLEdBQVEsR0FKUixDQUFBO0FBQUEsUUFLQSxLQUFBLEdBQVEsQ0FBQyxDQUFDLEdBQUYsR0FBUSxDQUxoQixDQUFBO0FBQUEsUUFNQSxHQUFHLENBQUMsSUFBSixDQUFTLENBQVQsQ0FOQSxDQURGO01BQUEsQ0FGQTthQVVBLElBWEs7SUFBQSxDQXZCUCxDQUFBOztBQUFBLG1CQW9DQSxLQUFBLEdBQUksU0FBQyxJQUFELEdBQUE7QUFDRixVQUFBLENBQUE7QUFBQSxNQUFBLElBQUcsb0NBQUg7QUFDRSxRQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsQ0FBQyxDQUFDLElBQVosQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFDLENBQUEsTUFEZixDQUFBO0FBQUEsUUFFQSxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsQ0FBYyxDQUFkLENBRkEsQ0FBQTtlQUdBLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixDQUFhLENBQWIsRUFKRjtPQUFBLE1BS0ssSUFBRyxVQUFVLENBQUMsSUFBWCxDQUFnQixJQUFoQixDQUFIO0FBQ0gsUUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsQ0FBYztBQUFBLFVBQUEsS0FBQSxFQUFPLElBQVA7QUFBQSxVQUFhLElBQUEsRUFBTSxJQUFDLENBQUEsTUFBcEI7U0FBZCxDQUFBLENBQUE7ZUFDQSxJQUFDLENBQUEsTUFBRCxHQUFVLEtBRlA7T0FBQSxNQUdBLElBQUcsbUJBQUg7ZUFDSCxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsQ0FBYztBQUFBLFVBQUEsS0FBQSxFQUFPLElBQVA7QUFBQSxVQUFhLElBQUEsRUFBTSxJQUFDLENBQUEsTUFBcEI7U0FBZCxFQURHO09BQUEsTUFFQSxJQUFHLHVDQUF1QyxDQUFDLElBQXhDLENBQTZDLElBQTdDLENBQUg7ZUFDSCxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsQ0FBYztBQUFBLFVBQUEsS0FBQSxFQUFPLElBQVA7QUFBQSxVQUFhLElBQUEsRUFBTSxJQUFDLENBQUEsVUFBcEI7U0FBZCxFQURHO09BQUEsTUFBQTtlQUdILElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixDQUFjO0FBQUEsVUFBQSxLQUFBLEVBQU8sSUFBUDtTQUFkLEVBSEc7T0FYSDtJQUFBLENBcENKLENBQUE7O0FBQUEsbUJBb0RBLEtBQUEsR0FBTyxTQUFBLEdBQUE7QUFDTCxNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBVixDQUFBO2FBQ0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxLQUZUO0lBQUEsQ0FwRFAsQ0FBQTs7Z0JBQUE7O01BRkosQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/profiles/javac.coffee
