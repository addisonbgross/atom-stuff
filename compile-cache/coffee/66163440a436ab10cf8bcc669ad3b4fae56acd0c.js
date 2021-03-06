(function() {
  var addAttrs, filewalker, fs, moment, pad, parser, sloc, suffixes,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  console.log('load');

  fs = require('fs');

  moment = require('moment');

  sloc = require('sloc');

  filewalker = require('filewalker');

  parser = require('gitignore-parser');

  suffixes = ['coffee', 'js', 'h', 'hx', 'hpp', 'hxx', 'c', 'cc', 'cpp', 'cxx', 'java', 'php', 'php5', 'go', 'css', 'scss', 'less', 'py', 'html', 'twig', 'jade'];

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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvbGluZS1jb3VudC9saWIvbGluZS1jb3VudC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEsNkRBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksTUFBWixDQUFBLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQWEsT0FBQSxDQUFRLElBQVIsQ0FGYixDQUFBOztBQUFBLEVBR0EsTUFBQSxHQUFhLE9BQUEsQ0FBUSxRQUFSLENBSGIsQ0FBQTs7QUFBQSxFQUlBLElBQUEsR0FBYSxPQUFBLENBQVEsTUFBUixDQUpiLENBQUE7O0FBQUEsRUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLFlBQVIsQ0FMYixDQUFBOztBQUFBLEVBTUEsTUFBQSxHQUFhLE9BQUEsQ0FBUSxrQkFBUixDQU5iLENBQUE7O0FBQUEsRUFRQSxRQUFBLEdBQVcsQ0FDVCxRQURTLEVBRVQsSUFGUyxFQUdULEdBSFMsRUFJVCxJQUpTLEVBS1QsS0FMUyxFQU1ULEtBTlMsRUFPVCxHQVBTLEVBUVQsSUFSUyxFQVNULEtBVFMsRUFVVCxLQVZTLEVBV1QsTUFYUyxFQVlULEtBWlMsRUFhVCxNQWJTLEVBY1QsSUFkUyxFQWVULEtBZlMsRUFnQlQsTUFoQlMsRUFpQlQsTUFqQlMsRUFrQlQsSUFsQlMsRUFtQlQsTUFuQlMsRUFvQlQsTUFwQlMsRUFxQlQsTUFyQlMsQ0FSWCxDQUFBOztBQUFBLEVBZ0NBLEdBQUEsR0FBTSxTQUFDLEdBQUQsRUFBTSxDQUFOLEdBQUE7QUFDSixJQUFBLEdBQUEsR0FBTSxFQUFBLEdBQUssR0FBWCxDQUFBO0FBQ0EsV0FBTSxHQUFHLENBQUMsTUFBSixHQUFhLENBQW5CLEdBQUE7QUFBMEIsTUFBQSxHQUFBLEdBQU0sR0FBQSxHQUFNLEdBQVosQ0FBMUI7SUFBQSxDQURBO1dBRUEsR0FBQSxHQUFNLElBSEY7RUFBQSxDQWhDTixDQUFBOztBQUFBLEVBcUNBLFFBQUEsR0FBVyxTQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsQ0FBWCxHQUFBO0FBQ1QsUUFBQSxpQkFBQTtBQUFBLElBQUEsQ0FBQSxHQUFJLG9CQUFDLEdBQUksQ0FBQSxHQUFBLElBQUosR0FBSSxDQUFBLEdBQUEsSUFBUSxFQUFiLENBQUosQ0FBQTtBQUNBO1NBQUEsTUFBQTtlQUFBOztRQUNFLENBQUUsQ0FBQSxDQUFBLElBQU07T0FBUjtBQUFBLE1BQ0EsQ0FBRSxDQUFBLENBQUEsQ0FBRixJQUFRLENBRFIsQ0FBQTtBQUFBLG9CQUVBLEtBRkEsQ0FERjtBQUFBO29CQUZTO0VBQUEsQ0FyQ1gsQ0FBQTs7QUFBQSxFQTRDQSxNQUFNLENBQUMsT0FBUCxHQUVFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsVUFBQSxDQUFBO0FBQUE7QUFDRSxRQUFBLElBQUMsQ0FBQSxTQUFELEdBQWEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxFQUFFLENBQUMsWUFBSCxDQUFnQixZQUFoQixFQUE4QixNQUE5QixDQUFmLENBQWIsQ0FERjtPQUFBLGNBQUE7QUFHRSxRQURJLFVBQ0osQ0FBQTtBQUFBLFFBQUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFiLENBSEY7T0FBQTthQUlBLElBQUMsQ0FBQSxHQUFELEdBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztBQUFBLFFBQUEsaUJBQUEsRUFBbUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLElBQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkI7T0FBcEMsRUFMQztJQUFBLENBQVY7QUFBQSxJQU9BLElBQUEsRUFBTSxTQUFBLEdBQUE7QUFDSixVQUFBLHVCQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sRUFBUCxDQUFBO0FBQUEsTUFDQSxHQUFBLEdBQU0sU0FBQyxHQUFELEdBQUE7ZUFBUyxJQUFBLElBQVEsZUFBQyxNQUFNLEVBQVAsQ0FBQSxHQUFhLEtBQTlCO01BQUEsQ0FETixDQUFBO0FBQUEsTUFHQSxZQUFBLEdBQWUsU0FBQyxLQUFELEVBQVEsSUFBUixHQUFBO0FBQ2IsWUFBQSwrRUFBQTtBQUFBLFFBQUEsR0FBQSxHQUFNLElBQUEsR0FBTyxLQUFQLEdBQWUsSUFBckIsQ0FBQTtBQUNBLGFBQVMsK0ZBQVQsR0FBQTtBQUFpQyxVQUFBLEdBQUEsSUFBTyxHQUFQLENBQWpDO0FBQUEsU0FEQTtBQUFBLFFBRUEsR0FBQSxDQUFJLEdBQUosQ0FGQSxDQUFBO0FBQUEsUUFJQSxJQUFBLEdBQU8sSUFBQSxHQUFPLElBQUEsR0FBTyxDQUpyQixDQUFBO0FBS0EsYUFBQSxhQUFBOzBCQUFBO0FBQ0UsVUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEdBQUwsQ0FBUyxJQUFULEVBQWUsQ0FBQyxDQUFDLE1BQWpCLENBQVAsQ0FBQTtBQUFBLFVBQ0EsSUFBQSxHQUFPLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBVCxFQUFlLENBQUMsQ0FBQyxPQUFqQixDQURQLENBQUE7QUFBQSxVQUVBLElBQUEsR0FBTyxJQUFJLENBQUMsR0FBTCxDQUFTLElBQVQsRUFBZSxDQUFDLENBQUMsS0FBakIsQ0FGUCxDQUFBO0FBQUEsVUFHQSxFQUFBLEdBQUssQ0FBQyxFQUFBLEdBQUssSUFBTixDQUFXLENBQUMsTUFBWixHQUFxQixDQUgxQixDQUFBO0FBQUEsVUFJQSxFQUFBLEdBQUssQ0FBQyxFQUFBLEdBQUssSUFBTixDQUFXLENBQUMsTUFBWixHQUFxQixDQUoxQixDQUFBO0FBQUEsVUFLQSxFQUFBLEdBQUssQ0FBQyxFQUFBLEdBQUssSUFBTixDQUFXLENBQUMsTUFBWixHQUFxQixDQUwxQixDQURGO0FBQUEsU0FMQTtBQUFBLFFBYUEsS0FBQTs7QUFBUztlQUFBLGFBQUE7NEJBQUE7QUFBQSwwQkFBQSxDQUFDLEtBQUQsRUFBUSxDQUFSLEVBQUEsQ0FBQTtBQUFBOztZQWJULENBQUE7QUFBQSxRQWNBLEtBQUssQ0FBQyxJQUFOLENBQUEsQ0FkQSxDQUFBO0FBZUEsYUFBQSw0Q0FBQTsyQkFBQTtBQUNFLFVBQUMsZUFBRCxFQUFRLFdBQVIsQ0FBQTtBQUFBLFVBQ0EsR0FBQSxDQUFJLEdBQUEsQ0FBSSxDQUFDLENBQUMsTUFBTixFQUFjLEVBQWQsQ0FBQSxHQUFvQixHQUFBLENBQUksQ0FBQyxDQUFDLE9BQU4sRUFBZSxFQUFmLENBQXBCLEdBQXlDLEdBQUEsQ0FBSSxDQUFDLENBQUMsS0FBTixFQUFhLEVBQWIsQ0FBekMsR0FBNEQsSUFBNUQsR0FBbUUsS0FBdkUsQ0FEQSxDQURGO0FBQUEsU0FmQTtlQWtCQSxLQW5CYTtNQUFBLENBSGYsQ0FBQTthQXdCQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsZ0JBQXBCLENBQXFDLENBQUMsSUFBdEMsQ0FBMkMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO0FBQ3pDLGNBQUEseUNBQUE7QUFBQSxVQUFBLFdBQUEsR0FBYyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWIsQ0FBQSxDQUE4QixDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQWpDLENBQUEsQ0FBZCxDQUFBO0FBQUEsVUFFQSxLQUFBLEdBQVcsRUFGWCxDQUFBO0FBQUEsVUFHQSxRQUFBLEdBQVcsRUFIWCxDQUFBO0FBQUEsVUFJQSxJQUFBLEdBQVcsRUFKWCxDQUFBO0FBQUEsVUFLQSxLQUFBLEdBQVcsRUFMWCxDQUFBO2lCQU9BLFVBQUEsQ0FBVyxXQUFYLEVBQXdCO0FBQUEsWUFBQSxVQUFBLEVBQVksQ0FBWjtXQUF4QixDQUFzQyxDQUFDLEVBQXZDLENBQTBDLE1BQTFDLEVBQWtELFNBQUMsSUFBRCxFQUFPLEtBQVAsRUFBYyxPQUFkLEdBQUE7QUFDOUMsZ0JBQUEsMkVBQUE7QUFBQSxZQUFBLFFBQUEsR0FBVyxhQUFhLENBQUMsSUFBZCxDQUFtQixJQUFuQixDQUFYLENBQUE7QUFDQSxZQUFBLElBQUcsUUFBQSxJQUNDLFFBQUEsQ0FBQyxHQUFBLEdBQU0sUUFBUyxDQUFBLENBQUEsQ0FBaEIsQ0FBQSxFQUFBLGVBQXVCLFFBQXZCLEVBQUEsSUFBQSxNQUFBLENBREQsSUFFQyxJQUFJLENBQUMsT0FBTCxDQUFhLGNBQWIsQ0FBQSxLQUFnQyxDQUFBLENBRmpDLElBR0MsSUFBSSxDQUFDLE9BQUwsQ0FBYSxrQkFBYixDQUFBLEtBQW9DLENBQUEsQ0FIckMsSUFJQyxDQUFDLENBQUEsS0FBSyxDQUFBLFNBQUwsSUFBa0IsS0FBQyxDQUFBLFNBQVMsQ0FBQyxPQUFYLENBQW1CLElBQW5CLENBQW5CLENBSko7QUFNRSxjQUFBLElBQUEsR0FBTyxFQUFFLENBQUMsWUFBSCxDQUFnQixPQUFoQixFQUF5QixNQUF6QixDQUFQLENBQUE7QUFBQSxjQUNBLElBQUEsR0FBTyxJQUFJLENBQUMsT0FBTCxDQUFhLEtBQWIsRUFBb0IsRUFBcEIsQ0FEUCxDQUFBO0FBRUE7QUFDRSxnQkFBQSxNQUFBLEdBQVMsSUFBQSxDQUFLLElBQUwsRUFBVyxHQUFYLENBQVQsQ0FERjtlQUFBLGNBQUE7QUFHRSxnQkFESSxVQUNKLENBQUE7QUFBQSxnQkFBQSxHQUFBLENBQUksV0FBQSxHQUFjLENBQUMsQ0FBQyxPQUFwQixDQUFBLENBQUE7QUFDQSxzQkFBQSxDQUpGO2VBRkE7QUFBQSxjQVFBLFFBQUEsR0FBVyxJQUFJLENBQUMsS0FBTCxDQUFXLEdBQVgsQ0FSWCxDQUFBO0FBQUEsY0FTQSxHQUFBLEdBQU0sRUFUTixDQUFBO0FBVUEsbUJBQUEsMkRBQUE7d0NBQUE7QUFDRSxnQkFBQSxJQUFHLEdBQUEsS0FBTyxRQUFRLENBQUMsTUFBVCxHQUFnQixDQUExQjtBQUFpQyx3QkFBakM7aUJBQUE7QUFBQSxnQkFDQSxHQUFBLElBQU8sT0FEUCxDQUFBO0FBQUEsZ0JBRUEsUUFBQSxDQUFTLEdBQVQsRUFBYyxJQUFkLEVBQW9CLE1BQXBCLENBRkEsQ0FBQTtBQUFBLGdCQUdBLEdBQUEsSUFBTyxHQUhQLENBREY7QUFBQSxlQVZBO0FBQUEsY0FlQSxLQUFNLENBQUEsSUFBQSxDQUFOLEdBQWMsTUFmZCxDQUFBO0FBQUEsY0FnQkEsUUFBQSxDQUFTLEdBQVQsRUFBYyxRQUFkLEVBQXdCLE1BQXhCLENBaEJBLENBQUE7cUJBaUJBLFFBQUEsQ0FBVSxFQUFWLEVBQWMsS0FBZCxFQUF3QixNQUF4QixFQXZCRjthQUY4QztVQUFBLENBQWxELENBMkJHLENBQUMsRUEzQkosQ0EyQk8sT0EzQlAsRUEyQmdCLFNBQUMsR0FBRCxHQUFBO21CQUNaLEdBQUEsQ0FBSSxHQUFHLENBQUMsT0FBUixFQURZO1VBQUEsQ0EzQmhCLENBOEJHLENBQUMsRUE5QkosQ0E4Qk8sTUE5QlAsRUE4QmUsU0FBQSxHQUFBO0FBQ1gsWUFBQSxHQUFBLENBQUksNEJBQUEsR0FBK0IsV0FBL0IsR0FBNkMsR0FBakQsQ0FBQSxDQUFBO0FBQUEsWUFDQSxHQUFBLENBQUkscURBQUEsR0FDQSxNQUFBLENBQUEsQ0FBUSxDQUFDLE1BQVQsQ0FBZ0IsbUJBQWhCLENBREosQ0FEQSxDQUFBO0FBQUEsWUFHQSxHQUFBLENBQUkscURBQUosQ0FIQSxDQUFBO0FBQUEsWUFLQSxZQUFBLENBQWEsT0FBYixFQUE0QixLQUE1QixDQUxBLENBQUE7QUFBQSxZQU1BLFlBQUEsQ0FBYSxhQUFiLEVBQTRCLElBQTVCLENBTkEsQ0FBQTtBQUFBLFlBT0EsWUFBQSxDQUFhLE9BQWIsRUFBNEIsUUFBNUIsQ0FQQSxDQUFBO0FBQUEsWUFRQSxZQUFBLENBQWEsT0FBYixFQUE0QixLQUE1QixDQVJBLENBQUE7bUJBVUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxJQUFmLEVBWFc7VUFBQSxDQTlCZixDQTJDRyxDQUFDLElBM0NKLENBQUEsRUFSeUM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQyxFQXpCSTtJQUFBLENBUE47QUFBQSxJQXFGQSxVQUFBLEVBQVksU0FBQSxHQUFBO2FBQ1YsSUFBQyxDQUFBLEdBQUcsQ0FBQyxPQUFMLENBQUEsRUFEVTtJQUFBLENBckZaO0dBOUNGLENBQUE7O0FBQUEsRUF3SUE7QUF4SUEsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/line-count/lib/line-count.coffee
