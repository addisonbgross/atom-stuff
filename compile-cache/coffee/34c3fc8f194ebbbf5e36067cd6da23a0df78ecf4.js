(function() {
  var Modifier, Profiles, TestProfile, XRegExp, testProfileV1, testProfileV2;

  Modifier = require('../lib/stream-modifiers/profile');

  Profiles = require('../lib/profiles/profiles');

  XRegExp = require('xregexp').XRegExp;

  testProfileV1 = TestProfile = (function() {
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

  testProfileV2 = TestProfile = (function() {
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

    TestProfile.prototype["in"] = function(temp, perm) {
      var m;
      if ((m = this.regex.xexec(temp.input)) != null) {
        m.type = 'error';
        this.output.print(m);
        this.output.lint(m);
        return 1;
      }
      return null;
    };

    return TestProfile;

  })();

  describe('Stream Modifier - Highlighting Profile', function() {
    var config, disp1, disp2, mod, output;
    mod = null;
    config = {
      profile: 'test'
    };
    disp1 = null;
    disp2 = null;
    output = null;
    beforeEach(function() {
      output = {
        absolutePath: jasmine.createSpy('absolutePath').andCallFake(function(p) {
          return p;
        }),
        createMessage: jasmine.createSpy('createMessage'),
        replacePrevious: jasmine.createSpy('replacePrevious'),
        print: jasmine.createSpy('print'),
        pushLinterMessage: jasmine.createSpy('pushLinterMessage'),
        createExtensionString: jasmine.createSpy('createExtensionString').andCallFake(function() {
          return '(txt)';
        }),
        createRegex: jasmine.createSpy('createRegex').andCallFake(function(c, s) {
          return new XRegExp(c.replace(/\(\?extensions\)/g, s), 'xni');
        }),
        lint: jasmine.createSpy('lint')
      };
      disp1 = Profiles.addProfile('test1', testProfileV1, 1);
      return disp2 = Profiles.addProfile('test2', testProfileV2, 2);
    });
    afterEach(function() {
      disp2.dispose();
      return disp1.dispose();
    });
    return describe('On constructor', function() {
      beforeEach(function() {
        return mod = new Modifier.modifier({
          profile: 'test1'
        }, null, output);
      });
      return it('has set up the correct modify function', function() {
        return expect(mod.modify).toBe(mod.modify1);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvc3BlYy9zdHJlYW0tbW9kaWZpZXItcHJvZmlsZS1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzRUFBQTs7QUFBQSxFQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsaUNBQVIsQ0FBWCxDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSwwQkFBUixDQURYLENBQUE7O0FBQUEsRUFFQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFNBQVIsQ0FBa0IsQ0FBQyxPQUY3QixDQUFBOztBQUFBLEVBSUEsYUFBQSxHQUNRO0FBQ0osSUFBQSxXQUFDLENBQUEsWUFBRCxHQUFlLE1BQWYsQ0FBQTs7QUFBQSwwQkFFQSxNQUFBLEdBQVEsQ0FBQyxZQUFELENBRlIsQ0FBQTs7QUFBQSwwQkFJQSxrQkFBQSxHQUFvQixDQUFDLEtBQUQsQ0FKcEIsQ0FBQTs7QUFBQSwwQkFNQSxZQUFBLEdBQWMsdUVBTmQsQ0FBQTs7QUFBQSwwQkFVQSxXQUFBLEdBQWEsa0RBVmIsQ0FBQTs7QUFjYSxJQUFBLHFCQUFFLE1BQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsVUFBRCxHQUFjLElBQUMsQ0FBQSxNQUFNLENBQUMscUJBQVIsQ0FBOEIsSUFBQyxDQUFBLE1BQS9CLEVBQXVDLElBQUMsQ0FBQSxrQkFBeEMsQ0FBZCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixDQUFvQixJQUFDLENBQUEsWUFBckIsRUFBbUMsSUFBQyxDQUFBLFVBQXBDLENBRFQsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFDLENBQUEsTUFB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

//# sourceURL=/home/champ/.atom/packages/build-tools/spec/stream-modifier-profile-spec.coffee
