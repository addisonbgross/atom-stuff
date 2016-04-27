(function() {
  var StackFrameView, View, helpers,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  helpers = require('../helpers.coffee');

  module.exports = StackFrameView = (function(_super) {
    __extends(StackFrameView, _super);

    function StackFrameView() {
      return StackFrameView.__super__.constructor.apply(this, arguments);
    }

    StackFrameView.content = function(params) {
      var selection;
      selection = params.active ? 'selected' : '';
      return StackFrameView.li({
        "class": selection
      }, function() {
        StackFrameView.div({
          "class": 'stack-frame-level text-info inline-block-tight',
          'data-level': params.id
        }, params.id);
        StackFrameView.div({
          "class": 'stack-frame-label text-info inline-block-tight'
        }, params.label);
        StackFrameView.div({
          "class": 'stack-frame-filepath text-smaller inline-block-tight',
          'data-path': helpers.remotePathToLocal(params.filepath)
        }, helpers.remotePathToLocal(params.filepath));
        return StackFrameView.div({
          "class": 'stack-frame-line text-smaller inline-block-tight',
          'data-line': params.line
        }, '(' + params.line + ')');
      });
    };

    return StackFrameView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGhwLWRlYnVnL2xpYi9zdGFjay9zdGFjay1mcmFtZS12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw2QkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFDQSxPQUFBLEdBQVUsT0FBQSxDQUFRLG1CQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFSixxQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxjQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsTUFBRCxHQUFBO0FBQ1IsVUFBQSxTQUFBO0FBQUEsTUFBQSxTQUFBLEdBQWUsTUFBTSxDQUFDLE1BQVYsR0FBc0IsVUFBdEIsR0FBc0MsRUFBbEQsQ0FBQTthQUNBLGNBQUMsQ0FBQSxFQUFELENBQUk7QUFBQSxRQUFBLE9BQUEsRUFBTyxTQUFQO09BQUosRUFBc0IsU0FBQSxHQUFBO0FBQ3BCLFFBQUEsY0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFVBQUEsT0FBQSxFQUFPLGdEQUFQO0FBQUEsVUFBeUQsWUFBQSxFQUFjLE1BQU0sQ0FBQyxFQUE5RTtTQUFMLEVBQXVGLE1BQU0sQ0FBQyxFQUE5RixDQUFBLENBQUE7QUFBQSxRQUNBLGNBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxVQUFBLE9BQUEsRUFBTyxnREFBUDtTQUFMLEVBQThELE1BQU0sQ0FBQyxLQUFyRSxDQURBLENBQUE7QUFBQSxRQUVBLGNBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxVQUFBLE9BQUEsRUFBTyxzREFBUDtBQUFBLFVBQStELFdBQUEsRUFBYSxPQUFPLENBQUMsaUJBQVIsQ0FBMEIsTUFBTSxDQUFDLFFBQWpDLENBQTVFO1NBQUwsRUFBNkgsT0FBTyxDQUFDLGlCQUFSLENBQTBCLE1BQU0sQ0FBQyxRQUFqQyxDQUE3SCxDQUZBLENBQUE7ZUFHQSxjQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsVUFBQSxPQUFBLEVBQU8sa0RBQVA7QUFBQSxVQUEyRCxXQUFBLEVBQWEsTUFBTSxDQUFDLElBQS9FO1NBQUwsRUFBMEYsR0FBQSxHQUFNLE1BQU0sQ0FBQyxJQUFiLEdBQW9CLEdBQTlHLEVBSm9CO01BQUEsQ0FBdEIsRUFGUTtJQUFBLENBQVYsQ0FBQTs7MEJBQUE7O0tBRjJCLEtBSjdCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/php-debug/lib/stack/stack-frame-view.coffee
