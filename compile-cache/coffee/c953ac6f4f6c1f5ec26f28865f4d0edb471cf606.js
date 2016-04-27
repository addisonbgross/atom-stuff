(function() {
  var Modifier;

  Modifier = new (require('../lib/stream-modifiers/all')).modifier;

  describe('Stream Modifier - All', function() {
    return describe('on modify', function() {
      var r, t;
      t = null;
      r = void 0;
      beforeEach(function() {
        t = {
          type: ''
        };
        return r = Modifier.modify({
          temp: t
        });
      });
      it('highlights the entire line', function() {
        return expect(t.type).toBe('warning');
      });
      return it('returns null', function() {
        return expect(r).toBe(null);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvc3BlYy9zdHJlYW0tbW9kaWZpZXItYWxsLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFFBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsR0FBQSxDQUFBLENBQUssT0FBQSxDQUFRLDZCQUFSLENBQUQsQ0FBdUMsQ0FBQyxRQUF2RCxDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLHVCQUFULEVBQWtDLFNBQUEsR0FBQTtXQUNoQyxRQUFBLENBQVMsV0FBVCxFQUFzQixTQUFBLEdBQUE7QUFDcEIsVUFBQSxJQUFBO0FBQUEsTUFBQSxDQUFBLEdBQUksSUFBSixDQUFBO0FBQUEsTUFDQSxDQUFBLEdBQUksTUFESixDQUFBO0FBQUEsTUFHQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsUUFBQSxDQUFBLEdBQUk7QUFBQSxVQUFBLElBQUEsRUFBTSxFQUFOO1NBQUosQ0FBQTtlQUNBLENBQUEsR0FBSSxRQUFRLENBQUMsTUFBVCxDQUFnQjtBQUFBLFVBQUEsSUFBQSxFQUFNLENBQU47U0FBaEIsRUFGSztNQUFBLENBQVgsQ0FIQSxDQUFBO0FBQUEsTUFPQSxFQUFBLENBQUcsNEJBQUgsRUFBaUMsU0FBQSxHQUFBO2VBQy9CLE1BQUEsQ0FBTyxDQUFDLENBQUMsSUFBVCxDQUFjLENBQUMsSUFBZixDQUFvQixTQUFwQixFQUQrQjtNQUFBLENBQWpDLENBUEEsQ0FBQTthQVVBLEVBQUEsQ0FBRyxjQUFILEVBQW1CLFNBQUEsR0FBQTtlQUNqQixNQUFBLENBQU8sQ0FBUCxDQUFTLENBQUMsSUFBVixDQUFlLElBQWYsRUFEaUI7TUFBQSxDQUFuQixFQVhvQjtJQUFBLENBQXRCLEVBRGdDO0VBQUEsQ0FBbEMsQ0FGQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/build-tools/spec/stream-modifier-all-spec.coffee
