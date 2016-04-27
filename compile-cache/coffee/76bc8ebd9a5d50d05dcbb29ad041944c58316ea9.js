(function() {
  var ResultModel, ResultSetModel;

  ResultModel = require('./result-model');

  module.exports = ResultSetModel = (function() {
    function ResultSetModel(keyword, response) {
      this.results = [];
      this.keyword = keyword;
      this.addResults(response);
    }

    ResultSetModel.prototype.addResults = function(response) {
      var line, result, _i, _len, _ref, _results;
      if (typeof response !== 'undefined') {
        _ref = response.split("\n");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          line = _ref[_i];
          if (line !== "") {
            result = new ResultModel(line, this.keyword);
            _results.push(this.results.push(result));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    ResultSetModel.prototype.addResultSet = function(resultSet) {
      if (typeof resultSet !== 'undefined' && resultSet.keyword === this.keyword) {
        return this.results = this.results.concat(resultSet.results);
      }
    };

    ResultSetModel.prototype.isEmpty = function() {
      return this.results.length === 0;
    };

    return ResultSetModel;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1jc2NvcGUvbGliL21vZGVscy9yZXN1bHQtc2V0LW1vZGVsLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwyQkFBQTs7QUFBQSxFQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FBZCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUNTLElBQUEsd0JBQUMsT0FBRCxFQUFVLFFBQVYsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxFQUFYLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsT0FEWCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsVUFBRCxDQUFZLFFBQVosQ0FGQSxDQURXO0lBQUEsQ0FBYjs7QUFBQSw2QkFLQSxVQUFBLEdBQVksU0FBQyxRQUFELEdBQUE7QUFDVixVQUFBLHNDQUFBO0FBQUEsTUFBQSxJQUFHLE1BQUEsQ0FBQSxRQUFBLEtBQW1CLFdBQXRCO0FBQ0U7QUFBQTthQUFBLDJDQUFBOzBCQUFBO0FBQ0UsVUFBQSxJQUFHLElBQUEsS0FBUSxFQUFYO0FBQ0UsWUFBQSxNQUFBLEdBQWEsSUFBQSxXQUFBLENBQVksSUFBWixFQUFrQixJQUFDLENBQUEsT0FBbkIsQ0FBYixDQUFBO0FBQUEsMEJBQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsTUFBZCxFQURBLENBREY7V0FBQSxNQUFBO2tDQUFBO1dBREY7QUFBQTt3QkFERjtPQURVO0lBQUEsQ0FMWixDQUFBOztBQUFBLDZCQVlBLFlBQUEsR0FBYyxTQUFDLFNBQUQsR0FBQTtBQUNaLE1BQUEsSUFBRyxNQUFBLENBQUEsU0FBQSxLQUFvQixXQUFwQixJQUFtQyxTQUFTLENBQUMsT0FBVixLQUFxQixJQUFDLENBQUEsT0FBNUQ7ZUFDRSxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFnQixTQUFTLENBQUMsT0FBMUIsRUFEYjtPQURZO0lBQUEsQ0FaZCxDQUFBOztBQUFBLDZCQWdCQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsYUFBTyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsS0FBbUIsQ0FBMUIsQ0FETztJQUFBLENBaEJULENBQUE7OzBCQUFBOztNQUpKLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/champ/.atom/packages/atom-cscope/lib/models/result-set-model.coffee
