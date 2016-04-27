(function() {
  var CompositeDisposable, ShowTodoView, TodoCollection;

  CompositeDisposable = require('atom').CompositeDisposable;

  ShowTodoView = require('./todo-view');

  TodoCollection = require('./todo-collection');

  module.exports = {
    config: {
      findTheseTodos: {
        type: 'array',
        "default": ['FIXME', 'TODO', 'CHANGED', 'XXX', 'IDEA', 'HACK', 'NOTE', 'REVIEW'],
        items: {
          type: 'string'
        }
      },
      findUsingRegex: {
        description: 'Single regex used to find all todos. ${TODOS} is replaced with the findTheseTodos array.',
        type: 'string',
        "default": '/\\b(${TODOS}):?\\d*($|\\s.*$)/g'
      },
      ignoreThesePaths: {
        type: 'array',
        "default": ['**/node_modules/', '**/vendor/', '**/bower_components/'],
        items: {
          type: 'string'
        }
      },
      showInTable: {
        type: 'array',
        "default": ['Text', 'Type', 'File']
      },
      sortBy: {
        type: 'string',
        "default": 'Text',
        "enum": ['All', 'Text', 'Type', 'Range', 'Line', 'Regex', 'File', 'Tags']
      },
      sortAscending: {
        type: 'boolean',
        "default": true
      },
      openListInDirection: {
        type: 'string',
        "default": 'right',
        "enum": ['up', 'right', 'down', 'left', 'ontop']
      },
      rememberViewSize: {
        type: 'boolean',
        "default": true
      },
      saveOutputAs: {
        type: 'string',
        "default": 'List',
        "enum": ['List', 'Table']
      }
    },
    URI: {
      full: 'atom://todo-show/todos',
      open: 'atom://todo-show/open-todos',
      active: 'atom://todo-show/active-todos'
    },
    activate: function() {
      var collection;
      collection = new TodoCollection;
      collection.setAvailableTableItems(this.config.sortBy["enum"]);
      this.disposables = new CompositeDisposable;
      this.disposables.add(atom.commands.add('atom-workspace', {
        'todo-show:find-in-project': (function(_this) {
          return function() {
            return _this.show(_this.URI.full);
          };
        })(this),
        'todo-show:find-in-open-files': (function(_this) {
          return function() {
            return _this.show(_this.URI.open);
          };
        })(this)
      }));
      return this.disposables.add(atom.workspace.addOpener((function(_this) {
        return function(uriToOpen) {
          var scope;
          scope = (function() {
            switch (uriToOpen) {
              case this.URI.full:
                return 'full';
              case this.URI.open:
                return 'open';
              case this.URI.active:
                return 'active';
            }
          }).call(_this);
          if (scope) {
            collection.setSearchScope(scope);
            return new ShowTodoView(collection, uriToOpen);
          }
        };
      })(this)));
    },
    deactivate: function() {
      var _ref;
      return (_ref = this.disposables) != null ? _ref.dispose() : void 0;
    },
    destroyPaneItem: function() {
      var pane;
      pane = atom.workspace.paneForItem(this.showTodoView);
      if (!pane) {
        return false;
      }
      pane.destroyItem(this.showTodoView);
      if (pane.getItems().length === 0) {
        pane.destroy();
      }
      return true;
    },
    show: function(uri) {
      var direction, prevPane;
      prevPane = atom.workspace.getActivePane();
      direction = atom.config.get('todo-show.openListInDirection');
      if (this.destroyPaneItem()) {
        return;
      }
      if (direction === 'down') {
        if (prevPane.parent.orientation !== 'vertical') {
          prevPane.splitDown();
        }
      } else if (direction === 'up') {
        if (prevPane.parent.orientation !== 'vertical') {
          prevPane.splitUp();
        }
      }
      return atom.workspace.open(uri, {
        split: direction
      }).then((function(_this) {
        return function(showTodoView) {
          _this.showTodoView = showTodoView;
          return prevPane.activate();
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvdG9kby1zaG93L2xpYi9zaG93LXRvZG8uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlEQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGFBQVIsQ0FGZixDQUFBOztBQUFBLEVBR0EsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVIsQ0FIakIsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsY0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sT0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLENBQ1AsT0FETyxFQUVQLE1BRk8sRUFHUCxTQUhPLEVBSVAsS0FKTyxFQUtQLE1BTE8sRUFNUCxNQU5PLEVBT1AsTUFQTyxFQVFQLFFBUk8sQ0FEVDtBQUFBLFFBV0EsS0FBQSxFQUNFO0FBQUEsVUFBQSxJQUFBLEVBQU0sUUFBTjtTQVpGO09BREY7QUFBQSxNQWNBLGNBQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFhLDBGQUFiO0FBQUEsUUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLFFBRUEsU0FBQSxFQUFTLGtDQUZUO09BZkY7QUFBQSxNQWtCQSxnQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sT0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLENBQ1Asa0JBRE8sRUFFUCxZQUZPLEVBR1Asc0JBSE8sQ0FEVDtBQUFBLFFBTUEsS0FBQSxFQUNFO0FBQUEsVUFBQSxJQUFBLEVBQU0sUUFBTjtTQVBGO09BbkJGO0FBQUEsTUEyQkEsV0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sT0FBTjtBQUFB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

//# sourceURL=/home/champ/.atom/packages/todo-show/lib/show-todo.coffee
