(function() {
  var $, ContextView, Disposable, PhpDebugContextView, ScrollView, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Disposable = require('atom').Disposable;

  _ref = require('atom-space-pen-views'), $ = _ref.$, ScrollView = _ref.ScrollView;

  ContextView = require('./context-view');

  module.exports = PhpDebugContextView = (function(_super) {
    __extends(PhpDebugContextView, _super);

    function PhpDebugContextView() {
      this.showContexts = __bind(this.showContexts, this);
      return PhpDebugContextView.__super__.constructor.apply(this, arguments);
    }

    PhpDebugContextView.content = function() {
      return this.div({
        "class": 'php-debug php-debug-context-view pane-item native-key-bindings',
        style: "overflow:auto;",
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.div({
            "class": "panel-heading"
          }, "Context");
          return _this.div({
            outlet: 'contextViewList',
            "class": 'php-debug-contexts'
          });
        };
      })(this));
    };

    PhpDebugContextView.prototype.serialize = function() {
      return {
        deserializer: this.constructor.name,
        uri: this.getURI()
      };
    };

    PhpDebugContextView.prototype.getURI = function() {
      return this.uri;
    };

    PhpDebugContextView.prototype.getTitle = function() {
      return "Context";
    };

    PhpDebugContextView.prototype.initialize = function(params) {
      PhpDebugContextView.__super__.initialize.apply(this, arguments);
      this.GlobalContext = params.context;
      this.GlobalContext.onContextUpdate(this.showContexts);
      return this.GlobalContext.onSessionEnd((function(_this) {
        return function() {
          if (_this.contextViewList) {
            return _this.contextViewList.empty();
          }
        };
      })(this));
    };

    PhpDebugContextView.prototype.onDidChangeTitle = function() {
      return new Disposable(function() {});
    };

    PhpDebugContextView.prototype.onDidChangeModified = function() {
      return new Disposable(function() {});
    };

    PhpDebugContextView.prototype.isEqual = function(other) {
      return other instanceof PhpDebugContextView;
    };

    PhpDebugContextView.prototype.showContexts = function() {
      var context, contexts, index, _ref1, _results;
      if (this.contextViewList) {
        this.autoopen = [];
        this.contextViewList.find("details[open]").each((function(_this) {
          return function(_, el) {
            var added, index, item, open, _i, _len, _ref1;
            item = $(el);
            added = false;
            _ref1 = _this.autoopen;
            for (index = _i = 0, _len = _ref1.length; _i < _len; index = ++_i) {
              open = _ref1[index];
              if (item.data('name').indexOf(open) === 0) {
                _this.autoopen[index] = item.data('name');
                added = true;
                break;
              }
            }
            if (!added) {
              return _this.autoopen.push(item.data('name'));
            }
          };
        })(this));
        this.contextViewList.empty();
      }
      contexts = this.GlobalContext.getCurrentDebugContext();
      _ref1 = contexts.scopeList;
      _results = [];
      for (index in _ref1) {
        context = _ref1[index];
        if (context === void 0) {
          continue;
        }
        _results.push(this.contextViewList.append(new ContextView(context, this.autoopen)));
      }
      return _results;
    };

    return PhpDebugContextView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGhwLWRlYnVnL2xpYi9jb250ZXh0L3BocC1kZWJ1Zy1jb250ZXh0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlFQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQWtCLE9BQUEsQ0FBUSxzQkFBUixDQUFsQixFQUFDLFNBQUEsQ0FBRCxFQUFJLGtCQUFBLFVBREosQ0FBQTs7QUFBQSxFQUVBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FGZCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDBDQUFBLENBQUE7Ozs7O0tBQUE7O0FBQUEsSUFBQSxtQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sZ0VBQVA7QUFBQSxRQUF5RSxLQUFBLEVBQU8sZ0JBQWhGO0FBQUEsUUFBa0csUUFBQSxFQUFVLENBQUEsQ0FBNUc7T0FBTCxFQUFxSCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ25ILFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLGVBQVA7V0FBTCxFQUE2QixTQUE3QixDQUFBLENBQUE7aUJBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsTUFBQSxFQUFRLGlCQUFSO0FBQUEsWUFBMkIsT0FBQSxFQUFNLG9CQUFqQztXQUFMLEVBRm1IO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckgsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSxrQ0FLQSxTQUFBLEdBQVcs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

//# sourceURL=/home/champ/.atom/packages/php-debug/lib/context/php-debug-context-view.coffee
