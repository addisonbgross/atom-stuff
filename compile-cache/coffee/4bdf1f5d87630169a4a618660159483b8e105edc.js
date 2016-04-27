(function() {
  describe('Linter Config', function() {
    var CP, FS, Helpers, getLinter, getMessage, linter, _ref;
    linter = null;
    _ref = require('./common'), getLinter = _ref.getLinter, getMessage = _ref.getMessage;
    CP = require('child_process');
    FS = require('fs');
    Helpers = require('../lib/helpers');
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.packages.activatePackage('linter').then(function() {
          return linter = atom.packages.getActivePackage('linter').mainModule.instance;
        });
      });
    });
    describe('ignoredMessageTypes', function() {
      return it('ignores certain types of messages', function() {
        var linterProvider;
        linterProvider = getLinter();
        expect(linter.messages.publicMessages.length).toBe(0);
        linter.messages.set({
          linter: linterProvider,
          messages: [getMessage('Error'), getMessage('Warning')]
        });
        linter.messages.updatePublic();
        expect(linter.messages.publicMessages.length).toBe(2);
        atom.config.set('linter.ignoredMessageTypes', ['Error']);
        linter.messages.set({
          linter: linterProvider,
          messages: [getMessage('Error'), getMessage('Warning')]
        });
        linter.messages.updatePublic();
        return expect(linter.messages.publicMessages.length).toBe(1);
      });
    });
    describe('statusIconScope', function() {
      return it('only shows messages of the current scope', function() {
        var linterProvider;
        linterProvider = getLinter();
        expect(linter.views.bottomContainer.status.count).toBe(0);
        linter.messages.set({
          linter: linterProvider,
          messages: [getMessage('Error', '/tmp/test.coffee')]
        });
        linter.messages.updatePublic();
        expect(linter.views.bottomContainer.status.count).toBe(1);
        atom.config.set('linter.statusIconScope', 'File');
        expect(linter.views.bottomContainer.status.count).toBe(0);
        atom.config.set('linter.statusIconScope', 'Project');
        return expect(linter.views.bottomContainer.status.count).toBe(1);
      });
    });
    describe('ignoreVCSIgnoredFiles', function() {
      return it('ignores the file if its ignored by the VCS', function() {
        var filePath, linterProvider;
        filePath = "/tmp/linter_test_file";
        FS.writeFileSync(filePath, "'use strict'\n");
        atom.config.set('linter.ignoreVCSIgnoredFiles', true);
        linterProvider = getLinter();
        spyOn(linterProvider, 'lint');
        spyOn(Helpers, 'isPathIgnored').andCallFake(function() {
          return true;
        });
        linter.addLinter(linterProvider);
        return waitsForPromise(function() {
          return atom.workspace.open(filePath).then(function() {
            linter.commands.lint();
            expect(linterProvider.lint).not.toHaveBeenCalled();
            atom.config.set('linter.ignoreVCSIgnoredFiles', false);
            linter.commands.lint();
            expect(linterProvider.lint).toHaveBeenCalled();
            return CP.execSync("rm -f " + filePath);
          });
        });
      });
    });
    return describe('ignoreMatchedFiles', function() {
      return it('ignores the file if it matches pattern', function() {
        var filePath, linterProvider;
        filePath = '/tmp/linter_spec_test.min.js';
        FS.writeFileSync(filePath, "'use strict'\n");
        atom.config.set('linter.ignoreMatchedFiles', '/**/*.min.{js,css}');
        linterProvider = getLinter();
        spyOn(linterProvider, 'lint');
        linter.addLinter(linterProvider);
        return waitsForPromise(function() {
          return atom.workspace.open(filePath).then(function() {
            linter.commands.lint();
            expect(linterProvider.lint).not.toHaveBeenCalled();
            atom.config.set('linter.ignoreMatchedFiles', '/**/*.min.css');
            linter.commands.lint();
            expect(linterProvider.lint).toHaveBeenCalled();
            return CP.execSync("rm -f " + filePath);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvbGludGVyL3NwZWMvY29uZmlnLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFFBQUEsQ0FBUyxlQUFULEVBQTBCLFNBQUEsR0FBQTtBQUN4QixRQUFBLG9EQUFBO0FBQUEsSUFBQSxNQUFBLEdBQVMsSUFBVCxDQUFBO0FBQUEsSUFDQSxPQUEwQixPQUFBLENBQVEsVUFBUixDQUExQixFQUFDLGlCQUFBLFNBQUQsRUFBWSxrQkFBQSxVQURaLENBQUE7QUFBQSxJQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsZUFBUixDQUZMLENBQUE7QUFBQSxJQUdBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUhMLENBQUE7QUFBQSxJQUlBLE9BQUEsR0FBVSxPQUFBLENBQVEsZ0JBQVIsQ0FKVixDQUFBO0FBQUEsSUFLQSxVQUFBLENBQVcsU0FBQSxHQUFBO2FBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsUUFBOUIsQ0FBdUMsQ0FBQyxJQUF4QyxDQUE2QyxTQUFBLEdBQUE7aUJBQzNDLE1BQUEsR0FBUyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFkLENBQStCLFFBQS9CLENBQXdDLENBQUMsVUFBVSxDQUFDLFNBRGxCO1FBQUEsQ0FBN0MsRUFEYztNQUFBLENBQWhCLEVBRFM7SUFBQSxDQUFYLENBTEEsQ0FBQTtBQUFBLElBVUEsUUFBQSxDQUFTLHFCQUFULEVBQWdDLFNBQUEsR0FBQTthQUM5QixFQUFBLENBQUcsbUNBQUgsRUFBd0MsU0FBQSxHQUFBO0FBQ3RDLFlBQUEsY0FBQTtBQUFBLFFBQUEsY0FBQSxHQUFpQixTQUFBLENBQUEsQ0FBakIsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FB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

//# sourceURL=/home/champ/.atom/packages/linter/spec/config-spec.coffee
