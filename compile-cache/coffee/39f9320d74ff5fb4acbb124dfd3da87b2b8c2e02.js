(function() {
  var BreakpointSettingsConditionView, TextEditorView, View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  TextEditorView = require('atom-space-pen-views').TextEditorView;

  module.exports = BreakpointSettingsConditionView = (function(_super) {
    __extends(BreakpointSettingsConditionView, _super);

    function BreakpointSettingsConditionView() {
      this.submitSetting = __bind(this.submitSetting, this);
      return BreakpointSettingsConditionView.__super__.constructor.apply(this, arguments);
    }

    BreakpointSettingsConditionView.content = function(params) {
      return this.div({
        "class": 'breakpoint-setting setting-condition setting-existing'
      }, (function(_this) {
        return function() {
          _this.span({
            "class": 'setting-label'
          }, "Condition:");
          return _this.div({
            "class": 'setting-container'
          }, function() {
            _this.subview('conditionField', new TextEditorView({
              mini: true
            }));
            return _this.span({
              "class": 'setting-action setting-remove setting-condition-remove'
            }, "Remove");
          });
        };
      })(this));
    };

    BreakpointSettingsConditionView.prototype.initialize = function(setting) {
      this.setting = setting;
      this.conditionField.getModel().onDidInsertText(this.submitSetting);
      return this.render();
    };

    BreakpointSettingsConditionView.prototype.submitSetting = function(event) {
      var expression;
      expression = this.conditionField.getText();
      return this.setting.value = expression;
    };

    BreakpointSettingsConditionView.prototype.getSetting = function() {
      this.setting.value = this.conditionField.getText();
      return this.setting;
    };

    BreakpointSettingsConditionView.prototype.render = function() {
      return this.conditionField.setText(this.setting.value);
    };

    return BreakpointSettingsConditionView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGhwLWRlYnVnL2xpYi9icmVha3BvaW50L2JyZWFrcG9pbnQtc2V0dGluZ3MtY29uZGl0aW9uLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFEQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFDQyxpQkFBa0IsT0FBQSxDQUFRLHNCQUFSLEVBQWxCLGNBREQsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixzREFBQSxDQUFBOzs7OztLQUFBOztBQUFBLElBQUEsK0JBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxNQUFELEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sdURBQVA7T0FBTCxFQUFxRSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ25FLFVBQUEsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLFlBQUEsT0FBQSxFQUFPLGVBQVA7V0FBTixFQUE4QixZQUE5QixDQUFBLENBQUE7aUJBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLG1CQUFQO1dBQUwsRUFBaUMsU0FBQSxHQUFBO0FBQy9CLFlBQUEsS0FBQyxDQUFBLE9BQUQsQ0FBUyxnQkFBVCxFQUErQixJQUFBLGNBQUEsQ0FBZTtBQUFBLGNBQUEsSUFBQSxFQUFNLElBQU47YUFBZixDQUEvQixDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLGNBQUEsT0FBQSxFQUFNLHdEQUFOO2FBQU4sRUFBc0UsUUFBdEUsRUFGK0I7VUFBQSxDQUFqQyxFQUZtRTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJFLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsOENBT0EsVUFBQSxHQUFZLFNBQUUsT0FBRixHQUFBO0FBQ1YsTUFEVyxJQUFDLENBQUEsVUFBQSxPQUNaLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxjQUFjLENBQUMsUUFBaEIsQ0FBQSxDQUEwQixDQUFDLGVBQTNCLENBQTJDLElBQUMsQ0FBQSxhQUE1QyxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBRlU7SUFBQSxDQVBaLENBQUE7O0FBQUEsOENBV0EsYUFBQSxHQUFlLFNBQUMsS0FBRCxHQUFBO0FBQ2IsVUFBQSxVQUFBO0FBQUEsTUFBQSxVQUFBLEdBQWEsSUFBQyxDQUFBLGNBQWMsQ0FBQyxPQUFoQixDQUFBLENBQWIsQ0FBQTthQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBVCxHQUFpQixXQUZKO0lBQUEsQ0FYZixDQUFBOztBQUFBLDhDQWVBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixNQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBVCxHQUFpQixJQUFDLENBQUEsY0FBYyxDQUFDLE9BQWhCLENBQUEsQ0FBakIsQ0FBQTtBQUNBLGFBQU8sSUFBQyxDQUFBLE9BQVIsQ0FGVTtJQUFBLENBZlosQ0FBQTs7QUFBQSw4Q0FtQkEsTUFBQSxHQUFRLFNBQUEsR0FBQTthQUNOLElBQUMsQ0FBQSxjQUFjLENBQUMsT0FBaEIsQ0FBd0IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFqQyxFQURNO0lBQUEsQ0FuQlIsQ0FBQTs7MkNBQUE7O0tBRDRDLEtBSjlDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/php-debug/lib/breakpoint/breakpoint-settings-condition-view.coffee
