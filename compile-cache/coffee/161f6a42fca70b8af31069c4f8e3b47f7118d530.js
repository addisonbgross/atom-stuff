(function() {
  var Input, path;

  Input = require('../lib/provider/input');

  path = require('path');

  describe('Input', function() {
    return describe('::getFirstConfig', function() {
      describe('When config in current folder', function() {
        var file, folder, promise;
        file = null;
        folder = null;
        promise = null;
        beforeEach(function() {
          promise = Input.getFirstConfig(path.join(atom.project.getPaths()[0], 'root1', 'sub0'));
          promise.then(function(_arg) {
            var filePath, folderPath;
            folderPath = _arg.folderPath, filePath = _arg.filePath;
            folder = folderPath;
            return file = filePath;
          });
          return waitsForPromise(function() {
            return promise;
          });
        });
        return it('returns the correct file path', function() {
          expect(folder).toBe(path.join(atom.project.getPaths()[0], 'root1', 'sub0'));
          return expect(file).toBe(path.join(atom.project.getPaths()[0], 'root1', 'sub0', '.build-tools.cson'));
        });
      });
      return describe('When config not in current folder', function() {
        var file, folder, promise;
        file = null;
        folder = null;
        promise = null;
        beforeEach(function() {
          promise = Input.getFirstConfig(path.join(atom.project.getPaths()[0], 'root1', 'sub1'));
          promise.then(function(_arg) {
            var filePath, folderPath;
            folderPath = _arg.folderPath, filePath = _arg.filePath;
            folder = folderPath;
            return file = filePath;
          });
          return waitsForPromise(function() {
            return promise;
          });
        });
        return it('returns the correct file path', function() {
          expect(folder).toBe(atom.project.getPaths()[0]);
          return expect(file).toBe(path.join(folder, '.build-tools.cson'));
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvc3BlYy9pbnB1dC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxXQUFBOztBQUFBLEVBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSx1QkFBUixDQUFSLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBR0EsUUFBQSxDQUFTLE9BQVQsRUFBa0IsU0FBQSxHQUFBO1dBQ2hCLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBLEdBQUE7QUFDM0IsTUFBQSxRQUFBLENBQVMsK0JBQVQsRUFBMEMsU0FBQSxHQUFBO0FBQ3hDLFlBQUEscUJBQUE7QUFBQSxRQUFBLElBQUEsR0FBTyxJQUFQLENBQUE7QUFBQSxRQUNBLE1BQUEsR0FBUyxJQURULENBQUE7QUFBQSxRQUVBLE9BQUEsR0FBVSxJQUZWLENBQUE7QUFBQSxRQUlBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLE9BQUEsR0FBVSxLQUFLLENBQUMsY0FBTixDQUFxQixJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxPQUF0QyxFQUErQyxNQUEvQyxDQUFyQixDQUFWLENBQUE7QUFBQSxVQUNBLE9BQU8sQ0FBQyxJQUFSLENBQWEsU0FBQyxJQUFELEdBQUE7QUFDWCxnQkFBQSxvQkFBQTtBQUFBLFlBRGEsa0JBQUEsWUFBWSxnQkFBQSxRQUN6QixDQUFBO0FBQUEsWUFBQSxNQUFBLEdBQVMsVUFBVCxDQUFBO21CQUNBLElBQUEsR0FBTyxTQUZJO1VBQUEsQ0FBYixDQURBLENBQUE7aUJBSUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7bUJBQUcsUUFBSDtVQUFBLENBQWhCLEVBTFM7UUFBQSxDQUFYLENBSkEsQ0FBQTtlQVdBLEVBQUEsQ0FBRywrQkFBSCxFQUFvQyxTQUFBLEdBQUE7QUFDbEMsVUFBQSxNQUFBLENBQU8sTUFBUCxDQUFjLENBQUMsSUFBZixDQUFvQixJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxPQUF0QyxFQUErQyxNQUEvQyxDQUFwQixDQUFBLENBQUE7aUJBQ0EsTUFBQSxDQUFPLElBQVAsQ0FBWSxDQUFDLElBQWIsQ0FBa0IsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsT0FBdEMsRUFBK0MsTUFBL0MsRUFBdUQsbUJBQXZELENBQWxCLEVBRmtDO1FBQUEsQ0FBcEMsRUFad0M7TUFBQSxDQUExQyxDQUFBLENBQUE7YUFnQkEsUUFBQSxDQUFTLG1DQUFULEVBQThDLFNBQUEsR0FBQTtBQUM1QyxZQUFBLHFCQUFBO0FBQUEsUUFBQSxJQUFBLEdBQU8sSUFBUCxDQUFBO0FBQUEsUUFDQSxNQUFBLEdBQVMsSUFEVCxDQUFBO0FBQUEsUUFFQSxPQUFBLEdBQVUsSUFGVixDQUFBO0FBQUEsUUFJQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxPQUFBLEdBQVUsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsT0FBdEMsRUFBK0MsTUFBL0MsQ0FBckIsQ0FBVixDQUFBO0FBQUEsVUFDQSxPQUFPLENBQUMsSUFBUixDQUFhLFNBQUMsSUFBRCxHQUFBO0FBQ1gsZ0JBQUEsb0JBQUE7QUFBQSxZQURhLGtCQUFBLFlBQVksZ0JBQUEsUUFDekIsQ0FBQTtBQUFBLFlBQUEsTUFBQSxHQUFTLFVBQVQsQ0FBQTttQkFDQSxJQUFBLEdBQU8sU0FGSTtVQUFBLENBQWIsQ0FEQSxDQUFBO2lCQUlBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO21CQUFHLFFBQUg7VUFBQSxDQUFoQixFQUxTO1FBQUEsQ0FBWCxDQUpBLENBQUE7ZUFXQSxFQUFBLENBQUcsK0JBQUgsRUFBb0MsU0FBQSxHQUFBO0FBQ2xDLFVBQUEsTUFBQSxDQUFPLE1BQVAsQ0FBYyxDQUFDLElBQWYsQ0FBb0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQTVDLENBQUEsQ0FBQTtpQkFDQSxNQUFBLENBQU8sSUFBUCxDQUFZLENBQUMsSUFBYixDQUFrQixJQUFJLENBQUMsSUFBTCxDQUFVLE1BQVYsRUFBa0IsbUJBQWxCLENBQWxCLEVBRmtDO1FBQUEsQ0FBcEMsRUFaNEM7TUFBQSxDQUE5QyxFQWpCMkI7SUFBQSxDQUE3QixFQURnQjtFQUFBLENBQWxCLENBSEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/build-tools/spec/input-spec.coffee
