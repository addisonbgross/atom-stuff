(function() {
  var Emitter, TodoCollection, TodoModel, TodosMarkdown;

  Emitter = require('atom').Emitter;

  TodoModel = require('./todo-model');

  TodosMarkdown = require('./todo-markdown');

  module.exports = TodoCollection = (function() {
    function TodoCollection() {
      this.emitter = new Emitter;
      this.defaultKey = 'Text';
      this.scope = 'full';
      this.todos = [];
    }

    TodoCollection.prototype.onDidAddTodo = function(cb) {
      return this.emitter.on('did-add-todo', cb);
    };

    TodoCollection.prototype.onDidRemoveTodo = function(cb) {
      return this.emitter.on('did-remove-todo', cb);
    };

    TodoCollection.prototype.onDidClear = function(cb) {
      return this.emitter.on('did-clear-todos', cb);
    };

    TodoCollection.prototype.onDidStartSearch = function(cb) {
      return this.emitter.on('did-start-search', cb);
    };

    TodoCollection.prototype.onDidSearchPaths = function(cb) {
      return this.emitter.on('did-search-paths', cb);
    };

    TodoCollection.prototype.onDidFinishSearch = function(cb) {
      return this.emitter.on('did-finish-search', cb);
    };

    TodoCollection.prototype.onDidFailSearch = function(cb) {
      return this.emitter.on('did-fail-search', cb);
    };

    TodoCollection.prototype.onDidSortTodos = function(cb) {
      return this.emitter.on('did-sort-todos', cb);
    };

    TodoCollection.prototype.onDidFilterTodos = function(cb) {
      return this.emitter.on('did-filter-todos', cb);
    };

    TodoCollection.prototype.onDidChangeSearchScope = function(cb) {
      return this.emitter.on('did-change-scope', cb);
    };

    TodoCollection.prototype.clear = function() {
      this.cancelSearch();
      this.todos = [];
      return this.emitter.emit('did-clear-todos');
    };

    TodoCollection.prototype.addTodo = function(todo) {
      if (this.alreadyExists(todo)) {
        return;
      }
      this.todos.push(todo);
      return this.emitter.emit('did-add-todo', todo);
    };

    TodoCollection.prototype.getTodos = function() {
      return this.todos;
    };

    TodoCollection.prototype.getTodosCount = function() {
      return this.todos.length;
    };

    TodoCollection.prototype.sortTodos = function(_arg) {
      var sortAsc, sortBy, _ref;
      _ref = _arg != null ? _arg : {}, sortBy = _ref.sortBy, sortAsc = _ref.sortAsc;
      if (sortBy == null) {
        sortBy = this.defaultKey;
      }
      this.todos = this.todos.sort(function(a, b) {
        var aVal, bVal, comp, _ref1;
        aVal = a.get(sortBy);
        bVal = b.get(sortBy);
        if (aVal === bVal) {
          _ref1 = [a.get(this.defaultKey), b.get(this.defaultKey)], aVal = _ref1[0], bVal = _ref1[1];
        }
        if (a.keyIsNumber(sortBy)) {
          comp = parseInt(aVal) - parseInt(bVal);
        } else {
          comp = aVal.localeCompare(bVal);
        }
        if (sortAsc) {
          return comp;
        } else {
          return -comp;
        }
      });
      if (this.filter) {
        return this.filterTodos(this.filter);
      }
      return this.emitter.emit('did-sort-todos', this.todos);
    };

    TodoCollection.prototype.filterTodos = function(filter) {
      var result;
      this.filter = filter;
      if (filter) {
        result = this.todos.filter(function(todo) {
          return todo.contains(filter);
        });
      } else {
        result = this.todos;
      }
      return this.emitter.emit('did-filter-todos', result);
    };

    TodoCollection.prototype.getAvailableTableItems = function() {
      return this.availableItems;
    };

    TodoCollection.prototype.setAvailableTableItems = function(availableItems) {
      this.availableItems = availableItems;
    };

    TodoCollection.prototype.isSearching = function() {
      return this.searching;
    };

    TodoCollection.prototype.getSearchScope = function() {
      return this.scope;
    };

    TodoCollection.prototype.setSearchScope = function(scope) {
      return this.emitter.emit('did-change-scope', this.scope = scope);
    };

    TodoCollection.prototype.toggleSearchScope = function() {
      var scope;
      scope = (function() {
        switch (this.scope) {
          case 'full':
            return 'open';
          case 'open':
            return 'active';
          default:
            return 'full';
        }
      }).call(this);
      this.setSearchScope(scope);
      return scope;
    };

    TodoCollection.prototype.alreadyExists = function(newTodo) {
      var properties;
      properties = ['range', 'path'];
      return this.todos.some(function(todo) {
        return properties.every(function(prop) {
          if (todo[prop] === newTodo[prop]) {
            return true;
          }
        });
      });
    };

    TodoCollection.prototype.makeRegexObj = function(regexStr) {
      var flags, pattern, _ref, _ref1;
      if (regexStr == null) {
        regexStr = '';
      }
      pattern = (_ref = regexStr.match(/\/(.+)\//)) != null ? _ref[1] : void 0;
      flags = (_ref1 = regexStr.match(/\/(\w+$)/)) != null ? _ref1[1] : void 0;
      if (!pattern) {
        this.emitter.emit('did-fail-search', "Invalid regex: " + (regexStr || 'empty'));
        return false;
      }
      return new RegExp(pattern, flags);
    };

    TodoCollection.prototype.createRegex = function(regexStr, todoList) {
      if (!(Object.prototype.toString.call(todoList) === '[object Array]' && todoList.length > 0 && regexStr)) {
        this.emitter.emit('did-fail-search', "Invalid todo search regex");
        return false;
      }
      return this.makeRegexObj(regexStr.replace('${TODOS}', todoList.join('|')));
    };

    TodoCollection.prototype.fetchRegexItem = function(regexp, regex) {
      var options;
      if (regex == null) {
        regex = '';
      }
      options = {
        paths: this.getIgnorePaths(),
        onPathsSearched: (function(_this) {
          return function(nPaths) {
            if (_this.isSearching()) {
              return _this.emitter.emit('did-search-paths', nPaths);
            }
          };
        })(this)
      };
      return atom.workspace.scan(regexp, options, (function(_this) {
        return function(result, error) {
          var match, _i, _len, _ref, _results;
          if (error) {
            console.debug(error.message);
          }
          if (!result) {
            return;
          }
          _ref = result.matches;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            match = _ref[_i];
            _results.push(_this.addTodo(new TodoModel({
              all: match.lineText,
              text: match.matchText,
              path: result.filePath,
              position: match.range,
              regex: regex,
              regexp: regexp
            })));
          }
          return _results;
        };
      })(this));
    };

    TodoCollection.prototype.fetchOpenRegexItem = function(regexp, regex, activeEditorOnly) {
      var editor, editors, _i, _len, _ref;
      if (regex == null) {
        regex = '';
      }
      editors = [];
      if (activeEditorOnly) {
        if (editor = (_ref = atom.workspace.getPanes()[0]) != null ? _ref.getActiveEditor() : void 0) {
          editors = [editor];
        }
      } else {
        editors = atom.workspace.getTextEditors();
      }
      for (_i = 0, _len = editors.length; _i < _len; _i++) {
        editor = editors[_i];
        editor.scan(regexp, (function(_this) {
          return function(match, error) {
            var range;
            if (error) {
              console.debug(error.message);
            }
            if (!match) {
              return;
            }
            range = [[match.computedRange.start.row, match.computedRange.start.column], [match.computedRange.end.row, match.computedRange.end.column]];
            return _this.addTodo(new TodoModel({
              all: match.lineText,
              text: match.matchText,
              path: editor.getPath(),
              position: range,
              regex: regex,
              regexp: regexp
            }));
          };
        })(this));
      }
      return Promise.resolve();
    };

    TodoCollection.prototype.search = function() {
      var regex, regexp;
      this.clear();
      this.searching = true;
      this.emitter.emit('did-start-search');
      if (!(regexp = this.createRegex(regex = atom.config.get('todo-show.findUsingRegex'), atom.config.get('todo-show.findTheseTodos')))) {
        return;
      }
      this.searchPromise = (function() {
        switch (this.scope) {
          case 'open':
            return this.fetchOpenRegexItem(regexp, regex, false);
          case 'active':
            return this.fetchOpenRegexItem(regexp, regex, true);
          default:
            return this.fetchRegexItem(regexp, regex);
        }
      }).call(this);
      return this.searchPromise.then((function(_this) {
        return function() {
          _this.searching = false;
          return _this.emitter.emit('did-finish-search');
        };
      })(this))["catch"]((function(_this) {
        return function(err) {
          _this.searching = false;
          return _this.emitter.emit('did-fail-search', err);
        };
      })(this));
    };

    TodoCollection.prototype.getIgnorePaths = function() {
      var ignore, ignores, _i, _len, _results;
      ignores = atom.config.get('todo-show.ignoreThesePaths');
      if (ignores == null) {
        return ['*'];
      }
      if (Object.prototype.toString.call(ignores) !== '[object Array]') {
        this.emitter.emit('did-fail-search', "ignoreThesePaths must be an array");
        return ['*'];
      }
      _results = [];
      for (_i = 0, _len = ignores.length; _i < _len; _i++) {
        ignore = ignores[_i];
        _results.push("!" + ignore);
      }
      return _results;
    };

    TodoCollection.prototype.getMarkdown = function() {
      var todosMarkdown;
      todosMarkdown = new TodosMarkdown;
      return todosMarkdown.markdown(this.getTodos());
    };

    TodoCollection.prototype.cancelSearch = function() {
      var _ref;
      return (_ref = this.searchPromise) != null ? typeof _ref.cancel === "function" ? _ref.cancel() : void 0 : void 0;
    };

    return TodoCollection;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvdG9kby1zaG93L2xpYi90b2RvLWNvbGxlY3Rpb24uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlEQUFBOztBQUFBLEVBQUMsVUFBVyxPQUFBLENBQVEsTUFBUixFQUFYLE9BQUQsQ0FBQTs7QUFBQSxFQUVBLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQUZaLENBQUE7O0FBQUEsRUFHQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxpQkFBUixDQUhoQixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsd0JBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsVUFBRCxHQUFjLE1BRGQsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxNQUZULENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxLQUFELEdBQVMsRUFIVCxDQURXO0lBQUEsQ0FBYjs7QUFBQSw2QkFNQSxZQUFBLEdBQWMsU0FBQyxFQUFELEdBQUE7YUFBUSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxjQUFaLEVBQTRCLEVBQTVCLEVBQVI7SUFBQSxDQU5kLENBQUE7O0FBQUEsNkJBT0EsZUFBQSxHQUFpQixTQUFDLEVBQUQsR0FBQTthQUFRLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLGlCQUFaLEVBQStCLEVBQS9CLEVBQVI7SUFBQSxDQVBqQixDQUFBOztBQUFBLDZCQVFBLFVBQUEsR0FBWSxTQUFDLEVBQUQsR0FBQTthQUFRLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLGlCQUFaLEVBQStCLEVBQS9CLEVBQVI7SUFBQSxDQVJaLENBQUE7O0FB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

//# sourceURL=/home/champ/.atom/packages/todo-show/lib/todo-collection.coffee
