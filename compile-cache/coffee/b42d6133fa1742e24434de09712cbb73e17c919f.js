(function() {
  var Function, Keyword,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Keyword = require('./keyword');

  module.exports = Function = (function(_super) {
    __extends(Function, _super);

    function Function(name, category, description, parameters, returnValue) {
      this.name = name;
      this.category = category;
      this.description = description;
      this.parameters = parameters;
      this.returnValue = returnValue;
      Function.__super__.constructor.call(this, this.name, this.category);
    }

    Function.prototype.getSimpleSignature = function() {
      return "(" + this.returnValue + ") (" + (this.getSimpleParameters()) + ")";
    };

    Function.prototype.getMediumSignature = function() {
      return "" + this.returnValue + " " + this.name + "(" + (this.getSimpleParameters()) + ")";
    };

    Function.prototype.getFullSignature = function() {
      return "" + this.returnValue + " " + this.name + "(" + (this.getFullParameters()) + ")";
    };

    Function.prototype.getSnippet = function() {
      return "" + this.name + (this.getSnippetParameters());
    };

    Function.prototype.getSnippetParameters = function() {
      var counter, parameter, toReturn, _i, _len, _ref;
      if (this.parameters === void 0) {
        return "()";
      } else if (!(this.parameters instanceof Array)) {
        return "(${1:" + this.parameters.name + "})";
      } else {
        toReturn = "(";
        counter = 0;
        _ref = this.parameters;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          parameter = _ref[_i];
          toReturn += "${" + (++counter) + ":" + parameter.name + "}";
          if (counter === this.parameters.length) {
            toReturn += ")";
          } else {
            toReturn += ", ";
          }
        }
        return toReturn;
      }
    };

    Function.prototype.getSimpleParameters = function() {
      var index, parameter, params, _i, _len, _ref;
      if (!(this.parameters instanceof Array)) {
        return this.parameters.name.split(" ")[0];
      } else {
        params = "";
        _ref = this.parameters;
        for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
          parameter = _ref[index];
          if (index === 0) {
            params += "" + (parameter.name.split(" ")[0]);
          } else if (index < this.parameters.length) {
            params += ", " + (parameter.name.split(" ")[0]);
          }
        }
        return params;
      }
    };

    Function.prototype.getFullParameters = function() {
      var index, parameter, params, _i, _len, _ref;
      if (!(this.parameters instanceof Array)) {
        return this.parameters.name;
      } else {
        params = "";
        _ref = this.parameters;
        for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
          parameter = _ref[index];
          if (index === 0) {
            params += "" + parameter.name;
          } else if (index < this.parameters.length) {
            params += ", " + parameter.name;
          }
        }
        return params;
      }
    };

    return Function;

  })(Keyword);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWdsc2wvbGliL2Z1bmN0aW9uLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBQVYsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFDSiwrQkFBQSxDQUFBOztBQUFhLElBQUEsa0JBQUUsSUFBRixFQUFTLFFBQVQsRUFBb0IsV0FBcEIsRUFBa0MsVUFBbEMsRUFBK0MsV0FBL0MsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLE9BQUEsSUFDYixDQUFBO0FBQUEsTUFEbUIsSUFBQyxDQUFBLFdBQUEsUUFDcEIsQ0FBQTtBQUFBLE1BRDhCLElBQUMsQ0FBQSxjQUFBLFdBQy9CLENBQUE7QUFBQSxNQUQ0QyxJQUFDLENBQUEsYUFBQSxVQUM3QyxDQUFBO0FBQUEsTUFEeUQsSUFBQyxDQUFBLGNBQUEsV0FDMUQsQ0FBQTtBQUFBLE1BQUEsMENBQU0sSUFBQyxDQUFBLElBQVAsRUFBYSxJQUFDLENBQUEsUUFBZCxDQUFBLENBRFc7SUFBQSxDQUFiOztBQUFBLHVCQUlBLGtCQUFBLEdBQW9CLFNBQUEsR0FBQTthQUNqQixHQUFBLEdBQUcsSUFBQyxDQUFBLFdBQUosR0FBZ0IsS0FBaEIsR0FBb0IsQ0FBQyxJQUFDLENBQUEsbUJBQUQsQ0FBQSxDQUFELENBQXBCLEdBQTRDLElBRDNCO0lBQUEsQ0FKcEIsQ0FBQTs7QUFBQSx1QkFPQSxrQkFBQSxHQUFvQixTQUFBLEdBQUE7YUFDbEIsRUFBQSxHQUFHLElBQUMsQ0FBQSxXQUFKLEdBQWdCLEdBQWhCLEdBQW1CLElBQUMsQ0FBQSxJQUFwQixHQUF5QixHQUF6QixHQUEyQixDQUFDLElBQUMs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

//# sourceURL=/home/champ/.atom/packages/autocomplete-glsl/lib/function.coffee
