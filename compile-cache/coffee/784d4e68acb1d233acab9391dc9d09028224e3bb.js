(function() {
  var ShowTodoView, TodosCollection, path;

  path = require('path');

  ShowTodoView = require('../lib/todo-view');

  TodosCollection = require('../lib/todo-collection');

  describe("Show Todo View", function() {
    var collection, showTodoView, _ref;
    _ref = [], showTodoView = _ref[0], collection = _ref[1];
    beforeEach(function() {
      var uri;
      atom.config.set('todo-show.findTheseTodos', ['TODO']);
      atom.config.set('todo-show.findUsingRegex', '/\\b(${TODOS}):?\\d*($|\\s.*$)/g');
      atom.project.setPaths([path.join(__dirname, 'fixtures/sample1')]);
      collection = new TodosCollection;
      uri = 'atom://todo-show/todos';
      showTodoView = new ShowTodoView(collection, uri);
      return waitsFor(function() {
        return !showTodoView.loading;
      });
    });
    describe("View properties", function() {
      it("has a title, uri, etc.", function() {
        expect(showTodoView.getIconName()).toEqual('checklist');
        expect(showTodoView.getURI()).toEqual('atom://todo-show/todos');
        return expect(showTodoView.find('.btn-group')).toExist();
      });
      return it("updates view title", function() {
        var count;
        count = showTodoView.collection.getTodosCount();
        expect(showTodoView.getTitle()).toBe("Todo Show: " + count + " results");
        showTodoView.collection.search();
        expect(showTodoView.getTitle()).toBe("Todo Show: ...");
        waitsFor(function() {
          return !showTodoView.loading;
        });
        return runs(function() {
          expect(showTodoView.getTitle()).toBe("Todo Show: " + count + " results");
          showTodoView.collection.todos = ['a single todo'];
          return expect(showTodoView.getTitle()).toBe("Todo Show: 1 result");
        });
      });
    });
    return describe("Automatic update of todos", function() {
      it("refreshes on save", function() {
        waitsForPromise(function() {
          return atom.workspace.open('temp.txt');
        });
        return runs(function() {
          var editor;
          editor = atom.workspace.getActiveTextEditor();
          expect(showTodoView.getTodos()).toHaveLength(3);
          editor.setText("# TODO: Test");
          editor.save();
          waitsFor(function() {
            return !showTodoView.loading;
          });
          return runs(function() {
            expect(showTodoView.getTodos()).toHaveLength(4);
            editor.setText("");
            editor.save();
            waitsFor(function() {
              return !showTodoView.loading;
            });
            return runs(function() {
              return expect(showTodoView.getTodos()).toHaveLength(3);
            });
          });
        });
      });
      it("updates on search scope change", function() {
        expect(showTodoView.loading).toBe(false);
        expect(collection.getSearchScope()).toBe('full');
        expect(collection.toggleSearchScope()).toBe('open');
        expect(showTodoView.loading).toBe(true);
        waitsFor(function() {
          return !showTodoView.loading;
        });
        return runs(function() {
          expect(collection.toggleSearchScope()).toBe('active');
          expect(showTodoView.loading).toBe(true);
          waitsFor(function() {
            return !showTodoView.loading;
          });
          return runs(function() {
            expect(collection.toggleSearchScope()).toBe('full');
            return expect(showTodoView.loading).toBe(true);
          });
        });
      });
      return it("handles search scope; full, open, active", function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample.c');
        });
        return runs(function() {
          var pane;
          pane = atom.workspace.getActivePane();
          expect(showTodoView.getTodos()).toHaveLength(3);
          collection.setSearchScope('open');
          waitsFor(function() {
            return !showTodoView.loading;
          });
          return runs(function() {
            expect(showTodoView.getTodos()).toHaveLength(1);
            waitsForPromise(function() {
              return atom.workspace.open('temp.txt');
            });
            return runs(function() {
              collection.setSearchScope('active');
              waitsFor(function() {
                return !showTodoView.loading;
              });
              return runs(function() {
                expect(showTodoView.getTodos()).toHaveLength(0);
                pane.activateItemAtIndex(0);
                waitsFor(function() {
                  return !showTodoView.loading;
                });
                return runs(function() {
                  return expect(showTodoView.getTodos()).toHaveLength(1);
                });
              });
            });
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvdG9kby1zaG93L3NwZWMvdG9kby12aWV3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1DQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUVBLFlBQUEsR0FBZSxPQUFBLENBQVEsa0JBQVIsQ0FGZixDQUFBOztBQUFBLEVBR0EsZUFBQSxHQUFrQixPQUFBLENBQVEsd0JBQVIsQ0FIbEIsQ0FBQTs7QUFBQSxFQUtBLFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBLEdBQUE7QUFDekIsUUFBQSw4QkFBQTtBQUFBLElBQUEsT0FBNkIsRUFBN0IsRUFBQyxzQkFBRCxFQUFlLG9CQUFmLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLEdBQUE7QUFBQSxNQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQkFBaEIsRUFBNEMsQ0FBQyxNQUFELENBQTVDLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDBCQUFoQixFQUE0QyxrQ0FBNUMsQ0FEQSxDQUFBO0FBQUEsTUFHQSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBc0IsQ0FBQyxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsa0JBQXJCLENBQUQsQ0FBdEIsQ0FIQSxDQUFBO0FBQUEsTUFJQSxVQUFBLEdBQWEsR0FBQSxDQUFBLGVBSmIsQ0FBQTtBQUFBLE1BS0EsR0FBQSxHQUFNLHdCQUxOLENBQUE7QUFBQSxNQU1BLFlBQUEsR0FBbUIsSUFBQSxZQUFBLENBQWEsVUFBYixFQUF5QixHQUF6QixDQU5uQixDQUFBO2FBT0EsUUFBQSxDQUFTLFNBQUEs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

//# sourceURL=/home/champ/.atom/packages/todo-show/spec/todo-view-spec.coffee
