(function() {
  var addAttrs, filewalker, fs, moment, pad, sloc, suffixes,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs');

  moment = require('moment');

  sloc = require('sloc');

  filewalker = require('filewalker');

  suffixes = ['coffee', 'js', 'h', 'hx', 'hpp', 'hxx', 'c', 'cc', 'cpp', 'cxx', 'java', 'php', 'php5', 'go', 'css', 'scss', 'less', 'py', 'html'];

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
      return atom.workspace.open('Line Count').then(function(editor) {
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
          if (sfxMatch && (_ref = (sfx = sfxMatch[1]), __indexOf.call(suffixes, _ref) >= 0) && path.indexOf('node_modules') === -1 && path.indexOf('bower_components') === -1) {
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
      });
    },
    deactivate: function() {
      return this.sub.dispose();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvbGluZS1jb3VudC9saWIvbGluZS1jb3VudC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEscURBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBYSxPQUFBLENBQVEsSUFBUixDQUFiLENBQUE7O0FBQUEsRUFDQSxNQUFBLEdBQWEsT0FBQSxDQUFRLFFBQVIsQ0FEYixDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFhLE9BQUEsQ0FBUSxNQUFSLENBRmIsQ0FBQTs7QUFBQSxFQUdBLFVBQUEsR0FBYSxPQUFBLENBQVEsWUFBUixDQUhiLENBQUE7O0FBQUEsRUFLQSxRQUFBLEdBQVcsQ0FDVCxRQURTLEVBRVQsSUFGUyxFQUdULEdBSFMsRUFJVCxJQUpTLEVBS1QsS0FMUyxFQU1ULEtBTlMsRUFPVCxHQVBTLEVBUVQsSUFSUyxFQVNULEtBVFMsRUFVVCxLQVZTLEVBV1QsTUFYUyxFQVlULEtBWlMsRUFhVCxNQWJTLEVBY1QsSUFkUyxFQWVULEtBZlMsRUFnQlQsTUFoQlMsRUFpQlQsTUFqQlMsRUFrQlQsSUFsQlMsRUFtQlQsTUFuQlMsQ0FMWCxDQUFBOztBQUFBLEVBMkJBLEdBQUEsR0FBTSxTQUFDLEdBQUQsRUFBTSxDQUFOLEdBQUE7QUFDSixJQUFBLEdBQUEsR0FBTSxFQUFBLEdBQUssR0FBWCxDQUFBO0FBQ0EsV0FBTSxHQUFHLENBQUMsTUFBSixHQUFhLENBQW5CLEdBQUE7QUFBMEIsTUFBQSxHQUFBLEdBQU0sR0FBQSxHQUFNLEdBQVosQ0FBMUI7SUFBQSxDQURBO1dBRUEsR0FBQSxHQUFNLElBSEY7RUFBQSxDQTNCTixDQUFBOztBQUFBLEVBZ0NBLFFBQUEsR0FBVyxTQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsQ0FBWCxHQUFBO0FBQ1QsUUFBQSxpQkFB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

//# sourceURL=/home/champ/.atom/packages/line-count/lib/line-count.coffee
