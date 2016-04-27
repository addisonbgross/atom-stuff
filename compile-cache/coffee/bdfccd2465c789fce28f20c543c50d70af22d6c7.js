(function() {
  var Modelsim;

  module.exports = Modelsim = (function() {
    Modelsim.profile_name = 'Modelsim';

    Modelsim.prototype.scopes = ['source.vhdl', 'source.verilog'];

    Modelsim.prototype.default_extensions = ['vhd', 'vhdl', 'vho', 'v', 'sv', 'vh'];

    Modelsim.prototype.regex_string = '(?<type> Error|Warning):[ ](?<file> [\\S]+\\.(?extensions))\\((?<row> [\\d]+)\\):[ ](?<message> .+)$';

    Modelsim.prototype.file_string = '(?<file> [\\S]+\\.(?extensions))(\\((?<row> [\\d]+)\\))?';

    function Modelsim(output) {
      this.output = output;
      this.extensions = this.output.createExtensionString(this.scopes, this.default_extensions);
      this.regex = this.output.createRegex(this.regex_string, this.extensions);
      this.regex_file = this.output.createRegex(this.file_string, this.extensions);
    }

    Modelsim.prototype.files = function(line) {
      var m, out, start;
      start = 0;
      out = [];
      while ((m = this.regex_file.xexec(line.substr(start))) != null) {
        start += m.index;
        m.start = start;
        m.end = start + m.file.length + (m.row != null ? m.row.length + 1 : -1);
        if (m.row == null) {
          m.row = '0';
        }
        m.col = '0';
        start = m.end + 1;
        out.push(m);
      }
      return out;
    };

    Modelsim.prototype["in"] = function(line) {
      var m;
      if ((m = this.regex.xexec(line)) != null) {
        m.type = m.type.toLowerCase();
        this.output.print(m);
        return this.output.lint(m);
      }
    };

    return Modelsim;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3Byb2ZpbGVzL21vZGVsc2ltLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxRQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUNKLElBQUEsUUFBQyxDQUFBLFlBQUQsR0FBZSxVQUFmLENBQUE7O0FBQUEsdUJBRUEsTUFBQSxHQUFRLENBQUMsYUFBRCxFQUFpQixnQkFBakIsQ0FGUixDQUFBOztBQUFBLHVCQUlBLGtCQUFBLEdBQW9CLENBQUMsS0FBRCxFQUFRLE1BQVIsRUFBZ0IsS0FBaEIsRUFBdUIsR0FBdkIsRUFBNEIsSUFBNUIsRUFBa0MsSUFBbEMsQ0FKcEIsQ0FBQTs7QUFBQSx1QkFNQSxZQUFBLEdBQWMsc0dBTmQsQ0FBQTs7QUFBQSx1QkFVQSxXQUFBLEdBQWEsMERBVmIsQ0FBQTs7QUFjYSxJQUFBLGtCQUFFLE1BQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsVUFBRCxHQUFjLElBQUMsQ0FBQSxNQUFNLENBQUMscUJBQVIsQ0FBOEIsSUFBQyxDQUFBLE1BQS9CLEVBQXVDLElBQUMsQ0FBQSxrQkFBeEMsQ0FBZCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixDQUFvQixJQUFDLENBQUEsWUFBckIsRUFBbUMsSUFBQyxDQUFBLFVBQXBDLENBRFQsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVIsQ0FBb0IsSUFBQyxDQUFBLFdBQXJCLEVBQWtDLElBQUMsQ0FBQSxVQUFuQyxDQUZkLENBRFc7SUFBQSxDQWRiOztBQUFBLHVCQW1CQSxLQUFBLEdBQU8sU0FBQyxJQUFELEdBQUE7QUFDTCxVQUFBLGFBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxDQUFSLENBQUE7QUFBQSxNQUNBLEdBQUEsR0FBTSxFQUROLENBQUE7QUFFQSxhQUFNLHVEQUFOLEdBQUE7QUFDRSxRQUFBLEtBQUEsSUFBUyxDQUFDLENBQUMsS0FBWCxDQUFBO0FBQUEsUUFDQSxDQUFDLENBQUMsS0FBRixHQUFVLEtBRFYsQ0FBQTtBQUFBLFFBRUEsQ0FBQyxDQUFDLEdBQUYsR0FBUSxLQUFBLEdBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFmLEdBQXdCLENBQUksYUFBSCxHQUFlLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTixHQUFlLENBQTlCLEdBQXFDLENBQUEsQ0FBdEMsQ0FGaEMsQ0FBQTtBQUdBLFFBQUEsSUFBbUIsYUFBbkI7QUFBQSxVQUFBLENBQUMsQ0FBQyxHQUFGLEdBQVEsR0FBUixDQUFBO1NBSEE7QUFBQSxRQUlBLENBQUMsQ0FBQyxHQUFGLEdBQVEsR0FKUixDQUFBO0FBQUEsUUFLQSxLQUFBLEdBQVEsQ0FBQyxDQUFDLEdBQUYsR0FBUSxDQUxoQixDQUFBO0FBQUEsUUFNQSxHQUFHLENBQUMsSUFBSixDQUFTLENBQVQsQ0FOQSxDQURGO01BQUEsQ0FGQTthQVVBLElBWEs7SUFBQSxDQW5CUCxDQUFBOztBQUFBLHVCQWdDQSxLQUFBLEdBQUksU0FBQyxJQUFELEdBQUE7QUFDRixVQUFBLENBQUE7QUFBQSxNQUFBLElBQUcsb0NBQUg7QUFDRSxRQUFBLENBQUMsQ0FBQyxJQUFGLEdBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFQLENBQUEsQ0FBVCxDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsQ0FBYyxDQUFkLENBREEsQ0FBQTtlQUVBLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixDQUFhLENBQWIsRUFIRjtPQURFO0lBQUEsQ0FoQ0osQ0FBQTs7b0JBQUE7O01BRkosQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/profiles/modelsim.coffee
