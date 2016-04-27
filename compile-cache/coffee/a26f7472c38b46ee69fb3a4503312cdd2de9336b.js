(function() {
  var TabItem, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  module.exports = TabItem = (function(_super) {
    __extends(TabItem, _super);

    function TabItem() {
      return TabItem.__super__.constructor.apply(this, arguments);
    }

    TabItem.content = function() {
      return this.li({
        "class": 'command-item'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'clicker'
          }, function() {
            _this.div({
              "class": 'icon',
              outlet: 'icon'
            });
            return _this.div({
              "class": 'name',
              outlet: 'name'
            });
          });
          return _this.div({
            "class": 'close icon icon-x'
          });
        };
      })(this));
    };

    TabItem.prototype.initialize = function(project, name, close) {
      this.attr('project', project);
      this.attr('name', name);
      return this.find('.close').on('click', close);
    };

    TabItem.prototype.setHeader = function(text) {
      return this.name.text(text);
    };

    TabItem.prototype.setIcon = function(icon) {
      return this.icon[0].className = "icon icon-" + icon;
    };

    return TabItem;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL2NvbnNvbGUvdGFiLWl0ZW0uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGFBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLE9BQVEsT0FBQSxDQUFRLHNCQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUNKLDhCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLE9BQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEVBQUQsQ0FBSTtBQUFBLFFBQUEsT0FBQSxFQUFPLGNBQVA7T0FBSixFQUEyQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3pCLFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLFNBQVA7V0FBTCxFQUF1QixTQUFBLEdBQUE7QUFDckIsWUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sTUFBUDtBQUFBLGNBQWUsTUFBQSxFQUFRLE1BQXZCO2FBQUwsQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxNQUFQO0FBQUEsY0FBZSxNQUFBLEVBQVEsTUFBdkI7YUFBTCxFQUZxQjtVQUFBLENBQXZCLENBQUEsQ0FBQTtpQkFHQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sbUJBQVA7V0FBTCxFQUp5QjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNCLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsc0JBT0EsVUFBQSxHQUFZLFNBQUMsT0FBRCxFQUFVLElBQVYsRUFBZ0IsS0FBaEIsR0FBQTtBQUNWLE1BQUEsSUFBQyxDQUFBLElBQUQsQ0FBTSxTQUFOLEVBQWlCLE9BQWpCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLElBQUQsQ0FBTSxNQUFOLEVBQWMsSUFBZCxDQURBLENBQUE7YUFFQSxJQUFDLENBQUEsSUFBRCxDQUFNLFFBQU4sQ0FBZSxDQUFDLEVBQWhCLENBQW1CLE9BQW5CLEVBQTRCLEtBQTVCLEVBSFU7SUFBQSxDQVBaLENBQUE7O0FBQUEsc0JBWUEsU0FBQSxHQUFXLFNBQUMsSUFBRCxHQUFBO2FBQ1QsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQVcsSUFBWCxFQURTO0lBQUEsQ0FaWCxDQUFBOztBQUFBLHNCQWVBLE9BQUEsR0FBUyxTQUFDLElBQUQsR0FBQTthQUNQLElBQUMsQ0FBQSxJQUFLLENBQUEsQ0FBQSxDQUFFLENBQUMsU0FBVCxHQUFzQixZQUFBLEdBQVksS0FEM0I7SUFBQSxDQWZULENBQUE7O21CQUFBOztLQURvQixLQUh4QixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/console/tab-item.coffee
