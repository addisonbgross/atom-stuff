(function() {
  var Output;

  Output = require('../lib/pipeline/output-stream');

  module.exports = {
    profile: function(name, command, stream, strings, expectations, files) {
      return describe(command[stream].pipeline[0].config.profile, function() {
        var output;
        output = null;
        beforeEach(function() {
          output = new Output(command, command[stream]);
          expect(output).toBeDefined();
          return expect(output.wholepipeline.pipeline.length).toBe(1);
        });
        it('has a name', function() {
          return expect(output.wholepipeline.pipeline[0].profile.constructor.profile_name).toBe(name);
        });
        it('has scopes', function() {
          return expect(output.wholepipeline.pipeline[0].profile.scopes).toBeDefined();
        });
        it('has a `in` function', function() {
          return expect(output.wholepipeline.pipeline[0].profile["in"]).toBeDefined();
        });
        it('has a `files` function', function() {
          return expect(output.wholepipeline.pipeline[0].profile.files).toBeDefined();
        });
        describe('on ::in', function() {
          var matches;
          matches = [];
          beforeEach(function() {
            var string, _i, _len, _results;
            spyOn(output.wholepipeline, 'absolutePath').andCallFake(function(path) {
              return path;
            });
            spyOn(output.wholepipeline.pipeline[0].profile.output, 'lint').andCallFake(function(match) {
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
              _results.push(matches.push(output.wholepipeline.pipeline[0].profile.files(string)));
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYnVpbGQtdG9vbHMvc3BlYy9oZWxwZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLE1BQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLCtCQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE9BQUEsRUFBUyxTQUFDLElBQUQsRUFBTyxPQUFQLEVBQWdCLE1BQWhCLEVBQXdCLE9BQXhCLEVBQWlDLFlBQWpDLEVBQStDLEtBQS9DLEdBQUE7YUFDUCxRQUFBLENBQVMsT0FBUSxDQUFBLE1BQUEsQ0FBTyxDQUFDLFFBQVMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUFNLENBQUMsT0FBNUMsRUFBcUQsU0FBQSxHQUFBO0FBQ25ELFlBQUEsTUFBQTtBQUFBLFFBQUEsTUFBQSxHQUFTLElBQVQsQ0FBQTtBQUFBLFFBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsTUFBQSxHQUFhLElBQUEsTUFBQSxDQUFPLE9BQVAsRUFBZ0IsT0FBUSxDQUFBLE1BQUEsQ0FBeEIsQ0FBYixDQUFBO0FBQUEsVUFDQSxNQUFBLENBQU8sTUFBUCxDQUFjLENBQUMsV0FBZixDQUFBLENBREEsQ0FBQTtpQkFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsTUFBckMsQ0FBNEMsQ0FBQyxJQUE3QyxDQUFrRCxDQUFsRCxFQUhTO1FBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxRQU9BLEVBQUEsQ0FBRyxZQUFILEVBQWlCLFNBQUEsR0FBQTtpQkFDZixNQUFBLENBQU8sTUFBTSxDQUFDLGFBQWEsQ0FBQyxRQUFTLENBQUEsQ0FBQSxDQUFFLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxZQUE1RCxDQUF5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

//# sourceURL=/home/champ/.atom/packages/build-tools/spec/helper.coffee
