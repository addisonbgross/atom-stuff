function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('./helpers/workspace');

var _libMinimap = require('../lib/minimap');

var _libMinimap2 = _interopRequireDefault(_libMinimap);

var _libMinimapElement = require('../lib/minimap-element');

var _libMinimapElement2 = _interopRequireDefault(_libMinimapElement);

'use babel';

describe('Minimap package', function () {
  var _ref = [];
  var editor = _ref[0];
  var minimap = _ref[1];
  var editorElement = _ref[2];
  var minimapElement = _ref[3];
  var workspaceElement = _ref[4];
  var minimapPackage = _ref[5];

  beforeEach(function () {
    atom.config.set('minimap.autoToggle', true);

    workspaceElement = atom.views.getView(atom.workspace);
    jasmine.attachToDOM(workspaceElement);

    _libMinimapElement2['default'].registerViewProvider(_libMinimap2['default']);

    waitsForPromise(function () {
      return atom.workspace.open('sample.coffee');
    });

    waitsForPromise(function () {
      return atom.packages.activatePackage('minimap').then(function (pkg) {
        minimapPackage = pkg.mainModule;
      });
    });

    waitsFor(function () {
      return workspaceElement.querySelector('atom-text-editor');
    });

    runs(function () {
      editor = atom.workspace.getActiveTextEditor();
      editorElement = atom.views.getView(editor);
    });

    waitsFor(function () {
      return workspaceElement.querySelector('atom-text-editor::shadow atom-text-editor-minimap');
    });
  });

  it('registers the minimap views provider', function () {
    var textEditor = atom.workspace.buildTextEditor({});
    minimap = new _libMinimap2['default']({ textEditor: textEditor });
    minimapElement = atom.views.getView(minimap);

    expect(minimapElement).toExist();
  });

  describe('when an editor is opened', function () {
    it('creates a minimap model for the editor', function () {
      expect(minimapPackage.minimapForEditor(editor)).toBeDefined();
    });

    it('attaches a minimap element to the editor view', function () {
      expect(editorElement.shadowRoot.querySelector('atom-text-editor-minimap')).toExist();
    });
  });

  describe('::observeMinimaps', function () {
    var _ref2 = [];
    var spy = _ref2[0];

    beforeEach(function () {
      spy = jasmine.createSpy('observeMinimaps');
      minimapPackage.observeMinimaps(spy);
    });

    it('calls the callback with the existing minimaps', function () {
      expect(spy).toHaveBeenCalled();
    });

    it('calls the callback when a new editor is opened', function () {
      waitsForPromise(function () {
        return atom.workspace.open('other-sample.js');
      });

      runs(function () {
        expect(spy.calls.length).toEqual(2);
      });
    });
  });

  describe('::deactivate', function () {
    beforeEach(function () {
      minimapPackage.deactivate();
    });

    it('destroys all the minimap models', function () {
      expect(minimapPackage.editorsMinimaps).toBeUndefined();
    });

    it('destroys all the minimap elements', function () {
      expect(editorElement.shadowRoot.querySelector('atom-text-editor-minimap')).not.toExist();
    });
  });

  describe('service', function () {
    it('returns the minimap main module', function () {
      expect(minimapPackage.provideMinimapServiceV1()).toEqual(minimapPackage);
    });

    it('creates standalone minimap with provided text editor', function () {
      var textEditor = atom.workspace.buildTextEditor({});
      var standaloneMinimap = minimapPackage.standAloneMinimapForEditor(textEditor);
      expect(standaloneMinimap.getTextEditor()).toEqual(textEditor);
    });
  });

  //    ########  ##       ##     ##  ######   #### ##    ##  ######
  //    ##     ## ##       ##     ## ##    ##   ##  ###   ## ##    ##
  //    ##     ## ##       ##     ## ##         ##  ####  ## ##
  //    ########  ##       ##     ## ##   ####  ##  ## ## ##  ######
  //    ##        ##       ##     ## ##    ##   ##  ##  ####       ##
  //    ##        ##       ##     ## ##    ##   ##  ##   ### ##    ##
  //    ##        ########  #######   ######   #### ##    ##  ######

  describe('plugins', function () {
    var _ref3 = [];
    var registerHandler = _ref3[0];
    var unregisterHandler = _ref3[1];
    var plugin = _ref3[2];

    beforeEach(function () {
      atom.config.set('minimap.displayPluginsControls', true);
      atom.config.set('minimap.plugins.dummy', undefined);

      plugin = {
        active: false,
        activatePlugin: function activatePlugin() {
          this.active = true;
        },
        deactivatePlugin: function deactivatePlugin() {
          this.active = false;
        },
        isActive: function isActive() {
          return this.active;
        }
      };

      spyOn(plugin, 'activatePlugin').andCallThrough();
      spyOn(plugin, 'deactivatePlugin').andCallThrough();

      registerHandler = jasmine.createSpy('register handler');
      unregisterHandler = jasmine.createSpy('unregister handler');
    });

    describe('when registered', function () {
      beforeEach(function () {
        minimapPackage.onDidAddPlugin(registerHandler);
        minimapPackage.onDidRemovePlugin(unregisterHandler);
        minimapPackage.registerPlugin('dummy', plugin);
      });

      it('makes the plugin available in the minimap', function () {
        expect(minimapPackage.plugins['dummy']).toBe(plugin);
      });

      it('emits an event', function () {
        expect(registerHandler).toHaveBeenCalled();
      });

      it('creates a default config for the plugin', function () {
        expect(minimapPackage.config.plugins.properties.dummy).toBeDefined();
        expect(minimapPackage.config.plugins.properties.dummyDecorationsZIndex).toBeDefined();
      });

      it('sets the corresponding config', function () {
        expect(atom.config.get('minimap.plugins.dummy')).toBeTruthy();
        expect(atom.config.get('minimap.plugins.dummyDecorationsZIndex')).toEqual(0);
      });

      describe('triggering the corresponding plugin command', function () {
        beforeEach(function () {
          atom.commands.dispatch(workspaceElement, 'minimap:toggle-dummy');
        });

        it('receives a deactivation call', function () {
          expect(plugin.deactivatePlugin).toHaveBeenCalled();
        });
      });

      describe('and then unregistered', function () {
        beforeEach(function () {
          minimapPackage.unregisterPlugin('dummy');
        });

        it('has been unregistered', function () {
          expect(minimapPackage.plugins['dummy']).toBeUndefined();
        });

        it('emits an event', function () {
          expect(unregisterHandler).toHaveBeenCalled();
        });

        describe('when the config is modified', function () {
          beforeEach(function () {
            atom.config.set('minimap.plugins.dummy', false);
          });

          it('does not activates the plugin', function () {
            expect(plugin.deactivatePlugin).not.toHaveBeenCalled();
          });
        });
      });

      describe('on minimap deactivation', function () {
        beforeEach(function () {
          expect(plugin.active).toBeTruthy();
          minimapPackage.deactivate();
        });

        it('deactivates all the plugins', function () {
          expect(plugin.active).toBeFalsy();
        });
      });
    });

    describe('when the config for it is false', function () {
      beforeEach(function () {
        atom.config.set('minimap.plugins.dummy', false);
        minimapPackage.registerPlugin('dummy', plugin);
      });

      it('does not receive an activation call', function () {
        expect(plugin.activatePlugin).not.toHaveBeenCalled();
      });
    });

    describe('the registered plugin', function () {
      beforeEach(function () {
        minimapPackage.registerPlugin('dummy', plugin);
      });

      it('receives an activation call', function () {
        expect(plugin.activatePlugin).toHaveBeenCalled();
      });

      it('activates the plugin', function () {
        expect(plugin.active).toBeTruthy();
      });

      describe('when the config is modified after registration', function () {
        beforeEach(function () {
          atom.config.set('minimap.plugins.dummy', false);
        });

        it('receives a deactivation call', function () {
          expect(plugin.deactivatePlugin).toHaveBeenCalled();
        });
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2NoYW1wLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvc3BlYy9taW5pbWFwLW1haW4tc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztRQUVPLHFCQUFxQjs7MEJBQ1IsZ0JBQWdCOzs7O2lDQUNULHdCQUF3Qjs7OztBQUpuRCxXQUFXLENBQUE7O0FBTVgsUUFBUSxDQUFDLGlCQUFpQixFQUFFLFlBQU07YUFDeUQsRUFBRTtNQUF0RixNQUFNO01BQUUsT0FBTztNQUFFLGFBQWE7TUFBRSxjQUFjO01BQUUsZ0JBQWdCO01BQUUsY0FBYzs7QUFFckYsWUFBVSxDQUFDLFlBQU07QUFDZixRQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsQ0FBQTs7QUFFM0Msb0JBQWdCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQ3JELFdBQU8sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTs7QUFFckMsbUNBQWUsb0JBQW9CLHlCQUFTLENBQUE7O0FBRTVDLG1CQUFlLENBQUMsWUFBTTtBQUNwQixhQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFBO0tBQzVDLENBQUMsQ0FBQTs7QUFFRixtQkFBZSxDQUFDLFlBQU07QUFDcEIsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFDNUQsc0JBQWMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFBO09BQ2hDLENBQUMsQ0FBQTtLQUNILENBQUMsQ0FBQTs7QUFFRixZQUFRLENBQUMsWUFBTTtBQUNiLGFBQU8sZ0JBQWdCLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUE7S0FDMUQsQ0FBQyxDQUFBOztBQUVGLFFBQUksQ0FBQyxZQUFNO0FBQ1QsWUFBTSxHQUFH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QUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtPQUNqRCxDQUFDLENBQUE7O0FBRUYsUUFBRSxDQUFDLHNCQUFzQixFQUFFLFlBQU07QUFDL0IsY0FBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtPQUNuQyxDQUFDLENBQUE7O0FBRUYsY0FBUSxDQUFDLGdEQUFnRCxFQUFFLFlBQU07QUFDL0Qsa0JBQVUsQ0FBQyxZQUFNO0FBQ2YsY0FBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsS0FBSyxDQUFDLENBQUE7U0FDaEQsQ0FBQyxDQUFBOztBQUVGLFVBQUUsQ0FBQyw4QkFBOEIsRUFBRSxZQUFNO0FBQ3ZDLGdCQUFNLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtTQUNuRCxDQUFDLENBQUE7T0FDSCxDQUFDLENBQUE7S0FDSCxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvbWluaW1hcC9zcGVjL21pbmltYXAtbWFpbi1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0ICcuL2hlbHBlcnMvd29ya3NwYWNlJ1xuaW1wb3J0IE1pbmltYXAgZnJvbSAnLi4vbGliL21pbmltYXAnXG5pbXBvcnQgTWluaW1hcEVsZW1lbnQgZnJvbSAnLi4vbGliL21pbmltYXAtZWxlbWVudCdcblxuZGVzY3JpYmUoJ01pbmltYXAgcGFja2FnZScsICgpID0+IHtcbiAgbGV0IFtlZGl0b3IsIG1pbmltYXAsIGVkaXRvckVsZW1lbnQsIG1pbmltYXBFbGVtZW50LCB3b3Jrc3BhY2VFbGVtZW50LCBtaW5pbWFwUGFja2FnZV0gPSBbXVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIGF0b20uY29uZmlnLnNldCgnbWluaW1hcC5hdXRvVG9nZ2xlJywgdHJ1ZSlcblxuICAgIHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpXG4gICAgamFzbWluZS5hdHRhY2hUb0RPTSh3b3Jrc3BhY2VFbGVtZW50KVxuXG4gICAgTWluaW1hcEVsZW1lbnQucmVnaXN0ZXJWaWV3UHJvdmlkZXIoTWluaW1hcClcblxuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3Blbignc2FtcGxlLmNvZmZlZScpXG4gICAgfSlcblxuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICByZXR1cm4gYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ21pbmltYXAnKS50aGVuKChwa2cpID0+IHtcbiAgICAgICAgbWluaW1hcFBhY2thZ2UgPSBwa2cubWFpbk1vZHVsZVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgd2FpdHNGb3IoKCkgPT4ge1xuICAgICAgcmV0dXJuIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignYXRvbS10ZXh0LWVkaXRvcicpXG4gICAgfSlcblxuICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBlZGl0b3JFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcilcbiAgICB9KVxuXG4gICAgd2FpdHNGb3IoKCkgPT4ge1xuICAgICAgcmV0dXJuIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignYXRvbS10ZXh0LWVkaXRvcjo6c2hhZG93IGF0b20tdGV4dC1lZGl0b3ItbWluaW1hcCcpXG4gICAgfSlcbiAgfSlcblxuICBpdCgncmVnaXN0ZXJzIHRoZSBtaW5pbWFwIHZpZXdzIHByb3ZpZGVyJywgKCkgPT4ge1xuICAgIGxldCB0ZXh0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuYnVpbGRUZXh0RWRpdG9yKHt9KVxuICAgIG1pbmltYXAgPSBuZXcgTWluaW1hcCh7dGV4dEVkaXRvcn0pXG4gICAgbWluaW1hcEVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcobWluaW1hcClcblxuICAgIGV4cGVjdChtaW5pbWFwRWxlbWVudCkudG9FeGlzdCgpXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3doZW4gYW4gZWRpdG9yIGlzIG9wZW5lZCcsICgpID0+IHtcbiAgICBpdCgnY3JlYXRlcyBhIG1pbmltYXAgbW9kZWwgZm9yIHRoZSBlZGl0b3InLCAoKSA9PiB7XG4gICAgICBleHBlY3QobWluaW1hcFBhY2thZ2UubWluaW1hcEZvckVkaXRvcihlZGl0b3IpKS50b0JlRGVmaW5lZCgpXG4gICAgfSlcblxuICAgIGl0KCdhdHRhY2hlcyBhIG1pbmltYXAgZWxlbWVudCB0byB0aGUgZWRpdG9yIHZpZXcnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoZWRpdG9yRWxlbWVudC5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IoJ2F0b20tdGV4dC1lZGl0b3ItbWluaW1hcCcpKS50b0V4aXN0KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCc6Om9ic2VydmVNaW5pbWFwcycsICgpID0+IHtcbiAgICBsZXQgW3NweV0gPSBbXVxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoJ29ic2VydmVNaW5pbWFwcycpXG4gICAgICBtaW5pbWFwUGFja2FnZS5vYnNlcnZlTWluaW1hcHMoc3B5KVxuICAgIH0pXG5cbiAgICBpdCgnY2FsbHMgdGhlIGNhbGxiYWNrIHdpdGggdGhlIGV4aXN0aW5nIG1pbmltYXBzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KHNweSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdjYWxscyB0aGUgY2FsbGJhY2sgd2hlbiBhIG5ldyBlZGl0b3IgaXMgb3BlbmVkJywgKCkgPT4ge1xuICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHsgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4oJ290aGVyLXNhbXBsZS5qcycpIH0pXG5cbiAgICAgIHJ1bnMoKCkgPT4geyBleHBlY3Qoc3B5LmNhbGxzLmxlbmd0aCkudG9FcXVhbCgyKSB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJzo6ZGVhY3RpdmF0ZScsICgpID0+IHtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIG1pbmltYXBQYWNrYWdlLmRlYWN0aXZhdGUoKVxuICAgIH0pXG5cbiAgICBpdCgnZGVzdHJveXMgYWxsIHRoZSBtaW5pbWFwIG1vZGVscycsICgpID0+IHtcbiAgICAgIGV4cGVjdChtaW5pbWFwUGFja2FnZS5lZGl0b3JzTWluaW1hcHMpLnRvQmVVbmRlZmluZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnZGVzdHJveXMgYWxsIHRoZSBtaW5pbWFwIGVsZW1lbnRzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGVkaXRvckVsZW1lbnQuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKCdhdG9tLXRleHQtZWRpdG9yLW1pbmltYXAnKSkubm90LnRvRXhpc3QoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3NlcnZpY2UnLCAoKSA9PiB7XG4gICAgaXQoJ3JldHVybnMgdGhlIG1pbmltYXAgbWFpbiBtb2R1bGUnLCAoKSA9PiB7XG4gICAgICBleHBlY3QobWluaW1hcFBhY2thZ2UucHJvdmlkZU1pbmltYXBTZXJ2aWNlVjEoKSkudG9FcXVhbChtaW5pbWFwUGFja2FnZSlcbiAgICB9KVxuXG4gICAgaXQoJ2NyZWF0ZXMgc3RhbmRhbG9uZSBtaW5pbWFwIHdpdGggcHJvdmlkZWQgdGV4dCBlZGl0b3InLCAoKSA9PiB7XG4gICAgICBsZXQgdGV4dEVkaXRvciA9IGF0b20ud29ya3NwYWNlLmJ1aWxkVGV4dEVkaXRvcih7fSlcbiAgICAgIGxldCBzdGFuZGFsb25lTWluaW1hcCA9IG1pbmltYXBQYWNrYWdlLnN0YW5kQWxvbmVNaW5pbWFwRm9yRWRpdG9yKHRleHRFZGl0b3IpXG4gICAgICBleHBlY3Qoc3RhbmRhbG9uZU1pbmltYXAuZ2V0VGV4dEVkaXRvcigpKS50b0VxdWFsKHRleHRFZGl0b3IpXG4gICAgfSlcbiAgfSlcblxuICAvLyAgICAjIyMjIyMjIyAgIyMgICAgICAgIyMgICAgICMjICAjIyMjIyMgICAjIyMjICMjICAgICMjICAjIyMjIyNcbiAgLy8gICAgIyMgICAgICMjICMjICAgICAgICMjICAgICAjIyAjIyAgICAjIyAgICMjICAjIyMgICAjIyAjIyAgICAjI1xuICAvLyAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICMjICMjICAgICAgICAgIyMgICMjIyMgICMjICMjXG4gIC8vICAgICMjIyMjIyMjICAjIyAgICAgICAjIyAgICAgIyMgIyMgICAjIyMjICAjIyAgIyMgIyMgIyMgICMjIyMjI1xuICAvLyAgICAjIyAgICAgICAgIyMgICAgICAgIyMgICAgICMjICMjICAgICMjICAgIyMgICMjICAjIyMjICAgICAgICMjXG4gIC8vICAgICMjICAgICAgICAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgIyMgICAjIyAgIyMgICAjIyMgIyMgICAgIyNcbiAgLy8gICAgIyMgICAgICAgICMjIyMjIyMjICAjIyMjIyMjICAgIyMjIyMjICAgIyMjIyAjIyAgICAjIyAgIyMjIyMjXG5cbiAgZGVzY3JpYmUoJ3BsdWdpbnMnLCAoKSA9PiB7XG4gICAgbGV0IFtyZWdpc3RlckhhbmRsZXIsIHVucmVnaXN0ZXJIYW5kbGVyLCBwbHVnaW5dID0gW11cblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgYXRvbS5jb25maWcuc2V0KCdtaW5pbWFwLmRpc3BsYXlQbHVnaW5zQ29udHJvbHMnLCB0cnVlKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdtaW5pbWFwLnBsdWdpbnMuZHVtbXknLCB1bmRlZmluZWQpXG5cbiAgICAgIHBsdWdpbiA9IHtcbiAgICAgICAgYWN0aXZlOiBmYWxzZSxcbiAgICAgICAgYWN0aXZhdGVQbHVnaW4gKCkgeyB0aGlzLmFjdGl2ZSA9IHRydWUgfSxcbiAgICAgICAgZGVhY3RpdmF0ZVBsdWdpbiAoKSB7IHRoaXMuYWN0aXZlID0gZmFsc2UgfSxcbiAgICAgICAgaXNBY3RpdmUgKCkgeyByZXR1cm4gdGhpcy5hY3RpdmUgfVxuICAgICAgfVxuXG4gICAgICBzcHlPbihwbHVnaW4sICdhY3RpdmF0ZVBsdWdpbicpLmFuZENhbGxUaHJvdWdoKClcbiAgICAgIHNweU9uKHBsdWdpbiwgJ2RlYWN0aXZhdGVQbHVnaW4nKS5hbmRDYWxsVGhyb3VnaCgpXG5cbiAgICAgIHJlZ2lzdGVySGFuZGxlciA9IGphc21pbmUuY3JlYXRlU3B5KCdyZWdpc3RlciBoYW5kbGVyJylcbiAgICAgIHVucmVnaXN0ZXJIYW5kbGVyID0gamFzbWluZS5jcmVhdGVTcHkoJ3VucmVnaXN0ZXIgaGFuZGxlcicpXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCd3aGVuIHJlZ2lzdGVyZWQnLCAoKSA9PiB7XG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgbWluaW1hcFBhY2thZ2Uub25EaWRBZGRQbHVnaW4ocmVnaXN0ZXJIYW5kbGVyKVxuICAgICAgICBtaW5pbWFwUGFja2FnZS5vbkRpZFJlbW92ZVBsdWdpbih1bnJlZ2lzdGVySGFuZGxlcilcbiAgICAgICAgbWluaW1hcFBhY2thZ2UucmVnaXN0ZXJQbHVnaW4oJ2R1bW15JywgcGx1Z2luKVxuICAgICAgfSlcblxuICAgICAgaXQoJ21ha2VzIHRoZSBwbHVnaW4gYXZhaWxhYmxlIGluIHRoZSBtaW5pbWFwJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QobWluaW1hcFBhY2thZ2UucGx1Z2luc1snZHVtbXknXSkudG9CZShwbHVnaW4pXG4gICAgICB9KVxuXG4gICAgICBpdCgnZW1pdHMgYW4gZXZlbnQnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChyZWdpc3RlckhhbmRsZXIpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ2NyZWF0ZXMgYSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIHBsdWdpbicsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1pbmltYXBQYWNrYWdlLmNvbmZpZy5wbHVnaW5zLnByb3BlcnRpZXMuZHVtbXkpLnRvQmVEZWZpbmVkKClcbiAgICAgICAgZXhwZWN0KG1pbmltYXBQYWNrYWdlLmNvbmZpZy5wbHVnaW5zLnByb3BlcnRpZXMuZHVtbXlEZWNvcmF0aW9uc1pJbmRleCkudG9CZURlZmluZWQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3NldHMgdGhlIGNvcnJlc3BvbmRpbmcgY29uZmlnJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QoYXRvbS5jb25maWcuZ2V0KCdtaW5pbWFwLnBsdWdpbnMuZHVtbXknKSkudG9CZVRydXRoeSgpXG4gICAgICAgIGV4cGVjdChhdG9tLmNvbmZpZy5nZXQoJ21pbmltYXAucGx1Z2lucy5kdW1teURlY29yYXRpb25zWkluZGV4JykpLnRvRXF1YWwoMClcbiAgICAgIH0pXG5cbiAgICAgIGRlc2NyaWJlKCd0cmlnZ2VyaW5nIHRoZSBjb3JyZXNwb25kaW5nIHBsdWdpbiBjb21tYW5kJywgKCkgPT4ge1xuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdtaW5pbWFwOnRvZ2dsZS1kdW1teScpXG4gICAgICAgIH0pXG5cbiAgICAgICAgaXQoJ3JlY2VpdmVzIGEgZGVhY3RpdmF0aW9uIGNhbGwnLCAoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KHBsdWdpbi5kZWFjdGl2YXRlUGx1Z2luKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGRlc2NyaWJlKCdhbmQgdGhlbiB1bnJlZ2lzdGVyZWQnLCAoKSA9PiB7XG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgIG1pbmltYXBQYWNrYWdlLnVucmVnaXN0ZXJQbHVnaW4oJ2R1bW15JylcbiAgICAgICAgfSlcblxuICAgICAgICBpdCgnaGFzIGJlZW4gdW5yZWdpc3RlcmVkJywgKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChtaW5pbWFwUGFja2FnZS5wbHVnaW5zWydkdW1teSddKS50b0JlVW5kZWZpbmVkKClcbiAgICAgICAgfSlcblxuICAgICAgICBpdCgnZW1pdHMgYW4gZXZlbnQnLCAoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KHVucmVnaXN0ZXJIYW5kbGVyKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgfSlcblxuICAgICAgICBkZXNjcmliZSgnd2hlbiB0aGUgY29uZmlnIGlzIG1vZGlmaWVkJywgKCkgPT4ge1xuICAgICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgICAgYXRvbS5jb25maWcuc2V0KCdtaW5pbWFwLnBsdWdpbnMuZHVtbXknLCBmYWxzZSlcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgaXQoJ2RvZXMgbm90IGFjdGl2YXRlcyB0aGUgcGx1Z2luJywgKCkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KHBsdWdpbi5kZWFjdGl2YXRlUGx1Z2luKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGRlc2NyaWJlKCdvbiBtaW5pbWFwIGRlYWN0aXZhdGlvbicsICgpID0+IHtcbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KHBsdWdpbi5hY3RpdmUpLnRvQmVUcnV0aHkoKVxuICAgICAgICAgIG1pbmltYXBQYWNrYWdlLmRlYWN0aXZhdGUoKVxuICAgICAgICB9KVxuXG4gICAgICAgIGl0KCdkZWFjdGl2YXRlcyBhbGwgdGhlIHBsdWdpbnMnLCAoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KHBsdWdpbi5hY3RpdmUpLnRvQmVGYWxzeSgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnd2hlbiB0aGUgY29uZmlnIGZvciBpdCBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ21pbmltYXAucGx1Z2lucy5kdW1teScsIGZhbHNlKVxuICAgICAgICBtaW5pbWFwUGFja2FnZS5yZWdpc3RlclBsdWdpbignZHVtbXknLCBwbHVnaW4pXG4gICAgICB9KVxuXG4gICAgICBpdCgnZG9lcyBub3QgcmVjZWl2ZSBhbiBhY3RpdmF0aW9uIGNhbGwnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChwbHVnaW4uYWN0aXZhdGVQbHVnaW4pLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCd0aGUgcmVnaXN0ZXJlZCBwbHVnaW4nLCAoKSA9PiB7XG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgbWluaW1hcFBhY2thZ2UucmVnaXN0ZXJQbHVnaW4oJ2R1bW15JywgcGx1Z2luKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3JlY2VpdmVzIGFuIGFjdGl2YXRpb24gY2FsbCcsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KHBsdWdpbi5hY3RpdmF0ZVBsdWdpbikudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnYWN0aXZhdGVzIHRoZSBwbHVnaW4nLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChwbHVnaW4uYWN0aXZlKS50b0JlVHJ1dGh5KClcbiAgICAgIH0pXG5cbiAgICAgIGRlc2NyaWJlKCd3aGVuIHRoZSBjb25maWcgaXMgbW9kaWZpZWQgYWZ0ZXIgcmVnaXN0cmF0aW9uJywgKCkgPT4ge1xuICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ21pbmltYXAucGx1Z2lucy5kdW1teScsIGZhbHNlKVxuICAgICAgICB9KVxuXG4gICAgICAgIGl0KCdyZWNlaXZlcyBhIGRlYWN0aXZhdGlvbiBjYWxsJywgKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChwbHVnaW4uZGVhY3RpdmF0ZVBsdWdpbikudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuIl19
//# sourceURL=/home/champ/.atom/packages/minimap/spec/minimap-main-spec.js
