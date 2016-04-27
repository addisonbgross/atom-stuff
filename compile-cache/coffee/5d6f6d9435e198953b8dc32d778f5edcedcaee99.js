(function() {
  var Watchpoint;

  module.exports = Watchpoint = (function() {
    atom.deserializers.add(Watchpoint);

    Watchpoint.version = '1b';

    function Watchpoint(data) {
      if (!data.expression) {
        throw new Error("Invalid watchpoint");
      }
      this.expression = data.expression.trim();
    }

    Watchpoint.prototype.serialize = function() {
      return {
        deserializer: 'Watchpoint',
        version: this.constructor.version,
        data: {
          expression: this.getExpression()
        }
      };
    };

    Watchpoint.deserialize = function(_arg) {
      var data;
      data = _arg.data;
      return new Watchpoint({
        expression: data.expression
      });
    };

    Watchpoint.prototype.getPath = function() {
      return this.path;
    };

    Watchpoint.prototype.getExpression = function() {
      return this.expression;
    };

    Watchpoint.prototype.setValue = function(value) {
      this.value = value;
      return void 0;
    };

    Watchpoint.prototype.getValue = function() {
      return this.value;
    };

    Watchpoint.prototype.isLessThan = function(other) {
      if (!other instanceof Watchpoint) {
        return true;
      }
      if (other.getExpression() < this.getExpression()) {
        return true;
      }
    };

    Watchpoint.prototype.isEqual = function(other) {
      if (!other instanceof Watchpoint) {
        return false;
      }
      if (other.getExpression() !== this.getExpression()) {
        return false;
      }
      return true;
    };

    Watchpoint.prototype.isGreaterThan = function(other) {
      return !this.isLessThan(other) && !this.isEqual(other);
    };

    return Watchpoint;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGhwLWRlYnVnL2xpYi9tb2RlbHMvd2F0Y2hwb2ludC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsVUFBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBbkIsQ0FBdUIsVUFBdkIsQ0FBQSxDQUFBOztBQUFBLElBQ0EsVUFBQyxDQUFBLE9BQUQsR0FBVSxJQURWLENBQUE7O0FBRWEsSUFBQSxvQkFBQyxJQUFELEdBQUE7QUFDWCxNQUFBLElBQUksQ0FBQSxJQUFLLENBQUMsVUFBVjtBQUNFLGNBQVUsSUFBQSxLQUFBLENBQU0sb0JBQU4sQ0FBVixDQURGO09BQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFoQixDQUFBLENBRmQsQ0FEVztJQUFBLENBRmI7O0FBQUEseUJBT0EsU0FBQSxHQUFXLFNBQUEsR0FBQTtBQUNULGFBQU87QUFBQSxRQUNMLFlBQUEsRUFBYyxZQURUO0FBQUEsUUFFTCxPQUFBLEVBQVMsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUZqQjtBQUFBLFFBR0wsSUFBQSxFQUFNO0FBQUEsVUFDSixVQUFBLEVBQVksSUFBQyxDQUFBLGFBQUQsQ0FBQSxDQURSO1NBSEQ7T0FBUCxDQURTO0lBQUEsQ0FQWCxDQUFBOztBQUFBLElBZ0JBLFVBQUMsQ0FBQSxXQUFELEdBQWMsU0FBQyxJQUFELEdBQUE7QUFDWixVQUFBLElBQUE7QUFBQSxNQURjLE9BQUQsS0FBQyxJQUNkLENBQUE7QUFBQSxhQUFXLElBQUEsVUFBQSxDQUFXO0FBQUEsUUFBQSxVQUFBLEVBQVksSUFBSSxDQUFDLFVBQWpCO09BQVgsQ0FBWCxDQURZO0lBQUEsQ0FoQmQsQ0FBQTs7QUFBQSx5QkFtQkEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLGFBQU8sSUFBQyxDQUFBLElBQVIsQ0FETztJQUFBLENBbkJULENBQUE7O0FBQUEseUJBc0JBLGFBQUEsR0FBZSxTQUFBLEdBQUE7QUFDYixhQUFPLElBQUMsQ0FBQSxVQUFSLENBRGE7SUFBQSxDQXRCZixDQUFBOztBQUFBLHlCQXlCQSxRQUFBLEdBQVUsU0FBRSxLQUFGLEdBQUE7QUFDUixNQURTLElBQUMsQ0FBQSxRQUFBLEtBQ1YsQ0FBQTthQUFBLE9BRFE7SUFBQSxDQXpCVixDQUFBOztBQUFBLHlCQTRCQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsYUFBTyxJQUFDLENBQUEsS0FBUixDQURRO0lBQUEsQ0E1QlYsQ0FBQTs7QUFBQSx5QkErQkEsVUFBQSxHQUFZLFNBQUMsS0FBRCxHQUFBO0FBQ1YsTUFBQSxJQUFlLENBQUEsS0FBQSxZQUFrQixVQUFqQztBQUFBLGVBQU8sSUFBUCxDQUFBO09BQUE7QUFDQSxNQUFBLElBQWUsS0FBSyxDQUFDLGFBQU4sQ0FBQSxDQUFBLEdBQXdCLElBQUMsQ0FBQSxhQUFELENBQUEsQ0FBdkM7QUFBQSxlQUFPLElBQVAsQ0FBQTtPQUZVO0lBQUEsQ0EvQlosQ0FBQTs7QUFBQSx5QkFtQ0EsT0FBQSxHQUFTLFNBQUMsS0FBRCxHQUFBO0FBQ1AsTUFBQSxJQUFnQixDQUFBLEtBQUEsWUFBa0IsVUFBbEM7QUFBQSxlQUFPLEtBQVAsQ0FBQTtPQUFBO0FBQ0EsTUFBQSxJQUFnQixLQUFLLENBQUMsYUFBTixDQUFBLENBQUEsS0FBeUIsSUFBQyxDQUFBLGFBQUQsQ0FBQSxDQUF6QztBQUFBLGVBQU8sS0FBUCxDQUFBO09BREE7QUFFQSxhQUFPLElBQVAsQ0FITztJQUFBLENBbkNULENBQUE7O0FBQUEseUJBd0NBLGFBQUEsR0FBZSxTQUFDLEtBQUQsR0FBQTtBQUNiLGFBQU8sQ0FBQSxJQUFFLENBQUEsVUFBRCxDQUFZLEtBQVosQ0FBRCxJQUF1QixDQUFBLElBQUUsQ0FBQSxPQUFELENBQVMsS0FBVCxDQUEvQixDQURhO0lBQUEsQ0F4Q2YsQ0FBQTs7c0JBQUE7O01BRkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/php-debug/lib/models/watchpoint.coffee
