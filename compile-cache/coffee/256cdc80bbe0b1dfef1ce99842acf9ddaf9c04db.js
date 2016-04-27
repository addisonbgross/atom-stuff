(function() {
  var $, ConsoleView, TextEditorView, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, TextEditorView = _ref.TextEditorView, View = _ref.View;

  module.exports = ConsoleView = (function(_super) {
    __extends(ConsoleView, _super);

    function ConsoleView() {
      this.removeTab = __bind(this.removeTab, this);
      this.focusTab = __bind(this.focusTab, this);
      this.createTab = __bind(this.createTab, this);
      this.endResize = __bind(this.endResize, this);
      this.resize = __bind(this.resize, this);
      this.startResize = __bind(this.startResize, this);
      return ConsoleView.__super__.constructor.apply(this, arguments);
    }

    ConsoleView.content = function() {
      return this.div({
        "class": 'console'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'header'
          }, function() {
            _this.div({
              "class": 'name bold',
              outlet: 'name'
            });
            return _this.div({
              "class": 'icons'
            }, function() {
              return _this.div({
                "class": 'icon-x',
                outlet: 'close_view'
              });
            });
          });
          return _this.div({
            "class": 'console-container',
            outlet: 'console'
          }, function() {
            _this.div({
              "class": 'tabs'
            }, function() {
              _this.span({
                "class": 'icon icon-three-bars'
              });
              return _this.ul({
                "class": 'tab-list',
                outlet: 'tabs'
              });
            });
            _this.div({
              tabindex: '-1',
              "class": 'output-container native-key-bindings',
              outlet: 'output'
            });
            return _this.div({
              "class": 'input-container',
              outlet: 'input_container'
            }, function() {
              return _this.subview('input', new TextEditorView({
                mini: true,
                placeholderText: 'Write to standard input'
              }));
            });
          });
        };
      })(this));
    };

    ConsoleView.prototype.initialize = function(model) {
      this.model = model;
      this.close_view.on('click', (function(_this) {
        return function() {
          return _this.hide();
        };
      })(this));
      this.on('mousedown', '.header', this.startResize);
      this.model.onCreateTab(this.createTab);
      this.model.onFocusTab(this.focusTab);
      this.model.onRemoveTab(this.removeTab);
      return this.active = null;
    };

    ConsoleView.prototype.attached = function() {
      return this.disposable = atom.commands.add(this.input.element, {
        'core:confirm': (function(_this) {
          return function() {
            var t, _base;
            t = _this.input.getModel().getText();
            _this.input.getModel().setText('');
            return typeof (_base = _this.active).input === "function" ? _base.input("" + t + "\n") : void 0;
          };
        })(this)
      });
    };

    ConsoleView.prototype.detached = function() {
      return this.disposable.dispose();
    };

    ConsoleView.prototype.hideInput = function() {
      this.input_container.addClass('hidden');
      return atom.views.getView(atom.workspace).focus();
    };

    ConsoleView.prototype.startResize = function(e) {
      $(document).on('mousemove', this.resize);
      $(document).on('mouseup', this.endResize);
      return this.padding = $(document.body).height() - (e.clientY + this.find('.output-container').height());
    };

    ConsoleView.prototype.resize = function(_arg) {
      var pageY, which;
      pageY = _arg.pageY, which = _arg.which;
      if (which !== 1) {
        return this.endResize();
      }
      return this.find('.output-container').height($(document.body).height() - pageY - this.padding);
    };

    ConsoleView.prototype.endResize = function() {
      $(document).off('mousemove', this.resize);
      return $(document).off('mouseup', this.endResize);
    };

    ConsoleView.prototype.createTab = function(tab) {
      this.tabs.append(tab.header);
      return tab.header.on('click', '.clicker', function() {
        return tab.focus();
      });
    };

    ConsoleView.prototype.focusTab = function(tab) {
      this.show();
      this.tabs.find('.active').removeClass('active');
      this.output.find('.output').addClass('hidden');
      this.active = tab;
      this.name.empty();
      if (tab == null) {
        return this.hide();
      }
      tab.header.addClass('active');
      this.name.append(tab.getHeader());
      if (this.active.view.hasClass('hidden')) {
        this.active.view.removeClass('hidden');
      } else {
        this.output.append(this.active.view);
      }
      return this.input_container[this.active.input != null ? 'removeClass' : 'addClass']('hidden');
    };

    ConsoleView.prototype.removeTab = function(tab) {
      if (this.active === tab) {
        $(tab.title).remove();
        this.focusTab(this.getNextTab());
      }
      tab.header.remove();
      return tab.view.remove();
    };

    ConsoleView.prototype.getNextTab = function() {
      var header, index, tab, _i, _len, _ref1;
      if (this.tabs.children().length <= 1) {
        return;
      }
      _ref1 = this.tabs.children();
      for (index = _i = 0, _len = _ref1.length; _i < _len; index = ++_i) {
        tab = _ref1[index];
        if (tab === this.active.header[0]) {
          if (index === this.tabs.children().length - 1) {
            header = this.tabs.children()[index - 1];
            return this.model.getTab({
              project: header.attributes.getNamedItem('project').value,
              name: header.attributes.getNamedItem('name').value
            });
          } else {
            header = this.tabs.children()[index + 1];
            return this.model.getTab({
              project: header.attributes.getNamedItem('project').value,
              name: header.attributes.getNamedItem('name').value
            });
          }
        }
      }
    };

    return ConsoleView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL2NvbnNvbGUvY29uc29sZS1lbGVtZW50LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwQ0FBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLE9BQTRCLE9BQUEsQ0FBUSxzQkFBUixDQUE1QixFQUFDLFNBQUEsQ0FBRCxFQUFJLHNCQUFBLGNBQUosRUFBb0IsWUFBQSxJQUFwQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUNKLGtDQUFBLENBQUE7Ozs7Ozs7Ozs7S0FBQTs7QUFBQSxJQUFBLFdBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLFNBQVA7T0FBTCxFQUF1QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3JCLFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLFFBQVA7V0FBTCxFQUFzQixTQUFBLEdBQUE7QUFDcEIsWUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sV0FBUDtBQUFBLGNBQW9CLE1BQUEsRUFBUSxNQUE1QjthQUFMLENBQUEsQ0FBQTttQkFDQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sT0FBUDthQUFMLEVBQXFCLFNBQUEsR0FBQTtxQkFDbkIsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGdCQUFBLE9BQUEsRUFBTyxRQUFQO0FBQUEsZ0JBQWlCLE1BQUEsRUFBUSxZQUF6QjtlQUFMLEVBRG1CO1lBQUEsQ0FBckIsRUFGb0I7VUFBQSxDQUF0QixDQUFBLENBQUE7aUJBSUEsS0FBQyxDQUFBLEdB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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/console/console-element.coffee
