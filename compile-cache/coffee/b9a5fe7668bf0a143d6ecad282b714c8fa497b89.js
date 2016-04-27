(function() {
  var CommandModifier, CommandWorker, Emitter, Outputs, QueueWorker;

  CommandWorker = require('./command-worker');

  CommandModifier = require('./command-modifier');

  Outputs = require('../output/output');

  Emitter = require('atom').Emitter;

  module.exports = QueueWorker = (function() {
    function QueueWorker(queue) {
      var command, key, _base, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      this.queue = queue;
      this.outputs = {};
      _ref = this.queue.queue;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        command = _ref[_i];
        _ref1 = Object.keys(command.output);
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          key = _ref1[_j];
          if (Outputs.activate(key) !== true) {
            continue;
          }
          if (!this.outputs[key]) {
            this.outputs[key] = new Outputs.modules[key].output;
          }
        }
      }
      _ref2 = Object.keys(this.outputs);
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        key = _ref2[_k];
        if (typeof (_base = this.outputs[key]).newQueue === "function") {
          _base.newQueue(this.queue);
        }
      }
      this.emitter = new Emitter;
      this.finished = false;
    }

    QueueWorker.prototype.destroy = function() {
      this.emitter.dispose();
      this.queue = null;
      return this.outputs = null;
    };

    QueueWorker.prototype.run = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this._run(resolve, reject);
        };
      })(this));
    };

    QueueWorker.prototype._run = function(resolve, reject) {
      var c, modifier;
      if (this.finished) {
        throw new Error('Worker already finished');
      }
      if ((c = this.queue.queue.splice(0, 1)[0]) == null) {
        this.finishedQueue(0);
        return resolve(0);
      }
      modifier = new CommandModifier(c);
      return modifier.run().then(((function(_this) {
        return function() {
          var key, outputs;
          outputs = (function() {
            var _i, _len, _ref, _results;
            _ref = Object.keys(c.output);
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              key = _ref[_i];
              if (this.outputs[key] != null) {
                _results.push(this.outputs[key]);
              }
            }
            return _results;
          }).call(_this);
          _this.currentWorker = new CommandWorker(c, outputs);
          return _this.currentWorker.run().then((function(status) {
            _this.finishedCommand(status);
            if (status.exitcode === 0) {
              return _this._run(resolve, reject);
            } else {
              return resolve(status);
            }
          }), function(e) {
            _this.errorCommand(e);
            return resolve({
              exitcode: -1,
              status: null
            });
          });
        };
      })(this)), reject);
    };

    QueueWorker.prototype.stop = function() {
      if (this.finished) {
        return;
      }
      if (this.currentWorker == null) {
        return this.finished = true;
      }
      return this.currentWorker.kill().then((function(_this) {
        return function() {
          return _this.finishedQueue(-2);
        };
      })(this));
    };

    QueueWorker.prototype.finishedQueue = function(code) {
      var key, _base, _i, _len, _ref;
      this.finished = true;
      _ref = Object.keys(this.outputs);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        if (typeof (_base = this.outputs[key]).exitQueue === "function") {
          _base.exitQueue(code);
        }
      }
      this.emitter.emit('finishedQueue', code);
      return this.destroy();
    };

    QueueWorker.prototype.hasFinished = function() {
      return this.finished;
    };

    QueueWorker.prototype.finishedCommand = function(status) {
      this.currentWorker.destroy();
      this.emitter.emit('finishedCommand', status);
      if (status.exitcode !== null && status.exitcode !== 0) {
        if (status.exitcode >= 128) {
          return;
        }
        return this.finishedQueue(status.exitcode);
      }
    };

    QueueWorker.prototype.errorCommand = function(error) {
      this.emitter.emit('errorCommand', error);
      return this.finishedQueue(-1);
    };

    QueueWorker.prototype.onFinishedQueue = function(callback) {
      return this.emitter.on('finishedQueue', callback);
    };

    QueueWorker.prototype.onFinishedCommand = function(callback) {
      return this.emitter.on('finishedCommand', callback);
    };

    QueueWorker.prototype.onError = function(callback) {
      return this.emitter.on('errorCommand', callback);
    };

    return QueueWorker;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3BpcGVsaW5lL3F1ZXVlLXdvcmtlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNkRBQUE7O0FBQUEsRUFBQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxrQkFBUixDQUFoQixDQUFBOztBQUFBLEVBQ0EsZUFBQSxHQUFrQixPQUFBLENBQVEsb0JBQVIsQ0FEbEIsQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBVSxPQUFBLENBQVEsa0JBQVIsQ0FGVixDQUFBOztBQUFBLEVBR0MsVUFBVyxPQUFBLENBQVEsTUFBUixFQUFYLE9BSEQsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFFUyxJQUFBLHFCQUFFLEtBQUYsR0FBQTtBQUNYLFVBQUEsdUVBQUE7QUFBQSxNQURZLElBQUMsQ0FBQSxRQUFBLEtBQ2IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxFQUFYLENBQUE7QUFFQTtBQUFBLFdBQUEsMkNBQUE7MkJBQUE7QUFDRTtBQUFBLGFBQUEsOENBQUE7MEJBQUE7QUFDRSxVQUFBLElBQWdCLE9BQU8sQ0FBQyxRQUFSLENBQWlCLEdBQWpCLENBQUEsS0FBeUIsSUFBekM7QUFBQSxxQkFBQTtXQUFBO0FBQ0EsVUFBQSxJQUFtRCxDQUFBLElBQUssQ0FBQSxPQUFRLENBQUEsR0FBQSxDQUFoRTtBQUFBLFlBQUEsSUFBQyxDQUFBLE9BQVEsQ0FBQSxHQUFBLENBQVQsR0FBZ0IsR0FBQSxDQUFBLE9BQVcsQ0FBQyxPQUFRLENBQUEsR0FBQSxDQUFJLENBQUMsTUFBekMsQ0FBQTtXQUZGO0FBQUEsU0FERjtBQUFBLE9BRkE7QUFPQTtBQUFBLFdBQUEsOENBQUE7d0JBQUE7O2VBQ2UsQ0FBQyxTQUFVLElBQUMsQ0FB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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/pipeline/queue-worker.coffee
