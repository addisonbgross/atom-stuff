(function() {
  var ContextVariableScalarView, ContextVariableView, View, helpers,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  ContextVariableScalarView = require("./context-variable-scalar-view");

  helpers = require('../helpers');

  module.exports = ContextVariableView = (function(_super) {
    __extends(ContextVariableView, _super);

    function ContextVariableView() {
      return ContextVariableView.__super__.constructor.apply(this, arguments);
    }

    ContextVariableView.content = function() {
      return ContextVariableView.li({
        "class": 'native-key-bindings'
      }, function() {
        return ContextVariableView.div({
          "class": 'native-key-bindings',
          tabindex: -1,
          outlet: 'variableView'
        });
      });
    };

    ContextVariableView.prototype.initialize = function(_arg) {
      this.variable = _arg.variable, this.parent = _arg.parent, this.openpaths = _arg.openpaths;
      return this.render();
    };

    ContextVariableView.prototype.renderScalar = function(_arg) {
      var label, value;
      label = _arg.label, value = _arg.value;
      return "<span class=\"variable php\">" + label + "</span><span class=\"type php\">" + value + "</span>";
    };

    ContextVariableView.prototype.render = function() {
      var ContextVariableListView, label, open, openChildren, properties, summary, _i, _len, _ref;
      ContextVariableListView = require("./context-variable-list-view");
      label = this.variable.label;
      openChildren = false;
      if (this.openpaths != null) {
        _ref = this.openpaths;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          open = _ref[_i];
          if (!!this.parent) {
            if (open.indexOf(this.parent + '.' + label) === 0) {
              openChildren = true;
              break;
            }
          } else {
            if (open.indexOf(label) === 0) {
              openChildren = true;
              break;
            }
          }
        }
      }
      switch (this.variable.type) {
        case 'string':
          return this.variableView.append(this.renderScalar({
            label: label,
            value: "\"" + helpers.escapeHtml(this.variable.value) + "\""
          }));
        case 'numeric':
          return this.variableView.append(this.renderScalar({
            label: label,
            value: this.variable.value
          }));
        case 'bool':
          return this.variableView.append(this.renderScalar({
            label: label,
            value: this.variable.value
          }));
        case 'uninitialized':
          return this.variableView.append(this.renderScalar({
            label: label,
            value: "?"
          }));
        case 'error':
          return this.variableView.append(this.renderScalar({
            label: label,
            value: helpers.escapeHtml(this.variable.value)
          }));
        case 'null':
          return this.variableView.append(this.renderScalar({
            label: label,
            value: "null"
          }));
        case 'array':
          summary = "array[" + this.variable.length + "]";
          return this.variableView.append(new ContextVariableListView({
            name: label,
            summary: summary,
            variables: this.variable.value,
            autoopen: openChildren,
            parent: this.parent,
            openpaths: this.openpaths
          }));
        case 'object':
          summary = "object";
          properties = this.variable.value;
          return this.variableView.append(new ContextVariableListView({
            name: label,
            summary: summary,
            variables: properties,
            autoopen: openChildren,
            parent: this.parent,
            openpaths: this.openpaths
          }));
        default:
          return console.error("Unhandled variable type: " + this.variable.type);
      }
    };

    return ContextVariableView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGhwLWRlYnVnL2xpYi9jb250ZXh0L2NvbnRleHQtdmFyaWFibGUtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNkRBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLE9BQVEsT0FBQSxDQUFRLHNCQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBQ0EseUJBQUEsR0FBNEIsT0FBQSxDQUFRLGdDQUFSLENBRDVCLENBQUE7O0FBQUEsRUFFQSxPQUFBLEdBQWlCLE9BQUEsQ0FBUSxZQUFSLENBRmpCLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osMENBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsbUJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsbUJBQUMsQ0FBQSxFQUFELENBQUk7QUFBQSxRQUFBLE9BQUEsRUFBTyxxQkFBUDtPQUFKLEVBQWtDLFNBQUEsR0FBQTtlQUNoQyxtQkFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFVBQUEsT0FBQSxFQUFPLHFCQUFQO0FBQUEsVUFBOEIsUUFBQSxFQUFVLENBQUEsQ0FBeEM7QUFBQSxVQUE0QyxNQUFBLEVBQVEsY0FBcEQ7U0FBTCxFQURnQztNQUFBLENBQWxDLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsa0NBSUEsVUFBQSxHQUFZLFNBQUMsSUFBRCxHQUFBO0FBQ1YsTUFEWSxJQUFDLENBQUEsZ0JBQUEsVUFBUyxJQUFDLENBQUEsY0FBQSxRQUFPLElBQUMsQ0FBQSxpQkFBQSxTQUMvQixDQUFBO2FBQUEsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQURVO0lBQUEsQ0FKWixDQUFBOztBQUFBLGtDQU9BLFlBQUEsR0FBYyxTQUFDLElBQUQsR0FBQTtBQUNaLFVBQUEsWUFBQTtB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

//# sourceURL=/home/champ/.atom/packages/php-debug/lib/context/context-variable-view.coffee
