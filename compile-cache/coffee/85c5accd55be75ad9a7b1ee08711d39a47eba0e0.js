(function() {
  var Modifiers, Pipeline;

  Pipeline = require('../lib/pipeline/output-pipeline-raw');

  Modifiers = require('../lib/stream-modifiers/modifiers');

  describe('Raw Output Pipeline', function() {
    var dest, disp, mod, pipe;
    pipe = null;
    mod = null;
    disp = null;
    dest = null;
    beforeEach(function() {
      var TestModifier;
      dest = jasmine.createSpy('destroy');
      mod = {
        modifier: TestModifier = (function() {
          function TestModifier(config, settings) {
            this.config = config;
            this.settings = settings;
            this.modify_raw = jasmine.createSpy('modify_raw').andCallFake(function(i) {
              return "" + i + " World!";
            });
            this.destroy = dest;
          }

          TestModifier.prototype.modify_raw = function() {};

          return TestModifier;

        })()
      };
      disp = Modifiers.addModule('test', mod);
      return pipe = new Pipeline({
        b: 1
      }, {
        pipeline: [
          {
            name: 'test',
            config: {
              a: 1
            }
          }
        ]
      });
    });
    afterEach(function() {
      pipe.destroy();
      expect(dest).toHaveBeenCalled();
      return disp.dispose();
    });
    it('creates the pipeline', function() {
      return expect(pipe.pipeline[0].config).toEqual({
        a: 1
      });
    });
    return describe('on input', function() {
      var ret;
      ret = null;
      beforeEach(function() {
        return ret = pipe["in"]('Hello');
      });
      it('calls modify_raw of all modifiers', function() {
        return expect(pipe.pipeline[0].modify_raw).toHaveBeenCalledWith('Hello');
      });
      return it('returns the new value', function() {
        return expect(ret).toBe('Hello World!');
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvc3BlYy9vdXRwdXQtcGlwZWxpbmUtcmF3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxxQ0FBUixDQUFYLENBQUE7O0FBQUEsRUFDQSxTQUFBLEdBQVksT0FBQSxDQUFRLG1DQUFSLENBRFosQ0FBQTs7QUFBQSxFQUdBLFFBQUEsQ0FBUyxxQkFBVCxFQUFnQyxTQUFBLEdBQUE7QUFDOUIsUUFBQSxxQkFBQTtBQUFBLElBQUEsSUFBQSxHQUFPLElBQVAsQ0FBQTtBQUFBLElBQ0EsR0FBQSxHQUFNLElBRE4sQ0FBQTtBQUFBLElBRUEsSUFBQSxHQUFPLElBRlAsQ0FBQTtBQUFBLElBR0EsSUFBQSxHQUFPLElBSFAsQ0FBQTtBQUFBLElBS0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsWUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLE9BQU8sQ0FBQyxTQUFSLENBQWtCLFNBQWxCLENBQVAsQ0FBQTtBQUFBLE1BQ0EsR0FBQSxHQUNFO0FBQUEsUUFBQSxRQUFBLEVBQ1E7QUFFUyxVQUFBLHNCQUFFLE1BQUYsRUFBVyxRQUFYLEdBQUE7QUFDWCxZQURZLElBQUMsQ0FBQSxTQUFBLE1BQ2IsQ0FBQTtBQUFBLFlBRHFCLElBQUMsQ0FBQSxXQUFBLFFBQ3RCLENBQUE7QUFBQSxZQUFBLElBQUMsQ0FBQSxVQUFELEdBQWMsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsWUFBbEIsQ0FBK0IsQ0FBQyxXQUFoQyxDQUE0QyxTQUFDLENBQUQsR0FBQTtxQkFBTyxFQUFBLEdBQUcsQ0FBSCxHQUFLLFVBQVo7WUFBQSxDQUE1QyxDQUFkLENBQUE7QUFBQSxZQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFEWCxDQURXO1VBQUEsQ0FBYjs7QUFBQSxpQ0FJQSxVQUFBLEdBQVksU0FBQSxHQUFBLENBSlosQ0FBQTs7OEJBQUE7O1lBSEo7T0FGRixDQUFBO0FBQUEsTUFXQSxJQUFBLEdBQU8sU0FBUyxDQUFDLFNBQVYsQ0FBb0IsTUFBcEIsRUFBNEIsR0FBNUIsQ0FYUCxDQUFBO2FBWUEsSUFBQSxHQUFXLElBQUEsUUFBQSxDQUFTO0FBQUEsUUFBQyxDQUFBLEVBQUcsQ0FBSjtPQUFULEVBQWlCO0FBQUEsUUFBQSxRQUFBLEVBQVU7VUFBQztBQUFBLFlBQUMsSUFBQSxFQUFNLE1BQVA7QUFBQSxZQUFlLE1BQUEsRUFBUTtBQUFBLGNBQUMsQ0FBQSxFQUFHLENBQUo7YUFBdkI7V0FBRDtTQUFWO09BQWpCLEVBYkY7SUFBQSxDQUFYLENBTEEsQ0FBQTtBQUFBLElBb0JBLFNBQUEsQ0FBVSxTQUFBLEdBQUE7QUFDUixNQUFBLElBQUksQ0FBQyxPQUFMLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxNQUFBLENBQU8sSUFBUCxDQUFZLENBQUMsZ0JBQWIsQ0FBQSxDQURBLENBQUE7YUFFQSxJQUFJLENBQUMsT0FBTCxDQUFBLEVBSFE7SUFBQSxDQUFWLENBcEJBLENBQUE7QUFBQSxJQXlCQSxFQUFBLENBQUcsc0JBQUgsRUFBMkIsU0FBQSxHQUFBO2FBQ3pCLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBUyxDQUFBLENBQUEsQ0FBRSxDQUFDLE1BQXhCLENBQStCLENBQUMsT0FBaEMsQ0FBd0M7QUFBQSxRQUFBLENBQUEsRUFBRyxDQUFIO09BQXhDLEVBRHlCO0lBQUEsQ0FBM0IsQ0F6QkEsQ0FBQTtXQTRCQSxRQUFBLENBQVMsVUFBVCxFQUFxQixTQUFBLEdBQUE7QUFDbkIsVUFBQSxHQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sSUFBTixDQUFBO0FBQUEsTUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO2VBQ1QsR0FBQSxHQUFNLElBQUksQ0FBQyxJQUFELENBQUosQ0FBUSxPQUFSLEVBREc7TUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLE1BS0EsRUFBQSxDQUFHLG1DQUFILEVBQXdDLFNBQUEsR0FBQTtlQUN0QyxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQVMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxVQUF4QixDQUFtQyxDQUFDLG9CQUFwQyxDQUF5RCxPQUF6RCxFQURzQztNQUFBLENBQXhDLENBTEEsQ0FBQTthQVFBLEVBQUEsQ0FBRyx1QkFBSCxFQUE0QixTQUFBLEdBQUE7ZUFDMUIsTUFBQSxDQUFPLEdBQVAsQ0FBVyxDQUFDLElBQVosQ0FBaUIsY0FBakIsRUFEMEI7TUFBQSxDQUE1QixFQVRtQjtJQUFBLENBQXJCLEVBN0I4QjtFQUFBLENBQWhDLENBSEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/champ/.atom/packages/build-tools/spec/output-pipeline-raw-spec.coffee
