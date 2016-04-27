(function() {
  var Emitter, TodoModel, maxLength, _;

  Emitter = require('atom').Emitter;

  _ = require('underscore-plus');

  maxLength = 120;

  module.exports = TodoModel = (function() {
    function TodoModel(match, _arg) {
      var plain;
      plain = (_arg != null ? _arg : []).plain;
      if (plain) {
        return _.extend(this, match);
      }
      this.handleScanMatch(match);
    }

    TodoModel.prototype.getAllKeys = function() {
      return atom.config.get('todo-show.showInTable') || ['Text'];
    };

    TodoModel.prototype.get = function(key) {
      var value;
      if (key == null) {
        key = '';
      }
      if (value = this[key.toLowerCase()]) {
        return value;
      }
      return this.text || 'No details';
    };

    TodoModel.prototype.getMarkdown = function(key) {
      var value;
      if (key == null) {
        key = '';
      }
      if (!(value = this[key.toLowerCase()])) {
        return '';
      }
      switch (key) {
        case 'All':
          return " " + value;
        case 'Text':
          return " " + value;
        case 'Type':
          return " __" + value + "__";
        case 'Range':
          return " _:" + value + "_";
        case 'Line':
          return " _:" + value + "_";
        case 'Regex':
          return " _'" + value + "'_";
        case 'File':
          return " [" + value + "](" + value + ")";
        case 'Tags':
          return " _" + value + "_";
      }
    };

    TodoModel.prototype.getMarkdownArray = function(keys) {
      var key, _i, _len, _ref, _results;
      _ref = keys || this.getAllKeys();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        _results.push(this.getMarkdown(key));
      }
      return _results;
    };

    TodoModel.prototype.keyIsNumber = function(key) {
      return key === 'Range' || key === 'Line';
    };

    TodoModel.prototype.contains = function(string) {
      var item, key, _i, _len, _ref;
      if (string == null) {
        string = '';
      }
      _ref = this.getAllKeys();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        if (!(item = this.get(key))) {
          break;
        }
        if (item.indexOf(string) !== -1) {
          return true;
        }
      }
      return false;
    };

    TodoModel.prototype.handleScanMatch = function(match) {
      var matchText, tag, _matchText, _ref;
      matchText = match.text || match.all || '';
      while ((_matchText = (_ref = match.regexp) != null ? _ref.exec(matchText) : void 0)) {
        if (!match.type) {
          match.type = _matchText[1];
        }
        matchText = _matchText.pop();
      }
      matchText = matchText.replace(/(\*\/|\?>|-->|#>|-}|\]\])\s*$/, '').trim();
      match.tags = ((function() {
        var _results;
        _results = [];
        while ((tag = /\s*#(\w+)[,.]?$/.exec(matchText))) {
          if (tag.length !== 2) {
            break;
          }
          matchText = matchText.slice(0, -tag.shift().length);
          _results.push(tag.shift());
        }
        return _results;
      })()).sort().join(', ');
      if (matchText.length >= maxLength) {
        matchText = "" + (matchText.substr(0, maxLength - 3)) + "...";
      }
      if (!(match.position && match.position.length > 0)) {
        match.position = [[0, 0]];
      }
      if (match.position.serialize) {
        match.range = match.position.serialize().toString();
      } else {
        match.range = match.position.toString();
      }
      match.text = matchText || "No details";
      match.line = (parseInt(match.range.split(',')[0]) + 1).toString();
      if (match.file == null) {
        match.file = atom.project.relativize(match.path);
      }
      match.regex = match.regex.replace('${TODOS}', match.type);
      return _.extend(this, match);
    };

    return TodoModel;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvdG9kby1zaG93L2xpYi90b2RvLW1vZGVsLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnQ0FBQTs7QUFBQSxFQUFDLFVBQVcsT0FBQSxDQUFRLE1BQVIsRUFBWCxPQUFELENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBREosQ0FBQTs7QUFBQSxFQUdBLFNBQUEsR0FBWSxHQUhaLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxtQkFBQyxLQUFELEVBQVEsSUFBUixHQUFBO0FBQ1gsVUFBQSxLQUFBO0FBQUEsTUFEb0Isd0JBQUQsT0FBVSxJQUFULEtBQ3BCLENBQUE7QUFBQSxNQUFBLElBQWdDLEtBQWhDO0FBQUEsZUFBTyxDQUFDLENBQUMsTUFBRixDQUFTLElBQVQsRUFBZSxLQUFmLENBQVAsQ0FBQTtPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsZUFBRCxDQUFpQixLQUFqQixDQURBLENBRFc7SUFBQSxDQUFiOztBQUFBLHdCQUlBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFDVixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUJBQWhCLENBQUEsSUFBNEMsQ0FBQyxNQUFELEVBRGxDO0lBQUEsQ0FKWixDQUFBOztBQUFBLHdCQU9BLEdBQUEsR0FBSyxTQUFDLEdBQUQsR0FBQTtBQUNILFVBQUEsS0FBQTs7UUFESSxNQUFNO09BQ1Y7QUFBQSxNQUFBLElBQWdCLEtBQUEsR0FBUSxJQUFFLENBQUEsR0FBRyxDQUFDLFdBQUosQ0FBQSxDQUFBLENBQTFCO0FBQUEsZUFBTyxLQUFQLENBQUE7T0FBQTthQUNBLElBQUMsQ0FBQSxJQUFELElBQVMsYUFGTjtJQUFBLENBUEwsQ0FBQTs7QUFBQSx3QkFXQSxXQUFBLEdBQWEsU0FBQyxHQUFELEdBQUE7QUFDWCxVQUFBLEtBQUE7O1FBRFksTUFBTTtPQUNsQjtBQUFBLE1BQUEsSUFBQSxDQUFBLENBQWlCLEtBQUEsR0FBUSxJQUFFLENBQUEsR0FBRyxDQUFDLFdBQUosQ0FBQSxDQUFBLENBQVYsQ0FBakI7QUFBQSxlQUFPLEVBQVAsQ0FBQTtPQUFBO0FBQ0EsY0FBTyxHQUFQO0FBQUEsYUFDTyxLQURQO2lCQUNtQixHQUFBLEdBQUcsTUFEdEI7QUFBQSxhQUVPLE1BRlA7aUJBRW9CLEdBQUEsR0FBRyxNQUZ2QjtBQUFBLGFBR08sTUFIUDtpQkFHb0IsS0FBQSxHQUFLLEtBQUwsR0FBVyxLQUgvQjtBQUFBLGFBSU8sT0FKUDtpQkFJcUIsS0FBQSxHQUFLLEtBQUwsR0FBVyxJQUpoQztBQUFBLGFBS08sTUFMUDtpQkFLb0IsS0FBQSxHQUFLLEtBQUwsR0FBVyxJQUwvQjtBQUFBLGFBTU8sT0FOUDtpQkFNcUIsS0FBQSxHQUFLLEtBQUwsR0FBVyxLQU5oQztBQUFBLGFBT08sTUFQUDtpQkFPb0IsSUFBQSxHQUFJLEtBQUosR0FBVSxJQUFWLEdBQWMsS0FBZCxHQUFvQixJQVB4QztBQUFBLGFBUU8sTUFSUDtpQkFRb0IsSUFBQSxHQUFJLEtBQUosR0FBVSxJQVI5QjtBQUFBLE9BRlc7SUFBQSxDQVhiLENBQUE7O0FBQUEsd0JBdUJBLGdCQUFBLEdBQWtCLFNBQUMsSUFBRCxHQUFBO0FBQ2hCLFVBQUEsNkJBQUE7QUFBQTtBQUFBO1dBQUEsMkNBQUE7dUJBQUE7QUFDRSxzQkFBQSxJQUFDLENBQUEsV0FBRCxDQUFhLEdBQWIsRUFBQSxDQURGO0FBQUE7c0JBRGdCO0lBQUEsQ0F2QmxCLENBQUE7O0FBQUEsd0JBMkJBLFdBQUEsR0FBYSxTQUFDLEdBQUQsR0FBQTthQUNYLEdBQUEsS0FBUSxPQUFSLElBQUEsR0FBQSxLQUFpQixPQUROO0lBQUEsQ0EzQmIsQ0FBQTs7QUFBQSx3QkE4QkEsUUFBQSxHQUFVLFNBQUMsTUFBRCxHQUFBO0FBQ1IsVUFBQSx5QkFBQTs7UUFEUyxTQUFTO09BQ2xCO0FBQUE7QUFBQSxXQUFBLDJDQUFBO3VCQUFBO0FBQ0UsUUFBQSxJQUFBLENBQUEsQ0FBYSxJQUFBLEdBQU8sSUFBQyxDQUFBLEdBQUQsQ0FBSyxHQUFMLENBQVAsQ0FBYjtBQUFBLGdCQUFBO1NBQUE7QUFDQSxRQUFBLElBQWUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxNQUFiLENBQUEsS0FBMEIsQ0FBQSxDQUF6QztBQUFBLGlCQUFPLElBQVAsQ0FBQTtTQUZGO0FBQUEsT0FBQTthQUdBLE1BSlE7SUFBQSxDQTlCVixDQUFBOztBQUFBLHdCQW9DQSxlQUFBLEdBQWlCLFNBQUMsS0FBRCxHQUFBO0FBQ2YsVUFBQSxnQ0FBQTtBQUFBLE1BQUEsU0FBQSxHQUFZLEtBQUssQ0FBQyxJQUFOLElBQWMsS0FBSyxDQUFDLEdBQXBCLElBQTJCLEVBQXZDLENBQUE7QUFJQSxhQUFNLENBQUMsVUFBQSx1Q0FBeUIsQ0FBRSxJQUFkLENBQW1CLFNBQW5CLFVBQWQsQ0FBTixHQUFBO0FBRUUsUUFBQSxJQUFBLENBQUEsS0FBdUMsQ0FBQyxJQUF4QztBQUFBLFVBQUEsS0FBSyxDQUFDLElBQU4sR0FBYSxVQUFXLENBQUEsQ0FBQSxDQUF4QixDQUFBO1NBQUE7QUFBQSxRQUVBLFNBQUEsR0FBWSxVQUFVLENBQUMsR0FBWCxDQUFBLENBRlosQ0FGRjtNQUFBLENBSkE7QUFBQSxNQVdBLFNBQUEsR0FBWSxTQUFTLENBQUMsT0FBVixDQUFrQiwrQkFBbEIsRUFBbUQsRUFBbkQsQ0FBc0QsQ0FBQyxJQUF2RCxDQUFBLENBWFosQ0FBQTtBQUFBLE1BY0EsS0FBSyxDQUFDLElBQU4sR0FBYTs7QUFBQztlQUFNLENBQUMsR0FBQSxHQUFNLGlCQUFpQixDQUFDLElBQWxCLENBQXVCLFNBQXZCLENBQVAsQ0FBTixHQUFBO0FBQ1osVUFBQSxJQUFTLEdBQUcsQ0FBQyxNQUFKLEtBQWdCLENBQXpCO0FBQUEsa0JBQUE7V0FBQTtBQUFBLFVBQ0EsU0FBQSxHQUFZLFNBQVMsQ0FBQyxLQUFWLENBQWdCLENBQWhCLEVBQW1CLENBQUEsR0FBSSxDQUFDLEtBQUosQ0FBQSxDQUFXLENBQUMsTUFBaEMsQ0FEWixDQUFBO0FBQUEsd0JBRUEsR0FBRyxDQUFDLEtBQUosQ0FBQSxFQUZBLENBRFk7UUFBQSxDQUFBOztVQUFELENBSVosQ0FBQyxJQUpXLENBQUEsQ0FJTCxDQUFDLElBSkksQ0FJQyxJQUpELENBZGIsQ0FBQTtBQXFCQSxNQUFBLElBQUcsU0FBUyxDQUFDLE1BQVYsSUFBb0IsU0FBdkI7QUFDRSxRQUFBLFNBQUEsR0FBWSxFQUFBLEdBQUUsQ0FBQyxTQUFTLENBQUMsTUFBVixDQUFpQixDQUFqQixFQUFvQixTQUFBLEdBQVksQ0FBaEMsQ0FBRCxDQUFGLEdBQXNDLEtBQWxELENBREY7T0FyQkE7QUF5QkEsTUFBQSxJQUFBLENBQUEsQ0FBZ0MsS0FBSyxDQUFDLFFBQU4sSUFBbUIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFmLEdBQXdCLENBQTNFLENBQUE7QUFBQSxRQUFBLEtBQUssQ0FBQyxRQUFOLEdBQWlCLENBQUMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFELENBQWpCLENBQUE7T0F6QkE7QUEwQkEsTUFBQSxJQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBbEI7QUFDRSxRQUFBLEtBQUssQ0FBQyxLQUFOLEdBQWMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxTQUFmLENBQUEsQ0FBMEIsQ0FBQyxRQUEzQixDQUFBLENBQWQsQ0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLEtBQUssQ0FBQyxLQUFOLEdBQWMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFmLENBQUEsQ0FBZCxDQUhGO09BMUJBO0FBQUEsTUErQkEsS0FBSyxDQUFDLElBQU4sR0FBYSxTQUFBLElBQWEsWUEvQjFCLENBQUE7QUFBQSxNQWdDQSxLQUFLLENBQUMsSUFBTixHQUFhLENBQUMsUUFBQSxDQUFTLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBWixDQUFrQixHQUFsQixDQUF1QixDQUFBLENBQUEsQ0FBaEMsQ0FBQSxHQUFzQyxDQUF2QyxDQUF5QyxDQUFDLFFBQTFDLENBQUEsQ0FoQ2IsQ0FBQTs7UUFpQ0EsS0FBSyxDQUFDLE9BQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFiLENBQXdCLEtBQUssQ0FBQyxJQUE5QjtPQWpDZDtBQUFBLE1Ba0NBLEtBQUssQ0FBQyxLQUFOLEdBQWMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFaLENBQW9CLFVBQXBCLEVBQWdDLEtBQUssQ0FBQyxJQUF0QyxDQWxDZCxDQUFBO2FBb0NBLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBVCxFQUFlLEtBQWYsRUFyQ2U7SUFBQSxDQXBDakIsQ0FBQTs7cUJBQUE7O01BUEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/todo-show/lib/todo-model.coffee
