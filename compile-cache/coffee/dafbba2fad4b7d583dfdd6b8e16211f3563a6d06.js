(function() {
  var ClangProvider, CompositeDisposable, Disposable, defaultPrecompiled, path, spawn, util, _ref;

  util = require('./util');

  spawn = require('child_process').spawn;

  path = require('path');

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable;

  ClangProvider = null;

  defaultPrecompiled = require('./defaultPrecompiled');

  module.exports = {
    config: {
      clangCommand: {
        type: 'string',
        "default": 'clang'
      },
      includePaths: {
        type: 'array',
        "default": ['.'],
        items: {
          type: 'string'
        }
      },
      pchFilePrefix: {
        type: 'string',
        "default": '.stdafx'
      },
      ignoreClangErrors: {
        type: 'boolean',
        "default": true
      },
      includeDocumentation: {
        type: 'boolean',
        "default": true
      },
      includeNonDoxygenCommentsAsDocumentation: {
        type: 'boolean',
        "default": false
      },
      "std c++": {
        type: 'string',
        "default": "c++11"
      },
      "std c": {
        type: 'string',
        "default": "c99"
      },
      "preCompiledHeaders c++": {
        type: 'array',
        "default": defaultPrecompiled.cpp,
        item: {
          type: 'string'
        }
      },
      "preCompiledHeaders c": {
        type: 'array',
        "default": defaultPrecompiled.c,
        items: {
          type: 'string'
        }
      },
      "preCompiledHeaders objective-c": {
        type: 'array',
        "default": defaultPrecompiled.objc,
        items: {
          type: 'string'
        }
      },
      "preCompiledHeaders objective-c++": {
        type: 'array',
        "default": defaultPrecompiled.objcpp,
        items: {
          type: 'string'
        }
      }
    },
    deactivationDisposables: null,
    activate: function(state) {
      this.deactivationDisposables = new CompositeDisposable;
      return this.deactivationDisposables.add(atom.commands.add('atom-text-editor:not([mini])', {
        'autocomplete-clang:emit-pch': (function(_this) {
          return function() {
            return _this.emitPch(atom.workspace.getActiveTextEditor());
          };
        })(this)
      }));
    },
    emitPch: function(editor) {
      var args, clang_command, emit_process, h, headers, headersInput, lang;
      lang = util.getFirstCursorSourceScopeLang(editor);
      if (!lang) {
        alert("autocomplete-clang:emit-pch\nError: Incompatible Language");
        return;
      }
      clang_command = atom.config.get("autocomplete-clang.clangCommand");
      args = this.buildEmitPchCommandArgs(editor, lang);
      emit_process = spawn(clang_command, args);
      emit_process.on("exit", (function(_this) {
        return function(code) {
          return _this.handleEmitPchResult(code);
        };
      })(this));
      emit_process.stdout.on('data', function(data) {
        return console.log("out:\n" + data.toString());
      });
      emit_process.stderr.on('data', function(data) {
        return console.log("err:\n" + data.toString());
      });
      headers = atom.config.get("autocomplete-clang.preCompiledHeaders " + lang);
      headersInput = ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = headers.length; _i < _len; _i++) {
          h = headers[_i];
          _results.push("#include <" + h + ">");
        }
        return _results;
      })()).join("\n");
      emit_process.stdin.write(headersInput);
      return emit_process.stdin.end();
    },
    buildEmitPchCommandArgs: function(editor, lang) {
      var args, dir, file, i, include_paths, pch, pch_file_prefix, std;
      dir = path.dirname(editor.getPath());
      pch_file_prefix = atom.config.get("autocomplete-clang.pchFilePrefix");
      file = [pch_file_prefix, lang, "pch"].join('.');
      pch = path.join(dir, file);
      std = atom.config.get("autocomplete-clang.std " + lang);
      args = ["-x" + lang + "-header", "-Xclang", '-emit-pch', '-o', pch];
      if (std) {
        args = args.concat(["-std=" + std]);
      }
      include_paths = atom.config.get("autocomplete-clang.includePaths");
      args = args.concat((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = include_paths.length; _i < _len; _i++) {
          i = include_paths[_i];
          _results.push("-I" + i);
        }
        return _results;
      })());
      args = args.concat(["-"]);
      return args;
    },
    handleEmitPchResult: function(code) {
      if (!code) {
        alert("Emiting precompiled header has successfully finished");
        return;
      }
      return alert(("Emiting precompiled header exit with " + code + "\n") + "See console for detailed error message");
    },
    deactivate: function() {
      this.deactivationDisposables.dispose();
      return console.log("autocomplete-clang deactivated");
    },
    provide: function() {
      if (ClangProvider == null) {
        ClangProvider = require('./clang-provider');
      }
      return new ClangProvider();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWNsYW5nL2xpYi9hdXRvY29tcGxldGUtY2xhbmcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJGQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNDLFFBQVMsT0FBQSxDQUFRLGVBQVIsRUFBVCxLQURELENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsT0FBbUMsT0FBQSxDQUFRLE1BQVIsQ0FBbkMsRUFBQywyQkFBQSxtQkFBRCxFQUFxQixrQkFBQSxVQUhyQixDQUFBOztBQUFBLEVBSUEsYUFBQSxHQUFnQixJQUpoQixDQUFBOztBQUFBLEVBS0Esa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHNCQUFSLENBTHJCLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLFlBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxPQURUO09BREY7QUFBQSxNQUdBLFlBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxDQUFDLEdBQUQsQ0FEVDtBQUFBLFFBRUEsS0FBQSxFQUNFO0FBQUEsVUFBQSxJQUFBLEVBQU0sUUFBTjtTQUhGO09BSkY7QUFBQSxNQVFBLGFBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxTQURUO09BVEY7QUFBQSxNQVdBLGlCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFB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

//# sourceURL=/home/champ/.atom/packages/autocomplete-clang/lib/autocomplete-clang.coffee
