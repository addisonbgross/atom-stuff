(function() {
  var Ansi, AnsiEnd, AnsiStart, CSON, Emitter, OutputStream, Profiles, XRegExp, fs, path,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Profiles = require('../profiles/profiles');

  XRegExp = require('xregexp').XRegExp;

  fs = require('fs-plus');

  path = require('path');

  Emitter = require('atom').Emitter;

  CSON = require('season');

  Ansi = /\x1b\[(\d[ABCDEFGJKST]|\d;\d[Hf]|[45]i|6n|[su]|\?25[lh]|[0-9;]*m)/g;

  AnsiStart = /^\x1b\[(\d[ABCDEFGJKST]|\d;\d[Hf]|[45]i|6n|[su]|\?25[lh]|[0-9;]*m)/;

  AnsiEnd = /\x1b\[?(\d?|\d?;?\d?|[45]?|6?|\??2?5?|[0-9;]*)$/;

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
      data = data.replace(Ansi, '');
      if (this.endsWithAnsi != null) {
        _part = this.endsWithAnsi + data;
        if (AnsiStart.test(_part)) {
          data = _part.replace(Ansi, '');
          this.endsWithAnsi = null;
        } else {
          this.endsWithAnsi = _part;
          data = '';
        }
      }
      if ((m = AnsiEnd.exec(data)) != null) {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3BpcGVsaW5lL291dHB1dC1zdHJlYW0uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtGQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLHNCQUFSLENBQVgsQ0FBQTs7QUFBQSxFQUVDLFVBQVcsT0FBQSxDQUFRLFNBQVIsRUFBWCxPQUZELENBQUE7O0FBQUEsRUFJQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FKTCxDQUFBOztBQUFBLEVBS0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBTFAsQ0FBQTs7QUFBQSxFQU9DLFVBQVcsT0FBQSxDQUFRLE1BQVIsRUFBWCxPQVBELENBQUE7O0FBQUEsRUFTQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVIsQ0FUUCxDQUFBOztBQUFBLEVBV0EsSUFBQSxHQUFPLG9FQVhQLENBQUE7O0FBQUEsRUFZQSxTQUFBLEdBQVksb0VBWlosQ0FBQTs7QUFBQSxFQWFBLE9BQUEsR0FBVSxpREFiVixDQUFBOztBQUFBLEVBZUEsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUVTLElBQUEsc0JBQUUsUUFBRixFQUFhLE1BQWIsR0FBQTtBQUNYLFVBQUEseUJBQUE7QUFBQSxNQURZLElBQUMsQ0FBQSxXQUFBLFFBQ2IsQ0FBQTtBQUFBLE1BRHVCLElBQUMsQ0FBQSxTQUFBLE1BQ3hCLENBQUE7QUFBQSx5Q0FBQSxDQUFBO0FBQUEsbUVBQUEsQ0FBQTtBQUFBLDJDQUFBLENBQUE7QUFBQSwrREFBQSxDQUFBO0FBQUEsMkRBQUEsQ0FBQTtBQUFBLHlEQUFBLENBQUE7QUFBQSwrQ0FBQSxDQUFBO0FBQUEsTUFBQSxJQUFHLDJCQUFIO0FBQ0UsUUFBQSxJQUFDLENBQUEsT0FBRCxx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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/pipeline/output-stream.coffee
