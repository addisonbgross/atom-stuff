(function() {
  var MinimapPigments;

  MinimapPigments = require('../lib/minimap-pigments');

  describe("MinimapPigments", function() {
    var binding, colorBuffer, editBuffer, editor, minimap, minimapPackage, pigmentsProject, plugin, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], editor = _ref[1], minimapPackage = _ref[2], minimap = _ref[3], pigmentsProject = _ref[4], colorBuffer = _ref[5], plugin = _ref[6], binding = _ref[7];
    editBuffer = function(text, options) {
      var range;
      if (options == null) {
        options = {};
      }
      if (options.start != null) {
        if (options.end != null) {
          range = [options.start, options.end];
        } else {
          range = [options.start, options.start];
        }
        editor.setSelectedBufferRange(range);
      }
      editor.insertText(text);
      if (!options.noEvent) {
        return editor.getBuffer().emitter.emit('did-stop-changing');
      }
    };
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      waitsForPromise(function() {
        return atom.workspace.open('sample.sass').then(function(textEditor) {
          return editor = textEditor;
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          return pigmentsProject = pkg.mainModule.getProject();
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('minimap').then(function(pkg) {
          return minimapPackage = pkg.mainModule;
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('minimap-pigments').then(function(pkg) {
          return plugin = pkg.mainModule;
        });
      });
      runs(function() {
        minimap = minimapPackage.minimapForEditor(editor);
        return colorBuffer = pigmentsProject.colorBufferForEditor(editor);
      });
      waitsFor(function() {
        return binding = plugin.bindingForEditor(editor);
      });
      return runs(function() {
        return spyOn(minimap, 'decorateMarker').andCallThrough();
      });
    });
    return describe("with an open editor that have a minimap", function() {
      beforeEach(function() {
        return waitsForPromise(function() {
          return colorBuffer.initialize();
        });
      });
      it("creates a binding between the two plugins", function() {
        return expect(binding).toBeDefined();
      });
      it('decorates the minimap with color markers', function() {
        return expect(minimap.decorateMarker).toHaveBeenCalled();
      });
      describe('when a color is added', function() {
        beforeEach(function() {
          editor.moveToBottom();
          editBuffer('  border-color: yellow');
          return waitsFor(function() {
            return minimap.decorateMarker.callCount > 2;
          });
        });
        return it('adds a new decoration on the minimap', function() {
          return expect(minimap.decorateMarker.callCount).toEqual(3);
        });
      });
      describe('when a color is removed', function() {
        beforeEach(function() {
          spyOn(minimap, 'removeAllDecorationsForMarker').andCallThrough();
          editBuffer('', {
            start: [2, 0],
            end: [2, Infinity]
          });
          return waitsFor(function() {
            return minimap.removeAllDecorationsForMarker.callCount > 0;
          });
        });
        return it('removes the minimap decoration', function() {
          return expect(minimap.removeAllDecorationsForMarker.callCount).toEqual(1);
        });
      });
      describe('when the editor is destroyed', function() {
        beforeEach(function() {
          spyOn(binding, 'destroy').andCallThrough();
          return editor.destroy();
        });
        return it('also destroy the binding model', function() {
          expect(binding.destroy).toHaveBeenCalled();
          return expect(plugin.bindingForEditor(editor)).toBeUndefined();
        });
      });
      return describe('when the plugin is deactivated', function() {
        beforeEach(function() {
          spyOn(binding, 'destroy').andCallThrough();
          return plugin.deactivatePlugin();
        });
        return it('removes all the decorations from the minimap', function() {
          return expect(binding.destroy).toHaveBeenCalled();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvbWluaW1hcC1waWdtZW50cy9zcGVjL21pbmltYXAtcGlnbWVudHMtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZUFBQTs7QUFBQSxFQUFBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHlCQUFSLENBQWxCLENBQUE7O0FBQUEsRUFPQSxRQUFBLENBQVMsaUJBQVQsRUFBNEIsU0FBQSxHQUFBO0FBQzFCLFFBQUEsa0hBQUE7QUFBQSxJQUFBLE9BQXFHLEVBQXJHLEVBQUMsMEJBQUQsRUFBbUIsZ0JBQW5CLEVBQTJCLHdCQUEzQixFQUEyQyxpQkFBM0MsRUFBb0QseUJBQXBELEVBQXFFLHFCQUFyRSxFQUFrRixnQkFBbEYsRUFBMEYsaUJBQTFGLENBQUE7QUFBQSxJQUVBLFVBQUEsR0FBYSxTQUFDLElBQUQsRUFBTyxPQUFQLEdBQUE7QUFDWCxVQUFBLEtBQUE7O1FBRGtCLFVBQVE7T0FDMUI7QUFBQSxNQUFBLElBQUcscUJBQUg7QUFDRSxRQUFBLElBQUcsbUJBQUg7QUFDRSxVQUFBLEtBQUEsR0FBUSxDQUFDLE9BQU8sQ0FBQyxLQUFULEVBQWdCLE9BQU8sQ0FBQyxHQUF4QixDQUFSLENBREY7U0FBQSxNQUFBO0FBR0UsVUFBQSxLQUFBLEdBQVEsQ0FBQyxPQUFPLENBQUMsS0FBVCxFQUFnQixPQUFPLENBQUMsS0FBeEIsQ0FBUixDQUhGO1NBQUE7QUFBQSxRQUtBLE1BQU0sQ0FBQyxzQkFBUCxDQUE4QixLQUE5QixDQUxBLENBREY7T0FBQTtBQUFBLE1BUUEsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsSUFBbEIsQ0FSQSxDQUFBO0FBU0EsTUFBQSxJQUFBLENBQUEsT0FBbUUsQ0FBQyxPQUFwRTtlQUFBLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxPQUFP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

//# sourceURL=/home/champ/.atom/packages/minimap-pigments/spec/minimap-pigments-spec.coffee
