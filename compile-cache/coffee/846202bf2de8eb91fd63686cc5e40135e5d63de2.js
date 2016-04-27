(function() {
  var ClassProvider, FunctionProvider, GotoManager, PropertyProvider, TextEditor, parser;

  TextEditor = require('atom').TextEditor;

  ClassProvider = require('./class-provider.coffee');

  FunctionProvider = require('./function-provider.coffee');

  PropertyProvider = require('./property-provider.coffee');

  parser = require('../services/php-file-parser.coffee');

  module.exports = GotoManager = (function() {
    function GotoManager() {}

    GotoManager.prototype.providers = [];

    GotoManager.prototype.trace = [];


    /**
     * Initialisation of all the providers and commands for goto
     */

    GotoManager.prototype.init = function() {
      var provider, _i, _len, _ref;
      this.providers.push(new ClassProvider());
      this.providers.push(new FunctionProvider());
      this.providers.push(new PropertyProvider());
      _ref = this.providers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        provider = _ref[_i];
        provider.init(this);
      }
      atom.commands.add('atom-workspace', {
        'atom-autocomplete-php:goto-backtrack': (function(_this) {
          return function() {
            return _this.backTrack(atom.workspace.getActivePaneItem());
          };
        })(this)
      });
      return atom.commands.add('atom-workspace', {
        'atom-autocomplete-php:goto': (function(_this) {
          return function() {
            return _this.goto(atom.workspace.getActivePaneItem());
          };
        })(this)
      });
    };


    /**
     * Deactivates the goto functionaility
     */

    GotoManager.prototype.deactivate = function() {
      var provider, _i, _len, _ref, _results;
      _ref = this.providers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        provider = _ref[_i];
        _results.push(provider.deactivate());
      }
      return _results;
    };


    /**
     * Adds a backtrack step to the stack.
     *
     * @param {string}         fileName       The file where the jump took place.
     * @param {BufferPosition} bufferPosition The buffer position the cursor was last on.
     */

    GotoManager.prototype.addBackTrack = function(fileName, bufferPosition) {
      return this.trace.push({
        file: fileName,
        position: bufferPosition
      });
    };


    /**
     * Pops one of the stored back tracks and jump the user to its position.
     *
     * @param {TextEditor} editor The current editor.
     */

    GotoManager.prototype.backTrack = function(editor) {
      var lastTrace;
      if (this.trace.length === 0) {
        return;
      }
      lastTrace = this.trace.pop();
      if (editor instanceof TextEditor && editor.getPath() === lastTrace.file) {
        editor.setCursorBufferPosition(lastTrace.position, {
          autoscroll: false
        });
        return editor.scrollToScreenPosition(editor.screenPositionForBufferPosition(lastTrace.position), {
          center: true
        });
      } else {
        return atom.workspace.open(lastTrace.file, {
          searchAllPanes: true,
          initialLine: lastTrace.position[0],
          initialColumn: lastTrace.position[1]
        });
      }
    };


    /**
     * Takes the editor and jumps using one of the providers.
     *
     * @param {TextEditor} editor Current active editor
     */

    GotoManager.prototype.goto = function(editor) {
      var fullTerm, provider, _i, _len, _ref, _results;
      fullTerm = parser.getFullWordFromBufferPosition(editor, editor.getCursorBufferPosition());
      _ref = this.providers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        provider = _ref[_i];
        if (provider.canGoto(fullTerm)) {
          provider.gotoFromEditor(editor);
          break;
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return GotoManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1hdXRvY29tcGxldGUtcGhwL2xpYi9nb3RvL2dvdG8tbWFuYWdlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0ZBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxNQUFSLEVBQWQsVUFBRCxDQUFBOztBQUFBLEVBRUEsYUFBQSxHQUFnQixPQUFBLENBQVEseUJBQVIsQ0FGaEIsQ0FBQTs7QUFBQSxFQUdBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSw0QkFBUixDQUhuQixDQUFBOztBQUFBLEVBSUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLDRCQUFSLENBSm5CLENBQUE7O0FBQUEsRUFNQSxNQUFBLEdBQVMsT0FBQSxDQUFRLG9DQUFSLENBTlQsQ0FBQTs7QUFBQSxFQVFBLE1BQU0sQ0FBQyxPQUFQLEdBRU07NkJBQ0Y7O0FBQUEsMEJBQUEsU0FBQSxHQUFXLEVBQVgsQ0FBQTs7QUFBQSwwQkFDQSxLQUFBLEdBQU8sRUFEUCxDQUFBOztBQUdBO0FBQUE7O09BSEE7O0FBQUEsMEJBTUEsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNGLFVBQUEsd0JBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBWCxDQUFvQixJQUFBLGFBQUEsQ0FBQSxDQUFwQixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBWCxDQUFvQixJQUFBLGdCQUFBLENBQUEsQ0FBcEIsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsQ0FBb0IsSUFBQSxnQkFBQSxDQUFBLENBQXBCLENBRkEsQ0FBQTtBQUlBO0FBQUEsV0FBQSwyQ0FBQTs0QkFBQTtBQUNJLFFBQUEsUUFBUSxDQUFDLElBQVQsQ0FBYyxJQUFkLENBQUEs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

//# sourceURL=/home/champ/.atom/packages/atom-autocomplete-php/lib/goto/goto-manager.coffee
