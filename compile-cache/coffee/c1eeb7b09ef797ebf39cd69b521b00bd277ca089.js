(function() {
  var ContextVariableListView, ContextView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  ContextVariableListView = require('./context-variable-list-view');

  module.exports = ContextView = (function(_super) {
    __extends(ContextView, _super);

    function ContextView() {
      return ContextView.__super__.constructor.apply(this, arguments);
    }

    ContextView.content = function() {
      return ContextView.div(function() {
        return ContextView.span({
          outlet: 'contextListView'
        });
      });
    };

    ContextView.prototype.initialize = function(context, autoopen) {
      this.context = context;
      this.autoopen = autoopen;
      return this.render();
    };

    ContextView.prototype.render = function() {
      var open, openChildren, _i, _len, _ref;
      if (this.context.context) {
        openChildren = false;
        if (this.autoopen != null) {
          _ref = this.autoopen;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            open = _ref[_i];
            if (open.indexOf(this.context.name) === 0) {
              openChildren = true;
              break;
            }
          }
        }
        return this.contextListView.append(new ContextVariableListView({
          name: this.context.name,
          summary: null,
          variables: this.context.context.variables,
          autoopen: openChildren,
          openpaths: this.autoopen,
          parent: null
        }));
      }
    };

    return ContextView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGhwLWRlYnVnL2xpYi9jb250ZXh0L2NvbnRleHQtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMENBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLE9BQVEsT0FBQSxDQUFRLHNCQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBQ0EsdUJBQUEsR0FBMEIsT0FBQSxDQUFRLDhCQUFSLENBRDFCLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUosa0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsV0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixXQUFDLENBQUEsR0FBRCxDQUFLLFNBQUEsR0FBQTtlQUNILFdBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxVQUFBLE1BQUEsRUFBUSxpQkFBUjtTQUFOLEVBREc7TUFBQSxDQUFMLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsMEJBSUEsVUFBQSxHQUFZLFNBQUUsT0FBRixFQUFXLFFBQVgsR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLFVBQUEsT0FDWixDQUFBO0FBQUEsTUFEb0IsSUFBQyxDQUFBLFdBQUEsUUFDckIsQ0FBQTthQUFBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFEVTtJQUFBLENBSlosQ0FBQTs7QUFBQSwwQkFPQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sVUFBQSxrQ0FBQTtBQUFBLE1BQUEsSUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLE9BQVo7QUFDRSxRQUFBLFlBQUEsR0FBZSxLQUFmLENBQUE7QUFDQSxRQUFBLElBQUcscUJBQUg7QUFDRTtBQUFBLGVBQUEsMkNBQUE7NEJBQUE7QUFDRSxZQUFBLElBQUksSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQXRCLENBQUEsS0FBK0IsQ0FBbkM7QUFDRSxjQUFBLFlBQUEsR0FBZSxJQUFmLENBQUE7QUFDQSxvQkFGRjthQURGO0FBQUEsV0FERjtTQURBO2VBT0EsSUFBQyxDQUFBLGVBQWUsQ0FBQyxNQUFqQixDQUE0QixJQUFBLHVCQUFBLENBQXlCO0FBQUEsVUFBQyxJQUFBLEVBQU0sSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFoQjtBQUFBLFVBQXNCLE9BQUEsRUFBUyxJQUEvQjtBQUFBLFVBQXFDLFNBQUEsRUFBVyxJQUFDLENBQUEsT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFqRTtBQUFBLFVBQTRFLFFBQUEsRUFBVSxZQUF0RjtBQUFBLFVBQW9HLFNBQUEsRUFBVSxJQUFDLENBQUEsUUFBL0c7QUFBQSxVQUF5SCxNQUFBLEVBQU8sSUFBaEk7U0FBekIsQ0FBNUIsRUFSRjtPQURNO0lBQUEsQ0FQUixDQUFBOzt1QkFBQTs7S0FGd0IsS0FKMUIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/php-debug/lib/context/context-view.coffee
