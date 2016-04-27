(function() {
  var Emitter, InputStream,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Emitter = require('atom').Emitter;

  module.exports = InputStream = (function() {
    function InputStream() {
      this.write = __bind(this.write, this);
      this.input = null;
      this.writers = new Emitter;
    }

    InputStream.prototype.setInput = function(input) {
      this.input = input;
    };

    InputStream.prototype.destroy = function() {
      var _ref;
      if ((_ref = this.input) != null) {
        _ref.end();
      }
      this.writers.dispose();
      this.input = null;
      return this.writers = null;
    };

    InputStream.prototype.onWrite = function(callback) {
      return this.writers.on('write', callback);
    };

    InputStream.prototype.write = function(text) {
      return this.input.write(text, 'utf8', (function(_this) {
        return function() {
          return _this.writers.emit('write', text);
        };
      })(this));
    };

    return InputStream;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3BpcGVsaW5lL2lucHV0LXN0cmVhbS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsb0JBQUE7SUFBQSxrRkFBQTs7QUFBQSxFQUFDLFVBQVcsT0FBQSxDQUFRLE1BQVIsRUFBWCxPQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBQ1MsSUFBQSxxQkFBQSxHQUFBO0FBQ1gsMkNBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFULENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLE9BRFgsQ0FEVztJQUFBLENBQWI7O0FBQUEsMEJBSUEsUUFBQSxHQUFVLFNBQUUsS0FBRixHQUFBO0FBQVUsTUFBVCxJQUFDLENBQUEsUUFBQSxLQUFRLENBQVY7SUFBQSxDQUpWLENBQUE7O0FBQUEsMEJBTUEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLFVBQUEsSUFBQTs7WUFBTSxDQUFFLEdBQVIsQ0FBQTtPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLE9BQVQsQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFGVCxDQUFBO2FBR0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxLQUpKO0lBQUEsQ0FOVCxDQUFBOztBQUFBLDBCQVlBLE9BQUEsR0FBUyxTQUFDLFFBQUQsR0FBQTthQUNQLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLE9BQVosRUFBcUIsUUFBckIsRUFETztJQUFBLENBWlQsQ0FBQTs7QUFBQSwwQkFlQSxLQUFBLEdBQU8sU0FBQyxJQUFELEdBQUE7YUFDTCxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQVAsQ0FBYSxJQUFiLEVBQW1CLE1BQW5CLEVBQTJCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsT0FBZCxFQUF1QixJQUF2QixFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0IsRUFESztJQUFBLENBZlAsQ0FBQTs7dUJBQUE7O01BSkosQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/pipeline/input-stream.coffee
