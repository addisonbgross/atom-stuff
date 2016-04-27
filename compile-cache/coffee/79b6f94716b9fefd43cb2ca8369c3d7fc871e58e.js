(function() {
  var Modifiers, Outputs, Profiles, Providers, TestPane, TestProfile, TestProvider, TestProviderView, main, testModifier, testOutput, testProfile, testProvider;

  Profiles = require('../lib/profiles/profiles');

  Outputs = require('../lib/output/output');

  Providers = require('../lib/provider/provider');

  Modifiers = require('../lib/modifier/modifier');

  main = require('../lib/main');

  testProfile = TestProfile = (function() {
    TestProfile.profile_name = 'Test';

    TestProfile.prototype.scopes = ['text.plain'];

    TestProfile.prototype.default_extensions = ['txt'];

    TestProfile.prototype.regex_string = '^(?<file> [\\S]+\\.(?extensions)):(?<row> [\\d]+):[ ](?<message> .+)$';

    TestProfile.prototype.file_string = '(?<file> [\\S]+\\.(?extensions)):(?<row> [\\d]+)';

    function TestProfile(output) {
      this.output = output;
      this.extensions = this.output.createExtensionString(this.scopes, this.default_extensions);
      this.regex = this.output.createRegex(this.regex_string, this.extensions);
      this.regex_file = this.output.createRegex(this.file_string, this.extensions);
    }

    TestProfile.prototype.files = function(line) {
      var m, out, start;
      start = 0;
      out = [];
      while ((m = this.regex_file.xexec(line.substr(start))) != null) {
        start += m.index;
        m.start = start;
        m.end = start + m.file.length + m.row.length;
        m.col = '0';
        start = m.end + 1;
        out.push(m);
      }
      return out;
    };

    TestProfile.prototype["in"] = function(line) {
      var m;
      if ((m = this.regex.xexec(line)) != null) {
        m.type = 'error';
        this.output.print(m);
        return this.output.lint(m);
      }
    };

    return TestProfile;

  })();

  testModifier = {
    name: 'Test modifier',
    preSplit: function(command) {}
  };

  testProvider = {
    name: 'Test commands',
    model: TestProvider = (function() {
      function TestProvider() {}

      return TestProvider;

    })(),
    view: TestProviderView = (function() {
      function TestProviderView() {}

      return TestProviderView;

    })()
  };

  testOutput = {
    name: 'Test Output',
    description: 'Test Output',
    "private": false,
    edit: TestPane = (function() {
      function TestPane() {}

      TestPane.prototype.set = function(command) {};

      TestPane.prototype.get = function(command) {};

      return TestPane;

    })()
  };

  describe('Linter Service', function() {
    return it('has all necessary properties', function() {
      var provider;
      provider = main.provideLinter();
      expect(provider.grammarScopes).toBeDefined();
      expect(provider.scope).toBeDefined();
      expect(provider.lintOnFly).toBeDefined();
      return expect(provider.lint).toBeDefined();
    });
  });

  describe('Input Service', function() {
    return it('has all necessary properties', function() {
      var obj;
      obj = main.provideInput();
      expect(obj.Input).toBe(require('../lib/provider/input'));
      expect(obj.ProviderModules).toBe(Providers);
      expect(obj.ProfileModules).toBe(Profiles);
      expect(obj.OutputModules).toBe(Outputs);
      return expect(obj.ModifierModules).toBe(Modifiers);
    });
  });

  describe('Profile Service', function() {
    var disp;
    disp = [][0];
    beforeEach(function() {
      return disp = main.consumeProfileModuleV1({
        key: 'test',
        profile: testProfile
      });
    });
    afterEach(function() {
      Profiles.reset();
      return disp = null;
    });
    it('returns a disposable', function() {
      var Disposable;
      Disposable = require('atom').Disposable;
      return expect(disp instanceof Disposable).toBeTruthy();
    });
    it('adds the profile with all necessary properties', function() {
      expect(Profiles.profiles['test']).toBeDefined();
      expect(Profiles.profiles['test'].profile_name).toBe('Test');
      return expect(Profiles.profiles['test'].prototype.scopes).toEqual(['text.plain']);
    });
    return describe('when disposing the profile disposable', function() {
      return it('removes the profile', function() {
        disp.dispose();
        return expect(Profiles.profiles['test']).toBeUndefined();
      });
    });
  });

  describe('Output Service', function() {
    var disp;
    disp = [][0];
    beforeEach(function() {
      testOutput.activate = jasmine.createSpy('activate');
      testOutput.deactivate = jasmine.createSpy('deactivate');
      return disp = main.consumeOutputModule({
        key: 'test',
        mod: testOutput
      });
    });
    afterEach(function() {
      Outputs.reset();
      return disp = null;
    });
    it('returns a disposable', function() {
      var Disposable;
      Disposable = require('atom').Disposable;
      return expect(disp instanceof Disposable).toBeTruthy();
    });
    it('adds the module with all necessary properties', function() {
      expect(Outputs.modules['test']).toBeDefined();
      return expect(Outputs.modules['test'].name).toBe('Test Output');
    });
    describe('when activating the module', function() {
      beforeEach(function() {
        return Outputs.activate('test');
      });
      it('calls activate', function() {
        return expect(testOutput.activate).toHaveBeenCalled();
      });
      it('sets the active flag', function() {
        return expect(testOutput.active).toBe(true);
      });
      return describe('when deactivating the module', function() {
        beforeEach(function() {
          return Outputs.deactivate('test');
        });
        it('calls deactivate', function() {
          return expect(testOutput.deactivate).toHaveBeenCalled();
        });
        return it('unsets the active flag', function() {
          return expect(testOutput.active).toBe(null);
        });
      });
    });
    return describe('when disposing the module disposable', function() {
      beforeEach(function() {
        testOutput.active = true;
        return disp.dispose();
      });
      it('removes the module', function() {
        return expect(Outputs.modules['test']).toBeUndefined();
      });
      return it('calls deactivate', function() {
        return expect(testOutput.deactivate).toHaveBeenCalled();
      });
    });
  });

  describe('Modifier Service', function() {
    var disp;
    disp = [][0];
    beforeEach(function() {
      testModifier.activate = jasmine.createSpy('activate');
      testModifier.deactivate = jasmine.createSpy('deactivate');
      return disp = main.consumeModifierModule({
        key: 'test',
        mod: testModifier
      });
    });
    afterEach(function() {
      Modifiers.reset();
      return disp = null;
    });
    it('returns a disposable', function() {
      var Disposable;
      Disposable = require('atom').Disposable;
      return expect(disp instanceof Disposable).toBeTruthy();
    });
    it('adds the module with all necessary properties', function() {
      expect(Modifiers.modules['test']).toBeDefined();
      return expect(Modifiers.modules['test'].name).toBe('Test modifier');
    });
    describe('when activating the module', function() {
      beforeEach(function() {
        return Modifiers.activate('test');
      });
      it('calls activate', function() {
        return expect(testModifier.activate).toHaveBeenCalled();
      });
      it('sets the active flag', function() {
        return expect(testModifier.active).toBe(true);
      });
      return describe('when deactivating the module', function() {
        beforeEach(function() {
          return Modifiers.deactivate('test');
        });
        it('calls deactivate', function() {
          return expect(testModifier.deactivate).toHaveBeenCalled();
        });
        return it('unsets the active flag', function() {
          return expect(testModifier.active).toBe(null);
        });
      });
    });
    return describe('when disposing the module disposable', function() {
      beforeEach(function() {
        testModifier.active = true;
        return disp.dispose();
      });
      it('removes the module', function() {
        return expect(Modifiers.modules['test']).toBeUndefined();
      });
      return it('calls deactivate', function() {
        return expect(testModifier.deactivate).toHaveBeenCalled();
      });
    });
  });

  describe('Provider Service', function() {
    var disp;
    disp = [][0];
    beforeEach(function() {
      testProvider.activate = jasmine.createSpy('activate');
      testProvider.deactivate = jasmine.createSpy('deactivate');
      return disp = main.consumeProviderModule({
        key: 'test',
        mod: testProvider
      });
    });
    afterEach(function() {
      Providers.reset();
      return disp = null;
    });
    it('returns a disposable', function() {
      var Disposable;
      Disposable = require('atom').Disposable;
      return expect(disp instanceof Disposable).toBeTruthy();
    });
    it('adds the module with all necessary properties', function() {
      expect(Providers.modules['test']).toBeDefined();
      return expect(Providers.modules['test'].name).toBe('Test commands');
    });
    describe('when activating the module', function() {
      beforeEach(function() {
        return Providers.activate('test');
      });
      it('calls activate', function() {
        return expect(testProvider.activate).toHaveBeenCalled();
      });
      it('sets the active flag', function() {
        return expect(testProvider.active).toBe(true);
      });
      return describe('when deactivating the module', function() {
        beforeEach(function() {
          return Providers.deactivate('test');
        });
        it('calls deactivate', function() {
          return expect(testProvider.deactivate).toHaveBeenCalled();
        });
        return it('unsets the active flag', function() {
          return expect(testProvider.active).toBe(null);
        });
      });
    });
    return describe('when disposing the module disposable', function() {
      beforeEach(function() {
        testProvider.active = true;
        return disp.dispose();
      });
      it('removes the module', function() {
        return expect(Providers.modules['test']).toBeUndefined();
      });
      return it('calls deactivate', function() {
        return expect(testProvider.deactivate).toHaveBeenCalled();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvc3BlYy9zZXJ2aWNlLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlKQUFBOztBQUFBLEVBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSwwQkFBUixDQUFYLENBQUE7O0FBQUEsRUFDQSxPQUFBLEdBQVUsT0FBQSxDQUFRLHNCQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUVBLFNBQUEsR0FBWSxPQUFBLENBQVEsMEJBQVIsQ0FGWixDQUFBOztBQUFBLEVBR0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSwwQkFBUixDQUhaLENBQUE7O0FBQUEsRUFJQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGFBQVIsQ0FKUCxDQUFBOztBQUFBLEVBTUEsV0FBQSxHQUNRO0FBQ0osSUFBQSxXQUFDLENBQUEsWUFBRCxHQUFlLE1BQWYsQ0FBQTs7QUFBQSwwQkFFQSxNQUFBLEdBQVEsQ0FBQyxZQUFELENBRlIsQ0FBQTs7QUFBQSwwQkFJQSxrQkFBQSxHQUFvQixDQUFDLEtBQUQsQ0FKcEIsQ0FBQTs7QUFBQSwwQkFNQSxZQUFBLEdBQWMsdUVBTmQsQ0FBQTs7QUFBQSwwQkFVQSxXQUFBLEdBQWEsa0RBVmIsQ0FBQTs7QUFjYSxJQUFBLHFCQUFFLE1BQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsVUFBRCxHQUFjLElBQUMsQ0FBQSxNQUFNLENBQUMscUJBQVIsQ0FBOEIsSUFBQyxDQUFBLE1BQS9CLEVBQXVDLElBQUMsQ0FBQSxrQkFBeEMsQ0FBZCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixDQUFvQixJQUFDLENBQUEsWUFBckIsRUFBbUMsSUFB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

//# sourceURL=/home/champ/.atom/packages/build-tools/spec/service-spec.coffee
