(function() {
  var CompositeDisposable, ConfigPane, SettingsView, View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  CompositeDisposable = require('atom').CompositeDisposable;

  ConfigPane = require('./config-pane');

  module.exports = SettingsView = (function(_super) {
    __extends(SettingsView, _super);

    function SettingsView() {
      this.showPane = __bind(this.showPane, this);
      this.hidePanes = __bind(this.hidePanes, this);
      return SettingsView.__super__.constructor.apply(this, arguments);
    }

    SettingsView.content = function() {
      return this.div({
        "class": 'build-settings pane-item',
        tabindex: -1
      });
    };

    SettingsView.prototype.initialize = function(projectPath, filePath) {
      this.projectPath = projectPath;
      this.filePath = filePath;
    };

    SettingsView.prototype.getUri = function() {
      return this.filePath;
    };

    SettingsView.prototype.getTitle = function() {
      return 'Build Config: ' + this.projectPath;
    };

    SettingsView.prototype.getIconName = function() {
      return 'tools';
    };

    SettingsView.prototype.attached = function() {
      this.configPane = new ConfigPane(this.projectPath, this.filePath);
      this.model = this.configPane.model;
      this.configPane.setCallbacks(this.hidePanes, this.showPane);
      this.html('');
      return this.append(this.configPane);
    };

    SettingsView.prototype.detached = function() {
      this.html('');
      this.configPane.destroy();
      this.configPane = null;
      return this.model = null;
    };

    SettingsView.prototype.hidePanes = function() {
      this.html('');
      return this.append(this.configPane);
    };

    SettingsView.prototype.showPane = function(pane) {
      this.html('');
      return this.append(pane);
    };

    return SettingsView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3ZpZXcvc2V0dGluZ3Mtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbURBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUNDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFERCxDQUFBOztBQUFBLEVBRUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBRmIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFDSixtQ0FBQSxDQUFBOzs7Ozs7S0FBQTs7QUFBQSxJQUFBLFlBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLDBCQUFQO0FBQUEsUUFBbUMsUUFBQSxFQUFVLENBQUEsQ0FBN0M7T0FBTCxFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLDJCQUdBLFVBQUEsR0FBWSxTQUFFLFdBQUYsRUFBZ0IsUUFBaEIsR0FBQTtBQUEyQixNQUExQixJQUFDLENBQUEsY0FBQSxXQUF5QixDQUFBO0FBQUEsTUFBWixJQUFDLENBQUEsV0FBQSxRQUFXLENBQTNCO0lBQUEsQ0FIWixDQUFBOztBQUFBLDJCQUtBLE1BQUEsR0FBUSxTQUFBLEdBQUE7YUFDTixJQUFDLENBQUEsU0FESztJQUFBLENBTFIsQ0FBQTs7QUFBQSwyQkFRQSxRQUFBLEdBQVUsU0FBQSxHQUFBO2FBQ1IsZ0JBQUEsR0FBbUIsSUFBQyxDQUFBLFlBRFo7SUFBQSxDQVJWLENBQUE7O0FBQUEsMkJBV0EsV0FBQSxHQUFhLFNBQUEsR0FBQTthQUNYLFFBRFc7SUFBQSxDQVhiLENBQUE7O0FBQUEsMkJBY0EsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLFVBQUQsR0FBa0IsSUFBQSxVQUFBLENBQVcsSUFBQyxDQUFBLFdBQVosRUFBeUIsSUFBQyxDQUFBLFFBQTFCLENBQWxCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBLFVBQVUsQ0FBQyxLQURyQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsVUFBVSxDQUFDLFlBQVosQ0FBeUIsSUFBQyxDQUFBLFNBQTFCLEVBQXFDLElBQUMsQ0FBQSxRQUF0QyxDQUZBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxJQUFELENBQU0sRUFBTixDQUhBLENBQUE7YUFJQSxJQUFDLENBQUEsTUFBRCxDQUFRLElBQUMsQ0FBQSxVQUFULEVBTFE7SUFBQSxDQWRWLENBQUE7O0FBQUEsMkJBcUJBLFFBQUEsR0FBVSxTQUFBLEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxJQUFELENBQU0sRUFBTixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxVQUFVLENBQUMsT0FBWixDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUZkLENBQUE7YUFHQSxJQUFDLENBQUEsS0FBRCxHQUFTLEtBSkQ7SUFBQSxDQXJCVixDQUFBOztBQUFBLDJCQTJCQSxTQUFBLEdBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxJQUFDLENBQUEsSUFBRCxDQUFNLEVBQU4sQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBUSxJQUFDLENBQUEsVUFBVCxFQUZTO0lBQUEsQ0EzQlgsQ0FBQTs7QUFBQSwyQkErQkEsUUFBQSxHQUFVLFNBQUMsSUFBRCxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsSUFBRCxDQUFNLEVBQU4sQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBUSxJQUFSLEVBRlE7SUFBQSxDQS9CVixDQUFBOzt3QkFBQTs7S0FEeUIsS0FMN0IsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/view/settings-view.coffee
