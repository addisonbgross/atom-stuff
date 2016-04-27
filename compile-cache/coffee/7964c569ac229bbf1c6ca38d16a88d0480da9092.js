(function() {
  var AbstractProvider, FunctionProvider,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  AbstractProvider = require('./abstract-provider');

  module.exports = FunctionProvider = (function(_super) {
    __extends(FunctionProvider, _super);

    function FunctionProvider() {
      return FunctionProvider.__super__.constructor.apply(this, arguments);
    }

    FunctionProvider.prototype.regex = /(\s*(?:public|protected|private)\s+\$)(\w+)\s+/g;


    /**
     * @inheritdoc
     */

    FunctionProvider.prototype.extractAnnotationInfo = function(editor, row, rowText, match) {
      var context, currentClass, propertyName;
      currentClass = this.parser.getFullClassName(editor);
      propertyName = match[2];
      context = this.parser.getMemberContext(editor, propertyName, null, currentClass);
      if (!context || !context.override) {
        return null;
      }
      return {
        lineNumberClass: 'override',
        tooltipText: 'Overrides property from ' + context.override.declaringClass.name,
        extraData: context.override
      };
    };


    /**
     * @inheritdoc
     */

    FunctionProvider.prototype.handleMouseClick = function(event, editor, annotationInfo) {
      return atom.workspace.open(annotationInfo.extraData.declaringStructure.filename, {
        searchAllPanes: true
      });
    };

    return FunctionProvider;

  })(AbstractProvider);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1hdXRvY29tcGxldGUtcGhwL2xpYi9hbm5vdGF0aW9uL3Byb3BlcnR5LXByb3ZpZGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQ0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHFCQUFSLENBQW5CLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUdNO0FBQ0YsdUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLCtCQUFBLEtBQUEsR0FBTyxpREFBUCxDQUFBOztBQUVBO0FBQUE7O09BRkE7O0FBQUEsK0JBS0EscUJBQUEsR0FBdUIsU0FBQyxNQUFELEVBQVMsR0FBVCxFQUFjLE9BQWQsRUFBdUIsS0FBdkIsR0FBQTtBQUNuQixVQUFBLG1DQUFBO0FBQUEsTUFBQSxZQUFBLEdBQWUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxnQkFBUixDQUF5QixNQUF6QixDQUFmLENBQUE7QUFBQSxNQUVBLFlBQUEsR0FBZSxLQUFNLENBQUEsQ0FBQSxDQUZyQixDQUFBO0FBQUEsTUFJQSxPQUFBLEdBQVUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxnQkFBUixDQUF5QixNQUF6QixFQUFpQyxZQUFqQyxFQUErQyxJQUEvQyxFQUFxRCxZQUFyRCxDQUpWLENBQUE7QUFNQSxNQUFBLElBQUcsQ0FBQSxPQUFBLElBQWUsQ0FBQSxPQUFXLENBQUMsUUFBOUI7QUFDSSxlQUFPLElBQVAsQ0FESjtPQU5BO0FBVUEsYUFBTztBQUFBLFFBQ0gsZUFBQSxFQUFrQixVQURmO0FBQUEsUUFFSCxXQUFBLEVBQWtCLDBCQUFBLEdBQTZCLE9BQU8sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBRjVFO0FBQUEsUUFHSCxTQUFBLEVBQWtCLE9BQU8sQ0FBQyxRQUh2QjtPQUFQLENBWG1CO0lBQUEsQ0FMdkIsQ0FBQTs7QUFzQkE7QUFBQTs7T0F0QkE7O0FBQUEsK0JBeUJBLGdCQUFBLEdBQWtCLFNBQUMsS0FBRCxFQUFRLE1BQVIsRUFBZ0IsY0FBaEIsR0FBQTthQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixjQUFjLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFFBQWhFLEVBQTBFO0FBQUEsUUFFdEUsY0FBQSxFQUFpQixJQUZxRDtPQUExRSxFQURjO0lBQUEsQ0F6QmxCLENBQUE7OzRCQUFBOztLQUQyQixpQkFML0IsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/atom-autocomplete-php/lib/annotation/property-provider.coffee
