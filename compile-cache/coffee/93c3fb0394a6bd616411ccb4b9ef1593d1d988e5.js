(function() {
  var InputView, TextEditorView, View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('space-pen').View;

  TextEditorView = require('atom-space-pen-views').TextEditorView;

  module.exports = InputView = (function(_super) {
    __extends(InputView, _super);

    function InputView() {
      this.searchCallback = __bind(this.searchCallback, this);
      return InputView.__super__.constructor.apply(this, arguments);
    }

    InputView.content = function() {
      return this.div({
        "class": "atom-cscope-input"
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": "inline-block",
            id: "form-container"
          }, function() {
            _this.select({
              id: "cscope-options"
            }, function() {
              _this.option({
                value: '0'
              }, "Find this C symbol");
              _this.option({
                value: '1'
              }, "Find this global definition");
              _this.option({
                value: '2'
              }, "Find functions called by this");
              _this.option({
                value: '3'
              }, "Find functions calling this");
              _this.option({
                value: '4'
              }, "Find this text string");
              _this.option({
                value: '6'
              }, "Find this egrep pattern");
              _this.option({
                value: '7'
              }, "Find this file");
              _this.option({
                value: '8'
              }, "Find files #including this file");
              return _this.option({
                value: '9'
              }, "Find assignments to this symbol");
            });
            _this.subview('findEditor', new TextEditorView({
              mini: true,
              placeholderText: 'Input query here...'
            }));
            return _this.button({
              "class": "btn icon icon-search",
              id: "search"
            }, "Scope It!");
          });
        };
      })(this));
    };

    InputView.prototype.initialize = function(params) {
      this.resetPrevSearch();
      this.findEditor.getModel().getBuffer().stoppedChangingDelay = atom.config.get('atom-cscope.LiveSearchDelay');
      atom.config.onDidChange('atom-cscope.LiveSearchDelay', (function(_this) {
        return function(event) {
          return _this.findEditor.getModel().getBuffer().stoppedChangingDelay = event.newValue;
        };
      })(this));
      this.on('click', 'button#search', this.searchCallback);
      this.on('change', 'select#cscope-options', this.searchCallback);
      this.on('core:confirm', this.findEditor, (function(_this) {
        return function(event) {
          if (!_this.isSamePreviousSearch()) {
            return _this.searchCallback(event);
          }
        };
      })(this));
      return this.setupLiveSearchListener();
    };

    InputView.prototype.resetPrevSearch = function() {
      return this.prevSearch = {
        keyword: '',
        option: -1
      };
    };

    InputView.prototype.searchCallback = function(event) {
      this.parentView.showLoading();
      if (this.customSearchCallback) {
        this.customSearchCallback(this.getCurrentSearch());
      }
      this.prevSearch = this.getCurrentSearch();
      this.parentView.removeLoading();
      if (event) {
        event.preventDefault();
      }
      return false;
    };

    InputView.prototype.getSearchKeyword = function() {
      return this.findEditor.getText();
    };

    InputView.prototype.getSelectedOption = function() {
      return parseInt(this.find('select#cscope-options').val());
    };

    InputView.prototype.setSelectedOption = function(option) {
      return this.find('select#cscope-options').val(option.toString());
    };

    InputView.prototype.getCurrentSearch = function() {
      return {
        keyword: this.getSearchKeyword(),
        option: this.getSelectedOption()
      };
    };

    InputView.prototype.isCurrentSearchSameAs = function(search) {
      var currentSearch;
      currentSearch = this.getCurrentSearch();
      return currentSearch.keyword === search.keyword && currentSearch.option === search.option;
    };

    InputView.prototype.isSamePreviousSearch = function() {
      return this.isCurrentSearchSameAs(this.prevSearch);
    };

    InputView.prototype.setupLiveSearchListener = function() {
      if (atom.config.get('atom-cscope.LiveSearch')) {
        this.liveSearchListener = this.findEditor.getModel().onDidStopChanging(this.searchCallback);
      } else {
        this.liveSearchListener = false;
      }
      return atom.config.onDidChange('atom-cscope.LiveSearch', (function(_this) {
        return function(event) {
          if (event.newValue && !_this.liveSearchListener) {
            return _this.liveSearchListener = _this.findEditor.getModel().onDidStopChanging(_this.searchCallback);
          } else {
            _this.liveSearchListener.dispose();
            return _this.liveSearchListener = false;
          }
        };
      })(this));
    };

    InputView.prototype.onSearch = function(callback) {
      return this.customSearchCallback = callback;
    };

    InputView.prototype.autoFill = function(option, keyword) {
      this.findEditor.setText(keyword);
      return this.find('select#cscope-options').val(option.toString());
    };

    InputView.prototype.invokeSearch = function(option, keyword) {
      this.autoFill(option, keyword);
      return this.findEditor.trigger('core:confirm');
    };

    InputView.prototype.redoSearch = function() {
      this.resetPrevSearch();
      return this.findEditor.trigger('core:confirm');
    };

    InputView.prototype.serialize = function() {};

    InputView.prototype.destroy = function() {
      return this.element.remove();
    };

    InputView.prototype.getElement = function() {
      return this.element;
    };

    return InputView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1jc2NvcGUvbGliL3ZpZXdzL2lucHV0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtCQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsV0FBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUNDLGlCQUFtQixPQUFBLENBQVEsc0JBQVIsRUFBbkIsY0FERCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGdDQUFBLENBQUE7Ozs7O0tBQUE7O0FBQUEsSUFBQSxTQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxtQkFBUDtPQUFMLEVBQWlDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQy9CLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxjQUFQO0FBQUEsWUFBdUIsRUFBQSxFQUFJLGdCQUEzQjtXQUFMLEVBQWtELFNBQUEsR0FBQTtBQUNoRCxZQUFBLEtBQUMsQ0FBQSxNQUFELENBQVE7QUFBQSxjQUFBLEVBQUEsRUFBSSxnQkFBSjthQUFSLEVBQThCLFNBQUEsR0FBQTtBQUM1QixjQUFBLEtBQUMsQ0FBQSxNQUFELENBQVE7QUFBQSxnQkFBQSxLQUFBLEVBQU8sR0FBUDtlQUFSLEVBQW9CLG9CQUFwQixDQUFBLENBQUE7QUFBQSxjQUNBLEtBQUMsQ0FBQSxNQUFELENBQVE7QUFBQSxnQkFBQSxLQUFBLEVBQU8sR0FBUDtlQUFSLEVBQW9CLDZCQUFwQixDQURBLENBQUE7QUFBQSxjQUVBLEtBQUMsQ0FBQSxNQUFELENBQVE7QUFBQSxnQkFBQSxLQUFBLEVBQU8sR0FB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

//# sourceURL=/home/champ/.atom/packages/atom-cscope/lib/views/input-view.coffee
