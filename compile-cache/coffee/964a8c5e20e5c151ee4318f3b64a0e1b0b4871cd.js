(function() {
  var AskView, TextEditorView, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), View = _ref.View, TextEditorView = _ref.TextEditorView;

  module.exports = AskView = (function(_super) {
    __extends(AskView, _super);

    function AskView() {
      this.cancel = __bind(this.cancel, this);
      this.accept = __bind(this.accept, this);
      return AskView.__super__.constructor.apply(this, arguments);
    }

    AskView.content = function() {
      return this.div({
        "class": 'ask-view'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'block'
          }, function() {
            _this.label(function() {
              return _this.div({
                "class": 'settings-name'
              }, 'Command');
            });
            _this.subview('command', new TextEditorView({
              mini: true
            }));
            return _this.div({
              id: 'command-none',
              "class": 'error hidden'
            }, 'Command cannot be empty');
          });
          return _this.div({
            "class": 'buttons'
          }, function() {
            _this.div({
              "class": 'btn btn-error icon icon-x inline-block-tight'
            }, 'Cancel');
            return _this.div({
              "class": 'btn btn-primary icon icon-check inline-block-tight'
            }, 'Accept');
          });
        };
      })(this));
    };

    AskView.prototype.initialize = function(command, callback) {
      this.callback = callback;
      this.Command = this.command.getModel();
      this.cancelling = false;
      this.on('click', '.buttons .icon-x', this.cancel);
      this.on('click', '.buttons .icon-check', this.accept);
      atom.commands.add(this.element, {
        'core:confirm': this.accept,
        'core:cancel': this.cancel
      });
      this.on('mousedown', function() {
        return false;
      });
      this.command.on('blur', (function(_this) {
        return function() {
          if (!_this.cancelling) {
            return _this.cancel();
          }
        };
      })(this));
      this.Command.setText(command);
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.command.focus();
    };

    AskView.prototype.accept = function(event) {
      var c;
      this.cancelling = true;
      this.find('.error').addClass('hidden');
      if ((c = this.Command.getText()) !== '') {
        this.callback(c);
        this.hide();
      } else {
        this.find('.error').removeClass('hidden');
      }
      return event.stopPropagation();
    };

    AskView.prototype.cancel = function(event) {
      this.cancelling = true;
      this.hide();
      return event != null ? event.stopPropagation() : void 0;
    };

    AskView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.hide() : void 0;
    };

    return AskView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvbGliL3ZpZXcvYXNrLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1DQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBeUIsT0FBQSxDQUFRLHNCQUFSLENBQXpCLEVBQUMsWUFBQSxJQUFELEVBQU8sc0JBQUEsY0FBUCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUNKLDhCQUFBLENBQUE7Ozs7OztLQUFBOztBQUFBLElBQUEsT0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sVUFBUDtPQUFMLEVBQXdCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDdEIsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sT0FBUDtXQUFMLEVBQXFCLFNBQUEsR0FBQTtBQUNuQixZQUFBLEtBQUMsQ0FBQSxLQUFELENBQU8sU0FBQSxHQUFBO3FCQUNMLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxnQkFBQSxPQUFBLEVBQU8sZUFBUDtlQUFMLEVBQTZCLFNBQTdCLEVBREs7WUFBQSxDQUFQLENBQUEsQ0FBQTtBQUFBLFlBRUEsS0FBQyxDQUFBLE9BQUQsQ0FBUyxTQUFULEVBQXdCLElBQUEsY0FBQSxDQUFlO0FBQUEsY0FBQSxJQUFBLEVBQU0sSUFBTjthQUFmLENBQXhCLENBRkEsQ0FBQTttQkFHQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxFQUFBLEVBQUksY0FBSjtBQUFBLGNBQW9CLE9BQUEsRUFBTyxjQUEzQjthQUFMLEVBQWdELHlCQUFoRCxFQUptQjtVQUFBLENBQXJC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

//# sourceURL=/home/champ/.atom/packages/build-tools/lib/view/ask-view.coffee
