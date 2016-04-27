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

    TabView.prototype.initialize = function() {
      return this.lockoutput = false;
    };

    TabView.prototype.printLine = function(line) {
      if (this.lockoutput) {
        return null;
      }
      this.append(line);
      if (!this.hasClass('hidden')) {
        this.parent().scrollTop(this[0].scrollHeight);
      }
      return this[0].children[this[0].children.length - 1];
    };

    TabView.prototype.lock = function() {
      return this.lockoutput = true;
    };

    TabView.prototype.unlock = function() {
      return this.lockoutput = false;
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL2NvbnNvbGUvdGFiLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFZLE9BQUEsQ0FBUSxzQkFBUixDQUFaLEVBQUMsU0FBQSxDQUFELEVBQUksWUFBQSxJQUFKLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBQ0osOEJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsT0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sUUFBUDtPQUFMLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsc0JBR0EsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxVQUFELEdBQWMsTUFESjtJQUFBLENBSFosQ0FBQTs7QUFBQSxzQkFNQSxTQUFBLEdBQVcsU0FBQyxJQUFELEdBQUE7QUFDVCxNQUFBLElBQWUsSUFBQyxDQUFBLFVBQWhCO0FBQUEsZUFBTyxJQUFQLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBUSxJQUFSLENBREEsQ0FBQTtBQUVBLE1BQUEsSUFBQSxDQUFBLElBQStDLENBQUEsUUFBRCxDQUFVLFFBQVYsQ0FBOUM7QUFBQSxRQUFBLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBUyxDQUFDLFNBQVYsQ0FBb0IsSUFBRSxDQUFBLENBQUEsQ0FBRSxDQUFDLFlBQXpCLENBQUEsQ0FBQTtPQUZBO0FBR0EsYUFBTyxJQUFFLENBQUEsQ0FBQSxDQUFFLENBQUMsUUFBUyxDQUFBLElBQUUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxRQUFRLENBQUMsTUFBZCxHQUF1QixDQUF2QixDQUFyQixDQUpTO0lBQUEsQ0FOWCxDQUFBOztBQUFBLHNCQVlBLElBQUEsR0FBTSxTQUFBLEdBQUE7YUFDSixJQUFDLENBQUEsVUFBRCxHQUFjLEtBRFY7SUFBQSxDQVpOLENBQUE7O0FBQUEsc0JBZUEsTUFBQSxHQUFRLFNBQUEsR0FBQTthQUNOLElBQUMsQ0FBQSxVQUFELEdBQWMsTUFEUjtJQUFBLENBZlIsQ0FBQTs7QUFBQSxzQkFrQkEsS0FBQSxHQUFPLFNBQUEsR0FBQTthQUNMLElBQUMsQ0FBQSxLQUFELENBQUEsRUFESztJQUFBLENBbEJQLENBQUE7O0FBQUEsc0JBcUJBLGFBQUEsR0FBZSxTQUFDLE1BQUQsR0FBQTtBQUNiLE1BQUEsSUFBQyxDQUFBLElBQUQsQ0FBTSxXQUFOLENBQWtCLENBQUMsR0FBbkIsQ0FBdUIsT0FBdkIsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLElBQUQsQ0FBTSxXQUFOLENBQWtCLENBQUMsRUFBbkIsQ0FBc0IsT0FBdEIsRUFBK0IsU0FBQSxHQUFBO0FBQzdCLFlBQUEsa0JBQUE7QUFBQSxRQUFBLENBQUEsR0FBSSxDQUFBLENBQUUsSUFBRixDQUFKLENBQUE7QUFBQSxRQUNBLE1BQUEsR0FBUyxRQUFBLENBQVMsQ0FBQyxDQUFDLElBQUYsQ0FBTyxLQUFQLENBQVQsQ0FEVCxDQUFBO0FBQUEsUUFFQSxPQUFBLEdBQVUsUUFBQSxDQUFTLENBQUMsQ0FBQyxJQUFGLENBQU8sS0FBUCxDQUFULENBRlYsQ0FBQTtBQUdBLFFBQUEsSUFBRyxDQUFDLENBQUMsSUFBRixDQUFPLE1BQVAsQ0FBQSxLQUFvQixFQUF2QjtBQUNFLFVBQUEsSUFBb0IsY0FBcEI7QUFBQSxtQkFBTyxNQUFBLENBQU8sQ0FBUCxDQUFQLENBQUE7V0FBQTtpQkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsQ0FBQyxDQUFDLElBQUYsQ0FBTyxNQUFQLENBQXBCLEVBQ0U7QUFBQSxZQUFBLFdBQUEsRUFBYSxNQUFBLEdBQVMsQ0FBdEI7QUFBQSxZQUNBLGFBQUEsRUFBZSxPQUFBLEdBQVUsQ0FEekI7V0FERixFQUZGO1NBSjZCO01BQUEsQ0FBL0IsRUFGYTtJQUFBLENBckJmLENBQUE7O21CQUFBOztLQURvQixLQUh4QixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/console/tab-view.coffee
