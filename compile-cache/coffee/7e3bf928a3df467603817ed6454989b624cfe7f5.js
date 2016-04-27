(function() {
  var Emitter, OutputStream, Pipeline, RawPipeline;

  Emitter = require('atom').Emitter;

  Pipeline = require('./output-pipeline');

  RawPipeline = require('./output-pipeline-raw');

  module.exports = OutputStream = (function() {
    function OutputStream(settings, stream) {
      this.settings = settings;
      this.stream = stream;
      this.subscribers = new Emitter;
      this.buffer = '';
      this.flushed = false;
      this.wholepipeline = new Pipeline(this.settings, this.stream);
      this.rawpipeline = new RawPipeline(this.settings, this.stream);
    }

    OutputStream.prototype.destroy = function() {
      this.subscribers.dispose();
      this.subscribers = null;
      this.wholepipeline.destroy();
      this.rawpipeline.destroy();
      this.wholepipeline = null;
      this.rawpipeline = null;
      return this.buffer = '';
    };

    OutputStream.prototype.subscribeToCommands = function(object, callback, command) {
      if (object == null) {
        return;
      }
      if (object[callback] == null) {
        return;
      }
      if (command === 'new' || command === 'raw' || command === 'input') {
        return this.subscribers.on(command, function(o) {
          return object[callback](o);
        });
      } else {
        return this.wholepipeline.subscribeToCommands(object, callback, command);
      }
    };

    OutputStream.prototype.flush = function() {
      this.flushed = true;
      if (this.buffer === '') {
        return;
      }
      this.subscribers.emit('input', {
        input: this.buffer,
        files: this.wholepipeline.getFiles({
          input: this.buffer
        })
      });
      this.wholepipeline["in"](this.rawpipeline["in"](this.buffer));
      return this.buffer = '';
    };

    OutputStream.prototype["in"] = function(data) {
      var d, index, line, lines, _i, _len;
      if (this.flushed) {
        return;
      }
      data = this.rawpipeline["in"](data);
      if (data === '') {
        return;
      }
      this.buffer += data;
      lines = this.buffer.split('\n');
      for (index = _i = 0, _len = lines.length; _i < _len; index = ++_i) {
        line = lines[index];
        if (line === '' && index === lines.length - 1) {
          break;
        }
        if (index !== 0) {
          this.subscribers.emit('new');
          if (line !== '') {
            this.subscribers.emit('raw', line);
          }
          if (index !== lines.length - 1) {
            this.subscribers.emit('input', {
              input: line,
              files: this.wholepipeline.getFiles({
                input: line
              })
            });
            this.wholepipeline["in"](line);
          }
        } else {
          if (line === (d = data.split('\n')[0])) {
            this.subscribers.emit('new');
          }
          this.subscribers.emit('raw', d);
          if (lines.length !== 1) {
            this.subscribers.emit('input', {
              input: line,
              files: this.wholepipeline.getFiles({
                input: line
              })
            });
            this.wholepipeline["in"](line);
          }
        }
      }
      return this.buffer = lines.pop();
    };

    return OutputStream;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3BpcGVsaW5lL291dHB1dC1zdHJlYW0uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRDQUFBOztBQUFBLEVBQUMsVUFBVyxPQUFBLENBQVEsTUFBUixFQUFYLE9BQUQsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsR0FBVyxPQUFBLENBQVEsbUJBQVIsQ0FGWCxDQUFBOztBQUFBLEVBR0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSx1QkFBUixDQUhkLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBRVMsSUFBQSxzQkFBRSxRQUFGLEVBQWEsTUFBYixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsV0FBQSxRQUNiLENBQUE7QUFBQSxNQUR1QixJQUFDLENBQUEsU0FBQSxNQUN4QixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLEdBQUEsQ0FBQSxPQUFmLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxNQUFELEdBQVUsRUFEVixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsT0FBRCxHQUFXLEtBRlgsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGFBQUQsR0FBcUIsSUFBQSxRQUFBLENBQVMsSUFBQyxDQUFBLFFBQVYsRUFBb0IsSUFBQyxDQUFBLE1BQXJCLENBSHJCLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxXQUFELEdBQW1CLElBQUEsV0FBQSxDQUFZLElBQUMsQ0FBQSxRQUFiLEVBQXVCLElBQUMsQ0FBQSxNQUF4QixDQUpuQixDQURXO0lBQUEsQ0FBYjs7QUFBQSwyQkFPQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNB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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/pipeline/output-stream.coffee
