(function() {
  var Modifier;

  Modifier = require('../lib/stream-modifiers/regex');

  describe('Stream Modifiers - Regular Expression', function() {
    var config, mod, output, perm, temp;
    mod = null;
    config = null;
    output = null;
    temp = null;
    perm = null;
    beforeEach(function() {
      config = {
        regex: '(?<file> .+?\\.(?:txt|html)):(?<row> \\d+)\\s(?<message>.+)',
        defaults: 'type: \'warning\''
      };
      output = {
        absolutePath: jasmine.createSpy('absolutePath').andCallFake(function(r) {
          return r;
        })
      };
      Modifier.activate();
      mod = new Modifier.modifier(config, null, output);
      temp = {};
      return perm = {};
    });
    afterEach(function() {
      return Modifier.deactivate();
    });
    it('creates the regular expression', function() {
      return expect(mod.regex).toBeDefined();
    });
    it('parses the defaults', function() {
      return expect(mod["default"].type).toBe('warning');
    });
    describe('On matching line', function() {
      beforeEach(function() {
        temp.input = 'test.txt:10 Hello';
        return mod.modify({
          temp: temp,
          perm: perm
        });
      });
      it('fills temp and perm with correct values', function() {
        expect(temp.file).toBe('test.txt');
        expect(temp.row).toBe('10');
        expect(temp.message).toBe('Hello');
        expect(perm.file).toBe('test.txt');
        expect(perm.row).toBe('10');
        return expect(perm.message).toBe('Hello');
      });
      return describe('::getFiles', function() {
        var ret;
        ret = null;
        beforeEach(function() {
          return ret = mod.getFiles({
            temp: temp,
            perm: perm
          });
        });
        return it('returns the correct file array', function() {
          return expect(ret).toEqual([
            {
              file: 'test.txt',
              start: 0,
              end: 7,
              row: '10',
              col: void 0
            }
          ]);
        });
      });
    });
    return describe('On other lines', function() {
      beforeEach(function() {
        temp.input = 'Something else';
        return mod.modify({
          temp: temp,
          perm: perm
        });
      });
      it('doesn\'t fill temp and perm with values', function() {
        expect(temp).toEqual({
          input: 'Something else'
        });
        return expect(perm).toEqual({});
      });
      return describe('::getFiles', function() {
        var ret;
        ret = null;
        beforeEach(function() {
          return ret = mod.getFiles({
            temp: temp,
            perm: perm
          });
        });
        return it('returns an empty array', function() {
          return expect(ret.length).toBe(0);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvc3BlYy9zdHJlYW0tbW9kaWZpZXItcmVnZXgtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsUUFBQTs7QUFBQSxFQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsK0JBQVIsQ0FBWCxDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLHVDQUFULEVBQWtELFNBQUEsR0FBQTtBQUNoRCxRQUFBLCtCQUFBO0FBQUEsSUFBQSxHQUFBLEdBQU0sSUFBTixDQUFBO0FBQUEsSUFDQSxNQUFBLEdBQVMsSUFEVCxDQUFBO0FBQUEsSUFFQSxNQUFBLEdBQVMsSUFGVCxDQUFBO0FBQUEsSUFHQSxJQUFBLEdBQU8sSUFIUCxDQUFBO0FBQUEsSUFJQSxJQUFBLEdBQU8sSUFKUCxDQUFBO0FBQUEsSUFNQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxNQUFBLEdBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyw2REFBUDtBQUFBLFFBQ0EsUUFBQSxFQUFVLG1CQURWO09BREYsQ0FBQTtBQUFBLE1BR0EsTUFBQSxHQUNFO0FBQUEsUUFBQSxZQUFBLEVBQWMsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsY0FBbEIsQ0FBaUMsQ0FBQyxXQUFsQyxDQUE4QyxTQUFDLENBQUQsR0FBQTtpQkFBTyxFQUFQO1FBQUEsQ0FBOUMsQ0FBZDtPQUpGLENBQUE7QUFBQSxNQUtBLFFBQVEsQ0FBQyxRQUFULENBQUEsQ0FMQSxDQUFBO0FBQUEsTUFNQSxHQUFBLEdBQVUsSUFBQSxRQUFRLENBQUMsUUFBVCxDQUFrQixNQUFsQixFQUEwQixJQUExQixFQUFnQyxNQUFoQyxDQU5WLENBQUE7QUFBQSxNQU9BLElBQUEsR0FBTyxFQVBQLENBQUE7YUFRQSxJQUFBLEdBQU8sR0FURTtJQUFBLENB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

//# sourceURL=/home/champ/.atom/packages/build-tools/spec/stream-modifier-regex-spec.coffee