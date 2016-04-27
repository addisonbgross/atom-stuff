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

    TabView.prototype.scroll = function() {
      if (!this.hasClass('hidden')) {
        return this.parent().scrollTop(this[0].scrollHeight);
      }
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL2NvbnNvbGUvdGFiLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFZLE9BQUEsQ0FBUSxzQkFBUixDQUFaLEVBQUMsU0FBQSxDQUFELEVBQUksWUFBQSxJQUFKLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBQ0osOEJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsT0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sUUFBUDtPQUFMLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsc0JBR0EsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxVQUFELEdBQWMsTUFESjtJQUFBLENBSFosQ0FBQTs7QUFBQSxzQkFNQSxTQUFBLEdBQVcsU0FBQyxJQUFELEdBQUE7QUFDVCxNQUFBLElBQWUsSUFBQyxDQUFBLFVBQWhCO0FBQUEsZUFBTyxJQUFQLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBUSxJQUFSLENBREEsQ0FBQTtBQUVBLE1BQUEsSUFBQSxDQUFBLElBQStDLENBQUEsUUFBRCxDQUFVLFFBQVYsQ0FBOUM7QUFBQSxRQUFBLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBUyxDQUFDLFNBQVYsQ0FBb0IsSUFBRSxDQUFBLENBQUEsQ0FBRSxDQUFDLFlBQXpCLENBQUEsQ0FBQTtPQUZBO0FBR0EsYUFBTyxJQUFFLENBQUEsQ0FBQSxDQUFFLENBQUMsUUFBUyxDQUFBLElBQUUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxRQUFRLENBQUMsTUFBZCxHQUF1QixDQUF2QixDQUFyQixDQUpTO0lBQUEsQ0FOWCxDQUFBOztBQUFBLHNCQVlBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixNQUFBLElBQUEsQ0FBQSxJQUErQyxDQUFBLFFBQUQsQ0FBVSxRQUFWLENBQTlDO2VBQUEsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFTLENBQUMsU0FBVixDQUFvQixJQUFFLENBQUEsQ0FBQSxDQUFFLENBQUMsWUFBekIsRUFBQTtPQURNO0lBQUEsQ0FaUixDQUFBOztBQUFBLHNCQWVBLElBQUEsR0FBTSxTQUFBLEdBQUE7YUFDSixJQUFDLENBQUEsVUFBRCxHQUFjLEtBRFY7SUFBQSxDQWZOLENBQUE7O0FBQUEsc0JBa0JBLE1BQUEsR0FBUSxTQUFBLEdBQUE7YUFDTixJQUFDLENBQUEsVUFBRCxHQUFjLE1BRFI7SUFBQSxDQWxCUixDQUFBOztBQUFBLHNCQXFCQSxLQUFBLEdBQU8sU0FBQSxHQUFBO2FBQ0wsSUFBQyxDQUFBLEtBQUQsQ0FBQSxFQURLO0lBQUEsQ0FyQlAsQ0FBQTs7QUFBQSxzQkF3QkEsYUFBQSxHQUFlLFNBQUMsTUFBRCxHQUFBO0FBQ2IsTUFBQSxJQUFDLENBQUEsSUFBRCxDQUFNLFdBQU4sQ0FBa0IsQ0FBQyxHQUFuQixDQUF1QixPQUF2QixDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsSUFBRCxDQUFNLFdBQU4sQ0FBa0IsQ0FBQyxFQUFuQixDQUFzQixPQUF0QixFQUErQixTQUFBLEdBQUE7QUFDN0IsWUFBQSxrQkFBQTtBQUFBLFFBQUEsQ0FBQSxHQUFJLENBQUEsQ0FBRSxJQUFGLENBQUosQ0FBQTtBQUFBLFFBQ0EsTUFBQSxHQUFTLFFBQUEsQ0FBUyxDQUFDLENBQUMsSUFBRixDQUFPLEtBQVAsQ0FBVCxDQURULENBQUE7QUFBQSxRQUVBLE9BQUEsR0FBVSxRQUFBLENBQVMsQ0FBQyxDQUFDLElBQUYsQ0FBTyxLQUFQLENBQVQsQ0FGVixDQUFBO0FBR0EsUUFBQSxJQUFHLENBQUMsQ0FBQyxJQUFGLENBQU8sTUFBUCxDQUFBLEtBQW9CLEVBQXZCO0FBQ0UsVUFBQSxJQUFvQixjQUFwQjtBQUFBLG1CQUFPLE1BQUEsQ0FBTyxDQUFQLENBQVAsQ0FBQTtXQUFBO2lCQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixDQUFDLENBQUMsSUFBRixDQUFPLE1BQVAsQ0FBcEIsRUFDRTtBQUFBLFlBQUEsV0FBQSxFQUFhLE1BQUEsR0FBUyxDQUF0QjtBQUFBLFlBQ0EsYUFBQSxFQUFlLE9BQUEsR0FBVSxDQUR6QjtXQURGLEVBRkY7U0FKNkI7TUFBQSxDQUEvQixFQUZhO0lBQUEsQ0F4QmYsQ0FBQTs7bUJBQUE7O0tBRG9CLEtBSHhCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/console/tab-view.coffee
