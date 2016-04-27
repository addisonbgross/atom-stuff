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

    FunctionProvider.prototype.regex = /(\s*(?:public|protected|private)\s+function\s+)(\w+)\s*\(/g;


    /**
     * @inheritdoc
     */

    FunctionProvider.prototype.extractAnnotationInfo = function(editor, row, rowText, match) {
      var context, currentClass, extraData, lineNumberClass, propertyName, tooltipText;
      currentClass = this.parser.getFullClassName(editor);
      propertyName = match[2];
      context = this.parser.getMemberContext(editor, propertyName, null, currentClass);
      if (!context || (!context.override && !context.implementation)) {
        return null;
      }
      extraData = null;
      tooltipText = '';
      lineNumberClass = '';
      if (context.override) {
        extraData = context.override;
        lineNumberClass = 'override';
        tooltipText = 'Overrides method from ' + extraData.declaringClass.name;
      } else {
        extraData = context.implementation;
        lineNumberClass = 'implementation';
        tooltipText = 'Implements method for ' + extraData.declaringClass.name;
      }
      return {
        lineNumberClass: lineNumberClass,
        tooltipText: tooltipText,
        extraData: extraData
      };
    };


    /**
     * @inheritdoc
     */

    FunctionProvider.prototype.handleMouseClick = function(event, editor, annotationInfo) {
      return atom.workspace.open(annotationInfo.extraData.declaringStructure.filename, {
        initialLine: annotationInfo.extraData.startLine - 1,
        searchAllPanes: true
      });
    };


    /**
     * @inheritdoc
     */

    FunctionProvider.prototype.removePopover = function() {
      if (this.attachedPopover) {
        this.attachedPopover.dispose();
        return this.attachedPopover = null;
      }
    };

    return FunctionProvider;

  })(AbstractProvider);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1hdXRvY29tcGxldGUtcGhwL2xpYi9hbm5vdGF0aW9uL21ldGhvZC1wcm92aWRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0NBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxxQkFBUixDQUFuQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FHTTtBQUNGLHVDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSwrQkFBQSxLQUFBLEdBQU8sNERBQVAsQ0FBQTs7QUFFQTtBQUFBOztPQUZBOztBQUFBLCtCQUtBLHFCQUFBLEdBQXVCLFNBQUMsTUFBRCxFQUFTLEdBQVQsRUFBYyxPQUFkLEVBQXVCLEtBQXZCLEdBQUE7QUFDbkIsVUFBQSw0RUFBQTtBQUFBLE1BQUEsWUFBQSxHQUFlLElBQUMsQ0FBQSxNQUFNLENBQUMsZ0JBQVIsQ0FBeUIsTUFBekIsQ0FBZixDQUFBO0FBQUEsTUFFQSxZQUFBLEdBQWUsS0FBTSxDQUFBLENBQUEsQ0FGckIsQ0FBQTtBQUFBLE1BSUEsT0FBQSxHQUFVLElBQUMsQ0FBQSxNQUFNLENBQUMsZ0JBQVIsQ0FBeUIsTUFBekIsRUFBaUMsWUFBakMsRUFBK0MsSUFBL0MsRUFBcUQsWUFBckQsQ0FKVixDQUFBO0FBTUEsTUFBQSxJQUFHLENBQUEsT0FBQSxJQUFlLENBQUMsQ0FBQSxPQUFXLENBQUMsUUFBWixJQUF5QixDQUFBLE9BQVcsQ0FBQyxjQUF0QyxDQUFsQjtBQUNJLGVBQU8sSUFBUCxDQURKO09BTkE7QUFBQSxNQVNBLFNBQUEsR0FBWSxJQVRaLENBQUE7QUFBQSxNQVVBLFdBQUEsR0FBYyxFQVZkLENBQUE7QUFBQSxNQVdBLGVBQUEsR0FBa0IsRUFYbEIsQ0FBQTtBQWNBLE1BQUEsSUFBRyxPQUFPLENBQUMsUUFBWDtBQUNJLFFBQUEsU0FBQSxHQUFZLE9BQU8sQ0FBQyxRQUFwQixDQUFBO0FBQUEsUUFDQSxlQUFBLEdBQWtCLFVBRGxCLENBQUE7QUFBQSxRQUVBLFdBQUEsR0FBYyx3QkFBQSxHQUEyQixTQUFTLENBQUMsY0FBYyxDQUFDLElBRmxFLENBREo7T0FBQSxNQUFBO0FBTUksUUFBQSxTQUFBLEdBQVksT0FBTyxDQUFDLGNBQXBCLENBQUE7QUFBQSxRQUNBLGVBQUEsR0FBa0IsZ0JBRGxCLENBQUE7QUFBQSxRQUVBLFdBQUEsR0FBYyx3QkFBQSxHQUEyQixTQUFTLENBQUMsY0FBYyxDQUFDLElBRmxFLENBTko7T0FkQTtBQXdCQSxhQUFPO0FBQUEsUUFDSCxlQUFBLEVBQWtCLGVBRGY7QUFBQSxRQUVILFdBQUEsRUFBa0IsV0FGZjtBQUFBLFFBR0gsU0FBQSxFQUFrQixTQUhmO09BQVAsQ0F6Qm1CO0lBQUEsQ0FMdkIsQ0FBQTs7QUFvQ0E7QUFBQTs7T0FwQ0E7O0FBQUEsK0JBdUNBLGdCQUFBLEdBQWtCLFNBQUMsS0FBRCxFQUFRLE1BQVIsRUFBZ0IsY0FBaEIsR0FBQTthQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixjQUFjLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFFBQWhFLEVBQTBFO0FBQUEsUUFDdEUsV0FBQSxFQUFpQixjQUFjLENBQUMsU0FBUyxDQUFDLFNBQXpCLEdBQXFDLENBRGdCO0FBQUEsUUFFdEUsY0FBQSxFQUFpQixJQUZxRDtPQUExRSxFQURjO0lBQUEsQ0F2Q2xCLENBQUE7O0FBNkNBO0FBQUE7O09BN0NBOztBQUFBLCtCQWdEQSxhQUFBLEdBQWUsU0FBQSxHQUFBO0FBQ1gsTUFBQSxJQUFHLElBQUMsQ0FBQSxlQUFKO0FBQ0ksUUFBQSxJQUFDLENBQUEsZUFBZSxDQUFDLE9BQWpCLENBQUEsQ0FBQSxDQUFBO2VBQ0EsSUFBQyxDQUFBLGVBQUQsR0FBbUIsS0FGdkI7T0FEVztJQUFBLENBaERmLENBQUE7OzRCQUFBOztLQUQyQixpQkFML0IsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/atom-autocomplete-php/lib/annotation/method-provider.coffee
