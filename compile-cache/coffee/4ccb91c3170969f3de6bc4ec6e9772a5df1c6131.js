(function() {
  var AbstractProvider, FunctionProvider, TextEditor,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TextEditor = require('atom').TextEditor;

  AbstractProvider = require('./abstract-provider');

  module.exports = FunctionProvider = (function(_super) {
    __extends(FunctionProvider, _super);

    function FunctionProvider() {
      return FunctionProvider.__super__.constructor.apply(this, arguments);
    }

    FunctionProvider.prototype.hoverEventSelectors = '.function-call';

    FunctionProvider.prototype.clickEventSelectors = '.function-call';

    FunctionProvider.prototype.gotoRegex = /^(\$\w+)?((->|::)\w+\()+/;


    /**
     * Goto the class from the term given.
     *
     * @param {TextEditor} editor  TextEditor to search for namespace of term.
     * @param {string}     term    Term to search for.
     */

    FunctionProvider.prototype.gotoFromWord = function(editor, term) {
      var bufferPosition, calledClass, currentClass, value;
      bufferPosition = editor.getCursorBufferPosition();
      calledClass = this.parser.getCalledClass(editor, term, bufferPosition);
      if (!calledClass) {
        return;
      }
      currentClass = this.parser.getFullClassName(editor);
      if (currentClass === calledClass && this.jumpTo(editor, term)) {
        this.manager.addBackTrack(editor.getPath(), bufferPosition);
        return;
      }
      value = this.parser.getMemberContext(editor, term, bufferPosition, calledClass);
      if (!value) {
        return;
      }
      atom.workspace.open(value.declaringStructure.filename, {
        initialLine: value.startLine - 1,
        searchAllPanes: true
      });
      return this.manager.addBackTrack(editor.getPath(), bufferPosition);
    };


    /**
     * Gets the regex used when looking for a word within the editor
     *
     * @param {string} term Term being search.
     *
     * @return {regex} Regex to be used.
     */

    FunctionProvider.prototype.getJumpToRegex = function(term) {
      return RegExp("function +" + term + "( +|\\()", "i");
    };

    return FunctionProvider;

  })(AbstractProvider);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1hdXRvY29tcGxldGUtcGhwL2xpYi9nb3RvL2Z1bmN0aW9uLXByb3ZpZGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4Q0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUVBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxxQkFBUixDQUZuQixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FFTTtBQUNGLHVDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSwrQkFBQSxtQkFBQSxHQUFxQixnQkFBckIsQ0FBQTs7QUFBQSwrQkFDQSxtQkFBQSxHQUFxQixnQkFEckIsQ0FBQTs7QUFBQSwrQkFFQSxTQUFBLEdBQVcsMEJBRlgsQ0FBQTs7QUFJQTtBQUFBOzs7OztPQUpBOztBQUFBLCtCQVVBLFlBQUEsR0FBYyxTQUFDLE1BQUQsRUFBUyxJQUFULEdBQUE7QUFDVixVQUFBLGdEQUFBO0FBQUEsTUFBQSxjQUFBLEdBQWlCLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQWpCLENBQUE7QUFBQSxNQUVBLFdBQUEsR0FBYyxJQUFDLENBQUEsTUFBTSxDQUFDLGNBQVIsQ0FBdUIsTUFBdkIsRUFBK0IsSUFBL0IsRUFBcUMsY0FBckMsQ0FGZCxDQUFBO0FBSUEsTUFBQSxJQUFHLENBQUEsV0FBSDtBQUNJLGNBQUEsQ0FESjtPQUpBO0FBQUEsTUFPQSxZQUFBLEdBQWUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxnQkFBUixDQUF5QixNQUF6QixDQVBmLENBQUE7QUFTQSxNQUFBLElBQUcsWUFBQSxLQUFnQixXQUFoQixJQUErQixJQUFDLENBQUEsTUFBRCxDQUFRLE1BQVIsRUFBZ0IsSUFBaEIsQ0FBbEM7QUFDSSxRQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsWUFBVCxDQUFzQixNQUFNLENBQUMsT0FBUCxDQUFBLENBQXRCLEVBQXdDLGNBQXhDLENBQUEsQ0FBQTtBQUNBLGNBQUEsQ0FGSjtPQVRBO0FBQUEsTUFhQSxLQUFBLEdBQVEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxnQkFBUixDQUF5QixNQUF6QixFQUFpQyxJQUFqQyxFQUF1QyxjQUF2QyxFQUF1RCxXQUF2RCxDQWJSLENBQUE7QUFlQSxNQUFBLElBQUcsQ0FBQSxLQUFIO0FBQ0ksY0FBQSxDQURKO09BZkE7QUFBQSxNQWtCQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsS0FBSyxDQUFDLGtCQUFrQixDQUFDLFFBQTdDLEVBQXVEO0FBQUEsUUFDbkQsV0FBQSxFQUFrQixLQUFLLENBQUMsU0FBTixHQUFrQixDQURlO0FBQUEsUUFFbkQsY0FBQSxFQUFpQixJQUZrQztPQUF2RCxDQWxCQSxDQUFBO2FBdUJBLElBQUMsQ0FBQSxPQUFPLENBQUMsWUFBVCxDQUFzQixNQUFNLENBQUMsT0FBUCxDQUFBLENBQXRCLEVBQXdDLGNBQXhDLEVBeEJVO0lBQUEsQ0FWZCxDQUFBOztBQW9DQTtBQUFBOzs7Ozs7T0FwQ0E7O0FBQUEsK0JBMkNBLGNBQUEsR0FBZ0IsU0FBQyxJQUFELEdBQUE7QUFDWixhQUFPLE1BQUEsQ0FBRyxZQUFBLEdBQWEsSUFBYixHQUFrQixVQUFyQixFQUFnQyxHQUFoQyxDQUFQLENBRFk7SUFBQSxDQTNDaEIsQ0FBQTs7NEJBQUE7O0tBRDJCLGlCQU4vQixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/atom-autocomplete-php/lib/goto/function-provider.coffee
