(function() {
  var Emitter, Modifiers, OutputPipeline, XRegExp, fs, path,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  XRegExp = require('xregexp').XRegExp;

  Modifiers = require('../stream-modifiers/modifiers');

  Emitter = require('atom').Emitter;

  fs = require('fs-plus');

  path = require('path');

  module.exports = OutputPipeline = (function() {
    function OutputPipeline(settings, stream) {
      var c, config, name, _i, _len, _ref, _ref1, _ref2;
      this.settings = settings;
      this.stream = stream;
      this.lint = __bind(this.lint, this);
      this.pushLinterMessage = __bind(this.pushLinterMessage, this);
      this.print = __bind(this.print, this);
      this.replacePrevious = __bind(this.replacePrevious, this);
      this.createMessage = __bind(this.createMessage, this);
      this.absolutePath = __bind(this.absolutePath, this);
      this.setType = __bind(this.setType, this);
      this.subscribers = new Emitter;
      this.pipeline = [];
      _ref = this.stream.pipeline;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref1 = _ref[_i], name = _ref1.name, config = _ref1.config;
        if ((c = Modifiers.modules[name]) != null) {
          if (c.modifier.prototype.modify != null) {
            Modifiers.activate(name);
            this.pipeline.push(new c.modifier(config, this.settings, this));
          }
        } else {
          if ((_ref2 = atom.notifications) != null) {
            _ref2.addError("Could not find stream modifier: " + name);
          }
        }
      }
      this.perm = {
        cwd: '.'
      };
    }

    OutputPipeline.prototype.destroy = function() {
      var mod, _i, _len, _ref;
      _ref = this.pipeline;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        mod = _ref[_i];
        if (typeof mod.destroy === "function") {
          mod.destroy();
        }
      }
      this.pipeline = null;
      this.subscribers.dispose();
      return this.subscribers = null;
    };

    OutputPipeline.prototype.subscribeToCommands = function(object, callback, command) {
      return this.subscribers.on(command, function(o) {
        return object[callback](o);
      });
    };

    OutputPipeline.prototype.getFiles = function(match) {
      var filenames, fp, mod, _i, _j, _len, _len1, _match, _ref, _ref1;
      filenames = [];
      _ref = this.pipeline;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        mod = _ref[_i];
        if (mod.getFiles == null) {
          continue;
        }
        _ref1 = mod.getFiles({
          temp: match,
          perm: this.perm
        });
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          _match = _ref1[_j];
          if (_match.file && ((fp = this.absolutePath(_match.file)) != null)) {
            _match.file = fp;
            filenames.push(_match);
          }
        }
      }
      return filenames;
    };

    OutputPipeline.prototype.finishLine = function(td, input) {
      var files;
      if (td.input !== input || (files = this.getFiles(td)).length !== 0) {
        this.print(td, files);
      } else if (td.type != null) {
        this.setType(td);
      }
      if (td.file != null) {
        return this.lint(td);
      }
    };

    OutputPipeline.prototype["in"] = function(_input) {
      var mod, td, _i, _len, _ref;
      td = {
        input: _input
      };
      _ref = this.pipeline;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        mod = _ref[_i];
        if (mod.modify({
          temp: td,
          perm: this.perm
        }) !== null) {
          return;
        }
      }
      return this.finishLine(td, _input);
    };

    OutputPipeline.prototype.setType = function(match) {
      var _ref;
      return this.subscribers.emit('setType', (_ref = match.highlighting) != null ? _ref : match.type);
    };

    OutputPipeline.prototype.absolutePath = function(relpath) {
      var fp;
      if (fs.existsSync(fp = path.resolve(this.settings.project, this.settings.wd, this.perm.cwd, relpath))) {
        return fp;
      }
    };

    OutputPipeline.prototype.createMessage = function(match) {
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

    OutputPipeline.prototype.replacePrevious = function(new_lines) {
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

    OutputPipeline.prototype.print = function(match, _files) {
      if (_files == null) {
        _files = this.getFiles(match);
      }
      return this.subscribers.emit('print', {
        input: match,
        files: _files
      });
    };

    OutputPipeline.prototype.pushLinterMessage = function(message) {
      return this.subscribers.emit('linter', message);
    };

    OutputPipeline.prototype.createExtensionString = function(scopes, default_extensions) {
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

    OutputPipeline.prototype.createRegex = function(content, extensions) {
      content = content.replace(/\(\?extensions\)/g, extensions);
      return new XRegExp(content, 'xni');
    };

    OutputPipeline.prototype.lint = function(match) {
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

    return OutputPipeline;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3BpcGVsaW5lL291dHB1dC1waXBlbGluZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscURBQUE7SUFBQSxrRkFBQTs7QUFBQSxFQUFBLE9BQUEsR0FBVSxPQUFBLENBQVEsU0FBUixDQUFrQixDQUFDLE9BQTdCLENBQUE7O0FBQUEsRUFDQSxTQUFBLEdBQVksT0FBQSxDQUFRLCtCQUFSLENBRFosQ0FBQTs7QUFBQSxFQUdDLFVBQVcsT0FBQSxDQUFRLE1BQVIsRUFBWCxPQUhELENBQUE7O0FBQUEsRUFLQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FMTCxDQUFBOztBQUFBLEVBTUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBTlAsQ0FBQTs7QUFBQSxFQVFBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFFUyxJQUFBLHdCQUFFLFFBQUYsRUFBYSxNQUFiLEdBQUE7QUFDWCxVQUFBLDZDQUFBO0FBQUEsTUFEWSxJQUFDLENBQUEsV0FBQSxRQUNiLENBQUE7QUFBQSxNQUR1QixJQUFDLENBQUEsU0FBQSxNQUN4QixDQUFBO0FBQUEseUNBQUEsQ0FBQTtBQUFBLG1FQUFBLENBQUE7QUFBQSwyQ0FBQSxDQUFBO0FBQUEsK0RBQUEsQ0FBQTtBQUFBLDJEQUFBLENBQUE7QUFBQSx5REFBQSxDQUFBO0FBQUEsK0NBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxHQUFBLENBQUEsT0FBZixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsUUFBRCxHQUFZLEVBRFosQ0FBQTtBQUVBO0FBQUEsV0FBQSwyQ0FBQSxHQUFBO0FBQ0UsMEJBREcsYUFBQSxNQUFNLGVBQUEsTUFDVCxDQUFBO0FBQUEsUUFBQSxJQUFHLHFDQUFIO0FB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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/pipeline/output-pipeline.coffee
