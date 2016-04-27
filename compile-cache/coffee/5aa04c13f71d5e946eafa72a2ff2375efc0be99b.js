(function() {
  var CompositeDisposable, CppRefactor, CppRefactorClassInfoView, CppRefactorView, Point, Range, for_each_line, fs, path, print, _ref,
    __slice = [].slice;

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point;

  CppRefactorView = require('./cpp-refactor-view');

  CppRefactorClassInfoView = require('./cpp-refactor-class-info-view');

  CompositeDisposable = require('atom').CompositeDisposable;

  path = require('path');

  print = function() {
    var x;
    x = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return console.log(x.reduce(function(a, b) {
      return a + (b != null ? ", " + b : "");
    }));
  };

  fs = require('fs');

  for_each_line = function(filepath, func) {
    var line, lineindex, _i, _len, _ref1, _results;
    lineindex = 0;
    _ref1 = fs.readFileSync(filepath).toString().split('\n');
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      line = _ref1[_i];
      _results.push(func(line, lineindex++));
    }
    return _results;
  };

  module.exports = CppRefactor = {
    cppRefactorView: null,
    modalPanel: null,
    subscriptions: null,
    cppRefactorClassInfoView: null,
    classInfoPanel: null,
    activate: function(state) {
      this.cppRefactorView = new CppRefactorView(state.cppRefactorViewState);
      this.modalPanel = atom.workspace.addModalPanel({
        item: this.cppRefactorView.getElement(),
        visible: false
      });
      this.cppRefactorClassInfoView = new CppRefactorClassInfoView(state.cppRefactorClassInfoViewState);
      this.classInfoPanel = atom.workspace.addModalPanel({
        item: this.cppRefactorClassInfoView.getElement(),
        visible: false
      });
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'cpp-refactor:find-next-class': (function(_this) {
          return function() {
            return _this.find_next_class();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'cpp-refactor:find-prev-class': (function(_this) {
          return function() {
            return _this.find_previous_class();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'cpp-refactor:select-brace-range': (function(_this) {
          return function() {
            return _this.select_brace_range();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'cpp-refactor:create-method-fields-size': (function(_this) {
          return function() {
            return _this.create_method_fields_size();
          };
        })(this)
      }));
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'cpp-refactor:find-class': (function(_this) {
          return function() {
            return _this.find_class();
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.modalPanel.destroy();
      this.subscriptions.dispose();
      return this.cppRefactorView.destroy();
    },
    serialize: function() {
      return {
        cppRefactorViewState: this.cppRefactorView.serialize(),
        cppRefactorClassInfoViewState: this.cppRefactorView.serialize()
      };
    },
    classPattern: /(class[\s]+)(\w+)/g,
    fieldsPattern: /((?:\w+|::)*(?:<(?:\w*|,|\s*)*>)*)(\**)*(\&)*\s+(\w+)\s*(?:\[\s*(\w+)\s*\])*;(?:\/\/.*$)*/g,
    create_method_fields_size: function() {
      var constSize, dynamicSize, editor, endBrace, field, fields, i, is16, is24, is32, is8, isvec, tab, _i, _j, _len, _ref1;
      if (editor = atom.workspace.getActiveTextEditor()) {
        if (editor.hasMultipleCursors()) {
          console.log("There are multiple cursors.");
          return;
        }
      }
      fields = this.get_all_fields(editor);
      if (fields.length === 0) {
        return;
      }
      endBrace = this.find_brace_end(editor);
      editor.setCursorBufferPosition([endBrace.row, 0]);
      isvec = /vector<.*>/;
      is32 = /u*int32_t/;
      is24 = /u*int24_t/;
      is16 = /u*int16_t/;
      is8 = /u*int8_t/;
      constSize = 0;
      dynamicSize = "";
      for (_i = 0, _len = fields.length; _i < _len; _i++) {
        field = fields[_i];
        console.log("" + field.name + " : " + field.type);
        switch (false) {
          case !is32.test(field.type):
            constSize += 4;
            break;
          case !is24.test(field.type):
            constSize += 3;
            break;
          case !is16.test(field.type):
            constSize += 2;
            break;
          case !is8.test(field.type):
            constSize += 1;
            break;
          case !isvec.test(field.type):
            dynamicSize += "+" + field.name + ".size()+1";
            break;
          default:
            console.log("not supported type of field: " + field.name);
        }
      }
      tab = "";
      for (i = _j = 1, _ref1 = endBrace.column; 1 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 1 <= _ref1 ? ++_j : --_j) {
        tab += "\t";
      }
      return editor.insertText("" + tab + "size_t GetFieldsSize()const\n" + tab + "{\n\t" + tab + "return " + constSize + dynamicSize + ";\n" + tab + "}\n");
    },
    get_all_fields: function(editor) {
      var endBrace, fields, startBrace;
      console.log("CppRefactor: get all fields");
      startBrace = this.find_brace_start(editor);
      if (startBrace == null) {
        return;
      }
      endBrace = this.find_brace_end(editor);
      if (endBrace == null) {
        return;
      }
      console.log("looking for fields in range " + startBrace + " to " + endBrace);
      fields = [];
      editor.scanInBufferRange(this.fieldsPattern, new Range(startBrace, endBrace), function(obj) {
        console.log("field '" + obj.match[4] + "' of type '" + obj.match[1] + "'");
        return fields.push({
          name: obj.match[4],
          type: obj.match[1]
        });
      });
      console.log("found all");
      return fields;
    },
    get_range_begin2cursor: function(editor) {
      return new Range(new Point(0, 0), editor.getCursorBufferPosition());
    },
    get_range_cursor2end: function(editor) {
      return new Range(editor.getCursorBufferPosition(), new Point(editor.getLineCount(), 0));
    },
    select_brace_range: function() {
      var editor, endBrace, startBrace;
      console.log("CppRefactor: select brace range");
      if (editor = atom.workspace.getActiveTextEditor()) {
        if (editor.hasMultipleCursors()) {
          console.log("There are multiple cursors.");
          return;
        }
        startBrace = this.find_brace_start(editor);
        if (startBrace == null) {
          return;
        }
        endBrace = this.find_brace_end(editor);
        if (endBrace == null) {
          return;
        }
        return editor.setSelectedBufferRange([startBrace, endBrace]);
      }
    },
    find_brace_start: function(editor) {
      var level, pat, startBrace;
      pat = /(\s*\/\/.*\n)|(\s*\/\*.*\*\/\s*)|(})|({)/g;
      level = 0;
      startBrace = void 0;
      editor.backwardsScanInBufferRange(pat, this.get_range_begin2cursor(editor), function(obj) {
        if (obj.match[3] != null) {
          level++;
        }
        if (obj.match[4] != null) {
          if (level > 0) {
            return level--;
          } else {
            startBrace = obj.range.start;
            return obj.stop();
          }
        }
      });
      return startBrace;
    },
    find_brace_end: function(editor) {
      var endBrace, level, pat;
      pat = /(\s*\/\/.*\n)|(\s*\/\*.*\*\/)|({)|(};*)/g;
      level = 0;
      endBrace = void 0;
      editor.scanInBufferRange(pat, this.get_range_cursor2end(editor), function(obj) {
        if (obj.match[3] != null) {
          level++;
        }
        if (obj.match[4] != null) {
          if (level > 0) {
            return level--;
          } else {
            endBrace = obj.range.end;
            return obj.stop();
          }
        }
      });
      return endBrace;
    },
    find_previous_class: function() {
      var currentPosition, editor;
      console.log("CppRefactor: finding previous class");
      if (editor = atom.workspace.getActiveTextEditor()) {
        if (editor.hasMultipleCursors()) {
          console.log("There are multiple cursors, cannot determine where to look for the class.");
          return;
        }
        currentPosition = editor.getCursorBufferPosition();
        return editor.backwardsScanInBufferRange(this.classPattern, [[0, 0], editor.getCursorBufferPosition()], function(obj) {
          console.log("Class name is: " + obj.match[2]);
          if ((obj.range.start.column <= currentPosition && currentPosition <= obj.narge.start.column + obj.matchText.length)) {
            return;
          }
          editor.setCursorBufferPosition([obj.range.start.row, obj.range.start.column + obj.match[1].length]);
          return obj.stop();
        });
      }
    },
    find_next_class: function() {
      var currentPosition, editor;
      console.log("CppRefactor: finding next class");
      if (editor = atom.workspace.getActiveTextEditor()) {
        if (editor.hasMultipleCursors()) {
          console.log("There are multiple cursors, cannot determine where to look for the class.");
          return;
        }
        currentPosition = editor.getCursorBufferPosition();
        return editor.scanInBufferRange(this.classPattern, [editor.getCursorBufferPosition(), [editor.getLineCount(), 0]], function(obj) {
          console.log("Class name is: " + obj.match[2]);
          if ((obj.range.start.column <= currentPosition && currentPosition <= obj.narge.start.column + obj.matchText.length)) {
            return;
          }
          editor.setCursorBufferPosition([obj.range.start.row, obj.range.start.column + obj.match[1].length]);
          return obj.stop();
        });
      }
    },
    classinfo: function() {
      var editor, state;
      console.log('CppRefactor class info is executed!');
      if (editor = atom.workspace.getActiveTextEditor()) {
        if (editor.hasMultipleCursors()) {
          console.log("There are multiple cursors, cannot determine where to look for the class.");
          return;
        }
        ({
          range: null
        });
        state = function() {
          return editor.scan(this.classPattern, function(obj) {
            console.log("Class name is: " + obj.match[1]);
            console.log(obj.range.start, obj.range.end);
            return obj.stop();
          });
        };
        return state();
      }
    },
    search_include: /\#include\s*(?:<|")([\w\-\/\\\.]+)(?:<|")/g,
    search_in_files: function(search_dir, exclude_folder, go_up, search_pattern) {
      var any_files, f, found, search_file;
      search_file = function(filepath) {
        var found, stat;
        if (!fs.existsSync(filepath)) {
          return [];
        }
        stat = fs.statSync(filepath);
        found = [];
        if (stat && !stat.isDirectory()) {
          for_each_line(filepath, function(line, linei) {
            var m;
            if (m = search_pattern.exec(line)) {
              found.push([filepath, linei, m.index]);
              print("found in", filepath, "at", linei, m.index);
              return print(m);
            }
          });
        }
        if (found.length > 0) {
          print(found);
        }
        return found;
      };
      found = [];
      any_files = false;
      fs.readdirSync(search_dir).forEach((function(_this) {
        return function(file) {
          var error, f, filepath, stat;
          if (file === "daemon.h") {
            print("Searching in daemon.h");
          }
          filepath = path.join(search_dir, file);
          if (filepath !== exclude_folder) {
            try {
              stat = fs.statSync(filepath);
              if (stat) {
                if (!stat.isDirectory()) {
                  any_files = true;
                  if (path.extname(file) === ".h") {
                    found = found.concat(search_file(filepath));
                    if (f.length > 0) {
                      print(f[0]);
                      return print(found[0]);
                    }
                  }
                } else {
                  f = _this.search_in_files(filepath, "", false, search_pattern);
                  return found = found.concat(f);
                }
              }
            } catch (_error) {
              error = _error;
            }
          }
        };
      })(this));
      if (go_up && any_files && search_dir !== "/") {
        f = this.search_in_files(path.dirname(search_dir), search_dir, true, search_pattern);
        found = found.concat(f);
      }
      return found;
    },
    find_class: function() {
      var curdirectory, editor, end, exclude_folder, f, found, found_any, full_iden_scope, go_up, i, ident_scope, ident_search, ident_to_find, j, search_range, _i, _len, _ref1;
      if (editor = atom.workspace.getActiveTextEditor()) {
        ident_to_find = editor.getWordUnderCursor();
        print(ident_to_find);
        editor.moveToEndOfWord();
        end = editor.getCursorBufferPosition();
        full_iden_scope = RegExp("((?:\\w+\\s*::\\s*)*)" + ident_to_find);
        search_range = new Range(new Point(0, 0), end);
        ident_scope = "";
        editor.backwardsScanInBufferRange(full_iden_scope, search_range, function(match) {
          ident_scope = match.match[1];
          return match.stop();
        });
        print(ident_scope);
        ident_search = RegExp("(?:(class|struct)\\s+(\\w+\\s*(?:\\([\\w\\(\\),\\-\\+\\*/]*\\))*\\s+)*(" + ident_to_find + ")\\s*(?::|\\n|$))");
        found_any = false;
        editor.backwardsScanInBufferRange(ident_search, search_range, function(m) {
          editor.setCursorBufferPosition(new Point(m.range.end.row, m.range.end.column - ident_to_find.length));
          found_any = true;
          return m.stop;
        });
        if (!found_any) {
          curdirectory = path.dirname(editor.getPath());
          exclude_folder = "";
          go_up = true;
          found = this.search_in_files(curdirectory, exclude_folder, go_up, ident_search);
          print(found);
          for (_i = 0, _len = found.length; _i < _len; _i++) {
            _ref1 = found[_i], f = _ref1[0], i = _ref1[1], j = _ref1[2];
            print(f, i, j);
          }
          if (found.length > 0) {
            return atom.workspace.open(found[0][0], {
              initialLine: found[0][1]
            });
          }
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvY3BwLXJlZmFjdG9yL2xpYi9jcHAtcmVmYWN0b3IuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtIQUFBO0lBQUEsa0JBQUE7O0FBQUEsRUFBQSxPQUFnQixPQUFBLENBQVEsTUFBUixDQUFoQixFQUFDLGFBQUEsS0FBRCxFQUFPLGFBQUEsS0FBUCxDQUFBOztBQUFBLEVBQ0EsZUFBQSxHQUFrQixPQUFBLENBQVEscUJBQVIsQ0FEbEIsQ0FBQTs7QUFBQSxFQUVBLHdCQUFBLEdBQTJCLE9BQUEsQ0FBUSxnQ0FBUixDQUYzQixDQUFBOztBQUFBLEVBR0Msc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUhELENBQUE7O0FBQUEsRUFLQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FMUCxDQUFBOztBQUFBLEVBT0EsS0FBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLFFBQUEsQ0FBQTtBQUFBLElBRE8sMkRBQ1AsQ0FBQTtXQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksQ0FBQyxDQUFDLE1BQUYsQ0FBUyxTQUFDLENBQUQsRUFBRyxDQUFILEdBQUE7YUFDbkIsQ0FBQSxHQUFJLENBQUcsU0FBSCxHQUFXLElBQUEsR0FBTyxDQUFsQixHQUF5QixFQUF6QixFQURlO0lBQUEsQ0FBVCxDQUFaLEVBRE07RUFBQSxDQVBSLENBQUE7O0FBQUEsRUFXQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FYTCxDQUFBOztBQUFBLEVBYUEsYUFBQSxHQUFnQixTQUFDLFFBQUQsRUFBVyxJQUFYLEdBQUE7QUFDZCxRQUFBLDBDQUFBO0FBQUEsSUFBQSxTQUFBLEdBQVksQ0FBWixDQUFBO0FBQ0E7QUFBQTtTQUFBLDRDQUFBO3VCQUFBO0FBQ0Usb0JBQUEsSUFBQSxDQUFLLElBQUwsRUFBVyxTQUFBLEVBQVgsRUFBQSxDQURGO0FBQUE7b0JBRmM7RUFBQSxDQWJoQixDQUFBOztBQUFBLEVBa0JBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFdBQUEsR0FDZjtBQUFBLElBQUEsZUFBQSxFQUFpQixJQUFqQjtBQUFBLElBQ0EsVUFBQSxFQUFZLElBRFo7QUFBQSxJQUVBLGFBQUEsRUFBZSxJQUZmO0FBQUEsSUFJQSx3QkFBQSxFQUEwQixJQUoxQjtBQUFBLElBS0EsY0FBQSxFQUFnQixJQUxoQjtBQUFBLElBT0EsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsZUFBRCxHQUF1QixJQUFBLGVBQUEsQ0FBZ0IsS0FBSyxDQUFDLG9CQUF0QixDQUF2QixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsVUFBRCxHQUFjLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE4QjtBQUFBLFFBQUEsSUFBQSxFQUFNLElBQUMsQ0FBQSxlQUFlLENBQUMsVUFBakIsQ0FBQSxDQUFOO0FBQUEsUUFBcUMsT0FBQSxFQUFTLEtBQTlDO09BQTlCLENBRGQsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLHdCQUFELEdBQWdDLElBQUEsd0JBQUEsQ0FBeUIsS0FBSyxDQUFDLDZCQUEvQixDQUhoQyxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsY0FBRCxHQUFrQixJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7QUFBQSxRQUFBLElBQUEsRUFBTSxJQUFDLENBQUEsd0JBQXdCLENBQUMsVUFBMUIsQ0FBQSxDQUFOO0FBQUEsUUFBNkMsT0FBQSxFQUFTLEtBQXREO09BQTdCLENBSmxCLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFQakIsQ0FBQTtBQUFBLE1BV0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7QUFBQSxRQUFBLDhCQUFBLEVBQWdDLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxlQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhDO09BQXBDLENBQW5CLENBWEEsQ0FBQTtBQUFBLE1BWUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7QUFBQSxRQUFBLDhCQUFBLEVBQWdDLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxtQkFBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQztPQUFwQyxDQUFuQixDQVpBLENBQUE7QUFBQSxNQWlCQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztBQUFBLFFBQUEsaUNBQUEsRUFBbUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLGtCQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5DO09BQXBDLENBQW5CLENBakJBLENBQUE7QUFBQSxNQW9CQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztBQUFBLFFBQUEsd0NBQUEsRUFBMEMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLHlCQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFDO09BQXBDLENBQW5CLENBcEJBLENBQUE7YUFzQkEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7QUFBQSxRQUFBLHlCQUFBLEVBQTJCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxVQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNCO09BQXBDLENBQW5CLEVBdkJRO0lBQUEsQ0FQVjtBQUFBLElBaUNBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixNQUFBLElBQUMsQ0FBQSxVQUFVLENBQUMsT0FBWixDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUEsQ0FEQSxDQUFBO2FBRUEsSUFBQyxDQUFBLGVBQWUsQ0FBQyxPQUFqQixDQUFBLEVBSFU7SUFBQSxDQWpDWjtBQUFBLElBc0NBLFNBQUEsRUFBVyxTQUFBLEdBQUE7YUFDVDtBQUFBLFFBQUEsb0JBQUEsRUFBc0IsSUFBQyxDQUFBLGVBQWUsQ0FBQyxTQUFqQixDQUFBLENBQXRCO0FBQUEsUUFDQSw2QkFBQSxFQUErQixJQUFDLENBQUEsZUFBZSxDQUFDLFNBQWpCLENBQUEsQ0FEL0I7UUFEUztJQUFBLENBdENYO0FBQUEsSUEyQ0EsWUFBQSxFQUFjLG9CQTNDZDtBQUFBLElBNENBLGFBQUEsRUFBZSw0RkE1Q2Y7QUFBQSxJQXdEQSx5QkFBQSxFQUEyQixTQUFBLEdBQUE7QUFDekIsVUFBQSxrSEFBQTtBQUFBLE1BQUEsSUFBRyxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVo7QUFDRSxRQUFBLElBQUcsTUFBTSxDQUFDLGtCQUFQLENBQUEsQ0FBSDtBQUNFLFVBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSw2QkFBWixDQUFBLENBQUE7QUFDQSxnQkFBQSxDQUZGO1NBREY7T0FBQTtBQUFBLE1BSUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxjQUFELENBQWdCLE1BQWhCLENBSlQsQ0FBQTtBQUtBLE1BQUEsSUFBRyxNQUFNLENBQUMsTUFBUCxLQUFpQixDQUFwQjtBQUNFLGNBQUEsQ0FERjtPQUxBO0FBQUEsTUFTQSxRQUFBLEdBQVcsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsTUFBaEIsQ0FUWCxDQUFBO0FBQUEsTUFXQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxRQUFRLENBQUMsR0FBVixFQUFlLENBQWYsQ0FBL0IsQ0FYQSxDQUFBO0FBQUEsTUFhQSxLQUFBLEdBQVEsWUFiUixDQUFBO0FBQUEsTUFjQSxJQUFBLEdBQU8sV0FkUCxDQUFBO0FBQUEsTUFlQSxJQUFBLEdBQU8sV0FmUCxDQUFBO0FBQUEsTUFnQkEsSUFBQSxHQUFPLFdBaEJQLENBQUE7QUFBQSxNQWlCQSxHQUFBLEdBQU0sVUFqQk4sQ0FBQTtBQUFBLE1BbUJBLFNBQUEsR0FBWSxDQW5CWixDQUFBO0FBQUEsTUFvQkEsV0FBQSxHQUFjLEVBcEJkLENBQUE7QUFzQkEsV0FBQSw2Q0FBQTsyQkFBQTtBQUNFLFFBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxFQUFBLEdBQUcsS0FBSyxDQUFDLElBQVQsR0FBYyxLQUFkLEdBQW1CLEtBQUssQ0FBQyxJQUFyQyxDQUFBLENBQUE7QUFDQSxnQkFBQSxLQUFBO0FBQUEsZ0JBQ08sSUFBSSxDQUFDLElBQUwsQ0FBVSxLQUFLLENBQUMsSUFBaEIsQ0FEUDtBQUNrQyxZQUFBLFNBQUEsSUFBYyxDQUFkLENBRGxDOztBQUFBLGdCQUVPLElBQUksQ0FBQyxJQUFMLENBQVUsS0FBSyxDQUFDLElBQWhCLENBRlA7QUFFa0MsWUFBQSxTQUFBLElBQWMsQ0FBZCxDQUZsQzs7QUFBQSxnQkFHTyxJQUFJLENBQUMsSUFBTCxDQUFVLEtBQUssQ0FBQyxJQUFoQixDQUhQO0FBR2tDLFlBQUEsU0FBQSxJQUFjLENBQWQsQ0FIbEM7O0FBQUEsZ0JBSU8sR0FBRyxDQUFDLElBQUosQ0FBUyxLQUFLLENBQUMsSUFBZixDQUpQO0FBSWlDLFlBQUEsU0FBQSxJQUFjLENBQWQsQ0FKakM7O0FBQUEsZ0JBS08sS0FBSyxDQUFDLElBQU4sQ0FBVyxLQUFLLENBQUMsSUFBakIsQ0FMUDtBQUttQyxZQUFBLFdBQUEsSUFBZ0IsR0FBQSxHQUFHLEtBQUssQ0FBQyxJQUFULEdBQWMsV0FBOUIsQ0FMbkM7O0FBQUE7QUFNTyxZQUFBLE9BQU8sQ0FBQyxHQUFSLENBQWEsK0JBQUEsR0FBK0IsS0FBSyxDQUFDLElBQWxELENBQUEsQ0FOUDtBQUFBLFNBRkY7QUFBQSxPQXRCQTtBQUFBLE1BZ0NBLEdBQUEsR0FBTSxFQWhDTixDQUFBO0FBaUNBLFdBQXFCLHVHQUFyQixHQUFBO0FBQUEsUUFBQSxHQUFBLElBQU8sSUFBUCxDQUFBO0FBQUEsT0FqQ0E7YUFrQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsRUFBQSxHQUFHLEdBQUgsR0FBTywrQkFBUCxHQUFzQyxHQUF0QyxHQUEwQyxPQUExQyxHQUFpRCxHQUFqRCxHQUFxRCxTQUFyRCxHQUE4RCxTQUE5RCxHQUEwRSxXQUExRSxHQUFzRixLQUF0RixHQUEyRixHQUEzRixHQUErRixLQUFqSCxFQW5DeUI7SUFBQSxDQXhEM0I7QUFBQSxJQStGQSxjQUFBLEVBQWdCLFNBQUMsTUFBRCxHQUFBO0FBQ2QsVUFBQSw0QkFBQTtBQUFBLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSw2QkFBWixDQUFBLENBQUE7QUFBQSxNQUVBLFVBQUEsR0FBYSxJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsTUFBbEIsQ0FGYixDQUFBO0FBR0EsTUFBQSxJQUFPLGtCQUFQO0FBQ0UsY0FBQSxDQURGO09BSEE7QUFBQSxNQUtBLFFBQUEsR0FBVyxJQUFDLENBQUEsY0FBRCxDQUFnQixNQUFoQixDQUxYLENBQUE7QUFNQSxNQUFBLElBQU8sZ0JBQVA7QUFDRSxjQUFBLENBREY7T0FOQTtBQUFBLE1BUUEsT0FBTyxDQUFDLEdBQVIsQ0FBYSw4QkFBQSxHQUE4QixVQUE5QixHQUF5QyxNQUF6QyxHQUErQyxRQUE1RCxDQVJBLENBQUE7QUFBQSxNQVNBLE1BQUEsR0FBUyxFQVRULENBQUE7QUFBQSxNQVVBLE1BQU0sQ0FBQyxpQkFBUCxDQUF5QixJQUFDLENBQUEsYUFBMUIsRUFBNkMsSUFBQSxLQUFBLENBQU0sVUFBTixFQUFpQixRQUFqQixDQUE3QyxFQUF5RSxTQUFDLEdBQUQsR0FBQTtBQUN2RSxRQUFBLE9BQU8sQ0FBQyxHQUFSLENBQWEsU0FBQSxHQUFTLEdBQUcsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFuQixHQUFzQixhQUF0QixHQUFtQyxHQUFHLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBN0MsR0FBZ0QsR0FBN0QsQ0FBQSxDQUFBO2VBQ0EsTUFBTSxDQUFDLElBQVAsQ0FBYTtBQUFBLFVBQUEsSUFBQSxFQUFPLEdBQUcsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFqQjtBQUFBLFVBQXFCLElBQUEsRUFBTSxHQUFHLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBckM7U0FBYixFQUZ1RTtNQUFBLENBQXpFLENBVkEsQ0FBQTtBQUFBLE1BYUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxXQUFaLENBYkEsQ0FBQTthQWNBLE9BZmM7SUFBQSxDQS9GaEI7QUFBQSxJQWlIQSxzQkFBQSxFQUF3QixTQUFDLE1BQUQsR0FBQTthQUNsQixJQUFBLEtBQUEsQ0FBVSxJQUFBLEtBQUEsQ0FBTSxDQUFOLEVBQVEsQ0FBUixDQUFWLEVBQXNCLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQXRCLEVBRGtCO0lBQUEsQ0FqSHhCO0FBQUEsSUFvSEEsb0JBQUEsRUFBc0IsU0FBQyxNQUFELEdBQUE7YUFDaEIsSUFBQSxLQUFBLENBQU0sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBTixFQUE0QyxJQUFBLEtBQUEsQ0FBTSxNQUFNLENBQUMsWUFBUCxDQUFBLENBQU4sRUFBNEIsQ0FBNUIsQ0FBNUMsRUFEZ0I7SUFBQSxDQXBIdEI7QUFBQSxJQWtJQSxrQkFBQSxFQUFvQixTQUFBLEdBQUE7QUFDbEIsVUFBQSw0QkFBQTtBQUFBLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxpQ0FBWixDQUFBLENBQUE7QUFDQSxNQUFBLElBQUcsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFaO0FBQ0UsUUFBQSxJQUFHLE1BQU0sQ0FBQyxrQkFBUCxDQUFBLENBQUg7QUFDRSxVQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksNkJBQVosQ0FBQSxDQUFBO0FBQ0EsZ0JBQUEsQ0FGRjtTQUFBO0FBQUEsUUFJQSxVQUFBLEdBQWEsSUFBQyxDQUFBLGdCQUFELENBQWtCLE1BQWxCLENBSmIsQ0FBQTtBQUtBLFFBQUEsSUFBTyxrQkFBUDtBQUNFLGdCQUFBLENBREY7U0FMQTtBQUFBLFFBT0EsUUFBQSxHQUFXLElBQUMsQ0FBQSxjQUFELENBQWdCLE1BQWhCLENBUFgsQ0FBQTtBQVFBLFFBQUEsSUFBTyxnQkFBUDtBQUNFLGdCQUFBLENBREY7U0FSQTtlQVdBLE1BQU0sQ0FBQyxzQkFBUCxDQUE4QixDQUFDLFVBQUQsRUFBYSxRQUFiLENBQTlCLEVBWkY7T0FGa0I7SUFBQSxDQWxJcEI7QUFBQSxJQWtKQSxnQkFBQSxFQUFrQixTQUFDLE1BQUQsR0FBQTtBQUNoQixVQUFBLHNCQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sMkNBQU4sQ0FBQTtBQUFBLE1BT0EsS0FBQSxHQUFRLENBUFIsQ0FBQTtBQUFBLE1BUUEsVUFBQSxHQUFhLE1BUmIsQ0FBQTtBQUFBLE1BU0EsTUFBTSxDQUFDLDBCQUFQLENBQWtDLEdBQWxDLEVBQXVDLElBQUMsQ0FBQSxzQkFBRCxDQUF3QixNQUF4QixDQUF2QyxFQUF3RSxTQUFDLEdBQUQsR0FBQTtBQUV0RSxRQUFBLElBQUcsb0JBQUg7QUFDRSxVQUFBLEtBQUEsRUFBQSxDQURGO1NBQUE7QUFFQSxRQUFBLElBQUcsb0JBQUg7QUFDRSxVQUFBLElBQUcsS0FBQSxHQUFRLENBQVg7bUJBQ0UsS0FBQSxHQURGO1dBQUEsTUFBQTtBQUdFLFlBQUEsVUFBQSxHQUFhLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBdkIsQ0FBQTttQkFDQSxHQUFHLENBQUMsSUFBSixDQUFBLEVBSkY7V0FERjtTQUpzRTtNQUFBLENBQXhFLENBVEEsQ0FBQTthQW1CQSxXQXBCZ0I7SUFBQSxDQWxKbEI7QUFBQSxJQXlLQSxjQUFBLEVBQWdCLFNBQUMsTUFBRCxHQUFBO0FBR2QsVUFBQSxvQkFBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLDBDQUFOLENBQUE7QUFBQSxNQU1BLEtBQUEsR0FBUSxDQU5SLENBQUE7QUFBQSxNQU9BLFFBQUEsR0FBVyxNQVBYLENBQUE7QUFBQSxNQVFBLE1BQU0sQ0FBQyxpQkFBUCxDQUF5QixHQUF6QixFQUE4QixJQUFDLENBQUEsb0JBQUQsQ0FBc0IsTUFBdEIsQ0FBOUIsRUFBNkQsU0FBQyxHQUFELEdBQUE7QUFJM0QsUUFBQSxJQUFHLG9CQUFIO0FBQ0UsVUFBQSxLQUFBLEVBQUEsQ0FERjtTQUFBO0FBR0EsUUFBQSxJQUFHLG9CQUFIO0FBQ0UsVUFBQSxJQUFHLEtBQUEsR0FBUSxDQUFYO21CQUNFLEtBQUEsR0FERjtXQUFBLE1BQUE7QUFLRSxZQUFBLFFBQUEsR0FBVyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQXJCLENBQUE7bUJBQ0EsR0FBRyxDQUFDLElBQUosQ0FBQSxFQU5GO1dBREY7U0FQMkQ7TUFBQSxDQUE3RCxDQVJBLENBQUE7YUF1QkEsU0ExQmM7SUFBQSxDQXpLaEI7QUFBQSxJQTJOQSxtQkFBQSxFQUFxQixTQUFBLEdBQUE7QUFDbkIsVUFBQSx1QkFBQTtBQUFBLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxxQ0FBWixDQUFBLENBQUE7QUFDQSxNQUFBLElBQUcsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFaO0FBQ0UsUUFBQSxJQUFHLE1BQU0sQ0FBQyxrQkFBUCxDQUFBLENBQUg7QUFDRSxVQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksMkVBQVosQ0FBQSxDQUFBO0FBQ0EsZ0JBQUEsQ0FGRjtTQUFBO0FBQUEsUUFHQSxlQUFBLEdBQWtCLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBSGxCLENBQUE7ZUFJQSxNQUFNLENBQUMsMEJBQVAsQ0FBa0MsSUFBQyxDQUFBLFlBQW5DLEVBQWlELENBQUMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFELEVBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUFqRCxFQUEyRixTQUFDLEdBQUQsR0FBQTtBQUN6RixVQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksaUJBQUEsR0FBb0IsR0FBRyxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQTFDLENBQUEsQ0FBQTtBQUVBLFVBQUEsSUFBRyxDQUFBLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQWhCLElBQTBCLGVBQTFCLElBQTBCLGVBQTFCLElBQTZDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQWhCLEdBQXlCLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBcEYsQ0FBSDtBQUVFLGtCQUFBLENBRkY7V0FGQTtBQUFBLFVBS0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBakIsRUFBc0IsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBaEIsR0FBeUIsR0FBRyxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUE1RCxDQUEvQixDQUxBLENBQUE7aUJBTUEsR0FBRyxDQUFDLElBQUosQ0FBQSxFQVB5RjtRQUFBLENBQTNGLEVBTEY7T0FGbUI7SUFBQSxDQTNOckI7QUFBQSxJQTRPQSxlQUFBLEVBQWlCLFNBQUEsR0FBQTtBQUNmLFVBQUEsdUJBQUE7QUFBQSxNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksaUNBQVosQ0FBQSxDQUFBO0FBQ0EsTUFBQSxJQUFHLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBWjtBQUNFLFFBQUEsSUFBRyxNQUFNLENBQUMsa0JBQVAsQ0FBQSxDQUFIO0FBQ0UsVUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLDJFQUFaLENBQUEsQ0FBQTtBQUNBLGdCQUFBLENBRkY7U0FBQTtBQUFBLFFBR0EsZUFBQSxHQUFrQixNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUhsQixDQUFBO2VBSUEsTUFBTSxDQUFDLGlCQUFQLENBQXlCLElBQUMsQ0FBQSxZQUExQixFQUF3QyxDQUFDLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQUQsRUFBbUMsQ0FBQyxNQUFNLENBQUMsWUFBUCxDQUFBLENBQUQsRUFBdUIsQ0FBdkIsQ0FBbkMsQ0FBeEMsRUFBdUcsU0FBQyxHQUFELEdBQUE7QUFDckcsVUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLGlCQUFBLEdBQW9CLEdBQUcsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUExQyxDQUFBLENBQUE7QUFFQSxVQUFBLElBQUcsQ0FBQSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFoQixJQUEwQixlQUExQixJQUEwQixlQUExQixJQUE2QyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFoQixHQUF5QixHQUFHLENBQUMsU0FBUyxDQUFDLE1BQXBGLENBQUg7QUFFRSxrQkFBQSxDQUZGO1dBRkE7QUFBQSxVQUtBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQWpCLEVBQXNCLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQWhCLEdBQXlCLEdBQUcsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBNUQsQ0FBL0IsQ0FMQSxDQUFBO2lCQU1BLEdBQUcsQ0FBQyxJQUFKLENBQUEsRUFQcUc7UUFBQSxDQUF2RyxFQUxGO09BRmU7SUFBQSxDQTVPakI7QUFBQSxJQW9RQSxTQUFBLEVBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxhQUFBO0FBQUEsTUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLHFDQUFaLENBQUEsQ0FBQTtBQUNBLE1BQUEsSUFBRyxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVo7QUFDRSxRQUFBLElBQUcsTUFBTSxDQUFDLGtCQUFQLENBQUEsQ0FBSDtBQUNFLFVBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSwyRUFBWixDQUFBLENBQUE7QUFDQSxnQkFBQSxDQUZGO1NBQUE7QUFBQSxRQUdBLENBQUE7QUFBQSxVQUFBLEtBQUEsRUFBTyxJQUFQO1NBQUEsQ0FIQSxDQUFBO0FBQUEsUUFNQSxLQUFBLEdBQVEsU0FBQSxHQUFBO2lCQUNOLE1BQU0sQ0FBQyxJQUFQLENBQVksSUFBQyxDQUFBLFlBQWIsRUFBMkIsU0FBQyxHQUFELEdBQUE7QUFDekIsWUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLGlCQUFBLEdBQW9CLEdBQUcsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUExQyxDQUFBLENBQUE7QUFBQSxZQUNBLE9BQU8sQ0FBQyxHQUFSLENBQVksR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUF0QixFQUE2QixHQUFHLENBQUMsS0FBSyxDQUFDLEdBQXZDLENBREEsQ0FBQTttQkFFQSxHQUFHLENBQUMsSUFBSixDQUFBLEVBSHlCO1VBQUEsQ0FBM0IsRUFETTtRQUFBLENBTlIsQ0FBQTtlQVlBLEtBQUEsQ0FBQSxFQWJGO09BRlM7SUFBQSxDQXBRWDtBQUFBLElBeVNBLGNBQUEsRUFBZ0IsNENBelNoQjtBQUFBLElBaVRBLGVBQUEsRUFBaUIsU0FBQyxVQUFELEVBQWEsY0FBYixFQUE2QixLQUE3QixFQUFvQyxjQUFwQyxHQUFBO0FBRWYsVUFBQSxnQ0FBQTtBQUFBLE1BQUEsV0FBQSxHQUFjLFNBQUMsUUFBRCxHQUFBO0FBQ1osWUFBQSxXQUFBO0FBQUEsUUFBQSxJQUFHLENBQUEsRUFBTSxDQUFDLFVBQUgsQ0FBYyxRQUFkLENBQVA7QUFDRSxpQkFBTyxFQUFQLENBREY7U0FBQTtBQUFBLFFBRUEsSUFBQSxHQUFPLEVBQUUsQ0FBQyxRQUFILENBQVksUUFBWixDQUZQLENBQUE7QUFBQSxRQUdBLEtBQUEsR0FBUSxFQUhSLENBQUE7QUFJQSxRQUFBLElBQUcsSUFBQSxJQUFRLENBQUEsSUFBUSxDQUFDLFdBQUwsQ0FBQSxDQUFmO0FBQ0UsVUFBQSxhQUFBLENBQWMsUUFBZCxFQUF3QixTQUFDLElBQUQsRUFBTSxLQUFOLEdBQUE7QUFDdEIsZ0JBQUEsQ0FBQTtBQUFBLFlBQUEsSUFBRyxDQUFBLEdBQUksY0FBYyxDQUFDLElBQWYsQ0FBb0IsSUFBcEIsQ0FBUDtBQUNFLGNBQUEsS0FBSyxDQUFDLElBQU4sQ0FBVyxDQUFDLFFBQUQsRUFBVSxLQUFWLEVBQWdCLENBQUMsQ0FBQyxLQUFsQixDQUFYLENBQUEsQ0FBQTtBQUFBLGNBQ0EsS0FBQSxDQUFNLFVBQU4sRUFBaUIsUUFBakIsRUFBMEIsSUFBMUIsRUFBK0IsS0FBL0IsRUFBcUMsQ0FBQyxDQUFDLEtBQXZDLENBREEsQ0FBQTtxQkFFQSxLQUFBLENBQU0sQ0FBTixFQUhGO2FBRHNCO1VBQUEsQ0FBeEIsQ0FBQSxDQURGO1NBSkE7QUFVQSxRQUFBLElBQUcsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUFsQjtBQUNFLFVBQUEsS0FBQSxDQUFNLEtBQU4sQ0FBQSxDQURGO1NBVkE7ZUFZQSxNQWJZO01BQUEsQ0FBZCxDQUFBO0FBQUEsTUFlQSxLQUFBLEdBQVEsRUFmUixDQUFBO0FBQUEsTUFpQkEsU0FBQSxHQUFZLEtBakJaLENBQUE7QUFBQSxNQWtCQSxFQUFFLENBQUMsV0FBSCxDQUFlLFVBQWYsQ0FBMEIsQ0FBQyxPQUEzQixDQUFtQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7QUFDakMsY0FBQSx3QkFBQTtBQUFBLFVBQUEsSUFBRyxJQUFBLEtBQVEsVUFBWDtBQUNFLFlBQUEsS0FBQSxDQUFNLHVCQUFOLENBQUEsQ0FERjtXQUFBO0FBQUEsVUFFQSxRQUFBLEdBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxVQUFWLEVBQXFCLElBQXJCLENBRlgsQ0FBQTtBQUdBLFVBQUEsSUFBRyxRQUFBLEtBQVksY0FBZjtBQUNFO0FBQ0UsY0FBQSxJQUFBLEdBQU8sRUFBRSxDQUFDLFFBQUgsQ0FBWSxRQUFaLENBQVAsQ0FBQTtBQUNBLGNBQUEsSUFBRyxJQUFIO0FBQ0UsZ0JBQUEsSUFBRyxDQUFBLElBQVEsQ0FBQyxXQUFMLENBQUEsQ0FBUDtBQUNFLGtCQUFBLFNBQUEsR0FBWSxJQUFaLENBQUE7QUFDQSxrQkFBQSxJQUFHLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBYixDQUFBLEtBQXNCLElBQXpCO0FBQ0Usb0JBQUEsS0FBQSxHQUFRLEtBQUssQ0FBQyxNQUFOLENBQWMsV0FBQSxDQUFZLFFBQVosQ0FBZCxDQUFSLENBQUE7QUFDQSxvQkFBQSxJQUFHLENBQUMsQ0FBQyxNQUFGLEdBQVcsQ0FBZDtBQUNFLHNCQUFBLEtBQUEsQ0FBTSxDQUFFLENBQUEsQ0FBQSxDQUFSLENBQUEsQ0FBQTs2QkFDQSxLQUFBLENBQU0sS0FBTSxDQUFBLENBQUEsQ0FBWixFQUZGO3FCQUZGO21CQUZGO2lCQUFBLE1BQUE7QUFRRSxrQkFBQSxDQUFBLEdBQUksS0FBQyxDQUFBLGVBQUQsQ0FBaUIsUUFBakIsRUFBMkIsRUFBM0IsRUFBK0IsS0FBL0IsRUFBc0MsY0FBdEMsQ0FBSixDQUFBO3lCQUNBLEtBQUEsR0FBUSxLQUFLLENBQUMsTUFBTixDQUFhLENBQWIsRUFUVjtpQkFERjtlQUZGO2FBQUEsY0FBQTtBQWFVLGNBQUosY0FBSSxDQWJWO2FBREY7V0FKaUM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuQyxDQWxCQSxDQUFBO0FBdUNBLE1BQUEsSUFBRyxLQUFBLElBQVMsU0FBVCxJQUFzQixVQUFBLEtBQWMsR0FBdkM7QUFDRSxRQUFBLENBQUEsR0FBSSxJQUFDLENBQUEsZUFBRCxDQUFpQixJQUFJLENBQUMsT0FBTCxDQUFhLFVBQWIsQ0FBakIsRUFBMkMsVUFBM0MsRUFBc0QsSUFBdEQsRUFBMkQsY0FBM0QsQ0FBSixDQUFBO0FBQUEsUUFDQSxLQUFBLEdBQVEsS0FBSyxDQUFDLE1BQU4sQ0FBYSxDQUFiLENBRFIsQ0FERjtPQXZDQTthQTJDQSxNQTdDZTtJQUFBLENBalRqQjtBQUFBLElBb1dBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixVQUFBLHFLQUFBO0FBQUEsTUFBQSxJQUFHLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBWjtBQUNFLFFBQUEsYUFBQSxHQUFnQixNQUFNLENBQUMsa0JBQVAsQ0FBQSxDQUFoQixDQUFBO0FBQUEsUUFDQSxLQUFBLENBQU0sYUFBTixDQURBLENBQUE7QUFBQSxRQUVBLE1BQU0sQ0FBQyxlQUFQLENBQUEsQ0FGQSxDQUFBO0FBQUEsUUFHQSxHQUFBLEdBQU0sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FITixDQUFBO0FBQUEsUUFJQSxlQUFBLEdBQWtCLE1BQUEsQ0FBRyx1QkFBQSxHQUNDLGFBREosQ0FKbEIsQ0FBQTtBQUFBLFFBUUEsWUFBQSxHQUFtQixJQUFBLEtBQUEsQ0FBVSxJQUFBLEtBQUEsQ0FBTSxDQUFOLEVBQVEsQ0FBUixDQUFWLEVBQXFCLEdBQXJCLENBUm5CLENBQUE7QUFBQSxRQVNBLFdBQUEsR0FBYyxFQVRkLENBQUE7QUFBQSxRQVVBLE1BQU0sQ0FBQywwQkFBUCxDQUFrQyxlQUFsQyxFQUFtRCxZQUFuRCxFQUFpRSxTQUFDLEtBQUQsR0FBQTtBQUMvRCxVQUFBLFdBQUEsR0FBYyxLQUFLLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBMUIsQ0FBQTtpQkFDQSxLQUFLLENBQUMsSUFBTixDQUFBLEVBRitEO1FBQUEsQ0FBakUsQ0FWQSxDQUFBO0FBQUEsUUFhQSxLQUFBLENBQU0sV0FBTixDQWJBLENBQUE7QUFBQSxRQWdCQSxZQUFBLEdBQWUsTUFBQSxDQUFHLHlFQUFBLEdBSWIsYUFKYSxHQUlDLG1CQUpKLENBaEJmLENBQUE7QUFBQSxRQXdCQSxTQUFBLEdBQVksS0F4QlosQ0FBQTtBQUFBLFFBMkJBLE1BQU0sQ0FBQywwQkFBUCxDQUFrQyxZQUFsQyxFQUFnRCxZQUFoRCxFQUE4RCxTQUFDLENBQUQsR0FBQTtBQUM1RCxVQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUFtQyxJQUFBLEtBQUEsQ0FBTSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFsQixFQUF1QixDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFaLEdBQXFCLGFBQWEsQ0FBQyxNQUExRCxDQUFuQyxDQUFBLENBQUE7QUFBQSxVQUNBLFNBQUEsR0FBWSxJQURaLENBQUE7aUJBRUEsQ0FBQyxDQUFDLEtBSDBEO1FBQUEsQ0FBOUQsQ0EzQkEsQ0FBQTtBQWlDQSxRQUFBLElBQUcsQ0FBQSxTQUFIO0FBQ0UsVUFBQSxZQUFBLEdBQWUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWIsQ0FBZixDQUFBO0FBQUEsVUFDQSxjQUFBLEdBQWlCLEVBRGpCLENBQUE7QUFBQSxVQUVBLEtBQUEsR0FBUSxJQUZSLENBQUE7QUFBQSxVQUdBLEtBQUEsR0FBUSxJQUFDLENBQUEsZUFBRCxDQUFpQixZQUFqQixFQUErQixjQUEvQixFQUErQyxLQUEvQyxFQUFzRCxZQUF0RCxDQUhSLENBQUE7QUFBQSxVQUlBLEtBQUEsQ0FBTSxLQUFOLENBSkEsQ0FBQTtBQU1BLGVBQUEsNENBQUEsR0FBQTtBQUNFLCtCQURHLGNBQUUsY0FBRSxZQUNQLENBQUE7QUFBQSxZQUFBLEtBQUEsQ0FBTSxDQUFOLEVBQVEsQ0FBUixFQUFVLENBQVYsQ0FBQSxDQURGO0FBQUEsV0FOQTtBQVFBLFVBQUEsSUFBRyxLQUFLLENBQUMsTUFBTixHQUFlLENBQWxCO21CQUNFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixLQUFNLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUE3QixFQUFnQztBQUFBLGNBQUMsV0FBQSxFQUFZLEtBQU0sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQXRCO2FBQWhDLEVBREY7V0FURjtTQWxDRjtPQURVO0lBQUEsQ0FwV1o7R0FuQkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/cpp-refactor/lib/cpp-refactor.coffee
