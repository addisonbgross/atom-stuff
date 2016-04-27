(function() {
  var $, Disposable, Emitter, GlobalContext, PhpDebugWatchView, ScrollView, TextEditorView, View, WatchView, Watchpoint, _ref, _ref1, _ref2,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Disposable = require('atom').Disposable;

  _ref = require('atom-space-pen-views'), $ = _ref.$, ScrollView = _ref.ScrollView;

  _ref1 = require('atom-space-pen-views'), $ = _ref1.$, TextEditorView = _ref1.TextEditorView, View = _ref1.View;

  _ref2 = require('event-kit'), Emitter = _ref2.Emitter, Disposable = _ref2.Disposable;

  WatchView = require('./watch-view');

  GlobalContext = require('../models/global-context');

  Watchpoint = require('../models/watchpoint');

  module.exports = PhpDebugWatchView = (function(_super) {
    __extends(PhpDebugWatchView, _super);

    PhpDebugWatchView.content = function() {
      return this.div({
        "class": "panel"
      }, (function(_this) {
        return function() {
          _this.div({
            "class": "panel-heading"
          }, "Watchpoints");
          return _this.section({
            "class": 'watchpoint-panel section'
          }, function() {
            _this.div({
              "class": 'editor-container'
            }, function() {
              return _this.subview('newWatchpointEditor', new TextEditorView());
            });
            return _this.div({
              outlet: 'watchpointViewList',
              "class": 'php-debug-watchpoints'
            });
          });
        };
      })(this));
    };

    function PhpDebugWatchView() {
      this.showWatches = __bind(this.showWatches, this);
      this.submitWatchpoint = __bind(this.submitWatchpoint, this);
      PhpDebugWatchView.__super__.constructor.apply(this, arguments);
    }

    PhpDebugWatchView.prototype.serialize = function() {
      return {
        deserializer: this.constructor.name,
        uri: this.getURI()
      };
    };

    PhpDebugWatchView.prototype.getURI = function() {
      return this.uri;
    };

    PhpDebugWatchView.prototype.getTitle = function() {
      return "Watch";
    };

    PhpDebugWatchView.prototype.onDidChangeTitle = function() {
      return new Disposable(function() {});
    };

    PhpDebugWatchView.prototype.onDidChangeModified = function() {
      return new Disposable(function() {});
    };

    PhpDebugWatchView.prototype.initialize = function(params) {
      this.GlobalContext = params.context;
      this.newWatchpointEditor.getModel().onWillInsertText(this.submitWatchpoint);
      this.GlobalContext.onContextUpdate(this.showWatches);
      this.GlobalContext.onWatchpointsChange(this.showWatches);
      return this.showWatches();
    };

    PhpDebugWatchView.prototype.submitWatchpoint = function(event) {
      var expression, w;
      if (event.text !== "\n") {
        return;
      }
      expression = this.newWatchpointEditor.getModel().getText();
      w = new Watchpoint({
        expression: expression
      });
      this.GlobalContext.addWatchpoint(w);
      this.newWatchpointEditor.getModel().setText('');
      return event.cancel();
    };

    PhpDebugWatchView.prototype.isEqual = function(other) {
      return other instanceof PhpDebugWatchView;
    };

    PhpDebugWatchView.prototype.showWatches = function() {
      var watch, watches, _i, _len, _results;
      if (this.watchpointViewList) {
        this.autoopen = [];
        this.watchpointViewList.find("details[open]").each((function(_this) {
          return function(_, el) {
            var added, index, item, open, _i, _len, _ref3;
            item = $(el);
            added = false;
            _ref3 = _this.autoopen;
            for (index = _i = 0, _len = _ref3.length; _i < _len; index = ++_i) {
              open = _ref3[index];
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
      }
      this.watchpointViewList.empty();
      if (this.GlobalContext.getCurrentDebugContext()) {
        watches = this.GlobalContext.getCurrentDebugContext().getWatchpoints();
      } else {
        watches = this.GlobalContext.getWatchpoints();
      }
      _results = [];
      for (_i = 0, _len = watches.length; _i < _len; _i++) {
        watch = watches[_i];
        if (watch === void 0) {
          continue;
        }
        _results.push(this.watchpointViewList.append(new WatchView({
          watchpoint: watch,
          autoopen: this.autoopen,
          context: this.GlobalContext
        })));
      }
      return _results;
    };

    return PhpDebugWatchView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGhwLWRlYnVnL2xpYi93YXRjaC9waHAtZGVidWctd2F0Y2gtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscUlBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxNQUFSLEVBQWQsVUFBRCxDQUFBOztBQUFBLEVBQ0EsT0FBa0IsT0FBQSxDQUFRLHNCQUFSLENBQWxCLEVBQUMsU0FBQSxDQUFELEVBQUksa0JBQUEsVUFESixDQUFBOztBQUFBLEVBRUEsUUFBNkIsT0FBQSxDQUFRLHNCQUFSLENBQTdCLEVBQUMsVUFBQSxDQUFELEVBQUksdUJBQUEsY0FBSixFQUFvQixhQUFBLElBRnBCLENBQUE7O0FBQUEsRUFHQSxRQUF3QixPQUFBLENBQVEsV0FBUixDQUF4QixFQUFDLGdCQUFBLE9BQUQsRUFBVSxtQkFBQSxVQUhWLENBQUE7O0FBQUEsRUFJQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FKWixDQUFBOztBQUFBLEVBS0EsYUFBQSxHQUFnQixPQUFBLENBQVEsMEJBQVIsQ0FMaEIsQ0FBQTs7QUFBQSxFQU1BLFVBQUEsR0FBYSxPQUFBLENBQVEsc0JBQVIsQ0FOYixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHdDQUFBLENBQUE7O0FBQUEsSUFBQSxpQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sT0FBUDtPQUFMLEVBQXFCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDbkIsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sZUFBUDtXQUFMLEVBQTZCLGFB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

//# sourceURL=/home/champ/.atom/packages/php-debug/lib/watch/php-debug-watch-view.coffee
