(function() {
  var Codepoint;

  module.exports = Codepoint = (function() {
    function Codepoint(_arg) {
      this.filepath = _arg.filepath, this.marker = _arg.marker, this.line = _arg.line, this.stackdepth = _arg.stackdepth;
      if (this.marker) {
        this.syncLineFromMarker();
      }
      if (!this.stackdepth) {
        this.stackdepth = -1;
      }
    }

    Codepoint.prototype.getPath = function() {
      return this.filepath;
    };

    Codepoint.prototype.getMarker = function() {
      return this.marker;
    };

    Codepoint.prototype.getStackDepth = function() {
      return this.stackdepth;
    };

    Codepoint.prototype.setMarker = function(marker) {
      if (this.marker) {
        this.marker.destroy();
      }
      this.marker = marker;
      return void 0;
    };

    Codepoint.prototype.syncLineFromMarker = function() {
      return this.line = this.marker.getStartBufferPosition().row + 1;
    };

    Codepoint.prototype.getLine = function() {
      if (this.marker) {
        return this.marker.getStartBufferPosition().row + 1;
      }
      return this.line;
    };

    Codepoint.prototype.isLessThan = function(other) {
      if (!other instanceof Codepoint) {
        return true;
      }
      if (other.getPath() < this.getPath()) {
        return true;
      }
      if (other.getLine() < this.getLine()) {
        return true;
      }
    };

    Codepoint.prototype.isEqual = function(other) {
      if (!other instanceof Codepoint) {
        return false;
      }
      if (other.getPath() !== this.getPath()) {
        return false;
      }
      if (other.getLine() !== this.getLine()) {
        return false;
      }
      return true;
    };

    Codepoint.prototype.isGreaterThan = function(other) {
      return !this.isLessThan(other) && !this.isEqual(other);
    };

    Codepoint.fromMarker = function(marker) {};

    return Codepoint;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGhwLWRlYnVnL2xpYi9tb2RlbHMvY29kZXBvaW50LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxTQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVTLElBQUEsbUJBQUMsSUFBRCxHQUFBO0FBQ1gsTUFEYSxJQUFDLENBQUEsZ0JBQUEsVUFBVSxJQUFDLENBQUEsY0FBQSxRQUFRLElBQUMsQ0FBQSxZQUFBLE1BQU0sSUFBQyxDQUFBLGtCQUFBLFVBQ3pDLENBQUE7QUFBQSxNQUFBLElBQUcsSUFBQyxDQUFBLE1BQUo7QUFDRSxRQUFBLElBQUMsQ0FBQSxrQkFBRCxDQUFBLENBQUEsQ0FERjtPQUFBO0FBRUEsTUFBQSxJQUFHLENBQUEsSUFBRSxDQUFBLFVBQUw7QUFDRSxRQUFBLElBQUMsQ0FBQSxVQUFELEdBQWMsQ0FBQSxDQUFkLENBREY7T0FIVztJQUFBLENBQWI7O0FBQUEsd0JBTUEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLGFBQU8sSUFBQyxDQUFBLFFBQVIsQ0FETztJQUFBLENBTlQsQ0FBQTs7QUFBQSx3QkFTQSxTQUFBLEdBQVcsU0FBQSxHQUFBO0FBQ1QsYUFBTyxJQUFDLENBQUEsTUFBUixDQURTO0lBQUEsQ0FUWCxDQUFBOztBQUFBLHdCQVlBLGFBQUEsR0FBZSxTQUFBLEdBQUE7QUFDYixhQUFPLElBQUMsQ0FBQSxVQUFSLENBRGE7SUFBQSxDQVpmLENBQUE7O0FBQUEsd0JBZUEsU0FBQSxHQUFXLFNBQUMsTUFBRCxHQUFBO0FBQ1QsTUFBQSxJQUFHLElBQUMsQ0FBQSxNQUFKO0FBQ0UsUUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBQSxDQUFBLENBREY7T0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxNQUZWLENBQUE7YUFHQSxPQUpTO0lBQUEsQ0FmWCxDQUFBOztBQUFBLHdCQXFCQSxrQkFBQSxHQUFvQixTQUFBLEdBQUE7YUFDbEIsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsTUFBTSxDQUFDLHNCQUFSLENBQUEsQ0FBZ0MsQ0FBQyxHQUFqQyxHQUF1QyxFQUQ3QjtJQUFBLENBckJwQixDQUFBOztBQUFBLHdCQXdCQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFHLElBQUMsQ0FBQSxNQUFKO0FBQ0UsZUFBTyxJQUFDLENBQUEsTUFBTSxDQUFDLHNCQUFSLENBQUEsQ0FBZ0MsQ0FBQyxHQUFqQyxHQUF1QyxDQUE5QyxDQURGO09BQUE7QUFFQSxhQUFPLElBQUMsQ0FBQSxJQUFSLENBSE87SUFBQSxDQXhCVCxDQUFBOztBQUFBLHdCQTZCQSxVQUFBLEdBQVksU0FBQyxLQUFELEdBQUE7QUFDVixNQUFBLElBQWUsQ0FBQSxLQUFBLFlBQWtCLFNBQWpDO0FBQUEsZUFBTyxJQUFQLENBQUE7T0FBQTtBQUNBLE1BQUEsSUFBZSxLQUFLLENBQUMsT0FBTixDQUFBLENBQUEsR0FBa0IsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFqQztBQUFBLGVBQU8sSUFBUCxDQUFBO09BREE7QUFFQSxNQUFBLElBQWUsS0FBSyxDQUFDLE9BQU4sQ0FBQSxDQUFBLEdBQWtCLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FBakM7QUFBQSxlQUFPLElBQVAsQ0FBQTtPQUhVO0lBQUEsQ0E3QlosQ0FBQTs7QUFBQSx3QkFrQ0EsT0FBQSxHQUFTLFNBQUMsS0FBRCxHQUFBO0FBQ1AsTUFBQSxJQUFnQixDQUFBLEtBQUEsWUFBa0IsU0FBbEM7QUFBQSxlQUFPLEtBQVAsQ0FBQTtPQUFBO0FBQ0EsTUFBQSxJQUFnQixLQUFLLENBQUMsT0FBTixDQUFBLENBQUEsS0FBbUIsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFuQztBQUFBLGVBQU8sS0FBUCxDQUFBO09BREE7QUFFQSxNQUFBLElBQWdCLEtBQUssQ0FBQyxPQUFOLENBQUEsQ0FBQSxLQUFtQixJQUFDLENBQUEsT0FBRCxDQUFBLENBQW5DO0FBQUEsZUFBTyxLQUFQLENBQUE7T0FGQTtBQUdBLGFBQU8sSUFBUCxDQUpPO0lBQUEsQ0FsQ1QsQ0FBQTs7QUFBQSx3QkF3Q0EsYUFBQSxHQUFlLFNBQUMsS0FBRCxHQUFBO0FBQ2IsYUFBTyxDQUFBLElBQUUsQ0FBQSxVQUFELENBQVksS0FBWixDQUFELElBQXVCLENBQUEsSUFBRSxDQUFBLE9BQUQsQ0FBUyxLQUFULENBQS9CLENBRGE7SUFBQSxDQXhDZixDQUFBOztBQUFBLElBMkNBLFNBQUMsQ0FBQSxVQUFELEdBQWEsU0FBQyxNQUFELEdBQUEsQ0EzQ2IsQ0FBQTs7cUJBQUE7O01BSEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/php-debug/lib/models/codepoint.coffee
