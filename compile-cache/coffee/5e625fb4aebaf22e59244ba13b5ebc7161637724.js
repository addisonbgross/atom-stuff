(function() {
  var Modifiers, Queue;

  Queue = require('../lib/pipeline/queue');

  Modifiers = require('../lib/modifier/modifier');

  describe('Queue', function() {
    var command, modifier, queue;
    queue = null;
    command = null;
    modifier = null;
    beforeEach(function() {
      var out;
      command = {
        project: '/home/fabian/.atom/packages/build-tools/spec/fixtures',
        name: 'Test',
        command: 'echo Hello World',
        wd: '.',
        env: {},
        modifier: {
          test: {
            t: 1
          }
        },
        stdout: {
          highlighting: 'nh'
        },
        stderr: {
          highlighting: 'nh'
        },
        output: {
          console: {
            close_success: false
          }
        },
        version: 1
      };
      out = {
        "in": function(queue) {
          queue.queue[0].t = queue.queue[0].modifier.test.t;
        }
      };
      modifier = Modifiers.addModule('test', out);
      return queue = new Queue(command);
    });
    afterEach(function() {
      return modifier.dispose();
    });
    return describe('On ::run', function() {
      var p, w;
      p = null;
      w = null;
      beforeEach(function() {
        p = queue.run();
        p.then(function(worker) {
          return w = worker;
        });
        return waitsForPromise(function() {
          return p;
        });
      });
      return it('returns a valid QueueWorker', function() {
        expect(w.queue.queue.length).toBe(1);
        expect(w.queue.queue[0].name).toBe('Test');
        return expect(w.queue.queue[0].t).toBe(1);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvc3BlYy9xdWV1ZS1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnQkFBQTs7QUFBQSxFQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsdUJBQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSwwQkFBUixDQURaLENBQUE7O0FBQUEsRUFHQSxRQUFBLENBQVMsT0FBVCxFQUFrQixTQUFBLEdBQUE7QUFDaEIsUUFBQSx3QkFBQTtBQUFBLElBQUEsS0FBQSxHQUFRLElBQVIsQ0FBQTtBQUFBLElBQ0EsT0FBQSxHQUFVLElBRFYsQ0FBQTtBQUFBLElBRUEsUUFBQSxHQUFXLElBRlgsQ0FBQTtBQUFBLElBSUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsR0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVO0FBQUEsUUFDUixPQUFBLEVBQVMsdURBREQ7QUFBQSxRQUVSLElBQUEsRUFBTSxNQUZFO0FBQUEsUUFHUixPQUFBLEVBQVMsa0JBSEQ7QUFBQSxRQUlSLEVBQUEsRUFBSSxHQUpJO0FBQUEsUUFLUixHQUFBLEVBQUssRUFMRztBQUFBLFFBTVIsUUFBQSxFQUNFO0FBQUEsVUFBQSxJQUFBLEVBQU07QUFBQSxZQUNKLENBQUEsRUFBRyxDQURDO1dBQU47U0FQTTtBQUFBLFFBVVIsTUFBQSxFQUNFO0FBQUEsVUFBQSxZQUFBLEVBQWMsSUFBZDtTQVhNO0FBQUEsUUFZUixNQUFBLEVBQ0U7QUFBQSxVQUFBLFlBQUEsRUFBYyxJQUFkO1NBYk07QUFBQSxRQWNSLE1BQUEsRUFDRTtBQUFBLFVBQUEsT0FBQSxFQUNFO0FBQUEsWUFBQSxhQUFBLEVBQWUsS0FBZjtXQURGO1NBZk07QUFBQSxRQWlCUixPQUFBLEVBQVMsQ0FqQkQ7T0FBVixDQUFBO0FBQUEsTUFtQkEsR0FBQSxHQUFNO0FBQUEsUUFDSixJQUFBLEVBQUksU0FBQyxLQUFELEdBQUE7QUFDRixVQUFBLEtBQUssQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsQ0FBZixHQUFtQixLQUFLLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBaEQsQ0FERTtRQUFBLENBREE7T0FuQk4sQ0FBQTtBQUFBLE1Bd0JBLFFBQUEsR0FBVyxTQUFTLENBQUMsU0FBVixDQUFvQixNQUFwQixFQUE0QixHQUE1QixDQXhCWCxDQUFBO2FBeUJBLEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBTSxPQUFOLEVBMUJIO0lBQUEsQ0FBWCxDQUpBLENBQUE7QUFBQSxJQWdDQSxTQUFBLENBQVUsU0FBQSxHQUFBO2FBQ1IsUUFBUSxDQUFDLE9BQVQsQ0FBQSxFQURRO0lBQUEsQ0FBVixDQWhDQSxDQUFBO1dBbUNBLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUEsR0FBQTtBQUNuQixVQUFBLElBQUE7QUFBQSxNQUFBLENBQUEsR0FBSSxJQUFKLENBQUE7QUFBQSxNQUNBLENBQUEsR0FBSSxJQURKLENBQUE7QUFBQSxNQUdBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxRQUFBLENBQUEsR0FBSSxLQUFLLENBQUMsR0FBTixDQUFBLENBQUosQ0FBQTtBQUFBLFFBQ0EsQ0FBQyxDQUFDLElBQUYsQ0FBTyxTQUFDLE1BQUQsR0FBQTtpQkFBWSxDQUFBLEdBQUksT0FBaEI7UUFBQSxDQUFQLENBREEsQ0FBQTtlQUVBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUFHLEVBQUg7UUFBQSxDQUFoQixFQUhTO01BQUEsQ0FBWCxDQUhBLENBQUE7YUFRQSxFQUFBLENBQUcsNkJBQUgsRUFBa0MsU0FBQSxHQUFBO0FBQ2hDLFFBQUEsTUFBQSxDQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQXJCLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsQ0FBbEMsQ0FBQSxDQUFBO0FBQUEsUUFDQSxNQUFBLENBQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBeEIsQ0FBNkIsQ0FBQyxJQUE5QixDQUFtQyxNQUFuQyxDQURBLENBQUE7ZUFFQSxNQUFBLENBQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsQ0FBeEIsQ0FBMEIsQ0FBQyxJQUEzQixDQUFnQyxDQUFoQyxFQUhnQztNQUFBLENBQWxDLEVBVG1CO0lBQUEsQ0FBckIsRUFwQ2dCO0VBQUEsQ0FBbEIsQ0FIQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/home/champ/.atom/packages/build-tools/spec/queue-spec.coffee