(function() {
  var AllSaver, Ansi, AnsiEnd, AnsiStart, RemoveANSIModifier;

  Ansi = /\x1b\[(\d[ABCDEFGJKST]|\d;\d[Hf]|[45]i|6n|[su]|\?25[lh]|[0-9;]*m)/g;

  AnsiStart = /^\x1b\[(\d[ABCDEFGJKST]|\d;\d[Hf]|[45]i|6n|[su]|\?25[lh]|[0-9;]*m)/;

  AnsiEnd = /\x1b\[?(\d?|\d?;?\d?|[45]?|6?|\??2?5?|[0-9;]*)$/;

  module.exports = {
    name: 'Remove ANSI Codes',
    edit: AllSaver = (function() {
      function AllSaver() {}

      AllSaver.prototype.get = function(command, stream) {
        command[stream].pipeline.push({
          name: 'remansi'
        });
        return null;
      };

      return AllSaver;

    })(),
    modifier: RemoveANSIModifier = (function() {
      function RemoveANSIModifier() {
        this.endsWithAnsi = null;
      }

      RemoveANSIModifier.prototype.destroy = function() {
        return this.endsWithAnsi = null;
      };

      RemoveANSIModifier.prototype.modify_raw = function(input) {
        var m, _part;
        input = input.replace(Ansi, '');
        if (this.endsWithAnsi != null) {
          _part = this.endsWithAnsi + input;
          if (AnsiStart.test(_part)) {
            input = _part.replace(Ansi, '');
            this.endsWithAnsi = null;
          } else {
            this.endsWithAnsi = _part;
            input = '';
          }
        }
        if ((m = AnsiEnd.exec(input)) != null) {
          this.endsWithAnsi = input.substr(m.index);
          input = input.substr(0, m.index);
        }
        return input;
      };

      return RemoveANSIModifier;

    })()
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3N0cmVhbS1tb2RpZmllcnMvcmVtYW5zaS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0RBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sb0VBQVAsQ0FBQTs7QUFBQSxFQUNBLFNBQUEsR0FBWSxvRUFEWixDQUFBOztBQUFBLEVBRUEsT0FBQSxHQUFVLGlEQUZWLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUVFO0FBQUEsSUFBQSxJQUFBLEVBQU0sbUJBQU47QUFBQSxJQUVBLElBQUEsRUFDUTs0QkFDSjs7QUFBQSx5QkFBQSxHQUFBLEdBQUssU0FBQyxPQUFELEVBQVUsTUFBVixHQUFBO0FBQ0gsUUFBQSxPQUFRLENBQUEsTUFBQSxDQUFPLENBQUMsUUFBUSxDQUFDLElBQXpCLENBQThCO0FBQUEsVUFBQSxJQUFBLEVBQU0sU0FBTjtTQUE5QixDQUFBLENBQUE7QUFDQSxlQUFPLElBQVAsQ0FGRztNQUFBLENBQUwsQ0FBQTs7c0JBQUE7O1FBSko7QUFBQSxJQVFBLFFBQUEsRUFDUTtBQUVTLE1BQUEsNEJBQUEsR0FBQTtBQUNYLFFBQUEsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFBaEIsQ0FEVztNQUFBLENBQWI7O0FBQUEsbUNBR0EsT0FBQSxHQUFTLFNBQUEsR0FBQTtlQUNQLElBQUMsQ0FBQSxZQUFELEdBQWdCLEtBRFQ7TUFBQSxDQUhULENBQUE7O0FBQUEsbUNBTUEsVUFBQSxHQUFZLFNBQUMsS0FBRCxHQUFBO0FBQ1YsWUFBQSxRQUFBO0FBQUEsUUFBQSxLQUFBLEdBQVEsS0FBSyxDQUFDLE9BQU4sQ0FBYyxJQUFkLEVBQW9CLEVBQXBCLENBQVIsQ0FBQTtBQUNBLFFBQUEsSUFBRyx5QkFBSDtBQUNFLFVBQUEsS0FBQSxHQUFRLElBQUMsQ0FBQSxZQUFELEdBQWdCLEtBQXhCLENBQUE7QUFDQSxVQUFBLElBQUcsU0FBUyxDQUFDLElBQVYsQ0FBZSxLQUFmLENBQUg7QUFDRSxZQUFBLEtBQUEsR0FBUSxLQUFLLENBQUMsT0FBTixDQUFjLElBQWQsRUFBb0IsRUFBcEIsQ0FBUixDQUFBO0FBQUEsWUFDQSxJQUFDLENBQUEsWUFBRCxHQUFnQixJQURoQixDQURGO1dBQUEsTUFBQTtBQUlFLFlBQUEsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsS0FBaEIsQ0FBQTtBQUFBLFlBQ0EsS0FBQSxHQUFRLEVBRFIsQ0FKRjtXQUZGO1NBREE7QUFTQSxRQUFBLElBQUcsaUNBQUg7QUFDRSxVQUFBLElBQUMsQ0FBQSxZQUFELEdBQWdCLEtBQUssQ0FBQyxNQUFOLENBQWEsQ0FBQyxDQUFDLEtBQWYsQ0FBaEIsQ0FBQTtBQUFBLFVBQ0EsS0FBQSxHQUFRLEtBQUssQ0FBQyxNQUFOLENBQWEsQ0FBYixFQUFnQixDQUFDLENBQUMsS0FBbEIsQ0FEUixDQURGO1NBVEE7QUFZQSxlQUFPLEtBQVAsQ0FiVTtNQUFBLENBTlosQ0FBQTs7Z0NBQUE7O1FBWEo7R0FORixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/stream-modifiers/remansi.coffee
