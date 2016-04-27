(function() {
  var TableHeaderView, TodoEmptyView, TodoView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  View = require('atom-space-pen-views').View;

  TableHeaderView = (function(_super) {
    __extends(TableHeaderView, _super);

    function TableHeaderView() {
      return TableHeaderView.__super__.constructor.apply(this, arguments);
    }

    TableHeaderView.content = function(showInTable, _arg) {
      var sortAsc, sortBy;
      if (showInTable == null) {
        showInTable = [];
      }
      sortBy = _arg.sortBy, sortAsc = _arg.sortAsc;
      return this.tr((function(_this) {
        return function() {
          var item, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = showInTable.length; _i < _len; _i++) {
            item = showInTable[_i];
            _results.push(_this.th(item, function() {
              if (item === sortBy && sortAsc) {
                _this.div({
                  "class": 'sort-asc icon-triangle-down active'
                });
              } else {
                _this.div({
                  "class": 'sort-asc icon-triangle-down'
                });
              }
              if (item === sortBy && !sortAsc) {
                return _this.div({
                  "class": 'sort-desc icon-triangle-up active'
                });
              } else {
                return _this.div({
                  "class": 'sort-desc icon-triangle-up'
                });
              }
            }));
          }
          return _results;
        };
      })(this));
    };

    return TableHeaderView;

  })(View);

  TodoView = (function(_super) {
    __extends(TodoView, _super);

    function TodoView() {
      this.openPath = __bind(this.openPath, this);
      return TodoView.__super__.constructor.apply(this, arguments);
    }

    TodoView.content = function(showInTable, todo) {
      if (showInTable == null) {
        showInTable = [];
      }
      return this.tr((function(_this) {
        return function() {
          var item, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = showInTable.length; _i < _len; _i++) {
            item = showInTable[_i];
            _results.push(_this.td(function() {
              switch (item) {
                case 'All':
                  return _this.span(todo.all);
                case 'Text':
                  return _this.span(todo.text);
                case 'Type':
                  return _this.i(todo.type);
                case 'Range':
                  return _this.i(todo.range);
                case 'Line':
                  return _this.i(todo.line);
                case 'Regex':
                  return _this.code(todo.regex);
                case 'File':
                  return _this.a(todo.file);
                case 'Tags':
                  return _this.i(todo.tags);
              }
            }));
          }
          return _results;
        };
      })(this));
    };

    TodoView.prototype.initialize = function(showInTable, todo) {
      this.todo = todo;
      return this.handleEvents();
    };

    TodoView.prototype.destroy = function() {
      return this.detach();
    };

    TodoView.prototype.handleEvents = function() {
      return this.on('click', 'td', this.openPath);
    };

    TodoView.prototype.openPath = function() {
      var todo;
      if (!(todo = this.todo)) {
        return;
      }
      return atom.workspace.open(todo.path, {
        split: 'left'
      }).then(function() {
        var position, textEditor;
        if (textEditor = atom.workspace.getActiveTextEditor()) {
          position = [todo.position[0][0], todo.position[0][1]];
          textEditor.setCursorBufferPosition(position, {
            autoscroll: false
          });
          return textEditor.scrollToCursorPosition({
            center: true
          });
        }
      });
    };

    return TodoView;

  })(View);

  TodoEmptyView = (function(_super) {
    __extends(TodoEmptyView, _super);

    function TodoEmptyView() {
      return TodoEmptyView.__super__.constructor.apply(this, arguments);
    }

    TodoEmptyView.content = function(showInTable) {
      if (showInTable == null) {
        showInTable = [];
      }
      return this.tr((function(_this) {
        return function() {
          return _this.td({
            colspan: showInTable.length
          }, function() {
            return _this.p("No results...");
          });
        };
      })(this));
    };

    return TodoEmptyView;

  })(View);

  module.exports = {
    TableHeaderView: TableHeaderView,
    TodoView: TodoView,
    TodoEmptyView: TodoEmptyView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvdG9kby1zaG93L2xpYi90b2RvLWl0ZW0tdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsOENBQUE7SUFBQTs7c0ZBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUVNO0FBQ0osc0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsZUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLFdBQUQsRUFBbUIsSUFBbkIsR0FBQTtBQUNSLFVBQUEsZUFBQTs7UUFEUyxjQUFjO09BQ3ZCO0FBQUEsTUFENEIsY0FBQSxRQUFRLGVBQUEsT0FDcEMsQ0FBQTthQUFBLElBQUMsQ0FBQSxFQUFELENBQUksQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNGLGNBQUEsd0JBQUE7QUFBQTtlQUFBLGtEQUFBO21DQUFBO0FBQ0UsMEJBQUEsS0FBQyxDQUFBLEVBQUQsQ0FBSSxJQUFKLEVBQVUsU0FBQSxHQUFBO0FBQ1IsY0FBQSxJQUFHLElBQUEsS0FBUSxNQUFSLElBQW1CLE9BQXRCO0FBQ0UsZ0JBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGtCQUFBLE9BQUEsRUFBTyxvQ0FBUDtpQkFBTCxDQUFBLENBREY7ZUFBQSxNQUFBO0FBR0UsZ0JBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGtCQUFBLE9BQUEsRUFBTyw2QkFBUDtpQkFBTCxDQUFBLENBSEY7ZUFBQTtBQUlBLGNBQUEsSUFBRyxJQUFBLEtBQVEsTUFBUixJQUFtQixDQUFBLE9BQXRCO3VCQUNFLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxrQkFBQSxPQUFBLEVBQU8sbUNBQVA7aUJBQUwsRUFERjtlQUFBLE1BQUE7dUJBR0UsS0FBQyxD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

//# sourceURL=/home/champ/.atom/packages/todo-show/lib/todo-item-view.coffee
