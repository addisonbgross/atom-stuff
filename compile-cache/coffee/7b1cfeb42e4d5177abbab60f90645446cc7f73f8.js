(function() {
  var ResultModel, ResultSetModel;

  ResultModel = require('./result-model');

  module.exports = ResultSetModel = (function() {
    function ResultSetModel(keyword, response, cwd) {
      this.results = [];
      this.keyword = keyword;
      this.cwd = cwd;
      this.addResults(response);
    }

    ResultSetModel.prototype.addResults = function(response) {
      var line, result, _i, _len, _ref, _results;
      if (typeof response === 'undefined') {
        return;
      }
      _ref = response.split("\n");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        if (line === "") {
          continue;
        }
        result = new ResultModel(line, this.keyword, this.cwd);
        _results.push(this.results.push(result));
      }
      return _results;
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1jc2NvcGUvbGliL21vZGVscy9yZXN1bHQtc2V0LW1vZGVsLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwyQkFBQTs7QUFBQSxFQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FBZCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUNTLElBQUEsd0JBQUMsT0FBRCxFQUFVLFFBQVYsRUFBb0IsR0FBcEIsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxFQUFYLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsT0FEWCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsR0FBRCxHQUFPLEdBRlAsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFVBQUQsQ0FBWSxRQUFaLENBSEEsQ0FEVztJQUFBLENBQWI7O0FBQUEsNkJBTUEsVUFBQSxHQUFZLFNBQUMsUUFBRCxHQUFBO0FBQ1YsVUFBQSxzQ0FBQTtBQUFBLE1BQUEsSUFBVSxNQUFBLENBQUEsUUFBQSxLQUFtQixXQUE3QjtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQ0E7QUFBQTtXQUFBLDJDQUFBO3dCQUFBO0FBQ0UsUUFBQSxJQUFZLElBQUEsS0FBUSxFQUFwQjtBQUFBLG1CQUFBO1NBQUE7QUFBQSxRQUNBLE1BQUEsR0FBYSxJQUFBLFdBQUEsQ0FBWSxJQUFaLEVBQWtCLElBQUMsQ0FBQSxPQUFuQixFQUE0QixJQUFDLENBQUEsR0FBN0IsQ0FEYixDQUFBO0FBQUEsc0JBRUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsTUFBZCxFQUZBLENBREY7QUFBQTtzQkFGVTtJQUFBLENBTlosQ0FBQTs7QUFBQSw2QkFhQSxZQUFBLEdBQWMsU0FBQyxTQUFELEdBQUE7QUFDWixNQUFBLElBQUcsTUFBQSxDQUFBLFNBQUEsS0FBc0IsV0FBdEIsSUFBc0MsU0FBUyxDQUFDLE9BQVYsS0FBcUIsSUFBQyxDQUFBLE9BQS9EO2VBQ0UsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBZ0IsU0FBUyxDQUFDLE9BQTFCLEVBRGI7T0FEWTtJQUFBLENBYmQsQ0FBQTs7QUFBQSw2QkFpQkEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLGFBQU8sSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULEtBQW1CLENBQTFCLENBRE87SUFBQSxDQWpCVCxDQUFBOzswQkFBQTs7TUFKSixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/atom-cscope/lib/models/result-set-model.coffee
