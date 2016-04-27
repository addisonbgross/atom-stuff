(function() {
  var addAttrs, filewalker, fs, moment, pad, parser, sloc, suffixes,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs');

  moment = require('moment');

  sloc = require('sloc');

  filewalker = require('filewalker');

  parser = require('gitignore-parser');

  suffixes = ["asm", "c", "cc", "clj", "cljs", "coffee", "cpp", "cr", "cs", "css", "cxx", "erl", "go", "groovy", "gs", "h", "handlebars", "hbs", "hpp", "hr", "hs", "html", "htm", "hx", "hxx", "hy", "iced", "ino", "jade", "java", "jl", "js", "jsx", "less", "lua", "ls", "ml", "mli", "mochi", "monkey", "mustache", "nix", "nim", "php", "php5", "pl", "py", "r", "rb", "rkt", "rs", "sass", "scala", "scss", "styl", "svg", "swift", "ts", "vb", "xml", "yaml", "m", "mm"];

  pad = function(num, w) {
    num = '' + num;
    while (num.length < w) {
      num = ' ' + num;
    }
    return ' ' + num;
  };

  addAttrs = function(sfx, aIn, b) {
    var a, k, v, _results;
    a = (aIn[sfx] != null ? aIn[sfx] : aIn[sfx] = {});
    _results = [];
    for (k in b) {
      v = b[k];
      if (a[k] == null) {
        a[k] = 0;
      }
      a[k] += v;
      _results.push(null);
    }
    return _results;
  };

  module.exports = {
    activate: function() {
      var e;
      try {
        this.gitignore = parser.compile(fs.readFileSync(".gitignore", "utf8"));
      } catch (_error) {
        e = _error;
        this.gitignore = null;
      }
      return this.sub = atom.commands.add('atom-workspace', {
        'line-count:open': (function(_this) {
          return function() {
            return _this.open();
          };
        })(this)
      });
    },
    open: function() {
      var add, printSection, text;
      text = '';
      add = function(txt) {
        return text += (txt != null ? txt : '') + '\n';
      };
      printSection = function(title, data) {
        var c, hdr, i, label, line, lines, maxC, maxS, maxT, wc, ws, wt, _i, _j, _len, _ref;
        hdr = '\n' + title + '\n';
        for (i = _i = 0, _ref = title.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          hdr += '-';
        }
        add(hdr);
        maxS = maxC = maxT = 0;
        for (label in data) {
          c = data[label];
          maxS = Math.max(maxS, c.source);
          maxC = Math.max(maxC, c.comment);
          maxT = Math.max(maxT, c.total);
          ws = ('' + maxS).length + 1;
          wc = ('' + maxC).length + 1;
          wt = ('' + maxT).length + 1;
        }
        lines = (function() {
          var _results;
          _results = [];
          for (label in data) {
            c = data[label];
            _results.push([label, c]);
          }
          return _results;
        })();
        lines.sort();
        for (_j = 0, _len = lines.length; _j < _len; _j++) {
          line = lines[_j];
          label = line[0], c = line[1];
          add(pad(c.source, ws) + pad(c.comment, wc) + pad(c.total, wt) + '  ' + label);
        }
        return null;
      };
      return atom.workspace.open('line-count.txt').then((function(_this) {
        return function(editor) {
          var dirs, files, rootDirPath, total, typeData;
          rootDirPath = atom.project.getDirectories()[0].getPath();
          files = {};
          typeData = {};
          dirs = {};
          total = {};
          return filewalker(rootDirPath, {
            maxPending: 4
          }).on("file", function(path, stats, absPath) {
            var code, counts, dir, dirPart, dirParts, e, idx, sfx, sfxMatch, _i, _len, _ref;
            sfxMatch = /\.([^\.]+)$/.exec(path);
            if (sfxMatch && (_ref = (sfx = sfxMatch[1]), __indexOf.call(suffixes, _ref) >= 0) && path.indexOf('node_modules') === -1 && path.indexOf('bower_components') === -1 && (!_this.gitignore || _this.gitignore.accepts(path))) {
              code = fs.readFileSync(absPath, 'utf8');
              code = code.replace(/\r/g, '');
              try {
                counts = sloc(code, sfx);
              } catch (_error) {
                e = _error;
                add('Warning: ' + e.message);
                return;
              }
              dirParts = path.split('/');
              dir = '';
              for (idx = _i = 0, _len = dirParts.length; _i < _len; idx = ++_i) {
                dirPart = dirParts[idx];
                if (idx === dirParts.length - 1) {
                  break;
                }
                dir += dirPart;
                addAttrs(dir, dirs, counts);
                dir += '/';
              }
              files[path] = counts;
              addAttrs(sfx, typeData, counts);
              return addAttrs('', total, counts);
            }
          }).on("error", function(err) {
            return add(err.message);
          }).on("done", function() {
            add('\nLine counts for project ' + rootDirPath + '.');
            add('Generated by the Atom editor package Line-Count on ' + moment().format('MMMM D YYYY H:mm.'));
            add('Counts are in order of source, comments, and total.');
            printSection('Files', files);
            printSection('Directories', dirs);
            printSection('Types', typeData);
            printSection('Total', total);
            return editor.setText(text);
          }).walk();
        };
      })(this));
    },
    deactivate: function() {
      return this.sub.dispose();
    }
  };

  
;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvbGluZS1jb3VudC9saWIvbGluZS1jb3VudC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEsNkRBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBYSxPQUFBLENBQVEsSUFBUixDQUFiLENBQUE7O0FBQUEsRUFDQSxNQUFBLEdBQWEsT0FBQSxDQUFRLFFBQVIsQ0FEYixDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFhLE9BQUEsQ0FBUSxNQUFSLENBRmIsQ0FBQTs7QUFBQSxFQUdBLFVBQUEsR0FBYSxPQUFBLENBQVEsWUFBUixDQUhiLENBQUE7O0FBQUEsRUFJQSxNQUFBLEdBQWEsT0FBQSxDQUFRLGtCQUFSLENBSmIsQ0FBQTs7QUFBQSxFQU1BLFFBQUEsR0FBVyxDQUNULEtBRFMsRUFFVCxHQUZTLEVBR1QsSUFIUyxFQUlULEtBSlMsRUFLVCxNQUxTLEVBTVQsUUFOUyxFQU9ULEtBUFMsRUFRVCxJQVJTLEVBU1QsSUFUUyxFQVVULEtBVlMsRUFXVCxLQVhTLEVBWVQsS0FaUyxFQWFULElBYlMsRUFjVCxRQWRTLEVBZVQsSUFmUyxFQWdCVCxHQWhCUyxFQWlCVCxZQWpCUyxFQWlCSyxLQWpCTCxFQWtCVCxLQWxCUyxFQW1CVCxJQW5CUyxFQW9CVCxJQXBCUyxFQXFCVCxNQXJCUyxFQXFCRCxLQXJCQyxFQXNCVCxJQXRCUyxFQXVCVCxLQXZCUyxFQXdCVCxJQXhCUyxFQXlCVCxNQXpCUyxFQTBCVCxLQTFCUyxFQTJCVCxNQTNCUyxFQTRCVCxNQTVCUyxFQTZCVCxJQTdCUyxFQThCVCxJQTlCUyxFQStCVCxLQS9CUyxFQWdDVCxNQWhDUyxFQWlDVCxLQWpDUyxFQWtDVCxJQWxDUyxFQW1DVCxJQW5DUyxFQW9DVCxLQXBDUyxFQXFDVCxPQXJDUyxFQXNDVCxRQXRD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

//# sourceURL=/home/champ/.atom/packages/line-count/lib/line-count.coffee
