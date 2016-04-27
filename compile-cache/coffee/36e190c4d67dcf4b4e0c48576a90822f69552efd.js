(function() {
  var $, BreakpointView, Disposable, GlobalContext, GutterContainer, PhpDebugBreakpointView, ScrollView, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Disposable = require('atom').Disposable;

  _ref = require('atom-space-pen-views'), $ = _ref.$, ScrollView = _ref.ScrollView;

  BreakpointView = require('./breakpoint-view');

  GutterContainer = require('./breakpoint-view');

  GlobalContext = require('../models/global-context');

  module.exports = PhpDebugBreakpointView = (function(_super) {
    __extends(PhpDebugBreakpointView, _super);

    PhpDebugBreakpointView.content = function() {
      return this.div({
        "class": 'php-debug php-debug-breakpoint-view pane-item',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.div({
            "class": "panel-heading"
          }, "Breakpoints");
          return _this.div({
            outlet: 'breakpointViewList',
            tabindex: -1,
            "class": 'php-debug-breakpoints native-key-bindings'
          });
        };
      })(this));
    };

    function PhpDebugBreakpointView(params) {
      this.showBreakpoints = __bind(this.showBreakpoints, this);
      this.initialize = __bind(this.initialize, this);
      PhpDebugBreakpointView.__super__.constructor.apply(this, arguments);
      this.contextList = [];
    }

    PhpDebugBreakpointView.prototype.serialize = function() {
      return {
        deserializer: this.constructor.name,
        uri: this.getURI()
      };
    };

    PhpDebugBreakpointView.prototype.getURI = function() {
      return this.uri;
    };

    PhpDebugBreakpointView.prototype.getTitle = function() {
      return "Breakpoints";
    };

    PhpDebugBreakpointView.prototype.onDidChangeTitle = function() {
      return new Disposable(function() {});
    };

    PhpDebugBreakpointView.prototype.onDidChangeModified = function() {
      return new Disposable(function() {});
    };

    PhpDebugBreakpointView.prototype.isEqual = function(other) {
      return other instanceof PhpDebugBreakpointView;
    };

    PhpDebugBreakpointView.prototype.initialize = function(params) {
      this.GlobalContext = params.context;
      this.showBreakpoints();
      return this.GlobalContext.onBreakpointsChange(this.showBreakpoints);
    };

    PhpDebugBreakpointView.prototype.showBreakpoints = function() {
      var breakpoints;
      if (this.breakpointViewList) {
        this.breakpointViewList.empty();
      }
      breakpoints = this.GlobalContext.getBreakpoints();
      return this.breakpointViewList.append(new BreakpointView(breakpoints));
    };

    return PhpDebugBreakpointView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGhwLWRlYnVnL2xpYi9icmVha3BvaW50L3BocC1kZWJ1Zy1icmVha3BvaW50LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVHQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQWtCLE9BQUEsQ0FBUSxzQkFBUixDQUFsQixFQUFDLFNBQUEsQ0FBRCxFQUFJLGtCQUFBLFVBREosQ0FBQTs7QUFBQSxFQUVBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG1CQUFSLENBRmpCLENBQUE7O0FBQUEsRUFHQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxtQkFBUixDQUhsQixDQUFBOztBQUFBLEVBS0EsYUFBQSxHQUFnQixPQUFBLENBQVEsMEJBQVIsQ0FMaEIsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiw2Q0FBQSxDQUFBOztBQUFBLElBQUEsc0JBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLCtDQUFQO0FBQUEsUUFBd0QsUUFBQSxFQUFVLENBQUEsQ0FBbEU7T0FBTCxFQUEyRSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3pFLFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLGVBQVA7V0FBTCxFQUE2QixhQUE3QixDQUFBLENBQUE7aUJBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsTUFBQSxFQUFRLG9CQUFSO0FBQUEsWUFBOEIsUUFBQSxFQUFVLENBQUEsQ0FBeEM7QUFBQSxZQUE0QyxPQUFBLEVBQU0sMkNBQWxEO1dBQUwsRUFGeUU7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzRSxFQURRO0lBQUEsQ0FBVixDQUFBOztBQUthLElBQUEsZ0NBQUMsTUFBRCxHQUFBO0FBQ1gsK0RBQUEsQ0FBQTtBQUFBLHFEQUFBLENBQUE7QUFBQSxNQUFBLHlEQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsV0FBRCxHQUFlLEVBRGYsQ0FEVztJQUFBLENBTGI7O0FBQUEscUNBU0EsU0FBQSxHQUFXLFNBQUEsR0FBQTthQUNUO0FBQUEsUUFBQSxZQUFBLEVBQWMsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUEzQjtBQUFBLFFBQ0EsR0FBQSxFQUFLLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FETDtRQURTO0lBQUEsQ0FUWCxDQUFBOztBQUFBLHFDQWFBLE1BQUEsR0FBUSxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsSUFBSjtJQUFBLENBYlIsQ0FBQTs7QUFBQSxxQ0FlQSxRQUFBLEdBQVUsU0FBQSxHQUFBO2FBQUcsY0FBSDtJQUFBLENBZlYsQ0FBQTs7QUFBQSxxQ0FpQkEsZ0JBQUEsR0FBa0IsU0FBQSxHQUFBO2FBQU8sSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBLENBQVgsRUFBUDtJQUFBLENBakJsQixDQUFBOztBQUFBLHFDQWtCQSxtQkFBQSxHQUFxQixTQUFBLEdBQUE7YUFBTyxJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUEsQ0FBWCxFQUFQO0lBQUEsQ0FsQnJCLENBQUE7O0FBQUEscUNBb0JBLE9BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTthQUNQLEtBQUEsWUFBaUIsdUJBRFY7SUFBQSxDQXBCVCxDQUFBOztBQUFBLHFDQXVCQSxVQUFBLEdBQVksU0FBQyxNQUFELEdBQUE7QUFDVixNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLE1BQU0sQ0FBQyxPQUF4QixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsZUFBRCxDQUFBLENBREEsQ0FBQTthQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsbUJBQWYsQ0FBbUMsSUFBQyxDQUFBLGVBQXBDLEVBSFU7SUFBQSxDQXZCWixDQUFBOztBQUFBLHFDQTZCQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUNmLFVBQUEsV0FBQTtBQUFBLE1BQUEsSUFBRyxJQUFDLENBQUEsa0JBQUo7QUFDRSxRQUFBLElBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxLQUFwQixDQUFBLENBQUEsQ0FERjtPQUFBO0FBQUEsTUFFQSxXQUFBLEdBQWMsSUFBQyxDQUFBLGFBQWEsQ0FBQyxjQUFmLENBQUEsQ0FGZCxDQUFBO2FBR0EsSUFBQyxDQUFBLGtCQUFrQixDQUFDLE1BQXBCLENBQStCLElBQUEsY0FBQSxDQUFlLFdBQWYsQ0FBL0IsRUFKZTtJQUFBLENBN0JqQixDQUFBOztrQ0FBQTs7S0FEbUMsV0FSckMsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/php-debug/lib/breakpoint/php-debug-breakpoint-view.coffee
