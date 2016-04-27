"use babel";

describe('The GCC provider for AtomLinter', function () {
  var main = require('../lib/main');
  var utility = require('../lib/utility.js');
  var settings = require("../lib/config").settings;

  beforeEach(function () {
    waitsForPromise(function () {
      atom.config.set('linter-gcc.execPath', '/usr/bin/g++');
      atom.config.set('linter-gcc.gccDefaultCFlags', '-Wall');
      atom.config.set('linter-gcc.gccDefaultCppFlags', '-Wall -std=c++11');
      atom.config.set('linter-gcc.gccErrorLimit', 15);
      atom.config.set('linter-gcc.gccIncludePaths', ' ');
      atom.config.set('linter-gcc.gccSuppressWarnings', true);
      main.messages = {};
      return atom.packages.activatePackage('linter-gcc');
    });
  });

  it('finds one error in error.cpp', function () {
    waitsForPromise(function () {
      filename = __dirname + '/files/error.cpp';
      return atom.workspace.open(filename).then(function (editor) {
        main.lint(editor, editor.getPath(), editor.getPath()).then(function () {
          var length = utility.flattenHash(main.messages).length;
          expect(length).toEqual(1);
        });
      });
    });
  });

  it('finds no errors in comment.cpp', function () {
    waitsForPromise(function () {
      filename = __dirname + '/files/comment.cpp';
      return atom.workspace.open(filename).then(function (editor) {
        main.lint(editor, editor.getPath(), editor.getPath()).then(function () {
          var length = utility.flattenHash(main.messages).length;
          expect(length).toEqual(0);
        });
      });
    });
  });

  it('finds one error in error.c', function () {
    waitsForPromise(function () {
      filename = __dirname + '/files/error.c';
      return atom.workspace.open(filename).then(function (editor) {
        main.lint(editor, editor.getPath(), editor.getPath()).then(function () {
          var length = utility.flattenHash(main.messages).length;
          expect(length).toEqual(1);
        });
      });
    });
  });

  it('finds no errors in comment.c', function () {
    waitsForPromise(function () {
      filename = __dirname + '/files/comment.c';
      return atom.workspace.open(filename).then(function (editor) {
        main.lint(editor, editor.getPath(), editor.getPath()).then(function () {
          var length = utility.flattenHash(main.messages).length;
          expect(length).toEqual(0);
        });
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2NoYW1wLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1nY2Mvc3BlYy9saW50ZXItZ2NjLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOztBQUVaLFFBQVEsQ0FBQyxpQ0FBaUMsRUFBRSxZQUFNO0FBQ2hELE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUNuQyxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtBQUM1QyxNQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsUUFBUSxDQUFBOztBQUVoRCxZQUFVLENBQUMsWUFBTTtBQUNmLG1CQUFlLENBQUMsWUFBTTtBQUNwQixVQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxjQUFjLENBQUMsQ0FBQTtBQUN0RCxVQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUN2RCxVQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsRUFBRSxrQkFBa0IsQ0FBQyxDQUFBO0FBQ3BFLFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDBCQUEwQixFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQy9DLFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDRCQUE0QixFQUFFLEdBQUcsQ0FBQyxDQUFBO0FBQ2xELFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQ3ZELFVBQUksQ0FBQyxRQUFRLEdBQUMsRUFBRSxDQUFDO0FBQ2pCLGFBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUE7S0FDbkQsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBOztBQUVGLElBQUUsQ0FBQyw4QkFBOEIsRUFBRSxZQUFNO0FBQ3ZDLG1CQUFl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QyxDQUFBO09BQ0gsQ0FBQyxDQUFBO0tBQ0gsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9ob21lL2NoYW1wLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1nY2Mvc3BlYy9saW50ZXItZ2NjLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5kZXNjcmliZSgnVGhlIEdDQyBwcm92aWRlciBmb3IgQXRvbUxpbnRlcicsICgpID0+IHtcbiAgY29uc3QgbWFpbiA9IHJlcXVpcmUoJy4uL2xpYi9tYWluJylcbiAgY29uc3QgdXRpbGl0eSA9IHJlcXVpcmUoJy4uL2xpYi91dGlsaXR5LmpzJylcbiAgdmFyIHNldHRpbmdzID0gcmVxdWlyZShcIi4uL2xpYi9jb25maWdcIikuc2V0dGluZ3NcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItZ2NjLmV4ZWNQYXRoJywgJy91c3IvYmluL2crKycpXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci1nY2MuZ2NjRGVmYXVsdENGbGFncycsICctV2FsbCcpXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci1nY2MuZ2NjRGVmYXVsdENwcEZsYWdzJywgJy1XYWxsIC1zdGQ9YysrMTEnKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItZ2NjLmdjY0Vycm9yTGltaXQnLCAxNSlcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLWdjYy5nY2NJbmNsdWRlUGF0aHMnLCAnICcpXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci1nY2MuZ2NjU3VwcHJlc3NXYXJuaW5ncycsIHRydWUpXG4gICAgICBtYWluLm1lc3NhZ2VzPXt9O1xuICAgICAgcmV0dXJuIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdsaW50ZXItZ2NjJylcbiAgICB9KVxuICB9KVxuXG4gIGl0KCdmaW5kcyBvbmUgZXJyb3IgaW4gZXJyb3IuY3BwJywgKCkgPT4ge1xuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICBmaWxlbmFtZSA9IF9fZGlybmFtZSArICcvZmlsZXMvZXJyb3IuY3BwJ1xuICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZW5hbWUpLnRoZW4oZWRpdG9yID0+IHtcbiAgICAgICAgbWFpbi5saW50KGVkaXRvciwgZWRpdG9yLmdldFBhdGgoKSwgZWRpdG9yLmdldFBhdGgoKSkudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgIHZhciBsZW5ndGggPSB1dGlsaXR5LmZsYXR0ZW5IYXNoKG1haW4ubWVzc2FnZXMpLmxlbmd0aFxuICAgICAgICAgIGV4cGVjdChsZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgaXQoJ2ZpbmRzIG5vIGVycm9ycyBpbiBjb21tZW50LmNwcCcsICgpID0+IHtcbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgZmlsZW5hbWUgPSBfX2Rpcm5hbWUgKyAnL2ZpbGVzL2NvbW1lbnQuY3BwJ1xuICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZW5hbWUpLnRoZW4oZWRpdG9yID0+IHtcbiAgICAgICAgbWFpbi5saW50KGVkaXRvciwgZWRpdG9yLmdldFBhdGgoKSwgZWRpdG9yLmdldFBhdGgoKSkudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgIHZhciBsZW5ndGggPSB1dGlsaXR5LmZsYXR0ZW5IYXNoKG1haW4ubWVzc2FnZXMpLmxlbmd0aFxuICAgICAgICAgIGV4cGVjdChsZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgaXQoJ2ZpbmRzIG9uZSBlcnJvciBpbiBlcnJvci5jJywgKCkgPT4ge1xuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICBmaWxlbmFtZSA9IF9fZGlybmFtZSArICcvZmlsZXMvZXJyb3IuYydcbiAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5vcGVuKGZpbGVuYW1lKS50aGVuKGVkaXRvciA9PiB7XG4gICAgICAgIG1haW4ubGludChlZGl0b3IsIGVkaXRvci5nZXRQYXRoKCksIGVkaXRvci5nZXRQYXRoKCkpLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICB2YXIgbGVuZ3RoID0gdXRpbGl0eS5mbGF0dGVuSGFzaChtYWluLm1lc3NhZ2VzKS5sZW5ndGhcbiAgICAgICAgICBleHBlY3QobGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGl0KCdmaW5kcyBubyBlcnJvcnMgaW4gY29tbWVudC5jJywgKCkgPT4ge1xuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICBmaWxlbmFtZSA9IF9fZGlybmFtZSArICcvZmlsZXMvY29tbWVudC5jJ1xuICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZW5hbWUpLnRoZW4oZWRpdG9yID0+IHtcbiAgICAgICAgbWFpbi5saW50KGVkaXRvciwgZWRpdG9yLmdldFBhdGgoKSwgZWRpdG9yLmdldFBhdGgoKSkudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgIHZhciBsZW5ndGggPSB1dGlsaXR5LmZsYXR0ZW5IYXNoKG1haW4ubWVzc2FnZXMpLmxlbmd0aFxuICAgICAgICAgIGV4cGVjdChsZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuIl19
//# sourceURL=/home/champ/.atom/packages/linter-gcc/spec/linter-gcc-spec.js