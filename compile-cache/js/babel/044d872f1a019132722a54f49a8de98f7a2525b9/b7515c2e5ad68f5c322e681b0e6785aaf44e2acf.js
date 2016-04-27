'use babel';
'use strict';

var fs = require('fs-extra');
var temp = require('temp');
var specHelpers = require('atom-build-spec-helpers');

describe('Build', function () {
  var goodAtomBuildfile = __dirname + '/fixture/.atom-build.json';
  var shellAtomBuildfile = __dirname + '/fixture/.atom-build.shell.json';
  var replaceAtomBuildFile = __dirname + '/fixture/.atom-build.replace.json';
  var shFalseAtomBuildFile = __dirname + '/fixture/.atom-build.sh-false.json';
  var shTrueAtomBuildFile = __dirname + '/fixture/.atom-build.sh-true.json';
  var shDefaultAtomBuildFile = __dirname + '/fixture/.atom-build.sh-default.json';
  var syntaxErrorAtomBuildFile = __dirname + '/fixture/.atom-build.syntax-error.json';

  var directory = null;
  var workspaceElement = null;

  temp.track();

  beforeEach(function () {
    atom.config.set('build.buildOnSave', false);
    atom.config.set('build.panelVisibility', 'Toggle');
    atom.config.set('build.saveOnBuild', false);
    atom.config.set('build.stealFocus', true);
    atom.notifications.clear();

    workspaceElement = atom.views.getView(atom.workspace);
    jasmine.attachToDOM(workspaceElement);
    jasmine.unspy(window, 'setTimeout');
    jasmine.unspy(window, 'clearTimeout');

    waitsForPromise(function () {
      return specHelpers.vouch(temp.mkdir, 'atom-build-spec-').then(function (dir) {
        return specHelpers.vouch(fs.realpath, dir);
      }).then(function (dir) {
        directory = dir + '/';
        atom.project.setPaths([directory]);
        return atom.packages.activatePackage('build');
      });
    });
  });

  afterEach(function () {
    fs.removeSync(directory);
  });

  describe('when package is activated', function () {
    it('should not show build window if panelVisibility is Toggle ', function () {
      expect(workspaceElement.querySelector('.build')).not.toExist();
    });
  });

  describe('when building', function () {
    it('should show build failed if build fails', function () {
      expect(workspaceElement.querySelector('.build')).not.toExist();

      fs.writeFileSync(directory + '.atom-build.json', JSON.stringify({
        cmd: 'echo Very bad... && exit 1'
      }));
      atom.commands.dispatch(workspaceElement, 'build:trigger');

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('error');
      });

      runs(function () {
        expect(workspaceElement.querySelector('.build')).toExist();
        expect(workspaceElement.querySelector('.build .output').textContent).toMatch(/Very bad\.\.\./);
      });
    });

    it('should fail build, if errors are matched', function () {
      expect(workspaceElement.querySelector('.build')).not.toExist();

      fs.writeFileSync(directory + '.atom-build.json', JSON.stringify({
        cmd: 'echo __ERROR__ && exit 0',
        errorMatch: 'ERROR'
      }));
      atom.commands.dispatch(workspaceElement, 'build:trigger');

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('error');
      });
    });

    it('should cancel build when stopping it, and remove when stopping again', function () {
      expect(workspaceElement.querySelector('.build')).not.toExist();

      fs.writeFileSync(directory + '.atom-build.json', JSON.stringify({
        cmd: 'echo "Building, this will take some time..." && sleep 30 && echo "Done!"'
      }));
      atom.commands.dispatch(workspaceElement, 'build:trigger');

      // Let build run for one second before we terminate it
      waits(1000);

      runs(function () {
        expect(workspaceElement.querySelector('.build')).toExist();
        expect(workspaceElement.querySelector('.build .output').textContent).toMatch(/Building, this will take some time.../);
        atom.commands.dispatch(workspaceElement, 'build:stop');
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('error');
      });

      runs(function () {
        atom.commands.dispatch(workspaceElement, 'build:stop');
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title .title-text').textContent == 'Aborted!';
      });
    });

    it('should not show the build panel if no build file exists', function () {
      expect(workspaceElement.querySelector('.build')).not.toExist();

      atom.commands.dispatch(workspaceElement, 'build:trigger');

      /* Give it some time here. There's nothing to probe for as we expect the exact same state when done. */
      waits(200);

      runs(function () {
        expect(workspaceElement.querySelector('.build')).not.toExist();
      });
    });
  });

  describe('when build is triggered twice', function () {
    it('should not leave multiple panels behind', function () {
      expect(workspaceElement.querySelector('.build')).not.toExist();

      atom.commands.dispatch(workspaceElement, 'build:toggle-panel');

      fs.writeFileSync(directory + '.atom-build.json', JSON.stringify({
        cmd: 'echo hello world'
      }));
      atom.commands.dispatch(workspaceElement, 'build:trigger');

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title').classList.contains('success');
      });

      runs(function () {
        expect(workspaceElement.querySelectorAll('.bottom.tool-panel.panel-bottom').length).toBe(1);
        atom.commands.dispatch(workspaceElement, 'build:trigger');
      });

      /* Give it some time here. There's nothing to probe for as we expect the exact same state when done. */
      waits(200);

      runs(function () {
        expect(workspaceElement.querySelectorAll('.bottom.tool-panel.panel-bottom').length).toBe(1);
      });
    });
  });

  describe('when custom .atom-build.json is available', function () {
    it('should show the build window', function () {
      expect(workspaceElement.querySelector('.build')).not.toExist();

      fs.writeFileSync(directory + '.atom-build.json', fs.readFileSync(goodAtomBuildfile));
      atom.commands.dispatch(workspaceElement, 'build:trigger');

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('success');
      });

      runs(function () {
        expect(workspaceElement.querySelector('.build')).toExist();
        expect(workspaceElement.querySelector('.build .output').textContent).toMatch(/"cmd": "dd"/);
      });
    });

    it('should be possible to exec shell commands with wildcard expansion', function () {
      expect(workspaceElement.querySelector('.build')).not.toExist();

      fs.writeFileSync(directory + '.atom-build.json', fs.readFileSync(shellAtomBuildfile));
      atom.commands.dispatch(workspaceElement, 'build:trigger');

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('success');
      });

      runs(function () {
        expect(workspaceElement.querySelector('.build')).toExist();
        expect(workspaceElement.querySelector('.build .output').textContent).toMatch(/Good news, everyone!/);
      });
    });

    it('should show sh message if sh is true', function () {
      expect(workspaceElement.querySelector('.build')).not.toExist();

      fs.writeFileSync(directory + '.atom-build.json', fs.readFileSync(shTrueAtomBuildFile));
      atom.commands.dispatch(workspaceElement, 'build:trigger');

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('success');
      });

      runs(function () {
        expect(workspaceElement.querySelector('.build')).toExist();
        expect(workspaceElement.querySelector('.build .output').textContent).toMatch(/Executing with sh:/);
      });
    });

    it('should not show sh message if sh is false', function () {
      expect(workspaceElement.querySelector('.build')).not.toExist();

      fs.writeFileSync(directory + '.atom-build.json', fs.readFileSync(shFalseAtomBuildFile));
      atom.commands.dispatch(workspaceElement, 'build:trigger');

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('success');
      });

      runs(function () {
        expect(workspaceElement.querySelector('.build')).toExist();
        expect(workspaceElement.querySelector('.build .output').textContent).toMatch(/Executing:/);
      });
    });

    it('should show sh message if sh is unspecified', function () {
      expect(workspaceElement.querySelector('.build')).not.toExist();

      fs.writeFileSync(directory + '.atom-build.json', fs.readFileSync(shDefaultAtomBuildFile));
      atom.commands.dispatch(workspaceElement, 'build:trigger');

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('success');
      });

      runs(function () {
        expect(workspaceElement.querySelector('.build')).toExist();
        expect(workspaceElement.querySelector('.build .output').textContent).toMatch(/Executing with sh:/);
      });
    });

    it('should show graphical error message if build-file contains syntax errors', function () {
      expect(workspaceElement.querySelector('.build')).not.toExist();

      fs.writeFileSync(directory + '.atom-build.json', fs.readFileSync(syntaxErrorAtomBuildFile));
      atom.commands.dispatch(workspaceElement, 'build:trigger');

      waitsFor(function () {
        return atom.notifications.getNotifications().length > 0;
      });

      runs(function () {
        var notification = atom.notifications.getNotifications()[0];
        expect(notification.getType()).toEqual('error');
        expect(notification.getMessage()).toEqual('Invalid build file.');
        expect(notification.options.detail).toMatch(/Unexpected token t/);
      });
    });

    it('should not cache the contents of the build file', function () {
      expect(workspaceElement.querySelector('.build')).not.toExist();

      fs.writeFileSync(directory + '.atom-build.json', JSON.stringify({
        cmd: 'echo first'
      }));

      atom.commands.dispatch(workspaceElement, 'build:trigger');
      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('success');
      });

      runs(function () {
        expect(workspaceElement.querySelector('.build .output').textContent).toMatch(/first/);
      });

      waitsFor(function () {
        return !workspaceElement.querySelector('.build .title');
      });

      runs(function () {
        fs.writeFileSync(directory + '.atom-build.json', JSON.stringify({
          cmd: 'echo second'
        }));
      });

      waits(100);

      runs(function () {
        atom.commands.dispatch(workspaceElement, 'build:trigger');
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('success');
      });

      runs(function () {
        expect(workspaceElement.querySelector('.build .output').textContent).toMatch(/second/);
      });
    });
  });

  describe('when replacements are specified in the atom-build.json file', function () {
    it('should replace those with their dynamic value', function () {

      expect(workspaceElement.querySelector('.build')).not.toExist();

      process.env.FROM_PROCESS_ENV = '{FILE_ACTIVE}';
      fs.writeFileSync(directory + '.atom-build.json', fs.readFileSync(replaceAtomBuildFile));

      waitsForPromise(function () {
        return atom.workspace.open('.atom-build.json');
      });

      runs(function () {
        atom.commands.dispatch(workspaceElement, 'build:trigger');
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('success');
      });

      runs(function () {
        expect(workspaceElement.querySelector('.build')).toExist();
        var output = workspaceElement.querySelector('.build .output').textContent;

        expect(output.indexOf('PROJECT_PATH=' + directory.substring(0, -1))).not.toBe(-1);
        expect(output.indexOf('FILE_ACTIVE=' + directory + '.atom-build.json')).not.toBe(-1);
        expect(output.indexOf('FROM_ENV=' + directory + '.atom-build.json')).not.toBe(-1);
        expect(output.indexOf('FROM_PROCESS_ENV=' + directory + '.atom-build.json')).not.toBe(-1);
        expect(output.indexOf('FILE_ACTIVE_NAME=.atom-build.json')).not.toBe(-1);
        expect(output.indexOf('FILE_ACTIVE_NAME_BASE=.atom-build')).not.toBe(-1);
      });
    });
  });

  describe('when the text editor is saved', function () {
    it('should build when buildOnSave is true', function () {
      atom.config.set('build.buildOnSave', true);

      fs.writeFileSync(directory + '.atom-build.json', JSON.stringify({
        cmd: 'echo Surprising is the passing of time but not so, as the time of passing.'
      }));

      waitsForPromise(function () {
        return atom.workspace.open('dummy');
      });

      runs(function () {
        var editor = atom.workspace.getActiveTextEditor();
        editor.save();
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('success');
      });

      runs(function () {
        expect(workspaceElement.querySelector('.build')).toExist();
        expect(workspaceElement.querySelector('.build .output').textContent).toMatch(/Surprising is the passing of time but not so, as the time of passing/);
      });
    });

    it('should not build when buildOnSave is false', function () {
      atom.config.set('build.buildOnSave', false);

      fs.writeFileSync(directory + '.atom-build.json', {
        cmd: 'echo "hello, world"'
      });

      waitsForPromise(function () {
        return atom.workspace.open('dummy');
      });

      runs(function () {
        var editor = atom.workspace.getActiveTextEditor();
        editor.save();
      });

      runs(function () {
        expect(workspaceElement.querySelector('.build')).not.toExist();
      });
    });

    it('should not attempt to build if buildOnSave is true and no build tool exists', function () {
      atom.config.set('build.buildOnSave', true);

      waitsForPromise(function () {
        return atom.workspace.open('dummy');
      });

      runs(function () {
        var editor = atom.workspace.getActiveTextEditor();
        editor.save();
      });

      waits(200);

      runs(function () {
        expect(atom.notifications.getNotifications().length).toEqual(0);
      });
    });
  });

  describe('when multiple project roots are open', function () {
    it('should run the second root if a file there is active', function () {
      var directory2 = fs.realpathSync(temp.mkdirSync({ prefix: 'atom-build-spec-' })) + '/';
      atom.project.addPath(directory2);
      expect(workspaceElement.querySelector('.build-confirm')).not.toExist();

      fs.writeFileSync(directory2 + '.atom-build.json', fs.readFileSync(goodAtomBuildfile));
      waitsForPromise(function () {
        return atom.workspace.open(directory2 + '/main.c');
      });

      runs(function () {
        atom.workspace.getActiveTextEditor().save();
        atom.commands.dispatch(workspaceElement, 'build:trigger');
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('success');
      });

      runs(function () {
        expect(workspaceElement.querySelector('.build')).toExist();
        expect(workspaceElement.querySelector('.build .output').textContent).toMatch(/"cmd": "dd"/);
      });
    });
  });

  describe('when build panel is toggled and it is not visible', function () {
    it('should show the build panel', function () {
      expect(workspaceElement.querySelector('.build')).not.toExist();

      atom.commands.dispatch(workspaceElement, 'build:toggle-panel');

      expect(workspaceElement.querySelector('.build')).toExist();
    });
  });

  describe('when build is triggered, focus should adhere the stealFocus config', function () {
    it('should focus the build panel if stealFocus is true', function () {
      expect(workspaceElement.querySelector('.build')).not.toExist();

      fs.writeFileSync(directory + '.atom-build.json', fs.readFileSync(goodAtomBuildfile));
      atom.commands.dispatch(workspaceElement, 'build:trigger');

      waitsFor(function () {
        return workspaceElement.querySelector('.build');
      });

      runs(function () {
        expect(document.activeElement).toHaveClass('build');
      });
    });

    it('should leave focus untouched if stealFocus is false', function () {
      expect(workspaceElement.querySelector('.build')).not.toExist();

      atom.config.set('build.stealFocus', false);
      var activeElement = document.activeElement;

      fs.writeFileSync(directory + '.atom-build.json', fs.readFileSync(goodAtomBuildfile));
      atom.commands.dispatch(workspaceElement, 'build:trigger');

      waitsFor(function () {
        return workspaceElement.querySelector('.build');
      });

      runs(function () {
        expect(document.activeElement).toEqual(activeElement);
        expect(document.activeElement).not.toHaveClass('build');
      });
    });
  });

  describe('when no build tools are available', function () {
    it('should show a warning', function () {
      expect(workspaceElement.querySelector('.build')).not.toExist();
      atom.commands.dispatch(workspaceElement, 'build:trigger');

      waitsFor(function () {
        return atom.notifications.getNotifications().length > 0;
      });

      runs(function () {
        var notification = atom.notifications.getNotifications()[0];
        expect(notification.getType()).toEqual('warning');
        expect(notification.getMessage()).toEqual('No eligible build tool.');
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2NoYW1wLy5hdG9tL3BhY2thZ2VzL2J1aWxkL3NwZWMvYnVpbGQtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7QUFDWixZQUFZLENBQUM7O0FBRWIsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzdCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQixJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQzs7QUFFckQsUUFBUSxDQUFDLE9BQU8sRUFBRSxZQUFXO0FBQzNCLE1BQUksaUJBQWlCLEdBQUcsU0FBUyxHQUFHLDJCQUEyQixDQUFDO0FBQ2hFLE1BQUksa0JBQWtCLEdBQUcsU0FBUyxHQUFHLGlDQUFpQyxDQUFDO0FBQ3ZFLE1BQUksb0JBQW9CLEdBQUcsU0FBUyxHQUFHLG1DQUFtQyxDQUFDO0FBQzNFLE1BQUksb0JBQW9CLEdBQUcsU0FBUyxHQUFHLG9DQUFvQyxDQUFDO0FBQzVFLE1BQUksbUJBQW1CLEdBQUcsU0FBUyxHQUFHLG1DQUFtQyxDQUFDO0FBQzFFLE1BQUksc0JBQXNCLEdBQUcsU0FBUyxHQUFHLHNDQUFzQyxDQUFDO0FBQ2hGLE1BQUksd0JBQXdCLEdBQUcsU0FBUyxHQUFHLHdDQUF3QyxDQUFDOztBQUVwRixNQUFJLFNBQVMsR0FBRyxJQUFJLENBQUM7QUFDckIsTUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7O0FBRTVCLE1BQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7QUFFYixZQUFVLENBQUMsWUFBVztBQUNwQixRQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM1QyxRQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNuRCxRQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxt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QyxZQUFZLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztPQUN0RSxDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQvc3BlYy9idWlsZC1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBmcyA9IHJlcXVpcmUoJ2ZzLWV4dHJhJyk7XG52YXIgdGVtcCA9IHJlcXVpcmUoJ3RlbXAnKTtcbnZhciBzcGVjSGVscGVycyA9IHJlcXVpcmUoJ2F0b20tYnVpbGQtc3BlYy1oZWxwZXJzJyk7XG5cbmRlc2NyaWJlKCdCdWlsZCcsIGZ1bmN0aW9uKCkge1xuICB2YXIgZ29vZEF0b21CdWlsZGZpbGUgPSBfX2Rpcm5hbWUgKyAnL2ZpeHR1cmUvLmF0b20tYnVpbGQuanNvbic7XG4gIHZhciBzaGVsbEF0b21CdWlsZGZpbGUgPSBfX2Rpcm5hbWUgKyAnL2ZpeHR1cmUvLmF0b20tYnVpbGQuc2hlbGwuanNvbic7XG4gIHZhciByZXBsYWNlQXRvbUJ1aWxkRmlsZSA9IF9fZGlybmFtZSArICcvZml4dHVyZS8uYXRvbS1idWlsZC5yZXBsYWNlLmpzb24nO1xuICB2YXIgc2hGYWxzZUF0b21CdWlsZEZpbGUgPSBfX2Rpcm5hbWUgKyAnL2ZpeHR1cmUvLmF0b20tYnVpbGQuc2gtZmFsc2UuanNvbic7XG4gIHZhciBzaFRydWVBdG9tQnVpbGRGaWxlID0gX19kaXJuYW1lICsgJy9maXh0dXJlLy5hdG9tLWJ1aWxkLnNoLXRydWUuanNvbic7XG4gIHZhciBzaERlZmF1bHRBdG9tQnVpbGRGaWxlID0gX19kaXJuYW1lICsgJy9maXh0dXJlLy5hdG9tLWJ1aWxkLnNoLWRlZmF1bHQuanNvbic7XG4gIHZhciBzeW50YXhFcnJvckF0b21CdWlsZEZpbGUgPSBfX2Rpcm5hbWUgKyAnL2ZpeHR1cmUvLmF0b20tYnVpbGQuc3ludGF4LWVycm9yLmpzb24nO1xuXG4gIHZhciBkaXJlY3RvcnkgPSBudWxsO1xuICB2YXIgd29ya3NwYWNlRWxlbWVudCA9IG51bGw7XG5cbiAgdGVtcC50cmFjaygpO1xuXG4gIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgYXRvbS5jb25maWcuc2V0KCdidWlsZC5idWlsZE9uU2F2ZScsIGZhbHNlKTtcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2J1aWxkLnBhbmVsVmlzaWJpbGl0eScsICdUb2dnbGUnKTtcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2J1aWxkLnNhdmVPbkJ1aWxkJywgZmFsc2UpO1xuICAgIGF0b20uY29uZmlnLnNldCgnYnVpbGQuc3RlYWxGb2N1cycsIHRydWUpO1xuICAgIGF0b20ubm90aWZpY2F0aW9ucy5jbGVhcigpO1xuXG4gICAgd29ya3NwYWNlRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSk7XG4gICAgamFzbWluZS5hdHRhY2hUb0RPTSh3b3Jrc3BhY2VFbGVtZW50KTtcbiAgICBqYXNtaW5lLnVuc3B5KHdpbmRvdywgJ3NldFRpbWVvdXQnKTtcbiAgICBqYXNtaW5lLnVuc3B5KHdpbmRvdywgJ2NsZWFyVGltZW91dCcpO1xuXG4gICAgd2FpdHNGb3JQcm9taXNlKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHNwZWNIZWxwZXJzLnZvdWNoKHRlbXAubWtkaXIsICdhdG9tLWJ1aWxkLXNwZWMtJykudGhlbihmdW5jdGlvbiAoZGlyKSB7XG4gICAgICAgIHJldHVybiBzcGVjSGVscGVycy52b3VjaChmcy5yZWFscGF0aCwgZGlyKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGRpcikge1xuICAgICAgICBkaXJlY3RvcnkgPSBkaXIgKyAnLyc7XG4gICAgICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyhbIGRpcmVjdG9yeSBdKTtcbiAgICAgICAgcmV0dXJuIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdidWlsZCcpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGFmdGVyRWFjaChmdW5jdGlvbigpIHtcbiAgICBmcy5yZW1vdmVTeW5jKGRpcmVjdG9yeSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aGVuIHBhY2thZ2UgaXMgYWN0aXZhdGVkJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3Nob3VsZCBub3Qgc2hvdyBidWlsZCB3aW5kb3cgaWYgcGFuZWxWaXNpYmlsaXR5IGlzIFRvZ2dsZSAnLCBmdW5jdGlvbigpIHtcbiAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCcpKS5ub3QudG9FeGlzdCgpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2hlbiBidWlsZGluZycsIGZ1bmN0aW9uICgpIHtcbiAgICBpdCgnc2hvdWxkIHNob3cgYnVpbGQgZmFpbGVkIGlmIGJ1aWxkIGZhaWxzJywgZnVuY3Rpb24oKSB7XG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkubm90LnRvRXhpc3QoKTtcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAnLmF0b20tYnVpbGQuanNvbicsIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgY21kOiAnZWNobyBWZXJ5IGJhZC4uLiAmJiBleGl0IDEnXG4gICAgICB9KSk7XG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG5cbiAgICAgIHdhaXRzRm9yKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykgJiZcbiAgICAgICAgICB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKS5jbGFzc0xpc3QuY29udGFpbnMoJ2Vycm9yJyk7XG4gICAgICB9KTtcblxuICAgICAgcnVucyhmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLnRvRXhpc3QoKTtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC5vdXRwdXQnKS50ZXh0Q29udGVudCkudG9NYXRjaCgvVmVyeSBiYWRcXC5cXC5cXC4vKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBmYWlsIGJ1aWxkLCBpZiBlcnJvcnMgYXJlIG1hdGNoZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCcpKS5ub3QudG9FeGlzdCgpO1xuXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGRpcmVjdG9yeSArICcuYXRvbS1idWlsZC5qc29uJywgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBjbWQ6ICdlY2hvIF9fRVJST1JfXyAmJiBleGl0IDAnLFxuICAgICAgICBlcnJvck1hdGNoOiAnRVJST1InXG4gICAgICB9KSk7XG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG5cbiAgICAgIHdhaXRzRm9yKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykgJiZcbiAgICAgICAgICB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKS5jbGFzc0xpc3QuY29udGFpbnMoJ2Vycm9yJyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgY2FuY2VsIGJ1aWxkIHdoZW4gc3RvcHBpbmcgaXQsIGFuZCByZW1vdmUgd2hlbiBzdG9wcGluZyBhZ2FpbicsIGZ1bmN0aW9uKCkge1xuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLm5vdC50b0V4aXN0KCk7XG5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGlyZWN0b3J5ICsgJy5hdG9tLWJ1aWxkLmpzb24nLCBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIGNtZDogJ2VjaG8gXCJCdWlsZGluZywgdGhpcyB3aWxsIHRha2Ugc29tZSB0aW1lLi4uXCIgJiYgc2xlZXAgMzAgJiYgZWNobyBcIkRvbmUhXCInXG4gICAgICB9KSk7XG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG5cbiAgICAgIC8vIExldCBidWlsZCBydW4gZm9yIG9uZSBzZWNvbmQgYmVmb3JlIHdlIHRlcm1pbmF0ZSBpdFxuICAgICAgd2FpdHMoMTAwMCk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCcpKS50b0V4aXN0KCk7XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAub3V0cHV0JykudGV4dENvbnRlbnQpLnRvTWF0Y2goL0J1aWxkaW5nLCB0aGlzIHdpbGwgdGFrZSBzb21lIHRpbWUuLi4vKTtcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6c3RvcCcpO1xuICAgICAgfSk7XG5cbiAgICAgIHdhaXRzRm9yKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykgJiZcbiAgICAgICAgICB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKS5jbGFzc0xpc3QuY29udGFpbnMoJ2Vycm9yJyk7XG4gICAgICB9KTtcblxuICAgICAgcnVucyhmdW5jdGlvbigpIHtcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6c3RvcCcpO1xuICAgICAgfSk7XG5cbiAgICAgIHdhaXRzRm9yKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gKHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZSAudGl0bGUtdGV4dCcpLnRleHRDb250ZW50ID09ICdBYm9ydGVkIScpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzaG93IHRoZSBidWlsZCBwYW5lbCBpZiBubyBidWlsZCBmaWxlIGV4aXN0cycsIGZ1bmN0aW9uKCkge1xuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLm5vdC50b0V4aXN0KCk7XG5cbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2J1aWxkOnRyaWdnZXInKTtcblxuICAgICAgLyogR2l2ZSBpdCBzb21lIHRpbWUgaGVyZS4gVGhlcmUncyBub3RoaW5nIHRvIHByb2JlIGZvciBhcyB3ZSBleHBlY3QgdGhlIGV4YWN0IHNhbWUgc3RhdGUgd2hlbiBkb25lLiAqL1xuICAgICAgd2FpdHMoMjAwKTtcblxuICAgICAgcnVucyhmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLm5vdC50b0V4aXN0KCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3doZW4gYnVpbGQgaXMgdHJpZ2dlcmVkIHR3aWNlJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3Nob3VsZCBub3QgbGVhdmUgbXVsdGlwbGUgcGFuZWxzIGJlaGluZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLm5vdC50b0V4aXN0KCk7XG5cbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2J1aWxkOnRvZ2dsZS1wYW5lbCcpO1xuXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGRpcmVjdG9yeSArICcuYXRvbS1idWlsZC5qc29uJywgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBjbWQ6ICdlY2hvIGhlbGxvIHdvcmxkJ1xuICAgICAgfSkpO1xuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dHJpZ2dlcicpO1xuXG4gICAgICB3YWl0c0ZvcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpLmNsYXNzTGlzdC5jb250YWlucygnc3VjY2VzcycpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib3R0b20udG9vbC1wYW5lbC5wYW5lbC1ib3R0b20nKS5sZW5ndGgpLnRvQmUoMSk7XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2J1aWxkOnRyaWdnZXInKTtcbiAgICAgIH0pO1xuXG4gICAgICAvKiBHaXZlIGl0IHNvbWUgdGltZSBoZXJlLiBUaGVyZSdzIG5vdGhpbmcgdG8gcHJvYmUgZm9yIGFzIHdlIGV4cGVjdCB0aGUgZXhhY3Qgc2FtZSBzdGF0ZSB3aGVuIGRvbmUuICovXG4gICAgICB3YWl0cygyMDApO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYm90dG9tLnRvb2wtcGFuZWwucGFuZWwtYm90dG9tJykubGVuZ3RoKS50b0JlKDEpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aGVuIGN1c3RvbSAuYXRvbS1idWlsZC5qc29uIGlzIGF2YWlsYWJsZScsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdzaG91bGQgc2hvdyB0aGUgYnVpbGQgd2luZG93JywgZnVuY3Rpb24oKSB7XG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkubm90LnRvRXhpc3QoKTtcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAnLmF0b20tYnVpbGQuanNvbicsIGZzLnJlYWRGaWxlU3luYyhnb29kQXRvbUJ1aWxkZmlsZSkpO1xuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dHJpZ2dlcicpO1xuXG4gICAgICB3YWl0c0ZvcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpICYmXG4gICAgICAgICAgd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykuY2xhc3NMaXN0LmNvbnRhaW5zKCdzdWNjZXNzJyk7XG4gICAgICB9KTtcblxuICAgICAgcnVucyhmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLnRvRXhpc3QoKTtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC5vdXRwdXQnKS50ZXh0Q29udGVudCkudG9NYXRjaCgvXCJjbWRcIjogXCJkZFwiLyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYmUgcG9zc2libGUgdG8gZXhlYyBzaGVsbCBjb21tYW5kcyB3aXRoIHdpbGRjYXJkIGV4cGFuc2lvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLm5vdC50b0V4aXN0KCk7XG5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGlyZWN0b3J5ICsgJy5hdG9tLWJ1aWxkLmpzb24nLCBmcy5yZWFkRmlsZVN5bmMoc2hlbGxBdG9tQnVpbGRmaWxlKSk7XG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG5cbiAgICAgIHdhaXRzRm9yKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykgJiZcbiAgICAgICAgICB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKS5jbGFzc0xpc3QuY29udGFpbnMoJ3N1Y2Nlc3MnKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkudG9FeGlzdCgpO1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLm91dHB1dCcpLnRleHRDb250ZW50KS50b01hdGNoKC9Hb29kIG5ld3MsIGV2ZXJ5b25lIS8pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHNob3cgc2ggbWVzc2FnZSBpZiBzaCBpcyB0cnVlJywgZnVuY3Rpb24oKSB7XG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkubm90LnRvRXhpc3QoKTtcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAnLmF0b20tYnVpbGQuanNvbicsIGZzLnJlYWRGaWxlU3luYyhzaFRydWVBdG9tQnVpbGRGaWxlKSk7XG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG5cbiAgICAgIHdhaXRzRm9yKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykgJiZcbiAgICAgICAgICB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKS5jbGFzc0xpc3QuY29udGFpbnMoJ3N1Y2Nlc3MnKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkudG9FeGlzdCgpO1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLm91dHB1dCcpLnRleHRDb250ZW50KS50b01hdGNoKC9FeGVjdXRpbmcgd2l0aCBzaDovKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3Qgc2hvdyBzaCBtZXNzYWdlIGlmIHNoIGlzIGZhbHNlJywgZnVuY3Rpb24oKSB7XG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkubm90LnRvRXhpc3QoKTtcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAnLmF0b20tYnVpbGQuanNvbicsIGZzLnJlYWRGaWxlU3luYyhzaEZhbHNlQXRvbUJ1aWxkRmlsZSkpO1xuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dHJpZ2dlcicpO1xuXG4gICAgICB3YWl0c0ZvcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpICYmXG4gICAgICAgICAgd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykuY2xhc3NMaXN0LmNvbnRhaW5zKCdzdWNjZXNzJyk7XG4gICAgICB9KTtcblxuICAgICAgcnVucyhmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLnRvRXhpc3QoKTtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC5vdXRwdXQnKS50ZXh0Q29udGVudCkudG9NYXRjaCgvRXhlY3V0aW5nOi8pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHNob3cgc2ggbWVzc2FnZSBpZiBzaCBpcyB1bnNwZWNpZmllZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLm5vdC50b0V4aXN0KCk7XG5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGlyZWN0b3J5ICsgJy5hdG9tLWJ1aWxkLmpzb24nLCBmcy5yZWFkRmlsZVN5bmMoc2hEZWZhdWx0QXRvbUJ1aWxkRmlsZSkpO1xuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dHJpZ2dlcicpO1xuXG4gICAgICB3YWl0c0ZvcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpICYmXG4gICAgICAgICAgd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykuY2xhc3NMaXN0LmNvbnRhaW5zKCdzdWNjZXNzJyk7XG4gICAgICB9KTtcblxuICAgICAgcnVucyhmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLnRvRXhpc3QoKTtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC5vdXRwdXQnKS50ZXh0Q29udGVudCkudG9NYXRjaCgvRXhlY3V0aW5nIHdpdGggc2g6Lyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc2hvdyBncmFwaGljYWwgZXJyb3IgbWVzc2FnZSBpZiBidWlsZC1maWxlIGNvbnRhaW5zIHN5bnRheCBlcnJvcnMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCcpKS5ub3QudG9FeGlzdCgpO1xuXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGRpcmVjdG9yeSArICcuYXRvbS1idWlsZC5qc29uJywgZnMucmVhZEZpbGVTeW5jKHN5bnRheEVycm9yQXRvbUJ1aWxkRmlsZSkpO1xuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dHJpZ2dlcicpO1xuXG4gICAgICB3YWl0c0ZvcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGF0b20ubm90aWZpY2F0aW9ucy5nZXROb3RpZmljYXRpb25zKCkubGVuZ3RoID4gMDtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbm90aWZpY2F0aW9uID0gYXRvbS5ub3RpZmljYXRpb25zLmdldE5vdGlmaWNhdGlvbnMoKVswXTtcbiAgICAgICAgZXhwZWN0KG5vdGlmaWNhdGlvbi5nZXRUeXBlKCkpLnRvRXF1YWwoJ2Vycm9yJyk7XG4gICAgICAgIGV4cGVjdChub3RpZmljYXRpb24uZ2V0TWVzc2FnZSgpKS50b0VxdWFsKCdJbnZhbGlkIGJ1aWxkIGZpbGUuJyk7XG4gICAgICAgIGV4cGVjdChub3RpZmljYXRpb24ub3B0aW9ucy5kZXRhaWwpLnRvTWF0Y2goL1VuZXhwZWN0ZWQgdG9rZW4gdC8pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBjYWNoZSB0aGUgY29udGVudHMgb2YgdGhlIGJ1aWxkIGZpbGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkubm90LnRvRXhpc3QoKTtcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAnLmF0b20tYnVpbGQuanNvbicsIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgY21kOiAnZWNobyBmaXJzdCdcbiAgICAgIH0pKTtcblxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dHJpZ2dlcicpO1xuICAgICAgd2FpdHNGb3IoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykgJiZcbiAgICAgICAgICB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKS5jbGFzc0xpc3QuY29udGFpbnMoJ3N1Y2Nlc3MnKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC5vdXRwdXQnKS50ZXh0Q29udGVudCkudG9NYXRjaCgvZmlyc3QvKTtcbiAgICAgIH0pO1xuXG4gICAgICB3YWl0c0ZvcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAhd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJyk7XG4gICAgICB9KTtcblxuICAgICAgcnVucyhmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGlyZWN0b3J5ICsgJy5hdG9tLWJ1aWxkLmpzb24nLCBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgY21kOiAnZWNobyBzZWNvbmQnXG4gICAgICAgIH0pKTtcbiAgICAgIH0pO1xuXG4gICAgICB3YWl0cygxMDApO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dHJpZ2dlcicpO1xuICAgICAgfSk7XG5cbiAgICAgIHdhaXRzRm9yKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpICYmXG4gICAgICAgICAgd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykuY2xhc3NMaXN0LmNvbnRhaW5zKCdzdWNjZXNzJyk7XG4gICAgICB9KTtcblxuICAgICAgcnVucyhmdW5jdGlvbiAoKSB7XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAub3V0cHV0JykudGV4dENvbnRlbnQpLnRvTWF0Y2goL3NlY29uZC8pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aGVuIHJlcGxhY2VtZW50cyBhcmUgc3BlY2lmaWVkIGluIHRoZSBhdG9tLWJ1aWxkLmpzb24gZmlsZScsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdzaG91bGQgcmVwbGFjZSB0aG9zZSB3aXRoIHRoZWlyIGR5bmFtaWMgdmFsdWUnLCBmdW5jdGlvbigpIHtcblxuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLm5vdC50b0V4aXN0KCk7XG5cbiAgICAgIHByb2Nlc3MuZW52LkZST01fUFJPQ0VTU19FTlYgPSAne0ZJTEVfQUNUSVZFfSc7XG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGRpcmVjdG9yeSArICcuYXRvbS1idWlsZC5qc29uJywgZnMucmVhZEZpbGVTeW5jKHJlcGxhY2VBdG9tQnVpbGRGaWxlKSk7XG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZShmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4oJy5hdG9tLWJ1aWxkLmpzb24nKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG4gICAgICB9KTtcblxuICAgICAgd2FpdHNGb3IoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKSAmJlxuICAgICAgICAgIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpLmNsYXNzTGlzdC5jb250YWlucygnc3VjY2VzcycpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCcpKS50b0V4aXN0KCk7XG4gICAgICAgIHZhciBvdXRwdXQgPSB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAub3V0cHV0JykudGV4dENvbnRlbnQ7XG5cbiAgICAgICAgZXhwZWN0KG91dHB1dC5pbmRleE9mKCdQUk9KRUNUX1BBVEg9JyArIGRpcmVjdG9yeS5zdWJzdHJpbmcoMCwgLTEpKSkubm90LnRvQmUoLTEpO1xuICAgICAgICBleHBlY3Qob3V0cHV0LmluZGV4T2YoJ0ZJTEVfQUNUSVZFPScgKyBkaXJlY3RvcnkgKyAnLmF0b20tYnVpbGQuanNvbicpKS5ub3QudG9CZSgtMSk7XG4gICAgICAgIGV4cGVjdChvdXRwdXQuaW5kZXhPZignRlJPTV9FTlY9JyArIGRpcmVjdG9yeSArICcuYXRvbS1idWlsZC5qc29uJykpLm5vdC50b0JlKC0xKTtcbiAgICAgICAgZXhwZWN0KG91dHB1dC5pbmRleE9mKCdGUk9NX1BST0NFU1NfRU5WPScgKyBkaXJlY3RvcnkgKyAnLmF0b20tYnVpbGQuanNvbicpKS5ub3QudG9CZSgtMSk7XG4gICAgICAgIGV4cGVjdChvdXRwdXQuaW5kZXhPZignRklMRV9BQ1RJVkVfTkFNRT0uYXRvbS1idWlsZC5qc29uJykpLm5vdC50b0JlKC0xKTtcbiAgICAgICAgZXhwZWN0KG91dHB1dC5pbmRleE9mKCdGSUxFX0FDVElWRV9OQU1FX0JBU0U9LmF0b20tYnVpbGQnKSkubm90LnRvQmUoLTEpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aGVuIHRoZSB0ZXh0IGVkaXRvciBpcyBzYXZlZCcsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdzaG91bGQgYnVpbGQgd2hlbiBidWlsZE9uU2F2ZSBpcyB0cnVlJywgZnVuY3Rpb24oKSB7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2J1aWxkLmJ1aWxkT25TYXZlJywgdHJ1ZSk7XG5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGlyZWN0b3J5ICsgJy5hdG9tLWJ1aWxkLmpzb24nLCBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIGNtZDogJ2VjaG8gU3VycHJpc2luZyBpcyB0aGUgcGFzc2luZyBvZiB0aW1lIGJ1dCBub3Qgc28sIGFzIHRoZSB0aW1lIG9mIHBhc3NpbmcuJ1xuICAgICAgfSkpO1xuXG4gICAgICB3YWl0c0ZvclByb21pc2UoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5vcGVuKCdkdW1teScpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgICAgIGVkaXRvci5zYXZlKCk7XG4gICAgICB9KTtcblxuICAgICAgd2FpdHNGb3IoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKSAmJlxuICAgICAgICAgIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpLmNsYXNzTGlzdC5jb250YWlucygnc3VjY2VzcycpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCcpKS50b0V4aXN0KCk7XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAub3V0cHV0JykudGV4dENvbnRlbnQpLnRvTWF0Y2goL1N1cnByaXNpbmcgaXMgdGhlIHBhc3Npbmcgb2YgdGltZSBidXQgbm90IHNvLCBhcyB0aGUgdGltZSBvZiBwYXNzaW5nLyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IGJ1aWxkIHdoZW4gYnVpbGRPblNhdmUgaXMgZmFsc2UnLCBmdW5jdGlvbigpIHtcbiAgICAgIGF0b20uY29uZmlnLnNldCgnYnVpbGQuYnVpbGRPblNhdmUnLCBmYWxzZSk7XG5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGlyZWN0b3J5ICsgJy5hdG9tLWJ1aWxkLmpzb24nLCB7XG4gICAgICAgIGNtZDogJ2VjaG8gXCJoZWxsbywgd29ybGRcIidcbiAgICAgIH0pO1xuXG4gICAgICB3YWl0c0ZvclByb21pc2UoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5vcGVuKCdkdW1teScpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgICAgIGVkaXRvci5zYXZlKCk7XG4gICAgICB9KTtcblxuICAgICAgcnVucyhmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLm5vdC50b0V4aXN0KCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IGF0dGVtcHQgdG8gYnVpbGQgaWYgYnVpbGRPblNhdmUgaXMgdHJ1ZSBhbmQgbm8gYnVpbGQgdG9vbCBleGlzdHMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2J1aWxkLmJ1aWxkT25TYXZlJywgdHJ1ZSk7XG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZShmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4oJ2R1bW15Jyk7XG4gICAgICB9KTtcblxuICAgICAgcnVucyhmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICAgICAgZWRpdG9yLnNhdmUoKTtcbiAgICAgIH0pO1xuXG4gICAgICB3YWl0cygyMDApO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3QoYXRvbS5ub3RpZmljYXRpb25zLmdldE5vdGlmaWNhdGlvbnMoKS5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3doZW4gbXVsdGlwbGUgcHJvamVjdCByb290cyBhcmUgb3BlbicsIGZ1bmN0aW9uICgpIHtcbiAgICBpdCgnc2hvdWxkIHJ1biB0aGUgc2Vjb25kIHJvb3QgaWYgYSBmaWxlIHRoZXJlIGlzIGFjdGl2ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBkaXJlY3RvcnkyID0gZnMucmVhbHBhdGhTeW5jKHRlbXAubWtkaXJTeW5jKHsgcHJlZml4OiAnYXRvbS1idWlsZC1zcGVjLScgfSkpICsgJy8nO1xuICAgICAgYXRvbS5wcm9qZWN0LmFkZFBhdGgoZGlyZWN0b3J5Mik7XG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQtY29uZmlybScpKS5ub3QudG9FeGlzdCgpO1xuXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGRpcmVjdG9yeTIgKyAnLmF0b20tYnVpbGQuanNvbicsIGZzLnJlYWRGaWxlU3luYyhnb29kQXRvbUJ1aWxkZmlsZSkpO1xuICAgICAgd2FpdHNGb3JQcm9taXNlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLm9wZW4oZGlyZWN0b3J5MiArICcvbWFpbi5jJyk7XG4gICAgICB9KTtcblxuICAgICAgcnVucyhmdW5jdGlvbigpIHtcbiAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLnNhdmUoKTtcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dHJpZ2dlcicpO1xuICAgICAgfSk7XG5cbiAgICAgIHdhaXRzRm9yKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykgJiZcbiAgICAgICAgICB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKS5jbGFzc0xpc3QuY29udGFpbnMoJ3N1Y2Nlc3MnKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkudG9FeGlzdCgpO1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLm91dHB1dCcpLnRleHRDb250ZW50KS50b01hdGNoKC9cImNtZFwiOiBcImRkXCIvKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2hlbiBidWlsZCBwYW5lbCBpcyB0b2dnbGVkIGFuZCBpdCBpcyBub3QgdmlzaWJsZScsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdzaG91bGQgc2hvdyB0aGUgYnVpbGQgcGFuZWwnLCBmdW5jdGlvbigpIHtcbiAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCcpKS5ub3QudG9FeGlzdCgpO1xuXG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0b2dnbGUtcGFuZWwnKTtcblxuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLnRvRXhpc3QoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3doZW4gYnVpbGQgaXMgdHJpZ2dlcmVkLCBmb2N1cyBzaG91bGQgYWRoZXJlIHRoZSBzdGVhbEZvY3VzIGNvbmZpZycsIGZ1bmN0aW9uICgpIHtcbiAgICBpdCgnc2hvdWxkIGZvY3VzIHRoZSBidWlsZCBwYW5lbCBpZiBzdGVhbEZvY3VzIGlzIHRydWUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkubm90LnRvRXhpc3QoKTtcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAnLmF0b20tYnVpbGQuanNvbicsIGZzLnJlYWRGaWxlU3luYyhnb29kQXRvbUJ1aWxkZmlsZSkpO1xuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dHJpZ2dlcicpO1xuXG4gICAgICB3YWl0c0ZvcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJyk7XG4gICAgICB9KTtcblxuICAgICAgcnVucyhmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpLnRvSGF2ZUNsYXNzKCdidWlsZCcpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGxlYXZlIGZvY3VzIHVudG91Y2hlZCBpZiBzdGVhbEZvY3VzIGlzIGZhbHNlJywgZnVuY3Rpb24gKCkge1xuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLm5vdC50b0V4aXN0KCk7XG5cbiAgICAgIGF0b20uY29uZmlnLnNldCgnYnVpbGQuc3RlYWxGb2N1cycsIGZhbHNlKTtcbiAgICAgIHZhciBhY3RpdmVFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAnLmF0b20tYnVpbGQuanNvbicsIGZzLnJlYWRGaWxlU3luYyhnb29kQXRvbUJ1aWxkZmlsZSkpO1xuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dHJpZ2dlcicpO1xuXG4gICAgICB3YWl0c0ZvcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJyk7XG4gICAgICB9KTtcblxuICAgICAgcnVucyhmdW5jdGlvbigpIHtcbiAgICAgICAgZXhwZWN0KGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpLnRvRXF1YWwoYWN0aXZlRWxlbWVudCk7XG4gICAgICAgIGV4cGVjdChkb2N1bWVudC5hY3RpdmVFbGVtZW50KS5ub3QudG9IYXZlQ2xhc3MoJ2J1aWxkJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3doZW4gbm8gYnVpbGQgdG9vbHMgYXJlIGF2YWlsYWJsZScsIGZ1bmN0aW9uICgpIHtcbiAgICBpdCgnc2hvdWxkIHNob3cgYSB3YXJuaW5nJywgZnVuY3Rpb24gKCkge1xuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLm5vdC50b0V4aXN0KCk7XG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG5cbiAgICAgIHdhaXRzRm9yKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gYXRvbS5ub3RpZmljYXRpb25zLmdldE5vdGlmaWNhdGlvbnMoKS5sZW5ndGggPiAwO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBub3RpZmljYXRpb24gPSBhdG9tLm5vdGlmaWNhdGlvbnMuZ2V0Tm90aWZpY2F0aW9ucygpWzBdO1xuICAgICAgICBleHBlY3Qobm90aWZpY2F0aW9uLmdldFR5cGUoKSkudG9FcXVhbCgnd2FybmluZycpO1xuICAgICAgICBleHBlY3Qobm90aWZpY2F0aW9uLmdldE1lc3NhZ2UoKSkudG9FcXVhbCgnTm8gZWxpZ2libGUgYnVpbGQgdG9vbC4nKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19
//# sourceURL=/home/champ/.atom/packages/build/spec/build-spec.js
