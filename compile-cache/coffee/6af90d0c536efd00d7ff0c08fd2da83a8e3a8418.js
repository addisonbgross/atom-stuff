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
      var cscope_binary;
      cscope_binary = atom.config.get('atom-cscope.cscopeBinaryLocation');
      return this.runCommand(cscope_binary, ['-q', '-R', '-b', '-i', 'cscope.files'], {
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
      var cscope_binary;
      cscope_binary = atom.config.get('atom-cscope.cscopeBinaryLocation');
      if (keyword.trim() === '') {
        return Promise.resolve(new ResultSetModel());
      } else {
        return new Promise((function(_this) {
          return function(resolve, reject) {
            return _this.runCommand(cscope_binary, ['-d', '-L', '-' + num, keyword], {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1jc2NvcGUvbGliL2NzY29wZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbURBQUE7O0FBQUEsRUFBQyxrQkFBbUIsT0FBQSxDQUFRLE1BQVIsRUFBbkIsZUFBRCxDQUFBOztBQUFBLEVBQ0EsY0FBQSxHQUFpQixPQUFBLENBQVEsMkJBQVIsQ0FEakIsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUZMLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUFpQixjQUFBLEdBQ2Y7QUFBQSxJQUFBLGNBQUEsRUFBZ0IsU0FBQyxJQUFELEVBQU8sSUFBUCxHQUFBO0FBQ2QsVUFBQSxnQ0FBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLENBQUMsR0FBRCxDQUFQLENBQUE7QUFDQTtBQUFBLFdBQUEsMkRBQUE7MEJBQUE7QUFDRSxRQUFBLElBQWtCLEtBQUEsR0FBUSxDQUExQjtBQUFBLFVBQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFWLENBQUEsQ0FBQTtTQUFBO0FBQUEsUUFDQSxJQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsQ0FEQSxDQUFBO0FBQUEsUUFFQSxJQUFJLENBQUMsSUFBTCxDQUFVLEdBQUEsR0FBTSxHQUFoQixDQUZBLENBREY7QUFBQSxPQURBO0FBTUEsYUFBTyxJQUFDLENBQUEsVUFBRCxDQUFZLE1BQVosRUFBb0IsSUFBcEIsRUFBMEI7QUFBQSxRQUFDLEdBQUEsRUFBSyxJQUFOO09BQTFCLENBQVAsQ0FQYztJQUFBLENBQWhCO0FBQUEsSUFTQSxnQkFBQSxFQUFrQixTQUFDLElBQUQsR0FBQTtBQUNoQixVQUFBLGFBQUE7QUFBQSxNQUFBLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENB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

//# sourceURL=/home/champ/.atom/packages/atom-cscope/lib/cscope.coffee
