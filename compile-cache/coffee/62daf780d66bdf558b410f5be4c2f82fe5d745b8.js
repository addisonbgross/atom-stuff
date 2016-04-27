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


    /**
     * Retrieves a tooltip for the word given.
     * @param  {TextEditor} editor         TextEditor to search for namespace of term.
     * @param  {string}     term           Term to search for.
     * @param  {Point}      bufferPosition The cursor location the term is at.
     */

    PropertyProvider.prototype.getTooltipForWord = function(editor, term, bufferPosition) {
      var accessModifier, description, returnType, returnValue, value, _ref, _ref1, _ref2;
      value = this.parser.getMemberContext(editor, term, bufferPosition);
      if (!value) {
        return;
      }
      accessModifier = '';
      returnType = ((_ref = value.args["return"]) != null ? _ref.type : void 0) ? value.args["return"].type : 'mixed';
      if (value.isPublic) {
        accessModifier = 'public';
      } else if (value.isProtected) {
        accessModifier = 'protected';
      } else {
        accessModifier = 'private';
      }
      description = '';
      description += "<p><div>";
      description += accessModifier + ' ' + returnType + '<strong>' + ' $' + term + '</strong>';
      description += '</div></p>';
      description += '<div>';
      description += (value.args.descriptions.short ? value.args.descriptions.short : '(No documentation available)');
      description += '</div>';
      if (((_ref1 = value.args.descriptions.long) != null ? _ref1.length : void 0) > 0) {
        description += '<div class="section">';
        description += "<h4>Description</h4>";
        description += "<div>" + value.args.descriptions.long + "</div>";
        description += "</div>";
      }
      if ((_ref2 = value.args["return"]) != null ? _ref2.type : void 0) {
        returnValue = '<strong>' + value.args["return"].type + '</strong>';
        if (value.args["return"].description) {
          returnValue += ' ' + value.args["return"].description;
        }
        description += '<div class="section">';
        description += "<h4>Type</h4>";
        description += "<div>" + returnValue + "</div>";
        description += "</div>";
      }
      return description;
    };

    return PropertyProvider;

  })(AbstractProvider);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1hdXRvY29tcGxldGUtcGhwL2xpYi90b29sdGlwL3Byb3BlcnR5LXByb3ZpZGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4Q0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUVBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxxQkFBUixDQUZuQixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FFTTtBQUNGLHVDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSwrQkFBQSxtQkFBQSxHQUFxQixXQUFyQixDQUFBOztBQUVBO0FBQUE7Ozs7O09BRkE7O0FBQUEsK0JBUUEsaUJBQUEsR0FBbUIsU0FBQyxNQUFELEVBQVMsSUFBVCxFQUFlLGNBQWYsR0FBQTtBQUNmLFVBQUEsK0VBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsTUFBTSxDQUFDLGdCQUFSLENBQXlCLE1BQXpCLEVBQWlDLElBQWpDLEVBQXVDLGNBQXZDLENBQVIsQ0FBQTtBQUVBLE1BQUEsSUFBRyxDQUFBLEtBQUg7QUFDSSxjQUFBLENBREo7T0FGQTtBQUFBLE1BS0EsY0FBQSxHQUFpQixFQUxqQixDQUFBO0FBQUEsTUFNQSxVQUFBLGdEQUFpQyxDQUFFLGNBQXRCLEdBQWdDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBRCxDQUFPLENBQUMsSUFBbEQsR0FBNEQsT0FOekUsQ0FBQTtBQVFBLE1BQUEsSUFBRyxLQUFLLENBQUMsUUFBVDtBQUNJLFFBQUEsY0FBQSxHQUFpQixRQUFqQixDQURKO09BQUEsTUFHSyxJQUFHLEtBQUssQ0FBQyxXQUFUO0FBQ0QsUUFBQSxjQUFBLEdBQWlCLFdBQWpCLENBREM7T0FBQSxNQUFBO0FBSUQsUUFBQSxjQUFBLEdBQWlCLFNBQWpCLENBSkM7T0FYTDtBQUFBLE1Ba0JBLFdBQUEsR0FBYyxFQWxCZCxDQUFBO0FBQUEsTUFvQkEsV0FBQSxJQUFlLFVBcEJmLENBQUE7QUFBQSxNQXFCQSxXQUFBLElBQWUsY0FBQSxHQUFpQixHQUFqQixHQUF1QixVQUF2QixHQUFvQyxVQUFwQyxHQUFpRCxJQUFqRCxHQUF3RCxJQUF4RCxHQUErRCxXQXJCOUUsQ0FBQTtBQUFBLE1Bc0JBLFdBQUEsSUFBZSxZQXRCZixDQUFBO0FBQUEsTUF5QkEsV0FBQSxJQUFlLE9BekJmLENBQUE7QUFBQSxNQTBCQSxXQUFBLElBQW1CLENBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBM0IsR0FBc0MsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBOUQsR0FBeUUsOEJBQTFFLENBMUJuQixDQUFBO0FBQUEsTUEyQkEsV0FBQSxJQUFlLFFBM0JmLENBQUE7QUE4QkEsTUFBQSwyREFBK0IsQ0FBRSxnQkFBOUIsR0FBdUMsQ0FBMUM7QUFDSSxRQUFBLFdBQUEsSUFBZSx1QkFBZixDQUFBO0FBQUEsUUFDQSxXQUFBLElBQW1CLHNCQURuQixDQUFBO0FBQUEsUUFFQSxXQUFBLElBQW1CLE9BQUEsR0FBVSxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFsQyxHQUF5QyxRQUY1RCxDQUFBO0FBQUEsUUFHQSxXQUFBLElBQWUsUUFIZixDQURKO09BOUJBO0FBb0NBLE1BQUEsa0RBQW9CLENBQUUsYUFBdEI7QUFDSSxRQUFBLFdBQUEsR0FBYyxVQUFBLEdBQWEsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFELENBQU8sQ0FBQyxJQUEvQixHQUFzQyxXQUFwRCxDQUFBO0FBRUEsUUFBQSxJQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBRCxDQUFPLENBQUMsV0FBckI7QUFDSSxVQUFBLFdBQUEsSUFBZSxHQUFBLEdBQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFELENBQU8sQ0FBQyxXQUF2QyxDQURKO1NBRkE7QUFBQSxRQUtBLFdBQUEsSUFBZSx1QkFMZixDQUFBO0FBQUEsUUFNQSxXQUFBLElBQW1CLGVBTm5CLENBQUE7QUFBQSxRQU9BLFdBQUEsSUFBbUIsT0FBQSxHQUFVLFdBQVYsR0FBd0IsUUFQM0MsQ0FBQTtBQUFBLFFBUUEsV0FBQSxJQUFlLFFBUmYsQ0FESjtPQXBDQTtBQStDQSxhQUFPLFdBQVAsQ0FoRGU7SUFBQSxDQVJuQixDQUFBOzs0QkFBQTs7S0FEMkIsaUJBTi9CLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/atom-autocomplete-php/lib/tooltip/property-provider.coffee
