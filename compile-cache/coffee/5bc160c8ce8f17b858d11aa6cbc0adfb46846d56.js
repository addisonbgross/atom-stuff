(function() {
  var ResultItemView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('space-pen').View;

  module.exports = ResultItemView = (function(_super) {
    __extends(ResultItemView, _super);

    function ResultItemView() {
      return ResultItemView.__super__.constructor.apply(this, arguments);
    }

    ResultItemView.content = function() {
      return this.li({
        "class": 'result-item'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'inline-block',
            style: 'margin-right: 0px'
          }, function() {
            return _this.span({
              "class": 'file-name'
            });
          });
          return _this.div({
            "class": 'inline-block',
            outlet: 'fileDetails'
          }, function() {
            _this.span(":");
            _this.span({
              "class": 'line-number bold'
            });
            _this.span({
              "class": 'gap'
            });
            _this.span({
              "class": 'highlight function-name'
            });
            _this.span({
              "class": 'gap'
            });
            return _this.div({
              "class": 'inline-block code-line'
            }, function() {});
          });
        };
      })(this));
    };

    ResultItemView.setup = function(result) {
      var item, resultItem;
      resultItem = new this;
      item = resultItem.containingView();
      item.data('result-item', result);
      if (!result.isJustFile) {
        item.find('.file-name').text(result.fileName);
        item.find('.line-number').text(result.lineNumber);
        item.find('.function-name').text(result.functionName);
        item.find('.code-line').html(result.htmlLineText);
      } else {
        item.find('.file-name').html(result.htmlFileName);
        resultItem.fileDetails.remove();
      }
      return resultItem;
    };

    ResultItemView.prototype.getResultItem = function() {
      return this.containingView().data('result-item');
    };

    return ResultItemView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1jc2NvcGUvbGliL3ZpZXdzL3Jlc3VsdC1pdGVtLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9CQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxXQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHFDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGNBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEVBQUQsQ0FBSTtBQUFBLFFBQUEsT0FBQSxFQUFPLGFBQVA7T0FBSixFQUEyQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3pCLFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLGNBQVA7QUFBQSxZQUF1QixLQUFBLEVBQU8sbUJBQTlCO1dBQUwsRUFBd0QsU0FBQSxHQUFBO21CQUN0RCxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsY0FBQSxPQUFBLEVBQU8sV0FBUDthQUFOLEVBRHNEO1VBQUEsQ0FBeEQsQ0FBQSxDQUFBO2lCQUVBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxjQUFQO0FBQUEsWUFBdUIsTUFBQSxFQUFRLGFBQS9CO1dBQUwsRUFBbUQsU0FBQSxHQUFBO0FBQ2pELFlBQUEsS0FBQyxDQUFBLElBQUQsQ0FBTSxHQUFOLENBQUEsQ0FBQTtBQUFBLFlBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLGNBQUEsT0FBQSxFQUFPLGtCQUFQO2FBQU4sQ0FEQSxDQUFBO0FBQUEsWUFFQSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsY0FBQSxPQUFBLEVBQU8sS0FBUDthQUFOLENBRkEsQ0FBQTtBQUFBLFlBR0EsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLGNBQUEsT0FBQSxFQUFPLHlCQUFQO2FBQU4sQ0FIQSxDQUFBO0FBQUEsWUFJQSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsY0FBQSxPQUFBLEVBQU8sS0FBUDthQUFOLENBSkEsQ0FBQTttQkFLQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sd0JBQVA7YUFBTCxFQUFzQyxTQUFBLEdBQUEsQ0FBdEMsRUFOaUQ7VUFBQSxDQUFuRCxFQUh5QjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNCLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsSUFZQSxjQUFDLENBQUEsS0FBRCxHQUFRLFNBQUMsTUFBRCxHQUFBO0FBQ04sVUFBQSxnQkFBQTtBQUFBLE1BQUEsVUFBQSxHQUFhLEdBQUEsQ0FBQSxJQUFiLENBQUE7QUFBQSxNQUNBLElBQUEsR0FBTyxVQUFVLENBQUMsY0FBWCxDQUFBLENBRFAsQ0FBQTtBQUFBLE1BRUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxhQUFWLEVBQXlCLE1BQXpCLENBRkEsQ0FBQTtBQUdBLE1BQUEsSUFBRyxDQUFBLE1BQU8sQ0FBQyxVQUFYO0FBQ0UsUUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLFlBQVYsQ0FBdUIsQ0FBQyxJQUF4QixDQUE2QixNQUFNLENBQUMsUUFBcEMsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFJLENBQUMsSUFBTCxDQUFVLGNBQVYsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixNQUFNLENBQUMsVUFBdEMsQ0FEQSxDQUFBO0FBQUEsUUFFQSxJQUFJLENBQUMsSUFBTCxDQUFVLGdCQUFWLENBQTJCLENBQUMsSUFBNUIsQ0FBaUMsTUFBTSxDQUFDLFlBQXhDLENBRkEsQ0FBQTtBQUFBLFFBR0EsSUFBSSxDQUFDLElBQUwsQ0FBVSxZQUFWLENBQXVCLENBQUMsSUFBeEIsQ0FBNkIsTUFBTSxDQUFDLFlBQXBDLENBSEEsQ0FERjtPQUFBLE1BQUE7QUFNRSxRQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsWUFBVixDQUF1QixDQUFDLElBQXhCLENBQTZCLE1BQU0sQ0FBQyxZQUFwQyxDQUFBLENBQUE7QUFBQSxRQUNBLFVBQVUsQ0FBQyxXQUFXLENBQUMsTUFBdkIsQ0FBQSxDQURBLENBTkY7T0FIQTtBQVlBLGFBQU8sVUFBUCxDQWJNO0lBQUEsQ0FaUixDQUFBOztBQUFBLDZCQTJCQSxhQUFBLEdBQWUsU0FBQSxHQUFBO2FBQ2IsSUFBQyxDQUFBLGNBQUQsQ0FBQSxDQUFpQixDQUFDLElBQWxCLENBQXVCLGFBQXZCLEVBRGE7SUFBQSxDQTNCZixDQUFBOzswQkFBQTs7S0FEMkIsS0FIN0IsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/atom-cscope/lib/views/result-item-view.coffee
