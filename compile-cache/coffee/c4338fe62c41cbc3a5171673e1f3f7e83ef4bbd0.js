(function() {
  var Function, Fuzzaldrin, GlslProvider, Keyword, Q, fs;

  Q = null;

  Keyword = null;

  Function = null;

  Fuzzaldrin = null;

  fs = null;

  module.exports = GlslProvider = (function() {
    function GlslProvider() {}

    GlslProvider.prototype.selector = '.glsl, .vs, .fs, .gs, .tc, tcs, .te, .tes, .vert, .frag';

    GlslProvider.prototype.inclusionPriority = 10;

    GlslProvider.prototype.excludeLowerPriority = false;

    GlslProvider.prototype.categories = {
      preprocessor: {
        name: "preprocessor",
        color: "#316782"
      },
      "function": {
        name: "function",
        color: "#1f6699"
      },
      type: {
        name: "type",
        color: "#61fab5"
      },
      qualifier: {
        name: "qualifier",
        color: "#8e8685"
      },
      statement: {
        name: "statement",
        color: "#1cde3e"
      },
      variable: {
        name: "variable",
        color: "#5f83aa"
      },
      keyword: {
        name: "keyword",
        color: "#73edca"
      },
      identifier: {
        name: "identifier",
        color: "#ea71d4"
      }
    };

    GlslProvider.prototype.getSuggestions = function(_arg) {
      var bufferPosition, editor, prefix, scopeDescriptor;
      editor = _arg.editor, bufferPosition = _arg.bufferPosition, scopeDescriptor = _arg.scopeDescriptor, prefix = _arg.prefix;
      if (this.keywords == null) {
        this.keywords = this.loadKeywords();
      }
      return this.keywords.then((function(_this) {
        return function(resolvedKeywords) {
          var suggestions;
          if (!((bufferPosition != null) && (prefix != null ? prefix.length : void 0))) {
            return;
          }
          suggestions = _this.findSuggestionsForWord(resolvedKeywords, prefix);
          if (!(suggestions != null ? suggestions.length : void 0)) {
            return;
          }
          return suggestions;
        };
      })(this));
    };

    GlslProvider.prototype.findSuggestionsForWord = function(keywords, prefix) {
      var result, results, suggestion, suggestions;
      if (!((keywords != null) && (prefix != null))) {
        return [];
      }
      if (Fuzzaldrin == null) {
        Fuzzaldrin = require('fuzzaldrin');
      }
      results = Fuzzaldrin.filter(keywords, prefix, {
        key: 'name'
      });
      return suggestions = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = results.length; _i < _len; _i++) {
          result = results[_i];
          if (result instanceof Function) {
            _results.push(suggestion = {
              replacementPrefix: prefix,
              snippet: result.getSnippet(),
              type: "" + result.category,
              leftLabel: "" + result.returnValue,
              description: "" + result.description,
              descriptionMoreURL: "https://www.opengl.org/sdk/docs/man/html/" + result.name + ".xhtml"
            });
          } else {
            _results.push(suggestion = {
              text: result.name,
              type: "" + result.category,
              replacementPrefix: prefix
            });
          }
        }
        return _results;
      })();
    };

    GlslProvider.prototype.loadKeywords = function() {
      var keywords, packagePath;
      if (Q == null) {
        Q = require('q');
      }
      keywords = Q.defer();
      packagePath = atom.packages.resolvePackagePath('autocomplete-glsl');
      if (fs == null) {
        fs = require('fs-plus');
      }
      fs.readFile("" + packagePath + "/data/glsl430-mini.json", 'utf8', ((function(_this) {
        return function(err, data) {
          var instance, item, tmpKeywords, _i, _j, _len, _len1, _ref, _ref1;
          if (err != null) {
            throw err;
          }
          tmpKeywords = [];
          _ref = JSON.parse(data);
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            if (!item.category) {
              console.error(item + " has no category!");
            }
            if (!item.name) {
              console.error(item + " has no name!");
            }
            if (Keyword == null) {
              Keyword = require('./keyword');
            }
            if (Function == null) {
              Function = require('./function');
            }
            if (item.category === _this.categories["function"].name) {
              if (!(item.overload instanceof Array)) {
                tmpKeywords.push(new Function(item.name, item.category, item.overload.description, item.overload.parameters, item.overload.returnValue));
              } else {
                _ref1 = item.overload;
                for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                  instance = _ref1[_j];
                  tmpKeywords.push(new Function(item.name, item.category, instance.description, instance.parameters, instance.returnValue));
                }
              }
            } else {
              tmpKeywords.push(new Keyword(item.name, item.category));
            }
          }
          return keywords.resolve(tmpKeywords);
        };
      })(this)));
      return keywords.promise;
    };

    return GlslProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWdsc2wvbGliL2dsc2wtcHJvdmlkZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtEQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLElBQUosQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBVSxJQURWLENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQVcsSUFGWCxDQUFBOztBQUFBLEVBR0EsVUFBQSxHQUFhLElBSGIsQ0FBQTs7QUFBQSxFQUlBLEVBQUEsR0FBSyxJQUpMLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUNROzhCQUNKOztBQUFBLDJCQUFBLFFBQUEsR0FBVSx5REFBVixDQUFBOztBQUFBLDJCQUNBLGlCQUFBLEdBQW1CLEVBRG5CLENBQUE7O0FBQUEsMkJBRUEsb0JBQUEsR0FBc0IsS0FGdEIsQ0FBQTs7QUFBQSwyQkFHQSxVQUFBLEdBQ0k7QUFBQSxNQUFBLFlBQUEsRUFBYztBQUFBLFFBQUMsSUFBQSxFQUFNLGNBQVA7QUFBQSxRQUF1QixLQUFBLEVBQU8sU0FBOUI7T0FBZDtBQUFBLE1BQ0EsVUFBQSxFQUFVO0FBQUEsUUFBQyxJQUFBLEVBQU0sVUFBUDtBQUFBLFFBQW1CLEtBQUEsRUFBTyxTQUExQjtPQURWO0FBQUEsTUFFQSxJQUFBLEVBQU07QUFBQSxRQUFDLElBQUEsRUFBTSxNQUFQO0FBQUEsUUFBZSxLQUFBLEVBQU8sU0FBdEI7T0FGTjtBQUFBLE1BR0EsU0FBQSxFQUFXO0FBQUEsUUFBQyxJQUFBLEVBQU0sV0FBUDtBQUFBLFFBQW9CLEtBQUEsRUFBTyxTQUEzQjtPQUhYO0FBQUEsTUFJQSxTQUFBLEVBQVc7QUFBQSxRQUFDLElBQUEsRUFBTSxXQUFQO0FBQUEsUUFBb0IsS0FBQSxFQUFPLFNBQTNCO09BSlg7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

//# sourceURL=/home/champ/.atom/packages/autocomplete-glsl/lib/glsl-provider.coffee
