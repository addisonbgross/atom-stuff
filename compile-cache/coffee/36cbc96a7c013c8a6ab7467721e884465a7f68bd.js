(function() {
  var BufferedProcess, CscopeCommands, ResultSetModel, fs, path;

  BufferedProcess = require('atom').BufferedProcess;

  ResultSetModel = require('./models/result-set-model');

  fs = require('fs');

  path = require('path');

  module.exports = CscopeCommands = {
    getSourceFiles: function(project, exts) {
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
        cwd: project
      });
    },
    generateCscopeDB: function(project) {
      var cscope_binary;
      cscope_binary = atom.config.get('atom-cscope.cscopeBinaryLocation');
      return this.runCommand(cscope_binary, ['-qRbi', 'cscope.files'], {
        cwd: project
      });
    },
    writeToFile: function(project, fileName, content) {
      var filePath;
      filePath = path.join(project, fileName);
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
    setupCscopeForPath: function(project, exts, force) {
      var cscopeExists;
      cscopeExists = force ? Promise.reject(force) : this.cscopeExists(project);
      return cscopeExists.then((function(_this) {
        return function(data) {
          return Promise.resolve({
            success: true
          });
        };
      })(this))["catch"]((function(_this) {
        return function(data) {
          var dbGen, sourceFileGen, writeCscopeFiles;
          sourceFileGen = _this.getSourceFiles(project, exts);
          writeCscopeFiles = sourceFileGen.then(function(data) {
            return _this.writeToFile(project, 'cscope.files', data);
          });
          dbGen = writeCscopeFiles.then(function(data) {
            return _this.generateCscopeDB(project);
          });
          return Promise.all([sourceFileGen, writeCscopeFiles, dbGen]);
        };
      })(this));
    },
    setupCscope: function(projects, exts, force) {
      var project, promises, _i, _len;
      if (force == null) {
        force = false;
      }
      promises = [];
      for (_i = 0, _len = projects.length; _i < _len; _i++) {
        project = projects[_i];
        promises.push(this.setupCscopeForPath(project, exts, force));
      }
      return Promise.all(promises);
    },
    cscopeExists: function(project) {
      var filePath;
      filePath = path.join(project, 'cscope.out');
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
            return _this.runCommand(cscope_binary, ['-dL' + num, keyword], {
              cwd: cwd
            }).then(function(data) {
              return resolve(new ResultSetModel(keyword, data, cwd));
            })["catch"](function(data) {
              return reject(data);
            });
          };
        })(this));
      }
    },
    runCscopeCommands: function(num, keyword, projects) {
      var motherSwear, project, promises, resultSet, _i, _len;
      promises = [];
      resultSet = new ResultSetModel(keyword);
      for (_i = 0, _len = projects.length; _i < _len; _i++) {
        project = projects[_i];
        promises.push(this.runCscopeCommand(num, keyword, project));
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
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1jc2NvcGUvbGliL2NzY29wZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseURBQUE7O0FBQUEsRUFBQyxrQkFBbUIsT0FBQSxDQUFRLE1BQVIsRUFBbkIsZUFBRCxDQUFBOztBQUFBLEVBQ0EsY0FBQSxHQUFpQixPQUFBLENBQVEsMkJBQVIsQ0FEakIsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUZMLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsY0FBQSxHQUNmO0FBQUEsSUFBQSxjQUFBLEVBQWdCLFNBQUMsT0FBRCxFQUFVLElBQVYsR0FBQTtBQUNkLFVBQUEsZ0NBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxDQUFDLEdBQUQsQ0FBUCxDQUFBO0FBQ0E7QUFBQSxXQUFBLDJEQUFBOzBCQUFBO0FBQ0UsUUFBQSxJQUFrQixLQUFBLEdBQVEsQ0FBMUI7QUFBQSxVQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBVixDQUFBLENBQUE7U0FBQTtBQUFBLFFBQ0EsSUFBSSxDQUFDLElBQUwsQ0FBVSxPQUFWLENBREEsQ0FBQTtBQUFBLFFBRUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxHQUFBLEdBQU0sR0FBaEIsQ0FGQSxDQURGO0FBQUEsT0FEQTtBQU1BLGFBQU8sSUFBQyxDQUFBLFVBQUQsQ0FBWSxNQUFaLEVBQW9CLElBQXBCLEVBQTBCO0FBQUEsUUFBQyxHQUFBLEVBQUssT0FBTjtPQUExQixDQUFQLENBUGM7SUFBQSxDQUFoQjtBQUFBLElBU0EsZ0JBQUEsRUFBa0IsU0FBQyxPQUFELEdBQUE7QUFDaEIsVUFBQSxhQUFBO0FB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

//# sourceURL=/home/champ/.atom/packages/atom-cscope/lib/cscope.coffee
