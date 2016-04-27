(function() {
  var ContextVariableListView, ContextVariableView, View, helpers,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  ContextVariableView = require('./context-variable-view');

  helpers = require('../helpers');

  module.exports = ContextVariableListView = (function(_super) {
    __extends(ContextVariableListView, _super);

    function ContextVariableListView() {
      return ContextVariableListView.__super__.constructor.apply(this, arguments);
    }

    ContextVariableListView.content = function(params) {
      var dataname;
      dataname = params.name ? params.name : '';
      dataname = !!params.parent ? params.parent + '.' + dataname : dataname;
      return this.li({
        "class": "context-variable-list-view"
      }, (function(_this) {
        return function() {
          return _this.details({
            'data-name': dataname
          }, function() {
            _this.summary(function() {
              _this.span({
                "class": 'variable php'
              }, params.name);
              return _this.span({
                "class": 'type php'
              }, params.summary);
            });
            return _this.ul({
              outlet: "contextVariableList"
            });
          });
        };
      })(this));
    };

    ContextVariableListView.prototype.initialize = function(_arg) {
      this.variables = _arg.variables, this.autoopen = _arg.autoopen, this.parent = _arg.parent, this.name = _arg.name, this.openpaths = _arg.openpaths;
      return this.render();
    };

    ContextVariableListView.prototype.render = function() {
      var path, variable, _i, _len, _ref, _results;
      path = !!this.parent ? this.parent + '.' + this.name : this.name;
      if (this.autoopen) {
        this.find('details').attr("open", "open");
      }
      if (this.variables) {
        _ref = this.variables;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          variable = _ref[_i];
          _results.push(this.contextVariableList.append(new ContextVariableView({
            variable: variable,
            parent: path,
            openpaths: this.openpaths
          })));
        }
        return _results;
      }
    };

    return ContextVariableListView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGhwLWRlYnVnL2xpYi9jb250ZXh0L2NvbnRleHQtdmFyaWFibGUtbGlzdC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwyREFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFDQSxtQkFBQSxHQUFzQixPQUFBLENBQVEseUJBQVIsQ0FEdEIsQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBaUIsT0FBQSxDQUFRLFlBQVIsQ0FGakIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFSiw4Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSx1QkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLE1BQUQsR0FBQTtBQUNSLFVBQUEsUUFBQTtBQUFBLE1BQUEsUUFBQSxHQUFjLE1BQU0sQ0FBQyxJQUFWLEdBQW9CLE1BQU0sQ0FBQyxJQUEzQixHQUFxQyxFQUFoRCxDQUFBO0FBQUEsTUFDQSxRQUFBLEdBQWMsQ0FBQSxDQUFDLE1BQU8sQ0FBQyxNQUFaLEdBQXdCLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLEdBQWhCLEdBQXNCLFFBQTlDLEdBQTRELFFBRHZFLENBQUE7YUFFQSxJQUFDLENBQUEsRUFBRCxDQUFJO0FBQUEsUUFBQSxPQUFBLEVBQU8sNEJBQVA7T0FBSixFQUF5QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUN2QyxLQUFDLENBQUEsT0FBRCxDQUFTO0FBQUEsWUFBQSxXQUFBLEVBQWEsUUFBYjtXQUFULEVBQWdDLFNBQUEsR0FBQTtBQUM5QixZQUFBLEtBQUMsQ0FBQSxPQUFELENBQVMsU0FBQSxHQUFBO0FBQ1AsY0FBQSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsZ0JBQUEsT0FBQSxFQUFPLGNBQVA7ZUFBTixFQUE2QixNQUFNLENBQUMsSUFBcEMsQ0FBQSxDQUFBO3FCQUNBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxnQkFBQSxPQUFBLEVBQU8sVUFBUDtlQUFOLEVBQXlCLE1BQU0sQ0FBQyxPQUFoQyxFQUZPO1lBQUEsQ0FBVCxDQUFBLENBQUE7bUJBR0EsS0FBQyxDQUFBLEVBQUQsQ0FBSTtBQUFBLGNBQUEsTUFBQSxFQUFRLHFCQUFSO2FBQUosRUFKOEI7VUFBQSxDQUFoQyxFQUR1QztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpDLEVBSFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsc0NBVUEsVUFBQSxHQUFZLFNBQUMsSUFBRCxHQUFBO0FBQ1YsTUFEWSxJQUFDLENBQUEsaUJBQUEsV0FBVSxJQUFDLENBQUEsZ0JBQUEsVUFBUyxJQUFDLENBQUEsY0FBQSxRQUFPLElBQUMsQ0FBQSxZQUFBLE1BQUssSUFBQyxDQUFBLGlCQUFBLFNBQ2hELENBQUE7YUFBQSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBRFU7SUFBQSxDQVZaLENBQUE7O0FBQUEsc0NBYUEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLFVBQUEsd0NBQUE7QUFBQSxNQUFBLElBQUEsR0FBVSxDQUFBLENBQUMsSUFBRSxDQUFBLE1BQU4sR0FBa0IsSUFBQyxDQUFBLE1BQUQsR0FBVSxHQUFWLEdBQWdCLElBQUMsQ0FBQSxJQUFuQyxHQUE2QyxJQUFDLENBQUEsSUFBckQsQ0FBQTtBQUNBLE1BQUEsSUFBRyxJQUFDLENBQUEsUUFBSjtBQUNFLFFBQUEsSUFBQyxDQUFBLElBQUQsQ0FBTSxTQUFOLENBQWdCLENBQUMsSUFBakIsQ0FBc0IsTUFBdEIsRUFBOEIsTUFBOUIsQ0FBQSxDQURGO09BREE7QUFHQSxNQUFBLElBQUcsSUFBQyxDQUFBLFNBQUo7QUFDRTtBQUFBO2FBQUEsMkNBQUE7OEJBQUE7QUFDRSx3QkFBQSxJQUFDLENBQUEsbUJBQW1CLENBQUMsTUFBckIsQ0FBZ0MsSUFBQSxtQkFBQSxDQUFvQjtBQUFBLFlBQUMsUUFBQSxFQUFTLFFBQVY7QUFBQSxZQUFvQixNQUFBLEVBQVEsSUFBNUI7QUFBQSxZQUFpQyxTQUFBLEVBQVUsSUFBQyxDQUFBLFNBQTVDO1dBQXBCLENBQWhDLEVBQUEsQ0FERjtBQUFBO3dCQURGO09BSk07SUFBQSxDQWJSLENBQUE7O21DQUFBOztLQUZvQyxLQUx0QyxDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/php-debug/lib/context/context-variable-list-view.coffee
