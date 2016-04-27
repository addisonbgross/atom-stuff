'use babel';
'use strict';

var fs = require('fs-extra');
var temp = require('temp');
var specHelpers = require('atom-build-spec-helpers');

describe('Visible', function () {

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

    runs(function () {
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
    });

    waitsForPromise(function () {
      return specHelpers.vouch(temp.mkdir, { prefix: 'atom-build-spec-' }).then(function (dir) {
        return specHelpers.vouch(fs.realpath, dir);
      }).then(function (dir) {
        directory = dir + '/';
        atom.project.setPaths([directory]);
      });
    });
  });

  afterEach(function () {
    fs.removeSync(directory);
  });

  describe('when package is activated with panel visibility set to Keep Visible', function () {
    beforeEach(function () {
      atom.config.set('build.panelVisibility', 'Keep Visible');
      waitsForPromise(function () {
        return atom.packages.activatePackage('build');
      });
    });

    it('should not show build window', function () {
      expect(workspaceElement.querySelector('.build')).not.toExist();
    });
  });

  describe('when package is activated with panel visibility set to Toggle', function () {
    beforeEach(function () {
      atom.config.set('build.panelVisibility', 'Toggle');
      waitsForPromise(function () {
        return atom.packages.activatePackage('build');
      });
    });

    describe('when build panel is toggled and it is visible', function () {
      beforeEach(function () {
        atom.commands.dispatch(workspaceElement, 'build:toggle-panel');
      });

      it('should hide the build panel', function () {
        expect(workspaceElement.querySelector('.build')).toExist();

        atom.commands.dispatch(workspaceElement, 'build:toggle-panel');

        expect(workspaceElement.querySelector('.build')).not.toExist();
      });
    });

    describe('when panel visibility is set to Show on Error', function () {
      it('should only show the build panel if a build fails', function () {
        atom.config.set('build.panelVisibility', 'Show on Error');

        fs.writeFileSync(directory + '.atom-build.json', JSON.stringify({
          cmd: 'echo Surprising is the passing of time but not so, as the time of passing.'
        }));
        atom.commands.dispatch(workspaceElement, 'build:trigger');

        /* Give it some reasonable time to show itself if there is a bug */
        waits(200);

        runs(function () {
          expect(workspaceElement.querySelector('.build')).not.toExist();
        });

        runs(function () {
          fs.writeFileSync(directory + '.atom-build.json', JSON.stringify({
            cmd: 'echo "Very bad..." && exit 2'
          }));
        });

        // .atom-build.json is updated asynchronously... give it some time
        waits(200);

        runs(function () {
          atom.commands.dispatch(workspaceElement, 'build:trigger');
        });

        waitsFor(function () {
          return workspaceElement.querySelector('.build');
        });

        runs(function () {
          expect(workspaceElement.querySelector('.build .output').textContent).toMatch(/Very bad\.\.\./);
        });
      });
    });

    describe('when panel visibility is set to Hidden', function () {
      it('should not show the build panel if build succeeeds', function () {
        atom.config.set('build.panelVisibility', 'Hidden');

        fs.writeFileSync(directory + '.atom-build.json', JSON.stringify({
          cmd: 'echo Surprising is the passing of time but not so, as the time of passing.'
        }));
        atom.commands.dispatch(workspaceElement, 'build:trigger');

        /* Give it some reasonable time to show itself if there is a bug */
        waits(200);

        runs(function () {
          expect(workspaceElement.querySelector('.build')).not.toExist();
        });
      });

      it('should not show the build panel if build fails', function () {
        atom.config.set('build.panelVisibility', 'Hidden');

        fs.writeFileSync(directory + '.atom-build.json', JSON.stringify({
          cmd: 'echo "Very bad..." && exit 2'
        }));
        atom.commands.dispatch(workspaceElement, 'build:trigger');

        /* Give it some reasonable time to show itself if there is a bug */
        waits(200);

        runs(function () {
          expect(workspaceElement.querySelector('.build')).not.toExist();
        });
      });

      it('should show the build panel if it is toggled', function () {
        atom.config.set('build.panelVisibility', 'Hidden');

        fs.writeFileSync(directory + '.atom-build.json', JSON.stringify({
          cmd: 'echo Surprising is the passing of time but not so, as the time of passing.'
        }));
        atom.commands.dispatch(workspaceElement, 'build:trigger');

        waits(200); // Let build finish. Since UI component is not visible yet, there's nothing to poll.

        runs(function () {
          atom.commands.dispatch(workspaceElement, 'build:toggle-panel');
        });

        waitsFor(function () {
          return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('success');
        });

        runs(function () {
          expect(workspaceElement.querySelector('.build .output').textContent).toMatch(/Surprising is the passing of time but not so, as the time of passing/);
        });
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2NoYW1wLy5hdG9tL3BhY2thZ2VzL2J1aWxkL3NwZWMvYnVpbGQtdmlzaWJsZS1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQztBQUNaLFlBQVksQ0FBQzs7QUFFYixJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDN0IsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDOztBQUVyRCxRQUFRLENBQUMsU0FBUyxFQUFFLFlBQVc7O0FBRTdCLE1BQUksU0FBUyxHQUFHLElBQUksQ0FBQztBQUNyQixNQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQzs7QUFFNUIsTUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUViLFlBQVUsQ0FBQyxZQUFXO0FBQ3BCLFFBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzVDLFFBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ25ELFFBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzVDLFFBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzFDLFFBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7O0FBRTNCLG9CQUFnQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN0RCxXQUFPLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDdEMsV0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDcEMsV0FB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LEVBQUcsWUFBWTtBQUM5RCxZQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxRQUFRLENBQUMsQ0FBQzs7QUFFbkQsVUFBRSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEdBQUcsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUM5RCxhQUFHLEVBQUUsNEVBQTRFO1NBQ2xGLENBQUMsQ0FBQyxDQUFDO0FBQ0osWUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsZUFBZSxDQUFDLENBQUM7O0FBRTFELGFBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFWCxZQUFJLENBQUMsWUFBWTtBQUNmLGNBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLG9CQUFvQixDQUFDLENBQUM7U0FDaEUsQ0FBQyxDQUFDOztBQUVILGdCQUFRLENBQUMsWUFBVztBQUNsQixpQkFBTyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLElBQ3BELGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ2pGLENBQUMsQ0FBQzs7QUFFSCxZQUFJLENBQUMsWUFBVztBQUNkLGdCQUFNLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLHNFQUFzRSxDQUFDLENBQUM7U0FDdEosQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDO0tBQ0osQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6Ii9ob21lL2NoYW1wLy5hdG9tL3BhY2thZ2VzL2J1aWxkL3NwZWMvYnVpbGQtdmlzaWJsZS1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBmcyA9IHJlcXVpcmUoJ2ZzLWV4dHJhJyk7XG52YXIgdGVtcCA9IHJlcXVpcmUoJ3RlbXAnKTtcbnZhciBzcGVjSGVscGVycyA9IHJlcXVpcmUoJ2F0b20tYnVpbGQtc3BlYy1oZWxwZXJzJyk7XG5cbmRlc2NyaWJlKCdWaXNpYmxlJywgZnVuY3Rpb24oKSB7XG5cbiAgdmFyIGRpcmVjdG9yeSA9IG51bGw7XG4gIHZhciB3b3Jrc3BhY2VFbGVtZW50ID0gbnVsbDtcblxuICB0ZW1wLnRyYWNrKCk7XG5cbiAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2J1aWxkLmJ1aWxkT25TYXZlJywgZmFsc2UpO1xuICAgIGF0b20uY29uZmlnLnNldCgnYnVpbGQucGFuZWxWaXNpYmlsaXR5JywgJ1RvZ2dsZScpO1xuICAgIGF0b20uY29uZmlnLnNldCgnYnVpbGQuc2F2ZU9uQnVpbGQnLCBmYWxzZSk7XG4gICAgYXRvbS5jb25maWcuc2V0KCdidWlsZC5zdGVhbEZvY3VzJywgdHJ1ZSk7XG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmNsZWFyKCk7XG5cbiAgICB3b3Jrc3BhY2VFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKTtcbiAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHdvcmtzcGFjZUVsZW1lbnQpO1xuICAgIGphc21pbmUudW5zcHkod2luZG93LCAnc2V0VGltZW91dCcpO1xuICAgIGphc21pbmUudW5zcHkod2luZG93LCAnY2xlYXJUaW1lb3V0Jyk7XG5cbiAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgd29ya3NwYWNlRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSk7XG4gICAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHdvcmtzcGFjZUVsZW1lbnQpO1xuICAgIH0pO1xuXG4gICAgd2FpdHNGb3JQcm9taXNlKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHNwZWNIZWxwZXJzLnZvdWNoKHRlbXAubWtkaXIsIHsgcHJlZml4OiAnYXRvbS1idWlsZC1zcGVjLScgfSkudGhlbihmdW5jdGlvbiAoZGlyKSB7XG4gICAgICAgIHJldHVybiBzcGVjSGVscGVycy52b3VjaChmcy5yZWFscGF0aCwgZGlyKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGRpcikge1xuICAgICAgICBkaXJlY3RvcnkgPSBkaXIgKyAnLyc7XG4gICAgICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyhbIGRpcmVjdG9yeSBdKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBhZnRlckVhY2goZnVuY3Rpb24gKCkge1xuICAgIGZzLnJlbW92ZVN5bmMoZGlyZWN0b3J5KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3doZW4gcGFja2FnZSBpcyBhY3RpdmF0ZWQgd2l0aCBwYW5lbCB2aXNpYmlsaXR5IHNldCB0byBLZWVwIFZpc2libGUnLCBmdW5jdGlvbigpIHtcbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIGF0b20uY29uZmlnLnNldCgnYnVpbGQucGFuZWxWaXNpYmlsaXR5JywgJ0tlZXAgVmlzaWJsZScpO1xuICAgICAgd2FpdHNGb3JQcm9taXNlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdidWlsZCcpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzaG93IGJ1aWxkIHdpbmRvdycsIGZ1bmN0aW9uKCkge1xuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLm5vdC50b0V4aXN0KCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aGVuIHBhY2thZ2UgaXMgYWN0aXZhdGVkIHdpdGggcGFuZWwgdmlzaWJpbGl0eSBzZXQgdG8gVG9nZ2xlJywgZnVuY3Rpb24gKCkge1xuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgYXRvbS5jb25maWcuc2V0KCdidWlsZC5wYW5lbFZpc2liaWxpdHknLCAnVG9nZ2xlJyk7XG4gICAgICB3YWl0c0ZvclByb21pc2UoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2J1aWxkJyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd3aGVuIGJ1aWxkIHBhbmVsIGlzIHRvZ2dsZWQgYW5kIGl0IGlzIHZpc2libGUnLCBmdW5jdGlvbigpIHtcbiAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0b2dnbGUtcGFuZWwnKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIGhpZGUgdGhlIGJ1aWxkIHBhbmVsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCcpKS50b0V4aXN0KCk7XG5cbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dG9nZ2xlLXBhbmVsJyk7XG5cbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLm5vdC50b0V4aXN0KCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd3aGVuIHBhbmVsIHZpc2liaWxpdHkgaXMgc2V0IHRvIFNob3cgb24gRXJyb3InLCBmdW5jdGlvbigpIHtcbiAgICAgIGl0KCdzaG91bGQgb25seSBzaG93IHRoZSBidWlsZCBwYW5lbCBpZiBhIGJ1aWxkIGZhaWxzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2J1aWxkLnBhbmVsVmlzaWJpbGl0eScsICdTaG93IG9uIEVycm9yJyk7XG5cbiAgICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAnLmF0b20tYnVpbGQuanNvbicsIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBjbWQ6ICdlY2hvIFN1cnByaXNpbmcgaXMgdGhlIHBhc3Npbmcgb2YgdGltZSBidXQgbm90IHNvLCBhcyB0aGUgdGltZSBvZiBwYXNzaW5nLidcbiAgICAgICAgfSkpO1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG5cbiAgICAgICAgLyogR2l2ZSBpdCBzb21lIHJlYXNvbmFibGUgdGltZSB0byBzaG93IGl0c2VsZiBpZiB0aGVyZSBpcyBhIGJ1ZyAqL1xuICAgICAgICB3YWl0cygyMDApO1xuXG4gICAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLm5vdC50b0V4aXN0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJ1bnMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGlyZWN0b3J5ICsgJy5hdG9tLWJ1aWxkLmpzb24nLCBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBjbWQ6ICdlY2hvIFwiVmVyeSBiYWQuLi5cIiAmJiBleGl0IDInXG4gICAgICAgICAgfSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyAuYXRvbS1idWlsZC5qc29uIGlzIHVwZGF0ZWQgYXN5bmNocm9ub3VzbHkuLi4gZ2l2ZSBpdCBzb21lIHRpbWVcbiAgICAgICAgd2FpdHMoMjAwKTtcblxuICAgICAgICBydW5zKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHdhaXRzRm9yKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCcpO1xuICAgICAgICB9KTtcblxuICAgICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAub3V0cHV0JykudGV4dENvbnRlbnQpLnRvTWF0Y2goL1ZlcnkgYmFkXFwuXFwuXFwuLyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnd2hlbiBwYW5lbCB2aXNpYmlsaXR5IGlzIHNldCB0byBIaWRkZW4nLCBmdW5jdGlvbigpIHtcbiAgICAgIGl0KCdzaG91bGQgbm90IHNob3cgdGhlIGJ1aWxkIHBhbmVsIGlmIGJ1aWxkIHN1Y2NlZWVkcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdidWlsZC5wYW5lbFZpc2liaWxpdHknLCAnSGlkZGVuJyk7XG5cbiAgICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAnLmF0b20tYnVpbGQuanNvbicsIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBjbWQ6ICdlY2hvIFN1cnByaXNpbmcgaXMgdGhlIHBhc3Npbmcgb2YgdGltZSBidXQgbm90IHNvLCBhcyB0aGUgdGltZSBvZiBwYXNzaW5nLidcbiAgICAgICAgfSkpO1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG5cbiAgICAgICAgLyogR2l2ZSBpdCBzb21lIHJlYXNvbmFibGUgdGltZSB0byBzaG93IGl0c2VsZiBpZiB0aGVyZSBpcyBhIGJ1ZyAqL1xuICAgICAgICB3YWl0cygyMDApO1xuXG4gICAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLm5vdC50b0V4aXN0KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgbm90IHNob3cgdGhlIGJ1aWxkIHBhbmVsIGlmIGJ1aWxkIGZhaWxzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2J1aWxkLnBhbmVsVmlzaWJpbGl0eScsICdIaWRkZW4nKTtcblxuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGRpcmVjdG9yeSArICcuYXRvbS1idWlsZC5qc29uJywgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIGNtZDogJ2VjaG8gXCJWZXJ5IGJhZC4uLlwiICYmIGV4aXQgMidcbiAgICAgICAgfSkpO1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG5cbiAgICAgICAgLyogR2l2ZSBpdCBzb21lIHJlYXNvbmFibGUgdGltZSB0byBzaG93IGl0c2VsZiBpZiB0aGVyZSBpcyBhIGJ1ZyAqL1xuICAgICAgICB3YWl0cygyMDApO1xuXG4gICAgICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLm5vdC50b0V4aXN0KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgc2hvdyB0aGUgYnVpbGQgcGFuZWwgaWYgaXQgaXMgdG9nZ2xlZCcsICBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnYnVpbGQucGFuZWxWaXNpYmlsaXR5JywgJ0hpZGRlbicpO1xuXG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGlyZWN0b3J5ICsgJy5hdG9tLWJ1aWxkLmpzb24nLCBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgY21kOiAnZWNobyBTdXJwcmlzaW5nIGlzIHRoZSBwYXNzaW5nIG9mIHRpbWUgYnV0IG5vdCBzbywgYXMgdGhlIHRpbWUgb2YgcGFzc2luZy4nXG4gICAgICAgIH0pKTtcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dHJpZ2dlcicpO1xuXG4gICAgICAgIHdhaXRzKDIwMCk7IC8vIExldCBidWlsZCBmaW5pc2guIFNpbmNlIFVJIGNvbXBvbmVudCBpcyBub3QgdmlzaWJsZSB5ZXQsIHRoZXJlJ3Mgbm90aGluZyB0byBwb2xsLlxuXG4gICAgICAgIHJ1bnMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2J1aWxkOnRvZ2dsZS1wYW5lbCcpO1xuICAgICAgICB9KTtcblxuICAgICAgICB3YWl0c0ZvcihmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykgJiZcbiAgICAgICAgICAgIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpLmNsYXNzTGlzdC5jb250YWlucygnc3VjY2VzcycpO1xuICAgICAgICB9KTtcblxuICAgICAgICBydW5zKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAub3V0cHV0JykudGV4dENvbnRlbnQpLnRvTWF0Y2goL1N1cnByaXNpbmcgaXMgdGhlIHBhc3Npbmcgb2YgdGltZSBidXQgbm90IHNvLCBhcyB0aGUgdGltZSBvZiBwYXNzaW5nLyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=
//# sourceURL=/home/champ/.atom/packages/build/spec/build-visible-spec.js
