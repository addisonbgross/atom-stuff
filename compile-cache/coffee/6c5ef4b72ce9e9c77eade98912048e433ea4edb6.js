(function() {
  var Modifiers, Queue, QueueWorker;

  Modifiers = require('../modifier/modifier');

  QueueWorker = require('./queue-worker');

  module.exports = Queue = (function() {
    function Queue(origin) {
      var _ref;
      if (origin.length != null) {
        this.queue = {
          queue: origin
        };
      } else {
        this.queue = {
          queue: [origin]
        };
      }
      this.keys = Object.keys((_ref = this.queue.queue[0].modifier) != null ? _ref : {}).filter(function(k) {
        var _ref;
        return ((_ref = Modifiers.modules[k]) != null ? _ref["in"] : void 0) != null;
      });
      this.keys.reverse();
    }

    Queue.prototype.run = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this._run(resolve, reject);
        };
      })(this));
    };

    Queue.prototype._run = function(resolve, reject) {
      var k, ret;
      if ((k = this.keys.pop()) == null) {
        return resolve(new QueueWorker(this.queue));
      }
      if (Modifiers.activate(k) !== true) {
        return this._run(resolve, reject);
      }
      ret = Modifiers.modules[k]["in"](this.queue);
      if (ret instanceof Promise) {
        return ret.then(((function(_this) {
          return function() {
            return _this._run(resolve, reject);
          };
        })(this)), function(e) {
          return reject(new Error('Error in "' + k + '" module: ' + e.message));
        });
      } else {
        if (ret != null) {
          reject(new Error('Error in "' + k + '" module: ' + ret));
        }
        return this._run(resolve, reject);
      }
    };

    return Queue;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3BpcGVsaW5lL3F1ZXVlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw2QkFBQTs7QUFBQSxFQUFBLFNBQUEsR0FBWSxPQUFBLENBQVEsc0JBQVIsQ0FBWixDQUFBOztBQUFBLEVBQ0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQURkLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBQ1MsSUFBQSxlQUFDLE1BQUQsR0FBQTtBQUNYLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBRyxxQkFBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLEtBQUQsR0FBUztBQUFBLFVBQUEsS0FBQSxFQUFPLE1BQVA7U0FBVCxDQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsSUFBQyxDQUFBLEtBQUQsR0FBUztBQUFBLFVBQUEsS0FBQSxFQUFPLENBQUMsTUFBRCxDQUFQO1NBQVQsQ0FIRjtPQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsSUFBRCxHQUFRLE1BQU0sQ0FBQyxJQUFQLHdEQUF1QyxFQUF2QyxDQUEwQyxDQUFDLE1BQTNDLENBQWtELFNBQUMsQ0FBRCxHQUFBO0FBQ3hELFlBQUEsSUFBQTtlQUFBLHNFQUR3RDtNQUFBLENBQWxELENBSlIsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUEsQ0FOQSxDQURXO0lBQUEsQ0FBYjs7QUFBQSxvQkFTQSxHQUFBLEdBQUssU0FBQSxHQUFBO2FBQ0MsSUFBQSxPQUFBLENBQVEsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtpQkFDVixLQUFDLENBQUEsSUFBRCxDQUFNLE9BQU4sRUFBZSxNQUFmLEVBRFU7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFSLEVBREQ7SUFBQSxDQVRMLENBQUE7O0FBQUEsb0JBY0EsSUFBQSxHQUFNLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUNKLFVBQUEsTUFBQTtBQUFBLE1BQUEsSUFBK0MsNkJBQS9DO0FBQUEsZUFBTyxPQUFBLENBQVksSUFBQSxXQUFBLENBQVksSUFBQyxDQUFBLEtBQWIsQ0FBWixDQUFQLENBQUE7T0FBQTtBQUNBLE1BQUEsSUFBb0MsU0FBUyxDQUFDLFFBQVYsQ0FBbUIsQ0FBbkIsQ0FBQSxLQUF5QixJQUE3RDtBQUFBLGVBQU8sSUFBQyxDQUFBLElBQUQsQ0FBTSxPQUFOLEVBQWUsTUFBZixDQUFQLENBQUE7T0FEQTtBQUFBLE1BRUEsR0FBQSxHQUFNLFNBQVMsQ0FBQyxPQUFRLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBRCxDQUFwQixDQUF3QixJQUFDLENBQUEsS0FBekIsQ0FGTixDQUFBO0FBR0EsTUFBQSxJQUFHLEdBQUEsWUFBZSxPQUFsQjtlQUNFLEdBQUcsQ0FBQyxJQUFKLENBQVMsQ0FBQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsSUFBRCxDQUFNLE9BQU4sRUFBZSxNQUFmLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFELENBQVQsRUFBcUMsU0FBQyxDQUFELEdBQUE7aUJBQU8sTUFBQSxDQUFXLElBQUEsS0FBQSxDQUFNLFlBQUEsR0FBZSxDQUFmLEdBQW1CLFlBQW5CLEdBQWtDLENBQUMsQ0FBQyxPQUExQyxDQUFYLEVBQVA7UUFBQSxDQUFyQyxFQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsSUFBNEQsV0FBNUQ7QUFBQSxVQUFBLE1BQUEsQ0FBVyxJQUFBLEtBQUEsQ0FBTSxZQUFBLEdBQWUsQ0FBZixHQUFtQixZQUFuQixHQUFrQyxHQUF4QyxDQUFYLENBQUEsQ0FBQTtTQUFBO2VBQ0EsSUFBQyxDQUFBLElBQUQsQ0FBTSxPQUFOLEVBQWUsTUFBZixFQUpGO09BSkk7SUFBQSxDQWROLENBQUE7O2lCQUFBOztNQUxKLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/pipeline/queue.coffee
