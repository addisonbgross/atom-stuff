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
          return _this.currentWorker.run().then((function(exitcode) {
            _this.finishedCommand(exitcode);
            if (exitcode === 0) {
              return _this._run(resolve, reject);
            } else {
              return resolve(exitcode);
            }
          }), function(e) {
            _this.errorCommand(e);
            return resolve(-1);
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
      this.currentWorker.kill();
      return this.finishedQueue(-2);
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

    QueueWorker.prototype.finishedCommand = function(exitcode) {
      this.emitter.emit('finishedCommand', exitcode);
      if (exitcode !== null && exitcode !== 0) {
        return this.finishedQueue(exitcode);
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
