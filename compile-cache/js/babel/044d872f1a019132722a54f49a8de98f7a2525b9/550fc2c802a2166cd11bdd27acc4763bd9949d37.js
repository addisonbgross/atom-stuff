'use babel';
'use strict';

var fs = require('fs-extra');
var temp = require('temp');
var specHelpers = require('atom-build-spec-helpers');

describe('Keymap', function () {
  var directory = null;
  var workspaceElement = null;

  temp.track();

  beforeEach(function () {
    directory = fs.realpathSync(temp.mkdirSync({ prefix: 'atom-build-spec-' })) + '/';
    atom.project.setPaths([directory]);

    atom.config.set('build.buildOnSave', false);
    atom.config.set('build.panelVisibility', 'Toggle');
    atom.config.set('build.saveOnBuild', false);

    jasmine.unspy(window, 'setTimeout');
    jasmine.unspy(window, 'clearTimeout');

    runs(function () {
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
    });

    waitsForPromise(function () {
      return atom.packages.activatePackage('build');
    });
  });

  afterEach(function () {
    fs.removeSync(directory);
  });

  describe('when custom keymap is defined in .atom-build.json', function () {
    it('should trigger the build when that key combination is pressed', function () {

      fs.writeFileSync(directory + '.atom-build.json', JSON.stringify({
        name: 'The default build',
        cmd: 'echo default',
        targets: {
          'keymapped build': {
            cmd: 'echo keymapped',
            keymap: 'ctrl-alt-k'
          }
        }
      }));

      runs(function () {
        atom.commands.dispatch(workspaceElement, 'build:trigger');
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('success');
      });

      runs(function () {
        expect(workspaceElement.querySelector('.build .output').textContent).toMatch(/default/);
        atom.commands.dispatch(workspaceElement, 'build:toggle-panel');
      });

      waitsFor(function () {
        return !workspaceElement.querySelector('.build .title');
      });

      runs(function () {
        specHelpers.keydown('k', { ctrl: true, alt: true, element: workspaceElement });
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('success');
      });

      runs(function () {
        expect(workspaceElement.querySelector('.build .output').textContent).toMatch(/keymapped/);
      });
    });

    it('should not changed the set active build', function () {

      fs.writeFileSync(directory + '.atom-build.json', JSON.stringify({
        name: 'The default build',
        cmd: 'echo default',
        targets: {
          'keymapped build': {
            cmd: 'echo keymapped',
            keymap: 'ctrl-alt-k'
          }
        }
      }));

      runs(function () {
        atom.commands.dispatch(workspaceElement, 'build:trigger');
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('success');
      });

      runs(function () {
        expect(workspaceElement.querySelector('.build .output').textContent).toMatch(/default/);
        atom.commands.dispatch(workspaceElement, 'build:toggle-panel');
      });

      waitsFor(function () {
        return !workspaceElement.querySelector('.build .title');
      });

      runs(function () {
        specHelpers.keydown('k', { ctrl: true, alt: true, element: workspaceElement });
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('success');
      });

      runs(function () {
        expect(workspaceElement.querySelector('.build .output').textContent).toMatch(/keymapped/);
        atom.commands.dispatch(workspaceElement, 'build:toggle-panel');
      });

      waitsFor(function () {
        return !workspaceElement.querySelector('.build .title');
      });

      runs(function () {
        atom.commands.dispatch(workspaceElement, 'build:trigger');
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('success');
      });

      runs(function () {
        expect(workspaceElement.querySelector('.build .output').textContent).toMatch(/default/);
        atom.commands.dispatch(workspaceElement, 'build:toggle-panel');
      });
    });

    it('should dispose keymap when reloading targets', function () {
      fs.writeFileSync(directory + '.atom-build.json', JSON.stringify({
        name: 'The default build',
        cmd: 'echo default',
        targets: {
          'keymapped build': {
            cmd: 'echo keymapped',
            keymap: 'ctrl-alt-k'
          }
        }
      }));

      runs(function () {
        atom.commands.dispatch(workspaceElement, 'build:trigger');
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('success');
      });

      runs(function () {
        expect(workspaceElement.querySelector('.build .output').textContent).toMatch(/default/);
        atom.commands.dispatch(workspaceElement, 'build:toggle-panel');
      });

      waitsFor(function () {
        return !workspaceElement.querySelector('.build .title');
      });

      runs(function () {
        specHelpers.keydown('k', { ctrl: true, alt: true, element: workspaceElement });
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('success');
      });

      runs(function () {
        expect(workspaceElement.querySelector('.build .output').textContent).toMatch(/keymapped/);
        atom.commands.dispatch(workspaceElement, 'build:toggle-panel');
        fs.writeFileSync(directory + '.atom-build.json', JSON.stringify({
          name: 'The default build',
          cmd: 'echo default',
          targets: {
            'keymapped build': {
              cmd: 'echo ctrl-x new file',
              keymap: 'ctrl-x'
            }
          }
        }));
      });

      waits(300); // Custom file is reloaded automatically

      runs(function () {
        specHelpers.keydown('k', { ctrl: true, alt: true, element: workspaceElement });
      });

      waits(300);

      runs(function () {
        expect(workspaceElement.querySelector('.build')).not.toExist();
        specHelpers.keydown('x', { ctrl: true, element: workspaceElement });
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('success');
      });

      runs(function () {
        expect(workspaceElement.querySelector('.build .output').textContent).toMatch(/ctrl-x new file/);
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2NoYW1wLy5hdG9tL3BhY2thZ2VzL2J1aWxkL3NwZWMvYnVpbGQta2V5bWFwLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDO0FBQ1osWUFBWSxDQUFDOztBQUViLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM3QixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7O0FBRXJELFFBQVEsQ0FBQyxRQUFRLEVBQUUsWUFBVztBQUM1QixNQUFJLFNBQVMsR0FBRyxJQUFJLENBQUM7QUFDckIsTUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7O0FBRTVCLE1BQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7QUFFYixZQUFVLENBQUMsWUFBVztBQUNwQixhQUFTLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsTUFBTSxFQUFFLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUNsRixRQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFFLFNBQVMsQ0FBRSxDQUFDLENBQUM7O0FBRXJDLFFBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzVDLFFBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ25ELFFBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUU1QyxXQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztBQUNwQyxXQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsQ0FBQzs7QUFFdEMsUUFB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QyxDQUFDO09BQ3JFLENBQUMsQ0FBQzs7QUFFSCxjQUFRLENBQUMsWUFBWTtBQUNuQixlQUFPLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsSUFDbEQsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7T0FDbkYsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxZQUFZO0FBQ2YsY0FBTSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO09BQ2pHLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQyIsImZpbGUiOiIvaG9tZS9jaGFtcC8uYXRvbS9wYWNrYWdlcy9idWlsZC9zcGVjL2J1aWxkLWtleW1hcC1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBmcyA9IHJlcXVpcmUoJ2ZzLWV4dHJhJyk7XG52YXIgdGVtcCA9IHJlcXVpcmUoJ3RlbXAnKTtcbnZhciBzcGVjSGVscGVycyA9IHJlcXVpcmUoJ2F0b20tYnVpbGQtc3BlYy1oZWxwZXJzJyk7XG5cbmRlc2NyaWJlKCdLZXltYXAnLCBmdW5jdGlvbigpIHtcbiAgdmFyIGRpcmVjdG9yeSA9IG51bGw7XG4gIHZhciB3b3Jrc3BhY2VFbGVtZW50ID0gbnVsbDtcblxuICB0ZW1wLnRyYWNrKCk7XG5cbiAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgICBkaXJlY3RvcnkgPSBmcy5yZWFscGF0aFN5bmModGVtcC5ta2RpclN5bmMoeyBwcmVmaXg6ICdhdG9tLWJ1aWxkLXNwZWMtJyB9KSkgKyAnLyc7XG4gICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzKFsgZGlyZWN0b3J5IF0pO1xuXG4gICAgYXRvbS5jb25maWcuc2V0KCdidWlsZC5idWlsZE9uU2F2ZScsIGZhbHNlKTtcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2J1aWxkLnBhbmVsVmlzaWJpbGl0eScsICdUb2dnbGUnKTtcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2J1aWxkLnNhdmVPbkJ1aWxkJywgZmFsc2UpO1xuXG4gICAgamFzbWluZS51bnNweSh3aW5kb3csICdzZXRUaW1lb3V0Jyk7XG4gICAgamFzbWluZS51bnNweSh3aW5kb3csICdjbGVhclRpbWVvdXQnKTtcblxuICAgIHJ1bnMoZnVuY3Rpb24oKSB7XG4gICAgICB3b3Jrc3BhY2VFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKTtcbiAgICAgIGphc21pbmUuYXR0YWNoVG9ET00od29ya3NwYWNlRWxlbWVudCk7XG4gICAgfSk7XG5cbiAgICB3YWl0c0ZvclByb21pc2UoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2J1aWxkJyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGFmdGVyRWFjaChmdW5jdGlvbigpIHtcbiAgICBmcy5yZW1vdmVTeW5jKGRpcmVjdG9yeSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aGVuIGN1c3RvbSBrZXltYXAgaXMgZGVmaW5lZCBpbiAuYXRvbS1idWlsZC5qc29uJywgZnVuY3Rpb24gKCkge1xuICAgIGl0KCdzaG91bGQgdHJpZ2dlciB0aGUgYnVpbGQgd2hlbiB0aGF0IGtleSBjb21iaW5hdGlvbiBpcyBwcmVzc2VkJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGRpcmVjdG9yeSArICcuYXRvbS1idWlsZC5qc29uJywgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBuYW1lOiAnVGhlIGRlZmF1bHQgYnVpbGQnLFxuICAgICAgICBjbWQ6ICdlY2hvIGRlZmF1bHQnLFxuICAgICAgICB0YXJnZXRzOiB7XG4gICAgICAgICAgJ2tleW1hcHBlZCBidWlsZCc6IHtcbiAgICAgICAgICAgIGNtZDogJ2VjaG8ga2V5bWFwcGVkJyxcbiAgICAgICAgICAgIGtleW1hcDogJ2N0cmwtYWx0LWsnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24gKCkge1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG4gICAgICB9KTtcblxuICAgICAgd2FpdHNGb3IoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykgJiZcbiAgICAgICAgICB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKS5jbGFzc0xpc3QuY29udGFpbnMoJ3N1Y2Nlc3MnKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC5vdXRwdXQnKS50ZXh0Q29udGVudCkudG9NYXRjaCgvZGVmYXVsdC8pO1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0b2dnbGUtcGFuZWwnKTtcbiAgICAgIH0pO1xuXG4gICAgICB3YWl0c0ZvcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICF3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc3BlY0hlbHBlcnMua2V5ZG93bignaycsIHsgY3RybDogdHJ1ZSwgYWx0OiB0cnVlLCBlbGVtZW50OiB3b3Jrc3BhY2VFbGVtZW50IH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHdhaXRzRm9yKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykgJiZcbiAgICAgICAgICB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKS5jbGFzc0xpc3QuY29udGFpbnMoJ3N1Y2Nlc3MnKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC5vdXRwdXQnKS50ZXh0Q29udGVudCkudG9NYXRjaCgva2V5bWFwcGVkLyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IGNoYW5nZWQgdGhlIHNldCBhY3RpdmUgYnVpbGQnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGlyZWN0b3J5ICsgJy5hdG9tLWJ1aWxkLmpzb24nLCBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIG5hbWU6ICdUaGUgZGVmYXVsdCBidWlsZCcsXG4gICAgICAgIGNtZDogJ2VjaG8gZGVmYXVsdCcsXG4gICAgICAgIHRhcmdldHM6IHtcbiAgICAgICAgICAna2V5bWFwcGVkIGJ1aWxkJzoge1xuICAgICAgICAgICAgY21kOiAnZWNobyBrZXltYXBwZWQnLFxuICAgICAgICAgICAga2V5bWFwOiAnY3RybC1hbHQtaydcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pKTtcblxuICAgICAgcnVucyhmdW5jdGlvbiAoKSB7XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2J1aWxkOnRyaWdnZXInKTtcbiAgICAgIH0pO1xuXG4gICAgICB3YWl0c0ZvcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKSAmJlxuICAgICAgICAgIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpLmNsYXNzTGlzdC5jb250YWlucygnc3VjY2VzcycpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24gKCkge1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLm91dHB1dCcpLnRleHRDb250ZW50KS50b01hdGNoKC9kZWZhdWx0Lyk7XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2J1aWxkOnRvZ2dsZS1wYW5lbCcpO1xuICAgICAgfSk7XG5cbiAgICAgIHdhaXRzRm9yKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gIXdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24gKCkge1xuICAgICAgICBzcGVjSGVscGVycy5rZXlkb3duKCdrJywgeyBjdHJsOiB0cnVlLCBhbHQ6IHRydWUsIGVsZW1lbnQ6IHdvcmtzcGFjZUVsZW1lbnQgfSk7XG4gICAgICB9KTtcblxuICAgICAgd2FpdHNGb3IoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKSAmJlxuICAgICAgICAgIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpLmNsYXNzTGlzdC5jb250YWlucygnc3VjY2VzcycpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24gKCkge1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLm91dHB1dCcpLnRleHRDb250ZW50KS50b01hdGNoKC9rZXltYXBwZWQvKTtcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dG9nZ2xlLXBhbmVsJyk7XG4gICAgICB9KTtcblxuICAgICAgd2FpdHNGb3IoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAhd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJyk7XG4gICAgICB9KTtcblxuICAgICAgcnVucyhmdW5jdGlvbiAoKSB7XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2J1aWxkOnRyaWdnZXInKTtcbiAgICAgIH0pO1xuXG4gICAgICB3YWl0c0ZvcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKSAmJlxuICAgICAgICAgIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpLmNsYXNzTGlzdC5jb250YWlucygnc3VjY2VzcycpO1xuICAgICAgfSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24gKCkge1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLm91dHB1dCcpLnRleHRDb250ZW50KS50b01hdGNoKC9kZWZhdWx0Lyk7XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2J1aWxkOnRvZ2dsZS1wYW5lbCcpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGRpc3Bvc2Uga2V5bWFwIHdoZW4gcmVsb2FkaW5nIHRhcmdldHMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGRpcmVjdG9yeSArICcuYXRvbS1idWlsZC5qc29uJywgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBuYW1lOiAnVGhlIGRlZmF1bHQgYnVpbGQnLFxuICAgICAgICBjbWQ6ICdlY2hvIGRlZmF1bHQnLFxuICAgICAgICB0YXJnZXRzOiB7XG4gICAgICAgICAgJ2tleW1hcHBlZCBidWlsZCc6IHtcbiAgICAgICAgICAgIGNtZDogJ2VjaG8ga2V5bWFwcGVkJyxcbiAgICAgICAgICAgIGtleW1hcDogJ2N0cmwtYWx0LWsnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KSk7XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24gKCkge1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG4gICAgICB9KTtcblxuICAgICAgd2FpdHNGb3IoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykgJiZcbiAgICAgICAgICB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKS5jbGFzc0xpc3QuY29udGFpbnMoJ3N1Y2Nlc3MnKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC5vdXRwdXQnKS50ZXh0Q29udGVudCkudG9NYXRjaCgvZGVmYXVsdC8pO1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0b2dnbGUtcGFuZWwnKTtcbiAgICAgIH0pO1xuXG4gICAgICB3YWl0c0ZvcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICF3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc3BlY0hlbHBlcnMua2V5ZG93bignaycsIHsgY3RybDogdHJ1ZSwgYWx0OiB0cnVlLCBlbGVtZW50OiB3b3Jrc3BhY2VFbGVtZW50IH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHdhaXRzRm9yKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykgJiZcbiAgICAgICAgICB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKS5jbGFzc0xpc3QuY29udGFpbnMoJ3N1Y2Nlc3MnKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC5vdXRwdXQnKS50ZXh0Q29udGVudCkudG9NYXRjaCgva2V5bWFwcGVkLyk7XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2J1aWxkOnRvZ2dsZS1wYW5lbCcpO1xuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGRpcmVjdG9yeSArICcuYXRvbS1idWlsZC5qc29uJywgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIG5hbWU6ICdUaGUgZGVmYXVsdCBidWlsZCcsXG4gICAgICAgICAgY21kOiAnZWNobyBkZWZhdWx0JyxcbiAgICAgICAgICB0YXJnZXRzOiB7XG4gICAgICAgICAgICAna2V5bWFwcGVkIGJ1aWxkJzoge1xuICAgICAgICAgICAgICBjbWQ6ICdlY2hvIGN0cmwteCBuZXcgZmlsZScsXG4gICAgICAgICAgICAgIGtleW1hcDogJ2N0cmwteCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICAgIH0pO1xuXG4gICAgICB3YWl0cygzMDApOyAvLyBDdXN0b20gZmlsZSBpcyByZWxvYWRlZCBhdXRvbWF0aWNhbGx5XG5cbiAgICAgIHJ1bnMoZnVuY3Rpb24gKCkge1xuICAgICAgICBzcGVjSGVscGVycy5rZXlkb3duKCdrJywgeyBjdHJsOiB0cnVlLCBhbHQ6IHRydWUsIGVsZW1lbnQ6IHdvcmtzcGFjZUVsZW1lbnQgfSk7XG4gICAgICB9KTtcblxuICAgICAgd2FpdHMoMzAwKTtcblxuICAgICAgcnVucyhmdW5jdGlvbiAoKSB7XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCcpKS5ub3QudG9FeGlzdCgpO1xuICAgICAgICBzcGVjSGVscGVycy5rZXlkb3duKCd4JywgeyBjdHJsOiB0cnVlLCBlbGVtZW50OiB3b3Jrc3BhY2VFbGVtZW50IH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHdhaXRzRm9yKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpICYmXG4gICAgICAgICAgICB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKS5jbGFzc0xpc3QuY29udGFpbnMoJ3N1Y2Nlc3MnKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC5vdXRwdXQnKS50ZXh0Q29udGVudCkudG9NYXRjaCgvY3RybC14IG5ldyBmaWxlLyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==
//# sourceURL=/home/champ/.atom/packages/build/spec/build-keymap-spec.js
