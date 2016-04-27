(function() {
  var ContextVariableScalarView, View, helpers,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  helpers = require('../helpers');

  module.exports = ContextVariableScalarView = (function(_super) {
    __extends(ContextVariableScalarView, _super);

    function ContextVariableScalarView() {
      return ContextVariableScalarView.__super__.constructor.apply(this, arguments);
    }

    ContextVariableScalarView.content = function(params) {
      return ContextVariableScalarView.div(function() {
        ContextVariableScalarView.span({
          "class": 'variable php'
        }, params.label);
        return ContextVariableScalarView.span({
          "class": 'type php'
        }, params.value);
      });
    };

    return ContextVariableScalarView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGhwLWRlYnVnL2xpYi9jb250ZXh0L2NvbnRleHQtdmFyaWFibGUtc2NhbGFyLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBaUIsT0FBQSxDQUFRLFlBQVIsQ0FEakIsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixnREFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSx5QkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLE1BQUQsR0FBQTthQUNSLHlCQUFDLENBQUEsR0FBRCxDQUFLLFNBQUEsR0FBQTtBQUNILFFBQUEseUJBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxVQUFBLE9BQUEsRUFBTyxjQUFQO1NBQU4sRUFBNkIsTUFBTSxDQUFDLEtBQXBDLENBQUEsQ0FBQTtlQUNBLHlCQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsVUFBQSxPQUFBLEVBQU8sVUFBUDtTQUFOLEVBQXlCLE1BQU0sQ0FBQyxLQUFoQyxFQUZHO01BQUEsQ0FBTCxFQURRO0lBQUEsQ0FBVixDQUFBOztxQ0FBQTs7S0FEc0MsS0FIeEMsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/php-debug/lib/context/context-variable-scalar-view.coffee
