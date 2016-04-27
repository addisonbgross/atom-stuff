(function() {
  var AbstractProvider, ClassProvider, config, exec, fuzzaldrin, parser, proxy,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fuzzaldrin = require('fuzzaldrin');

  exec = require("child_process");

  config = require("../config.coffee");

  proxy = require("../services/php-proxy.coffee");

  parser = require("../services/php-file-parser.coffee");

  AbstractProvider = require("./abstract-provider");

  module.exports = ClassProvider = (function(_super) {
    var classes;

    __extends(ClassProvider, _super);

    function ClassProvider() {
      return ClassProvider.__super__.constructor.apply(this, arguments);
    }

    classes = [];

    ClassProvider.prototype.disableForSelector = '.source.php .string';


    /**
     * Get suggestions from the provider (@see provider-api)
     * @return array
     */

    ClassProvider.prototype.fetchSuggestions = function(_arg) {
      var bufferPosition, characterAfterPrefix, editor, insertParameterList, prefix, scopeDescriptor, suggestions, _ref;
      editor = _arg.editor, bufferPosition = _arg.bufferPosition, scopeDescriptor = _arg.scopeDescriptor, prefix = _arg.prefix;
      this.regex = /((?:new|use)?(?:[^a-z0-9_])\\?(?:[A-Z][a-zA-Z_\\]*)+)/g;
      prefix = this.getPrefix(editor, bufferPosition);
      if (!prefix.length) {
        return;
      }
      this.classes = proxy.classes();
      if (((_ref = this.classes) != null ? _ref.autocomplete : void 0) == null) {
        return;
      }
      characterAfterPrefix = editor.getTextInRange([bufferPosition, [bufferPosition.row, bufferPosition.column + 1]]);
      insertParameterList = characterAfterPrefix === '(' ? false : true;
      suggestions = this.findSuggestionsForPrefix(prefix.trim(), insertParameterList);
      if (!suggestions.length) {
        return;
      }
      return suggestions;
    };


    /**
     * Returns suggestions available matching the given prefix
     * @param {string} prefix              Prefix to match.
     * @param {bool}   insertParameterList Whether to insert a list of parameters for methods.
     * @return array
     */

    ClassProvider.prototype.findSuggestionsForPrefix = function(prefix, insertParameterList) {
      var args, classInfo, instantiation, suggestions, use, word, words, _i, _len;
      if (insertParameterList == null) {
        insertParameterList = true;
      }
      instantiation = false;
      use = false;
      if (prefix.indexOf("new \\") !== -1) {
        instantiation = true;
        prefix = prefix.replace(/new \\/, '');
      } else if (prefix.indexOf("new ") !== -1) {
        instantiation = true;
        prefix = prefix.replace(/new /, '');
      } else if (prefix.indexOf("use ") !== -1) {
        use = true;
        prefix = prefix.replace(/use /, '');
      }
      if (prefix.indexOf("\\") === 0) {
        prefix = prefix.substring(1, prefix.length);
      }
      words = fuzzaldrin.filter(this.classes.autocomplete, prefix);
      suggestions = [];
      for (_i = 0, _len = words.length; _i < _len; _i++) {
        word = words[_i];
        if (!(word !== prefix)) {
          continue;
        }
        classInfo = this.classes.mapping[word];
        if (instantiation && this.classes.mapping[word].methods.constructor.has) {
          args = classInfo.methods.constructor.args;
          suggestions.push({
            text: word,
            type: 'class',
            className: classInfo["class"].deprecated ? 'php-atom-autocomplete-strike' : '',
            snippet: insertParameterList ? this.getFunctionSnippet(word, args) : null,
            displayText: this.getFunctionSignature(word, args),
            data: {
              kind: 'instantiation',
              prefix: prefix,
              replacementPrefix: prefix
            }
          });
        } else if (use) {
          suggestions.push({
            text: word,
            type: 'class',
            prefix: prefix,
            className: classInfo["class"].deprecated ? 'php-atom-autocomplete-strike' : '',
            replacementPrefix: prefix,
            data: {
              kind: 'use'
            }
          });
        } else {
          suggestions.push({
            text: word,
            type: 'class',
            className: classInfo["class"].deprecated ? 'php-atom-autocomplete-strike' : '',
            data: {
              kind: 'static',
              prefix: prefix,
              replacementPrefix: prefix
            }
          });
        }
      }
      return suggestions;
    };


    /**
     * Adds the missing use if needed
     * @param {TextEditor} editor
     * @param {Position}   triggerPosition
     * @param {object}     suggestion
     */

    ClassProvider.prototype.onDidInsertSuggestion = function(_arg) {
      var editor, suggestion, triggerPosition, _ref;
      editor = _arg.editor, triggerPosition = _arg.triggerPosition, suggestion = _arg.suggestion;
      if (!((_ref = suggestion.data) != null ? _ref.kind : void 0)) {
        return;
      }
      if (suggestion.data.kind === 'instantiation' || suggestion.data.kind === 'static') {
        return editor.transact((function(_this) {
          return function() {
            var endColumn, linesAdded, name, nameLength, row, splits, startColumn;
            linesAdded = parser.addUseClass(editor, suggestion.text, config.config.insertNewlinesForUseStatements);
            if (linesAdded !== null) {
              name = suggestion.text;
              splits = name.split('\\');
              nameLength = splits[splits.length - 1].length;
              startColumn = triggerPosition.column - suggestion.data.prefix.length;
              row = triggerPosition.row + linesAdded;
              if (suggestion.data.kind === 'instantiation') {
                endColumn = startColumn + name.length - nameLength - splits.length + 1;
              } else {
                endColumn = startColumn + name.length - nameLength;
              }
              return editor.setTextInBufferRange([[row, startColumn], [row, endColumn]], "");
            }
          };
        })(this));
      }
    };

    return ClassProvider;

  })(AbstractProvider);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1hdXRvY29tcGxldGUtcGhwL2xpYi9hdXRvY29tcGxldGlvbi9jbGFzcy1wcm92aWRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0VBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLFVBQUEsR0FBYSxPQUFBLENBQVEsWUFBUixDQUFiLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVIsQ0FEUCxDQUFBOztBQUFBLEVBR0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxrQkFBUixDQUhULENBQUE7O0FBQUEsRUFJQSxLQUFBLEdBQVEsT0FBQSxDQUFRLDhCQUFSLENBSlIsQ0FBQTs7QUFBQSxFQUtBLE1BQUEsR0FBUyxPQUFBLENBQVEsb0NBQVIsQ0FMVCxDQUFBOztBQUFBLEVBTUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHFCQUFSLENBTm5CLENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUdNO0FBQ0YsUUFBQSxPQUFBOztBQUFBLG9DQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLE9BQUEsR0FBVSxFQUFWLENBQUE7O0FBQUEsNEJBQ0Esa0JBQUEsR0FBb0IscUJBRHBCLENBQUE7O0FBR0E7QUFBQTs7O09BSEE7O0FBQUEsNEJBT0EsZ0JBQUEsR0FBa0IsU0FBQyxJQUFELEdBQUE7QUFFZCxVQUFBLDZHQUFBO0FBQUEsTUFGZ0IsY0FBQSxRQUFRLHNCQUFBLGdCQUFnQix1QkFBQSxpQkFBaUIsY0FBQSxNQUV6RCxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLHdEQUFULENBQUE7QUFBQSxNQUVBLE1BQUEsR0FBUyxJQUFDLENBQUEsU0FBRCxDQUFXLE1BQVgsRUFBbUIsY0FBbkIsQ0FGVCxDQUFBO0FBR0Es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

//# sourceURL=/home/champ/.atom/packages/atom-autocomplete-php/lib/autocompletion/class-provider.coffee
