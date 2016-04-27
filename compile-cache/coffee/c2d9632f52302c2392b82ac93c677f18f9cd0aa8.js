(function() {
  var Dbgp, DbgpInstance, DebugContext, Disposable, Emitter, Q, Watchpoint, parseString, _ref;

  parseString = require('xml2js').parseString;

  Q = require('q');

  _ref = require('event-kit'), Emitter = _ref.Emitter, Disposable = _ref.Disposable;

  DebugContext = require('../../models/debug-context');

  Watchpoint = require('../../models/watchpoint');

  DbgpInstance = require('./dbgp-instance');

  module.exports = Dbgp = (function() {
    function Dbgp(params) {
      this.emitter = new Emitter;
      this.buffer = '';
      this.GlobalContext = params.context;
      this.serverPort = params.serverPort;
    }

    Dbgp.prototype.listening = function() {
      return this.server !== void 0;
    };

    Dbgp.prototype.running = function() {
      return this.socket && this.socket.readyState === 1;
    };

    Dbgp.prototype.listen = function(options) {
      var buffer, e, net, _ref1, _ref2;
      this.debugContext = new DebugContext;
      net = require("net");
      buffer = '';
      try {
        console.log("Listening on Port " + this.serverPort);
        this.server = net.createServer((function(_this) {
          return function(socket) {
            var instance;
            socket.setEncoding('ascii');
            if (!_this.GlobalContext.getCurrentDebugContext()) {
              console.log("Session initiated");
              return instance = new DbgpInstance({
                socket: socket,
                context: _this.GlobalContext
              });
            } else {
              console.log("New session rejected");
              return socket.end();
            }
          };
        })(this));
        if ((_ref1 = this.server) != null) {
          _ref1.on('error', (function(_this) {
            return function(err) {
              console.error("Socket Error:", err);
              atom.notifications.addWarning("Could not bind socket, do you already have an instance of the debugger open?");
              _this.close();
              _this.GlobalContext.notifySocketError();
              return false;
            };
          })(this));
        }
        if ((_ref2 = this.server) != null) {
          _ref2.listen(this.serverPort);
        }
        return true;
      } catch (_error) {
        e = _error;
        console.error("Socket Error:", e);
        atom.notifications.addWarning("Could not bind socket, do you already have an instance of the debugger open?");
        this.close();
        this.GlobalContext.notifySocketError();
        return false;
      }
    };

    Dbgp.prototype.close = function(options) {
      if (!!this.socket) {
        this.socket.end();
        delete this.socket;
      }
      if (!!this.server) {
        this.server.close();
        delete this.server;
      }
      return console.log("closed");
    };

    return Dbgp;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGhwLWRlYnVnL2xpYi9lbmdpbmVzL2RiZ3AvZGJncC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUZBQUE7O0FBQUEsRUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLFFBQVIsQ0FBaUIsQ0FBQyxXQUFoQyxDQUFBOztBQUFBLEVBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxHQUFSLENBREosQ0FBQTs7QUFBQSxFQUVBLE9BQXdCLE9BQUEsQ0FBUSxXQUFSLENBQXhCLEVBQUMsZUFBQSxPQUFELEVBQVUsa0JBQUEsVUFGVixDQUFBOztBQUFBLEVBSUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSw0QkFBUixDQUpmLENBQUE7O0FBQUEsRUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLHlCQUFSLENBTGIsQ0FBQTs7QUFBQSxFQU1BLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FOZixDQUFBOztBQUFBLEVBUUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsY0FBQyxNQUFELEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLE9BQVgsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxFQURWLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxhQUFELEdBQWlCLE1BQU0sQ0FBQyxPQUZ4QixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsVUFBRCxHQUFjLE1BQU0sQ0FBQyxVQUhyQixDQURXO0lBQUEsQ0FBYjs7QUFBQSxtQkFNQSxTQUFBLEdBQVcsU0FBQSxHQUFBO0FBQ1QsYUFBTyxJQUFDLENBQUEsTUFBRCxLQUFXLE1BQWxCLENBRFM7SUFBQSxDQU5YLENBQUE7O0FBQUEsbUJBU0EsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLGFB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

//# sourceURL=/home/champ/.atom/packages/php-debug/lib/engines/dbgp/dbgp.coffee
