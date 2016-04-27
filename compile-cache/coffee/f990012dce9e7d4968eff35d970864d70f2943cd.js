(function() {
  var $, TabView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  module.exports = TabView = (function(_super) {
    __extends(TabView, _super);

    function TabView() {
      return TabView.__super__.constructor.apply(this, arguments);
    }

    TabView.content = function() {
      return this.div({
        "class": 'output'
      });
    };

    TabView.prototype.printLine = function(line) {
      this.append(line);
      if (!this.hasClass('hidden')) {
        this.parent().scrollTop(this[0].scrollHeight);
      }
      return this[0].children[this[0].children.length - 1];
    };

    TabView.prototype.scroll = function() {
      if (!this.hasClass('hidden')) {
        return this.parent().scrollTop(this[0].scrollHeight);
      }
    };

    TabView.prototype.clear = function() {
      return this.empty();
    };

    TabView.prototype.finishConsole = function(opener) {
      this.find('.filelink').off('click');
      return this.find('.filelink').on('click', function() {
        var e, linecol, lineno;
        e = $(this);
        lineno = parseInt(e.attr('row'));
        linecol = parseInt(e.attr('col'));
        if (e.attr('name') !== '') {
          if (opener != null) {
            return opener(e);
          }
          return atom.workspace.open(e.attr('name'), {
            initialLine: lineno - 1,
            initialColumn: linecol - 1
          });
        }
      });
    };

    return TabView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL2NvbnNvbGUvdGFiLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFZLE9BQUEsQ0FBUSxzQkFBUixDQUFaLEVBQUMsU0FBQSxDQUFELEVBQUksWUFBQSxJQUFKLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBQ0osOEJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsT0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sUUFBUDtPQUFMLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsc0JBR0EsU0FBQSxHQUFXLFNBQUMsSUFBRCxHQUFBO0FBQ1QsTUFBQSxJQUFDLENBQUEsTUFBRCxDQUFRLElBQVIsQ0FBQSxDQUFBO0FBQ0EsTUFBQSxJQUFBLENBQUEsSUFBK0MsQ0FBQSxRQUFELENBQVUsUUFBVixDQUE5QztBQUFBLFFBQUEsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFTLENBQUMsU0FBVixDQUFvQixJQUFFLENBQUEsQ0FBQSxDQUFFLENBQUMsWUFBekIsQ0FBQSxDQUFBO09BREE7QUFFQSxhQUFPLElBQUUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxRQUFTLENBQUEsSUFBRSxDQUFBLENBQUEsQ0FBRSxDQUFDLFFBQVEsQ0FBQyxNQUFkLEdBQXVCLENBQXZCLENBQXJCLENBSFM7SUFBQSxDQUhYLENBQUE7O0FBQUEsc0JBUUEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLE1BQUEsSUFBQSxDQUFBLElBQStDLENBQUEsUUFBRCxDQUFVLFFBQVYsQ0FBOUM7ZUFBQSxJQUFDLENBQUEsTUFBRCxDQUFBLENBQVMsQ0FBQyxTQUFWLENBQW9CLElBQUUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxZQUF6QixFQUFBO09BRE07SUFBQSxDQVJSLENBQUE7O0FBQUEsc0JBV0EsS0FBQSxHQUFPLFNBQUEsR0FBQTthQUNMLElBQUMsQ0FBQSxLQUFELENBQUEsRUFESztJQUFBLENBWFAsQ0FBQTs7QUFBQSxzQkFjQSxhQUFBLEdBQWUsU0FBQyxNQUFELEdBQUE7QUFDYixNQUFBLElBQUMsQ0FBQSxJQUFELENBQU0sV0FBTixDQUFrQixDQUFDLEdBQW5CLENBQXVCLE9BQXZCLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxJQUFELENBQU0sV0FBTixDQUFrQixDQUFDLEVBQW5CLENBQXNCLE9BQXRCLEVBQStCLFNBQUEsR0FBQTtBQUM3QixZQUFBLGtCQUFBO0FBQUEsUUFBQSxDQUFBLEdBQUksQ0FBQSxDQUFFLElBQUYsQ0FBSixDQUFBO0FBQUEsUUFDQSxNQUFBLEdBQVMsUUFBQSxDQUFTLENBQUMsQ0FBQyxJQUFGLENBQU8sS0FBUCxDQUFULENBRFQsQ0FBQTtBQUFBLFFBRUEsT0FBQSxHQUFVLFFBQUEsQ0FBUyxDQUFDLENBQUMsSUFBRixDQUFPLEtBQVAsQ0FBVCxDQUZWLENBQUE7QUFHQSxRQUFBLElBQUcsQ0FBQyxDQUFDLElBQUYsQ0FBTyxNQUFQLENBQUEsS0FBb0IsRUFBdkI7QUFDRSxVQUFBLElBQW9CLGNBQXBCO0FBQUEsbUJBQU8sTUFBQSxDQUFPLENBQVAsQ0FBUCxDQUFBO1dBQUE7aUJBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLENBQUMsQ0FBQyxJQUFGLENBQU8sTUFBUCxDQUFwQixFQUNFO0FBQUEsWUFBQSxXQUFBLEVBQWEsTUFBQSxHQUFTLENBQXRCO0FBQUEsWUFDQSxhQUFBLEVBQWUsT0FBQSxHQUFVLENBRHpCO1dBREYsRUFGRjtTQUo2QjtNQUFBLENBQS9CLEVBRmE7SUFBQSxDQWRmLENBQUE7O21CQUFBOztLQURvQixLQUh4QixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/console/tab-view.coffee
