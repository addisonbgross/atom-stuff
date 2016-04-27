function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libMinimapCursorline = require('../lib/minimap-cursorline');

var _libMinimapCursorline2 = _interopRequireDefault(_libMinimapCursorline);

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

'use babel';

describe('MinimapCursorLine', function () {
  var _ref = [];
  var workspaceElement = _ref[0];
  var editor = _ref[1];
  var minimap = _ref[2];

  beforeEach(function () {
    workspaceElement = atom.views.getView(atom.workspace);
    jasmine.attachToDOM(workspaceElement);

    waitsForPromise(function () {
      return atom.workspace.open('sample.js').then(function (e) {
        editor = e;
      });
    });

    waitsForPromise(function () {
      return atom.packages.activatePackage('minimap').then(function (pkg) {
        minimap = pkg.mainModule.minimapForEditor(editor);
      });
    });

    waitsForPromise(function () {
      return atom.packages.activatePackage('minimap-cursorline');
    });
  });

  describe('with an open editor that have a minimap', function () {
    var cursor = undefined,
        marker = undefined;
    describe('when cursor markers are added to the editor', function () {
      beforeEach(function () {
        cursor = editor.addCursorAtScreenPosition({ row: 2, column: 3 });
        marker = cursor.getMarker();
      });

      it('creates decoration for the cursor markers', function () {
        expect(Object.keys(minimap.decorationsByMarkerId).length).toEqual(1);
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2NoYW1wLy5hdG9tL3BhY2thZ2VzL21pbmltYXAtY3Vyc29ybGluZS9zcGVjL21pbmltYXAtY3Vyc29ybGluZS1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O29DQUU4QiwyQkFBMkI7Ozs7Ozs7OztBQUZ6RCxXQUFXLENBQUE7O0FBU1gsUUFBUSxDQUFDLG1CQUFtQixFQUFFLFlBQU07YUFDUSxFQUFFO01BQXZDLGdCQUFnQjtNQUFFLE1BQU07TUFBRSxPQUFPOztBQUV0QyxZQUFVLENBQUMsWUFBTTtBQUNmLG9CQUFnQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUNyRCxXQUFPLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUE7O0FBRXJDLG1CQUFlLENBQUMsWUFBTTtBQUNwQixhQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBSztBQUNsRCxjQUFNLEdBQUcsQ0FBQyxDQUFBO09BQ1gsQ0FBQyxDQUFBO0tBQ0gsQ0FBQyxDQUFBOztBQUVGLG1CQUFlLENBQUMsWUFBTTtBQUNwQixhQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUM1RCxlQUFPLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQTtPQUNsRCxDQUFDLENBQUE7S0FDSCxDQUFDLENBQUE7O0FBRUYsbUJBQWUsQ0FBQyxZQUFNO0FBQ3BCLGFBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtLQUMzRCxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLHlDQUF5QyxFQUFFLFlBQU07QUFDeEQsUUFBSSxNQUFNLFlBQUE7UUFBRSxNQUFNLFlBQUEsQ0FBQTtBQUNsQixZQUFRLENBQUMsNkNBQTZDLEVBQUUsWUFBTTtBQUM1RCxnQkFBVSxDQUFDLFlBQU07QUFDZixjQUFNLEdBQUcsTUFBTSxDQUFDLHlCQUF5QixDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtBQUNoRSxjQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFBO09BQzVCLENBQUMsQ0FBQTs7QUFFRixRQUFFLENBQUMsMkNBQTJDLEVBQUUsWUFBTTtBQUNwRCxjQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUE7T0FDckUsQ0FBQyxDQUFBO0tBQ0gsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9ob21lL2NoYW1wLy5hdG9tL3BhY2thZ2VzL21pbmltYXAtY3Vyc29ybGluZS9zcGVjL21pbmltYXAtY3Vyc29ybGluZS1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IE1pbmltYXBDdXJzb3JMaW5lIGZyb20gJy4uL2xpYi9taW5pbWFwLWN1cnNvcmxpbmUnXG5cbi8vIFVzZSB0aGUgY29tbWFuZCBgd2luZG93OnJ1bi1wYWNrYWdlLXNwZWNzYCAoY21kLWFsdC1jdHJsLXApIHRvIHJ1biBzcGVjcy5cbi8vXG4vLyBUbyBydW4gYSBzcGVjaWZpYyBgaXRgIG9yIGBkZXNjcmliZWAgYmxvY2sgYWRkIGFuIGBmYCB0byB0aGUgZnJvbnQgKGUuZy4gYGZpdGBcbi8vIG9yIGBmZGVzY3JpYmVgKS4gUmVtb3ZlIHRoZSBgZmAgdG8gdW5mb2N1cyB0aGUgYmxvY2suXG5cbmRlc2NyaWJlKCdNaW5pbWFwQ3Vyc29yTGluZScsICgpID0+IHtcbiAgbGV0IFt3b3Jrc3BhY2VFbGVtZW50LCBlZGl0b3IsIG1pbmltYXBdID0gW11cblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB3b3Jrc3BhY2VFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKVxuICAgIGphc21pbmUuYXR0YWNoVG9ET00od29ya3NwYWNlRWxlbWVudClcblxuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3Blbignc2FtcGxlLmpzJykudGhlbigoZSkgPT4ge1xuICAgICAgICBlZGl0b3IgPSBlXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgcmV0dXJuIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdtaW5pbWFwJykudGhlbigocGtnKSA9PiB7XG4gICAgICAgIG1pbmltYXAgPSBwa2cubWFpbk1vZHVsZS5taW5pbWFwRm9yRWRpdG9yKGVkaXRvcilcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICByZXR1cm4gYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ21pbmltYXAtY3Vyc29ybGluZScpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnd2l0aCBhbiBvcGVuIGVkaXRvciB0aGF0IGhhdmUgYSBtaW5pbWFwJywgKCkgPT4ge1xuICAgIGxldCBjdXJzb3IsIG1hcmtlclxuICAgIGRlc2NyaWJlKCd3aGVuIGN1cnNvciBtYXJrZXJzIGFyZSBhZGRlZCB0byB0aGUgZWRpdG9yJywgKCkgPT4ge1xuICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIGN1cnNvciA9IGVkaXRvci5hZGRDdXJzb3JBdFNjcmVlblBvc2l0aW9uKHsgcm93OiAyLCBjb2x1bW46IDMgfSlcbiAgICAgICAgbWFya2VyID0gY3Vyc29yLmdldE1hcmtlcigpXG4gICAgICB9KVxuXG4gICAgICBpdCgnY3JlYXRlcyBkZWNvcmF0aW9uIGZvciB0aGUgY3Vyc29yIG1hcmtlcnMnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChPYmplY3Qua2V5cyhtaW5pbWFwLmRlY29yYXRpb25zQnlNYXJrZXJJZCkubGVuZ3RoKS50b0VxdWFsKDEpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuIl19
//# sourceURL=/home/champ/.atom/packages/minimap-cursorline/spec/minimap-cursorline-spec.js
