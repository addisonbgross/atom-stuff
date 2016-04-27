(function() {
  var fs, path, temp;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp');

  describe('ShowTodo opening panes and executing commands', function() {
    var activationPromise, executeCommand, showTodoModule, showTodoPane, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1], showTodoModule = _ref[2], showTodoPane = _ref[3];
    executeCommand = function(callback) {
      var wasVisible;
      wasVisible = showTodoModule != null ? showTodoModule.showTodoView.isVisible() : void 0;
      atom.commands.dispatch(workspaceElement, 'todo-show:find-in-project');
      waitsForPromise(function() {
        return activationPromise;
      });
      return runs(function() {
        waitsFor(function() {
          if (wasVisible) {
            return !showTodoModule.showTodoView.isVisible();
          }
          return !showTodoModule.showTodoView.loading && showTodoModule.showTodoView.isVisible();
        });
        return runs(function() {
          showTodoPane = atom.workspace.paneForItem(showTodoModule.showTodoView);
          return callback();
        });
      });
    };
    beforeEach(function() {
      atom.project.setPaths([path.join(__dirname, 'fixtures/sample1')]);
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      return activationPromise = atom.packages.activatePackage('todo-show').then(function(opts) {
        return showTodoModule = opts.mainModule;
      });
    });
    describe('when the show-todo:find-in-project event is triggered', function() {
      it('attaches and then detaches the pane view', function() {
        expect(atom.packages.loadedPackages['todo-show']).toBeDefined();
        expect(workspaceElement.querySelector('.show-todo-preview')).not.toExist();
        return executeCommand(function() {
          expect(workspaceElement.querySelector('.show-todo-preview')).toExist();
          expect(showTodoPane.parent.orientation).toBe('horizontal');
          return executeCommand(function() {
            return expect(workspaceElement.querySelector('.show-todo-preview')).not.toExist();
          });
        });
      });
      it('can open in vertical split', function() {
        atom.config.set('todo-show.openListInDirection', 'down');
        return executeCommand(function() {
          expect(workspaceElement.querySelector('.show-todo-preview')).toExist();
          return expect(showTodoPane.parent.orientation).toBe('vertical');
        });
      });
      it('can open ontop of current view', function() {
        atom.config.set('todo-show.openListInDirection', 'ontop');
        return executeCommand(function() {
          expect(workspaceElement.querySelector('.show-todo-preview')).toExist();
          return expect(showTodoPane.parent.orientation).not.toExist();
        });
      });
      it('has visible elements in view', function() {
        return executeCommand(function() {
          var element;
          element = showTodoModule.showTodoView.find('td').last();
          expect(element.text()).toEqual('sample.js');
          return expect(element.isVisible()).toBe(true);
        });
      });
      it('persists pane width', function() {
        return executeCommand(function() {
          var newFlex, originalFlex;
          originalFlex = showTodoPane.getFlexScale();
          newFlex = originalFlex * 1.1;
          expect(typeof originalFlex).toEqual("number");
          expect(showTodoModule.showTodoView).toBeVisible();
          showTodoPane.setFlexScale(newFlex);
          return executeCommand(function() {
            expect(showTodoPane).not.toExist();
            expect(showTodoModule.showTodoView).not.toBeVisible();
            return executeCommand(function() {
              expect(showTodoPane.getFlexScale()).toEqual(newFlex);
              return showTodoPane.setFlexScale(originalFlex);
            });
          });
        });
      });
      it('does not persist pane width if asked not to', function() {
        atom.config.set('todo-show.rememberViewSize', false);
        return executeCommand(function() {
          var newFlex, originalFlex;
          originalFlex = showTodoPane.getFlexScale();
          newFlex = originalFlex * 1.1;
          expect(typeof originalFlex).toEqual("number");
          showTodoPane.setFlexScale(newFlex);
          return executeCommand(function() {
            return executeCommand(function() {
              expect(showTodoPane.getFlexScale()).not.toEqual(newFlex);
              return expect(showTodoPane.getFlexScale()).toEqual(originalFlex);
            });
          });
        });
      });
      it('persists horizontal pane height', function() {
        atom.config.set('todo-show.openListInDirection', 'down');
        return executeCommand(function() {
          var newFlex, originalFlex;
          originalFlex = showTodoPane.getFlexScale();
          newFlex = originalFlex * 1.1;
          expect(typeof originalFlex).toEqual("number");
          showTodoPane.setFlexScale(newFlex);
          return executeCommand(function() {
            expect(showTodoPane).not.toExist();
            return executeCommand(function() {
              expect(showTodoPane.getFlexScale()).toEqual(newFlex);
              return showTodoPane.setFlexScale(originalFlex);
            });
          });
        });
      });
      return it('can update tab bar title', function() {
        var getTitle;
        getTitle = function() {
          return showTodoModule.showTodoView.parents().find('.tab .title').text();
        };
        waitsForPromise(function() {
          return atom.packages.activatePackage('tabs');
        });
        return runs(function() {
          return executeCommand(function() {
            var count;
            count = showTodoModule.showTodoView.collection.getTodosCount();
            expect(getTitle()).toBe("Todo Show: " + count + " results");
            showTodoModule.showTodoView.collection.search();
            expect(getTitle()).toBe("Todo Show: ...");
            waitsFor(function() {
              return !showTodoModule.showTodoView.loading;
            });
            return runs(function() {
              return expect(getTitle()).toBe("Todo Show: " + count + " results");
            });
          });
        });
      });
    });
    describe('when save-as button is clicked', function() {
      it('saves the list in markdown and opens it', function() {
        var expectedFilePath, expectedOutput, outputPath;
        outputPath = temp.path({
          suffix: '.md'
        });
        expectedFilePath = atom.project.getDirectories()[0].resolve('../saved-output.md');
        expectedOutput = fs.readFileSync(expectedFilePath).toString();
        atom.config.set('todo-show.sortBy', 'Type');
        expect(fs.isFileSync(outputPath)).toBe(false);
        executeCommand(function() {
          spyOn(atom, 'showSaveDialogSync').andReturn(outputPath);
          return showTodoModule.showTodoView.saveAs();
        });
        waitsFor(function() {
          var _ref1;
          return fs.existsSync(outputPath) && ((_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0) === fs.realpathSync(outputPath);
        });
        return runs(function() {
          expect(fs.isFileSync(outputPath)).toBe(true);
          return expect(atom.workspace.getActiveTextEditor().getText()).toBe(expectedOutput);
        });
      });
      return it('saves another list sorted differently in markdown', function() {
        var outputPath;
        outputPath = temp.path({
          suffix: '.md'
        });
        atom.config.set('todo-show.findTheseTodos', ['TODO']);
        atom.config.set('todo-show.showInTable', ['Text', 'Type', 'File', 'Line']);
        atom.config.set('todo-show.sortBy', 'File');
        expect(fs.isFileSync(outputPath)).toBe(false);
        executeCommand(function() {
          spyOn(atom, 'showSaveDialogSync').andReturn(outputPath);
          return showTodoModule.showTodoView.saveAs();
        });
        waitsFor(function() {
          var _ref1;
          return fs.existsSync(outputPath) && ((_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0) === fs.realpathSync(outputPath);
        });
        return runs(function() {
          expect(fs.isFileSync(outputPath)).toBe(true);
          return expect(atom.workspace.getActiveTextEditor().getText()).toBe("- Comment in C __TODO__ [sample.c](sample.c) _:5_\n- This is the first todo __TODO__ [sample.js](sample.js) _:3_\n- This is the second todo __TODO__ [sample.js](sample.js) _:20_\n");
        });
      });
    });
    describe('when core:refresh is triggered', function() {
      return it('refreshes the list', function() {
        return executeCommand(function() {
          atom.commands.dispatch(workspaceElement.querySelector('.show-todo-preview'), 'core:refresh');
          expect(showTodoModule.showTodoView.loading).toBe(true);
          expect(showTodoModule.showTodoView.find('.markdown-spinner')).toBeVisible();
          waitsFor(function() {
            return !showTodoModule.showTodoView.loading;
          });
          return runs(function() {
            expect(showTodoModule.showTodoView.find('.markdown-spinner')).not.toBeVisible();
            return expect(showTodoModule.showTodoView.loading).toBe(false);
          });
        });
      });
    });
    return describe('when the show-todo:find-in-open-files event is triggered', function() {
      beforeEach(function() {
        atom.commands.dispatch(workspaceElement, 'todo-show:find-in-open-files');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          return waitsFor(function() {
            return !showTodoModule.showTodoView.loading && showTodoModule.showTodoView.isVisible();
          });
        });
      });
      it('does not show any results with no open files', function() {
        var element;
        element = showTodoModule.showTodoView.find('p').last();
        expect(showTodoModule.showTodoView.getTodos()).toHaveLength(0);
        expect(element.text()).toContain('No results...');
        return expect(element.isVisible()).toBe(true);
      });
      return it('only shows todos from open files', function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample.c');
        });
        waitsFor(function() {
          return !showTodoModule.showTodoView.loading;
        });
        return runs(function() {
          var todos;
          todos = showTodoModule.showTodoView.getTodos();
          expect(todos).toHaveLength(1);
          expect(todos[0].type).toBe('TODO');
          expect(todos[0].text).toBe('Comment in C');
          return expect(todos[0].file).toBe('sample.c');
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvdG9kby1zaG93L3NwZWMvc2hvdy10b2RvLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFJQSxRQUFBLENBQVMsK0NBQVQsRUFBMEQsU0FBQSxHQUFBO0FBQ3hELFFBQUEsdUZBQUE7QUFBQSxJQUFBLE9BQXNFLEVBQXRFLEVBQUMsMEJBQUQsRUFBbUIsMkJBQW5CLEVBQXNDLHdCQUF0QyxFQUFzRCxzQkFBdEQsQ0FBQTtBQUFBLElBSUEsY0FBQSxHQUFpQixTQUFDLFFBQUQsR0FBQTtBQUNmLFVBQUEsVUFBQTtBQUFBLE1BQUEsVUFBQSw0QkFBYSxjQUFjLENBQUUsWUFBWSxDQUFDLFNBQTdCLENBQUEsVUFBYixDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLDJCQUF6QyxDQURBLENBQUE7QUFBQSxNQUVBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsa0JBQUg7TUFBQSxDQUFoQixDQUZBLENBQUE7YUFHQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsUUFBQSxRQUFBLENBQVMsU0FBQSxHQUFBO0FBQ1AsVUFBQSxJQUFtRCxVQUFuRDtBQUFBLG1CQUFPLENBQUEsY0FBZSxDQUFDLFlBQVksQ0FBQyxTQUE1QixDQUFBLENBQVIsQ0FBQTtXQUFBO2lCQUNBLENBQUEsY0FBZSxDQUFDLFlBQVksQ0FBQyxPQUE3QixJQUF5QyxjQUFj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

//# sourceURL=/home/champ/.atom/packages/todo-show/spec/show-todo-spec.coffee
