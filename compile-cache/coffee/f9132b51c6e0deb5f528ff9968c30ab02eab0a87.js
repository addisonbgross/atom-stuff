(function() {
  var AbstractProvider, PropertyProvider, TextEditor,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TextEditor = require('atom').TextEditor;

  AbstractProvider = require('./abstract-provider');

  module.exports = PropertyProvider = (function(_super) {
    __extends(PropertyProvider, _super);

    function PropertyProvider() {
      return PropertyProvider.__super__.constructor.apply(this, arguments);
    }

    PropertyProvider.prototype.hoverEventSelectors = '.property';

    PropertyProvider.prototype.clickEventSelectors = '.property';

    PropertyProvider.prototype.gotoRegex = /^(\$\w+)?((->|::)\w+)+/;


    /**
     * Goto the property from the term given.
     *
     * @param {TextEditor} editor TextEditor to search for namespace of term.
     * @param {string}     term   Term to search for.
     */

    PropertyProvider.prototype.gotoFromWord = function(editor, term) {
      var bufferPosition, calledClass, currentClass, value;
      bufferPosition = editor.getCursorBufferPosition();
      calledClass = this.parser.getCalledClass(editor, term, bufferPosition);
      if (!calledClass) {
        return;
      }
      currentClass = this.parser.getFullClassName(editor);
      if (currentClass === calledClass && this.jumpTo(editor, term)) {
        this.manager.addBackTrack(editor.getPath(), editor.getCursorBufferPosition());
        return;
      }
      value = this.parser.getMemberContext(editor, term, bufferPosition, calledClass);
      if (!value) {
        return;
      }
      atom.workspace.open(value.declaringStructure.filename, {
        searchAllPanes: true
      });
      this.manager.addBackTrack(editor.getPath(), editor.getCursorBufferPosition());
      return this.jumpWord = term;
    };


    /**
     * Gets the regex used when looking for a word within the editor
     *
     * @param  {string} term Term being search.
     *
     * @return {regex} Regex to be used.
     */

    PropertyProvider.prototype.getJumpToRegex = function(term) {
      return RegExp("(protected|public|private|static) +\\$" + term, "i");
    };

    return PropertyProvider;

  })(AbstractProvider);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1hdXRvY29tcGxldGUtcGhwL2xpYi9nb3RvL3Byb3BlcnR5LXByb3ZpZGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4Q0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUVBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxxQkFBUixDQUZuQixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FFTTtBQUNGLHVDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSwrQkFBQSxtQkFBQSxHQUFxQixXQUFyQixDQUFBOztBQUFBLCtCQUNBLG1CQUFBLEdBQXFCLFdBRHJCLENBQUE7O0FBQUEsK0JBRUEsU0FBQSxHQUFXLHdCQUZYLENBQUE7O0FBSUE7QUFBQTs7Ozs7T0FKQTs7QUFBQSwrQkFVQSxZQUFBLEdBQWMsU0FBQyxNQUFELEVBQVMsSUFBVCxHQUFBO0FBQ1YsVUFBQSxnREFBQTtBQUFBLE1BQUEsY0FBQSxHQUFpQixNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFqQixDQUFBO0FBQUEsTUFFQSxXQUFBLEdBQWMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxjQUFSLENBQXVCLE1BQXZCLEVBQStCLElBQS9CLEVBQXFDLGNBQXJDLENBRmQsQ0FBQTtBQUlBLE1BQUEsSUFBRyxDQUFBLFdBQUg7QUFDSSxjQUFBLENBREo7T0FKQTtBQUFBLE1BT0EsWUFBQSxHQUFlLElBQUMsQ0FBQSxNQUFNLENBQUMsZ0JBQVIsQ0FBeUIsTUFBekIsQ0FQZixDQUFBO0FBU0EsTUFBQSxJQUFHLFlBQUEsS0FBZ0IsV0FBaEIsSUFBK0IsSUFBQyxDQUFBLE1BQUQsQ0FBUSxNQUFSLEVBQWdCLElBQWhCLENBQWxDO0FBQ0ksUUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLFlBQVQsQ0FBc0IsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUF0QixFQUF3QyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUF4QyxDQUFBLENBQUE7QUFDQSxjQUFBLENBRko7T0FUQTtBQUFBLE1BYUEsS0FBQSxHQUFRLElBQUMsQ0FBQSxNQUFNLENBQUMsZ0JBQVIsQ0FBeUIsTUFBekIsRUFBaUMsSUFBakMsRUFBdUMsY0FBdkMsRUFBdUQsV0FBdkQsQ0FiUixDQUFBO0FBZUEsTUFBQSxJQUFHLENBQUEsS0FBSDtBQUNJLGNBQUEsQ0FESjtPQWZBO0FBQUEsTUFrQkEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxRQUE3QyxFQUF1RDtBQUFBLFFBQ25ELGNBQUEsRUFBZ0IsSUFEbUM7T0FBdkQsQ0FsQkEsQ0FBQTtBQUFBLE1Bc0JBLElBQUMsQ0FBQSxPQUFPLENBQUMsWUFBVCxDQUFzQixNQUFNLENBQUMsT0FBUCxDQUFBLENBQXRCLEVBQXdDLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQXhDLENBdEJBLENBQUE7YUF1QkEsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQXhCRjtJQUFBLENBVmQsQ0FBQTs7QUFvQ0E7QUFBQTs7Ozs7O09BcENBOztBQUFBLCtCQTJDQSxjQUFBLEdBQWdCLFNBQUMsSUFBRCxHQUFBO0FBQ1osYUFBTyxNQUFBLENBQUcsd0NBQUEsR0FBd0MsSUFBM0MsRUFBbUQsR0FBbkQsQ0FBUCxDQURZO0lBQUEsQ0EzQ2hCLENBQUE7OzRCQUFBOztLQUQyQixpQkFOL0IsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/atom-autocomplete-php/lib/goto/property-provider.coffee
