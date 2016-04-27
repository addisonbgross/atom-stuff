(function() {
  var Output;

  Output = require('../lib/pipeline/output-stream');

  module.exports = {
    profile: function(name, command, stream, strings, expectations, files) {
      return describe(command[stream].profile, function() {
        var output;
        output = null;
        beforeEach(function() {
          output = new Output(command, command[stream]);
          expect(output).toBeDefined();
          return expect(output.profile).toBeDefined();
        });
        it('has a name', function() {
          return expect(output.profile.constructor.profile_name).toBe(name);
        });
        it('has scopes', function() {
          return expect(output.profile.scopes).toBeDefined();
        });
        it('has a `in` function', function() {
          return expect(output.profile["in"]).toBeDefined();
        });
        it('has a `files` function', function() {
          return expect(output.profile.files).toBeDefined();
        });
        describe('on ::in', function() {
          var matches;
          matches = [];
          beforeEach(function() {
            var string, _i, _len, _results;
            spyOn(output, 'absolutePath').andCallFake(function(path) {
              return path;
            });
            spyOn(output.profile.output, 'lint').andCallFake(function(match) {
              if ((match != null) && (match.file != null) && (match.row != null) && (match.type != null) && (match.message != null)) {
                return matches.push({
                  file: match.file,
                  row: match.row,
                  col: match.col,
                  type: match.type,
                  highlighting: match.highlighting,
                  message: match.message,
                  trace: match.trace
                });
              }
            });
            _results = [];
            for (_i = 0, _len = strings.length; _i < _len; _i++) {
              string = strings[_i];
              _results.push(output["in"](string + '\n'));
            }
            return _results;
          });
          return it('correctly sets warnings and errors', function() {
            var expectation, index, key, match, _i, _len, _results;
            expect(matches.length).toBe(expectations.length);
            _results = [];
            for (index = _i = 0, _len = matches.length; _i < _len; index = ++_i) {
              match = matches[index];
              expectation = expectations[index];
              _results.push((function() {
                var _j, _len1, _ref, _results1;
                _ref = Object.keys(expectation);
                _results1 = [];
                for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                  key = _ref[_j];
                  _results1.push(expect(("Line[" + index + "]." + key + ": ") + match[key]).toEqual(("Line[" + index + "]." + key + ": ") + expectation[key]));
                }
                return _results1;
              })());
            }
            return _results;
          });
        });
        if (files == null) {
          return;
        }
        return describe('on ::files', function() {
          var matches;
          matches = [];
          beforeEach(function() {
            var string, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = strings.length; _i < _len; _i++) {
              string = strings[_i];
              _results.push(matches.push(output.profile.files(string)));
            }
            return _results;
          });
          return it('correctly returns file descriptors', function() {
            var expectation, index0, index1, item, key, match, _i, _len, _results;
            expect(matches.length).toBe(files.length);
            _results = [];
            for (index0 = _i = 0, _len = matches.length; _i < _len; index0 = ++_i) {
              match = matches[index0];
              expectation = files[index0];
              _results.push((function() {
                var _j, _len1, _results1;
                _results1 = [];
                for (index1 = _j = 0, _len1 = expectation.length; _j < _len1; index1 = ++_j) {
                  item = expectation[index1];
                  _results1.push((function() {
                    var _k, _len2, _ref, _results2;
                    _ref = Object.keys(item);
                    _results2 = [];
                    for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
                      key = _ref[_k];
                      _results2.push(expect(("Line[" + index0 + "][" + index1 + "]." + key + ": ") + match[index1][key]).toBe(("Line[" + index0 + "][" + index1 + "]." + key + ": ") + item[key]));
                    }
                    return _results2;
                  })());
                }
                return _results1;
              })());
            }
            return _results;
          });
        });
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvc3BlYy9oZWxwZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLE1BQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLCtCQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE9BQUEsRUFBUyxTQUFDLElBQUQsRUFBTyxPQUFQLEVBQWdCLE1BQWhCLEVBQXdCLE9BQXhCLEVBQWlDLFlBQWpDLEVBQStDLEtBQS9DLEdBQUE7YUFDUCxRQUFBLENBQVMsT0FBUSxDQUFBLE1BQUEsQ0FBTyxDQUFDLE9BQXpCLEVBQWtDLFNBQUEsR0FBQTtBQUNoQyxZQUFBLE1BQUE7QUFBQSxRQUFBLE1BQUEsR0FBUyxJQUFULENBQUE7QUFBQSxRQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLE1BQUEsR0FBYSxJQUFBLE1BQUEsQ0FBTyxPQUFQLEVBQWdCLE9BQVEsQ0FBQSxNQUFBLENBQXhCLENBQWIsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxDQUFPLE1BQVAsQ0FBYyxDQUFDLFdBQWYsQ0FBQSxDQURBLENBQUE7aUJBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFkLENBQXNCLENBQUMsV0FBdkIsQ0FBQSxFQUhTO1FBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxRQU9BLEVBQUEsQ0FBRyxZQUFILEVBQWlCLFNBQUEsR0FBQTtpQkFDZixNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsWUFBbEMsQ0FBK0MsQ0FBQyxJQUFoRCxDQUFxRCxJQUFyRCxFQURlO1FBQUEsQ0FBakIsQ0FQQSxDQUFBO0FBQUEsUUFVQSxFQUFBLENBQUcsWUFBSCxFQUFpQixTQUFBLEdBQUE7aUJBQ2Ys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

//# sourceURL=/home/champ/.atom/packages/build-tools/spec/helper.coffee
