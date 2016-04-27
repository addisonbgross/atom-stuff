(function() {
  var exec, fs, path;

  exec = require('child_process');

  fs = require('fs');

  path = require('path');

  module.exports = {
    executablePath: 'php',
    selector: '.source.php',
    disableForSelector: '.source.php .comment',
    inclusionPriority: 1,
    excludeLowerPriority: true,
    loadCompletions: function() {
      this.completions = {};
      fs.readFile(path.resolve(__dirname, '..', 'completions.json'), (function(_this) {
        return function(error, content) {
          if (error == null) {
            _this.completions = JSON.parse(content);
          }
        };
      })(this));
      this.funtions = {};
      return fs.readFile(path.resolve(__dirname, '..', 'functions.json'), (function(_this) {
        return function(error, content) {
          if (error == null) {
            _this.funtions = JSON.parse(content);
          }
        };
      })(this));
    },
    execute: function(_arg, force) {
      var editor, phpEx, proc;
      editor = _arg.editor;
      if (force == null) {
        force = false;
      }
      if (!force) {
        if ((this.userVars != null) && this.lastPath === editor.getPath()) {
          return;
        }
      }
      this.compileData = '';
      phpEx = 'get_user_all.php';
      proc = exec.spawn(this.executablePath, [__dirname + '/php/' + phpEx]);
      proc.stdin.write(editor.getText());
      proc.stdin.end();
      proc.stdout.on('data', (function(_this) {
        return function(data) {
          return _this.compileData = _this.compileData + data;
        };
      })(this));
      proc.stderr.on('data', function(data) {
        return console.log('err: ' + data);
      });
      return proc.on('close', (function(_this) {
        return function(code) {
          var error;
          try {
            _this.userSuggestions = JSON.parse(_this.compileData);
          } catch (_error) {
            error = _error;
          }
          return _this.lastPath = editor.getPath();
        };
      })(this));
    },
    getSuggestions: function(request) {
      return new Promise((function(_this) {
        return function(resolve) {
          var typeEx;
          typeEx = true;
          if (_this.notShowAutocomplete(request)) {
            return resolve([]);
          } else if (_this.isAll(request)) {
            _this.execute(request, typeEx);
            return resolve(_this.getAllCompletions(request));
          } else if (_this.isVariable(request)) {
            _this.execute(request, typeEx);
            return resolve(_this.getVarsCompletions(request));
          } else if (_this.isFunCon(request)) {
            _this.execute(request, typeEx);
            return resolve(_this.getCompletions(request));
          } else {
            return resolve([]);
          }
        };
      })(this));
    },
    onDidInsertSuggestion: function(_arg) {
      var editor, suggestion, triggerPosition;
      editor = _arg.editor, triggerPosition = _arg.triggerPosition, suggestion = _arg.suggestion;
    },
    dispose: function() {},
    notShowAutocomplete: function(request) {
      var scopes;
      if (request.prefix === '') {
        return true;
      }
      scopes = request.scopeDescriptor.getScopesArray();
      if (scopes.indexOf('keyword.operator.assignment.php') !== -1 || scopes.indexOf('keyword.operator.comparison.php') !== -1 || scopes.indexOf('keyword.operator.logical.php') !== -1 || scopes.indexOf('string.quoted.double.php') !== -1 || scopes.indexOf('string.quoted.single.php') !== -1) {
        return true;
      }
      if (this.isInString(request) && this.isFunCon(request)) {
        return true;
      }
    },
    isInString: function(_arg) {
      var scopeDescriptor, scopes;
      scopeDescriptor = _arg.scopeDescriptor;
      scopes = scopeDescriptor.getScopesArray();
      if (scopes.indexOf('string.quoted.single.php') !== -1 || scopes.indexOf('string.quoted.double.php') !== -1) {
        return true;
      }
    },
    isAll: function(_arg) {
      var scopeDescriptor, scopes;
      scopeDescriptor = _arg.scopeDescriptor;
      scopes = scopeDescriptor.getScopesArray();
      if (scopes.length === 3 || scopes.indexOf('meta.array.php') !== -1) {
        return true;
      }
    },
    isVariable: function(_arg) {
      var scopeDescriptor, scopes;
      scopeDescriptor = _arg.scopeDescriptor;
      scopes = scopeDescriptor.getScopesArray();
      if (scopes.indexOf('variable.other.php') !== -1) {
        return true;
      }
    },
    isFunCon: function(_arg) {
      var scopeDescriptor, scopes;
      scopeDescriptor = _arg.scopeDescriptor;
      scopes = scopeDescriptor.getScopesArray();
      if (scopes.indexOf('constant.other.php') !== -1 || scopes.indexOf('keyword.control.php') !== -1 || scopes.indexOf('storage.type.php') !== -1 || scopes.indexOf('support.function.construct.php')) {
        return true;
      }
    },
    getAllCompletions: function(_arg) {
      var completions, constants, editor, func, keyword, lowerCasePrefix, prefix, userFunc, userVar, variable, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _m, _n, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
      editor = _arg.editor, prefix = _arg.prefix;
      completions = [];
      lowerCasePrefix = prefix.toLowerCase();
      if (this.userSuggestions != null) {
        _ref = this.userSuggestions.user_vars;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          userVar = _ref[_i];
          if (userVar.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
            completions.push(this.buildCompletion(userVar));
          }
        }
      }
      _ref1 = this.completions.variables;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        variable = _ref1[_j];
        if (variable.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
          completions.push(this.buildCompletion(variable));
        }
      }
      _ref2 = this.completions.constants;
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        constants = _ref2[_k];
        if (constants.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
          completions.push(this.buildCompletion(constants));
        }
      }
      _ref3 = this.completions.keywords;
      for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
        keyword = _ref3[_l];
        if (keyword.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
          completions.push(this.buildCompletion(keyword));
        }
      }
      if (this.userSuggestions != null) {
        _ref4 = this.userSuggestions.user_functions;
        for (_m = 0, _len4 = _ref4.length; _m < _len4; _m++) {
          userFunc = _ref4[_m];
          if (userFunc.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
            completions.push(this.buildCompletion(userFunc));
          }
        }
      }
      _ref5 = this.funtions.functions;
      for (_n = 0, _len5 = _ref5.length; _n < _len5; _n++) {
        func = _ref5[_n];
        if (func.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
          completions.push(this.buildCompletion(func));
        }
      }
      return completions;
    },
    getCompletions: function(_arg) {
      var completions, constants, editor, func, keyword, lowerCasePrefix, prefix, userFunc, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3;
      editor = _arg.editor, prefix = _arg.prefix;
      completions = [];
      lowerCasePrefix = prefix.toLowerCase();
      _ref = this.completions.constants;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        constants = _ref[_i];
        if (constants.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
          completions.push(this.buildCompletion(constants));
        }
      }
      _ref1 = this.completions.keywords;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        keyword = _ref1[_j];
        if (keyword.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
          completions.push(this.buildCompletion(keyword));
        }
      }
      if (this.userSuggestions != null) {
        _ref2 = this.userSuggestions.user_functions;
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          userFunc = _ref2[_k];
          if (userFunc.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
            completions.push(this.buildCompletion(userFunc));
          }
        }
      }
      _ref3 = this.funtions.functions;
      for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
        func = _ref3[_l];
        if (func.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
          completions.push(this.buildCompletion(func));
        }
      }
      return completions;
    },
    getVarsCompletions: function(_arg) {
      var completions, editor, lowerCasePrefix, prefix, userVar, variable, _i, _j, _len, _len1, _ref, _ref1;
      editor = _arg.editor, prefix = _arg.prefix;
      completions = [];
      lowerCasePrefix = prefix.toLowerCase();
      if (this.userSuggestions != null) {
        _ref = this.userSuggestions.user_vars;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          userVar = _ref[_i];
          if (userVar.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
            completions.push(this.buildCompletion(userVar));
          }
        }
      }
      _ref1 = this.completions.variables;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        variable = _ref1[_j];
        if (variable.text.toLowerCase().indexOf(lowerCasePrefix) === 0) {
          completions.push(this.buildCompletion(variable));
        }
      }
      return completions;
    },
    buildCompletion: function(suggestion) {
      return {
        text: suggestion.text,
        type: suggestion.type,
        displayText: suggestion.displayText != null ? suggestion.displayText : suggestion.displayText = null,
        snippet: suggestion.snippet != null ? suggestion.snippet : suggestion.snippet = null,
        leftLabel: suggestion.leftLabel != null ? suggestion.leftLabel : suggestion.leftLabel = null,
        description: suggestion.description != null ? suggestion.description : suggestion.description = "PHP <" + suggestion.text + "> " + suggestion.type,
        descriptionMoreURL: suggestion.descriptionMoreURL != null ? suggestion.descriptionMoreURL : suggestion.descriptionMoreURL = null
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBocC9saWIvcHJvdmlkZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxjQUFBLEVBQWdCLEtBQWhCO0FBQUEsSUFHQSxRQUFBLEVBQVUsYUFIVjtBQUFBLElBSUEsa0JBQUEsRUFBb0Isc0JBSnBCO0FBQUEsSUFVQSxpQkFBQSxFQUFtQixDQVZuQjtBQUFBLElBV0Esb0JBQUEsRUFBc0IsSUFYdEI7QUFBQSxJQWNBLGVBQUEsRUFBaUIsU0FBQSxHQUFBO0FBQ2YsTUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLEVBQWYsQ0FBQTtBQUFBLE1BQ0EsRUFBRSxDQUFDLFFBQUgsQ0FBWSxJQUFJLENBQUMsT0FBTCxDQUFhLFNBQWIsRUFBd0IsSUFBeEIsRUFBOEIsa0JBQTlCLENBQVosRUFBK0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxFQUFRLE9BQVIsR0FBQTtBQUM3RCxVQUFBLElBQTBDLGFBQTFDO0FBQUEsWUFBQSxLQUFDLENBQUEsV0FBRCxHQUFlLElBQUksQ0FBQyxLQUFMLENBQVcsT0FBWCxDQUFmLENBQUE7V0FENkQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvRCxDQURBLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxRQUFELEdBQVksRUFMWixDQUFBO2FBTUEs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

//# sourceURL=/home/champ/.atom/packages/autocomplete-php/lib/provider.coffee
