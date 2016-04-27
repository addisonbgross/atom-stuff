(function() {
  var StatusInProgress, fs, namespace;

  fs = require('fs');

  namespace = require('./services/namespace.coffee');

  StatusInProgress = require("./services/status-in-progress.coffee");

  module.exports = {
    config: {},
    statusInProgress: null,

    /**
     * Get plugin configuration
     */
    getConfig: function() {
      this.config['php_documentation_base_url'] = {
        functions: 'https://secure.php.net/function.'
      };
      this.config['composer'] = atom.config.get('atom-autocomplete-php.binComposer');
      this.config['php'] = atom.config.get('atom-autocomplete-php.binPhp');
      this.config['autoload'] = atom.config.get('atom-autocomplete-php.autoloadPaths');
      this.config['classmap'] = atom.config.get('atom-autocomplete-php.classMapFiles');
      this.config['packagePath'] = atom.packages.resolvePackagePath('atom-autocomplete-php');
      this.config['verboseErrors'] = atom.config.get('atom-autocomplete-php.verboseErrors');
      return this.config['insertNewlinesForUseStatements'] = atom.config.get('atom-autocomplete-php.insertNewlinesForUseStatements');
    },

    /**
     * Writes configuration in "php lib" folder
     */
    writeConfig: function() {
      var classmap, classmaps, file, files, text, _i, _j, _len, _len1, _ref, _ref1;
      this.getConfig();
      files = "";
      _ref = this.config.autoload;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        files += "'" + file + "',";
      }
      classmaps = "";
      _ref1 = this.config.classmap;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        classmap = _ref1[_j];
        classmaps += "'" + classmap + "',";
      }
      text = "<?php $config = array( 'composer' => '" + this.config.composer + "', 'php' => '" + this.config.php + "', 'autoload' => array(" + files + "), 'classmap' => array(" + classmaps + ") );";
      return fs.writeFileSync(this.config.packagePath + '/php/tmp.php', text);
    },

    /**
     * Tests the user's PHP and Composer configuration.
     * @return {bool}
     */
    testConfig: function(interactive) {
      var errorMessage, errorTitle, exec, testResult;
      this.getConfig();
      exec = require("child_process");
      testResult = exec.spawnSync(this.config.php, ["-v"]);
      errorTitle = 'atom-autocomplete-php - Incorrect setup!';
      errorMessage = 'Either PHP or Composer is not correctly set up and as a result PHP autocompletion will not work. ' + 'Please visit the settings screen to correct this error. If you are not specifying an absolute path for PHP or ' + 'Composer, make sure they are in your PATH. Feel free to look package\'s README for configuration examples';
      if (testResult.status = null || testResult.status !== 0) {
        atom.notifications.addError(errorTitle, {
          'detail': errorMessage
        });
        return false;
      }
      testResult = exec.spawnSync(this.config.php, [this.config.composer, "--version"]);
      if (testResult.status = null || testResult.status !== 0) {
        testResult = exec.spawnSync(this.config.composer, ["--version"]);
        if (testResult.status = null || testResult.status !== 0) {
          atom.notifications.addError(errorTitle, {
            'detail': errorMessage
          });
          return false;
        }
      }
      if (interactive) {
        atom.notifications.addSuccess('atom-autocomplete-php - Success', {
          'detail': 'Configuration OK !'
        });
      }
      return true;
    },

    /**
     * Init function called on package activation
     * Register config events and write the first config
     */
    init: function() {
      this.statusInProgress = new StatusInProgress;
      this.statusInProgress.hide();
      atom.commands.add('atom-workspace', {
        'atom-autocomplete-php:namespace': (function(_this) {
          return function() {
            return namespace.createNamespace(atom.workspace.getActivePaneItem());
          };
        })(this)
      });
      atom.commands.add('atom-workspace', {
        'atom-autocomplete-php:configuration': (function(_this) {
          return function() {
            return _this.testConfig(true);
          };
        })(this)
      });
      this.writeConfig();
      atom.config.onDidChange('atom-autocomplete-php.binPhp', (function(_this) {
        return function() {
          _this.writeConfig();
          return _this.testConfig(true);
        };
      })(this));
      atom.config.onDidChange('atom-autocomplete-php.binComposer', (function(_this) {
        return function() {
          _this.writeConfig();
          return _this.testConfig(true);
        };
      })(this));
      atom.config.onDidChange('atom-autocomplete-php.autoloadPaths', (function(_this) {
        return function() {
          return _this.writeConfig();
        };
      })(this));
      atom.config.onDidChange('atom-autocomplete-php.classMapFiles', (function(_this) {
        return function() {
          return _this.writeConfig();
        };
      })(this));
      atom.config.onDidChange('atom-autocomplete-php.verboseErrors', (function(_this) {
        return function() {
          return _this.writeConfig();
        };
      })(this));
      return atom.config.onDidChange('atom-autocomplete-php.insertNewlinesForUseStatements', (function(_this) {
        return function() {
          return _this.writeConfig();
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvY2hhbXAvLmF0b20vcGFja2FnZXMvYXRvbS1hdXRvY29tcGxldGUtcGhwL2xpYi9jb25maWcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtCQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLFNBQUEsR0FBWSxPQUFBLENBQVEsNkJBQVIsQ0FEWixDQUFBOztBQUFBLEVBRUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHNDQUFSLENBRm5CLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUVJO0FBQUEsSUFBQSxNQUFBLEVBQVEsRUFBUjtBQUFBLElBQ0EsZ0JBQUEsRUFBa0IsSUFEbEI7QUFHQTtBQUFBOztPQUhBO0FBQUEsSUFNQSxTQUFBLEVBQVcsU0FBQSxHQUFBO0FBRVAsTUFBQSxJQUFDLENBQUEsTUFBTyxDQUFBLDRCQUFBLENBQVIsR0FBd0M7QUFBQSxRQUNwQyxTQUFBLEVBQVcsa0NBRHlCO09BQXhDLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxNQUFPLENBQUEsVUFBQSxDQUFSLEdBQXNCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixtQ0FBaEIsQ0FKdEIsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLE1BQU8sQ0FBQSxLQUFBLENBQVIsR0FBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDhCQUFoQixDQUxqQixDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsTUFBTyxDQUFBLFVBQUEsQ0FBUixHQUFzQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IscUNBQWhCLENBTnRCLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxNQUFPLENBQUEsVUFBQSxDQUFSLEdBQXNCLElBQUksQ0FBQyxNQUFN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

//# sourceURL=/home/champ/.atom/packages/atom-autocomplete-php/lib/config.coffee
