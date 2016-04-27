(function() {
  var CSON, ColorRegex, Emitter, Escape, OutputStream, Profiles, XRegExp, fs, path,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Profiles = require('../profiles/profiles');

  XRegExp = require('xregexp').XRegExp;

  fs = require('fs-plus');

  path = require('path');

  Emitter = require('atom').Emitter;

  CSON = require('season');

  ColorRegex = /\x1b\[[0-9;]*m/g;

  Escape = /\x1b/;

  module.exports = OutputStream = (function() {
    function OutputStream(settings, stream) {
      var _base, _name, _ref, _ref1;
      this.settings = settings;
      this.stream = stream;
      this.lint = __bind(this.lint, this);
      this.pushLinterMessage = __bind(this.pushLinterMessage, this);
      this.print = __bind(this.print, this);
      this.replacePrevious = __bind(this.replacePrevious, this);
      this.createMessage = __bind(this.createMessage, this);
      this.absolutePath = __bind(this.absolutePath, this);
      this.setType = __bind(this.setType, this);
      if (this.stream.profile != null) {
        this.profile = typeof (_base = Profiles.profiles)[_name = this.stream.profile] === "function" ? new _base[_name]({
          setType: this.setType,
          print: this.print,
          replacePrevious: this.replacePrevious,
          createMessage: this.createMessage,
          absolutePath: this.absolutePath,
          pushLinterMessage: this.pushLinterMessage,
          createExtensionString: this.createExtensionString,
          createRegex: this.createRegex,
          lint: this.lint
        }) : void 0;
        if (this.profile == null) {
          if ((_ref = atom.notifications) != null) {
            _ref.addError("Could not find highlighting profile: " + this.stream.profile);
          }
        }
        if ((_ref1 = this.profile) != null) {
          if (typeof _ref1.clear === "function") {
            _ref1.clear();
          }
        }
      } else {
        this.profile = null;
      }
      if (this.stream.regex != null) {
        this.regex = new XRegExp(this.stream.regex, 'xni');
        this["default"] = {};
        if (this.stream.defaults !== '') {
          this["default"] = CSON.parse(this.stream.defaults);
        }
      }
      this.subscribers = new Emitter;
      this.buffer = '';
      this.endsWithAnsi = null;
    }

    OutputStream.prototype.destroy = function() {
      this.subscribers.dispose();
      this.subscribers = null;
      this.profile = null;
      this.regex = null;
      this.buffer = '';
      this.endsWithAnsi = null;
      return this["default"] = {};
    };

    OutputStream.prototype.subscribeToCommands = function(object, callback, command) {
      if (object == null) {
        return;
      }
      if (object[callback] == null) {
        return;
      }
      return this.subscribers.on(command, function(o) {
        return object[callback](o);
      });
    };

    OutputStream.prototype.flush = function() {
      if (this.buffer === '') {
        return;
      }
      this.subscribers.emit('input', {
        input: this.buffer,
        files: this.getFiles({
          input: this.buffer
        })
      });
      this.parse(this.buffer);
      return this.buffer = '';
    };

    OutputStream.prototype.removeAnsi = function(data) {
      var m, _part;
      data = data.replace(ColorRegex, '');
      if (this.endsWithAnsi != null) {
        _part = this.endsWithAnsi + data;
        if (ColorRegex.test(_part)) {
          data = _part.replace(ColorRegex, '');
          this.endsWithAnsi = null;
        } else {
          this.endsWithAnsi = _part;
          data = '';
        }
      }
      if ((m = Escape.exec(data)) != null) {
        this.endsWithAnsi = data.substr(m.index);
        data = data.substr(0, m.index);
      }
      return data;
    };

    OutputStream.prototype["in"] = function(data) {
      var d, index, line, lines, _i, _len;
      if (this.stream.highlighting !== 'nh' || this.stream.ansi_option === 'remove') {
        data = this.removeAnsi(data);
      }
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
              files: this.getFiles({
                input: line
              })
            });
            this.parse(line);
          }
        } else {
          if (line === (d = data.split('\n')[0])) {
            this.subscribers.emit('new');
          }
          this.subscribers.emit('raw', d);
          if (lines.length !== 1) {
            this.subscribers.emit('input', {
              input: line,
              files: this.getFiles({
                input: line
              })
            });
            this.parse(line);
          }
        }
      }
      return this.buffer = lines.pop();
    };

    OutputStream.prototype.parse = function(line) {
      var v;
      if (this.stream.highlighting === 'ha') {
        return this.subscribers.emit('setType', 'warning');
      } else if (this.stream.highlighting === 'ht') {
        if ((v = this.parseTags(line)) != null) {
          return this.subscribers.emit('setType', v);
        }
      } else if (this.stream.highlighting === 'hc' && (this.profile != null)) {
        return this.profile["in"](line);
      } else if (this.stream.highlighting === 'hr') {
        return this.parseWithRegex(line);
      }
    };

    OutputStream.prototype.parseTags = function(line) {
      var _ref;
      return (_ref = /(error|warning):/g.exec(line)) != null ? _ref[1] : void 0;
    };

    OutputStream.prototype.parseWithRegex = function(line) {
      var k, m, match, _i, _j, _len, _len1, _ref, _ref1;
      if (this.regex == null) {
        return;
      }
      if ((m = this.regex.xexec(line)) != null) {
        match = {};
        _ref = Object.keys(this["default"]);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          k = _ref[_i];
          match[k] = this["default"][k];
        }
        _ref1 = Object.keys(m);
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          k = _ref1[_j];
          if (m[k] != null) {
            match[k] = m[k];
          }
        }
        this.print(match);
        return this.lint(match);
      }
    };

    OutputStream.prototype.setType = function(match) {
      var _ref;
      return this.subscribers.emit('setType', (_ref = match.highlighting) != null ? _ref : match.type);
    };

    OutputStream.prototype.absolutePath = function(relpath) {
      var fp;
      if (fs.existsSync(fp = path.resolve(this.settings.project, this.settings.wd, relpath))) {
        return fp;
      }
    };

    OutputStream.prototype.createMessage = function(match) {
      var col, row;
      row = 1;
      col = 10000;
      row = parseInt(match.row);
      if (match.col != null) {
        col = parseInt(match.col);
      }
      return {
        type: match.type,
        text: match.message,
        filePath: this.absolutePath(match.file),
        range: [[row - 1, 0], [row - 1, match.col != null ? col - 1 : 9999]]
      };
    };

    OutputStream.prototype.replacePrevious = function(new_lines) {
      var items, line, _i, _len;
      items = [];
      for (_i = 0, _len = new_lines.length; _i < _len; _i++) {
        line = new_lines[_i];
        items.push({
          input: line,
          files: this.getFiles(line)
        });
      }
      return this.subscribers.emit('replacePrevious', items);
    };

    OutputStream.prototype.getFiles = function(match) {
      var end, file, filenames, start, _i, _len, _match, _ref;
      filenames = [];
      if (this.profile != null) {
        _ref = this.profile.files(match.input);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          _match = _ref[_i];
          _match.file = this.absolutePath(_match.file);
          if (fs.isFileSync(_match.file)) {
            filenames.push(_match);
          }
        }
      } else if ((this.regex != null) && (match.file != null)) {
        start = match.input.indexOf(match.file);
        end = start + match.file.length - 1;
        file = this.absolutePath(match.file);
        if (file == null) {
          return filenames;
        }
        filenames.push({
          file: file,
          start: start,
          end: end,
          row: match.row,
          col: match.col
        });
      }
      return filenames;
    };

    OutputStream.prototype.print = function(match) {
      return this.subscribers.emit('print', {
        input: match,
        files: this.getFiles(match)
      });
    };

    OutputStream.prototype.pushLinterMessage = function(message) {
      return this.subscribers.emit('linter', message);
    };

    OutputStream.prototype.createExtensionString = function(scopes, default_extensions) {
      var extension, extensions, extensions_raw, _i, _len;
      extensions_raw = [];
      extensions = [];
      scopes.forEach(function(scope) {
        var grammar;
        if ((grammar = atom.grammars.grammarForScopeName(scope)) != null) {
          return extensions_raw = extensions_raw.concat(grammar.fileTypes);
        }
      });
      if (extensions_raw.length === 0) {
        extensions_raw = default_extensions;
      }
      extensions_raw = extensions_raw.sort().reverse();
      for (_i = 0, _len = extensions_raw.length; _i < _len; _i++) {
        extension = extensions_raw[_i];
        extensions.push(extension.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&'));
      }
      return '(' + extensions.join('|') + ')';
    };

    OutputStream.prototype.createRegex = function(content, extensions) {
      content = content.replace(/\(\?extensions\)/g, extensions);
      return new XRegExp(content, 'xni');
    };

    OutputStream.prototype.lint = function(match) {
      var col, row;
      if ((match != null) && (match.file != null) && (match.row != null) && (match.type != null) && (match.message != null)) {
        row = 1;
        col = 10000;
        row = parseInt(match.row);
        if (match.col != null) {
          col = parseInt(match.col);
        }
        return this.pushLinterMessage({
          type: match.type,
          text: match.message,
          filePath: this.absolutePath(match.file),
          range: [[row - 1, 0], [row - 1, col - 1]],
          trace: match.trace
        });
      }
    };

    return OutputStream;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3BpcGVsaW5lL291dHB1dC1zdHJlYW0uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRFQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLHNCQUFSLENBQVgsQ0FBQTs7QUFBQSxFQUVDLFVBQVcsT0FBQSxDQUFRLFNBQVIsRUFBWCxPQUZELENBQUE7O0FBQUEsRUFJQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FKTCxDQUFBOztBQUFBLEVBS0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBTFAsQ0FBQTs7QUFBQSxFQU9DLFVBQVcsT0FBQSxDQUFRLE1BQVIsRUFBWCxPQVBELENBQUE7O0FBQUEsRUFTQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVIsQ0FUUCxDQUFBOztBQUFBLEVBV0EsVUFBQSxHQUFhLGlCQVhiLENBQUE7O0FBQUEsRUFZQSxNQUFBLEdBQVMsTUFaVCxDQUFBOztBQUFBLEVBY0EsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUVTLElBQUEsc0JBQUUsUUFBRixFQUFhLE1BQWIsR0FBQTtBQUNYLFVBQUEseUJBQUE7QUFBQSxNQURZLElBQUMsQ0FBQSxXQUFBLFFBQ2IsQ0FBQTtBQUFBLE1BRHVCLElBQUMsQ0FBQSxTQUFBLE1BQ3hCLENBQUE7QUFBQSx5Q0FBQSxDQUFBO0FBQUEsbUVBQUEsQ0FBQTtBQUFBLDJDQUFBLENBQUE7QUFBQSwrREFBQSxDQUFBO0FBQUEsMkRBQUEsQ0FBQTtBQUFBLHlEQUFBLENBQUE7QUFBQSwrQ0FBQSxDQUFBO0FBQUEsTUFBQSxJQUFHLDJCQUFIO0FBQ0UsUUFBQSxJQUFDLENBQUEsT0FBRCxxR0FBbUQ7QUFBQSxVQUFFLFNBQUQsSUFBQyxDQUFBLE9BQUY7QUFBQSxVQUFZLE9BQUQsSUFBQyxDQUFBLEtBQVo7QUFBQSxVQUFvQixpQkFBRCxJQUFDLENBQUEsZUFBcEI7QUFBQSxVQUFzQyxlQUFELElBQUMsQ0FBQSxhQUF0QztBQUFBLFVBQXNELGNBQUQsSUFBQyxDQUFBLFlBQXREO0FBQUEsVUFBcUUsbUJBQUQsSUFBQyxDQUFBLGlCQUFyRTtBQUFBLFVBQXlGLHVCQUFELElBQUMsQ0FBQSxxQkFBekY7QUFBQSxVQUFpSCxhQUFELElBQUMsQ0FBQSxXQUFqSDtBQUFBLFVBQStILE1BQUQsSUFBQyxDQUFBLElBQS9IO21CQUFuRCxDQUFBO0FBQ0EsUUFBQSxJQUFPLG9CQUFQOztnQkFDb0IsQ0FBRSxRQUFwQixDQUE4Qix1Q0FBQSxHQUF1QyxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQTdFO1dBREY7U0FEQTs7O2lCQUdRLENBQUU7O1NBSlo7T0FBQSxNQUFBO0FBTUUsUUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLElBQVgsQ0FORjtPQUFBO0FBUUEsTUFBQSxJQUFHLHlCQUFIO0FBQ0UsUUFBQSxJQUFDLENBQUEsS0FBRCxHQUFhLElBQUEsT0FBQSxDQUFRLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBaEIsRUFBdUIsS0FBdkIsQ0FBYixDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsU0FBQSxDQUFELEdBQVcsRUFEWCxDQUFBO0FBRUEsUUFBQSxJQUEyQyxJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVIsS0FBc0IsRUFBakU7QUFBQSxVQUFBLElBQUMsQ0FBQSxTQUFBLENBQUQsR0FBVyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBbkIsQ0FBWCxDQUFBO1NBSEY7T0FSQTtBQUFBLE1BYUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxHQUFBLENBQUEsT0FiZixDQUFBO0FBQUEsTUFjQSxJQUFDLENBQUEsTUFBRCxHQUFVLEVBZFYsQ0FBQTtBQUFBLE1BZUEsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFmaEIsQ0FEVztJQUFBLENBQWI7O0FBQUEsMkJBa0JBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxNQUFBLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQURmLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFGWCxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBSFQsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxFQUpWLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxZQUFELEdBQWdCLElBTGhCLENBQUE7YUFNQSxJQUFDLENBQUEsU0FBQSxDQUFELEdBQVcsR0FQSjtJQUFBLENBbEJULENBQUE7O0FBQUEsMkJBMkJBLG1CQUFBLEdBQXFCLFNBQUMsTUFBRCxFQUFTLFFBQVQsRUFBbUIsT0FBbkIsR0FBQTtBQUNuQixNQUFBLElBQWMsY0FBZDtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQ0EsTUFBQSxJQUFjLHdCQUFkO0FBQUEsY0FBQSxDQUFBO09BREE7YUFFQSxJQUFDLENBQUEsV0FBVyxDQUFDLEVBQWIsQ0FBZ0IsT0FBaEIsRUFBeUIsU0FBQyxDQUFELEdBQUE7ZUFBTyxNQUFPLENBQUEsUUFBQSxDQUFQLENBQWlCLENBQWpCLEVBQVA7TUFBQSxDQUF6QixFQUhtQjtJQUFBLENBM0JyQixDQUFBOztBQUFBLDJCQWdDQSxLQUFBLEdBQU8sU0FBQSxHQUFBO0FBQ0wsTUFBQSxJQUFVLElBQUMsQ0FBQSxNQUFELEtBQVcsRUFBckI7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLE9BQWxCLEVBQTJCO0FBQUEsUUFBQSxLQUFBLEVBQU8sSUFBQyxDQUFBLE1BQVI7QUFBQSxRQUFnQixLQUFBLEVBQU8sSUFBQyxDQUFBLFFBQUQsQ0FBVTtBQUFBLFVBQUEsS0FBQSxFQUFPLElBQUMsQ0FBQSxNQUFSO1NBQVYsQ0FBdkI7T0FBM0IsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsS0FBRCxDQUFPLElBQUMsQ0FBQSxNQUFSLENBRkEsQ0FBQTthQUdBLElBQUMsQ0FBQSxNQUFELEdBQVUsR0FKTDtJQUFBLENBaENQLENBQUE7O0FBQUEsMkJBc0NBLFVBQUEsR0FBWSxTQUFDLElBQUQsR0FBQTtBQUNWLFVBQUEsUUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsVUFBYixFQUF5QixFQUF6QixDQUFQLENBQUE7QUFDQSxNQUFBLElBQUcseUJBQUg7QUFDRSxRQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsWUFBRCxHQUFnQixJQUF4QixDQUFBO0FBQ0EsUUFBQSxJQUFHLFVBQVUsQ0FBQyxJQUFYLENBQWdCLEtBQWhCLENBQUg7QUFDRSxVQUFBLElBQUEsR0FBTyxLQUFLLENBQUMsT0FBTixDQUFjLFVBQWQsRUFBMEIsRUFBMUIsQ0FBUCxDQUFBO0FBQUEsVUFDQSxJQUFDLENBQUEsWUFBRCxHQUFnQixJQURoQixDQURGO1NBQUEsTUFBQTtBQUlFLFVBQUEsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsS0FBaEIsQ0FBQTtBQUFBLFVBQ0EsSUFBQSxHQUFPLEVBRFAsQ0FKRjtTQUZGO09BREE7QUFTQSxNQUFBLElBQUcsK0JBQUg7QUFDRSxRQUFBLElBQUMsQ0FBQSxZQUFELEdBQWdCLElBQUksQ0FBQyxNQUFMLENBQVksQ0FBQyxDQUFDLEtBQWQsQ0FBaEIsQ0FBQTtBQUFBLFFBQ0EsSUFBQSxHQUFPLElBQUksQ0FBQyxNQUFMLENBQVksQ0FBWixFQUFlLENBQUMsQ0FBQyxLQUFqQixDQURQLENBREY7T0FUQTtBQVlBLGFBQU8sSUFBUCxDQWJVO0lBQUEsQ0F0Q1osQ0FBQTs7QUFBQSwyQkFxREEsS0FBQSxHQUFJLFNBQUMsSUFBRCxHQUFBO0FBQ0YsVUFBQSwrQkFBQTtBQUFBLE1BQUEsSUFBMkIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxZQUFSLEtBQTBCLElBQTFCLElBQWtDLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixLQUF1QixRQUFwRjtBQUFBLFFBQUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxVQUFELENBQVksSUFBWixDQUFQLENBQUE7T0FBQTtBQUNBLE1BQUEsSUFBVSxJQUFBLEtBQVEsRUFBbEI7QUFBQSxjQUFBLENBQUE7T0FEQTtBQUFBLE1BRUEsSUFBQyxDQUFBLE1BQUQsSUFBVyxJQUZYLENBQUE7QUFBQSxNQUdBLEtBQUEsR0FBUSxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsQ0FBYyxJQUFkLENBSFIsQ0FBQTtBQUlBLFdBQUEsNERBQUE7NEJBQUE7QUFDRSxRQUFBLElBQVMsSUFBQSxLQUFRLEVBQVIsSUFBZSxLQUFBLEtBQVMsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUFoRDtBQUFBLGdCQUFBO1NBQUE7QUFDQSxRQUFBLElBQUcsS0FBQSxLQUFXLENBQWQ7QUFDRSxVQUFBLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixLQUFsQixDQUFBLENBQUE7QUFDQSxVQUFBLElBQUcsSUFBQSxLQUFVLEVBQWI7QUFDRSxZQUFBLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixLQUFsQixFQUF5QixJQUF6QixDQUFBLENBREY7V0FEQTtBQUdBLFVBQUEsSUFBRyxLQUFBLEtBQVcsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUE3QjtBQUNFLFlBQUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLE9BQWxCLEVBQTJCO0FBQUEsY0FBQSxLQUFBLEVBQU8sSUFBUDtBQUFBLGNBQWEsS0FBQSxFQUFPLElBQUMsQ0FBQSxRQUFELENBQVU7QUFBQSxnQkFBQSxLQUFBLEVBQU8sSUFBUDtlQUFWLENBQXBCO2FBQTNCLENBQUEsQ0FBQTtBQUFBLFlBQ0EsSUFBQyxDQUFBLEtBQUQsQ0FBTyxJQUFQLENBREEsQ0FERjtXQUpGO1NBQUEsTUFBQTtBQVFFLFVBQUEsSUFBRyxJQUFBLEtBQVEsQ0FBQyxDQUFBLEdBQUksSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYLENBQWlCLENBQUEsQ0FBQSxDQUF0QixDQUFYO0FBQ0UsWUFBQSxJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsS0FBbEIsQ0FBQSxDQURGO1dBQUE7QUFBQSxVQUVBLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixLQUFsQixFQUF5QixDQUF6QixDQUZBLENBQUE7QUFHQSxVQUFBLElBQUcsS0FBSyxDQUFDLE1BQU4sS0FBa0IsQ0FBckI7QUFDRSxZQUFBLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixPQUFsQixFQUEyQjtBQUFBLGNBQUEsS0FBQSxFQUFPLElBQVA7QUFBQSxjQUFhLEtBQUEsRUFBTyxJQUFDLENBQUEsUUFBRCxDQUFVO0FBQUEsZ0JBQUEsS0FBQSxFQUFPLElBQVA7ZUFBVixDQUFwQjthQUEzQixDQUFBLENBQUE7QUFBQSxZQUNBLElBQUMsQ0FBQSxLQUFELENBQU8sSUFBUCxDQURBLENBREY7V0FYRjtTQUZGO0FBQUEsT0FKQTthQW9CQSxJQUFDLENBQUEsTUFBRCxHQUFVLEtBQUssQ0FBQyxHQUFOLENBQUEsRUFyQlI7SUFBQSxDQXJESixDQUFBOztBQUFBLDJCQTRFQSxLQUFBLEdBQU8sU0FBQyxJQUFELEdBQUE7QUFDTCxVQUFBLENBQUE7QUFBQSxNQUFBLElBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxZQUFSLEtBQXdCLElBQTNCO2VBQ0UsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLFNBQWxCLEVBQTZCLFNBQTdCLEVBREY7T0FBQSxNQUVLLElBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxZQUFSLEtBQXdCLElBQTNCO0FBQ0gsUUFBQSxJQUFrQyxrQ0FBbEM7aUJBQUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLFNBQWxCLEVBQTZCLENBQTdCLEVBQUE7U0FERztPQUFBLE1BRUEsSUFBRyxJQUFDLENBQUEsTUFBTSxDQUFDLFlBQVIsS0FBd0IsSUFBeEIsSUFBaUMsc0JBQXBDO2VBQ0gsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFELENBQVIsQ0FBWSxJQUFaLEVBREc7T0FBQSxNQUVBLElBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxZQUFSLEtBQXdCLElBQTNCO2VBQ0gsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBaEIsRUFERztPQVBBO0lBQUEsQ0E1RVAsQ0FBQTs7QUFBQSwyQkFzRkEsU0FBQSxHQUFXLFNBQUMsSUFBRCxHQUFBO0FBQ1QsVUFBQSxJQUFBO21FQUFnQyxDQUFBLENBQUEsV0FEdkI7SUFBQSxDQXRGWCxDQUFBOztBQUFBLDJCQXlGQSxjQUFBLEdBQWdCLFNBQUMsSUFBRCxHQUFBO0FBQ2QsVUFBQSw2Q0FBQTtBQUFBLE1BQUEsSUFBYyxrQkFBZDtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQ0EsTUFBQSxJQUFHLG9DQUFIO0FBQ0UsUUFBQSxLQUFBLEdBQVEsRUFBUixDQUFBO0FBQ0E7QUFBQSxhQUFBLDJDQUFBO3VCQUFBO0FBQ0UsVUFBQSxLQUFNLENBQUEsQ0FBQSxDQUFOLEdBQVcsSUFBQyxDQUFBLFNBQUEsQ0FBUSxDQUFBLENBQUEsQ0FBcEIsQ0FERjtBQUFBLFNBREE7QUFHQTtBQUFBLGFBQUEsOENBQUE7d0JBQUE7QUFDRSxVQUFBLElBQW1CLFlBQW5CO0FBQUEsWUFBQSxLQUFNLENBQUEsQ0FBQSxDQUFOLEdBQVcsQ0FBRSxDQUFBLENBQUEsQ0FBYixDQUFBO1dBREY7QUFBQSxTQUhBO0FBQUEsUUFLQSxJQUFDLENBQUEsS0FBRCxDQUFPLEtBQVAsQ0FMQSxDQUFBO2VBTUEsSUFBQyxDQUFBLElBQUQsQ0FBTSxLQUFOLEVBUEY7T0FGYztJQUFBLENBekZoQixDQUFBOztBQUFBLDJCQW9HQSxPQUFBLEdBQVMsU0FBQyxLQUFELEdBQUE7QUFDUCxVQUFBLElBQUE7YUFBQSxJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsU0FBbEIsK0NBQWtELEtBQUssQ0FBQyxJQUF4RCxFQURPO0lBQUEsQ0FwR1QsQ0FBQTs7QUFBQSwyQkF1R0EsWUFBQSxHQUFjLFNBQUMsT0FBRCxHQUFBO0FBQ1osVUFBQSxFQUFBO0FBQUEsTUFBQSxJQUFhLEVBQUUsQ0FBQyxVQUFILENBQWMsRUFBQSxHQUFLLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxPQUF2QixFQUFnQyxJQUFDLENBQUEsUUFBUSxDQUFDLEVBQTFDLEVBQThDLE9BQTlDLENBQW5CLENBQWI7QUFBQSxlQUFPLEVBQVAsQ0FBQTtPQURZO0lBQUEsQ0F2R2QsQ0FBQTs7QUFBQSwyQkEwR0EsYUFBQSxHQUFlLFNBQUMsS0FBRCxHQUFBO0FBQ2IsVUFBQSxRQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sQ0FBTixDQUFBO0FBQUEsTUFDQSxHQUFBLEdBQU0sS0FETixDQUFBO0FBQUEsTUFFQSxHQUFBLEdBQU0sUUFBQSxDQUFTLEtBQUssQ0FBQyxHQUFmLENBRk4sQ0FBQTtBQUdBLE1BQUEsSUFBNkIsaUJBQTdCO0FBQUEsUUFBQSxHQUFBLEdBQU0sUUFBQSxDQUFTLEtBQUssQ0FBQyxHQUFmLENBQU4sQ0FBQTtPQUhBO0FBSUEsYUFBTztBQUFBLFFBQ0wsSUFBQSxFQUFNLEtBQUssQ0FBQyxJQURQO0FBQUEsUUFFTCxJQUFBLEVBQU0sS0FBSyxDQUFDLE9BRlA7QUFBQSxRQUdMLFFBQUEsRUFBVSxJQUFDLENBQUEsWUFBRCxDQUFjLEtBQUssQ0FBQyxJQUFwQixDQUhMO0FBQUEsUUFJTCxLQUFBLEVBQU8sQ0FDTCxDQUFDLEdBQUEsR0FBTSxDQUFQLEVBQVUsQ0FBVixDQURLLEVBRUwsQ0FBQyxHQUFBLEdBQU0sQ0FBUCxFQUFhLGlCQUFILEdBQW1CLEdBQUEsR0FBTSxDQUF6QixHQUFnQyxJQUExQyxDQUZLLENBSkY7T0FBUCxDQUxhO0lBQUEsQ0ExR2YsQ0FBQTs7QUFBQSwyQkF5SEEsZUFBQSxHQUFpQixTQUFDLFNBQUQsR0FBQTtBQUNmLFVBQUEscUJBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxFQUFSLENBQUE7QUFDQSxXQUFBLGdEQUFBOzZCQUFBO0FBQ0UsUUFBQSxLQUFLLENBQUMsSUFBTixDQUNFO0FBQUEsVUFBQSxLQUFBLEVBQU8sSUFBUDtBQUFBLFVBQ0EsS0FBQSxFQUFPLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBVixDQURQO1NBREYsQ0FBQSxDQURGO0FBQUEsT0FEQTthQUtBLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixpQkFBbEIsRUFBcUMsS0FBckMsRUFOZTtJQUFBLENBekhqQixDQUFBOztBQUFBLDJCQWlJQSxRQUFBLEdBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixVQUFBLG1EQUFBO0FBQUEsTUFBQSxTQUFBLEdBQVksRUFBWixDQUFBO0FBQ0EsTUFBQSxJQUFHLG9CQUFIO0FBQ0U7QUFBQSxhQUFBLDJDQUFBOzRCQUFBO0FBQ0UsVUFBQSxNQUFNLENBQUMsSUFBUCxHQUFjLElBQUMsQ0FBQSxZQUFELENBQWMsTUFBTSxDQUFDLElBQXJCLENBQWQsQ0FBQTtBQUNBLFVBQUEsSUFBeUIsRUFBRSxDQUFDLFVBQUgsQ0FBYyxNQUFNLENBQUMsSUFBckIsQ0FBekI7QUFBQSxZQUFBLFNBQVMsQ0FBQyxJQUFWLENBQWUsTUFBZixDQUFBLENBQUE7V0FGRjtBQUFBLFNBREY7T0FBQSxNQUlLLElBQUcsb0JBQUEsSUFBWSxvQkFBZjtBQUNILFFBQUEsS0FBQSxHQUFRLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBWixDQUFvQixLQUFLLENBQUMsSUFBMUIsQ0FBUixDQUFBO0FBQUEsUUFDQSxHQUFBLEdBQU0sS0FBQSxHQUFRLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBbkIsR0FBNEIsQ0FEbEMsQ0FBQTtBQUFBLFFBRUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxZQUFELENBQWMsS0FBSyxDQUFDLElBQXBCLENBRlAsQ0FBQTtBQUdBLFFBQUEsSUFBd0IsWUFBeEI7QUFBQSxpQkFBTyxTQUFQLENBQUE7U0FIQTtBQUFBLFFBSUEsU0FBUyxDQUFDLElBQVYsQ0FBZTtBQUFBLFVBQUMsSUFBQSxFQUFNLElBQVA7QUFBQSxVQUFhLEtBQUEsRUFBTyxLQUFwQjtBQUFBLFVBQTJCLEdBQUEsRUFBSyxHQUFoQztBQUFBLFVBQXFDLEdBQUEsRUFBSyxLQUFLLENBQUMsR0FBaEQ7QUFBQSxVQUFxRCxHQUFBLEVBQUssS0FBSyxDQUFDLEdBQWhFO1NBQWYsQ0FKQSxDQURHO09BTEw7QUFXQSxhQUFPLFNBQVAsQ0FaUTtJQUFBLENBaklWLENBQUE7O0FBQUEsMkJBK0lBLEtBQUEsR0FBTyxTQUFDLEtBQUQsR0FBQTthQUNMLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixPQUFsQixFQUEyQjtBQUFBLFFBQUEsS0FBQSxFQUFPLEtBQVA7QUFBQSxRQUFjLEtBQUEsRUFBTyxJQUFDLENBQUEsUUFBRCxDQUFVLEtBQVYsQ0FBckI7T0FBM0IsRUFESztJQUFBLENBL0lQLENBQUE7O0FBQUEsMkJBa0pBLGlCQUFBLEdBQW1CLFNBQUMsT0FBRCxHQUFBO2FBQ2pCLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixRQUFsQixFQUE0QixPQUE1QixFQURpQjtJQUFBLENBbEpuQixDQUFBOztBQUFBLDJCQXFKQSxxQkFBQSxHQUF1QixTQUFDLE1BQUQsRUFBUyxrQkFBVCxHQUFBO0FBQ3JCLFVBQUEsK0NBQUE7QUFBQSxNQUFBLGNBQUEsR0FBaUIsRUFBakIsQ0FBQTtBQUFBLE1BQ0EsVUFBQSxHQUFhLEVBRGIsQ0FBQTtBQUFBLE1BRUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxTQUFDLEtBQUQsR0FBQTtBQUNiLFlBQUEsT0FBQTtBQUFBLFFBQUEsSUFBRyw0REFBSDtpQkFDRSxjQUFBLEdBQWlCLGNBQWMsQ0FBQyxNQUFmLENBQXNCLE9BQU8sQ0FBQyxTQUE5QixFQURuQjtTQURhO01BQUEsQ0FBZixDQUZBLENBQUE7QUFNQSxNQUFBLElBQXVDLGNBQWMsQ0FBQyxNQUFmLEtBQXlCLENBQWhFO0FBQUEsUUFBQSxjQUFBLEdBQWlCLGtCQUFqQixDQUFBO09BTkE7QUFBQSxNQU9BLGNBQUEsR0FBaUIsY0FBYyxDQUFDLElBQWYsQ0FBQSxDQUFxQixDQUFDLE9BQXRCLENBQUEsQ0FQakIsQ0FBQTtBQVNBLFdBQUEscURBQUE7dUNBQUE7QUFDRSxRQUFBLFVBQVUsQ0FBQyxJQUFYLENBQWdCLFNBQVMsQ0FBQyxPQUFWLENBQWtCLHNCQUFsQixFQUEwQyxNQUExQyxDQUFoQixDQUFBLENBREY7QUFBQSxPQVRBO2FBWUEsR0FBQSxHQUFNLFVBQVUsQ0FBQyxJQUFYLENBQWdCLEdBQWhCLENBQU4sR0FBNkIsSUFiUjtJQUFBLENBckp2QixDQUFBOztBQUFBLDJCQW9LQSxXQUFBLEdBQWEsU0FBQyxPQUFELEVBQVUsVUFBVixHQUFBO0FBQ1gsTUFBQSxPQUFBLEdBQVUsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsbUJBQWhCLEVBQXFDLFVBQXJDLENBQVYsQ0FBQTthQUNJLElBQUEsT0FBQSxDQUFRLE9BQVIsRUFBaUIsS0FBakIsRUFGTztJQUFBLENBcEtiLENBQUE7O0FBQUEsMkJBd0tBLElBQUEsR0FBTSxTQUFDLEtBQUQsR0FBQTtBQUNKLFVBQUEsUUFBQTtBQUFBLE1BQUEsSUFBRyxlQUFBLElBQVcsb0JBQVgsSUFBMkIsbUJBQTNCLElBQTBDLG9CQUExQyxJQUEwRCx1QkFBN0Q7QUFDRSxRQUFBLEdBQUEsR0FBTSxDQUFOLENBQUE7QUFBQSxRQUNBLEdBQUEsR0FBTSxLQUROLENBQUE7QUFBQSxRQUVBLEdBQUEsR0FBTSxRQUFBLENBQVMsS0FBSyxDQUFDLEdBQWYsQ0FGTixDQUFBO0FBR0EsUUFBQSxJQUE2QixpQkFBN0I7QUFBQSxVQUFBLEdBQUEsR0FBTSxRQUFBLENBQVMsS0FBSyxDQUFDLEdBQWYsQ0FBTixDQUFBO1NBSEE7ZUFJQSxJQUFDLENBQUEsaUJBQUQsQ0FDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLEtBQUssQ0FBQyxJQUFaO0FBQUEsVUFDQSxJQUFBLEVBQU0sS0FBSyxDQUFDLE9BRFo7QUFBQSxVQUVBLFFBQUEsRUFBVSxJQUFDLENBQUEsWUFBRCxDQUFjLEtBQUssQ0FBQyxJQUFwQixDQUZWO0FBQUEsVUFHQSxLQUFBLEVBQU8sQ0FDTCxDQUFDLEdBQUEsR0FBTSxDQUFQLEVBQVUsQ0FBVixDQURLLEVBRUwsQ0FBQyxHQUFBLEdBQU0sQ0FBUCxFQUFVLEdBQUEsR0FBTSxDQUFoQixDQUZLLENBSFA7QUFBQSxVQU9BLEtBQUEsRUFBTyxLQUFLLENBQUMsS0FQYjtTQURGLEVBTEY7T0FESTtJQUFBLENBeEtOLENBQUE7O3dCQUFBOztNQWpCSixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/pipeline/output-stream.coffee
