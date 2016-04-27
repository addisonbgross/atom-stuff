(function() {
  var $, Codepoint, GlobalContext, PhpDebugStackView, ScrollView, StackFrameView, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, ScrollView = _ref.ScrollView;

  StackFrameView = require('./stack-frame-view');

  GlobalContext = require('../models/global-context');

  Codepoint = require('../models/codepoint');

  module.exports = PhpDebugStackView = (function(_super) {
    __extends(PhpDebugStackView, _super);

    function PhpDebugStackView() {
      this.showStackFrames = __bind(this.showStackFrames, this);
      return PhpDebugStackView.__super__.constructor.apply(this, arguments);
    }

    PhpDebugStackView.content = function() {
      return this.div({
        "class": 'php-debug php-debug-context-view pane-item native-key-bindings',
        style: "overflow:auto;",
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.div({
            "class": "panel-heading"
          }, "Stack");
          return _this.ul({
            outlet: 'stackFrameViewList',
            "class": 'php-debug-contexts'
          });
        };
      })(this));
    };

    PhpDebugStackView.prototype.initialize = function(params) {
      PhpDebugStackView.__super__.initialize.apply(this, arguments);
      this.GlobalContext = params.context;
      this.GlobalContext.onContextUpdate(this.showStackFrames);
      this.GlobalContext.onSessionEnd((function(_this) {
        return function() {
          if (_this.stackFrameViewList) {
            return _this.stackFrameViewList.empty();
          }
        };
      })(this));
      this.stackFrameViewList.on('mousedown', 'li', (function(_this) {
        return function(e) {
          _this.selectStackFrame($(e.target).closest('li'));
          e.preventDefault();
          return false;
        };
      })(this));
      return this.stackFrameViewList.on('mouseup', 'li', (function(_this) {
        return function(e) {
          e.preventDefault();
          return false;
        };
      })(this));
    };

    PhpDebugStackView.prototype.showStackFrames = function() {
      var context, index, stackFrame, _ref1, _results;
      if (this.stackFrameViewList) {
        this.stackFrameViewList.empty();
      }
      context = this.GlobalContext.getCurrentDebugContext();
      _ref1 = context.getStack();
      _results = [];
      for (index in _ref1) {
        stackFrame = _ref1[index];
        if (stackFrame === void 0) {
          continue;
        }
        _results.push(this.stackFrameViewList.append(new StackFrameView(stackFrame)));
      }
      return _results;
    };

    PhpDebugStackView.prototype.selectStackFrame = function(view) {
      if (!view.length) {
        return;
      }
      this.stackFrameViewList.find('.selected').removeClass('selected');
      view.addClass('selected');
      return this.GlobalContext.notifyStackChange(new Codepoint({
        filepath: view.find('.stack-frame-filepath').data('path'),
        line: view.find('.stack-frame-line').data('line'),
        stackdepth: view.find('.stack-frame-level').data('level')
      }));
    };

    return PhpDebugStackView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGhwLWRlYnVnL2xpYi9zdGFjay9waHAtZGVidWctc3RhY2stdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0ZBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxPQUFrQixPQUFBLENBQVEsc0JBQVIsQ0FBbEIsRUFBQyxTQUFBLENBQUQsRUFBSSxrQkFBQSxVQUFKLENBQUE7O0FBQUEsRUFFQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxvQkFBUixDQUZqQixDQUFBOztBQUFBLEVBR0EsYUFBQSxHQUFnQixPQUFBLENBQVEsMEJBQVIsQ0FIaEIsQ0FBQTs7QUFBQSxFQUlBLFNBQUEsR0FBWSxPQUFBLENBQVEscUJBQVIsQ0FKWixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHdDQUFBLENBQUE7Ozs7O0tBQUE7O0FBQUEsSUFBQSxpQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sZ0VBQVA7QUFBQSxRQUF5RSxLQUFBLEVBQU8sZ0JBQWhGO0FBQUEsUUFBa0csUUFBQSxFQUFVLENBQUEsQ0FBNUc7T0FBTCxFQUFxSCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ25ILFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLGVBQVA7V0FBTCxFQUE2QixPQUE3QixDQUFBLENBQUE7aUJBQ0EsS0FBQyxDQUFBLEVBQUQsQ0FBSTtBQUFBLFlBQUEsTUFBQSxFQUFRLG9CQUFSO0FBQUEsWUFBOEIsT0FBQSxFQUFNLG9CQUFwQztXQUFKLEVBRm1IO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEs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

//# sourceURL=/home/champ/.atom/packages/php-debug/lib/stack/php-debug-stack-view.coffee
