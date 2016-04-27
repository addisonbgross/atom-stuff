(function() {
  var $, AtomCscopeView, InputView, ListView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('space-pen'), $ = _ref.$, View = _ref.View;

  InputView = require('./input-view');

  ListView = require('./list-view');

  module.exports = AtomCscopeView = (function(_super) {
    __extends(AtomCscopeView, _super);

    function AtomCscopeView() {
      return AtomCscopeView.__super__.constructor.apply(this, arguments);
    }

    AtomCscopeView.content = function() {
      return this.div({
        "class": "atom-cscope"
      }, (function(_this) {
        return function() {
          _this.div({
            "class": "header"
          }, function() {
            _this.div({
              "class": "inline-block spaced-item"
            }, function() {
              return _this.button({
                "class": "btn just-btn icon icon-zap",
                id: "refresh"
              });
            });
            _this.h4({
              "class": "inline-block"
            }, "Atom Cscope");
            _this.h6({
              "class": "inline-block",
              id: 'result-count'
            }, "0 results");
            return _this.span({
              "class": 'loading loading-spinner-tiny inline-block no-show'
            });
          });
          _this.subview('inputView', new InputView());
          return _this.subview('listView', new ListView());
        };
      })(this));
    };

    AtomCscopeView.prototype.initialize = function() {
      this.on('core:move-up', (function(_this) {
        return function() {
          _this.listView.keyUsed = true;
          return _this.listView.selectPreviousItemView();
        };
      })(this));
      this.on('core:move-down', (function(_this) {
        return function() {
          _this.listView.keyUsed = true;
          return _this.listView.selectNextItemView();
        };
      })(this));
      this.on('core:move-to-top', (function(_this) {
        return function() {
          _this.listView.keyUsed = true;
          return _this.listView.selectFirstItemView();
        };
      })(this));
      return this.on('core:move-to-bottom', (function(_this) {
        return function() {
          _this.listView.keyUsed = true;
          return _this.listView.selectLastItemView();
        };
      })(this));
    };

    AtomCscopeView.prototype.clearItems = function() {
      return this.listView.clearItems();
    };

    AtomCscopeView.prototype.applyResultSet = function(resultSet) {
      this.resultSet = resultSet != null ? resultSet : [];
      this.find('h6#result-count').text(resultSet.results.length + ' results');
      return this.listView.setItems(this.resultSet.results);
    };

    AtomCscopeView.prototype.onSearch = function(callback) {
      return this.inputView.onSearch(callback);
    };

    AtomCscopeView.prototype.removeLoading = function() {
      var callback;
      callback = (function(_this) {
        return function() {
          return _this.find('span.loading').addClass('no-show');
        };
      })(this);
      return setTimeout(callback, 600);
    };

    AtomCscopeView.prototype.showLoading = function() {
      var callback;
      callback = (function(_this) {
        return function() {
          return _this.find('span.loading').removeClass('no-show');
        };
      })(this);
      return setTimeout(callback, 10);
    };

    AtomCscopeView.prototype.onResultClick = function(callback) {
      return this.listView.onConfirm(callback);
    };

    AtomCscopeView.prototype.serialize = function() {};

    AtomCscopeView.prototype.destroy = function() {
      return this.element.remove();
    };

    AtomCscopeView.prototype.getElement = function() {
      return this.element;
    };

    return AtomCscopeView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1jc2NvcGUvbGliL3ZpZXdzL2F0b20tY3Njb3BlLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFZLE9BQUEsQ0FBUSxXQUFSLENBQVosRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBQUosQ0FBQTs7QUFBQSxFQUNBLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQURaLENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FGWCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHFDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGNBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLGFBQVA7T0FBTCxFQUEyQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3pCLFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLFFBQVA7V0FBTCxFQUFzQixTQUFBLEdBQUE7QUFDcEIsWUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sMEJBQVA7YUFBTCxFQUF3QyxTQUFBLEdBQUE7cUJBQ3RDLEtBQUMsQ0FBQSxNQUFELENBQVE7QUFBQSxnQkFBQSxPQUFBLEVBQU8sNEJBQVA7QUFBQSxnQkFBcUMsRUFBQSxFQUFJLFNBQXpDO2VBQVIsRUFEc0M7WUFBQSxDQUF4QyxDQUFBLENBQUE7QUFBQSxZQUVBLEtBQUMsQ0FBQSxFQUFELENBQUk7QUFBQSxjQUFBLE9BQUEsRUFBTyxjQUFQO2FBQUosRUFB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

//# sourceURL=/home/champ/.atom/packages/atom-cscope/lib/views/atom-cscope-view.coffee
