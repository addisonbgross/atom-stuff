(function() {
  var $, Disposable, Interact, PhpDebugBreakpointView, PhpDebugContextView, PhpDebugStackView, PhpDebugUnifiedView, PhpDebugWatchView, ScrollView, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Disposable = require('atom').Disposable;

  _ref = require('atom-space-pen-views'), $ = _ref.$, ScrollView = _ref.ScrollView;

  PhpDebugContextView = require('../context/php-debug-context-view');

  PhpDebugStackView = require('../stack/php-debug-stack-view');

  PhpDebugWatchView = require('../watch/php-debug-watch-view');

  PhpDebugBreakpointView = require('../breakpoint/php-debug-breakpoint-view');

  Interact = require('interact.js');

  module.exports = PhpDebugUnifiedView = (function(_super) {
    __extends(PhpDebugUnifiedView, _super);

    PhpDebugUnifiedView.content = function() {
      return this.div({
        "class": 'php-debug',
        tabindex: -1
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'php-debug-unified-view'
          }, function() {
            _this.div({
              "class": 'block'
            }, function() {
              _this.button({
                "class": "btn octicon icon-playback-play inline-block-tight",
                disabled: 'disabled',
                'data-action': 'continue'
              }, "Continue");
              _this.button({
                "class": "btn octicon icon-steps inline-block-tight",
                disabled: 'disabled',
                'data-action': 'step'
              }, "Step Over");
              _this.button({
                "class": "btn octicon icon-sign-in inline-block-tight",
                disabled: 'disabled',
                'data-action': 'in'
              }, "Step In");
              _this.button({
                "class": "btn octicon icon-sign-out inline-block-tight",
                disabled: 'disabled',
                'data-action': 'out'
              }, "Step Out");
              _this.button({
                "class": "btn octicon icon-primitive-square inline-block-tight",
                disabled: 'disabled',
                'data-action': 'stop'
              }, "Stop");
              return _this.span({
                outlet: 'connectStatus'
              });
            });
            return _this.div({
              "class": 'tabs-view'
            }, function() {
              _this.div({
                outlet: 'stackView',
                "class": 'php-debug-tab'
              });
              _this.div({
                outlet: 'contextView',
                "class": 'php-debug-tab'
              });
              _this.div({
                outlet: 'watchpointView',
                "class": 'php-debug-tab'
              });
              return _this.div({
                outlet: 'breakpointView',
                "class": 'php-debug-tab'
              });
            });
          });
        };
      })(this));
    };

    function PhpDebugUnifiedView(params) {
      this.destroy = __bind(this.destroy, this);
      this.initialize = __bind(this.initialize, this);
      this.isVisible = __bind(this.isVisible, this);
      this.setVisible = __bind(this.setVisible, this);
      this.setConnected = __bind(this.setConnected, this);
      PhpDebugUnifiedView.__super__.constructor.apply(this, arguments);
      this.GlobalContext = params.context;
      this.contextList = [];
      this.GlobalContext.onBreak((function(_this) {
        return function() {
          return _this.find('button').enable();
        };
      })(this));
      this.GlobalContext.onRunning((function(_this) {
        return function() {
          return _this.find('button').disable();
        };
      })(this));
      this.GlobalContext.onSessionEnd((function(_this) {
        return function() {
          return _this.find('button').disable();
        };
      })(this));
      Interact(this.element).resizable({
        edges: {
          top: true
        }
      }).on('resizemove', function(event) {
        var target;
        target = event.target;
        if (event.rect.height < 25) {
          if (event.rect.height < 1) {
            return target.style.width = target.style.height = null;
          } else {

          }
        } else {
          target.style.width = event.rect.width + 'px';
          return target.style.height = event.rect.height + 'px';
        }
      }).on('resizeend', function(event) {
        return event.target.style.width = 'auto';
      });
      this.setConnected(false);
      this.visible = false;
      this.panel = atom.workspace.addBottomPanel({
        item: this.element,
        visible: this.visible,
        priority: 400
      });
    }

    PhpDebugUnifiedView.prototype.serialize = function() {
      return {
        deserializer: this.constructor.name,
        uri: this.getURI()
      };
    };

    PhpDebugUnifiedView.prototype.getURI = function() {
      return this.uri;
    };

    PhpDebugUnifiedView.prototype.getTitle = function() {
      return "Debugging";
    };

    PhpDebugUnifiedView.prototype.setConnected = function(isConnected) {
      var serverPort, _ref1, _ref2, _ref3, _ref4;
      if ((_ref1 = this.panel) != null) {
        if ((_ref2 = _ref1.item) != null) {
          _ref2.style.height = ((_ref3 = this.panel) != null ? (_ref4 = _ref3.item) != null ? _ref4.clientHeight : void 0 : void 0) + 'px';
        }
      }
      if (isConnected) {
        return this.connectStatus.text('Connected');
      } else {
        serverPort = atom.config.get('php-debug.ServerPort');
        return this.connectStatus.text("Listening on port " + serverPort + "...");
      }
    };

    PhpDebugUnifiedView.prototype.setVisible = function(visible) {
      this.visible = visible;
      if (this.visible) {
        return this.panel.show();
      } else {
        return this.panel.hide();
      }
    };

    PhpDebugUnifiedView.prototype.isVisible = function() {
      return this.visible;
    };

    PhpDebugUnifiedView.prototype.initialize = function(params) {
      PhpDebugUnifiedView.__super__.initialize.apply(this, arguments);
      this.stackView.append(new PhpDebugStackView({
        context: params.context
      }));
      this.contextView.append(new PhpDebugContextView({
        context: params.context
      }));
      this.watchpointView.append(new PhpDebugWatchView({
        context: params.context
      }));
      this.breakpointView.append(new PhpDebugBreakpointView({
        context: params.context
      }));
      return this.on('click', '[data-action]', (function(_this) {
        return function(e) {
          var action;
          action = e.target.getAttribute('data-action');
          switch (action) {
            case 'continue':
              return _this.GlobalContext.getCurrentDebugContext()["continue"]("run");
            case 'step':
              return _this.GlobalContext.getCurrentDebugContext()["continue"]("step_over");
            case 'in':
              return _this.GlobalContext.getCurrentDebugContext()["continue"]("step_into");
            case 'out':
              return _this.GlobalContext.getCurrentDebugContext()["continue"]("step_out");
            case 'stop':
              return _this.GlobalContext.getCurrentDebugContext().executeDetach();
            default:
              console.error("unknown action");
              console.dir(action);
              return console.dir(_this);
          }
        };
      })(this));
    };

    PhpDebugUnifiedView.prototype.openWindow = function() {
      return atom.workspace.addBottomPanel({
        item: this,
        visible: true
      });
    };

    PhpDebugUnifiedView.prototype.onDidChangeTitle = function() {
      return new Disposable(function() {});
    };

    PhpDebugUnifiedView.prototype.onDidChangeModified = function() {
      return new Disposable(function() {});
    };

    PhpDebugUnifiedView.prototype.destroy = function() {
      if (this.GlobalContext.getCurrentDebugContext()) {
        return this.GlobalContext.getCurrentDebugContext().executeDetach();
      }
    };

    PhpDebugUnifiedView.prototype.isEqual = function(other) {
      return other instanceof PhpDebugUnifiedView;
    };

    return PhpDebugUnifiedView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvcGhwLWRlYnVnL2xpYi91bmlmaWVkL3BocC1kZWJ1Zy11bmlmaWVkLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlKQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQWtCLE9BQUEsQ0FBUSxzQkFBUixDQUFsQixFQUFDLFNBQUEsQ0FBRCxFQUFJLGtCQUFBLFVBREosQ0FBQTs7QUFBQSxFQUVBLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSxtQ0FBUixDQUZ0QixDQUFBOztBQUFBLEVBR0EsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLCtCQUFSLENBSHBCLENBQUE7O0FBQUEsRUFJQSxpQkFBQSxHQUFvQixPQUFBLENBQVEsK0JBQVIsQ0FKcEIsQ0FBQTs7QUFBQSxFQUtBLHNCQUFBLEdBQXlCLE9BQUEsQ0FBUSx5Q0FBUixDQUx6QixDQUFBOztBQUFBLEVBTUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBTlgsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiwwQ0FBQSxDQUFBOztBQUFBLElBQUEsbUJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLFdBQVA7QUFBQSxRQUFvQixRQUFBLEVBQVUsQ0FBQSxDQUE5QjtPQUFMLEVBQXVDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ3JDLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyx3QkFBUDtXQUFMLEVBQXNDLFNBQUEsR0FBQTtBQUNwQyxZQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxPQUFQO2FBQUwsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLGNBQUEsS0FBQyxDQUFBLE1BQUQsQ0FBUTtBQUFBLGdCQUFBLE9BQUEsRUFBTyxtREFBUDtBQUFBLGdCQUErRCxRQUFBLEVBQVUsVUFBekU7QUFBQSxnQkFBcUYsYUFBQSxFQUFjLFVBQW5HO2VBQVIsRUFBdUgsVUFBdkgsQ0FBQSxDQUFBO0FBQUEsY0FDQSxLQUFDLENBQUEsTUFBRCxDQUFRO0FBQUEsZ0JBQUEsT0FBQSxFQUFPLDJDQUFQO0FBQUEsZ0JBQStELFFBQUEsRUFBVSxVQUF6RTtBQUFBLGdCQUFxRixhQUFBLEVBQWMsTUFBbkc7ZUFBUixFQUFtSCxXQUFuSCxDQURBLENBQUE7QUFBQSxjQUVBLEtBQUMsQ0FBQSxNQUFELENBQVE7QUFBQSxnQkFBQSxPQUFBLEVBQU8sNkNBQVA7QUFBQSxnQkFBK0QsUUFBQSxFQUFVLFVBQXpFO0FBQUEsZ0JBQXFGLGFBQUEsRUFBYyxJQUFuRztlQUFSLEVBQWlILFNBQWpILENBRkEsQ0FBQTtBQUFBLGNBR0EsS0FBQyxDQUFBLE1BQUQsQ0FBUTtBQUFBLGdCQUFBLE9BQUEsRUFBTyw4Q0FBUDtBQUFBLGdCQUErRCxRQUFBLEVBQVUsVUFBekU7QUFBQSxnQkFBcUYsYUFBQSxFQUFjLEtBQW5HO2VBQVIsRUFBa0gsVUFBbEgsQ0FIQSxDQUFBO0FBQUEsY0FJQSxLQUFDLENBQUEsTUFBRCxDQUFRO0FBQUEsZ0JBQUEsT0FBQSxFQUFPLHNEQUFQO0FBQUEsZ0JBQStELFFBQUEsRUFBVSxVQUF6RTtBQUFBLGdCQUFxRixhQUFBLEVBQWMsTUFBbkc7ZUFBUixFQUFtSCxNQUFuSCxDQUpBLENBQUE7cUJBS0EsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLGdCQUFBLE1BQUEsRUFBUSxlQUFSO2VBQU4sRUFObUI7WUFBQSxDQUFyQixDQUFBLENBQUE7bUJBT0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLFdBQVA7YUFBTCxFQUF5QixTQUFBLEdBQUE7QUFDdkIsY0FBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsZ0JBQUEsTUFBQSxFQUFRLFdBQVI7QUFBQSxnQkFBcUIsT0FBQSxFQUFNLGVBQTNCO2VBQUwsQ0FBQSxDQUFBO0FBQUEsY0FDQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsZ0JBQUEsTUFBQSxFQUFRLGFBQVI7QUFBQSxnQkFBdUIsT0FBQSxFQUFNLGVBQTdCO2VBQUwsQ0FEQSxDQUFBO0FBQUEsY0FFQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsZ0JBQUEsTUFBQSxFQUFRLGdCQUFSO0FBQUEsZ0JBQTBCLE9BQUEsRUFBTSxlQUFoQztlQUFMLENBRkEsQ0FBQTtxQkFHQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsZ0JBQUEsTUFBQSxFQUFRLGdCQUFSO0FBQUEsZ0JBQTBCLE9BQUEsRUFBTSxlQUFoQztlQUFMLEVBSnVCO1lBQUEsQ0FBekIsRUFSb0M7VUFBQSxDQUF0QyxFQURxQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZDLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBZ0JhLElBQUEsNkJBQUMsTUFBRCxHQUFBO0FBQ1gsK0NBQUEsQ0FBQTtBQUFBLHFEQUFBLENBQUE7QUFBQSxtREFBQSxDQUFBO0FBQUEscURBQUEsQ0FBQTtBQUFBLHlEQUFBLENBQUE7QUFBQSxNQUFBLHNEQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQixNQUFNLENBQUMsT0FEeEIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxFQUZmLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUF1QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNyQixLQUFDLENBQUEsSUFBRCxDQUFNLFFBQU4sQ0FBZSxDQUFDLE1BQWhCLENBQUEsRUFEcUI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF2QixDQUhBLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxhQUFhLENBQUMsU0FBZixDQUF5QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUN2QixLQUFDLENBQUEsSUFBRCxDQUFNLFFBQU4sQ0FBZSxDQUFDLE9BQWhCLENBQUEsRUFEdUI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QixDQUxBLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxhQUFhLENBQUMsWUFBZixDQUE0QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUMxQixLQUFDLENBQUEsSUFBRCxDQUFNLFFBQU4sQ0FBZSxDQUFDLE9BQWhCLENBQUEsRUFEMEI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1QixDQVBBLENBQUE7QUFBQSxNQVVBLFFBQUEsQ0FBUyxJQUFJLENBQUMsT0FBZCxDQUFzQixDQUFDLFNBQXZCLENBQWlDO0FBQUEsUUFBQyxLQUFBLEVBQU87QUFBQSxVQUFFLEdBQUEsRUFBSyxJQUFQO1NBQVI7T0FBakMsQ0FDRSxDQUFDLEVBREgsQ0FDTSxZQUROLEVBQ29CLFNBQUMsS0FBRCxHQUFBO0FBQ2hCLFlBQUEsTUFBQTtBQUFBLFFBQUEsTUFBQSxHQUFTLEtBQUssQ0FBQyxNQUFmLENBQUE7QUFDQSxRQUFBLElBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFYLEdBQW9CLEVBQXZCO0FBQ0UsVUFBQSxJQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBWCxHQUFvQixDQUF2QjttQkFDRSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQWIsR0FBcUIsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFiLEdBQXNCLEtBRDdDO1dBQUEsTUFBQTtBQUFBO1dBREY7U0FBQSxNQUFBO0FBTUUsVUFBQSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQWIsR0FBc0IsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFYLEdBQW1CLElBQXpDLENBQUE7aUJBQ0EsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFiLEdBQXNCLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBWCxHQUFvQixLQVA1QztTQUZnQjtNQUFBLENBRHBCLENBWUUsQ0FBQyxFQVpILENBWU0sV0FaTixFQVltQixTQUFDLEtBQUQsR0FBQTtlQUNmLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQW5CLEdBQTJCLE9BRFo7TUFBQSxDQVpuQixDQVZBLENBQUE7QUFBQSxNQTBCQSxJQUFDLENBQUEsWUFBRCxDQUFjLEtBQWQsQ0ExQkEsQ0FBQTtBQUFBLE1BNEJBLElBQUMsQ0FBQSxPQUFELEdBQVcsS0E1QlgsQ0FBQTtBQUFBLE1BNkJBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFmLENBQThCO0FBQUEsUUFBQyxJQUFBLEVBQU0sSUFBSSxDQUFDLE9BQVo7QUFBQSxRQUFxQixPQUFBLEVBQVMsSUFBQyxDQUFBLE9BQS9CO0FBQUEsUUFBd0MsUUFBQSxFQUFVLEdBQWxEO09BQTlCLENBN0JULENBRFc7SUFBQSxDQWhCYjs7QUFBQSxrQ0FnREEsU0FBQSxHQUFXLFNBQUEsR0FBQTthQUNUO0FBQUEsUUFBQSxZQUFBLEVBQWMsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUEzQjtBQUFBLFFBQ0EsR0FBQSxFQUFLLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FETDtRQURTO0lBQUEsQ0FoRFgsQ0FBQTs7QUFBQSxrQ0FvREEsTUFBQSxHQUFRLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxJQUFKO0lBQUEsQ0FwRFIsQ0FBQTs7QUFBQSxrQ0FzREEsUUFBQSxHQUFVLFNBQUEsR0FBQTthQUFHLFlBQUg7SUFBQSxDQXREVixDQUFBOztBQUFBLGtDQTBEQSxZQUFBLEdBQWMsU0FBQyxXQUFELEdBQUE7QUFDWixVQUFBLHNDQUFBOzs7ZUFBWSxDQUFFLEtBQUssQ0FBQyxNQUFwQix1RUFBeUMsQ0FBRSwrQkFBZCxHQUE2Qjs7T0FBMUQ7QUFDQSxNQUFBLElBQUcsV0FBSDtlQUNFLElBQUMsQ0FBQSxhQUFhLENBQUMsSUFBZixDQUFvQixXQUFwQixFQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsVUFBQSxHQUFhLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQkFBaEIsQ0FBYixDQUFBO2VBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxJQUFmLENBQXFCLG9CQUFBLEdBQW9CLFVBQXBCLEdBQStCLEtBQXBELEVBSkY7T0FGWTtJQUFBLENBMURkLENBQUE7O0FBQUEsa0NBa0VBLFVBQUEsR0FBWSxTQUFFLE9BQUYsR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLFVBQUEsT0FDWixDQUFBO0FBQUEsTUFBQSxJQUFHLElBQUMsQ0FBQSxPQUFKO2VBQ0UsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUEsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQSxFQUhGO09BRFU7SUFBQSxDQWxFWixDQUFBOztBQUFBLGtDQXdFQSxTQUFBLEdBQVcsU0FBQSxHQUFBO2FBQ1QsSUFBQyxDQUFBLFFBRFE7SUFBQSxDQXhFWCxDQUFBOztBQUFBLGtDQTJFQSxVQUFBLEdBQVksU0FBQyxNQUFELEdBQUE7QUFDVixNQUFBLHFEQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBc0IsSUFBQSxpQkFBQSxDQUFrQjtBQUFBLFFBQUEsT0FBQSxFQUFTLE1BQU0sQ0FBQyxPQUFoQjtPQUFsQixDQUF0QixDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxXQUFXLENBQUMsTUFBYixDQUF3QixJQUFBLG1CQUFBLENBQW9CO0FBQUEsUUFBQSxPQUFBLEVBQVMsTUFBTSxDQUFDLE9BQWhCO09BQXBCLENBQXhCLENBRkEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGNBQWMsQ0FBQyxNQUFoQixDQUEyQixJQUFBLGlCQUFBLENBQWtCO0FBQUEsUUFBQSxPQUFBLEVBQVMsTUFBTSxDQUFDLE9BQWhCO09BQWxCLENBQTNCLENBSEEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLGNBQWMsQ0FBQyxNQUFoQixDQUEyQixJQUFBLHNCQUFBLENBQXVCO0FBQUEsUUFBQSxPQUFBLEVBQVMsTUFBTSxDQUFDLE9BQWhCO09BQXZCLENBQTNCLENBSkEsQ0FBQTthQU1BLElBQUMsQ0FBQSxFQUFELENBQUksT0FBSixFQUFhLGVBQWIsRUFBOEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsQ0FBRCxHQUFBO0FBQzVCLGNBQUEsTUFBQTtBQUFBLFVBQUEsTUFBQSxHQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBVCxDQUFzQixhQUF0QixDQUFULENBQUE7QUFDQSxrQkFBTyxNQUFQO0FBQUEsaUJBQ08sVUFEUDtxQkFFSSxLQUFDLENBQUEsYUFBYSxDQUFDLHNCQUFmLENBQUEsQ0FBdUMsQ0FBQyxVQUFELENBQXZDLENBQWlELEtBQWpELEVBRko7QUFBQSxpQkFHTyxNQUhQO3FCQUlJLEtBQUMsQ0FBQSxhQUFhLENBQUMsc0JBQWYsQ0FBQSxDQUF1QyxDQUFDLFVBQUQsQ0FBdkMsQ0FBaUQsV0FBakQsRUFKSjtBQUFBLGlCQUtPLElBTFA7cUJBTUksS0FBQyxDQUFBLGFBQWEsQ0FBQyxzQkFBZixDQUFBLENBQXVDLENBQUMsVUFBRCxDQUF2QyxDQUFpRCxXQUFqRCxFQU5KO0FBQUEsaUJBT08sS0FQUDtxQkFRSSxLQUFDLENBQUEsYUFBYSxDQUFDLHNCQUFmLENBQUEsQ0FBdUMsQ0FBQyxVQUFELENBQXZDLENBQWlELFVBQWpELEVBUko7QUFBQSxpQkFTTyxNQVRQO3FCQVVJLEtBQUMsQ0FBQSxhQUFhLENBQUMsc0JBQWYsQ0FBQSxDQUF1QyxDQUFDLGFBQXhDLENBQUEsRUFWSjtBQUFBO0FBYUksY0FBQSxPQUFPLENBQUMsS0FBUixDQUFjLGdCQUFkLENBQUEsQ0FBQTtBQUFBLGNBQ0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxNQUFaLENBREEsQ0FBQTtxQkFFQSxPQUFPLENBQUMsR0FBUixDQUFZLEtBQVosRUFmSjtBQUFBLFdBRjRCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUIsRUFQVTtJQUFBLENBM0VaLENBQUE7O0FBQUEsa0NBcUdBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFDVixJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWYsQ0FBOEI7QUFBQSxRQUM1QixJQUFBLEVBQU0sSUFEc0I7QUFBQSxRQUU1QixPQUFBLEVBQVMsSUFGbUI7T0FBOUIsRUFEVTtJQUFBLENBckdaLENBQUE7O0FBQUEsa0NBMkdBLGdCQUFBLEdBQWtCLFNBQUEsR0FBQTthQUFPLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQSxDQUFYLEVBQVA7SUFBQSxDQTNHbEIsQ0FBQTs7QUFBQSxrQ0E0R0EsbUJBQUEsR0FBcUIsU0FBQSxHQUFBO2FBQU8sSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBLENBQVgsRUFBUDtJQUFBLENBNUdyQixDQUFBOztBQUFBLGtDQThHQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFHLElBQUMsQ0FBQSxhQUFhLENBQUMsc0JBQWYsQ0FBQSxDQUFIO2VBQ0UsSUFBQyxDQUFBLGFBQWEsQ0FBQyxzQkFBZixDQUFBLENBQXVDLENBQUMsYUFBeEMsQ0FBQSxFQURGO09BRE87SUFBQSxDQTlHVCxDQUFBOztBQUFBLGtDQWtIQSxPQUFBLEdBQVMsU0FBQyxLQUFELEdBQUE7YUFDUCxLQUFBLFlBQWlCLG9CQURWO0lBQUEsQ0FsSFQsQ0FBQTs7K0JBQUE7O0tBRGdDLFdBUmxDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/php-debug/lib/unified/php-debug-unified-view.coffee
