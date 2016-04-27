(function() {
  var InputOutputManager, command, path;

  InputOutputManager = require('../lib/pipeline/io-manager');

  path = require('path');

  command = {
    name: '',
    command: '',
    wd: '.',
    stdout: {
      highlighting: 'ha'
    },
    stderr: {
      highlighting: 'hc',
      profile: 'modelsim'
    },
    version: 1
  };

  describe('Output Manager', function() {
    var input, input_cb, manager, output, write_cb;
    manager = null;
    output = null;
    write_cb = null;
    input = null;
    input_cb = null;
    beforeEach(function() {
      output = {
        newCommand: jasmine.createSpy('newCommand'),
        exitCommand: jasmine.createSpy('exitCommand'),
        setInput: jasmine.createSpy('input').andCallFake(function(_input) {
          return input_cb = _input.write;
        }),
        onInput: jasmine.createSpy('oninput'),
        stdout_in: jasmine.createSpy('stdout_in'),
        stdout_setType: jasmine.createSpy('stdout_setType'),
        stderr_in: jasmine.createSpy('stderr_in'),
        stderr_setType: jasmine.createSpy('stderr_setType'),
        stderr_print: jasmine.createSpy('stderr_setType'),
        stderr_linter: jasmine.createSpy('stderr_linter')
      };
      input = {
        write: jasmine.createSpy('write').andCallFake(write_cb = (function(a, b, cb) {
          return cb();
        })),
        end: jasmine.createSpy('end')
      };
      command.project = atom.project.getPaths()[0];
      manager = new InputOutputManager(command, [output]);
      return manager.setInput(input);
    });
    afterEach(function() {
      return manager.destroy();
    });
    it('initalizes the output module', function() {
      return expect(output.newCommand).toHaveBeenCalledWith(command);
    });
    it('initalizes the input callbacks', function() {
      return expect(output.setInput).toHaveBeenCalled();
    });
    describe('On stdin output', function() {
      beforeEach(function() {
        return input_cb('Test');
      });
      it('calls the input stream\'s write function', function() {
        expect(input.write).toHaveBeenCalled();
        return expect(input.write.mostRecentCall.args[0]).toBe('Test');
      });
      return it('calls the input callback', function() {
        return expect(output.onInput).toHaveBeenCalledWith('Test');
      });
    });
    describe('On stdout input', function() {
      var end_line, mid_line, new_line;
      new_line = null;
      mid_line = null;
      end_line = null;
      beforeEach(function() {
        new_line = jasmine.createSpy('new_line');
        mid_line = jasmine.createSpy('mid_line');
        end_line = jasmine.createSpy('end_line');
        manager.stdout.subscribers.on('new', new_line);
        manager.stdout.subscribers.on('raw', mid_line);
        return manager.stdout.subscribers.on('input', end_line);
      });
      describe('On single line', function() {
        beforeEach(function() {
          return manager.stdout["in"]('This is a single line\n');
        });
        it('calls "new"', function() {
          return expect(new_line.callCount).toBe(1);
        });
        it('calls "raw"', function() {
          return expect(mid_line).toHaveBeenCalledWith('This is a single line');
        });
        return it('calls "input"', function() {
          expect(end_line).toHaveBeenCalled();
          return expect(end_line.mostRecentCall.args[0].input).toBe('This is a single line');
        });
      });
      describe('On multiple lines (2 full, last broken)', function() {
        beforeEach(function() {
          return manager.stdout["in"]('First line\nSecond line\nThird');
        });
        it('calls "new" 3 times', function() {
          return expect(new_line.callCount).toBe(3);
        });
        it('calls "raw" 3 times', function() {
          expect(mid_line.callCount).toBe(3);
          return expect(mid_line.argsForCall).toEqual([['First line'], ['Second line'], ['Third']]);
        });
        it('calls "input" 2 times', function() {
          expect(end_line.callCount).toBe(2);
          expect(end_line.argsForCall[0][0].input).toBe('First line');
          return expect(end_line.argsForCall[1][0].input).toBe('Second line');
        });
        it('resets buffer', function() {
          return expect(manager.stdout.buffer).toBe('Third');
        });
        return describe('On adding to the third line', function() {
          beforeEach(function() {
            return manager.stdout["in"](' line');
          });
          it('does not call "new"', function() {
            return expect(new_line.callCount).toBe(3);
          });
          it('calls "raw"', function() {
            return expect(mid_line.mostRecentCall.args[0]).toBe(' line');
          });
          it('updates buffer', function() {
            return expect(manager.stdout.buffer).toBe('Third line');
          });
          return describe('On finishing the third line', function() {
            beforeEach(function() {
              return manager.stdout["in"]('\n');
            });
            it('calls "new"', function() {
              return expect(new_line.callCount).toBe(3);
            });
            return it('calls "input"', function() {
              expect(end_line.callCount).toBe(3);
              return expect(end_line.mostRecentCall.args[0].input).toBe('Third line');
            });
          });
        });
      });
      return describe('When encountering ANSI-Sequences', function() {
        describe('in one input string', function() {
          beforeEach(function() {
            return manager.stdout["in"]('Hello\x1b[36mWorld\n');
          });
          it('calls "new"', function() {
            return expect(new_line.callCount).toBe(1);
          });
          it('calls "raw" without the escape sequence', function() {
            return expect(mid_line.mostRecentCall.args[0]).toBe('HelloWorld');
          });
          return it('calls "input"', function() {
            return expect(end_line.mostRecentCall.args[0].input).toBe('HelloWorld');
          });
        });
        return describe('in split input', function() {
          beforeEach(function() {
            return manager.stdout["in"]('Hello\x1b[');
          });
          it('calls "new"', function() {
            return expect(new_line).toHaveBeenCalled();
          });
          it('calls "raw"', function() {
            return expect(mid_line.mostRecentCall.args[0]).toBe('Hello');
          });
          return describe('second part', function() {
            beforeEach(function() {
              return manager.stdout["in"]('36');
            });
            it('does not call "new"', function() {
              return expect(new_line.callCount).toBe(1);
            });
            it('does not call "raw"', function() {
              return expect(mid_line.callCount).toBe(1);
            });
            return describe('third part', function() {
              beforeEach(function() {
                return manager.stdout["in"]('mWorld\n');
              });
              it('does not call "new"', function() {
                return expect(new_line.callCount).toBe(1);
              });
              it('calls "raw"', function() {
                return expect(mid_line.mostRecentCall.args[0]).toBe('World');
              });
              return it('calls "input"', function() {
                return expect(end_line.mostRecentCall.args[0].input).toBe('HelloWorld');
              });
            });
          });
        });
      });
    });
    describe('On stderr input', function() {
      var end_line, mid_line, new_line;
      new_line = null;
      mid_line = null;
      end_line = null;
      beforeEach(function() {
        new_line = jasmine.createSpy('new_line');
        mid_line = jasmine.createSpy('mid_line');
        end_line = jasmine.createSpy('end_line');
        manager.stderr.subscribers.on('new', new_line);
        manager.stderr.subscribers.on('raw', mid_line);
        return manager.stderr.subscribers.on('input', end_line);
      });
      describe('On single line', function() {
        beforeEach(function() {
          return manager.stderr["in"]('This is a single line\n');
        });
        it('calls "new"', function() {
          return expect(new_line).toHaveBeenCalled();
        });
        it('calls "raw"', function() {
          return expect(mid_line).toHaveBeenCalledWith('This is a single line');
        });
        return it('calls "input"', function() {
          expect(end_line).toHaveBeenCalled();
          return expect(end_line.mostRecentCall.args[0].input).toBe('This is a single line');
        });
      });
      return describe('On multiple lines (2 full, last broken)', function() {
        beforeEach(function() {
          return manager.stderr["in"]('First line\nSecond line\nThird');
        });
        it('calls "new" 3 times', function() {
          return expect(new_line.callCount).toBe(3);
        });
        it('calls "raw" 3 times', function() {
          expect(mid_line.callCount).toBe(3);
          return expect(mid_line.argsForCall).toEqual([['First line'], ['Second line'], ['Third']]);
        });
        it('calls "input" 2 times', function() {
          expect(end_line.callCount).toBe(2);
          expect(end_line.argsForCall[0][0].input).toBe('First line');
          return expect(end_line.argsForCall[1][0].input).toBe('Second line');
        });
        it('resets buffer', function() {
          return expect(manager.stderr.buffer).toBe('Third');
        });
        return describe('On adding to the third line', function() {
          beforeEach(function() {
            return manager.stderr["in"](' line');
          });
          it('calls "raw"', function() {
            return expect(mid_line.mostRecentCall.args[0]).toBe(' line');
          });
          it('updates buffer', function() {
            return expect(manager.stderr.buffer).toBe('Third line');
          });
          return describe('On finishing the third line', function() {
            beforeEach(function() {
              return manager.stderr["in"]('\n');
            });
            it('calls "new"', function() {
              return expect(new_line.callCount).toBe(3);
            });
            return it('calls "input"', function() {
              expect(end_line.callCount).toBe(3);
              return expect(end_line.mostRecentCall.args[0].input).toBe('Third line');
            });
          });
        });
      });
    });
    describe('On stdout input', function() {
      return it('calls the correct functions', function() {
        manager.stdout["in"]('Hello World\n');
        expect(output.stdout_in).toHaveBeenCalledWith({
          input: 'Hello World',
          files: []
        });
        return expect(output.stdout_setType).toHaveBeenCalledWith('warning');
      });
    });
    describe('On stderr input', function() {
      return it('calls the correct functions', function() {
        var match, test;
        input = '** Error: test.vhd(278): VHDL Compiler exiting';
        manager.stderr["in"]("" + input + "\n");
        expect(output.stderr_in.mostRecentCall.args[0].input).toBe(input);
        match = {
          type: 'error',
          message: 'VHDL Compiler exiting',
          file: path.join(atom.project.getPaths()[0], 'test.vhd'),
          row: '278',
          input: input
        };
        test = output.stderr_print.mostRecentCall.args[0].input;
        expect(test.input).toBe(match.input);
        expect(test.type).toBe(match.type);
        test = output.stderr_linter.mostRecentCall.args[0];
        expect(test.text).toBe(match.message);
        expect(test.type).toBe(match.type);
        expect(test.filePath).toBe(match.file);
        return expect(test.range).toEqual([[277, 0], [277, 9999]]);
      });
    });
    return describe('When command has finished', function() {
      beforeEach(function() {
        return manager.finish(0);
      });
      return it('sends the exit code to the module', function() {
        return expect(output.exitCommand).toHaveBeenCalledWith(0);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvc3BlYy9pby1tYW5hZ2VyLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlDQUFBOztBQUFBLEVBQUEsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLDRCQUFSLENBQXJCLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBSUEsT0FBQSxHQUNJO0FBQUEsSUFBQSxJQUFBLEVBQU0sRUFBTjtBQUFBLElBQ0EsT0FBQSxFQUFTLEVBRFQ7QUFBQSxJQUVBLEVBQUEsRUFBSSxHQUZKO0FBQUEsSUFHQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLFlBQUEsRUFBYyxJQUFkO0tBSkY7QUFBQSxJQUtBLE1BQUEsRUFDRTtBQUFBLE1BQUEsWUFBQSxFQUFjLElBQWQ7QUFBQSxNQUNBLE9BQUEsRUFBUyxVQURUO0tBTkY7QUFBQSxJQVFBLE9BQUEsRUFBUyxDQVJUO0dBTEosQ0FBQTs7QUFBQSxFQWVBLFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBLEdBQUE7QUFDekIsUUFBQSwwQ0FBQTtBQUFBLElBQUEsT0FBQSxHQUFVLElBQVYsQ0FBQTtBQUFBLElBQ0EsTUFBQSxHQUFTLElBRFQsQ0FBQTtBQUFBLElBRUEsUUFBQSxHQUFXLElBRlgsQ0FBQTtBQUFBLElBR0EsS0FBQSxHQUFRLElBSFIsQ0FBQTtBQUFBLElBSUEsUUFBQSxHQUFXLElBSlgsQ0FBQTtBQUFBLElBTUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsTUFBQSxHQUNFO0FBQUEsUUFBQSxVQUFBLEVBQVksT0FBTyxDQUFDLFNBQVIsQ0FBa0IsWUFBbEIsQ0FBWjtBQUFBLFFBQ0EsV0FBQSxFQUFhLE9BQU8sQ0FBQyxTQUFSLENBQWtC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

//# sourceURL=/home/champ/.atom/packages/build-tools/spec/io-manager-spec.coffee