(function() {
  var $, BreakpoinSettingsView, BreakpointSettingsConditionView, GlobalContext, TextEditorView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  TextEditorView = require('atom-space-pen-views').TextEditorView;

  BreakpointSettingsConditionView = require('./breakpoint-settings-condition-view');

  GlobalContext = require('../models/global-context');

  module.exports = BreakpoinSettingsView = (function(_super) {
    __extends(BreakpoinSettingsView, _super);

    function BreakpoinSettingsView() {
      return BreakpoinSettingsView.__super__.constructor.apply(this, arguments);
    }

    BreakpoinSettingsView.content = function() {
      return BreakpoinSettingsView.div({
        "class": 'breakpoint-settings-view'
      }, function() {
        BreakpoinSettingsView.span({
          click: 'close',
          "class": 'atom-pair-exit-view close-icon'
        });
        return BreakpoinSettingsView.div({
          "class": 'breakpoint-settings setting-conditions'
        }, function() {
          BreakpoinSettingsView.div({
            "class": 'breakpoint-settings-existing setting-conditions-existing'
          });
          return BreakpoinSettingsView.div({
            "class": 'breakpoint-setting setting-condition setting-new'
          }, function() {
            BreakpoinSettingsView.span({
              "class": 'setting-label'
            }, "Condition:");
            BreakpoinSettingsView.subview('newConditionField', new TextEditorView({
              mini: true,
              placeholderText: 'x == 1'
            }));
            return BreakpoinSettingsView.span({
              click: 'addCondition',
              "class": 'setting-add setting-condition-add'
            }, "Add condition");
          });
        });
      });
    };

    BreakpoinSettingsView.prototype.initialize = function(params) {
      this.GlobalContext = params.context;
      this.breakpoint = params.breakpoint;
      return this.render();
    };

    BreakpoinSettingsView.prototype.attach = function() {
      return this.panel = atom.workspace.addModalPanel({
        item: this.element
      });
    };

    BreakpoinSettingsView.prototype.addCondition = function() {
      var existing, fn, setting, view;
      setting = this.breakpoint.addSetting("condition", {
        value: this.newConditionField.getText()
      });
      existing = this.find('.breakpoint-settings-existing.setting-conditions-existing');
      view = new BreakpointSettingsConditionView(setting);
      fn = (function(setting, breakpoint, removeSetting) {
        this.breakpoint = breakpoint;
        this.removeSetting = removeSetting;
        return fn = (function(_this) {
          return function(e) {
            return _this.removeSetting(e, setting);
          };
        })(this);
      })(setting, this.breakpoint, this.removeSetting);
      view.find('.setting-remove').on('click', fn);
      existing.append(view);
      return this.newConditionField.setText("");
    };

    BreakpoinSettingsView.prototype.close = function() {
      var panelToDestroy;
      this.GlobalContext.removeBreakpoint(this.breakpoint);
      this.GlobalContext.addBreakpoint(this.breakpoint);
      panelToDestroy = this.panel;
      this.panel = null;
      return panelToDestroy != null ? panelToDestroy.destroy() : void 0;
    };

    BreakpoinSettingsView.prototype.removeSetting = function(e, setting) {
      $(e.target).parents('.breakpoint-setting').remove();
      return this.breakpoint.removeSetting(setting);
    };

    BreakpoinSettingsView.prototype.render = function() {
      var existing, fn, setting, settings, type, view, _ref1, _results;
      existing = this.find('.breakpoint-settings-existing.setting-conditions-existing');
      _ref1 = this.breakpoint.getSettings();
      _results = [];
      for (type in _ref1) {
        settings = _ref1[type];
        switch (type) {
          case "condition":
            _results.push((function() {
              var _i, _len, _results1;
              _results1 = [];
              for (_i = 0, _len = settings.length; _i < _len; _i++) {
                setting = settings[_i];
                view = new BreakpointSettingsConditionView(setting);
                fn = (function(setting, breakpoint, removeSetting) {
                  this.breakpoint = breakpoint;
                  this.removeSetting = removeSetting;
                  return fn = (function(_this) {
                    return function(e) {
                      return _this.removeSetting(e, setting);
                    };
                  })(this);
                })(setting, this.breakpoint, this.removeSetting);
                view.find('.setting-remove').on('click', fn);
                _results1.push(existing.append(view));
              }
              return _results1;
            }).call(this));
            break;
          default:
            _results.push(void 0);
        }
      }
      return _results;
    };

    return BreakpoinSettingsView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGhwLWRlYnVnL2xpYi9icmVha3BvaW50L2JyZWFrcG9pbnQtc2V0dGluZ3Mtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsb0dBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQVksT0FBQSxDQUFRLHNCQUFSLENBQVosRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBQUosQ0FBQTs7QUFBQSxFQUNDLGlCQUFrQixPQUFBLENBQVEsc0JBQVIsRUFBbEIsY0FERCxDQUFBOztBQUFBLEVBRUEsK0JBQUEsR0FBa0MsT0FBQSxDQUFRLHNDQUFSLENBRmxDLENBQUE7O0FBQUEsRUFHQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSwwQkFBUixDQUhoQixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDRDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLHFCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLHFCQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sMEJBQVA7T0FBTCxFQUF3QyxTQUFBLEdBQUE7QUFDdEMsUUFBQSxxQkFBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLFVBQUEsS0FBQSxFQUFPLE9BQVA7QUFBQSxVQUFnQixPQUFBLEVBQU8sZ0NBQXZCO1NBQU4sQ0FBQSxDQUFBO2VBQ0EscUJBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxVQUFBLE9BQUEsRUFBTyx3Q0FBUDtTQUFMLEVBQXNELFNBQUEsR0FBQTtBQUNwRCxVQUFBLHFCQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sMERBQVA7V0FBTCxDQUFBLENBQUE7aUJBQ0EscUJBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9B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

//# sourceURL=/home/champ/.atom/packages/php-debug/lib/breakpoint/breakpoint-settings-view.coffee
