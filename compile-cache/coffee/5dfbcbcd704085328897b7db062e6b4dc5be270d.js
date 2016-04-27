(function() {
  var BufferedProcess, CscopeCommands, ResultSetModel, fs;

  BufferedProcess = require('atom').BufferedProcess;

  ResultSetModel = require('./models/result-set-model');

  fs = require('fs');

  module.exports = CscopeCommands = {
    getSourceFiles: function(path, exts) {
      var args, ext, index, _i, _len, _ref;
      args = ['.'];
      _ref = exts.split(/\s+/);
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        ext = _ref[index];
        if (index > 0) {
          args.push('-o');
        }
        args.push('-name');
        args.push('*' + ext);
      }
      return this.runCommand('find', args, {
        cwd: path
      });
    },
    generateCscopeDB: function(path) {
      return this.runCommand('cscope', ['-q', '-R', '-b', '-i', 'cscope.files'], {
        cwd: path
      });
    },
    writeToFile: function(path, fileName, content) {
      var filePath;
      filePath = path + '/' + fileName;
      return new Promise(function(resolve, reject) {
        return fs.writeFile(filePath, content, function(err) {
          if (err) {
            reject({
              success: false,
              info: err.toString()
            });
          }
          return resolve({
            success: true
          });
        });
      });
    },
    setupCscopeForPath: function(path, exts, force) {
      var cscopeExists;
      cscopeExists = force ? Promise.reject(force) : this.cscopeExists(path);
      return cscopeExists.then((function(_this) {
        return function(data) {
          return Promise.resolve({
            success: true
          });
        };
      })(this))["catch"]((function(_this) {
        return function(data) {
          var dbGen, sourceFileGen, writeCscopeFiles;
          sourceFileGen = _this.getSourceFiles(path, exts);
          writeCscopeFiles = sourceFileGen.then(function(data) {
            return _this.writeToFile(path, 'cscope.files', data);
          });
          dbGen = writeCscopeFiles.then(function(data) {
            return _this.generateCscopeDB(path);
          });
          return Promise.all([sourceFileGen, writeCscopeFiles, dbGen]);
        };
      })(this));
    },
    setupCscope: function(paths, exts, force) {
      var path, promises, _i, _len;
      if (force == null) {
        force = false;
      }
      promises = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        promises.push(this.setupCscopeForPath(path, exts, force));
      }
      return Promise.all(promises);
    },
    cscopeExists: function(path) {
      var filePath;
      filePath = path + '/' + 'cscope.out';
      return new Promise(function(resolve, reject) {
        return fs.access(filePath, fs.R_OK | fs.W_OK, (function(_this) {
          return function(err) {
            if (err) {
              reject(err);
            }
            return resolve(err);
          };
        })(this));
      });
    },
    runCommand: function(command, args, options) {
      var process;
      if (options == null) {
        options = {};
      }
      process = new Promise((function(_this) {
        return function(resolve, reject) {
          var output;
          output = '';
          try {
            return new BufferedProcess({
              command: command,
              args: args,
              options: options,
              stdout: function(data) {
                return output += data.toString();
              },
              stderr: function(data) {
                return reject({
                  success: false,
                  message: "At " + options.cwd + ": " + data.toString()
                });
              },
              exit: function(code) {
                return resolve(output);
              }
            });
          } catch (_error) {
            return reject("Couldn't find cscope");
          }
        };
      })(this));
      return process;
    },
    runCscopeCommand: function(num, keyword, cwd) {
      if (keyword.trim() === '') {
        return Promise.resolve(new ResultSetModel());
      } else {
        return new Promise((function(_this) {
          return function(resolve, reject) {
            return _this.runCommand('cscope', ['-d', '-L', '-' + num, keyword], {
              cwd: cwd
            }).then(function(data) {
              return resolve(new ResultSetModel(keyword, data));
            })["catch"](function(data) {
              return reject(data);
            });
          };
        })(this));
      }
    },
    runCscopeCommands: function(num, keyword, paths) {
      var motherSwear, path, promises, resultSet, _i, _len;
      promises = [];
      resultSet = new ResultSetModel(keyword);
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        promises.push(this.runCscopeCommand(num, keyword, path));
      }
      motherSwear = new Promise((function(_this) {
        return function(resolve, reject) {
          return Promise.all(promises).then(function(values) {
            var value, _j, _len1;
            for (_j = 0, _len1 = values.length; _j < _len1; _j++) {
              value = values[_j];
              resultSet.addResultSet(value);
            }
            return resolve(resultSet);
          })["catch"](function(data) {
            return reject(data);
          });
        };
      })(this));
      return motherSwear;
    },
    findThisSymbol: function(keyword, paths) {
      var commandNumber;
      commandNumber = '0';
      return this.runCscopeCommands(commandNumber, keyword, paths);
    },
    findThisGlobalDefinition: function(keyword, paths) {
      var commandNumber;
      commandNumber = '1';
      return this.runCscopeCommands(commandNumber, keyword, paths);
    },
    findFunctionsCalledBy: function(keyword, paths) {
      var commandNumber;
      commandNumber = '2';
      return this.runCscopeCommands(commandNumber, keyword, paths);
    },
    findFunctionsCalling: function(keyword, paths) {
      var commandNumber;
      commandNumber = '3';
      return this.runCscopeCommands(commandNumber, keyword, paths);
    },
    findTextString: function(keyword, paths) {
      var commandNumber;
      commandNumber = '4';
      return this.runCscopeCommands(commandNumber, keyword, paths);
    },
    findEgrepPattern: function(keyword, paths) {
      var commandNumber;
      commandNumber = '6';
      return this.runCscopeCommands(commandNumber, keyword, paths);
    },
    findThisFile: function(keyword, paths) {
      var commandNumber;
      commandNumber = '7';
      return this.runCscopeCommands(commandNumber, keyword, paths);
    },
    findFilesIncluding: function(keyword, paths) {
      var commandNumber;
      commandNumber = '8';
      return this.runCscopeCommands(commandNumber, keyword, paths);
    },
    findAssignmentsTo: function(keyword, paths) {
      var commandNumber;
      commandNumber = '9';
      return this.runCscopeCommands(commandNumber, keyword, paths);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1jc2NvcGUvbGliL2NzY29wZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbURBQUE7O0FBQUEsRUFBQyxrQkFBbUIsT0FBQSxDQUFRLE1BQVIsRUFBbkIsZUFBRCxDQUFBOztBQUFBLEVBQ0EsY0FBQSxHQUFpQixPQUFBLENBQVEsMkJBQVIsQ0FEakIsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUZMLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUFpQixjQUFBLEdBQ2Y7QUFBQSxJQUFBLGNBQUEsRUFBZ0IsU0FBQyxJQUFELEVBQU8sSUFBUCxHQUFBO0FBQ2QsVUFBQSxnQ0FBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLENBQUMsR0FBRCxDQUFQLENBQUE7QUFDQTtBQUFBLFdBQUEsMkRBQUE7MEJBQUE7QUFDRSxRQUFBLElBQWtCLEtBQUEsR0FBUSxDQUExQjtBQUFBLFVBQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFWLENBQUEsQ0FBQTtTQUFBO0FBQUEsUUFDQSxJQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsQ0FEQSxDQUFBO0FBQUEsUUFFQSxJQUFJLENBQUMsSUFBTCxDQUFVLEdBQUEsR0FBTSxHQUFoQixDQUZBLENBREY7QUFBQSxPQURBO0FBTUEsYUFBTyxJQUFDLENBQUEsVUFBRCxDQUFZLE1BQVosRUFBb0IsSUFBcEIsRUFBMEI7QUFBQSxRQUFDLEdBQUEsRUFBSyxJQUFOO09BQTFCLENBQVAsQ0FQYztJQUFBLENBQWhCO0FBQUEsSUFTQSxnQkFBQSxFQUFrQixTQUFDLElBQUQsR0FBQTtBQUNoQixhQUFPLElBQUMsQ0FBQSxVQUFELENBQVksUUFBWixFQUFzQixDQUFDLElBQUQsRUFBTyxJQUFQLEVB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

//# sourceURL=/home/champ/.atom/packages/atom-cscope/lib/cscope.coffee
