(function() {
  var Module;

  Module = require('../lib/output/buffer');

  describe('Output Module - Buffer', function() {
    var module;
    module = null;
    beforeEach(function() {
      jasmine.attachToDOM(atom.views.getView(atom.workspace));
      Module.activate();
      return module = new Module.output;
    });
    afterEach(function() {
      module = null;
      return Module.deactivate();
    });
    describe('On false/false // false', function() {
      var buffer0, buffer1;
      buffer0 = null;
      buffer1 = null;
      beforeEach(function() {
        module.newQueue({
          queue: [
            {
              project: 'a',
              name: 'a',
              output: {
                buffer: {
                  recycle_buffer: false
                }
              }
            }, {
              project: 'b',
              name: 'a',
              output: {
                buffer: {
                  recycle_buffer: false,
                  queue_in_buffer: false
                }
              }
            }
          ]
        });
        module.newCommand({
          project: 'a',
          name: 'a',
          output: {
            buffer: {
              recycle_buffer: false
            }
          }
        });
        module.stdout_in({
          input: 'Hello World from a'
        });
        waitsFor(function() {
          return module.buffer !== null;
        });
        return runs(function() {
          buffer0 = module.buffer.getText();
          module.newCommand({
            project: 'b',
            name: 'a',
            output: {
              buffer: {
                recycle_buffer: false,
                queue_in_buffer: false
              }
            }
          });
          module.stdout_in({
            input: 'Hello World from b'
          });
          waitsFor(function() {
            return module.buffer !== null;
          });
          return runs(function() {
            return buffer1 = module.buffer.getText();
          });
        });
      });
      it('writes the first command to the first buffer', function() {
        return expect(buffer0).toBe('Hello World from a\n');
      });
      it('writes the second command to the second buffer', function() {
        return expect(buffer1).toBe('Hello World from b\n');
      });
      return describe('On rerun', function() {
        buffer0 = null;
        buffer1 = null;
        beforeEach(function() {
          module.newQueue({
            queue: [
              {
                project: 'a',
                name: 'a',
                output: {
                  buffer: {
                    recycle_buffer: false
                  }
                }
              }, {
                project: 'b',
                name: 'a',
                output: {
                  buffer: {
                    recycle_buffer: false,
                    queue_in_buffer: false
                  }
                }
              }
            ]
          });
          module.newCommand({
            project: 'a',
            name: 'a',
            output: {
              buffer: {
                recycle_buffer: false
              }
            }
          });
          module.stdout_in({
            input: 'Hello World from a'
          });
          waitsFor(function() {
            return module.buffer !== null;
          });
          return runs(function() {
            buffer0 = module.buffer.getText();
            module.newCommand({
              project: 'b',
              name: 'a',
              output: {
                buffer: {
                  recycle_buffer: false,
                  queue_in_buffer: false
                }
              }
            });
            module.stdout_in({
              input: 'Hello World from b'
            });
            waitsFor(function() {
              return module.buffer !== null;
            });
            return runs(function() {
              return buffer1 = module.buffer.getText();
            });
          });
        });
        it('writes the first command to the first buffer', function() {
          return expect(buffer0).toBe('Hello World from a\n');
        });
        return it('writes the second command to the second buffer', function() {
          return expect(buffer1).toBe('Hello World from b\n');
        });
      });
    });
    describe('On false/false // true', function() {
      var buffer0, buffer1;
      buffer0 = null;
      buffer1 = null;
      beforeEach(function() {
        module.newQueue({
          queue: [
            {
              project: 'a',
              name: 'a',
              output: {
                buffer: {
                  recycle_buffer: true
                }
              }
            }, {
              project: 'b',
              name: 'a',
              output: {
                buffer: {
                  recycle_buffer: false,
                  queue_in_buffer: false
                }
              }
            }
          ]
        });
        module.newCommand({
          project: 'a',
          name: 'a',
          output: {
            buffer: {
              recycle_buffer: true
            }
          }
        });
        module.stdout_in({
          input: 'Hello World from a'
        });
        waitsFor(function() {
          return module.buffer != null;
        });
        return runs(function() {
          buffer0 = module.buffer.getText();
          module.newCommand({
            project: 'b',
            name: 'a',
            output: {
              buffer: {
                recycle_buffer: false,
                queue_in_buffer: false
              }
            }
          });
          module.stdout_in({
            input: 'Hello World from b'
          });
          waitsFor(function() {
            return module.buffer != null;
          });
          return runs(function() {
            return buffer1 = module.buffer.getText();
          });
        });
      });
      it('writes the first command to the first buffer', function() {
        return expect(buffer0).toBe('Hello World from a\n');
      });
      it('writes the second command to the second buffer', function() {
        return expect(buffer1).toBe('Hello World from b\n');
      });
      it('saves one buffer for re-cycling', function() {
        expect(Module.getBuffers()['a']['a'].getText()).toBe('Hello World from a\n');
        return expect(Module.getBuffers()['b']).toBeUndefined();
      });
      return describe('On rerun', function() {
        buffer0 = null;
        buffer1 = null;
        beforeEach(function() {
          module.newQueue({
            queue: [
              {
                project: 'a',
                name: 'a',
                output: {
                  buffer: {
                    recycle_buffer: true
                  }
                }
              }, {
                project: 'b',
                name: 'a',
                output: {
                  buffer: {
                    recycle_buffer: false,
                    queue_in_buffer: false
                  }
                }
              }
            ]
          });
          module.newCommand({
            project: 'a',
            name: 'a',
            output: {
              buffer: {
                recycle_buffer: true
              }
            }
          });
          module.stdout_in({
            input: 'Hello World from a'
          });
          waitsFor(function() {
            return module.buffer != null;
          });
          return runs(function() {
            buffer0 = module.buffer;
            module.newCommand({
              project: 'b',
              name: 'a',
              output: {
                buffer: {
                  recycle_buffer: false,
                  queue_in_buffer: false
                }
              }
            });
            module.stdout_in({
              input: 'Hello World from b'
            });
            waitsFor(function() {
              return module.buffer != null;
            });
            return runs(function() {
              return buffer1 = module.buffer;
            });
          });
        });
        it('writes the first command to the first buffer', function() {
          return expect(buffer0.getText()).toBe('Hello World from a\n');
        });
        it('writes the second command to the second buffer', function() {
          return expect(buffer1.getText()).toBe('Hello World from b\n');
        });
        return it('uses the recycled buffer', function() {
          expect(Module.getBuffers()['a']['a'].getText()).toBe('Hello World from a\n');
          expect(Module.getBuffers()['b']).toBeUndefined();
          return expect(Module.getBuffers()['a']['a']).toBe(buffer0);
        });
      });
    });
    return describe('On true/true // true', function() {
      var buffer0, buffer1;
      buffer0 = null;
      buffer1 = null;
      beforeEach(function() {
        module.newQueue({
          queue: [
            {
              project: 'a',
              name: 'a',
              output: {
                buffer: {
                  recycle_buffer: true
                }
              }
            }, {
              project: 'b',
              name: 'a',
              output: {
                buffer: {
                  recycle_buffer: true,
                  queue_in_buffer: true
                }
              }
            }
          ]
        });
        module.newCommand({
          project: 'a',
          name: 'a',
          output: {
            buffer: {
              recycle_buffer: true
            }
          }
        });
        module.stdout_in({
          input: 'Hello World from a'
        });
        waitsFor(function() {
          return module.buffer != null;
        });
        return runs(function() {
          buffer0 = module.buffer;
          module.newCommand({
            project: 'b',
            name: 'a',
            output: {
              buffer: {
                recycle_buffer: true,
                queue_in_buffer: true
              }
            }
          });
          module.stdout_in({
            input: 'Hello World from b'
          });
          waitsFor(function() {
            return module.buffer != null;
          });
          return runs(function() {
            return buffer1 = module.buffer;
          });
        });
      });
      it('writes the first command to the first buffer', function() {
        return expect(buffer0.getText()).toBe('Hello World from a\nHello World from b\n');
      });
      it('writes the second command to the first buffer', function() {
        return expect(buffer1.getText()).toBe('Hello World from a\nHello World from b\n');
      });
      it('saves one buffer for re-cycling', function() {
        expect(Module.getBuffers()['b']['a'].getText()).toBe('Hello World from a\nHello World from b\n');
        expect(Module.getBuffers()['a']).toBeUndefined();
        return expect(buffer0).toBe(buffer1);
      });
      return describe('On rerun', function() {
        buffer0 = null;
        buffer1 = null;
        beforeEach(function() {
          module.newQueue({
            queue: [
              {
                project: 'a',
                name: 'a',
                output: {
                  buffer: {
                    recycle_buffer: true
                  }
                }
              }, {
                project: 'b',
                name: 'a',
                output: {
                  buffer: {
                    recycle_buffer: true,
                    queue_in_buffer: true
                  }
                }
              }
            ]
          });
          module.newCommand({
            project: 'a',
            name: 'a',
            output: {
              buffer: {
                recycle_buffer: true
              }
            }
          });
          module.stdout_in({
            input: 'Hello World from a'
          });
          waitsFor(function() {
            return module.buffer != null;
          });
          return runs(function() {
            buffer0 = module.buffer;
            module.newCommand({
              project: 'b',
              name: 'a',
              output: {
                buffer: {
                  recycle_buffer: true,
                  queue_in_buffer: true
                }
              }
            });
            module.stdout_in({
              input: 'Hello World from b'
            });
            waitsFor(function() {
              return module.buffer != null;
            });
            return runs(function() {
              return buffer1 = module.buffer;
            });
          });
        });
        it('writes the first command to the first buffer', function() {
          return expect(buffer0.getText()).toBe('Hello World from a\nHello World from b\n');
        });
        it('writes the second command to the first buffer', function() {
          return expect(buffer1.getText()).toBe('Hello World from a\nHello World from b\n');
        });
        return it('uses the shared buffer', function() {
          expect(Module.getBuffers()['b']['a'].getText()).toBe('Hello World from a\nHello World from b\n');
          expect(Module.getBuffers()['a']).toBeUndefined();
          expect(Module.getBuffers()['b']['a']).toBe(buffer0);
          return expect(buffer0).toBe(buffer1);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvc3BlYy9vdXRwdXQtYnVmZmVyLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLE1BQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLHNCQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyx3QkFBVCxFQUFtQyxTQUFBLEdBQUE7QUFDakMsUUFBQSxNQUFBO0FBQUEsSUFBQSxNQUFBLEdBQVMsSUFBVCxDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxPQUFPLENBQUMsV0FBUixDQUFvQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQXBCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsTUFBTSxDQUFDLFFBQVAsQ0FBQSxDQURBLENBQUE7YUFFQSxNQUFBLEdBQVMsR0FBQSxDQUFBLE1BQVUsQ0FBQyxPQUhYO0lBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxJQU9BLFNBQUEsQ0FBVSxTQUFBLEdBQUE7QUFDUixNQUFBLE1BQUEsR0FBUyxJQUFULENBQUE7YUFDQSxNQUFNLENBQUMsVUFBUCxDQUFBLEVBRlE7SUFBQSxDQUFWLENBUEEsQ0FBQTtBQUFBLElBV0EsUUFBQSxDQUFTLHlCQUFULEVBQW9DLFNBQUEsR0FBQTtBQUNsQyxVQUFBLGdCQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsSUFBVixDQUFBO0FBQUEsTUFDQSxPQUFBLEdBQVUsSUFEVixDQUFBO0FBQUEsTUFHQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsUUFBQSxNQUFNLENBQUMsUUFBUCxDQUFnQjtBQUFBLFVBQUEsS0FBQSxFQUFPO1lBQ3JCO0FBQUEsY0FBQyxPQUFBLEVBQVMsR0FBVjtB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

//# sourceURL=/home/champ/.atom/packages/build-tools/spec/output-buffer-spec.coffee
