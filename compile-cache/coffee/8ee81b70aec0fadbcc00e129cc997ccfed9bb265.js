(function() {
  var $, ListView, ResultItemView, View, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('space-pen'), $ = _ref.$, View = _ref.View;

  ResultItemView = require('./result-item-view');

  _ = require('underscore-plus');

  module.exports = ListView = (function(_super) {
    __extends(ListView, _super);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.content = function() {
      return this.div({
        "class": "list-container"
      }, (function(_this) {
        return function() {
          _this.ul({
            id: "empty-container",
            "class": "background-message centered",
            outlet: 'emptyList'
          }, function() {
            return _this.li("No Results");
          });
          return _this.ol({
            id: "result-container",
            "class": "hidden",
            outlet: 'resultList'
          });
        };
      })(this));
    };

    ListView.prototype.initialize = function() {
      return this.keyUsed = false;
    };

    ListView.prototype.setItems = function(items) {
      this.items = items != null ? items : [];
      if (this.items.length === 0) {
        this.setResultsNotAvailable();
      } else {
        this.setResultsAvailable();
      }
      return this.resultList.append(_.map(this.items, function(item) {
        return item.generateView();
      }));
    };

    ListView.prototype.clearItems = function() {
      this.setResultsNotAvailable();
      return this.resultList.empty();
    };

    ListView.prototype.onConfirm = function(callback) {
      this.on('click', 'li.result-item', (function(_this) {
        return function(e) {
          var target;
          target = $(e.target).closest('li');
          if (target.length === 0) {
            return;
          }
          _this.keyUsed = false;
          _this.selectItemView(target);
          return callback(target.data('result-item'));
        };
      })(this));
      return this.parentView.on('core:confirm', (function(_this) {
        return function(e) {
          var target;
          target = _this.getSelectedItemView();
          if (target.length === 0 || (!_this.keyUsed && !_this.parentView.inputView.isSamePreviousSearch()) || !target.hasClass('selected')) {
            return;
          }
          _this.keyUsed = false;
          return callback(target.data('result-item'));
        };
      })(this));
    };

    ListView.prototype.setResultsNotAvailable = function() {
      this.resultList.addClass('hidden');
      return this.emptyList.removeClass('hidden');
    };

    ListView.prototype.setResultsAvailable = function() {
      this.resultList.removeClass('hidden');
      return this.emptyList.addClass('hidden');
    };

    ListView.prototype.selectFirstItemView = function() {
      this.selectItemView(this.resultList.find('li:first'));
      this.resultList.scrollToTop();
      return false;
    };

    ListView.prototype.selectLastItemView = function() {
      this.selectItemView(this.resultList.find('li:last'));
      this.resultList.scrollToBottom();
      return false;
    };

    ListView.prototype.selectPreviousItemView = function() {
      var view;
      view = this.getSelectedItemView().prev();
      if (!view.length) {
        view = this.resultList.find('li:last');
      }
      return this.selectItemView(view);
    };

    ListView.prototype.selectNextItemView = function() {
      var view;
      view = this.getSelectedItemView().next();
      if (!view.length) {
        view = this.resultList.find('li:first');
      }
      return this.selectItemView(view);
    };

    ListView.prototype.selectItemView = function(view) {
      if (!view.length) {
        return;
      }
      this.resultList.find('.selected').removeClass('selected');
      view.addClass('selected');
      return this.scrollToItemView(view);
    };

    ListView.prototype.scrollToItemView = function(view) {
      var desiredBottom, desiredTop, scrollTop;
      scrollTop = this.resultList.scrollTop();
      desiredTop = view.position().top + scrollTop;
      desiredBottom = desiredTop + view.outerHeight();
      if (desiredTop < scrollTop) {
        return this.resultList.scrollTop(desiredTop);
      } else if (desiredBottom > this.resultList.scrollBottom()) {
        return this.resultList.scrollBottom(desiredBottom);
      }
    };

    ListView.prototype.getSelectedItemView = function() {
      return this.resultList.find('li.selected');
    };

    return ListView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1jc2NvcGUvbGliL3ZpZXdzL2xpc3Qtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMENBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQVksT0FBQSxDQUFRLFdBQVIsQ0FBWixFQUFDLFNBQUEsQ0FBRCxFQUFJLFlBQUEsSUFBSixDQUFBOztBQUFBLEVBQ0EsY0FBQSxHQUFpQixPQUFBLENBQVEsb0JBQVIsQ0FEakIsQ0FBQTs7QUFBQSxFQUVBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FGSixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLCtCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFFBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLGdCQUFQO09BQUwsRUFBOEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUM1QixVQUFBLEtBQUMsQ0FBQSxFQUFELENBQUk7QUFBQSxZQUFBLEVBQUEsRUFBSSxpQkFBSjtBQUFBLFlBQXVCLE9BQUEsRUFBTyw2QkFBOUI7QUFBQSxZQUE2RCxNQUFBLEVBQVEsV0FBckU7V0FBSixFQUFzRixTQUFBLEdBQUE7bUJBQ3BGLEtBQUMsQ0FBQSxFQUFELENBQUksWUFBSixFQURvRjtVQUFBLENBQXRGLENBQUEsQ0FBQTtpQkFFQSxLQUFDLENBQUEsRUFBRCxDQUFJO0FBQUEsWUFBQSxFQUFBLEVBQUksa0JBQUo7QUFBQSxZQUF3QixPQUFBLEVBQU8sUUFBL0I7QUFBQSxZQUF5QyxNQUFBLEVBQVEsWUFBakQ7V0FBSixFQUg0QjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEs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

//# sourceURL=/home/champ/.atom/packages/atom-cscope/lib/views/list-view.coffee
