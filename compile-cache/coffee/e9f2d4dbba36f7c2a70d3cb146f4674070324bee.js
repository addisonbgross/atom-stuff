(function() {
  var convertCompletions, fetchCompletions, getCompletions, handler, processContext, utility;

  handler = require('./handler');

  utility = require('./utility');

  processContext = function(_arg) {
    var activatedManually, bufferPosition, editor, prefix, scopeDescriptor;
    editor = _arg.editor, scopeDescriptor = _arg.scopeDescriptor, bufferPosition = _arg.bufferPosition, prefix = _arg.prefix, activatedManually = _arg.activatedManually;
    return utility.getEditorData(editor, scopeDescriptor).then(function(_arg1) {
      var contents, filepath, filetypes;
      filepath = _arg1.filepath, contents = _arg1.contents, filetypes = _arg1.filetypes;
      return {
        editor: editor,
        filepath: filepath,
        contents: contents,
        filetypes: filetypes,
        bufferPosition: bufferPosition,
        activatedManually: activatedManually
      };
    });
  };

  fetchCompletions = function(_arg) {
    var activatedManually, bufferPosition, contents, editor, filepath, filetypes, parameters;
    editor = _arg.editor, filepath = _arg.filepath, contents = _arg.contents, filetypes = _arg.filetypes, bufferPosition = _arg.bufferPosition, activatedManually = _arg.activatedManually;
    parameters = utility.buildRequestParameters(filepath, contents, filetypes, bufferPosition);
    if (activatedManually) {
      parameters.force_semantic = true;
    }
    return handler.request('POST', 'completions', parameters).then(function(response) {
      var completions, prefix, startColumn;
      completions = (response != null ? response.completions : void 0) || [];
      startColumn = ((response != null ? response.completion_start_column : void 0) || (bufferPosition.column + 1)) - 1;
      prefix = editor.getTextInBufferRange([[bufferPosition.row, startColumn], bufferPosition]);
      return {
        completions: completions,
        prefix: prefix,
        filetypes: filetypes
      };
    });
  };

  convertCompletions = function(_arg) {
    var completions, converter, converters, filetypes, prefix;
    completions = _arg.completions, prefix = _arg.prefix, filetypes = _arg.filetypes;
    converters = {
      general: function(completion) {
        var suggestion;
        suggestion = {
          text: completion.insertion_text,
          replacementPrefix: prefix,
          displayText: completion.menu_text,
          leftLabel: completion.extra_menu_info,
          rightLabel: completion.kind,
          description: null
        };
        suggestion.type = (function() {
          switch (completion.kind) {
            case '[File]':
            case '[Dir]':
            case '[File&Dir]':
              return 'import';
            default:
              return null;
          }
        })();
        return suggestion;
      },
      clang: function(completion) {
        var suggestion;
        suggestion = converters.general(completion);
        suggestion.type = (function() {
          switch (completion.kind) {
            case 'TYPE':
            case 'STRUCT':
            case 'ENUM':
              return 'type';
            case 'CLASS':
              return 'class';
            case 'MEMBER':
              return 'property';
            case 'FUNCTION':
              return 'function';
            case 'VARIABLE':
            case 'PARAMETER':
              return 'variable';
            case 'MACRO':
              return 'constant';
            case 'NAMESPACE':
              return 'keyword';
            case 'UNKNOWN':
              return 'value';
            default:
              return suggestion.type;
          }
        })();
        return suggestion;
      },
      python: function(completion) {
        var suggestion;
        suggestion = converters.general(completion);
        suggestion.type = completion.display_string.substr(0, completion.display_string.indexOf(': '));
        return suggestion;
      }
    };
    converter = converters[((function() {
      switch (filetypes[0]) {
        case 'c':
        case 'cpp':
        case 'objc':
        case 'objcpp':
          return 'clang';
        case 'python':
          return 'python';
        default:
          return 'general';
      }
    })())];
    return completions.map(converter);
  };

  getCompletions = function(context) {
    return Promise.resolve(context).then(processContext).then(fetchCompletions).then(convertCompletions);
  };

  module.exports = getCompletions;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMveW91LWNvbXBsZXRlLW1lL2xpYi9nZXQtY29tcGxldGlvbnMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNGQUFBOztBQUFBLEVBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBQVYsQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQURWLENBQUE7O0FBQUEsRUFHQSxjQUFBLEdBQWlCLFNBQUMsSUFBRCxHQUFBO0FBQ2YsUUFBQSxrRUFBQTtBQUFBLElBRGlCLGNBQUEsUUFBUSx1QkFBQSxpQkFBaUIsc0JBQUEsZ0JBQWdCLGNBQUEsUUFBUSx5QkFBQSxpQkFDbEUsQ0FBQTtXQUFBLE9BQU8sQ0FBQyxhQUFSLENBQXNCLE1BQXRCLEVBQThCLGVBQTlCLENBQThDLENBQUMsSUFBL0MsQ0FBb0QsU0FBQyxLQUFELEdBQUE7QUFDbEQsVUFBQSw2QkFBQTtBQUFBLE1BRG9ELGlCQUFBLFVBQVUsaUJBQUEsVUFBVSxrQkFBQSxTQUN4RSxDQUFBO0FBQUEsYUFBTztBQUFBLFFBQUMsUUFBQSxNQUFEO0FBQUEsUUFBUyxVQUFBLFFBQVQ7QUFBQSxRQUFtQixVQUFBLFFBQW5CO0FBQUEsUUFBNkIsV0FBQSxTQUE3QjtBQUFBLFFBQXdDLGdCQUFBLGNBQXhDO0FBQUEsUUFBd0QsbUJBQUEsaUJBQXhEO09BQVAsQ0FEa0Q7SUFBQSxDQUFwRCxFQURlO0VBQUEsQ0FIakIsQ0FBQTs7QUFBQSxFQU9BLGdCQUFBLEdBQW1CLFNBQUMsSUFBRCxHQUFBO0FBQ2pCLFFBQUEsb0ZBQUE7QUFBQSxJQURtQixjQUFBLFFBQVEsZ0JBQUEsVUFBVSxnQkFBQSxVQUFVLGlCQUFBLFdBQVcsc0JBQUEsZ0JBQWdCLHlCQUFBLGlCQUMxRSxDQUFBO0FBQUEsSUFB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

//# sourceURL=/home/champ/.atom/packages/you-complete-me/lib/get-completions.coffee
