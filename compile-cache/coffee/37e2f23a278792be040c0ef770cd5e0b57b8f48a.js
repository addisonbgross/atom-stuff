(function() {
  var config, exec, fs, md5, process;

  exec = require("child_process");

  process = require("process");

  config = require("../config.coffee");

  md5 = require('md5');

  fs = require('fs');

  module.exports = {
    data: {
      methods: [],
      autocomplete: [],
      composer: null
    },
    currentProcesses: [],

    /**
     * Executes a command to PHP proxy
     * @param  {string}  command  Command to execute
     * @param  {boolean} async    Must be async or not
     * @param  {array}   options  Options for the command
     * @param  {boolean} noparser Do not use php/parser.php
     * @return {array}           Json of the response
     */
    execute: function(command, async, options, noparser) {
      var args, c, directory, err, processKey, res, stdout, _i, _j, _len, _len1, _ref;
      if (!options) {
        options = {};
      }
      processKey = command.join("_");
      _ref = atom.project.getDirectories();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        directory = _ref[_i];
        for (_j = 0, _len1 = command.length; _j < _len1; _j++) {
          c = command[_j];
          c.replace(/\\/g, '\\\\');
        }
        if (!async) {
          try {
            if (this.currentProcesses[processKey] == null) {
              this.currentProcesses[processKey] = true;
              args = [__dirname + "/../../php/parser.php", directory.path].concat(command);
              if (noparser) {
                args = command;
              }
              stdout = exec.spawnSync(config.config.php, args, options).output[1].toString('ascii');
              delete this.currentProcesses[processKey];
              if (noparser) {
                res = {
                  result: stdout
                };
              } else {
                res = JSON.parse(stdout);
              }
            }
          } catch (_error) {
            err = _error;
            console.log(err);
            res = {
              error: err
            };
          }
          if (!res) {
            return [];
          }
          if (res.error != null) {
            this.printError(res.error);
          }
          return res;
        } else {
          if (this.currentProcesses[processKey] == null) {
            if (processKey.indexOf("--refresh") !== -1) {
              config.statusInProgress.update("Indexing...", true);
            }
            args = [__dirname + "/../../php/parser.php", directory.path].concat(command);
            if (noparser) {
              args = command;
            }
            this.currentProcesses[processKey] = exec.exec(config.config.php + " " + args.join(" "), options, (function(_this) {
              return function(error, stdout, stderr) {
                delete _this.currentProcesses[processKey];
                if (processKey.indexOf("--refresh") !== -1) {
                  config.statusInProgress.update("Indexing...", false);
                }
                return stdout;
              };
            })(this));
          }
        }
      }
    },

    /**
     * Reads an index by its name (file in indexes/index.[name].json)
     * @param {string} name Name of the index to read
     */
    readIndex: function(name) {
      var crypt, directory, err, options, path, _i, _len, _ref;
      _ref = atom.project.getDirectories();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        directory = _ref[_i];
        crypt = md5(directory.path);
        path = __dirname + "/../../indexes/" + crypt + "/index." + name + ".json";
        try {
          fs.accessSync(path, fs.F_OK | fs.R_OK);
        } catch (_error) {
          err = _error;
          return [];
        }
        options = {
          encoding: 'UTF-8'
        };
        return JSON.parse(fs.readFileSync(path, options));
        break;
      }
    },

    /**
     * Open and read the composer.json file in the current folder
     */
    readComposer: function() {
      var directory, err, options, path, _i, _len, _ref;
      _ref = atom.project.getDirectories();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        directory = _ref[_i];
        path = "" + directory.path + "/composer.json";
        try {
          fs.accessSync(path, fs.F_OK | fs.R_OK);
        } catch (_error) {
          err = _error;
          continue;
        }
        options = {
          encoding: 'UTF-8'
        };
        this.data.composer = JSON.parse(fs.readFileSync(path, options));
        return this.data.composer;
      }
      console.log('Unable to find composer.json file or to open it. The plugin will not work as expected. It only works on composer project');
      throw "Error";
    },

    /**
     * Throw a formatted error
     * @param {object} error Error to show
     */
    printError: function(error) {
      var message;
      this.data.error = true;
      return message = error.message;
    },

    /**
     * Clear all cache of the plugin
     */
    clearCache: function() {
      return this.data = {
        error: false,
        autocomplete: [],
        methods: [],
        composer: null
      };
    },

    /**
     * Autocomplete for classes name
     * @return {array}
     */
    classes: function() {
      return this.readIndex('classes');
    },

    /**
     * Returns composer.json file
     * @return {Object}
     */
    composer: function() {
      return this.readComposer();
    },

    /**
     * Autocomplete for internal PHP constants
     * @return {array}
     */
    constants: function() {
      var res;
      if (this.data.constants == null) {
        res = this.execute(["--constants"], false);
        this.data.constants = res;
      }
      return this.data.constants;
    },

    /**
     * Autocomplete for internal PHP functions
     * @return {array}
     */
    functions: function() {
      var res;
      if (this.data.functions == null) {
        res = this.execute(["--functions"], false);
        this.data.functions = res;
      }
      return this.data.functions;
    },

    /**
     * Autocomplete for methods & properties of a class
     * @param  {string} className Class complete name (with namespace)
     * @return {array}
     */
    methods: function(className) {
      var res;
      if (this.data.methods[className] == null) {
        res = this.execute(["--methods", "" + className], false);
        this.data.methods[className] = res;
      }
      return this.data.methods[className];
    },

    /**
     * Autocomplete for methods & properties of a class
     * @param  {string} className Class complete name (with namespace)
     * @return {array}
     */
    autocomplete: function(className, name) {
      var cacheKey, res;
      cacheKey = className + "." + name;
      if (this.data.autocomplete[cacheKey] == null) {
        res = this.execute(["--autocomplete", className, name], false);
        this.data.autocomplete[cacheKey] = res;
      }
      return this.data.autocomplete[cacheKey];
    },

    /**
     * Returns params from the documentation of the given function
     *
     * @param {string} className
     * @param {string} functionName
     */
    docParams: function(className, functionName) {
      var res;
      res = this.execute(["--doc-params", "" + className, "" + functionName], false);
      return res;
    },

    /**
     * Refresh the full index or only for the given classPath
     * @param  {string} classPath Full path (dir) of the class to refresh
     */
    refresh: function(classPath) {
      if (classPath == null) {
        return this.execute(["--refresh"], true);
      } else {
        return this.execute(["--refresh", "" + classPath], true);
      }
    },

    /**
     * Method called on plugin activation
     */
    init: function() {
      this.refresh();
      atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return editor.onDidSave(function(event) {
            var classPath, directory, path, _i, _len, _ref;
            if (editor.getGrammar().scopeName.match(/text.html.php$/)) {
              _this.clearCache();
              path = event.path;
              _ref = atom.project.getDirectories();
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                directory = _ref[_i];
                if (path.indexOf(directory.path) === 0) {
                  classPath = path.substr(0, directory.path.length + 1);
                  path = path.substr(directory.path.length + 1);
                  break;
                }
              }
              return _this.refresh(classPath + path.replace(/\\/g, '/'));
            }
          });
        };
      })(this));
      atom.config.onDidChange('atom-autocomplete-php.binPhp', (function(_this) {
        return function() {
          return _this.clearCache();
        };
      })(this));
      atom.config.onDidChange('atom-autocomplete-php.binComposer', (function(_this) {
        return function() {
          return _this.clearCache();
        };
      })(this));
      return atom.config.onDidChange('atom-autocomplete-php.autoloadPaths', (function(_this) {
        return function() {
          return _this.clearCache();
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1hdXRvY29tcGxldGUtcGhwL2xpYi9zZXJ2aWNlcy9waHAtcHJveHkuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhCQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBVSxPQUFBLENBQVEsU0FBUixDQURWLENBQUE7O0FBQUEsRUFFQSxNQUFBLEdBQVMsT0FBQSxDQUFRLGtCQUFSLENBRlQsQ0FBQTs7QUFBQSxFQUdBLEdBQUEsR0FBTSxPQUFBLENBQVEsS0FBUixDQUhOLENBQUE7O0FBQUEsRUFJQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FKTCxDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FDSTtBQUFBLElBQUEsSUFBQSxFQUNJO0FBQUEsTUFBQSxPQUFBLEVBQVMsRUFBVDtBQUFBLE1BQ0EsWUFBQSxFQUFjLEVBRGQ7QUFBQSxNQUVBLFFBQUEsRUFBVSxJQUZWO0tBREo7QUFBQSxJQUtBLGdCQUFBLEVBQWtCLEVBTGxCO0FBT0E7QUFBQTs7Ozs7OztPQVBBO0FBQUEsSUFlQSxPQUFBLEVBQVMsU0FBQyxPQUFELEVBQVUsS0FBVixFQUFpQixPQUFqQixFQUEwQixRQUExQixHQUFBO0FBQ0wsVUFBQSwyRUFBQTtBQUFBLE1BQUEsSUFBZ0IsQ0FBQSxPQUFoQjtBQUFBLFFBQUEsT0FBQSxHQUFVLEVBQVYsQ0FBQTtPQUFBO0FBQUEsTUFDQSxVQUFBLEdBQWEsT0FBTyxDQUFDLElBQVIsQ0FBYSxHQUFiLENBRGIsQ0FBQTtBQUdBO0FBQUEsV0FBQSwyQ0FBQTs2QkFBQTtBQUNJLGFBQUEsZ0RBQUE7MEJBQUE7QUFDSSxVQUFBLENBQUMsQ0FBQyxPQUFGLENBQVUs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

//# sourceURL=/home/champ/.atom/packages/atom-autocomplete-php/lib/services/php-proxy.coffee
