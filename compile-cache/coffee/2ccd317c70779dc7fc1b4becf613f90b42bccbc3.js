(function() {
  var AbstractProvider, FunctionProvider, Point, TextEditor,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Point = require('atom').Point;

  TextEditor = require('atom').TextEditor;

  AbstractProvider = require('./abstract-provider');

  module.exports = FunctionProvider = (function(_super) {
    __extends(FunctionProvider, _super);

    function FunctionProvider() {
      return FunctionProvider.__super__.constructor.apply(this, arguments);
    }

    FunctionProvider.prototype.hoverEventSelectors = '.function-call';


    /**
     * Retrieves a tooltip for the word given.
     * @param  {TextEditor} editor         TextEditor to search for namespace of term.
     * @param  {string}     term           Term to search for.
     * @param  {Point}      bufferPosition The cursor location the term is at.
     */

    FunctionProvider.prototype.getTooltipForWord = function(editor, term, bufferPosition) {
      var accessModifier, description, exceptionType, info, param, parametersDescription, returnType, returnValue, thrownWhenDescription, throwsDescription, value, _ref, _ref1, _ref2, _ref3, _ref4;
      value = this.parser.getMemberContext(editor, term, bufferPosition);
      if (!value) {
        return;
      }
      description = "";
      accessModifier = '';
      returnType = '';
      if ((_ref = value.args["return"]) != null ? _ref.type : void 0) {
        returnType = value.args["return"].type;
      }
      if (value.isPublic) {
        accessModifier = 'public';
      } else if (value.isProtected) {
        accessModifier = 'protected';
      } else {
        accessModifier = 'private';
      }
      description += "<p><div>";
      description += accessModifier + ' ' + returnType + ' <strong>' + term + '</strong>' + '(';
      if (value.args.parameters.length > 0) {
        description += value.args.parameters.join(', ');
      }
      if (value.args.optionals.length > 0) {
        description += '[';
        if (value.args.parameters.length > 0) {
          description += ', ';
        }
        description += value.args.optionals.join(', ');
        description += ']';
      }
      description += ')';
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
      parametersDescription = "";
      _ref2 = value.args.docParameters;
      for (param in _ref2) {
        info = _ref2[param];
        parametersDescription += "<tr>";
        parametersDescription += "<td>•&nbsp;<strong>";
        if (__indexOf.call(value.args.optionals, param) >= 0) {
          parametersDescription += "[" + param + "]";
        } else {
          parametersDescription += param;
        }
        parametersDescription += "</strong></td>";
        parametersDescription += "<td>" + (info.type ? info.type : '&nbsp;') + '</td>';
        parametersDescription += "<td>" + (info.description ? info.description : '&nbsp;') + '</td>';
        parametersDescription += "</tr>";
      }
      if (parametersDescription.length > 0) {
        description += '<div class="section">';
        description += "<h4>Parameters</h4>";
        description += "<div><table>" + parametersDescription + "</table></div>";
        description += "</div>";
      }
      if ((_ref3 = value.args["return"]) != null ? _ref3.type : void 0) {
        returnValue = '<strong>' + value.args["return"].type + '</strong>';
        if (value.args["return"].description) {
          returnValue += ' ' + value.args["return"].description;
        }
        description += '<div class="section">';
        description += "<h4>Returns</h4>";
        description += "<div>" + returnValue + "</div>";
        description += "</div>";
      }
      throwsDescription = "";
      _ref4 = value.args.throws;
      for (exceptionType in _ref4) {
        thrownWhenDescription = _ref4[exceptionType];
        throwsDescription += "<div>";
        throwsDescription += "• <strong>" + exceptionType + "</strong>";
        if (thrownWhenDescription) {
          throwsDescription += ' ' + thrownWhenDescription;
        }
        throwsDescription += "</div>";
      }
      if (throwsDescription.length > 0) {
        description += '<div class="section">';
        description += "<h4>Throws</h4>";
        description += "<div>" + throwsDescription + "</div>";
        description += "</div>";
      }
      return description;
    };

    return FunctionProvider;

  })(AbstractProvider);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1hdXRvY29tcGxldGUtcGhwL2xpYi90b29sdGlwL2Z1bmN0aW9uLXByb3ZpZGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxREFBQTtJQUFBOzt5SkFBQTs7QUFBQSxFQUFDLFFBQVMsT0FBQSxDQUFRLE1BQVIsRUFBVCxLQUFELENBQUE7O0FBQUEsRUFDQyxhQUFjLE9BQUEsQ0FBUSxNQUFSLEVBQWQsVUFERCxDQUFBOztBQUFBLEVBR0EsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHFCQUFSLENBSG5CLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUVNO0FBQ0YsdUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLCtCQUFBLG1CQUFBLEdBQXFCLGdCQUFyQixDQUFBOztBQUVBO0FBQUE7Ozs7O09BRkE7O0FBQUEsK0JBUUEsaUJBQUEsR0FBbUIsU0FBQyxNQUFELEVBQVMsSUFBVCxFQUFlLGNBQWYsR0FBQTtBQUNmLFVBQUEsMExBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsTUFBTSxDQUFDLGdCQUFSLENBQXlCLE1BQXpCLEVBQWlDLElBQWpDLEVBQXVDLGNBQXZDLENBQVIsQ0FBQTtBQUVBLE1BQUEsSUFBRyxDQUFBLEtBQUg7QUFDSSxjQUFBLENBREo7T0FGQTtBQUFBLE1BS0EsV0FBQSxHQUFjLEVBTGQsQ0FBQTtBQUFBLE1BUUEsY0FBQSxHQUFpQixFQVJqQixDQUFBO0FBQUEsTUFTQSxVQUFBLEdBQWEsRUFUYixDQUFBO0FBV0EsTUFBQSxnREFBb0IsQ0FBRSxhQUF0QjtBQUNJLFFBQUEsVUFBQSxHQUFhLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBRCxDQUFPLENBQUMsSUFBL0IsQ0FESjtPQVhBO0FBY0EsTUFBQSxJQUFHLEtB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

//# sourceURL=/home/champ/.atom/packages/atom-autocomplete-php/lib/tooltip/function-provider.coffee
