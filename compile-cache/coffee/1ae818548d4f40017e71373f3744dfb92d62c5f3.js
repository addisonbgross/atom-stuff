(function() {
  var OpenDialogView, TextEditorView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), View = _ref.View, TextEditorView = _ref.TextEditorView;

  module.exports = OpenDialogView = (function(_super) {
    __extends(OpenDialogView, _super);

    function OpenDialogView() {
      return OpenDialogView.__super__.constructor.apply(this, arguments);
    }

    OpenDialogView.content = function() {
      return this.div({
        tabIndex: -1,
        "class": 'atom-debugger'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'block'
          }, function() {
            _this.label('Atom Debugger');
            return _this.subview('targetEditor', new TextEditorView({
              mini: true,
              placeholderText: 'Target Binary File Path'
            }));
          });
          _this.div({
            "class": 'checkbox'
          }, function() {
            _this.input({
              type: 'checkbox',
              checked: 'true',
              outlet: 'mainBreakCheckbox'
            });
            return _this.label({
              "class": 'checkbox-label'
            }, 'Add breakpoint in `main` function');
          });
          return _this.div({
            "class": 'block'
          }, function() {
            _this.button({
              "class": 'inline-block btn',
              outlet: 'startButton'
            }, 'Start');
            return _this.button({
              "class": 'inline-block btn',
              outlet: 'cancelButton'
            }, 'Cancel');
          });
        };
      })(this));
    };

    OpenDialogView.prototype.initialize = function(handler) {
      this.panel = atom.workspace.addModalPanel({
        item: this,
        visible: true
      });
      this.targetEditor.focus();
      this.cancelButton.on('click', (function(_this) {
        return function(e) {
          return _this.destroy();
        };
      })(this));
      return this.startButton.on('click', (function(_this) {
        return function(e) {
          handler(_this.targetEditor.getText(), _this.mainBreakCheckbox.prop('checked'));
          return _this.destroy();
        };
      })(this));
    };

    OpenDialogView.prototype.destroy = function() {
      return this.panel.destroy();
    };

    return OpenDialogView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1kZWJ1Z2dlci9saWIvb3Blbi1kaWFsb2ctdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMENBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQXlCLE9BQUEsQ0FBUSxzQkFBUixDQUF6QixFQUFDLFlBQUEsSUFBRCxFQUFPLHNCQUFBLGNBQVAsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixxQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxjQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLFFBQUEsRUFBVSxDQUFBLENBQVY7QUFBQSxRQUFjLE9BQUEsRUFBTyxlQUFyQjtPQUFMLEVBQTJDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDekMsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sT0FBUDtXQUFMLEVBQXFCLFNBQUEsR0FBQTtBQUNuQixZQUFBLEtBQUMsQ0FBQSxLQUFELENBQU8sZUFBUCxDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLE9BQUQsQ0FBUyxjQUFULEVBQTZCLElBQUEsY0FBQSxDQUFlO0FBQUEsY0FBQSxJQUFBLEVBQU0sSUFBTjtBQUFBLGNBQVksZUFBQSxFQUFpQix5QkFBN0I7YUFBZixDQUE3QixFQUZtQjtVQUFBLENBQXJCLENBQUEsQ0FBQTtBQUFBLFVBR0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLFVBQVA7V0FBTCxFQUF3QixTQUFBLEdBQUE7QUFDdEIsWUFBQSxLQUFDLENBQUEsS0FBRCxDQUFPO0FBQUEsY0FBQSxJQUFBLEVBQU0sVUFBTjtBQUFBLGNBQWtCLE9BQUEsRUFBUyxNQUEzQjtBQUFBLGNBQW1DLE1BQUEsRUFBUSxtQkFBM0M7YUFBUCxDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLEtBQUQsQ0FBTztBQUFBLGNBQUEsT0FBQSxFQUFPLGdCQUFQO2FBQVAsRUFBZ0MsbUNBQWhDLEVBRnNCO1VBQUEsQ0FBeEIsQ0FIQSxDQUFBO2lCQU1BLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxPQUFQO1dBQUwsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLFlBQUEsS0FBQyxDQUFBLE1BQUQsQ0FBUTtBQUFBLGNBQUEsT0FBQSxFQUFPLGtCQUFQO0FBQUEsY0FBMkIsTUFBQSxFQUFRLGFBQW5DO2FBQVIsRUFBMEQsT0FBMUQsQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxNQUFELENBQVE7QUFBQSxjQUFBLE9BQUEsRUFBTyxrQkFBUDtBQUFBLGNBQTJCLE1BQUEsRUFBUSxjQUFuQzthQUFSLEVBQTJELFFBQTNELEVBRm1CO1VBQUEsQ0FBckIsRUFQeUM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQyxFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLDZCQVlBLFVBQUEsR0FBWSxTQUFDLE9BQUQsR0FBQTtBQUNWLE1BQUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7QUFBQSxRQUFBLElBQUEsRUFBTSxJQUFOO0FBQUEsUUFBWSxPQUFBLEVBQVMsSUFBckI7T0FBN0IsQ0FBVCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsWUFBWSxDQUFDLEtBQWQsQ0FBQSxDQURBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxZQUFZLENBQUMsRUFBZCxDQUFpQixPQUFqQixFQUEwQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxDQUFELEdBQUE7aUJBQU8sS0FBQyxDQUFBLE9BQUQsQ0FBQSxFQUFQO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUIsQ0FIQSxDQUFBO2FBSUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxFQUFiLENBQWdCLE9BQWhCLEVBQXlCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLENBQUQsR0FBQTtBQUN2QixVQUFBLE9BQUEsQ0FBUSxLQUFDLENBQUEsWUFBWSxDQUFDLE9BQWQsQ0FBQSxDQUFSLEVBQWlDLEtBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxJQUFuQixDQUF3QixTQUF4QixDQUFqQyxDQUFBLENBQUE7aUJBQ0EsS0FBQyxDQUFBLE9BQUQsQ0FBQSxFQUZ1QjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpCLEVBTFU7SUFBQSxDQVpaLENBQUE7O0FBQUEsNkJBcUJBLE9BQUEsR0FBUyxTQUFBLEdBQUE7YUFDUCxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQVAsQ0FBQSxFQURPO0lBQUEsQ0FyQlQsQ0FBQTs7MEJBQUE7O0tBRDJCLEtBSDdCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/atom-debugger/lib/open-dialog-view.coffee
