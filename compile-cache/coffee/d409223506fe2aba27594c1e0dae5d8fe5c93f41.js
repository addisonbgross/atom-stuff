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
      return this.writers.emit('attach', this.input);
    };

    InputStream.prototype.destroy = function() {
      var _ref;
      if ((_ref = this.input) != null) {
        if (typeof _ref.end === "function") {
          _ref.end();
        }
      }
      this.writers.dispose();
      this.input = null;
      return this.writers = null;
    };

    InputStream.prototype.onWrite = function(callback) {
      return this.writers.on('write', callback);
    };

    InputStream.prototype.onAttach = function(callback) {
      return this.writers.on('attach', callback);
    };

    InputStream.prototype.isPTY = function() {
      return this.input.socket != null;
    };

    InputStream.prototype.write = function(text) {
      var _ref;
      return ((_ref = this.input.socket) != null ? _ref : this.input).write(text, 'utf8', (function(_this) {
        return function() {
          return _this.writers.emit('write', text);
        };
      })(this));
    };

    return InputStream;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3BpcGVsaW5lL2lucHV0LXN0cmVhbS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsb0JBQUE7SUFBQSxrRkFBQTs7QUFBQSxFQUFDLFVBQVcsT0FBQSxDQUFRLE1BQVIsRUFBWCxPQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBQ1MsSUFBQSxxQkFBQSxHQUFBO0FBQ1gsMkNBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFULENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLE9BRFgsQ0FEVztJQUFBLENBQWI7O0FBQUEsMEJBSUEsUUFBQSxHQUFVLFNBQUUsS0FBRixHQUFBO0FBQ1IsTUFEUyxJQUFDLENBQUEsUUFBQSxLQUNWLENBQUE7YUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxRQUFkLEVBQXdCLElBQUMsQ0FBQSxLQUF6QixFQURRO0lBQUEsQ0FKVixDQUFBOztBQUFBLDBCQU9BLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxVQUFBLElBQUE7OztjQUFNLENBQUU7O09BQVI7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsT0FBVCxDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUZULENBQUE7YUFHQSxJQUFDLENBQUEsT0FBRCxHQUFXLEtBSko7SUFBQSxDQVBULENBQUE7O0FBQUEsMEJBYUEsT0FBQSxHQUFTLFNBQUMsUUFBRCxHQUFBO2FBQ1AsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksT0FBWixFQUFxQixRQUFyQixFQURPO0lBQUEsQ0FiVCxDQUFBOztBQUFBLDBCQWdCQSxRQUFBLEdBQVUsU0FBQyxRQUFELEdBQUE7YUFDUixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxRQUFaLEVBQXNCLFFBQXRCLEVBRFE7SUFBQSxDQWhCVixDQUFBOztBQUFBLDBCQW1CQSxLQUFBLEdBQU8sU0FBQSxHQUFBO2FBQ0wsMEJBREs7SUFBQSxDQW5CUCxDQUFBOztBQUFBLDBCQXNCQSxLQUFBLEdBQU8sU0FBQyxJQUFELEdBQUE7QUFDTCxVQUFBLElBQUE7YUFBQSw2Q0FBaUIsSUFBQyxDQUFBLEtBQWxCLENBQXdCLENBQUMsS0FBekIsQ0FBK0IsSUFBL0IsRUFBcUMsTUFBckMsRUFBNkMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxPQUFkLEVBQXVCLElBQXZCLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE3QyxFQURLO0lBQUEsQ0F0QlAsQ0FBQTs7dUJBQUE7O01BSkosQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/pipeline/input-stream.coffee
