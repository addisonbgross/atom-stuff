(function() {
  var LogView, ScrollView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ScrollView = require('atom-space-pen-views').ScrollView;

  module.exports = LogView = (function(_super) {
    __extends(LogView, _super);

    function LogView() {
      return LogView.__super__.constructor.apply(this, arguments);
    }

    LogView.content = function() {
      return this.div({
        "class": "log-view"
      }, (function(_this) {
        return function() {
          _this.button("Close", {
            click: 'close'
          });
          return _this.div({
            "class": "detail",
            overflow: "auto",
            outlet: "container"
          });
        };
      })(this));
    };

    LogView.prototype.initialize = function() {
      return LogView.__super__.initialize.apply(this, arguments);
    };

    LogView.prototype.open = function() {
      if (!this.hasParent()) {
        return atom.workspace.addBottomPanel({
          item: this
        });
      }
    };

    LogView.prototype.close = function() {
      return this.detach();
    };

    LogView.prototype.toggle = function() {
      if (this.hasParent()) {
        return this.close();
      } else {
        return this.open();
      }
    };

    LogView.prototype.addLine = function(line) {
      this.container.append("<p>" + line + "</p>");
      return this.container.scrollTop(99999);
    };

    return LogView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYW5kcm9pZC9saWIvbG9nLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxzQkFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiw4QkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxPQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxVQUFQO09BQUwsRUFBd0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUN0QixVQUFBLEtBQUMsQ0FBQSxNQUFELENBQVEsT0FBUixFQUFpQjtBQUFBLFlBQUEsS0FBQSxFQUFPLE9BQVA7V0FBakIsQ0FBQSxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxRQUFQO0FBQUEsWUFBaUIsUUFBQSxFQUFVLE1BQTNCO0FBQUEsWUFBbUMsTUFBQSxFQUFRLFdBQTNDO1dBQUwsRUFGc0I7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QixFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLHNCQUtBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFDVix5Q0FBQSxTQUFBLEVBRFU7SUFBQSxDQUxaLENBQUE7O0FBQUEsc0JBUUEsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLE1BQUEsSUFBQSxDQUFBLElBQWtELENBQUEsU0FBRCxDQUFBLENBQWpEO2VBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFmLENBQThCO0FBQUEsVUFBQSxJQUFBLEVBQU0sSUFBTjtTQUE5QixFQUFBO09BREk7SUFBQSxDQVJOLENBQUE7O0FBQUEsc0JBV0EsS0FBQSxHQUFPLFNBQUEsR0FBQTthQUNMLElBQUMsQ0FBQSxNQUFELENBQUEsRUFESztJQUFBLENBWFAsQ0FBQTs7QUFBQSxzQkFjQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sTUFBQSxJQUFHLElBQUMsQ0FBQSxTQUFELENBQUEsQ0FBSDtlQUNFLElBQUMsQ0FBQSxLQUFELENBQUEsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsSUFBRCxDQUFBLEVBSEY7T0FETTtJQUFBLENBZFIsQ0FBQTs7QUFBQSxzQkFvQkEsT0FBQSxHQUFTLFNBQUMsSUFBRCxHQUFBO0FBQ1AsTUFBQSxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBbUIsS0FBQSxHQUFLLElBQUwsR0FBVSxNQUE3QixDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsQ0FBcUIsS0FBckIsRUFGTztJQUFBLENBcEJULENBQUE7O21CQUFBOztLQURvQixXQUh0QixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/android/lib/log-view.coffee
