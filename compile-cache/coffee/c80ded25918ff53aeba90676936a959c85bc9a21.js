(function() {
  var profile;

  profile = require('./helper').profile;

  profile('GCC/Clang', {
    stderr: {
      profile: 'gcc_clang',
      highlighting: 'hc'
    }
  }, 'stderr', ['In file included from test/src/def.h:32:0, ', '                 from test/src/gen.h:31, ', '                 from test/src/gen.c:27: ', 'should be traced too', '/usr/include/stdlib.h:483:13: note: expected ‘void *’ but argument is of type ‘const void *’', ' extern void free (void *__ptr) __THROW;', '             ^', 'test/src/gen.c:126:6: error: implicit declaration of function ‘print_element’ [-Wimplicit-function-declaration]', '      print_element(input);', '      ^'], [
    {
      file: 'test/src/def.h',
      row: '32',
      col: '0',
      type: 'trace',
      highlighting: 'note',
      message: 'expected ‘void *’ but argument is of type ‘const void *’'
    }, {
      file: 'test/src/gen.h',
      row: '31',
      col: void 0,
      type: 'trace',
      highlighting: 'note',
      message: 'expected ‘void *’ but argument is of type ‘const void *’'
    }, {
      file: 'test/src/gen.c',
      row: '27',
      col: void 0,
      type: 'trace',
      highlighting: 'note',
      message: 'expected ‘void *’ but argument is of type ‘const void *’'
    }, {
      file: '/usr/include/stdlib.h',
      row: '483',
      col: '13',
      type: 'note',
      message: 'expected ‘void *’ but argument is of type ‘const void *’'
    }, {
      file: 'test/src/gen.c',
      row: '126',
      col: '6',
      type: 'error',
      message: 'implicit declaration of function ‘print_element’ [-Wimplicit-function-declaration]'
    }
  ], [
    [
      {
        file: 'test/src/def.h',
        row: '32',
        col: '0',
        start: 22,
        end: 40
      }
    ], [
      {
        file: 'test/src/gen.h',
        row: '31',
        col: void 0,
        start: 22,
        end: 38
      }
    ], [
      {
        file: 'test/src/gen.c',
        row: '27',
        col: void 0,
        start: 22,
        end: 38
      }
    ], [], [
      {
        file: '/usr/include/stdlib.h',
        row: '483',
        col: '13',
        start: 0,
        end: 27
      }
    ], [], [], [
      {
        file: 'test/src/gen.c',
        row: '126',
        col: '6',
        start: 0,
        end: 19
      }
    ], [], []
  ]);

  profile('apm test', {
    stderr: {
      profile: 'apm_test',
      highlighting: 'hc'
    }
  }, 'stderr', ['.................................................FF...............................................', '', 'Profiles', '  apm test', '    on :: in with multi line match', '      it correctly sets warnings', '        Expected undefined to be \'test/src/def.h\'.', '          Error: Expected undefined to be \'test/src/def.h\'.', '          at /home/fabian/.atom/packages/build-tools-cpp/spec/profile-spec.coffee:183:32', '          at [object Object].<anonymous> (/home/fabian/.atom/packages/build-tools-cpp/spec/profile-spec.coffee:340:15)', '          at _fulfilled (/home/fabian/Apps/atom-build/Atom/resources/app.asar/node_modules/q/q.js:794:54)', '          at self.promiseDispatch.done (/home/fabian/Apps/atom-build/Atom/resources/app.asar/node_modules/q/q.js:823:30)', '          at Promise.promise.promiseDispatch (/home/fabian/Apps/atom-build/Atom/resources/app.asar/node_modules/q/q.js:756:13)', '          at /home/fabian/Apps/atom-build/Atom/resources/app.asar/node_modules/q/q.js:564:44', '          at flush (/home/fabian/Apps/atom-build/Atom/resources/app.asar/node_modules/q/q.js:110:17)', '          at process._tickCallback (node.js:357:13)', 'RegExp tests', '  Simple regex', '    it returns the correct match', '      TypeError: Cannot read property \'groups\' of undefined (spec/regex-spec.coffee:16:18)'], [
    {
      type: 'trace',
      message: 'Error: Expected undefined to be \'test/src/def.h\'.',
      file: '/home/fabian/.atom/packages/build-tools-cpp/spec/profile-spec.coffee',
      row: '340',
      col: '15'
    }, {
      type: 'trace',
      message: 'Error: Expected undefined to be \'test/src/def.h\'.',
      file: '/home/fabian/Apps/atom-build/Atom/resources/app.asar/node_modules/q/q.js',
      row: '794',
      col: '54'
    }, {
      type: 'trace',
      message: 'Error: Expected undefined to be \'test/src/def.h\'.',
      file: '/home/fabian/Apps/atom-build/Atom/resources/app.asar/node_modules/q/q.js',
      row: '823',
      col: '30'
    }, {
      type: 'trace',
      message: 'Error: Expected undefined to be \'test/src/def.h\'.',
      file: '/home/fabian/Apps/atom-build/Atom/resources/app.asar/node_modules/q/q.js',
      row: '756',
      col: '13'
    }, {
      type: 'trace',
      message: 'Error: Expected undefined to be \'test/src/def.h\'.',
      file: '/home/fabian/Apps/atom-build/Atom/resources/app.asar/node_modules/q/q.js',
      row: '564',
      col: '44'
    }, {
      type: 'trace',
      message: 'Error: Expected undefined to be \'test/src/def.h\'.',
      file: '/home/fabian/Apps/atom-build/Atom/resources/app.asar/node_modules/q/q.js',
      row: '110',
      col: '17'
    }, {
      type: 'trace',
      message: 'Error: Expected undefined to be \'test/src/def.h\'.',
      file: 'node.js',
      row: '357',
      col: '13'
    }, {
      type: 'error',
      message: 'Error: Expected undefined to be \'test/src/def.h\'.',
      file: '/home/fabian/.atom/packages/build-tools-cpp/spec/profile-spec.coffee',
      row: '183',
      col: '32'
    }, {
      type: 'error',
      message: 'TypeError: Cannot read property \'groups\' of undefined',
      file: 'spec/regex-spec.coffee',
      row: '16',
      col: '18'
    }
  ], [
    [], [], [], [], [], [], [], [], [
      {
        file: '/home/fabian/.atom/packages/build-tools-cpp/spec/profile-spec.coffee',
        row: '183',
        col: '32',
        start: 13,
        end: 87
      }
    ], [
      {
        file: '/home/fabian/.atom/packages/build-tools-cpp/spec/profile-spec.coffee',
        row: '340',
        col: '15',
        start: 42,
        end: 116
      }
    ], [
      {
        file: '/home/fabian/Apps/atom-build/Atom/resources/app.asar/node_modules/q/q.js',
        row: '794',
        col: '54',
        start: 25,
        end: 103
      }
    ], [
      {
        file: '/home/fabian/Apps/atom-build/Atom/resources/app.asar/node_modules/q/q.js',
        row: '823',
        col: '30',
        start: 40,
        end: 118
      }
    ], [
      {
        file: '/home/fabian/Apps/atom-build/Atom/resources/app.asar/node_modules/q/q.js',
        row: '756',
        col: '13',
        start: 46,
        end: 124
      }
    ], [
      {
        file: '/home/fabian/Apps/atom-build/Atom/resources/app.asar/node_modules/q/q.js',
        row: '564',
        col: '44',
        start: 13,
        end: 91
      }
    ], [
      {
        file: '/home/fabian/Apps/atom-build/Atom/resources/app.asar/node_modules/q/q.js',
        row: '110',
        col: '17',
        start: 20,
        end: 98
      }
    ], [
      {
        file: 'node.js',
        row: '357',
        col: '13',
        start: 36,
        end: 49
      }
    ], [], [], [], [
      {
        file: 'spec/regex-spec.coffee',
        row: '16',
        col: '18',
        start: 61,
        end: 88
      }
    ]
  ]);

  profile('Java', {
    stderr: {
      profile: 'java',
      highlighting: 'hc'
    }
  }, 'stderr', ['Buildfile: /home/fabian/Projects/testing/java/build.xml', '', 'compile: ', '    [javac] /home/fabian/Projects/testing/java/build.xml:9: warning: \'includeantruntime\' was not set, defaulting to build.sysclasspath=last; set to false for repeatable builds', '    [javac] Compiling 1 source file to /home/fabian/Projects/testing/java/build/classes', '    [javac] /home/fabian/Projects/testing/java/src/Factorial.java:12: error: incompatible types', '    [javac]     if (fact)', '    [javac]         ^', '    [javac]   required: boolean', '    [javac]   found:    int', '    [javac] /home/fabian/Projects/testing/java/src/Factorial.java:15: error: array required, but int found', '    [javac]       while (fact[1])', '    [javac]                  ^', '    [javac] 2 errors', '', 'BUILD FAILED', '/home/fabian/Projects/testing/java/build.xml: 9: Compile failed; see the compiler error output for details.', '', 'Total time: 0 seconds'], [
    {
      type: 'error',
      message: 'incompatible types',
      file: '/home/fabian/Projects/testing/java/src/Factorial.java',
      row: '12'
    }, {
      type: 'error',
      message: 'array required, but int found',
      file: '/home/fabian/Projects/testing/java/src/Factorial.java',
      row: '15'
    }
  ], [
    [], [], [], [], [], [
      {
        file: '/home/fabian/Projects/testing/java/src/Factorial.java',
        row: '12',
        col: '0',
        start: 12,
        end: 67
      }
    ], [], [], [], [], [
      {
        file: '/home/fabian/Projects/testing/java/src/Factorial.java',
        row: '15',
        col: '0',
        start: 12,
        end: 67
      }
    ], [], [], [], [], [], [], [], []
  ]);

  profile('Python', {
    stderr: {
      profile: 'python',
      highlighting: 'hc'
    }
  }, 'stderr', ['Traceback (most recent call last): ', '  File "/home/fabian/Projects/sonata/sonata/info.py", line 208, in on_viewport_resize', '    self.on_artwork_changed(None, self._pixbuf)', '  File "/home/fabian/Projects/sonata/sonata/info.py", line 534, in on_artwork_changed', '    (pix2, w, h) = img.aget_pixbuf_of_size(pixbuf, width)', 'AttributeError: \'module\' object has no attribute \'aget_pixbuf_of_size\'', '  File "./main.py", line 2', '    print "Hello World"', '                      ^', 'SyntaxError: Missing parentheses in call to \'print\''], [
    {
      type: 'trace',
      message: 'AttributeError: \'module\' object has no attribute \'aget_pixbuf_of_size\'',
      file: '/home/fabian/Projects/sonata/sonata/info.py',
      row: '208'
    }, {
      type: 'error',
      message: 'AttributeError: \'module\' object has no attribute \'aget_pixbuf_of_size\'',
      file: '/home/fabian/Projects/sonata/sonata/info.py',
      row: '534',
      trace: [
        {
          type: 'trace',
          text: '(pix2, w, h) = img.aget_pixbuf_of_size(pixbuf, width)',
          filePath: '/home/fabian/Projects/sonata/sonata/info.py',
          range: [[533, 0], [533, 9999]]
        }, {
          type: 'trace',
          text: 'self.on_artwork_changed(None, self._pixbuf)',
          filePath: '/home/fabian/Projects/sonata/sonata/info.py',
          range: [[207, 0], [207, 9999]]
        }
      ]
    }, {
      type: 'error',
      message: 'SyntaxError: Missing parentheses in call to \'print\'',
      file: './main.py',
      row: '2'
    }
  ], [
    [], [
      {
        file: '/home/fabian/Projects/sonata/sonata/info.py',
        row: '208'
      }
    ], [], [
      {
        file: '/home/fabian/Projects/sonata/sonata/info.py',
        row: '534'
      }
    ], [], [], [
      {
        file: './main.py',
        row: '2'
      }
    ], [], [], []
  ]);

  profile('Modelsim', {
    stderr: {
      profile: 'modelsim',
      highlighting: 'hc'
    }
  }, 'stderr', ['vcom -work work /home/chris/coding/vhdl_test/test.vhd', 'Model Technology ModelSim SE-64 vcom 10.1g Compiler 2014.08 Aug  8 2014', '-- Loading package STANDARD', '-- Loading package TEXTIO', '-- Loading package std_logic_1164', '-- Loading package NUMERIC_STD', '-- Loading package test_pkg', '-- Compiling entity test', '-- Compiling architecture beh of test', '-- Loading entity test_sub', '** Error: /home/chris/coding/vhdl_test/test.vhd(106): (vcom-1484) Unknown formal identifier "data_in".', '** Error: /home/chris/coding/vhdl_test/test.vhd(278): VHDL Compiler exiting'], [
    {
      type: 'error',
      message: '(vcom-1484) Unknown formal identifier "data_in".',
      file: '/home/chris/coding/vhdl_test/test.vhd',
      row: '106'
    }, {
      type: 'error',
      message: 'VHDL Compiler exiting',
      file: '/home/chris/coding/vhdl_test/test.vhd',
      row: '278'
    }
  ], [
    [
      {
        file: '/home/chris/coding/vhdl_test/test.vhd',
        start: 16,
        end: 52
      }
    ], [], [], [], [], [], [], [], [], [], [
      {
        file: '/home/chris/coding/vhdl_test/test.vhd',
        row: '106',
        start: 10,
        end: 51
      }
    ], [
      {
        file: '/home/chris/coding/vhdl_test/test.vhd',
        row: '278',
        start: 10,
        end: 51
      }
    ]
  ]);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvc3BlYy9wcm9maWxlLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLE9BQUE7O0FBQUEsRUFBQyxVQUFXLE9BQUEsQ0FBUSxVQUFSLEVBQVgsT0FBRCxDQUFBOztBQUFBLEVBRUEsT0FBQSxDQUFRLFdBQVIsRUFBcUI7QUFBQSxJQUNuQixNQUFBLEVBQ0U7QUFBQSxNQUFBLE9BQUEsRUFBUyxXQUFUO0FBQUEsTUFDQSxZQUFBLEVBQWMsSUFEZDtLQUZpQjtHQUFyQixFQUlHLFFBSkgsRUFLQSxDQUNFLDZDQURGLEVBRUUsMkNBRkYsRUFHRSwyQ0FIRixFQUlFLHNCQUpGLEVBS0UsOEZBTEYsRUFNRSwwQ0FORixFQU9FLGdCQVBGLEVBUUUsaUhBUkYsRUFTRSw2QkFURixFQVVFLFNBVkYsQ0FMQSxFQWlCQTtJQUNFO0FBQUEsTUFBQyxJQUFBLEVBQU0sZ0JBQVA7QUFBQSxNQUFnQyxHQUFBLEVBQUssSUFBckM7QUFBQSxNQUE0QyxHQUFBLEVBQUssR0FBakQ7QUFBQSxNQUE0RCxJQUFBLEVBQU0sT0FBbEU7QUFBQSxNQUE2RSxZQUFBLEVBQWMsTUFBM0Y7QUFBQSxNQUFtRyxPQUFBLEVBQVMsMERBQTVHO0tBREYsRUFFRTtBQUFBLE1BQUMsSUFBQSxFQUFNLGdCQUFQO0FBQUEsTUFBZ0MsR0FBQSxFQUFLLElBQXJDO0FBQUEsTUFBNEMsR0FBQSxFQUFLLE1BQWpEO0FBQUEsTUFBNEQsSUFBQSxFQUFNLE9BQWxFO0FBQUEsTUFBNkUsWUFBQSxFQUFjLE1BQTNGO0FBQUEsTUFBbUcsT0FBQSxFQUFTLDBEQUE1RztLQUZGLEVBR0U7QUFBQSxNQUFDLElBQUEsRUFBTSxnQkFBUDtBQUFBLE1BQWdDLEdBQUEsRUFBSyxJQUFyQztBQUFBLE1BQTRD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

//# sourceURL=/home/champ/.atom/packages/build-tools/spec/profile-spec.coffee
