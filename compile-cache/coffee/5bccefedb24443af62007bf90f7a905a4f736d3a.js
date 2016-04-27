(function() {
  var Modifier;

  Modifier = require('../lib/stream-modifiers/remansi');

  describe('Stream Modifier - Remove ANSI', function() {
    var mod, ret;
    mod = null;
    ret = null;
    beforeEach(function() {
      return mod = new Modifier.modifier;
    });
    describe('On single line with escape code at the beginning and end', function() {
      beforeEach(function() {
        return ret = mod.modify_raw('\x1b[32mHello \x1b[35;41mbeautiful\x1b[33m world!\x1b[0m');
      });
      return it('returns the new line', function() {
        return expect(ret).toBe('Hello beautiful world!');
      });
    });
    describe('On multi line', function() {
      beforeEach(function() {
        return ret = mod.modify_raw('\x1b[32mHello\x1b[41m');
      });
      it('returns the new line', function() {
        return expect(ret).toBe('Hello');
      });
      return describe('On second line', function() {
        beforeEach(function() {
          return ret = mod.modify_raw('World\x1b[');
        });
        it('returns the new line', function() {
          return expect(ret).toBe('World');
        });
        return describe('On third line', function() {
          beforeEach(function() {
            return ret = mod.modify_raw('01;33m!\x1b[0m');
          });
          return it('returns the new line', function() {
            return expect(ret).toBe('!');
          });
        });
      });
    });
    return describe('On multi line with unsupported code', function() {
      beforeEach(function() {
        return ret = mod.modify_raw('\x1b[32mHello\x1b[24m\x1b[0K');
      });
      it('returns the new line', function() {
        return expect(ret).toBe('Hello');
      });
      return describe('On second line', function() {
        beforeEach(function() {
          return ret = mod.modify_raw('World\x1b[');
        });
        return it('returns the new line', function() {
          return expect(ret).toBe('World');
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvc3BlYy9zdHJlYW0tbW9kaWZpZXItcmVtYW5zaS1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxRQUFBOztBQUFBLEVBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxpQ0FBUixDQUFYLENBQUE7O0FBQUEsRUFFQSxRQUFBLENBQVMsK0JBQVQsRUFBMEMsU0FBQSxHQUFBO0FBQ3hDLFFBQUEsUUFBQTtBQUFBLElBQUEsR0FBQSxHQUFNLElBQU4sQ0FBQTtBQUFBLElBQ0EsR0FBQSxHQUFNLElBRE4sQ0FBQTtBQUFBLElBR0EsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUNULEdBQUEsR0FBTSxHQUFBLENBQUEsUUFBWSxDQUFDLFNBRFY7SUFBQSxDQUFYLENBSEEsQ0FBQTtBQUFBLElBTUEsUUFBQSxDQUFTLDBEQUFULEVBQXFFLFNBQUEsR0FBQTtBQUVuRSxNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7ZUFDVCxHQUFBLEdBQU0sR0FBRyxDQUFDLFVBQUosQ0FBZSwwREFBZixFQURHO01BQUEsQ0FBWCxDQUFBLENBQUE7YUFHQSxFQUFBLENBQUcsc0JBQUgsRUFBMkIsU0FBQSxHQUFBO2VBQ3pCLE1BQUEsQ0FBTyxHQUFQLENBQVcsQ0FBQyxJQUFaLENBQWlCLHdCQUFqQixFQUR5QjtNQUFBLENBQTNCLEVBTG1FO0lBQUEsQ0FBckUsQ0FOQSxDQUFBO0FBQUEsSUFjQSxRQUFBLENBQVMsZUFBVCxFQUEwQixTQUFBLEdBQUE7QUFFeEIsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2VBQ1QsR0FBQSxHQUFNLEdBQUcsQ0FBQyxVQUFKLENBQWUsdUJBQWYsRUFERztNQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsTUFHQSxFQUFBLENBQUcsc0JBQUgsRUFBMkIsU0FBQSxHQUFBO2VBQ3pCLE1BQUEsQ0FBTyxHQUFQLENBQVcsQ0FBQyxJQUFaLENBQWlCLE9BQWpCLEVBRHlCO01BQUEsQ0FBM0IsQ0FIQSxDQUFBO2FBTUEsUUFBQSxDQUFTLGdCQUFULEVBQTJCLFNBQUEsR0FBQTtBQUV6QixRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsR0FBQSxHQUFNLEdBQUcsQ0FBQyxVQUFKLENBQWUsWUFBZixFQURHO1FBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxRQUdBLEVBQUEsQ0FBRyxzQkFBSCxFQUEyQixTQUFBLEdBQUE7aUJBQ3pCLE1BQUEsQ0FBTyxHQUFQLENBQVcsQ0FBQyxJQUFaLENBQWlCLE9BQWpCLEVBRHlCO1FBQUEsQ0FBM0IsQ0FIQSxDQUFBO2VBTUEsUUFBQSxDQUFTLGVBQVQsRUFBMEIsU0FBQSxHQUFBO0FBRXhCLFVBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTttQkFDVCxHQUFBLEdBQU0sR0FBRyxDQUFDLFVBQUosQ0FBZSxnQkFBZixFQURHO1VBQUEsQ0FBWCxDQUFBLENBQUE7aUJBR0EsRUFBQSxDQUFHLHNCQUFILEVBQTJCLFNBQUEsR0FBQTttQkFDekIsTUFBQSxDQUFPLEdBQVAsQ0FBVyxDQUFDLElBQVosQ0FBaUIsR0FBakIsRUFEeUI7VUFBQSxDQUEzQixFQUx3QjtRQUFBLENBQTFCLEVBUnlCO01BQUEsQ0FBM0IsRUFSd0I7SUFBQSxDQUExQixDQWRBLENBQUE7V0FzQ0EsUUFBQSxDQUFTLHFDQUFULEVBQWdELFNBQUEsR0FBQTtBQUU5QyxNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7ZUFDVCxHQUFBLEdBQU0sR0FBRyxDQUFDLFVBQUosQ0FBZSw4QkFBZixFQURHO01BQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxNQUdBLEVBQUEsQ0FBRyxzQkFBSCxFQUEyQixTQUFBLEdBQUE7ZUFDekIsTUFBQSxDQUFPLEdBQVAsQ0FBVyxDQUFDLElBQVosQ0FBaUIsT0FBakIsRUFEeUI7TUFBQSxDQUEzQixDQUhBLENBQUE7YUFNQSxRQUFBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQSxHQUFBO0FBRXpCLFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtpQkFDVCxHQUFBLEdBQU0sR0FBRyxDQUFDLFVBQUosQ0FBZSxZQUFmLEVBREc7UUFBQSxDQUFYLENBQUEsQ0FBQTtlQUdBLEVBQUEsQ0FBRyxzQkFBSCxFQUEyQixTQUFBLEdBQUE7aUJBQ3pCLE1BQUEsQ0FBTyxHQUFQLENBQVcsQ0FBQyxJQUFaLENBQWlCLE9BQWpCLEVBRHlCO1FBQUEsQ0FBM0IsRUFMeUI7TUFBQSxDQUEzQixFQVI4QztJQUFBLENBQWhELEVBdkN3QztFQUFBLENBQTFDLENBRkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/build-tools/spec/stream-modifier-remansi-spec.coffee
